const mongoose = require('mongoose'),
      crypto = require('crypto'),
      secret = require('../config').secret;


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'Логин не может быть пустым!'],
    match: [/^[a-zA-Z0-9]+$/, 'is valid'],
    index: true
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'не может быть пустым!'],
    match: [/\S+@\S+\.\S+/, 'is valid'],
    index: true
  },
  firstname: String,
  lastname: String,
  middlename: String,
  phone: String,
  image: String,
  repositories: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Repository'
  }],
  role: String,
  hash: String,
  salt: String
}, {timestamps: true});

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

mongoose.model('User', UserSchema);