const router = require('express').Router(),
      isAuth = require('../lib/isAuthenticated'),
      { TeacherGetCurrentStudents, 
        TeacherGetStudentActiveRepositorySection,
        TeacherCloseStudentRepository,
        TeacherGetStudentActiveRepositories,
        TeacherGetClosedStudentsRepositories,
        TeacherGetStudentActiveRepository,
        TeacherGetStudentClosedRepositories,
        TeacherGetStudentClosedRepository,
        TeacherDownloadStudentClosedRepository,
        TeacherPostStudentActiveRepositorySection,
        TeacherGiveAccessStudents
      } = require('../controllers/Teacher');

router.get('/', isAuth, TeacherGetCurrentStudents);
router.get('/active/:studentid', isAuth, TeacherGetStudentActiveRepositories);
router.get('/active/:studentid/:repositoryid', isAuth, TeacherGetStudentActiveRepository);
router.post('/active/:studentid/:repositoryid', isAuth, TeacherCloseStudentRepository);
router.get('/active/:studentid/:repositoryid/:sectionid', isAuth, TeacherGetStudentActiveRepositorySection);
router.post('/active/:studentid/:repositoryid/:sectionid', isAuth, TeacherPostStudentActiveRepositorySection);
router.get('/closed', isAuth, TeacherGetClosedStudentsRepositories);
router.get('/closed/:studentid', isAuth, TeacherGetStudentClosedRepositories);
router.get('/closed/:studentid/:repositoryid', isAuth, TeacherGetStudentClosedRepository);
router.post('/closed/:studentid/:repositoryid', isAuth, TeacherGiveAccessStudents);
router.get('/closed/download/:studentid/:repositoryid', isAuth, TeacherDownloadStudentClosedRepository);

//file system here but later

//messages


module.exports = router;