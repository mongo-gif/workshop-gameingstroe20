const axios = require('axios');
const fs = require('fs');

async function downloadImage(url, path) {
    try {
        const response = await axios({
            url,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.jib.co.th/',
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
        filename: 'logitech_g_pro_x_superlight_2.jpg',
        url: 'https://ihcupload.s3.ap-southeast-1.amazonaws.com/img/product/products74673_800.jpg' // Safe ihavecpu URL instead of Soundproofbros webp
    },
    {
        filename: 'hyperx_alloy_origins_65.jpg',
        url: 'https://www.jib.co.th/img_master/product/original/2022051214081053549_1.jpg'
    },
    {
        filename: 'razer_huntsman_v3_pro_tkl.jpg',
        url: 'https://www.jib.co.th/img_master/product/original/2023122115201465425_1.jpg'
    },
    {
        filename: 'logitech_g_pro_x_keyboard.jpg',
        url: 'https://www.jib.co.th/img_master/product/original/2023091910283063365_1.jpg'
    },
    {
        filename: 'steelseries_arctis_nova_7.jpg',
        url: 'https://www.jib.co.th/img_master/product/original/2022110210214256435_1.jpg'
    },
    {
        filename: 'razer_blackshark_v2_pro.jpg',
        url: 'https://www.jib.co.th/img_master/product/original/2023050909503461358_1.jpg'
    },
    {
        filename: 'hyperx_cloud_ii.jpg',
        url: 'https://www.jib.co.th/img_master/product/original/2020050812361118571_1.jpg'
    }
];

async function run() {
    for (const tgt of targets) {
        console.log(`Downloading ${tgt.filename}...`);
        const success = await downloadImage(tgt.url, './frontend/assets/images/products/' + tgt.filename);
        if (success) console.log(`SUCCESS downloaded ${tgt.filename}`);
    }
}

run();
