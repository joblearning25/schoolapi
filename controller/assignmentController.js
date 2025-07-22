const {Assignment,User,Classroom}=require('../model/SchoolDb')
// get all assignments (Admin view)
// includes classroom and teacher information
exports.getAllAssignment=async (req,res) => {
    try {
        const assignments = await Assignment.find()
        .populate('classroom','name gradeLevel classYear')
        .populate('postedBy','name email phone')
        res.status(200).json(assignments)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
} 

// Add assignments Only Teachers
// validate user and classroom existense
exports.addAssignment=async (req,res) => {
    try {
        // get the loggedin user
        const userId=req.user.userId
        // fetch the user and populate the 'teacher' field if it exist
        const user=await User.findById(userId)
        .populate('teacher')
        // console.log(user)
        // console.log(user.teacher)

        // block non teacher from posting
        if (!user || !user.teacher) return res.status(403).json({message:"Only teacher can post"})
        
        // Extract classroomId from the request
        const {classroom:classroomId}= req.body
        // check if the classroom exist first
        const classroomExist=await Classroom.findById(classroomId)
        if(!classroomExist) return res.status(404).json({message:"Classroom Not Found"})
        
        // prepare the assignment data
        const assignmentData={
            ...req.body,
            postedBy:user.teacher._id
        }
        // save the assignment to db
        const newAssignment= new Assignment(assignmentData)
        const savedAssignment= await newAssignment.save()
        res.status(201).json(savedAssignment)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
    
}

// single assignment 
// include the classroom and teacher
exports.getAssignmentById=async (req,res) => {
    try {
        const assignment=await Assignment.findById(req.params.id)
        .populate('classroom')
        .populate('postedBy')
        // check if it exist
        if(!assignment) return res.status(500).json({message:"Assignment Not Found"})
        
        res.status(200).json(assignment)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
    
}

// update assignment
exports.updateAssignment=async (req,res) => {
    try {
        // find the assignment first
        const updateAssignment=await Assignment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        if(!updateAssignment) return res.status(500).json({message:"Assignment Not Found"})
        res.status(201).json({updateAssignment,message:"Assignment Updated Successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}