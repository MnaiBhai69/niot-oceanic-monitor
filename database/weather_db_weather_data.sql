-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: weather_db
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
-- Table structure for table `weather_data`
--

DROP TABLE IF EXISTS `weather_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weather_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location` varchar(50) NOT NULL,
  `batt_avg` varchar(20) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `record` int DEFAULT NULL,
  `airtemp_avg` varchar(20) DEFAULT NULL,
  `rh_avg` varchar(20) DEFAULT NULL,
  `ws_avg` varchar(20) DEFAULT NULL,
  `wd_avg` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_timestamp` (`timestamp`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weather_data`
--

LOCK TABLES `weather_data` WRITE;
/*!40000 ALTER TABLE `weather_data` DISABLE KEYS */;
INSERT INTO `weather_data` VALUES (5,'','12.5','2026-03-11 09:00:00',1,'25.3','60','5','180'),(6,'','12.4','2026-03-11 09:05:00',2,'25.1','61','4.8','182'),(13,'','12.7','2026-03-11 09:15:00',3,'25.4','58','5.1','187'),(14,'','12.6','2026-03-11 09:20:00',4,'25.3','59','4.9','184'),(31,'Folder1','12.5','2026-03-11 16:00:00',1,'30.2','45','3.6','180'),(32,'Folder1','12.8','2026-03-11 17:00:00',2,'30.5','46','3.8','190'),(33,'Folder2','11.9','2026-03-11 16:05:00',1,'29.8','50','3.2','175'),(34,'Folder2','12.0','2026-03-11 17:05:00',2,'30.1','49','3.4','185'),(35,'Folder3','13.2','2026-03-11 16:10:00',1,'31.0','44','4.0','160'),(36,'Folder3','13.5','2026-03-11 17:10:00',2,'31.3','43','4.2','170'),(37,'Folder4','12.0','2026-03-11 16:15:00',1,'29.5','48','3.5','200'),(38,'Folder4','12.2','2026-03-11 17:15:00',2,'29.7','47','3.7','210'),(39,'Folder5','11.5','2026-03-11 16:20:00',1,'28.9','52','3.0','190'),(40,'Folder5','11.8','2026-03-11 17:20:00',2,'29.2','51','3.3','200');
/*!40000 ALTER TABLE `weather_data` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-29 18:44:12
