if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const express = require('express');
const { append } = require('express/lib/response');

const router = express.Router();

router.get('/home', (req,res)=>{
    res.render('./main/index')
})

router.get('/seejobs', (req,res)=>{
    res.render('./main/searchpage')
})



module.exports = router
