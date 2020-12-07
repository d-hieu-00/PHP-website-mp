CREATE DATABASE  IF NOT EXISTS `mp` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_as_cs */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mp`;
-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: mp
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `mp_cart`
--

DROP TABLE IF EXISTS `mp_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mp_cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `mp_cart_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `mp_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_as_cs COMMENT='Cart';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_cart`
--

LOCK TABLES `mp_cart` WRITE;
/*!40000 ALTER TABLE `mp_cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_cart` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `cart_modify` BEFORE UPDATE ON `mp_cart` FOR EACH ROW SET NEW.date_modify = SYSDATE() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mp_cart_detail`
--

DROP TABLE IF EXISTS `mp_cart_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mp_cart_detail` (
  `id_cart` int NOT NULL,
  `id_product` int NOT NULL,
  `quantity` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_cart`,`id_product`),
  KEY `id_product` (`id_product`),
  CONSTRAINT `mp_cart_detail_ibfk_1` FOREIGN KEY (`id_cart`) REFERENCES `mp_cart` (`id`),
  CONSTRAINT `mp_cart_detail_ibfk_2` FOREIGN KEY (`id_product`) REFERENCES `mp_product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_as_cs COMMENT='Cart detail';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_cart_detail`
--

LOCK TABLES `mp_cart_detail` WRITE;
/*!40000 ALTER TABLE `mp_cart_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_cart_detail` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `cart_detail_modify` BEFORE UPDATE ON `mp_cart_detail` FOR EACH ROW SET NEW.date_modify = SYSDATE() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mp_category`
--

DROP TABLE IF EXISTS `mp_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mp_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_as_cs;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_category`
--

LOCK TABLES `mp_category` WRITE;
/*!40000 ALTER TABLE `mp_category` DISABLE KEYS */;
INSERT INTO `mp_category` VALUES (1,'Trang điểm','2020-12-03 04:18:37'),(2,'Chăm sóc da','2020-12-03 04:18:37'),(3,'Chăm sóc tóc','2020-12-03 04:18:37'),(4,'Nước hoa','2020-12-03 04:18:38');
/*!40000 ALTER TABLE `mp_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mp_customer`
--

DROP TABLE IF EXISTS `mp_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mp_customer` (
  `id_user` int NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `phone` varchar(10) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `address` varchar(200) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `city` varchar(50) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `province` varchar(50) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `status` varchar(10) COLLATE utf8mb4_vi_0900_as_cs NOT NULL DEFAULT 'ACTIVE',
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_last_access` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_user`),
  CONSTRAINT `mp_customer_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `mp_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_as_cs COMMENT='Customer';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_customer`
--

LOCK TABLES `mp_customer` WRITE;
/*!40000 ALTER TABLE `mp_customer` DISABLE KEYS */;
INSERT INTO `mp_customer` VALUES (1,'Duy Hiệucc','ndh@gmail.com','123123132','khu phố 6, Linh Trung, Thủ Đức','Hải Phòng city','Thủ Đức','ACTIVE','2020-12-03 23:47:06','2020-12-03 23:47:06'),(2,'Bay Accs','abc@gmail.com','01293281','tổ 1, thị xã AA, Linh Trung, Thủ Đức','Hồ Chí Minh','Thủ Đức','ACTIVE','2020-12-02 21:07:50','2020-11-12 14:14:30'),(4,'Văn Bye','cvb@gmail.com','01235468','adsađâsd adá','HCM','Thủ Đức','ACTIVE','2020-12-02 21:06:28','2020-11-12 15:49:11'),(28,'Văn Nghệ','cvn@gmail.com','0123456','dasd','HCM','Quận 1','ACTIVE','2020-12-01 18:54:08','2020-11-13 16:52:43'),(136,'Nguyễn Duy Hiệuu','hieu@gmail.com','0965690984','Linh Trung, Thủ Đức','Hồ Chí Minh','Thủ Đức','ACTIVE','2020-12-01 01:46:11','2020-11-29 22:25:39'),(138,'giao ban','giaobanngu@gmail.com','0123456789','hvcm','hcm','hcm','ACTIVE','2020-12-01 20:10:02','2020-12-01 20:10:02'),(139,'dasdas','dasas@','21312','dssad','das','dasdas','ACTIVE','2020-12-02 21:49:00','2020-12-02 21:49:00'),(140,'dasdas','dasas@','21312','dssad','das','dasdas','ACTIVE','2020-12-02 22:17:37','2020-12-02 21:49:05'),(141,'dasdas','dasas@','21312','dssad','das','dasdas','ACTIVE','2020-12-02 21:49:09','2020-12-02 21:49:09'),(142,'dasdas','dasas@','21312','dssad','das','dasdas','ACTIVE','2020-12-02 21:49:13','2020-12-02 21:49:13'),(143,'dasdas','dasas@','21312','dssad','das','dasdas','ACTIVE','2020-12-02 21:49:16','2020-12-02 21:49:16'),(144,'dasdas','dasas@','21312','dssad','das','dasdas','ACTIVE','2020-12-02 21:49:20','2020-12-02 21:49:20'),(145,'dasdas','dasas@','21312','dssad','das','dasdas','ACTIVE','2020-12-02 21:49:24','2020-12-02 21:49:24');
/*!40000 ALTER TABLE `mp_customer` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `customer_modify` BEFORE UPDATE ON `mp_customer` FOR EACH ROW SET NEW.date_modify = SYSDATE() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mp_dis_applied_order`
--

DROP TABLE IF EXISTS `mp_dis_applied_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mp_dis_applied_order` (
  `id_discount` int NOT NULL,
  `id_order` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_discount`,`id_order`),
  KEY `id_order` (`id_order`),
  CONSTRAINT `mp_dis_applied_order_ibfk_1` FOREIGN KEY (`id_discount`) REFERENCES `mp_discount` (`id`),
  CONSTRAINT `mp_dis_applied_order_ibfk_2` FOREIGN KEY (`id_order`) REFERENCES `mp_order` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_as_cs COMMENT='Order are discounted';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_dis_applied_order`
--

LOCK TABLES `mp_dis_applied_order` WRITE;
/*!40000 ALTER TABLE `mp_dis_applied_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_dis_applied_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mp_dis_applied_product`
--

DROP TABLE IF EXISTS `mp_dis_applied_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mp_dis_applied_product` (
  `id_discount` int NOT NULL,
  `id_product` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_discount`,`id_product`),
  KEY `id_product` (`id_product`),
  CONSTRAINT `mp_dis_applied_product_ibfk_1` FOREIGN KEY (`id_discount`) REFERENCES `mp_discount` (`id`),
  CONSTRAINT `mp_dis_applied_product_ibfk_2` FOREIGN KEY (`id_product`) REFERENCES `mp_product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_as_cs COMMENT='Products are discounted';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_dis_applied_product`
--

LOCK TABLES `mp_dis_applied_product` WRITE;
/*!40000 ALTER TABLE `mp_dis_applied_product` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_dis_applied_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mp_discount`
--

DROP TABLE IF EXISTS `mp_discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mp_discount` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `voucher_code` varchar(100) COLLATE utf8mb4_vi_0900_as_cs DEFAULT NULL,
  `min_price` int NOT NULL,
  `value` int NOT NULL,
  `max_dis_cost` int NOT NULL,
  `date_exprired` datetime NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_as_cs COMMENT='Discount';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_discount`
--

LOCK TABLES `mp_discount` WRITE;
/*!40000 ALTER TABLE `mp_discount` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_discount` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `discount_modify` BEFORE UPDATE ON `mp_discount` FOR EACH ROW SET NEW.date_modify = SYSDATE() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mp_order`
--

DROP TABLE IF EXISTS `mp_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mp_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `shipping_fee` int NOT NULL,
  `discount_cost` int NOT NULL,
  `total_price` int NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_vi_0900_as_cs DEFAULT 'Chờ xác nhận',
  `phone` varchar(10) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `address` varchar(200) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `city` varchar(50) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `province` varchar(50) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `mp_order_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `mp_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_as_cs COMMENT='Order';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_order`
--

LOCK TABLES `mp_order` WRITE;
/*!40000 ALTER TABLE `mp_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_order` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `order_modify` BEFORE UPDATE ON `mp_order` FOR EACH ROW SET NEW.date_modify = SYSDATE() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mp_order_detail`
--

DROP TABLE IF EXISTS `mp_order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mp_order_detail` (
  `id_order` int NOT NULL,
  `id_product` int NOT NULL,
  `quantity` int NOT NULL,
  `price` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_order`,`id_product`),
  KEY `id_product` (`id_product`),
  CONSTRAINT `mp_order_detail_ibfk_1` FOREIGN KEY (`id_order`) REFERENCES `mp_order` (`id`),
  CONSTRAINT `mp_order_detail_ibfk_2` FOREIGN KEY (`id_product`) REFERENCES `mp_product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_as_cs COMMENT='Order detail';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_order_detail`
--

LOCK TABLES `mp_order_detail` WRITE;
/*!40000 ALTER TABLE `mp_order_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_order_detail` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `order_detail_modify` BEFORE UPDATE ON `mp_order_detail` FOR EACH ROW SET NEW.date_modify = SYSDATE() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mp_product`
--

DROP TABLE IF EXISTS `mp_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mp_product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `brand` varchar(50) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `color` varchar(50) COLLATE utf8mb4_vi_0900_as_cs DEFAULT NULL,
  `price` int NOT NULL,
  `img` longblob,
  `short_discription` text COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `discription` text COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `id_type` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(10) COLLATE utf8mb4_vi_0900_as_cs NOT NULL DEFAULT 'ACTIVE',
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `id_type` (`id_type`),
  CONSTRAINT `mp_product_ibfk_1` FOREIGN KEY (`id_type`) REFERENCES `mp_type_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_as_cs COMMENT='Product';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_product`
--

LOCK TABLES `mp_product` WRITE;
/*!40000 ALTER TABLE `mp_product` DISABLE KEYS */;
INSERT INTO `mp_product` VALUES (1,'Son','M.A.C','#eb4a00',1000000,NULL,'abcdxyz','abcdxyzèghkị',1,'2020-11-12 14:19:50','ACTIVE','2020-12-03 23:03:36');
/*!40000 ALTER TABLE `mp_product` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `product_modify` BEFORE UPDATE ON `mp_product` FOR EACH ROW SET NEW.date_modify = SYSDATE() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mp_type_product`
--

DROP TABLE IF EXISTS `mp_type_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mp_type_product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `id_category` int NOT NULL,
  `status` varchar(10) COLLATE utf8mb4_vi_0900_as_cs NOT NULL DEFAULT 'ACTIVE',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_as_cs COMMENT='Type of product';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_type_product`
--

LOCK TABLES `mp_type_product` WRITE;
/*!40000 ALTER TABLE `mp_type_product` DISABLE KEYS */;
INSERT INTO `mp_type_product` VALUES (1,'Son môi',2,'ACTIVE','2020-11-12 14:15:23','2020-12-03 04:54:35'),(2,'Sữa rửa mặt',1,'ACTIVE','2020-11-12 14:15:23','2020-12-03 05:09:26'),(3,'312',3,'ACTIVE','2020-12-03 05:08:11','2020-12-03 05:09:23'),(4,'3122',4,'ACTIVE','2020-12-03 05:09:01','2020-12-03 05:09:29'),(6,'31222',1,'ACTIVE','2020-12-03 05:09:08','2020-12-03 05:09:08');
/*!40000 ALTER TABLE `mp_type_product` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `type_product_modify` BEFORE UPDATE ON `mp_type_product` FOR EACH ROW SET NEW.date_modify = SYSDATE() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mp_user`
--

DROP TABLE IF EXISTS `mp_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mp_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account` varchar(100) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `img` longblob,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_as_cs COMMENT='User';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_user`
--

LOCK TABLES `mp_user` WRITE;
/*!40000 ALTER TABLE `mp_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `user_modify` BEFORE UPDATE ON `mp_user` FOR EACH ROW SET NEW.date_modify = SYSDATE() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mp_warehouse`
--

DROP TABLE IF EXISTS `mp_warehouse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mp_warehouse` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `address` varchar(200) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `city` varchar(50) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `province` varchar(50) COLLATE utf8mb4_vi_0900_as_cs NOT NULL,
  `status` varchar(100) COLLATE utf8mb4_vi_0900_as_cs NOT NULL DEFAULT 'ACTIVE',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_as_cs COMMENT='Warehouses';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_warehouse`
--

LOCK TABLES `mp_warehouse` WRITE;
/*!40000 ALTER TABLE `mp_warehouse` DISABLE KEYS */;
INSERT INTO `mp_warehouse` VALUES (1,'mcd-012x','21/45 đường số 8, Linh Trung, Thủ Đức','Hồ Chí Mi','Thủ Đức','ACTIVE','2020-12-01 01:57:14','2020-12-03 19:56:13'),(2,'mcd-02','21/45 đường số 8, Linh Trung, Thủ Đức','Hồ Chí Minh','Thủ Đức','ACTIVE','2020-12-01 02:35:17','2020-12-02 21:12:54');
/*!40000 ALTER TABLE `mp_warehouse` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `warehouse_modify` BEFORE UPDATE ON `mp_warehouse` FOR EACH ROW SET NEW.date_modify = SYSDATE() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mp_warehouse_detail`
--

DROP TABLE IF EXISTS `mp_warehouse_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mp_warehouse_detail` (
  `id_warehouse` int NOT NULL,
  `id_product` int NOT NULL,
  `quantity` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_warehouse`,`id_product`),
  KEY `id_product` (`id_product`),
  CONSTRAINT `mp_warehouse_detail_ibfk_1` FOREIGN KEY (`id_warehouse`) REFERENCES `mp_warehouse` (`id`),
  CONSTRAINT `mp_warehouse_detail_ibfk_2` FOREIGN KEY (`id_product`) REFERENCES `mp_product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_as_cs COMMENT='Warehouses detail';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_warehouse_detail`
--

LOCK TABLES `mp_warehouse_detail` WRITE;
/*!40000 ALTER TABLE `mp_warehouse_detail` DISABLE KEYS */;
INSERT INTO `mp_warehouse_detail` VALUES (1,1,10,'2020-12-03 15:58:49','2020-12-03 15:58:49'),(2,1,10,'2020-12-03 15:59:03','2020-12-03 15:59:03');
/*!40000 ALTER TABLE `mp_warehouse_detail` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `warehouse_detail_modify` BEFORE UPDATE ON `mp_warehouse_detail` FOR EACH ROW SET NEW.date_modify = SYSDATE() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Temporary view structure for view `view_user`
--

DROP TABLE IF EXISTS `view_user`;
/*!50001 DROP VIEW IF EXISTS `view_user`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_user` AS SELECT 
 1 AS `id`,
 1 AS `account`,
 1 AS `password`,
 1 AS `fullName`,
 1 AS `email`,
 1 AS `phone`,
 1 AS `address`,
 1 AS `city`,
 1 AS `province`,
 1 AS `status`,
 1 AS `userCreatedDate`,
 1 AS `passwordModifyDate`,
 1 AS `userModifyDate`,
 1 AS `userLastAccessDate`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'mp'
--
/*!50003 DROP PROCEDURE IF EXISTS `createUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `createUser`(IN `acc` VARCHAR(100), IN `pass` VARCHAR(100), IN `fullName` VARCHAR(100), IN `email` VARCHAR(100), IN `phone` VARCHAR(10), IN `address` VARCHAR(200), IN `city` VARCHAR(50), IN `province` VARCHAR(50))
BEGIN

    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

	START TRANSACTION;

    INSERT INTO `mp`.`mp_user`(`account`,`password`) VALUES (acc, pass);

    

    SELECT id INTO @id

    FROM mp_user

    WHERE mp_user.account = acc;

    

    INSERT INTO `mp`.`mp_customer` (`id_user`, `full_name`, `email`, `phone`, `address`, `city`, `province`) 

		VALUES (@id, fullName, email, phone, address, city, province);

	COMMIT;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `deleteUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `view_user`
--

/*!50001 DROP VIEW IF EXISTS `view_user`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_user` (`id`,`account`,`password`,`fullName`,`email`,`phone`,`address`,`city`,`province`,`status`,`userCreatedDate`,`passwordModifyDate`,`userModifyDate`,`userLastAccessDate`) AS select `u`.`id` AS `id`,`u`.`account` AS `account`,`u`.`password` AS `password`,`c`.`full_name` AS `full_name`,`c`.`email` AS `email`,`c`.`phone` AS `phone`,`c`.`address` AS `address`,`c`.`city` AS `city`,`c`.`province` AS `province`,`c`.`status` AS `status`,`u`.`date_created` AS `date_created`,`u`.`date_modify` AS `date_modify`,`c`.`date_modify` AS `date_modify`,`c`.`date_last_access` AS `date_last_access` from (`mp_user` `u` join `mp_customer` `c` on((`u`.`id` = `c`.`id_user`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-04 16:24:43
