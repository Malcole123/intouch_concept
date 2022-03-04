const applyTool = new Vue({
    el:'#applyModal',
    data:{
      info:{
        first_name:'',
        last_name:'',
        email:'',
        phone:'',
        country:'',
        r_file:'',
      },
      inputID:['enterFNameInput','enterLNameInput','enterEmailInput','enterPhoneInput','enterCountryInput'],
      progress:{
        totalSteps:3,
        currentStep:1,
        stepDesc:['Personal Information', 'Resume Upload', 'Assessment']
      }
    },
    methods:{
        processForm:()=>{
            console.log()
        },
        progressHandler:async (event)=>{
            if(applyTool.progress.currentStep===1){
                var res = await applyTool.checkStepOne();
                if(res === true){
                    applyTool.progress.currentStep = 2
                }
            }else if(applyTool.progress.currentStep === 2){
                if(event.currentTarget.textContent==='Next'){
                    var res = await applyTool.checkStepTwo();
                    if(res === true){
                        applyTool.progress.currentStep = 3
                    }else{
                        setInvalid('resumeUploadInput')
                    }
                }else{
                    applyTool.progress.currentStep = 1               
                }
            }else{
                if(event.currentTarget.textContent==='Next'){
                    var res = await applyTool.checkStepTwo();
                    if(res === true){
                    }else{
                        setInvalid('resumeUploadInput')
                    }
                }else{
                    applyTool.progress.currentStep = 2               
                } 
            }
        },
        checkStepOne:()=>{
            var count = 0;
            var errors=[]
            var st_1_inputs = [applyTool.info.first_name,applyTool.info.last_name,applyTool.info.email,applyTool.info.phone,applyTool.info.country];
            for(let i = 0; i < st_1_inputs.length; i++){
                if(st_1_inputs[i].length > 0){
                    count +=1;
                    setvalid(applyTool.inputID[i])
                }else{
                    setInvalid(applyTool.inputID[i])
                }
            }
            if(count===5){
                return true
            }else{
                return false
            }
        },
        checkStepTwo:()=>{
            var count = 0;
            var acceptedFormats = ['docx','pdf','doc','txt',];
            var file = document.getElementById('resumeUploadInput').value;
            var file_type = file.split('.');
            var f_type = file_type[1].toLowerCase()
            for(let i = 0; i < acceptedFormats.length;i++){
                if(f_type.includes(acceptedFormats[i])){
                    count +=1
                }
            }
            if(count > 0 ){
                return true;
            }else{
                return false
            }
        }
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