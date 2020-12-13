<html>

<head>
    <title>Home mate</title>
    <?php require_once "../application/views/_shared/css.php"; ?>
</head>

<body>
    <?php include "../application/views/_shared/header.php" ?>
    <?php include "../application/views/_shared/nav.php" ?>
    <?php include "../application/views/_shared/slide.php" ?>
    <div class="container" >
        <div class="row row-cols-1 row-cols-sm-3 row-cols-md-5" id="bodyy">
            
        </div>
    </div>
    <?php include "../application/views/_shared/footer.php" ?>
    <?php require_once "../application/views/_shared/js.php"; ?>
    <script>
        $(document).ready(function() {
            loadCategory()
            loadProduct()
        })
    </script>
</body>

</html>