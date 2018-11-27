const router = require('express').Router(),
      asyncMiddleware = require('../middleware/asyncmiddleware'),
      CookieChecker = require('../controllers/User').CookieChecker;

router.get('/', asyncMiddleware(CookieChecker));

module.exports = router;