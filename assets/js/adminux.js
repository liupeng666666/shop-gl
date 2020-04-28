/*!
 * Adminux (http://maxartkiller.com)
 * Copyright 2017 The Adminux Author: Maxartkiller
 * purchase licence before use
 * You can not resale and/or modify without prior licences.
*/

"use strict";

$(document).on("ready", function () {
    /*LAYOUT CONTENT SCRIPT*/
    var body_1 = $('body');


    if (body_1.hasClass("scroll_header") === true) {
        $(window).on("scroll", function () {
            if ($(document).scrollTop() >= 250) {
                body_1.addClass("active_scroll");
            } else {
                body_1.removeClass("active_scroll");
            }
        });
    }


    $(window).on("load", function () {

        /*cicular progress sidebar home page */
        $('.progress_profile').circleProgress({
            fill: {gradient: ["#2ec7cb", "#6c8bef"]},
            lineCap: 'butt'
        });

        /* Sparklines can also take their values from the first argument   passed to the sparkline() function */
        var myvalues = [10, 8, 5, 7, 4, 2, 8, 10, 8, 5, 6, 4, 1, 7, 4, 5, 8, 10, 8, 5, 6, 4, 4];
        $('.dynamicsparkline').sparkline(myvalues, {
            type: 'bar',
            width: '100px',
            height: '20',
            barColor: '#cccccc',
            barWidth: '2',
            barSpacing: 2
        });

        var myvalues2 = [10, 8, 5, 7, 4, 2, 8, 10, 8, 5, 6, 4, 1, 7, 4, 5, 8, 10, 8, 5, 6, 4, 4, 1, 7, 4, 5, 8, 10, 8, 5, 6, 4, 4];
        $('.dynamicsparkline2').sparkline(myvalues2, {
            type: 'bar',
            width: '200px',
            height: '60',
            barColor: '#cccccc',
            barWidth: '3',
            barSpacing: 3
        });


        /*Full screen result container show*/
        $('#search_header').on('focus', function () {
            $(".search-block").show();
            body_1.addClass('searchshow');
            $('#search_header').focusout();

        });

        /* Search window screen fullscreen open */
        $('.search-block .close-btn').on('click', function () {
            $(".search-block").slideUp();
            body_1.removeClass('searchshow');
        });

        /* on keypress hide search block which was in fullscreen */
        $(document).keyup(function (e) {
            if (e.keyCode == 27) { // escape key maps to keycode `27`
                $(".search-block").fadeOut();
                body_1.removeClass('searchshow');
                $('#search_header').focusout();
            }
        });

        /* inbox mail page  collapsible */
        $(".inboxmenu").on("click", function () {
            $(".mailboxnav ").toggleClass("mailboxnavopen");
        });
        $(".filemenu_btn").on("click", function () {
            $(".filemenu ").toggleClass("filemenuopen");
        });

        /* menu  collapsible */
        $(".menu-collapse").on("click", function () {
            body_1.toggleClass("menuclose");
        });
        $(".menu-collapse-right").on("click", function () {
            body_1.toggleClass("menuclose-right");
        });
        $(".menu-small").on("click", function () {
            body_1.toggleClass("menusmall");
        });

        /* loading screen */
        $(".loader_wrapper").fadeOut("slow");

    });
    /* Custom css checkbox script */
    $('.form-check-input').on('change', function () {
        $(this).parent().toggleClass("active")
        $(this).closest(".media").toggleClass("active");
    });

    /* Card fullscreeen button script */
    $('.fullscreen-btn').on('click', function () {
        $(this).closest(".full-screen-container").toggleClass("fullscreen");
        body_1.toggleClass("fullscreen");
    });


    /* Card fullscreeen button script */
    $('.push-cookie .alert.top .close, .push-cookie .alert.top .btn-secondary').on('click', function () {
        body_1.removeClass("push-cookie");
    });


    /* Resposnsive Utility hide menu */
    if ($(window).width() >= 1440 && body_1.hasClass("no-menu-show") != true) {
        if (body_1.hasClass("left-menu-only") === true) {
            body_1.removeClass('menuclose');
        } else {
            body_1.removeClass('menuclose ');
        }
    } else {
        if (body_1.hasClass("left-menu-only") === true) {
            body_1.addClass('menuclose');
        } else {
            body_1.addClass('menuclose ');
        }

        // This script is for body click hide menu //
        $(document).on('click', function (event) {
            if (event.target.className !== ".menu-collapse,.menu-collapse-right, .sidebar-left,.sidebar-right") {
                body_1.addClass('menuclose menuclose-right');
            }
        });
        $('.menu-collapse,.menu-collapse-right, .sidebar-left,.sidebar-right').on('click', function (event) {
            event.stopPropagation();
        });
        $('.dropdown-toggle,[data-toggle="dropdown"],.userprofile').dropdown();
        // This script is for body click ends here //        
    }
    $('.dropdown-toggle,[data-toggle="dropdown"],.userprofile').dropdown();

    $(window).on('resize', function () {
        if ($(window).width() >= 1440 && body_1.hasClass("no-menu-show") != true) {
            body_1.removeClass('menuclose ');
        } else {
            body_1.addClass('menuclose menuclose-right');
        }
    });


});

