const router = require('express').Router(),
      UserRegistration = require('../controllers/User').UserRegistration,
      UserLogin = require('../controllers/User').UserLogin,
      GetHomePage = require('../controllers/User').GetHomePage,
      GetLoginPage = require('../controllers/User').GetLoginPage,
      GetRegistrationPage = require('../controllers/User').GetRegistrationPage,
      Logout = require('../controllers/User').Logout;

// Main
router.get('/', GetHomePage);
router.get('/login', GetLoginPage);
router.get('/registration', GetRegistrationPage);
router.post('/login', UserLogin);
router.post('/registration', UserRegistration);
router.get('/logout', Logout);

//Student

//Teacher

//Admin

module.exports = router;