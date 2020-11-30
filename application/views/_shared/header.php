
<header>
<div class="container d-flex">
  <a href="tel:0965690984" class="p-2">
    <i class="fa fa-phone"></i> 0965 690 984
  </a>

  <a href="mailto:info@gmail.com" class="p-2">
    <i class="fas fa-envelope"></i> info@gmail.com
  </a>

  <a action="" class="p-2">
    <i class="fa fa-map-marker"></i> Khu phố 6, P.Linh Trung, Q.Thủ Đức, Tp.Hồ Chí Minh 
  </a>

  <a class=" nav-link dropdown-toggle ml-auto p-2" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <i class="fa fa-user" aria-hidden="true"></i>
    <?php 
    if($this->getSession('Account'))
      echo "<strong>".$this->getSession('Account')."</strong>";
    else echo "Tài khoản"; ?>
  </a>

  <div class="dropdown-menu dropdown-menu-md-right">
    
    <?php
      if($this->getSession('Account')){
        echo '<a class="dropdown-item" href="'.BASEURL."/user/profile".'">';
        echo '<i class="far fa-id-card"></i>';
        echo '  Thông tin tài khoản';
        echo '</a>';
        echo '<div class="dropdown-divider"></div>';
        echo '<a class="dropdown-item" href="'.BASEURL."/user/logout".'">';
        echo '<i class="fas fa-sign-out-alt"></i> Đăng xuất</a>';
      } else {
        echo '<a class="dropdown-item" href="'.BASEURL."/user/login".'">';
        echo '<i class="fas fa-sign-in-alt"></i> Đăng nhập</a>';
      }
    ?>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item" href="<?php echo BASEURL."/user/signup" ?>">
    <i class="fa fa-plus-square" aria-hidden="true"></i> Tạo tài khoản</a>
  </div>
</div>


</header>

