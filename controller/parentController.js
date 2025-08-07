const {Parent,User}=require('../model/SchoolDb')
const bcrypt = require('bcrypt')

// Add Parent 
exports.addParent=async (req,res) => {
    try {
        // destructure variable to check if the parent exist 
        const {email,nationalId, name}=req.body
        // check using email
        const existingParentEmail=await User.findOne({email})
        if(existingParentEmail) return res.json({message:"Email already taken"})
        // check using the id 
        const existingParentId=await Parent.findOne({nationalId})
        console.log("nationalId", nationalId)
        if(existingParentId) return res.json({message:"National Id has already been registered"})
        // when all check are good we now save the new parent
    
        const newParent =new Parent(req.body)
        const savedParent= await newParent.save()
        
        // creating the parent user account
        const defaultPassword='parent1234'
        const hashedPassword=await bcrypt.hash(defaultPassword,10)
        console.log(hashedPassword)

        const newUser = new User({
            name,email,
            password:hashedPassword,
            role:"parent",
            parent:savedParent._id
        })
        await newUser.save()
        console.log(newUser)
        res.status(201).json({parent:savedParent,newUser,message:"Parent ad user account created successfully"})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
    
}

// get all parents
exports.getAppParents= async (req,res) => {
    try {
        const parents=await Parent.find()
        res.json(parents)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
    
}

// update parent by admin
exports.updateParent=async (req,res) => {
    try {
        const updatedParent= await Parent.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        if(!updatedParent) return res.status(404).json({message:"Parent is not found"})
        res.status(201).json(updatedParent)
    } catch (error) {
        res.status(500).json({message:error.message})
    }        
}

exports.deleteParent= async (req,res) => {
    try {
        const deletedParent=await Parent.findByIdAndDelete(req.params.id)
        if(!deletedParent) return res.status(404).json({message:"Parent Not Found"})
        // delete also the asociated user account

        await User.findOneAndDelete({parent:req.params.id})
        res.status(200).json({message: "Parent account deleted successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
    
}

exports.getParentById=async (req,res) => {
    try {
        const parent=await Parent.findOne({nationalId:req.params.id})
        if(!parent) return res.json({message:'Parent Not Found'})
            res.json(parent)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}