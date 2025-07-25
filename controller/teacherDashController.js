const {User,Assignment,Classroom}=require('../model/SchoolDb')

// teachers dashboard
exports.teacherDash=async (req,res) => {
    try {
        // the logged in user who is the techer
        const userId=req.user.userId
        console.log("userid lloged in",userId)
        // fetch the teachers's object id from User
        const user=await User.findById(userId)
        console.log("user",user)
        // check if the user is a teacher 
        if(!user || !user.teacher) return res.status(403).json({message:"Teacher not found or not linked to user"})
        
        // extract the teacher id from the user object
        const teacherId= user.teacher

        // aggregate classrooms to get the class count and student total
        const classStat=await Classroom.aggregate([
            {$match:{teacher:teacherId}},
            {
                $group:{
                    _id:null,
                    totalClasses:{$sum:1},
                    totalStudents:{$sum: {$size: "$students"}}
                }
            }
        ])

        // count Assignments
        const totalAssignments=await Assignment.countDocuments({postedBy:teacherId})
        // prepare results
        const result={
            totalClasses:classStat[0]?.totalClasses || 0,
            totalStudents:classStat[0]?.totalStudents || 0,
            totalAssignments
        }
        res.status(200).json(result)
    } catch (error) {
        res.statu(500).json({message:error.message})
    }
    
}