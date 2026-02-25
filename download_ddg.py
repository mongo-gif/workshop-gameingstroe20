import os
import time
import ssl
import urllib.request
from duckduckgo_search import DDGS

OUTPUT_DIR = './frontend/assets/images/products'
os.makedirs(OUTPUT_DIR, exist_ok=True)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
}

PRODUCTS = [
    ('razer_deathadder_v3.jpg', 'Razer DeathAdder V3 mouse white background'),
    ('logitech_g_pro_x_superlight_2.jpg', 'Logitech G Pro X Superlight 2 mouse white background'),
    ('steelseries_aerox_5.jpg', 'SteelSeries Aerox 5 mouse white background'),
    ('logitech_g_pro_x_keyboard.jpg', 'Logitech G Pro X Keyboard white background'),
    ('razer_huntsman_v3_pro_tkl.jpg', 'Razer Huntsman V3 Pro TKL keyboard white background'),
    ('hyperx_alloy_origins_65.jpg', 'HyperX Alloy Origins 65 keyboard white background'),
    ('hyperx_cloud_ii.jpg', 'HyperX Cloud II headset white background'),
    ('razer_blackshark_v2_pro.jpg', 'Razer BlackShark V2 Pro headset white background'),
    ('steelseries_arctis_nova_7.jpg', 'SteelSeries Arctis Nova 7 headset white background'),
    ('benq_zowie_xl2546k.jpg', 'BenQ ZOWIE XL2546K monitor white background'),
    ('asus_rog_swift_pg27aqn.jpg', 'ASUS ROG Swift PG27AQN monitor white background'),
    ('lg_ultragear_27gp850_b.jpg', 'LG UltraGear 27GP850-B monitor white background'),
    ('secretlab_titan_evo.jpg', 'Secretlab Titan Evo gaming chair white background'),
    ('razer_iskur_v2.jpg', 'Razer Iskur V2 gaming chair white background'),
    ('amd_ryzen_7_7800x3d.jpg', 'AMD Ryzen 7 7800X3D processor white background'),
    ('intel_core_i7_14700k.jpg', 'Intel Core i7 14700K processor white background'),
    ('amd_ryzen_5_7600x.jpg', 'AMD Ryzen 5 7600X processor white background'),
    ('nvidia_geforce_rtx_4070_ti_super.jpg', 'NVIDIA GeForce RTX 4070 Ti Super graphics card white background'),
    ('amd_radeon_rx_7800_xt.jpg', 'AMD Radeon RX 7800 XT graphics card white background'),
    ('nvidia_geforce_rtx_4060.jpg', 'NVIDIA GeForce RTX 4060 graphics card white background'),
    ('g_skill_trident_z5_rgb_32gb.jpg', 'G.Skill Trident Z5 RGB DDR5 32GB ram white background'),
    ('kingston_fury_beast_32gb.jpg', 'Kingston Fury Beast DDR5 32GB ram white background'),
    ('samsung_990_pro_2tb.jpg', 'Samsung 990 Pro 2TB SSD NVMe white background'),
    ('wd_black_sn850x_1tb.jpg', 'WD Black SN850X 1TB SSD NVMe white background'),
    ('corsair_rm850x_850w.jpg', 'Corsair RM850x 850W power supply white background'),
    ('seasonic_focus_gx_750.jpg', 'Seasonic Focus GX-750 power supply white background'),
    ('nzxt_h7_flow.jpg', 'NZXT H7 Flow pc case white background'),
    ('lian_li_o11_dynamic_evo.jpg', 'Lian Li O11 Dynamic EVO pc case white background'),
]

BANNED_DOMAINS = ['youtube.com', 'pinterest.com', 'ebay.com', 'shopee', 'lazada', 'carousell']

def download_image(url, dest):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': HEADERS['User-Agent']})
        with urllib.request.urlopen(req, timeout=10, context=ctx) as r:
            data = r.read()
            # Must be a reasonable size for a product image (not a tiny icon, not a huge wallpaper)
            # Minimum 15KB to avoid tiny placeholder icons
            if len(data) < 15000:
                return 0
            if b'<html' in data[:200].lower() or b'<!doctype' in data[:200].lower():
                return 0
            with open(dest, 'wb') as f:
                f.write(data)
            return len(data)
    except Exception:
        return 0

def main():
    ddgs = DDGS()
    ok = 0
    failed = []
    
    print(f'Starting download of {len(PRODUCTS)} images via DuckDuckGo...\n')
    
    for filename, query in PRODUCTS:
        print(f'Searching: {query[:50]}...')
        dest = os.path.join(OUTPUT_DIR, filename)
        success = False
        
        try:
            # Get top 15 image results
            results = list(ddgs.images(query, max_results=15))
            
            for res in results:
                url = res.get('image')
                if not url:
                    continue
                
                # Verify domain
                is_banned = any(b in url.lower() for b in BANNED_DOMAINS)
                if is_banned:
                    continue
                    
                print(f'  Trying: {url[:80]}...')
                size = download_image(url, dest)
                if size > 15000:
                    print(f'  OK ({size//1024} KB)')
                    success = True
                    break
                else:
                    print('  Failed or too small (skipping)')
        except Exception as e:
            print(f'  Search error: {e}')
        
        if success:
            ok += 1
        else:
            print(f'  FAILED ALL ATTEMPTS for {filename}')
            failed.append(filename)
            
        time.sleep(1) # Be nice to the API
        
    print('\n================================')
    print(f'Downloaded: {ok}/{len(PRODUCTS)}')
    print('================================')
    if failed:
        print(f'Failed: {failed}')

if __name__ == '__main__':
    main()
