var mongoose = require('mongoose');

var SectionSchema = new mongoose.Schema({
  slug: {
    type: String,
    lowercase: true
  },
  name: String,
  task: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  repository: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository'
  }
});

mongoose.model('Section', SectionSchema);