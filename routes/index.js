const router = require('express').Router()
      LoginController = require('../controllers/login').UserLogin,
      UserRegistration = require('../controllers/registration').UserRegistration,
      GetUserProfile = require('../controllers/profile').GetUserProfile;

router.get('/', function(req, res) {
  res.render('index');
})

router.get('/login', function(req, res) {
  res.render('login');
});
router.post('/login', LoginController);

router.get('/registration', function(req, res) {
  res.render('registration');
});
router.post('/registration', UserRegistration);
router.get('/profile', GetUserProfile);

module.exports = router;