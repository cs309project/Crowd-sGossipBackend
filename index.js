import express from 'express'
import mongoose from 'mongoose'
import router from './src/routes/index.js'
import config from './config.js'
const app = express()
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use(router)
const src = config.db
const PORT = config.port || 5000
mongoose.set('strictQuery', false)
mongoose.connect(src).then(()=>console.log('database connection succesful'))

const server = app.listen(PORT,()=>{
    console.log('app running on port ',PORT)
})
