

function main(){
    var $menuBtn = $('.menu-toggle');
    var $menuTp = $('#menu-top');
    var $menuBtm = $('#menu-btm')
    var $menuTxt = $('#menu-txt')
    var $navMenu = $('.nav-links');
    var $searchInput = $('#career-search');
    var $filterBtn = $('.filter-toggle');
    var $filtermenu = $('.filter-search-card');
    var $suggestion = $('.career-auto-suggest');


    $menuBtn.on('click', ()=>{
        $menuTp.toggleClass('open-top');
        $menuBtm.toggleClass('open-bottom');
        $menuTxt.toggleClass('open-text');
        $navMenu.toggleClass('open-menu')
        $('.search-field').toggle()
    })
    var $compNavBtn = $('.company-dropdown')
    $compNavBtn.on('click', ()=>{
        $('.comp-dropdown-content').toggle()
    })

    $(window).on('scroll', ()=>{
        var currPos = $(window).scrollTop();
        if(currPos > 10 ){
            $('nav').addClass('scroll-nav');
        }else{
            $('nav').removeClass('scroll-nav')
        }
        if(currPos < 100){
            $('.horizontal-ad-space').addClass('show-space');
            $('.scroll-top-action').hide()
        }else{
            $('.horizontal-ad-space').removeClass('show-space');
            $('.scroll-top-action').show()
        }
    }).on('resize', ()=>{
        var windowSize = $(window).width()
        var maxSize = 1020;
        if(windowSize > maxSize){
            $('#where-select').show();
            $('#searchJobsBtn').show()
        }
    }).on('load', ()=>{
        fetchSubdivisions("Jamaica")
    })

    $searchInput.on('focus', ()=>{
        $('#where-select').show();
        $('#searchJobsBtn').show()
    }).on('blur', (e)=>{
        var windowSize = $(window).width()
        var charCount = $searchInput.val();
        if(charCount.length > 0){
            $('#where-select').show();
        }else if(windowSize < 1020 && charCount.length <= 0){
            $('#where-select').hide();
            $('#searchJobsBtn').hide()
        }
    }).on('keyup', ()=>{
        var charCount = $searchInput.val();
        if(charCount.length >= 3){
            $('.career-search-auto-complete').show();
            $('#searchJobs').show()
        }else{
            $('.career-search-auto-complete').hide()
 
        }
    })

    $('#searchJobsBtn').on('click', ()=>{
        var query = $searchInput.val();
        var country = "Jamaica";
        var sub_division = $('#where-select').val()
        window.location.href = `/main/seejobs?q=${query}&country=${country}&sub_division=${sub_division}`
    })
    
    $filterBtn.on('click', ()=>{
        $filtermenu.toggleClass('view-filters')
    })

    $('.scroll-top-action').on('click', ()=>{
        $(window).scrollTop(0)
    })


}

$(document).ready(main)