if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const sessionKey = process.env.SESSION_SECRET
const express = require('express');
const fetchers = require('../fetchers.js');
const cookie = require('cookie');
const sessions = require('express-session');

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));







module.exports = router