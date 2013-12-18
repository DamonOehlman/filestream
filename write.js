/* jshint node: true */
'use strict';

var Writable = require('stream').Writable;
var util = require('util');

function FileWriteStream() {
  if (! (this instanceof FileWriteStream)) {
    return new FileWriteStream();
  }

  // inherit readable
  Writable.call(this, {
    decodeStrings: false,
    objectMode: true
  });

  // create the internal buffers storage
  this._buffers = [];
  this._bytesreceived = 0;
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
  this.emit('file', blob, this.metadata);

  // reset the buffers and metadata
  this._buffers = [];
  this.metadata = null;
  this._bytesreceived = 0;
};

FileWriteStream.prototype._write = function(chunk, encoding, callback) {
  var parts = typeof chunk == 'string' && chunk.split('|');

  // if this is the metadata line, then update our metadata
  if (parts && parts[0] === 'meta') {
    try {
      this.metadata = JSON.parse(parts[1]);
    }
    catch (e) {
      this.emit('error', 'Could not deserialize metadata');
    }
  }
  else if (chunk instanceof Buffer) {
    this._bytesreceived += chunk.length;
    // console.log(this._bytesreceived, this.metadata.size)

    // collect the chunks
    this._buffers.push(new Uint8Array(chunk));

    if (this.metadata && this._bytesreceived >= this.metadata.size) {
      this._createFile();
    }
  }

  callback();
};