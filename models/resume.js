const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resumeFileSchema = new Schema({
    fileName:{
        type:String,
        required:true,
    },
    filePath:{
        type:String,
        required:true,
    },
    fileType:{
        type:String,
        required:true
    },
    fileSize:{
        type:String,
        required:true
    },
    owner:{
        type:String,
        required:true
    }
}, {timestamps:true})


module.exports = mongoose.model('resumes', resumeFileSchema) 