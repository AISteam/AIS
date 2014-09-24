# highlight-codemirror

A syntax highlighter built to run in node and consume CodeMirror modes.

[![Build Status](https://travis-ci.org/ForbesLindesay/highlight-codemirror.png?branch=master)](https://travis-ci.org/ForbesLindesay/highlight-codemirror)
[![Dependency Status](https://gemnasium.com/ForbesLindesay/highlight-codemirror.png)](https://gemnasium.com/ForbesLindesay/highlight-codemirror)
[![NPM version](https://badge.fury.io/js/highlight-codemirror.png)](http://badge.fury.io/js/highlight-codemirror)

## API

### CodeMirror.loadMode(name) / CodeMirror.loadMode(path)

Load a code mirror mode that expects a `CodeMirror` global.

### CodeMirror.highlight(string, options)

Highlight some code and return the resulting html.

## Example

```javascript
var CodeMirror = require('highlight-codemirror');

CodeMirror.loadMode('javascript');
var html = CodeMirror.highlight('assert(typeof "foo" === "string")', {mode: 'javascript'});
```

## License

MIT