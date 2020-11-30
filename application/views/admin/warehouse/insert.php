<html>

<head>
    <title>Home mate - Admin</title>
    <?php require_once "../application/views/admin/_assets/css.php"; ?>
</head>
<body id="page-top">
<?php include "../application/views/admin/_assets/header.php" ?>
<!-- Topbar -->
<div class="container-fluid bg-white mb-4 text-center shadow">
<nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
    <!-- Topbar info -->
    <div class="sidebar-heading">
        Thêm kho mới
    </div>
</nav>
</div>
<!-- Begin Page Content -->
<div class="container-fluid">









</div>
<!-- /.container-fluid -->
<?php include "../application/views/admin/_assets/footer.php" ?>
<?php require_once "../application/views/_shared/js.php"; ?>
<script src="<?php echo BASEURL ?>/public/assets/js/admin.js"></script>
<script>
    $(document).ready(function(){
        a = $(".navbar-nav li.active")
        for(i=0; i<a.length; i++) a.eq(i).removeClass('active')
        $("#userPage").addClass('active')
    })
</script>
</body>
</html>