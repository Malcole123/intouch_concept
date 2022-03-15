if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

//Urls
const fetchMyListings = process.env.QUERY_MY_LISTINGS;
const addMyListing = process.env.ADD_MY_LISTING;
const changeMyListing = process.env.EDIT_MY_LISTING;
const getCompInfoURL = process.env.GET_COMPANY_INFO
const getPendingListings =process.env.GET_MY_PENDING_LISTINGS
const getSubmittedApplicationsURL = process.env.GET_SUBMITTED_APPLICATIONS
const deleteListingUrl = process.env.DELETE_LISTING
//Urls end
const fs = require('fs')
const axios = require('axios').default
const express = require('express');

const getallMyListings = async (id,name)=>{
    const data = await  axios.get(`${fetchMyListings}?company_id=${id}&company_name=${name}`, {
        headers:{
          "Content-Type":"application/json"
        }
    })
    .then(res => {
     return res
    })
    .catch(err => {
        return {
            error:true,
            msg:err.msg
        }
    });
    return data
}

const getmyPendingListings = async (id,name)=>{ 
    const data = await  axios.get(`${getPendingListings}?company_id=${id}`, {
        headers:{
          "Content-Type":"application/json"
        }
    })
    .then(res => {
     return res
    })
    .catch(err => {
        return {
            error:true,
            msg:err.msg
        }
    });
    return data
}

const getSubmittedApplications = async (id,status)=>{ 
    const data = await  axios.get(`${getSubmittedApplicationsURL}?comp_id=${id}&status=${status}`, {
        headers:{
          "Content-Type":"application/json"
        }
    })
    .then(res => {
     return res
    })
    .catch(err => {
        return {
            error:true,
            msg:err.msg
        }
    });
    return data
}

const createMyListing = async (info,id)=>{
    const s_data = await  axios.post(`${addMyListing}`, {
        "title":info.l_d.title,
        "description": info.l_d.position_summary,
        "type": info.l_d.job_type,
        "verified_companies_id":parseInt(id),
        "application_deadline": info.l_d.application_deadline,
        "loc_country":info.l_d.employment_location,
        "loc_sub_division":info.l_d.employment_location,
        "company_name_posted":info.l_d.name,
        "benefits":JSON.stringify(info.l_d.benefits),
        "responsibilites":JSON.stringify(info.l_d.responsibilities),
        "qualifications":JSON.stringify(info.l_d.desired_qual),
        //Backup
        "data.company_name":info.c_d.name,
        "data.company_id":parseInt(id),
        "data.company_details.contact.phone":info.c_d.recruiter_phone,
        "data.company_details.contact.email":info.c_d.recruiter_email,
        "data.company_details.country":info.c_d.country,
        "data.company_details.sub_div":info.c_d.headquarter,
        "data.company_details.industry":info.c_d.industry,
        "data.company_details.company_size":info.c_d.company_size,
        "data.company_details.headquarters":info.c_d.headquarter,
        "data.company_details.about_company":info.c_d.about_company,
        "data.company_details.mission_statement":info.c_d.mission_statement,
        "data.urls.company_logo":info.c_d.company_logo.url,
        "data.urls.direct_user_to":info.c_d.official_website,
        "data.urls.company_size":info.c_d.company_size,
        "data.position_details.benefits":JSON.stringify(info.l_d.benefits),
        "data.position_details.responsibilites":JSON.stringify(info.l_d.responsibilities),
        "data.position_details.desired_qual":JSON.stringify(info.l_d.desired_qual),
        "data.position_details.emp_type":info.l_d.job_type,
        "data.position_details.position_title":info.l_d.title,
        "data.position_details.job_location":info.l_d.job_location,
        "data.position_details.app_deadline":info.l_d.app_deadline,
        "j_data":JSON.stringify({
            l_data:info.l_d,
            c_data:info.c_d
        })
        //
    })
    .then(res => {
     return {
         error:false,
         listing:res.data,
         message:"Completed"
        }
    })
    .catch(err => {
        return {
            error:true,
            message:"Something went wrong. Please try again later or contact us for more help."
        }
    });
    return s_data
}

const editMyListing = async (info,id,comp_id)=>{
    const r_data = await getMyCompanyDetail(comp_id);
    var c_data = r_data.data
    const data = await  axios.post(`${changeMyListing}${id}`, {
        "job_listings_id":id,
        "title":info.position_details.position_title,
        "description": info.position_details.position_summary,
        "type": info.position_details.emp_Type,
        "category":info.position_details.cat_match,
        "application_deadline": info.position_details.app_deadline,
        "loc_country":info.position_details.job_location,
        "loc_sub_division":info.position_details.job_location,
        "url":info.urls.direct_user_to,
        "company_name_posted": c_data.name,
        "verified_companies_id":comp_id,
        "data.id":"",
        "data.company_name":c_data.company_size,
        "data.company_details.contact.phone":c_data.recruiter_phone,
        "data.company_details.country":c_data.company_data.company_details.country,
        "data.company_details.sub_div":c_data.company_data.company_details.sub_div,
        "data.company_details.industry":c_data.industry,
        "data.company_details.company_size":c_data.company_size,
        "data.company_details.headquarters":c_data.company_type,
        "data.company_details.about_company":c_data.about_company,
        "data.company_details.mission_statement":c_data.mission_statement,
        "data.urls.company_logo":c_data.company_logo.url,
        "data.urls.direct_user_to":"",
        "data.urls.company_size":"",
        "data.position_details.benefits":info.position_details.benefits,
        "data.position_details.responsibilites":info.position_details.responsibilities,
        "data.position_details.desired_qual":info.position_details.desired_qual,
        "data.position_details.application_process":info.position_details.application_process,
        "data.position_details.emp_Type":info.position_details.emp_Type,
        "data.position_details.position_title":info.position_details.position_title,
        "data.position_details.job_location":info.position_details.job_location,
        "data.position_details.app_deadline":info.position_details.app_deadline,   
        "data.position_details.cat_match":[],
        "positionData":JSON.stringify({
            urls:{
                company_logo:c_data.company_logo.url,
                direct_user_to:'',
                application_test:''
            },
            company_id:comp_id,
            company_name:c_data.name,
            listing_type:{
                premium:null,
            },
            company_details:{
                contact:{
                    email:c_data.recruiter_email,
                    phone:c_data.recruiter_phone,
                },
                country:c_data.company_data.company_details.country,
                sub_div:c_data.company_data.company_details.sub_div,
                industry:c_data.industry,
                company_size:c_data.company_size,
                company_type:c_data.company_type,
                headquarters:c_data.headquarter,
                about_company:c_data.about_company,
                company_website:c_data.official_website,
                mission_statement:c_data.mission_statement,
            },
            position_details:{
                benefits: info.position_details.benefits,
                emp_Type: info.position_details.emp_Type,
                cat_match:"",
                department: info.position_details.department,
                app_deadline: info.position_details.application_deadline,
                desired_qual: info.position_details.desired_qual,
                job_location: info.position_details.job_location,
                position_title:info.position_details.position_title,
                position_summary: info.position_details.position_summary,
                responsibilities: info.position_details.responsibilities,
                application_process: info.position_details.application_process,
                //
        
            }
        }),
    })
    .then(res => {
     return {
         error:false,
         listing_edit:res.data,
         message:"Completed"
        }
    })
    .catch(err => {
        return {
            error:true,
            message:"Something went wrong. Please try again later or contact us for more help."
        }
    });
    return data
}

const deleteListing = async (id,user_id)=>{
    const data = await  axios.post(`${deleteListingUrl}${id}`, {
        job_id:id,
        user_id:user_id
    })
    .then(res => {
     return {
         error:false,
        }
    })
    .catch(err => {
        return {
            error:true,
            message:"Something went wrong. Please try again later or contact us for more help."
        }
    });
    return data
}

const getMyCompanyDetail = async (id=0,name)=>{
    const data = await  axios.get(`${getCompInfoURL}?company_name=${name}&company_id=${id}`, {
        headers:{
          "Content-Type":"application/json"
        }
    })
    .then(res => {
     return {
         ok:true,
         data:res.data,
         status:res.status
        }
    })
    .catch(err => {
        return{
            ok:false,
            message:err.message,
            stats:err.status
        }
    });
    return data
}



module.exports = {
    getEmpListings:getallMyListings,
    getPenListings:getmyPendingListings,
    addListing:createMyListing,
    editListing:editMyListing,
    getCompInfo:getMyCompanyDetail,
    submittedApplications:getSubmittedApplications,
    deleteListing:deleteListing,
}