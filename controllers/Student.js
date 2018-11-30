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

const GenerateSection = (name, repoId) => {
  let section = new Section();
  section.name = name;
  section.repository = repoId;
  section.slugify();
  section.save();
  return section;
}

// const GenerateTask = (body, sectionId) => {
//   let task = new Task();
//   task.body = body;
//   task.section = sectionId;
//   return task;
// }

const EditTask = (status, taskId) => {
  Task.findById(taskId)
    .then(task => {
      task.status = status;
    });
}

module.exports.StudentGetProfilePage = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        return res.render('student/profile', {user: user});
      }
    }).catch(next);
}

module.exports.StudentEditProfile = (req, res, next) => {
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
          res.render('student/profile', {errors:errors, user: user});
        } else {
          if (email) user.email = email;
          if (firstname) user.firstname = firstname;
          if (lastname) user.lastname = lastname;
          if (middlename) user.middlename = middlename;
          if (password) user.setPassword(password);
          if (phone) user.phone = phone;

          user.save();
        }
      }
    }).catch(next);
}

module.exports.StudentGetProfilePage = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        return res.render('student/profile', {user: user});
      }
    }).catch(next);
}

module.exports.StudentGetClosedRepositories = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        Repository.find({user: user._id, status: false})
          .populate('teacher')
          .exec(repos => {
            return res.render('student/closed_repositories', {repositories: repos, user: user})
          })
      }
    }).catch(next);
};

module.exports.StudentDownloadAccessedRepository = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        Repository.findOne({access: user._id, status: false, _id: req.params.repositoryid})
          .then(repos => {
            return res.send(repos);
          }).catch(next);
      }
    }).catch(next);
}

module.exports.StudentGetAccessedRepositories = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        Repository.find({access: user._id, status: false})
          .then(repos => {
            return res.render('student/access_repositories', {repositories: repos, user: user});
          }).catch(next);
      }
    }).catch(next);
}

module.exports.StudentManagerSectionTask = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        Section.findById(req.params.sectionid)
          .then(section => {
            if (section.repository === req.params.repositoryid) {
              let _tasks = req.body.tasks;
              _tasks.forEach(_task => {
                //EditTask(_task.status, _task._id);
                Task.findByIdAndUpdate(_task._id, {$set: {status: _task.status}});
              });
            }
          }).catch(next);
      }
    }).catch(next);
}

module.exports.StudentGetRepository = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        Repository.findById(req.params.repositoryid)
          .populate('section')
          .exec(repo => {
            if (repo.user === user._id)
              return res.render('student/repository', {sections: repo.section});
            else return res.redirect('student');
          }).catch(next);
      }
    }).catch(next);
}

module.exports.StudentGetRepositories = (req, res, next) => {
  console.log('167 Student.js controll', req.user.id, req.user._id);
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        Repository.find({user: user})
          .then(repositories => {
            return res.render('student/index', {repositories: repositories, user: user});
          }).catch(next);
      } else {
        res.redirect('/');
      }
  }).catch(next);
}

module.exports.StudentNewRepositoryGetPage = (req, res, next) => {
  User.findOne(req.user).then(user => {
    if (user.role === STUDENT) {
      User.find({role: TEACHER}).then(teachers => {
        return res.render('student/new_repository', {teachers: teachers, user: user});
      }).catch(next);
    }
    else res.redirect('/');
  }).catch(next);
}

module.exports.StudentNewRepositoryCreate = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        req.checkBody('title', 'Укажите имя репозитории').notEmpty();
        req.checkBody('teachers').notEmpty();

        let errors = req.validationErrors();
        if (errors) {
          res.render('student/new_repository', {errors:errors});
        } else {
          let repository = new Repository();
          repository.title = req.body.title;
          repository.description = req.body.description;
          repository.user = user._id;
          repository.teacher = req.body.teachers;
          //
          repository.slugify();

          repository.save()
            .then(repo => {
              repo.section = Array.from(_Sections, x => GenerateSection(x, repo._id));
              repo.save(() => {
                req.flash('success', 'Репозиторий создан.');
                return res.redirect('/student');
              });
            }).catch(next);
        }
      }
    }).catch(next);
}

module.exports.StudentGetSectionTask = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        Repository.findById(req.params.repositoryid)
          .then(repo => {
            if (repo.user === user._id) {
              Section.findById(req.params.sectionid)
                .then(section => {
                  if (section.repository === req.params.repositoryid) {
                    return res.send(section);
                  }
                }).catch(next);
            }
          }).catch(next);
      }
    }).catch(next);
}