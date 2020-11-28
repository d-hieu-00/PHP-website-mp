<html>

<head>
    <title>Đăng nhập</title>
    <?php require_once "../application/views/_shared/css.php"; ?>
</head>
<body>
<a href="<?php echo BASEURL ?>" class="d-block px-3 py-1 text-center text-bold text-white old-bv">Đồ án bán mỹ phẩm</a>
<?php 
  if(isset($data['msg'])){
    echo '<div class="alert alert-success text-center" role="alert">';
    echo $data['msg'];
    echo'</div>';

  }
?>
<div class="container card mt-3 pt-4 col-3">

<form class="row" action="" method="POST">
  <div class="col-12">
  <div class="form-group">
    <label for="Account"><strong>Tên tài khoản</strong></label>
    <input type="text" id="Account" class="form-control Account"  placeholder="Nhập tên tài khoản">
    <div class="AccountError invalid-feedback">
      Chưa nhập tên tài khoản!!
    </div>
  </div>
  

  <div class="form-group">
    <label for="Password"><strong>Mật khẩu</strong></label>
    <input type="password" id="Password" class="form-control Password" placeholder="Nhập mật khẩu">
    <div class="PasswordError invalid-feedback">
      Chưa nhập mật khẩu!!
    </div>
  </div>
  <div class="float-right">
  <button type="button" id="login" class="btn btn-primary ">Đăng nhập</button>
  </div>
  </div>
</form>
<p class="text-center">Không phải là thành viên? <a href="<?php echo BASEURL?>/user/signup">Đăng ký</a></p>
</div>

<?php require_once "../application/views/_shared/js.php"; ?>
<?php require_once "../public/assets/js/user.php" ?>
</body>
</html>
