module.exports = function(req, res ,next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('message', 'Зарегистрируйтесь или войдите!');
  res.redirect('/');
}