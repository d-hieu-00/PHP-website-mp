
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
        "destroy": true,
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
loadInsertP = function () {
    $.ajax({
        type: "POST",
        url: BASEURL + "/admin/getTypeProductForTagSelect",
        dataType: 'JSON'
    }).then(
        // resolve/success callback
        function (response) {
            if (response.status) {
                $("select.Type-product option").remove()
                s = ""
                for (i = 0; i < response.data.length; i++) {
                    s += '<option value="' + response.data[i][0] + '">' + response.data[i][1] + '</option>'
                }
                $("select.Type-product").append(s)
            }
        },
        // reject/failure callback
        function () {
            alert('There was some error tp!');
        }
    )

    $.ajax({
        type: "POST",
        url: BASEURL + "/admin/getWarehouseForTagSelect",
        dataType: 'JSON'
    }).then(
        // resolve/success callback
        function (response) {
            if (response.status) {
                p = $("div.form-row")
                $("button.AddWarehouse").removeAttr('disabled')
                for (i = 1; i < p.length; i++) p.eq(i).remove()

                $("select.Warehouse option").remove()
                s = ""
                for (i = 0; i < response.data.length; i++) {
                    s += '<option value="' + response.data[i][0] + '">' + response.data[i][1] + '</option>'
                }
                $("select.Warehouse").append(s)
            }
        },
        // reject/failure callback
        function () {
            alert('There was some error whd!');
        }
    )
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
        console.log(col + " " + val)
    })
    /**
     * 
     * select change
     */
    $("div.find-input select").change(function () {
        $(tb_id).DataTable().column(col).search('').draw()
        col = $(this).find("option:selected").val()
        val = $("input.find").val()

        $(tb_id).DataTable().column(col).search(val).draw()
        console.log(col + " " + val)
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
        id = $(this).attr('id_w')
        initTable("#warehouse_detail_table", "/admin/detailsWarehouse/" + id)
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
                        if (response.NameError != null) {
                            $("input.Name").addClass("is-invalid")
                            $(".NameError").html(response.NameError)
                        }
                        s = '<div class="alert alert-danger text-center" role="alert">'
                        s += 'Thêm kho hàng không thành công!!'
                        if (response.msg != null) s += response.msg
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
                    } else {
                        a.eq(i).parents('tr').find('button.modify').attr('disabled', 'true')
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
        $("#modify-type-product .modal-body select.Category option[value='" + data.category + "']").attr('selected', 'true')
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
            'id_category': $("select.Category option:selected").val()
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
                        if (response.NameError != null) {
                            $("input.Name").addClass("is-invalid")
                            $(".NameError").html(response.NameError)
                        }
                        s = '<div class="alert alert-danger text-center" role="alert">'
                        s += 'Thêm loại sản phẩm không thành công!!'
                        if (response.msg != null) s += response.msg
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
                    } else {
                        a.eq(i).parents('tr').find('button.modify').attr('disabled', 'true')
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
    function readURL(input) {
        if (input.files && input.files[0]) {
            reader = new FileReader();
            reader.onload = function (e) {
                $('img#img-product').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("input#Img").change(function () {
        readURL(this);
    });
    p_modify = null
    $(document).on('click', 'button.AddWarehouse', function () {
        p = $(this).parents('.form-row')
        s = p.html()
        len = $(".form-row").length
        len_o = $("select#Warehouse:first option").length
        if (len <= len_o) {
            s = s.replace('<button class="AddWarehouse btn btn-success" type="button"><i class="fas fa-plus"></i></button>',
                '<button class="RemoveWarehouse btn btn-danger" type="button"><i class="fas fa-times"></i></button>')
            s = '<div class="form-row form-group">' + s + '</div>'
            p.after(s)
        }
        if (len + 1 == len_o) {
            $(this).attr('disabled', 'true')
        }
    })
    $(document).on('click', 'button.RemoveWarehouse', function () {
        p = $(this)
        wd = [p_modify.attr('id_p'),
        $(this).parents('.form-row').find("option:selected").val()]
        const data = {
            'warehouse': wd
        }
        $.ajax({
            type: "POST",
            url: BASEURL + "/admin/deleteWarehouseDetail",
            data: data,
            dataType: 'JSON'
        }).then(
            // resolve/success callback
            function (response) {
                if (response.status == true) {
                    p.parents('.form-row').remove()
                    $("button.AddWarehouse").removeAttr('disabled')
                }
            },
            // reject/failure callback
            function () {
                alert('Không thể xóa kho!');
            }
        )
    })
    $(document).on('focus', 'select.Warehouse', function () {
        $(this).data('lastValue', $(this).val());
    });
    $(document).on('change', 'select.Warehouse', function () {
        var lastRole = $(this).data('lastValue');
        p = $("div.form-row")
        w = []
        for (i = 0; i < p.length; i++) {
            w.push(p.eq(i).find("option:selected").val())
            if (i != 0) {
                if (w[i - 1] == w[i]) {
                    alert("Lỗi: kho đã tồn tại")
                    $(this).val(lastRole);
                    return false;
                }
            }
        }

    })
    $(document).on('click', '#product_table .modify', function () {
        p_id = $(this).attr('id_p')
        p_modify = $(this)
        const data = {
            'id': p_id
        }
        $("input#Img").val('')
        TypeProduct = null
        /**
         * 
         * get product
         */
        $.ajax({
            type: "POST",
            url: BASEURL + "/admin/getOneProduct",
            data: data,
            dataType: 'JSON'
        }).then(
            // resolve/success callback
            function (response) {
                $("input#Name").val(response.data['name'])
                $("input#Brand").val(response.data['brand'])
                $("input#Color").val(response.data['color'])
                $("input#Price").val(response.data['price'])
                if (response.data['img'] != null) {
                    $("img#img-product").attr('src', response.data['img'])
                }
                $("input#Short-Description").val(response.data['short_discription'])
                $("textarea#Description").val(response.data['discription'])
                TypeProduct = response.data['id_type']
            },
            // reject/failure callback
            function () {
                alert('There was some error p!');
            }
        )

        $.ajax({
            type: "POST",
            url: BASEURL + "/admin/getTypeProductForTagSelect",
            dataType: 'JSON'
        }).then(
            // resolve/success callback
            function (response) {
                if (response.status) {
                    $("select.Type-product option").remove()
                    s = ""
                    for (i = 0; i < response.data.length; i++) {
                        s += '<option value="' + response.data[i][0] + '">' + response.data[i][1] + '</option>'
                    }
                    $("select.Type-product").append(s)
                    $("select.Type-product option[value='" + TypeProduct + "'").attr('selected', 'true')
                }
            },
            // reject/failure callback
            function () {
                alert('There was some error tp!');
            }
        )
        Warehouse = null
        $.ajax({
            type: "POST",
            url: BASEURL + "/admin/getWarehouseByIdProduct",
            data: data,
            dataType: 'JSON'
        }).then(
            // resolve/success callback
            function (response) {
                if (response.status) {
                    Warehouse = response.data
                    $("input.Quantity").val(0)
                    $.ajax({
                        type: "POST",
                        url: BASEURL + "/admin/getWarehouseForTagSelect",
                        dataType: 'JSON'
                    }).then(
                        // resolve/success callback
                        function (response) {
                            if (response.status) {
                                p = $("div.form-row")
                                $("button.AddWarehouse").removeAttr('disabled')
                                for (i = 1; i < p.length; i++) p.eq(i).remove()

                                $("select.Warehouse option").remove()
                                s = ""
                                for (i = 0; i < response.data.length; i++) {
                                    s += '<option value="' + response.data[i][0] + '">' + response.data[i][1] + '</option>'
                                }
                                $("select.Warehouse").append(s)

                                p = $("div.form-row")
                                s = p.html()
                                s = s.replace('<button class="AddWarehouse btn btn-success" type="button"><i class="fas fa-plus"></i></button>',
                                    '<button class="RemoveWarehouse btn btn-danger" type="button"><i class="fas fa-times"></i></button>')
                                len_o = $("select#Warehouse:first option").length
                                if (len_o == Warehouse.length) $("button.AddWarehouse").attr('disabled', 'true')
                                for (i = 0; i < Warehouse.length; i++) {
                                    if (i == 0) {
                                        p.find("option[value='" + Warehouse[0].id_warehouse + "'").attr('selected', 'true')
                                        p.find("input#Quantity").val(Warehouse[0].quantity)
                                    } else {
                                        a = '<div class="form-row form-group" r_wh="' + i + '">' + s + '</div>'
                                        p.after(a)
                                        $("div.form-row[r_wh='" + i + "']").find("option[value='" + Warehouse[i].id_warehouse + "'").attr('selected', 'true')
                                        $("div.form-row[r_wh='" + i + "']").find("input#Quantity").val(Warehouse[i].quantity)
                                    }
                                }
                            }
                        },
                        // reject/failure callback
                        function () {
                            alert('There was some error whd!');
                        }
                    )
                }
            },
            // reject/failure callback
            function () {
                alert('There was some error wh!');
            }
        )
    })

    $(document).on('click', '#p-save', function () {
        id = p_modify.attr('id_p')
        p = $("div.form-row")
        w = []
        for (i = 0; i < p.length; i++) {
            w.push([p.eq(i).find("input#Quantity").val(), id,
            p.eq(i).find("option:selected").val()])
            if (i > 0) {
                if (w[i][2] == w[i - 1][2]) {
                    alert('Kho ko được trùng')
                    return
                }
            }
        }
        const data = {
            'id': id,
            'name': $(".modal-body input#Name").val(),
            'brand': $(".modal-body input#Brand").val(),
            'color': $(".modal-body input#Color").val(),
            'price': $(".modal-body input#Price").val(),
            'img': $("img#img-product").attr('src'),
            'short_discription': $("input#Short-Description").val(),
            'discription': $("textarea#Description").val(),
            'id_type': $("select.Type-product option:selected").val(),
            'warehouse': w
        }
        $.ajax({
            type: "POST",
            url: BASEURL + "/admin/saveProduct",
            data: data,
            dataType: 'JSON'
        }).then(
            // resolve/success callback
            function (response) {
                if (response.status) {
                    $("#product_table").DataTable().ajax.reload()
                    $('#modify-product').modal('toggle')
                    p_modify = null
                }
            },
            // reject/failure callback
            function () {
                alert('There was some error sp!');
            }
        )
    })
    /**
     * 
     * insert p
     */
    $(document).on('click', '#p-insert', function () {
        p = $("div.form-row")
        w = []
        check = true
        for (i = 0; i < p.length; i++) {
            w.push([p.eq(i).find("input#Quantity").val(),
            p.eq(i).find("option:selected").val()])
            if (w[i][0] == "") {
                p.eq(i).find("input.Quantity").addClass("is-invalid")
                check = false
            }
            else
                p.eq(i).find("input.Quantity").removeClass("is-invalid")
            if (i > 0) {
                if (w[i][1] == w[i - 1][1]) {
                    alert('Kho ko được trùng')
                    return
                }
            }
        }
        const data = {
            'name': $("input#Name").val(),
            'brand': $("input#Brand").val(),
            'color': $("input#Color").val(),
            'price': $("input#Price").val(),
            'img': $("img#img-product").attr('src'),
            'short_discription': $("input#Short-Description").val(),
            'discription': $("textarea#Description").val(),
            'id_type': $("select.Type-product option:selected").val(),
            'warehouse': w
        }
        console.log(w);
        if (data.name == "") {
            $("input.Name").addClass("is-invalid")
            check = false
        }
        else
            $("input.Name").removeClass("is-invalid")

        if (data.brand == "") {
            $("input.Brand").addClass("is-invalid")
            check = false
        }
        else
            $("input.Brand").removeClass("is-invalid")

        if (data.price == "") {
            $("input.Price").addClass("is-invalid")
            check = false
        }
        else
            $("input.Price").removeClass("is-invalid")

        if (data.short_discription == "") {
            $("input.Short-Description").addClass("is-invalid")
            check = false
        }
        else
            $("input.Short-Description").removeClass("is-invalid")

        if (check) {
            $.ajax({
                type: "POST",
                url: BASEURL + "/admin/insertProduct",
                data: data,
                dataType: 'JSON'
            }).then(
                // resolve/success callback
                function (response) {
                    if (response.status) {
                        s = '<div class="alert alert-success text-center" role="alert">'
                        s += 'Thêm loại sản phẩm thành công thành công!!'
                        s += '</div>'
                        $("#admin-navbar").after(s)
                    }
                },
                // reject/failure callback
                function () {
                    alert('There was some error ip!');
                }
            )
        }
    })
})




/*!
 * Start Bootstrap - SB Admin 2 v4.1.3 (https://startbootstrap.com/theme/sb-admin-2)
 * Copyright 2013-2020 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin-2/blob/master/LICENSE)
 */

!function (s) { "use strict"; s("#sidebarToggle, #sidebarToggleTop").on("click", function (e) { s("body").toggleClass("sidebar-toggled"), s(".sidebar").toggleClass("toggled"), s(".sidebar").hasClass("toggled") && s(".sidebar .collapse").collapse("hide") }), s(window).resize(function () { s(window).width() < 768 && s(".sidebar .collapse").collapse("hide"), s(window).width() < 480 && !s(".sidebar").hasClass("toggled") && (s("body").addClass("sidebar-toggled"), s(".sidebar").addClass("toggled"), s(".sidebar .collapse").collapse("hide")) }), s("body.fixed-nav .sidebar").on("mousewheel DOMMouseScroll wheel", function (e) { if (768 < s(window).width()) { var o = e.originalEvent, l = o.wheelDelta || -o.detail; this.scrollTop += 30 * (l < 0 ? 1 : -1), e.preventDefault() } }), s(document).on("scroll", function () { 100 < s(this).scrollTop() ? s(".scroll-to-top").fadeIn() : s(".scroll-to-top").fadeOut() }), s(document).on("click", "a.scroll-to-top", function (e) { var o = s(this); s("html, body").stop().animate({ scrollTop: s(o.attr("href")).offset().top }, 1e3, "easeInOutExpo"), e.preventDefault() }) }(jQuery);