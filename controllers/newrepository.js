const mongoose = require('mongoose'),
      Repository = mongoose.model('Repository'),
      User = mongoose.model('User');

module.exports.AddNewRepository = (req, res, next) => {
  console.log(req.body);
  console.log(req.user);
}

module.exports.GetNewRepository = (req, res, next) => {
  res.render('student/newrepository', {user: req.user});
}
