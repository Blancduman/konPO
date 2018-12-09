const path = require('path'),
      fs = require('fs'),
      pathType = require('path-type');

fs.exists('a.txt', (exists) => {
  if (exists) fs.unlink('a.txt');
})