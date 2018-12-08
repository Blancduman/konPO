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
const ensureExists = (path, cb) => {
  fs.mkdir(path, err => {
    if (err) {
      if (err.code == 'EEXIST') cb(null);
      else cb(err);
    } else cb(null);
  });
}
module.exports.TeacherPostImageToProfile = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === TEACHER) {
        var form = new formidable.IncomingForm();
        form.parse(req);
        form.uploadDir = path.join(__dirname, "/../private/tmp");
        form.maxFileSize = 5 * 1024 * 1024;

        form.on("fileBegin", (err, file) => {
          if (file.type.indexOf('image') != -1) {
            var fileNewName = Date.now() + "_" + file.name;
            var fileDBPath = "/images/" + user._id + "/";
            var fileLoadFile = "../public/images/"+ user._id + "/";
            ensureExists(__dirname +"/"+ fileLoadFile, err => {
              if (err) console.log(err);
            });
            
            file.path = path.join(__dirname, fileLoadFile + fileNewName);
            console.log(file.path);
            user.image = fileDBPath + fileNewName;
            user.save();
          }
        });
        form.on('end', () => {
          res.redirect('/teacher/profile');
        })
        form.on('error', (err) => {
          res.send(err);
        });
      }
  });
};


module.exports.TeacherGetProfilePage = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === TEACHER) {
        return res.render('teacher/profile', {user: user});
      }
    }).catch(next);
};

module.exports.TeacherEditProfile = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        let email = req.body.email, firstname = req.body.firstname, 
        lastname = req.body.lastname, middlename = req.body.middlename,
        phone = req.body.phone, 
        password = req.body.password, password2 = req.body.password2;

        if (email){
          req.checkBody('email', 'Укажите почту.').notEmpty()
          req.checkBody('email', 'Укажите правильную почту.').isEmail();
        }
        if (firstname){
          req.checkBody('firstname', 'Укажите имя.').notEmpty();
        }
        if (lastname)
          req.checkBody('lastname', 'Укажите фамилию.').notEmpty();
        if (middlename)
          req.checkBody('middlename', 'Укажите отчество.').notEmpty();
        if (password){
          req.checkBody('password', 'Укажите пароль.').notEmpty()
          req.checkBody('password', 'Пароли не совпадают.').equals(password2);
        }
        if (phone)
          req.checkBody('phone', 'Укажите номер.').notEmpty();
        let errors = req.validationErrors();
        if (errors) {
          console.log(errors);
          return res.render('teacher/profile', {errors:errors, user: user});
        } else {
          if (email) user.email = email;
          if (firstname) user.firstname = firstname;
          if (lastname) user.lastname = lastname;
          if (middlename) user.middlename = middlename;
          if (password) user.setPassword(password);
          if (phone) user.phone = phone;

          user.save();
          return res.render('teacher/profile', {user: user});
        }
      }
    }).catch(next);
}

module.exports.TeacherPostStudentActiveRepositorySection = (req, res, next) => {
  User.findById(req.user)
    .then(user => {
      if (user.role === TEACHER) {
        Repository.findById(req.params.repositoryid)
          .select('user section')
          .then(repo => {
            if (repo.user._id.toString() === req.params.studentid.toString()) {
              var _tasks = JSON.parse(req.body.tasks);
              if (repo.section.indexOf(req.params.sectionid) != -1) {
                Task.deleteMany({section: repo.section._id});
                Section.findById(req.params.sectionid)
                  .then((section) => {
                    section.task = [];
                    const saver = (task) => {
                      let _t  = new Task();
                      _t.section = section;
                      _t.body = task.body;
                      _t.status = task.status;

                      return _t.save();
                    }
                    return Promise.all(_tasks.map(saver)).then(tasks => {
                      section.task=tasks;
                      section.save();
                    });
                    // let tmp = [];
                    // _tasks.forEach( _task => {
                    //   let _t = new Task();
                    //   _t.section = section;
                    //   _t.body =_task.body;
                    //   _t.status = _task.status;
                    //   _t.save()
                    //   .then((t) => {
                    //     tmp.push(t);
                    //     section.task.push(t);
                    //   });
                    // });
                    
                  })
              }
              return res.redirect('/teacher');
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