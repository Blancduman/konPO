const router = require('express').Router(),
      isAuth = require('../lib/isAuthenticated'),
      { TeacherGetCurrentRepositories } = require('../controllers/Teacher');

router.get('/', isAuth, TeacherGetCurrentRepositories);


//file system here but later

//messages


module.exports = router;