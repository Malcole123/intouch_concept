const setJobs = (jobPosition ="", searchLocation="",data) =>{
    var loader = document.getElementById('loadingResultsProgress');
    loader.style.display = "block"

    var sect = document.getElementsByClassName('job-display')[0];

    sect.innerHTML=""
    var searchData = data;
    var jobsFound = searchData.items.length;
    var jobScopeDisp = document.getElementById('search-result-scope');
    jobScopeDisp.textContent = searchLocation.toUpperCase();
    if(jobsFound < 1){
        sect.append(ad)
        setNoResults();
        loader.style.display = "none"
    }
    for(let i = 0; i < searchData.items.length; i++){
      if(i%3 !== 0){
        var set = createCard(searchData.items[i].positionData.company_logo,searchData.items[i].positionData.company_name, searchData.items[i].title,
        searchData.items[i].loc_sub_division, searchData.items[i].type, searchData.items[i].positionData);
        sect.append(set)
      }else{
        var set = createCard(searchData.items[i].positionData.company_logo, searchData.items[i].positionData.company_name, searchData.items[i].title, 
        searchData.items[i].loc_sub_division, searchData.items[i].type, searchData.items[i].positionData);
        var ad = setinlineAdSpace()
        sect.append(ad)
        sect.append(set) 
      }
    }
    loader.style.display = "none"
}

const createCard = (compImg , compName, jobPosition, jobLoc,jobType,positionInfo )=>{
  
    var card = document.createElement('div');
    card.className = "job-card";
    card.setAttribute('data-bs-toggle','modal')
    card.setAttribute('data-bs-target', '#staticBackdrop');
    var img = document.createElement('img');
    img.setAttribute('src',"../images/imageplaceholder.png" );
    img.setAttribute('alt', `${compName} posted this job.`);
    card.append(img);
    //Card content
    var cardContent= document.createElement('div');
    cardContent.className = "job-card-content";
    var jobTitle, company
    jobTitle = document.createElement('h4');
    jobTitle.textContent = jobPosition;
    company = document.createElement('h6');
    company.textContent= compName;
    cardContent.append(jobTitle);
    cardContent.append(company)
        //Relevant info
        var info = document.createElement('div');
        info.className="job-rel-info";
            //loc
            var locInfo, locIcon, location
            locInfo = document.createElement('div');
            locInfo.className="rel-info-loc";
            locIcon = document.createElement('i');
            locIcon.classList="fas fa-map-pin";
            location = document.createElement('span');
            location.textContent = jobLoc;
            locInfo.append(locIcon);
            locInfo.append(location)
            //time
            var timeInfo, timeIcon, time;
            timeInfo = document.createElement('div');
            timeInfo.className = "rel-info-time";
            timeIcon = document.createElement('i');
            timeIcon.classList = "fas fa-clock";
            time= document.createElement('span');
            time.textContent = jobType;
            timeInfo.append(timeIcon);
            timeInfo.append(time);
        info.append(locInfo);
        info.append(timeInfo);
    cardContent.append(info);
    //Pos data
    var positionData = document.createElement('input');
    positionData.setAttribute('type', 'hidden');
    positionData.id = "positionData";
    positionData.value = JSON.stringify(positionInfo);
    cardContent.append(positionData);
    //Acces.
    var dblChev = document.createElement('i');
    dblChev.classList ="far fa-chevron-double-right";
    cardContent.append(dblChev);
    var isNew = false
    if(isNew){
        var newList = document.createElement('div');
        newList.className= "new-listing-ind";
        var template = `<i class="fas fa-flame"></i>
        <span>New Listing</span>
        `
        newList.innerHTML =template;
        cardContent.append(newList)
    }
    card.append(cardContent);
    card.addEventListener('click',()=>{
        setModal(JSON.stringify(positionInfo))
    })
    return card
            
}

const setinlineAdSpace = ()=>{
    var space = document.createElement('div');
    space.className = "inline-ad-space";
    var template =`
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9149531285371942"
      crossorigin="anonymous"></script>
  <ins class="adsbygoogle"
      style="display:block"
      data-ad-format="fluid"
      data-ad-layout-key="-ed+6k-30-ac+ty"
      data-ad-client="ca-pub-9149531285371942"
      data-ad-slot="1909465585"></ins>
  <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
  </script>   
    `
    space.innerHTML = template;
    return space
}

const setNoResults = ()=>{
    var target = document.getElementsByClassName('job-display')[0]
    var display = document.createElement('div');
    display.className="no-results-disp";
    var dispImg = document.createElement('img');
    dispImg.setAttribute('src', 'images/noresultsfound.svg');
    dispImg.setAttribute('alt', 'Sorry we could not find this image');
    display.append(dispImg);
    var text = document.createElement('p');
    text.textContent = `Sorry, we couldn't find any jobs to match your search`;
    var seeAllBtn = document.createElement('button');
    seeAllBtn.setAttribute('type','button');
    seeAllBtn.textContent = "Search all jobs"
    seeAllBtn.addEventListener('click', ()=>{
        window.location.href = `/seejobs?q=&country=&sub_division=`
    })
    display.append(text);
    display.append(seeAllBtn)
    target.append(display);
    
}


const setModal = (positionData)=>{
    var data = JSON.parse(positionData);
    var modCompanyDisp, modCompanyImgDisp, modCompanyEmail, modCompanyPhone, modCompanyAddress

    var  backupImg = 'images/logo.svg'
    modCompanyDisp = document.getElementById('mod-offer-owner');
    modCompanyImgDisp = document.getElementById('mod-offer-owner-image');
    modCompanyEmail = document.getElementById('mod-offer-owner-email');
    modCompanyPhone = document.getElementById('mod-offer-owner-phone');
    modCompanyAddress = document.getElementById('mod-offer-owner-address');

    modCompanyDisp.textContent = data.company_name;
    if(data.company_logo.length <= 0){
        modCompanyImgDisp.setAttribute('src',backupImg);

    }else{
        modCompanyImgDisp.setAttribute('src',data.company_logo);
    }
    modCompanyImgDisp.setAttribute('alt',`This job is posted by ${data.company_name}`);
    modCompanyEmail.textContent = data.contact.email;
    modCompanyPhone.textContent = data.contact.phone;
    modCompanyAddress.textContent = data.contact.address;


    console.log(positionData)
}

export { setJobs }