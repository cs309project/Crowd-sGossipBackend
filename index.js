import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const src = process.env.db
const PORT = process.env.PORT || 5000
mongoose.set('strictQuery', false)
mongoose.connect(src).then(()=>console.log('database connection succesful'))

const server = app.listen(PORT,()=>{
    console.log('app running on port ',PORT)
})
