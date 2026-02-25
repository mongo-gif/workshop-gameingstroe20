const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = './frontend/assets/images/products';

// Reliable image URLs for each product - using official CDNs and reliable sources
const products = [
    // ===== MOUSE =====
    {
        filename: 'razer_deathadder_v3.jpg',
        urls: [
            'https://assets2.razerzone.com/images/pnx.assets/375374eee7f9fa3b55e5a4756c81b8a8/razer-deathadder-v3-500x500.webp',
            'https://assets3.razerzone.com/C0kMmwbCLLTajwSE4kbqQ73gKAI=/1500x1000/https%3A%2F%2Fassets2.razerzone.com%2Fimages%2Fpnx.assets%2F375374eee7f9fa3b55e5a4756c81b8a8%2Frazer-deathadder-v3-500x500.webp',
            'https://i.ebayimg.com/images/g/ue8AAOSw3lFlLaen/s-l1600.jpg',
        ]
    },
    {
        filename: 'logitech_g_pro_x_superlight_2.jpg',
        urls: [
            'https://resource.logitech.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight-2/pro-x-superlight-2-gallery-1.png',
            'https://i.ebayimg.com/images/g/XNcAAOSwz8lj7nDm/s-l1600.jpg',
        ]
    },
    {
        filename: 'steelseries_aerox_5.jpg',
        urls: [
            'https://media.steelseriescdn.com/thumbs/catalog/items/62401/47f3a66a77424b02a36e7fc283607e32.png.500x400_q100_crop-fit_optimize.png',
            'https://i.ebayimg.com/images/g/BG0AAOSwXBtlNf4p/s-l1600.jpg',
        ]
    },

    // ===== KEYBOARD =====
    {
        filename: 'logitech_g_pro_x_keyboard.jpg',
        urls: [
            'https://resource.logitech.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-keyboard/pro-x-keyboard-gallery-1.png',
            'https://i.ebayimg.com/images/g/JkEAAOSwOUBiQzpf/s-l1600.jpg',
        ]
    },
    {
        filename: 'razer_huntsman_v3_pro_tkl.jpg',
        urls: [
            'https://assets2.razerzone.com/images/pnx.assets/6cef4093e36a782c75a6b1a7d7f0e01b/razer-huntsman-v3-pro-tkl-hero.png',
            'https://i.ebayimg.com/images/g/XNcAAOSwz8lj7nDm/s-l1600.jpg',
        ]
    },
    {
        filename: 'hyperx_alloy_origins_65.jpg',
        urls: [
            'https://media.kingston.com/hyperx/product/hx-kb6bsx-us-1-zm-lg.jpg',
            'https://i.ebayimg.com/images/g/CkoAAOSwK3RlSuq-/s-l1600.jpg',
        ]
    },

    // ===== HEADSET =====
    {
        filename: 'hyperx_cloud_ii.jpg',
        urls: [
            'https://media.kingston.com/hyperx/product/hx-hscp-rd-2-zm-lg.jpg',
            'https://i.ebayimg.com/images/g/JkEAAOSwOUBiQzpf/s-l1600.jpg',
        ]
    },
    {
        filename: 'razer_blackshark_v2_pro.jpg',
        urls: [
            'https://assets2.razerzone.com/images/pnx.assets/f95f71a2cba2c00d7f1e8553b7c4ccda/razer-blackshark-v2-pro-wireless-500x500.webp',
            'https://i.ebayimg.com/images/g/9z8AAOSwf9xjxaBH/s-l1600.jpg',
        ]
    },
    {
        filename: 'steelseries_arctis_nova_7.jpg',
        urls: [
            'https://media.steelseriescdn.com/thumbs/catalog/items/61553/c65ab36bb8b6400aa2fb99c1e0a9b5a3.png.500x400_q100_crop-fit_optimize.png',
            'https://i.ebayimg.com/images/g/3MIAAOSwuCplHVeW/s-l1600.jpg',
        ]
    },

    // ===== MONITOR =====
    {
        filename: 'benq_zowie_xl2546k.jpg',
        urls: [
            'https://zowie.benq.com/content/dam/zowie/products/monitors/xl2546k/gallery/xl2546k-gallery-1.jpg',
            'https://i.ebayimg.com/images/g/7wAAAOSwg4FiTMmb/s-l1600.jpg',
        ]
    },
    {
        filename: 'asus_rog_swift_pg27aqn.jpg',
        urls: [
            'https://dlcdnwebimgs.asus.com/gain/3D1ED765-84FC-4899-96B5-E86C13C5E65C/',
            'https://i.ebayimg.com/images/g/eGwAAOSwOi9k7k3T/s-l1600.jpg',
        ]
    },
    {
        filename: 'lg_ultragear_27gp850_b.jpg',
        urls: [
            'https://www.lg.com/us/images/monitors/md07503041/gallery/medium01.jpg',
            'https://i.ebayimg.com/images/g/dSsAAOSwhpdiJzf7/s-l1600.jpg',
        ]
    },

    // ===== CHAIR =====
    {
        filename: 'secretlab_titan_evo.jpg',
        urls: [
            'https://secretlab.co/cdn/shop/products/TITAN_EVO_2022_SERIES_SoftWeave_Fabric_Chair_Charcoal_Blue_01.jpg',
            'https://i.ebayimg.com/images/g/3mkAAOSw65dilHJ0/s-l1600.jpg',
        ]
    },
    {
        filename: 'razer_iskur_v2.jpg',
        urls: [
            'https://assets2.razerzone.com/images/pnx.assets/1d1a52fac6a06f087e6e4e4c0c0e5d10/razer-iskur-v2-500x500.webp',
            'https://i.ebayimg.com/images/g/2u8AAOSw7bFjfGOa/s-l1600.jpg',
        ]
    },

    // ===== CPU =====
    {
        filename: 'amd_ryzen_7_7800x3d.jpg',
        urls: [
            'https://www.amd.com/system/files/2023-02/1226888-amd-ryzen-7-7800x3d-PIB-1260x709.png',
            'https://i.ebayimg.com/images/g/gX0AAOSwBbVkEVBt/s-l1600.jpg',
        ]
    },
    {
        filename: 'intel_core_i7_14700k.jpg',
        urls: [
            'https://www.intel.co.th/content/dam/www/central-libraries/us/en/images/2022-09/rp-box-processor-14th-gen-core-k-series-sku-badge-v2.png',
            'https://i.ebayimg.com/images/g/LD8AAOSwI-5lGzPR/s-l1600.jpg',
        ]
    },
    {
        filename: 'amd_ryzen_5_7600x.jpg',
        urls: [
            'https://www.amd.com/system/files/2022-08/1226888-amd-ryzen-5-7600x-PIB-1260x709.png',
            'https://i.ebayimg.com/images/g/FU4AAOSwXKJjFYPM/s-l1600.jpg',
        ]
    },

    // ===== GPU =====
    {
        filename: 'nvidia_geforce_rtx_4070_ti_super.jpg',
        urls: [
            'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4070-ti-super/geforce-ada-rtx-4070-ti-super-product-photo-002-ogi.jpg',
            'https://i.ebayimg.com/images/g/QD0AAOSwM-BlSIiS/s-l1600.jpg',
        ]
    },
    {
        filename: 'amd_radeon_rx_7800_xt.jpg',
        urls: [
            'https://www.amd.com/system/files/2023-08/1448837-amd-rx-7800-xt-product-photo-1260x709.png',
            'https://i.ebayimg.com/images/g/fOkAAOSwmwBlSHuW/s-l1600.jpg',
        ]
    },
    {
        filename: 'nvidia_geforce_rtx_4060.jpg',
        urls: [
            'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4060/geforce-ada-rtx-4060-product-photo-002-ogi.jpg',
            'https://i.ebayimg.com/images/g/hcQAAOSwzuFkx1aM/s-l1600.jpg',
        ]
    },

    // ===== RAM =====
    {
        filename: 'g_skill_trident_z5_rgb_32gb.jpg',
        urls: [
            'https://www.gskill.com/img/products/F5-6000J3038F16GX2-TZ5RK.png',
            'https://i.ebayimg.com/images/g/aqkAAOSw11tkMTxX/s-l1600.jpg',
        ]
    },
    {
        filename: 'kingston_fury_beast_32gb.jpg',
        urls: [
            'https://media.kingston.com/kingston/product/ktc-product-fury-ddr5-kf556c36bbe-16-1-zm-lg.jpg',
            'https://i.ebayimg.com/images/g/bkkAAOSwCJRkTn9c/s-l1600.jpg',
        ]
    },

    // ===== SSD =====
    {
        filename: 'samsung_990_pro_2tb.jpg',
        urls: [
            'https://images.samsung.com/is/image/samsung/p6pim/uk/mz-v9p2t0bw/gallery/uk-990-pro-nvme-m2-ssd-mz-v9p2t0bw-536408524?$650_519_PNG$',
            'https://i.ebayimg.com/images/g/MLcAAOSwuGFjr9SL/s-l1600.jpg',
        ]
    },
    {
        filename: 'wd_black_sn850x_1tb.jpg',
        urls: [
            'https://shop.westerndigital.com/content/dam/store/en-us/assets/products/internal-gaming-storage/wd-black-sn850x-nvme-ssd/gallery/wd-black-sn850x-nvme-ssd-1tb.png.thumb.319.319.png',
            'https://i.ebayimg.com/images/g/FnMAAOSwqgpktBFH/s-l1600.jpg',
        ]
    },

    // ===== PSU =====
    {
        filename: 'corsair_rm850x_850w.jpg',
        urls: [
            'https://www.corsair.com/medias/sys_master/images/images/hdb/hec/9152597786654.jpg',
            'https://i.ebayimg.com/images/g/3OcAAOSwj1hi5AEM/s-l1600.jpg',
        ]
    },
    {
        filename: 'seasonic_focus_gx_750.jpg',
        urls: [
            'https://www.seasonic.com/upload/product_img/big/FOCUS_GX-750_big.png',
            'https://i.ebayimg.com/images/g/U3UAAOSw7YFiBJp5/s-l1600.jpg',
        ]
    },

    // ===== CASE =====
    {
        filename: 'nzxt_h7_flow.jpg',
        urls: [
            'https://nzxt.com/assets/cms/34299/1695840077-h7-flow-white-front-top.png?auto=format&fit=max&h=912&w=912',
            'https://i.ebayimg.com/images/g/l7gAAOSwYd5k2OFm/s-l1600.jpg',
        ]
    },
    {
        filename: 'lian_li_o11_dynamic_evo.jpg',
        urls: [
            'https://www.lian-li.com/wp-content/uploads/2022/03/PC-O11DEX_1.png',
            'https://i.ebayimg.com/images/g/U6AAAOSwmmtkk6W-/s-l1600.jpg',
        ]
    },
];

function downloadFile(url, dest) {
    return new Promise((resolve) => {
        const file = fs.createWriteStream(dest);
        const protocol = url.startsWith('https') ? https : http;

        const req = protocol.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/avif,image/jpeg,image/png,*/*',
                'Referer': new URL(url).origin + '/'
            },
            timeout: 15000
        }, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                // Follow redirect
                file.close();
                fs.unlinkSync(dest);
                return downloadFile(response.headers.location, dest).then(resolve);
            }
            if (response.statusCode !== 200) {
                file.close();
                fs.unlinkSync(dest);
                return resolve(false);
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve(true));
            });
        }).on('error', (err) => {
            file.close();
            try { fs.unlinkSync(dest); } catch (e) { }
            resolve(false);
        });

        req.on('timeout', () => {
            req.destroy();
            file.close();
            try { fs.unlinkSync(dest); } catch (e) { }
            resolve(false);
        });
    });
}

async function downloadProduct(product) {
    const dest = path.join(OUTPUT_DIR, product.filename);

    for (const url of product.urls) {
        console.log(`  Trying: ${url.substring(0, 80)}...`);
        const success = await downloadFile(url, dest);
        if (success) {
            const stats = fs.statSync(dest);
            if (stats.size > 10000) {
                console.log(`  ✅ SUCCESS: ${product.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
                return true;
            } else {
                console.log(`  ⚠️  File too small (${stats.size} bytes), trying next...`);
                try { fs.unlinkSync(dest); } catch (e) { }
            }
        } else {
            console.log(`  ❌ Failed to download`);
        }
    }
    console.log(`  🔴 FAILED: Could not download ${product.filename}`);
    return false;
}

async function main() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    console.log(`\n📦 Downloading ${products.length} product images...\n`);
    let success = 0, failed = 0;

    for (const product of products) {
        console.log(`\n🔍 ${product.filename}`);
        const ok = await downloadProduct(product);
        if (ok) success++; else failed++;
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✅ Success: ${success}/${products.length}`);
    if (failed > 0) console.log(`❌ Failed:  ${failed}/${products.length}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch(console.error);
