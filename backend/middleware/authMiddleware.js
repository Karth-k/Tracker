const jwt = require('jsonwebtoken')

const verifytoken =(req,res,next)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message:"Acess denied! No Token Provided"})
    }

    const token= authHeader.split(' ')[1];


    try{
        const decoded =jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();

    }catch(err){
        return res.status(401).json({message:"Invalid Token"})
    }
}

module.exports=verifytoken;