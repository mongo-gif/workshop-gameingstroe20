import urllib.request
import os
import sys

OUTPUT_DIR = './frontend/assets/images/products'

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/webp,image/avif,image/jpeg,image/png,*/*',
}

# Each product has a list of fallback URLs to try
PRODUCTS = [
    # ===== MOUSE =====
    ('razer_deathadder_v3.jpg', [
        'https://assets2.razerzone.com/images/pnx.assets/375374eee7f9fa3b55e5a4756c81b8a8/razer-deathadder-v3-500x500.webp',
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6521/6521707_sd.jpg',
        'https://m.media-amazon.com/images/I/516h4LRXMmL._AC_SX679_.jpg',
    ]),
    ('logitech_g_pro_x_superlight_2.jpg', [
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6548/6548929_sd.jpg',
        'https://m.media-amazon.com/images/I/41J-BYJPTJL._AC_SX679_.jpg',
    ]),
    ('steelseries_aerox_5.jpg', [
        'https://media.steelseriescdn.com/thumbs/catalog/items/62401/47f3a66a77424b02a36e7fc283607e32.png.500x400_q100_crop-fit_optimize.png',
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6504/6504936_sd.jpg',
        'https://m.media-amazon.com/images/I/61RpjBNj9ML._AC_SX679_.jpg',
    ]),

    # ===== KEYBOARD =====
    ('logitech_g_pro_x_keyboard.jpg', [
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6401/6401826_sd.jpg',
        'https://m.media-amazon.com/images/I/71HzGpBg0XL._AC_SX679_.jpg',
    ]),
    ('razer_huntsman_v3_pro_tkl.jpg', [
        'https://assets2.razerzone.com/images/pnx.assets/6cef4093e36a782c75a6b1a7d7f0e01b/razer-huntsman-v3-pro-tkl-hero.png',
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6570/6570888_sd.jpg',
        'https://m.media-amazon.com/images/I/61BqUq9-hJL._AC_SX679_.jpg',
    ]),
    ('hyperx_alloy_origins_65.jpg', [
        'https://media.kingston.com/hyperx/product/hx-kb6bsx-us-1-zm-lg.jpg',
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6515/6515606_sd.jpg',
        'https://m.media-amazon.com/images/I/71xpuTTgbmL._AC_SX679_.jpg',
    ]),

    # ===== HEADSET =====
    ('hyperx_cloud_ii.jpg', [
        'https://media.kingston.com/images/products/HyperX_Cloud_II_Gaming_Headset_Red_main_zm_lg.jpg',
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/4390/4390402_sd.jpg',
        'https://m.media-amazon.com/images/I/71eFiHcAkNL._AC_SX679_.jpg',
    ]),
    ('razer_blackshark_v2_pro.jpg', [
        'https://assets2.razerzone.com/images/pnx.assets/f95f71a2cba2c00d7f1e8553b7c4ccda/razer-blackshark-v2-pro-wireless-500x500.webp',
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6483/6483823_sd.jpg',
        'https://m.media-amazon.com/images/I/81sVYJqkG0L._AC_SX679_.jpg',
    ]),
    ('steelseries_arctis_nova_7.jpg', [
        'https://media.steelseriescdn.com/thumbs/catalog/items/61553/c65ab36bb8b6400aa2fb99c1e0a9b5a3.png.500x400_q100_crop-fit_optimize.png',
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6517/6517844_sd.jpg',
        'https://m.media-amazon.com/images/I/81X69X7DKJL._AC_SX679_.jpg',
    ]),

    # ===== MONITOR =====
    ('benq_zowie_xl2546k.jpg', [
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6450/6450890_sd.jpg',
        'https://m.media-amazon.com/images/I/71LJ7B9aSFL._AC_SX679_.jpg',
    ]),
    ('asus_rog_swift_pg27aqn.jpg', [
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6548/6548201_sd.jpg',
        'https://m.media-amazon.com/images/I/81r9cz0RJXL._AC_SX679_.jpg',
    ]),
    ('lg_ultragear_27gp850_b.jpg', [
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6475/6475933_sd.jpg',
        'https://m.media-amazon.com/images/I/715Q0rdGkiL._AC_SX679_.jpg',
    ]),

    # ===== CHAIR =====
    ('secretlab_titan_evo.jpg', [
        'https://m.media-amazon.com/images/I/61j2-GHVJBL._AC_SX679_.jpg',
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6419/6419414_sd.jpg',
    ]),
    ('razer_iskur_v2.jpg', [
        'https://assets2.razerzone.com/images/pnx.assets/1d1a52fac6a06f087e6e4e4c0c0e5d10/razer-iskur-v2-500x500.webp',
        'https://m.media-amazon.com/images/I/71CUcpT1OeL._AC_SX679_.jpg',
    ]),

    # ===== CPU =====
    ('amd_ryzen_7_7800x3d.jpg', [
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6545/6545275_sd.jpg',
        'https://m.media-amazon.com/images/I/41D31YKgjKL._AC_SX679_.jpg',
    ]),
    ('intel_core_i7_14700k.jpg', [
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6559/6559019_sd.jpg',
        'https://m.media-amazon.com/images/I/61CVobYOhoL._AC_SX679_.jpg',
    ]),
    ('amd_ryzen_5_7600x.jpg', [
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6516/6516834_sd.jpg',
        'https://m.media-amazon.com/images/I/41VSnN6X4QL._AC_SX679_.jpg',
    ]),

    # ===== GPU =====
    ('nvidia_geforce_rtx_4070_ti_super.jpg', [
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6569/6569054_sd.jpg',
        'https://m.media-amazon.com/images/I/81t-PnPMJNL._AC_SX679_.jpg',
    ]),
    ('amd_radeon_rx_7800_xt.jpg', [
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6559/6559060_sd.jpg',
        'https://m.media-amazon.com/images/I/81G3t1OyKIL._AC_SX679_.jpg',
    ]),
    ('nvidia_geforce_rtx_4060.jpg', [
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6548/6548421_sd.jpg',
        'https://m.media-amazon.com/images/I/81JeJapJMZL._AC_SX679_.jpg',
    ]),

    # ===== RAM =====
    ('g_skill_trident_z5_rgb_32gb.jpg', [
        'https://m.media-amazon.com/images/I/717yrKgzFXL._AC_SX679_.jpg',
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6522/6522741_sd.jpg',
    ]),
    ('kingston_fury_beast_32gb.jpg', [
        'https://media.kingston.com/kingston/product/ktc-product-fury-ddr5-kf556c36bbe-16-1-zm-lg.jpg',
        'https://m.media-amazon.com/images/I/71iVAhINckL._AC_SX679_.jpg',
    ]),

    # ===== SSD =====
    ('samsung_990_pro_2tb.jpg', [
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6559/6559049_sd.jpg',
        'https://m.media-amazon.com/images/I/71ZkKYfEFJL._AC_SX679_.jpg',
    ]),
    ('wd_black_sn850x_1tb.jpg', [
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6529/6529767_sd.jpg',
        'https://m.media-amazon.com/images/I/71s13XplYnL._AC_SX679_.jpg',
    ]),

    # ===== PSU =====
    ('corsair_rm850x_850w.jpg', [
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6521/6521698_sd.jpg',
        'https://m.media-amazon.com/images/I/71u8GSmS3gL._AC_SX679_.jpg',
    ]),
    ('seasonic_focus_gx_750.jpg', [
        'https://m.media-amazon.com/images/I/71YpOSHLlhL._AC_SX679_.jpg',
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6536/6536516_sd.jpg',
    ]),

    # ===== CASE =====
    ('nzxt_h7_flow.jpg', [
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6521/6521543_sd.jpg',
        'https://m.media-amazon.com/images/I/81XHHjMdGbL._AC_SX679_.jpg',
    ]),
    ('lian_li_o11_dynamic_evo.jpg', [
        'https://m.media-amazon.com/images/I/81p0hCkUXUL._AC_SX679_.jpg',
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6536/6536785_sd.jpg',
    ]),
]

def download(url, dest):
    try:
        req = urllib.request.Request(url, headers={**HEADERS, 'Referer': '/'.join(url.split('/')[:3]) + '/'})
        with urllib.request.urlopen(req, timeout=15) as response:
            if response.status == 200:
                content_type = response.headers.get('Content-Type', '')
                data = response.read()
                # If response is HTML it's likely a block page
                if b'<html' in data[:200].lower() or b'<!DOCTYPE' in data[:200].lower():
                    return False
                with open(dest, 'wb') as f:
                    f.write(data)
                return len(data)
    except Exception as e:
        return False
    return False

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    ok = 0
    failed = []
    
    print(f'\nDownloading {len(PRODUCTS)} product images...\n')
    
    for filename, urls in PRODUCTS:
        dest = os.path.join(OUTPUT_DIR, filename)
        print(f'[*] {filename}')
        success = False
        for url in urls:
            print(f'    Trying: {url[:80]}...')
            size = download(url, dest)
            if size and size > 5000:
                print(f'    OK ({size//1024} KB)')
                success = True
                ok += 1
                break
            elif size:
                print(f'    Too small ({size} bytes), skipping')
            else:
                print(f'    FAIL')
        
        if not success:
            failed.append(filename)
            print(f'    FAILED: {filename}')
    
    print(f'\n' + '='*45)
    print(f'Downloaded: {ok}/{len(PRODUCTS)}')
    if failed:
        print(f'Failed ({len(failed)}):')
        for f in failed:
            print(f'   - {f}')
    print('='*45 + '\n')

if __name__ == '__main__':
    main()
