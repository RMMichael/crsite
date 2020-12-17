
--DROP DATABASE IF EXISTS mydb;
--CREATE DATABASE mydb;
--\c mydb;
DROP TABLE IF EXISTS test_table;
CREATE TABLE test_table (id integer, name text);
INSERT INTO test_table VALUES (1, 'hello database');
INSERT INTO test_table VALUES (2, 'goodbye database');

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id int generated by default as identity not null,
  email varchar(100) null,
  googleid varchar(100) null,
  primary key (id)
);

DROP TABLE IF EXISTS courses CASCADE;
create table "courses" (
  "id" int generated by default as identity not null,
  "title" varchar(100) null,
  "dept" varchar(10) null,
  "number" varchar(10) null,
  primary key ("id"),
  CONSTRAINT u_constraint UNIQUE (dept, number)
);

DROP TABLE IF EXISTS instructors CASCADE;
CREATE TABLE "instructors" (
    "id" int generated by default as identity not null,
    "name" varchar(100),
    primary key ("id"),
    CONSTRAINT i_constraint UNIQUE (name)
);

DROP TABLE IF EXISTS classes CASCADE;
create table "classes" (
  "course_code" int not null,
  "course_id" int not null,
  "instructor_id" int not null,
  "term" varchar(45) null,
  primary key ("course_code"),
  CONSTRAINT fk_course_id
    FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
  CONSTRAINT fk_instructor_id
    FOREIGN KEY (instructor_id)
        REFERENCES instructors(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


INSERT INTO users(email, googleid) VALUES ('a@uci.edu', '69420');
