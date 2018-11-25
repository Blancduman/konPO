const mongoose = require('mongoose'),
      UserToken = mongoose.model('UserToken'),
      uuidv4 = require('uuid/v4'),
      setCookie = require('../lib/setcookie');

module.exports.registerUser = async (req, res, username) => {
  await UserToken.updateOne({username}, {$set: {uuidv4()}});
  let userToken = await UserToken.findOne({username});
  setCookie(res, userToken);
  let user = await User.findOne({username});
  return new Promise((resolve, reject) => {
    req.logIn(user, err => {
      if (err) {reject(err);}
      resolve();
    });
  });
};
