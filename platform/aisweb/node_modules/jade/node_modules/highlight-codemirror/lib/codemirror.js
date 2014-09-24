// CodeMirror is the only global var we claim
module.exports = function() {
  "use strict";
  var CodeMirror = {};
  // UPDATING
  CodeMirror.changeEnd = function(change) {
    if (!change.text) return change.to;
    return Pos(change.from.line + change.text.length - 1, lst(change.text).length + (1 == change.text.length ? change.from.ch : 0));
  };
  // POSITION OBJECT
  function Pos(line, ch) {
    if (!(this instanceof Pos)) return new Pos(line, ch);
    this.line = line;
    this.ch = ch;
  }
  CodeMirror.Pos = Pos;
  // OPTION DEFAULTS
  CodeMirror.optionHandlers = {};
  // The default configuration options.
  CodeMirror.defaults = {};
  CodeMirror.Init = {
    toString: function() {
      return "CodeMirror.Init";
    }
  };
  // MODE DEFINITION AND QUERYING
  // Known modes, by name and by MIME
  var modes = CodeMirror.modes = {}, mimeModes = CodeMirror.mimeModes = {};
  CodeMirror.defineMode = function(name, mode) {
    CodeMirror.defaults.mode || "null" == name || (CodeMirror.defaults.mode = name);
    if (arguments.length > 2) {
      mode.dependencies = [];
      for (var i = 2; i < arguments.length; ++i) mode.dependencies.push(arguments[i]);
    }
    modes[name] = mode;
  };
  CodeMirror.defineMIME = function(mime, spec) {
    mimeModes[mime] = spec;
  };
  CodeMirror.resolveMode = function(spec) {
    if ("string" == typeof spec && mimeModes.hasOwnProperty(spec)) spec = mimeModes[spec]; else if (spec && "string" == typeof spec.name && mimeModes.hasOwnProperty(spec.name)) {
      var found = mimeModes[spec.name];
      spec = createObj(found, spec);
      spec.name = found.name;
    } else if ("string" == typeof spec && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) return CodeMirror.resolveMode("application/xml");
    return "string" == typeof spec ? {
      name: spec
    } : spec || {
      name: "null"
    };
  };
  CodeMirror.getMode = function(options, spec) {
    var spec = CodeMirror.resolveMode(spec);
    var mfactory = modes[spec.name];
    if (!mfactory) return CodeMirror.getMode(options, "text/plain");
    var modeObj = mfactory(options, spec);
    if (modeExtensions.hasOwnProperty(spec.name)) {
      var exts = modeExtensions[spec.name];
      for (var prop in exts) {
        if (!exts.hasOwnProperty(prop)) continue;
        modeObj.hasOwnProperty(prop) && (modeObj["_" + prop] = modeObj[prop]);
        modeObj[prop] = exts[prop];
      }
    }
    modeObj.name = spec.name;
    return modeObj;
  };
  CodeMirror.defineMode("null", function() {
    return {
      token: function(stream) {
        stream.skipToEnd();
      }
    };
  });
  CodeMirror.defineMIME("text/plain", "null");
  var modeExtensions = CodeMirror.modeExtensions = {};
  CodeMirror.extendMode = function(mode, properties) {
    var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : modeExtensions[mode] = {};
    copyObj(properties, exts);
  };
  // EXTENSIONS
  CodeMirror.defineExtension = function() {};
  CodeMirror.defineDocExtension = function() {};
  var initHooks = [];
  CodeMirror.defineInitHook = function(f) {
    initHooks.push(f);
  };
  var helpers = CodeMirror.helpers = {};
  CodeMirror.registerHelper = function(type, name, value) {
    helpers.hasOwnProperty(type) || (helpers[type] = CodeMirror[type] = {});
    helpers[type][name] = value;
  };
  // UTILITIES
  CodeMirror.isWordChar = isWordChar;
  // MODE STATE HANDLING
  // Utility functions for working with state. Exported because modes
  // sometimes need to do this.
  function copyState(mode, state) {
    if (state === !0) return state;
    if (mode.copyState) return mode.copyState(state);
    var nstate = {};
    for (var n in state) {
      var val = state[n];
      val instanceof Array && (val = val.concat([]));
      nstate[n] = val;
    }
    return nstate;
  }
  CodeMirror.copyState = copyState;
  function startState(mode, a1, a2) {
    return mode.startState ? mode.startState(a1, a2) : !0;
  }
  CodeMirror.startState = startState;
  CodeMirror.innerMode = function(mode, state) {
    for (;mode.innerMode; ) {
      var info = mode.innerMode(state);
      if (!info || info.mode == mode) break;
      state = info.state;
      mode = info.mode;
    }
    return info || {
      mode: mode,
      state: state
    };
  };
  // STRING STREAM
  // Fed to the mode parsers, provides helper functions to make
  // parsers more succinct.
  // The character stream used by a mode's parser.
  function StringStream(string, tabSize) {
    this.pos = this.start = 0;
    this.string = string;
    this.tabSize = tabSize || 8;
    this.lastColumnPos = this.lastColumnValue = 0;
  }
  StringStream.prototype = {
    eol: function() {
      return this.pos >= this.string.length;
    },
    sol: function() {
      return 0 == this.pos;
    },
    peek: function() {
      return this.string.charAt(this.pos) || void 0;
    },
    next: function() {
      if (this.pos < this.string.length) return this.string.charAt(this.pos++);
    },
    eat: function(match) {
      var ch = this.string.charAt(this.pos);
      if ("string" == typeof match) var ok = ch == match; else var ok = ch && (match.test ? match.test(ch) : match(ch));
      if (ok) {
        ++this.pos;
        return ch;
      }
    },
    eatWhile: function(match) {
      var start = this.pos;
      for (;this.eat(match); ) ;
      return this.pos > start;
    },
    eatSpace: function() {
      var start = this.pos;
      for (;/[\s\u00a0]/.test(this.string.charAt(this.pos)); ) ++this.pos;
      return this.pos > start;
    },
    skipToEnd: function() {
      this.pos = this.string.length;
    },
    skipTo: function(ch) {
      var found = this.string.indexOf(ch, this.pos);
      if (found > -1) {
        this.pos = found;
        return !0;
      }
    },
    backUp: function(n) {
      this.pos -= n;
    },
    column: function() {
      if (this.lastColumnPos < this.start) {
        this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
        this.lastColumnPos = this.start;
      }
      return this.lastColumnValue;
    },
    indentation: function() {
      return countColumn(this.string, null, this.tabSize);
    },
    match: function(pattern, consume, caseInsensitive) {
      if ("string" != typeof pattern) {
        var match = this.string.slice(this.pos).match(pattern);
        if (match && match.index > 0) return null;
        match && consume !== !1 && (this.pos += match[0].length);
        return match;
      }
      var cased = function(str) {
        return caseInsensitive ? str.toLowerCase() : str;
      };
      var substr = this.string.substr(this.pos, pattern.length);
      if (cased(substr) == cased(pattern)) {
        consume !== !1 && (this.pos += pattern.length);
        return !0;
      }
    },
    current: function() {
      return this.string.slice(this.start, this.pos);
    }
  };
  CodeMirror.StringStream = StringStream;
  function detachMarkedSpans(line) {
    var spans = line.markedSpans;
    if (!spans) return;
    for (var i = 0; i < spans.length; ++i) spans[i].marker.detachLine(line);
    line.markedSpans = null;
  }
  function cleanUpLine(line) {
    line.parent = null;
    detachMarkedSpans(line);
  }
  function LeafChunk(lines) {
    this.lines = lines;
    this.parent = null;
    for (var i = 0, e = lines.length, height = 0; e > i; ++i) {
      lines[i].parent = this;
      height += lines[i].height;
    }
    this.height = height;
  }
  LeafChunk.prototype = {
    chunkSize: function() {
      return this.lines.length;
    },
    removeInner: function(at, n) {
      for (var i = at, e = at + n; e > i; ++i) {
        var line = this.lines[i];
        this.height -= line.height;
        cleanUpLine(line);
        signalLater(line, "delete");
      }
      this.lines.splice(at, n);
    },
    collapse: function(lines) {
      lines.splice.apply(lines, [ lines.length, 0 ].concat(this.lines));
    },
    insertInner: function(at, lines, height) {
      this.height += height;
      this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
      for (var i = 0, e = lines.length; e > i; ++i) lines[i].parent = this;
    },
    iterN: function(at, n, op) {
      for (var e = at + n; e > at; ++at) if (op(this.lines[at])) return !0;
    }
  };
  function BranchChunk(children) {
    this.children = children;
    var size = 0, height = 0;
    for (var i = 0, e = children.length; e > i; ++i) {
      var ch = children[i];
      size += ch.chunkSize();
      height += ch.height;
      ch.parent = this;
    }
    this.size = size;
    this.height = height;
    this.parent = null;
  }
  BranchChunk.prototype = {
    chunkSize: function() {
      return this.size;
    },
    removeInner: function(at, n) {
      this.size -= n;
      for (var i = 0; i < this.children.length; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (sz > at) {
          var rm = Math.min(n, sz - at), oldHeight = child.height;
          child.removeInner(at, rm);
          this.height -= oldHeight - child.height;
          if (sz == rm) {
            this.children.splice(i--, 1);
            child.parent = null;
          }
          if (0 == (n -= rm)) break;
          at = 0;
        } else at -= sz;
      }
      if (this.size - n < 25) {
        var lines = [];
        this.collapse(lines);
        this.children = [ new LeafChunk(lines) ];
        this.children[0].parent = this;
      }
    },
    collapse: function(lines) {
      for (var i = 0, e = this.children.length; e > i; ++i) this.children[i].collapse(lines);
    },
    insertInner: function(at, lines, height) {
      this.size += lines.length;
      this.height += height;
      for (var i = 0, e = this.children.length; e > i; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (sz >= at) {
          child.insertInner(at, lines, height);
          if (child.lines && child.lines.length > 50) {
            for (;child.lines.length > 50; ) {
              var spilled = child.lines.splice(child.lines.length - 25, 25);
              var newleaf = new LeafChunk(spilled);
              child.height -= newleaf.height;
              this.children.splice(i + 1, 0, newleaf);
              newleaf.parent = this;
            }
            this.maybeSpill();
          }
          break;
        }
        at -= sz;
      }
    },
    maybeSpill: function() {
      if (this.children.length <= 10) return;
      var me = this;
      do {
        var spilled = me.children.splice(me.children.length - 5, 5);
        var sibling = new BranchChunk(spilled);
        if (me.parent) {
          me.size -= sibling.size;
          me.height -= sibling.height;
          var myIndex = indexOf(me.parent.children, me);
          me.parent.children.splice(myIndex + 1, 0, sibling);
        } else {
          // Become the parent node
          var copy = new BranchChunk(me.children);
          copy.parent = me;
          me.children = [ copy, sibling ];
          me = copy;
        }
        sibling.parent = me.parent;
      } while (me.children.length > 10);
      me.parent.maybeSpill();
    },
    iterN: function(at, n, op) {
      for (var i = 0, e = this.children.length; e > i; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (sz > at) {
          var used = Math.min(n, sz - at);
          if (child.iterN(at, used, op)) return !0;
          if (0 == (n -= used)) break;
          at = 0;
        } else at -= sz;
      }
    }
  };
  // The Doc methods that should be available on CodeMirror instances
  "iter insert remove copy getEditor".split(" ");
  function e_preventDefault(e) {
    e.preventDefault ? e.preventDefault() : e.returnValue = !1;
  }
  function e_stopPropagation(e) {
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0;
  }
  function e_stop(e) {
    e_preventDefault(e);
    e_stopPropagation(e);
  }
  CodeMirror.e_stop = e_stop;
  CodeMirror.e_preventDefault = e_preventDefault;
  CodeMirror.e_stopPropagation = e_stopPropagation;
  // EVENT HANDLING
  function on(emitter, type, f) {
    if (emitter.addEventListener) emitter.addEventListener(type, f, !1); else if (emitter.attachEvent) emitter.attachEvent("on" + type, f); else {
      var map = emitter._handlers || (emitter._handlers = {});
      var arr = map[type] || (map[type] = []);
      arr.push(f);
    }
  }
  function off(emitter, type, f) {
    if (emitter.removeEventListener) emitter.removeEventListener(type, f, !1); else if (emitter.detachEvent) emitter.detachEvent("on" + type, f); else {
      var arr = emitter._handlers && emitter._handlers[type];
      if (!arr) return;
      for (var i = 0; i < arr.length; ++i) if (arr[i] == f) {
        arr.splice(i, 1);
        break;
      }
    }
  }
  function signal(emitter, type) {
    var arr = emitter._handlers && emitter._handlers[type];
    if (!arr) return;
    var args = Array.prototype.slice.call(arguments, 2);
    for (var i = 0; i < arr.length; ++i) arr[i].apply(null, args);
  }
  var delayedCallbacks, delayedCallbackDepth = 0;
  function signalLater(emitter, type) {
    var arr = emitter._handlers && emitter._handlers[type];
    if (!arr) return;
    var args = Array.prototype.slice.call(arguments, 2);
    if (!delayedCallbacks) {
      ++delayedCallbackDepth;
      delayedCallbacks = [];
      setTimeout(fireDelayed, 0);
    }
    function bnd(f) {
      return function() {
        f.apply(null, args);
      };
    }
    for (var i = 0; i < arr.length; ++i) delayedCallbacks.push(bnd(arr[i]));
  }
  function fireDelayed() {
    --delayedCallbackDepth;
    var delayed = delayedCallbacks;
    delayedCallbacks = null;
    for (var i = 0; i < delayed.length; ++i) delayed[i]();
  }
  CodeMirror.on = on;
  CodeMirror.off = off;
  CodeMirror.signal = signal;
  // Returned or thrown by various protocols to signal 'I'm not
  // handling this'.
  CodeMirror.Pass = {
    toString: function() {
      return "CodeMirror.Pass";
    }
  };
  function Delayed() {
    this.id = null;
  }
  Delayed.prototype = {
    set: function(ms, f) {
      clearTimeout(this.id);
      this.id = setTimeout(f, ms);
    }
  };
  // Counts the column offset in a string, taking tabs into account.
  // Used mostly to find indentation.
  function countColumn(string, end, tabSize, startIndex, startValue) {
    if (null == end) {
      end = string.search(/[^\s\u00a0]/);
      -1 == end && (end = string.length);
    }
    for (var i = startIndex || 0, n = startValue || 0; end > i; ++i) "	" == string.charAt(i) ? n += tabSize - n % tabSize : ++n;
    return n;
  }
  CodeMirror.countColumn = countColumn;
  function lst(arr) {
    return arr[arr.length - 1];
  }
  function indexOf() {
    return -1;
  }
  function createObj(base, props) {
    function Obj() {}
    Obj.prototype = base;
    var inst = new Obj();
    props && copyObj(props, inst);
    return inst;
  }
  function copyObj(obj, target) {
    target || (target = {});
    for (var prop in obj) obj.hasOwnProperty(prop) && (target[prop] = obj[prop]);
    return target;
  }
  var nonASCIISingleCaseWordChar = /[\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
  function isWordChar(ch) {
    return /\w/.test(ch) || ch > "" && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
  }
  function getRect(node) {
    return node.getBoundingClientRect();
  }
  CodeMirror.replaceGetRect = function(f) {
    getRect = f;
  };
  // See if "".split is the broken IE version, if so, provide an
  // alternative way to split lines.
  var splitLines = 3 != "\n\nb".split(/\n/).length ? function(string) {
    var pos = 0, result = [], l = string.length;
    for (;l >= pos; ) {
      var nl = string.indexOf("\n", pos);
      -1 == nl && (nl = string.length);
      var line = string.slice(pos, "\r" == string.charAt(nl - 1) ? nl - 1 : nl);
      var rt = line.indexOf("\r");
      if (-1 != rt) {
        result.push(line.slice(0, rt));
        pos += rt + 1;
      } else {
        result.push(line);
        pos = nl + 1;
      }
    }
    return result;
  } : function(string) {
    return string.split(/\r\n?|\n/);
  };
  CodeMirror.splitLines = splitLines;
  // THE END
  CodeMirror.version = "3.20.0";
  return CodeMirror;
}();