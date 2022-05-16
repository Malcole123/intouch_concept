import { dateFormatter } from '../vFiers.js'
var scroll_auto 

const applicationHandler = new Vue({
    el:"#app_body",
    data:{
        a_d:[],
        focus:{
            title:"",
            applications:[]
        },
        edits:{
            a_id:[],

        },
        view:{
            a_name:'',
            a_data:{},
        }
    },
    methods:{
        initialize:()=>{
            var parentMax = document.querySelectorAll('.__table__cards');
            parentMax.forEach((table,index)=>{
                var t = {
                    title:"",
                    applications:[]
                }
                var a_Data = table.getAttribute('data-app-data');
                var l_title = table.getAttribute('data-list-title');
                var a_json = JSON.parse(a_Data);
                t.applications = a_json;
                t.title = l_title;
                applicationHandler.a_d.push(t)
            })
        },
        full__Focus:(id)=>{
            var mdl = document.getElementsByClassName('application__modal')[0];
            var dt = applicationHandler.a_d[id];
            var edited_app = []
            dt.applications.forEach(async (a)=>{
                var human_readable = await dateFormatter(a.created_at,'unix');
                var str = ` ${human_readable.m_y_d_str.monthStr} ${human_readable.date} ${human_readable.year}`;
                a.created_at_str = str;
                edited_app.push(a)
            })
            applicationHandler.focus.title = dt.title;
            applicationHandler.focus.applications = dt.applications;
            fullScreenHandler.title = dt.title;
            fullScreenHandler.applications = edited_app;
            mdl.classList = "application__modal open__app__modal";
       
        },       
    }
})

const fullScreenHandler = new Vue({
    el:'#app__modal',
    data:{
        title:"",
        applications:[],
        display:{
            autoPlay:false,
            last_preview:0,
        },
        focus:{
            changes:{
                comment:"",

            },
            data:{}
        }
    },
    methods:{
        preview:(event)=>{
            var c = document.querySelectorAll('.__app__card');
            c.forEach((card)=>{
                card.classList= "__app__card"
            })
            if(fullScreenHandler.display.autoPlay){
                fullScreenHandler.display.autoPlay= false;
                clearInterval(scroll_auto)
            }
            event.currentTarget.classList = "__app__card preview__applicant";
            fullScreenHandler.display.last_preview = event.currentTarget.getAttribute('data-id') 
        },
        end_preview:(id)=>{
            var c = document.querySelectorAll('.__app__card');
            c.forEach((card)=>{
                card.classList= "__app__card"
            });
            fullScreenHandler.display.last_preview = id
        },
        view_app:(id)=>{
            var scroll_cntrl = document.querySelector('.application__display__content')
            var p_area = document.querySelector('.__app__view');
            scroll_cntrl.scrollLeft = 0;
            p_area.classList="__app__view __view__open";
            fullScreenHandler.focus.data = fullScreenHandler.applications[id];
            fullScreenHandler.focus.data.download_link = fullScreenHandler.applications[id].resume_reference.length > 0  ? "/" + fullScreenHandler.applications[id].resume_reference.replace('\','/'') : "/dashboard/applications";
            console.log(fullScreenHandler.focus.data.download_link)
            clearInterval(scroll_auto);
        },

        regularScroll:async (type,interval)=>{
            clearInterval(scroll_auto);
            fullScreenHandler.display.autoPlay = false
            var scroll_cntrl = document.querySelector('.application__display__content')
            var c_Pos = scroll_cntrl.scrollLeft;
            var scrl = await calc_Scrl(c_Pos);
            switch(type){
                case "full_right":
                    scroll_cntrl.scrollLeft += scrl.rem;
                    break
                case "full_left":
                    scroll_cntrl.scrollLeft = 0
                    break
                case "p_right":
                    scroll_cntrl.scrollLeft += (scrl.c_width+45);
                    break
                case "p_left":
                    scroll_cntrl.scrollLeft -= (scrl.c_width+45);
                    break
            }
        
        },
        commentHandler:(action)=>{
            var f = fullScreenHandler.focus
            switch(action){
                case "add":
                    var c_input = f.changes.comment;
                    var dt = new Date()
                    var temp = {
                        comment:c_input,
                        made_by:"",
                        last_edit:dt.getTime
                    }
                    fullScreenHandler.data.recruiter_comment.push(temp);
                    break
                case "remove":
                    console.log('removed') //Use the index of the rendered component to remove
                    break

            }
        },
        
    }
})

const browseHandler = new Vue({
    el:"#browse-page",
    data:{
        app_data:{},
        all_data:{},
        focus:{
            id:"",
            name:"",
            status:"",
            created_at:"",
            created_at_str:"",
            email:"",
            phone:"",
            comments:[],
            pre_screen:[],
            resume_ref:""
        },
        inputs:{
            comment:""
        },
        send_count:{
            status:0
        },
        search:{
            input:"",
            returned:[],
            active:false,
        }
    },
    methods:{
        focusApp:async (id)=>{
            var fn = await dateFormatter(browseHandler.app_data[id].created_at,'unix');
            browseHandler.focus.id = browseHandler.app_data[id].id;
            browseHandler.focus.name = browseHandler.app_data[id].name;
            browseHandler.focus.status = browseHandler.app_data[id].status;
            browseHandler.focus.created_at = browseHandler.app_data[id].created_at;
            browseHandler.focus.created_at_str =  fn.m_y_d_str.monthStr + " " + fn.date + " " + fn.year;
            browseHandler.focus.email = browseHandler.app_data[id].email;
            browseHandler.focus.phone = browseHandler.app_data[id].phone;
            browseHandler.focus.comments = browseHandler.app_data[id].recruiter_comment;
            browseHandler.focus.pre_screen = browseHandler.app_data[id].application_test_data;
            browseHandler.focus.resume_ref = window.location.origin + "/" + browseHandler.app_data[id].resume_reference.replace(/\134/g,'/');
            var jsonTest = JSON.parse(browseHandler.focus.pre_screen.replace('/',''));
            browseHandler.focus.pre_screen = JSON.parse(jsonTest);
        },
        readableDate:async(date_unix)=>{
            var readDate = await dateFormatter(date_unix,'unix')
            return readDate.m_y_d_str.monthStr + " " + readDate.date + " " + readDate.year;
        },
        makeComment:async ()=>{
            var made_date = new Date()
            if(browseHandler.inputs.comment.length === 0){return false}
            var template = {
                comment:browseHandler.inputs.comment,
                edited:made_date.getTime,
                made_by:''
            }
            var sendArr = browseHandler.focus.comments;
            sendArr.push(template)
            var c_post = await fetch('/dashboard/application/edit',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    temp:template,
                    current_comments:sendArr,
                    app_id:browseHandler.focus.id,
                    type:'comment'
                })
            }).then(res=>res.json()).then(data=>{
                if(data.ok){
                    console.log(data);
                    var storage = sessionStorage.getItem('intouch-app-dt');
                    var stor_JSON = JSON.parse(storage);
                    stor_JSON.app_data.forEach((app,index)=>{
                        if(app.id === browseHandler.focus.id){
                            stor_JSON.app_data[index].recruiter_comment = data.data.recruiter_comment;      
                        }
                    })
                    sessionStorage.setItem('intouch-app-dt',JSON.stringify(stor_JSON))
                    console.log(stor_JSON)

                }else{
                    // handle error
                }
            }).catch(error=>{
                //handle error
                console.log(error)
            })
        },
        changeStatus:async (status)=>{
            browseHandler.send_count.status +=1;
            var template = {
                comment:browseHandler.inputs.comment,
                edited:0,
                made_by:''
            }
            var c_post = await fetch('/dashboard/application/edit',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    temp:template,
                    current_comments:[],
                    app_id:browseHandler.focus.id,
                    status:status,
                    type:'status'
                })
            }).then(res=>res.json()).then(data=>{
                if(data.ok){
                    browseHandler.focus.status = data.data.status
                    var storage = sessionStorage.getItem('intouch-app-dt');
                    var stor_JSON = JSON.parse(storage);
                    stor_JSON.app_data.forEach((app,index)=>{
                        if(app.id === browseHandler.focus.id){
                            stor_JSON.app_data[index].status = data.data.status;      
                        }
                    })
                    sessionStorage.setItem('intouch-app-dt',JSON.stringify(stor_JSON))
                    console.log(stor_JSON)
                    setTimeout(()=>{
                        browseHandler.send_count.status === 0
                    },22000)
                }else{
                    // handle error
                }
            }).catch(error=>{
                //handle error
                console.log(error)
            })
        },
        searchAll:async(input)=>{
            var search_input = input;
            var retArr = [];
            var matchArrID = [];
            if(search_input.length > 4){
                browseHandler.app_data.forEach((app)=>{
                    if(app.name.includes(search_input) && !matchArrID.includes(app.id)){
                        retArr.push(app);
                        matchArrID.push(app.id)
                    }
                })
            }
            if(retArr.length > 0){
                browseHandler.returned = retArr
                browseHandler.search.active = true;
            }
        },
        download_cv:async(event)=>{
            var dwnload = await fetch(`/api/files/download/resume?ref_id=${browseHandler.focus.resume_ref}`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                },
            }).then(res=>res.json()).then(data=>{
                //window.location.href = window.location.origin 
                console.log(data)
                return data
            }).catch(error=>{
                return error
            })
        },

    }
})


const main = ()=>{
    $('.nav-to-browse').on('click', (e)=>{
        var dt = $(e.currentTarget).attr('data-list-info');
        sessionStorage.setItem('intouch-app-dt',dt)
        window.location.href = `/dashboard/applications/browse`;
    })

    $(window).on('load', ()=>{
        if(window.location.href.includes('browse')){
            var dt = JSON.parse(sessionStorage.getItem('intouch-app-dt'));
            browseHandler.app_data = dt.app_data,
            browseHandler.all_data = dt
        }
    })
}






$(document).ready(main)

