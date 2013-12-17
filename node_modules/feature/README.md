# feature

Feature-detection at a highly targeted level.


[![NPM](https://nodei.co/npm/feature.png)](https://nodei.co/npm/feature/)


[![browser support](https://ci.testling.com/DamonOehlman/feature.png)](https://ci.testling.com/DamonOehlman/feature)


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

## css(prop)

Test for the prescence of the specified CSS property (in all it's 
possible browser prefixed variants)

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
