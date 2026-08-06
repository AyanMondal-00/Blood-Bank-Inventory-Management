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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_inventory`
--

LOCK TABLES `blood_inventory` WRITE;
/*!40000 ALTER TABLE `blood_inventory` DISABLE KEYS */;
INSERT INTO `blood_inventory` VALUES (1,'B-20260805-1826','2026-08-05','Ayan  Mondal','A+','WHOLE BLOOD',560.00,2,2,'2026-09-09','','2026-08-05 11:11:52','2026-08-05 11:11:52'),(2,'B-20260805-1826','2026-08-05','Ayan  Mondal','A+','PACKED CELLS (SAGM)',540.00,7,5,'2026-09-16','','2026-08-05 11:11:52','2026-08-05 11:14:10'),(3,'B-20260805-1826','2026-08-05','Ayan  Mondal','A+','CONC. RBC\'S',650.00,5,5,'2026-09-09','','2026-08-05 11:11:52','2026-08-05 11:11:52'),(4,'B-20260805-1826','2026-08-05','Ayan  Mondal','A+','FFP',750.00,3,3,'2027-08-05','','2026-08-05 11:11:52','2026-08-05 11:11:52'),(5,'B-20260805-1826','2026-08-05','Ayan  Mondal','A+','PLATELET CONC.',650.00,6,6,'2026-08-10','','2026-08-05 11:11:52','2026-08-05 11:11:52'),(6,'B-20260805-1826','2026-08-05','Ayan  Mondal','A+','CRYO PPT (AHF)',650.00,4,4,'2027-08-05','','2026-08-05 11:11:52','2026-08-05 11:11:52'),(7,'B-20260805-1826','2026-08-05','Ayan  Mondal','A+','CPP',750.00,8,8,'2027-08-05','','2026-08-05 11:11:52','2026-08-05 11:11:52');
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
  `blood_type` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `component_type` enum('WHOLE BLOOD','PACKED CELLS (SAGM)','CONC. RBC''S','FFP','PLATELET CONC.','CRYO PPT (AHF)','CPP') COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_blood_component` (`blood_type`,`component_type`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_prices`
--

LOCK TABLES `blood_prices` WRITE;
/*!40000 ALTER TABLE `blood_prices` DISABLE KEYS */;
INSERT INTO `blood_prices` VALUES (1,'A+','WHOLE BLOOD',1600.00,'2026-08-05 19:02:07'),(2,'A+','PACKED CELLS (SAGM)',1600.00,'2026-08-05 19:02:07'),(3,'A+','CONC. RBC\'S',1600.00,'2026-08-05 19:02:07'),(4,'A+','FFP',700.00,'2026-08-05 19:02:07'),(5,'A+','PLATELET CONC.',700.00,'2026-08-05 19:02:07'),(6,'A+','CRYO PPT (AHF)',600.00,'2026-08-05 19:02:07'),(7,'A+','CPP',300.00,'2026-08-05 19:02:07'),(15,'A-','WHOLE BLOOD',1600.00,'2026-08-05 19:02:07'),(16,'A-','PACKED CELLS (SAGM)',1600.00,'2026-08-05 19:02:07'),(17,'A-','CONC. RBC\'S',1600.00,'2026-08-05 19:02:07'),(18,'A-','FFP',700.00,'2026-08-05 19:02:07'),(19,'A-','PLATELET CONC.',700.00,'2026-08-05 19:02:07'),(20,'A-','CRYO PPT (AHF)',600.00,'2026-08-05 19:02:07'),(21,'A-','CPP',300.00,'2026-08-05 19:02:07'),(22,'B+','WHOLE BLOOD',1600.00,'2026-08-05 19:02:07'),(23,'B+','PACKED CELLS (SAGM)',1600.00,'2026-08-05 19:02:07'),(24,'B+','CONC. RBC\'S',1600.00,'2026-08-05 19:02:07'),(25,'B+','FFP',700.00,'2026-08-05 19:02:07'),(26,'B+','PLATELET CONC.',700.00,'2026-08-05 19:02:07'),(27,'B+','CRYO PPT (AHF)',600.00,'2026-08-05 19:02:07'),(28,'B+','CPP',300.00,'2026-08-05 19:02:07'),(29,'B-','WHOLE BLOOD',1600.00,'2026-08-05 19:02:07'),(30,'B-','PACKED CELLS (SAGM)',1600.00,'2026-08-05 19:02:07'),(31,'B-','CONC. RBC\'S',1600.00,'2026-08-05 19:02:07'),(32,'B-','FFP',700.00,'2026-08-05 19:02:07'),(33,'B-','PLATELET CONC.',700.00,'2026-08-05 19:02:07'),(34,'B-','CRYO PPT (AHF)',600.00,'2026-08-05 19:02:07'),(35,'B-','CPP',300.00,'2026-08-05 19:02:07'),(36,'AB+','WHOLE BLOOD',1600.00,'2026-08-05 19:02:07'),(37,'AB+','PACKED CELLS (SAGM)',1600.00,'2026-08-05 19:02:07'),(38,'AB+','CONC. RBC\'S',1600.00,'2026-08-05 19:02:07'),(39,'AB+','FFP',700.00,'2026-08-05 19:02:07'),(40,'AB+','PLATELET CONC.',700.00,'2026-08-05 19:02:07'),(41,'AB+','CRYO PPT (AHF)',600.00,'2026-08-05 19:02:07'),(42,'AB+','CPP',300.00,'2026-08-05 19:02:07'),(43,'AB-','WHOLE BLOOD',1600.00,'2026-08-05 19:02:07'),(44,'AB-','PACKED CELLS (SAGM)',1600.00,'2026-08-05 19:02:07'),(45,'AB-','CONC. RBC\'S',1600.00,'2026-08-05 19:02:07'),(46,'AB-','FFP',700.00,'2026-08-05 19:02:07'),(47,'AB-','PLATELET CONC.',700.00,'2026-08-05 19:02:07'),(48,'AB-','CRYO PPT (AHF)',600.00,'2026-08-05 19:02:07'),(49,'AB-','CPP',300.00,'2026-08-05 19:02:07'),(50,'O+','WHOLE BLOOD',1600.00,'2026-08-05 19:02:07'),(51,'O+','PACKED CELLS (SAGM)',1600.00,'2026-08-05 19:02:07'),(52,'O+','CONC. RBC\'S',1600.00,'2026-08-05 19:02:07'),(53,'O+','FFP',700.00,'2026-08-05 19:02:07'),(54,'O+','PLATELET CONC.',700.00,'2026-08-05 19:02:07'),(55,'O+','CRYO PPT (AHF)',600.00,'2026-08-05 19:02:07'),(56,'O+','CPP',300.00,'2026-08-05 19:02:07'),(57,'O-','WHOLE BLOOD',1600.00,'2026-08-05 19:02:07'),(58,'O-','PACKED CELLS (SAGM)',1600.00,'2026-08-05 19:02:07'),(59,'O-','CONC. RBC\'S',1600.00,'2026-08-05 19:02:07'),(60,'O-','FFP',700.00,'2026-08-05 19:02:07'),(61,'O-','PLATELET CONC.',700.00,'2026-08-05 19:02:07'),(62,'O-','CRYO PPT (AHF)',600.00,'2026-08-05 19:02:07'),(63,'O-','CPP',300.00,'2026-08-05 19:02:07'),(65,'Other','WHOLE BLOOD',1600.00,'2026-08-05 19:02:07'),(66,'Other','PACKED CELLS (SAGM)',1600.00,'2026-08-05 19:02:07'),(67,'Other','CONC. RBC\'S',1600.00,'2026-08-05 19:02:07'),(68,'Other','FFP',700.00,'2026-08-05 19:02:07'),(69,'Other','PLATELET CONC.',700.00,'2026-08-05 19:02:07'),(70,'Other','CRYO PPT (AHF)',600.00,'2026-08-05 19:02:07'),(71,'Other','CPP',300.00,'2026-08-05 19:02:07');
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_transactions`
--

LOCK TABLES `blood_transactions` WRITE;
/*!40000 ALTER TABLE `blood_transactions` DISABLE KEYS */;
INSERT INTO `blood_transactions` VALUES (1,1,'RECEIVE',2,1120.00,'2026-09-09','Ayan  Mondal','','2026-08-05 16:41:52'),(2,2,'RECEIVE',7,3780.00,'2026-09-16','Ayan  Mondal','','2026-08-05 16:41:52'),(3,3,'RECEIVE',5,3250.00,'2026-09-09','Ayan  Mondal','','2026-08-05 16:41:52'),(4,4,'RECEIVE',3,2250.00,'2027-08-05','Ayan  Mondal','','2026-08-05 16:41:52'),(5,5,'RECEIVE',6,3900.00,'2026-08-10','Ayan  Mondal','','2026-08-05 16:41:52'),(6,6,'RECEIVE',4,2600.00,'2027-08-05','Ayan  Mondal','','2026-08-05 16:41:52'),(7,7,'RECEIVE',8,6000.00,'2027-08-05','Ayan  Mondal','','2026-08-05 16:41:52'),(8,2,'ISSUE',2,1080.00,'2026-09-16','Ayan  Mondal','','2026-08-05 16:44:10');
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
INSERT INTO `users` VALUES (1,'Ayan ','Mondal','iam.ayanmondal2004@gmail.com','$2b$10$/j80FzRQuO/UPG4NA3wGGu7e7rWi/qHjaXrV1wykYKtYn4BO0sLhK','admin','2026-08-03 06:55:56','2026-08-03 06:55:56'),(2,'Kamlesh ','Maity','kamalesh@siliconsystems.in','$2b$10$pL9U05TkO.DROEgWakb6OuGIfCoy7zwXZO1r5dILD.dcGNvny6eFK','user','2026-08-03 06:56:49','2026-08-03 06:56:49');
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

-- Dump completed on 2026-08-05 17:29:52
