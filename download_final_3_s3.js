const google = require('googlethis');
const axios = require('axios');
const fs = require('fs');

async function downloadImage(url, path) {
    try {
        const response = await axios({
            url,
            responseType: 'stream',
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
    const res = await google.image(name + ' site:ihcupload.s3.ap-southeast-1.amazonaws.com', { safe: false });
    let bestMatch = res.find(img => img.url.endsWith('.jpg') || img.url.endsWith('.png'));
    if (!bestMatch) bestMatch = res[0];

    if (bestMatch) {
        console.log(`Downloading from ${bestMatch.origin?.website?.domain || 'unknown'} : ${bestMatch.url}`);
        const success = await downloadImage(bestMatch.url, './frontend/assets/images/products/' + filename);
        if (success) {
            const stats = fs.statSync('./frontend/assets/images/products/' + filename);
            console.log(`SUCCESS downloaded ${filename} (Size: ${stats.size} bytes)`);
        }
    } else {
        console.log(`FAILED to find image for ${name}`);
    }
}

async function run() {
    await fetchMissing('Razer Huntsman V3 Pro TKL', 'razer_huntsman_v3_pro_tkl.jpg');
    await fetchMissing('SteelSeries Arctis Nova 7', 'steelseries_arctis_nova_7.jpg');
    await fetchMissing('HyperX Cloud II', 'hyperx_cloud_ii.jpg');
}

run();
