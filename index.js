import express from 'express'
import mongoose from 'mongoose'
import router from './src/routes/index.js'
import config from './config.js'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import Chat from './src/models/Chat.model.js'
import { sendMessage, deleteMessage, } from './src/controllers/chat.controller.js'
const app = express()
app.use(cors())
const socketServer = createServer()
const io = new Server(socketServer, {
    cors: {
        origin: `http://localhost:3000`
    }
})
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(router)
const src = config.db
const PORT = config.port || 5000
const ioPort = 8001;
mongoose.set('strictQuery', false)
mongoose.connect(src).then(() => console.log('database connection succesful'))

socketServer.listen(ioPort, () => console.log(`Socket running on ${ioPort}`))

const server = app.listen(PORT, () => {
    console.log('app running on port ', PORT)
})

io.on('connect', socket => {

    console.log('A client has been connected');
    socket.on('sendMessage', async data => {
        const { _id, sender, message } = data
        await sendMessage({ _id, sender, message })
        socket.emit('chatUpdated')
    })

    socket.on('deleteMessage', async data => {
        let { _id, sender, time } = data
        _id = mongoose.Types.ObjectId(_id)
        time = new Date(time)
        await deleteMessage({ _id, sender, time })
        socket.emit('chatUpdated')
    })
})


