const router = require('express').Router(),
      isAuth = require('../lib/isAuthenticated'),
      { TeacherGetCurrentRepositories, 
        TeacherGetStudentActiveRepositories,
        TeacherGetClosedRepositoriesStudents,
        TeacherGetStudentActiveRepository,
        TeacherGetStudentClosedRepositories,
        TeacherGetStudentClosedRepository,
        TeacherDownloadStudentClosedRepository
      } = require('../controllers/Teacher');

router.get('/', isAuth, TeacherGetCurrentRepositories);
router.get('/student/active/:studentid', isAuth, TeacherGetStudentActiveRepositories);
router.get('/student/active/:studentid/:repositoryid', isAuth, TeacherGetStudentActiveRepository);
router.get('/student/closed', isAuth, TeacherGetClosedRepositoriesStudents);
router.get('/student/closed/:studentid', isAuth, TeacherGetStudentClosedRepositories);
router.get('/student/closed/:studentid/:repositoryid', isAuth, TeacherGetStudentClosedRepository);
router.get('/student/closed/download/:studentid/:repositoryid', isAuth, TeacherDownloadStudentClosedRepository);

//file system here but later

//messages


module.exports = router;