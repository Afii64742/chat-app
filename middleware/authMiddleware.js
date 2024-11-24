import jwt from "jsonwebtoken"
import User from "../models/user.js"


// auth middleware 
const authMiddleware = async(req,res,next) =>{
 try{
    const token = req.headers.authorization.split(" ")[1]; 
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
  
    req.user = await User.findById(decoded.userId);

    next();
 }catch(err){
    console.log(err);
    res.status(401).json({error:"Unauthorized"});
 }
}

export default authMiddleware