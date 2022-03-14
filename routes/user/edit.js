if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const sessionKey = process.env.SESSION_SECRET
const jobCalls = require('../../jobFetchers.js');
const urlHandlers = require('../../urlHandlers.js')
const express = require('express');
const sessions = require('express-session');
const fetchers = require('../../fetchers.js');

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


const isAuth = (req,res,next)=>{
    var session = req.session;
    if(session.userID){
        next()
    }else{
        res.redirect('/main/home')
    }
}

router.get('/profile/edit',isAuth,(req,res)=>{
    var session = req.session;
    var user = {
        fname:session.userFNAME,
        lname:session.userLNAME,
        email:session.userEmail,
        phone:session.userPhone
    }
    res.render('./account/profile/edit_profile.ejs',{
        user:user,
        loggedIn:true,
        get_start:null,
        type:'edit'
    })
})

router.get('/profile/notification',isAuth,(req,res)=>{
    var session = req.session;
    var user = {
        fname:session.userFNAME,
        lname:session.userLNAME,
        email:session.userEmail,
        phone:session.userPhone
    }
    res.render('./account/profile/edit_profile.ejs',{
        user:user,
        loggedIn:true,
        get_start:null,
        type:'notification'
    })
})

router.get('/profile/cookies',isAuth,(req,res)=>{
    var session = req.session;
    var user = {
        fname:session.userFNAME,
        lname:session.userLNAME,
        email:session.userEmail,
        phone:session.userPhone
    }
    res.render('./account/profile/edit_profile.ejs',{
        user:user,
        loggedIn:true,
        get_start:null,
        type:'cookies'
    })
})

router.get('/profile/applications',isAuth,(req,res)=>{
    var session = req.session;
    var user = {
        fname:session.userFNAME,
        lname:session.userLNAME,
        email:session.userEmail,
        phone:session.userPhone
    }
    res.render('./account/profile/edit_profile.ejs',{
        user:user,
        loggedIn:true,
        get_start:null,
        type:'applications'
    })
})


router.post('/edit/preferences', async (req,res)=>{
    var session = req.session;
    if(session.userID !== null || session.userID !== undefined){
        var result = await fetchers.editGenPref({
            authToken:session.userID,
            update_type:req.body.update_Type,
            user_id:parseInt(session.myID),
            add_comp:req.body.f_comp,
            add_job:req.body.f_jobs,
            add_alert:req.body.job_alerts,
        })
        if(result.ok){
            res.send({
                ok:true,
                data:result.data
            })
        }else{
            res.send({
                ok:false,
            })
    
        }
    }else{
        res.send({
            ok:false,
            message:'Not a user'
        })
    }
})







module.exports = router