/* jshint node: true */
'use strict';

var Writable = require('stream').Writable;
var util = require('util');
var extend = require('extend.js');
var toBuffer = require('typedarray-to-buffer');

function FileWriteStream(callback, opts) {
  if (! (this instanceof FileWriteStream)) {
    return new FileWriteStream(callback, opts);
  }

  // inherit writable
  Writable.call(this, extend({
    decodeStrings: false,
    objectMode: true
  }, opts));

  // when the stream finishes create a file
  this.on('finish', this._createFile.bind(this));

  // create the internal buffers storage
  this._buffers = [];
  this._bytesreceived = 0;
  this.callback = callback;
}

util.inherits(FileWriteStream, Writable);
module.exports = FileWriteStream;

FileWriteStream.prototype._createFile = function() {
  var file;

  // if we have no buffers, then abort any processing
  if (this._buffers.length === 0) {
    return;
  }

  // create the new file
  file = this.metadata ?
    // if we have metadata, then create a file with name and metadata
    new File([new Blob(this._buffers)], this.metadata.name, this.metadata) :
    // otherwise, just create the file
    new File([new Blob(this._buffers)], '');

  if (typeof this.callback == 'function') {
    this.callback(file, this.metadata);
  }

  this.emit('file', file, this.metadata);

  // reset the buffers and metadata
  this._buffers = [];
  this.metadata = null;
  this._bytesreceived = 0;
};

FileWriteStream.prototype._write = function(chunk, encoding, callback) {
  var parts = typeof chunk == 'string' && chunk.split('|');
  var data = Buffer.isBuffer(chunk) ? chunk : toBuffer(chunk);

  // if this is the metadata line, then update our metadata
  if (parts && parts[0] === 'meta') {
    try {
      this.metadata = JSON.parse(parts[1]);
    }
    catch (e) {
      this.emit('error', 'Could not deserialize metadata');
    }

    return callback();
  }

  // if we have valid data, then process
  if (Buffer.isBuffer(data)) {
    this._bytesreceived += chunk.length;
    this._buffers.push(chunk);
  }

  if (this.metadata && this._bytesreceived >= this.metadata.size) {
    this._createFile();
  }

  callback();
};
