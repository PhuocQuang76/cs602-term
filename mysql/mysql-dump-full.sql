-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 22, 2019 at 08:51 PM
-- Server version: 5.7.26
-- PHP Version: 7.3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `cs602_term`
--

-- --------------------------------------------------------

--
-- Table structure for table `app_users`
--

CREATE DATABASE cs602termpq;

CREATE USER 'cs602pquser'@'localhost' IDENTIFIED BY 'cs602pqpassword';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON cs602termpq.* TO 'cs602pquser'@'localhost';

use cs602termpq;

CREATE TABLE `app_users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'customer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `app_users`
--

INSERT INTO `app_users` (`id`, `username`, `password`, `firstname`, `lastname`, `email`, `type`) VALUES
(1, 'phuoc', '9f8dc910360f67ff56a9e4d48cfad85ce5739b819f80adbb305add66edfe4d5ecc080db2885506a25cb69b412904747d02615791c7fcbd2374ea64f304c539f9', 'Phuoc', 'Quang', 'noeamil@noeamil.com', 'admin'),
(2, 'phuoc1', '9f8dc910360f67ff56a9e4d48cfad85ce5739b819f80adbb305add66edfe4d5ecc080db2885506a25cb69b412904747d02615791c7fcbd2374ea64f304c539f9', 'Phuoc', 'Quang', 'nomail@noemail.com', 'customer'),
(3, 'client1', '0da4c785f5d0b4cf0f32d50742973718b106bec17b1a5739fc3fc02114ae2e554ed919b828d74e0745593acad441ab7dfad1e0b354df0535c41f310a6712dd29', 'client1', 'mr', 'client1@yahoo.com', 'customer');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `image_url` varchar(1024) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `image_url`) VALUES
(1, 'Nail Polish', '/img/categories/polish_catagory.png'),
(2, 'Gel', '/img/categories/gel_catagory.png'),
(3, 'Lotions', '/img/categories/lotion-catagory.jpg'),
(4, 'Accessories', '/img/categories/accesory-catagory.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `itemId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `itemName` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `feature` tinyint(4) NOT NULL DEFAULT '0',
  `imageUrl` varchar(1024) NOT NULL,
  `count` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`itemId`, `categoryId`, `itemName`, `price`, `feature`, `imageUrl`, `count`) VALUES
(32, 4, 'Gel Remove Clip', 5, 1, '/img/items/tmp-1-1566508093432', 10),
(33, 2, 'SBS gel polish', 10, 0, '/img/items/tmp-2-1566508120535', 5),
(34, 3, 'Hand Lotion', 8, 0, '/img/items/tmp-3-1566508145113', 15),
(35, 1, 'Pink OPI nail polish', 4, 1, '/img/items/tmp-4-1566508166852', 5);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `street1` varchar(255) NOT NULL,
  `street2` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `zip` int(11) NOT NULL,
  `state` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `creditcard` varchar(15) NOT NULL,
  `exp_date` char(4) NOT NULL,
  `order_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  `price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `app_users`
--
ALTER TABLE `app_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category_name_uindex` (`name`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`itemId`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `item_id` (`item_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `app_users`
--
ALTER TABLE `app_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `itemId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`itemId`);
