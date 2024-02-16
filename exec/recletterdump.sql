-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: S10P12A606
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB-1:10.4.32+maria~ubu2004

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bgm`
--

DROP TABLE IF EXISTS `bgm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bgm` (
  `bgm_id` int(11) NOT NULL AUTO_INCREMENT,
  `bgm_title` varchar(100) NOT NULL,
  `bgm_url` varchar(8200) DEFAULT NULL,
  PRIMARY KEY (`bgm_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bgm`
--

LOCK TABLES `bgm` WRITE;
/*!40000 ALTER TABLE `bgm` DISABLE KEYS */;
INSERT INTO `bgm` VALUES (1,'bgm 없음',''),(2,'SellBuyMusic - C. Hunter - Possum And Taters','/src/assets/bgm/bgm1'),(3,'SellBuyMusic - C. Hunter - Possum And Taters_1','/src/assets/bgm/bgm2'),(4,'SellBuyMusic - C. Hunter - Possum And Taters_4','/src/assets/bgm/bgm3'),(5,'SellBuyMusic - Ending','/src/assets/bgm/bgm4'),(6,'SellBuyMusic - hiro-in','/src/assets/bgm/bgm5'),(7,'SellBuyMusic - hiro-out','/src/assets/bgm/bgm6'),(8,'SellBuyMusic - 베르디 _ 오페라 \'\'라트라비아타\'\' 中 축배의 노래 intro','/src/assets/bgm/bgm7'),(9,'SellBuyMusic - 자신감','/src/assets/bgm/bgm8'),(10,'SellBuyMusic - 차이코프스키 - 어린이를 위한 앨범 5번 군대행진곡_2','/src/assets/bgm/bgm9'),(11,'SellBuyMusic - 통통톡톡','/src/assets/bgm/bgm10'),(12,'SellBuyMusic - 팝인트로','/src/assets/bgm/bgm11'),(13,'SellBuyMusic - 하와이의 별내리는 밤','/src/assets/bgm/bgm12'),(14,'SellBuyMusic - 해변의 저녁','/src/assets/bgm/bgm13'),(15,'SellBuyMusic - 화창한 날','/src/assets/bgm/bgm14'),(16,'배달의민족 - 배달은 자신있어','/src/assets/bgm/bgm15'),(17,'배달의민족 - 선물하러 가는 길','/src/assets/bgm/bgm16'),(18,'배달의민족 - 충전할 땐 클래식을','/src/assets/bgm/bgm17'),(19,'배달의민족 - 큰집 18층으로 떠나는 여행','/src/assets/bgm/bgm18');
/*!40000 ALTER TABLE `bgm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clip`
--

DROP TABLE IF EXISTS `clip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clip` (
  `clip_id` int(11) NOT NULL AUTO_INCREMENT,
  `clip_title` varchar(50) NOT NULL,
  `clip_owner` char(36) DEFAULT NULL,
  `clip_order` int(11) NOT NULL DEFAULT -1,
  `clip_volume` int(11) NOT NULL DEFAULT 100 CHECK (`clip_volume` between 1 and 200),
  `studio_id` char(36) DEFAULT NULL,
  `clip_content` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`clip_id`),
  KEY `clip_owner` (`clip_owner`),
  KEY `studio_id` (`studio_id`),
  CONSTRAINT `clip_ibfk_1` FOREIGN KEY (`clip_owner`) REFERENCES `user` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `clip_ibfk_2` FOREIGN KEY (`studio_id`) REFERENCES `studio` (`studio_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clip`
--

LOCK TABLES `clip` WRITE;
/*!40000 ALTER TABLE `clip` DISABLE KEYS */;
INSERT INTO `clip` VALUES (1,'권유경 화이팅!','c900672f-25c2-4cdc-b922-c09150c79c0e',-1,100,'178551df-d802-4591-a2dc-a868b7135361',''),(3,'전하영 1','8835b760-92c2-47a1-abf4-6d1d1005394f',1,100,'9b89049e-8848-40ed-b96e-7142b5db12e1',''),(4,'권유경 1','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde',1,100,'61c4d028-5445-4fb4-8e5e-2b1890950072',''),(5,'권유경 1','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde',1,100,'c8fd7e00-1eab-4ef3-9844-9fa85774bf57',''),(6,'권유경 1','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde',1,100,'67a90c78-2856-46dd-996c-a9250bbfc5e5',''),(7,'권유경 1','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde',1,100,'fd323d3f-7ecb-47be-845b-25cf88ddea95',''),(8,'권유경 1','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde',1,100,'e25a99a2-c477-4968-8506-9a4b678a130d',''),(9,'전하영 1','8835b760-92c2-47a1-abf4-6d1d1005394f',1,100,'76c4b2f9-ffc1-4a18-8a34-d3f66de7388d',''),(10,'권유경 1','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde',-1,100,'76c4b2f9-ffc1-4a18-8a34-d3f66de7388d',''),(11,'전하영 1','8835b760-92c2-47a1-abf4-6d1d1005394f',1,100,'b8f4e93e-bb46-4738-a292-a502d9580249',''),(12,'전하영 1','8835b760-92c2-47a1-abf4-6d1d1005394f',-1,100,'a9c365a1-4ff5-4afd-9598-a9b62d388a66',''),(13,'전하영 1','8835b760-92c2-47a1-abf4-6d1d1005394f',1,100,'ba270f7f-029c-47d7-aa17-715e4e9280f2',''),(14,'김태운 1','1ab72825-6f64-4a46-b789-4651566de977',1,161,'0581800c-58a3-4e0b-8daf-457f386119ca',''),(15,'꿀꿀대지 1','54a33c9b-8731-4075-8bd1-33b8e7b01b64',1,100,'18ee13d2-24b2-4257-9148-3f219243c2cb',''),(16,'꿀꿀대지 1','54a33c9b-8731-4075-8bd1-33b8e7b01b64',1,100,'580ec2d5-3ff7-4e93-bb92-4a7e7021722f',''),(17,'꿀꿀대지 1','54a33c9b-8731-4075-8bd1-33b8e7b01b64',-1,100,'580ec2d5-3ff7-4e93-bb92-4a7e7021722f',''),(18,'꿀꿀대지 1','54a33c9b-8731-4075-8bd1-33b8e7b01b64',1,100,'fb8a1a19-28ca-4338-a165-966605319c1d',''),(19,'HarshYoung 1','b2c0c09e-927d-4700-863d-3f510378f3b4',1,100,'bced5d14-fcaa-4c7b-a44e-b82b0b0c0728',''),(20,'HarshYoung 1','b2c0c09e-927d-4700-863d-3f510378f3b4',1,100,'c6840505-5ded-40e0-81e4-b5c139f78837',''),(21,'권유경 1','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde',-1,100,'580ec2d5-3ff7-4e93-bb92-4a7e7021722f',''),(22,'권유경 1','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde',-1,100,'bced5d14-fcaa-4c7b-a44e-b82b0b0c0728',''),(23,'권유경 1','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde',-1,100,'c6840505-5ded-40e0-81e4-b5c139f78837',''),(24,'권유경 1','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde',-1,100,'18ee13d2-24b2-4257-9148-3f219243c2cb',''),(25,'aaa','8fb03284-691e-48d4-937c-6811b5eb077c',1,95,'18439882-bc00-4f65-905d-3cb4832b2d18',''),(26,'태우니 1','8fb03284-691e-48d4-937c-6811b5eb077c',2,100,'18439882-bc00-4f65-905d-3cb4832b2d18',''),(28,'김태운 최종','8fb03284-691e-48d4-937c-6811b5eb077c',1,158,'425d87e9-e504-4f0d-a60e-29e3aee622dc',''),(30,'김연수','be912988-dbd9-49cc-b1a6-4a49837e68b8',2,125,'425d87e9-e504-4f0d-a60e-29e3aee622dc',''),(32,'은쭈 영상','6304df48-dfe7-42e1-b257-c2a110dff6a0',1,100,'9578b1d8-b100-40ef-a2e6-80f312fe6d3a',''),(33,'es j 1','6304df48-dfe7-42e1-b257-c2a110dff6a0',2,16,'9578b1d8-b100-40ef-a2e6-80f312fe6d3a',''),(34,'권유경 1','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde',3,100,'9578b1d8-b100-40ef-a2e6-80f312fe6d3a',''),(35,'김태운의 취업 축하','1ab72825-6f64-4a46-b789-4651566de977',-1,100,'26fbc8a9-8f78-458a-833d-07a6853c3a8e',''),(36,'최종본 1','1ab72825-6f64-4a46-b789-4651566de977',-1,100,'26fbc8a9-8f78-458a-833d-07a6853c3a8e',''),(37,'이선재','e58ba822-ce94-4d42-8f50-29dcd4a977eb',1,8,'703ca8dc-1e42-4d52-9b88-10765a25436c',''),(38,'HarshYoung 1','b2c0c09e-927d-4700-863d-3f510378f3b4',1,100,'60535e85-d428-4064-8a86-8fe943a4f7b5',''),(39,'은수1','6304df48-dfe7-42e1-b257-c2a110dff6a0',1,11,'b22ee824-bafd-4d05-86a9-c4a49eca39e8',''),(40,'권유경 1','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde',3,100,'b22ee824-bafd-4d05-86a9-c4a49eca39e8',''),(41,'선재','b23c6aad-03ff-4f88-8047-ab54b82424b1',2,100,'b22ee824-bafd-4d05-86a9-c4a49eca39e8',''),(42,'권유경 1','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde',4,100,'b22ee824-bafd-4d05-86a9-c4a49eca39e8',''),(43,'은수수','6304df48-dfe7-42e1-b257-c2a110dff6a0',5,100,'b22ee824-bafd-4d05-86a9-c4a49eca39e8',''),(44,'핑크돼지 1','6304df48-dfe7-42e1-b257-c2a110dff6a0',2,100,'703ca8dc-1e42-4d52-9b88-10765a25436c',''),(45,'안녕하세요','1ab72825-6f64-4a46-b789-4651566de977',3,100,'703ca8dc-1e42-4d52-9b88-10765a25436c',''),(46,'핑크돼지 1','6304df48-dfe7-42e1-b257-c2a110dff6a0',-1,100,'c4b3c9e0-5a80-4bcc-9fb9-4dcef7555ba5',''),(47,'좋아요','1ab72825-6f64-4a46-b789-4651566de977',-1,100,'c4b3c9e0-5a80-4bcc-9fb9-4dcef7555ba5',''),(48,'써니 1','b23c6aad-03ff-4f88-8047-ab54b82424b1',-1,100,'c4b3c9e0-5a80-4bcc-9fb9-4dcef7555ba5',''),(49,'핑크돼지 1','6304df48-dfe7-42e1-b257-c2a110dff6a0',1,167,'b913eccd-fd80-404c-bb5e-8be417dabaa8',''),(50,'써니','b23c6aad-03ff-4f88-8047-ab54b82424b1',2,99,'b913eccd-fd80-404c-bb5e-8be417dabaa8',''),(51,'핑크돼지 1','6304df48-dfe7-42e1-b257-c2a110dff6a0',1,100,'5c251e9c-b314-45bc-bc04-387740f86469',''),(53,'은수의 축하메시지','54a33c9b-8731-4075-8bd1-33b8e7b01b64',-1,100,'d3fed5dd-56e9-47ae-a480-50feb8ec6833',''),(54,'권유경 2','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde',-1,100,'d3fed5dd-56e9-47ae-a480-50feb8ec6833',''),(55,'김태운 1','1ab72825-6f64-4a46-b789-4651566de977',-1,100,'5c251e9c-b314-45bc-bc04-387740f86469',''),(56,'김태운 1','1ab72825-6f64-4a46-b789-4651566de977',-1,100,'d3fed5dd-56e9-47ae-a480-50feb8ec6833',''),(57,'강준영 코치 마무리 인사','67961bfb-90a0-4947-aa90-9369a19ab7ef',-1,100,'d3fed5dd-56e9-47ae-a480-50feb8ec6833',''),(58,'레크레터 1','926210e1-a603-464f-8ec2-f3a3c538166e',-1,100,'d3fed5dd-56e9-47ae-a480-50feb8ec6833',''),(59,'권유경 1','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde',-1,100,'c6840505-5ded-40e0-81e4-b5c139f78837','');
/*!40000 ALTER TABLE `clip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `font`
--

DROP TABLE IF EXISTS `font`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `font` (
  `font_id` int(11) NOT NULL AUTO_INCREMENT,
  `font_title` varchar(50) NOT NULL,
  `font_family` varchar(50) NOT NULL,
  `font_url` varchar(8200) NOT NULL,
  PRIMARY KEY (`font_id`),
  UNIQUE KEY `font_title` (`font_title`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `font`
--

LOCK TABLES `font` WRITE;
/*!40000 ALTER TABLE `font` DISABLE KEYS */;
INSERT INTO `font` VALUES (1,'오뮤다예쁨체(기본)','omyu_pretty','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-01@1.0/omyu_pretty.woff2'),(2,'프리텐다드','Pretendard-Regular','https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff'),(3,'시원한 설레임체','seolleimcool-SemiBold','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2312-1@1.1/seolleimcool-SemiBold.woff2'),(4,'와글와글체','WagleWagle','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2301-wagle@1.0/WagleWagle.woff'),(5,'OG 르네상스 비밀','OG_Renaissance_Secret-Rg','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2312-1@1.1/OG_Renaissance_Secret-Rg.woff2'),(6,'Y클로버체','YClover-Bold','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_231029@1.1/YClover-Bold.woff2'),(7,'여기어때 잘난체 고딕','JalnanGothic','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_231029@1.1/JalnanGothic.woff'),(8,'태백은하수체','TAEBAEKmilkyway','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2310@1.0/TAEBAEKmilkyway.woff2'),(9,'Orbit','Orbit-Regular','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2310@1.0/Orbit-Regular.woff2'),(10,'소요단풍체','SOYOMapleBoldTTF','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2310@1.0/SOYOMapleBoldTTF.woff2'),(11,'도스필기','DOSPilgiMedium','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-2@1.0/DOSPilgiMedium.woff2'),(12,'둘기마요고딕','Dovemayo_gothic','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.1/Dovemayo_gothic.woff2'),(13,'KCC간판체','KCC-Ganpan','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.0/KCC-Ganpan.woff2'),(14,'거친둘기마요','Dovemayo_wild','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.0/Dovemayo_wild.woff2'),(15,'나눔스퀘어 네오','NanumSquareNeo-Variable','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/NanumSquareNeo-Variable.woff2'),(16,'LINE Seed','LINESeedKR-Bd','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/LINESeedKR-Bd.woff2'),(17,'제주돌담체','EF_jejudoldam','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2210-EF@1.0/EF_jejudoldam.woff2'),(18,'카페24 써라운드','Cafe24Ssurround','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/Cafe24Ssurround.woff'),(19,'완도희망체','WandohopeR','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@1.0/WandohopeR.woff'),(20,'Rix할매의꽃담','RixMomsBlanketR','https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.0/RixMomsBlanketR.woff2');
/*!40000 ALTER TABLE `font` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `frame`
--

DROP TABLE IF EXISTS `frame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `frame` (
  `frame_id` int(11) NOT NULL AUTO_INCREMENT,
  `frame_title` varchar(50) NOT NULL,
  PRIMARY KEY (`frame_id`),
  UNIQUE KEY `frame_title` (`frame_title`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `frame`
--

LOCK TABLES `frame` WRITE;
/*!40000 ALTER TABLE `frame` DISABLE KEYS */;
INSERT INTO `frame` VALUES (14,'v-log 검은색'),(13,'v-log 흰색'),(19,'구름 블루'),(20,'구름 퍼플'),(18,'구름 핑크'),(21,'따옴표'),(11,'보라돌이'),(9,'스티치'),(2,'싸피 1기,6기,11기'),(3,'싸피 2기,7기'),(4,'싸피 3기,8기'),(5,'싸피 4기,9기'),(6,'싸피 5기,10기'),(12,'아쿠아리움'),(10,'엽서'),(16,'웹사이트 블루'),(17,'웹사이트 퍼플'),(15,'웹사이트 핑크'),(22,'집중'),(8,'축하축하'),(1,'프레임 없음'),(7,'해피버스데이');
/*!40000 ALTER TABLE `frame` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth2_authorized_client`
--

DROP TABLE IF EXISTS `oauth2_authorized_client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth2_authorized_client` (
  `client_registration_id` varchar(100) NOT NULL,
  `principal_name` varchar(200) NOT NULL,
  `access_token_type` varchar(100) NOT NULL,
  `access_token_value` longblob NOT NULL,
  `access_token_issued_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `access_token_expires_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `access_token_scopes` varchar(1000) DEFAULT NULL,
  `refresh_token_value` longblob DEFAULT NULL,
  `refresh_token_issued_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`client_registration_id`,`principal_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth2_authorized_client`
--

LOCK TABLES `oauth2_authorized_client` WRITE;
/*!40000 ALTER TABLE `oauth2_authorized_client` DISABLE KEYS */;
INSERT INTO `oauth2_authorized_client` VALUES ('google','es j','Bearer','ya29.a0AfB_byBc0FCxIjNDix168P6c9R5zVFKZVFsZooIUve_BAoLc-S03pkoOm_r3gfhTLK-mp15nc5tkvAMqrF87kLiBDEPqVdAHToebh4dQY2xpztNt6cCh5mQU-CJAyWiKquUo-uCJ-UWx87B5MG-GHx_jZpx1hQxen9saCgYKAdcSARISFQHGX2MiDhFDRAGH9Un7KFET_81G9g0170','2024-02-16 08:25:02','2024-02-16 09:25:01','https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,openid',NULL,'2024-02-15 23:25:02','2024-02-15 08:10:42'),('google','HarshYoung','Bearer','ya29.a0AfB_byATpWjPZ_FaleCwNWnEuGXOZUDJMjJ57SlGqGQ7bfgvpSx0OqvRHvHW5irEtcdnBcOiWVlGJ5btPiQ7FohQBnQYZtvTRk_3hCLlyDWMU6SbdyBiCi9C7E5e57gZws8EQ8AyzguLnXkTtjyDIE2HgLHD1bv6VeEaCgYKASESARESFQHGX2MifDsplGUeFBd4HMXNzAyIRA0170','2024-02-16 03:04:03','2024-02-16 04:04:02','https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,openid',NULL,'2024-02-15 18:04:03','2024-02-15 08:09:02'),('google','Paul lo','Bearer','ya29.a0AfB_byANx7yA3_zx1hcGNNTh8CwgBLa-02ffuSe49mny7qNkWFz7ff2opwCcvZyCJ5gWPvgqab5Znfx2ERHUd4RHn9RLm3Tx0_4nLEUg2YOT2mXksHJY3vZVotmjeZn7slJOLCWSfXG8kTt8ZPf1MweyNVwnul1JnA1eaCgYKAdYSARASFQHGX2MiDjltg3Q8g9Pku0gHAjk2Yg0171','2024-02-15 18:20:20','2024-02-15 19:20:19','https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,openid',NULL,'2024-02-15 09:20:20','2024-02-15 09:20:20'),('google','Taewoon Kim (서울_7반_김태운)','Bearer','ya29.a0AfB_byCKFuOve4Of5TwU2axp--CLDNC6G3fLSwF3-_SLSCm1Id38MtDW9iJ6XnQ-Eri9ZJjWaMtNrals0G3NdCXXx8F8HT1KEGhbbAp7Gltv-eNyeqMQbLG3_Qsoxotlt8D9jsdh2guekIAml9ByPltWl8vMmakPqw8aCgYKAUoSARASFQHGX2Mi8eVq6VQYe3ZXqndQVaZ5Jg0170','2024-02-16 09:04:26','2024-02-16 10:04:24','https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,openid',NULL,'2024-02-16 00:04:26','2024-02-15 10:38:32'),('google','강준영[서울_ 6반]실습코치','Bearer','ya29.a0AfB_byAdmpHWq04JHm5dz1RJe9OdWEnH1lvzNFx-QHhpovZVmynoQ5GuzpAvGUecZg7kMrFPXlui0OuuyrImgSO5X2ZigTg9xl1sagsaMp5wuYFfMu65WF7iuf7TUxiyeUBBazyChmV-6jO1cSKkCGxjrm0mLdKrQlsaCgYKAfoSARISFQHGX2MiaaebJVVvi-hjn0i6a0eVGw0170','2024-02-16 09:10:29','2024-02-16 10:10:28','https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,openid',NULL,'2024-02-16 00:10:29','2024-02-16 00:10:29'),('google','권유경','Bearer','ya29.a0AfB_byBZZMVrwUgQKL_0d57d59VjKtnwpOZ9eOQx1aLtcywDxckNEB2YyYvzX5tJ0yZMRTG8bQl5jehLOsWquSpf0J4hLaFKupRI20mAIVuqwy5PBptTo9c83ua-mVVaCD49clvvcWSg8wRpuOTWWSHfX0rlq0CMC-kaCgYKAaQSARMSFQHGX2MiA6n_RvXXkvC8aWGsn7fQxQ0170','2024-02-16 10:21:37','2024-02-16 11:21:36','https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,openid',NULL,'2024-02-16 01:21:37','2024-02-15 08:04:00'),('google','김연수','Bearer','ya29.a0AfB_byCyUGfQjV2D210Za8bCzbihlpWOtHxu62bDNJd77-oIodpufNpSV7PEShFduojE970r4qaaGvivbYfdWUIZvdf6qM3Qylifq6275TpW4Stj0ZPvWAE5Vagd0ZB_PGhwI_6UW2FhZKsYtkEzX691sDnzNB1U2McaCgYKAX0SARMSFQHGX2Mi6AUvplKA7fev2SNLDC93Aw0170','2024-02-16 09:57:35','2024-02-16 10:57:34','https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,openid',NULL,'2024-02-16 00:57:35','2024-02-15 07:48:35'),('google','신문영','Bearer','ya29.a0AfB_byAS9BaHvHOhG8Hm6xv7m1tbSl5MclqRN8gtRhhH43G8nfSVz6rfBRhX97SgtXWwEIhtHstkflvHCJtVA-brtFWHjqSARLgYna9E3jUWKdnAWW3jh_ubY-cwUZIjqRwSBtSDlstLbZ8kDdqtzimLDioUXnexVadYaCgYKAVESARESFQHGX2Mia66bjdC36R8EQhHFf2kPvw0171','2024-02-15 18:20:13','2024-02-15 19:20:12','https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,openid',NULL,'2024-02-15 09:20:14','2024-02-15 09:20:14'),('google','이선재','Bearer','ya29.a0AfB_byDsggsDy-2hITv5VBAJcE-ndKgZjXCvg_NzBQIAfwV55Qu6f2eiBK5dBIdRZfLsHogwvZpGIK8TpmtIi5T9OxrQo4DipeuTnzAJuptN2Y1nDX_hzA7yu_U4kJAJECnbYs3YVTUOI7aVwXKD_xmt61YFFiHkmskaCgYKAYMSARESFQHGX2MiKuIPXpevHsa6s5Oi9fqBzg0170','2024-02-16 08:26:42','2024-02-16 09:26:41','https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,openid',NULL,'2024-02-15 23:26:42','2024-02-15 13:17:58'),('google','전하영','Bearer','ya29.a0AfB_byDqL_g7_IPLjhT2pDpnGcpYJTQTHse3Oo0QnjZZXy4xqGOd7Iby91mIyVa0QRzaoz7CrTxIDJ5TFkB3XhEn6ZvYx-CoswkERhUrJ0U4bIi4_V-Us87yfSRWihs3sgbw9XXRmR6dAASo_XvxWn4zEm9eX_UEsVAaCgYKAS4SARISFQHGX2Mi9PlOagwpmotSLg5QsrLrlg0170','2024-02-16 02:35:55','2024-02-16 03:35:54','https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,openid',NULL,'2024-02-15 17:35:55','2024-02-15 07:57:26'),('google','정유경','Bearer','ya29.a0AfB_byBwtnsNSZr2iWDoRaPhnRFim2pdK3ILVS07XD7kf0n3qwHyByW2QIBpLutlGb4lG0fuQ-USEVwYR1K7_YY63oJKaGbMTiE5xxxyKCjseUUI30GnjUZhUdK3lAoiowO9U5EKMHq0EWHoQ_pnXm30OosMgImkMQaCgYKAUISARASFQHGX2MinTDnr5GeOmddY3P8tFQ6Yw0169','2024-02-15 17:47:37','2024-02-15 18:47:36','https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,openid',NULL,'2024-02-15 08:47:37','2024-02-15 08:47:15');
/*!40000 ALTER TABLE `oauth2_authorized_client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `script`
--

DROP TABLE IF EXISTS `script`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `script` (
  `script_id` int(11) NOT NULL AUTO_INCREMENT,
  `script_title` varchar(100) DEFAULT NULL,
  `script_content` varchar(1500) DEFAULT NULL,
  PRIMARY KEY (`script_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `script`
--

LOCK TABLES `script` WRITE;
/*!40000 ALTER TABLE `script` DISABLE KEYS */;
INSERT INTO `script` VALUES (1,'교수님 생신 축하','OO교수님 안녕하세요! 싸피 OO기 OOO입니다. 생신 정말 축하드립니다!\n교수님 덕분에 싸피 기간에 많이 배우고 성장할 수 있었습니다.\n사랑으로 저희를 가르쳐 주셔서 정말 감사드립니다.\n늘 건강하시고 좋은 일들만 가득하시길 바라겠습니다!'),(2,'싸탈 축하','OO아, 싸탈 축하해!!\n싸피에서 너와 함께할 수 있어서 너무 즐겁고 감사했어.\n앞으로 싸피에서 볼 수는 없겠지만 너의 새로운 시작을 진심으로 축하해.\n나도 곧 따라간다!!'),(3,'생일 축하','OO아, 생일 축하해!! 싸피에서 너를 알게 돼서 너무 좋아.\n함께 싸피에서 폭풍 성장해서 취뽀하자!\n오늘 하루 한순간도 빠짐없이 행복하고 즐거웠으면 좋겠다!!\n생일 축하해!'),(4,'프로젝트 마무리','6주 동안 OO 프로젝트 하시느라 정말 수고가 많으셨습니다!\n힘들었지만 그만큼 성장하고 배울 수 있어서 감사한 시간이었어요.\n이 경험을 발판 삼아 모두 훌륭한 개발자로 성장하시기를 진심으로 응원합니다.\n정말 고생하셨습니다! 화이팅!!');
/*!40000 ALTER TABLE `script` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studio`
--

DROP TABLE IF EXISTS `studio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `studio` (
  `studio_id` char(36) NOT NULL,
  `studio_title` varchar(50) NOT NULL,
  `studio_owner` char(36) DEFAULT NULL,
  `expire_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `studio_frame_id` int(11) NOT NULL DEFAULT 1,
  `studio_bgm_id` int(11) NOT NULL DEFAULT 1,
  `studio_bgm_volume` int(11) NOT NULL DEFAULT 100 CHECK (`studio_bgm_volume` between 1 and 200),
  `studio_status` enum('INCOMPLETE','ENCODING','COMPLETE','FAIL') NOT NULL DEFAULT 'INCOMPLETE',
  `studio_sticker` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`studio_id`),
  KEY `studio_owner` (`studio_owner`),
  KEY `studio_frame_id` (`studio_frame_id`),
  KEY `studio_bgm_id` (`studio_bgm_id`),
  CONSTRAINT `studio_ibfk_1` FOREIGN KEY (`studio_owner`) REFERENCES `user` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `studio_ibfk_2` FOREIGN KEY (`studio_frame_id`) REFERENCES `frame` (`frame_id`),
  CONSTRAINT `studio_ibfk_3` FOREIGN KEY (`studio_bgm_id`) REFERENCES `bgm` (`bgm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studio`
--

LOCK TABLES `studio` WRITE;
/*!40000 ALTER TABLE `studio` DISABLE KEYS */;
INSERT INTO `studio` VALUES ('0581800c-58a3-4e0b-8daf-457f386119ca','ㅁㅁㅁ','1ab72825-6f64-4a46-b789-4651566de977','2024-02-22 20:28:14',6,4,18,'COMPLETE','0581800c-58a3-4e0b-8daf-457f386119ca/1707996463364.png'),('119540e0-ef33-4664-a822-473addea23b3','공통 프로젝트 수고했어요','b23c6aad-03ff-4f88-8047-ab54b82424b1','2024-02-19 23:59:59',22,1,100,'INCOMPLETE',NULL),('178551df-d802-4591-a2dc-a868b7135361','응원영상','c900672f-25c2-4cdc-b922-c09150c79c0e','2024-02-29 23:59:59',6,3,100,'INCOMPLETE','178551df-d802-4591-a2dc-a868b7135361/1707987024275.png'),('18439882-bc00-4f65-905d-3cb4832b2d18','studio','8fb03284-691e-48d4-937c-6811b5eb077c','2024-02-27 23:59:59',3,6,36,'INCOMPLETE','18439882-bc00-4f65-905d-3cb4832b2d18/1707998647856.png'),('18ee13d2-24b2-4257-9148-3f219243c2cb','뮤비 촬영','54a33c9b-8731-4075-8bd1-33b8e7b01b64','2024-02-29 23:59:59',22,1,100,'INCOMPLETE','18ee13d2-24b2-4257-9148-3f219243c2cb/1707996221501.png'),('26fbc8a9-8f78-458a-833d-07a6853c3a8e','취업 축하','1ab72825-6f64-4a46-b789-4651566de977','2024-02-29 23:59:59',6,1,100,'INCOMPLETE',NULL),('2c49385a-ec8a-42b5-ba26-420df223b6f5','즐거운코딩','8fb03284-691e-48d4-937c-6811b5eb077c','2024-02-29 23:59:59',3,1,100,'INCOMPLETE',NULL),('425d87e9-e504-4f0d-a60e-29e3aee622dc','프로젝트 완성 기념','8fb03284-691e-48d4-937c-6811b5eb077c','2024-02-22 21:36:52',4,6,14,'COMPLETE','425d87e9-e504-4f0d-a60e-29e3aee622dc/1708000306396.png'),('580ec2d5-3ff7-4e93-bb92-4a7e7021722f','100일 기념','54a33c9b-8731-4075-8bd1-33b8e7b01b64','2024-02-29 23:59:59',10,1,100,'INCOMPLETE','580ec2d5-3ff7-4e93-bb92-4a7e7021722f/1707996529391.png'),('5c251e9c-b314-45bc-bc04-387740f86469','유경이 생일 축하','b2c0c09e-927d-4700-863d-3f510378f3b4','2024-02-17 23:59:59',10,7,17,'INCOMPLETE','5c251e9c-b314-45bc-bc04-387740f86469/1708041230926.png'),('60535e85-d428-4064-8a86-8fe943a4f7b5','ㄹㅇㄹㄹㄹ','b2c0c09e-927d-4700-863d-3f510378f3b4','2024-02-23 01:07:04',1,1,100,'COMPLETE','60535e85-d428-4064-8a86-8fe943a4f7b5/1708013204410.png'),('61c4d028-5445-4fb4-8e5e-2b1890950072','15반 교수님 생신 축하','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde','2024-02-22 19:46:26',2,1,100,'COMPLETE','61c4d028-5445-4fb4-8e5e-2b1890950072/1707993905094.png'),('67a90c78-2856-46dd-996c-a9250bbfc5e5','선재 결혼 축하 영상','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde','2024-02-22 19:53:54',12,1,100,'COMPLETE','67a90c78-2856-46dd-996c-a9250bbfc5e5/1707994405397.png'),('703ca8dc-1e42-4d52-9b88-10765a25436c','만나서 반가워','e58ba822-ce94-4d42-8f50-29dcd4a977eb','2024-02-23 08:43:19',21,1,100,'COMPLETE','703ca8dc-1e42-4d52-9b88-10765a25436c/1708040505265.png'),('76c4b2f9-ffc1-4a18-8a34-d3f66de7388d','9기 선배님들!','8835b760-92c2-47a1-abf4-6d1d1005394f','2024-02-22 20:08:00',5,1,100,'COMPLETE','76c4b2f9-ffc1-4a18-8a34-d3f66de7388d/1707995228076.png'),('81d939dd-4a1a-4b82-a6b1-43333d0d1a80','프로젝트 완성 축하','be912988-dbd9-49cc-b1a6-4a49837e68b8','2024-02-29 23:59:59',6,1,100,'INCOMPLETE',NULL),('903a179d-d20d-4a53-bc28-6ee53efe1703','ㄹㄷㄹㄷㄹ','1ab72825-6f64-4a46-b789-4651566de977','2024-02-29 23:59:59',1,1,100,'INCOMPLETE',NULL),('9578b1d8-b100-40ef-a2e6-80f312fe6d3a','게임 영상','6304df48-dfe7-42e1-b257-c2a110dff6a0','2024-02-23 01:38:55',21,6,5,'COMPLETE','9578b1d8-b100-40ef-a2e6-80f312fe6d3a/1708014965424.png'),('9b89049e-8848-40ed-b96e-7142b5db12e1','태운이 생일 축하','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde','2024-02-22 19:46:06',4,1,100,'COMPLETE','9b89049e-8848-40ed-b96e-7142b5db12e1/1707993438863.png'),('a9c365a1-4ff5-4afd-9598-a9b62d388a66','은수 코로나 위로 영상','8835b760-92c2-47a1-abf4-6d1d1005394f','2024-02-29 23:59:59',11,1,100,'INCOMPLETE',NULL),('b22ee824-bafd-4d05-86a9-c4a49eca39e8','시간 확인용','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde','2024-02-23 02:34:21',13,18,7,'COMPLETE','b22ee824-bafd-4d05-86a9-c4a49eca39e8/1708016109715.png'),('b8f4e93e-bb46-4738-a292-a502d9580249','꿍이야 태어난 걸 축하해','8835b760-92c2-47a1-abf4-6d1d1005394f','2024-02-29 23:59:59',18,1,100,'INCOMPLETE','b8f4e93e-bb46-4738-a292-a502d9580249/1707995463283.png'),('b913eccd-fd80-404c-bb5e-8be417dabaa8','하이하이','b23c6aad-03ff-4f88-8047-ab54b82424b1','2024-02-19 23:59:59',6,9,28,'INCOMPLETE','b913eccd-fd80-404c-bb5e-8be417dabaa8/1708020060198.png'),('ba270f7f-029c-47d7-aa17-715e4e9280f2','1학기 마무리 영상','8835b760-92c2-47a1-abf4-6d1d1005394f','2024-02-29 23:59:59',9,1,100,'INCOMPLETE','ba270f7f-029c-47d7-aa17-715e4e9280f2/1707995855357.png'),('bced5d14-fcaa-4c7b-a44e-b82b0b0c0728','힘내라 힘','b2c0c09e-927d-4700-863d-3f510378f3b4','2024-02-29 23:59:59',15,1,100,'INCOMPLETE','bced5d14-fcaa-4c7b-a44e-b82b0b0c0728/1707997003104.png'),('c4b3c9e0-5a80-4bcc-9fb9-4dcef7555ba5','나의 방','6304df48-dfe7-42e1-b257-c2a110dff6a0','2024-03-01 23:59:59',1,1,100,'INCOMPLETE',NULL),('c6840505-5ded-40e0-81e4-b5c139f78837','완쾌 기원','b2c0c09e-927d-4700-863d-3f510378f3b4','2024-02-18 23:59:59',12,1,100,'INCOMPLETE','c6840505-5ded-40e0-81e4-b5c139f78837/1708045705574.png'),('c8fd7e00-1eab-4ef3-9844-9fa85774bf57','김연수 싸탈 축하','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde','2024-02-22 19:50:34',9,1,100,'COMPLETE','c8fd7e00-1eab-4ef3-9844-9fa85774bf57/1707994112508.png'),('d3fed5dd-56e9-47ae-a480-50feb8ec6833','공통 프로젝트 마무리 인사','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde','2024-02-21 23:59:59',13,1,100,'INCOMPLETE',NULL),('dabea791-bde7-4f13-a70e-1f5d64411acc','제목없음','6405c79f-62a1-4863-8be7-83b3d71d1bf5','2024-02-29 23:59:59',18,1,100,'INCOMPLETE',NULL),('e25a99a2-c477-4968-8506-9a4b678a130d','테스트','8835b760-92c2-47a1-abf4-6d1d1005394f','2024-02-22 20:02:32',6,1,100,'COMPLETE','e25a99a2-c477-4968-8506-9a4b678a130d/1707994913430.png'),('fb8a1a19-28ca-4338-a165-966605319c1d','수능 응원 영상','54a33c9b-8731-4075-8bd1-33b8e7b01b64','2024-02-29 23:59:59',19,1,100,'INCOMPLETE','fb8a1a19-28ca-4338-a165-966605319c1d/1707996830438.png'),('fd323d3f-7ecb-47be-845b-25cf88ddea95','제목없음','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde','2024-02-22 19:57:05',10,1,100,'COMPLETE','fd323d3f-7ecb-47be-845b-25cf88ddea95/1707994594560.png');
/*!40000 ALTER TABLE `studio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studio_participant`
--

DROP TABLE IF EXISTS `studio_participant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `studio_participant` (
  `studio_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  PRIMARY KEY (`studio_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `studio_participant_ibfk_1` FOREIGN KEY (`studio_id`) REFERENCES `studio` (`studio_id`) ON DELETE CASCADE,
  CONSTRAINT `studio_participant_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studio_participant`
--

LOCK TABLES `studio_participant` WRITE;
/*!40000 ALTER TABLE `studio_participant` DISABLE KEYS */;
INSERT INTO `studio_participant` VALUES ('0581800c-58a3-4e0b-8daf-457f386119ca','1ab72825-6f64-4a46-b789-4651566de977'),('119540e0-ef33-4664-a822-473addea23b3','b23c6aad-03ff-4f88-8047-ab54b82424b1'),('178551df-d802-4591-a2dc-a868b7135361','c900672f-25c2-4cdc-b922-c09150c79c0e'),('18439882-bc00-4f65-905d-3cb4832b2d18','8fb03284-691e-48d4-937c-6811b5eb077c'),('18ee13d2-24b2-4257-9148-3f219243c2cb','54a33c9b-8731-4075-8bd1-33b8e7b01b64'),('18ee13d2-24b2-4257-9148-3f219243c2cb','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('26fbc8a9-8f78-458a-833d-07a6853c3a8e','1ab72825-6f64-4a46-b789-4651566de977'),('2c49385a-ec8a-42b5-ba26-420df223b6f5','8fb03284-691e-48d4-937c-6811b5eb077c'),('425d87e9-e504-4f0d-a60e-29e3aee622dc','8fb03284-691e-48d4-937c-6811b5eb077c'),('425d87e9-e504-4f0d-a60e-29e3aee622dc','be912988-dbd9-49cc-b1a6-4a49837e68b8'),('580ec2d5-3ff7-4e93-bb92-4a7e7021722f','54a33c9b-8731-4075-8bd1-33b8e7b01b64'),('580ec2d5-3ff7-4e93-bb92-4a7e7021722f','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('5c251e9c-b314-45bc-bc04-387740f86469','1ab72825-6f64-4a46-b789-4651566de977'),('5c251e9c-b314-45bc-bc04-387740f86469','6304df48-dfe7-42e1-b257-c2a110dff6a0'),('5c251e9c-b314-45bc-bc04-387740f86469','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('5c251e9c-b314-45bc-bc04-387740f86469','8835b760-92c2-47a1-abf4-6d1d1005394f'),('5c251e9c-b314-45bc-bc04-387740f86469','b2c0c09e-927d-4700-863d-3f510378f3b4'),('60535e85-d428-4064-8a86-8fe943a4f7b5','b2c0c09e-927d-4700-863d-3f510378f3b4'),('61c4d028-5445-4fb4-8e5e-2b1890950072','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('61c4d028-5445-4fb4-8e5e-2b1890950072','8835b760-92c2-47a1-abf4-6d1d1005394f'),('67a90c78-2856-46dd-996c-a9250bbfc5e5','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('703ca8dc-1e42-4d52-9b88-10765a25436c','1ab72825-6f64-4a46-b789-4651566de977'),('703ca8dc-1e42-4d52-9b88-10765a25436c','6304df48-dfe7-42e1-b257-c2a110dff6a0'),('703ca8dc-1e42-4d52-9b88-10765a25436c','e58ba822-ce94-4d42-8f50-29dcd4a977eb'),('76c4b2f9-ffc1-4a18-8a34-d3f66de7388d','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('76c4b2f9-ffc1-4a18-8a34-d3f66de7388d','8835b760-92c2-47a1-abf4-6d1d1005394f'),('81d939dd-4a1a-4b82-a6b1-43333d0d1a80','be912988-dbd9-49cc-b1a6-4a49837e68b8'),('903a179d-d20d-4a53-bc28-6ee53efe1703','1ab72825-6f64-4a46-b789-4651566de977'),('9578b1d8-b100-40ef-a2e6-80f312fe6d3a','1ab72825-6f64-4a46-b789-4651566de977'),('9578b1d8-b100-40ef-a2e6-80f312fe6d3a','6304df48-dfe7-42e1-b257-c2a110dff6a0'),('9578b1d8-b100-40ef-a2e6-80f312fe6d3a','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('9b89049e-8848-40ed-b96e-7142b5db12e1','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('9b89049e-8848-40ed-b96e-7142b5db12e1','8835b760-92c2-47a1-abf4-6d1d1005394f'),('a9c365a1-4ff5-4afd-9598-a9b62d388a66','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('a9c365a1-4ff5-4afd-9598-a9b62d388a66','8835b760-92c2-47a1-abf4-6d1d1005394f'),('b22ee824-bafd-4d05-86a9-c4a49eca39e8','1ab72825-6f64-4a46-b789-4651566de977'),('b22ee824-bafd-4d05-86a9-c4a49eca39e8','6304df48-dfe7-42e1-b257-c2a110dff6a0'),('b22ee824-bafd-4d05-86a9-c4a49eca39e8','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('b22ee824-bafd-4d05-86a9-c4a49eca39e8','b23c6aad-03ff-4f88-8047-ab54b82424b1'),('b8f4e93e-bb46-4738-a292-a502d9580249','8835b760-92c2-47a1-abf4-6d1d1005394f'),('b913eccd-fd80-404c-bb5e-8be417dabaa8','1ab72825-6f64-4a46-b789-4651566de977'),('b913eccd-fd80-404c-bb5e-8be417dabaa8','6304df48-dfe7-42e1-b257-c2a110dff6a0'),('b913eccd-fd80-404c-bb5e-8be417dabaa8','b23c6aad-03ff-4f88-8047-ab54b82424b1'),('ba270f7f-029c-47d7-aa17-715e4e9280f2','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('ba270f7f-029c-47d7-aa17-715e4e9280f2','8835b760-92c2-47a1-abf4-6d1d1005394f'),('bced5d14-fcaa-4c7b-a44e-b82b0b0c0728','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('bced5d14-fcaa-4c7b-a44e-b82b0b0c0728','b2c0c09e-927d-4700-863d-3f510378f3b4'),('c4b3c9e0-5a80-4bcc-9fb9-4dcef7555ba5','1ab72825-6f64-4a46-b789-4651566de977'),('c4b3c9e0-5a80-4bcc-9fb9-4dcef7555ba5','6304df48-dfe7-42e1-b257-c2a110dff6a0'),('c4b3c9e0-5a80-4bcc-9fb9-4dcef7555ba5','b23c6aad-03ff-4f88-8047-ab54b82424b1'),('c6840505-5ded-40e0-81e4-b5c139f78837','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('c6840505-5ded-40e0-81e4-b5c139f78837','b2c0c09e-927d-4700-863d-3f510378f3b4'),('c8fd7e00-1eab-4ef3-9844-9fa85774bf57','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('d3fed5dd-56e9-47ae-a480-50feb8ec6833','1ab72825-6f64-4a46-b789-4651566de977'),('d3fed5dd-56e9-47ae-a480-50feb8ec6833','54a33c9b-8731-4075-8bd1-33b8e7b01b64'),('d3fed5dd-56e9-47ae-a480-50feb8ec6833','67961bfb-90a0-4947-aa90-9369a19ab7ef'),('d3fed5dd-56e9-47ae-a480-50feb8ec6833','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('d3fed5dd-56e9-47ae-a480-50feb8ec6833','926210e1-a603-464f-8ec2-f3a3c538166e'),('d3fed5dd-56e9-47ae-a480-50feb8ec6833','f1690193-f9ff-4545-bc2f-6778b3209b64'),('dabea791-bde7-4f13-a70e-1f5d64411acc','6405c79f-62a1-4863-8be7-83b3d71d1bf5'),('e25a99a2-c477-4968-8506-9a4b678a130d','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('e25a99a2-c477-4968-8506-9a4b678a130d','8835b760-92c2-47a1-abf4-6d1d1005394f'),('fb8a1a19-28ca-4338-a165-966605319c1d','54a33c9b-8731-4075-8bd1-33b8e7b01b64'),('fb8a1a19-28ca-4338-a165-966605319c1d','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde'),('fd323d3f-7ecb-47be-845b-25cf88ddea95','6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde');
/*!40000 ALTER TABLE `studio_participant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` char(36) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_nickname` varchar(50) NOT NULL,
  `user_password` varchar(70) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `user_role` varchar(16) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('1ab72825-6f64-4a46-b789-4651566de977','twnkm7089@gmail.com','김태운',NULL,'2024-02-15 10:38:32',NULL,'ROLE_SOCIAL'),('54a33c9b-8731-4075-8bd1-33b8e7b01b64','impigggulggul@naver.com','꿀꿀대지','$2a$10$XxtZbwfQv73WiNDzFztD8.ScSL2Vuxut29jJ2AFtJqS.jgZ4ASC7S','2024-02-15 11:21:44',NULL,'ROLE_USER'),('6304df48-dfe7-42e1-b257-c2a110dff6a0','nummummum@gmail.com','핑크돼지',NULL,'2024-02-15 08:10:42',NULL,'ROLE_SOCIAL'),('6405c79f-62a1-4863-8be7-83b3d71d1bf5','cebu13@gmail.com','Paul lo',NULL,'2024-02-15 09:20:20',NULL,'ROLE_SOCIAL'),('67961bfb-90a0-4947-aa90-9369a19ab7ef','iam6coach@gmail.com','코치님','$2a$10$0OpQdXIcss2h6bxIlxNKZ.3iMkQ1.G7rOz9FLkhqO8Q7rpPIFABPG','2024-02-16 00:15:30',NULL,'ROLE_USER'),('6b25fe9b-46ae-4f00-8ab5-6646d8e7fdde','yukyung531@gmail.com','권유경',NULL,'2024-02-15 08:04:00',NULL,'ROLE_SOCIAL'),('8835b760-92c2-47a1-abf4-6d1d1005394f','ycis50130@gmail.com','전하영',NULL,'2024-02-15 07:57:26',NULL,'ROLE_SOCIAL'),('8fb03284-691e-48d4-937c-6811b5eb077c','jim073@naver.com','태우니','$2a$10$utb5jxrcXg2ZvBdMYfin7uBAIVoOoG8e7Ak1u8j9iSp6xyypSelX6','2024-02-15 11:50:15','2024-02-16 08:39:15','ROLE_USER'),('926210e1-a603-464f-8ec2-f3a3c538166e','recletter.official@gmail.com','레크레터','$2a$10$kec79g123M0OXIhymvogcuwQQSP06v0kvCdDV7gYeP7SH5zhawLri','2024-02-15 08:19:51',NULL,'ROLE_USER'),('b23c6aad-03ff-4f88-8047-ab54b82424b1','sj06152@naver.com','써니','$2a$10$ffOPsO2MbUwcQQYffkjJHOaGiOG4DLLFcR/FVlTNavxlw2muGG7Dm','2024-02-15 16:40:35',NULL,'ROLE_USER'),('b2a0aa75-8af4-4cc2-b097-aed03e20ef19','ztrl97@gmail.com','신문영',NULL,'2024-02-15 09:20:14',NULL,'ROLE_SOCIAL'),('b2c0c09e-927d-4700-863d-3f510378f3b4','ycis5013x@gmail.com','HarshYoung',NULL,'2024-02-15 08:09:02',NULL,'ROLE_SOCIAL'),('be912988-dbd9-49cc-b1a6-4a49837e68b8','swls6425@gmail.com','김연수',NULL,'2024-02-15 07:48:35',NULL,'ROLE_SOCIAL'),('c900672f-25c2-4cdc-b922-c09150c79c0e','jyk4523@gmail.com','정유경',NULL,'2024-02-15 08:47:15',NULL,'ROLE_SOCIAL'),('e58ba822-ce94-4d42-8f50-29dcd4a977eb','sj06152@gmail.com','이선재',NULL,'2024-02-15 13:17:58',NULL,'ROLE_SOCIAL'),('f1690193-f9ff-4545-bc2f-6778b3209b64','kangjun6135@gmail.com','강준영[서울_ 6반]실습코치',NULL,'2024-02-16 00:10:29',NULL,'ROLE_SOCIAL');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-16  1:23:19
