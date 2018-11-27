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
                      return res.redirect('/student/index');
                    if (user.role === ADMIN)
                      return res.redirect('/admin/index');
                    if (user.role === TEACHER)
                      return res.redirect('/teacher/index');
                  }).catch(next);
              }).catch(next);
          }).catch(next);
      } else {
        if (user.role === STUDENT)
          return res.redirect('/student/index');
        if (user.role === ADMIN)
          return res.redirect('/admin/index');
        if (user.role === TEACHER)
          return res.redirect('/teacher/index');
      }
    });
  })(req, res, next);
};

module.exports.UserGetProfile = (req, res, next) => {
  User.findOne(req.user).then(user => {
    if (user.role === STUDENT)
      res.render('student/profile', {user: user});
    if (user.role === TEACHER)
      res.render('teacher/profile', {user: user});
  }).catch(next);
};

module.exports.UserRegistration = (req, res, next) => {
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

module.exports.GetHomePage = (req, res) => {
  User.findOne(req.user).then(user => {
    if (!user) {
      req.clearCookie('usertoken', {path: '/'});
      return res.render('index');
    }
    if (user.role === STUDENT)
      return res.redirect('/student');
    if (user.role === TEACHER)
      return res.redirect('/teacher');
    if (user.role === ADMIN)
      return res.redirect('/admin');
  }).catch(res.render('index'));
}

module.exports.GetLoginPage = (req, res) => {
  res.render('login');
}

module.exports.GetRegistrationPage = (req, res) => {
  res.render('registration');
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
        await UserCookie(req, res, username);
      } else {
        req.flash('message', 'Трампампам! Похоже вы утратили контроль над своим аккаунтом. Смените срочно пароль!');
        res.clearCookie('usertoken', {path: '/'});
        return res.redirect('/');
      }
    } else {
      res.clearCookie('usertoken', {path: '/'});
      return res.redirect('/');
    }
  }
  next();
}