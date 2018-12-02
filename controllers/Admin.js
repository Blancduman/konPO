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

module.exports.AdminGetTeacherProfile = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === ADMIN) {
        User.findById(req.params.teacherid)
          .then(_teacher => {
            if (!_teacher) {
              return res.redirect('/admin');
            }
            return res.render('admin/teacher_profile', {
              user: user,
              teacher: _teacher
            });
          })
      }
    }).catch(next);
}

module.exports.AdminEditTeacherProfile = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === ADMIN) {
        User.findById(req.params.teacherid)
          .then(_teacher => {
            if (!_teacher) {
              return res.redirect('/admin');
            }
            let email = req.body.email,
              firstname = req.body.firstname,
              lastname = req.body.lastname,
              middlename = req.body.middlename,
              phone = req.body.phone,
              status = req.body.status,
              password = req.body.password,
              password2 = req.body.password2;
            if (email) {
              req.checkBody('email', 'Укажите почту.').notEmpty()
              req.checkBody('email', 'Укажите правильную почту.').isEmail();
            }
            if (firstname) {
              req.checkBody('firstname', 'Укажите имя.').notEmpty();
            }
            if (lastname)
              req.checkBody('lastname', 'Укажите фамилию.').notEmpty();
            if (middlename)
              req.checkBody('middlename', 'Укажите отчество.').notEmpty();
            if (password) {
              req.checkBody('password', 'Укажите пароль.').notEmpty()
              req.checkBody('password', 'Пароли не совпадают.').equals(password2);
            }
            if (phone)
              req.checkBody('phone', 'Укажите номер.').notEmpty();
            if (status !== _teacher.status)
              _teacher.status = status;
            let errors = req.validationErrors();
            if (errors) {
              res.render('admin/teacher_profile', {
                errors: errors,
                user: _teacher
              });
            } else {
              if (email) _teacher.email = email;
              if (firstname) _teacher.firstname = firstname;
              if (lastname) _teacher.lastname = lastname;
              if (middlename) _teacher.middlename = middlename;
              if (password) _teacher.setPassword(password);
              if (phone) _teacher.phone = phone;

              _teacher.save();
            }
          }).catch(next);
      }
    }).catch(next);
}

module.exports.AdminGetActiveTeachers = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === ADMIN) {
        User.find({
            role: TEACHER,
            status: true
          })
          .then(_teachers => {
            return res.render('admin/index', {
              user: user,
              teachers: _teachers
            });
          })
      }
    }).catch(next);
}

module.exports.AdminGetDeactiveTeachers = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === ADMIN) {
        User.find({
            role: TEACHER,
            status: false
          })
          .then(_teachers => {
            return res.render('admin/deactive_teachers', {
              teachers: _teachers,
              user: user
            });
          })
      }
    }).catch(next);
}

module.exports.AdminGetPageNewTeacher = (req, res, next) => {
  User.findOne(req.user)
    .then(user => {
      if (user.role === ADMIN) {
        return res.render('admin/new_teacher', {
          user: user
        });
      }
    }).catch(next);
}

module.exports.AdminAddNewTeacher = (req, res, next) => {
  req.checkBody('username', 'Укажите логин.').notEmpty();
  req.checkBody('email', 'Укажите почту.').notEmpty().isEmail();
  req.checkBody('firstname', 'Укажите имя.').notEmpty();
  req.checkBody('lastname', 'Укажите фамилию.').notEmpty();
  req.checkBody('middlename', 'Укажите отчество.').notEmpty();
  req.checkBody('password', 'Укажите пароль').notEmpty().equals(req.body.password2);
  var errors = req.validationErrors();
  if (errors) {
    res.render('admin/new_teacher', {
      errors: errors
    });
  } else {
    User.findOne(req.user)
      .then(user => {
        if (user.role === ADMIN) {
          User.findOne({
              username: req.body.username
            })
            .then(user => {
              if (user) {
                req.flash('message', 'Пользователь с таким логином уже существует.');
                res.redirect('admin/new_teacher');
              } else {
                const newUser = new User({
                  username: req.body.username,
                  email: req.body.email,
                  firstname: req.body.firstname,
                  lastname: req.body.lastname,
                  middlename: req.body.middlename,
                  phone: req.body.phone,
                  image: 'https://pp.userapi.com/c851528/v851528089/5242f/15BkorO2nJE.jpg',
                  role: TEACHER,
                });
                newUser.setPassword(req.body.password);
                newUser
                  .save(() => {
                    req.flash('message', 'Преподаватель создан');
                    return res.redirect('/admin');
                  });
              }
            }).catch(next);
        }
      });
  }
}