if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const jobCalls = require('../jobFetchers.js');
const urlHandlers = require('../urlHandlers.js');
const qHandler = urlHandlers.qHandler;
const express = require('express');
const formidable = require('express-formidable');
const sessions = require('express-session');
const fetchers = require('../fetchers.js');
const router = express.Router();
const bodyParser = require('body-parser');

const path = require('path');
const fs = require("fs");
const multer = require("multer");
const database = require('../database.js');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/privacy_policy', (req,res)=>{
    res.render('./legal/privacy-policy.ejs')
})

router.get('/terms_of_service', (req,res)=>{
    res.render('./legal/terms.ejs')
})



module.exports = router
