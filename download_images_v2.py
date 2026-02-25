import urllib.request
import urllib.parse
import json
import os
import re
import ssl
import time

OUTPUT_DIR = './frontend/assets/images/products'
os.makedirs(OUTPUT_DIR, exist_ok=True)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS_BROWSE = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'th,en-US;q=0.9,en;q=0.8',
}

HEADERS_IMG = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
}

PRODUCTS = [
    ('razer_deathadder_v3.jpg', 'Razer DeathAdder V3'),
    ('logitech_g_pro_x_superlight_2.jpg', 'Logitech G Pro X Superlight 2'),
    ('steelseries_aerox_5.jpg', 'SteelSeries Aerox 5'),
    ('logitech_g_pro_x_keyboard.jpg', 'Logitech G Pro X Keyboard'),
    ('razer_huntsman_v3_pro_tkl.jpg', 'Razer Huntsman V3 Pro TKL'),
    ('hyperx_alloy_origins_65.jpg', 'HyperX Alloy Origins 65'),
    ('hyperx_cloud_ii.jpg', 'HyperX Cloud II'),
    ('razer_blackshark_v2_pro.jpg', 'Razer BlackShark V2 Pro'),
    ('steelseries_arctis_nova_7.jpg', 'SteelSeries Arctis Nova 7'),
    ('benq_zowie_xl2546k.jpg', 'BenQ ZOWIE XL2546K'),
    ('asus_rog_swift_pg27aqn.jpg', 'ASUS ROG Swift PG27AQN'),
    ('lg_ultragear_27gp850_b.jpg', 'LG UltraGear 27GP850-B'),
    ('secretlab_titan_evo.jpg', 'Secretlab Titan Evo'),
    ('razer_iskur_v2.jpg', 'Razer Iskur V2'),
    ('amd_ryzen_7_7800x3d.jpg', 'AMD Ryzen 7 7800X3D'),
    ('intel_core_i7_14700k.jpg', 'Intel Core i7 14700K'),
    ('amd_ryzen_5_7600x.jpg', 'AMD Ryzen 5 7600X'),
    ('nvidia_geforce_rtx_4070_ti_super.jpg', 'NVIDIA GeForce RTX 4070 Ti Super'),
    ('amd_radeon_rx_7800_xt.jpg', 'AMD Radeon RX 7800 XT'),
    ('nvidia_geforce_rtx_4060.jpg', 'NVIDIA GeForce RTX 4060'),
    ('g_skill_trident_z5_rgb_32gb.jpg', 'G.Skill Trident Z5 RGB DDR5'),
    ('kingston_fury_beast_32gb.jpg', 'Kingston Fury Beast DDR5'),
    ('samsung_990_pro_2tb.jpg', 'Samsung 990 Pro 2TB'),
    ('wd_black_sn850x_1tb.jpg', 'WD Black SN850X 1TB'),
    ('corsair_rm850x_850w.jpg', 'Corsair RM850x 850W'),
    ('seasonic_focus_gx_750.jpg', 'Seasonic Focus GX-750'),
    ('nzxt_h7_flow.jpg', 'NZXT H7 Flow'),
    ('lian_li_o11_dynamic_evo.jpg', 'Lian Li O11 Dynamic EVO'),
]


def fetch_html(url, referer=''):
    try:
        h = dict(HEADERS_BROWSE)
        if referer:
            h['Referer'] = referer
        req = urllib.request.Request(url, headers=h)
        with urllib.request.urlopen(req, timeout=15, context=ctx) as r:
            return r.read().decode('utf-8', errors='replace')
    except Exception as e:
        return ''


def download_image(url, dest, referer=''):
    try:
        h = dict(HEADERS_IMG)
        if referer:
            h['Referer'] = referer
        req = urllib.request.Request(url, headers=h)
        with urllib.request.urlopen(req, timeout=15, context=ctx) as r:
            data = r.read()
            if len(data) < 3000:
                return 0
            if b'<html' in data[:200].lower() or b'<!doctype' in data[:200].lower():
                return 0
            with open(dest, 'wb') as f:
                f.write(data)
            return len(data)
    except Exception as e:
        return 0


def search_jib(product_name):
    """Search JIB.co.th and extract product image URLs"""
    encoded = urllib.parse.quote(product_name)
    url = f'https://www.jib.co.th/web/product/product_search/0/0/0/{encoded}'
    html = fetch_html(url, 'https://www.jib.co.th/')
    if not html:
        return []
    
    # Look for image URLs in the HTML - JIB uses img_master/product/original/ pattern
    pattern = r'https?://www\.jib\.co\.th/img_master/product/original/\d+_\d+\.(?:jpg|png|webp)'
    matches = re.findall(pattern, html)
    
    # Also look for product IDs in readProduct links
    product_ids = re.findall(r'readProduct/(\d+)/', html)
    
    # Try to get images from product pages
    image_urls = list(set(matches))
    
    for pid in product_ids[:2]:  # Only check first 2 product pages
        purl = f'https://www.jib.co.th/web/product/readProduct/{pid}'
        phtml = fetch_html(purl, 'https://www.jib.co.th/')
        if phtml:
            pmatches = re.findall(r'https?://www\.jib\.co\.th/img_master/product/original/\d+_\d+\.(?:jpg|png|webp)', phtml)
            image_urls.extend(pmatches)
        time.sleep(0.3)
    
    return list(set(image_urls))


def search_advice(product_name):
    """Search Advice.co.th and extract product image URLs"""
    encoded = urllib.parse.quote(product_name)
    url = f'https://www.advice.co.th/search?q={encoded}'
    html = fetch_html(url, 'https://www.advice.co.th/')
    if not html:
        return []
    
    # Advice uses img.advice.co.th/images_nas/pic_product4/ pattern
    pattern = r'https?://img\.advice\.co\.th/images_nas/pic_product4/[A-Z0-9]+/[A-Z0-9]+OK_BIG_\d+\.(?:jpg|png|webp)'
    matches = re.findall(pattern, html)
    
    # Also try smaller images and convert to BIG
    small_pattern = r'https?://img\.advice\.co\.th/images_nas/pic_product4/([A-Z0-9]+)/([A-Z0-9]+)(?:OK)?_(?:SML|MED)_\d+\.(?:jpg|png|webp)'
    small_matches = re.findall(small_pattern, html)
    for folder, code in small_matches:
        matches.append(f'https://img.advice.co.th/images_nas/pic_product4/{folder}/{code}OK_BIG_1.jpg')
    
    return list(set(matches))


def search_ihavecpu(product_name):
    """Search iHaveCPU.com and extract product image URLs"""
    encoded = urllib.parse.quote(product_name)
    url = f'https://www.ihavecpu.com/search?q={encoded}'
    html = fetch_html(url, 'https://www.ihavecpu.com/')
    if not html:
        return []
    
    # ihavecpu uses S3 or similar
    pattern = r'https?://ihcupload\.s3[^"\']+\.(?:jpg|png|webp)'
    matches = re.findall(pattern, html)
    return list(set(matches))


def main():
    print(f'Searching and downloading images for {len(PRODUCTS)} products...\n')
    ok = 0
    failed = []

    for filename, product_name in PRODUCTS:
        dest = os.path.join(OUTPUT_DIR, filename)
        print(f'[{ok+len(failed)+1}/{len(PRODUCTS)}] {product_name}')
        
        success = False
        
        # Try JIB first
        print(f'  Searching JIB...')
        jib_urls = search_jib(product_name)
        if jib_urls:
            for img_url in jib_urls[:3]:
                size = download_image(img_url, dest, 'https://www.jib.co.th/')
                if size > 5000:
                    print(f'  OK from JIB ({size//1024}KB)')
                    success = True
                    break
        
        # Try Advice
        if not success:
            print(f'  Searching Advice...')
            advice_urls = search_advice(product_name)
            if advice_urls:
                for img_url in advice_urls[:3]:
                    size = download_image(img_url, dest, 'https://www.advice.co.th/')
                    if size > 5000:
                        print(f'  OK from Advice ({size//1024}KB)')
                        success = True
                        break
        
        # Try iHaveCPU
        if not success:
            print(f'  Searching iHaveCPU...')
            ihc_urls = search_ihavecpu(product_name)
            if ihc_urls:
                for img_url in ihc_urls[:3]:
                    size = download_image(img_url, dest, 'https://www.ihavecpu.com/')
                    if size > 5000:
                        print(f'  OK from iHaveCPU ({size//1024}KB)')
                        success = True
                        break
        
        if success:
            ok += 1
        else:
            failed.append((filename, product_name))
            print(f'  FAILED')
        
        time.sleep(0.5)
    
    print(f'\n{"="*50}')
    print(f'Downloaded: {ok}/{len(PRODUCTS)}')
    if failed:
        print(f'Failed ({len(failed)}):')
        for f, n in failed:
            print(f'  - {n} ({f})')
    print(f'{"="*50}\n')


if __name__ == '__main__':
    main()
