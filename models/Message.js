var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  body: String,
  repository: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Repository'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  status: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

mongoose.model('Message', MessageSchema);