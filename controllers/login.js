const passport = require('passport'),
      uuidv4 = require('uuid/v4'),
      mongoose = require('mongoose'),
      UserToken = mongoose.model('UserToken'),
      setCookie = require('../lib/setcookie'),
      User = mongoose.model('User');

module.exports.UserLogin = (req, res, next) => {
  passport.authenticate('localUsers', (err, user) => {
    if (err) {
      console.log("login.js 10",err);
      return next(err);
    }
    if (!user) {
      console.log("login.js 14", user);
      req.flash('message', ' укажите логин и пароль!');
      return res.redirect('/');
    }
    req.logIn(user, function(err) {
      if (err) {
        console.log("login.js 20", err);
        return next(err);
      }
      if (req.body.remember) {
        let data = {};
        data.series = uuidv4();
        data.token = uuidv4();
        data.username = user.username;
        let recordDb = new UserToken(data);
        console.log("login.js 29", recordDb);
        UserToken
          .remove({username: user.username})
          .then(user => {
            recordDb
              .save()
              .then(user => {
                setCookie(res, {series: user.series, token: user.token, username: user.username});
                User.findOne({username: user.username})
                  .then(user => {
                    console.log("login.js 40", user.role);
                    if (user.role === 'STUDENT')
                      return res.redirect('/student/profile');
                    if (user.role === 'ADMIN')
                      return res.redirect('/admin/index');
                  }).catch(next);
              }).catch(next);
          }).catch(next);
      } else {
        return user.role === 'STUDENT' ? res.redirect('/student/profile') : user.role === 'ADMIN' ? res.redirect('/admin') : res.redirect('/login');
      }
    });
  })(req, res, next);
};