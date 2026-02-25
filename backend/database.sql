SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection=utf8mb4;

CREATE DATABASE IF NOT EXISTS gaming_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gaming_store;


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2) DEFAULT NULL,
    image_url VARCHAR(500),
    stock INT DEFAULT 0,
    category VARCHAR(50),
    badge VARCHAR(20) DEFAULT NULL,
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

-- Initial Users (password: 'password')
INSERT INTO users (username, password, role) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('user', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer');

-- Mouse
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('Razer DeathAdder V3', 'Ultra-lightweight ergonomic esports mouse 63g', 2490.00, 2990.00, 'https://assets2.razerzone.com/images/pnx.assets/381e015e3bd98bac1db78c3e4cb97008/razer-deathadder-v3-hero.png', 50, 'Mouse', 'ขายดี'),
('Logitech G Pro X Superlight 2', 'Wireless gaming mouse 60g sensor HERO 2', 4290.00, NULL, 'https://resource.logitechg.com/w_386,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x2-lightspeed/gallery/pro-x2-lightspeed-gallery-1-black.png', 35, 'Mouse', 'ใหม่'),
('SteelSeries Aerox 5', 'Ultra-light multi-genre gaming mouse 66g', 1990.00, 2590.00, 'https://media.steelseriescdn.com/thumbs/catalog/items/62401/9a6e079fd17d4b3b9696787f06f2ff2b.png.500x400_q100_crop-fit_optimize.png', 25, 'Mouse', NULL);

-- Keyboard
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('Logitech G Pro X Keyboard', 'Mechanical gaming keyboard with swappable switches', 4590.00, NULL, 'https://resource.logitechg.com/w_386,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-keyboard/pro-keyboard-702702702-702702702702-702702.png', 30, 'Keyboard', NULL),
('Razer Huntsman V3 Pro TKL', 'Analog optical gaming keyboard HyperPolling', 7490.00, 8990.00, 'https://assets2.razerzone.com/images/pnx.assets/6cef4093e36a782c75a6b1a7d7f0e01b/razer-huntsman-v3-pro-tkl-hero.png', 15, 'Keyboard', 'ใหม่'),
('HyperX Alloy Origins 65', 'Compact 65% mechanical gaming keyboard', 2990.00, 3490.00, 'https://hyperx.com/cdn/shop/files/hyperx_alloy_origins_65_us_1_top_down_900x.png', 40, 'Keyboard', NULL);

-- Headset
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('HyperX Cloud II', 'Gaming headset with 7.1 virtual surround sound', 3290.00, NULL, 'https://hyperx.com/cdn/shop/products/hyperx_cloud_ii_red_1_main_900x.png', 40, 'Headset', 'ขายดี'),
('Razer BlackShark V2 Pro', 'Wireless esports headset THX Spatial Audio', 5990.00, 6990.00, 'https://assets2.razerzone.com/images/pnx.assets/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6/razer-blackshark-v2-pro-2023-hero.png', 20, 'Headset', NULL),
('SteelSeries Arctis Nova 7', 'Multi-platform wireless gaming headset', 5490.00, NULL, 'https://media.steelseriescdn.com/thumbs/catalog/items/61553/c65ab36bb8b6400aa2fb99c1e0a9b5a3.png.500x400_q100_crop-fit_optimize.png', 18, 'Headset', 'ใหม่');

-- Monitor
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('BenQ ZOWIE XL2546K', '240Hz DyAc+ 24.5" Gaming Monitor Esports', 19900.00, NULL, 'https://www.benq.com/content/dam/b2c/en/gaming-monitor/zowie-xl-series/xl2546k/gallery/xl2546k-front.png', 15, 'Monitor', NULL),
('ASUS ROG Swift PG27AQN', '27" 360Hz QHD IPS gaming monitor', 32900.00, 35900.00, 'https://dlcdnwebimgs.asus.com/gain/3C72F729-3594-4C53-BD9A-F3E10B252FA0/w692', 8, 'Monitor', 'ใหม่'),
('LG UltraGear 27GP850-B', '27" QHD Nano IPS 165Hz Gaming Monitor', 12900.00, 15900.00, 'https://www.lg.com/content/dam/channel/wcms/global/products/monitor/images/md07556038/gallery/27GP850-B_01.jpg', 22, 'Monitor', NULL);

-- Chair
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('Secretlab Titan Evo', 'Premium ergonomic gaming chair 4-way L-adapt', 18900.00, 21900.00, 'https://assets.secretlab.co/image/upload/c_fill,f_auto,q_auto,w_500/v1/catalog/2024/TITAN_Evo/Stealth/01_TITAN_Evo_Stealth_Front', 10, 'Chair', 'ขายดี'),
('Razer Iskur V2', 'Gaming chair with adaptive lumbar support', 15900.00, NULL, 'https://assets2.razerzone.com/images/pnx.assets/razer-iskur-v2-hero.png', 12, 'Chair', NULL);

-- CPU
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('AMD Ryzen 7 7800X3D', '8 Core 16 Thread AM5 3D V-Cache Gaming CPU', 12900.00, 14900.00, 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-7-702702.png', 25, 'CPU', 'ขายดี'),
('Intel Core i7-14700K', '20 Core 28 Thread LGA1700 5.6GHz Max Boost', 13900.00, NULL, 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2023-10/i7-702702-702702.png', 20, 'CPU', NULL),
('AMD Ryzen 5 7600X', '6 Core 12 Thread AM5 5.3GHz Boost CPU', 6990.00, 8490.00, 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-5-702702.png', 30, 'CPU', NULL);

-- GPU
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('NVIDIA GeForce RTX 4070 Ti Super', '16GB GDDR6X DLSS 3.5 Ray Tracing', 25900.00, 28900.00, 'https://assets.nvidia.com/is/image/nvidiazone/geforce-rtx-4070-702702-702702-702?fmt=png-alpha&wid=500', 10, 'GPU', 'ใหม่'),
('AMD Radeon RX 7800 XT', '16GB GDDR6 RDNA 3 Graphics Card', 16900.00, NULL, 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon-rx-7800-xt-702702.png', 15, 'GPU', NULL),
('NVIDIA GeForce RTX 4060', '8GB GDDR6 DLSS 3 Graphics Card', 10900.00, 12900.00, 'https://assets.nvidia.com/is/image/nvidiazone/geforce-rtx-4060-702702-702702?fmt=png-alpha&wid=500', 30, 'GPU', 'ขายดี');

-- RAM
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('G.Skill Trident Z5 RGB 32GB', 'DDR5 6000MHz CL30 Dual Channel (2x16GB)', 4590.00, 5290.00, 'https://www.gskill.com/img/overview/Trident_Z5_RGB_(Intel)_DDR5/spec_01.png', 35, 'RAM', NULL),
('Kingston Fury Beast 32GB', 'DDR5 5600MHz CL36 (2x16GB)', 3290.00, NULL, 'https://media.kingston.com/kingston/product/ktc-product-memory-beast-ddr5-rgb-702702-702702-702702-702.png', 40, 'RAM', NULL);

-- SSD
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('Samsung 990 Pro 2TB', 'NVMe M.2 PCIe 4.0 SSD Read 7450MB/s', 6490.00, 7990.00, 'https://image-us.samsung.com/SamsungUS/home/computing/memory-storage/internal-ssd/01132023/MZ-V9P2T0B_AM_001_Front_Black_TB.jpg', 20, 'SSD', 'ขายดี'),
('WD Black SN850X 1TB', 'NVMe M.2 PCIe 4.0 SSD Read 7300MB/s', 3490.00, NULL, 'https://www.westerndigital.com/content/dam/store/en-us/assets/products/internal-storage/wd-black-sn850x.png', 30, 'SSD', NULL);

-- PSU
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('Corsair RM850x 850W', '80+ Gold Fully Modular ATX 3.0 PSU', 4990.00, 5490.00, 'https://www.corsair.com/corsairmedia/sys_master/productcontent/RM850x-psu-702702-702702.png', 18, 'PSU', NULL),
('Seasonic Focus GX-750', '80+ Gold Fully Modular 750W Premium PSU', 3990.00, NULL, 'https://seasonic.com/pub/media/catalog/product/f/o/focus-gx-750-01.png', 22, 'PSU', NULL);

-- Case
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('NZXT H7 Flow', 'Mid-Tower ATX PC Case Tempered Glass Airflow', 4290.00, NULL, 'https://nzxt.com/assets/cms/34299/1666288839-h7-flow-702702-702702.png', 15, 'Case', 'ใหม่'),
('Lian Li O11 Dynamic EVO', 'Mid-Tower ATX Dual Chamber Tempered Glass', 5490.00, 6290.00, 'https://lian-li.com/wp-content/uploads/2022/01/O11-Dynamic-EVO_Black_01.png', 12, 'Case', NULL);
