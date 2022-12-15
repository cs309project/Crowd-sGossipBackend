import Post from '../models/Post.model.js'
import mongoose from 'mongoose'

export const post = async (req, res) => {
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