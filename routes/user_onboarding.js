if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const sessionKey = process.env.SESSION_SECRET
const base_url = process.env.BASE_URL
const express = require('express');
const app = express();
const fetchers = require('../fetchers.js');
const cookie = require('cookie');
const csessions = require('client-sessions');
const sessions = require('express-session');
const urlHandler = require('../urlHandlers');

const router = express.Router();




router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(sessions({
    secret: sessionKey,
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false 
}));





router.get('/identity/verifyemail',(req,res)=>{
    res.render('./account/onboarding/verifyemail')
})




module.exports = router