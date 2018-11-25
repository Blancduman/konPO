const router = require('express').Router();
      uuidv4 = require('uuid/v4'),
      mongoose = require('mongoose'),
      User = mongoose.model('User'),
      UserToken = mongoose.model('UserToken'),
      asyncMiddleware = require('../middleware/asyncmiddleware'),
      setCookie = require('../lib/setcookie'),
      registerUser = require('../controllers/Ctr_usertoken').registerUser;

// const registerUser = async (req, res, username) => {
//   await UserToken.updateOne({username}, {$set: {uuidv4()}});
//   let userToken = await UserToken.findOne({username});
//   setCookie(res, userToken);
//   let user = await User.findOne({username});
//   return new Promise((resolve, reject) => {
//     req.logIn(user, err => {
//       if (err) {reject(err);}
//       resolve();
//     });
//   });
// };

router.get('/', asyncMiddleware(async (req, res, next) => {
  if (!!req.cookies.usertoken) {
    let objTokens = JSON.parse(req.cookies.usertoken),
        username = objTokens.username;
        user = await UserToken.findOne({username});

    if (!!user && user.isValidCookie(objTokens.series)) {
      if (user.isValidToken(objTokens.token)) {
        await registerUser(req, res, username);
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
}));

module.exports = router;