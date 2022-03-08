if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const sessionKey = process.env.SESSION_SECRET
const jobCalls = require('../jobFetchers.js');
const urlHandlers = require('../urlHandlers.js');
const qHandler = urlHandlers.qHandler;
const express = require('express');
const sessions = require('express-session');
const fetchers = require('../fetchers.js');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/home', (req,res)=>{
    var session = req.session;
    session.last_visit = req._parsedOriginalUrl.href
    if(session.userID){
        var button = "../components/buttons/logged_in_state"
        res.render('./main/index',{
            get_start:null,
            access:'common',
            user:{
                fname:session.userFNAME
            }
        })
    }else{
        res.render('./main/index',{
            get_start:true,
            access:'common'
        })
    }
})

router.get('/seejobs', async (req,res)=>{
    var session = req.session;
    session.last_visit = req._parsedOriginalUrl.href
    const jobQueryParams = (params)=>{
        var search, searchSan,searchObjValues
        searchObjValues = []
        search = params
        searchSan= search.split('&');
        for(let i = 0; i < searchSan.length; i++){
            var arr = searchSan[i].split('=');
            var targ = arr[1];
            var final = targ.replaceAll('%20', " ");
            searchObjValues.push(final)
        }
        var send = {
           "jobQuery":searchObjValues[0],
           "country":searchObjValues[1],
           "sub_division":searchObjValues[2],
           "view":searchObjValues[3],
           "referral":searchObjValues[4],
           "source":searchObjValues[5],
        }
        return send
    }
    const get_params = await jobQueryParams(req._parsedOriginalUrl.search);
    var result = await jobCalls.jbAllFetch(get_params.jobQuery, get_params.country,get_params.sub_division);
    if(session.userID){
        var button = "../components/buttons/logged_in_state"
        res.render('./main/searchpage', {
            lgBtn:button,
            jData:result,
            query:get_params.jobQuery,
            loggedIn:true,
            user:{
                id:session.myID,
                fname:session.userFNAME,
                lname:session.userLNAME,
                email:session.userEmail,
                type:session.userType,
                pref:{
                    fav_comp:session.fav_comp,
                    fav_jobs:session.fav_jobs,
                    my_alerts:session.my_alerts
                }
            }
        })
    }else{
        var button = "../components/buttons/login_signup_button"
        res.render('./main/searchpage', {
            lgBtn:button,
            jData:result,
            query:get_params.jobQuery,
            loggedIn:false,
            user:{
                id:0,
                fname:"",
                lname:"",
                email:"",
                type:"",
                pref:{
                    fav_comp:[],
                    fav_jobs:[],
                    my_alerts:[],
                }
            }
        })

    }
})

router.get('/jobview', async (req, res)=>{
    var relData = await jobCalls.jbSingleFetch(req._parsedOriginalUrl.query.replace('id=',''));
    var d = relData.data;
    var session = req.session;
    if(session.userID){
        var button = "../components/buttons/logged_in_state"
        res.render('./main/jobinfo', {
            data:d,
            companyName:d.company_name_posted,
            position:d.title,
            pData:d.positionData,
            links:{
                applyRoute:`/main/job/apply?id=${d.id}`,
                homeRoute:'/main/home',
                logo:d.positionData.urls.company_logo || '/images/imageplaceholder.png'
            },
            lgBtn:button
        })
    }else{
        var button = "../components/buttons/login_signup_button"
        res.render('./main/jobinfo', {
            data:d,
            companyName:d.company_name_posted,
            position:d.title,
            pData:d.positionData,
            links:{
                applyRoute:`/main/job/apply?id=${d.id}`,
                homeRoute:'/main/home',
                logo:d.positionData.urls.company_logo || '/images/imageplaceholder.png'
            },
            lgBtn:button
        }) 
    }
})

router.get('/postajob/landing',(req,res)=>{
    var session = req.session;
    session.last_visit = req._parsedOriginalUrl.href
    if(session.userID && session.userType==='client'){
        res.redirect('/dashboard/home')
    }else{
        res.render('./main/postajoblanding.ejs',{
            get_start:true,
            access:'client'
        })
    }
})

router.get('/user/favourites', async (req,res)=>{
    var session = req.session;
    if(session.userID){
        var userData = await fetchers.fetchAuthMe(session.userID);
        res.send({
            ok:true,
            data:{
                job_alerts:userData.data.job_alerts,
                fav_jobs:userData.data.favourite_jobs,
                fav_comp:userData.data.following_companies,
                me:userData.data.id
            }
        })
    }else{
        res.send({
            ok:false
        })
    }
})

router.get('/company/profile',async (req,res)=>{
    var session= req.session;
    session.last_visit = req._parsedOriginalUrl.href
    var path = req._parsedOriginalUrl.query.replace('name=','')
    var result = await fetchers.getCompanyData(0,path.replaceAll('%20',' '))
    if(session.userID && result.data){
        res.render('./main/company_profile.ejs',{
            loggedIn:true,
            user:{
                id:session.myID,
                fname:session.userFNAME,
                lname:session.userLNAME,
                email:session.userEmail,
                type:session.userType,
                pref:{
                    fav_comp:session.fav_comp,
                    fav_jobs:session.fav_jobs,
                    my_alerts:session.my_alerts
                }
            },
            c_Data:result.data.company_data,
            l_Data:result.data.listings
        })
    }else if(!session.userID && result.data){
        res.render('./main/company_profile.ejs',{
            loggedIn:false,
            user:{
                id:session.myID,
                fname:session.userFNAME,
                lname:session.userLNAME,
                email:session.userEmail,
                type:session.userType,
                pref:{
                    fav_comp:session.fav_comp,
                    fav_jobs:session.fav_jobs,
                    my_alerts:session.my_alerts
                },
            },
            c_Data:result.data.company_data,
            l_Data:result.data.listings   
    })
    }else{
        res.send('Something went wrong')
    }
})

router.post('/seejobs/id', (req,res)=>{
    /*var result = await jobCalls.jbSingleFetch(req.body.id);*/
    var retDATA = {
        urlPath:`/main/jobview?id=${req.body.id}`,
        jobQuery:req.body.id,
        success:null,
    }
    if(!result){
        retDATA.success = false;
        retDATA.urlPath = req;
        res.send(retDATA)
    }else{
        retDATA.success = true;
        res.send(retDATA)

    }
})


router.post('/application/submit',async (req,res)=>{
    var ret_Data = await fetchers.postApplication(req.body);
    res.send(ret_Data)
})





module.exports = router
