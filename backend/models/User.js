const mongoose = require('mongoose')

const UserSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    group:{
        type:String,
        default:null,
    },
    verified:{
        type:Boolean,
        default:false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    }
},
    {
        timestamps:true
})

module.exports = mongoose.model('User', UserSchema);