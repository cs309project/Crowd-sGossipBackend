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
// _id is post id, commenter is commenter id, comment is comment text and time is the time at which the comment was added
async function addCommentToPost({ _id, commenter, comment, time }) {
    const post = Post.findByIdAndUpdate({ _id }, { $push: { "comments": { commenter, comment, time } } }, { new: true })
    return post
}

export const postAddComment = async (req, res) => {
    let { _id, commenter, comment } = req.body
    _id = mongoose.Types.ObjectId(_id)
    commenter = mongoose.Types.ObjectId(commenter)
    const time = new Date()

    if (!_id) {
        error = { error: "unknown post" }
        console.log('error', error)
        return res.status(400).send(error)
    }

    if (!commenter || !comment) {
        error = { error: "unknown user or empty comment" }
        console.log('error', error);
        return res.status(401).send(error)
    }

    await addCommentToPost({ _id, commenter, comment, time }).then(e => {
        res.status(200).send(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).send({ error: err.message })
    })
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

async function addDownVoterInPost({ _id, downVoters }) {
    const downVoteDOC = await Post.findByIdAndUpdate({ _id }, {
        $push: { 'downVoters':  downVoters}
    }, { new: true })

    return downVoteDOC
}

export const postAddDownVoter = async (req, res) => {
    let { _id, downVoters } = req.body
    _id = mongoose.Types.ObjectId(_id)
    downVoters = mongoose.Types.ObjectId(downVoters)

    if (!_id) {
        error = { error: "Post can not found" }
        console.log('error', error)
        return res.status(400).send(error)
    }

    if (!downVoters) {
        error = { error: "User not found" }
        console.log('error', error)
        return res.status(400).send(error)
    }

    await addDownVoterInPost({ _id, downVoters }).then(e => {
        return res.status(200).send(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).send({ error: err.message })
    })
}

async function removeDownVoterInPost({_id , downVoters}){
    const downVoteDOC = await Post.findByIdAndUpdate({ _id }, {
        $pull: { 'downVoters':  downVoters}
    }, { new: true })

    return downVoteDOC
}

export const postRemoveDownVoter = async (req, res) => {
    let { _id, downVoters } = req.body
    _id = mongoose.Types.ObjectId(_id)
    downVoters = mongoose.Types.ObjectId(downVoters)

    if (!_id) {
        error = { error: "Post can not found" }
        console.log('error', error)
        return res.status(400).send(error)
    }

    if (!downVoters) {
        error = { error: "User not found" }
        console.log('error', error)
        return res.status(400).send(error)
    }

    await removeDownVoterInPost({ _id, downVoters }).then(e => {
        return res.status(200).send(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).send({ error: err.message })
    })
}

export const postListDownVoters = async (req, res) => {
    let { _id } = req.body
    _id = mongoose.Types.ObjectId(_id)

    if (!_id) {
        error = { error: "Post can not found" }
        console.log('error', error);
        return res.status(401).send(error)
    }
    await getPostById({ _id }).then(e => {
        res.status(200).send(e.downVoters)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).send({ error: err.message })
    })
}