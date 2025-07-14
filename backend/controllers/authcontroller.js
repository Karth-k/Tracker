const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../Utils/sendEmail');
const Group = require('../models/Groups');
// const User = require('../models/User');



const registredUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "This email already exists!!" });
    }

    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiry = Date.now() + 1 * 60 * 1000;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      verified: false,
    });

    await newUser.save();

    const message = `Your OTP for email verification is: ${otp}. It expires in 2 minutes.`;

    await sendEmail(email, "Verify your email - OTP", message);

    res.status(201).json({
      message: "User registered successfully! Please check your email for the OTP to verify your account.",
      userId: newUser._id
    });
  } catch (err) {
    console.error("Register Error", err);
    res.status(500).json({ message: "Server Error Please try again!!" });
  }
};

const verifyOtp= async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.verified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error("OTP Verification Error", err);
    res.status(500).json({ message: 'Server Error during OTP verification' });
  }
};


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
                {id:user._id},
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



exports.createGroup = async (req, res) => {
  const { name } = req.body;

  try {
    const existing = await Group.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Group already exists' });
    }

    const newGroup = new Group({ name, members: [] });
    await newGroup.save();

    res.status(201).json({ message: 'Group created', group: newGroup });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.joinGroup = async (req, res) => {
  const { groupId, userId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    group.members.push(userId);
    await group.save();

    res.json({ message: 'Joined group', group });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports={
    registredUser,loginUser,verifyOtp
}