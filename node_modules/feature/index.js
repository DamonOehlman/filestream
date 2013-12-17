/* jshint node: true */

'use strict';

/**
  # feature

  Feature-detection at a highly targeted level.

  ## What about Modernizr?

  [Modernizr](https://github.com/Modernizr) is wonderful, no doubt about it.
  It is however, pretty massive and while it can be whittled down to a smaller
  size using customization from the download page, I'm just a bit too lazy 
  for that.  I would prefer
  to specify the feature detection I need in code using require statements
  (e.g. `require('feature/fullscreen')`) and have only the code required to
  detect that feature included.

  That's why.  It's purely selfish, and well you should feel free to keep
  on using Modernizr. I'm not going to judge you.

  ## Example Usage

  Do we have CSS transforms available?

  ```js
  var transform = require('feature/css')('transform');

  // check if transforms are available
  if (transform) {
      // if they are you can use the transform return value
      // (which is in fact a function)
      // to get the value and modify the transform value
      transform(testElement, 'scale(2.0, 2.0)');
  }
  ```

  Because of Browserify's excellent static analysis (powered by
  [esprima](https://github.com/ariya/esprima)), when `feature` is 
  used within an application in this way, only the targeted feature 
  detection is included in the resultant JS file.
**/

exports.detect = require('./detect');
exports.css = require('./css');