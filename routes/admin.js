const router = require('express').Router(),
      isAuth = require('../lib/isAuthenticated'),
      {
        AdminGetActiveTeachers,
        AdminAddNewTeacher,
        AdminGetTeacherProfile,
        AdminEditTeacherProfile,
        AdminGetDeactiveTeachers,
        AdminGetPageNewTeacher
      } = require('../controllers/Admin');


router.get('/', isAuth, AdminGetActiveTeachers);
router.get('/deactive_teachers', isAuth, AdminGetDeactiveTeachers);
router.get('/new_teacher', isAuth, AdminGetPageNewTeacher);
router.post('/new_teacher', isAuth, AdminAddNewTeacher);
router.get('/teacher/:teacherid', isAuth, AdminGetTeacherProfile);
router.put('/teacher/:teacherid', isAuth, AdminEditTeacherProfile);


module.exports = router;