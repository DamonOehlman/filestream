/* jshint node: true */
'use strict';

var Writable = require('stream').Writable;
var util = require('util');
var toBuffer = require('typedarray-to-buffer');

function FileWriteStream(callback) {
  if (! (this instanceof FileWriteStream)) {
    return new FileWriteStream(callback);
  }

  // inherit readable
  Writable.call(this, {
    decodeStrings: false,
    objectMode: true
  });

  // create the internal buffers storage
  this._buffers = [];
  this._bytesreceived = 0;
  this.callback = callback;
}

util.inherits(FileWriteStream, Writable);
module.exports = FileWriteStream;

FileWriteStream.prototype._createFile = function() {
  var blob = new Blob(this._buffers, {
    type: this.metadata && this.metadata.type
  });

  // TODO: create a File instead of sending the blob...
  // currently getting illegal constructor errors when attempting
  // see: https://code.google.com/p/chromium/issues/detail?id=164933
  // also see spec: http://dev.w3.org/2006/webapi/FileAPI/#file-constructor
  if (typeof this.callback == 'function') {
    this.callback(blob, this.metadata);
  }

  this.emit('file', blob, this.metadata);

  // reset the buffers and metadata
  this._buffers = [];
  this.metadata = null;
  this._bytesreceived = 0;
};

FileWriteStream.prototype._write = function(chunk, encoding, callback) {
  var parts = typeof chunk == 'string' && chunk.split('|');
  var data = chunk instanceof Buffer ? chunk : toBuffer(chunk);

  // if this is the metadata line, then update our metadata
  if (parts && parts[0] === 'meta') {
    try {
      this.metadata = JSON.parse(parts[1]);
    }
    catch (e) {
      this.emit('error', 'Could not deserialize metadata');
    }
  }

  // if we have valid data, then process
  if (Buffer.isBuffer(data)) {
    console.log(data);
    this._bytesreceived += chunk.length;
    this._buffers.push(chunk);
  }

  if (this.metadata && this._bytesreceived >= this.metadata.size) {
    this._createFile();
  }

  callback();
};
