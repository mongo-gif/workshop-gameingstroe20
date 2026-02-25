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

INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@gstore.com', '$2y$10$6aX.XaXcyBLRa9xnBTVzCOv3lhEVi02OXXhBY6pdafmE06roNWUi2', 'admin'),
('user', 'user@gstore.com', '$2y$10$6aX.XaXcyBLRa9xnBTVzCOv3lhEVi02OXXhBY6pdafmE06roNWUi2', 'customer');

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
    payment_method VARCHAR(30) DEFAULT 'transfer',
    status ENUM('pending', 'processing', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
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

-- Mouse
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('Razer DeathAdder V3', 'เมาส์เกมมิ่งระดับ Esports น้ำหนักเบาเพียง 63 กรัม ออกแบบตามหลักสรีรศาสตร์เพื่อความสบายมือในการใช้งานยาวนาน||สเปค: เซ็นเซอร์ Focus Pro 30K / ความไว DPI สูงสุด 30,000 / อัตรา Polling Rate 8,000Hz ผ่าน HyperPolling / สวิตช์ Optical Gen-3 ทนทาน 90 ล้านคลิก / เชื่อมต่อผ่าน USB-C||จุดเด่น: ✦ น้ำหนักเบาทั้งที่เป็นทรง Ergonomic ✦ Grip Tape มาในกล่อง ✦ เท้าเมาส์ PTFE เกรด A ลื่นไหลไร้แรงเสียดทาน ✦ เหมาะกับมือขนาดกลาง-ใหญ่ ✦ ใช้งานจริงโดยโปรเพลเยอร์ระดับโลก', 2490.00, 2990.00, 'assets/images/products/razer_deathadder_v3.jpg', 50, 'Mouse', 'ขายดี'),
('Logitech G Pro X Superlight 2', 'เมาส์ไร้สายเกมมิ่งระดับโปร น้ำหนักเบาสุดเพียง 60 กรัม พร้อมเซ็นเซอร์ HERO 2 รุ่นใหม่ที่แม่นยำที่สุด||สเปค: เซ็นเซอร์ HERO 2 25K / ความไว DPI สูงสุด 32,000 / Polling Rate 2,000Hz ผ่าน LIGHTSPEED / แบตเตอรี่ใช้งานได้ 95 ชั่วโมง / ชาร์จผ่าน USB-C||จุดเด่น: ✦ เบาที่สุดในรุ่นจาก Logitech ✦ เซ็นเซอร์ HERO 2 ใหม่แม่นยำกว่าเดิม 2 เท่า ✦ เท้าเมาส์ PTFE 100% ลื่นไหล ✦ ไร้เสียงรบกวนด้วยสวิตช์ Hybrid ✦ ใช้โดยนักแข่ง Esports มืออาชีพ', 4290.00, NULL, 'assets/images/products/logitech_g_pro_x_superlight_2.jpg', 35, 'Mouse', 'ใหม่'),
('SteelSeries Aerox 5', 'เมาส์เกมมิ่ง Ultra-Light น้ำหนักเพียง 66 กรัม ออกแบบมาเพื่อเล่นได้หลากหลายแนวเกม ทั้ง FPS, MOBA และ Battle Royale||สเปค: เซ็นเซอร์ TrueMove Air / ความไว DPI สูงสุด 18,000 / Polling Rate 1,000Hz / ปุ่มกดรวม 9 ปุ่ม พร้อมสวิตช์ด้านข้าง / สาย USB-C ถัก Super Mesh||จุดเด่น: ✦ ดีไซน์เปลือกตาข่ายระบายอากาศ IP54 กันน้ำกันฝุ่น ✦ สวิตช์ Golden Micro IP54 ทนทาน 80 ล้านคลิก ✦ ปุ่มด้านข้างแบบ Flick Switch 5 ทิศทาง ✦ เหมาะกับทุกแนวเกม', 1990.00, 2590.00, 'assets/images/products/steelseries_aerox_5.jpg', 25, 'Mouse', NULL);

-- Keyboard
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('Logitech G Pro X Keyboard', 'คีย์บอร์ดเกมมิ่งแมคคานิคอลระดับโปร รองรับการเปลี่ยนสวิตช์ Hot-Swap ปรับเสียงและสัมผัสได้ตามใจ||สเปค: รูปแบบ Tenkeyless (TKL) / สวิตช์ GX Hot-Swappable (Blue, Brown, Red) / ไฟ LIGHTSYNC RGB 16.8 ล้านสี / สาย USB ถอดได้ Micro-USB / ตัวเครื่องทำจากโลหะ||จุดเด่น: ✦ เปลี่ยนสวิตช์ได้ง่ายไม่ต้องบัดกรี ✦ มาพร้อมสวิตช์ GX Blue Clicky ✦ Compact TKL ประหยัดพื้นที่โต๊ะ ✦ ซอฟต์แวร์ G HUB ตั้งค่ามาโครได้ ✦ Game Mode ล็อกปุ่ม Windows', 4590.00, NULL, 'assets/images/products/logitech_g_pro_x_keyboard.jpg', 30, 'Keyboard', NULL),
('Razer Huntsman V3 Pro TKL', 'คีย์บอร์ดเกมมิ่ง Analog Optical สุดล้ำ รองรับ HyperPolling 8,000Hz ตอบสนองเร็วที่สุดในโลก||สเปค: สวิตช์ Razer Analog Optical Gen-2 / Polling Rate สูงสุด 8,000Hz / Rapid Trigger ปรับจุด Actuation ได้ 0.1-4.0 มม. / แป้น PBT Double-Shot / สาย USB-C ถอดได้ / Magnetic Wrist Rest แถม||จุดเด่น: ✦ Rapid Trigger ปรับระยะกดได้ละเอียดถึง 0.1 มม. ✦ Analog Input ใช้เป็นจอยเสมือนได้ ✦ Adjustable Actuation Point ตั้งค่าแยกปุ่ม ✦ 8,000Hz Polling Rate เร็วที่สุด ✦ เหมาะสำหรับ FPS Competitive', 7490.00, 8990.00, 'assets/images/products/razer_huntsman_v3_pro_tkl.jpg', 15, 'Keyboard', 'ใหม่'),
('HyperX Alloy Origins 65', 'คีย์บอร์ดเกมมิ่งแมคคานิคอล ขนาด 65% กะทัดรัด พร้อมปุ่มลูกศรและปุ่มฟังก์ชัน ไม่ต้องเสียสละการใช้งาน||สเปค: สวิตช์ HyperX Red Linear / ไฟ RGB Per-Key / แป้น PBT Double-Shot / สาย USB-C ถอดได้ / ตัวเครื่องอลูมิเนียม / ขนาด 65% Compact||จุดเด่น: ✦ ขนาด 65% มีปุ่มลูกศรครบ ✦ แป้น PBT ทนทาน ไม่มัน ไม่ลอก ✦ เฟรมอลูมิเนียมแข็งแรง ✦ สวิตช์ Linear ลื่นไหล เหมาะเล่นเกม ✦ น้ำหนักเบา พกพาสะดวก', 2990.00, 3490.00, 'assets/images/products/hyperx_alloy_origins_65.jpg', 40, 'Keyboard', NULL);

-- Headset
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('HyperX Cloud II', 'หูฟังเกมมิ่งระดับตำนาน เสียงเซอร์ราวด์ 7.1 เสมือนจริง สวมใส่สบายยาวนาน พร้อมไมค์ตัดเสียงรบกวน||สเปค: ไดรเวอร์ 53 มม. / เสียงเซอร์ราวด์ 7.1 Virtual Surround / ไมค์ถอดได้ตัดเสียง Noise-Cancelling / ความต้านทาน 60Ω / ความถี่ตอบสนอง 15Hz-25kHz / เชื่อมต่อ USB + 3.5 มม.||จุดเด่น: ✦ ไดรเวอร์ 53 มม. เสียงทุ้มลึกชัดเจน ✦ เสียงเซอร์ราวด์ 7.1 จับทิศทางเสียงฝีเท้าได้แม่นยำ ✦ โครงอลูมิเนียมทนทาน ✦ หมอนรองหูหนังนุ่มพร้อมเมมโมรี่โฟม ✦ ไมค์ถอดได้ เสียงชัดเจนเมื่อสื่อสาร', 3290.00, NULL, 'assets/images/products/hyperx_cloud_ii.jpg', 40, 'Headset', 'ขายดี'),
('Razer BlackShark V2 Pro', 'หูฟังไร้สายเกมมิ่งระดับ Esports พร้อมระบบเสียง THX Spatial Audio เสียงครอบคลุม 360 องศา||สเปค: ไดรเวอร์ Razer TriForce Titanium 50 มม. / เสียง THX Spatial Audio / ไมค์ Razer HyperClear Super Wideband / เชื่อมต่อไร้สาย 2.4GHz + Bluetooth / แบตเตอรี่ 70 ชม. / น้ำหนัก 320 กรัม||จุดเด่น: ✦ ไดรเวอร์ TriForce Titanium แยกย่านเสียงละเอียดทั้ง 3 ย่าน ✦ THX Spatial Audio เสียงรอบทิศทางเสมือนจริง ✦ ไมค์ Super Wideband ชัดระดับสตูดิโอ ✦ เชื่อมต่อได้ 2 ทาง (Wireless + Bluetooth) ✦ แบตอึด 70 ชั่วโมง', 5990.00, 6990.00, 'assets/images/products/razer_blackshark_v2_pro.jpg', 20, 'Headset', NULL),
('SteelSeries Arctis Nova 7', 'หูฟังไร้สายเกมมิ่งระดับพรีเมียม รองรับหลายแพลตฟอร์ม ใช้ได้ทั้ง PC, PS5, Switch และมือถือ||สเปค: ไดรเวอร์ High Fidelity 40 มม. / เชื่อมต่อไร้สาย 2.4GHz + Bluetooth 5.0 พร้อมกัน / ไมค์ ClearCast Gen 2 ตัดเสียง AI / แบตเตอรี่ 38 ชม. / ชาร์จเร็ว USB-C (15 นาที = 3 ชม.)||จุดเด่น: ✦ Dual Wireless เชื่อมต่อ 2 อุปกรณ์พร้อมกัน ✦ ไมค์ AI Noise Cancelling ตัดเสียงรบกวนอัจฉริยะ ✦ EQ ปรับเสียงผ่านแอป Sonar ✦ ใช้ได้ทุกแพลตฟอร์ม ✦ รองรับชาร์จเร็ว USB-C', 5490.00, NULL, 'assets/images/products/steelseries_arctis_nova_7.jpg', 18, 'Headset', 'ใหม่');

-- Monitor
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('BenQ ZOWIE XL2546K', 'จอมอนิเตอร์เกมมิ่งระดับ Esports รีเฟรชเรท 240Hz พร้อม DyAc+ ลดภาพเบลอขณะยิง เห็นศัตรูชัดเจน||สเปค: ขนาด 24.5 นิ้ว / พาแนล TN / ความละเอียด 1920x1080 (Full HD) / รีเฟรชเรท 240Hz / Response Time 0.5ms (GTG) / เทคโนโลยี DyAc+ / พอร์ต HDMI 2.0 x3, DP 1.4||จุดเด่น: ✦ DyAc+ ลดการเบลอของภาพขณะเกมมิ่ง ✦ XL Setting to Share แชร์ค่าจอกับเพื่อนได้ ✦ ขาตั้งปรับได้ 360 องศา ✦ Black eQualizer ปรับความสว่างในฉากมืด ✦ ใช้ในทัวร์นาเมนต์ระดับโลก', 19900.00, NULL, 'assets/images/products/benq_zowie_xl2546k.jpg', 15, 'Monitor', NULL),
('ASUS ROG Swift PG27AQN', 'จอมอนิเตอร์เกมมิ่งระดับท็อป 360Hz QHD สุดยอดจอสำหรับนักแข่ง Esports มืออาชีพ||สเปค: ขนาด 27 นิ้ว / พาแนล IPS / ความละเอียด 2560x1440 (QHD) / รีเฟรชเรท 360Hz / Response Time 1ms (GTG) / NVIDIA G-Sync / HDR10 / พอร์ต HDMI 2.0 x2, DP 1.4||จุดเด่น: ✦ 360Hz QHD จอที่เร็วที่สุดในระดับ 1440p ✦ NVIDIA G-Sync ภาพลื่นไหลไร้อาการฉีกขาด ✦ สี sRGB 99% DCI-P3 95% ✦ NVIDIA Reflex Latency Analyzer ในตัว ✦ ขาตั้ง ROG ปรับระดับได้ครบทุกทิศทาง', 32900.00, 35900.00, 'assets/images/products/asus_rog_swift_pg27aqn.jpg', 8, 'Monitor', 'ใหม่'),
('LG UltraGear 27GP850-B', 'จอมอนิเตอร์เกมมิ่ง QHD Nano IPS สีสดสวยสมจริง ตอบสนองเร็ว เหมาะทั้งเล่นเกมและทำงานกราฟิก||สเปค: ขนาด 27 นิ้ว / พาแนล Nano IPS / ความละเอียด 2560x1440 (QHD) / รีเฟรชเรท 165Hz (OC 180Hz) / Response Time 1ms (GTG) / NVIDIA G-Sync Compatible + AMD FreeSync Premium / HDR400||จุดเด่น: ✦ Nano IPS สี DCI-P3 98% สีสดสมจริง ✦ รองรับทั้ง G-Sync และ FreeSync ✦ โอเวอร์คล็อกได้ถึง 180Hz ✦ ขาตั้งปรับได้ Pivot/Height/Tilt/Swivel ✦ คุ้มค่าที่สุดในระดับ QHD 165Hz', 12900.00, 15900.00, 'assets/images/products/lg_ultragear_27gp850_b.jpg', 22, 'Monitor', NULL);

-- Chair
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('Secretlab Titan Evo', 'เก้าอี้เกมมิ่งระดับพรีเมียม ออกแบบตามหลักสรีรศาสตร์ รองรับหลังได้อย่างสมบูรณ์แบบด้วยระบบ L-ADAPT 4 ทิศทาง||สเปค: โฟม Cold-Cure ความหนาแน่นสูง / เบาะหนัง Hybrid Leatherette หรือ SoftWeave Plus / เอนได้ 85°-165° / รองรับน้ำหนักสูงสุด 130 กก. / ที่วางแขน 4D CloudSwap / พนักพิงศีรษะแม่เหล็ก||จุดเด่น: ✦ ระบบรองรับเอว L-ADAPT ปรับได้ 4 ทิศทาง ✦ โฟม Cold-Cure ไม่ยุบง่าย คงรูปได้นาน ✦ ที่วางแขน 4D CloudSwap เปลี่ยนท็อปได้ ✦ ระบบล้อเลื่อนเงียบ ✦ รับประกัน 5 ปี', 18900.00, 21900.00, 'assets/images/products/secretlab_titan_evo.jpg', 10, 'Chair', 'ขายดี'),
('Razer Iskur V2', 'เก้าอี้เกมมิ่งจาก Razer พร้อมระบบรองรับเอวแบบ Adaptive Lumbar Support ปรับตัวตามท่านั่งอัตโนมัติ||สเปค: ระบบ Adaptive Lumbar Support / เบาะ EPU Synthetic Leather ทนทาน / โฟม Ultra-Soft ความหนาแน่นสูง / เอนได้ 90°-152° / ที่วางแขน 4D / รองรับน้ำหนัก 136 กก. / พนักพิงศีรษะโฟมจำรูป||จุดเด่น: ✦ Adaptive Lumbar Support ปรับเอวอัตโนมัติ ✦ หนัง EPU Synthetic ทนทานทำความสะอาดง่าย ✦ โฟมกันอาการปวดก้นเมื่อนั่งนาน ✦ ที่วางแขน 4D ปรับได้ละเอียด ✦ ดีไซน์หรูหราสไตล์ Razer', 15900.00, NULL, 'assets/images/products/razer_iskur_v2.jpg', 12, 'Chair', NULL);

-- CPU
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('AMD Ryzen 7 7800X3D', 'ซีพียูเกมมิ่งที่เร็วที่สุด ด้วยเทคโนโลยี 3D V-Cache 96MB แคชมหาศาล ช่วยเพิ่ม FPS ในเกมได้สูงสุด 15-20%||สเปค: 8 Core 16 Thread / สถาปัตยกรรม Zen 4 / ซ็อกเก็ต AM5 / Base Clock 4.2GHz / Boost Clock 5.0GHz / L3 Cache 96MB (3D V-Cache) / TDP 120W / รองรับ DDR5 และ PCIe 5.0||จุดเด่น: ✦ 3D V-Cache 96MB เร็วที่สุดสำหรับเกม ✦ ประสิทธิภาพสูงใน AAA Games ✦ TDP เพียง 120W ประหยัดไฟ ✦ ซ็อกเก็ต AM5 อัปเกรดได้ในอนาคต ✦ เป็น CPU เกมมิ่งอันดับ 1 ที่ได้รับรางวัลจากทุกสำนัก', 12900.00, 14900.00, 'assets/images/products/amd_ryzen_7_7800x3d.jpg', 25, 'CPU', 'ขายดี'),
('Intel Core i7-14700K', 'ซีพียูเดสก์ท็อปรุ่นท็อปจาก Intel ด้วยจำนวนคอร์รวม 20 คอร์ ทำได้ทั้งเล่นเกมและงานหนัก||สเปค: 20 Core (8P+12E) 28 Thread / สถาปัตยกรรม Raptor Lake Refresh / ซ็อกเก็ต LGA1700 / Base Clock 3.4GHz / Boost Clock 5.6GHz / L3 Cache 33MB / TDP 125W (253W PBP) / รองรับ DDR5/DDR4||จุดเด่น: ✦ 20 คอร์ 28 เธรด ทำงาน Multitask ลื่นไหล ✦ Boost Clock สูงถึง 5.6GHz ✦ รองรับทั้ง DDR4 และ DDR5 ✦ overlock ได้ (K-Series) ✦ เหมาะทั้งเล่นเกมและ Content Creation', 13900.00, NULL, 'assets/images/products/intel_core_i7_14700k.jpg', 20, 'CPU', NULL),
('AMD Ryzen 5 7600X', 'ซีพียูเกมมิ่งคุ้มค่ารุ่นยอดนิยม ประสิทธิภาพสูงในราคาที่เอื้อมถึง เหมาะกับคนจัดสเปกคอมใหม่||สเปค: 6 Core 12 Thread / สถาปัตยกรรม Zen 4 / ซ็อกเก็ต AM5 / Base Clock 4.7GHz / Boost Clock 5.3GHz / L3 Cache 32MB / TDP 105W / รองรับ DDR5 และ PCIe 5.0||จุดเด่น: ✦ ประสิทธิภาพเกมมิ่งดีเยี่ยมในราคาคุ้มค่า ✦ Boost Clock สูงถึง 5.3GHz ✦ ซ็อกเก็ต AM5 อัปเกรดได้ในอนาคต ✦ รองรับ DDR5 และ PCIe 5.0 ✦ เหมาะสำหรับเล่นเกม 1080p-1440p', 6990.00, 8490.00, 'assets/images/products/amd_ryzen_5_7600x.jpg', 30, 'CPU', NULL);

-- GPU
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('NVIDIA GeForce RTX 4070 Ti Super', 'การ์ดจอเกมมิ่งระดับสูงจาก NVIDIA รองรับ DLSS 3.5 และ Ray Tracing ให้ภาพสวยสมจริงเหมือนอยู่ในเกม||สเปค: CUDA Cores 8,448 / VRAM 16GB GDDR6X / Memory Bus 256-bit / Boost Clock 2,610 MHz / TDP 285W / พอร์ต HDMI 2.1 + DP 1.4a x3 / รองรับ DLSS 3.5, Ray Tracing, AV1 Encode||จุดเด่น: ✦ VRAM 16GB เล่นเกมได้ทุกความละเอียด ✦ DLSS 3.5 เพิ่ม FPS แบบ AI ✦ Ray Tracing สมจริงระดับภาพยนตร์ ✦ AV1 Encode สตรีมคุณภาพสูง ✦ เหมาะเล่นเกม 1440p-4K Ultra', 25900.00, 28900.00, 'assets/images/products/nvidia_geforce_rtx_4070_ti_super.jpg', 10, 'GPU', 'ใหม่'),
('AMD Radeon RX 7800 XT', 'การ์ดจอเกมมิ่งสถาปัตยกรรม RDNA 3 ประสิทธิภาพสูงสำหรับเกม 1440p ในราคาคุ้มค่าที่สุด||สเปค: Stream Processors 3,840 / VRAM 16GB GDDR6 / Memory Bus 256-bit / Game Clock 2,124 MHz / TDP 263W / พอร์ต HDMI 2.1 + DP 2.1 x2 / รองรับ FSR 3.0, Ray Tracing, AV1 Encode||จุดเด่น: ✦ 16GB VRAM คุ้มค่าที่สุดในระดับราคา ✦ RDNA 3 ประสิทธิภาพต่อวัตต์ดีเยี่ยม ✦ FSR 3.0 เพิ่ม FPS ฟรีไม่จำกัดเกม ✦ รองรับ DisplayPort 2.1 ✦ เหมาะสำหรับเล่นเกม 1440p Ultra', 16900.00, NULL, 'assets/images/products/amd_radeon_rx_7800_xt.jpg', 15, 'GPU', NULL),
('NVIDIA GeForce RTX 4060', 'การ์ดจอเกมมิ่งรุ่นคุ้มค่า รองรับ DLSS 3 และ Ray Tracing กินไฟต่ำเพียง 115W||สเปค: CUDA Cores 3,072 / VRAM 8GB GDDR6 / Memory Bus 128-bit / Boost Clock 2,460 MHz / TDP 115W / พอร์ต HDMI 2.1 + DP 1.4a x3 / รองรับ DLSS 3, Ray Tracing, AV1 Encode||จุดเด่น: ✦ กินไฟเพียง 115W ไม่ต้องอัปเกรด PSU ✦ DLSS 3 Frame Generation เพิ่ม FPS ได้เท่าตัว ✦ ขนาดกะทัดรัดใส่ได้ทุกเคส ✦ Ray Tracing สมจริง ✦ เหมาะเล่นเกม 1080p Ultra - 1440p High', 10900.00, 12900.00, 'assets/images/products/nvidia_geforce_rtx_4060.jpg', 30, 'GPU', 'ขายดี');

-- RAM
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('G.Skill Trident Z5 RGB 32GB', 'แรม DDR5 ระดับพรีเมียมพร้อมไฟ RGB สวยงาม ความเร็ว 6000MHz CL30 ประสิทธิภาพสูงสำหรับระบบ Intel และ AMD||สเปค: ความจุ 32GB (2x16GB) Dual Channel / DDR5 6000MHz / CAS Latency CL30-40-40-96 / แรงดัน 1.35V / Intel XMP 3.0 + AMD EXPO / ไฟ RGB ปรับผ่านซอฟต์แวร์||จุดเด่น: ✦ ความเร็ว 6000MHz จุดที่ดีที่สุดสำหรับ AM5 ✦ CL30 Timing แน่นประสิทธิภาพสูง ✦ ไฟ RGB สวยงาม ปรับได้หลายซอฟต์แวร์ ✦ รองรับทั้ง XMP 3.0 และ AMD EXPO ✦ ฮีตซิงค์อลูมิเนียมระบายความร้อนดี', 4590.00, 5290.00, 'assets/images/products/g_skill_trident_z5_rgb_32gb.jpg', 35, 'RAM', NULL),
('Kingston Fury Beast 32GB', 'แรม DDR5 ประสิทธิภาพสูง ราคาคุ้มค่า ออกแบบมาสำหรับเกมเมอร์และผู้ใช้งานทั่วไปที่ต้องการอัปเกรด DDR5||สเปค: ความจุ 32GB (2x16GB) Dual Channel / DDR5 5600MHz / CAS Latency CL36 / แรงดัน 1.25V / Intel XMP 3.0 + AMD EXPO / ฮีตสเปรดเดอร์โลหะ||จุดเด่น: ✦ ราคาคุ้มค่าที่สุดสำหรับ DDR5 32GB ✦ ใช้แรงดันต่ำเพียง 1.25V ✦ Plug N Play ใส่แล้วใช้งานได้ทันที ✦ รองรับ XMP 3.0 และ AMD EXPO ✦ ฮีตสเปรดเดอร์โลหะบางเบาไม่ชนฮีตซิงค์ CPU', 3290.00, NULL, 'assets/images/products/kingston_fury_beast_32gb.jpg', 40, 'RAM', NULL);

-- SSD
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('Samsung 990 Pro 2TB', 'SSD NVMe M.2 ระดับเรือธง ความเร็วอ่านสูงสุด 7,450 MB/s เหมาะสำหรับเกมเมอร์และ Content Creator||สเปค: ความจุ 2TB / ฟอร์มแฟคเตอร์ M.2 2280 / อินเทอร์เฟส PCIe 4.0 x4 NVMe 2.0 / ความเร็วอ่าน 7,450 MB/s / ความเร็วเขียน 6,900 MB/s / IOPS 1,400K Read / 1,550K Write / TBW 1,200 TB||จุดเด่น: ✦ ความเร็วอ่าน 7,450 MB/s เร็วที่สุดใน PCIe 4.0 ✦ นิคเกิล Coating ระบายความร้อนได้ดี ✦ โหลดเกมเร็วขึ้นกว่าเดิมหลายเท่า ✦ ทนทาน TBW 1,200TB ✦ ซอฟต์แวร์ Samsung Magician จัดการง่าย', 6490.00, 7990.00, 'assets/images/products/samsung_990_pro_2tb.jpg', 20, 'SSD', 'ขายดี'),
('WD Black SN850X 1TB', 'SSD NVMe M.2 ประสิทธิภาพสูง ออกแบบเพื่อเกมมิ่งโดยเฉพาะ พร้อม Game Mode 2.0 เพิ่ม FPS ได้||สเปค: ความจุ 1TB / ฟอร์มแฟคเตอร์ M.2 2280 / อินเทอร์เฟส PCIe 4.0 x4 NVMe / ความเร็วอ่าน 7,300 MB/s / ความเร็วเขียน 6,300 MB/s / TBW 600 TB / Game Mode 2.0||จุดเด่น: ✦ Game Mode 2.0 ปรับแต่งเพื่อเกมโดยเฉพาะ ✦ ความเร็ว 7,300 MB/s ลดเวลาโหลด ✦ Dashboard สำหรับตรวจสอบสุขภาพ SSD ✦ ฮีตซิงค์เสริม (รุ่น Heatsink) ✦ ราคาคุ้มค่าสำหรับความจุ 1TB', 3490.00, NULL, 'assets/images/products/wd_black_sn850x_1tb.jpg', 30, 'SSD', NULL);

-- PSU
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('Corsair RM850x 850W', 'พาวเวอร์ซัพพลายระดับพรีเมียม 80+ Gold Full Modular รองรับ ATX 3.0 และ PCIe 5.0 พร้อมสำหรับการ์ดจอรุ่นใหม่||สเปค: กำลังไฟ 850W / ประสิทธิภาพ 80+ Gold / Full Modular / มาตรฐาน ATX 3.0 / สาย 12VHPWR สำหรับ GPU รุ่นใหม่ / พัดลม 135mm FDB / โหมด Zero RPM Fan||จุดเด่น: ✦ ATX 3.0 รองรับการ์ดจอรุ่นใหม่ล่าสุด ✦ Full Modular เดินสายสะอาด ✦ พัดลม Zero RPM ไร้เสียงเมื่อโหลดต่ำ ✦ ตัวเก็บประจุ 105°C ญี่ปุ่นระดับพรีเมียม ✦ รับประกัน 10 ปี', 4990.00, 5490.00, 'assets/images/products/corsair_rm850x_850w.jpg', 18, 'PSU', NULL),
('Seasonic Focus GX-750', 'พาวเวอร์ซัพพลาย 80+ Gold Full Modular จาก Seasonic แบรนด์อันดับ 1 ด้าน PSU เงียบ เสถียร ทนทาน||สเปค: กำลังไฟ 750W / ประสิทธิภาพ 80+ Gold / Full Modular / พัดลม FDB Bearing 120mm / โหมด Hybrid Fan Control (Semi-Fanless) / ป้องกัน OVP, OPP, SCP, OCP, UVP, OTP||จุดเด่น: ✦ Seasonic แบรนด์ PSU คุณภาพสูงอันดับ 1 ✦ Full Modular เดินสายง่ายสะอาด ✦ Hybrid Fan Control เงียบมากเมื่อโหลดต่ำ ✦ ระบบป้องกันครบทุกรูปแบบ ✦ รับประกัน 10 ปี', 3990.00, NULL, 'assets/images/products/seasonic_focus_gx_750.jpg', 22, 'PSU', NULL);

-- Case
INSERT INTO products (name, description, price, original_price, image_url, stock, category, badge) VALUES 
('NZXT H7 Flow', 'เคสคอมพิวเตอร์ Mid-Tower ดีไซน์โปร่ง ระบายอากาศดีเยี่ยม ด้านข้างกระจก Tempered Glass||สเปค: ขนาด Mid-Tower ATX / วัสดุเหล็ก SGCC + Tempered Glass / รองรับ Motherboard ATX, Micro-ATX, Mini-ITX / ช่องใส่พัดลมสูงสุด 10 ตัว / รองรับ Radiator 360mm ด้านบนและด้านหน้า / GPU ยาวสูงสุด 400 มม. / CPU Cooler สูงสุด 185 มม.||จุดเด่น: ✦ ด้านหน้าเปิดโล่งระบายอากาศ Flow Design ✦ กระจก Tempered Glass โชว์ชิ้นส่วนภายใน ✦ ช่องเดินสาย Cable Management สะอาด ✦ รองรับ Radiator 360mm ทั้งบนและหน้า ✦ ฟิลเตอร์กันฝุ่นถอดง่ายทำความสะอาดได้', 4290.00, NULL, 'assets/images/products/nzxt_h7_flow.jpg', 15, 'Case', 'ใหม่'),
('Lian Li O11 Dynamic EVO', 'เคสคอมพิวเตอร์ Mid-Tower ดีไซน์ Dual Chamber กระจก Tempered Glass 2 ด้าน สวยงามสุดๆ||สเปค: ขนาด Mid-Tower ATX / วัสดุอลูมิเนียม + Tempered Glass / Dual Chamber Design / รองรับ Motherboard E-ATX, ATX, Micro-ATX, Mini-ITX / ช่องใส่พัดลมสูงสุด 13 ตัว / รองรับ Radiator 360mm ได้ 3 ตำแหน่ง / GPU แนวตั้ง-แนวนอน||จุดเด่น: ✦ Dual Chamber แยกห้อง PSU กับ Mobo ✦ กระจก Tempered Glass 2 ด้าน โชว์ได้รอบทิศ ✦ ติดพัดลมได้ถึง 13 ตัว ✦ รองรับ Radiator 360mm ถึง 3 ตำแหน่ง ✦ วัสดุอลูมิเนียม คุณภาพพรีเมียม', 5490.00, 6290.00, 'assets/images/products/lian_li_o11_dynamic_evo.jpg', 12, 'Case', NULL);
