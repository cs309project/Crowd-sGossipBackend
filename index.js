import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './src/routes/user.route.js'
import postRouter from "./src/routes/post.route.js";
dotenv.config()
const app = express()
app.use(userRouter)
app.use(postRouter)
const src = process.env.db
const PORT = process.env.PORT || 5000
mongoose.set('strictQuery', false)
mongoose.connect(src).then(()=>console.log('database connection succesful'))

const server = app.listen(PORT,()=>{
    console.log('app running on port ',PORT)
})
