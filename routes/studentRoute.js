const express= require('express')
const router=express.Router()
const studentController= require('../controller/studentController')
// authorization
const {auth,authorizeRoles}=require('../middleware/auth')

router.post("/",auth,authorizeRoles("admin"),studentController.uploadStudentPhoto,studentController.addStudent)
router.get('/',auth,studentController.getAllStudents)
router.get('/:id',auth,studentController.getStudentById)
router.put('/:id',auth, authorizeRoles('admin'),studentController.updateClassrooom)
router.delete('/:id',auth,authorizeRoles('admin'),studentController.deleteClassroom)

module.exports=router