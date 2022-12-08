import express from 'express'
import mongoose from 'mongoose'

const app = express()
const src = "mongodb+srv://CodesGossip:code12345678@codesgossip.zsb2lgn.mongodb.net/?retryWrites=true&w=majority"

mongoose.set('strictQuery', false)
mongoose.connect(src).then(()=>console.log('database connection succesful'))

const server = app.listen(8000,()=>{
    console.log('app running on port ',8000)
})
