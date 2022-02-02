if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const sessionKey = process.env.SESSION_SECRET
const base_url = process.env.BASE_URL
const express = require('express');
const app = express();
const { append } = require('express/lib/response');
const fetchers = require('../../fetchers');
const cookie = require('cookie');
const csessions = require('client-sessions');
const sessions = require('express-session');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(sessions({
    secret: sessionKey,
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false 
}));

const checkForLogin = (req, id)=>{
    var session = req.session;
    if(session.userID){
        return true
    }else{
        return false
    }
}

const idbyAuth = async (req, token)=>{
    var session = req.session;
    if(session.userID){
        var data = await fetchers.fetchAuthMe(token);
        console.log(data);
        return data
    }else{
        return false
    }
}

router.get('/login', async (req,res)=>{
    var loggedIn = await checkForLogin(req);
    if(!loggedIn){
        res.render('./account/authentication/login')
    }else{
        res.redirect('../main/home')
    }
})

router.get('/register', async (req,res)=>{
    var loggedIn = await checkForLogin(req);
    if(!loggedIn){
        res.render('./account/authentication/register')
    }else{
        res.redirect('../main/home')
    }
})

router.get('/recover', async (req,res)=>{
    var loggedIn = await checkForLogin(req);
    if(!loggedIn){
        res.render('./account/recovery/verifyidentity')
    }else{
        res.render('../main/home')
    }
})
router.get('/recover/confirm', async (req,res)=>{
    var loggedIn = await checkForLogin(req);
    if(!loggedIn){
        res.render('./account/recovery/confirmidentity')
    }else{
        res.render('../main/home')
    }
})

router.get('/identity/verify', async (req, res)=>{
    var loggedIn = await checkForLogin(req);
    if(!loggedIn){
        res.render('./account/authentication/verifyemail')
    }else{
        res.redirect('../main/home')
    }
})

router.post('/auth/signup', async (req,res, next)=>{
    var session = req.session;
    var data = await fetchers.fetchsignAuth(req.body);
    if(data.completed){
        session.userID = data.authToken;
        res.send(data)
    }else{
        res.send(data)   
    }
    next(console.log('sent'))
})

router.post('/auth/login', async (req,res)=>{
    var session = req.session;
    var data = await fetchers.fetchloginAuth(req.body);
    if(data.completed){
        session.userID = data.authToken
        res.send(data);
    }else{
        res.send(data)
    }
})

router.post('/auth/me', async(req,res)=>{
    var session = req.session;

})


router.post('/finduser', async (req,res)=>{
    var data = await fetchers.fetchUserByEmail(req.body);
    res.send(data)
})


module.exports = router