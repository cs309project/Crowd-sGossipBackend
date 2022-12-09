import User from '../models/User.model.js'
export const get = async (req,res)=>{
    const user = await User.find().select('-password')
    res.send(user)
}