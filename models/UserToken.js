const mongoose = require('mongoose');

const UserTokenSchema = new mongoose.Schema({
  username: {
    type: String
  },
  series: {
    type: String
  },
  token: {
    type: String
  }
});

UserTokenSchema.methods.isValidCookie = function(coockieSeries) {
  return this.series === coockieSeries;
}

UserTokenSchema.methods.isValidToken = function(coockieToken) {
  return this.token === coockieToken;
}

mongoose.model('UserToken', UserTokenSchema);