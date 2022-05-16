    const profileEditor = new Vue({
        el:".company__profile__main",
        data:{
            company:{},
            editable:{
                about:"",
                mission_state:"",
                company_size:"",
                official_website:"",
                headquarter:"",
                company_logo:"",
                company_banner:""
            }
        },
        methods:{
            initialize:()=>{
                var p_EL = document.querySelector('.company__profile__main');
                var dt = p_EL.getAttribute('data-company-data');
                profileEditor.company = JSON.parse(dt);
                profileEditor.editable.about = dt.about_company;
                profileEditor.editable.mission_state = dt.mission_statement;
                profileEditor.editable.company_size = dt.company_size;
                profileEditor.editable.official_website = dt.official_website;
                profileEditor.editable.headquarter = dt.headquarter;
                profileEditor.editable.company_logo = dt.company_logo.url;
                profileEditor.editable.company_banner = dt.company_banner.url;
            }
        }
    })

    window.addEventListener('load',()=>{
        profileEditor.initialize()
    })
