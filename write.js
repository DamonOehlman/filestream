var Writable = require('stream').Writable;
var inherits = require('inherits');
var extend = require('extend.js');
var toBuffer = require('typedarray-to-buffer');

function FileWriteStream(callback, opts) {
  if (! (this instanceof FileWriteStream)) {
    return new FileWriteStream(callback, opts);
  }

  // inherit writable
  Writable.call(this, extend({ decodeStrings: false }, opts));

  // when the stream finishes create a file
  this.on('finish', this._generateFile.bind(this));

  // create the internal buffers storage
  this._buffers = [];
  this._bytesreceived = 0;
  this.callback = callback;
}

inherits(FileWriteStream, Writable);
module.exports = FileWriteStream;

FileWriteStream.prototype._createFile = function() {
  // if we have no buffers, then abort any processing
  if (this._buffers.length === 0) {
    return;
  }

  return new File([new Blob(this._buffers)], '');
};

FileWriteStream.prototype._generateFile = function() {
  var file = this._createFile();

  if (file) {
    if (typeof this.callback == 'function') {
      this.callback(file);
    }

    this.emit('file', file);
  }

  // reset the buffers and counters
  this._buffers = [];
  this._bytesreceived = 0;
};

FileWriteStream.prototype._preprocess = function(data, callback) {
  // pass through the data
  callback(null, data);
};

FileWriteStream.prototype._write = function(chunk, encoding, callback) {
  var data = Buffer.isBuffer(chunk) ? chunk : toBuffer(chunk);
  var writeStream = this;

  this._preprocess(data, function(err, processed) {
    if (err) {
      return callback(err);
    }

    // if the incoming data has been passed through, then add to the bytes received buffer
    if (processed) {
      writeStream._bytesreceived += processed.length;
      writeStream._buffers.push(processed);
    }

    callback();
  });
};
