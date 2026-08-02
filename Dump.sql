-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: blood_bank_db
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `blood_inventory`
--

DROP TABLE IF EXISTS `blood_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blood_inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entry_date` date NOT NULL,
  `received_by` varchar(100) NOT NULL,
  `blood_type` varchar(5) NOT NULL,
  `government_price` decimal(10,2) NOT NULL,
  `received_unit` int NOT NULL,
  `available_unit` int NOT NULL DEFAULT '0',
  `expiry_date` date NOT NULL,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_received_unit` CHECK ((`received_unit` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_inventory`
--

LOCK TABLES `blood_inventory` WRITE;
/*!40000 ALTER TABLE `blood_inventory` DISABLE KEYS */;
INSERT INTO `blood_inventory` VALUES (1,'2026-08-01','Ayan Mondal','A+',550.00,5,0,'2026-11-26','','2026-08-01 09:28:57','2026-08-01 09:45:29'),(2,'2026-08-01','Spandan Koner ','B+',650.00,10,2,'2026-12-03','','2026-08-01 09:30:26','2026-08-02 17:48:37'),(3,'2026-08-01','Ayan Mondal','AB+',450.00,8,8,'2026-10-20','all enter','2026-08-01 17:31:52','2026-08-01 17:31:52'),(4,'2026-08-02','Ayan Mondal','B+',650.00,99999999,0,'2027-05-19','','2026-08-02 04:23:34','2026-08-02 04:26:42'),(5,'2026-08-02','Ayan Mondal','A+',560.00,996,996,'2027-04-21','','2026-08-02 04:25:14','2026-08-02 04:25:14'),(6,'2026-08-02','Spandan Koner ','A+',560.00,56,36,'2026-12-31','','2026-08-02 05:47:43','2026-08-02 17:34:56'),(7,'2026-08-02','Rivu ','AB+',450.00,5,5,'2026-12-16','','2026-08-02 06:00:03','2026-08-02 06:00:03');
/*!40000 ALTER TABLE `blood_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blood_prices`
--

DROP TABLE IF EXISTS `blood_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blood_prices` (
  `blood_type` varchar(5) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`blood_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_prices`
--

LOCK TABLES `blood_prices` WRITE;
/*!40000 ALTER TABLE `blood_prices` DISABLE KEYS */;
INSERT INTO `blood_prices` VALUES ('A-',600.00,'2026-08-02 18:12:54'),('A+',550.00,'2026-08-02 18:12:54'),('AB-',500.00,'2026-08-02 18:12:54'),('AB+',450.00,'2026-08-02 18:12:54'),('B-',600.00,'2026-08-02 18:12:54'),('B+',650.00,'2026-08-02 18:12:54'),('O-',550.00,'2026-08-02 18:12:54'),('O+',500.00,'2026-08-02 18:12:54');
/*!40000 ALTER TABLE `blood_prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blood_transactions`
--

DROP TABLE IF EXISTS `blood_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blood_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inventory_id` int NOT NULL,
  `transaction_type` enum('RECEIVE','ISSUE') NOT NULL,
  `units` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `expiry_date` date NOT NULL,
  `issued_by` varchar(100) NOT NULL,
  `remarks` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_inventory` (`inventory_id`),
  CONSTRAINT `fk_inventory` FOREIGN KEY (`inventory_id`) REFERENCES `blood_inventory` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_transactions`
--

LOCK TABLES `blood_transactions` WRITE;
/*!40000 ALTER TABLE `blood_transactions` DISABLE KEYS */;
INSERT INTO `blood_transactions` VALUES (1,1,'RECEIVE',5,2750.00,'2026-11-26','Ayan Mondal','','2026-08-01 14:58:58'),(2,2,'RECEIVE',10,6500.00,'2026-12-03','Spandan Koner ','','2026-08-01 15:00:26'),(3,2,'ISSUE',5,3250.00,'2026-12-03','Kamlesh Maity','','2026-08-01 15:08:27'),(4,1,'ISSUE',5,2750.00,'2026-11-26','Kamlesh Maity','','2026-08-01 15:15:29'),(5,3,'RECEIVE',8,3600.00,'2026-10-20','Ayan Mondal','all enter','2026-08-01 23:01:52'),(6,2,'ISSUE',1,650.00,'2026-12-03','Ayan Mondal','','2026-08-02 09:48:23'),(7,5,'RECEIVE',996,557760.00,'2027-04-21','Ayan Mondal','','2026-08-02 09:55:14'),(8,6,'RECEIVE',56,31360.00,'2026-12-31','Spandan Koner ','','2026-08-02 11:17:43'),(9,7,'RECEIVE',5,2250.00,'2026-12-16','Rivu ','','2026-08-02 11:30:03'),(10,6,'ISSUE',20,11200.00,'2026-12-31','Ayan Mondal','','2026-08-02 23:04:56'),(11,2,'ISSUE',2,1300.00,'2026-12-03','Rupam','','2026-08-02 23:18:37');
/*!40000 ALTER TABLE `blood_transactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-02 23:44:11
