import { commonEnroll } from './callers.js'

const phoneInputField = document.querySelector("#phoneInput");
const emailInputField = document.querySelector('#emailInput');
const firstnameField = document.querySelector('#firstNameInput');
const lastnameField = document.querySelector('#lastNameInput');
const radioField = document.querySelector('#termsandServiceagree');
const incompsendBtn = document.querySelector('.sendBtn');
const sendBtn = document.querySelector('.ready-send');
/*const phoneInput = window.intlTelInput(phoneInputField, {
preferredCountries: ["jm", "us", "uk", "tt"],
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});*/

function formatPhoneNumber(value){
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
function phoneNumberFormatter(){
    const formattedNum = formatPhoneNumber(phoneInputField.value);
    phoneInputField.value = formattedNum;
}

const emailChecker = ()=>{
    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    var result = regex.test(emailInputField.value)
    if(result){
        emailInputField.classList = "form-control is-valid";
        return true
    }else{
        emailInputField.classList = "form-control is-invalid";
        return false
    }
}
phoneInputField.addEventListener('keyup', (e)=>{
    phoneNumberFormatter()
})


const setPassInput = document.querySelector('#createpasswordInput');
const confirmPassInput = document.querySelector('#confirmpasswordInput');
const passReqDisplay = document.getElementById('passwordReqDisplay');


const checkpassMeet = (value)=>{
   var lengthReq, caseComplexity, numberComplexity
   var responseObj = {
    "condition_met":false,
     "specific":{
         "length":false,
         "caseComp":false,
         "numComp":false,
     }
    }
   if(value.length >= 8 && value.length <=32){
       lengthReq = true
       responseObj.specific.length = true
   }else{
        responseObj.specific.length = false
        lengthReq = false
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
        responseObj.specific.caseComp = upperCaseFound
        return upperCaseFound
   }
   caseComplexity = caseChecker(value);
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
       responseObj.specific.numComp = numberFound
       return numberFound
   }
   numberComplexity = numberChecker(value);
   if(lengthReq && caseComplexity && numberComplexity){
       responseObj.condition_met = true
       setPassInput.classList="form-control is-valid"
   }else{
       responseObj.condition_met = false;
       setPassInput.classList="form-control is-invalid"

   }
   return responseObj
}

const checkPassMatch = ()=>{
    var compVal = setPassInput.value;
    var confirmVal = confirmPassInput.value;
    if(compVal===confirmVal){
        return true
    }else{
        return false
    }
}

const signupformChecker = ()=>{
    var agreeTerms = document.getElementById('termsandServiceagree');
    var sendBtn = document.querySelector('.sendBtn');
    var count = 0
    var responseObj = {
        "verified":false,
        "parts_verified":{
            "first_name": false,
            "last_name":false,
            "email":false,
            "phonenumber":false,
            "password":false,
            "agree_tos":false,
        }
    }
    if(firstnameField.value.length > 2){
        responseObj.parts_verified.first_name = true
        firstnameField.classList = "form-control is-valid"
        count +=1
    }else{
        responseObj.parts_verified.first_name = false;
        firstnameField.classList = "form-control is-invalid"
    }

    if(lastnameField.value.length > 2){
        responseObj.parts_verified.last_name = true;
        lastnameField.classList = "form-control is-valid"
        count +=1
    }else{
        responseObj.parts_verified.last_name = false;
        lastnameField.classList = "form-control is-invalid"

    }

    responseObj.parts_verified.email = emailChecker();
    if(responseObj.parts_verified){
        count +=1
    }else{

    }
    var pass, passConfirm;
    pass = checkpassMeet(setPassInput.value);
    passConfirm = checkPassMatch()
    if(pass.condition_met && passConfirm){
        responseObj.parts_verified.password = true;
        setPassInput.classList="form-control is-valid";
        confirmPassInput.classList="form-control is-valid"
        count +=1
    }else{
        setPassInput.classList="form-control is-invalid";
        confirmPassInput.classList="form-control is-invalid"
    }    
    if(phoneInputField.value.length >= 13){
        responseObj.parts_verified.phonenumber = true;
        phoneInputField.classList="form-control is-valid"
        count +=1
    }else{
        responseObj.parts_verified.phonenumber = false;
        phoneInputField.classList="form-control is-invalid"
    }
    if(agreeTerms.checked){
        responseObj.parts_verified.agree_tos = true;
        agreeTerms.classList="form-check-input is-valid"
        count +=1
    }else{
        agreeTerms.classList="form-check-input is-invalid"
    }
 
    if(count=== 6){
        incompsendBtn.classList="sendBtn ready-send"
        responseObj.verified =true

    }else{
        incompsendBtn.classList="sendBtn";
        responseObj.verified = false

    }
    return responseObj
}

setPassInput.addEventListener('blur', ()=>{
    var result = checkpassMeet(setPassInput.value);
    if(result.condition_met){
        setPassInput.classList = "form-control is-valid"
        passReqDisplay.classList = "row mt-1 d-none"
    }else{
        setPassInput.classList = "form-control is-invalid";
        passReqDisplay.classList = "row mt-1"
    }
})


confirmPassInput.addEventListener('blur', ()=>{
    var result = checkPassMatch();
    if(result && confirmPassInput.value.length >= 8){
        confirmPassInput.classList = "form-control is-valid"
    }else{
        confirmPassInput.classList = "form-control is-invalid"
    }
})

setPassInput.addEventListener('keyup', ()=>{
    var val = setPassInput.value;
    var san = val.replaceAll(" ","").replaceAll('<script>',"").replaceAll('</script',"").replaceAll('<','').replaceAll('%','');
    setPassInput.value = san
})


confirmPassInput.addEventListener('keyup', ()=>{
    var val = confirmPassInput.value;
    var san = val.replaceAll(" ","").replaceAll('<script>',"").replaceAll('</script>',"").replaceAll('<',"").replaceAll('%','');
    confirmPassInput.value = san
})


emailInputField.addEventListener('blur', ()=>{
    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    var result = regex.test(emailInputField.value)
    if(result){
        emailInputField.classList = "form-control is-valid";
    }else{
        emailInputField.classList = "form-control is-invalid";
    }
})

radioField.addEventListener('click', ()=>{
    signupformChecker()
})

incompsendBtn.addEventListener('click', ()=>{
    var feedBack = document.getElementById('formFeedBack')
    var data = signupformChecker();
    var phone = (phoneInputField.value).replaceAll('(','').replaceAll(')','').replaceAll(' ','').replaceAll('-','')
    signupformChecker();
    if(data.verified){
        var response = commonEnroll(firstnameField.value, lastnameField.value, emailInputField.value,setPassInput.value, phone, true);
        if(!response.completed){
            feedBack.textContent = "User already exists";
            emailInputField.classList="form-control is-invalid"
        }else{
            feedBack.textContent = "";
            emailInputField.classList="form-control is-invalid"
        }
    }else{
    }
})


