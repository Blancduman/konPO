const router = require('express').Router(),
      isAuth = require('../lib/isAuthenticated'),
      { TeacherGetCurrentStudents, 
        TeacherGetActiveRepositories,
        TeacherGetStudentActiveRepositories,
        TeacherGetClosedRepositories,
        TeacherGetStudentActiveRepository,
        TeacherGetStudentClosedRepositories,
        TeacherGetStudentClosedRepository,
        TeacherDownloadStudentClosedRepository
      } = require('../controllers/Teacher');

router.get('/', isAuth, TeacherGetCurrentStudents);
router.get('/active/:studentid', isAuth, TeacherGetActiveRepositories);
router.get('/active/:studentid/:repositoryid', isAuth, TeacherGetStudentActiveRepository);
router.get('/closed', isAuth, TeacherGetClosedRepositories);
router.get('/closed/:studentid', isAuth, TeacherGetStudentClosedRepositories);
router.get('/closed/:studentid/:repositoryid', isAuth, TeacherGetStudentClosedRepository);
router.get('/closed/download/:studentid/:repositoryid', isAuth, TeacherDownloadStudentClosedRepository);

//file system here but later

//messages


module.exports = router;