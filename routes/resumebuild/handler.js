if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const buildFunc = require('./builder.js')
const sessionKey = process.env.SESSION_SECRET
const express = require('express');
const { append } = require('express/lib/response');
const fetchers = require('../../fetchers');
const cookie = require('cookie');
const sessions = require('express-session');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));



router.get('/create/templates', (req,res)=>{
    res.render('./resume/choose-template')
})

router.get('/create/build', async (req,res)=>{
    var getTemp = req._parsedOriginalUrl.query;
    var san = parseInt(getTemp.replace('useTemp=',''));
    var result = await buildFunc.tSorter(san);

    if(result.ok){
        res.render('./resume/builder', {templatePath:`../resume/_templates/${result.path}`});
    }else{
        res.redirect('/main/home')
    }
})

router.get('/create/landing', async(req,res)=>{
    res.render('./resume/resumelanding')
})


router.post('/create/build/complete', async (req,res)=>{
    var result = await buildFunc.pdfGen(req.body.html);
    res.send(result.file)
})


module.exports = router