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



router.get('/register', async (req, res)=>{
    var session = req.session
    if(session.userID){
        res.redirect('/dashboard/home')
    }else{
        res.render('./account/authentication/client_auth/register_client')
    }
})

router.get('/login', async (req, res)=>{
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
    var userInfo = await fetchers.fetchAuthMe(session.userID)
    if(data.completed){
        session.userID = data.authToken;
        res.send({
            data:data,
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
        session.userID = data.data.authToken;
        session.userEmail = data.data.email;
        session.userType =  data.data.role;
        session.userFNAME =  data.data.first_name;
        session.userLNAME =  data.data.last_name;
        session.companyID =  data.data.verified_companies_id;
        console.log(session)
        if( data.data.role === 'client'){
            redPath = '/dashboard/home'
        }else{
            redPath='/main/home'
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
    if(data.ok && data.vcode == req.body.code){
        res.send({
            ok:true,
            redirect:'',
        })
    }else{
        res.send({
            ok:false,
        })
    }
})


module.exports = router