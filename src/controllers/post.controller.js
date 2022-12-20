import Post from '../models/Post.model.js'
import mongoose from 'mongoose'

export const postAdd = async (req, res) => {
    let {
        author,
        content
    } = req.body

    author = mongoose.Types.ObjectId(author)

    if (!author || !content) {
        error = { error: "unknown author or empty content" }
        console.log('error', error);
        return res.status(401).send(error)
    }

    await addPost({ author, content }).then(e => {
        return res.status(200).send(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).send({ error: err.message })
    })
}

async function addPost({ author, content }) {
    const newPost = new Post({
        author,
        content
    })
    await newPost.save()
    return newPost
}

export const postUpdate = async (req, res) => {
    let { _id, content } = req.body

    _id = mongoose.Types.ObjectId(_id)

    if (!_id || !content) {
        error = { error: "Id is not provided or empty content" }
        console.log('error', error);
        return res.status(401).send(error)
    }
    await updatePost({ _id, content }).then(e => {
        return res.status(200).send(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).send({ error: err.message })
    })
}
export const postDelete = async (req, res) => {
    let { _id } = req.body

    _id = mongoose.Types.ObjectId(_id)

    if (!_id) {
        error = { error: "No Id provided" }
        console.log('error', error);
        return res.status(401).send(error)
    }
    await deletePost(_id).then(e => {
        return res.status(200).send(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).send({ error: err.message })
    })
}

export const postGet = async (req, res) => {
    let { _id } = req.body
    _id = mongoose.Types.ObjectId(_id)

    if (!_id) {
        error = { error: "No id provided" }
        console.log('error', error);
        return res.status(401).send(error)
    }
    await getPostById({ _id }).then(e => {
        res.status(200).send(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).send({ error: err.message })
    })
}

async function updatePost({ _id, content }) {

    const editpost = await Post.findByIdAndUpdate({ _id }, { content }, { new: true });

    return editpost;
}

async function deletePost({ _id }) {
    const removepost = await Post.findByIdAndDelete({ _id });
    return removepost;
}

async function getPostById({ _id }) {
    const post = await Post.findById({ _id })
    return post
}

async function updateComment({ _id, commenter, time, updatedComment }) {
    const post = await Post.findByIdAndUpdate({ _id }, {
        $set: { 'comments.$[comment].comment': updatedComment }
    }, { arrayFilters: [{ 'comment.commenter': commenter, 'comment.time': time }] })
    return post
}

export const postUpdateComment = async (req, res) => {
    let { _id, commenter, time, updatedComment } = req.body
    _id = mongoose.Types.ObjectId(_id)
    commenter = mongoose.Types.ObjectId(commenter)
    time = new Date(time)

    if (!commenter || !time) {
        error = { error: "Couldn't find post" }
        console.log('error', error);
        return res.status(400).send(error)
    }

    await updateComment({ _id, commenter, time, updatedComment }).then(e => {
        return res.status(200).send(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).send({ error: err.message })
    })
}