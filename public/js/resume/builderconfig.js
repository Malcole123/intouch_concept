import { phoneFormatter, validEmailCheck, dateFormatter } from "../vFiers.js";
import { templateBody } from "../components/template_body.js";
const builderprepare = new Vue({
    el:'#t-display',
    data:{
        selected:'All'      
    },
    methods:{
        switchFilter:(e)=>{
            var target = e.currentTarget.textContent;
            var siblings= e.currentTarget.parentNode.children;
            builderprepare.selected = target.toLowerCase();
            builderprepare.filterList()
            for(let i = 0; i < siblings.length; i++){
                if(siblings[i].textContent.toLowerCase() !== builderprepare.selected.toLowerCase() ){
                    siblings[i].classList = "";
                }else{
                    siblings[i].classList = "active";
                }
            }
        },
        filterList:()=>{
            var area = document.getElementsByClassName('template-body')[0];
            var resumes = area.children;
            for(let i = 0; i < resumes.length; i++){
                var input = resumes[i].children[0];
                var val = input.value.toLowerCase();
                if(val.includes(builderprepare.selected.toLowerCase())){
                    resumes[i].className= `template-card show-card`;
                }else{
                    resumes[i].className= `template-card hide-card`;
                }

            }
           
        },
        submitChoice:()=>{
            var parent = event.currentTarget.parentNode;
            var choice = parent.children[3].value;
            window.location.href = `/resume/create/build?useTemp=${choice}`
        }
    }
})

const builder = new Vue({
    el:'.editor-body',  
    data:{
        userBio:{
            input:"",
        },
        userName:{
            input:"",
        },
        userTitle:{
            input:""
        },
        skills:{
            input:'',
            description:"",
            userSkills:[],
            maxSkills:4,
            maxAdd:false,
        },
        interests:{
            input:'',
            userInterests:[],
            maxInterest:4,
            maxAdd:false
        },
        languages:{
            userLanguages:[],
            maxLanguage:4,
            maxAdd:false,
            input:''
        },
        charities:{
            userCharity:[],
            maxEnter:4,
            input:'',
            maxAdd:false
        },
        education:{
            entered:[],
            template:{
                    start:'',
                    end:'',
                    school:'',
                    certification:'',
                    position:''
                },
            maxAdd:3
        },
        employment:{
            entered:[],
            template:{
                    start:'',
                    end:'',
                    company:'',
                    title:'',
                    position:''
                },
            maxAdd:3,
        },
        references:{
            entered:[],
            template:  {
                name:'',
                title:'',
                company:'',
                contact:{
                    email:'',
                    phone:''
                },
                position:''
            },
            maxEnter:3        
        },
        contact:{
            email:'',
            phone:'',
            address:''
        },
        printSizes:{
            letter_A4:{
                unit:'px',
                height:1054,
                width:816
            },
            legal:{
                unit:'px',
                height:1346,
                width:816
            }

        },
        printChoice:{
            type:'letter A4',
            unit:'px',
            height:1054,
            width:816,
        },
        page:{
            current:1,
            total:2,
        }
    },
    methods:{
        strCheck:(str,max,min)=>{
            length=str.length;
            if(length <= max && length >= min){
                return {
                    ok:true,
                    rem:max-length
                }
            }else{
                return {
                    ok:false,
                    rem:max
                }
            }
        },
        validateInput:(target,valid,reset)=>{
            var el = document.getElementById(target);
            if(valid){
                el.className = "form-control is-valid"
            }else{
                el.className = 'form-control is-invalid'
            }
            if(reset){
                el.className = 'form-control' 
            }
        },
        skillAdd:async ()=>{
            var result = await builder.strCheck(builder.skills.input,22,5);
            if(result.ok && builder.skills.userSkills.length < builder.skills.maxSkills){
                builder.skills.userSkills.push(builder.skills.input);
                builder.skills.input = ""
            }else if(builder.skills.userSkills.length >= builder.skills.maxSkills){
                builder.skills.maxAdd = true
            }
        },
        skillRemove:()=>{
            var remove = event.currentTarget.parentNode.children[0];
            var remIndex = builder.skills.userSkills.indexOf(remove.textContent);
            var arr = builder.skills.userSkills;
            arr.splice(remIndex, 1);
            for( let i = 0; i < arr.length; i++){       
                if ( arr[i] === remIndex) {        
                }      
            }
            builder.skills.userSkills = arr;
            builder.skills.maxAdd = false

        },
        interestAdd:async ()=>{
            var result = await builder.strCheck(builder.interests.input,22,5);
            if(result.ok && builder.interests.userInterests.length < builder.interests.maxInterest){
                builder.interests.userInterests.push(builder.interests.input);
                builder.interests.input ="";
            }else if(builder.interests.userInterests.length >= builder.interests.maxInterest){
                builder.interests.maxAdd = true
            }
        },
        interestRemove:()=>{
            var remove = event.currentTarget.parentNode.children[0];
            var remIndex = builder.interests.userInterests.indexOf(remove.textContent);
            var arr = builder.interests.userInterests;
            arr.splice(remIndex, 1);
            for( let i = 0; i < arr.length; i++){       
                if ( arr[i] === remIndex) {        
                }      
            }
            builder.interests.userInterests = arr;
            builder.interests.maxAdd = false
        },
        emailCheck:async ()=>{
            var email = builder.contact.email;
            var result = await validEmailCheck(email);
            if(result.ok){
                builder.validateInput('editEmailInput',true)
            }else{
                builder.validateInput('editEmailInput',false)
            }
        },
        phoneCheck:async()=>{
            var phone = builder.contact.phone;
            var result = await phoneFormatter(phone);
            if(phone.length > 8){
                builder.validateInput('editPhoneInput', true)
            }else{
                builder.validateInput('editPhoneInput',false)
            };
            builder.contact.phone = result
        },
        educationAdd:async()=>{
            var temp = {
                start:'',
                end:'',
                school:'',
                certification:'',
                position:'',
            }
            var school = document.getElementById('editInstitution');
            var certification = document.getElementById('editCertification');
            var strtTime = document.getElementById('editStartInput');
            var endTime = document.getElementById('editEndInput');
            var stData = await dateFormatter(strtTime.valueAsNumber, 'unix','-');
            var enData = await dateFormatter(endTime.valueAsNumber, 'unix','')
            temp.start = `${stData.m_y_d_str.monthStr} ${stData.year}`
            temp.end = `${enData.m_y_d_str.monthStr} ${enData.year}`
            temp.school = school.value;
            temp.certification = certification.value;
            temp.position = Math.abs(builder.education.entered.length - 1);


            var elArr = [strtTime, endTime, school, certification];
            var count=0;
            elArr.forEach((item,index)=>{
                var value = item.value;
                if(!item.value){
                    builder.validateInput(item.id,false,false)
                }else{
                    builder.validateInput(item.id,true,false);
                    count += 1    
                }
            })

            if(count===elArr.length && builder.education.entered.length < builder.education.maxAdd){
                builder.education.entered.push(temp);
                builder.education.template.start='';
                builder.education.template.end='';
                builder.education.template.school='';
                builder.education.template.certification='';
                builder.education.template.position='';
                elArr.forEach((item,index)=>{
                    builder.validateInput(item.id,false,true);
                })
            }else{
            }
        },
        educationRemove:()=>{
            var target, position, arr
            target = event.currentTarget.parentNode.children[1];
            position = target.value;
            arr = builder.education.entered;
            arr.splice(position-1,1);
            builder.education.entered = arr;
        },
        jobAdd:async()=>{
            var temp = {
                start:'',
                end:'',
                company:'',
                title:'',
                position:''
            }
            var company = document.getElementById('jobPlaceInput');
            var title = document.getElementById('jobTitleInput');
            var strtTime = document.getElementById('jobStartInput');
            var endTime = document.getElementById('jobEndInput');
            var stData = await dateFormatter(strtTime.valueAsNumber, 'unix','-');
            var enData = await dateFormatter(endTime.valueAsNumber, 'unix','')
            temp.start = `${stData.m_y_d_str.monthStr} ${stData.year}`
            temp.end = `${enData.m_y_d_str.monthStr} ${enData.year}`
            temp.company = company.value;
            temp.title = title.value;
            temp.position = Math.abs(builder.employment.entered.length - 1);
            var elArr = [strtTime, endTime, company, title];
            var count=0;

            elArr.forEach((item,index)=>{
                var value = item.value;
                if(!item.value){
                    builder.validateInput(item.id,false,false)
                }else{
                    builder.validateInput(item.id,true,false);
                    count += 1    
                }
            })

            if(count===elArr.length && builder.employment.entered.length < builder.employment.maxAdd){
                builder.employment.entered.push(temp);
                builder.employment.template.start='';
                builder.employment.template.end='';
                builder.employment.template.company='';
                builder.employment.template.title='';
                var test = document.getElementsByClassName('resume-template')[0]
                elArr.forEach((item,index)=>{
                    builder.validateInput(item.id,false,true);
                });
            }else{
                console.log('not ready')
            }
        },
        jobRemove:()=>{
            var target, position, arr
            target = event.currentTarget.parentNode.children[1];
            position = target.value;
            arr = builder.employment.entered;
            arr.splice(position-1,1);
            builder.employment.entered = arr;           
        },
        refAdd:()=>{
            var temp = {
                company:'',
                title:'',
                name:'',
                contact:{
                    email:'',
                    phone:''
                },
                position:0
            }
            var company = document.getElementById('editRefComp');
            var title = document.getElementById('editRefTitle');
            var name = document.getElementById('editRefName');
            var email = document.getElementById('editRefEmail');
            var phone = document.getElementById('editRefPhone')

            temp.name = name.value
            temp.company = company.value;
            temp.title = title.value;
            temp.position = Math.abs(builder.references.entered.length - 1);
            temp.contact.email= email.value;
            temp.contact.phone = phone.value;
            var elArr = [company, title, name, email,phone];
            var count=0;

            elArr.forEach((item,index)=>{
                var value = item.value;
                if(!item.value){
                    builder.validateInput(item.id,false,false)
                }else{
                    builder.validateInput(item.id,true,false);
                    count += 1    
                }
            })

            if(count===elArr.length && builder.references.entered.length < builder.references.maxEnter){
                builder.references.entered.push(temp);
                builder.references.template.name='';
                builder.references.template.title='';
                builder.references.template.company='';
                builder.references.template.contact.email='';
                builder.references.template.contact.phone='';
                elArr.forEach((item,index)=>{
                    builder.validateInput(item.id,false,true);
                });
            }else{
                elArr.forEach((item,index)=>{
                    if(!item.value){
                        builder.validateInput(item.id,false,false);
                    }else{
                        builder.validateInput(item.id,true,false);

                    }
                });
            }
        },
        refRemove:()=>{
            var target, position, arr
            target = event.currentTarget.parentNode.children[1];
            position = target.value;
            arr = builder.references.entered;
            arr.splice(position-1,1);
            builder.references.entered = arr;
        },
        langAdd: async ()=>{
            var result = await builder.strCheck(builder.languages.input,22,2);
            if(result.ok && builder.languages.userLanguages.length < builder.languages.maxLanguage){
                builder.languages.userLanguages.push(builder.languages.input);
                builder.languages.input ="";
            }else if(builder.languages.userLanguages.length >= builder.languages.maxLanguage){
                builder.languages.maxAdd = true
            }
        },
        langRemove:()=>{

        },
        serviceAdd:async ()=>{
            var result = await builder.strCheck(builder.charities.input,22,2);
            if(result.ok && builder.charities.userCharity.length < builder.charities.maxEnter){
                builder.charities.userCharity.push(builder.charities.input);
                builder.charities.input ="";
            }else if(builder.charities.userCharity.length >= builder.charities.maxEnter){
                builder.charities.maxAdd = true
            }

        },
        serviceRemove:()=>{

        },
        prevPage:()=>{
            builder.page.current -=1
        },
        nextPage:()=>{
            builder.page.current +=1
        },
        pageAdd:async(type)=>{
            const parent = document.querySelector('.zoom-control')
            parent.append(await templateBody.data())
        },
        saveState:()=>{
            localStorage.setItem('intch-resume-saved', JSON.stringify({
                title:"",
                about:"",
                contact:{
                    email:"",
                    address:"",
                    phone:""
                },
                skills:[],
                interests:[],
                education:[],
                employment:[],
                references:[],
                languages:[],
                charities:[],
            }))
        },
        print:()=>{
            var print = document.getElementsByClassName('resume-template')[0];
            var html = print.innerHTML;
            fetch('/resume/create/build/complete', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    html:html
                })
            }).then(res=>res.json()).then(data=>{
                console.log(data)
            })
            .catch(error=> console.log(error))
        }
        
    }
})













