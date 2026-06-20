import os
import urllib.request
import json

env_path = r"d:\Du-an\website-vpc\.env.local"
env = {}
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#"):
                parts = line.split("=", 1)
                if len(parts) == 2:
                    env[parts[0].strip()] = parts[1].strip().strip("\"'")

url = env.get("NEXT_PUBLIC_SUPABASE_URL")
key = env.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Missing Supabase config")
    exit(1)

def check_table(table_name):
    req_url = f"{url}/rest/v1/{table_name}?select=*&limit=1"
    req = urllib.request.Request(req_url)
    req.add_header("apikey", key)
    req.add_header("Authorization", f"Bearer {key}")
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Table '{table_name}': EXISTS")
            return True
    except Exception as e:
        print(f"Table '{table_name}': NOT FOUND or error {e}")
        return False

check_table("danh_gia")
check_table("don_hang")
check_table("products")
check_table("san_pham_vat_pham")
check_table("san_pham_do_uong")
