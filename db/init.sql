CREATE DATABASE IF NOT EXISTS exploding_puppy;
USE exploding_puppy;
CREATE TABLE IF NOT EXISTS user (
    userId varchar(36) NOT NULL,
    userName varchar(50) NOT NULL,
    userRank int NOT NULL,
    userLevel int NOT NULL,
    accessToken text UNIQUE,
    PRIMARY KEY (userId)
);
CREATE TABLE IF NOT EXISTS game_match (
    matchId int NOT NULL,
    userId varchar(36) NOT NULL,
    result int NOT NULL,
    finishedTime date,
    PRIMARY KEY (matchId, userId)
);