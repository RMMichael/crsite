
--DROP DATABASE IF EXISTS mydb;
--CREATE DATABASE mydb;
--\c mydb;
DROP TABLE IF EXISTS test_table;
CREATE TABLE test_table (id integer, name text);
INSERT INTO test_table VALUES (1, 'hello database');
INSERT INTO test_table VALUES (2, 'goodbye database');

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id int generated by default as identity not null,
  email varchar(100) null,
  google_id varchar(100) null,
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

--DROP TABLE IF EXISTS instructors CASCADE;
--CREATE TABLE "instructors" (
--    "id" int generated by default as identity not null,
--    "name" varchar(100),
--    primary key ("id"),
--    CONSTRAINT i_constraint UNIQUE (name)
--);

DROP TABLE IF EXISTS classes CASCADE;
create table "classes" (
  "course_code" int not null,
  "course_id" int not null,
--  "instructor_id" int not null,
  "instructor" varchar(100) null,
  "term" varchar(45) null,
  primary key ("course_code"),
  CONSTRAINT fk_course_id
    FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
--  CONSTRAINT fk_instructor_id
--    FOREIGN KEY (instructor_id)
--        REFERENCES instructors(id)
--        ON UPDATE CASCADE
--        ON DELETE CASCADE
);

DROP TABLE IF EXISTS reviews CASCADE;
create table "reviews" (
    "user_id" int not null,
    "course_code" int not null,
    "review_text" varchar(1000),
    "difficulty" int not null,
    "hours_per_week" int not null,
    "rating" int not null,
    "review_date" timestamp not null DEFAULT now(),
    CONSTRAINT fk_user_id
      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_course_code
      FOREIGN KEY (course_code)
        REFERENCES classes(course_code)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

