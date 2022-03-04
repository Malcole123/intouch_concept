

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

    $('.act-btn').on('click',(e)=>{
        $(e.currentTarget).toggleClass('button-active')
    })

    $('.switch__outer').on('click',(e)=>{
        $(e.currentTarget).toggleClass('toggled');
    })


    $('#filter__init-call').on('click', ()=>{
        $('.filter-list').toggleClass('show-filter-menu')
    })
    $('#filter__init-dismiss').on('click', ()=>{
        $('.filter-list').toggleClass('show-filter-menu')
    })

    $('._alert').on('click', (event)=>{
      $('#nav_alert').toggle();
      $('#nav_me').hide()
    }).on('mouseenter', ()=>{
        $('#nav_alert').fadeIn();
        $('#nav_me').hide()
    })
    $('._me').on('click', (event)=>{
        $('#nav_me').toggle()
        $('#nav_alert').hide();
    }).on('mouseenter',()=>{
        $('#nav_me').fadeIn();
        $('#nav_alert').hide()
    })

    $('#nav_alert').on('mouseleave',()=>{
       $('#nav_alert').fadeOut();
    }).on('mouseenter',()=>{
        $('#nav_alert').show();
    })

    $('#nav_me').on('mouseleave',()=>{
        $('#nav_me').fadeOut()
    }).on('mouseenter',()=>{
        $('#nav_me').show()
    })
    $('#nav-search_button').on('click',()=>{
        $('.search-field').toggle();
        $('.search-nav-links').toggle();
        $('#search-page-nav-logo').toggle();
        $('.focus___overlay').show()
    })

    $('.focus___overlay').on('click',()=>{
        $('.focus___overlay').hide()
        if($(window).width() <= 1020){
            $('.search-field').hide();
            $('#search-page-nav-logo').show();
            $('.search-nav-links').show();
        }else{

        }
    })
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
            $('.navbar').addClass('scroll-nav');
            $('.navbar').addClass('bg-dark');
            $('.navbar').removeClass('sticky-top');
            $('.navbar').addClass('fixed-top');
            $('nav').addClass('scroll-nav');
            if($(window).width() <= 1020){
                $('#search-page-nav-logo').fadeIn();
            }
        }else{
            $('.navbar').removeClass('scroll-nav');
            $('.navbar').removeClass('bg-dark');
            $('.navbar').removeClass('fixed-top');
            $('.navbar').addClass('sticky-top');
            $('nav').removeClass('scroll-nav'); /*search page, */
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
            $('#search-page-nav-logo').show();
            $('#where-select').show();
            $('#searchJobsBtn').show();
            $('.search-field').show();
            $('.search-nav-links').show();
        }
    }).on('load', ()=>{
        if(!window.location.href.includes('postajob')){
            fetchSubdivisions("Jamaica");
        }
        var windowSize = $(window).width()
        var maxSize = 1020;
        if(windowSize > maxSize){
            $('#where-select').show();
            $('#searchJobsBtn').show();
            $('#search-page-nav-logo').show();
            $('.search-nav-links').show();
            $('.search-field').show();
        }
    })

    $searchInput.on('focus', ()=>{
        $('#where-select').show();
        $('#searchJobsBtn').show();
    }).on('blur', (e)=>{
    }).on('keyup', ()=>{
        var charCount = $searchInput.val();
        if(charCount.length >= 3){
            $('.career-search-auto-complete').show();
            $('#searchJobs').show();
        }else{
            $('.career-search-auto-complete').hide();
        }
    })

    $('#searchJobsBtn').on('click', ()=>{
        var query = $searchInput.val();
        var country = "";
        var sub_division = $('#where-select').val()
        window.location.href = `/main/seejobs?q=${query}&country=${country}&sub_division=${sub_division}`;
        $('#search-page-nav-logo').show()
    })
    
}

$(document).ready(main)