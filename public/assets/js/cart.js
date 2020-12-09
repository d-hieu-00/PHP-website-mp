


loadCart = function(acc=""){
    if(acc==""){
        cart = JSON.parse(localStorage.getItem('cart'))
        if(cart == null){
            $("#content").empty()
            s = '<img src="'+BASEURL+'/public/assets/img/cart-empty.png" class="img-fluid">'
            s += '<p class="text-secondary mt-3"><i>Chưa có sản phẩm nào</i></p>'
            $("#content").append(s)
            $("#content").addClass("bg-light text-center p-4")
            $("#content").removeClass("row")
        } else {
            $("#quantity_sp").text(cart.length)
            for(i=0; i<cart.length; i++){
                const data = {
                    'id_p' : cart[i].id
                }
                $.ajax({
                    type: 'POST',
                    url: BASEURL+'/cart/getInfoByIdProduct',
                    data: data,
                    dataType: 'JSON'
                }).then(
                    function(res){
                    //     <div class="col-lg-6 col-md-6 col-12" style="padding-left:0; height:31px">
                    //     <strong class="cart_index">Giỏ hàng (<span id="quantity_sp"></span> sản phẩm)</strong>
                    // </div>
                    // <div class="col-lg-2 col-md-2 hidden-xs">
                    //     <h6 class="text-secondary"> Giá mua</h6>
                    // </div>
                    // <div class="col-lg-2 col-md-2 hidden-xs">
                    //     <h6 class="text-secondary"> Số lượng</h6>
                    // </div>
                    // <div class="col-lg-2 col-md-2 hidden-xs">
                    //     <h6 class="text-secondary"> Thành tiền</h6>
                    // </div>
                        test=res
                        console.log(res)
                    },
                    function(){
                        alert('error display')
                    }
                )
            }
        }
    }
}