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
  },
  lastcheck: {
    type: Date
  },
  body: {
    type: String
  }
});

SectionSchema.methods.slugify = function() {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36,6) | 0).toString(36);
};

mongoose.model('Section', SectionSchema);