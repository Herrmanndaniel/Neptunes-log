-- Create database
CREATE DATABASE IF NOT EXISTS herrmanTP;

-- Use the database
USE herrmanTP;


-- Drop existing locations table if it exists
DROP TABLE IF EXISTS locations;

-- Create table for locations
CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    description TEXT,
    iframe TEXT,
    added_by VARCHAR(255) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert mockup data into locations table
INSERT INTO locations (name, address, description, iframe, added_by, rating) VALUES
('Máchovo Jezero', 'Daník Braník', '29.3.2005', '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6326.725383238045!2d14.643709885514738!3d50.583837318727646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47095d2458d4c1d5%3A0xa36b784591f58fb6!2sM%C3%A1chovo%20jezero!5e1!3m2!1scs!2scz!4v1733254936483!5m2!1scs!2scz" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>', 'Admin', 5),
('Máchovo Jezero', 'Daník Braník', '29.3.2005', '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6326.725383238045!2d14.643709885514738!3d50.583837318727646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47095d2458d4c1d5%3A0xa36b784591f58fb6!2sM%C3%A1chovo%20jezero!5e1!3m2!1scs!2scz!4v1733254936483!5m2!1scs!2scz" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>', 'Admin', 4),


INSERT INTO locations(name,address,description, iframe, added_by, rating)
('Mockup Location', 'Mockup Address', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima architecto blanditiis natus. Neque blanditiis totam dolorum? Facere veniam unde sapiente architecto aperiam enim numquam voluptate, nihil, voluptates rerum fuga quidem.', '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6326.725383238045!2d14.643709885514738!3d50.583837318727646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47095d2458d4c1d5%3A0xa36b784591f58fb6!2sM%C3%A1chovo%20jezero!5e1!3m2!1scs!2scz!4v1733254936483!5m2!1scs!2scz" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>', 'Admin', 3);

SELECT * FROM locations;

-- Create table for users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


SELECT * FROM users;

-- Insert admin user
INSERT INTO users (username, email, password) VALUES
('admin', 'admin@example.com', '$2b$10$7QJ8Q8Q8Q8Q8Q8Q8Q8Q8QO8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q'); -- password: 'admin'

-- Update admin user's password
UPDATE users SET password = '$2b$10$7QJ8Q8Q8Q8Q8Q8Q8Q8QO8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q' WHERE username = 'admin'; -- password: 'Admin'
