const path = require('path'),
      fs = require('fs'),
      pathType = require('path-type');
      
function aaa(data) {
  return Promise.all(
    [data.map(function(item) {
    if (fs.lstatSync(__dirname+'/public/'+item).isDirectory())
      return item;
  }), data.map(function(item) {
    if (fs.lstatSync(__dirname+'/public/'+item).isFile())
      return item;
  })]);
}
fs.readdir(__dirname+'/public', (err, data) => {
  aaa(data).then(a => console.log(b =[a[0].filter(el => {
    return el!=null;}), a[1].filter(el => {return el!=null;})])
  );
})