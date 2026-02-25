const axios = require('axios');
const fs = require('fs');

async function downloadImage(url, path, ref) {
    try {
        const response = await axios({
            url,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'image/avif,image/webp,*/*;q=0.8',
                'Referer': ref
            }
        });
        return new Promise((resolve, reject) => {
            response.data.pipe(fs.createWriteStream(path))
                .on('finish', () => resolve(true))
                .on('error', e => reject(e));
        });
    } catch (e) {
        console.error(`Error downloading ${url}: ${e.message}`);
        return false;
    }
}

const targets = [
    {
        filename: 'razer_huntsman_v3_pro_tkl.jpg',
        url: 'https://assets2.razerzone.com/images/pnx.assets/6cef4093e36a782c75a6b1a7d7f0e01b/razer-huntsman-v3-pro-tkl-hero.png',
        ref: 'https://www.razer.com/'
    },
    {
        filename: 'steelseries_arctis_nova_7.jpg',
        url: 'https://media.steelseriescdn.com/thumbs/catalog/items/61553/c65ab36bb8b6400aa2fb99c1e0a9b5a3.png.500x400_q100_crop-fit_optimize.png',
        ref: 'https://steelseries.com/'
    },
    {
        filename: 'hyperx_cloud_ii.jpg',
        url: 'https://row.hyperx.com/cdn/shop/products/hyperx_cloud_ii_red_1_main_1066x.jpg',
        ref: 'https://row.hyperx.com/'
    }
];

async function run() {
    for (const tgt of targets) {
        console.log(`Downloading ${tgt.filename}...`);
        const success = await downloadImage(tgt.url, './frontend/assets/images/products/' + tgt.filename, tgt.ref);
        if (success) {
            const stats = fs.statSync('./frontend/assets/images/products/' + tgt.filename);
            console.log(`SUCCESS downloaded ${tgt.filename} | Size: ${stats.size}`);
        }
    }
}

run();
