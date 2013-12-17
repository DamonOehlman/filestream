/* jshint node: true */

'use strict';

/**
## detect

The core functionality of the feature module is powered by the `detect`
function, which can be imported like so:

```js
var detect = require('feature/detect');
```

Once you have the detect function available you can do nifty things like
detect whether your browser supports `requestAnimationFrame`:

```js
var raf = detect('requestAnimationFrame');
```

If it does then `raf` will be a function that is equivalent to the browser
prefixed requestAnimationFrame function (e.g. webkitRequestAnimationFrame).
It should be noted that feature does nothing to try and polyfill things that
don't exist, that is left to you to implement yourself.
**/
module.exports = function(target, prefixes) {
  var prefixIdx;
  var prefix;
  var testName;
  var scope = this || window;

  // initialise to default prefixes
  // (reverse order as we use a decrementing for loop)
  prefixes = (prefixes || ['ms', 'o', 'moz', 'webkit']).concat('');

  // iterate through the prefixes and return the class if found in global
  for (prefixIdx = prefixes.length; prefixIdx--; ) {
    prefix = prefixes[prefixIdx];

    // construct the test class name
    // if we have a prefix ensure the target has an uppercase first character
    // such that a test for getUserMedia would result in a search for 
    // webkitGetUserMedia
    testName = prefix + (prefix ?
      target.charAt(0).toUpperCase() + target.slice(1) :
      target);

    if (typeof scope[testName] == 'function') {
      return scope[testName];
    }
  }
};