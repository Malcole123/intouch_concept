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

router.get('/profile/edit',isAuth,async (req,res)=>{
    var session = req.session;
    var myData = await fetchers.fetchAuthMe(session.userID);
    var user = {
        fname:session.userFNAME,
        lname:session.userLNAME,
        email:session.userEmail,
        phone:myData.data.phone_number,
    }
    res.render('./account/profile/edit_profile.ejs',{
        user:user,
        loggedIn:true,
        get_start:null,
        type:'edit'
    })
})

router.get('/profile/security',isAuth,async(req,res)=>{
    var session = req.session;
    var myData = await fetchers.fetchAuthMe(session.userID);
    var user = {
        fname:session.userFNAME,
        lname:session.userLNAME,
        email:session.userEmail,
        phone:myData.data.phone,
    }
    res.render('./account/profile/edit_profile.ejs',{
        user:user,
        loggedIn:true,
        get_start:null,
        type:'security'
    })
})

router.get('/profile/notification',isAuth,async(req,res)=>{
    var session = req.session;
    var myData = await fetchers.fetchAuthMe(session.userID);
    var user = {
        fname:session.userFNAME,
        lname:session.userLNAME,
        email:session.userEmail,
        phone:myData.data.phone,
        notif:myData.data.notification_settings
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

router.get('/profile/applications',isAuth,async (req,res)=>{
    var session = req.session;
    var app_data = await fetchers.getmyApplications(session.myID);
    if(app_data.completed){
        var user = {
            fname:session.userFNAME,
            lname:session.userLNAME,
            email:session.userEmail,
            phone:session.userPhone,
            applications:app_data.data
        }
    }else{

    }
    res.render('./account/profile/edit_profile.ejs',{
        user:user,
        loggedIn:true,
        get_start:null,
        type:'applications',
    })
})

router.get('/saved/jobs', isAuth, async (req,res)=>{
    var session = req.session;
    var myData = await fetchers.fetchAuthMe(session.userID);
    var user = {
        fname:session.userFNAME,
        lname:session.userLNAME,
        email:session.userEmail,
        phone:myData.data.phone,
    }
    res.render('./account/profile/savedjobs.ejs',{
        loggedIn:true,
        get_start:null,
        user:user,
        s_jobs:myData.data.favourite_jobs
    })
})

router.get('/saved/applications', isAuth, async (req,res)=>{
    var session = req.session;
    var myData = await fetchers.getmyApplications(session.myID,session.userID);
    var user = {
        fname:session.userFNAME,
        lname:session.userLNAME,
        email:session.userEmail,
        phone:"",
    }
    res.render('./account/profile/my-applications.ejs',{
        loggedIn:true,
        get_start:null,
        user:user,
        s_app:myData.data
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

router.post('/edit/account', async(req,res)=>{
    var session = req.session;
    var myData = await fetchers.fetchAuthMe(session.userID);
    if(session.userID !== null && session.userID !== undefined){
        var changeData = {
            id:session.myID,
            type:req.body.type,
            fname:req.body.fname.length > 0 ? req.body.fname : myData.data.first_name,
            lname:req.body.lname.length > 0 ? req.body.lname : myData.data.last_name,
            phone:req.body.phone.length > 0 ? req.body.phone : myData.data.phone_number,
            old_password:req.body.old_password,
            new_password:req.body.new_password,
        }
        var getDT = await fetchers.editUserAccount(changeData);
        if(getDT.ok){
            res.send({ok:true})
        }else{
            res.send({ok:false})
        }
    }else{
        res.send('Not a user')
    }
})

router.post('/edit/applications', async(req,res)=>{
    var session = req.session
    var answer = await fetchers.deleteApplication(req.body.appID,session.myID,session.userID);
    if(answer.completed){
        res.send({
            ok:true
        })
    }else{
        res.send({
            ok:false
        })
    }
})







module.exports = router