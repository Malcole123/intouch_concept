'use strict';

const mongoURI = 'mongodb+srv://malik123:passMalcoleman123@cluster0.wtnk5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const mongoose = require('mongoose');
const sessions = require('express-session');
var MongoDBSession = require('connect-mongodb-session')(sessions);

const session_store = new MongoDBSession({
    uri:mongoURI,
    collection:'applicationSessions'
})
const resume_store = new MongoDBSession({
    uri:mongoURI,
    collection:'resumes'
})




module.exports = {
    session_store:session_store,
    resume_store:resume_store,
    initialize:()=>{
        mongoose.connect(mongoURI).then(()=>{
            console.log('connected')
        }).catch((error)=>{
            console.log('something went wrong')
        })
    }
}