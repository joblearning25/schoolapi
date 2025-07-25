const express= require('express')
const router=express.Router()
const parentDashController= require('../controller/parentDashController')
// authorization
const {auth,authorizeRoles}=require('../middleware/auth')

router.get("/",auth,authorizeRoles("parent"),parentDashController.parentDash)
module.exports=router