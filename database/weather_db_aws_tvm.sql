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
-- Table structure for table `aws_tvm`
--

DROP TABLE IF EXISTS `aws_tvm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aws_tvm` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `bat_volt` float DEFAULT NULL,
  `air_pr` float DEFAULT NULL,
  `cr_temp` float DEFAULT NULL,
  `air_temp` float DEFAULT NULL,
  `humi` float DEFAULT NULL,
  `sw_smp_w` float DEFAULT NULL,
  `lw_sgr_w` float DEFAULT NULL,
  `wind_spd` float DEFAULT NULL,
  `wind_gust` float DEFAULT NULL,
  `rain` float DEFAULT NULL,
  `rainfall` float DEFAULT NULL,
  `rcum` float DEFAULT NULL,
  `g_wind_spd` float DEFAULT NULL,
  `c_wind_dir` float DEFAULT NULL,
  `g_heading` float DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `long` float DEFAULT NULL,
  `g_hight` float DEFAULT NULL,
  `g_gps_sig` float DEFAULT NULL,
  `sun_rise` float DEFAULT NULL,
  `sun_set` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_tvm`
--

LOCK TABLES `aws_tvm` WRITE;
/*!40000 ALTER TABLE `aws_tvm` DISABLE KEYS */;
INSERT INTO `aws_tvm` VALUES (1,'2026-04-26 21:36:29',12.92,1007.79,35.28,23.37,47.98,680.69,491.5,29.747,30.322,0,0,0,1.85,131,308.4,12.9454,80.2117,25.9,109,5,18),(2,'2026-04-26 21:36:29',12.92,1007.79,35.28,23.37,47.98,680.69,491.5,29.747,30.322,0,0,0,1.85,131,308.4,12.9454,80.2117,25.9,109,5,18);
/*!40000 ALTER TABLE `aws_tvm` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-29 18:44:13
