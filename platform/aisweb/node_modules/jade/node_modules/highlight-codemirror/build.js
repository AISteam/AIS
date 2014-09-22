'use strict';

var relative = require('path').relative;
var join = require('path').join;
var dirname = require('path').dirname;
var fs = require('fs');

var step = require('testit');
var npm = require('npm-fetch');
var unpack = require('tar-pack').unpack;
var mkdirp = require('mkdirp').sync;
var rimraf = require('rimraf').sync;
var UglifyJS = require('uglify-js');


step('cleanup', function (callback) {
  rimraf(__dirname + '/src');
  rimraf(__dirname + '/lib');
  mkdirp(__dirname + '/lib');
  npm('codemirror', '*').pipe(unpack(__dirname + '/src', callback));
}, '60 seconds');

step('get version', function () {
  var version = JSON.parse(read('./src/package.json')).version;
  var pkg = JSON.parse(read('./package.json'));
  pkg.version = version;
  write('./package.json', JSON.stringify(pkg, null, '  '));
});

step('plugins', function () {
  write('./lib/overlay.js', 'var CodeMirror = require("./codemirror.js");\n' + read('./src/addon/mode/overlay.js'));
});

step('generate codemirror', function () {
  var ast = UglifyJS.parse(read('./src/lib/codemirror.js'));
  ast.figure_out_scope();
  ast = ast.transform(new UglifyJS.TreeTransformer(function (node, descend) {

    // replace `window.CodeMirror` with `module.exports`
    var windowDotCodeMirror = {
      TYPE: 'Dot',
      property: 'CodeMirror',
      expression: {
        TYPE: 'SymbolRef',
        name: 'window',
        thedef: {
          global: true
        }
      }
    };
    if (match(node, windowDotCodeMirror)) {
      return make('Dot', {
        expression: make('SymbolRef', { name: 'module' }),
        property: 'exports'
      });
    }
    if (match(node, { TYPE: 'Defun', name: { TYPE: 'SymbolDefun', name: 'CodeMirror' } })) {
      return make('Var', {
        definitions: [
          make('VarDef', {
            name: make('SymbolVar', {name: 'CodeMirror'}),
            value: make('Object', {properties: []})
          })
        ]
      });
    }

    if (node.body && Array.isArray(node.body)) {
      node.body = node.body.filter(function (node) {
        return !match(node, {
          TYPE: 'Defun',
          argnames: contains({
            TYPE: 'SymbolFunarg',
            name: 'cm'
          })
        }) && !match(node, {
          TYPE: 'Defun',
          argnames: contains({
            TYPE: 'SymbolFunarg',
            name: 'doc'
          })
        });
      });
    }
  }, function (node) {
    if (node.body && Array.isArray(node.body)) {
      node.body = node.body.filter(function (node) {
        if (node instanceof UglifyJS.AST_Statement) {
          return includeStatementPost(node);
        } else {
          return true;
        }
      });
    }
  }));

  ast = compress(ast);

  console.dir(ast.globals.map(function (val, key) {
    return key;
  }))
  var stream = UglifyJS.OutputStream({
    indent_level: 2,
    beautify: true,
    comments: true
  });
  ast.print(stream);
  write('./lib/codemirror.js', stream.toString());
});

step('cleanup', function () {
  rimraf(__dirname + '/src');
}, '60 seconds');

function property(name) {
  return {
    TYPE: 'Dot',
    expression: {
      TYPE: 'SymbolRef',
      name: 'CodeMirror'
    },
    property: name
  };
}
var toRemove = [
  //globals
  'navigator',
  'document',
  'window',
  //CodeMirror.
  'prototype',
  'lookupKey',
  'isModifierKey',
  'keyName',
  'fromTextArea',
  'defineOption',
  'commands',
  'keyNames',
  //var
  'commadns',
  'keyMap',
  'option',
  'Doc',
  'LineWidget',
  'operation',
  'runInOp',
  'updateDisplay',
  'TextMarker',
  'opera_version',
  'ie_lt9',
  'elt',
  'bidiOrdering',
  'eventMixin',
  'SharedTextMarker',
  'Line'
];

function includeStatement(node, visited) {
  if (match(node, {TYPE: 'Var'}) && node.definitions.length === 1) {
    if (!toRemove.every(function (exclude) {
        return !match(node.definitions[0].name, exclude);
      })) {
      return false;
    }
  }

  if (typeof node === 'string') {
    return toRemove.indexOf(node) === -1;
  }


  if (node.TYPE === 'Dot' && node.expression.TYPE === 'SymbolRef' && node.expression.name === 'CodeMirror') {
    return includeStatement(node.property);
  }
  switch (node.TYPE) {
    case 'Defun':
      return includeStatement(node.name, visited);
    case 'SimpleStatement':
      return includeStatement(node.body, visited);
    case 'Call':
      return includeStatement(node.expression, visited);
    case 'Assign':
      return includeStatement(node.left, visited);
    case 'Dot':
    case 'Sub':
      return includeStatement(node.expression, visited);
    case 'SymbolRef':
    case 'SymbolVar':
    case 'SymbolDefun':
      if (node.thedef && node.thedef.isDestroyed) return false;
      return includeStatement(node.name, visited);
    case 'Var':
      return node.definitions.some(includeStatement);
    case 'VarDef':
      return includeStatement(node.name, visited);
  }
  return true;
}
function includeStatementPost(node, visited) {
  visited = visited || [];
  if (visited.indexOf(node) !== -1) return true;
  visited.push(node);

  if (!node || typeof node !== 'object' || typeof node.TYPE !== 'string') {
    return true;
  }
  var including = true;

  if (!includeStatement(node, visited)) {
    return false;
  }

  for (var key in node) {
    if (key === 'definitions' || key === 'args') {
      including = including && node[key].every(function (child) {
        return includeStatementPost(child, visited);
      });
    } else {
      including = including && includeStatementPost(node[key], visited);
    }
  }
  if (!including && node.TYPE === 'VarDef' && node.name.TYPE === 'SymbolVar' && toRemove.indexOf(node.name.name) === -1) {
    node.name.thedef.isDestroyed = true;
    //toRemove.push(node.name.name);
  }
  return including;
}

function compress(ast) {
  var global_defs = {};
  for (var i = 0; i < toRemove.length; i++) {
    global_defs[toRemove[i]] = undefined;
  };
  global_defs.window = undefined;
  global_defs.document = undefined;
  ast.figure_out_scope();
  ast = ast.transform(UglifyJS.Compressor({
    sequences: false,
    unsafe: false, //?
    hoist_funs: false,
    hoist_vars: false,
    if_return: false,
    join_vars: false,
    cascade: true //?
  }));
  ast.figure_out_scope();
  return ast;
}

function read(path) {
  return fs.readFileSync(join(__dirname, path), 'utf8');
}
function write(path, text) {
  return fs.writeFileSync(join(__dirname, path), text, 'utf8');
}
function match(left, right) {
  if (left === right) return true;
  if (left === null || typeof left !== 'object') return false;
  if (right === null || typeof right !== 'object') return false;
  if (right['$$contains-operation$$'] === true) {
    if (!Array.isArray(left)) return false;
    return left.some(function (value) {
      return match(value, right.toMatch);
    });
  }
  var keys = Object.keys(right);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!match(left[key], right[key])) return false;
  }
  return true;
}
function contains(toMatch) {
  return {'$$contains-operation$$': true, toMatch: toMatch};
}
function make(type, properties) {
  return new UglifyJS['AST_' + type](properties);
}