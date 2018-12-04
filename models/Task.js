var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  body: String,
  status: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

mongoose.model('Task', TaskSchema);