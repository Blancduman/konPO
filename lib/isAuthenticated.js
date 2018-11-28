module.exports = function(req, res ,next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('NON');
  req.flash('message', 'Зарегистрируйтесь или войдите!');
  res.redirect('/');
}