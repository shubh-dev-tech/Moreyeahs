-- SQL script to create the contact form submissions table
-- Run this in your MySQL/phpMyAdmin if the plugin activation doesn't work

USE `moreyeahs-new`;

CREATE TABLE IF NOT EXISTS `wp_contact_form_submissions` (
    `id` mediumint(9) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `phone` varchar(20) DEFAULT '',
    `subject` varchar(255) DEFAULT '',
    `message` text DEFAULT '',
    `submitted_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `ip_address` varchar(45) DEFAULT '',
    `user_agent` text DEFAULT '',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert a test record to verify the table works
INSERT INTO `wp_contact_form_submissions` 
(`name`, `email`, `phone`, `subject`, `message`, `ip_address`, `user_agent`) 
VALUES 
('Test User', 'test@example.com', '123-456-7890', 'Test Subject', 'This is a test message to verify the table works.', '127.0.0.1', 'Manual SQL Insert');

-- Check if the record was inserted
SELECT * FROM `wp_contact_form_submissions` ORDER BY `id` DESC LIMIT 1;