-- ============================================================
--  TEMPLATE FILE — safe to upload to GitHub
--  Run this file in your MySQL to set up the database.
-- ============================================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS iotech_contacts;

-- 2. Use it
USE iotech_contacts;

-- 3. Create the contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    date     DATETIME,
    name     VARCHAR(100),
    phone    VARCHAR(30),
    email    VARCHAR(100),
    service  VARCHAR(50),
    location VARCHAR(100),
    message  TEXT,
    contact  VARCHAR(30)
);
