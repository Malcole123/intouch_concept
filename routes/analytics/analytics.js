if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const sessionKey = process.env.SESSION_SECRET
const jobCalls = require('../../jobFetchers.js');
const urlHandlers = require('../../urlHandlers.js')
const express = require('express');
const sessions = require('express-session');
const fetchers = require('../../fetchers.js');
const handle = require('./functions.js');

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(sessions({
    secret: sessionKey,
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false 
}));


router.post('/share/create',async(req,res)=>{
    const result = await handle.create_Share(req.body.job_id, req.body.share_method,req.body.referral);
    if(result.ok){
        res.send({
            ok:true
        })
    }else{
        res.send({
            ok:false
        })
    }
})


router.post('/share/fulfill', async(req,res)=>{
    const result = await handle.fulfill_Share(req.body.ref);
    res.send({
        ok:true
    })

})






module.exports = router