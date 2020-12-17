-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 17, 2020 lúc 08:50 AM
-- Phiên bản máy phục vụ: 10.4.14-MariaDB
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
CREATE DATABASE IF NOT EXISTS `mp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `mp`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_cart`
--

DROP TABLE IF EXISTS `mp_cart`;
CREATE TABLE IF NOT EXISTS `mp_cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modify` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Cart';

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_cart_detail`
--

DROP TABLE IF EXISTS `mp_cart_detail`;
CREATE TABLE IF NOT EXISTS `mp_cart_detail` (
  `id_cart` int(11) NOT NULL,
  `id_product` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modify` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_cart`,`id_product`),
  KEY `id_product` (`id_product`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Cart detail';

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_category`
--

DROP TABLE IF EXISTS `mp_category`;
CREATE TABLE IF NOT EXISTS `mp_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_customer`
--

DROP TABLE IF EXISTS `mp_customer`;
CREATE TABLE IF NOT EXISTS `mp_customer` (
  `id_user` int(11) NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `phone` varchar(10) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `address` varchar(200) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `city` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `province` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `status` varchar(10) COLLATE utf8mb4_vietnamese_ci NOT NULL DEFAULT 'ACTIVE',
  `date_modify` datetime NOT NULL DEFAULT current_timestamp(),
  `date_last_access` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Customer';

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_order`
--

DROP TABLE IF EXISTS `mp_order`;
CREATE TABLE IF NOT EXISTS `mp_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) DEFAULT NULL,
  `shipping_fee` int(11) NOT NULL,
  `total_price` int(11) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT 'Chờ xác nhận',
  `full_name` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `phone` varchar(10) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `address` varchar(200) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `city` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `province` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modify` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Order';

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_order_detail`
--

DROP TABLE IF EXISTS `mp_order_detail`;
CREATE TABLE IF NOT EXISTS `mp_order_detail` (
  `id_order` int(11) NOT NULL,
  `id_product` int(11) NOT NULL,
  `id_warehouse` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modify` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_order`,`id_product`),
  KEY `id_product` (`id_product`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Order detail';

--
-- Bẫy `mp_order_detail`
--
DROP TRIGGER IF EXISTS `order_detail_modify`;
DELIMITER $$
CREATE TRIGGER `order_detail_modify` BEFORE UPDATE ON `mp_order_detail` FOR EACH ROW SET NEW.date_modify = SYSDATE()
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_product`
--

DROP TABLE IF EXISTS `mp_product`;
CREATE TABLE IF NOT EXISTS `mp_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `brand` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `color` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `price` int(11) NOT NULL,
  `img` longblob DEFAULT NULL,
  `short_discription` text COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `discription` text COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `id_type` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `status` varchar(10) COLLATE utf8mb4_vietnamese_ci NOT NULL DEFAULT 'ACTIVE',
  `date_modify` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `id_type` (`id_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Product';

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_type_product`
--

DROP TABLE IF EXISTS `mp_type_product`;
CREATE TABLE IF NOT EXISTS `mp_type_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf16_vietnamese_ci NOT NULL,
  `id_category` int(11) NOT NULL,
  `status` varchar(10) COLLATE utf16_vietnamese_ci NOT NULL DEFAULT 'ACTIVE',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modify` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_vietnamese_ci COMMENT='Type of product';

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_user`
--

DROP TABLE IF EXISTS `mp_user`;
CREATE TABLE IF NOT EXISTS `mp_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `img` longblob DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modify` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `account` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='User';

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_warehouse`
--

DROP TABLE IF EXISTS `mp_warehouse`;
CREATE TABLE IF NOT EXISTS `mp_warehouse` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `address` varchar(200) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `city` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `province` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `status` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL DEFAULT 'ACTIVE',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modify` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Warehouses';

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mp_warehouse_detail`
--

DROP TABLE IF EXISTS `mp_warehouse_detail`;
CREATE TABLE IF NOT EXISTS `mp_warehouse_detail` (
  `id_warehouse` int(11) NOT NULL,
  `id_product` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modify` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_warehouse`,`id_product`),
  KEY `id_product` (`id_product`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Warehouses detail';

-- --------------------------------------------------------

--
-- Cấu trúc đóng vai cho view `view_user`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `view_user`;
CREATE TABLE IF NOT EXISTS `view_user` (
`id` int(11)
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

DROP VIEW IF EXISTS `view_user`;
CREATE OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_user`  AS SELECT `u`.`id` AS `id`, `u`.`account` AS `account`, `u`.`password` AS `password`, `c`.`full_name` AS `fullName`, `c`.`email` AS `email`, `c`.`phone` AS `phone`, `c`.`address` AS `address`, `c`.`city` AS `city`, `c`.`province` AS `province`, `c`.`status` AS `status`, `u`.`date_created` AS `userCreatedDate`, `u`.`date_modify` AS `passwordModifyDate`, `c`.`date_modify` AS `userModifyDate`, `c`.`date_last_access` AS `userLastAccessDate` FROM (`mp_user` `u` join `mp_customer` `c` on(`u`.`id` = `c`.`id_user`)) ;

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
