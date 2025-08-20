const jwt=require('jsonwebtoken');
const User=require('../models/User');
const authenticateuser=async (req,res,next)=>{
try{
    const token=req.header('Authorization')?.replace('Bearer ','');
    if(!token){
        return res.status(401).json({success:false,message:"Access token is required"});
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const user=await User.findById(decoded.id);
    if(!user){
        return res.status(401).json({success:false,message:"UnAuthoirzed User not Found"});
    }
    req.user=user;
    next();
}
catch(error){
    console.log('Authentication.error:',error)
    return res.status(401).json({message:"Invalid token"});
}
};
const authorizeuser=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({success:false,message:'Access Denied UnAuthorized'})
        }
        next();
    }
}
module.exports={authenticateuser,authorizeuser};