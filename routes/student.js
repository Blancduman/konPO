const router = require('express').Router(),
      isAuth = require('../lib/isAuthenticated'),
    { StudentGetRepositories,
      StudentNewRepositoryGetPage,
      StudentNewRepositoryCreate,
      StudentGetSectionTask,
      StudentManagerSectionTask,
      StudentGetRepository,
      StudentGetAccessedRepositories,
      StudentDownloadAccessedRepository,
      StudentGetClosedRepositories,
      StudentGetProfilePage,
      StudentEditProfile,
      StudentDownloadClosedRepository,
      StudentGetFileRepository,
      StudentGetDirRepository,
      StudentPostImageToProfile } = require('../controllers/Student');

router.get('/', isAuth, StudentGetRepositories);

router.get('/new_repository', isAuth, StudentNewRepositoryGetPage);
router.post('/new_repository', isAuth, StudentNewRepositoryCreate);

router.get('/repository/:repositoryid/:sectionid', isAuth, StudentGetSectionTask);
router.put('/repository/:repositoryid/:sectionid', isAuth, StudentManagerSectionTask);
router.get('/repository/:repositoryid', isAuth, StudentGetRepository);
router.get('/repository/:repositoryid/folder/:way', isAuth, StudentGetDirRepository);

router.get('/accessed_repositories', isAuth, StudentGetAccessedRepositories);
router.get('/accessed_repositories/:repositoryid', isAuth, StudentDownloadAccessedRepository);

router.get('/closed_repositories', isAuth, StudentGetClosedRepositories);
router.get('/closed_repository/:repositoryid', isAuth, StudentDownloadClosedRepository);

router.get('/profile', isAuth, StudentGetProfilePage);
router.put('/profile', isAuth, StudentEditProfile);
router.post('/profile', isAuth, StudentPostImageToProfile);


//file system here but later

//messages


module.exports = router;