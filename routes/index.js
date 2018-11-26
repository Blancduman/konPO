const router = require('express').Router()
      LoginController = require('../controllers/login').UserLogin,
      UserRegistration = require('../controllers/registration').UserRegistration,
      GetUserProfile = require('../controllers/profile').GetUserProfile,
      isAuth = require('../lib/isAuthenticated'),
      GetNewRepository = require('../controllers/newrepository').GetNewRepository,
      AddNewRepository = require('../controllers/newrepository').AddNewRepository;

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
router.get('/profile', isAuth, GetUserProfile);
router.get('/newrepository', isAuth, GetNewRepository);
router.post('/newrepository', isAuth, AddNewRepository);

module.exports = router;