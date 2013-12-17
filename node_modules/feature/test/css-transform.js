var css = require('../css');
var test = require('tape');
var crel = require('crel');
var transform;
var el;

test('get a transform property mutator / accessor', function(t) {
  t.plan(1);
  transform = css('transform');
  t.ok(typeof transform == 'function', 'got the transform function');
});

test('create a test element', function(t) {
  t.plan(2);
  t.ok(el = crel('div'), 'created test element');

  // insert into the document
  document.body.appendChild(el);
  t.ok(el.parentNode, 'inserted');
});

test('get the transform value of the test element', function(t) {
  t.plan(1);
  console.log(transform(el));
  t.ok(transform(el) === 'none', 'got transform value');
});

test('set the transform value of the test element', function(t) {
  t.plan(1);
  transform(el, 'translateX(50px)');
  t.pass('set complete');
});

test('get the updated value of the test element', function(t) {
  var val;

  t.plan(1);
  val = transform(el);
  t.ok(
    val === 'translateX(50px)' || 
    val === 'matrix(1, 0, 0, 1, 50, 0)'
  , 'got expected value');
});

test('remove the test element', function(t) {
  t.plan(1);
  document.body.removeChild(el);
  t.ok(! el.parentNode, 'removed');
});
