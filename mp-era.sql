-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 09, 2020 lúc 05:11 PM
-- Phiên bản máy phục vụ: 8.0.22
-- Phiên bản PHP: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `mp`
--
CREATE DATABASE IF NOT EXISTS `mp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci;
USE `mp`;

DELIMITER $$
--
-- Thủ tục
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `createUser` (IN `acc` VARCHAR(100), IN `pass` VARCHAR(100), IN `fullName` VARCHAR(100), IN `email` VARCHAR(100), IN `phone` VARCHAR(10), IN `address` VARCHAR(200), IN `city` VARCHAR(50), IN `province` VARCHAR(50))  BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
	START TRANSACTION;
    INSERT INTO `mp`.`mp_user`(`account`,`password`) VALUES (acc, pass);
    
    SELECT id INTO @id
    FROM mp_user
    WHERE mp_user.account = acc;
    
    INSERT INTO `mp`.`mp_customer` (`id_user`, `full_name`, `email`, `phone`, `address`, `city`, `province`) 
		VALUES (@id, fullName, email, phone, address, city, province);
    INSERT INTO `mp`.`mp_cart` (`id_user`) 
		VALUES (@id);
	COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteUser` (`account` VARCHAR(100))  BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
	START TRANSACTION;
    SELECT id into @ID
    FROM mp_user
    WHERE mp_user.account = account;
    
    DELETE FROM mp_customer WHERE mp_customer.id_user = @ID;
    DELETE FROM mp_user WHERE mp_user.account = account;
    COMMIT;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_cart`
--

CREATE TABLE `mp_cart` (
  `id` int NOT NULL,
  `id_user` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Cart';

--
-- Bẫy `mp_cart`
--
DELIMITER $$
CREATE TRIGGER `cart_modify` BEFORE UPDATE ON `mp_cart` FOR EACH ROW SET NEW.date_modify = SYSDATE()
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_cart_detail`
--

CREATE TABLE `mp_cart_detail` (
  `id_cart` int NOT NULL,
  `id_product` int NOT NULL,
  `quantity` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Cart detail';

--
-- Bẫy `mp_cart_detail`
--
DELIMITER $$
CREATE TRIGGER `cart_detail_modify` BEFORE UPDATE ON `mp_cart_detail` FOR EACH ROW SET NEW.date_modify = SYSDATE()
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_category`
--

CREATE TABLE `mp_category` (
  `id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `mp_category`
--

INSERT INTO `mp_category` VALUES(1, 'Trang điểm', '2020-12-03 04:18:37');
INSERT INTO `mp_category` VALUES(2, 'Chăm sóc da', '2020-12-03 04:18:37');
INSERT INTO `mp_category` VALUES(3, 'Chăm sóc tóc', '2020-12-03 04:18:37');
INSERT INTO `mp_category` VALUES(4, 'Nước hoa', '2020-12-03 04:18:38');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_customer`
--

CREATE TABLE `mp_customer` (
  `id_user` int NOT NULL,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `phone` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL DEFAULT 'ACTIVE',
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_last_access` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Customer';

--
-- Bẫy `mp_customer`
--
DELIMITER $$
CREATE TRIGGER `customer_modify` BEFORE UPDATE ON `mp_customer` FOR EACH ROW SET NEW.date_modify = SYSDATE()
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_order`
--

CREATE TABLE `mp_order` (
  `id` int NOT NULL,
  `id_user` int NOT NULL,
  `shipping_fee` int NOT NULL,
  `discount_cost` int NOT NULL,
  `total_price` int NOT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs DEFAULT 'Chờ xác nhận',
  `phone` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Order';

--
-- Bẫy `mp_order`
--
DELIMITER $$
CREATE TRIGGER `order_modify` BEFORE UPDATE ON `mp_order` FOR EACH ROW SET NEW.date_modify = SYSDATE()
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_order_detail`
--

CREATE TABLE `mp_order_detail` (
  `id_order` int NOT NULL,
  `id_product` int NOT NULL,
  `quantity` int NOT NULL,
  `price` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Order detail';

--
-- Bẫy `mp_order_detail`
--
DELIMITER $$
CREATE TRIGGER `order_detail_modify` BEFORE UPDATE ON `mp_order_detail` FOR EACH ROW SET NEW.date_modify = SYSDATE()
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_product`
--

CREATE TABLE `mp_product` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `brand` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `color` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs DEFAULT NULL,
  `price` int NOT NULL,
  `img` longblob,
  `short_discription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `discription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `id_type` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL DEFAULT 'ACTIVE',
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Product';

--
-- Bẫy `mp_product`
--
DELIMITER $$
CREATE TRIGGER `product_modify` BEFORE UPDATE ON `mp_product` FOR EACH ROW SET NEW.date_modify = SYSDATE()
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_type_product`
--

CREATE TABLE `mp_type_product` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `id_category` int NOT NULL,
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL DEFAULT 'ACTIVE',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Type of product';

--
-- Bẫy `mp_type_product`
--
DELIMITER $$
CREATE TRIGGER `type_product_modify` BEFORE UPDATE ON `mp_type_product` FOR EACH ROW SET NEW.date_modify = SYSDATE()
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_user`
--

CREATE TABLE `mp_user` (
  `id` int NOT NULL,
  `account` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `img` longblob,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='User';

--
-- Bẫy `mp_user`
--
DELIMITER $$
CREATE TRIGGER `user_modify` BEFORE UPDATE ON `mp_user` FOR EACH ROW SET NEW.date_modify = SYSDATE()
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_warehouse`
--

CREATE TABLE `mp_warehouse` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs NOT NULL DEFAULT 'ACTIVE',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Warehouses';

--
-- Bẫy `mp_warehouse`
--
DELIMITER $$
CREATE TRIGGER `warehouse_modify` BEFORE UPDATE ON `mp_warehouse` FOR EACH ROW SET NEW.date_modify = SYSDATE()
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_warehouse_detail`
--

CREATE TABLE `mp_warehouse_detail` (
  `id_warehouse` int NOT NULL,
  `id_product` int NOT NULL,
  `quantity` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Warehouses detail';

--
-- Bẫy `mp_warehouse_detail`
--
DELIMITER $$
CREATE TRIGGER `warehouse_detail_modify` BEFORE UPDATE ON `mp_warehouse_detail` FOR EACH ROW SET NEW.date_modify = SYSDATE()
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc đóng vai cho view `view_user`
-- (See below for the actual view)
--
CREATE TABLE `view_user` (
`id` int
,`account` varchar(100)
,`password` varchar(100)
,`fullName` varchar(100)
,`email` varchar(100)
,`phone` varchar(10)
,`address` varchar(200)
,`city` varchar(50)
,`province` varchar(50)
,`status` varchar(10)
,`userCreatedDate` datetime
,`passwordModifyDate` datetime
,`userModifyDate` datetime
,`userLastAccessDate` datetime
);

-- --------------------------------------------------------

--
-- Cấu trúc cho view `view_user`
--
DROP TABLE IF EXISTS `view_user`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_user` (`id`, `account`, `password`, `fullName`, `email`, `phone`, `address`, `city`, `province`, `status`, `userCreatedDate`, `passwordModifyDate`, `userModifyDate`, `userLastAccessDate`) AS   select `u`.`id` AS `id`,`u`.`account` AS `account`,`u`.`password` AS `password`,`c`.`full_name` AS `full_name`,`c`.`email` AS `email`,`c`.`phone` AS `phone`,`c`.`address` AS `address`,`c`.`city` AS `city`,`c`.`province` AS `province`,`c`.`status` AS `status`,`u`.`date_created` AS `date_created`,`u`.`date_modify` AS `date_modify`,`c`.`date_modify` AS `date_modify`,`c`.`date_last_access` AS `date_last_access` from (`mp_user` `u` join `mp_customer` `c` on((`u`.`id` = `c`.`id_user`)))  ;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `mp_cart`
--
ALTER TABLE `mp_cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Chỉ mục cho bảng `mp_cart_detail`
--
ALTER TABLE `mp_cart_detail`
  ADD PRIMARY KEY (`id_cart`,`id_product`),
  ADD KEY `id_product` (`id_product`);

--
-- Chỉ mục cho bảng `mp_category`
--
ALTER TABLE `mp_category`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `mp_customer`
--
ALTER TABLE `mp_customer`
  ADD PRIMARY KEY (`id_user`);

--
-- Chỉ mục cho bảng `mp_order`
--
ALTER TABLE `mp_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Chỉ mục cho bảng `mp_order_detail`
--
ALTER TABLE `mp_order_detail`
  ADD PRIMARY KEY (`id_order`,`id_product`),
  ADD KEY `id_product` (`id_product`);

--
-- Chỉ mục cho bảng `mp_product`
--
ALTER TABLE `mp_product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `id_type` (`id_type`);

--
-- Chỉ mục cho bảng `mp_type_product`
--
ALTER TABLE `mp_type_product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `mp_user`
--
ALTER TABLE `mp_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `account` (`account`);

--
-- Chỉ mục cho bảng `mp_warehouse`
--
ALTER TABLE `mp_warehouse`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `mp_warehouse_detail`
--
ALTER TABLE `mp_warehouse_detail`
  ADD PRIMARY KEY (`id_warehouse`,`id_product`),
  ADD KEY `id_product` (`id_product`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `mp_cart`
--
ALTER TABLE `mp_cart`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `mp_category`
--
ALTER TABLE `mp_category`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `mp_order`
--
ALTER TABLE `mp_order`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `mp_product`
--
ALTER TABLE `mp_product`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `mp_type_product`
--
ALTER TABLE `mp_type_product`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `mp_user`
--
ALTER TABLE `mp_user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `mp_warehouse`
--
ALTER TABLE `mp_warehouse`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `mp_cart`
--
ALTER TABLE `mp_cart`
  ADD CONSTRAINT `mp_cart_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `mp_user` (`id`);

--
-- Các ràng buộc cho bảng `mp_cart_detail`
--
ALTER TABLE `mp_cart_detail`
  ADD CONSTRAINT `mp_cart_detail_ibfk_1` FOREIGN KEY (`id_cart`) REFERENCES `mp_cart` (`id`),
  ADD CONSTRAINT `mp_cart_detail_ibfk_2` FOREIGN KEY (`id_product`) REFERENCES `mp_product` (`id`);

--
-- Các ràng buộc cho bảng `mp_customer`
--
ALTER TABLE `mp_customer`
  ADD CONSTRAINT `mp_customer_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `mp_user` (`id`);

--
-- Các ràng buộc cho bảng `mp_order`
--
ALTER TABLE `mp_order`
  ADD CONSTRAINT `mp_order_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `mp_user` (`id`);

--
-- Các ràng buộc cho bảng `mp_order_detail`
--
ALTER TABLE `mp_order_detail`
  ADD CONSTRAINT `mp_order_detail_ibfk_1` FOREIGN KEY (`id_order`) REFERENCES `mp_order` (`id`),
  ADD CONSTRAINT `mp_order_detail_ibfk_2` FOREIGN KEY (`id_product`) REFERENCES `mp_product` (`id`);

--
-- Các ràng buộc cho bảng `mp_product`
--
ALTER TABLE `mp_product`
  ADD CONSTRAINT `mp_product_ibfk_1` FOREIGN KEY (`id_type`) REFERENCES `mp_type_product` (`id`);

--
-- Các ràng buộc cho bảng `mp_warehouse_detail`
--
ALTER TABLE `mp_warehouse_detail`
  ADD CONSTRAINT `mp_warehouse_detail_ibfk_1` FOREIGN KEY (`id_warehouse`) REFERENCES `mp_warehouse` (`id`),
  ADD CONSTRAINT `mp_warehouse_detail_ibfk_2` FOREIGN KEY (`id_product`) REFERENCES `mp_product` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
