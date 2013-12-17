/* jshint node: true */
'use strict';

var Writable = require('stream').Writable;
var util = require('util');

function FileWriteStream() {
  if (! (this instanceof FileWriteStream)) {
    return new FileWriteStream(file);
  }

  // inherit readable
  Writable.call(this, {
    decodeStrings: false,
    objectMode: true
  });

  // create the internal buffers storage
  this._buffers = [];

  // initialise the file to null
  this.file = null;
  this.once('finish', this._createFile.bind(this));
}

util.inherits(FileWriteStream, Writable);
module.exports = FileWriteStream;

FileWriteStream.prototype._createFile = function() {
  // console.log('captured finish, creating file');
  this.file = new Blob(this._buffers);
};

FileWriteStream.prototype._write = function(chunk, encoding, callback) {
  // collect the chunks
  this._buffers.push(new Uint8Array(chunk));
  callback();
};