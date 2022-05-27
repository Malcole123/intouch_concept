import {validEmailCheck, phoneFormatter, imageEncode, relativeDate} from '/js/vFiers.js'



const jobQueryParams = ()=>{
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
       "view":searchObjValues[3],
       "referral":searchObjValues[4],
       "source":searchObjValues[5],
    }
    return send
}

const setSearchState= new Vue({
    el:"#searchBody",
    data(){
        return{
            display:{
                item_count:0,
                item_visible:1,
                page:{
                    total:1,
                    current:1,
                    next:null,
                },
                filter:{
                    filtered:false,
                    job_Type:['full-time','part-time','seasonal','contract'],
                    location:{
                        country:'',
                        s_div:''
                    },
                    sort:{
                        see_latest:999999999999
                    },
                    company:'',
                    matchArr:[],
                    sub_division_arr:[]
                },
                lady_load:[],
                lazy_count:0,
            },
            focus_data:{},
            pref:{
                f_comp:[],
                f_jobs:[],
                job_alerts:[],
                applied_to:[],
                ref:0
            },
            j_selected:true,
            all_jobs:[],
            matched_filters:[]
        }
    },
    methods:{
        setState:(id=0)=>{
            setTimeout(()=>{
                var loader = document.getElementsByClassName('loader__overlay')[0];
                loader.style.display = "none"
            },200)
            var str_data = document.getElementById('job__intermed');
            var par_data = JSON.parse(str_data.value);
            if(par_data.items.length > id){
                setSearchState.all_jobs = par_data.items;
                par_data.items.forEach((list,index)=>{
                    if(!companyAutoComplete.data.src.includes(list.company_name_posted)){
                        companyAutoComplete.data.src.push(`${list.company_name_posted}`)
                    }
                    if(index < 25){
                        setSearchState.matched_filters.push(list.id)
                    }else{
                        setSearchState.display.lady_load.push(list.id);
                        setSearchState.display.lazy_load += 1
                    }
                })
                setSearchState.display.item_count =par_data.itemsTotal;
                setSearchState.display.page.total = par_data.pageTotal;
                setSearchState.display.current= par_data.curPage,
                setSearchState.display.next= par_data.nextPage,
                setSearchState.focus_data = par_data.items[id];
                var url = window.location.href;
                var targ_url
                if(url.includes('&view')){
                    var url_ = url.split('&view');
                    targ_url = url_[0].replace('#','')
                }else{
                    targ_url = window.location.href.replace('#','')
                }
                shareHandler.link = `${targ_url}&view=${setSearchState.focus_data.id}&referral=${shareHandler.ref_generator()}&source=intouch`}else{
            }
            setTimeout(()=>{
                var parent = str_data.parentNode;
                parent.removeChild(str_data);
            },3000);
            setTimeout(()=>{
                setSearchState.adHandler();
            },300)
        
         
        },
        changeFocus:(id)=>{
            var arr = setSearchState.all_jobs;
            arr.forEach((item) => {
                if(item.id === id){
                    setSearchState.focus_data = item;
                    var url = window.location.href;
                    var targ_url
                    if(url.includes('&view')){
                        var url_ = url.split('&view');
                        targ_url = url_[0].replace('#','')
                    }else{
                        targ_url = window.location.href.replace('#','')
                    }
                    shareHandler.link = `${targ_url}&view=${item.id}&referral=${shareHandler.ref_generator()}&source=intouch`
                }
            });

        },
        relativeDate:(unix)=>{         
            return relativeDate(unix);
        },
        setUserPref:async ()=>{
            const getPref = await fetch('/main/user/favourites').then(res=>res.json())
            .then(data=>{
                return data
            }).catch(error =>{
                return {
                    data:{
                        fav_comp:[],
                        fav_jobs:[],
                        job_alerts:[],
                        me:0
                    }
                }
            });
          if(getPref.ok){
            setSearchState.pref.f_comp = getPref.data.fav_comp;
            setSearchState.pref.job_alerts = getPref.data.job_alerts;
            setSearchState.pref.ref = getPref.data.me;
            getPref.data.fav_jobs.forEach((job)=>{
                setSearchState.pref.f_jobs.push(job.id)
            })
          }else{

          }
        },
        filter__jobType:(picked)=>{
            var arr = setSearchState.display.filter.job_Type;
            if(arr.includes(picked)){
                var i = arr.indexOf(picked);
                arr.splice(i,1);
            }else{
                arr.push(picked)
            }
            setSearchState.display.filter.job_Type = arr;
            var count = 0 
            setSearchState.all_jobs.forEach((listing)=>{
                if(arr.includes(listing.type)){
                    count += 1
                }
            });
            setSearchState.display.item_visible = count;
        },
        setCompUrl:(company_name)=>{
            return  `/main/company/profile?name=${company_name}`
        },
        alertHandler:()=>{
            
        },
        filterHandler:()=>{
            // Filter by job type, posted date, company name,
            setSearchState.display.filter.filtered = true
            setSearchState.matched_filters = []
            var ref_data = setSearchState.display.filter;
            var check_data = setSearchState.all_jobs;
            check_data.forEach((job)=>{
                var trueCount = 0 //Tracks reqs.
                if(ref_data.job_Type.includes(job.type)){
                    trueCount += 1
                }

                if(ref_data.sort.see_latest <= job.created_at){
                    trueCount +=1
                }

                if(job.loc_country.toLowerCase().includes(ref_data.location.country.toLowerCase()) || ref_data.location.country.length === 0){
                    trueCount +=1
                }

                if(job.loc_sub_division.toLowerCase().includes(ref_data.location.s_div.toLowerCase()) || ref_data.location.s_div.length === 0){
                    trueCount +=1;
                }

                if(job.company_name_posted.toLowerCase().includes(ref_data.company.toLowerCase()) || ref_data.company.length === 0){
                    trueCount +=1
                }

                if(trueCount === 5){
                    setSearchState.matched_filters.push(job.id)
                    return true
                }else{
                    return false
                }
            })
            setTimeout(()=>{
                var ads = document.getElementsByClassName('inline-ad-space');
                var parent = document.querySelector('.result-scroll-body');
                for(let i = 0; i < ads.length; i++){
                    parent.removeChild(ads[i])
                }
                setSearchState.adHandler()
            },700)
        },
        adHandler:()=>{
            var listCount = setSearchState.display.filter.filtered ? setSearchState.matched_filters.length : setSearchState.all_jobs.length;
            var ads = document.getElementsByClassName('inline-ad-space');
            var parent = document.querySelector('.result-scroll-body');
            var dom_kids = parent.children
            var kids = document.querySelectorAll('.job-card');
            var adTemp = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9149531285371942"crossorigin="anonymous"></script><ins class="adsbygoogle"style="display:block"data-ad-format="fluid"data-ad-layout-key="-ed+6k-30-ac+ty"data-ad-client="ca-pub-9149531285371942"data-ad-slot="1909465585"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>'
            if(kids.length >= 6){
                var count = 1;
                kids.forEach((kid,index)=>{
                    var template = document.createElement('div');
                    template.className = "inline-ad-space";
                    template.innerHTML = adTemp;
                    if(count%4===0 && kid.previousSibling.className !=='inline-ad-space' && kid.previousSibling.previousSibling.className !== 'inline-ad-space'){
                        parent.insertBefore(template,kid)
                    }
                    count +=1
                })
            }else if(kids.length < 6 && kids.length > 0){
                var template = document.createElement('div');
                template.className = "inline-ad-space";
                template.innerHTML = adTemp;
                parent.append(template);
            }


        },
        clearFilter:()=>{
            setSearchState.display.filter.job_Type = ['full-time','part-time','seasonal','contract'];
            setSearchState.display.filter.location.country ="";
            setSearchState.display.filter.location.s_div = "";
            setSearchState.display.filter.company = "";
            setSearchState.filterHandler()
            setSearchState.adHandler();
            setSearchState.display.filter.filtered = false;
            
        },
        setFavourite:async ()=>{
            var result = await fetch('/me/edit/preferences',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    update_Type:"fav_jobs_add",
                    f_comp:"",
                    f_jobs:setSearchState.focus_data.id,
                    job_alerts:""
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.ok){
                    setSearchState.pref.f_jobs = data.data.favourite_jobs
                }else{
                }
            }).catch(error=>{
            })
        },
        openApply:()=>{
            applicationHandler.setState()
            $('#applicationModal').modal('show');
            $('html').css('overflowY','hidden')
        },
        openShare:()=>{
            $('#shareModalCenter').modal('show');
            shareHandler.urlGen('fb');
            shareHandler.urlGen('tw');
            shareHandler.urlGen('wtp');
            console.log('button works')
            $('html').css('overflow','hidden');
        },
        set_subdivision:async()=>{
            var cntry = setSearchState.display.filter.location.country;
            var s_data = await fetch('/resources/countries.json').then(res=>res.json()).then(data=>{
                data.forEach((country)=>{
                    if(country.country.toLowerCase() === cntry.toLowerCase() ){
                        setSearchState.display.filter.sub_division_arr = country.sub_divisions
                    }
                })
                return data
            });
            console.log(s_data)
        },
        mobile__view:()=>{
            if($(window).width() <= 1020){
                $('.job-show-display').removeClass('show-job-section');
                $('html').css('overflowY','scroll')
            }
        }
    }
})

const applicationHandler = new Vue({
    el:'#applicationModal',
    data:{
        listing:{
            id:"1",
            title:"",
            company:"",
            questions:[],
            routing:{}
        },
        u_Data:{
            name:'',
            email:'',
            phone:'',
            resume:'',
            answers:[],
            questions:[],
        },
        conditions:{
           step_one:{
            name:false,
            email:false,
            phone:false,
            country:false,
            resume:false,
           },
           step_two:{
            questions_answered:false,
           }
        },
        current_step:1,
        state:{
            processing:true,
            complete:false,
            rejected:false,
        }
    },
    methods:{
        setState:()=>{
            var t_a_process = setSearchState.focus_data;
            applicationHandler.listing.id = t_a_process.id;
            applicationHandler.listing.title = t_a_process.title;
            applicationHandler.listing.company = t_a_process.company_name_posted;
            applicationHandler.listing.questions = t_a_process.application_data.question_data;
            applicationHandler.listing.routing = t_a_process.application_data.additional_routing_data;
        },
        stepCheck:async (id)=>{
            switch(id){
                case '1':
                    var checkArr = Object.values(applicationHandler.conditions.step_one);
                    var errorKeys = Object.keys(applicationHandler.conditions.step_one)
                    var count = 0;
                    var errors = [];
                    for(let i = 0; i < checkArr.length;i++){
                        if(checkArr[i]){
                            count += 1
                        }else{
                            errors.push(errorKeys[i])
                        }
                    }
                    if(count === checkArr.length){
                        return{
                            ok:true,
                            errors:errors
                        }
                    }else{
                        return{
                            ok:false,
                            errors:errors
                        }
                    }
                case '2':
                    var questionArea = document.querySelectorAll('#applicantQUESTIONANSWERInput');
                    var values = [];
                    var errors = [];
                    questionArea.forEach((input,index)=>{
                        if(input.value.length > 0){
                            values.push(input.value)
                        }else{
                            errors.push(index)
                        }
                    })
                    applicationHandler.u_Data.answers = values;
                    applicationHandler.u_Data.questions = applicationHandler.listing.questions
                    if(values.length === applicationHandler.listing.questions.length){
                        return {
                            ok:true,
                            errors:errors
                        }
                    }else{
                        return {
                            ok:false,
                            errors:errors
                        }
                    }
            }

        },
        stepHandler:async (id)=>{
            switch(id){
                case '1':
                var ready = await applicationHandler.stepCheck('1');
                if(ready.ok){
                    applicationHandler.current_step = 2
                }else{
                    ready.errors.forEach((error)=>{
                        var upperCase = error.toUpperCase();
                        setInvalid(upperCase)
                    })
                }
                break
                case '2':
                    var ready = await applicationHandler.stepCheck('2');
                    if(ready.ok){
                        applicationHandler.submit();
                        applicationHandler.state.processing = true;
                        applicationHandler.current_step = 3;
                    }else{
                        ready.errors.forEach((error)=>{
                            var targ = document.querySelectorAll('#applicantQUESTIONANSWERInput');
                            targ[error].classList= "form-control is-invalid"
                        })
                    }
            }
        },
        questionHandler:()=>{
            var questionArea = document.querySelectorAll('#applicantQUESTIONANSWERInput');
            var values = [];
            var errors = [];
            questionArea.forEach((input,index)=>{
                if(input.value.length > 0){
                    values.push(input.value)
                }else{
                    errors.push(index)
                }
            })
            applicationHandler.u_Data.answers = values;
            applicationHandler.u_Data.questions = applicationHandler.listing.questions
            if(values.length === applicationHandler.listing.questions.length){
                return {
                    ok:true,
                    errors:errors
                }
            }else{
                return {
                    ok:false,
                    errors:errors
                }
            }
        },
        fileHandler:async (event)=>{
            var file = document.getElementById('applicantRESUMEInput');
            var resume = new FormData();
            resume.append('resume',file.files[0]);
            fetch('../api/files/resume',{
                method:'POST',
                body:resume
            }).then(res=>res.json()).then(data=>{
                if(data.status === 200){
                    applicationHandler.u_Data.resume = data.file.filePath.replace('//','/')
                }else{
                    setInvalid(file.id)
                }
            }).catch(error=>{
                setInvalid(file.id)
            })
        },
        goBack:()=>{
            var int = applicationHandler.current_step;
            var new_int = int -=1;
            applicationHandler.current_step = new_int
        },
        submit:async ()=>{
            var pre_int =[];
            var answers = applicationHandler.u_Data.answers;
            answers.forEach((answer,index)=>{
                var pre_int_temp = {
                    id:index,
                    question:applicationHandler.u_Data.questions[index],
                    answer:answer
                }
                pre_int.push(pre_int_temp)
            })
            const send = await fetch('/main/application/submit',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    job_id:applicationHandler.listing.id,
                    name:applicationHandler.u_Data.name,
                    phone:applicationHandler.u_Data.phone,
                    email:applicationHandler.u_Data.email,
                    resume:applicationHandler.u_Data.resume,
                    verified_companies_id:setSearchState.focus_data.id,
                    application_test_data:JSON.stringify(pre_int)
                })
            }).then(res=>res.json())
            .then(data =>{
                if(data.completed){
                    applicationHandler.state.complete = true;
                    applicationHandler.state.processing = false;
                    applicationHandler.state.rejected = false;
                }else{
                    applicationHandler.state.complete = false;
                    applicationHandler.state.processing = false;
                    applicationHandler.state.rejected = true                
                }
            })
            
        },
        resetState:()=>{
            applicationHandler.u_Data.name="";
            applicationHandler.u_Data.email="";
            applicationHandler.u_Data.phone="";
            applicationHandler.u_Data.resume="";
            applicationHandler.u_Data.answers="";
            applicationHandler.u_Data.questions="";
            applicationHandler.conditions.step_one.name = false;
            applicationHandler.conditions.step_one.email = false;
            applicationHandler.conditions.step_one.phone = false;
            applicationHandler.conditions.step_one.country = false;
            applicationHandler.conditions.step_one.resume = false;
            applicationHandler.conditions.step_two.questions_answered = false;
            applicationHandler.state.processing = false
            applicationHandler.state.comlete = false
            applicationHandler.state.rejected = false;
            applicationHandler.current_step = 1;
            $('#applicationModal').modal('hide');
        },


    }
})

const shareHandler = new Vue({
    el:'#shareModalCenter',
    data:{
        link_copied:false,
        link:'',
        links:{
            facebook:"#",
            instagram:"#",
            whatsapp:"#",
            twitter:"#",
            website:"#",
            email:''
        },
        ref:'',
        description:`Someone thinks you would be interested in this job as a ${setSearchState.focus_data.title} at ${setSearchState.focus_data.company_name_posted}`,
    },
    methods:{
        copyLink:()=>{
            shareHandler.link_copied = true
            var copyText = document.getElementById('shareUrlCopyInput');
            copyText.select();
            copyText.setSelectionRange(0, 99999); /* For mobile devices */
            navigator.clipboard.writeText(copyText.value);
            shareHandler.createShare('intouch')
        },
        ref_generator:()=>{
            var char = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var ref="";
            for(let i = 0; i < 32; i++){
                var index = Math.floor(Math.random()*char.length);
                ref = ref + char[index]
            };
            shareHandler.ref = ref
            return ref
        },
        urlGen:(type)=>{
            console.log('ran')
            switch(type){
                case "fb":
                    shareHandler.links.facebook = `https://www.facebook.com/sharer.php?u=${shareHandler.link}`
                    return `https://www.facebook.com/sharer.php?u=${shareHandler.link}`
                case "tw":
                    shareHandler.links.twitter = `https://twitter.com/intent/tweet?original_referer=${shareHandler.link}&url=${shareHandler.link}`
                    return `https://twitter.com/intent/tweet?original_referer=${shareHandler.link}&url=${shareHandler.link}`
                case "wtp":
                    return "#"
            }
        },
        createShare:async (type="intouch")=>{
            shareHandler.ref = shareHandler.ref_generator()
            var result = await fetch('/analytics/share/create',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    job_id:setSearchState.focus_data.id,
                    share_method:type,
                    referral:shareHandler.ref
                })
            }).then(res=>res.json())
            .then(data=>{
            })
        }
    }
})

const notificationHandler = new Vue({
    el:'.notif__display',
    data:{
        class:{
            unread__notif:'__unread__notif'
        },
        state:{
            loading:true,
            complete:false,
            failed:false,
            last_update:null,
            menu_open:false,
        },
        notif:{
            display:[],
            remove:[]
        }
    },
    methods:{
        setState:async (curr_user_id=0,last_receive=null)=>{
            var update_Date = new Date()
            if(curr_user_id > 0){
                var not_res = await fetch('/alerts/notifications/mynotifications/receive',{
                    method:'GET',
                    headers:{
                        'Content-Type':'application/json',
                    }
                }).then(res=>res.json())
                .then(data=>{
                    notificationHandler.notif.display = data.items;
                    notificationHandler.state.last_update = update_Date.getTime();
                    notificationHandler.state.complete = true;
                    notificationHandler.state.failed = false;
                    console.log(data)
                }).catch(err =>{
                    notificationHandler.state.failed = true;
                    notificationHandler.state.complete = true;
                    notificationHandler.state.last_update = update_Date.getTime();    
                })
            }else{
                notificationHandler.state.failed = true;
                notificationHandler.state.complete = true;
                notificationHandler.state.last_update = update_Date.getTime();
            }
        },
        setRelative:(unix)=>{
            return relativeDate(unix);
        }

    }
})



var target_observe = document.querySelector(".notif__display")
var options = {
    rootMargin: '0px',
    threshold:0.2
}
  
  var notifcallback = function(entries, observer) {
      entries.forEach((entry)=>{
          var date = new Date();
          var unix = date.getTime()
          if(entry.isIntersecting && notificationHandler.state.last_update === null){
              notificationHandler.setState(setSearchState.pref.ref)
          }
          if(entry.isIntersecting){
             // $('html').css('overflow','hidden')
          }else{
            //$('html').css('overflowY','scroll') 
          }
      })
  };
  
  var observer = new IntersectionObserver(notifcallback, options);

  observer.observe(target_observe)


  const jobautoSearch = ()=>{
    fetch('/resources/alljobs.json').then(res => res.json())
    .then(data =>{
        for(let i = 0; i < data.length; i++ ){
            autoCompleteJS.data.src.push(data[i].title)
        }
    })
}

const autoCompleteJS = new autoComplete({
    placeholder: 'Search for food...',
    data:{
      src:[]
    },
    resultItem:{
      highlight:{
        render:true
      }
    },
    submit:true,

 });
 const companyAutoComplete = new autoComplete({
    placeholder:'Search by company',
    selector:'#filterCompanyInput',
    data:{
        src:[]
    },
    resultItem:{
        highlight:{
            render:true
        }
    },
    submit:true,
  })

document.querySelector("#autoComplete").addEventListener("selection", function (event) {
    // "event.detail" carries the autoComplete.js "feedback" object
    var detail = event.detail;
    event.currentTarget.value = detail.selection.value;
    window.location.href = `/main/seejobs?q=${detail.selection.value}&country=&sub_division=`
});

if(!window.location.href.includes('/company/profile')){
    document.querySelector("#filterCompanyInput").addEventListener("selection", function (event) {
        // "event.detail" carries the autoComplete.js "feedback" object
        var detail = event.detail;
        event.currentTarget.value = detail.selection.value;
        setSearchState.display.filter.company = detail.selection.value;
        event.currentTarget.blur()
    });
}

const setValid = (id)=>{
    var target = document.getElementById(`applicant${id}Input`);
    target.classList = 'form-control is-valid'
}
const setInvalid = (id)=>{
    var target = document.getElementById(`applicant${id}Input`);
    target.classList = 'form-control is-invalid'
}

const main = ()=>{
    $('.act-btn').on('click',(e)=>{
        $(e.currentTarget).toggleClass('button-active')
    })
    $('.switch__outer').on('click',(e)=>{
        $(e.currentTarget).toggleClass('toggled');
    })
 
    $('#closeShareModal').on('click',()=>{
        $('#shareModalCenter').modal('hide');
        $('html').css('overflowY','scroll');
    })  
    $('#shareModalCenter').on('hide.bs.modal',()=>{
        $('html').css('overflowY','scroll');  
    }).on('hidden.bs.modal',()=>{
        $('#share__handle').removeClass('button-active')
    })
    $('#whatsappShare').on('click',()=>{
        shareHandler.shareType = 'whatsapp'
    })
    $('#filter__init-call').on('click', ()=>{
        $('.filter-list').toggleClass('show-filter-menu');
        $('html').css('overflowY','hidden')
    })
    $('#filter__init-dismiss').on('click', ()=>{
        $('.filter-list').toggleClass('show-filter-menu')
        $('html').css('overflowY','scroll')
    })

    $('._alert').on('click', (event)=>{
        if(notificationHandler.state.menu_open){
            notificationHandler.state.menu_open = false
        }else{
            notificationHandler.state.menu_open = true;
        }
      $('.notif__display').toggleClass('show__notif__display');
      $('.active_nav__indicator').toggle()
      $('#nav_me').fadeOut()
    })

    $('._me').on('click', (event)=>{
        $('#nav_me').toggle()
        $('#nav_me').toggleClass('open__dropdown')
    })

    $('#nav_me').on('mouseleave',()=>{
        $('#nav_me').fadeOut()
    }).on('mouseenter',()=>{
        $('#nav_me').show()
    })
    $('#nav-search_button').on('click',()=>{
        $('.search-field').show();
        $('#autoComplete').focus()
        $('.search-nav-links').hide();
        $('#search-page-nav-logo').toggle();
        $('.focus___overlay').show()
    })

    $('.focus___overlay').on('click',()=>{
        $('#career-search').val("");
        $('#career-search').blur()
        $('.focus___overlay').hide();
        $('.search-field').hide();
        $('#search-page-nav-logo').show();
        $('.search-nav-links').show();
    })

    $('#autoComplete').on('focus', ()=>{
        $('.focus___overlay').show();
        if($(window).width() <= 1020){
            $('#search-page-nav-logo').fadeOut();
            $('.search-nav-links').hide();
        }
    }).on('blur', (e)=>{
        var windowSize = $(window).width()
        $('.focus___overlay').hide();
        $('.search-nav-links').show();
        if(windowSize <= 1020){
            $('#search-page-nav-logo').fadeIn();
            $('.search-field').hide();
            $('.focus___overlay').hide();
        }
    })
  
    $(window).on('scroll', ()=>{
        $('#nav_alert').hide()
        $('#nav_me').hide()
        var currPos = $(window).scrollTop();
        if(currPos > 10 ){
            $('.navbar').addClass('scroll-nav');
            $('.navbar').addClass('bg-dark');
            $('.navbar').removeClass('sticky-top');
            $('.navbar').addClass('fixed-top');
            $('nav').addClass('scroll-nav');
            if($(window).width() <= 1020){
                $('#search-page-nav-logo').fadeIn();
            }
        }else{
            $('.navbar').removeClass('scroll-nav');
            $('.navbar').removeClass('bg-dark');
            $('.navbar').removeClass('fixed-top');
            $('.navbar').addClass('sticky-top');
            $('nav').removeClass('scroll-nav'); /*search page, */
        }
    }).on('resize', async ()=>{
        var windowSize = $(window).width()
        var maxSize = 1020;
        $('html').css('overflowY','scroll')
        if(windowSize >= maxSize){
            $('#search-page-nav-logo').show();
            $('.search-field').show();
            $('.search-nav-links').show();
            $('.job-show-display').removeClass('show-job-section')
        }else{
            $('.search-field').hide();
            $('.search-nav-links').show();
            $('#nav');
            $('#locationMenu').show(); 
            $('#companyMenu').show();        
            $('#jobTypeMenu').show();        
       

        }        
    }).on('load', async ()=>{
        setSearchState.setState();
        setSearchState.setUserPref();
        var windowSize = $(window).width()
        var maxSize = 1020;
        if(windowSize > maxSize){
            $('#search-page-nav-logo').show();
            $('.search-nav-links').show();
            $('.search-field').show();
        }else{
            $('.search-field').hide(); 
        }
        jobautoSearch();
    })

    $('#jobTypeButton').on('click',()=>{
        if($(window).width() >= 1020){
            $('#jobTypeMenu').toggle();
            $('#locationMenu').hide();
            $('#quickApplyMenu').hide();
            $('#sortResultMenu').hide();
            $('#companyMenu').fadeOut();        
        }
    })

    $('#jobTypeMenu').on('mouseleave', ()=>{
        if($(window).width() >= 1020){
            $('#jobTypeMenu').fadeOut();        
        }
    })

    $('#locationButton').on('click',()=>{
        if($(window).width() >= 1020){
            $('#locationMenu').toggle();
            $('#jobTypeMenu').hide();
            $('#quickApplyMenu').hide();
            $('#sortResultMenu').hide();
            $('#companyMenu').fadeOut();              
        }
    });

    $('#locationMenu').on('mouseleave', ()=>{
        if($(window).width() >= 1020){
            $('#locationMenu').fadeOut();        
        }
    })

    $('#quickApplyButton').on('click',()=>{
        if($(window).width() >= 1020){
            $('#quickApplyMenu').toggle();
            $('#sortResultMenu').hide();
            $('#jobTypeMenu').hide();
            $('#locationMenu').hide();
            $('#companyMenu').fadeOut();         
        }
    })

    $('#quickApplyMenu').on('mouseleave', ()=>{
        if($(window).width() >= 1020){
            $('#quickApplyMenu').fadeOut();        
        }

    })

    $('#sortButton').on('click', ()=>{
        if($(window).width() >= 1020){
            $('#sortResultMenu').toggle();
            $('#locationMenu').hide();
            $('#jobTypeMenu').hide();
            $('#quickApplyMenu').hide();
            $('#companyMenu').fadeOut();   
        }
    })

    $('#sortResultMenu').on('mouseleave', ()=>{
        if($(window).width() >= 1020){
            $('#sortResultMenu').fadeOut();    
        }
    })

    $('#companyButton').on('click', ()=>{
        if($(window).width() >= 1020){
            $('#companyMenu').toggle();
            $('#sortResultMenu').hide();
            $('#locationMenu').hide();
            $('#jobTypeMenu').hide();
            $('#quickApplyMenu').hide();    
        }
    })

    $('#companyMenu').on('mouseleave', ()=>{
        if($(window).width() >= 1020){
            $('#companyMenu').fadeOut();           
        }
    })

    $('.job-card').on('click',()=>{
        if($(window).width() <= 1020){
            $('.job-show-display').addClass('show-job-section');
            $('html').css('overflowY','hidden')
        }
    })
 
    $('.return_to_home').on('click',()=>{
        if($(window).width() <= 1020){
            $('.job-show-display').removeClass('show-job-section');
            $('html').css('overflowY','scroll')
        }
    })

    $('#applicationModal').on('hidden.bs.modal',()=>{
        $('html').css('overflowY','scroll');
        applicationHandler.resetState()
    })

    $('#applicantPHONEInput').on('keyup', async()=>{
        var phone = $('#applicantPHONEInput').val();
        var f_phone = await phoneFormatter(phone);
        $('#applicantPHONEInput').val(f_phone)
    }).on('blur',async()=>{
        var phone = $('#applicantPHONEInput').val();
        var f_phone = await phoneFormatter(phone);
        $('#applicantPHONEInput').val(f_phone)
        if(phone.length < 10){
            $('#applicantPHONEInput').addClass('is-invalid');
            $('#applicantPHONEInput').removeClass('is-valid');
            applicationHandler.conditions.step_one.phone = false
        }else{
            $('#applicantPHONEInput').addClass('is-valid');
            $('#applicantPHONEInput').removeClass('is-invalid');
            applicationHandler.conditions.step_one.phone = true
        }
    })

    $('#applicantEMAILInput').on('change', async()=>{
        var email = $('#applicantEMAILInput').val();
        var email_result = await validEmailCheck(email);
        if(email_result.ok){
            $('#applicantEMAILInput').addClass('is-valid');
            $('#applicantEMAILInput').removeClass('is-invalid');
            applicationHandler.conditions.step_one.email = true
        }else{
            $('#applicantEMAILInput').addClass('is-invalid');
            $('#applicantEMAILInput').removeClass('is-valid');
            applicationHandler.conditions.step_one.email = false      
        }
    })

    $('#applicantNAMEInput').on('change',()=>{
        if(applicationHandler.u_Data.name.length > 2){
            $('#applicantNAMEInput').addClass('is-valid');
            $('#applicantNAMEInput').removeClass('is-invalid')
            applicationHandler.conditions.step_one.name = true      
        }else{
            $('#applicantNAMEInput').addClass('is-invalid');
            $('#applicantNAMEInput').removeClass('is-valid');
            applicationHandler.conditions.step_one.name = false      
        }
    })

    $('#applicantCOUNTRYInput').on('change',()=>{
        if(applicationHandler.u_Data.country.length > 2){
            $('#applicantCOUNTRYInput').addClass('is-valid');
            $('#applicantCOUNTRYInput').removeClass('is-invalid');
            applicationHandler.conditions.step_one.country = true      
        }else{
            $('#applicantCOUNTRYInput').addClass('is-invalid');
            $('#applicantCOUNTRYInput').removeClass('is-valid');
            applicationHandler.conditions.step_one.country = false      
        }
    })

    $('#applicantRESUMEInput').on('change',()=>{
        var file = $('#applicantRESUMEInput').val().split('.');
        var fileType = file[1];
        var accepted = ['docx','doc','pdf','txt'];
        var file_ok = false;
        if(accepted.includes(fileType.toLowerCase())){
            file_ok = true
        }else{
            file_ok = false
        }
        if(($('#applicantRESUMEInput').val().length > 0 && file_ok)){
            $('#applicantRESUMEInput').addClass('is-valid');
            $('#applicantRESUMEInput').removeClass('is-invalid');
            applicationHandler.conditions.step_one.resume = true
        }else{
            $('#applicantRESUMEInput').addClass('is-invalid');
            $('#applicantRESUMEInput').removeClass('is-valid');
            applicationHandler.conditions.step_one.resume = false 
        }
    })

    $('#successDismiss').on('click', ()=>{
        $('#applicationModal').modal('hide');
        applicationHandler.resetState()
    })
    $('#errorDismiss').on('click', ()=>{
        applicationHandler.resetState()
    })
    
}



$(document).ready(main)

