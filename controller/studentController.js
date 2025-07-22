// database
const {Student,Classroom,Parent}=require('../model/SchoolDb')
const multer =require('multer')
const  fs=require('fs')
const path=require('path')

// file loacation folder/directory
const  upload=multer({dest:'upload/'})
exports.uploadStudentPhoto=upload.single('photo')
exports.addStudent=async (req,res) => {
    try {
        // destructuring
        const {name,dateOfBirth,gender,admissionNumber,parentNationalId, classroomId}=req.body
        // check if parent exist by national id
        const parentExist=await Parent.findOne({nationalId:parentNationalId})
        if(!parent )return res.status(404).json({message:"Parent with provided Natinal Id not found"})
        // check if the student exist
        const studentExist=await Student.findOne({admissionNumber})
        if(studentExist) return res.json({message:"Addmission No has already been assigned to someone else"})
        // check if the class exist
        const classExist=await Classroom.findById(classroomId)
        if(!classExist) return res.status(500).json({message:"Classroom not found"})
        
        // prepare our upload file
        let photo=null
        if(req.file){
            const ext=path.extname(req.file.originalname)
            const newFileName=Date.now()+ext
            const newPath=path.join('uploads',newFileName)
            fs.renameSync(req.file.path,newPath)
            photo=newPath.replace(/\\/g,'/')
        }

        // create student Document
        const newStudent=new Student({
            name,
            dateOfBirth,
            gender,
            admissionNumber,
            photo,
            parent:parentExist._id,
            classroom:classExist._id
        })
        const savedStudent=await newStudent.save()

        // adding a student to a class using the $addToSet to pevent duplicates
        await Classroom.findByIdAndUpdate(
            classExist._id,
            {$addToSet:{students:savedStudent._id}}
        )

        res.status(201).json(savedStudent)
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
    
}