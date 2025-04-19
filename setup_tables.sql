-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS everything;
USE everything;

-- Create job_creator table
CREATE TABLE IF NOT EXISTS job_creator (
    creator_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create job_applicant table
CREATE TABLE IF NOT EXISTS job_applicant (
    applicant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email_id VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_pic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create job_details table
CREATE TABLE IF NOT EXISTS job_details (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    job_role VARCHAR(255) NOT NULL,
    job_desc TEXT,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    salary VARCHAR(100),
    requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES job_creator(creator_id)
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    applicant_id INT NOT NULL,
    application_status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    isViewed BOOLEAN DEFAULT FALSE,
    isSaved BOOLEAN DEFAULT FALSE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES job_details(job_id),
    FOREIGN KEY (applicant_id) REFERENCES job_applicant(applicant_id)
);

-- Create products table for seller functionality
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    user_id INT NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 