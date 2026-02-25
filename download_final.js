const axios = require('axios');
const fs = require('fs');

async function downloadImage(url, path) {
    try {
        const response = await axios({
            url,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.advice.co.th/',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
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
        filename: 'hyperx_alloy_origins_65.jpg',
        url: 'https://img.advice.co.th/images_nas/pic_product4/A0142327/A0142327OK_BIG_1.jpg'
    },
    {
        filename: 'razer_huntsman_v3_pro_tkl.jpg',
        url: 'https://img.advice.co.th/images_nas/pic_product4/A0153833/A0153833OK_BIG_1.jpg'
    },
    {
        filename: 'logitech_g_pro_x_keyboard.jpg',
        url: 'https://img.advice.co.th/images_nas/pic_product4/A0160010/A0160010OK_BIG_2.jpg'
    },
    {
        filename: 'steelseries_arctis_nova_7.jpg',
        url: 'https://img.advice.co.th/images_nas/pic_product4/A0144577/A0144577OK_BIG_1.jpg'
    },
    {
        filename: 'razer_blackshark_v2_pro.jpg',
        url: 'https://img.advice.co.th/images_nas/pic_product4/A0149098/A0149098OK_BIG_1.jpg'
    },
    {
        filename: 'hyperx_cloud_ii.jpg',
        url: 'https://img.advice.co.th/images_nas/pic_product4/A0082729/A0082729OK_BIG_1.jpg'
    }
];

async function run() {
    for (const tgt of targets) {
        console.log(`Downloading ${tgt.filename}...`);
        const success = await downloadImage(tgt.url, './frontend/assets/images/products/' + tgt.filename);
        if (success) {
            const stats = fs.statSync('./frontend/assets/images/products/' + tgt.filename);
            console.log(`SUCCESS downloaded ${tgt.filename} | Size: ${stats.size} bytes`);
        }
    }
}

run();
