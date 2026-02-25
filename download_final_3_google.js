const google = require('googlethis');
const axios = require('axios');
const fs = require('fs');

async function downloadImage(url, path) {
    try {
        const response = await axios({
            url,
            responseType: 'stream',
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
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

async function fetchMissing(name, filename) {
    console.log(`Searching for ${name}...`);
    // Search general web but favor safe domains for fetching
    const res = await google.image(name + ' product white background', { safe: false });

    for (const img of res) {
        if (!img.url.endsWith('.jpg') && !img.url.endsWith('.png')) continue;
        if (img.url.includes('amazon') || img.url.includes('razerzone') || img.url.includes('steelseries')) continue; // Skip known blockers

        console.log(`Trying ${img.url} from ${img.origin?.website?.domain}`);
        const success = await downloadImage(img.url, './frontend/assets/images/products/' + filename);
        if (success) {
            const stats = fs.statSync('./frontend/assets/images/products/' + filename);
            if (stats.size > 5000) { // Ensure it's not a block page
                console.log(`SUCCESS downloaded ${filename} | Size: ${stats.size}`);
                return;
            } else {
                console.log(`File too small, trying next...`);
            }
        }
    }
    console.log(`FAILED to find working image for ${name}`);
}

async function run() {
    await fetchMissing('Razer Huntsman V3 Pro TKL', 'razer_huntsman_v3_pro_tkl.jpg');
    await fetchMissing('SteelSeries Arctis Nova 7', 'steelseries_arctis_nova_7.jpg');
    await fetchMissing('HyperX Cloud II', 'hyperx_cloud_ii.jpg');
}

run();
