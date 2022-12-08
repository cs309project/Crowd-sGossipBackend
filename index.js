const express = require('express')
const app = express()
const mongoose = require('mongoose')
const src = "mongodb+srv://CodesGossip:code12345678@codesgossip.zsb2lgn.mongodb.net/?retryWrites=true&w=majority"
const server = app.listen(8000,()=>{
    console.log('app running on port ',8000)
})
mongoose.set('strictQuery', false)
mongoose.connect(src).then(()=>console.log('database connection succesful'))