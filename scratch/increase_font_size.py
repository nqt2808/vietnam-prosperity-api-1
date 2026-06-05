import re
from pathlib import Path

files_to_adjust = [
    Path("index.html"),
    Path("public/index.html"),
    Path("src/app/globals.css"),
    Path("admin.html"),
    Path("public/admin.html")
]

def scale_text(text):
    def replace_decl(match):
        decl_name = match.group(1)
        decl_value = match.group(2)
        
        def replace_px(px_match):
            num_str = px_match.group(1)
            num = float(num_str)
            if num.is_integer():
                new_num = int(num) + 1
            else:
                new_num = num + 1
            return f"{new_num}px"
            
        new_value = re.sub(r"(\d+(?:\.\d+)?)\s*px", replace_px, decl_value)
        return f"{decl_name}:{new_value}"

    return re.sub(r"\b(font-size)\s*:\s*([^;}\n]+)", replace_decl, text, flags=re.IGNORECASE)

for file_path in files_to_adjust:
    if file_path.exists():
        print(f"Processing {file_path}...")
        try:
            content = file_path.read_text(encoding="utf-8")
            new_content = scale_text(content)
            file_path.write_text(new_content, encoding="utf-8")
            print(f"Successfully updated {file_path}")
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
    else:
        print(f"File {file_path} does not exist, skipping.")
