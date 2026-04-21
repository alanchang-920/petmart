-- MySQL dump 10.13  Distrib 8.0.45, for macos15 (arm64)
--
-- Host: localhost    Database: minimart
-- ------------------------------------------------------
-- Server version	8.4.8

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
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `ix_cart_items_id` (`id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (14,2,1,'2026-04-08 11:54:23','2026-04-08 11:54:23');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `ix_products_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Premium Dog Kibble','Nutritious dry food for adult dogs with balanced protein and vitamins.',49.99,'Dog Food','/images/dog-kibble.jpg',20,'2026-04-04 16:14:25','2026-04-04 16:14:25'),(2,'Chicken Puppy Bites','Soft chicken treats specially made for puppies and small dogs.',15.50,'Dog Food','/images/puppy-bites.jpg',35,'2026-04-04 16:14:25','2026-04-04 16:14:25'),(3,'Indoor Cat Delight','Dry food formula designed for indoor cats with hairball control support.',39.90,'Cat Food','/images/indoor-cat-food.jpg',18,'2026-04-04 16:14:25','2026-04-04 16:14:25'),(4,'Salmon Cat Treats','Crunchy salmon flavored treats for cats.',11.99,'Cat Food','/images/salmon-cat-treats.jpg',40,'2026-04-04 16:14:25','2026-04-04 16:14:25'),(5,'Rubber Chew Toy','Durable rubber chew toy for dogs to support healthy teeth and gums.',12.99,'Toys','/images/rubber-chew-toy.jpg',30,'2026-04-04 16:14:25','2026-04-04 16:14:25'),(6,'Feather Wand Teaser','Interactive feather toy designed to keep cats active and entertained.',9.50,'Toys','/images/feather-wand.jpg',25,'2026-04-04 16:14:25','2026-04-04 16:14:25'),(7,'Cat Scratching Post','Durable scratching post for indoor cats to protect furniture and encourage play.',35.50,'Accessories','/images/cat-scratching-post.jpg',12,'2026-04-04 16:14:25','2026-04-04 16:14:25'),(8,'Adjustable Pet Collar','Comfortable and adjustable collar suitable for small to medium pets.',14.25,'Accessories','/images/pet-collar.jpg',28,'2026-04-04 16:14:25','2026-04-04 16:14:25'),(9,'Gentle Pet Shampoo','Mild pet shampoo for dogs and cats with sensitive skin.',18.75,'Grooming','/images/pet-shampoo.jpg',15,'2026-04-04 16:14:25','2026-04-04 16:14:25'),(10,'Pet Nail Clipper','Safe and easy-to-use nail clipper for regular pet grooming.',16.40,'Grooming','/images/pet-nail-clipper.jpg',22,'2026-04-04 16:14:25','2026-04-04 16:14:25'),(11,'Plush Pet Bed','Soft and cozy bed for cats and small dogs.',45.00,'Beds','/images/plush-pet-bed.jpg',10,'2026-04-04 16:14:25','2026-04-04 16:14:25'),(12,'Travel Pet Carrier','Portable carrier for convenient and comfortable pet travel.',59.95,'Beds','/images/pet-carrier.jpg',8,'2026-04-04 16:14:25','2026-04-04 16:14:25');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-08 23:53:31
