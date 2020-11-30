<html>

<head>
    <title>Home mate - Login admin</title>
    <?php require_once "../application/views/admin/_assets/css.php"; ?>
</head>
<body>


<div class="d-flex align-items-center container-login">
<div class="container container_s card pd-2 col-3">

<form action="<?php echo BASEURL; ?>/admin/login" method="POST">
    <div class="col-12 col-md text-center">
        <a href="<?php echo BASEURL ?>">
            <img class="img-logo" src="<?php echo BASEURL; ?>/public/assets/img/favicon.png" alt="banner">
        </a>
        <small class="d-block mb-3 text-muted">IS207.L12</small>
    </div>

  <div class="form-group">
    <label for="Password">
        <i class="fa fa-key" aria-hidden="true"></i>
        <strong>Mật khẩu</strong>
    </label>
    <input type="password" id="Password" name="Password" class="form-control Password" placeholder="Nhập mật khẩu" required>
  </div>
  <?php 
    if(isset($data['msg'])){
        echo '<div class="alert alert-danger text-center" role="alert">';
        echo $data['msg'];
        echo'</div>';

    }
  ?>
  <div class="text-center">
    <button type="submit" id="login" class="btn btn-primary ">Đăng nhập</button>
  </div>
  </div>
</form>
</div>
</div>



<?php include "../application/views/admin/_assets/footer.php" ?>
<?php require_once "../application/views/_shared/js.php"; ?>
</body>
</html>