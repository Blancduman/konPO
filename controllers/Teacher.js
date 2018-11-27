const uuidv4 = require('uuid/v4'),
      mongoose = require('mongoose'),
      User = mongoose.model('User'),
      Repository = mongoose.model('Repository'),
      Section = mongoose.model('Section'),
      Task = mongoose.model('Task'),
      Message = mongoose.model('Message'),
      STUDENT = require('../constants').STUDENT,
      TEACHER = require('../constants').TEACHER,
      _Sections = require('../constants').SECTIONS;

module.exports.TeacherGetCurrentRepositories = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (!user) {
        req.clearCookie('usertoken', {path: '/'});
        return res.render('index');
      }
      if (user.role === TEACHER) {
        Repository.find({teacher: user, status: true})
          .populate('user')
          .exec(repos => {
            return res.render('teacher/index', {students: Array.from(new Set(repos.user))});
          });
      }
    }).catch(next);
};

module.exports.TeacherGetStudentActiveRepositories = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (!user) {
        req.clearCookie('usertoken', {path: '/'});
        return res.render('index');
      }
      if (user.role === TEACHER) {
        Repository.find({teacher: user, status: true, user: req.params._id})
          .populate('user')
          .exec(repos => {
            return res.render('teacher/active_repositories', {student: repos.user, repositories: repos});
          });
      }
    }).catch(next);
};

