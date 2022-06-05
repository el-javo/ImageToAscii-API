const mongoose = require('mongoose')

const ImageGenSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true,
    },
    user:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required:true
    },
    resolution:{
        type: Number,
        required:true
    },
    contrast:{
        type:Number,
        required:true
    },
    invert:{
        type:Boolean,
        required:true
    },
    format:{
        type:String,
        enum:['img','txt'],
        required: true
    },
    description:{
        type: String,
        text:true
    }
},{timestamps:true})

ImageGenSchema.index({user:1, name:1}, {unique:true}) // creating a compound index so there cant be duplicated names for a user

module.exports = mongoose.model('ImageGen', ImageGenSchema)
