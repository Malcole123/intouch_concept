if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/privacy_policy', (req,res)=>{
    res.render('./legal/privacy-policy.ejs')
})

router.get('/terms_of_service', (req,res)=>{
    res.render('./legal/terms.ejs')
})



module.exports = router
