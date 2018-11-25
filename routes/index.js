const router = require('express').Router();

router.get('/', function(req, res) {
  res.render('index');
})

router.get('/login', function(req, res) {
  res.render('login');
})

router.get('/registration', function(req, res) {
  res.render('registration');
})

module.exports = router;