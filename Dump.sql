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
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_inventory`
--

LOCK TABLES `blood_inventory` WRITE;
/*!40000 ALTER TABLE `blood_inventory` DISABLE KEYS */;
INSERT INTO `blood_inventory` VALUES (1,'B-20260805-2243','2026-08-05','Ayan  Mondal','A+','WHOLE BLOOD',560.00,6,1,'2026-09-09','','2026-08-05 07:49:36','2026-08-05 08:21:54'),(2,'B-20260805-2243','2026-08-05','Ayan  Mondal','A+','PACKED CELLS (SAGM)',540.00,5,5,'2026-09-16','','2026-08-05 07:49:36','2026-08-05 07:49:36'),(3,'B-20260805-2243','2026-08-05','Ayan  Mondal','A+','CONC. RBC\'S',650.00,8,8,'2026-09-09','','2026-08-05 07:49:36','2026-08-05 07:49:36'),(4,'B-20260805-2243','2026-08-05','Ayan  Mondal','A+','FFP',750.00,9,9,'2027-08-05','','2026-08-05 07:49:36','2026-08-05 07:49:36'),(5,'B-20260805-2243','2026-08-05','Ayan  Mondal','A+','PLATELET CONC.',650.00,5,5,'2026-08-10','','2026-08-05 07:49:36','2026-08-05 07:49:36'),(6,'B-20260805-2243','2026-08-05','Ayan  Mondal','A+','CRYO PPT (AHF)',650.00,6,6,'2027-08-05','','2026-08-05 07:49:36','2026-08-05 07:49:36'),(7,'B-20260805-2243','2026-08-05','Ayan  Mondal','A+','CPP',750.00,12,12,'2027-08-05','','2026-08-05 07:49:36','2026-08-05 07:49:36'),(8,'B-20260805-5138','2026-08-05','Ayan  Mondal','B+','WHOLE BLOOD',655.00,5,5,'2026-09-09','','2026-08-05 08:18:24','2026-08-05 08:18:24'),(9,'B-20260805-5138','2026-08-05','Ayan  Mondal','B+','PACKED CELLS (SAGM)',540.00,6,6,'2026-09-16','','2026-08-05 08:18:24','2026-08-05 08:18:24'),(10,'B-20260805-5138','2026-08-05','Ayan  Mondal','B+','CONC. RBC\'S',650.00,0,0,'2026-09-09','','2026-08-05 08:18:24','2026-08-05 08:18:24'),(11,'B-20260805-5138','2026-08-05','Ayan  Mondal','B+','FFP',750.00,8,8,'2027-08-05','','2026-08-05 08:18:24','2026-08-05 08:18:24'),(12,'B-20260805-5138','2026-08-05','Ayan  Mondal','B+','PLATELET CONC.',655.00,9,9,'2026-08-10','','2026-08-05 08:18:24','2026-08-05 08:18:24'),(13,'B-20260805-5138','2026-08-05','Ayan  Mondal','B+','CRYO PPT (AHF)',650.00,10,10,'2027-08-05','','2026-08-05 08:18:24','2026-08-05 08:18:24'),(14,'B-20260805-5138','2026-08-05','Ayan  Mondal','B+','CPP',750.00,11,11,'2027-08-05','','2026-08-05 08:18:24','2026-08-05 08:18:24'),(15,'B-20260805-2959','2026-08-05','Ayan  Mondal','A+','WHOLE BLOOD',560.00,8,2,'2026-09-09','','2026-08-05 08:32:35','2026-08-05 08:34:43'),(16,'B-20260805-2959','2026-08-05','Ayan  Mondal','A+','PACKED CELLS (SAGM)',540.00,9,9,'2026-09-16','','2026-08-05 08:32:35','2026-08-05 08:32:35'),(17,'B-20260805-2959','2026-08-05','Ayan  Mondal','A+','CONC. RBC\'S',650.00,6,6,'2026-09-09','','2026-08-05 08:32:35','2026-08-05 08:32:35'),(18,'B-20260805-2959','2026-08-05','Ayan  Mondal','A+','FFP',750.00,5,5,'2027-08-05','','2026-08-05 08:32:35','2026-08-05 08:32:35'),(19,'B-20260805-2959','2026-08-05','Ayan  Mondal','A+','PLATELET CONC.',650.00,4,4,'2026-08-10','','2026-08-05 08:32:35','2026-08-05 08:32:35'),(20,'B-20260805-2959','2026-08-05','Ayan  Mondal','A+','CRYO PPT (AHF)',650.00,3,3,'2027-08-05','','2026-08-05 08:32:35','2026-08-05 08:32:35'),(21,'B-20260805-2959','2026-08-05','Ayan  Mondal','A+','CPP',750.00,2,2,'2027-08-05','','2026-08-05 08:32:35','2026-08-05 08:32:35'),(22,'B-20260805-2165','2026-08-04','Ayan  Mondal','A+','WHOLE BLOOD',560.00,8,8,'2026-09-08','','2026-08-05 08:33:03','2026-08-05 08:33:03'),(23,'B-20260805-2165','2026-08-04','Ayan  Mondal','A+','PACKED CELLS (SAGM)',540.00,2,2,'2026-09-15','','2026-08-05 08:33:03','2026-08-05 08:33:03'),(24,'B-20260805-2165','2026-08-04','Ayan  Mondal','A+','CONC. RBC\'S',650.00,3,3,'2026-09-08','','2026-08-05 08:33:03','2026-08-05 08:33:03'),(25,'B-20260805-2165','2026-08-04','Ayan  Mondal','A+','FFP',750.00,4,4,'2027-08-04','','2026-08-05 08:33:03','2026-08-05 08:33:03'),(26,'B-20260805-2165','2026-08-04','Ayan  Mondal','A+','PLATELET CONC.',650.00,8,8,'2026-08-09','','2026-08-05 08:33:03','2026-08-05 08:33:03'),(27,'B-20260805-2165','2026-08-04','Ayan  Mondal','A+','CRYO PPT (AHF)',650.00,3,3,'2027-08-04','','2026-08-05 08:33:03','2026-08-05 08:33:03'),(28,'B-20260805-2165','2026-08-04','Ayan  Mondal','A+','CPP',750.00,78,78,'2027-08-04','','2026-08-05 08:33:03','2026-08-05 08:33:03');
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
INSERT INTO `blood_prices` VALUES (1,'A+','WHOLE BLOOD',560.00,'2026-08-04 08:56:05'),(2,'A+','PACKED CELLS (SAGM)',540.00,'2026-08-04 08:56:05'),(3,'A+','CONC. RBC\'S',650.00,'2026-08-04 08:56:05'),(4,'A+','FFP',750.00,'2026-08-04 08:56:05'),(5,'A+','PLATELET CONC.',650.00,'2026-08-04 10:41:42'),(6,'A+','CRYO PPT (AHF)',650.00,'2026-08-04 08:56:05'),(7,'A+','CPP',750.00,'2026-08-04 08:56:05'),(15,'A-','WHOLE BLOOD',560.00,'2026-08-04 10:12:06'),(16,'A-','PACKED CELLS (SAGM)',540.00,'2026-08-04 10:12:06'),(17,'A-','CONC. RBC\'S',650.00,'2026-08-04 10:12:06'),(18,'A-','FFP',750.00,'2026-08-04 10:12:06'),(19,'A-','PLATELET CONC.',655.00,'2026-08-04 10:12:06'),(20,'A-','CRYO PPT (AHF)',650.00,'2026-08-04 10:12:06'),(21,'A-','CPP',750.00,'2026-08-04 10:12:06'),(22,'B+','WHOLE BLOOD',655.00,'2026-08-04 10:17:41'),(23,'B+','PACKED CELLS (SAGM)',540.00,'2026-08-04 10:12:06'),(24,'B+','CONC. RBC\'S',650.00,'2026-08-04 10:12:06'),(25,'B+','FFP',750.00,'2026-08-04 10:12:06'),(26,'B+','PLATELET CONC.',655.00,'2026-08-04 10:12:06'),(27,'B+','CRYO PPT (AHF)',650.00,'2026-08-04 10:12:06'),(28,'B+','CPP',750.00,'2026-08-04 10:12:06'),(29,'B-','WHOLE BLOOD',560.00,'2026-08-04 10:12:06'),(30,'B-','PACKED CELLS (SAGM)',540.00,'2026-08-04 10:12:06'),(31,'B-','CONC. RBC\'S',650.00,'2026-08-04 10:12:06'),(32,'B-','FFP',750.00,'2026-08-04 10:12:06'),(33,'B-','PLATELET CONC.',655.00,'2026-08-04 10:12:06'),(34,'B-','CRYO PPT (AHF)',650.00,'2026-08-04 10:12:06'),(35,'B-','CPP',750.00,'2026-08-04 10:12:06'),(36,'AB+','WHOLE BLOOD',560.00,'2026-08-04 10:12:06'),(37,'AB+','PACKED CELLS (SAGM)',540.00,'2026-08-04 10:12:06'),(38,'AB+','CONC. RBC\'S',650.00,'2026-08-04 10:12:06'),(39,'AB+','FFP',750.00,'2026-08-04 10:12:06'),(40,'AB+','PLATELET CONC.',655.00,'2026-08-04 10:12:06'),(41,'AB+','CRYO PPT (AHF)',650.00,'2026-08-04 10:12:06'),(42,'AB+','CPP',750.00,'2026-08-04 10:12:06'),(43,'AB-','WHOLE BLOOD',560.00,'2026-08-04 10:12:06'),(44,'AB-','PACKED CELLS (SAGM)',540.00,'2026-08-04 10:12:06'),(45,'AB-','CONC. RBC\'S',650.00,'2026-08-04 10:12:06'),(46,'AB-','FFP',750.00,'2026-08-04 10:12:06'),(47,'AB-','PLATELET CONC.',655.00,'2026-08-04 10:12:06'),(48,'AB-','CRYO PPT (AHF)',650.00,'2026-08-04 10:12:06'),(49,'AB-','CPP',750.00,'2026-08-04 10:12:06'),(50,'O+','WHOLE BLOOD',560.00,'2026-08-04 10:12:06'),(51,'O+','PACKED CELLS (SAGM)',540.00,'2026-08-04 10:12:06'),(52,'O+','CONC. RBC\'S',650.00,'2026-08-04 10:12:06'),(53,'O+','FFP',750.00,'2026-08-04 10:12:06'),(54,'O+','PLATELET CONC.',655.00,'2026-08-04 10:12:06'),(55,'O+','CRYO PPT (AHF)',650.00,'2026-08-04 10:12:06'),(56,'O+','CPP',750.00,'2026-08-04 10:12:06'),(57,'O-','WHOLE BLOOD',560.00,'2026-08-04 10:12:06'),(58,'O-','PACKED CELLS (SAGM)',540.00,'2026-08-04 10:12:06'),(59,'O-','CONC. RBC\'S',650.00,'2026-08-04 10:12:06'),(60,'O-','FFP',750.00,'2026-08-04 10:12:06'),(61,'O-','PLATELET CONC.',655.00,'2026-08-04 10:12:06'),(62,'O-','CRYO PPT (AHF)',650.00,'2026-08-04 10:12:06'),(63,'O-','CPP',750.00,'2026-08-04 10:12:06'),(65,'Other','WHOLE BLOOD',560.00,'2026-08-04 10:32:24'),(66,'Other','PACKED CELLS (SAGM)',540.00,'2026-08-04 10:32:24'),(67,'Other','CONC. RBC\'S',650.00,'2026-08-04 10:32:24'),(68,'Other','FFP',750.00,'2026-08-04 10:32:24'),(69,'Other','PLATELET CONC.',655.00,'2026-08-04 10:32:24'),(70,'Other','CRYO PPT (AHF)',650.00,'2026-08-04 10:32:24'),(71,'Other','CPP',750.00,'2026-08-04 10:32:24');
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_transactions`
--

LOCK TABLES `blood_transactions` WRITE;
/*!40000 ALTER TABLE `blood_transactions` DISABLE KEYS */;
INSERT INTO `blood_transactions` VALUES (1,1,'RECEIVE',6,3360.00,'2026-09-09','Ayan  Mondal','','2026-08-05 13:19:36'),(2,2,'RECEIVE',5,2700.00,'2026-09-16','Ayan  Mondal','','2026-08-05 13:19:36'),(3,3,'RECEIVE',8,5200.00,'2026-09-09','Ayan  Mondal','','2026-08-05 13:19:36'),(4,4,'RECEIVE',9,6750.00,'2027-08-05','Ayan  Mondal','','2026-08-05 13:19:36'),(5,5,'RECEIVE',5,3250.00,'2026-08-10','Ayan  Mondal','','2026-08-05 13:19:36'),(6,6,'RECEIVE',6,3900.00,'2027-08-05','Ayan  Mondal','','2026-08-05 13:19:36'),(7,7,'RECEIVE',12,9000.00,'2027-08-05','Ayan  Mondal','','2026-08-05 13:19:36'),(8,8,'RECEIVE',5,3275.00,'2026-09-09','Ayan  Mondal','','2026-08-05 13:48:24'),(9,9,'RECEIVE',6,3240.00,'2026-09-16','Ayan  Mondal','','2026-08-05 13:48:24'),(10,10,'RECEIVE',0,0.00,'2026-09-09','Ayan  Mondal','','2026-08-05 13:48:24'),(11,11,'RECEIVE',8,6000.00,'2027-08-05','Ayan  Mondal','','2026-08-05 13:48:24'),(12,12,'RECEIVE',9,5895.00,'2026-08-10','Ayan  Mondal','','2026-08-05 13:48:24'),(13,13,'RECEIVE',10,6500.00,'2027-08-05','Ayan  Mondal','','2026-08-05 13:48:24'),(14,14,'RECEIVE',11,8250.00,'2027-08-05','Ayan  Mondal','','2026-08-05 13:48:24'),(15,1,'ISSUE',4,2240.00,'2026-09-09','Ayan  Mondal','','2026-08-05 13:51:26'),(16,1,'ISSUE',1,560.00,'2026-09-09','Ayan  Mondal','','2026-08-05 13:51:54'),(17,15,'RECEIVE',8,4480.00,'2026-09-09','Ayan  Mondal','','2026-08-05 14:02:35'),(18,16,'RECEIVE',9,4860.00,'2026-09-16','Ayan  Mondal','','2026-08-05 14:02:35'),(19,17,'RECEIVE',6,3900.00,'2026-09-09','Ayan  Mondal','','2026-08-05 14:02:35'),(20,18,'RECEIVE',5,3750.00,'2027-08-05','Ayan  Mondal','','2026-08-05 14:02:35'),(21,19,'RECEIVE',4,2600.00,'2026-08-10','Ayan  Mondal','','2026-08-05 14:02:35'),(22,20,'RECEIVE',3,1950.00,'2027-08-05','Ayan  Mondal','','2026-08-05 14:02:35'),(23,21,'RECEIVE',2,1500.00,'2027-08-05','Ayan  Mondal','','2026-08-05 14:02:35'),(24,22,'RECEIVE',8,4480.00,'2026-09-08','Ayan  Mondal','','2026-08-05 14:03:03'),(25,23,'RECEIVE',2,1080.00,'2026-09-15','Ayan  Mondal','','2026-08-05 14:03:03'),(26,24,'RECEIVE',3,1950.00,'2026-09-08','Ayan  Mondal','','2026-08-05 14:03:03'),(27,25,'RECEIVE',4,3000.00,'2027-08-04','Ayan  Mondal','','2026-08-05 14:03:03'),(28,26,'RECEIVE',8,5200.00,'2026-08-09','Ayan  Mondal','','2026-08-05 14:03:03'),(29,27,'RECEIVE',3,1950.00,'2027-08-04','Ayan  Mondal','','2026-08-05 14:03:03'),(30,28,'RECEIVE',78,58500.00,'2027-08-04','Ayan  Mondal','','2026-08-05 14:03:03'),(31,15,'ISSUE',6,3360.00,'2026-09-09','Ayan  Mondal','','2026-08-05 14:04:43');
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
INSERT INTO `component_master` VALUES (1,'WHOLE BLOOD',35),(2,'PACKED CELLS (SAGM)',42),(3,'CONC. RBC\'S',35),(4,'FFP',365),(5,'PLATELET CONC.',5),(6,'CRYO PPT (AHF)',365),(7,'CPP',365);
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

-- Dump completed on 2026-08-05 14:08:40
