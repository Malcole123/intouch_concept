import { dateFormatter } from '../vFiers.js'
var scroll_auto 

const applicationHandler = new Vue({
    el:"#app__body",
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
            console.log(fullScreenHandler.focus.data)            
        },
        download_cv:async(event)=>{
            var dwnload = await fetch(`/api/files/download/resume`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    ref_id:"622c57deef0471060865c6da",
                    email:"",
                })
            }).then(res=>res.json()).then(data=>{
                console.log('Hello world');
                return data
            }).catch(error=>{
                console.log(error);
                return error
            });
            console.log(dwnload)
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

window.addEventListener('load',()=>{
    applicationHandler.initialize()
})

const autoScroll = (id)=>{
    var scroll_area = document.querySelector('.__applications__scroll');
    var cards = scroll_area.querySelectorAll('.__app__card');
    var scroll_cntrl = document.querySelector('.application__display__content')
    var card_w = cards[0].offsetWidth
    cards.forEach((card)=>{
        card.className ="__app__card"
    })
    cards[fullScreenHandler.display.last_preview].classList ="__app__card preview__applicant";
    if(fullScreenHandler.display.last_preview < cards.length -1){
        var offset = card_w*0.53
        fullScreenHandler.display.last_preview += 1; //Problem here--> Causing auto scroll to do double loop on initalize
        setTimeout(()=>{
            if(fullScreenHandler.display.autoPlay){
                scroll_cntrl.scrollLeft += offset
            }
        },2900)
    }else{
        fullScreenHandler.display.last_preview = 0; // Problem here --> Causing auto loop to set all class if end of list is focused before initalize
        setTimeout(()=>{
            if(fullScreenHandler.display.autoPlay){
                scroll_cntrl.scrollLeft = 0 
            }        
        },2900)
    }
}

const calc_Scrl = (current=0)=>{
    var ac = document.querySelectorAll('.__app__card');
    var c_width = ac[0].offsetWidth;
    var total = (c_width * ac.length) + (ac.length * 40);
    var rem = total - current
    return {
        rem:rem,
        total:total,
        c_width:c_width
    }
}

const main = ()=>{
    $('.filter__init').on('click', ()=>{
        $('.filter__box').toggle()
    })

    $('.__auto__play__init').on('click',()=>{
        if(fullScreenHandler.display.autoPlay){
            fullScreenHandler.display.autoPlay = false;
            clearInterval(scroll_auto);
            $('.__app__card').removeClass('preview__applicant')
        }else{
            var scroll_area = document.querySelector('.__applications__scroll');
            var cards = scroll_area.querySelectorAll('.__app__card');
            $(`.${cards[fullScreenHandler.display.last_preview].className}`).addClass('preview__applicant');
            fullScreenHandler.display.autoPlay = true; 
            scroll_auto = setInterval(()=>{
                autoScroll()
            },4000)
        }
    })

    $('#close__app_modal').on('click',()=>{
        $('.application__modal').removeClass('open__app__modal');
        clearInterval(scroll_auto)
    })

    $('#close_app__view').on('click',()=>{
        $('.__app__view').removeClass(' __view__open')
    })

    $('#addCommentBtn').on('click',()=>{
        if(fullScreenHandler.focus.changes.comment.length === 0){
            $('.commentDisp').fadeIn()
            $('#commentInput').focus();

        }else{

        }
    })

    $('#commentInput').on('blur',()=>{
        if(fullScreenHandler.focus.changes.comment.length === 0 ){
            $('.commentDisp').fadeOut()
        }
    })
}



$(document).ready(main)

