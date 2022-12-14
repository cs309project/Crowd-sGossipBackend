import bcrypt from "bcrypt"
import config from '../../config.js'
import User from '../models/User.model.js'
import { createChat } from '../controllers/chat.controller.js'
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

const hashPass = (password) => {
  const salt = parseInt(config.salt, 10);
  return bcrypt.hashSync(`${password}${config.paper}`, salt);
}

export const get = async (req, res) => {
  const user = await User.find().select('-password')
  return res.status(200).json(user)
}


export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used ", status: false });
    const user = await User.create({
      email: email,
      name: name,
      password: hashPass(password),
    });
    user.password = null;
    return res.status(200).json(user);
  } catch (ex) {
    next(ex);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return res.json({ msg: "Incorrect username or password", status: false });
    const ispasswordValid = bcrypt.compareSync(`${password}${config.paper}`, user.password);
    if (!ispasswordValid)
      return res.json({ msg: "Incorrect username or password", status: false });
    if (!user.blocked) {
      user.password = null;
      const token = jwt.sign({ user }, config.token)

      return res.status(200).json({ token, user, status: true });
    }
    else {
      return res.status(200).json({ msg: "Account has been blocked contact admin for more info", status: false })
    }
  } catch (ex) {
    next(ex);
  }
};
//code for register

export const userSearch = async (req, res) => {
  let {
    sname
  } = req.query
  const users = await User.find({ name: { $regex: sname, $options: "i" } }).select('name')
  return res.json({ status: true, users })
}
export const userPage = async (req, res) => {
  var id = req.params.id;
  const checkId = typeof id !== undefined && id.length === 24
  if (!checkId) {
    id = req.user._id
  }
  if (!id) {
    return res.status(401).json({ error: "No ID provided " });
  }
  else {
    getbyid(id).then(user => { return res.json(user) })
  }
}
const getbyid = async (id) => {
  return await User.findById(id).select('-password')
}


const followUser = async ({ idFollower, idToFollow }) => {
  if (!await isFollowed({ idFollower: idFollower, idToFollow: idToFollow })) {
    if (await chatExists(idFollower, idToFollow)) {
      const followerUser = await User.findByIdAndUpdate({ _id: idFollower }, {
        $push: {
          'following': idToFollow
        }
      }, { new: true })

      const followedUser = await User.findByIdAndUpdate({ _id: idToFollow }, {
        $push: {
          'followers': idFollower
        }
      }, { new: true })
      return { followerUser, followedUser }
    } else {
      const createdChat = await createChat()
      const followerUser = await User.findByIdAndUpdate({ _id: idFollower }, {
        $push: {
          'chats': {
            chatId: createdChat._id,
            user: idToFollow
          },
          'following': idToFollow
        }
      }, { new: true })

      const followedUser = await User.findByIdAndUpdate({ _id: idToFollow }, {
        $push: {
          'chats': {
            chatId: createdChat._id,
            user: idFollower
          },
          'followers': idFollower
        }
      }, { new: true })
      return { followerUser, followedUser, createdChat }
    }
  }
}

async function isFollowed({ idFollower, idToFollow }) {
  const user = await User.findById(idToFollow)
  for (let i = 0; i < user.followers.length; i++) {
    if (JSON.stringify(user.followers[i]) === JSON.stringify(idFollower)) {
      return true
    }
  }
  return false
}

export const userFollow = async (req, res) => {
  let { idToFollow } = req.body
  let idFollower = req.user._id
  idFollower = mongoose.Types.ObjectId(idFollower)
  idToFollow = mongoose.Types.ObjectId(idToFollow)

  await followUser({ idFollower, idToFollow }).then(e => {
    return res.status(200).json(e)
  }).catch(err => {
    console.log('err', err.message);
    return res.status(401).json({ error: err.message })
  })
}

async function chatExists(myId, hisId) {
  const user = await getbyid(myId)
  for (let i = 0; i < user.chats.length; i++) {
    if (JSON.stringify(user.chats[i].user) === JSON.stringify(hisId)) {
      return true
    }
  }
  return false
}

export async function addPostToUserAndFollowers({ _id, postId }) {
  try {
    const user = await User.findByIdAndUpdate({ _id }, {
      $push: {
        'posts': {
          $each: [postId],
          $position: 0
        }
      }
    }, { new: true })

    for (let i = 0; i < user.followers.length; i++) {
      await User.findByIdAndUpdate(user.followers[i], {
        $push: {
          'unreadPosts': {
            $each: [postId],
            $position: 0
          }
        }
      })
    }
  } catch (error) {
    console.log('err', error);
  }
}

async function unfollowUser({ idFollower, idToUnfollow }) {
  const follower = await User.findByIdAndUpdate({ _id: idFollower }, {
    $pull: {
      'following': idToUnfollow
    }
  }, { new: true })

  const unfollowed = await User.findByIdAndUpdate({ _id: idToUnfollow }, {
    $pull: {
      'followers': idFollower
    }
  }, { new: true })
  return { follower, unfollowed }
}

export const userUnfollow = async (req, res) => {
  let { idToUnfollow } = req.body
  let idFollower = req.user._id
  idFollower = mongoose.Types.ObjectId(idFollower)
  idToUnfollow = mongoose.Types.ObjectId(idToUnfollow)

  if (!idFollower || !idToUnfollow) {
    let error = { error: "unknown user" }
    console.log('error', error);
    return res.status(400).json(error)
  }

  await unfollowUser({ idFollower, idToUnfollow }).then(e => {
    return res.status(200).json(e)
  }).catch(err => {
    console.log('err', err.message);
    return res.status(401).json({ error: err.message })
  })
}


export const block = async (req, res) => {
  let { id } = req.body
  try {
    let uid = mongoose.Types.ObjectId(id)
    const user = await User.findByIdAndUpdate(uid, {
      $set: {
        'blocked': true
      }
    }, { new: true })
    return res.status(200).json(user)
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: err.message })
  }

}
export const unblock = async (req, res) => {
  let { id } = req.body
  try {
    let uid = mongoose.Types.ObjectId(id)
    const user = await User.findByIdAndUpdate(uid, {
      $set: {
        'blocked': false
      }
    }, { new: true })
    return res.status(200).json(user)
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: err.message })
  }

}

export const addImage = async (req, res) => {
  const { photo } = req.body
  let id = req.user._id
  id = mongoose.Types.ObjectId(id)
  try {
    const user = await User.findByIdAndUpdate({ _id: id }, {
      $set: {
        'photo': photo
      }
    }, { new: true })
    res.status(200).json(user)
  } catch (err) {
    console.log('err', err.message)
    return res.status(401).json({ err: err.message })
  }
}

export async function removePostToUserAndFollowers({ _id, postId }) {
  try {
    const user = await User.findByIdAndUpdate({ _id }, {
      $pull: {
        'posts': postId
      }
    }, { new: true })

    for (let i = 0; i < user.followers.length; i++) {
      await User.findByIdAndUpdate(user.followers[i], {
        $pull: {
          'unreadPosts': postId
        }
      })
    }
  } catch (error) {
    console.log('err', error);
  }
}
export const update = async (req, res) => {
  const { photo, name } = req.body
  let id = req.user._id
  try {
    id = mongoose.Types.ObjectId(id)
    const user = await User.findByIdAndUpdate(id, {
      $set: {
        photo: photo,
        name: name
      }
    }, { new: true })
    return res.status(200).json(user)
  } catch (err) {
    console.log(err)
    return res.status(401).json(err.message)
  }
}

