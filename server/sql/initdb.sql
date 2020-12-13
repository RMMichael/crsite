
DROP DATABASE IF EXISTS mydb;
CREATE DATABASE mydb;
\c mydb;
CREATE TABLE test_table (id integer, name text);
INSERT INTO test_table VALUES (1, 'hello database');
