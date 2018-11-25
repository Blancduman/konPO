const mongoose = require('mongoose'),
      User = mongoose.model('User');

module.exports.UserRegistration = function(req, res, next) {
  User.findOne({username: req.body.username})
    .then(user => {
      if (user) {
        req.flash('message', 'Пользователь с таким логином уже существует.');
        res.redirect('/registration');
      } else {
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          middlename: req.body.middlename,
          image: 'https://pp.userapi.com/c851528/v851528089/5242f/15BkorO2nJE.jpg',
          role: 'STUDENT',
        });
        newUser.setPassword(req.body.password);
        newUser
          .save()
          .then(user => {
            req.logIn(user, (err) => {
              if (err) { return next(err); }
              req.flash('message', 'Студент создан');
              return res.redirect('/repositories');
            })
          })
          .catch(next);
      }
    })
    .catch(next);
};