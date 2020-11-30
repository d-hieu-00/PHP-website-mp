const BASEURL = "http://localhost/-website-mp"
$(document).ready(function(){
    $("#sidebarToggle, #sidebarToggleTop").on("click",function(e){
        $("#logo").toggleClass('pr-5 pl-5');
        $("#logo").toggleClass('pr-3 pl-3');
    })
    /**
     * 
     * user active/ disable
     */
    $(document).on('click','#user_table .status', function(){
        if($(this).text()=="ACTIVE"){
            link = "/admin/disableUser"
        } else {
            link = "/admin/activeUser"
        }
        status = false
        $.ajax({
            type: "POST",
            url: BASEURL+link,
            data: {'Account': $(this).attr('account')},
            dataType : 'JSON'
        }).then(
            // resolve/success callback
            function(response) {
                if(response.status)
                    status = true;
            },
            // reject/failure callback
            function() {
                alert('There was some error!');
            }
        )
        if(status){
            if($(this).text()=="ACTIVE"){
                a = $(".status")
                for(i=0; i<a.length; i++){
                    if(a.eq(i).attr('account')==$(this).attr('account')){
                        a.eq(i).removeClass('btn-success')
                        a.eq(i).addClass('btn-danger')
                        a.eq(i).text('DISABLE')
                    }
                }
            } else {
                a = $(".status")
                for(i=0; i<a.length; i++){
                    if(a.eq(i).attr('account')==$(this).attr('account')){
                        a.eq(i).removeClass('btn-danger')
                        a.eq(i).addClass('btn-success')
                        a.eq(i).text('ACTIVE')
                    }
                }
            }
        }
    })

    /**
     * 
     * 
     * warehouse active/disable
     */
    $(document).on('click','#warehouse_table .status', function(){
        if($(this).text()=="ACTIVE"){
            link = "/admin/disableWarehouse"
        } else {
            link = "/admin/activeWarehouse"
        }
        status = false
        $.ajax({
            type: "POST",
            url: BASEURL+link,
            data: {'id': $(this).attr('id_w')},
            dataType : 'JSON'
        }).then(
            // resolve/success callback
            function(response) {
                if(response.status)
                    status = true;
            },
            // reject/failure callback
            function() {
                alert('There was some error!');
            }
        )
        if(status){
            if($(this).text()=="ACTIVE"){
                a = $(".status")
                for(i=0; i<a.length; i++){
                    if(a.eq(i).attr('id_w')==$(this).attr('id_w')){
                        a.eq(i).removeClass('btn-success')
                        a.eq(i).addClass('btn-danger')
                        a.eq(i).text('DISABLE')
                        a.eq(i).parents('tr').find('button.modify').attr('disabled','true')
                    }
                }
            } else {
                a = $(".status")
                for(i=0; i<a.length; i++){
                    if(a.eq(i).attr('id_w')==$(this).attr('id_w')){
                        a.eq(i).removeClass('btn-danger')
                        a.eq(i).addClass('btn-success')
                        a.eq(i).text('ACTIVE')
                        a.eq(i).parents('tr').find('button.modify').removeAttr('disabled')
                    }
                }
            }
        }
    })
})




/*!
 * Start Bootstrap - SB Admin 2 v4.1.3 (https://startbootstrap.com/theme/sb-admin-2)
 * Copyright 2013-2020 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin-2/blob/master/LICENSE)
 */

!function(s){"use strict";s("#sidebarToggle, #sidebarToggleTop").on("click",function(e){s("body").toggleClass("sidebar-toggled"),s(".sidebar").toggleClass("toggled"),s(".sidebar").hasClass("toggled")&&s(".sidebar .collapse").collapse("hide")}),s(window).resize(function(){s(window).width()<768&&s(".sidebar .collapse").collapse("hide"),s(window).width()<480&&!s(".sidebar").hasClass("toggled")&&(s("body").addClass("sidebar-toggled"),s(".sidebar").addClass("toggled"),s(".sidebar .collapse").collapse("hide"))}),s("body.fixed-nav .sidebar").on("mousewheel DOMMouseScroll wheel",function(e){if(768<s(window).width()){var o=e.originalEvent,l=o.wheelDelta||-o.detail;this.scrollTop+=30*(l<0?1:-1),e.preventDefault()}}),s(document).on("scroll",function(){100<s(this).scrollTop()?s(".scroll-to-top").fadeIn():s(".scroll-to-top").fadeOut()}),s(document).on("click","a.scroll-to-top",function(e){var o=s(this);s("html, body").stop().animate({scrollTop:s(o.attr("href")).offset().top},1e3,"easeInOutExpo"),e.preventDefault()})}(jQuery);