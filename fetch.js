const google = require('googlethis');
const axios = require('axios');
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

async function downloadImage(url, path) {
    try {
        const response = await axios({
            url,
            responseType: 'stream',
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        return new Promise((resolve, reject) => {
            response.data.pipe(fs.createWriteStream(path))
                .on('finish', () => resolve(true))
                .on('error', e => reject(e));
        });
    } catch (e) {
        return false;
    }
}

async function run() {
    for (const p of products) {
        console.log(`\nSearching for ${p.name}...`);
        try {
            // Force Google to search specifically on these Thai domain names
            const query = `site:ihavecpu.com OR site:advice.co.th OR site:jib.co.th OR site:bnn.in.th OR site:itcity.in.th ${p.name}`;
            const res = await google.image(query, { safe: false });

            let bestMatch = res.find(img => img.url.endsWith('.jpg') || img.url.endsWith('.png'));
            if (!bestMatch) bestMatch = res[0];

            if (bestMatch) {
                const imageUrl = bestMatch.url;
                const filename = p.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.jpg';
                const path = './frontend/assets/images/products/' + filename;

                console.log(`Downloading from ${bestMatch.origin?.website?.domain || 'unknown'} : ${imageUrl}`);
                const success = await downloadImage(imageUrl, path);
                if (success) {
                    console.log(`SUCCESS: Saved to ${path}`);
                } else {
                    console.log(`FAILED: Could not download from ${imageUrl}`);
                }
            } else {
                console.log(`FAILED: No image found for ${p.name}`);
            }

        } catch (e) {
            console.error(`Search error for ${p.name}: ${e.message}`);
        }
        await new Promise(r => setTimeout(r, 1500));
    }
}
run();
