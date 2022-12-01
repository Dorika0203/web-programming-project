-- SQLBook: Code
-- Active: 1669171733588@@127.0.0.1@3306@webpdb
use webpdb;

DROP TABLE users;

create table if not exists users (
    usercode tinyint(4) AUTO_INCREMENT NOT NULL,
    id char(4) not null,
    pw char(4) not null,
    email char(30) not null,
    phone char(13) not null,
    usertype char(1) not null,
    primary key(usercode)
);

INSERT INTO users (id, pw, email, phone, usertype) VALUES ('root', 'root', 'root@admin.com', '010-0000-0000', 'R');
INSERT INTO users (id, pw, email, phone, usertype) VALUES ('qwer', 'qwer', 'qwer@asdf.com', '010-1111-1111', 'B');
INSERT INTO users (id, pw, email, phone, usertype) VALUES ('asdf', 'asdf', 'asdf@qwer.com', '010-2222-2222', 'S');