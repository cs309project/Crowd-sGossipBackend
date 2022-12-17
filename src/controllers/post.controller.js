import Post from '../models/Post.model.js'
import mongoose from 'mongoose'

export const postAdd = async (req, res) => {
    let {
        author,
        content
    } = req.body

    author = mongoose.Types.ObjectId(author)

    if (!author || !content) {
        error = {error: "unknown author or empty content"}
        console.log('error', error);
        return res.status(401).send(error)
    }

    await addPost({author, content}).then(e => {
        return res.status(200).send(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).send({error: err.message})
    })
}

async function addPost({author, content}) {
    const newPost = new Post({
        author,
        content
    })
    await newPost.save()
    return newPost
}

export const postDelete = async (req , res) => {
    let {_id} = req.body

    _id = mongoose.Types.ObjectId(_id)

    if(!_id){
        error = {error: "No Id provided"}
        console.log('error', error);
        return res.status(401).send(error)
    }
    await deletePost(_id).then(e => {
        return res.status(200).send(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).send({error: err.message})
    })
}
export const postGet = async (req, res) => {
    let {_id} = req.body
    _id = mongoose.Types.ObjectId(_id)

    if (!_id) {
        error = {error: "No id provided"}
        console.log('error', error);
        return res.status(401).send(error)
    }

    await getPostById({_id}).then(e => {
        res.status(200).send(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).send({error: err.message})
    })
}

async function deletePost({_id}){
    const removepost = await Post.findByIdAndDelete({_id});
    return removepost;
}

async function getPostById({_id}) {
    const post = await Post.findById({_id})
    return post
}