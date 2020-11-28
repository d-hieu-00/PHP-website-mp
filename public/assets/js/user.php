<script>
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
                    console.log(response)
                    console.log(response.status)
                    if(response.status == true){
                        s = '<div class="alert alert-success text-center" role="alert">'
                        s += 'Tạo tài khoản thành công!! <a href="'+BASEURL+'/user/login/" class="alert-link">Nhấn để đăng nhập</a>'
                        s += '</div>'
                        $(".container").before(s)
                    } else {
                        s = '<div class="alert alert-danger text-center" role="alert">'
                        s += 'Tạo tài khoản không thành công!!'
                        s += '</div>'
                        $(".container").before(s)
                        if(response.AccountError != "") {
                            $(".Account").addClass("is-invalid")
                            $(".AccountError").html(response.AccountError)
                        } else {
                            $(".Account").removeClass("is-invalid")
                        }
                        if(response.PhoneError != "") {
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
            );
        }
    });
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
                    console.log(response)
                    console.log(response.status)
                    if(response.status == true){
                        location.href = BASEURL;
                    } else {
                        s = '<div class="alert alert-danger text-center" role="alert">'
                        s += 'Đăng nhập không thành công!!'
                        s += '</div>'
                        $(".container").before(s)
                        if(response.AccountError != "") {
                            $(".Account").addClass("is-invalid")
                            $(".AccountError").html(response.AccountError)
                        } else {
                            $(".Account").removeClass("is-invalid")
                        }
                        if(response.PhoneError != "") {
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
            );
        }
    });
});
</script>