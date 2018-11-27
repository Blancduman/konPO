const router = require('express').Router(),
      StudentGetRepositories = require('../controllers/Student').StudentGetRepositories,
      StudentNewRepositoryGetPage = require('../controllers/Student').StudentNewRepositoryGetPage,
      StudentNewRepositoryCreate = require('../controllers/Student').StudentNewRepositoryCreate,
      StudentGetSectionTask = require('../controllers/Student').StudentGetSectionTask,
      isAuth = require('../lib/isAuthenticated');

router.get('/', isAuth, StudentGetRepositories);
router.get('/new_repository', isAuth, StudentNewRepositoryGetPage);
router.post('/new_repository', isAuth, StudentNewRepositoryCreate);
router.get('/repository/:repositoryid/:sectionid', isAuth, StudentGetSectionTask);

module.exports = router;