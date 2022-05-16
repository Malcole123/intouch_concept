const profControll = new Vue({
    el:'.company__profile__main',
    data:{
        
    },
    methods:{
        j_u_create:(title,id,country,sub_div)=>{
            return `/main/seejobs?q=${title}&country=${country}&sub_division=${sub_div}&view=${id}`
        }
    }
})

document.querySelector("#autoComplete").addEventListener("selection", function (event) {
    // "event.detail" carries the autoComplete.js "feedback" object
    var detail = event.detail;
    event.currentTarget.value = detail.selection.value;
    window.location.href = `/main/seejobs?q=${detail.selection.value}&country=&sub_division=`
});

const page =()=>{
    $(window).on('scroll',()=>{
        if($(window).scrollTop() > 339){
            $('.company__profile__nav').addClass('stick___nav')
        }else{
            $('.company__profile__nav').removeClass('stick___nav')
    
        }
    })

    $('#leftScrollPosComp').on('click',()=>{
        var curr = $('#positionsCarousel').scrollLeft()
        var width = $('.__carousel__outer').width();
        $('#positionsCarousel').scrollLeft(curr -= (width+35))
    })

    $('#rightScrollPosComp').on('click',()=>{
        var curr = $('#positionsCarousel').scrollLeft()
        var width = $('.__carousel__outer').width();
        $('#positionsCarousel').scrollLeft(curr += (width+35))
    })

    $('#leftScrollGallComp').on('click',()=>{
        var curr = $('#galleryCarousel').scrollLeft()
        var width = $('.__carousel__outer').width();
        $('#galleryCarousel').scrollLeft(curr -= (width+35))
    });

    $('#rightScrollGallComp').on('click',()=>{
        var curr = $('#galleryCarousel').scrollLeft()
        var width = $('.__carousel__outer').width();
        $('#galleryCarousel').scrollLeft(curr += (width+35))

    })
 
}


var target_observe_list = document.querySelectorAll(".__card")
var options = {
    rootMargin: '20px',
    threshold:0.95
}
  
  var scrollCallback = function(entries, observer) {
      entries.forEach((entry)=>{
          var nav = document.querySelectorAll('.__p__nav_link');
          var navArr = []
          for(let i = 0; i < nav.length; i++){

          }
            if(entry.isIntersecting){
                var id = entry.target.id;
                for(let i = 0; i < nav.length; i++){
                    var h = nav[i].children[1].getAttribute('href');
                    if(h.replace('#','')===id){
                        nav[i].classList = "__p__nav_link __active"
                    }else{
                        nav[i].classList = "__p__nav_link" 
                    }
                }
            }
      })
  };
  
  var observer = new IntersectionObserver(scrollCallback, options);

  target_observe_list.forEach((target_observe)=>{
        observer.observe(target_observe);
  })




$(document).ready(page)