import {validEmailCheck, phoneFormatter} from '/js/vFiers.js'

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
    data:{
        display:{
            item_count:0,
            item_visible:1,
            page:{
                total:1,
                current:1,
                next:null,
            },
            filter:{
                job_Type:['full-time'],
                location:{
                    country:'',
                    s_div:''
                },
                company:'',
                sort:{

                },
                matchArr:[]
            }
        },
        focus_data:null,
        focus:{
            id:'',
            created:1,
            app_count:0,
            title:'',
            type:'',
            sub_div:'',
            country:'',
            comp_size:'',
            company_name:'',
            pos_det:{
                resp:[],
                ben:[],
                d_qual:[],
                summary:''
            },
            posted:{
                m_type:'days',              
            },
        },
        pref:{
            f_comp:[],
            f_jobs:[],
            job_alerts:[],
            applied_to:[],
            ref:0
        },
        j_selected:true,
        all_jobs:[],
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
                setSearchState.display.item_count =par_data.itemsTotal;
                setSearchState.display.page.total = par_data.pageTotal;
                setSearchState.display.current= par_data.curPage,
                setSearchState.display.next= par_data.nextPage,
                setSearchState.focus.title = par_data.items[id].title;
                setSearchState.focus_data = par_data.items[id];
                setSearchState.focus.company_name = par_data.items[id].company_name_posted;
                setSearchState.focus.type = par_data.items[id].type;
                setSearchState.focus.sub_div = par_data.items[id].loc_sub_division;
                setSearchState.focus.country = par_data.items[id].loc_country;
                setSearchState.focus.title = par_data.items[id].title;
                setSearchState.focus.id = par_data.items[id].id;
                setSearchState.focus.comp_size = par_data.items[id].data.company_details.company_size;
                setSearchState.focus.created = par_data.items[id].created_at;
                setSearchState.focus.app_count = par_data.items[id].application_id.length;
                setSearchState.focus.pos_det.resp = par_data.items[id].data.position_details.responsibilities;
                setSearchState.focus.pos_det.ben = par_data.items[id].data.position_details.benefits;
                setSearchState.focus.pos_det.d_qual = par_data.items[id].data.position_details.desired_qual;
                setSearchState.focus.pos_det.summary = par_data.items[id].data.position_details.position_summary;
                setSearchState.display.item_visible = par_data.items.length;
                var url = window.location.href;
                var targ_url
                if(url.includes('&view')){
                    var url_ = url.split('&view');
                    targ_url = url_[0].replace('#','')
                }else{
                    targ_url = window.location.href.replace('#','')
                }
                shareHandler.link = `${targ_url}&view=${setSearchState.focus.id}&referral=${shareHandler.ref_generator()}&source=intouch`            }else{
            }
            setTimeout(()=>{
                var parent = str_data.parentNode;
                parent.removeChild(str_data);
            },3000)
        
         
        },
        changeFocus:(id)=>{
            var arr = setSearchState.all_jobs;
            arr.forEach((item) => {
                if(item.id === id){
                    setSearchState.focus_data = item;
                    setSearchState.focus.title = item.title;
                    setSearchState.focus.type = item.type;
                    setSearchState.focus.sub_div = item.loc_sub_division;
                    setSearchState.focus.country = item.loc_country;
                    setSearchState.focus.company_name= item.company_name_posted
                    setSearchState.focus.title = item.title;
                    setSearchState.focus.id = item.id;
                    setSearchState.focus.created = item.created_at;
                    setSearchState.focus.app_count = item.application_id.length;
                    setSearchState.focus.pos_det.resp = item.data.position_details.responsibilities;
                    setSearchState.focus.pos_det.ben = item.data.position_details.benefits;
                    setSearchState.focus.pos_det.d_qual = item.data.position_details.desired_qual;
                    setSearchState.focus.pos_det.summary = item.data.position_details.position_summary;
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
            var posted_date = new Date(unix);
            var today_date = new Date();
            var p_day, p_date, p_month,p_hours,p_mins;
            var t_day,t_date,t_month,t_hours,t_mins;
            p_month = posted_date.getMonth();
            t_month = today_date.getMonth();
            p_date =posted_date.getDate()
            t_date = today_date.getDate()
            p_hours =posted_date.getHours()
            t_hours = today_date.getHours()
            p_mins = posted_date.getMinutes()
            t_mins = today_date.getMinutes()
            var rel_month = parseInt(t_month) - parseInt(p_month);
            var rel_date = parseInt(t_date+1) - parseInt(p_date+1);
            var rel_hours = parseInt(t_hours) - parseInt(p_hours);
            var rel_mins = parseInt(t_mins) - parseInt(p_mins);
            //Cal Month
            if(rel_month === 0){
                if(rel_date === 0){
                    if(rel_hours === 0){
                        if(rel_mins === 1){
                            return 'posted 1 minute ago.'
                        }else{
                            return 'posted ' + rel_mins + ' minutes ago.'
                        }
                    }else if(rel_hours === 1){
                        return 'posted 1 hour ago'
                    }else{
                        return 'posted ' + rel_hours + ' hours ago.'
                    }
                }else if(rel_date === 1){
                    return 'posted 1 day ago.'
                }else{
                    return 'posted ' + rel_date + ' days ago'
                }
            }else if(rel_month === 1){
                if(p_date < 20 && t_date > 10){
                    return 'posted ' + rel_month + ' month ago'
                }else{
                    return 'posted ' + Math.abs(rel_date) + ' days ago'
                }
            }else{
                return 'posted ' + rel_month + ' months ago'
            }
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
            setSearchState.pref.f_jobs = getPref.data.fav_jobs;
            setSearchState.pref.job_alerts = getPref.data.job_alerts;
            setSearchState.pref.ref = getPref.data.me;
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
        fiter__jobs:()=>{
            var data = setSearchState.all_jobs;
            data.forEach((list)=>{
           
            })
        },
        alertHandler:()=>{
            
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

            const result = await fetch('/main/application/submit',{
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
                    verified_companies_id:setSearchState.focus.id,
                    application_test_data:JSON.stringify(pre_int)
                })
            }).then(res=>res.json())
            .then(data =>{
                if(data.completed){
                    applicationHandler.state.complete = true;
                    applicationHandler.state.processing = false;
                    applicationHandler.state.rejected = false
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
        }

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
        description:`Someone thinks you would be interested in this job as a ${setSearchState.focus.title} at ${setSearchState.focus.company_name_posted}`,
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
                    job_id:setSearchState.focus.id,
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
            var posted_date = new Date(unix);
            var today_date = new Date();
            var p_day, p_date, p_month,p_hours,p_mins;
            var t_day,t_date,t_month,t_hours,t_mins;
            p_month = posted_date.getMonth();
            t_month = today_date.getMonth();
            p_date =posted_date.getDate()
            t_date = today_date.getDate()
            p_hours =posted_date.getHours()
            t_hours = today_date.getHours()
            p_mins = posted_date.getMinutes()
            t_mins = today_date.getMinutes()
            var rel_month = Math.abs(parseInt(t_month) - parseInt(p_month));
            var rel_date = Math.abs(parseInt(t_date+1) - parseInt(p_date+1));
            var rel_hours = Math.abs(parseInt(t_hours) - parseInt(p_hours));
            var rel_mins = Math.abs(parseInt(t_mins) - parseInt(p_mins));
            //Cal Month
            if(rel_month === 0){
                if(rel_date === 0){
                    if(rel_hours === 0){
                        if(rel_mins === 1){
                            return '1 minute ago.'
                        }else{
                            return rel_mins + ' minutes ago.'
                        }
                    }else if(rel_hours === 1){
                        return '1 hour ago'
                    }else{
                        return rel_hours + ' hours ago.'
                    }
                }else if(rel_date === 1){
                    return '1 day ago.'
                }else{
                    return rel_date + ' days ago'
                }
            }else if(rel_month === 1){
                return rel_month + ' month ago'
            }else{
                return rel_month + ' months ago'
            }
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
              $('html').css('overflow','hidden')
          }else{
            $('html').css('overflowY','scroll') 
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

document.querySelector("#autoComplete").addEventListener("selection", function (event) {
    // "event.detail" carries the autoComplete.js "feedback" object
    var detail = event.detail;
    event.currentTarget.value = detail.selection.value;
    window.location.href = `/main/seejobs?q=${detail.selection.value}&country=&sub_division=`
});

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


    $('#favourite__handle').on('click',async ()=>{
        console.log(setSearchState.focus.id)
        var result = await fetch('/me/edit/preferences',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                update_Type:"fav_jobs_add",
                f_comp:"",
                f_jobs:setSearchState.focus.id,
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
    });

    $('#share__handle').on('click',()=>{
        $('#shareModalCenter').modal('show');
        shareHandler.urlGen('fb');
        shareHandler.urlGen('tw');
        shareHandler.urlGen('wtp');
        $('html').css('overflow','hidden');
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
        $('.filter-list').toggleClass('show-filter-menu')
    })
    $('#filter__init-dismiss').on('click', ()=>{
        $('.filter-list').toggleClass('show-filter-menu')
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
    }).on('mouseenter',()=>{
        $('#nav_me').fadeIn();
    })

    $('#nav_me').on('mouseleave',()=>{
        $('#nav_me').fadeOut()
    }).on('mouseenter',()=>{
        $('#nav_me').show()
    })
    $('#nav-search_button').on('click',()=>{
        $('.search-field').toggle();
        $('.search-nav-links').toggle();
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
        $('#searchJobsBtn').show();
        if($(window).width() <= 1020){
            $('#search-page-nav-logo').fadeOut();
        }
    }).on('blur', (e)=>{
        var windowSize = $(window).width()
        var charCount = $('#career-search').val();
        $('.focus___overlay').hide();
        if(windowSize <= 1020){
            $('#search-page-nav-logo').fadeIn();
            $('.search-nav-links').show();
            $('.search-field').hide();
            $('.focus___overlay').hide();
        }
    })
  
    $('#searchJobsBtn').on('click', ()=>{
        var query = $('#career-search').val();
        var country = "Jamaica";
        var sub_division = $('#where-select').val()
        window.location.href = `/main/seejobs?q=${query}&country=${country}&sub_division=${sub_division}`;
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
        if(windowSize >= maxSize){
            $('#search-page-nav-logo').show();
            $('.search-field').show();
            $('.search-nav-links').show();
            $('.job-show-display').removeClass('show-job-section')
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
        }
        jobautoSearch()
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
            $('#companyMenu').show();
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
            $('html').css('overflow','hidden')
        }
    })
 
    $('.return_to_home').on('click',()=>{
        if($(window).width() <= 1020){
            $('.job-show-display').removeClass('show-job-section');
            $('html').css('overflowY','scroll')
        }
    })

    $('#applyButtonInit').on('click',async()=>{
        applicationHandler.setState();
        $('#applicationModal').modal('show');
        $('html').css('overflowY','hidden')
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
        console.log('works')
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

