import sys
import re
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

# CP1252 mapping
cp1252_map = {
    0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E, 0x85: 0x2026,
    0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160,
    0x8B: 0x2039, 0x8C: 0x0152, 0x8E: 0x017D, 0x91: 0x2018, 0x92: 0x2019,
    0x93: 0x201C, 0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
    0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153,
    0x9E: 0x017E, 0x9F: 0x0178
}

unicode_to_cp1252 = {uni: byte for byte, uni in cp1252_map.items()}

def repair_string(s):
    # If there is no mojibake markers or non-ASCII characters, return as-is
    # Markers of mojibake: Ã, Ä, Æ, â, á, etc.
    if not any(ord(c) > 127 for c in s):
        return s
        
    try:
        bytes_list = []
        for ch in s:
            code = ord(ch)
            if code in unicode_to_cp1252:
                bytes_list.append(unicode_to_cp1252[code])
            elif code <= 0xFF:
                bytes_list.append(code)
            else:
                raise ValueError("Not CP1252 character")
        
        decoded = bytes(bytes_list).decode('utf-8')
        return decoded
    except Exception:
        # If it fails, try a softer approach:
        # Replace U+2018 (left single quote) or space with U+0091 to repair 'đ' if we have 'Ä' + U+2018 or 'Ä' + U+0020
        # In many systems, U+2018 (left single quote) or space U+0020 has been written instead of U+0091.
        # Let's try to repair known broken sequences like 'Ä ' or 'Ä\u0085' or 'Ä\u0091' manually
        try:
            # Try to replace space or U+2018 after Ä with the correct byte for đ (0x91)
            # and other typical broken mappings
            repaired = s
            # Replace common corruption of 'đ' which is 'Ä' (U+00C4) + ' ' (space) or 'Ä' + '‘' (U+2018)
            # to Ä\x91
            # Let's do this at the byte level or string replacement before CP1252 conversion.
            # But wait, let's see: U+00C4 (Ä) + U+2018 (‘) should map to 0xC4, 0x91 which is 'đ'.
            # Wait, U+2018 is in CP1252 at 0x91, so unicode_to_cp1252 should map it to 0x91!
            # Why did 'Ä Đ' fail? Wait, 'Ä \u0085' or similar?
            # Let's see: 'Ä Ã£' failed.
            # In 'Ä Ã£', the character after Ä is a space U+0020!
            # If U+2018 was replaced by space U+0020, then the sequence is U+00C4 + U+0020 + U+00C3 + U+00A3.
            # If we map this to bytes: 0xC4, 0x20, 0xC3, 0xA3.
            # Since 0xC4 is followed by 0x20, it is invalid UTF-8.
            # We can detect U+00C4 followed by space and turn it into 'đ' (0xC4, 0x91)!
            # Let's do a regex replacement on the string `s` for common corruptions before CP1252 mapping:
            
            # 1. Ä + space -> Ä + \u0091 (which maps to 0x91)
            # Wait, U+0091 is the Unicode character for byte 0x91.
            s_mod = s.replace("Ä ", "Ä\u0091")
            
            # 2. Ä + \u0085 -> Ä + \u0091
            s_mod = s_mod.replace("Ä\u0085", "Ä\u0091")
            s_mod = s_mod.replace("Ä…", "Ä\u0091") # U+2026 or similar?
            
            bytes_list = []
            for ch in s_mod:
                code = ord(ch)
                if code in unicode_to_cp1252:
                    bytes_list.append(unicode_to_cp1252[code])
                elif code <= 0xFF:
                    bytes_list.append(code)
                else:
                    raise ValueError("Not CP1252")
            
            return bytes(bytes_list).decode('utf-8')
        except Exception:
            return s

# Test the function with some strings:
print("Test:")
print(repair_string("TÃ´i Ä Ã£ Thanh ToÃ¡n"))
print(repair_string("Ä Ã£ thanh toÃ¡n"))
print(repair_string("Ä áº·t HÃ ng ThÃ nh CÃ´ng!"))

# Let's read the file and process string literals
src_file = Path(r"d:\Du-an\website-vpc\src\components\shared\storefront-client.tsx.bak-before-powershell")
dest_file = Path(r"d:\Du-an\website-vpc\src\components\shared\storefront-client.tsx")

content = src_file.read_text(encoding="utf-8")

# Regex to find single-quoted, double-quoted and backtick strings
# We use re.DOTALL for backticks to match multiline strings
pattern = re.compile(r'(\'(?:[^\'\\]|\\.)*\'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)', re.DOTALL)

def replacer(match):
    original_str = match.group(0)
    quote = original_str[0]
    inner_str = original_str[1:-1]
    
    # Repair inner string
    repaired_inner = repair_string(inner_str)
    
    # Return with original quotes
    return f"{quote}{repaired_inner}{quote}"

repaired_content = pattern.sub(replacer, content)

dest_file.write_text(repaired_content, encoding="utf-8")
print("Successfully repaired storefront-client.tsx!")
