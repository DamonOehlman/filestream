/* jshint node: true */
/* global document: false */

'use strict';

var el = document.createElement('canvas');

module.exports = el &&
  (!! (el.getContext && el.getContext('2d'))) &&
  document.createElement('canvas');