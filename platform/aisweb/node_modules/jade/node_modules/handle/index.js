'use strict';

var inspect = require('util').inspect;
var matches = require('matches-selector');
var Promise = require('promise');

module.exports = on(document.body);
module.exports.on = on;

/**
 * Get a handle function for a given top
 *
 * @param {Element} top The element to begin delegating from
 * @return {Function}
 * @api public
 */
function on(top) {
  top = typeof top === 'string' ? document.querySelector(top) : top;
  var h = handle.bind(this, top);
  h.once = once.bind(this, top);
  return h;
}

/**
 * Bind `element` event `type` to `fn`.
 *
 * @param {Element} top The element to begin delegating from
 * @param {Element|Array|String} element An element, list of elements or a selector string
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */
function handle(top, element, type, fn, capture) {
  if (!element || !(typeof element === 'string' || typeof element.length === 'number' || typeof element.addEventListener === 'function')) {
    throw new TypeError('Cannot bind event ' + inspect(type) + ' to ' + inspect(element));
  }
  if (typeof type !== 'string') throw new TypeError('Event type must be a string, e.g. "click", not ' + inspect(type));
  if (typeof fn !== 'function') throw new TypeError('`fn` (the function to call when the event is triggered) must be a function, not ' + inspect(fn));
  if (capture !== undefined && capture !== false && capture !== true) {
    throw new TypeError('`capture` must be `undefined` (defaults to `false`), `false` or `true`, not ' + inspect(capture));
  }

  if (typeof element === 'string') {
    return handleElement(top, type, function (body, e) {
      var target = findMatch(body, e.target, element);
      e.delegateTarget = target;
      if (target) fn(target, e);
    }, capture);
  } else if (typeof element.addEventListener !== 'function' && typeof element.length === 'number') {
    return handleElements(element, type, fn, capture);
  } else {
    return handleElement(element, type, fn, capture);
  }
}


/**
 * Bind `elements` event `type` to `fn`.
 *
 * @param {Element} elements
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */
function handleElements(elements, type, fn, capture) {
  if (!elements || typeof elements.length !== 'number') throw new TypeError('Cannot bind event ' + inspect(type) + ' to ' + inspect(elements));
  if (typeof type !== 'string') throw new TypeError('Event type must be a string, e.g. "click", not ' + inspect(type));
  if (typeof fn !== 'function') throw new TypeError('`fn` (the function to call when the event is triggered) must be a function, not ' + inspect(fn));
  if (capture !== undefined && capture !== false && capture !== true) {
    throw new TypeError('`capture` must be `undefined` (defaults to `false`), `false` or `true`, not ' + inspect(capture));
  }

  var handles = [];
  for (var i = 0; i < elements.length; i++) {
    handles.push(handleElement(elements[i], type, fn, capture));
  }
  return function dispose() {
    for (var i = 0; i < handles.length; i++) {
      handles[i]();
    }
  };
}

/**
 * Bind `element` event `type` to `fn`.
 *
 * @param {Element} element
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */
function handleElement(element, type, fn, capture) {
  if (!element || typeof element.addEventListener !== 'function') throw new TypeError('Cannot bind event ' + inspect(type) + ' to ' + inspect(element));
  if (typeof type !== 'string') throw new TypeError('Event type must be a string, e.g. "click", not ' + inspect(type));
  if (typeof fn !== 'function') throw new TypeError('`fn` (the function to call when the event is triggered) must be a function, not ' + inspect(fn));
  if (capture !== undefined && capture !== false && capture !== true) {
    throw new TypeError('`capture` must be `undefined` (defaults to `false`), `false` or `true`, not ' + inspect(capture));
  }

  function onEvent(e) {
    e.delegateTarget = element;
    return fn(element, e);
  }
  element.addEventListener(type, onEvent, capture || false);
  return element.removeEventListener.bind(element, type, onEvent, capture || false);
}

function once(top, element, type, capture) {
  return new Promise(function (resolve) {
    var dispose = handle(top, element, type, function (element, e) {
      e.preventDefault();
      dispose();
      resolve(e);
    }, capture);
  });
}

/**
 * Look for an element that is a child of top
 * and a parent of bottom (or bottom), that matches selector.
 *
 * @param {Element} top the parent node in which to search
 * @param {Element} bottom the starting place for the search
 * @param {String} selector a css query used to determine if a node matches
 * @return {Element|null}
 * @api private
 */
function findMatch(top, bottom, selector) {
  while (bottom != top && bottom) {
    if (matches(bottom, selector)) return bottom;
    bottom = bottom.parentElement;
  }
  if (bottom && matches(bottom, selector)) return bottom;
  return null;
}
