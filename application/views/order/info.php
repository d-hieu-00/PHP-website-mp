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
            <div class="col-lg-6">
                <h3 class="h4 text-secondary">Địa chỉ nhận hàng</h3>
                <form>
                    <div class="form-group">
                        <label for="FullName" class="ml-2"><strong>Họ và tên</strong></label>
                        <input type="text" id="FullName" class="form-control FullName" placeholder="Nhập họ và tên">
                        <div class="FullNameError invalid-feedback">
                            Chưa nhập họ và tên!!
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="Phone" class="ml-2"><strong>Số điện thoại</strong></label>
                        <input type="number" id="Phone" class="form-control Phone" placeholder="Nhập số điện thoại">
                        <div class="PhoneError invalid-feedback">
                            Chưa nhập số điện thoại!!
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="Address" class="ml-2"><strong>Địa chỉ</strong></label>
                        <input type="text" id="Address" class="form-control Address" placeholder="Nhập địa chỉ">
                        <div class="AddressError invalid-feedback">
                            Chưa nhập địa chỉ!!
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="City" class="ml-2"><strong>Tỉnh/ thành phố</strong></label>
                        <input type="text" id="City" class="form-control City" placeholder="Nhập tỉnh/ thành phố">
                        <div class="CityError invalid-feedback">
                            Chưa nhập tỉnh/ thành phố!!
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="Province" class="ml-2"><strong>Quận/ huyện</strong></label>
                        <input type="text" id="Province" class="form-control Province" placeholder="Nhập quận/ huyện">
                        <div class="ProvinceError invalid-feedback">
                            Chưa nhập thành quận/ huyện!!
                        </div>
                    </div>

                    <div class="form-group row">
                        <div class="col-sm-6 col-8">
                            <a class="btn btn-secondary" href="/gio-hang.html">QUAY LẠI GIỎ HÀNG</a>
                        </div>
                        <div class="col-sm-6 col-4">
                            <button class="btn btn-success" type="button" id="btn-tt">THANH TOÁN</button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-lg-6">

                <div class="card shadow">
                    <h4 class="card-header p-2 pl-4">Giỏ Hàng</h4>
                    <div class="card-body row">
                        <div class="col-4 border">
                            <a class="cart_list_product_img" href="/son-kem-li-black-rouge-air-fit-velvet-tint-ver7.html">
                                <img src="https://adminbeauty.hvnet.vn/Upload/Files/7a35eebac330689cc5a7c658da0a1533.jpg?width=350&amp;height=391" alt="Son Kem Black Rouge Air Fit Velvet Tint Ver.7" class="img-fluid">
                            </a>
                        </div>
                        <div class="col-8 order-detail-p">
                            <div>
                                <a href="/son-kem-li-black-rouge-air-fit-velvet-tint-ver7.html">
                                    <span class="name-ps">Son Kem Black Rouge Air Fit Velvet Tint Ver.7</span>
                                </a>
                            </div>
                            <div class="quantity">
                                1 x
                                <span class="amount">
                                    <span class="money" style="color: #199427; font-size: 14px !important;">
                                        115,000₫
                                    </span>
                                </span>
                                <div class="pull-right tt">
                                    115,000₫
                                </div>
                            </div>
                        </div>
                    </div>



        </div>
    </div>
    </div>
    <?php include "../application/views/_shared/footer.php" ?>
    <?php require_once "../application/views/_shared/js.php"; ?>
    <script>
        $(document).ready(function() {
            loadCategory()
        })
    </script>
</body>

</html>