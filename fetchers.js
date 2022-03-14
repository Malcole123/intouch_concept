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
const createCompanyURL = process.env.CREATE_COMPANY

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
          auth:res.data.response.authToken,
          completed:true,
          user:res.data.response.user
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
      data:res.data,
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
    resume_reference:req.resume,
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
    return res.data
  })
  .catch(err => {
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
    return res
  })
  .catch(err => {
      return err
  });
  return response
}

const createNewCompany = async (c_Data,auth,user)=>{
  const response = await  axios.post(createCompanyURL,{
    name:c_Data.name,
    about_company:c_Data.about,
    mission_statement:c_Data.mission_state,
    industry:c_Data.industry,
    official_website:c_Data.official_website,
    company_size:c_Data.company_size,
    company_type:c_Data.company_type,
    recruiter_email:c_Data.recruiter_email,
    recruiter_phone:c_Data.recruiter_phone,
    country:c_Data.country,
    creator:user,
    company_data:JSON.stringify({
      "urls": {
        "company_logo": "",
        "direct_user_to": "",
        "application_test": ""
      },
      "company_id":"",
      "company_name": c_Data.name.toLowerCase(),
      "company_details": {
        "contact": {
          "email": c_Data.recruiter_email,
          "phone": c_Data.recruiter_phone
        },
        "country": c_Data.country,
        "sub_div": "",
        "industry": c_Data.industry,
        "company_size": c_Data.company_size,
        "company_type": c_Data.company_type,
        "headquarters": "",
        "about_company": c_Data.about,
        "company_website": c_Data.official_website,
        "mission_statement": c_Data.mission_state
      }
    })
  },
  {
    headers:{
      'Authorization':`Bearer ${auth}`,
      'Content-Type':'application/json',
    }
  })
  .then(res => {
    var retData = {
        ok:true,
        data:res.data
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

/*Communication Start */
const verifyEmailCreate = async (email,name,code)=>{
  var sender_email = 'intouchjamaica1@gmail.com';
  var sender_name ='Intouch Jamaica';
  var reciever_email = email;
  var reciever_name = name;
  var logoURL,salutation,greeting,instructions,opt_instructions,signature,tagline;
  var subject = "Verify your account"
  const response = await  axios.post(`https://adastacks.app.n8n.cloud/webhook/email-verify?subject=${subject}&from_email=${sender_email}&to_email=${reciever_email}logo_url=${logoURL}&greeting=${greeting}&instructions=${instructions}&code=${code}&opt_instructions=${opt_instructions}&salutation=${salutation}&signature=${signature}&company_name=${sender_name}&company_tagline=${tagline}`,{
    "api_key":"Ew5OVulWU7t2OzrgdfXV",
    "Content-Type":'application/json',
},      
  {
    headers:{
      'Content-Type':'application/json',
      "api_key":"Ew5OVulWU7t2OzrgdfXV"
    }
  })
  .then(res => {
    var retData = {
        ok:true,
        data:res.data
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

const verifySmsCreate = async (to,message)=>{
  const response = await  axios.post(`https://adastacks.app.n8n.cloud/webhook/send-sms`,{
    to:to,
    body:message
},      
  {
    headers:{
      'Content-Type':'application/json',
      "api_key":"Ew5OVulWU7t2OzrgdfXV"
    }
  })
  .then(res => {
    var retData = {
        ok:true,
        data:res.data
    }
    return retData
  })
  .catch(err => {
    var retData = {
      ok:false,
      data:err
    }
    return retData
  });
  return response
}


/*Communication end */



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
  createCompany:createNewCompany,
  v_email_create:verifyEmailCreate,
  v_sms_create:verifySmsCreate,
}