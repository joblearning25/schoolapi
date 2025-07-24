// Entry file
const express=require('express')
const mongoose=require('mongoose')
const cors =require('cors')
require('dotenv').config()

// middleware
const app=express()
app.use(express.json())
app.use(cors())
// static file accessibility
app.use("/uploads",express.static('uploads'))

// Login/Register routes
const userAuth=require('./routes/loginRoute')
app.use('/api/user/Auth',userAuth)

// classrooms routes
const classrooms=require('./routes/classroomRoute')
app.use('/api/classroom',classrooms)

// teacher routes
const teacher=require('./routes/teacherRoute')
app.use('/api/teacher',teacher)

// parent routes
const parent=require('./routes/parentRoute')
app.use('/api/parent',parent)


// assignment routes
const assignment=require('./routes/assignmentRoute')
app.use('/api/assignment',assignment)

// student routes
const student=require('./routes/studentRoute')
app.use('/api/student',student)

// admindash routes
const admindash=require('./routes/adminDashRoute')
app.use('/api/admindash',admindash)

// connction to the database
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log("MongoDB connection error",err))

const PORT=3000
app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}`)
})