/*
Table info
-- mp_user(id, account, password, role, date_created, date_modify)
-- mp_customer(id, full_name, email, phone, address, city, province, status, date_created, date_modify, date_last_access)
-- mp_type_product(id, name, date_created, date_modify)
-- mp_product(id, name, brand, color, price, short_discription, discription, id_type, status, date_created, date_modify)
-- mp_cart(id, id_user, date_created, date_modify)
-- mp_cart_detail(id_cart, id_product, quantity, status, date_created, date_modify)
-- mp_warehouse(id, name, address, city, province, date_created, date_modify)
-- mp_warehouse_detail(id_product, id_warehouse, quantity, date_created, date_modify)
-- mp_discount(id, name, voucher_code, min_price, value, max_dis_cost, date_exprired, date_created, date_modify)
-- mp_dis_applied_product(id_discount, id_product, date_created, date_modify)
-- mp_dis_applied_order(id_discount, id_order, date_created, date_modify)
-- mp_order(id, id_user, shipping_cost, discount_cost, total_price, status, phone, address, city, province, date_created, date_modify)
-- mp_order_detail(id_order, id_product, quantity, pice, date_created, date_modify)
*/
/*
    DROP TABLE IF EXISTS `mp_order_detail`;
    DROP TABLE IF EXISTS `mp_order`;
    DROP TABLE IF EXISTS `mp_dis_applied_product`;
    DROP TABLE IF EXISTS `mp_dis_applied_order`;
    DROP TABLE IF EXISTS `mp_discount`;
    DROP TABLE IF EXISTS `mp_warehouse_detail`;
    DROP TABLE IF EXISTS `mp_warehouse`;
    DROP TABLE IF EXISTS `mp_cart_detail`;
    DROP TABLE IF EXISTS `mp_cart`;
    DROP TABLE IF EXISTS `mp_product`;
    DROP TABLE IF EXISTS `mp_type_product`;
    DROP TABLE IF EXISTS `mp_customer`;
    DROP TABLE IF EXISTS `mp_user`;
*/

-- CREATE SCHEMA `mp` DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_user`
--

CREATE TABLE IF NOT EXISTS `mp_user`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `account` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `img` LONGBLOB NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) COMMENT = 'User' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_customer`
--

CREATE TABLE IF NOT EXISTS `mp_customer`(
    `id_user` INT NOT NULL,
    `full_name` varchar(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(10) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `province` VARCHAR(50) NOT NULL,
    `status` VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    `date_modify` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_last_access` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id_user`),
    FOREIGN KEY(`id_user`) REFERENCES mp_user(`id`)
) COMMENT = 'Customer' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_type_product`
--

CREATE TABLE IF NOT EXISTS `mp_type_product`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) COMMENT = 'Type of product' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_product`
--

CREATE TABLE IF NOT EXISTS `mp_product`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `brand` VARCHAR(50) NOT NULL,
    `color` VARCHAR(50) NULL,
    `price` INT NOT NULL,
    `short_discription` TEXT NOT NULL,
    `discription` TEXT NOT NULL,
    `id_type` INT NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    `date_modify` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    `name` VARCHAR(100) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `province` VARCHAR(50) NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    `date_modify` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id_warehouse`,`id_product`),
    FOREIGN KEY(`id_warehouse`) REFERENCES mp_warehouse(`id`),
    FOREIGN KEY(`id_product`) REFERENCES mp_product(`id`)
) COMMENT = 'Warehouses detail' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_order`
--

CREATE TABLE IF NOT EXISTS `mp_order`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `id_user` INT NOT NULL,
    `shipping_fee` INT NOT NULL,
    `discount_cost` INT NOT NULL,
    `total_price` INT NOT NULL,
    `status` VARCHAR(50) DEFAULT 'Chờ xác nhận',
    `phone` VARCHAR(10) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `province` VARCHAR(50) NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`id_user`) REFERENCES mp_user(`id`)
) COMMENT = 'Order' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_order_detail`
--

CREATE TABLE IF NOT EXISTS `mp_order_detail`(
    `id_order` INT NOT NULL,
    `id_product` INT NOT NULL,
    `quantity` INT NOT NULL,
    `price` INT NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id_order`,`id_product`),
    FOREIGN KEY(`id_order`) REFERENCES mp_order(`id`),
    FOREIGN KEY(`id_product`) REFERENCES mp_product(`id`)
) COMMENT = 'Order detail' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_discount`
--

CREATE TABLE IF NOT EXISTS `mp_discount`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `voucher_code` VARCHAR(100),
    `min_price` INT NOT NULL,
    `value` INT NOT NULL,
    `max_dis_cost` INT NOT NULL,
    `date_exprired` DATETIME NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modify` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) COMMENT = 'Discount' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_dis_applied_product`
--

CREATE TABLE IF NOT EXISTS `mp_dis_applied_product`(
    `id_discount` INT NOT NULL,
    `id_product` INT NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id_discount`,`id_product`),
    FOREIGN KEY(`id_discount`) REFERENCES mp_discount(`id`),
    FOREIGN KEY(`id_product`) REFERENCES mp_product(`id`)
) COMMENT = 'Products are discounted' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

-- --------------------------------------------------------

--
-- Table structure for table `mp_dis_applied_order`
--

CREATE TABLE IF NOT EXISTS `mp_dis_applied_order`(
    `id_discount` INT NOT NULL,
    `id_order` INT NOT NULL,
    `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id_discount`,`id_order`),
    FOREIGN KEY(`id_discount`) REFERENCES mp_discount(`id`),
    FOREIGN KEY(`id_order`) REFERENCES mp_order(`id`)
) COMMENT = 'Order are discounted' DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_vi_0900_as_cs;

/**
  DROP TRIGGER user_modify;
  DROP TRIGGER customer_modify;
  DROP TRIGGER type_product_modify;
  DROP TRIGGER product_modify;
  DROP TRIGGER cart_modify;
  DROP TRIGGER cart_detail_modify;
  DROP TRIGGER warehouse_modify;
  DROP TRIGGER warehouse_detail_modify;
  DROP TRIGGER discount_modify;
  DROP TRIGGER order_modify;
  DROP TRIGGER order_detail_modify;

 */
-- --------------------------------------------------------

--
-- Trriger on table `mp_user`
--

CREATE TRIGGER user_modify
BEFORE UPDATE ON mp_user
FOR EACH ROW
	SET NEW.date_modify = SYSDATE();

-- --------------------------------------------------------

--
-- Trriger on table `mp_customer`
--

CREATE TRIGGER customer_modify
BEFORE UPDATE ON mp_customer
FOR EACH ROW
	SET NEW.date_modify = SYSDATE();

-- --------------------------------------------------------

--
-- Trriger on table `mp_type_product`
--

CREATE TRIGGER type_product_modify
BEFORE UPDATE ON mp_type_product
FOR EACH ROW
	SET NEW.date_modify = SYSDATE();

-- --------------------------------------------------------

--
-- Trriger on table `mp_product`
--

CREATE TRIGGER product_modify
BEFORE UPDATE ON mp_product
FOR EACH ROW
	SET NEW.date_modify = SYSDATE();
    
-- --------------------------------------------------------

--
-- Trriger on table `mp_cart`
--

CREATE TRIGGER cart_modify
BEFORE UPDATE ON mp_cart
FOR EACH ROW
	SET NEW.date_modify = SYSDATE();

-- --------------------------------------------------------

--
-- Trriger on table `mp_cart_detail`
--

CREATE TRIGGER cart_detail_modify
BEFORE UPDATE ON mp_cart_detail
FOR EACH ROW
	SET NEW.date_modify = SYSDATE();

-- --------------------------------------------------------

--
-- Trriger on table `mp_warehouse`
--

CREATE TRIGGER warehouse_modify
BEFORE UPDATE ON mp_warehouse
FOR EACH ROW
	SET NEW.date_modify = SYSDATE();

-- --------------------------------------------------------

--
-- Trriger on table `mp_warehouse_detail`
--

CREATE TRIGGER warehouse_detail_modify
BEFORE UPDATE ON mp_warehouse_detail
FOR EACH ROW
	SET NEW.date_modify = SYSDATE();

-- --------------------------------------------------------

--
-- Trriger on table `mp_discount`
--

CREATE TRIGGER discount_modify
BEFORE UPDATE ON mp_discount
FOR EACH ROW
	SET NEW.date_modify = SYSDATE();

-- --------------------------------------------------------

--
-- Trriger on table `mp_order`
--

CREATE TRIGGER order_modify
BEFORE UPDATE ON mp_order
FOR EACH ROW
	SET NEW.date_modify = SYSDATE();

-- --------------------------------------------------------

--
-- Trriger on table `mp_order_detail`
--

CREATE TRIGGER order_detail_modify
BEFORE UPDATE ON mp_order_detail
FOR EACH ROW
	SET NEW.date_modify = SYSDATE();


-- --------------------------- Views
-- 
-- User View
--

CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `view_user` (`id` , `account` , `password` , `fullName` , `email` , `phone` , `address` , `city` , `province` , `status` , `userCreatedDate` , `passwordModifyDate` , `userModifyDate` , `userLastAccessDate`) AS
    SELECT 
        `u`.`id` AS `id`,
        `u`.`account` AS `account`,
        `u`.`password` AS `password`,
        `c`.`full_name` AS `full_name`,
        `c`.`email` AS `email`,
        `c`.`phone` AS `phone`,
        `c`.`address` AS `address`,
        `c`.`city` AS `city`,
        `c`.`province` AS `province`,
        `c`.`status` AS `status`,
        `u`.`date_created` AS `date_created`,
        `u`.`date_modify` AS `date_modify`,
        `c`.`date_modify` AS `date_modify`,
        `c`.`date_last_access` AS `date_last_access`
    FROM
        (`mp_user` `u`
        JOIN `mp_customer` `c` ON ((`u`.`id` = `c`.`id_user`)));
-- PROCEDURE CREATE USER
DELIMITER $$ ;
CREATE DEFINER=`root`@`localhost` PROCEDURE `createUser`(
	`account` VARCHAR(100),
    `password` VARCHAR(100),
    `fullName` VARCHAR(100),
    `email` VARCHAR(100),
    `phone` VARCHAR(10),
    `address` VARCHAR(200),
    `city` VARCHAR(50),
    `province` VARCHAR(50)
)
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
	START TRANSACTION;
    INSERT INTO `mp`.`mp_user`(`account`,`password`) VALUES (account, password);
    
    SELECT @ID:=id
    FROM mp_user
    ORDER BY id DESC
    LIMIT 1;
    
    INSERT INTO `mp`.`mp_customer` (`id_user`, `full_name`, `email`, `phone`, `address`, `city`, `province`) 
		VALUES (@ID, fullName, email, phone, address, city, province);
    COMMIT;
END;
-- PROCEDURE DELETE USER
DELIMITER $$ ;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteUser`(
	`account` VARCHAR(100)
)
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
	START TRANSACTION;
    SELECT id into @ID
    FROM mp_user
    WHERE mp_user.account = account;
    
    DELETE FROM mp_customer WHERE mp_customer.id_user = @ID;
    DELETE FROM mp_user WHERE mp_user.account = account;
    COMMIT;
END;
