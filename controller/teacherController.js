const {Teacher,User, Classroom, Assignment}= require('../model/SchoolDb')
const bcrypt= require('bcrypt')

// add teacher
exports.addTeacher= async (req,res) => {
    try {
        // check if teacher exist    
        const {email}=req.body
        const existUserEmail=await User.findOne({email})
        if (existUserEmail) return  res.json({message:"Email already taken"})

        const existEmail=await Teacher.findOne({email})
        if (existEmail) return  res.json({message:"Email of the teacher already taken"})
        // create the teacher
        const newTeacher= new Teacher(req.body)
        const savedTeacher=await newTeacher.save()

        // we create a corresponding user document
        // default password
        const defaultPassword="teacher1234"
        const password=await bcrypt.hash(defaultPassword,10)

        const newUser= new User({
            name:savedTeacher.name,
            email:savedTeacher.email,
            password,
            role:"teacher",
            teacher:savedTeacher._id
        })
        await newUser.save()
        res.status(201).json({message:"Teacher Registered successfully",teacher:savedTeacher})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// get all teachers
exports.getAllTeachers=async (req,res) => {
    try {
        const teachers=await Teacher.find()
        res.status(200).json(teachers)
    } catch (error) {
        res.status(500).json({message:error.message})   
    }
}

// get teacherById
exports.getTeacherById=async (req,res) => {
    try {
        const teacher= await Teacher.findById(req.params.id)
        if (!teacher) return res.status(404).json({message: "Teacher not Found"})
        res.status(200).json(teacher)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

exports.updateTeacher=async (req,res) => {
    try {
        const teacherId=req.params.id
        const userId=req.user.userId
        const updateData=req.body
        // check if email exists
        const existUser= await User.findById(userId)
        if(!existUser){
            return res.status(404).json({message:"User not found"})
        }
        const existTeacher= await Teacher.findById(teacherId)
        if(!existTeacher){
            return res.status(404).json({message:"Teacher not found"})
        }
        if(updateData.password && req.user.role =="admin"){
            return res.status(403).json({message:"Permission denied"})
        }
        console.log(existUser.teacher.toString())
        console.log(teacherId)
        if(req.user.role=="teacher" && existUser.teacher.toString()!==teacherId){
            return res.status(403).json({message:"Access denied"})
        }
        if(updateData.password){
            const hashPassword= await bcrypt.hash(updateData.password,10)
            updateData.password=hashPassword            
        }0
        const user= await User.findOne({teacher:teacherId})
        const savedUser= await User.findByIdAndUpdate(
        user._id,updateData,{new:true})
        const savedTeacher= await Teacher.findByIdAndUpdate(teacherId,updateData,{new:true})
        res.json({message:"Teacher updated"})

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
// delete teacher
exports.deleteTeacher=async (req,res) => {
    try {
        // teacher id from params
        const teacherId=req.params.id
        // console.log(teacherId)
        // delete teacher
        const deletedTeacher=await Teacher.findByIdAndDelete(teacherId)
        if(!deletedTeacher) return res.status(404).json({message:"Teacher Not Found"})
        // unassign teacher from any classroom
        await Classroom.updateMany(
            {teacher:teacherId},
            {$set:{teacher:null}})
        res.status(200).json({message:"Teacher Deleted successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }    
}

// get Teachers Classes
exports.getMyClasses=async (req,res) => {
    try {
        // logged in user
        const userId=req.user.userId
        // find all classes for the teacher
        const user=await User.findById(userId)
            .populate('teacher')

        // check if user exist and is linked to a teacher
        if(!user || !user.teacher) return res.status().json({message:"Teacher Not Found"})
        
        const classes =await Classroom.find({teacher: user.teacher._id})
            .populate('students')  //get also students in that class
        res.status(200).json(classes) 
    } catch (error) {
        res.status(500).json({message:error.message})
    }
    
}
// get teachers assignment
// includes classroom and teacher information
exports.getAllAssignment=async (req,res) => {
    try {
        // logged in user
        const userId=req.user.userId
        const user =await User.findById(userId)
        .populate('teacher')

        const assignments = await Assignment.find({postedBy:user.teacher._id})
        .populate('classroom','name gradeLevel classYear')
        .populate('postedBy','name email phone')
        res.status(200).json(assignments)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
} 

