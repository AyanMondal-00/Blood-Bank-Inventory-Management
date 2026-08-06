-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: blood_bank_db
-- ------------------------------------------------------
-- Server version	8.0.46

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
  `batch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entry_date` date NOT NULL,
  `received_by` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `blood_type` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `component_type` enum('WHOLE BLOOD','PACKED CELLS (SAGM)','CONC. RBC''S','FFP','PLATELET CONC.','CRYO PPT (AHF)','CPP') COLLATE utf8mb4_unicode_ci NOT NULL,
  `government_price` decimal(10,2) NOT NULL,
  `received_unit` int NOT NULL,
  `available_unit` int NOT NULL DEFAULT '0',
  `expiry_date` date NOT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_batch` (`batch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_inventory`
--

LOCK TABLES `blood_inventory` WRITE;
/*!40000 ALTER TABLE `blood_inventory` DISABLE KEYS */;
INSERT INTO `blood_inventory` VALUES (1,'B-20260804-0001','2026-08-04','Ayan Mondal','A+','WHOLE BLOOD',560.00,10,5,'2026-09-08','Initial inventory seed','2026-08-04 04:30:00','2026-08-05 13:42:21'),(2,'B-20260804-0002','2026-08-04','Spandan Koner','B+','PLATELET CONC.',650.00,5,3,'2026-08-09','Seeded platelet batch','2026-08-04 04:35:00','2026-08-04 04:45:00'),(3,'B-20260805-9922','2026-08-05','Abhra Podder','A+','WHOLE BLOOD',1600.00,5,5,'2026-09-08','','2026-08-05 13:07:02','2026-08-05 13:07:02'),(4,'B-20260805-9922','2026-08-05','Abhra Podder','A+','PACKED CELLS (SAGM)',1600.00,6,2,'2026-09-15','','2026-08-05 13:07:02','2026-08-05 13:07:20'),(5,'B-20260805-9922','2026-08-05','Abhra Podder','A+','CONC. RBC\'S',650.00,6,6,'2026-09-08','','2026-08-05 13:07:02','2026-08-05 13:07:02'),(6,'B-20260805-9922','2026-08-05','Abhra Podder','A+','FFP',750.00,9,9,'2027-08-04','','2026-08-05 13:07:02','2026-08-05 13:07:02'),(7,'B-20260805-9922','2026-08-05','Abhra Podder','A+','PLATELET CONC.',700.00,8,8,'2026-08-10','','2026-08-05 13:07:02','2026-08-05 13:07:02'),(8,'B-20260805-9922','2026-08-05','Abhra Podder','A+','CRYO PPT (AHF)',600.00,4,4,'2027-08-04','','2026-08-05 13:07:02','2026-08-05 13:07:02'),(9,'B-20260805-9922','2026-08-05','Abhra Podder','A+','CPP',300.00,2,2,'2027-08-04','','2026-08-05 13:07:02','2026-08-05 13:07:02'),(10,'B-20260805-5057','2026-08-02','Abhra Podder','O+','WHOLE BLOOD',560.00,7,7,'2026-09-05','','2026-08-05 13:12:47','2026-08-05 13:12:47'),(11,'B-20260805-5057','2026-08-02','Abhra Podder','O+','PACKED CELLS (SAGM)',540.00,8,8,'2026-09-12','','2026-08-05 13:12:47','2026-08-05 13:12:47'),(12,'B-20260805-5057','2026-08-02','Abhra Podder','O+','CONC. RBC\'S',650.00,6,6,'2026-09-05','','2026-08-05 13:12:47','2026-08-05 13:12:47'),(13,'B-20260805-5057','2026-08-02','Abhra Podder','O+','FFP',750.00,8,8,'2027-08-01','','2026-08-05 13:12:47','2026-08-05 13:12:47'),(14,'B-20260805-5057','2026-08-02','Abhra Podder','O+','PLATELET CONC.',655.00,5,5,'2026-08-07','','2026-08-05 13:12:47','2026-08-05 13:12:47'),(15,'B-20260805-5057','2026-08-02','Abhra Podder','O+','CRYO PPT (AHF)',650.00,4,4,'2027-08-01','','2026-08-05 13:12:47','2026-08-05 13:12:47'),(16,'B-20260805-5057','2026-08-02','Abhra Podder','O+','CPP',750.00,8,8,'2027-08-01','','2026-08-05 13:12:47','2026-08-05 13:12:47'),(17,'B-20260805-1551','2026-08-05','AYAN MONDAL','AB+','WHOLE BLOOD',560.00,5,5,'2026-09-08','','2026-08-05 13:20:32','2026-08-05 13:20:32'),(18,'B-20260805-1551','2026-08-05','AYAN MONDAL','AB+','PACKED CELLS (SAGM)',540.00,6,6,'2026-09-15','','2026-08-05 13:20:32','2026-08-05 13:20:32'),(19,'B-20260805-1551','2026-08-05','AYAN MONDAL','AB+','CONC. RBC\'S',650.00,9,9,'2026-09-08','','2026-08-05 13:20:32','2026-08-05 13:20:32'),(20,'B-20260805-1551','2026-08-05','AYAN MONDAL','AB+','FFP',750.00,2,2,'2027-08-04','','2026-08-05 13:20:32','2026-08-05 13:20:32'),(21,'B-20260805-1551','2026-08-05','AYAN MONDAL','AB+','PLATELET CONC.',655.00,9,9,'2026-08-10','','2026-08-05 13:20:32','2026-08-05 13:20:32'),(22,'B-20260805-1551','2026-08-05','AYAN MONDAL','AB+','CRYO PPT (AHF)',650.00,8,8,'2027-08-04','','2026-08-05 13:20:32','2026-08-05 13:20:32'),(23,'B-20260805-1551','2026-08-05','AYAN MONDAL','AB+','CPP',750.00,3,3,'2027-08-04','','2026-08-05 13:20:32','2026-08-05 13:20:32');
/*!40000 ALTER TABLE `blood_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blood_prices`
--

DROP TABLE IF EXISTS `blood_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blood_prices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `blood_type` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `component_type` enum('WHOLE BLOOD','PACKED CELLS (SAGM)','CONC. RBC''S','FFP','PLATELET CONC.','CRYO PPT (AHF)','CPP') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_blood_component` (`blood_type`,`component_type`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_prices`
--

LOCK TABLES `blood_prices` WRITE;
/*!40000 ALTER TABLE `blood_prices` DISABLE KEYS */;
INSERT INTO `blood_prices` VALUES (1,'A+','WHOLE BLOOD',1600.00,'2026-08-05 13:32:07'),(2,'A+','PACKED CELLS (SAGM)',1600.00,'2026-08-05 13:32:07'),(3,'A+','CONC. RBC\'S',1600.00,'2026-08-05 13:32:07'),(4,'A+','FFP',700.00,'2026-08-05 13:32:07'),(5,'A+','PLATELET CONC.',700.00,'2026-08-05 13:32:07'),(6,'A+','CRYO PPT (AHF)',600.00,'2026-08-05 13:32:07'),(7,'A+','CPP',300.00,'2026-08-05 13:32:07'),(8,'A-','WHOLE BLOOD',1600.00,'2026-08-05 13:32:07'),(9,'A-','PACKED CELLS (SAGM)',1600.00,'2026-08-05 13:32:07'),(10,'A-','CONC. RBC\'S',1600.00,'2026-08-05 13:32:07'),(11,'A-','FFP',700.00,'2026-08-05 13:32:07'),(12,'A-','PLATELET CONC.',700.00,'2026-08-05 13:32:07'),(13,'A-','CRYO PPT (AHF)',600.00,'2026-08-05 13:32:07'),(14,'A-','CPP',300.00,'2026-08-05 13:32:07'),(15,'B+','WHOLE BLOOD',1600.00,'2026-08-05 13:32:07'),(16,'B+','PACKED CELLS (SAGM)',1600.00,'2026-08-05 13:32:07'),(17,'B+','CONC. RBC\'S',1600.00,'2026-08-05 13:32:07'),(18,'B+','FFP',700.00,'2026-08-05 13:32:07'),(19,'B+','PLATELET CONC.',700.00,'2026-08-05 13:32:07'),(20,'B+','CRYO PPT (AHF)',600.00,'2026-08-05 13:32:07'),(21,'B+','CPP',300.00,'2026-08-05 13:32:07'),(22,'B-','WHOLE BLOOD',1600.00,'2026-08-05 13:32:07'),(23,'B-','PACKED CELLS (SAGM)',1600.00,'2026-08-05 13:32:07'),(24,'B-','CONC. RBC\'S',1600.00,'2026-08-05 13:32:07'),(25,'B-','FFP',700.00,'2026-08-05 13:32:07'),(26,'B-','PLATELET CONC.',700.00,'2026-08-05 13:32:07'),(27,'B-','CRYO PPT (AHF)',600.00,'2026-08-05 13:32:07'),(28,'B-','CPP',300.00,'2026-08-05 13:32:07'),(29,'AB+','WHOLE BLOOD',1600.00,'2026-08-05 13:32:07'),(30,'AB+','PACKED CELLS (SAGM)',1600.00,'2026-08-05 13:32:07'),(31,'AB+','CONC. RBC\'S',1600.00,'2026-08-05 13:32:07'),(32,'AB+','FFP',700.00,'2026-08-05 13:32:07'),(33,'AB+','PLATELET CONC.',700.00,'2026-08-05 13:32:07'),(34,'AB+','CRYO PPT (AHF)',600.00,'2026-08-05 13:32:07'),(35,'AB+','CPP',300.00,'2026-08-05 13:32:07'),(36,'AB-','WHOLE BLOOD',1600.00,'2026-08-05 13:32:07'),(37,'AB-','PACKED CELLS (SAGM)',1600.00,'2026-08-05 13:32:07'),(38,'AB-','CONC. RBC\'S',1600.00,'2026-08-05 13:32:07'),(39,'AB-','FFP',700.00,'2026-08-05 13:32:07'),(40,'AB-','PLATELET CONC.',700.00,'2026-08-05 13:32:07'),(41,'AB-','CRYO PPT (AHF)',600.00,'2026-08-05 13:32:07'),(42,'AB-','CPP',300.00,'2026-08-05 13:32:07'),(43,'O+','WHOLE BLOOD',1600.00,'2026-08-05 13:32:07'),(44,'O+','PACKED CELLS (SAGM)',1600.00,'2026-08-05 13:32:07'),(45,'O+','CONC. RBC\'S',1600.00,'2026-08-05 13:32:07'),(46,'O+','FFP',700.00,'2026-08-05 13:32:07'),(47,'O+','PLATELET CONC.',700.00,'2026-08-05 13:32:07'),(48,'O+','CRYO PPT (AHF)',600.00,'2026-08-05 13:32:07'),(49,'O+','CPP',300.00,'2026-08-05 13:32:07'),(50,'O-','WHOLE BLOOD',1600.00,'2026-08-05 13:32:07'),(51,'O-','PACKED CELLS (SAGM)',1600.00,'2026-08-05 13:32:07'),(52,'O-','CONC. RBC\'S',1600.00,'2026-08-05 13:32:07'),(53,'O-','FFP',700.00,'2026-08-05 13:32:07'),(54,'O-','PLATELET CONC.',700.00,'2026-08-05 13:32:07'),(55,'O-','CRYO PPT (AHF)',600.00,'2026-08-05 13:32:07'),(56,'O-','CPP',300.00,'2026-08-05 13:32:07'),(57,'Other','WHOLE BLOOD',1600.00,'2026-08-05 13:32:11'),(58,'Other','PACKED CELLS (SAGM)',1600.00,'2026-08-05 13:32:11'),(59,'Other','CONC. RBC\'S',1600.00,'2026-08-05 13:32:11'),(60,'Other','FFP',700.00,'2026-08-05 13:32:11'),(61,'Other','PLATELET CONC.',700.00,'2026-08-05 13:32:11'),(62,'Other','CRYO PPT (AHF)',600.00,'2026-08-05 13:32:11'),(63,'Other','CPP',300.00,'2026-08-05 13:32:11');
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
  `transaction_type` enum('RECEIVE','ISSUE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `units` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `expiry_date` date NOT NULL,
  `issued_by` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_inventory` (`inventory_id`),
  CONSTRAINT `fk_inventory` FOREIGN KEY (`inventory_id`) REFERENCES `blood_inventory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_transactions`
--

LOCK TABLES `blood_transactions` WRITE;
/*!40000 ALTER TABLE `blood_transactions` DISABLE KEYS */;
INSERT INTO `blood_transactions` VALUES (1,1,'RECEIVE',10,5600.00,'2026-09-08','Ayan Mondal','Initial inventory seed','2026-08-04 10:00:00'),(2,2,'RECEIVE',5,3250.00,'2026-08-09','Spandan Koner','Seeded platelet batch','2026-08-04 10:05:00'),(3,2,'ISSUE',2,1300.00,'2026-08-09','Ayan Mondal','Issued units','2026-08-04 10:15:00'),(4,3,'RECEIVE',5,8000.00,'2026-09-08','Abhra Podder','','2026-08-05 18:37:02'),(5,4,'RECEIVE',6,9600.00,'2026-09-15','Abhra Podder','','2026-08-05 18:37:02'),(6,5,'RECEIVE',6,3900.00,'2026-09-08','Abhra Podder','','2026-08-05 18:37:02'),(7,6,'RECEIVE',9,6750.00,'2027-08-04','Abhra Podder','','2026-08-05 18:37:02'),(8,7,'RECEIVE',8,5600.00,'2026-08-10','Abhra Podder','','2026-08-05 18:37:02'),(9,8,'RECEIVE',4,2400.00,'2027-08-04','Abhra Podder','','2026-08-05 18:37:02'),(10,9,'RECEIVE',2,600.00,'2027-08-04','Abhra Podder','','2026-08-05 18:37:02'),(11,4,'ISSUE',4,6400.00,'2026-09-15','Abhra Podder','','2026-08-05 18:37:20'),(12,10,'RECEIVE',7,3920.00,'2026-09-05','Abhra Podder','','2026-08-05 18:42:47'),(13,11,'RECEIVE',8,4320.00,'2026-09-12','Abhra Podder','','2026-08-05 18:42:47'),(14,12,'RECEIVE',6,3900.00,'2026-09-05','Abhra Podder','','2026-08-05 18:42:47'),(15,13,'RECEIVE',8,6000.00,'2027-08-01','Abhra Podder','','2026-08-05 18:42:47'),(16,14,'RECEIVE',5,3275.00,'2026-08-07','Abhra Podder','','2026-08-05 18:42:47'),(17,15,'RECEIVE',4,2600.00,'2027-08-01','Abhra Podder','','2026-08-05 18:42:47'),(18,16,'RECEIVE',8,6000.00,'2027-08-01','Abhra Podder','','2026-08-05 18:42:47'),(19,17,'RECEIVE',5,2800.00,'2026-09-08','AYAN MONDAL','','2026-08-05 18:50:32'),(20,18,'RECEIVE',6,3240.00,'2026-09-15','AYAN MONDAL','','2026-08-05 18:50:32'),(21,19,'RECEIVE',9,5850.00,'2026-09-08','AYAN MONDAL','','2026-08-05 18:50:32'),(22,20,'RECEIVE',2,1500.00,'2027-08-04','AYAN MONDAL','','2026-08-05 18:50:32'),(23,21,'RECEIVE',9,5895.00,'2026-08-10','AYAN MONDAL','','2026-08-05 18:50:32'),(24,22,'RECEIVE',8,5200.00,'2027-08-04','AYAN MONDAL','','2026-08-05 18:50:32'),(25,23,'RECEIVE',3,2250.00,'2027-08-04','AYAN MONDAL','','2026-08-05 18:50:32'),(26,1,'ISSUE',5,2800.00,'2026-09-08','AYAN MONDAL','','2026-08-05 19:12:21');
/*!40000 ALTER TABLE `blood_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `component_master`
--

DROP TABLE IF EXISTS `component_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `component_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `component_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shelf_life_days` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `component_name` (`component_name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `component_master`
--

LOCK TABLES `component_master` WRITE;
/*!40000 ALTER TABLE `component_master` DISABLE KEYS */;
INSERT INTO `component_master` VALUES (1,'WHOLE BLOOD',34),(2,'PACKED CELLS (SAGM)',41),(3,'CONC. RBC\'S',34),(4,'FFP',364),(5,'PLATELET CONC.',5),(6,'CRYO PPT (AHF)',364),(7,'CPP',364);
/*!40000 ALTER TABLE `component_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Abhra','Podder','abhrap@technoglobalhospital.com','$2b$10$eGGqRwC6WlRuVnYVWIHjI.wPjn/rpclXTPGRivB6WAONgu7XgWBnG','admin','2026-08-05 12:17:13','2026-08-05 12:17:13'),(2,'AYAN','MONDAL','iam.ayanmondal2004@gmail.com','$2b$10$iY0EDjVolH6HgUvfHIaY6u.blDph8cuR7sPu6YtTY73F/rAtaSfHK','user','2026-08-05 13:17:43','2026-08-05 13:17:43');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-06 11:55:25
