var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  },
  body: String,
  status: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

mongoose.model('Task', TaskSchema);