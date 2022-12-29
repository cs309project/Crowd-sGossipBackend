import Post from '../models/Post.model.js'
import mongoose from 'mongoose'
import { addPostToUserAndFollowers, removePostToUserAndFollowers } from './user.controller.js'
export const postAdd = async (req, res) => {
    let {
        content, photo
    } = req.body
    let author = req.user._id
    author = mongoose.Types.ObjectId(author)

    if (!author || !content) {
        let error = { error: "unknown author or empty content" }
        console.log('error', error);
        return res.status(401).json(error)
    }

    await addPost({ author, content, photo }).then(async e => {
        await addPostToUserAndFollowers({ _id: author, postId: e._id })
        return res.status(200).json(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).json({ error: err.message })
    })
}

async function addPost({ author, content, photo }) {
    const newPost = new Post({
        author,
        content,
        photo: photo ? photo : "",
    })
    await newPost.save()
    return newPost
}

export const postUpdate = async (req, res) => {
    let { _id, content } = req.body

    _id = mongoose.Types.ObjectId(_id)

    if (!_id || !content) {
        let error = { error: "Id is not provided or empty content" }
        console.log('error', error);
        return res.status(401).json(error)
    }
    await updatePost({ _id, content }).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).json({ error: err.message })
    })
}
export const postDelete = async (req, res) => {
    let _id = req.params.id

    _id = mongoose.Types.ObjectId(_id)

    if (!_id) {
        let error = { error: "No Id provided" }
        console.log('error', error);
        return res.status(401).json(error)
    }
    await deletePost(_id).then(async e => {
        await removePostToUserAndFollowers({ _id: e.author, postId: e._id })
        return res.status(200).json(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).json({ error: err.message })
    })
}

export const postGet = async (req, res) => {
    let _id = req.params.id
    _id = mongoose.Types.ObjectId(_id)

    await getPostById({ _id }).then(e => {
        res.status(200).json(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).json({ error: err.message })
    })
}

async function updatePost({ _id, content }) {

    return Post.findByIdAndUpdate({ _id }, { content }, { new: true });
}

async function deletePost({ _id }) {
    return Post.findByIdAndDelete({ _id });
}

async function getPostById({ _id }) {
    return Post.findById({ _id });
}
// _id is post id, commenter is commenter id, comment is comment text and time is the time at which the comment was added
async function addCommentToPost({ _id, commenter, comment, time }) {
    return Post.findByIdAndUpdate({ _id }, { $push: { "comments": { commenter, comment, time } } }, { new: true })
}

export const postAddComment = async (req, res) => {
    let { _id, comment } = req.body
    _id = mongoose.Types.ObjectId(_id)
    let commenter = mongoose.Types.ObjectId(req.user._id)
    const time = new Date()

    if (!_id) {
        let error = { error: "unknown post" }
        console.log('error', error)
        return res.status(400).json(error)
    }

    if (!commenter || !comment) {
        let error = { error: "unknown user or empty comment" }
        console.log('error', error);
        return res.status(401).json(error)
    }

    await addCommentToPost({ _id, commenter, comment, time }).then(e => {
        res.status(200).json(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).json({ error: err.message })
    })
}

async function updateComment({ _id, commenter, time, updatedComment }) {
    return Post.findByIdAndUpdate({ _id }, {
        $set: { 'comments.$[comment].comment': updatedComment }
    }, { arrayFilters: [{ 'comment.commenter': commenter, 'comment.time': time }], new: true });
}

export const postUpdateComment = async (req, res) => {
    let { _id, time, updatedComment } = req.body
    _id = mongoose.Types.ObjectId(_id)
    let commenter = mongoose.Types.ObjectId(req.user._id)
    time = new Date(time)

    if (!commenter || !time) {
        let error = { error: "Couldn't find post" }
        console.log('error', error);
        return res.status(400).json(error)
    }

    await updateComment({ _id, commenter, time, updatedComment }).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).json({ error: err.message })
    })
}

async function addDownVoterInPost({ _id, downVoters }) {
    return Post.findByIdAndUpdate({ _id }, {
        $push: { 'downVoters': downVoters }
    }, { new: true });
}

export const postAddDownVoter = async (req, res) => {
    let { _id } = req.body
    _id = mongoose.Types.ObjectId(_id)
    let downVoters = mongoose.Types.ObjectId(req.user._id)

    if (!_id) {
        let error = { error: "Post can not found" }
        console.log('error', error)
        return res.status(400).json(error)
    }

    if (!downVoters) {
        let error = { error: "User not found" }
        console.log('error', error)
        return res.status(400).json(error)
    }

    await addDownVoterInPost({ _id, downVoters }).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).json({ error: err.message })
    })
}

export const postAddUpVote = async (req, res) => {
    let { _id } = req.body
    _id = mongoose.Types.ObjectId(_id)
    let upVoter = mongoose.Types.ObjectId(req.user._id)

    if (!_id || !upVoter) {
        let error = { error: "unknown post or user" }
        console.log('error', error);
        return res.status(400).json(error)
    }

    await AddUpVote({ _id, upVoter }).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).json({ error: err.message })
    })
}

async function removeDownVoterInPost({ _id, downVoter }) {
    return Post.findByIdAndUpdate({ _id }, {
        $pull: { 'downVoters': downVoter }
    }, { new: true });
}

export const postRemoveDownVoter = async (req, res) => {
    let { _id } = req.body
    _id = mongoose.Types.ObjectId(_id)
    let downVoter = mongoose.Types.ObjectId(req.user._id)

    if (!_id) {
        let error = { error: "Post can not found" }
        console.log('error', error)
        return res.status(400).json(error)
    }

    if (!downVoter) {
        let error = { error: "User not found" }
        console.log('error', error)
        return res.status(400).json(error)
    }

    await removeDownVoterInPost({ _id, downVoter }).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).json({ error: err.message })
    })
}

async function AddUpVote({ _id, upVoter }) {
    return Post.findByIdAndUpdate({ _id }, {
        $push: { 'upVoters': upVoter }
    }, { new: true });
}

export const postRemoveUpVote = async (req, res) => {
    let { _id } = req.body
    _id = mongoose.Types.ObjectId(_id)
    let upVoter = mongoose.Types.ObjectId(req.user._id)

    if (!_id || !upVoter) {
        let error = { error: "unknown post or user" }
        console.log('error', error);
        return res.status(400).json(error)
    }

    await RemoveUpVote({ _id, upVoter }).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).json({ error: err.message })
    })
}

export const postListDownVoters = async (req, res) => {
    let { id } = req.params
    id = mongoose.Types.ObjectId(id)

    if (!id) {
        let error = { error: "Post can not found" }
        console.log('error', error);
        return res.status(401).json(error)
    }
    await getPostById({ _id: id }).then(e => {
        const voted = e.downVoters.includes(req.user._id)
        res.status(200).json({ data: e.downVoters, voted })
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).json({ error: err.message })
    })
}

async function RemoveUpVote({ _id, upVoter }) {
    return Post.findByIdAndUpdate({ _id }, {
        $pull: { 'upVoters': upVoter }
    }, { new: true });
}

export const postGetUpVoters = async (req, res) => {
    let { id } = req.params
    id = mongoose.Types.ObjectId(id)

    if (!id) {
        let error = { error: "No id provided" }
        console.log('error', error);
        return res.status(401).json(error)
    }
    await getPostById({ _id: id }).then(e => {
        const voted = e.upVoters.includes(req.user._id)
        return res.status(200).json({ data: e.upVoters, voted })
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).json({ error: err.message })
    })
}

async function deleteComment({ _id, commenter, time }) {
    return Post.findByIdAndUpdate({ _id }, {
        $pull: { 'comments': { commenter, time } }
    }, { new: true });
}

export const postDeleteComment = async (req, res) => {
    let { _id, time } = req.body
    console.log(req.body);
    _id = mongoose.Types.ObjectId(_id)
    let commenter = mongoose.Types.ObjectId(req.user._id)
    time = new Date(time)

    if (!_id) {
        let error = { error: "Post is not found" }
        console.log('error', error);
        return res.status(400).json(error)
    }

    if (!commenter || !time) {
        let error = { error: "Couldn't find comment" }
        console.log('error', error);
        return res.status(400).json(error)
    }

    await deleteComment({ _id, commenter, time }).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log('err', err.message);
        return res.status(401).json({ error: err.message })
    })
}