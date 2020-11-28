<html>

<head>
    <title>Thông tin tài khoản</title>
    <?php require_once "../application/views/_shared/css.php"; ?>
</head>
<body>
<a href="<?php echo BASEURL ?>" class="d-block px-3 py-1 text-center text-bold text-white old-bv">Đồ án bán mỹ phẩm</a>

<!--  -->
<div class="container card col-8 mt-3 pt-4 ">
<form class="row">
<div class="col-4 border-right ">

  <img src="../public/assets/img/user.jpg" class="img img-fluid">


  <div class="form-group row pt-2">
    <label class="col-sm-7 col-form-label"><strong>Tên tài khoản:</strong></label>
    <div class="col-sm-5">
      <p readonly class="form-control-plaintext"><?php echo $this->getSession('Account')?></p>
    </div>
  </div>
</div>

<div class="col-8">
  <div class="form-group row">
    <label for="FullName" class="col-sm-4 col-form-label"><strong>Họ và tên:</strong></label>
    <div class="col-sm-8">
      <input type="text" readonly class="form-control-plaintext FullName" name="FullName" 
      value="<?php echo $data['FullName']?>">
    </div>
    <div class="FullNameError invalid-feedback">
      Tên tài khoản không được trống!!
    </div>
  </div>

  <div class="form-group row">
    <label for="Email" class="col-sm-4 col-form-label"><strong>Địa chỉ email:</strong></label>
    <div class="col-sm-8">
      <input type="text" readonly class="form-control-plaintext Email" name="Email" 
      value="<?php echo $data['Email']?>">
    </div>
    <div class="EmailError invalid-feedback">
      Email không được trống!!
    </div>
  </div>


  <div class="form-group row">
    <label for="Phone" class="col-sm-4 col-form-label"><strong>Số điện thoại:</strong></label>
    <div class="col-sm-8">
      <input type="text" readonly class="form-control-plaintext Phone" name="Phone" 
      value="<?php echo $data['Phone']?>">
    </div>
    <div class="PhoneError invalid-feedback">
       không được trống!!
    </div>
  </div>


</div>
</form>
</div>
<!--  -->
</body>
<?php require_once "../application/views/_shared/js.php"; ?>
</html>
