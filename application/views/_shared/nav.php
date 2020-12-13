<div class="container-md text-center">
<a href="<?php echo BASEURL ?>">
  <img class="img-fluid" src="<?php echo BASEURL; ?>/public/assets/img/logo.png" alt="banner">
</a>
</div>


<nav class="navbar navbar-expand-md site-nav sticky-top">
  <div class="container pt-2 pb-2">
  <a class="navbar-brand pl-2 pr-4 border-right" href="<?php echo BASEURL ?>">
    <i class="fa fa-home" aria-hidden="true"></i> <strong>Trang chủ</strong>
  </a>

  
  <div class="navbar-collapse">
    <ul class="navbar-nav mr-auto">

      <li class="nav-item dropdown pl-2">
        <a class="nav-link" href="#" data-toggle="dropdown" id_ca='1'>Trang điểm
          <i class="fa fa-angle-down d-inline" aria-hidden="true"></i>
        </a>
      </li>

      <li class="nav-item dropdown pl-2">
        <a class="nav-link" href="#" data-toggle="dropdown" id_ca='2'>Chăm sóc da
          <i class="fa fa-angle-down d-inline" aria-hidden="true"></i>
        </a>
      </li>

      <li class="nav-item dropdown pl-2">
        <a class="nav-link" href="#" data-toggle="dropdown" id_ca='3'>Chăm sóc tóc
          <i class="fa fa-angle-down d-inline" aria-hidden="true"></i>
        </a>
      </li>

      <li class="nav-item dropdown pl-2">
        <a class="nav-link" href="#" data-toggle="dropdown" id_ca='4'>Nước hoa
          <i class="fa fa-angle-down d-inline" aria-hidden="true"></i>
        </a>
      </li>
    </ul>


    <form class="form-inline pl-2">
      <input class="form-control mr-1" id="sreach" type="text" placeholder="Nhập tên sản phẩm" aria-label="Tìm kiếm">
      <button id="sreach-product" class="btn btn-outline-secondary p-2" type="button">
        <i class="fa fa-search" aria-hidden="true"></i>
      </button>
    </form>

    <a class="nav-link pl-2" href="<?php echo BASEURL; ?>/cart/info" aria-label="Giỏ hàng">
      <i class="fa fa-shopping-cart d-inline" aria-hidden="true"></i> Giỏ hàng
    </a>
  </div>
  </div>
</nav>
