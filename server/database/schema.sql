-- Active: 1669134959110@@127.0.0.1@3306@webpdb
create database if not exists webpdb;

use webpdb;

DROP TABLE users;

create table if not exists users (
    usercode tinyint(4) AUTO_INCREMENT NOT NULL,
    id char(4) not null,
    pw char(4) not null,
    email char(30) not null,
    phone char(13) not null,
    primary key(usercode)
);

INSERT INTO users (id, pw, email, phone) VALUES ('id', 'pw', 'a@b.com', '010-0000-0000')