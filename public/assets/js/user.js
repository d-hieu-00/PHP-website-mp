//signup page
const BASEURL = "http://localhost/-website-mp"
$(document).ready(function() {
    $(".Password, .conPassword").keyup(function(){
        Password = $("#Password").val()
        conPassword = $("#conPassword").val()
        if(Password!=conPassword){
            $(".conPasswordError").html("Mật khẩu xác nhận sai!!")
            $(".conPassword").addClass("is-invalid")
        } else {
            $(".conPassword").removeClass("is-invalid")
        }
    })
    $("input").keydown(function(){
        val = $(this).val()
        $(this).removeClass("is-invalid")
    })
    $('#signup').click(function() {
        $(".alert").remove()
        const userData = {
            'Account' : $("#Account").val(),
            'Password' : $("#Password").val(),
            'FullName' : $("#FullName").val(),
            'Email' : $("#Email").val(),
            'Phone' : $("#Phone").val(),
            'Address' : $("#Address").val(),
            'City' : $("#City").val(),
            'Province' : $("#Province").val(),
        }
        conPassword = $("#conPassword").val()
        if(userData.Account == "")
            $(".Account").addClass("is-invalid")
        else
            $(".Account").removeClass("is-invalid")

        if(userData.Password == "")
            $(".Password").addClass("is-invalid")
        else
            $(".Password").removeClass("is-invalid")
        
        if(userData.FullName == "")
            $(".FullName").addClass("is-invalid")
        else
            $(".FullName").removeClass("is-invalid")
        
        if(userData.Email == "")
            $(".Email").addClass("is-invalid")
        else
            $(".Email").removeClass("is-invalid")
        
        if(userData.Phone == "")
            $(".Phone").addClass("is-invalid")
        else
            $(".Phone").removeClass("is-invalid")
            
        if(userData.Address == "")
            $(".Address").addClass("is-invalid")
        else
            $(".Address").removeClass("is-invalid")
            
        if(userData.City == "")
            $(".City").addClass("is-invalid")
        else
            $(".City").removeClass("is-invalid")
        
        if(userData.Province == "")
            $(".Province").addClass("is-invalid")
        else
            $(".Province").removeClass("is-invalid")

        if(userData.Account != "" && userData.Password != "" && userData.FullName != "" && userData.Address != ""
        && userData.Phone != "" && userData.City != "" && userData.Province != "" 
        && userData.Password==conPassword) {
            $.ajax({
                type: "POST",
                url: BASEURL+'/user/createAccount',
                data: userData,
                dataType : 'JSON'
            }).then(
                // resolve/success callback
                function(response) {
                    if(response.status == true){
                        s = '<div class="alert alert-success text-center" role="alert">'
                        s += 'Tạo tài khoản thành công!! <a href="'+BASEURL+'/user/login/" class="alert-link">Nhấn để đăng nhập</a>'
                        s += '</div>'
                        $(".container_s").before(s)
                    } else {
                        s = '<div class="alert alert-danger text-center" role="alert">'
                        s += 'Tạo tài khoản không thành công!!'
                        s += '</div>'
                        $(".container_s").before(s)
                        if(response.AccountError != null) {
                            $(".Account").addClass("is-invalid")
                            $(".AccountError").html(response.AccountError)
                        } else {
                            $(".Account").removeClass("is-invalid")
                        }
                        if(response.PhoneError != null) {
                            $(".Phone").addClass("is-invalid")
                            $(".PhoneError").html(response.PhoneError)
                        } else {
                            $(".Phone").removeClass("is-invalid")
                        }
                    }
                },
                // reject/failure callback
                function() {
                    alert('There was some error!');
                }
            )
        }
    })
    // Login
    $('#login').click(function() {
        $(".alert").remove()
        const userData = {
            'Account' : $("#Account").val(),
            'Password' : $("#Password").val()
        }
        if(userData.Account == "")
            $(".Account").addClass("is-invalid")
        else
            $(".Account").removeClass("is-invalid")

        if(userData.Password == "")
            $(".Password").addClass("is-invalid")
        else
            $(".Password").removeClass("is-invalid")
        
        if(userData.Account != "" && userData.Password != "") {
            $.ajax({
                type: "POST",
                url: BASEURL+'/user/loginAccount',
                data: userData,
                dataType : 'JSON'
            }).then(
                // resolve/success callback
                function(response) {
                    if(response.status == true){
                        location.href = BASEURL;
                    } else {
                        s = '<div class="alert alert-danger text-center" role="alert">'
                        s += 'Đăng nhập không thành công!!'
                        s += '</div>'
                        $(".container_s").before(s)
                        if(response.AccountError != null) {
                            $(".Account").addClass("is-invalid")
                            $(".AccountError").html(response.AccountError)
                        } else {
                            $(".Account").removeClass("is-invalid")
                        }
                        if(response.PasswordError != null) {
                            $(".Password").addClass("is-invalid")
                            $(".PasswordError").html(response.PasswordError)
                        } else {
                            $(".Password").removeClass("is-invalid")
                        }
                    }
                },
                // reject/failure callback
                function() {
                    alert('There was some error!');
                }
            )
        }
    })

    //Profile
    $("#stt").click(function(){
        $("#ltt").removeAttr('hidden')
        $(".FullName").removeAttr('readonly')
        $(".Email").removeAttr('readonly')
        $(".Address").removeAttr('readonly')
        $(".City").removeAttr('readonly')
        $(".Province").removeAttr('readonly')
    })

    $("#ltt").click(function(){
        $(".alert").remove()
        const userData = {
            'Account' : $("#Account").text(),
            'Password' : "",
            'FullName' : $("#FullName").val(),
            'Email' : $("#Email").val(),
            'Phone' : $("#Phone").val(),
            'Address' : $("#Address").val(),
            'City' : $("#City").val(),
            'Province' : $("#Province").val(),
        }

        if(userData.FullName == "")
            $(".FullName").addClass("is-invalid")
        else
            $(".FullName").removeClass("is-invalid")
        
        if(userData.Email == "")
            $(".Email").addClass("is-invalid")
        else
            $(".Email").removeClass("is-invalid")
        
        if(userData.Phone == "")
            $(".Phone").addClass("is-invalid")
        else
            $(".Phone").removeClass("is-invalid")
            
        if(userData.Address == "")
            $(".Address").addClass("is-invalid")
        else
            $(".Address").removeClass("is-invalid")
            
        if(userData.City == "")
            $(".City").addClass("is-invalid")
        else
            $(".City").removeClass("is-invalid")
        
        if(userData.Province == "")
            $(".Province").addClass("is-invalid")
        else
            $(".Province").removeClass("is-invalid")

        if(userData.Account != "" && userData.FullName != "" && userData.Address != ""
        && userData.Phone != "" && userData.City != "" && userData.Province != "" ) {
            $.ajax({
                type: "POST",
                url: BASEURL+'/user/updateUser',
                data: userData,
                dataType : 'JSON'
            }).then(
                // resolve/success callback
                function(response) {
                    if(response.status == true){
                        s = '<div class="alert alert-success text-center" role="alert">'
                        s += 'Lưu thông tin tài khoản thành công!!'
                        s += '</div>'
                        $(".container_s").before(s)
                        $("#ltt").attr('hidden','true')
                        $(".FullName").attr('readonly','true')
                        $(".Email").attr('readonly','true')
                        $(".Address").attr('readonly','true')
                        $(".City").attr('readonly','true')
                        $(".Province").attr('readonly','true')
                    } else {
                        s = '<div class="alert alert-danger text-center" role="alert">'
                        s += 'Lưu thông tin tài khoản không thành công!!'
                        s += '</div>'
                        $(".container_s").before(s)
                    }
                },
                // reject/failure callback
                function() {
                    alert('There was some error!');
                }
            )
        }
    })
    $('#lmk').click(function() {
        $(".alert").remove()
        const userData = {
            'Account' : $("#Account").text(),
            'Password' : $("#oldPassword").val(),
            'FullName' : $("#FullName").val(),
            'Email' : $("#Email").val(),
            'Phone' : $("#Phone").val(),
            'Address' : $("#Address").val(),
            'City' : $("#City").val(),
            'Province' : $("#Province").val(),
        }
        newPassword = $("#Password").val()
        conPassword = $("#conPassword").val()

        if(conPassword == "")
            $(".conPassword").addClass("is-invalid")
        else
            $(".conPassword").removeClass("is-invalid")
        
        if(newPassword == "")
            $(".Password").addClass("is-invalid")
        else
            $(".Password").removeClass("is-invalid")

        if(userData.Password == "")
            $(".oldPassword").addClass("is-invalid")
        else
            $(".oldPassword").removeClass("is-invalid")
        
        if(userData.Password != "" && conPassword != "" && newPassword != ""
        && newPassword == conPassword) {
            $.ajax({
                type: "POST",
                url: BASEURL+'/user/updatePassword/'+newPassword,
                data: userData,
                dataType : 'JSON'
            }).then(
                // resolve/success callback
                function(response) {
                    console.log(response)
                    if(response.status == true){
                        s = '<div class="alert alert-success text-center" role="alert">'
                        s += 'Lưu mật khẩu mới thành công!!'
                        s += '</div>'
                        $(".lmk").before(s)
                    } else {
                        s = '<div class="alert alert-danger text-center" role="alert">'
                        s += 'Lưu mật khẩu mới không thành công!!'
                        s += '</div>'
                        $(".lmk").before(s)
                        if(response.PasswordError != null) {
                            $(".oldPasswordError").html(response.PasswordError)
                            $(".oldPassword").addClass("is-invalid")
                        } else {
                            $(".oldPassword").removeClass("is-invalid")
                        }
                    }
                },
                // reject/failure callback
                function() {
                    alert('There was some error!');
                }
            )
        }
    })
    function readURL(input) {
        if (input.files && input.files[0]) {
            reader = new FileReader();
            reader.onload = function (e) {
                $('#img').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#Img").change(function(){
        readURL(this);
        $("#luu").removeAttr('hidden')
    });
    $("#luu").click(function(){
        const userData = {
            'Account' : $("#Account").text(),
            'Password' : "",
            'FullName' : "",
            'Email' : "",
            'Phone' : "",
            'Address' : "",
            'City' : "",
            'Province' : "",
            'Img' : $('#img').attr('src')
        }
        //console.log(userData)
        $.ajax({
            type: "POST",
            url: BASEURL+'/user/setImg',
            data: userData,
            dataType : 'JSON'
        }).then(
            // resolve/success callback
            function(response) {
                if(response.status) {
                    $("#luu").attr('hidden','true')
                }
            },
            // reject/failure callback
            function() {
                alert('There was some error!');
            }
        )
    })
    $("#xtk").click(function(){
        $.ajax({
            type: "POST",
            url: BASEURL+'/user/deleteAccount'
        }).then(
            // resolve/success callback
            function(response) {
                console.log(response)
                location.href = BASEURL+'/user/logout_s'
            },
            // reject/failure callback
            function() {
                alert('There was some error!');
            }
        )
    })
})