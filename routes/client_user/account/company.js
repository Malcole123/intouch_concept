if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const sessionKey = process.env.SESSION_SECRET
const base_url = process.env.BASE_URL
const express = require('express');
const app = express();
const { append } = require('express/lib/response');
const fetchers = require('../../../fetchers');
const cookie = require('cookie');
const session = require('express-session');
const urlHandler = require('../../../urlHandlers');
const cookieParser = require('cookie-parser');
const router = express.Router();


router.use(cookieParser())
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.post('/create',async (req,res)=>{
    var session = req.session;
    var returned = await fetchers.createCompany(req.body,session.userID,session.myID);
    if(returned.ok){
        session.companyID = returned.data.id
        res.send({
            ok:true
        })
    }else{
        res.send({
            ok:false
        })
    }
})

module.exports = router