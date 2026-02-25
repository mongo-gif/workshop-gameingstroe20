const fs = require('fs');

const products = [
    { id: 1, name: 'Razer DeathAdder V3', category: 'mouse' },
    { id: 2, name: 'Logitech G Pro X Superlight 2', category: 'mouse' },
    { id: 3, name: 'SteelSeries Aerox 5', category: 'mouse' },
    { id: 4, name: 'Logitech G Pro X Keyboard', category: 'keyboard' },
    { id: 5, name: 'Razer Huntsman V3 Pro TKL', category: 'keyboard' },
    { id: 6, name: 'HyperX Alloy Origins 65', category: 'keyboard' },
    { id: 7, name: 'HyperX Cloud II', category: 'headset' },
    { id: 8, name: 'Razer BlackShark V2 Pro', category: 'headset' },
    { id: 9, name: 'SteelSeries Arctis Nova 7', category: 'headset' },
    { id: 10, name: 'BenQ ZOWIE XL2546K', category: 'monitor' },
    { id: 11, name: 'ASUS ROG Swift PG27AQN', category: 'monitor' },
    { id: 12, name: 'LG UltraGear 27GP850-B', category: 'monitor' },
    { id: 13, name: 'Secretlab Titan Evo', category: 'chair' },
    { id: 14, name: 'Razer Iskur V2', category: 'chair' },
    { id: 15, name: 'AMD Ryzen 7 7800X3D', category: 'cpu' },
    { id: 16, name: 'Intel Core i7-14700K', category: 'cpu' },
    { id: 17, name: 'AMD Ryzen 5 7600X', category: 'cpu' },
    { id: 18, name: 'NVIDIA GeForce RTX 4070 Ti Super', category: 'gpu' },
    { id: 19, name: 'AMD Radeon RX 7800 XT', category: 'gpu' },
    { id: 20, name: 'NVIDIA GeForce RTX 4060', category: 'gpu' },
    { id: 21, name: 'G.Skill Trident Z5 RGB 32GB', category: 'ram' },
    { id: 22, name: 'Kingston Fury Beast 32GB', category: 'ram' },
    { id: 23, name: 'Samsung 990 Pro 2TB', category: 'ssd' },
    { id: 24, name: 'WD Black SN850X 1TB', category: 'ssd' },
    { id: 25, name: 'Corsair RM850x 850W', category: 'psu' },
    { id: 26, name: 'Seasonic Focus GX-750', category: 'psu' },
    { id: 27, name: 'NZXT H7 Flow', category: 'case' },
    { id: 28, name: 'Lian Li O11 Dynamic EVO', category: 'case' }
];

let sql = fs.readFileSync('backend/database.sql', 'utf8');

for (const p of products) {
    const filename = p.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.jpg';
    const newUrl = 'assets/images/products/' + filename;

    // Regular expression to replace the url:
    // ('name', 'description...', price, original_price, 'URL'
    // Let's split by lines, find the line with the name, and replace the unsplash URL
    const lines = sql.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(`('${p.name}',`)) {
            lines[i] = lines[i].replace(/'https?:\/\/[^']+'/, `'${newUrl}'`);
            break;
        }
    }
    sql = lines.join('\n');
}

fs.writeFileSync('backend/database.sql', sql);
console.log('Database SQL updated!');
