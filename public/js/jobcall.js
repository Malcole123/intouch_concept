const getjobs = (job_title="", country="", sub_division="")=>{
    fetch('/seejobs', {
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
    .then(data => console.log(data))
    .catch(error => console.log(error))
}



export {getjobs}