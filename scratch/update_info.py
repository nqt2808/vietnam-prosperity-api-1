import os
import re

# File paths
storefront_client_path = r"d:\Du-an\website-vpc\src\components\shared\storefront-client.tsx"
index_html_path = r"d:\Du-an\website-vpc\index.html"
public_index_html_path = r"d:\Du-an\website-vpc\public\index.html"

# New membership reply text
new_membership_text = """<strong>💳 CHƯƠNG TRÌNH THÀNH VIÊN TRUNG NGUYÊN LEGEND</strong><br><strong>Chương trình Thành viên Trung Nguyên Legend Âu Lạc</strong><br><br>Quý khách có thể đăng ký thành viên miễn phí trên ứng dụng Trung Nguyên Legend và sử dụng thẻ thành viên hoặc mã QR trên app khi thanh toán để tích điểm và nhận ưu đãi.<br><br><strong>Cách tích điểm:</strong><br>• Mỗi 30.000đ mua hàng = 1 điểm tích lũy.<br>• Điểm tích lũy có thời hạn sử dụng theo quy định của chương trình.<br>• Điểm có thể quy đổi khi thanh toán với tỷ lệ 1 điểm = 1.000đ (tối thiểu 30 điểm cho mỗi lần đổi).<br><br><strong>Các hạng thành viên:</strong><br><br>🥈 <strong>Hạng Bạc</strong><br>• Mỗi 30.000đ mua hàng được tích 1 điểm.<br>• Đổi điểm thanh toán với tỷ lệ 1 điểm = 1.000đ.<br><br>🥇 <strong>Hạng Vàng</strong><br>• Đạt từ 100 điểm tích lũy.<br>• Quà tặng sinh nhật.<br>• Giảm 10% trên hóa đơn thức ăn và thức uống.<br>• Được đổi điểm mua hàng.<br>• Để duy trì hạng cần tích lũy tối thiểu 70 điểm trong vòng 12 tháng kể từ ngày nâng hạng.<br><br>💎 <strong>Hạng Bạch Kim</strong><br>• Đạt từ 300 điểm tích lũy.<br>• Quà tặng sinh nhật.<br>• Giảm 15% trên hóa đơn thức ăn và thức uống.<br>• Được đổi điểm mua hàng.<br>• Để duy trì hạng cần tích lũy tối thiểu 200 điểm trong vòng 12 tháng kể từ ngày nâng hạng.<br><br>⚠️ <strong>Lưu ý khi thanh toán:</strong> Trước khi thanh toán, anh/chị vui lòng xuất trình mã QR hoặc thẻ thành viên trên ứng dụng Trung Nguyên Legend để nhân viên tích điểm và áp dụng các ưu đãi dành cho hạng thành viên của mình."""

# 1. Update src/components/shared/storefront-client.tsx
if os.path.exists(storefront_client_path):
    print("Updating storefront-client.tsx...")
    with open(storefront_client_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace location hours
    # Target: "Giá»  má»Ÿ cá»­a:</strong> <strong>06:30 AM - 09:30 PM</strong>"
    # Replacing it with: "Giờ mở cửa:</strong> <strong>06:30 - 21:30</strong>"
    content = re.sub(
        r'"reply": "<strong>(.*?)(Vá»‹ trÃ­ & Giá»  hoáº¡t Ä‘á»™ng|Vị trí & Giờ hoạt động)(.*?)06:30 AM - 09:30 PM(.*?)',
        lambda m: m.group(0).replace('06:30 AM - 09:30 PM', '06:30 - 21:30'),
        content
    )

    # Let's replace the membership reply directly by locating the key "membership" and replacing the reply inside it
    # We find: "name": "membership", followed by "reply": `...`
    # Using a regex to find that block
    membership_pattern = r'("name":\s*"membership",\s*"keywords":\s*\[[^\]]+\]\s*,\s*"reply":\s*`)([^`]+)(`)'
    def replace_membership(match):
        return match.group(1) + new_membership_text + match.group(3)
    content, count = re.subn(membership_pattern, replace_membership, content)
    print(f"Replaced membership block: {count} times.")

    # Also replace study_cafe hours "06:30 - 21:30" (already correct, but let's make sure)
    # Replace any old hotlines in storefront-client.tsx
    content = content.replace("0935.20.1993", "0389726999")
    content = content.replace("0905.772.338", "0389726999")

    with open(storefront_client_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Done storefront-client.tsx.")


def update_html(path):
    if not os.path.exists(path):
        return
    print(f"Updating {path}...")
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update font-family to Arial
    # Target: font-family: "Times New Roman", Times, serif;
    content = content.replace('font-family: "Times New Roman", Times, serif;', 'font-family: Arial, Helvetica, sans-serif;')
    
    # 2. Update font sizes to smaller ones (down 2 sizes)
    content = content.replace('font-size:19px;', 'font-size: 16px;')
    content = content.replace('font-size:21px;', 'font-size: 18px;')
    content = content.replace('font-size:25px;', 'font-size: 22px;')
    content = content.replace('font-size:20px;', 'font-size: 16px;')
    content = content.replace('font-size:18px;', 'font-size: 15px;')
    content = content.replace('font-size:12px;', 'font-size: 12px;') # Keep cart count small
    content = content.replace('font-size:17px;', 'font-size: 15px;')
    content = content.replace('font-size:24px;', 'font-size: 21px;')
    content = content.replace('font-size:31px;', 'font-size: 28px;')
    content = content.replace('font-size:27px;', 'font-size: 24px;')
    content = content.replace('font-size: 16px !important;', 'font-size: 16px !important;') # Keep tabs

    # 3. Update hours of operation in HTML static places
    # "06:30 AM - 09:30 PM" or similar
    content = content.replace('06:30 AM - 09:30 PM', '06:30 - 21:30')
    content = content.replace('06:30AM - 09:30PM', '06:30 - 21:30')
    content = content.replace('06:00 - 22:30', '06:30 - 21:30')
    content = content.replace('06:30 - 22:30', '06:30 - 21:30')
    
    # 4. Replace hotline numbers
    content = content.replace('0935.20.1993', '0389726999')
    content = content.replace('0905.772.338', '0389726999')
    content = content.replace('038 972 6999', '038 972 6999')

    # 5. Update renderBlog() layout alignment
    # Find h3 and p in renderBlog and apply min-height
    old_blog_card = """            <div style="flex: 1; display: flex; flex-direction: column;">
              <h3 style="text-align: center;">${safeText(item.title)}</h3>
              <p style="font-style: italic; text-align: center; flex: 1;">"${safeText(item.desc)}"</p>
            </div>"""
            
    new_blog_card = """            <div style="flex: 1; display: flex; flex-direction: column;">
              <h3 style="text-align: center; min-height: 54px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: 18px; line-height: 1.35; text-transform: uppercase !important;">${safeText(item.title)}</h3>
              <p style="font-style: italic; text-align: center; min-height: 72px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex: 1; font-size: 14px;">"${safeText(item.desc)}"</p>
            </div>"""
            
    content = content.replace(old_blog_card, new_blog_card)

    # 6. Update chatbot membership answer in static HTML
    # We look for "membership: `<strong>..."
    static_membership_pattern = r'(membership:\s*`)([^`]+)(`)'
    def replace_static_membership(match):
        # Format the membership text for static JS chatAnswer
        formatted_text = new_membership_text.replace("\n", "\\n").replace("🥈", "🥈").replace("🥇", "🥇").replace("💎", "💎").replace("⚠️", "⚠️")
        return match.group(1) + formatted_text + match.group(3)
    
    content, static_count = re.subn(static_membership_pattern, replace_static_membership, content)
    print(f"Replaced static chatbot membership: {static_count} times.")

    # Update chatbot location reply in static HTML
    # Target: location: `<strong>🚗 Địa điểm & Giờ mở cửa...` or location: `<strong>🚗 Thông tin liên hệ...`
    # We can replace location block content directly
    static_location_pattern = r'(location:\s*`)([^`]+)(`)'
    new_static_location = "<strong>🚗 Thông tin liên hệ & Thời gian mở cửa:</strong><br>\\n• <strong>Địa chỉ:</strong> Khu TĐC Đông Nam Thủy An, Phường An Cựu, Thành phố Huế.<br>\\n• <strong>Giờ mở cửa:</strong> 06:30 - 21:30 hàng ngày.<br>\\n• <strong>Hotline đặt hàng:</strong> 038 972 6999"
    def replace_static_location(match):
        return match.group(1) + new_static_location + match.group(3)
    content, static_loc_count = re.subn(static_location_pattern, replace_static_location, content)
    print(f"Replaced static chatbot location: {static_loc_count} times.")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Done {path}.")

update_html(index_html_path)
update_html(public_index_html_path)
