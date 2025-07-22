const {Classroom}=require('../model/SchoolDb')

// All classrooms

exports.addClassrom=async (req,res)=>{
    try {
        // recieve data from client 
        const newClassroom= req.body
        console.log(newClassroom)
        
        const savedClassroom=new Classroom(newClassroom)
        await savedClassroom.save()
        res.json(savedClassroom)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// fetching classroom
exports.getAllClassrooms= async (req,res)=>{
    try {
        const classrooms= await Classroom.find()
            .populate('teacher','name email phone')
            .populate('students', 'name addmissionNumber')
        res.json(classrooms)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// get a single classroom
exports.getClassroomById=async (req,res) => {
    try {
        const classroom= await Classroom.findById(req.params.id)
            .populate('teacher','name email phone')
            .populate('students','name admissionNumber')
        if (!classroom) return res.status(404).json({message:"classroom not found"})
        res.status(200).json(classroom)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
    
}

// Update the classroom
exports.updateClassrooom=async (req,res)=> {
    try {
        const updateClassroom=await Classroom.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        if (!updateClassroom) return res.status(404).json({message :"Classroom Not Found"})
        res.status(201).json(updateClassroom)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
    
}

// delete classroom
exports.deleteClassroom=async (req,res) => {
    // find the class room and delete by id 
    try {
        const deletedClassroom=await Classroom.findByIdAndDelete(req.params.id)
        if (!deletedClassroom) return res.status(500).json({message:"Classroom Not Found"})
        res.json({message:"Classroom deleted successfully"}) 
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}