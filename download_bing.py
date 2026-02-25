import os
import time
import ssl
import urllib.request
import urllib.parse
import re
import json
import itertools
from typing import List, Tuple

OUTPUT_DIR = './frontend/assets/images/products'
os.makedirs(OUTPUT_DIR, exist_ok=True)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

PRODUCTS: List[Tuple[str, str]] = [
    ('razer_deathadder_v3.jpg', 'Razer DeathAdder V3 official product white background'),
    ('logitech_g_pro_x_superlight_2.jpg', 'Logitech G Pro X Superlight 2 official product white background'),
    ('steelseries_aerox_5.jpg', 'SteelSeries Aerox 5 wireless mouse official white background'),
    ('logitech_g_pro_x_keyboard.jpg', 'Logitech G Pro X Keyboard official product white background'),
    ('razer_huntsman_v3_pro_tkl.jpg', 'Razer Huntsman V3 Pro TKL keyboard official white background'),
    ('hyperx_alloy_origins_65.jpg', 'HyperX Alloy Origins 65 keyboard official white background'),
    ('hyperx_cloud_ii.jpg', 'HyperX Cloud II headset official white background'),
    ('razer_blackshark_v2_pro.jpg', 'Razer BlackShark V2 Pro headset official white background'),
    ('steelseries_arctis_nova_7.jpg', 'SteelSeries Arctis Nova 7 headset official white background'),
    ('benq_zowie_xl2546k.jpg', 'BenQ ZOWIE XL2546K monitor official white background'),
    ('asus_rog_swift_pg27aqn.jpg', 'ASUS ROG Swift PG27AQN monitor official white background'),
    ('lg_ultragear_27gp850_b.jpg', 'LG UltraGear 27GP850-B monitor official white background'),
    ('secretlab_titan_evo.jpg', 'Secretlab Titan Evo gaming chair official white background'),
    ('razer_iskur_v2.jpg', 'Razer Iskur V2 gaming chair official white background'),
    ('amd_ryzen_7_7800x3d.jpg', 'AMD Ryzen 7 7800X3D processor box official white background'),
    ('intel_core_i7_14700k.jpg', 'Intel Core i7 14700K processor box official white background'),
    ('amd_ryzen_5_7600x.jpg', 'AMD Ryzen 5 7600X processor box official white background'),
    ('nvidia_geforce_rtx_4070_ti_super.jpg', 'NVIDIA GeForce RTX 4070 Ti Super graphics card official white background'),
    ('amd_radeon_rx_7800_xt.jpg', 'AMD Radeon RX 7800 XT graphics card official white background'),
    ('nvidia_geforce_rtx_4060.jpg', 'NVIDIA GeForce RTX 4060 graphics card official white background'),
    ('g_skill_trident_z5_rgb_32gb.jpg', 'G.Skill Trident Z5 RGB DDR5 32GB ram official white background'),
    ('kingston_fury_beast_32gb.jpg', 'Kingston Fury Beast DDR5 32GB ram official white background'),
    ('samsung_990_pro_2tb.jpg', 'Samsung 990 Pro 2TB SSD NVMe official white background'),
    ('wd_black_sn850x_1tb.jpg', 'WD Black SN850X 1TB SSD NVMe official white background'),
    ('corsair_rm850x_850w.jpg', 'Corsair RM850x 850W power supply official white background'),
    ('seasonic_focus_gx_750.jpg', 'Seasonic Focus GX-750 power supply official white background'),
    ('nzxt_h7_flow.jpg', 'NZXT H7 Flow pc case official white background'),
    ('lian_li_o11_dynamic_evo.jpg', 'Lian Li O11 Dynamic EVO pc case official white background'),
]

BANNED_DOMAINS: List[str] = ['youtube.com', 'pinterest.com', 'shopee', 'lazada', 'carousell', 'reddit.com']

def download_image(url: str, dest: str) -> int:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': HEADERS['User-Agent']})
        with urllib.request.urlopen(req, timeout=10, context=ctx) as r:
            data = r.read()
            if len(data) < 15000:
                return 0
            if b'<html' in data[:200].lower() or b'<!doc' in data[:200].lower():
                return 0
            with open(dest, 'wb') as f:
                f.write(data)
            return len(data)
    except Exception:
        return 0

def get_bing_images(query: str) -> List[str]:
    url = f'https://www.bing.com/images/search?q={urllib.parse.quote(query)}&form=HDRSC3'
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
        # Bing stores image data in m="{...}" attributes
        matches = re.findall(r'murl&quot;:&quot;(.*?)&quot;', html)
        return matches
    except Exception as e:
        print(f'Error fetching Bing: {e}')
        return []

def main():
    succeeded: List[str] = []
    failed: List[str] = []
    
    print(f'Starting download of {len(PRODUCTS)} images via Bing Image Search...\n')
    
    for filename, query in PRODUCTS:
        print(f'Searching: {query}...')
        dest = os.path.join(OUTPUT_DIR, filename)
        success = False
        
        if os.path.exists(dest) and os.path.getsize(dest) > 15000:
            print(f'  Already downloaded: {filename}')
            succeeded.append(filename)
            continue
            
        urls = get_bing_images(query)
        if not urls:
            print('  No URLs found.')
            failed.append(filename)
            continue
            
        for i, url in enumerate(urls): # Try top 10 results
            if i >= 10:
                break
            is_banned = any(b in url.lower() for b in BANNED_DOMAINS)
            if is_banned or not (url.lower().endswith('.jpg') or url.lower().endswith('.png') or url.lower().endswith('.jpeg')):
                continue
                
            try:
                print(f'  Trying: {url[:80].encode("ascii", "replace").decode("ascii")}...')
            except Exception:
                pass
            size = download_image(url, dest)
            if size > 15000:
                print(f'  OK ({size//1024} KB)')
                success = True
                break
            else:
                print('  Failed or too small (skipping)')
        
        
        if success:
            succeeded.append(filename)
        else:
            try:
                print(f'  FAILED ALL ATTEMPTS for {filename}')
            except:
                pass
            failed.append(filename)
            
        time.sleep(1)
        
    print('\n================================')
    print(f'Downloaded: {len(succeeded)}/{len(PRODUCTS)}')
    print('================================')
    if failed:
        print(f'Failed: {failed}')

if __name__ == '__main__':
    main()
