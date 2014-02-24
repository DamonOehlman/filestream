/* jshint node: true */
'use strict';

var Readable = require('stream').Readable;
var util = require('util');
var reExtension = /^.*\.(\w+)$/;
var mime = require('mime-component');


function FileReadStream(file) {
  if (! (this instanceof FileReadStream)) {
    return new FileReadStream(file);
  }

  // inherit readable
  Readable.call(this, {
    objectMode: true
  });

  // save the read offset
  this._offset = 0;
  this._eof = false;

  // initialise the metadata
  this._metasent = false;
  this._metadata = {
    name: file.name,
    size: file.size,
    type: mime.lookup(file.name.replace(reExtension, '$1'))
  };

  // create the reader
  this.reader = new FileReader();
  this.reader.onprogress = this._handleProgress.bind(this);
  this.reader.onload = this._handleLoad.bind(this);
  this.reader.readAsArrayBuffer(file);
}

util.inherits(FileReadStream, Readable);
module.exports = FileReadStream;

FileReadStream.prototype._read = function(bytes) {
  var stream = this;
  var reader = this.reader;

  function checkBytes() {
    var startOffset = stream._offset;
    var endOffset = stream._offset + bytes;
    var availableBytes = reader.result && reader.result.byteLength;
    var done = reader.readyState === 2 && endOffset > availableBytes;
    var chunk;

    // console.log('checking bytes available, need: ' + endOffset + ', got: ' + availableBytes);
    if (availableBytes && (done || availableBytes > endOffset)) {
      // get the data chunk
      chunk = new Uint8Array(
        reader.result,
        startOffset,
        Math.min(bytes, reader.result.byteLength - startOffset)
      );

      // update the stream offset
      stream._offset = startOffset + chunk.length;

      // send the chunk
      // console.log('sending chunk, ended: ', chunk.length === 0);
      stream._eof = chunk.length === 0;
      return stream.push(chunk.length > 0 ? new Buffer(chunk) : null);
    }

    stream.once('readable', checkBytes);
  }

  if (! this._metasent) {
    this._metasent = true;
    return this.push('meta|' + JSON.stringify(this._metadata));
  }

  checkBytes();
};

FileReadStream.prototype._handleLoad = function(evt) {
  this.emit('readable');
};

FileReadStream.prototype._handleProgress = function(evt) {
  this.emit('readable');
};