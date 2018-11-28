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
        Repository.find({teacher: user, status: true, user: req.params.studentid})
          .populate('user')
          .exec(repos => {
            return res.render('teacher/active_repositories', {student: repos.user, repositories: repos});
          });
      }
    }).catch(next);
};

module.exports.TeacherGetStudentActiveRepository = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (!user) {
        req.clearCookie('usertoken', {path: '/'});
        return res.render('index');
      }
      if (user.role === TEACHER) {
        // Repository.find({teacher: user, status: true, user: req.params.studentid})
        //   .populate('user')
        //   .exec(repos => {
        //     return res.render('teacher/active_repositories', {student: repos.user, repositories: repos});
        //   });
        Repository.findById(req.params.repositoryid)
          .then(repo => {
            if (repo.user === req.params.studentid) {
              return res.render('teacher/repository', {repository: repo});
            } else {
              return res.redirect('/teacher');
            }
          })
      }
    }).catch(next);
}

module.exports.TeacherGetClosedRepositoriesStudents = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (!user) {
        req.clearCookie('usertoken', {path: '/'});
        return res.render('index');
      }
      if (user.role === TEACHER) {
        Repository.find({teacher: user, status: false, user: req.params.studentid})
          .populate('user')
          .exec(repos => {
            return res.render('teacher/closed_repositories', {student: repos.user, repositories: repos});
          });
      }
    }).catch(next);
}

module.exports.TeacherGetStudentClosedRepositories = (req, res, next) => {
  User.findOne(req.user)
  .then(user => {
    if (!user) {
      req.clearCookie('usertoken', {path: '/'});
      return res.render('index');
    }
    if (user.role === TEACHER) {
      Repository.find({teacher: user, status: false, user: req.params.studentid})
        .populate('user')
        .exec(repos => {
          return res.render('teacher/active_repositories', {student: repos.user, repositories: repos});
        });
    }
  }).catch(next);
}

module.exports.TeacherGetStudentClosedRepository = (req, res, next) => {
  User.findOne(req.user)
  .then(user => {
    if (!user) {
      req.clearCookie('usertoken', {path: '/'});
      return res.render('index');
    }
    if (user.role === TEACHER) {
      // Repository.find({teacher: user, status: false, user: req.params.studentid})
      //   .populate('user')
      //   .exec(repos => {
      //     return res.render('teacher/active_repositories', {student: repos.user, repositories: repos});
      //   });
      Repository.findById(req.params.repositoryid)
        .populate('user')
        .exec(repo => {
          if (repo.user._id === req.params.studentid) {
            User.find({access: repo._id})
              .then(access => {
                User.find({access: {$ne: repo._id}})
                  then(_user => {
                    return res.render('teacher/closed_repository', {repository: repo, access: access, users: _user})
                  }).catch(next);
              }).catch(next);
          } else {
            return res.redirect('/teacher/student/closed');
          }
        }).catch(next);
    }
  }).catch(next);
};

module.exports.TeacherDownloadStudentClosedRepository = (req, res, next) => {
  User.findOne(req.user)
  .then(user => {
    if (!user) {
      req.clearCookie('usertoken', {path: '/'});
      return res.render('index');
    }
    if (user.role === TEACHER) {
      // Repository.find({teacher: user, status: false, user: req.params.studentid})
      //   .populate('user')
      //   .exec(repos => {
      //     return res.render('teacher/active_repositories', {student: repos.user, repositories: repos});
      //   });
      Repository.findById(req.params.repositoryid)
        .populate('user')
        .exec(repo => {
          if (repo.user._id === req.params.studentid) {
            if (repo.teacher.includes(user)) {
              return res.send('SOON');
            }
          } else {
            return res.redirect('/teacher/student/closed');
          }
        }).catch(next);
    }
  }).catch(next);
}