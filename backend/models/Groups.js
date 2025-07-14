const mongoose = require('mongoose')

const GroupScehma= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique: true
    },
    description:{
        type:String,
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
},{ timestamps: true })

module.exports=mongoose.model('Groups',GroupScehma);