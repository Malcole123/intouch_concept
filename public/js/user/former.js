import { cEnroll, cEnter } from "./callers.js";

const registerApp = new Vue({
    el:'#register-form',
    data:{
        firstName:'',
        lastName:'',
        email:'',
        phoneNumber:'',
        password:'',
        passConfirm:'',
        tosAgree:false,
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
        formReady:false
    },
    methods:{
        processForm:()=>{
            var sendData = {
                fn:registerApp.firstName,
                ln:registerApp.lastName,
                em:registerApp.email,
                pn:registerApp.phoneNumber,
                ps:registerApp.password,
                tos:registerApp.tosAgree
            };
            const processor = ()=>{
                var userState = registerApp.checkEmailUnique();
                if(userState){
                    registerApp.errorMsg.email = "User already exists"
                    setInvalid('emailInput');
                }else{
                    cEnroll(sendData.fn, sendData.ln, sendData.em, sendData.pn,
                        sendData.ps, sendData.tos)  
                }
            }
            processor()

        },
        checkFirst:()=>{
            var name = registerApp.firstName;
            if(name.length > 0){
                setvalid('firstNameInput');
                registerApp.errors.firstname = false;
                return true
            }else{
                setInvalid('firstNameInput');
                registerApp.errors.firstname = true;
                return false
            }
        },
        checkLast:()=>{
            var name = registerApp.lastName;
            if(name.length > 0){
                setvalid('lastNameInput');
                registerApp.errors.lastname = false
                return true
            }else{
                setInvalid('lastNameInput');
                registerApp.errors.lastname = true;
                return false
            }
        },
        verifyEmail:()=>{
            var email = registerApp.email;
            let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
            var rF = regex.test(email);
            if(email.length > 0){
                if(!rF){
                    setInvalid('emailInput');
                    registerApp.errors.email = true;
                    return false
                }
                else{
                   setvalid('emailInput');
                   registerApp.errors.email = false
                   return true
                }
            }
        },
        verifyPhone:()=>{
           if( registerApp.phoneNumber.length > 0){
            if(registerApp.phoneNumber.length === 14){
                setvalid('phoneInput');
                registerApp.errors.phoneNumber = false;
                return true
            }else{
                setInvalid('phoneInput');
                registerApp.errors.phoneNumber = true;
                return false
            }
           }
        },
        phoneformatter:()=>{
            var value = registerApp.phoneNumber;
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
                registerApp.phoneNumber = formattedNum;
            }
            setter()
        },
        checkPassReq:()=>{
            var val = registerApp.password;
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
                registerApp.errors.passwordReq = false;
                return true
            }else{
                setInvalid('createpasswordInput');
                registerApp.errors.passwordReq = true;
                return false
            }
           }else{
               return false
           }
        },
        checkPassMatch:()=>{
            var val = registerApp.passConfirm
            var compIn = document.querySelector('#createpasswordInput');
            var comp = compIn.value;
            if(val.length > 0){
                if(val === comp){
                    setvalid('confirmpasswordInput');
                    registerApp.errors.passwordMatch = false;
                    return true
                }else{
                    setInvalid('confirmpasswordInput');
                    registerApp.errors.passwordMatch = true;
                    return false
                }
            }else{
                return false
            }
        },
        checkForErrors:()=>{
            var data = Object.values(registerApp.errors);
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
                    email:registerApp.email
                })
            }).then(res=>res.json())
            .then(data => {
                return data
            });
            if(checkCall.exists){
                registerApp.errors.email = true;
                registerApp.errorMsg.email = "User already exists";
                setInvalid('emailInput');
                return false
            }else{
                registerApp.errors.email = false;
                registerApp.errorMsg.email = "No errors found";
                setvalid('emailInput');
                return true
            }
            return checkCall;
        },
        checkFormReady:()=>{
            console.log('changed')
            var fn, ln, em, pn, ps, pc,tos;
            fn = registerApp.checkFirst();
            ln = registerApp.checkLast();
            em = registerApp.verifyEmail();
            pn = registerApp.verifyPhone();
            ps = registerApp.checkPassReq();
            pc = registerApp.checkPassMatch();
            tos =registerApp.tosAgree;
            
            if((fn && ln) && (em && pn) && (ps && pc) && tos){
                registerApp.formReady = true
            }else{
                registerApp.formReady = false
            }
        }
        

    }
})

const loginApp = new Vue({
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
        formReady:false
    },
    methods:{
        processForm:()=>{
            var sendData = {
                em:loginApp.email,
                ps:loginApp.password,
            };
            const processor = ()=>{
                var userState = loginApp.checkEmailExists();
                if(userState){
                    cEnter(sendData.em, sendData.ps)
                }else{
                    loginApp.errorMsg.email = "User already exists"
                }
            }
            processor();
        },
        verifyEmail:()=>{
            var email = loginApp.email;
            let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
            var rF = regex.test(email);
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
                    email:loginApp.email
                })
            }).then(res=>res.json())
            .then(data => {
                return data
            })
            if(checkCall.exists){
                loginApp.errors.nouserFound = false;
                return true
            }else{
                loginApp.errors.nouserFound = true;
                loginApp.errorMsg.error = "Incorrect user or password";
                return false
            }
        },
        checkFormReady:()=>{
            var em, pass
            em = loginApp.verifyEmail();
            if(loginApp.password.length >= 8){
                pass =  true
            }else{
                pass = false
            }

            if(em && pass){
                loginApp.formReady = true;
            }else{
                loginApp.formReady = false
            }
        }
    }
})

const accRecovery = new Vue({
    el:'#recovery-form',
    data:{
        email:'',
        errors:{
            nouser:false,
            invalidemail:false,
        },
        errorMsg:""
    },
    methods:{
        processForm:()=>{
            var data = {
                email:accRecovery.email
            }
            console.log(data)
        },
        checkValidEmail:()=>{
            var email = accRecovery.email;
            let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
            var rF = regex.test(email);
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
    }
})

const setInvalid = (id)=>{
    var target = document.getElementById(id);
    target.classList ="form-control is-invalid"
}

const setvalid = (id)=>{
    var target = document.getElementById(id);
    target.classList ="form-control is-valid"
}
