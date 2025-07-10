const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User');
// const User = require('../models/User');


const registredUser = async (req,res)=>{
    const{ name,email,password }= req.body;

    //valiating the Input
    try{
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are requried"})
        }

        //Checking if user already exists or not
        const existingUser= await User.findOne({ email })

        if(existingUser){
            return res.status(400).json({message:"This email already exists!!"})
        }


        //Bcrytping the password
        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser= new User({
            name,
            email,
            password:hashedPassword
        });
        await newUser.save();

        //Setting up the JWT
        const token = jwt.sign(
            {userID :newUser._id},
            process.env.JWT_SECRET,
            {expiresIn : '1d'}
        )


        res.status(201).json({
            message:"User Regiestered Successfully",
            user:{
                id:newUser._id,
                name:newUser.name,
                email:newUser.email
            },token
        })
    }
    catch(err){
        console.error("Register Error" ,err);
        res.status(500).json({message:"Server Error Please try again!!"})
    }
}

const loginUser = async(req,res)=>{
    const{ email,password }= req.body

    try{
        if(!email || !password){
            return res.status(400).json({message:"Fields are empty"})
        }

        const user = await User.findOne({ email })
            if(!user){
                return res.status(404).json({message:" User not found "});
            }

            const isMatch= await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(401).json({message:"Password does not match"});
            }

            const token = jwt.sign(
                {userID:user._id},
                process.env.JWT_SECRET,
                {expiresIn:'1d'}

            )

            res.status(200).json({
                message:"Login Successfull",
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email,
                    group:user.group
                },token

            })
    }catch(error){
        console.error('Login Error',error)
        res.status(500).json({message:"Server Error"})
    }
}

module.exports={
    registredUser,loginUser
}