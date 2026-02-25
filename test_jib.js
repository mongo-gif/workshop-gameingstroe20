const google = require('googlethis');

async function test() {
    const p = 'Razer DeathAdder V3';
    const res = await google.image(`site:jib.co.th OR site:advice.co.th ${p}`, { safe: false });

    // Filter for /img_master/product/original/ or /images_nas/pic_product4/
    const best = res.find(img => img.url.includes('/original/') || img.url.includes('pic_product4'));
    console.log(best ? best.url : 'Not found');
}

test();
