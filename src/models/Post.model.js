
import { Schema, model ,ObjectId} from 'mongoose';

const PostSchema = new Schema({
    author : {
        type : ObjectId,
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
    comments:[],
    photo: {
        type:String,
        default: "",
    }
},{timestamps: true })

export default model.Posts || model("Post", PostSchema);
