import sys
import re

# Set stdout to UTF-8
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
    try:
        # Convert string to bytes representing the original mojibake characters
        bytes_list = []
        for ch in s:
            code = ord(ch)
            if code in unicode_to_cp1252:
                bytes_list.append(unicode_to_cp1252[code])
            elif code <= 0xFF:
                bytes_list.append(code)
            else:
                # For characters outside CP1252 range, keep their UTF-8 bytes
                bytes_list.extend(ch.encode('utf-8'))
        
        return bytes(bytes_list).decode('utf-8')
    except Exception as e:
        return f"Error: {e}"

# Test cases (Mojibake versions)
test_strings = [
    "Mua 1 Ä‘Æ°á»£c 2 â€“ Chill hÃ¨ cá»±c Ä‘Ã£!",
    "KÃ­nh chÃ o quÃ½ khÃ¡ch! TÃ´i lÃ  Barista áº£o cá»§a Trung NguyÃªn Legend Ã‚u Láº¡c Huáº¿. QuÃ½ khÃ¡ch cáº§n tÆ° váº¥n mÃ³n ngon hay tÃ¬m hiá»ƒu Æ°u Ä‘Ã£i gÃ¬ hÃ´m nay áº¡? â˜•ï¸ ",
    "ðŸšš ChÃ­nh sÃ¡ch giao hÃ ng cá»§a Trung NguyÃªn Legend Ã‚u Láº¡c:",
    "Quay láº¡i Trang Chá»§",
    "Ä Ã£ thanh toÃ¡n",
    "TÃ´i Ä\u0085 Thanh ToÃ¡n",
    "NGÃ” QUá»²NH TRANG",
    "Ä áº·t HÃ ng ThÃ nh CÃ´ng!"
]

for ts in test_strings:
    print(f"Original: {ts}")
    print(f"Repaired: {repair_string(ts)}")
    print("-" * 40)
