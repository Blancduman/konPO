const passport = require('passport'),
      uuidv4 = require('uuid/v4'),
      mongoose = require('mongoose'),
      UserToken = mongoose.model('UserToken'),
      setCookie = require('../lib/setcookie');

module.exports.UserLogin = (req, res, next) => {
  passport.authenticate('localUsers', (err, user) => {
    if (err) {return next(err);}
    if (!user) {
      req.flash('message', ' укажите правильный логин и пароль!');
      return res.redirect('/');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      if (req.body.remember) {
        let data = {};
        data.series = uuidv4();
        data.token = uuidv4();
        data.username = user.username;
        let recordDb = new UserToken(data);
        UserToken
          .remove({username: user.username})
          .then(user => {
            recordDb
              .save()
              .then(user => {
                setCookie(res, {series: user.series, token: user.token, username: user.username});
                return res.redirect('/profile');
              })
              .catch(next);
          })
          .catch(next);
      } else {
        return res.redirect('/student/profile');
      }
    });
  })(req, res, next);
};