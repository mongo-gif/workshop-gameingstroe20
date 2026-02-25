CREATE DATABASE IF NOT EXISTS gaming_store;
USE gaming_store;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    stock INT DEFAULT 0,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Initial Data
INSERT INTO users (username, password, role) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'), -- password: 'password'
('user', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer'); -- password: 'password'

INSERT INTO products (name, description, price, image_url, stock, category) VALUES 
('Razer DeathAdder V3', 'Ultra-lightweight ergonomic esports mouse', 2490.00, 'images/mouse.png', 50, 'Mouse'),
('Logitech G Pro X Keyboard', 'Mechanical gaming keyboard with swappable switches', 4590.00, 'images/keyboard.png', 30, 'Keyboard'),
('HyperX Cloud II', 'Comfortable gaming headset with 7.1 surround sound', 3290.00, 'images/headset.png', 40, 'Headset'),
('Secretlab Titan Evo', 'Premium gaming chair for ultimate comfort', 18900.00, 'images/chair.png', 10, 'Chair'),
('BenQ ZOWIE XL2546K', '240Hz Gaming Monitor for Esports', 19900.00, 'images/monitor.png', 15, 'Monitor');
