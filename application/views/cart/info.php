<html>

<head>
    <title>Home mate</title>
    <?php require_once "../application/views/_shared/css.php"; ?>
</head>

<body>
    <?php include "../application/views/_shared/header.php" ?>
    <?php include "../application/views/_shared/nav.php" ?>
    <div class="container mt-3">
        <div class="row" id="content">
            <div class="col-md-8">
                <div class="row mt-1">
                    <div class="col-lg-6 col-md-6 col-12" style="padding-left:0; height:31px">
                        <strong class="cart_index">Giỏ hàng (<span id="quantity_sp"></span> sản phẩm)</strong>
                    </div>
                    <div class="col-lg-2 col-md-2 hidden-xs">
                        <h6 class="text-secondary"> Giá mua</h6>
                    </div>
                    <div class="col-lg-2 col-md-2 hidden-xs">
                        <h6 class="text-secondary"> Số lượng</h6>
                    </div>
                    <div class="col-lg-2 col-md-2 hidden-xs">
                        <h6 class="text-secondary"> Thành tiền</h6>
                    </div>
                </div>
                <hr>
            </div>
            <div class="col-lg-4 col-md-12">
                <div class="border p-2">
                    <p class="d-flex" id="priceTotal">
                        <b class="mr-auto">Tạm tính: </b>
                        <span class="text-success"></span>₫
                    </p>
                    <hr>
                    <p class="d-flex">
                        <span class="mr-auto">Thành tiền: </span>
                        <span></span>₫
                    </p>
                    <p class="text-right text-secondary">
                        <i><small>(Chưa bao gồm phí vận chuyển)</small></i>
                    </p>
                </div>
                <button id="btn_submit_cart" type="button" class="btn btn-success w-100 mt-3"> TIẾN HÀNH ĐẶT HÀNG </button>
            </div>
            
        </div>
    </div>
    </div>
    <?php include "../application/views/_shared/footer.php" ?>
    <?php require_once "../application/views/_shared/js.php"; ?>
    <script src="<?php echo BASEURL ?>/public/assets/js/cart.js"></script>
    <script>

        $(document).ready(function(){
            loadCart(<?php echo $this->getSession('Account')?>)
        })
    </script>
</body>

</html>