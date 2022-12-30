import express from 'express'
import mongoose from 'mongoose'
import router from './src/routes/index.js'
import config from './config.js'
import cors from 'cors'
import ImageKit from 'imagekit'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { sendMessage, deleteMessage, } from './src/controllers/chat.controller.js'

const app = express()
app.use(cors())
app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false)
    // Pass to next layer of middleware
    next()
  })

const socketServer = createServer()
const io = new Server(socketServer, {
    cors: {
        origin: config.ioUrl
    }
})

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(router)
const src = config.db
const PORT = config.port || 5000
const ioPort = config.ioPort

mongoose.set('strictQuery', false)
mongoose.connect(src).then(() => console.log('database connection succesful'))
socketServer.listen(ioPort, () => console.log(`Socket running on ${ioPort}`))

const imagekit = new ImageKit({
    urlEndpoint: config.urlEndpoint,
    publicKey: config.publicKey,
    privateKey: config.privateKey
});

app.get('/auth', function (req, res) {
    var result = imagekit.getAuthenticationParameters();
    res.send(result);
});
const server = app.listen(PORT, () => {
    console.log('app running on port ', PORT)
})

app.get('/',(req,res)=>{
    res.send('hello world')
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

export default app