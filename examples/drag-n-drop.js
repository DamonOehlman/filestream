var crel = require('crel');
var detect = require('feature/detect');
var dnd = require('drag-and-drop-files');
var img = crel('img');
var FileReadStream = require('../read');
var FileWriteStream = require('../write');

function upload(files) {
  var queue = [].concat(files);

  function sendNext() {
    var writer = new FileWriteStream();

    console.log('sending file');
    new FileReadStream(queue.shift()).pipe(writer).on('file', function() {
      console.log('file created: ', writer.file);
      img.src = detect('URL').createObjectURL(writer.file);

      if (queue.length > 0) {
        sendNext();
      }
    });
  }

  sendNext();
}

dnd(document.body, upload);

document.body.appendChild(crel('style', 'body, html { margin: 0; width: 100%; height: 100% }'));
document.body.appendChild(img);