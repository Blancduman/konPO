const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      mongoose = require('mongoose'),
      User = mongoose.model('User');

passport.serializeUser(function(user, done) {
  console.log('serializeUser: ', user.username);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser: ', id);
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  'localUsers',
  new LocalStrategy({passReqToCallback: true},
    (req, username, password, done) => {
      User.findOne({username: username})
        .then(user => {
          if (!user || !user.validPassword(password)) {
            return done(null, false,
              req.flash('message', 'Неверный логин или пароль!'));
          }
          return done(null, user);
        })
        .catch(err => {
          done(err);
        });
    }
  )
);