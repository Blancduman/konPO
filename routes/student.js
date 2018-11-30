const router = require('express').Router(),
      StudentGetRepositories = require('../controllers/Student').StudentGetRepositories,
      StudentNewRepositoryGetPage = require('../controllers/Student').StudentNewRepositoryGetPage,
      StudentNewRepositoryCreate = require('../controllers/Student').StudentNewRepositoryCreate,
      StudentGetSectionTask = require('../controllers/Student').StudentGetSectionTask,
      StudentManagerSectionTask = require('../controllers/Student').StudentManagerSectionTask,
      StudentGetRepository = require('../controllers/Student').StudentGetRepository,
      StudentGetAccessedRepositories = require('../controllers/Student').StudentGetAccessedRepositories,
      StudentDownloadAccessedRepository = require('../controllers/Student').StudentDownloadAccessedRepository,
      StudentGetClosedRepositories = require('../controllers/Student').StudentGetClosedRepositories,
      StudentGetProfilePage = require('../controllers/Student').StudentGetProfilePage,
      StudentEditProfile = require('../controllers/Student').StudentEditProfile,
      isAuth = require('../lib/isAuthenticated');

router.get('/', isAuth, StudentGetRepositories);

router.get('/new_repository', isAuth, StudentNewRepositoryGetPage);
router.post('/new_repository', isAuth, StudentNewRepositoryCreate);

router.get('/repository/:repositoryid/:sectionid', isAuth, StudentGetSectionTask);
router.put('/repository/:repositoryid/:sectionid', isAuth, StudentManagerSectionTask);
router.get('/repository/:repositoryid', isAuth, StudentGetRepository);

router.get('/accessed_repositories', isAuth, StudentGetAccessedRepositories);
router.get('/accessed_repositories/:repositoryid', isAuth, StudentDownloadAccessedRepository);

router.get('/closed_repositories', isAuth, StudentGetClosedRepositories);

router.get('/profile', isAuth, StudentGetProfilePage);
router.put('/profile', isAuth, StudentEditProfile);


//file system here but later

//messages


module.exports = router;