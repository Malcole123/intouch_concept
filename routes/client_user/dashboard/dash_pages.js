if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const sessionKey = process.env.SESSION_SECRET
const base_url = process.env.BASE_URL
const express = require('express');
const fetchers = require('../../../fetchers');
const cookie = require('cookie');
const sessions = require('express-session');
const urlHandler = require('../../../urlHandlers');
const getters = require('./fetchers_putters.js');
const res = require('express/lib/response');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/home', async (req, res)=>{
    var session;
    session = req.session;
    var userData = {
        fname:session.userFNAME,
        email:session.userEmail,
        comp_id:session.companyID
    }
    var application = await getters.submittedApplications(req.session.companyID,'');
    var company_data = await getters.getCompInfo(req.session.companyID,"");
    if(session.userID && session.userType === 'client'){
        if(company_data.ok && company_data.status === 200){
            res.render('./dashboard/index',{
                active_list:company_data.data.listings,
                userDetails:userData,
                application:application.data,
                companyData:company_data.data.company_data
            })
        }else{
            res.redirect('/employer/login')
        }
    }else{
        res.redirect('/employer/login')
    }
})

router.get('/listings', async (req, res)=>{
    var session;
    session = req.session;
    var company_data = await getters.getCompInfo(req.session.companyID,"empty");
    var userData = {
        fname:session.userFNAME,
        email:session.userEmail,
        comp_id:session.companyID
    }
    var act_listings = await getters.getEmpListings(req.session.companyID,'');
    var pen_listings = await getters.getPenListings(req.session.companyID);
    if(session.userID){
        res.render('./dashboard/listings_main',{
            active_list:act_listings.data,
            pending_list:pen_listings.data,
            userDetails:userData,
            company:company_data.data.company_data
        });
    }else{
        res.redirect('/employer/login')
    }
})

router.get('/applications',async (req,res)=>{
    var session;
    session = req.session;
    var userData = {
        fname:session.userFNAME,
        email:session.userEmail,
        comp_id:session.companyID
    }
    const appStatus = (data)=>{ //Mandatory array
        var sorted={
            pending:0,
            contacted:0,
            interviewed:0,
            short_listed:0,
            reviewed:0,
            rejected:0,
        };
        data.forEach((app) => {
            switch(app.status){
                case 'pending_review':
                    var curr = sorted.pending;
                    curr +=1;
                    sorted.pending = curr;
                    break
                case'contacted':
                    var curr = sorted.contacted;
                    curr +=1;
                    sorted.contacted = curr;
                    break
                case 'interviewed':
                    var curr = sorted.interviewed;
                    curr +=1;
                    sorted.interviewed = curr;
                    break
                case 'short_listed':
                    var curr = sorted.short_listed;
                    curr +=1;
                    sorted.short_listed = curr;
                    break
                case 'reviewed':
                    var curr = sorted.reviewed;
                    curr +=1;
                    sorted.reviewed = curr;
                    break
                case 'rejected':
                    var curr = sorted.rejected;
                    curr +=1;
                    sorted.rejected = curr;
                    break
            }
        });
        return sorted  
    }
    var act_listings = await getters.getEmpListings(req.session.companyID,'');
    var application = await getters.submittedApplications(req.session.companyID,'');
    var company_data = await getters.getCompInfo(req.session.companyID);
    var sorted_app = await appStatus(application.data);
    if(session.userID){
        res.render('./dashboard/application',{
            active_list:act_listings.data,
            userDetails:userData,
            application:application.data,
            companyData:company_data.data, 
            app_break:sorted_app,         
        })
    }else{
        res.redirect('/employer/login')
    }

})

router.get('/analytics',async (req,res)=>{
    var session;
    session = req.session;
    var userData = {
        fname:session.userFNAME,
        email:session.userEmail,
        comp_id:session.companyID
    }
    const appStatus = (data)=>{ //Mandatory array
        var sorted={
            pending:0,
            contacted:0,
            interviewed:0,
            short_listed:0,
            reviewed:0,
            rejected:0,
        };
        data.forEach((app) => {
            switch(app.status){
                case 'pending_review':
                    var curr = sorted.pending;
                    curr +=1;
                    sorted.pending = curr;
                    break
                case'contacted':
                    var curr = sorted.contacted;
                    curr +=1;
                    sorted.contacted = curr;
                    break
                case 'interviewed':
                    var curr = sorted.interviewed;
                    curr +=1;
                    sorted.interviewed = curr;
                    break
                case 'short_listed':
                    var curr = sorted.short_listed;
                    curr +=1;
                    sorted.short_listed = curr;
                    break
                case 'reviewed':
                    var curr = sorted.reviewed;
                    curr +=1;
                    sorted.reviewed = curr;
                    break
                case 'rejected':
                    var curr = sorted.rejected;
                    curr +=1;
                    sorted.rejected = curr;
                    break
            }
        });
        return sorted  
    }
    var act_listings = await getters.getEmpListings(req.session.companyID,'');
    var application = await getters.submittedApplications(req.session.companyID,'');
    var company_data = await getters.getCompInfo(req.session.companyID);
    if(session.userID){
        res.render('./dashboard/analytics',{
            active_list:act_listings.data,
            userDetails:userData,
            application:application.data,
            companyData:company_data.data, 
        })
    }else{
        res.redirect('/employer/login')
    }

})

router.get('/campaign/email', async (req, res)=>{
    var session;
    session = req.session;
    var userData = {
        fname:session.userFNAME,
        email:session.userEmail,
        comp_id:session.companyID
    }
    var company_data = await getters.getCompInfo(req.session.companyID,"");
    if(session.userID && session.userType === 'client'){
        if(company_data.ok && company_data.status === 200){
            res.render('./dashboard/campaign_email',{
                active_list:company_data.data.listings,
                userDetails:userData,
                companyData:company_data.data.company_data
            })
        }else{
            res.redirect('/employer/login')
        }
    }else{
        res.redirect('/employer/login')
    }
})

router.get('/campaign/sms', async (req, res)=>{
    var session;
    session = req.session;
    var userData = {
        fname:session.userFNAME,
        email:session.userEmail,
        comp_id:session.companyID
    }
    var company_data = await getters.getCompInfo(req.session.companyID,"");
    if(session.userID && session.userType === 'client'){
        if(company_data.ok && company_data.status === 200){
            res.render('./dashboard/campaign_sms',{
                active_list:company_data.data.listings,
                userDetails:userData,
                companyData:company_data.data.company_data
            })
        }else{
            res.redirect('/employer/login')
        }
    }else{
        res.redirect('/employer/login')
    }
})

router.get('/manage/profile', async (req, res)=>{
    var session;
    session = req.session;
    var userData = {
        fname:session.userFNAME,
        email:session.userEmail,
        comp_id:session.companyID
    }
    var company_data = await getters.getCompInfo(req.session.companyID,"");
    if(session.userID && session.userType === 'client'){
        if(company_data.ok && company_data.status === 200){
            res.render('./dashboard/manage_profile',{
                active_list:company_data.data.listings,
                userDetails:userData,
                companyData:company_data.data.company_data
            })
        }else{
            res.redirect('/employer/login')
        }
    }else{
        res.redirect('/employer/login')
    }
})

router.get('/manage/team', async (req, res)=>{
    var session;
    session = req.session;
    var userData = {
        fname:session.userFNAME,
        email:session.userEmail,
        comp_id:session.companyID
    }
    var company_data = await getters.getCompInfo(req.session.companyID,"");
    if(session.userID && session.userType === 'client'){
        if(company_data.ok && company_data.status === 200){
            res.render('./dashboard/manage_team',{
                active_list:company_data.data.listings,
                userDetails:userData,
                companyData:company_data.data.company_data
            })
        }else{
            res.redirect('/employer/login')
        }
    }else{
        res.redirect('/employer/login')
    }
})

router.get('/billing', async (req, res)=>{
    var session;
    session = req.session;
    var userData = {
        fname:session.userFNAME,
        email:session.userEmail,
        comp_id:session.companyID
    }
    var company_data = await getters.getCompInfo(req.session.companyID,"");
    if(session.userID && session.userType === 'client'){
        if(company_data.ok && company_data.status === 200){
            res.render('./dashboard/billing',{
                active_list:company_data.data.listings,
                userDetails:userData,
                companyData:company_data.data.company_data
            })
        }else{
            res.redirect('/employer/login')
        }
    }else{
        res.redirect('/employer/login')
    }
})

router.get('/support', async (req, res)=>{
    var session;
    session = req.session;
    var userData = {
        fname:session.userFNAME,
        email:session.userEmail,
        comp_id:session.companyID
    }
    var company_data = await getters.getCompInfo(req.session.companyID,"");
    if(session.userID && session.userType === 'client'){
        if(company_data.ok && company_data.status === 200){
            res.render('./dashboard/support',{
                active_list:company_data.data.listings,
                userDetails:userData,
                companyData:company_data.data.company_data
            })
        }else{
            res.redirect('/employer/login')
        }
    }else{
        res.redirect('/employer/login')
    }
})











router.post('/listings/add', async (req,res)=>{
    var session = req.session
    var result =  await getters.addListing(req.body, session.companyID);
        res.send({
            message:result.message,
            data:result.listing
        })
});

router.post('/listings/get', async(req,res)=>{
    var result = await getters.getEmpListings(req.session.companyID,'');
})

router.post('/listings/edit', async (req,res)=>{
    var session = req.session;
    var result = await getters.addListing(req.body, session.companyID);
    res.send({
        mesage:result.message,
        data:result.listing,
    })
})

router.post('/listings/delete', async (req,res)=>{
    var session = req.session;
    var result = await getters.deleteListing(req.body.id, session.myID);
    if(!result.error){
        res.send({
            ok:true,
            message:'Listing has been deleted '
        })
    }else{
        res.send({
            ok:false,
            message:'Something went wrong please try again later.'
        })
    }
})


module.exports = router