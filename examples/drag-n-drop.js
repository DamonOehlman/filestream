const crel = require('crel')
const detect = require('feature/detect')
const dnd = require('drag-and-drop-files')
const img = crel('img')
const video = crel('video', { autoplay: true })
const FileReadStream = require('../read')
const FileWriteStream = require('../write')

function upload (files) {
  const queue = [].concat(files)

  function sendNext () {
    const writer = new FileWriteStream()
    const next = queue.shift()

    console.log('sending file')
    new FileReadStream(next).pipe(writer).on('file', function (file) {
      console.log('file created: ', file)
      img.src = detect('URL').createObjectURL(file)
      // video.src = detect('URL').createObjectURL(next);

      if (queue.length > 0) {
        sendNext()
      }
    })
  }

  sendNext()
}

dnd(document.body, upload)

document.body.appendChild(crel('style', 'body, html { margin: 0; width: 100%; height: 100% }'))
document.body.appendChild(img)
document.body.appendChild(video)
