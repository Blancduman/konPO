const passport = require('passport'),
      uuidv4 = require('uuid/v4'),
      mongoose = require('mongoose'),
      UserToken = mongoose.model('UserToken'),
      setCookie = require('../lib/setcookie'),
      User = mongoose.model('User'),
      STUDENT = require('../constants').STUDENT,
      TEACHER = require('../constants').TEACHER;
      ADMIN = require('../constants').ADMIN;

module.exports.UserLogin = (req, res, next) => {
  req.checkBody('username', 'Введите логин.').notEmpty();
  req.checkBody('password', 'Введите пароль.').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    res.render('login', {errors:errors});
  } else {
    passport.authenticate('localUsers', (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('message', ' укажите логин и пароль!');
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
                  User.findOne({username: user.username})
                    .then(user => {
                      if (user.role === STUDENT)
                         return res.redirect('/student');
                      if (user.role === ADMIN)
                        return res.redirect('/admin');
                      if (user.role === TEACHER)
                         return res.redirect('/teacher');
                    }).catch(next);
                }).catch(next);
            }).catch(next);
        } else {
          if (user.role === STUDENT)
            return res.redirect('/student');
          if (user.role === ADMIN)
            return res.redirect('/admin');
          if (user.role === TEACHER)
            return res.redirect('/teacher');
        }
      });
    })(req, res, next);
  }
};

module.exports.UserRegistration = (req, res, next) => {
  req.checkBody('username', 'Укажите логин.').notEmpty();
  req.checkBody('email', 'Укажите почту.').notEmpty().isEmail();
  req.checkBody('firstname', 'Укажите имя.').notEmpty();
  req.checkBody('lastname', 'Укажите фамилию.').notEmpty();
  req.checkBody('middlename', 'Укажите отчество.').notEmpty();
  req.checkBody('password', 'Укажите пароль').notEmpty().equals(req.body.password2);
  var errors = req.validationErrors();
  if (errors) {
    res.render('registration', {errors:errors});
  } else {
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
            phone: req.body.phone,
            image: 'https://pp.userapi.com/c851528/v851528089/5242f/15BkorO2nJE.jpg',
            role: STUDENT,
          });
          newUser.setPassword(req.body.password);
          newUser
            .save()
            .then(user => {
              req.logIn(user, (err) => {
                if (err) { return next(err); }
                req.flash('message', 'Студент создан');
                return res.redirect('/login');
              })
            })
            .catch(next);
        }
      }).catch(next);
  }
}

module.exports.GetHomePage = (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne(req.user).then(user => {
      if (!user) {
        res.clearCookie('usertoken', {path: '/'});
        return res.redirect('/');
      }
      if (user.role === STUDENT)
        return res.redirect('/student');
      if (user.role === TEACHER)
        return res.redirect('/teacher');
      if (user.role === ADMIN)
        return res.redirect('/admin');
    });
  } else {
    return res.render('index');
  }
};

module.exports.Logout = (req, res) => {
  req.logout();
  res.clearCookie('key');
  res.clearCookie('usertoken');
  res.redirect('/login') 
}

module.exports.GetLoginPage = (req, res, next) => {
  if (req.isAuthenticated()) {
    User.findOne(req.user).then(user => {
      if (user.role === STUDENT)
        return res.redirect('/student');
      if (user.role === TEACHER)
        return res.redirect('/teacher');
      if (user.role === ADMIN)
        return res.redirect('/admin');
    });
  } else {
    return res.render('login');
  }
}

module.exports.GetRegistrationPage = (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne(req.user).then(user => {
      if (user.role === STUDENT)
        return res.redirect('/student');
      if (user.role === TEACHER)
        return res.redirect('/teacher');
      if (user.role === ADMIN)
        return res.redirect('/admin');
    }).catch(res.render('registration'));
  } else {
    res.render('registration');
  }
}

const UserCookie = async (req, res, username) => {
  let token = uuidv4();
  await UserToken.updateOne({username}, {$set: {token}});
  let userToken = await UserToken.findOne({username});
  setCookie(res, userToken);
  let user = await User.findOne({username});
  return new Promise((resolve, reject) => {
    req.logIn(user, err => {
      if (err) {reject(err);}
      resolve();
    });
  });
}

module.exports.CookieChecker = async (req, res, next) => {
  if (!!req.cookies.usertoken) {
    let objTokens = JSON.parse(req.cookies.usertoken),
        username = objTokens.username;
        user = await UserToken.findOne({username});

    if (!!user && user.isValidCookie(objTokens.series)) {
      if (user.isValidToken(objTokens.token)) {
        console.log('UserContrl 206');
        await UserCookie(req, res, username);
      } else {
        console.log('UserContrl 209');
        req.flash('message', 'Трампампам! Похоже вы утратили контроль над своим аккаунтом. Смените срочно пароль!');
        res.clearCookie('usertoken', {path: '/'});
        res.clearCookie('keys', {path: '/'});
        req.logout();
        return res.redirect('/');
      }
    } else {
      console.log('UserContrl 215');
      res.clearCookie('usertoken', {path: '/'});
      res.clearCookie('keys', {path: '/'});
      req.logout();
      return res.redirect('/');
    }
  }
  next();
}