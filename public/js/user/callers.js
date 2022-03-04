const cEnroll = async (fn, ln, e , pn, p, tos,user_type,end)=>{
    var sData = {
        "fn":fn,
        "ln":ln,
        "e":e,
        "p":p,
        "pn":pn,
        "tos":tos,
        "user_type":user_type
    }
    const rData = await fetch(end, {
        method:'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(sData)
    }).then(res=>res.json())
    .then(data=>{
        return data
    })

    return rData
}

const cEnter = async (e , p, sTo,eP)=>{
    var sData = {
        email:e,
        pass:p, 
        sendTo:sTo,
    }
    const rData = await fetch(`..${eP}`, {
        method:'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(sData)
    }).then(res=> res.json())
    .then(data=>{
      return data
    }).catch(e , ()=>{
    })
    return rData
}

const cRecover = async (e)=>{
    var sData = {
        "email":e,
    }
    const rData = await fetch('../user/identity/recover', {
        method:'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(sData)
    }).then(res=>{
        res.json()
        console.log(res)
    })
    .then(data=>{
        console.log(data)
        return data
    }).catch(e , ()=>{
    })

    return rData
}

const cMe = async (e)=>{
    const d = await fetch('/user/auth/me', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({email:e})
    }).then(res=>res.json())
    .then(data , ()=> {
        return data
    })
    .catch(error => console.log(error) )
}



export {cEnroll, cEnter, cRecover}