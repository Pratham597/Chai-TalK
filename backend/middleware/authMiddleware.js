import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asynchandler from 'express-async-handler'

export const protect= asynchandler(async (req,res,next)=>{
    let token; 
    if(req.headers.authorization &&req.headers.authorization.startsWith("Bearer")){
        try {
            token=req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findById(decoded.id).select("-password");
            
            return next();
            
            
        } catch (error) {
            res.status(401).json({error})
        }
    }
    if(!token){
        res.status(401);
        throw new Error("Not authorized")
    }
})
