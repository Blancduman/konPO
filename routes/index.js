const router = require('express').Router(),
      UserRegistration = require('../controllers/User').UserRegistration,
      UserLogin = require('../controllers/User').UserLogin,
      GetHomePage = require('../controllers/User').GetHomePage,
      GetLoginPage = require('../controllers/User').GetLoginPage,
      GetRegistrationPage = require('../controllers/User').GetRegistrationPage;

const StudentRouter = require('./student'),
      TeacherRouter = require('./teacher'),
      AdminRouter = require('./admin');
      // LoginController = require('../controllers/login').UserLogin,
      // UserRegistration = require('../controllers/registration').UserRegistration,
      // GetUserProfile = require('../controllers/profile').GetUserProfile,
      // isAuth = require('../lib/isAuthenticated'),
      // GetNewRepository = require('../controllers/newrepository').GetNewRepository,
      // AddNewRepository = require('../controllers/newrepository').AddNewRepository;

// Main
router.get('/', GetHomePage);
router.get('/login', GetLoginPage);
router.get('/registration', GetRegistrationPage);
router.post('/login', UserLogin);
router.post('/registration', UserRegistration);

router.use('/student', StudentRouter);
router.use('/teacher', TeacherRouter);
router.use('/bigboi', AdminRouter);

//Student

//Teacher

//Admin

module.exports = router;