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
      <input class="form-control mr-1" type="text" placeholder="Nhập tên sản phẩm" aria-label="Tìm kiếm">
      <button id="sreach" class="btn btn-outline-secondary p-2" type="button">
        <i class="fa fa-search" aria-hidden="true"></i>
      </button>
    </form>

    <a class="nav-link pl-2" href="<?php echo BASEURL; ?>" aria-label="Giỏ hàng">
      <i class="fa fa-shopping-cart d-inline" aria-hidden="true"></i>Giỏ hàng
    </a>
  </div>
  </div>
</nav>

<div class="container slideshow p-0">
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