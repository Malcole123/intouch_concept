if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const userRouter = require('./routes/user.js');
const mainRouter = require('./routes/main.js');

const fetchers = require('./fetchers.js')
const fs = require('fs')
const http = require('http')
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/user', userRouter)
app.use('/main',mainRouter);


app.post('/alljobs', async (req,res)=>{
    try{
        var data = req.body;
        var response = await fetchers.fetchJobsCall(data.title_query, data.country, data.sub_division);
        app.get('/seejobs', (req,res, data)=>{
            res.render('searchpage')
        })        
        res.send(response);
    }catch(e){
        console.log(e)
    }
})







console.log('port')
app.listen(3000);






