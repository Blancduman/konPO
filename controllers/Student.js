const uuidv4 = require('uuid/v4'),
      mongoose = require('mongoose'),
      User = mongoose.model('User'),
      Repository = mongoose.model('Repository'),
      Section = mongoose.model('Section'),
      Task = mongoose.model('Task'),
      Message = mongoose.model('Message'),
      STUDENT = require('../constants').STUDENT,
      TEACHER = require('../constants').TEACHER,
      _Sections = require('../constants').SECTIONS,
      path = require('path'),
      formidable  = require('formidable'),
      fs = require('fs');

const GenerateSection = (name, repoId) => {
  let section = new Section();
  section.name = name;
  section.repository = repoId;
  section.slugify();
  section.save();
  return section;
}

const ensureExists = (path, cb) => {
  fs.mkdir(path, err => {
    if (err) {
      if (err.code == 'EEXIST') cb(null);
      else cb(err);
    } else cb(null);
  });
}

module.exports.StudentPostImageToProfile = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
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
          // var extension = path.extname(file.name),
          //     index = (file.name).lastIndexOf(extension),
          //     onlyName = (file.name).substr(0, index),
          //     newfileName = onlyName + Date.now() + extension;
          //     var fileName = path.join(__dirname, "/../public/images/"+user._id+"/"+newfileName);
          //     file.path = fileName;
        });
        form.on('end', () => {
          res.redirect('/student/profile');
        })
        form.on('error', (err) => {
          res.send(err);
        });
        // var form = new formidable.IncomingForm();
        // var files = [];
        // form.uploadDir = '../public/multipart';
        // form.keepExtensions = true;
        // form.maxFieldsSize   = 5 * 1024 * 1024;
        
        // form.parse(req, (err, fields, files) => {
        //   console.log('a', files);
        //   var imageFile = files.newprofilepicture;
        //   if (imageFile) {
        //     var name = imageFile.name,
        //         path = imageFile.path,
        //         type = imageFile.type;
        //     if (type.indexOf('image') != -1) {
        //       var outputPath = "..public/multipart/" + name + "_" + Date.now();
        //       fs.rename(path, outputPath, (err) => {
        //         res.redirect('/student/profile');
        //       });
        //     } else {
        //       fs.unlink(path, (err) => {
        //         res.send(400);
        //       })
        //     }
        //   } else { 
        //     res.send(404);
        //   }
        // })
      }
  });
}

        // form.parse(req);
        // form
        //   .on('fileBegin',function(name,file){
        //     file.path = __dirname + '/data/';
        //   })
        //   .on('progress',function(bytesReceived,bytesExpected){
        //       console.log('progress-' + bytesReceived +'/' + bytesExpected);
        //   })
        //   .on('aborted', function(){
        //       console.log('aborted');
        //   })
        //   .on('error', function(){
        //       console.log('error');
        //   })
        //   .on('end', function(){
        //       console.log('end');
        //   });
      

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
          console.log(errors);
          return res.render('student/profile', {errors:errors, user: user});
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

module.exports.StudentGetClosedRepositories = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        Repository.find({user: user._id, status: false})
          .populate({
            path: 'teacher',
            select: 'firstname lastname middlename'
          })
          .exec()
          .then(repos => {
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
          .populate({
            path: 'teacher',
            select: '_id firstname lastname middlename'
          })
          .exec()
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
          .exec((err,repo) => {
            if (repo.user._id.toString() === user._id.toString()) {
              return res.render('student/repository', {repository: repo, user: user});
            }
          });
      }
    }).catch(next);
}

module.exports.StudentDownloadClosedRepository = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        Repository.findById(req.params.repositoryid)
          .then(repo => {
            if(repo.user._id.toString() === user._id.toString()) {
              //return res.send()
            }
          })
      }
    })
}

module.exports.StudentGetRepositories = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        Repository.find({user: user, status: true})
          .populate('teacher')
          .exec((err, repos) => {
            if (err) {console.log(err); return;}
            return res.render('student/index', {repositories: repos, user: user});
          });
      } 
    }
  ).catch(next);
}

module.exports.StudentNewRepositoryGetPage = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        User.find({role: TEACHER, status: true}).then(teachers => {
          return res.render('student/new_repository', {teachers: teachers, user: user});
        }).catch(next);
      }
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
          repository.user = user;
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