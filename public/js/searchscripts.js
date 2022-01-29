import { setJobs } from './setters.js'


const joburlhandler = ()=>{
    var search, searchSan,searchObjValues
    searchObjValues = []
    search = window.location.search
    searchSan= search.split('&');
    for(let i = 0; i < searchSan.length; i++){
        var arr = searchSan[i].split('=');
        var targ = arr[1];
        var final = targ.replaceAll('%20', " ");
        searchObjValues.push(final)
    }
    var send = {
       "jobQuery":searchObjValues[0],
       "country":searchObjValues[1],
       "sub_division":searchObjValues[2],
    }
    return send
}


const getjobs = async (job_title="", country="", sub_division="")=>{
    var retData = await fetch('/alljobs', {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify({
            title_query:job_title,
            country:country,
            sub_division:sub_division
        })
    }).then(res=> res.json())
    .then(data => {
        console.log(data)
        return data
    })
    .catch(error => console.log(error))
    return retData
}




window.onload = async (event)=>{
    var searchParams = joburlhandler();
    var setData = await getjobs(searchParams.jobQuery, searchParams.country,searchParams.sub_division);
    setJobs(searchParams.jobQuery,searchParams.country,setData)
}
