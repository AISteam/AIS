# handle

Handle events on elements

[![Dependency Status](https://gemnasium.com/ForbesLindesay/handle.png)](https://gemnasium.com/ForbesLindesay/handle)
[![NPM version](https://badge.fury.io/js/handle.png)](http://badge.fury.io/js/handle)

[![browser support](https://ci.testling.com/ForbesLindesay/handle.png)](https://ci.testling.com/ForbesLindesay/handle)

## Installation

    npm install handle

## API

### `handle(element, event, fn [, capture])`

Handle `event` on `element` using `fn`.  It returns a function that can be called to stop listening.  e.g. to build `once` you could write:

```js
var handle = require('handle');

function once(element, event, fn, capture) {
  var dispose = handle(element, event, function (el, event) {
    dispose();
    fn(el, event);
  }, capture);
}
```

Typical usage might look like:

```js
var handle = require('handle');

handle(document.getElementById('my-button'), 'click', function (button, e) {
  e.preventDefault();
  // do something
});
```

### `handle(elements, event, fn [, capture])`

You can handle the same event on a whole list of elements in one go.  This does not need to be an array, it just needs to have a `.length` property that is a number and have indexed values.  e.g.


```js
var handle = require('handle');

handle(document.querySelector('[data-action="do-something"]'), 'click', function (button, e) {
  e.preventDefault();
  // do something
});
```

It too returns a `dispose` funciton.

### `handle(selector, event, fn [, capture])`

This works just like jQuery's `$(document.body).delecate(selector, event, function (e) { fn(this, e) })`.  It too returns a `dispose` function.

The advantages/disadvantages of using this method are:

 - It will still capture the event if the element matching selector is added to the DOM after `handle` is called.
 - It captures the event later (i.e. after those handlers that were attached directly to elements lower in the DOM chain)
 - It only binds to one element, so can have better performance, but it must check every event for a match, so can have worse performance

e.g.

```js
var handle = require('handle');

handle('[data-action="do-something"]', 'click', function (button, e) {
  e.preventDefault();
  // do something
});
```

If you want to delegate from something other than `document.body` you can select a start element via the `.on` method:

```js
var handle = require('handle').on(document.getElementById('hideable-list'));

handle('li', 'click', function (li, e) {
  e.preventDefault();
  li.style.visibility = 'hidden';
});
```

### `handle.once(element|elements|selector, event [, capture])`

Return a promise that is resolved with the event args once the event is fired.  `e.preventDefault()` is also called since it must be called within the same turn to work.

## Running Tests

Tests can be easilly run locally in the browser of your choice, and have passed if it ends with `# ok`.  They are also run on testling-ci when pushed to the repository:

```
npm install
npm test
```

## License

  MIT