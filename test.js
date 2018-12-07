const path = require('path'),
      fs = require('fs'),
      pathType = require('path-type');

  const saverDirs = function(data) {
    return new Promise((resolve, reject) => {
      var dirs = '';
      for (var i = 0; i<data.length; i++) {
        if (data.includes()){}
      }
      // for (var i = 0; i<data.length; i++) {
      //   fs.lstat(__dirname+'/public/' + data[i], (err, stats) => {
      //     if (stats.isDirectory())
      //       dirs.push(data[i]);
      //   })
      // }
      resolve(dirs);
    });
  }
  
  const saverFiles = function(data) {
    return new Promise((resolve, reject) => {
      var files = [];
      for (var i = 0; i<data.length; i++) {
        fs.lstat(__dirname+'/public/' + data[i], (err, stats) => {
          if (stats.isFile())
          files.push(data[i]);
        })
      }
      resolve(files);
    });
  }

var dirs=[], files=[];
fs.readdir(__dirname+'/public', (err, data) => {
  dirs = data.map(item => {pathType.dir(__dirname+'/public/'+item).then(_item => {if (_item) console.log (item);})});
  console.log(dirs, files);
})