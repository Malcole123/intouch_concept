
const jobautoSearch = (query)=>{
    fetch('/resources/alljobs.json').then(res => res.json())
    .then(data =>{
        for(let i = 0; i < data.length; i++ ){
            if(data[i].title.includes(query)){
                autocompConfigure(data[i].title);
            }else{
            }
        }
    })
}

var suggestSpace = document.getElementsByClassName('career-search-auto-complete')[0];
var searchInput = document.getElementById('career-search');
searchInput.addEventListener('keyup', ()=>{
    var query = searchInput.value;
    var querySan = query.toLowerCase()
    if(searchInput.value.length >=3){
        clearSuggest()
        jobautoSearch(querySan)
    }else{
    }
})

const autocompConfigure = (suggestion)=>{
    var suggestCard = document.createElement('div');
    suggestCard.className= "career-auto-suggest"
    var template = `
    <span>${suggestion.toUpperCase()}</span>
    <i class="fas fa-arrow-right"></i>
    `
    suggestCard.innerHTML = template;
    suggestCard.addEventListener('click', (event)=>{
        var career = event.currentTarget.textContent;
        searchInput.value =career.trim();
        suggestSpace.style.display = "none"
    })
    suggestSpace.append(suggestCard);
}
const clearSuggest = ()=>{
    suggestSpace.innerHTML=""
}


const fetchSubdivisions = (countryName)=>{
    fetch('/resources/countries.json').then(res => res.json())
    .then(data =>{
        for(let i = 0; i < data.length; i++ ){
           var dataCountry, searchCountry
           dataCountry = data[i].country.toUpperCase();
           searchCountry = countryName.toUpperCase();
           if(searchCountry === dataCountry){
                for(let j = 0; j < data[i].sub_divisions.length; j++){
                    setSubdivisions(data[i].sub_divisions[j])
                }
           }else{
               console.log('did nothing')
           }
        }
    })
}

const setSubdivisions = (sub_division)=>{
    var target = document.getElementById('where-select');
    var option = document.createElement('option');
    option.setAttribute('value', sub_division.id);
    option.textContent = sub_division.name;
    target.append(option)
}

