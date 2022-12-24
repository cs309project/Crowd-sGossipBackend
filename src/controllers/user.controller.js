import bcrypt from "bcrypt"

import User from '../models/User.model.js'
export const get = async (req,res)=>{
    const user = await User.find().select('-password')
    res.send(user)
}


export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ email });
    if (usernameCheck)
      return res.json({ msg: "Username already used ", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used ", status: false });
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await user.create({
      email,
      username,
      password: hashedpassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};
//code for register
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ msg: "Incorrect username or password", status: false });
    const ispasswordValid = await bcrypt.compare(password, user.password);
    if (!ispasswordValid)
      return res.json({ msg: "Incorrect username or password", status: false });

    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};
//code for register

export const userSearch=async(req,res)=>{
  let {
      sname
  } = req.body
  const users=await User.find({name: { $regex: sname, $options: "i" }}).select('name','_id')
  return res.json({ status: true, users })
}
export const userPage= async (req, res)=> {
  var id = req.params.id;
  console.log(id)
  if (!id){
    return res.status(401).send({ error: "No ID provided " });
    
  }
  else{
    getbyid(id).then(user=> {return res.send(user )})
  }
}
const getbyid = async (id)=>{
  return await User.findById(id).select('-password')
}