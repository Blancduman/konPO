const router = require('express').Router(),
      isAuth = require('../../lib/setcookie'),
      StudentGetRepositories = require('../../controllers/student').StudentGetRepositories,
      StudentNewRepositoryGetPage = require('../../controllers/student').StudentNewRepository;


router.get('/', isAuth, StudentGetRepositories);

router.get('/new_repository', isAuth, StudentNewRepositoryGetPage)