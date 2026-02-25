import glob
import os

html_files = glob.glob('frontend/**/*.html', recursive=True)

# Replacements to make
replacements = {
    # Page Title
    'G-STORE | ': 'MR.Hoyjorz Gaming | ',
    '<title>G-STORE</title>': '<title>MR.Hoyjorz Gaming</title>',
    
    # Text mentions
    'G-STORE ร้านจำหน่ายคอมพิวเตอร์': 'MR.Hoyjorz Gaming ร้านจำหน่ายคอมพิวเตอร์',
    'G-STORE เพื่อนรู้ใจ': 'MR.Hoyjorz Gaming เพื่อนรู้ใจ',
    'เกี่ยวกับ G-STORE': 'เกี่ยวกับ MR.Hoyjorz Gaming',
    'G-STORE Gaming': 'MR.Hoyjorz Gaming',
    
    # Logos
    'G-<span class="logo-highlight">STORE</span>': 'MR.Hoyjorz <span class="logo-highlight">Gaming</span>',
    'G-<span>STORE</span>': 'MR.Hoyjorz <span>Gaming</span>',
}

changed_files = 0
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        changed_files += 1

print(f"Updated store name in {changed_files} HTML files.")
