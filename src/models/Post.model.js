import { Schema, model } from 'mongoose';

const PostSchema = new Schema({
    author : {
        type : mongoose.Types.ObjectId,
        required : true,
        unique : false
    },
    content : {
        type : String,
        required : true,
    },
    upVotes_Count : {
        type : Number,
        default : 0
    },
    downVotes_Count : {
        type : Number,
        default : 0
    },
//action changes if includes(current_user) 
    upVoters : {
        type : Array,
        default : []
    },
    downVoters : {
        type : Array,
        default : []
    },
    comments:[]
},{timestamps: true })
export default model.Posts || model("Post", PostSchema);
