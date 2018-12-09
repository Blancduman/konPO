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


module.exports.StudentPostFilesToRepositoryDir = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        if (req.params.way === '0') {
          var form = new formidable.IncomingForm();
          form.uploadDir = path.join(__dirname, "/../private/tmp");
          form.maxFileSize = 50 * 1024 * 1024;
          form.maxFields = 20;

          form.on("fileBegin", (err, file) => {
            var fileNewName  = Date.now() + "_" + file.name;
            var fileLoadFile = "/../private/repositories/" + req.params.repositoryid + "/";
            ensureExists(__dirname + fileLoadFile, err => {
              if (err) console.log(err);
            });
            
            file.path = path.join(__dirname, fileLoadFile + fileNewName);
          });
          form.on('file', (field, file) => {
            console.log(file.name);
          })
          form.on('field', (field, value) => {
            console.log([field, file]);
          })
          form.on('end', () => {
            res.redirect('/student/repository/'+req.params.repositoryid);
          });
          form.on('error', (err) => {
            res.send(err);
          });
          
          form.parse(req);
        } else {
          var form = new formidable.IncomingForm();
          form.uploadDir = path.join(__dirname, "/../private/tmp");
          form.maxFileSize = 50 * 1024 * 1024;
          form.maxFields = 20;

          form.on("fileBegin", (err, file) => {
            var fileNewName  = Date.now() + "_" + file.name;
            var fileLoadFile = "/../private/repositories/" + req.params.repositoryid + "/" + req.params.way;
            ensureExists(__dirname +  fileLoadFile, err => {
              if (err) console.log(err);
            });
            
            file.path = path.join(__dirname, fileLoadFile +'/'+ fileNewName);
          });
          form.on('file', (field, file) => {
            console.log(file.name);
          })
          form.on('field', (field, value) => {
            console.log([field, file]);
          })
          form.on('end', () => {
            res.redirect('/student/repository/'+req.params.repositoryid);
          });
          form.on('error', (err) => {
            res.send(err);
          });
          form.parse(req);
        }
      }
    })
}

function aaa(data, way) {
  return Promise.all(
    [data.map(function(item) {
    if (fs.lstatSync(__dirname+'/../private/repositories/'+way+'/'+item, 'utf8').isDirectory())
      return item;
  }), data.map(function(item) {
    if (fs.lstatSync(__dirname+'/../private/repositories/'+way+'/'+item, 'utf8').isFile())
      return item;
  })]);
}

module.exports.StudentDeleteFileRepository = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        fs.exists(__dirname+'/../private/repositories/'+req.params.repositoryid+'/'+req.params.way+req.params[0], (exists) => {
          fs.unlink(__dirname+'/../private/repositories/'+req.params.repositoryid+'/'+req.params.way+req.params[0], (err) => {
            if (err) console.log(err);
            return res.end();
          });
        });
      }
    })
}

module.exports.StudentGetFileRepository = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        res.download(__dirname+'/../private/repositories/'+req.params.repositoryid+'/'+req.params.way+req.params[0]);
      }
    });
}
module.exports.StudentGetDirRepository = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        if (req.params.way === '0') {
          fs.readdir(__dirname+'/../private/repositories/'+req.params.repositoryid, (err, data) => {
          if (data !== undefined) {
            aaa(data, req.params.repositoryid).then(a => {
              b = [a[0].filter(el => {return el != null;}), a[1].filter(el => {return el != null;})]
              res.json({_dir: b[0], _file: b[1]});
            })
          } else res.json({_dir: [], _file: []});
        });
        } else {
          fs.readdir(__dirname+'/../private/repositories/'+req.params.repositoryid+'/'+req.params.way + req.params[0], (err, data) => {
            if (data !== undefined) {
              aaa(data, req.params.repositoryid+'/'+req.params.way + req.params[0]).then(a => {
                b = [a[0].filter(el => {return el != null;}), a[1].filter(el => {return el != null;})]
                res.json({_dir: b[0], _file: b[1]});
              })
            } else res.json({_dir: [], _file: []});
          });
        }
      }
    });
}

module.exports.StudentGetRepository = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === STUDENT) {
        Repository.findById(req.params.repositoryid)
          .populate('section')
          .exec((err,repo) => {
            if (repo.user._id.toString() === user._id.toString()) {
              fs.readdir(__dirname+'/../private/repositories/'+req.params.repositoryid, (err, data) => {
                aaa(data, req.params.repositoryid).then(a => {
                  return res.render('student/repository', {repository: repo, user: user, dirs: a[0].filter(el => {return el!=null;}), files: a[1].filter(el => {return el!=null;})});
                })
              })
            }
          });
      }
    }).catch(next);
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
        });
        form.on('end', () => {
          res.redirect('/student/profile');
        })
        form.on('error', (err) => {
          res.send(err);
        });
      }
  });
};
      

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
          return res.render('student/profile', {user: user});
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
            if (section.repository.id.toString('hex') === req.params.repositoryid) {
              let _tasks = JSON.parse(req.body.tasks);
              _tasks.forEach(_task => {
                Task.findById(_task.id).then(tsk => {
                  tsk.status = _task.status; 
                  tsk.save();
                });
              });
            }
            return res.json();
          }).catch(next);
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
          repository.slugify();

          repository.save()
            .then(repo => {
              repo.section = Array.from(_Sections, x => GenerateSection(x, repo._id));
              repo.save(() => {
                ensureExists(__dirname+'/../private/repositories/'+repo.id, (err) => {
                  if (err) 
                    return res.json(err);
                  _Sections.forEach(folder => {
                    ensureExists(__dirname+'/../private/repositories/'+repo.id+'/'+folder, (err) => {
                      if (err)
                        return res.json(err);
                    })
                  })
                  req.flash('success', 'Репозиторий создан.');
                  return res.redirect('/student');
                })
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
          .select('_id section status')
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
             
          });
      }
    }).catch(next);
}