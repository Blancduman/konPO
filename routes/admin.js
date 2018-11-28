const router = require('express').Router(),
      isAuth = require('../lib/isAuthenticated'),
      {
        AdminGetActiveTeachers,
        AdminGetPageNewTeacher,
        AdminGetTeacherProfile,
        AdminEditTeacherProfile,
        AdminGetDeactiveTeachers
      } = require('../controllers/Admin');


router.get('/', isAuth, AdminGetActiveTeachers);
router.get('/deactive_teachers', isAuth, AdminGetDeactiveTeachers);
router.get('/new_teacher', isAuth, AdminGetPageNewTeacher);
router.get('/teacher/:teacherid', isAuth, AdminGetTeacherProfile);
router.put('/teacher/:teacherid', isAuth, AdminEditTeacherProfile);


module.exports = router;