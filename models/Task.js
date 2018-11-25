var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  body: String,
  section: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Section'
  },
  status: {
    type: boolean,
    default: false
  }
}, {timestamps: true});

mongoose.model('Task', TaskSchema);