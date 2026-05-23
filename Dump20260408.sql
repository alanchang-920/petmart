
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

/*!40000 DROP DATABASE IF EXISTS `petmart`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `petmart` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `petmart`;
DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `cart_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `cart_id` (`cart_id`),
  KEY `ix_cart_items_id` (`id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `total_price` decimal(10,2) NOT NULL,
  `user_id` int DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()),
  `recipient_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `shipping_address` text,
  `note` text,
  `restocked` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ix_carts_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Premium Dog Kibble','Nutritious dry food for adult dogs with balanced protein and vitamins.',49.99,'Dog Food','/images/dog-kibble.jpg',3,'2026-04-04 16:14:25','2026-05-23 04:51:10'),(2,'Chicken Puppy Bites','Soft chicken treats specially made for puppies and small dogs.',15.50,'Dog Food','/images/puppy-bites.jpg',18,'2026-04-04 16:14:25','2026-05-23 04:51:37'),(3,'Indoor Cat Delight','Dry food formula designed for indoor cats with hairball control support.',39.90,'Cat Food','/images/indoor-cat-food.jpg',13,'2026-04-04 16:14:25','2026-05-23 04:44:38'),(4,'Salmon Cat Treats','Crunchy salmon flavored treats for cats.',11.99,'Cat Food','/images/salmon-cat-treats.jpg',27,'2026-04-04 16:14:25','2026-05-23 04:44:32'),(5,'Rubber Chew Toy','Durable rubber chew toy for dogs to support healthy teeth and gums.',12.99,'Toys','/images/rubber-chew-toy.jpg',24,'2026-04-04 16:14:25','2026-05-12 01:56:14'),(6,'Feather Wand Teaser','Interactive feather toy designed to keep cats active and entertained.',9.50,'Toys','/images/feather-wand.jpg',18,'2026-04-04 16:14:25','2026-05-23 04:44:25'),(7,'Cat Scratching Post','Durable scratching post for indoor cats to protect furniture and encourage play.',35.50,'Accessories','/images/cat-scratching-post.jpg',10,'2026-04-04 16:14:25','2026-05-12 00:52:33'),(8,'Adjustable Pet Collar','Comfortable and adjustable collar suitable for small to medium pets.',14.25,'Accessories','/images/pet-collar.jpg',15,'2026-04-04 16:14:25','2026-05-23 03:53:10'),(9,'Gentle Pet Shampoo','Mild pet shampoo for dogs and cats with sensitive skin.',18.75,'Grooming','/images/pet-shampoo.jpg',15,'2026-04-04 16:14:25','2026-04-04 16:14:25'),(10,'Pet Nail Clipper','Safe and easy-to-use nail clipper for regular pet grooming.',16.40,'Grooming','/images/pet-nail-clipper.jpg',19,'2026-04-04 16:14:25','2026-05-19 05:50:46'),(11,'Plush Pet Bed','Soft and cozy bed for cats and small dogs.',45.00,'Beds','/images/plush-pet-bed.jpg',10,'2026-04-04 16:14:25','2026-04-04 16:14:25'),(12,'Travel Pet Carrier','Portable carrier for convenient and comfortable pet travel.',59.95,'Beds','/images/pet-carrier.jpg',8,'2026-04-04 16:14:25','2026-04-04 16:14:25'),(13,'test product','this is test only',20.00,'Dog Food','https://fragranceinnovation.com.au/wp-content/uploads/2022/07/puppy-and-kitten-posing-with-pet-care-products.jpg',192,'2026-05-13 09:20:01','2026-05-13 09:20:01');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_username` (`username`),
  UNIQUE KEY `ix_users_email` (`email`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@gmail.com','$2b$12$fZn.cXFuNRMqfWocQjoraOVM0Ng9ApEq5vtU7eXfs4J2njumrCh1a','admin','2026-05-13 08:43:59','2026-05-13 08:43:59'),(3,'test2','test2@gmail.com','$2b$12$pUN2fSo34T41xmKZGvpnmuR.U3EyUeWy4BPMG1ZDOQqapY4p3..QS','user','2026-05-23 03:52:32','2026-05-23 04:52:47'),(4,'testuser3','testuser3@gmail.com','$2b$12$uTDOyZfFwlKAJg6q3OL.zONjZlrIUVbAFhWAPHSVI7iUuLETD78V.','user','2026-05-23 04:11:35','2026-05-23 04:11:35'),(6,'test4','test4@gmail.com','$2b$12$7t9g9aOjlOPfceScmhJhPuACXGS1S8gB3LzRHe5VYTJ2PQS8dt61a','user','2026-05-23 04:49:59','2026-05-23 04:49:59'),(7,'testadmin1','testadmin1@gmail.com','$2b$12$FxQ/OFLmOWpbKXxVn9r8aOhYs1GAPd9hGkTsQa6Sffo9cvK9x6Zbu','admin','2026-05-23 04:53:09','2026-05-23 04:53:09');
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

