import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export const isAuth = async(req, res, next) => {
 try{
    const token= req.headers.token;
    if(!token){
        return res.status(401).json({message: "please login to access this resource"});
    }
    //decode jwt
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = await User.findById(decoded._id);
     next();
    
 }catch(error){
    return res.status(401).json({message: "Unauthorized"});
 }
}