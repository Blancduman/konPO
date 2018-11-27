const mongoose = require('mongoose'),
      slug = require('slug');

const RepositorySchema = new mongoose.Schema({
  slug: {
    type: String,
    lowercase: true
  },
  title: String,
  description: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  access: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }],
  teacher: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }],
  section: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Section'
  }],
  message: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Message'
  }],
  status: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

RepositorySchema.pre('validate', function(next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

RepositorySchema.methods.slugify = function() {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36,6) | 0).toString(36);
};


mongoose.model('Repository', RepositorySchema);