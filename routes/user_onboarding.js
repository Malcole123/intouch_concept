if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const sessionKey = process.env.SESSION_SECRET
const express = require('express');
const fetchers = require('../fetchers.js');
const cookie = require('cookie');
const sessions = require('express-session');

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
      if(session.userType === 'client'){
        res.send({
            ok:true,
            redirect:'/onboarding/company/register',
        })
      }else{
        res.send({
            ok:true,
            redirect:'/main/seejobs?q=&country=&sub_div',
        })
      }
    }else{
        res.send({
            ok:false,
        })
    }
})




module.exports = router