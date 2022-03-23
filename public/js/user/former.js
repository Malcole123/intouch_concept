import { cEnroll, cEnter } from "./callers.js";

const rApp = new Vue({
    el:'#register-form',
    data:{
        firstName:'',
        lastName:'',
        email:'',
        phoneNumber:'',
        password:'',
        passConfirm:'',
        tosAgree:true,
        errors:{
            firstname:false,
            lastname:false,
            email:false,
            phoneNumber:false,
            passwordReq:false,
            passwordMatch:false,
            tosIgnored:false,
        },
        errorMsg:{
            email:"Invalid email",
            phoneNumber:"Please check phone number entered",
            passSet:"Your password does not meet requirements",
            passConfirm:"Your passwords do not match",
            tosAgree:"You must agree to our terms of service to continue"
        },
        formReady:false,
        processing:false,
    },
    methods:{
        processForm:()=>{
            var form = document.getElementById('register-form');
            var ePoint = form.getAttribute('action');
            var userType;
            if(window.location.href.includes('employer')){
                userType = 'client'
            }else{
                userType = 'common'
            }
            var sendData = {
                fn:rApp.firstName,
                ln:rApp.lastName,
                em:rApp.email,
                pn:rApp.phoneNumber,
                ps:rApp.password,
                tos:rApp.tosAgree,
                user_type:userType,
                end:''
            };
            const processor = async ()=>{
                var r = await cEnroll(sendData.fn, sendData.ln, sendData.em, sendData.pn,sendData.ps, sendData.tos,sendData.user_type,ePoint);
                if(r.completed){
                    window.location.href = "/onboarding/identity/verifyemail"  
                }else{
                    rApp.errorMsg.email = "User already exists"
                    rApp.processing = false
                    setInvalid('emailInput');
                }            
            }
            if(rApp.formReady){
                rApp.processing = true;
                rApp.formReady = false
                processor()
            }else{
                rApp.checkForErrors()
            }

        },
        checkFirst:()=>{
            var name = rApp.firstName;
            if(name.length > 0){
                setvalid('firstNameInput');
                rApp.errors.firstname = false;
                return true
            }else{
                setInvalid('firstNameInput');
                rApp.errors.firstname = true;
                return false
            }
        },
        checkLast:()=>{
            var name = rApp.lastName;
            if(name.length > 0){
                setvalid('lastNameInput');
                rApp.errors.lastname = false
                return true
            }else{
                setInvalid('lastNameInput');
                rApp.errors.lastname = true;
                return false
            }
        },
        verifyEmail:()=>{
            var email = rApp.email;
            let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
            var rF = regex.test(email);
            if(email.length > 0){
                if(!rF){
                    setInvalid('emailInput');
                    rApp.errors.email = true;
                    return false
                }
                else{
                   setvalid('emailInput');
                   rApp.errors.email = false
                   return true
                }
            }
        },
        verifyPhone:()=>{
           if( rApp.phoneNumber.length > 0){
            if(rApp.phoneNumber.length === 14){
                setvalid('phoneInput');
                rApp.errors.phoneNumber = false;
                return true
            }else{
                setInvalid('phoneInput');
                rApp.errors.phoneNumber = true;
                return false
            }
           }
        },
        phoneformatter:()=>{
            var value = rApp.phoneNumber;
            const formatter = (value)=>{
                if(!value) return value;

                const phoneNumber = value.replace(/[^\d]/g,"");
                const phoneNumberLength = phoneNumber.length;
            
                if(phoneNumberLength < 4) return phoneNumber;
                if(phoneNumberLength < 7 ){
                    return `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3)}`;
            
                }
                else{
                    return `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3,6)}-${phoneNumber.slice(6,10)}`;
                }
            }
            const setter = ()=>{
                const formattedNum = formatter(value);
                rApp.phoneNumber = formattedNum;
            }
            setter()
        },
        checkPassReq:()=>{
            var val = rApp.password;
            const numberChecker = (str)=>{
                var numberFound = false;
                for(let i =0; i < str.length; i++){
                    var check = str[i];
                     var regex = /^[0-9]+$/;
                     if(regex.test(check)){
                         numberFound = true;
                         i =str.length
                     }
                }
                return numberFound
            }
            const caseChecker = (str)=>{
                var upperCaseFound = false;
                for(let i = 0; i < str.length; i++){
                    var checkLetter = str[i];
                    var regex = /^[A-Z]+$/;
                    if(regex.test(checkLetter)){
                        upperCaseFound = true;
                        i = str.length
                    }
                }
                return upperCaseFound
           }
            const lengthChecker = (str)=>{
               var lengthMet = false;
               if(str.length >= 8){
                   lengthMet = true
               }
               return lengthMet
           }
           var num = numberChecker(val);
           var cas = caseChecker(val);
           var len = lengthChecker(val);
           if(val.length > 0 ){
            if((num && cas)&&len){
                setvalid('createpasswordInput');
                rApp.errors.passwordReq = false;
                return true
            }else{
                setInvalid('createpasswordInput');
                rApp.errors.passwordReq = true;
                return false
            }
           }else{
               return false
           }
        },
        checkPassMatch:()=>{
            var val = rApp.passConfirm
            var compIn = document.querySelector('#createpasswordInput');
            var comp = compIn.value;
            if(val.length > 0){
                if(val === comp){
                    setvalid('confirmpasswordInput');
                    rApp.errors.passwordMatch = false;
                    return true
                }else{
                    setInvalid('confirmpasswordInput');
                    rApp.errors.passwordMatch = true;
                    return false
                }
            }else{
                return false
            }
        },
        checkForErrors:()=>{
            var data = Object.values(rApp.errors);
            for(let i = 0; i < data.length; i++){
                if(data[i]){
                    i = data.length
                    return true
                }else{
                    return false
                }
            }
        },
        checkEmailUnique:async ()=>{
            const checkCall = await fetch('/user/finduser',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    email:rApp.email
                })
            }).then(res=>res.json())
            .then(data => {
                return data
            });
            if(checkCall.exists){
                rApp.errors.email = true;
                rApp.errorMsg.email = "User already exists";
                setInvalid('emailInput');
                return false
            }else{
                rApp.errors.email = false;
                rApp.errorMsg.email = "No errors found";
                setvalid('emailInput');
                return true
            }
            return checkCall;
        },
        checkFormReady:()=>{
            var fn, ln, em, pn, ps, pc,tos;
            fn = rApp.checkFirst();
            ln = rApp.checkLast();
            em = rApp.verifyEmail();
            pn = rApp.verifyPhone();
            ps = rApp.checkPassReq();
            pc = rApp.checkPassMatch();
            tos =rApp.tosAgree;
            
            if((fn && ln) && (em && pn) && (ps && pc) && tos){
                rApp.formReady = true
            }else{
                rApp.formReady = false
            }
        }
        

    }
})

const lApp = new Vue({
    el:'#login-form',
    data:{
        email:'',
        password:'',
        errors:{
            nouserFound:false,
            incorrectpass:false,
        },
        errorMsg:{
            error:'Incorrect email or pass'
        },
        formReady:false,
        processing:false,
    },
    methods:{
        processForm:()=>{
            var form = document.getElementById('login-form');
            var ePoint = form.getAttribute('action');
            lApp.processing = true
            const processor = async ()=>{
                var path = await lApp.definePath()
                var sendData = {
                    em:lApp.email,
                    ps:lApp.password,
                    sendTo:path,
                    endpoint:ePoint,
                };
                var ret = await cEnter(sendData.em, sendData.ps, sendData.sendTo,sendData.endpoint);
                if(ret.completed){
                    window.location.href= ret.redPath
                }else{
                    lApp.errors.incorrectpass = true;
                    lApp.errors.nouserFound = true;
                    lApp.errorMsg.error = "Incorrect email or password";
                    setInvalid('enterpasswordInput');
                    setInvalid('loginemailInput');
                    lApp.processing = false
                }
            }
            processor();
        },
        verifyEmail:()=>{
            var email = lApp.email;
            let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
            var rF = regex.test(email);
            lApp.definePath()
            if(email.length > 0){
                if(!rF){
                    return false
                }
                else{
                   return true
                }
            }else{
                return false
            }
        },
        checkEmailExists:async ()=>{
            const checkCall = await fetch('/user/finduser',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    email:lApp.email
                })
            }).then(res=>res.json())
            .then(data => {
                return data
            })
            if(checkCall.exists){
                lApp.errors.nouserFound = false;
                return true
            }else{
                lApp.errors.nouserFound = true;
                lApp.errorMsg.error = "Incorrect user or password";
                return false
            }
        },
        checkFormReady:()=>{
            var em, pass
            em = lApp.verifyEmail();
            if(lApp.password.length >= 8){
                pass =  true
            }else{
                pass = false
            }

            if(em && pass){
                lApp.formReady = true;
            }else{
                lApp.formReady = false
            }
        },
        definePath:async ()=>{
            var path = window.location.search;
            var sendTo=path.replace('?sendTo=','');
            var retData = {
                sendTo:sendTo,
            }
            return retData
        }
    }
})

const accR = new Vue({
    el:'#recovery-form',
    data:{
        email:'',
        errors:{
            nouser:false,
            invalidemail:false,
        },
        errorMsg:"",
        formReady:false
    },
    methods:{
        processForm:()=>{
            var data = {
                email:accR.email
            }
        },
        checkValidEmail:()=>{
            var email = accR.email;
            let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
            var rF = regex.test(email);
            if(email.length > 0){
                if(!rF){
                    accR.formReady = false
                    return false
                }
                else{
                    accR.formReady = true
                   return true
                }
            }else{
                return false
            }
        },
    }
})

const verifyCode = new Vue({
    el:'#verify-form',
    data:{
        one:'',
        two:'',
        three:'',
        four:'',
        five:'',
    },
    methods:{
        auto:(e)=>{
            var currID, currPlace, currInt, nextSpot, keyPress
            keyPress=e.which;
            currID = e.currentTarget.id;
            currPlace = currID.replace('verify','');
            currInt = parseInt(currPlace);
            nextSpot = document.getElementById(`verify${currInt + 1 }`);
            if(keyPress < 58 && keyPress > 48){
                nextSpot.focus();
            }else{
                e.currentTarget.value=""
            }
        },
        processForm:async ()=>{
            var eCode = `${verifyCode.one}${verifyCode.two}${verifyCode.three}${verifyCode.four}${verifyCode.five}`;
            const s =  await fetch('/employer/auth/identity/verify',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    code:eCode
                })
            }).then(res=>res.json()).then(data=>{
                if(data.ok){
                    window.location.href = data.redirect
                }else{
                    // Set invalid
                }
            }).catch(error=>{
                // Do something with error
            })

        }
    }
})

const compReg = new Vue({
    el:"#registerForm",
    data:{
        current_step:1,
        info:{
            name:'',
            industry:'',
            company_size:'',
            company_type:'',
            about:'',
            mission_state:'',
            recruiter_email:'',
            recruiter_phone:'',
            official_website:'',
            country:'',
        },
        progress:{
            step_one:false,
            step_two:false,
            step_three:false,
            step_four:false,
        }
    },
    methods:{
        stepCheck:(step)=>{
            var data = compReg.info
            switch(step){
                case 1:
                    var req_val = [data.name,data.industry,data.company_size,data.company_type];
                    var reqInput = ['Name','Industry','Size','Type'];
                    var error = []
                    req_val.forEach((param,index)=>{
                        if(param.length === 0){
                            error.push(index)
                        }else{
                            setvalid(`company${reqInput[index]}Input`)
                        }
                    });
                    error.forEach((err)=>{
                        setInvalid(`company${reqInput[err]}Input`)
                    });
                    if(error.length === 0){
                        compReg.current_step = 2;
                        compReg.progressHandler(2)
                        compReg.progress.step_one = true
                    }
                    break
                case 2:
                    var req_val = [data.about,data.mission_state];
                    var reqInput = ['About','Mission'];
                    var error = [];
                    req_val.forEach((param,index)=>{
                        if(param.length === 0){
                            error.push(index)
                        }else{
                            setvalid(`company${reqInput[index]}Input`)
                        }
                    })
                    error.forEach((err)=>{
                        setInvalid(`company${reqInput[err]}Input`)
                    });
                    if(error.length === 0){
                        compReg.current_step = 3;
                        compReg.progressHandler(3)
                        compReg.progress.step_two = true
                    }
                    break
                case 3:
                    var req_val = [data.recruiter_email,data.recruiter_phone,data.official_website,data.country];
                    var reqInput = ['Email','Phone','Website','Country'];
                    var error = [];
                    req_val.forEach((param,index)=>{
                        if(param.length === 0){
                            error.push(index)
                        }else{
                            setvalid(`company${reqInput[index]}Input`)
                        }
                    })
                    error.forEach((err)=>{
                        setInvalid(`company${reqInput[err]}Input`)
                    });
                    if(error.length === 0){
                        compReg.current_step = 4;
                        compReg.progressHandler(4)
                        compReg.progress.step_two = true
                    }
                    break
                case 4:
                    $('#completeRegButton').show()
                    compReg.submit()
                    break
            }
        },
        submit:async ()=>{
            var ret = await fetch('/company/create',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(compReg.info)
            }).then(res=>res.json()).then(data=>{
                return {
                    ok:true
                }
            }).catch(error=>{
                return {
                    ok:false
                }
            })
            if(ret.ok){
                compReg.current_step = 5;
                progressHandler(5)
            }
        },
        progressHandler:(step)=>{
            var total = 5;
            var percent = `${(step/total)*100}%`
            var progressBar = document.getElementById('progressBar');
            progressBar.style.width = percent;
            progressBar.getAttribute('aria-valuenow',percent.replace('%',''))
        },
        skipStep:()=>{
            compReg.current_step += 1
        }
    }
})
window.addEventListener('load', ()=>{
    compReg.progressHandler(compReg.current_step)
})


const setInvalid = (id)=>{
    var target = document.getElementById(id);
    target.classList ="form-control is-invalid"
}

const setvalid = (id)=>{
    var target = document.getElementById(id);
    target.classList ="form-control is-valid"
}


export {setInvalid, setvalid}