import bcrypt from "bcrypt"
import config from '../../config.js'
import User from '../models/User.model.js'

const hashPass = (password) => {
  const salt = parseInt(config.salt,10);
  return bcrypt.hashSync(`${password}${config.paper}`, salt);
}

export const get = async (req,res)=>{
    const user = await User.find().select('-password')
    res.send(user)
}


export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used ", status: false });
    const user = await User.create({
      email:email,
      name:username,
      password: hashPass(password),
    });
    return res.status(200).json(user);
  } catch (ex) {
    next(ex);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email:email });
    if (!user)
      return res.status(401).json({msg: "Incorrect username or password"});
    const ispasswordValid = await bcrypt.compareSync(`${password}${config.paper}`, user.password);
    if (!ispasswordValid)
      return res.json({ msg: "Incorrect username or password", status: false });

    delete user.password;
    return res.status(200).json(user);
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
