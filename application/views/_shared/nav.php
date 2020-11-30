<div class="container text-center">
<a href="<?php echo BASEURL ?>">
<img src="<?php echo BASEURL; ?>/public/assets/img/logo.png" alt="banner">
</a>
</div>


<nav class="navbar navbar-expand-md site-nav sticky-top">
  <div class="container">
  <a class="navbar-brand pl-2 pr-4 border-right" href="<?php echo BASEURL ?>">
    <i class="fa fa-home" aria-hidden="true"></i> <strong>Trang chủ</strong>
  </a>

  
  <div class="collapse navbar-collapse">
    <ul class="navbar-nav mr-auto mt-1">

      <li class="nav-item dropdown">
        <a class="nav-link" href="#" data-toggle="dropdown">Trang điểm
          <i class="fa fa-angle-down hidden-xs hidden-sm" aria-hidden="true"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-left">
          <li><a class="dropdown-item" href="#"> Submenu item 1</a></li>
          <li><a class="dropdown-item" href="#"> Submenu item 2 </a></li>
        </ul>
      </li>

      <li class="nav-item dropdown">
        <a class="nav-link" href="#" data-toggle="dropdown">Chăm sóc da
          <i class="fa fa-angle-down hidden-xs hidden-sm" aria-hidden="true"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-left">
          <li><a class="dropdown-item" href="#"> Submenu item 1</a></li>
          <li><a class="dropdown-item" href="#"> Submenu item 2 </a></li>
        </ul>
      </li>

      <li class="nav-item dropdown">
        <a class="nav-link" href="#">Chăm sóc tóc
          <i class="fa fa-angle-down hidden-xs hidden-sm" aria-hidden="true"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-left">
          <li><a class="dropdown-item" href="#"> Submenu item 1</a></li>
          <li><a class="dropdown-item" href="#"> Submenu item 2 </a></li>
        </ul>
      </li>

      <li class="nav-item dropdown">
        <a class="nav-link" href="#">Nước hoa
          <i class="fa fa-angle-down hidden-xs hidden-sm" aria-hidden="true"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-left">
          <li><a class="dropdown-item" href="#"> Submenu item 1</a></li>
          <li><a class="dropdown-item" href="#"> Submenu item 2 </a></li>
        </ul>
      </li>
    </ul>


    <form class="form-inline">
      <input class="form-control mr-1" type="text" placeholder="Nhập tên sản phẩm" aria-label="Tìm kiếm">
      <button id="sreach" class="btn btn-outline-secondary p-2" type="button">
        <i class="fa fa-search" aria-hidden="true"></i>
      </button>
    </form>

    <a class="nav-link " href="<?php echo BASEURL; ?>" aria-label="Giỏ hàng">
      <i class="fa fa-shopping-cart" aria-hidden="true"></i>
      Giỏ hàng
    </a>
  </div>
  </div>
</nav>

<div class="container slideshow">
<div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
  <?php
    function getDirContents($dir, &$results = array()) {
        $files = scandir($dir);
        foreach ($files as $key => $value) {
            $path = realpath($dir . DIRECTORY_SEPARATOR . $value);
            if (!is_dir($path)) {
                $results[] = BASEURL."/public/assets/img/slide/".$value;
            }
            // get file from child folder
            // } else if ($value != "." && $value != "..") {
            //     getDirContents($path, $results);
            //     $results[] = $path;
            // }
        }
    
        return $results;
    }
    
    $arr = getDirContents("../public/assets/img/slide");

    echo '<div class="carousel-inner">';
    foreach ($arr as $key => $value) {
        if($key == 0) {
            echo '<div class="carousel-item active">';
            echo '<img class="d-block w-100" src="'.$value.'">';
            echo '</div>';
        } else {
            echo '<div class="carousel-item">';
            echo '<img class="d-block w-100" src="'.$value.'">';
            echo '</div>';
        }
    }
    echo '  </div>';
    echo '<a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">';
    echo '  <span class="carousel-control-prev-icon" aria-hidden="true"></span>';
    echo '  <span class="sr-only">Previous</span>';
    echo '</a>';
    echo '<a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">';
    echo '  <span class="carousel-control-next-icon" aria-hidden="true"></span>';
    echo '  <span class="sr-only">Next</span>';
    echo '</a>';
  ?>

</div>
</div>