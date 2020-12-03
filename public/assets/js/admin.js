
test = null
/**
 * 
 * load page
 */
loadPage = function (pageID) {
    a = $(".navbar-nav li.active")
    for (i = 0; i < a.length; i++) a.eq(i).removeClass('active')
    $(pageID).addClass('active')
}

/**
 * 
 * init Table use dataTable
 */

modifyTable = function (tableID) {
    filter = $(tableID + "_filter")
    filter.find('label').addClass('form-group form-inline')
    filter.find("input").addClass('form-control ml-2')

    length = $(tableID + "_length")
    length.addClass('form-group form-inline')
    length.find("select").addClass('form-control ml-2 mr-2')
}

initTable = function (tableID, dataLink) {
    $(tableID).addClass('nowrap')
    $(tableID).DataTable({
        responsive: true,
        "destroy" : true,
        "ajax": {
            "url": BASEURL + dataLink,
            "type": "POST",
            "dataSrc": "data"
        },
        "initComplete": function (settings, json) {
            modifyTable(tableID)
        }
    });

}
/**
 * 
 * search
 */
$(document).ready(function () {
    tb_id = "#" + $("input.find").attr('tb_id')
    col = 0
    /**
     * 
     * find table
     */
    $("input.find").keyup(function () {
        col = $(this).parents(".find-input").find("option:selected").val()
        val = $(this).val()
        tb_id = "#" + $(this).attr('tb_id')

        $(tb_id).DataTable().column(col).search(val).draw()
        console.log(col+" "+val)
    })
    /**
     * 
     * select change
     */
    $("div.find-input select").change(function(){
        $(tb_id).DataTable().column(col).search('').draw()
        col = $(this).find("option:selected").val()
        val = $("input.find").val()
        
        $(tb_id).DataTable().column(col).search(val).draw()
        console.log(col+" "+val)
    })
})

$(document).ready(function () {
    //sizing logo
    $("#sidebarToggle, #sidebarToggleTop").on("click", function (e) {
        if ($("#logo").hasClass('pr-md-5 pl-md-5')) {
            $("#logo").toggleClass('pr-md-5 pl-md-5');
            $("#logo").toggleClass('pr-md-3 pl-md-3');
        }
    })
    $(window).resize(function () {
        if ($("ul.navbar-nav").hasClass("toggled") && $("#logo").hasClass('pr-md-5 pl-md-5')) {
            $("#logo").toggleClass('pr-md-5 pl-md-5');
            $("#logo").toggleClass('pr-md-3 pl-md-3');
        }
    });
    /**
     * 
     * user active/ disable
     */
    $(document).on('click', '#user_table .status', function () {
        if ($(this).text() == "ACTIVE") {
            link = "/admin/disableUser"
        } else {
            link = "/admin/activeUser"
        }
        status = false
        $.ajax({
            type: "POST",
            url: BASEURL + link,
            data: { 'Account': $(this).attr('account') },
            dataType: 'JSON'
        }).then(
            // resolve/success callback
            function (response) {
                if (response.status) {
                    status = true;
                }
            },
            // reject/failure callback
            function () {
                alert('There was some error!');
            }
        )
        if (status) {
            $("#user_table").DataTable().ajax.reload()
            a = $(".status")
            for (i = 0; i < a.length; i++) {
                if (a.eq(i).attr('account') == $(this).attr('account')) {
                    a.eq(i).toggleClass('btn-danger')
                    a.eq(i).toggleClass('btn-success')
                }
            }
        }
    })

    /**
     * 
     * 
     * warehouse active/disable
     */
    w_modify = null
    $(document).on('click', '#warehouse_table .status', function () {
        if ($(this).text() == "ACTIVE") {
            link = "/admin/disableWarehouse"
        } else {
            link = "/admin/activeWarehouse"
        }
        status = false
        $.ajax({
            type: "POST",
            url: BASEURL + link,
            data: { 'id': $(this).attr('id_w') },
            dataType: 'JSON'
        }).then(
            // resolve/success callback
            function (response) {
                if (response.status) {
                    status = true;
                }
            },
            // reject/failure callback
            function () {
                alert('There was some error!');
            }
        )
        if (status) {
            $("#warehouse_table").DataTable().ajax.reload()
            a = $(".status")
            for (i = 0; i < a.length; i++) {
                if (a.eq(i).attr('id_w') == $(this).attr('id_w')) {
                    a.eq(i).toggleClass('btn-success')
                    a.eq(i).toggleClass('btn-danger')
                    if (a.eq(i).text() == "ACTIVE") {
                        a.eq(i).parents('tr').find('button.modify').removeAttr('disabled')
                        a.eq(i).parents('tr').find('button.detail').removeAttr('disabled')
                    } else {
                        a.eq(i).parents('tr').find('button.modify').attr('disabled', 'true')
                        a.eq(i).parents('tr').find('button.detail').attr('disabled', 'true')
                    }
                }
            }
        }
    })
    /**
     * 
     * 
     * warehouse .modify
     */
    $(document).on('click', '#warehouse_table .modify', function () {
        w_id = $(this).attr('id_w')
        w_modify = $(this).parents('tbody').find('button.modify:hidden[id_w="' + w_id + '"]')
        if (w_modify.length < 1) {
            w_modify = $(this)
        }

        const data = {
            'name': w_modify.parents('tr').find('span.w-name').text(),
            'city': w_modify.parents('tr').find('span.w-city').text(),
            'province': w_modify.parents('tr').find('span.w-province').text(),
            'address': w_modify.parents('tr').find('span.w-address').text(),
        }

        $("#modify-warehouse .modal-body input.Name").val(data.name)
        $("#modify-warehouse .modal-body input.City").val(data.city)
        $("#modify-warehouse .modal-body input.Province").val(data.province)
        $("#modify-warehouse .modal-body input.Address").val(data.address)
    })

    $(document).on('click', '#w-save', function () {
        const data = {
            'id': w_modify.attr('id_w'),
            'name': $(".modal-body input.Name").val(),
            'city': $(".modal-body input.City").val(),
            'province': $(".modal-body input.Province").val(),
            'address': $(".modal-body input.Address").val(),
        }

        $.ajax({
            type: "POST",
            url: BASEURL + "/admin/saveWarehouse",
            data: data,
            dataType: 'JSON'
        }).then(
            // resolve/success callback
            function (response) {
                if (response.status) {
                    $("#warehouse_table").DataTable().ajax.reload()
                    $('#modify-warehouse').modal('toggle')
                }
            },
            // reject/failure callback
            function () {
                alert('There was some error!');
            }
        )
    })

    /**
     * 
     * warehouse detail
     */
    $(document).on('click', '#warehouse_table .detail', function () {
        id =  $(this).attr('id_w')
        initTable("#warehouse_detail_table", "/admin/detailsWarehouse/"+id)
    })

    /**
     * 
     * insert warehouse
     */
    $("#taokhohang").click(function () {
        $(".alert").remove()
        const data = {
            'name': $("input.Name").val(),
            'address': $("input.Address").val(),
            'city': $("input.City").val(),
            'province': $("input.Province").val(),
            'status': $("select.Status option:selected").val()
        }
        if (data.name == "")
            $("input.Name").addClass("is-invalid")
        else
            $("input.Name").removeClass("is-invalid")

        if (data.address == "")
            $("input.Address").addClass("is-invalid")
        else
            $("input.Address").removeClass("is-invalid")

        if (data.city == "")
            $("input.City").addClass("is-invalid")
        else
            $("input.City").removeClass("is-invalid")

        if (data.province == "")
            $("input.Province").addClass("is-invalid")
        else
            $("input.Province").removeClass("is-invalid")


        if (data.name != "" && data.address != "" && data.city != "" && data.province != "") {
            $.ajax({
                type: 'POST',
                url: BASEURL + '/admin/insertWarehouse',
                data: data,
                dataType: 'JSON'
            }).then(
                //success
                function (response) {
                    if (response.status == true) {
                        s = '<div class="alert alert-success text-center" role="alert">'
                        s += 'Thêm kho hàng thành công thành công!!'
                        s += '</div>'
                        $("#admin-navbar").after(s)
                    } else {
                        if(response.NameError != null) {
                            $("input.Name").addClass("is-invalid")
                            $(".NameError").html(response.NameError)
                        }
                        s = '<div class="alert alert-danger text-center" role="alert">'
                        s += 'Thêm kho hàng không thành công!!'
                        if (response.msg != null) s+= response.msg
                        s += '</div>'
                        $("#admin-navbar").after(s)
                    }
                    console.log(response)
                },
                //error
                function () {
                    alert('There was some error!');
                }
            )
        }
    })

    /**
     * 
     * 
     * type product active/disable
     */
    tp_modify = null
    $(document).on('click', '#type_product_table .status', function () {
        if ($(this).text() == "ACTIVE") {
            link = "/admin/disableTypeProduct"
        } else {
            link = "/admin/activeTypeProduct"
        }
        status = false
        console.log($(this).attr('id_tp'))
        $.ajax({
            type: "POST",
            url: BASEURL + link,
            data: { 'id': $(this).attr('id_tp') },
            dataType: 'JSON'
        }).then(
            // resolve/success callback
            function (response) {
                if (response.status) {
                    status = true;
                }
            },
            // reject/failure callback
            function () {
                alert('There was some error!');
            }
        )
        if (status) {
            $("#type_product_table").DataTable().ajax.reload()
            a = $(".status")
            for (i = 0; i < a.length; i++) {
                if (a.eq(i).attr('id_tp') == $(this).attr('id_tp')) {
                    a.eq(i).toggleClass('btn-success')
                    a.eq(i).toggleClass('btn-danger')
                    if (a.eq(i).text() == "ACTIVE") {
                        a.eq(i).parents('tr').find('button.modify').removeAttr('disabled')
                        a.eq(i).parents('tr').find('button.detail').removeAttr('disabled')
                    } else {
                        a.eq(i).parents('tr').find('button.modify').attr('disabled', 'true')
                        a.eq(i).parents('tr').find('button.detail').attr('disabled', 'true')
                    }
                }
            }
        }
    })
    /**
     * 
     * 
     * type product .modify
     */
    $(document).on('click', '#type_product_table .modify', function () {
        tp_id = $(this).attr('id_tp')
        tp_modify = $(this).parents('tbody').find('button.modify:hidden[id_tp="' + tp_id + '"]')
        if (tp_modify.length < 1) {
            tp_modify = $(this)
        }

        const data = {
            'name': tp_modify.parents('tr').find('span.tp-name').text(),
            'category': tp_modify.parents('tr').find('span.tp-category').attr('id_category')
        }
        console.log(data)
        $("#modify-type-product .modal-body input.Name").val(data.name)
        $("#modify-type-product .modal-body select.Category option[value='"+data.category+"']").attr('selected','true')
    })

    $(document).on('click', '#tp-save', function () {
        const data = {
            'id': tp_modify.attr('id_tp'),
            'name': $(".modal-body input.Name").val(),
            'id_category': $(".modal-body select.Category option:selected").val()
        }

        console.log(data)

        $.ajax({
            type: "POST",
            url: BASEURL + "/admin/saveTypeProduct",
            data: data,
            dataType: 'JSON'
        }).then(
            // resolve/success callback
            function (response) {
                if (response.status) {
                    $("#type_product_table").DataTable().ajax.reload()
                    $('#modify-type-product').modal('toggle')
                }
            },
            // reject/failure callback
            function () {
                alert('There was some error!');
            }
        )
    })
    
    /**
     * 
     * insert type product
     */
    $("#taoloaisp").click(function () {
        $(".alert").remove()
        const data = {
            'name': $("input.Name").val(),
            'status': $("select.Status option:selected").val(),
            'id_category' : $("select.Category option:selected").val()
        }
        if (data.name == "")
            $("input.Name").addClass("is-invalid")
        else
            $("input.Name").removeClass("is-invalid")

        if (data.name != "") {
            $.ajax({
                type: 'POST',
                url: BASEURL + '/admin/insertTypeProduct',
                data: data,
                dataType: 'JSON'
            }).then(
                //success
                function (response) {
                    if (response.status == true) {
                        s = '<div class="alert alert-success text-center" role="alert">'
                        s += 'Thêm loại sản phẩm thành công thành công!!'
                        s += '</div>'
                        $("#admin-navbar").after(s)
                    } else {
                        if(response.NameError != null) {
                            $("input.Name").addClass("is-invalid")
                            $(".NameError").html(response.NameError)
                        }
                        s = '<div class="alert alert-danger text-center" role="alert">'
                        s += 'Thêm loại sản phẩm không thành công!!'
                        if (response.msg != null) s+= response.msg
                        s += '</div>'
                        $("#admin-navbar").after(s)
                    }
                    console.log(response)
                },
                //error
                function () {
                    alert('There was some error!');
                }
            )
        }
    })


    /**
     * 
     * 
     * product active/disable
     */
    w_modify = null
    $(document).on('click', '#product_table .status', function () {
        if ($(this).text() == "ACTIVE") {
            link = "/admin/disableProduct"
        } else {
            link = "/admin/activeProduct"
        }
        status = false
        $.ajax({
            type: "POST",
            url: BASEURL + link,
            data: { 'id': $(this).attr('id_p') },
            dataType: 'JSON'
        }).then(
            // resolve/success callback
            function (response) {
                if (response.status) {
                    status = true;
                }
            },
            // reject/failure callback
            function () {
                alert('There was some error!');
            }
        )
        if (status) {
            $("#product_table").DataTable().ajax.reload()
            a = $(".status")
            for (i = 0; i < a.length; i++) {
                if (a.eq(i).attr('id_w') == $(this).attr('id_p')) {
                    a.eq(i).toggleClass('btn-success')
                    a.eq(i).toggleClass('btn-danger')
                    if (a.eq(i).text() == "ACTIVE") {
                        a.eq(i).parents('tr').find('button.modify').removeAttr('disabled')
                        a.eq(i).parents('tr').find('button.detail').removeAttr('disabled')
                    } else {
                        a.eq(i).parents('tr').find('button.modify').attr('disabled', 'true')
                        a.eq(i).parents('tr').find('button.detail').attr('disabled', 'true')
                    }
                }
            }
        }
    })
    /**
     * 
     * 
     * product .modify
     */
    $(document).on('click', '#product_table .modify', function () {
        w_id = $(this).attr('id_w')
        w_modify = $(this).parents('tbody').find('button.modify:hidden[id_w="' + w_id + '"]')
        if (w_modify.length < 1) {
            w_modify = $(this)
        }

        const data = {
            'name': w_modify.parents('tr').find('span.w-name').text(),
            'city': w_modify.parents('tr').find('span.w-city').text(),
            'province': w_modify.parents('tr').find('span.w-province').text(),
            'address': w_modify.parents('tr').find('span.w-address').text(),
        }

        $("#modify-product .modal-body input.Name").val(data.name)
        $("#modify-product .modal-body input.City").val(data.city)
        $("#modify-product .modal-body input.Province").val(data.province)
        $("#modify-product .modal-body input.Address").val(data.address)
    })

    $(document).on('click', '#w-save', function () {
        const data = {
            'id': w_modify.attr('id_w'),
            'name': $(".modal-body input.Name").val(),
            'city': $(".modal-body input.City").val(),
            'province': $(".modal-body input.Province").val(),
            'address': $(".modal-body input.Address").val(),
        }

        $.ajax({
            type: "POST",
            url: BASEURL + "/admin/saveWarehouse",
            data: data,
            dataType: 'JSON'
        }).then(
            // resolve/success callback
            function (response) {
                if (response.status) {
                    $("#warehouse_table").DataTable().ajax.reload()
                    $('#modify-warehouse').modal('toggle')
                }
            },
            // reject/failure callback
            function () {
                alert('There was some error!');
            }
        )
    })

    /**
     * 
     * product detail
     */
    $(document).on('click', '#warehouse_table .detail', function () {
        id =  $(this).attr('id_w')
        initTable("#warehouse_detail_table", "/admin/detailsWarehouse/"+id)
    })
})




/*!
 * Start Bootstrap - SB Admin 2 v4.1.3 (https://startbootstrap.com/theme/sb-admin-2)
 * Copyright 2013-2020 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin-2/blob/master/LICENSE)
 */

!function (s) { "use strict"; s("#sidebarToggle, #sidebarToggleTop").on("click", function (e) { s("body").toggleClass("sidebar-toggled"), s(".sidebar").toggleClass("toggled"), s(".sidebar").hasClass("toggled") && s(".sidebar .collapse").collapse("hide") }), s(window).resize(function () { s(window).width() < 768 && s(".sidebar .collapse").collapse("hide"), s(window).width() < 480 && !s(".sidebar").hasClass("toggled") && (s("body").addClass("sidebar-toggled"), s(".sidebar").addClass("toggled"), s(".sidebar .collapse").collapse("hide")) }), s("body.fixed-nav .sidebar").on("mousewheel DOMMouseScroll wheel", function (e) { if (768 < s(window).width()) { var o = e.originalEvent, l = o.wheelDelta || -o.detail; this.scrollTop += 30 * (l < 0 ? 1 : -1), e.preventDefault() } }), s(document).on("scroll", function () { 100 < s(this).scrollTop() ? s(".scroll-to-top").fadeIn() : s(".scroll-to-top").fadeOut() }), s(document).on("click", "a.scroll-to-top", function (e) { var o = s(this); s("html, body").stop().animate({ scrollTop: s(o.attr("href")).offset().top }, 1e3, "easeInOutExpo"), e.preventDefault() }) }(jQuery);