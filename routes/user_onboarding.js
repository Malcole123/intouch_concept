if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const sessionKey = process.env.SESSION_SECRET
const base_url = process.env.BASE_URL
const express = require('express');
const app = express();
const fetchers = require('../fetchers.js');
const cookie = require('cookie');
const sessions = require('express-session');
const urlHandler = require('../urlHandlers');

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/identity/verifyemail',(req,res)=>{
    var session = req.session;
    if(session.userID){
        res.render('./account/onboarding/verifyemail.ejs', {
            user:{
                fname:session.userFNAME,
                lname:session.userLNAME,
                email:session.userEmail,
            }
        })
    }else{
        res.redirect('/main/seejobs?q=&country=&sub_division=') //Change to log in page for employer
    }
})

router.get('/employer/company/register', (req,res)=>{
    var session = req.session;
    if(session.userID){
        res.render('./account/onboarding/companyregister.ejs',{
            user:{
                fname:session.userFNAME,
                lname:session.userLNAME,
                email:session.userEmail,
            }
        })
    }else{
        res.redirect('/main/seejobs?q=&country=&sub_division=') //Change to log in page for employer
    }
})





module.exports = router