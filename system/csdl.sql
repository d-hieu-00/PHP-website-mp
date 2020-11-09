/*
Table info
-- mp_user(id, account, password, role, date_created, date_modify)
-- mp_log(id, id_user, table_name, action, date_created, date_modify)
-- mp_customer(id, first_name, last_name, email, phone, address, city, province, status, date_created, date_modify, date_last_access)
-- mp_type_product(id, name, date_created, date_modify)
-- mp_product(id, name, brand, color, price, short_discription, discription, id_type, status, date_created, date_modify)
-- mp_cart(id, id_user, date_created, date_modify)
-- mp_cart_detail(id_cart, id_product, quantity, date_created, date_modify)
-- mp_warehouse(id, name, address, city, province, date_created, date_modify)
-- mp_warehouse_detail(id_product, id_warehouse, quantity, date_created, date_modify)
-- mp_discount(id, name, voucher_code, min_price, value, max_dis_cost, date_exprired, date_created, date_modify)
-- mp_dis_applied(id_discount, id_product, date_created, date_modify)
-- mp_order(id, id_user, shipping_cost, discount_cost, total_price, status, phone, address, city, province, date_created, date_modify)
-- mp_order_detail(id_order, id_product, quantity, pice, date_created, date_modify)
*/
/*
    DROP TABLE IF EXISTS `mp_order_detail`;
    DROP TABLE IF EXISTS `mp_order`;
    DROP TABLE IF EXISTS `mp_dis_applied`;
    DROP TABLE IF EXISTS `mp_discount`;
    DROP TABLE IF EXISTS `mp_warehouse_detail`;
    DROP TABLE IF EXISTS `mp_warehouse`;
    DROP TABLE IF EXISTS `mp_cart_detail`;
    DROP TABLE IF EXISTS `mp_cart`;
    DROP TABLE IF EXISTS `mp_product`;
    DROP TABLE IF EXISTS `mp_type_product`;
    DROP TABLE IF EXISTS `mp_customer`;
    DROP TABLE IF EXISTS `mp_log`;
    DROP TABLE IF EXISTS `mp_user`;
*/

CREATE SCHEMA `mp` DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_user`
--

CREATE TABLE IF NOT EXISTS `mp_user`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `account` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL,
    PRIMARY KEY(`id`)
) COMMENT = 'User' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_log`
--

CREATE TABLE IF NOT EXISTS `mp_log`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `id_user` INT NOT NULL,
    `table_name` VARCHAR(20) NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`id_user`) REFERENCES mp_user(`id`)
) COMMENT = 'User log' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_customer`
--

CREATE TABLE IF NOT EXISTS `mp_customer`(
    `id_user` INT NOT NULL,
    `first_name` varchar(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(10) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `province` VARCHAR(50) NOT NULL,
    `status` VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL,
    `date_last_access` DATETIME NOT NULL,
    PRIMARY KEY(`id_user`),
    FOREIGN KEY(`id_user`) REFERENCES mp_user(`id`)
) COMMENT = 'Customer' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_type_product`
--

CREATE TABLE IF NOT EXISTS `mp_type_product`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(100) NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL,
    PRIMARY KEY(`id`)
) COMMENT = 'Type of product' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_product`
--

CREATE TABLE IF NOT EXISTS `mp_product`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `pd_name` VARCHAR(100) NOT NULL,
    `brand` VARCHAR(50) NOT NULL,
    `color` VARCHAR(50) NULL,
    `price` INT NOT NULL,
    `short_discription` TEXT NOT NULL,
    `discription` TEXT NOT NULL,
    `id_type` INT NOT NULL,
    `status` VARCHAR(50) NULL DEFAULT '',
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`id_type`) REFERENCES mp_type_product(`id`)
) COMMENT = 'Product' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_cart`
--

CREATE TABLE IF NOT EXISTS `mp_cart`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `id_user` INT NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`id_user`) REFERENCES mp_user(`id`)
) COMMENT = 'Cart' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_cart_detail`
--

CREATE TABLE IF NOT EXISTS `mp_cart_detail`(
    `id_cart` INT NOT NULL,
    `id_product` INT NOT NULL,
    `quantity` INT NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id_cart`,`id_product`),
    FOREIGN KEY(`id_cart`) REFERENCES mp_cart(`id`),
    FOREIGN KEY(`id_product`) REFERENCES mp_product(`id`)
) COMMENT = 'Cart detail' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_warehouse`
--

CREATE TABLE IF NOT EXISTS `mp_warehouse`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `wh_name` VARCHAR(100) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `province` VARCHAR(50) NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL,
    PRIMARY KEY(`id`)
) COMMENT = 'Warehouses' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_warehouse_detail`
--

CREATE TABLE IF NOT EXISTS `mp_warehouse_detail`(
    `id_warehouse` INT NOT NULL,
    `id_product` INT NOT NULL,
    `quantity` INT NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL,
    PRIMARY KEY(`id_warehouse`,`id_product`),
    FOREIGN KEY(`id_warehouse`) REFERENCES mp_warehouse(`id`),
    FOREIGN KEY(`id_product`) REFERENCES mp_product(`id`)
) COMMENT = 'Warehouses detail' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_discount`
--

CREATE TABLE IF NOT EXISTS `mp_discount`(
    `id_warehouse` INT NOT NULL,
    `id_product` INT NOT NULL,
    `quantity` INT NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL,
    PRIMARY KEY(`id_warehouse`,`id_product`),
    FOREIGN KEY(`id_warehouse`) REFERENCES mp_warehouse(`id`),
    FOREIGN KEY(`id_product`) REFERENCES mp_product(`id`)
) COMMENT = 'Discount' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_dis_applied`
--

CREATE TABLE IF NOT EXISTS `mp_dis_applied`(
    `id_warehouse` INT NOT NULL,
    `id_product` INT NOT NULL,
    `quantity` INT NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL,
    PRIMARY KEY(`id_warehouse`,`id_product`),
    FOREIGN KEY(`id_warehouse`) REFERENCES mp_warehouse(`id`),
    FOREIGN KEY(`id_product`) REFERENCES mp_product(`id`)
) COMMENT = 'Products are discounted' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_order`
--

CREATE TABLE IF NOT EXISTS `mp_order`(
    `id_warehouse` INT NOT NULL,
    `id_product` INT NOT NULL,
    `quantity` INT NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL,
    PRIMARY KEY(`id_warehouse`,`id_product`),
    FOREIGN KEY(`id_warehouse`) REFERENCES mp_warehouse(`id`),
    FOREIGN KEY(`id_product`) REFERENCES mp_product(`id`)
) COMMENT = 'Order' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_order_detail`
--

CREATE TABLE IF NOT EXISTS `mp_order_detail`(
    `id_warehouse` INT NOT NULL,
    `id_product` INT NOT NULL,
    `quantity` INT NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL,
    PRIMARY KEY(`id_warehouse`,`id_product`),
    FOREIGN KEY(`id_warehouse`) REFERENCES mp_warehouse(`id`),
    FOREIGN KEY(`id_product`) REFERENCES mp_product(`id`)
) COMMENT = 'Order detail' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Trriger on table `mp_user`
--

CREATE OR REPLACE TRIGGER mp_user_date_modify
BEFORE UPDATE ON `mp_user`


  