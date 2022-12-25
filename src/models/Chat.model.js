import { Schema, model } from "mongoose";

const ChatSchema = new Schema({

    conversation: {

        type: Array,
        default: []
    }
})

export default model.Chats || model("Chats", ChatSchema);