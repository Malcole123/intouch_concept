'use strict';
const resumeFile = require('../models/resume.js');

const singleResumeUpload = async(req,res,next)=>{
    try{
        const file = new resumeFile({
            fileName:req.file.originalname,
            filePath:req.file.path,
            fileType:req.file.mimetype,
            fileSize:req.file.size,
            owner:req.session.userEmail || 'pro.malikcoleman@gmail.com'
        });
        await file.save()
        req.session.resumeRef = file._id
        res.status(200).send({
            status:200,
            message:'File Uploaded Successfully',
            file:file   
        });

    }catch(error){
        res.status(400).send({
            statis:400,
            message:error.message
        })
    }
}

const fileSizeFormatter= (bytes,decimal)=>{
    if(bytes === 0 ){return '0 Bytes'};
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB','TB'];
    const index = Math.floor((bytes/Math.pow(1000,index)).toFixed(dm) + '-' + sizes[index] )
}



// Download
const singleResumeDownload = ()=>{

}

module.exports = {
    resumeUpload:singleResumeUpload,    
}