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

module.exports.StudentManagerSectionTask = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (!user) {
        req.clearCookie('usertoken', {path: '/'});
        return res.render('index');
      }
      if (user.role === STUDENT) {
        Section.findById(req.params.sectionid)
          .then(section => {
            if (section.repository === req.params.repositoryid) {
              let _tasks = req.body.tasks;
              _tasks.forEach(_task => {
                EditTask(_task.status, _task._id);
              });
            }
          }).catch(next);
      }
    }).catch(next);
}

//
//          переделать в костанту для getrepo
//
module.exports.StudentGetSectionList = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (!user) {
        req.clearCookie('usertoken', {path: '/'});
        return res.render('index');
      }
      if (user.role === STUDENT) {
        Repository.findById(req.params.repositoryid)
          .populate('section')
          .exec((err, repo) => {
            if (err)
              return console.log(err);
            return res.send(repo.section);
          }).catch(next);
      }
    }).catch(next);
}

module.exports.StudentGetRepository = (req, res, next) => {
  
}

module.export.StudentGetRepositories = (req, res, next) => {
  User.findOne(req.user).then(user => {
    if (!user) {
      req.clearCookie('usertoken', {path: '/'});
      return res.render('index');
    }
    if (user.role === STUDENT) {
      Repository.find({user: user})
        .then(repositories => {
          return res.render('student/index', {repositories: repositories});
        }).catch(next);
    }
  }).catch(next);
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
  User.findOne(req.user)
    .then(user => {
      if (!user) {
        req.clearCookie('usertoken', {path: '/'});
        return res.render('index');
      }
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
              repo.save()
                .then(() => {
                  req.flash('success', 'Репозиторий создан.');
                  return res.redirect('/student/repository/'+repo._id);
                }).catch(next);
            }).catch(next);
        }
      }
    }).catch(next);
}

// module.exports.StudentGetSectionTask = (req, res, next) => {
//   User.findOne(req.user)
//     .then(user => {
//       if (!user) {
//         req.clearCookie('usertoken', {path: '/'});
//         return res.render('index');
//       }
//       if (user.role === STUDENT) {
//         Section.findById(req.params.sectionid)
//           .then(section => {
//             if (section.repository === req.params.repositoryid) {
//               return res.send(section);
//             }
//           }).catch(next);
//       }
//     }).catch(next);
// }

module.exports.StudentGetSectionTask = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (!user) {
        req.clearCookie('usertoken', {path: '/'});
        return res.render('index');
      }
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