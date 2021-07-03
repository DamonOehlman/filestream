const { Readable } = require('stream')

class FileReadStream extends Readable {
  /**
   * @param {Blob} blob
   * @param {any} opts
   */
  constructor (blob, opts = {}) {
    super(opts)
    this._offset = 0
    this._blob = blob
    this._chunkSize = opts.chunkSize || Math.max(this._blob.size / 1000, 200 * 1024)
  }

  _read () {
    const startOffset = this._offset
    let endOffset = this._offset + this._chunkSize
    if (endOffset > this._blob.size) endOffset = this._blob.size

    if (startOffset === this._blob.size) {
      this.destroy()
      this.push(null)
      return
    }

    this._blob.slice(startOffset, endOffset).arrayBuffer().then(ab => {
      this.push(new Uint8Array(ab))
    })

    // update the stream offset
    this._offset = endOffset
  }

  destroy () {
    this._blob = null
  }
}

module.exports = FileReadStream
