/* jshint node: true */
/* global Event: false */

var detect = require('./detect');
var variants = ['Fullscreen', 'FullScreen'];
var fullscreenFn;

while (variants.length) {
  fullscreenFn = detect.call(document.body, 'request' + variants.shift());
  if (fullscreenFn) {
    break;
  }
}

/**
  ## fullscreen

  If the [Fullscreen API](http://caniuse.com/#feat=fullscreen) is available
  this will allow you to fullscreen either the document or a target element.

  ```js
  var fullscreen = require('feature/fullscreen');
  
  if (fullscreen) {
    fullscreen(); // you can pass an element to fullscreen here
  }
  ```

  Additionally, the function can be passed directly to an event handler and 
  the function will adjust :)

  ```js
  var fullscreen = require('feature/fullscreen');

  document.getElementById('makeMeFS').addEventListener('click', fullscreen);
  ```
**/
module.exports = fullscreenFn && function(target) {
  // if this has been called in response to a browser event
  // go get the event target
  if (target instanceof Event) {
    target = target.target;
  }

  // TODO: pass on args?
  fullscreenFn.call(target || document.body);
};