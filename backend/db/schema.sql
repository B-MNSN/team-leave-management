-- =====================================
-- CREATE DATABASE
-- =====================================

CREATE DATABASE IF NOT EXISTS leave_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE leave_management;

-- =====================================
-- USERS
-- =====================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('EMPLOYEE','MANAGER') DEFAULT 'EMPLOYEE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- LEAVE TYPES
-- =====================================

CREATE TABLE IF NOT EXISTS leave_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    annual_quota DECIMAL(4, 1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- LEAVE REQUESTS
-- =====================================

CREATE TABLE IF NOT EXISTS leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration ENUM('FULL', 'HALF_AM', 'HALF_PM') DEFAULT 'FULL',
    total_days DECIMAL(4, 1) NOT NULL,
    reason TEXT,
    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED',
        'CANCELLED'
    ) DEFAULT 'PENDING',
    manager_comment TEXT,
    approved_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_type FOREIGN KEY (leave_type_id) REFERENCES leave_types (id),
    CONSTRAINT fk_leave_approved_by FOREIGN KEY (approved_by) REFERENCES users (id)
);

-- =====================================
-- LEAVE REQUEST LOGS
-- =====================================

CREATE TABLE IF NOT EXISTS leave_request_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    leave_request_id INT NOT NULL,
    action ENUM(
        'CREATED',
        'APPROVED',
        'REJECTED',
        'CANCELLED'
    ) NOT NULL,
    action_by INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leave_request_id) REFERENCES leave_requests (id) ON DELETE CASCADE,
    FOREIGN KEY (action_by) REFERENCES users (id)
);