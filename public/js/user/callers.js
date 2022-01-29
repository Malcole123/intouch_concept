const cEnroll = async (fn, ln, e , pn, p, tos)=>{
    var sData = {
        "fn":fn,
        "ln":ln,
        "e":e,
        "p":p,
        "pn":pn,
        "tos":tos
    }
    const rData = await fetch('../user/auth/signup', {
        method:'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(sData)
    }).then(res=>res.json())
    .then(data=>{
        console.log(data)
        return data
    })

    return rData
}

const cEnter = async (e , p )=>{
    var sData = {
        "email":e,
        "pass":p
    }
    const rData = await fetch('../user/auth/login', {
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



export {cEnroll, cEnter, cRecover}