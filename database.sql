CREATE DATABASE exercises;

CREATE TABLE `users` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `username` varchar(255) NOT NULL,
 `email` varchar(255) NOT NULL,
 `password` varchar(255) NOT NULL,
 `points` int(11) DEFAULT 0,
 PRIMARY KEY (`id`),
 UNIQUE KEY `username` (`username`),
 UNIQUE KEY `email` (`email`),
 KEY `id` (`id`,`username`,`email`,`password`,`points`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

CREATE TABLE `rewards` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 `description` text DEFAULT NULL,
 `pointsRequired` int(11) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

CREATE TABLE `userrewards` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `userId` int(11) DEFAULT NULL,
 `rewardId` int(11) DEFAULT NULL,
 PRIMARY KEY (`id`),
 KEY `userId` (`userId`),
 KEY `rewardId` (`rewardId`),
 CONSTRAINT `userrewards_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
 CONSTRAINT `userrewards_ibfk_2` FOREIGN KEY (`rewardId`) REFERENCES `rewards` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

CREATE TABLE `workoutlevels` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 `description` text DEFAULT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

CREATE TABLE `workoutroutines` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `levelId` int(11) DEFAULT NULL,
 `name` varchar(255) NOT NULL,
 `days` int(11) NOT NULL,
 `description` text DEFAULT NULL,
 `pointsAwarded` int(11) DEFAULT 0,
 PRIMARY KEY (`id`),
 KEY `levelId` (`levelId`),
 CONSTRAINT `workoutroutines_ibfk_1` FOREIGN KEY (`levelId`) REFERENCES `workoutlevels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

CREATE TABLE `userworkoutplans` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `userId` int(11) DEFAULT NULL,
 `routineId` int(11) DEFAULT NULL,
 `weekStartDate` date DEFAULT NULL,
 `completed` tinyint(1) NOT NULL,
 PRIMARY KEY (`id`),
 KEY `userId` (`userId`),
 KEY `routineId` (`routineId`),
 CONSTRAINT `userworkoutplans_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
 CONSTRAINT `userworkoutplans_ibfk_2` FOREIGN KEY (`routineId`) REFERENCES `workoutroutines` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci