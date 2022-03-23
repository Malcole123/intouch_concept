if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const fetchallListingsUrl = process.env.QUERY_ALL_JOBS_URL;
const fetchListingByIDURL = process.env.QUERY_JOB_BY_ID;
const fetchMySavedURL = process.env.QUERY_MY_SAVED_JOBS;

const fs = require('fs')
const axios = require('axios').default


const jobQueryAll = async (jobQuery="", country="", sub_division="")=>{
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
      return err
    });
    return response.data
}

const jobQuerySingle = async (id)=>{
   var response = await axios.get(fetchListingByIDURL+id, {
        params:{
            job_id:id,
        }
    })
    .then(res => {
        return res
    })
    .catch(err => {
      return false
    });
    return response
}

const jobQueryMine = async (id)=>{
  var response = await  axios.get(fetchMySavedURL, {
        params:{
            user_id:id
        }
    })
    .then(res => {
      return{
        completed:true,
        data:res.data
      }
    })
    .catch(err => {
      return {
        completed:false,
        message:err.message
      }
    });
    return response.data
}





module.exports = {
  jbAllFetch:jobQueryAll,
  jbSingleFetch:jobQuerySingle,
  jbMineSaved:jobQueryMine,
}