const express= require('express')
const router=express.Router()
const parentController= require('../controller/parentController')
// authorization
const {auth,authorizeRoles}=require('../middleware/auth')

router.post("/",auth,authorizeRoles("admin"),parentController.addParent)
router.get('/',auth,parentController.getAppParents)
// router.get('/:id',auth,parentController.getClassroomById)
router.put('/:id',auth, authorizeRoles('admin'),parentController.updateParent)
router.delete('/:id',auth,authorizeRoles('admin'),parentController.deleteParent)

module.exports=router