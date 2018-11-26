const router = require('express').Router();
      uuidv4 = require('uuid/v4'),
      mongoose = require('mongoose'),
      User = mongoose.model('User'),
      UserToken = mongoose.model('UserToken'),
      asyncMiddleware = require('../middleware/asyncmiddleware'),
      setCookie = require('../lib/setcookie'),
      registerUser = require('../controllers/usertoken').registerUser;

router.get('/', asyncMiddleware(async (req, res, next) => {
  console.log(req.cookies.usertoken);
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