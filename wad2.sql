drop database if exists WAD2PROJ;

create database WAD2PROJ;
use WAD2PROJ;

CREATE TABLE if not exists USERACCOUNT (
	name varchar (64) NOT NULL,
	username varchar(20) NOT NULL PRIMARY KEY,
    password varchar(64) NOT NULL,
    gender varchar (6) NOT NULL,
    email varchar(64) NOT NULL,
    bio varchar(200) NOT NULL,
    skills int NOT NULL
);

CREATE TABLE if not exists REVIEWS (
	username varchar(20) NOT NULL PRIMARY KEY,
    content varchar (2000) NOT NULL,
    rating int NOT NULL PRIMARY KEY 
);

CREATE TABLE if not exists SAVED_RECIPES (
	recipe_no int NOT NULL PRIMARY KEY,
    username varchar(20) NOT NULL
);