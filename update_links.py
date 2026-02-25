import glob

html_files = glob.glob('frontend/**/*.html', recursive=True)

replacements = {
    'href="#products">สินค้าทั้งหมด</a>': 'href="category.html">สินค้าทั้งหมด</a>',
    'href="index.html#products">สินค้าทั้งหมด</a>': 'href="category.html">สินค้าทั้งหมด</a>'
}

changed = 0
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        changed += 1

print(f"Updated 'All Products' link in {changed} HTML files.")
