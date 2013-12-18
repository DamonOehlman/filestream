var reExtension = /\.(\w+)$/;
var mimeTypes = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png'
};

exports.lookup = function(filename) {
  var match = reExtension.exec(filename);

  return match && mimeTypes[match[1].toLowerCase()];
};