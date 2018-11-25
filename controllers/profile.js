const router = require('express').Router(),
      mongoose = require('mongoose'),
      User = mongoose.model('User');


module.exports.GetUserProfile = (req, res, next) => {
  User.findOne(req.user).then(user => {
    if (user.role === 'STUDENT') {
      res.render('student/profile', {user: user});
    } else {
      res.redirect('/');
    }
  })
  .catch(next);
}