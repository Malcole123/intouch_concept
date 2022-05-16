
const jobautoSearch = ()=>{
    fetch('/resources/alljobs.json').then(res => res.json())
    .then(data =>{
        for(let i = 0; i < data.length; i++ ){
            autoCompleteJS.data.src.push(data[i].title)
        }
    })
}

const autoCompleteJS = new autoComplete({
    placeholder: 'Search for food...',
    data:{
      src:[]
    },
    resultItem:{
      highlight:{
        render:true
      }
    },
    submit:true,

 });

document.querySelector("#autoComplete").addEventListener("selection", function (event) {
    // "event.detail" carries the autoComplete.js "feedback" object
    console.log(event.detail);
    var detail = event.detail;
    event.currentTarget.value = detail.selection.value;
    window.location.href = `/main/seejobs?q=${detail.selection.value}&country=&sub_division=`
});




 window.addEventListener('load', ()=>{
     jobautoSearch()
 })




