const mongoose = require('mongoose'),
      Repository = mongoose.model('Repository'),
      User = mongoose.model('User');

module.exports.AddNewRepository = (req, res, next) => {
  req.checkBody('newrope', 'Укажите имя репозитория').notEmpty();
  req.checkBody('teachers', 'Укажите преподавателей').notEmpty();
  
  let errors = req.validationErrors();
  if (errors) {
    res.render('')
  }

  console.log(req.body);
}

module.exports.GetNewRepository = (req, res, next) => {
  res.render('student/newrepository', {user: req.user});
}
