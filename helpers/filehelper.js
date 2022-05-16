'use strict';
const multer = require('multer');
const path = require('path');

const r_storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'ResumeUploads');
    },
    filename:(req,file,cb)=>{
        cb(null, new Date().toISOString().replace(/:/g,'-') + '-' + file.originalname)
    }
});

const imgFileFilter = (req,file,cb)=>{
    if(file.mimetype === 'application/pdf' ||file.mimetype === 'text/plain'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const r_upload = multer({storage:r_storage});

module.exports = {
    r_upload 
}