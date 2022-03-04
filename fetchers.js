if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const fetchallListingsUrl = process.env.QUERY_ALL_JOBS_URL;
const sAuUrl = process.env.USER_AUTH_SIGNUP;
const lAuUrl = process.env.USER_AUTH_LOGIN;
const authMeURL = process.env.USER_AUTH_ME;
const searchbyEmailUrl = process.env.USER_SEARCH_BY_EMAIL;
const applicationSubmitUrl = process.env.SUBMIT_APPLICATION_URL;
const editGeneralPreferencesURL = process.env.EDIT_GENERAL_PREFERENCES;
const getNotificationURL = process.env.GET_NOTIFICATIONS;
const getCompanyDataURL = process.env.GET_COMPANY_INFO;


const fs = require('fs')
const axios = require('axios').default


const signupAuthFetch = async (req)=>{
      const response = await  axios.post(sAuUrl, {
        fname:req.fn,
        lname:req.ln,        
        email:req.e,
        password:req.p,
        phone:req.pn,
        tos:req.tos,
        user_type:req.user_type,
      })
      .then(res => {
        var retData = {
          "auth":res.data.authToken,
          "completed":true,
          "v_code":res.data.v_code,
          "email":req.email,
        }
        return retData
      })
      .catch(err => {
        var retData = {
          "completed":false,
          "error":'User already exists'
        }
        return retData
      });
      return response
}

const loginAuthFetch = async (req)=>{
  const response = await  axios.post(lAuUrl, {
    email:req.email,
    password:req.pass,
  })
  .then(res => {
    var retData = {
        completed:true,
        data:res.data.data
    }
    return retData
  })
  .catch(err => {
    var retData = {
      completed:false,
      "error":"incorrect email/ password",
    }
    return retData
  });
  return response
}


const authMe = async (token)=>{
  const response = await  axios.get(`${authMeURL}`, {
      headers:{
        "Authorization" : `Bearer ${token}`,
        "Content-Type":"application/json"
      }
  })
  .then(res => {
    return {
      ok:true,
      data:res.data
    }
  })
  .catch(err => {
    return {
      ok:false,
      error:'invalid token'
    }
  });
  return response
}

const userExists = async (req)=>{
  var response = await  axios.get(`${searchbyEmailUrl}`,{
    params:{
      email:req.email
    }
  })
  .then(res => {
    var result = {
      'exists':res.data
    }
    return result
  })
  .catch(err => {
    return err
  });
  return response
}

const identityVerify = async(req)=>{
  var response = await axios.get(`${searchbyEmailUrl}`,{
    params:{
      email:req.email
    }
  })
  .then(res => {
    var result = {
      'exists':res.data
    }
    return result
  })
  .catch(err => {
    return err
  });
  return response

}

const editGeneralPref = async (req)=>{
  const response = await  axios.post(editGeneralPreferencesURL,{
    user_id:req.user_id,
    update_type:req.update_type,
    add_comp:req.add_comp,
    add_job:req.add_job,
    add_alert:req.add_alert
  },{
    headers:{
      'Authorization':`Bearer ${req.authToken}`,
      'Content-Type':'application/json',
    }
  })
  .then(res => {
    var retData = {
        ok:true,
        data:res.data.data
    }
    return retData
  })
  .catch(err => {
    var retData = {
      ok:false,
    }
    return retData
  });
  return response
}

const submitApplication = async (req)=>{
  const response = await  axios.post(applicationSubmitUrl, {
    job_id:req.job_id,
    name:req.name,
    phone:req.phone,
    email:req.email,
    resume:req.resume,
    verified_companies_id:req.verified_companies_id,
    application_test_data:JSON.stringify(req.application_test_data)
  })
  .then(res => {
    var retData = {
        completed:true,
    }
    return retData
  })
  .catch(err => {
    var retData = {
      completed:false,
    }
    return retData
  });
  return response
}

const getNotifications = async (auth_id,my_id)=>{
  var response = await  axios.get(`${getNotificationURL}?user_id=${my_id}`,{
    headers:{
      'Authorization':`Bearer ${auth_id}`,
      'Content-Type':'application/json'
    }
  })
  .then(res => {
    console.log(res.data)
    return res.data
  })
  .catch(err => {
    console.log(err)
    return err
  });
  return response
}

const removeNotification = async (user_id,my_id,notif_id)=>{
  const response = await  axios.post(applicationSubmitUrl, {
    authToken:user_id,
    user_id:my_id,
    notif_id:notif_id,
  })
  .then(res => {
    console.log(res.data);
    return res
  })
  .catch(err => {
      console.log(err);
      return err
  });
  return response
}


/*Common User End*/

/* Get general data*/
const getCompanyInfo = async(id=0, name)=>{
  var response = await  axios.get(`${getCompanyDataURL}?company_name=${name}&company_id=${id}`,{
    headers:{
      'Content-Type':'application/json'
    }
  })
  .then(res => {
    return {
      ok:true,
      data:res.data
    }
  })
  .catch(err => {
    return{
      ok:false,
    }
  });
  return response
}




/*Get general data end */



module.exports = {
  fetchsignAuth: signupAuthFetch,
  fetchloginAuth :loginAuthFetch,
  fetchUserByEmail:userExists,
  fetchAuthMe:authMe,
  postApplication:submitApplication,
  editGenPref:editGeneralPref,
  getNotif:getNotifications,
  removeNotif:removeNotification,
  getCompanyData:getCompanyInfo,
}