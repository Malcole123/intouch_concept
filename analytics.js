if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const sessionKey = process.env.SESSION_SECRET
const jobCalls = require('../jobFetchers.js');
const urlHandlers = require('../urlHandlers.js')
const express = require('express');
const sessions = require('express-session');
const fetchers = require('../fetchers.js');

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));



module.exports = router