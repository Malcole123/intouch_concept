if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const fetchallListingsUrl = process.env.QUERY_ALL_JOBS_URL;
const sAuUrl = process.env.USER_AUTH_SIGNUP;
const lAuUrl = process.env.USER_AUTH_LOGIN;
const searchbyEmailUrl = process.env.USER_SEARCH_BY_EMAIL;

const fs = require('fs')
const axios = require('axios').default


const jobFetch = async (jobQuery="", country="", sub_division="")=>{
  var response = await  axios.get(fetchallListingsUrl, {
        params:{
            title_query:jobQuery,
            country:country,
            sub_division:sub_division,
        }
    })
    .then(res => {
        return res
    })
    .catch(err => {
      console.log('Error: ', err.message);
    });
    return response.data
}

const signupAuthFetch = async (req)=>{
      const response = await  axios.post(sAuUrl, {
        fname:req.fn,
        lname:req.ln,        
        email:req.e,
        password:req.p,
        phone:req.pn,
        tos:req.tos
      })
      .then(res => {
        var retData = {
          "res":res.data.authToken,
          "completed":true
        }
        return retData
      })
      .catch(err => {
        console.log(err)
        var retData = {
          "completed":false
        }
        console.log(retData)
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
      "auth":res.data.authToken,
      "completed":true
    }
    console.log(retData)
    return retData
  })
  .catch(err => {
    var retData = {
      "completed":false
    }
    return retData
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
    console.log('err')
  });
  return response
}



module.exports = {
  fetchJobsCall : jobFetch,
  fetchsignAuth: signupAuthFetch,
  fetchloginAuth :loginAuthFetch,
  fetchUserByEmail:userExists,
}