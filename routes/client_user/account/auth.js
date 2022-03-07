if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const sessionKey = process.env.SESSION_SECRET
const base_url = process.env.BASE_URL
const express = require('express');
const app = express();
const { append } = require('express/lib/response');
const fetchers = require('../../../fetchers');
const cookie = require('cookie');
const csessions = require('client-sessions');
const session = require('express-session');
const urlHandler = require('../../../urlHandlers');
const cookieParser = require('cookie-parser');
const router = express.Router();

router.use(session({
    secret: sessionKey,
    saveUninitialized:false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false 
}));
router.use(cookieParser())
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const isAuth=(req,res,next)=>{
    if(req.session.userID && req.session.userType === 'client'){
        next()
    }else{
        res.redirect('/employer/login')
    }
}

router.get('/register', isAuth, async (req, res)=>{
    var session = req.session
    if(session.userID){
        res.redirect('/dashboard/home')
    }else{
        res.render('./account/authentication/client_auth/register_client')
    }
})

router.get('/login', isAuth, async (req, res)=>{
    var session = req.session
    if(session.userID){
        res.redirect('/dashboard/home')
    }else{
        res.render('./account/authentication/client_auth/login_client')
    }
})


router.post('/auth/register/client', async (req,res)=>{
    var session = req.session;
    var data = await fetchers.fetchsignAuth(req.body);
    if(data.completed){
        session.userID = data.auth;
        session.userEmail = data.user.email;
        session.userFNAME = data.user.first_name;
        session.userLNAME = data.user.last_name;
        session.userType = data.user.role;
        session.myID = data.user.id;
        res.send({
            ok:true,
            redPath:'/onboarding/identity/verifyemail'
        })
    }else{
        res.send(data) 
    }
})
router.post('/auth/login/client', async (req,res)=>{
    var session = req.session;
    var data = await fetchers.fetchloginAuth(req.body);
    var redPath;
    if(data.completed){
        session.myID = data.data.id
        session.userID = data.data.authToken;
        session.userEmail = data.data.email;
        session.userType =  data.data.role;
        session.userFNAME =  data.data.first_name;
        session.userLNAME =  data.data.last_name;
        session.companyID =  data.data.verified_companies_id;
        if( data.data.role === 'client'){
            redPath = '/dashboard/home'
        }else{
            redPath='/main/seejobs?q=&country=&sub_division='
        }
        res.send({
            completed:true,
            redPath:redPath,
        })
    }else{
        res.send(data)
    }
})

router.post('/auth/identity/verify', async (req,res)=>{
    var session = req.session;
    var data = await fetchers.fetchAuthMe(session.userID);
    var codeMatch;
    if(parseInt(data.data.v_code) === parseInt(req.body.code)){
        codeMatch=true
    }else{
        codeMatch = false
    }
    if(data.ok && codeMatch){
        res.send({
            ok:true,
            redirect:'/onboarding/company/register',
        })
    }else{
        res.send({
            ok:false,
        })
    }
})


module.exports = router