if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const createShareUrl = process.env.CREATE_SHARE
const fullfillShareUrl = process.env.FULLFILL_SHARE

const fs = require('fs')
const axios = require('axios').default

const createShare = async (jid,source,ref)=>{
    const response = await  axios.post(createShareUrl, {
        job_listings_id:jid,
        share_method:source,
        share_ref:ref,
    })
    .then(res => {
        return{
            ok:true
        }
    })
    .catch(err => {
        return{
            ok:false
        }
    });
    return response
}

const shareFulfill = async (ref)=>{
    const response = await  axios.post(`${fullfillShareUrl}/${ref}`, {
        share_ref:ref
    })
    .then(res => {
        return{
            ok:true
        }
    })
    .catch(err => {
        return{
         ok:false
     }
    });
    return response
}



module.exports = {
    create_Share:createShare,
    fulfill_Share:shareFulfill,
}






