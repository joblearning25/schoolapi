const {User,Parent,Classroom, Student}=require('../model/SchoolDb')

// get the children belonging to the logged in parent
exports.parentDash=async (req,res) => {
    try {
        // get the logged in user to link with parent
        const userId= req.user.userId
        const user= await User.findById(userId)
        .populate('parent')

        // extract the parent id from the user object
        const parent = user.parent

        // get children lnked to this parent 
        const children= await Student.find({parent:parent._id})
        .populate('classroom')
        res.status(200).json({parent,children})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
    
}