if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}
const base_url = process.env.BASE_URL
const express = require('express');
const app = express();
const { append } = require('express/lib/response');
const fetchers = require('../fetchers.js');
const cookie = require('cookie');
const sessions = require('client-sessions')
const router = express.Router();

app.use(sessions({
    secret:"ZOjRc9A8W79A0THZhj8T"
}))


router.get('/login', (req,res)=>{
    res.render('./account/authentication/login')
})

router.get('/register', (req,res)=>{
    res.render('./account/authentication/register')
})

router.get('/recover', (req,res)=>{
    res.render('./account/recovery/verifyidentity')
})

router.get('/identity/verify', (req, res)=>{
    res.render('./account/authentication/verifyemail')
})

router.post('/auth/signup', async (req,res)=>{
    var data = await fetchers.fetchsignAuth(req.body);
    if(data.completed){
        console.log('sign up',data)
    }else{
        res.send(data)   
    }
})

router.post('/auth/login', async (req,res)=>{
    var data = await fetchers.fetchloginAuth(req.body);
    if(data.completed){       
        req.session.userAuth = data.auth;
        req.send(data)
    }else{
    }
})

router.post('/finduser', async (req,res)=>{
    var data = await fetchers.fetchUserByEmail(req.body);
    res.send(data)
})


module.exports = router
