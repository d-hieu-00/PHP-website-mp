

<a href="<?php echo BASEURL ?>" class="d-block px-3 py-1 text-center text-bold text-white old-bv">Đồ án bán mỹ phẩm</a>
<header class="navbar navbar-expand navbar-dark flex-column flex-md-row bd-navbar">

  <ul class="navbar-nav flex-row ml-md-auto d-none d-md-flex">
    <li class="nav-item">
      <a class="nav-link" href="<?php echo BASEURL; ?>" aria-label="Giỏ hàng">Giỏ hàng</a>
    </li>

    <li class="nav-item dropdown">
      <a class="nav-item nav-link dropdown-toggle mr-md-1" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Tài khoản
      </a>
      <div class="dropdown-menu dropdown-menu-md-right" aria-labelledby="bd-versions">
        <a class="dropdown-item" href="<?php echo BASEURL."/user/profile" ?>">Thông tin tài khoản <strong><?php if($this->getSession('Account'))echo $this->getSession('Account') ?></strong></a>
        <div class="dropdown-divider"></div>
        <?php
          if($this->getSession('Account')){
            echo '<a class="dropdown-item" href="'.BASEURL."/user/logout".'">Đăng xuất</a>';
          } else {
            echo '<a class="dropdown-item" href="'.BASEURL."/user/login".'">Đăng nhập</a>';
          }
        ?>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href="<?php echo BASEURL."/user/signup" ?>">Tạo tài khoản</a>
      </div>
    </li>
  </ul>
</header>