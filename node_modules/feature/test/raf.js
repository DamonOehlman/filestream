var raf = require('../animation-frame');
var test = require('tape');

test('requestAnimationFrame support test', function(t) {
  t.plan(1);
  raf(function() {
    t.pass('requestAnimationFrame successfully called');
  });
});