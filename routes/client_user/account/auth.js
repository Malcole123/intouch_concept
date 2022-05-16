if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const sessionKey = process.env.SESSION_SECRET
const express = require('express');
const app = express();
const fetchers = require('../../../fetchers');
const getters = require('../dashboard/fetchers_putters.js')
const cookie = require('cookie');
const session = require('express-session');
const urlHandler = require('../../../urlHandlers');
const cookieParser = require('cookie-parser');
const router = express.Router();

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

router.get('/register', async (req, res)=>{
    var session = req.session
    if(session.userID && session.userType==='client'){
        res.redirect('/dashboard/home')
    }else{
        res.render('./account/authentication/client_auth/register_client')
    }
})

router.get('/login', async (req, res)=>{
    var session = req.session
    if(session.userID && session.userType==='cient'){
        res.redirect('/dashboard/home')
    }else{
        res.render('./account/authentication/client_auth/login_client')
    }
})

router.get('/recover', (req,res)=>{
    
})
router.get('/logout', isAuth, (req,res)=>{
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/employer/login')
})

router.get('/recruiter/register', async (req, res)=>{
    var session = req.session
    console.log(req)
    var reqURLs = req._parsedOriginalUrl.query
    var urlParts = reqURLs
    var refID = urlParts.replace('ref_id=','')
    var recDTFOUND = await getters.searchRecruit(refID)
    if(session.userID !== undefined && session.userType === 'client'){
        res.redirect('/dashboard/home')
    }else{
        res.render('./account/authentication/client_auth/register_recruiter.ejs',{
            recDT:recDTFOUND.data.new_user,
        })
    }
    
})

router.post('/auth/register/client', async (req,res)=>{
    var session = req.session;
    console.log('request arrived')
    var data = await fetchers.fetchsignAuth(req.body);
    if(data.completed){
        session.userID = data.auth;
        session.userEmail = data.user.email;
        session.userFNAME = data.user.first_name;
        session.userLNAME = data.user.last_name;
        session.userType = data.user.role;
        session.myID = data.user.id;
        fetchers.v_email_create(data.user.email, data.user.first_name,data.user.v_code);
        console.log(session.myID)
        res.send({
            ok:true,
            redPath:'/onboarding/identity/verifyemail'
        })
    }else{
        res.send({
            ok:false,
            message:'Something went wrong, please try again later.'
        }) 
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
        redPath='/dashboard/home'
        console.log(data)
        res.send({
            completed:true,
            redPath:redPath,
        })
    }else{
        res.send({
            completed:false,
            message:'Something went wrong'
        })
    }
})

router.post('/auth/recruiter/register', async()=>{
    var session = req.session;
    var data = await fetchers.fetchsignAuth(req.body);
    if(data.completed){
        session.userID = data.auth;
        session.userEmail = data.user.email;
        session.userFNAME = data.user.first_name;
        session.userLNAME = data.user.last_name;
        session.userType = data.user.role;
        session.myID = data.user.id;
        console.log(session)
        fetchers.v_email_create(data.user.email, data.user.first_name,data.user.v_code)
        res.send({
            ok:true,
            redPath:'/onboarding/identity/verifyemail'
        })
    }else{
        res.send({
            ok:false,
            message:'Something went wrong, please try again later.'
        }) 
}})

router.post('/recruiter/invite', async (req,res)=>{
    var session = req.session;
    var dt = await getters.createRecruit(req.body)
    if(dt.ok){
        res.send({
            complete:true
        })
    }else{
        res.send({
            complete:false
        })
    }
})






module.exports = router