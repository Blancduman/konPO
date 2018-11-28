module.exports = function(req, res ,next) {
  if (req.isAuthenticated()) {
    console.log('YES');
    return next();
  }
  console.log('NON');
  req.flash('message', 'Зарегистрируйтесь или войдите!');
  res.redirect('/');
}