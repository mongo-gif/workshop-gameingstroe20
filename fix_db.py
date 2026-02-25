import codecs

def fix_sql():
    with open('backend/database.sql', 'r', encoding='utf-8') as f:
        text = f.read()
    
    # We want to convert CP874/TIS-620 interpreted text back to its raw UTF-8 bytes
    # To do this safely, we encode to bytes using cp874.
    # We use a custom error handler or just ignore errors that aren't CP874 mappable
    
    # Actually, Windows-874 has a few differences from cp874 in Python
    # \u201a (‚), \u201c (“), \u201d (”), \u2022 (•), \u2013 (–), \u2014 (—)
    # The '€' character (\u20ac) is CP1252 but often appears in corrupted CP874 streams.
    # In Windows-874, 0x80 is Euro ( in python's cp874 ? No, it's not mapped).
    # Let's see how python handles to cp874.
    
    fixed_bytes = bytearray()
    for char in text:
        try:
            if char == '€': # 0x80 in Windows-874
                fixed_bytes.append(0x80)
            elif char == '‚': # 0x82
                fixed_bytes.append(0x82)
            elif char == 'ƒ': # 0x83
                fixed_bytes.append(0x83)
            elif char == '„': # 0x84
                fixed_bytes.append(0x84)
            elif char == '…': # 0x85
                fixed_bytes.append(0x85)
            elif char == '†': # 0x86
                fixed_bytes.append(0x86)
            elif char == '‡': # 0x87
                fixed_bytes.append(0x87)
            elif char == 'ˆ': # 0x88
                fixed_bytes.append(0x88)
            elif char == '‰': # 0x89
                fixed_bytes.append(0x89)
            elif char == 'Š': # 0x8A
                fixed_bytes.append(0x8a)
            elif char == '‹': # 0x8B
                fixed_bytes.append(0x8b)
            elif char == 'Œ': # 0x8C
                fixed_bytes.append(0x8c)
            elif char == 'Ž': # 0x8E
                fixed_bytes.append(0x8e)
            elif char == '‘': # 0x91
                fixed_bytes.append(0x91)
            elif char == '’': # 0x92
                fixed_bytes.append(0x92)
            elif char == '“': # 0x93
                fixed_bytes.append(0x93)
            elif char == '”': # 0x94
                fixed_bytes.append(0x94)
            elif char == '•': # 0x95
                fixed_bytes.append(0x95)
            elif char == '–': # 0x96
                fixed_bytes.append(0x96)
            elif char == '—': # 0x97
                fixed_bytes.append(0x97)
            elif char == '˜': # 0x98
                fixed_bytes.append(0x98)
            elif char == '™': # 0x99
                fixed_bytes.append(0x99)
            elif char == 'š': # 0x9A
                fixed_bytes.append(0x9a)
            elif char == '›': # 0x9B
                fixed_bytes.append(0x9b)
            elif char == 'œ': # 0x9C
                fixed_bytes.append(0x9c)
            elif char == 'ž': # 0x9E
                fixed_bytes.append(0x9e)
            elif char == 'Ÿ': # 0x9F
                fixed_bytes.append(0x9f)
            else:
                # encode using cp1252 first as a fallback for ANSI chars that TIS-620 doesn't have?
                # Actually, the characters are like 'เธฃเธฐ'. They are Thai chars.
                # Let's try cp874.
                encoded = char.encode('cp874')
                fixed_bytes.extend(encoded)
        except Exception:
            try:
                # If cp874 fails, maybe it's CP1252?
                fixed_bytes.extend(char.encode('cp1252'))
            except Exception:
                # Just keep the original character by UTF-8 bytes if all fails
                fixed_bytes.extend(char.encode('utf-8'))

    # Now decode as UTF-8
    decoded = fixed_bytes.decode('utf-8', errors='replace')
    
    with open('backend/database_fixed.sql', 'w', encoding='utf-8') as f:
        f.write(decoded)

if __name__ == '__main__':
    fix_sql()
    print("Done")
