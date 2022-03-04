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

router.use(sessions({
    secret: sessionKey,
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false 
}));







module.exports = router