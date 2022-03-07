if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}
const sessionKey = process.env.SESSION_SECRET

const userRouter = require('./routes/user/auth.js');
const userEditRouter = require('./routes/user/edit.js');
const port = process.env.PORT || 3000

const employerRouter = require('./routes/client_user/account/auth.js')
const mainRouter = require('./routes/main.js');
const resumeRouter = require('./routes/resumebuild/handler.js');
const onBoardingRouter = require('./routes/user_onboarding.js');
const dashboardRouter = require('./routes/client_user/dashboard/dash_pages.js');
const analyticRouter = require('./routes/analytics/analytics.js');
const userAlertRouter = require('./routes/alerts/user.js');
const companyRouter = require('./routes/client_user/account/company.js')

const fetchers = require('./fetchers.js');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
var MongoDBSession = require('connect-mongodb-session')(sessions);
const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://malik123:passMalcoleman123@cluster0.wtnk5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(mongoURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then((res)=>{
    console.log('Connected')
})

const store = new MongoDBSession({
    uri:mongoURI,
    collection:'applicationSessions'
})

const fs = require('fs')
const http = require('http')
const express = require('express');
const { session } = require('passport/lib');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));



app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(sessions({
    secret: sessionKey,
    saveUninitialized:false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
    store:store,
}));



app.use('/user', userRouter);
app.use('/me', userEditRouter);
app.use('/main',mainRouter);
app.use('/resume',resumeRouter);
app.use('/employer',employerRouter);
app.use('/onboarding',onBoardingRouter);
app.use('/dashboard',dashboardRouter);
app.use('/analytics',analyticRouter);
app.use('/alerts',userAlertRouter);
app.use('/company',companyRouter);






app.get('*', function(req, res){
    res.status(404).send('Not found')
});

console.log(`port open on ${port}`)
app.listen(port);






