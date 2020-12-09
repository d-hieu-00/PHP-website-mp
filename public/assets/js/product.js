
$(document).ready(function(){


    $(".addToCart").click(function(){
        const data = {
            'account' : $(".account_user").text(),
            'id_p' : $(this).parents('div.row').attr('id_p'),
            'quan' : $("input.quantity").val()
        }
        if($(".account_user").text() != ""){
            $.ajax({
                type: 'POST',
                url: BASEURL+'/product/addCart',
                data: data,
                dataType: 'JSON'
            }).then(
                function(res){
                    if(res.status == true){
                        s = '<div class="container mt-3 alert alert-success alert-dismissible fade show" role="alert">'
                        s += 'Thêm vào giỏ thành công'
                        s += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
                        s += '<span aria-hidden="true">&times;</span></button>'
                        s += '</div>'
                        $("nav").after(s)
                    } else {
                        alert('error')
                    }
                },
                function(){
                    alert("error addCart")
                }
            )
        } else {
            cart = JSON.parse(localStorage.getItem('cart'))
            r = {
                'id' : data['id_p'], 
                'quan' : data['quan']
            }
            if(cart == null){
                cart = []
                cart.push(r)
            } else {
                ck = false
                for(i=0; i<cart.length; i++){
                    console.log(cart[i])
                    if(cart[i].id == r.id){
                        cart[i].quan = parseInt(cart[i].quan)+1
                        ck = true
                        break
                    }
                }
                if(!ck){
                    cart.push(r)
                }
            }
            console.log(cart)
            localStorage.setItem('cart',JSON.stringify(cart))
        }
    })
})