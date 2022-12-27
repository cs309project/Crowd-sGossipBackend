import Chat from '../models/Chat.model.js'
import mongoose from 'mongoose'

export async function createChat() {
    const newChat = new Chat()
    await newChat.save()
    return newChat
}

export async function sendMessage({ _id, sender, message }) {
    const chatDoc = await Chat.findByIdAndUpdate({ _id }, {
        $push: {
            'conversation': {
                sender,
                message,
                time: new Date()
            }
        }
    }, { new: true })
    return chatDoc
}

export async function deleteMessage({ _id, sender, time }) {
    console.log({ _id, sender, time });
    const chatDoc = await Chat.findByIdAndUpdate({ _id }, {
        $pull: {
            'conversation': {
                sender,
                time
            }
        }
    }, { new: true })
    return chatDoc
}

export const getChat = async (req, res) => {
    let id = req.params.id
    // _id = mongoose.Types.ObjectId(_id)

    await getChatById(id).then(e => {
        return res.status(200).json(e)
    }).catch((err) => {
        console.log("error", err.message);
        return res.status(401).json({ err: err.message })
    })
}

async function getChatById(_id) {
    return await Chat.findById(_id)
}