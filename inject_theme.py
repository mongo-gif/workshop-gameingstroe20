import glob
import os

html_files = glob.glob('frontend/*.html')

btn_html = """            <div class="header-actions">
                <button id="theme-toggle" class="header-icon-btn" aria-label="Toggle Dark Mode" onclick="toggleTheme()" style="border:none; cursor:pointer; background:transparent;">
                    <span class="icon" id="theme-icon">🌙</span>
                    <span>สีหน้าจอ</span>
                </button>"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'id="theme-toggle"' not in content:
        content = content.replace('            <div class="header-actions">', btn_html, 1)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print(f"Injected theme button into {len(html_files)} HTML files.")
