import express from 'express'
import mongoose from 'mongoose'
import router from './src/routes/index.js'
import config from './config.js'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { sendMessage, deleteMessage, } from './src/controllers/chat.controller.js'
import ImageKit from 'imagekit'

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

const imagekit = new ImageKit({
    urlEndpoint: 'https://ik.imagekit.io/CrowdsGossip1/',
    publicKey: 'public_X7yTliORSXHPEjwCoN+adNnMArw=',
    privateKey: 'private_AGeIN5Yt4/HMheVPTzI/PX59fHQ='
});

app.get('/auth', function (req, res) {
    var result = imagekit.getAuthenticationParameters();
    res.send(result);
});
const server = app.listen(PORT, () => {
    console.log('app running on port ', PORT)
})


io.on('connect', socket => {

    console.log('A client has been connected');
    socket.on('sendMessage', async data => {
        const { _id, sender, message } = data
        await sendMessage({ _id, sender, message })
        io.emit('chatUpdated')
    })

    socket.on('deleteMessage', async data => {
        let { _id, sender, time } = data
        _id = mongoose.Types.ObjectId(_id)
        time = new Date(time)
        await deleteMessage({ _id, sender, time })
        io.emit('chatUpdated')
    })
})


