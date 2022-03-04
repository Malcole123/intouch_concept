if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const sessionKey = process.env.SESSION_SECRET
const urlHandlers = require('../../urlHandlers.js')
const express = require('express');
const sessions = require('express-session');
const fetchers = require('../../fetchers.js');

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(sessions({
    secret: sessionKey,
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false 
}));


router.get('/settings',(req,res)=>{

})



router.get('/notifications/mynotifications/receive', async (req,res)=>{   //returns data --->> not for viewing page
    var session = req.session
    var result = await fetchers.getNotif(session.userID,session.myID);
    res.send(result)
})

router.post('/notifications/mynotifications/remove', async(req,res)=>{
    var session = req.session;
    var result = await fetchers.removeNotif(session.userID,session.myID,req.body.notifs);
    res.send(result)
})




module.exports = router