const queryHandler = (query)=>{
    var retQuery = query.split('=');
    return retQuery[-1]
}

const checkRedirect = (special)=>{
    
    const paths={
        home:'/main/home',
        search:'/main/seejobs?q=&country=&sub_division=',
        pajl:'/main/postajob/landing',
        rcl:'/resume/create/landing',
    }

    var pathKeys = Object.keys(paths);
    var pathValues = Object.values(paths);
    var urlValues = [];
    var urlKeys=[];
    var end;
    pathKeys.forEach((param,index)=>{
        if(param===special){
            end = pathValues[index];
        }
    })

    var ind = pathKeys.indexOf(special.sendTo);
    return pathValues[ind]
}


module.exports = {
    qHandler:queryHandler,
    definePath:checkRedirect
}