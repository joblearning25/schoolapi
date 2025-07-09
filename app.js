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



// connction to the database
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log("MongoDB connection error",err))

const PORT=3000
app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}`)
})