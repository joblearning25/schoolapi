const {User}=require('../model/SchoolDb')
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')
// register logic
exports.registerAdmin=async (req,res)=>{
    const {name,email,password,secretKey}=req.body
    // verify admin secret Key
    if (secretKey!== process.env.secretKey){
        return res.json({message: "Unauthorized Account Creation"})
    }
    // check if the user exist
    const userExist=await User.findOne({email})
    if (userExist){
        res.json({message: "Email has already been taken"})
    }
    // hashing the password 
    const hashedPassword=await bcrypt.hash(password,10)
     const user=new User({
        name,
        email,
        password:hashedPassword,
        role:"admin",
        isActive: true,
        teacher:null,
        parent:null
     })
     const newUser=await user.save()


    res.status(201).json({message:"Admin Account created",newUser})
}

// login user 
exports.login=async (req,res)=>{
    const {email,password}=req.body
    // console.log(email,password)
    // check the user by the email
    const user =await User.findOne({email})
    if(!user){
        return res.json({message:"Invalid credentials.."})
    }
    // check if the user is active 
    if (!user.isActive){
        return res.json({message: "Your account has been deactivated"})
    }
    // check the password
    const isMatch =await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.json({mssage:"Invalid Credentials .."})
    }
    // generate the jwt Token 
    const token =jwt.sign(
        {userId:user._id, role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:'4h'}
    )

    res.json({
        message:"login successful",
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        }})
}
