/* global File */

const { Writable } = require('stream')
const { Buffer } = require('buffer')

class FileWriteStream extends Writable {
  constructor (callback, opts = {}) {
    // inherit writable
    super(Object.assign({ decodeStrings: false }, opts))

    this._bytesreceived = 0
    // create the internal buffers storage
    this._buffers = []
    // when the stream finishes create a file
    this.once('finish', () => this._generateFile())

    this.callback = callback
    this.type = opts.type || ''
  }

  _generateFile () {
    const file = this._buffers.length && new File(this._buffers, '', { type: this.type })

    if (file) {
      this.callback?.(file)
      this.emit('file', file)
    }

    // reset the buffers and counters
    this._buffers = null
    this._bytesreceived = null
  }

  _write (chunk, encoding, callback) {
    const data = Buffer.isBuffer(chunk)
      ? chunk
      : Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)

    // if the incoming data has been passed through,
    // then add to the bytes received buffer
    if (data) {
      this._bytesreceived += data.length
      this._buffers.push(data)
      this.emit('progress', this._bytesreceived)
    }

    callback()
  }
}

module.exports = FileWriteStream
