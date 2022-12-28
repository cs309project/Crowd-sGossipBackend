import jwt from 'jsonwebtoken'
import config from '../../config.js'

const tokenValidateMiddleWare = (req,res,next)=>{
    try {
        const authHeader = req.get("Authorization");
        if (authHeader){
            const bearer = authHeader.split(" ")[0];
            const token = authHeader.split(" ")[1];
            if (token && bearer ==="Bearer") {
                const checkToken = jwt.verify(token,config.token)
                req.user = checkToken.user;
                if (checkToken){
                    next();
                }else{
                    res.status(401);
                    const error = new Error("login error please try again")
                    next(error);
                }
            }
        }else {
            res.status(401);
            const error = new Error("login error please try again")
            next(error)
        }
    } catch (error) {
        res.status(401)
        next(error)
    }
};

export default tokenValidateMiddleWare