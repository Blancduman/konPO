const uuidv4 = require('uuid/v4'),
      mongoose = require('mongoose'),
      User = mongoose.model('User'),
      Repository = mongoose.model('Repository'),
      Section = mongoose.model('Section'),
      Task = mongoose.model('Task'),
      Message = mongoose.model('Message'),
      STUDENT = require('../constants').STUDENT,
      TEACHER = require('../constants').TEACHER;

module.export.StudentGetRepositories = (req, res, next) => {
  
}

module.export.StudentNewRepositoryGetPage = (req, res, next) => {
  User.findOne(req.user).then(user => {
    if (!user) {
      req.clearCookie('usertoken', {path: '/'});
      return res.render('index');
    }
    if (user.role === STUDENT) {
      User.find({role: TEACHER}).then(teachers => {
        return res.render('student/new_repository', {teachers: teachers});
      }).catch(next);
    }
    else res.redirect('/');
  }).catch(next);
}

module.exports.StudentNewRepositoryCreate = (req, res, next) => {
  req.checkBody('newrepo', 'Укажите имя репозитории').notEmpty();
  req.checkBody('teachers').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    res.render('student/new_repository', {errors:errors});
  } else {
    
  }
}