if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const express = require('express');
const fetchers = require('../../fetchers');
const cookie = require('cookie');
const sessions = require('express-session');
const router = express.Router();
const keySign = process.env.EMAIL_SIGN_KEY;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


const checkValidReq = (req,res,next)=>{
    var headers = req.headers;
    if(headers.intouch_com_secret === keySign){
        next()
    }else{
        res.send({
            status:403,
            message:'Invalid secret'
        })
    }
}

router.post('/verification/email', checkValidReq, async (req,res)=>{
    var send_body = req.body;
    var dt = await fetchers.v_email_create(send_body.email,send_body.name,send_body.code);
    console.log(dt);
    res.send(dt)
})

router.post('/verification/sms',checkValidReq, async(req,res)=>{    
    var dt = await fetchers.v_sms_create(req.body.phone,req.body.messge);
    res.send(dt)
})

module.exports = router