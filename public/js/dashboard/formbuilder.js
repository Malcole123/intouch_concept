const listingCreator = new Vue({
    el:'#createListingArea',
    data:{
        listing_data:{
            title:'',
            position_summary:'',
            department:'',
            job_type:'',
            employment_location:'',
            responsibilities:[],
            qualifications:[],
            benefits:[],
            application_data:{
                question_data:[]
            },
            application_deadline:"",
            post_type:""
        },
        company_data:{},
        inputs:{
            r:'',
            b:'',
            d_q:'',
            a_q:'',
            include_test:true,
            question_temp:{
                question_type:'single',
                question:'',
                answer_option:[],
                option_count:2
            }
        },
        most_recent:{
            r:{
                id:"",
                content:""
            },
            b:{
                id:"",
                content:""
            },
            d_q:{
                id:"",
                content:""
            },
            a_q:{
                id:"",
                content:""
            }
        },
        current_step:1,
        step:{
            one:false,
            two:false,
            three:false,
            four:false,
        }
    },
    methods:{
        checkStep:async (step)=>{
            if(step===1){
                var inputs = ['createTitleInput','createPositionInput','createDepartmentInput','employmentTypeSelect','jobLocationSelect'];
                var not_ok = [];
                var _ok = [];
                for(let i = 0; i < inputs.length; i++){
                    var input = document.getElementById(inputs[i]);
                    if(input.value.length === 0){
                        not_ok.push(i)
                    }else{
                        _ok.push(i)
                    }
                };
                if(not_ok.length !== inputs.length){
                    not_ok.forEach((failure)=>{
                        setInValid(inputs[failure])
                    })
                    _ok.forEach((success)=>{
                        setValid(inputs[success])
                    }) 
                }
                if(_ok.length === inputs.length){
                    _ok.forEach((success)=>{
                        setValid(inputs[success])
                    });
                    listingCreator.current_step = 2;
                    listingCreator.step.one = true;
                    return true
                }else{
                    return false
                }

            }else if(step===2){
                    var r = listingCreator.listing_data.responsibilities.length
                    var q = listingCreator.listing_data.qualifications.length;
                    var b = listingCreator.listing_data.benefits.length;  
                    if((r && q) && b ){
                        listingCreator.current_step = 3;
                        listingCreator.step.two = true;
                        return true
                    }else{
                        return false
                    }

            }else if(step === 3){
                var a_q = listingCreator.listing_data.application_data.question_data.length;
                var a_i = listingCreator.inputs.include_test;
                if(a_q && a_i){
                    listingCreator.current_step = 4;
                    listingCreator.step.three = true;
                }else if(!a_i){
                    listingCreator.current_step = 4;
                    listingCreator.step.three = true;
                }else if(a_i && !a_q){
                    setInValid('addQuestionInput')
                }
            }else if(step === 4){
                var p_1 = listingCreator.checkDate();
                if(p_1){
                    listingCreator.confirmListing();
                    listingCreator.current_step = 5;
                    listingCreator.step.four = true;
                }
            } 
        },
        createEntry:(type)=>{
            switch(type){
                case 'r':
                    var input = listingCreator.inputs.r;
                    if(listingCreator.listing_data.responsibilities.length < 7 && input.length > 0){
                        listingCreator.listing_data.responsibilities.push(input);
                        listingCreator.most_recent.r.content = input;
                        listingCreator.most_recent.r.id = parseInt(listingCreator.listing_data.responsibilities.length) -1
                        listingCreator.inputs.r = "";
                    }
                    break
                case 'q':
                    var input = listingCreator.inputs.d_q;
                    if(listingCreator.listing_data.qualifications.length < 7 && input.length > 0){
                        listingCreator.listing_data.qualifications.push(input);
                        listingCreator.most_recent.d_q.content = input;
                        listingCreator.most_recent.d_q.id = parseInt(listingCreator.listing_data.qualifications.length) -1
                        listingCreator.inputs.d_q ="";
                    }
                    break
                case 'b':
                    var input = listingCreator.inputs.b;
                    if(listingCreator.listing_data.benefits.length < 7 && input.length > 0){
                        listingCreator.listing_data.benefits.push(input);
                        listingCreator.most_recent.b.content = input;
                        listingCreator.most_recent.b.id = parseInt(listingCreator.listing_data.benefits.length) -1
                        listingCreator.inputs.b=""
                    }
                    break  
                case 'a_q':
                    var temp = listingCreator.inputs.question_temp;
                    var q_input = document.getElementById('addQuestionInput')

                    if(temp.question_type === 'single'){
                       if(temp.question.length > 0){
                            temp.option_count = temp.answer_option.length;
                            listingCreator.listing_data.application_data.question_data.push(temp);
                            listingCreator.most_recent.a_q.content = temp;
                            listingCreator.most_recent.a_q.id = parseInt(listingCreator.listing_data.application_data.question_data.length) -1
                            listingCreator.inputs.question_temp = {
                                question_type:'single',
                                question:'',
                                answer_option:[],
                                option_count:2
                            }
                            q_input.className = 'form-control'
                        }else{
                           setInValid(q_input.id)
                        }
                    }else{
                        var ok__ = [];
                        for(let i = 0; i< listingCreator.inputs.question_temp.option_count; i++){
                            var input = document.getElementById(`answerOptionInput`+i);
                            if(input.value.length > 0){
                                ok__.push(input);
                                setValid(input.id)
                            }else{
                                setInValid(input.id)
                            }
                        }
                        temp.option_count = temp.answer_option.length;
                        if(temp.question.length > 0 && ok__.length > 2){
                            listingCreator.listing_data.application_data.question_data.push(temp);
                            listingCreator.most_recent.a_q.content = temp;
                            listingCreator.most_recent.a_q.id = parseInt(listingCreator.listing_data.application_data.question_data.length) -1            
                            for(let i = 0; i< listingCreator.inputs.question_temp.option_count; i++){
                                var input = document.getElementById(`answerOptionInput`+i);
                                input.value = "";
                                input.className = "form-control"
                            }
                            listingCreator.inputs.question_temp = {
                                question_type:'single',
                                question:'',
                                answer_option:[],
                                option_count:2
                            }
                        }
                    }
                  


            }
        },
        createSubEntry:(type,pos)=>{
            switch(type){
                case 'a_q':
                    var input = document.getElementById(`answerOptionInput`+pos);
                        if(input.value.length > 0 ){
                            listingCreator.inputs.question_temp.answer_option[pos] = input.value
                            setValid(input.id)
                        }else{
                            setInValid(input.id)
                        }
                    break
                case 'n_o':
                    listingCreator.inputs.question_temp.option_count += 1;
                    break
            }
        },
        removeSubEntry:(type,pos)=>{
            switch(type){
                case 'a_o':
                    var focus = listingCreator.most_recent.a_q.id
                    var arr = listingCreator.listing_data.application_data.question_data[focus].answer_option[pos];
                    arr.splice(pos,1);
                    listingCreator.listing_data.application_data.question_data[focus].answer_option = arr;
                    listingCreator.most_recent.a_q.content = listingCreator.listing_data.application_data.question_data;
                    listingCreator.most_recent.a_q.id = pos;
                    break
            }
        },
        focus:(type,index)=>{
            switch(type){
                case 'r':
                    listingCreator.most_recent.r.content = listingCreator.listing_data.responsibilities[index];
                    listingCreator.most_recent.r.id = index
                    break
                case 'q':
                    listingCreator.most_recent.d_q.content = index
                    listingCreator.most_recent.d_q.id = index
                    break
                case 'b':
                    listingCreator.most_recent.b.content = listingCreator.listing_data.benefits[index];
                    listingCreator.most_recent.b.id = index
                    break   
                case 'a_q':
                    listingCreator.most_recent.a_q.content = listingCreator.listing_data.application_data.question_data[index];
                    listingCreator.most_recent.a_q.id = index;
                    console.log(listingCreator.most_recent.a_q.content)
                    break  
            }
        },
        remove:(type,index)=>{
            switch(type){
                case 'r':
                    var arr = listingCreator.listing_data.responsibilities;
                    arr.splice(index,1);
                    listingCreator.listing_data.responsibilities = arr
                    listingCreator.most_recent.r.content = listingCreator.listing_data.responsibilities[index];
                    listingCreator.most_recent.r.id = 0
                    break
                case 'q':
                    var arr = listingCreator.listing_data.qualifications;
                    arr.splice(index,1);
                    listingCreator.listing_data.qualifications = arr
                    listingCreator.most_recent.d_q.content = listingCreator.listing_data.qualifications[index];
                    listingCreator.most_recent.d_q.id = 0                    
                    break
                case 'b':
                    var arr = listingCreator.listing_data.benefits;
                    arr.splice(index,1);
                    listingCreator.listing_data.benefits = arr
                    listingCreator.most_recent.d_q.content = listingCreator.listing_data.benefits[index];
                    listingCreator.most_recent.d_q.id = 0                    
                    break  
                case 'a_q':
                    var arr = listingCreator.listing_data.application_data.question_data;
                    arr.splice(index,1);
                    listingCreator.listing_data.application_data.question_data = arr
                    listingCreator.most_recent.a_q.content = listingCreator.listing_data.appllication_data.question_data[index];
                    listingCreator.most_recent.a_q.id = 0                    
                    break 
            }
        },
        edit:(type,index)=>{
            switch(type){
                case 'r':
                    var arr = listingCreator.listing_data.responsibilities;
                    listingCreator.inputs.r = arr[index]
                    arr.splice(index,1);
                    listingCreator.listing_data.responsibilities = arr
                    listingCreator.most_recent.r.content = listingCreator.listing_data.responsibilities[index];
                    listingCreator.most_recent.r.id = 0
                    break
                case 'q':
                    var arr = listingCreator.listing_data.qualifications;
                    listingCreator.inputs.d_q = arr[index]
                    arr.splice(index,1);
                    listingCreator.listing_data.qualifications = arr
                    listingCreator.most_recent.d_q.content = listingCreator.listing_data.qualifications[index];
                    listingCreator.most_recent.d_q.id = 0                    
                    break
                case 'b':
                    var arr = listingCreator.listing_data.benefits;
                    listingCreator.inputs.b = arr[index]
                    arr.splice(index,1);
                    listingCreator.listing_data.benefits = arr
                    listingCreator.most_recent.d_q.content = listingCreator.listing_data.benefits[index];
                    listingCreator.most_recent.d_q.id = 0                    
                    break                         
            }
        },        
        jumptoStep:(pos)=>{
            var true_arr = [listingCreator.step.one,listingCreator.step.two,listingCreator.step.three]
            if(listingCreator.current_step > pos ){
                listingCreator.current_step = pos;
            }else if(listingCreator.current_step < pos && true_arr[pos-1]){
                listingCreator.current_step = pos;
            }
        },
        confirmListing:async ()=>{
            var l_d = listingCreator.listing_data;
            var c_d = listingCreator.company_data;
            var p_Data = {
                l_d:l_d,
                c_d:c_d
            }
            const sendForm = async ()=>{
                var response = await fetch('/dashboard/listings/add', {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(p_Data)
                }).then(res=>res.json())
                .then(data=>{
                    return{
                        ok:true,
                    }
                }).catch(error =>{
                    return {
                        ok:false
                    }
                })
                return response
              }
              var result = await sendForm();
              if(result.ok){
                completeCreateProcess()
            }else{
                console.log('something went wrong')
              }
        },
        resetState:()=>{
            var e_recent = {
                id:'',
                content:''
            }
            listingCreator.listing_data.title = "";
            listingCreator.listing_data.position_summary = "";
            listingCreator.listing_data.department = "";
            listingCreator.listing_data.job_type = "";
            listingCreator.listing_data.employment_location = "";
            listingCreator.listing_data.responsibilities = [];
            listingCreator.listing_data.qualifications = [];
            listingCreator.listing_data.benefits = [];
            listingCreator.listing_data.application_data.question_data = [];
            listingCreator.inputs.r = "";
            listingCreator.inputs.b = "";
            listingCreator.inputs.d_q = "";
            listingCreator.inputs.a_q = "";
            listingCreator.inputs.include_test = true;
            listingCreator.inputs.question_temp.question_type = 'single';
            listingCreator.inputs.question_temp.question = "";
            listingCreator.inputs.question_temp.answer_option = [];
            listingCreator.inputs.question_temp.option_count = 2;
            listingCreator.most_recent.r = e_recent;
            listingCreator.most_recent.b = e_recent;
            listingCreator.most_recent.d_q = e_recent;
            listingCreator.most_recent.a_q = e_recent;
            listingCreator.current_step = 1;
            listingCreator.step.one = false;
            listingCreator.step.two = false
            listingCreator.step.three = false
            listingCreator.step.four = false
        },
        setCompanyData:(data)=>{
            listingCreator.company_data = data
        },
        checkDate:()=>{
            var dateInput = document.getElementById('applicationDeadlineInput');
            var input_date = new Date(dateInput.value.replaceAll('-','.'));
            var today_date = new Date();
            var input_val = input_date.getTime()
            var date_val = today_date.getTime();
            if(input_val > date_val){
                setValid(dateInput.id);
                listingCreator.application_deadline = input_val;
                return true
            }else{
                setInValid(dateInput.id);
                return false
            }
        },
        future:()=>{
            var dt = new Date();
            var un = dt.getTime();
            return un
        },
        done:()=>{
            $('#createListingArea').hide();
            listingCreator.resetState();
            window.location.href = '/dashboard/listings';  
        }
    }
})

const setValid=(id)=>{
    var target = document.getElementById(id);
    target.className = "form-control is-valid"
}


const setInValid=(id)=>{
    var target = document.getElementById(id);
    target.className = "form-control is-invalid"
}


const completeCreateProcess= ()=>{
    listingCreator.current_step = 5
}
const completeEditProcess= ()=>{
    $('#staticBackdrop').toggle()
    $('#successModal').modal('show')

}


const main = ()=>{
    $('#init__Create').on('click',(e)=>{
        var d = $(e.currentTarget).attr('data-company');
        listingCreator.setCompanyData(JSON.parse(d))
        $('#createListingArea').show();
    })

    $('#init__Create__Close').on('click',()=>{
        $('#createListingArea').hide();
        listingCreator.resetState()
    })

    $(".desc_para").each(function(i){
        len=$(this).text().length;
        if(len>80)
        {
          $(this).text($(this).text().substr(0,80)+'...');
        }
    });
}
$(document).ready(main)


