import express from 'express'
import mongoose from 'mongoose'
import router from './src/routes/index.js'
import config from './config.js'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import Chat from './src/models/Chat.model.js'
import { sendMessage , deleteMessage,} from './src/controllers/chat.controller.js'
const app = express()
const socketConnection = http.Server(app)
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(router)
app.use(cors())
const src = config.db
const PORT = config.port || 5000
const ioPort = 8001;
mongoose.set('strictQuery', false)
mongoose.connect(src).then(() => console.log('database connection succesful'))

const server = app.listen(PORT, () => {
    console.log('app running on port ', PORT)
})


socketConnection.listen(ioPort, () => console.log(`Socket connected to database on ${ioPort}`))
const socketIO = new Server(http, {
    cors: {
        origin: `http://localhost:${ioPort}`
    }
})

socketIO.on('connect', socket => {

    console.log('A client has been connected');
    socket.on('sendMessage', async data => {
        const { _id, sender, message } = data
        await sendMessage({ _id,  sender, message })
        socket.emit('chatUpdated')
    })

    socket.on('deleteMessage', async data => {
        const {_id , sender , message} = data
        await deleteMessage({_id, sender, message})
        socket.emit('chatUpdated')
    })
})


