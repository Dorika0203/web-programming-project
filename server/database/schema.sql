-- SQLBook: Code
-- Active: 1669171733588@@127.0.0.1@3306@webpdb
use webpdb;

DROP TABLE users;
DROP TABLE sessions;
DROp TABLE products;

create table if NOT exists users (
    usercode INT AUTO_INCREMENT NOT NULL,
    id VARCHAR(4) NOT NULL,
    pw VARCHAR(4) NOT NULL,
    name VARCHAR(4) NOT NULL,
    email VARCHAR(30) NOT NULL,
    phone VARCHAR(13) NOT NULL,
    usertype CHAR(1) NOT NULL,
    PRIMARY KEY(usercode)
);

INSERT INTO users (id, pw, email, phone, name, usertype) VALUES ('root', 'root', 'root@admin.com', '010-0000-0000', 'roo', 'R');
INSERT INTO users (id, pw, email, phone, name, usertype) VALUES ('qwer', 'qwer', 'qwer@asdf.com', '010-1111-1111', 'qwe', 'S');
INSERT INTO users (id, pw, email, phone, name, usertype) VALUES ('asdf', 'asdf', 'asdf@qwer.com', '010-2222-2222', 'asd', 'B');

create table if NOT exists products (
    pcode INT AUTO_INCREMENT NOT NULL,
    sellerid VARCHAR(4) NOT NULL,
    name VARCHAR(50) NOT NULL,
    price INT NOT NULL,
    place VARCHAR(50) NOT NULL,
    ptype CHAR(1) NOT NULL,
    ptext VARCHAR(50) NOT NULL,
    ptextdetail VARCHAR(200) NOT NULL,
    pimage VARCHAR(50) NOT NULL,
    plikes INT NOT NULL DEFAULT 0,
    ptime DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(pcode)
);


TRUNCATE TABLE products;

INSERT INTO products (sellerid, name, price, place, ptype, ptext, ptextdetail, pimage)
    VALUES ('qwer', 'product_1', 10000, 'Suwon', 'F', 'adidas handbag', 'sakdfjlkasdjflkasfdjkljdsa', 'p1.jpg');