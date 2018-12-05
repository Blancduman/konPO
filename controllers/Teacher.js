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

module.exports.TeacherGetCurrentStudents = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === TEACHER) {
        Repository.find({
            teacher: user.id,
            status: true
          }).select('user')
          .populate({
            path: 'user',
            select: '_id firstname lastname middlename'
          })
          .exec()
          .then(repos => {
            return res.render('teacher/index', {
              students: repos.filter((set => f => !set.has(f.user) && set.add(f.user))(new Set)),
              user: user
            });
          });
      }
    }).catch(next);
};
Array.prototype.diff3 = function(a) {

}

module.exports.TeacherGetActiveRepositories = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === TEACHER) {
        Repository.find({
            teacher: user,
            status: true
          })
          .populate('user')
          .exec(repos => {
            return res.render('teacher/active_repositories', {
              repositories: repos,
              user: user
            });
          });
      }
    }).catch(next);
}

module.exports.TeacherGetStudentActiveRepositories = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === TEACHER) {
        Repository.find({
          teacher: user,
          status: true,
          user: req.params.studentid
        }).then(repos => {
          User.findById(req.params.studentid)
            .then(_user => {
              return res.render('teacher/active_repositories', {
                student: _user,
                repositories: repos,
                user: user
              });
            }).catch(next);
        }).catch(next);
      }
    }).catch(next);
};

module.exports.TeacherGetStudentActiveRepositorySection = (req, res, next) => {
  User.findOne(req.user)
    .select('_id role firstname lastname middlename')
    .then(user => {
      if (user.role === TEACHER) {
        Repository.findById(req.params.repositoryid)
          .select('_id section status')
          // .populate({
          //   path: 'section',
          //   populate: {
          //     path: 'task',
          //     model: 'Task'
          //   }
          // })
          // .exec()
          .then(repo => {
            if (repo.status) {
              if (repo.section.indexOf(req.params.sectionid)!=-1) {
                Section.findById(req.params.sectionid)
                  .populate('task')
                  .exec()
                  .then(section => {
                    return res.json(section);
                  })
              }
            }
             
          })
      }
    })
}
module.exports.TeacherPostStudentActiveRepositorySection = (req, res, next) => {
  User.findById(req.user)
    .then(user => {
      if (user.role === TEACHER) {
        Repository.findById(req.params.repositoryid)
          .select('user section')
          .then(repo => {
            if (repo.user._id.toString() === req.params.studentid.toString()) {
              if (repo.section.indexOf(req.params.sectionid) != -1) {
                console.log(req.body.tasks);
              }
            } else {
              return res.redirect('/teacher');
            }
          })
      }
    })
}

module.exports.TeacherGetStudentActiveRepository = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === TEACHER) {
        Repository.findById(req.params.repositoryid)
          .populate({
            path: 'section',
            select: '_id slug name task lastcheck body updatedAt'
          })
          .exec()
          .then(repo => {
            if (repo.user._id.toString() === req.params.studentid.toString()) {
              return res.render('teacher/repository', {
                repository: repo,
                user: user
              });
            } else {
              return res.redirect('/teacher');
            }
          })
      }
    }).catch(next);
}

module.exports.TeacherCloseStudentRepository = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === TEACHER) {
        Repository.findById(req.params.repositoryid)
          .then(repo => {
            if (repo.user._id.toString() === req.params.studentid.toString()) {
              repo.status = false;
              //archive repo
              repo.save();
              res.redirect('/teacher');
            }
          })
      }
    }).catch(next);
}

module.exports.TeacherGetClosedStudentsRepositories = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === TEACHER) {
        Repository.find({
            teacher: user.id,
            status: false
          })
          .populate({
            path: 'user',
            select: '_id firstname lastname middlename'
          })
          .exec()
          .then(repos => {
            return res.render('teacher/closed', {
              students: repos,
              user: user
            });
          });
      }
    }).catch(next);
}

module.exports.TeacherGetStudentClosedRepositories = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === TEACHER) {
        Repository.find({
          teacher: user,
          status: false,
          user: req.params.studentid
        }).then(repos => {
          User.findById(req.params.studentid)
            .then(_user => {
              return res.render('teacher/closed_repositories', {
                student: _user,
                repositories: repos,
                user: user
              });
            }).catch(next);
        }).catch(next);
      }
    }).catch(next);
  // User.findOne(req.user)
  //   .then(user => {
  //     if (user.role === TEACHER) {
  //       Repository.find({
  //           teacher: user._id,
  //           status: false,
  //           user: req.params.studentid
  //         })
  //         .populate({
  //           path: 'user',
  //           select: '_id firstname lastname middlename'
  //         })
  //         .exec()
  //         .then(repos => {
  //           return res.render('teacher/closed_repositories', {
  //             student: repos.user,
  //             repositories: repos,
  //             user: user
  //           });
  //         });
  //     }
  //   }).catch(next);
}
const diff2 = function(a, b) {
  let c = [],
  k = true;
  for (var i =0; i<a.length; i++) {
    for (var j=0; j<b.length; j++) {
      if (a[i].id === b[j].id){
        k = false; break;}
    }
    if (k) c.push(a[i]);
    k=true;
  }
  return c;
}
module.exports.TeacherGiveAccessStudents = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === TEACHER) {
        console.log(req.body.duallistbox)
        //console.log(req.body)
        Repository.findById(req.params.repositoryid)
          .then(repo => {
            if (repo.user._id.toString() === req.params.studentid) {
              console.log(req.body.duallistbox);
              console.log(repo.access);
              repo.access = req.body.duallistbox;
              console.log(repo.access);
              repo.save();
              res.redirect('/teacher/closed')
            }
          })
      }
    })
}

module.exports.TeacherGetStudentClosedRepository = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === TEACHER) {
        Repository.findById(req.params.repositoryid)
          .populate({
            path: 'user',
            select: '_id firstname lastname middlename'
          })
          .populate({
            path: 'access',
            select: '_id firstname lastname middlename'
          })
          .exec()
          .then(repo => {
            if (repo.user._id.toString() === req.params.studentid.toString()) {
              User.find({
                  role: STUDENT
                }).select('_id firstname lastname middlename')
                .then(users => {
                  res.render('teacher/closed_repository', {
                    users: diff2(users, repo.access),
                    access: repo.access,
                    user: user,
                    repository: repo
                  })
                })
            } else {
              return res.redirect('/teacher/closed');
            }
          }).catch(next);
      }
    }).catch(next);
};

module.exports.TeacherDownloadStudentClosedRepository = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === TEACHER) {
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