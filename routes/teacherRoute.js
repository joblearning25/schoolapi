const express= require('express')
const router=express.Router()
const teacherController= require('../controller/teacherController')
// authorization
const {auth,authorizeRoles}=require('../middleware/auth')

router.post("/",auth,authorizeRoles("admin"),teacherController.addTeacher)

// documents associated with the teacher
router.get('/myclasses',auth,teacherController.getAllTeachers)
router.get('/myassignments',auth,teacherController.getAllAssignment)

router.get('/',auth,teacherController.getAllTeachers)
router.get('/:id',auth,teacherController.getTeacherById)
router.put('/:id',auth, authorizeRoles('admin','teacher'),teacherController.updateTeacher)
router.delete('/:id',auth,authorizeRoles('admin'),teacherController.deleteTeacher)

module.exports=router