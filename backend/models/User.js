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
        lowecase:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    group:{
        type:String,
        default:null,
    }
},
    {
        timestamp:true
})

module.exports = mongoose.model('User', UserSchema);