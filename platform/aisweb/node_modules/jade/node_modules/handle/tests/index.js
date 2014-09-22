'use strict';

var test = require('tape');
var handle = require('../');

var ul = document.createElement('ul');
ul.setAttribute('style', 'display: none;');
document.body.appendChild(ul);

function click(element) {
  try {
    var event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  } catch (ex) {
    var event = document.createEvent('MouseEvent');
    event.initEvent('click', true, true);
    element.dispatchEvent(event);
  }
}


test('handle(element, event, function)', function (t) {
  t.plan(4);
  var li = document.createElement('li');
  ul.appendChild(li);
  var disposeA = handle(li, 'click', function (el, e) {
    disposeA();
    t.equal(el, li, 'the element the event is bound to is the first argument: li');
    t.assert(typeof e.preventDefault === 'function', 'the second argument is the event args');
  });
  var disposeB = handle(ul, 'click', function (el, e) {
    disposeB();
    t.equal(el, ul, 'the element the event is bound to is the first argument: ul');
    t.assert(typeof e.preventDefault === 'function', 'the second argument is the event args');
    ul.removeChild(li);
  });
  click(li);
});

test('handle(elements, event, function)', function (t) {
  t.plan(6);
  var liA = document.createElement('li');
  ul.appendChild(liA);
  var liB = document.createElement('li');
  ul.appendChild(liB);
  var liC = document.createElement('li');
  ul.appendChild(liC);
  
  var i = 0;
  var list = {
    0: liA,
    1: liB,
    2: liC,
    length: 3
  };
  handle(list, 'click', function (element, e) {
    ul.removeChild(element);
    t.equal(element, list[i++], 'the element the event is bound to is the first argument: list[i++]');
    t.assert(typeof e.preventDefault === 'function', 'the second argument is the event args');
  });
  click(liA);
  click(liB);
  click(liC);
});

test('handle(selector, event, function)', function (t) {
  t.plan(4);
  var disposeA = handle('ul', 'click', function (element, e) {
    t.assert(element === ul, 'the element the event is bound to is the first argument: "ul"');
    t.assert(typeof e.preventDefault === 'function', 'the second argument is the event args');
    disposeA();
  });
  var disposeB = handle('ul > li', 'click', function (element, e) {
    t.assert(element === li, 'the element the event is bound to is the first argument: "ul > li"');
    t.assert(typeof e.preventDefault === 'function', 'the second argument is the event args');
    ul.removeChild(element);
    disposeB();
  });
  
  var li = document.createElement('li');
  ul.appendChild(li);
  click(li);
});

test('handle.on(top)(selector, event, function)', function (t) {
  t.plan(4);
  var li = document.createElement('li');
  ul.appendChild(li);
  var h = handle.on(li);
  h('ul', 'click', function (element, e) {
    t.fail('Should not have been triggered on the ul');
  });
  h('ul > li', 'click', function (element, e) {
    t.assert(element === li, 'the element the event is bound to is the first argument: "ul > li"');
    t.assert(typeof e.preventDefault === 'function', 'the second argument is the event args');
  });
  h('ul > li > button', 'click', function (element, e) {
    t.assert(element === btn, 'the element the event is bound to is the first argument: "ul > li > button"');
    t.assert(typeof e.preventDefault === 'function', 'the second argument is the event args');
    ul.removeChild(li);
  });

  var btn = document.createElement('button');
  li.appendChild(btn);
  click(btn);
});

test('handle.once(element, event) => Promise(e)', function (t) {
  t.plan(1);
  var li = document.createElement('li');
  ul.appendChild(li);
  handle.once(li, 'click').done(function (e) {
    t.assert(typeof e.preventDefault === 'function', 'the fulfilled value is the event args');
  });
  click(li);
});
