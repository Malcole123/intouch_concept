//This script is used to track the appearance of listings on the search page 

//Dependencies = ['Vue']

//Elements
const trackElems = document.querySelectorAll('.job-card'); // To get all the element being tracked
const parentScrollElement = document.querySelector('.result-scroll-body'); //Scroll list parent

//Trackers
let viewed = [];
let already_sent = []
const scrollObserveOptions = {
    root:'result-scroll-body', //Scroll list parent
    rootMargin:"0px 0px 100px 0px",
    threshold:1,

}

const scrollObserver = new IntersectionObserver((scrollActs,observer)=>{
    scrollActs.forEach((observation)=>{
        if(observation.isIntersecting){       
            const analytic_template = {
                type:"", //Search or Click
                view_time:0, //Unix timestamp for view
                list_id:0,
                company_id:0
            }
            var temp = analytic_template
            // Check last observe, include towards total
            var listID = observation.target.getAttribute('data-list-id');
            var companyID = observation.target.getAttribute('data-company-id')
            temp.type = "search";
            temp.view_time = new Date().getTime();
            temp.list_id = listID;
            temp.company_id = companyID;
            viewed.push(temp);
            //sendData(temp)
            observer.unobserve(observation.target)
        }
    })

})



const sendData = async(temp)=>{
    var resData = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:zHrXScox/analytics',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(temp)
    }).then(res=>res.json()).then(data=>{
        already_sent.push(data.list_id);
    }).catch(error=>{
        console.log(error)
    })
}


window.addEventListener('load', ()=>{
    trackElems.forEach((listCard)=>{scrollObserver.observe(listCard, scrollObserveOptions)}) // Observes all elems. on scroll
    trackElems.forEach((list)=>{
        list.addEventListener('click', (event)=>{
            const analytic_template = {
                type:"", //Search or Click
                view_time:0, //Unix timestamp for view
                list_id:0,
                company_id:0
            }
            var temp = analytic_template
            // Check last observe, include towards total
            var listID = event.currentTarget.getAttribute('data-list-id');
            var companyID = event.currentTarget.getAttribute('data-company-id')
            temp.type = "click";
            temp.view_time = new Date().getTime();
            temp.list_id = listID;
            temp.company_id = companyID
            viewed.push(temp);
            console.log(viewed)
        })
    })
})