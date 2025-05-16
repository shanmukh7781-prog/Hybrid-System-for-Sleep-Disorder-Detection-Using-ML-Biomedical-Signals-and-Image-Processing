drop database if exists db;
create database db;
use db;


create table users(
    id INT PRIMARY KEY AUTO_INCREMENT, 
    name VARCHAR(50), 
    email VARCHAR(50), 
    password VARCHAR(50)
    );

create table sleep_monitoring(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    eeg_data TEXT,
    hrv_data TEXT,
    sleep_position VARCHAR(20),
    respiratory_pattern VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id)
    );

create table sleep_classification(
    id INT PRIMARY KEY AUTO_INCREMENT,
    monitoring_id INT,
    classification_result VARCHAR(50),
    confidence_score FLOAT,
    classified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (monitoring_id) REFERENCES sleep_monitoring(id)
    );