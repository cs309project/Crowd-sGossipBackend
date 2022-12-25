import Chat from '../models/Chat.model.js'
import mongoose from 'mongoose'

export async function createChat() {
    const newChat = new Chat()
    await newChat.save()
    return newChat
}

// export const chatAdd = async (req, res) => {
//     let { user1, user2 } = req.body
// }