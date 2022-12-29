import config from '../../config.js';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, "No email provided"],
        unique: [true, "Email already exists"],
    },
    phone: {
        type: String,
        required: false,
        unique: false,
    },
    name: {
        type: String,
        required: [true, "No name provided"],
        unique: false,
    },
    password: {
        type: String,
        required: [true, "No password provided"],
        unique: false,
    },
    followers: {
        type: Array,
        default: [],
    },
    following: {
        type: Array,
        default: [],
    },
    posts: {
        type: Array,
        default: [],
    },
    unreadPosts: {
        type: Array,
        default: [],
    },
    chats: {
        type: Array,
        default: [],
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    photo: {
        type:String,
        default: config.defaultPhoto,
    },
    Role: {
        type: String,
        default:"user"
    }
})

export default model.Users || model("Users", UserSchema);