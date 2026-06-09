export const VPC_KNOWLEDGE = String.raw`
# VPC_KNOWLEDGE - SOURCE OF TRUTH
# Vietnam Prosperity Coffee / Trung Nguyên Legend Âu Lạc
# Updated: 07/06/2026

## 1. Quy tắc ưu tiên dữ liệu

AI phải ưu tiên theo thứ tự:

1. VPC_KNOWLEDGE này cho thông tin cố định: thương hiệu, địa chỉ, hotline, giờ mở cửa, thành viên, thanh toán, nguyên tắc trả lời.
2. Supabase/database cho menu, giá, tồn kho, trạng thái còn bán, vật phẩm, bài viết.
3. orderContext/database cho mã đơn, trạng thái đơn, tổng tiền, thanh toán, phí ship thực tế.
4. adminContext cho báo cáo doanh thu, món bán chạy, khách quay lại, phân tích kinh doanh.
5. Không đọc index.html/admin.html. Chỉ dùng knowledge.ts, Supabase/database, orderContext và adminContext.
6. Internet chỉ là tham khảo ngoài, không được xem là chính sách chính thức của VPC.

Nếu dữ liệu nội bộ không có, trả lời:
"Thông tin này hiện chưa có trong dữ liệu website/quán."

Không được bịa:
- Giá sản phẩm.
- Tồn kho.
- Phí ship.
- Ưu đãi.
- Trạng thái đơn.
- Doanh thu.
- Thông tin khách hàng.
- Chính sách chưa có trong dữ liệu.

## 2. Hồ sơ thương hiệu

Tên hiển thị:
- Vietnam Prosperity Coffee.
- Vietnam Prosperity Coffee - Trung Nguyên Legend Âu Lạc.
- Gọi tắt: VPC.

Slogan:
- Cà phê năng lượng - Cà phê đổi đời.

Vai trò:
- VPC vận hành website, kênh đặt hàng, kênh tra cứu đơn và kết nối khách hàng với cửa hàng Trung Nguyên Legend Âu Lạc tại Huế.
- Website hỗ trợ xem menu, đặt đồ uống, mua vật phẩm/cà phê đóng gói, thanh toán chuyển khoản, tra cứu đơn hàng và trò chuyện với AI.

Thông tin thương hiệu:
- Vietnam Prosperity Coffee Company Limited được thành lập năm 2025.
- Hoạt động trong lĩnh vực dịch vụ phục vụ đồ uống tại Huế.
- Đồng sở hữu/đồng sáng lập bởi Ông Nguyễn Minh Đức và Bà Nguyễn Thị Tuyết Mai.
Vietnam Prosperity Coffee Company Limited, hay còn được biết đến với tên gọi Vietnam Prosperity Coffee, được thành lập vào năm 2025 với định hướng hoạt động trong lĩnh vực dịch vụ phục vụ đồ uống, phát triển không gian cà phê hiện đại và mang đến những trải nghiệm thưởng thức chất lượng dành cho khách hàng tại Thành phố Huế.

Công ty được đồng sở hữu bởi Ông Nguyễn Minh Đức (Tổng giám đốc công ty) và Bà Nguyễn Thị Tuyết Mai (Chủ đầu tư). Xuất phát từ niềm yêu thích dành cho cà phê, sản phẩm Trung Nguyên và những giá trị trải nghiệm mà thương hiệu Trung Nguyên Legend mang lại, hai nhà sáng lập cùng hướng đến việc xây dựng một điểm đến cà phê chuyên nghiệp, tiện lợi và giàu cảm hứng cho khách hàng tại khu vực Âu Lạc nói riêng và Thành phố Huế nói chung.
Với vai trò là đơn vị vận hành cửa hàng và website hỗ trợ khách hàng kết nối với Trung Nguyên Legend Âu Lạc, Vietnam Prosperity Coffee không chỉ tập trung vào việc phục vụ đồ uống chất lượng, mà còn chú trọng xây dựng một không gian phù hợp để khách hàng gặp gỡ, học tập, làm việc, thư giãn và tận hưởng những khoảnh khắc ý nghĩa bên ly cà phê.

Chúng tôi tin rằng cà phê không chỉ là một thức uống quen thuộc trong đời sống hằng ngày, mà còn là nguồn năng lượng, cảm hứng và sự kết nối. Vì vậy, mỗi sản phẩm và dịch vụ tại Trung Nguyên Legend Âu Lạc đều được hướng đến sự chỉn chu, tiện lợi và thân thiện, nhằm mang lại trải nghiệm tốt hơn cho từng khách hàng khi ghé thăm hoặc đặt hàng trực tuyến.
Thông qua website này, Vietnam Prosperity Coffee mong muốn mang đến một kênh hỗ trợ nhanh chóng và thuận tiện, giúp khách hàng dễ dàng xem menu đồ uống, lựa chọn món yêu thích, đặt hàng, theo dõi đơn hàng và tìm hiểu thêm về các sản phẩm cà phê, dụng cụ pha chế, ly tách, bộ quà tặng cùng các vật phẩm thương hiệu của Trung Nguyên Legend đang được cung cấp tại cửa hàng Âu Lạc.

Trong quá trình phát triển, Vietnam Prosperity Coffee luôn hướng đến tinh thần chuyên nghiệp, tận tâm và không ngừng hoàn thiện. Chúng tôi kỳ vọng website này sẽ trở thành cầu nối hiệu quả giữa khách hàng và Trung Nguyên Legend Âu Lạc, đồng thời góp phần lan tỏa giá trị của cà phê năng lượng, không gian truyền cảm hứng và phong cách phục vụ hiện đại đến cộng đồng yêu cà phê tại Huế.
Tinh thần thương hiệu:
- Lan tỏa văn hóa cà phê năng lượng.
- Không gian chỉn chu, hiếu khách, lịch sự, ấm áp.
- Kết nối khách hàng với trải nghiệm Trung Nguyên Legend tại Huế.

## 3. Thông tin cửa hàng

Tên cửa hàng:
- Trung Nguyên Legend Âu Lạc / Vietnam Prosperity Coffee.

Địa chỉ:
- Khu TĐC Đông Nam Thủy An, Phường An Cựu, Thành phố Huế.
- Mốc nhận diện: đối diện Aeon Mall Huế.

Hotline:
- 038 972 6999.
- Viết liền: 0389726999.

Giờ mở cửa:
- 06:30 - 21:30 hằng ngày.

Không gian:
- Yên tĩnh, sang trọng, có điều hòa.
- Có WiFi miễn phí.
- Phù hợp học tập, làm việc, gặp gỡ, đọc sách, thư giãn và thưởng thức cà phê.

Các tiện ích chưa có dữ liệu chắc chắn:
- Ổ cắm.
- Khu hút thuốc.
- Thú cưng.
- Phòng riêng.
- Đặt bàn nhóm.
- Xuất hóa đơn.
- Bãi đậu xe.

Nếu khách hỏi các mục trên, nói dữ liệu website/quán chưa có và gợi ý gọi 0389726999 để xác nhận.

## 4. Phong cách trả lời

AI là trợ lý ảo của VPC.

Cách xưng hô:
- Xưng "VPC".
- Gọi khách là "Quý khách", "anh/chị" hoặc "bạn".
- Dùng "dạ", "ạ", "nhé ạ".

Phong cách:
- Tiếng Việt.
- Ấm áp, lịch sự, rõ ràng, ngắn gọn.
- Có emoji vừa phải.
- Nếu khách hỏi nhiều ý, trả lời từng ý.
- Nếu thiếu dữ liệu, nói rõ thiếu dữ liệu, không bịa.

## 5. FAQ nhanh

Q: Quán mở cửa lúc nào?
A: VPC mở cửa từ 06:30 đến 21:30 hằng ngày.

Q: Quán ở đâu?
A: Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP Huế, đối diện Aeon Mall Huế.

Q: Hotline là gì?
A: 0389726999 hoặc 038 972 6999.

Q: Có WiFi không?
A: Có WiFi miễn phí.

Q: Có điều hòa không?
A: Có điều hòa.

Q: Có phù hợp học tập/làm việc không?
A: Có, không gian yên tĩnh, phù hợp học tập, làm việc, gặp gỡ và đọc sách.

Q: Có giao hàng không?
A: Có hỗ trợ giao hàng theo phạm vi phục vụ. Muốn báo phí giao chính xác cần địa chỉ nhận hàng.

Q: Có thanh toán chuyển khoản không?
A: Có. VietinBank - NGO QUYNH TRANG - 101882692631. Nội dung chuyển khoản ghi mã đơn VPC-DH-...

Q: Có thành viên/tích điểm không?
A: Có, qua ứng dụng Trung Nguyên Legend.

Q: Bao nhiêu tiền được 1 điểm?
A: Mỗi 30.000đ mua hàng = 1 điểm.

Q: 1 điểm đổi được bao nhiêu?
A: 1 điểm = 1.000đ khi quy đổi thanh toán.

Q: Tối thiểu đổi bao nhiêu điểm?
A: Mỗi lần đổi điểm cần tối thiểu 30 điểm.

Q: Tra cứu đơn thế nào?
A: Khách có thể tra cứu bằng mã đơn VPC-DH-... hoặc số điện thoại nếu website đã hỗ trợ.

## 6. Đặt hàng

Quy trình đặt hàng:
1. Chọn đồ uống hoặc vật phẩm.
2. Thêm vào giỏ hàng.
3. Vào giỏ hàng.
4. Nhập họ tên.
5. Nhập số điện thoại.
6. Chọn hình thức nhận hàng.
7. Chọn phương thức thanh toán.
8. Nếu giao hàng, nhập địa chỉ nhận.
9. Nhập ghi chú nếu cần.
10. Gửi đơn.

Hình thức nhận:
- Nhận tại quán.
- Giao hàng trong khu vực phục vụ.

Phương thức thanh toán:
- Tiền mặt/COD hoặc thanh toán khi nhận.
- Chuyển khoản VietQR/VietinBank.

Nếu khách muốn đổi/hủy đơn:
- Không tự xác nhận đã đổi/hủy nếu database chưa cập nhật.
- Hướng dẫn khách gọi hotline 0389726999.

## 7. Tra cứu và trạng thái đơn hàng

Khách có thể tra cứu bằng:
- Mã đơn hàng dạng VPC-DH-...
- Số điện thoại đặt hàng nếu website/backend đã hỗ trợ.

Khi trả lời về đơn hàng:
- Chỉ dùng dữ liệu orderContext/database.
- Nếu không tìm thấy, đề nghị kiểm tra lại mã đơn/số điện thoại hoặc gọi hotline.
- Không tiết lộ thông tin khách khác.
- Che bớt số điện thoại nếu cần, ví dụ 038***6999.
- Không đọc toàn bộ địa chỉ/email nếu không cần.

Dịch trạng thái:
- moi / don_moi / da_dat_don: Mới / Đã đặt đơn.
- cho_tt / cho_chuyen_khoan / cho_xac_nhan_chuyen_khoan / khach_bao_da_chuyen_khoan: Chờ thanh toán / đang kiểm tra giao dịch.
- da_tt / da_thanh_toan / da_chuyen_khoan: Đã thanh toán thành công.
- dang_lam / da_nhan_don / dang_lam_don: Đang làm / đang chuẩn bị.
- dang_giao / da_giao_shipper: Đang giao.
- hoan_tat / hoan_thanh / da_giao: Hoàn tất.
- tu_choi / tu_choi_don: Từ chối.
- da_huy: Đã hủy.

Timeline thân thiện:
1. Tiếp nhận.
2. Pha chế/chuẩn bị.
3. Đang giao nếu có giao hàng.
4. Hoàn thành.

## 8. Thanh toán và SePay

Thông tin chuyển khoản:
- Ngân hàng: VietinBank.
- Chủ tài khoản: NGO QUYNH TRANG.
- Số tài khoản: 101882692631.
- Nội dung chuyển khoản: ghi đúng mã đơn VPC-DH-...
- Số tiền: chuyển đúng tổng thanh toán.

Quy trình:
1. Khách đặt đơn.
2. Website hiển thị mã đơn và thông tin VietQR/chuyển khoản.
3. Khách chuyển đúng số tiền.
4. Nội dung chuyển khoản có mã đơn VPC-DH-...
5. SePay/webhook kiểm tra giao dịch.
6. Khi nhận đủ tiền và đúng mã đơn, đơn cập nhật đã thanh toán.

Nếu khách báo đã chuyển:
- Hướng dẫn đợi 1-2 phút.
- Nhắc bấm kiểm tra lại nếu website có nút kiểm tra.
- Kiểm tra đúng số tiền và đúng nội dung chuyển khoản.
- Nếu chuyển thiếu, chuyển thừa, sai nội dung hoặc sai tài khoản: gọi hotline 0389726999.
- Không tự xác nhận đã thanh toán nếu database chưa có trạng thái đã thanh toán.

## 9. Giao hàng

Nguồn phí ship chính xác:
- Ưu tiên backend/orderContext/database nếu có phi_ship, khoang_cach_km hoặc tổng thanh toán đã tính ship.
- Nếu dữ liệu live chưa có phí ship, không tự tính bừa.

Khi khách hỏi phí giao:
- Cần địa chỉ giao hàng.
- Trả lời an toàn: "VPC sẽ kiểm tra phạm vi giao và xác nhận phí ship cụ thể sau khi có địa chỉ."

Không được:
- Không khẳng định free ship nếu backend/chính sách chưa xác nhận.
- Không bịa phí ship.
- Không bịa thời gian giao hàng.

## 10. Chương trình thành viên Trung Nguyên Legend

Đăng ký:
- Khách có thể đăng ký thành viên miễn phí trên ứng dụng Trung Nguyên Legend.
- Khi thanh toán, khách cần xuất trình thẻ thành viên hoặc mã QR trên app để nhân viên tích điểm và áp dụng ưu đãi.

Tích điểm:
- Mỗi 30.000đ mua hàng = 1 điểm tích lũy.
- Điểm có thời hạn sử dụng theo quy định chương trình.
- 1 điểm = 1.000đ khi quy đổi thanh toán.
- Mỗi lần đổi điểm cần tối thiểu 30 điểm.

Hạng Bạc:
- Mỗi 30.000đ mua hàng được tích 1 điểm.
- Đổi điểm thanh toán với tỷ lệ 1 điểm = 1.000đ.

Hạng Vàng:
- Đạt từ 100 điểm tích lũy.
- Có quà tặng sinh nhật.
- Giảm 10% trên hóa đơn thức ăn và thức uống.
- Được đổi điểm mua hàng.
- Duy trì hạng: cần tích lũy tối thiểu 70 điểm trong vòng 12 tháng kể từ ngày nâng hạng.

Hạng Bạch Kim:
- Đạt từ 300 điểm tích lũy.
- Có quà tặng sinh nhật.
- Giảm 15% trên hóa đơn thức ăn và thức uống.
- Được đổi điểm mua hàng.
- Duy trì hạng: cần tích lũy tối thiểu 200 điểm trong vòng 12 tháng kể từ ngày nâng hạng.

Lưu ý:
- Khách cần xuất trình QR/thẻ thành viên trước khi thanh toán.
- Không dùng thông tin cũ như "10.000đ = 1 điểm" hoặc "hóa đơn từ 70.000đ".
- Nếu hỏi lỗi app, mất điểm, gộp điểm, khiếu nại điểm, đổi quà: cần kiểm tra theo quy định hiện hành của Trung Nguyên Legend hoặc liên hệ nhân viên/hotline.

## 11. Khuyến mãi và sự kiện

Theo index cũ:
- Chương trình từ 19/05/2026 đến hết 30/06/2026.
- Happy Lunch: giảm 15% tổng hóa đơn đồ uống, 12:00 - 14:00 hằng ngày.
- Happy Hours / Mua 1 Tặng 1: khoảng 14:00 - 22:00, một bài blog ghi 14:00 - 21:30.
- Sản phẩm áp dụng theo index: Trà Vải Hoa Hồng, Trà Đào Cam Sả, Trà Lá Nếp Sen Vàng, Trà Xanh Thạch Cà Phê, Cà phê Năng Lượng Tư Duy.

Quy tắc:
- Chỉ nói chương trình còn hiệu lực nếu ngày hiện tại còn nằm trong thời gian áp dụng hoặc dữ liệu mới xác nhận.
- Sau 30/06/2026, không nói chương trình còn hiệu lực nếu chưa có dữ liệu mới.
- Nếu khách hỏi điều kiện chi tiết/cộng dồn ưu đãi/sản phẩm cụ thể: gợi ý xác nhận tại quầy/hotline nếu dữ liệu chưa đủ.

Bài viết/sự kiện trong index:
- Giải nhiệt mùa hè.
- Nghệ sĩ Nhật Cường ghé thăm.
- Mua 1 được 2 - Chill hè cực đã.
- Trưa hè nóng bức.
- Sự kiện VinFast ngày 16/05/2026.
- Mega Livestream.
- Đại lễ 30/4 - 01/05.
- Địa chỉ quán tại Huế.
- Khai trương/điểm hẹn mới tại Huế.

## 12. Menu và tư vấn đồ uống

Nguồn menu chuẩn:
- Ưu tiên Supabase.
- Không tự bịa giá.
- Không gợi ý món hết hàng nếu dữ liệu cho biết hết hàng.

Danh mục đồ uống:
- Cà phê phin: đậm, truyền thống, năng lượng.
- Cà phê máy: espresso, latte, cappuccino, hiện đại.
- Cà phê pha chế: sáng tạo, dễ uống.
- Trà / trà sữa: thanh, thơm, nhẹ hơn cà phê.
- Sinh tố / đá xay: mát, ngọt, béo, giải nhiệt.
- Nước ép: trái cây, thanh mát.
- Nước thanh nhiệt: nhẹ, mát.
- Matcha / cacao: phù hợp khách không uống cà phê, thích vị béo/ngọt dịu.
- Bánh ngọt: dùng kèm cà phê/trà.
- Extra/topping: dùng nếu menu có.

Tư vấn theo khẩu vị:
- Thích đậm/tỉnh táo: cà phê phin, cà phê năng lượng.
- Thích nhẹ/dễ uống: trà, trà sữa, latte, bạc xỉu, matcha/cacao.
- Thích ngọt béo: bạc xỉu, cacao, matcha, đá xay.
- Muốn giải nhiệt: nước ép, sinh tố, trà, nước thanh nhiệt.
- Không uống cà phê: trà, matcha, cacao, nước ép, sinh tố.
- Mua kèm bánh: gợi ý bánh ngọt nếu menu có.

Một số biến thể index từng xử lý:
- Sinh tố Xoài, Sinh tố Bơ, Sinh tố Chanh Dây, Sinh tố Dâu.
- Nước Ép Chanh Dây, Cam vắt.
- Nước thơm ép, Nước ép Dưa hấu.

## 13. Vật phẩm / cà phê đóng gói

Nguồn giá/tồn kho:
- Ưu tiên Supabase bảng vật phẩm/merchandise.
- Không tự bịa giá.
- Nếu không có sản phẩm trong dữ liệu, nói chưa có trong dữ liệu website/quán.

Nhóm vật phẩm có thể gồm:
- Cà phê Drip.
- Cà phê Sáng tạo.
- G7 hòa tan.
- Legend Special Edition.
- Phin nhôm.
- Phin inox.
- Ly sứ.
- Bộ tách đĩa.
- Bình giữ nhiệt.
- Túi canvas.
- Vật phẩm thương hiệu khác nếu Supabase có.

Tư vấn:
- Mua làm quà: cà phê đóng gói, bộ ly/tách, phin, túi quà nếu có.
- Khách mới uống cà phê: G7 hoặc drip dễ pha nếu có.
- Thích pha truyền thống: phin và cà phê Sáng tạo nếu có.
- Tiện lợi văn phòng/du lịch: drip, G7, bình giữ nhiệt nếu có.

## 14. Tìm kiếm sản phẩm

Nếu khách hỏi:
- Có bán [tên sản phẩm] không?
- Tìm giúp tôi [tên món].
- Có món [từ khóa] không?
- Sản phẩm [tên] giá bao nhiêu?

AI phải:
1. Ưu tiên tìm trong Supabase.
2. Nếu có frontend productsContext thì dùng thêm.
3. Nếu có nhiều kết quả, liệt kê tối đa 10 sản phẩm phù hợp.
4. Nêu tên, giá nếu có dữ liệu, mô tả ngắn nếu có.
5. Nếu không tìm thấy, nói chưa tìm thấy sản phẩm phù hợp trong dữ liệu website/quán.
6. Không tự bịa giá hoặc trạng thái còn hàng.

## 15. Tri thức cà phê / Trung Nguyên Legend

AI có thể trả lời ở mức tham khảo:
- Cà phê năng lượng.
- Cà phê đổi đời.
- Văn hóa thưởng lãm cà phê.
- Ba nền văn minh cà phê: Ottoman, Roman, Thiền.
- Không gian Trung Nguyên Legend hướng đến trải nghiệm cà phê, tư duy, sáng tạo và kết nối.

Quy tắc:
- Không biến kiến thức chung thành chính sách cửa hàng.
- Nếu hỏi học thuật/lịch sử chi tiết mà dữ liệu nội bộ không có, nói đây là thông tin tham khảo.

## 16. Bảo mật dữ liệu khách hàng

AI có thể thấy:
- Đơn hàng.
- Khách hàng.
- Giao dịch SePay.
- AdminContext/báo cáo bán hàng.

Quy tắc:
- Không tiết lộ danh sách khách hàng.
- Không đọc toàn bộ số điện thoại, địa chỉ, email nếu không cần.
- Chỉ tra cứu đơn khi khách cung cấp mã đơn hoặc số điện thoại.
- Khi trả thông tin đơn, che bớt dữ liệu nhạy cảm.
- Không trả thông tin giao dịch ngân hàng chi tiết cho người hỏi chung.
- AdminContext chỉ dùng cho admin/chủ quán hoặc trang admin.

## 17. Admin analytics

Khi admin/chủ quán hỏi:
- Doanh thu.
- Món bán chạy.
- Món bán chậm.
- Khách quay lại.
- Địa chỉ giao nhiều.
- Trạng thái đơn.
- Thanh toán.
- Dự đoán doanh thu.
- Gợi ý khuyến mãi.
- Tóm tắt kinh doanh.

AI bắt buộc dùng adminContext nếu được gửi lên.

Quy tắc:
- Doanh thu thực nhận nên ưu tiên đơn đã thanh toán/đang làm/đang giao/hoàn tất, tùy cách adminContext tính.
- Không tính đơn hủy/từ chối/chờ thanh toán vào doanh thu thực nhận nếu dữ liệu chưa xác nhận.
- Khách quay lại thường dựa trên số điện thoại có nhiều hơn một đơn.
- Món bán chạy dựa trên tổng số lượng bán.
- Món bán chậm dựa trên số lượng bán thấp hoặc không phát sinh đơn.
- Dự báo doanh thu chỉ tham khảo.
- Nếu dữ liệu ít/thiếu, nói rõ chưa đủ dữ liệu.

## 18. Mẫu trả lời nhanh

Địa chỉ:
"Dạ, VPC ở Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP Huế, đối diện Aeon Mall Huế ạ. Quý khách có thể gọi hotline 038 972 6999 để được hỗ trợ đường đi nhé ạ."

Giờ mở cửa:
"Dạ, VPC mở cửa từ 06:30 đến 21:30 hằng ngày ạ."

Thanh toán:
"Dạ, Quý khách chuyển khoản VietinBank - chủ tài khoản NGO QUYNH TRANG - số tài khoản 101882692631. Nội dung chuyển khoản vui lòng ghi đúng mã đơn VPC-DH-... để hệ thống SePay tự ghi nhận nhé ạ."

Thành viên:
"Dạ, Quý khách có thể đăng ký thành viên miễn phí trên app Trung Nguyên Legend. Khi thanh toán, Quý khách xuất trình mã QR hoặc thẻ thành viên trên app để được tích điểm và áp dụng ưu đãi. Mỗi 30.000đ mua hàng được 1 điểm, 1 điểm đổi tương ứng 1.000đ, mỗi lần đổi cần tối thiểu 30 điểm ạ."

Giao hàng:
"Dạ, để báo phí giao chính xác, VPC cần địa chỉ nhận hàng của Quý khách ạ. Sau khi có địa chỉ, cửa hàng sẽ kiểm tra phạm vi giao và xác nhận phí ship cụ thể nhé ạ."

Tư vấn món:
"Dạ, nếu Quý khách thích vị đậm và tỉnh táo, VPC gợi ý nhóm cà phê phin hoặc cà phê năng lượng. Nếu thích vị nhẹ, dễ uống và mát hơn, Quý khách có thể chọn trà, nước ép, sinh tố hoặc matcha/cacao ạ. VPC sẽ dựa trên menu hiện có để gợi ý món cụ thể nhé ạ."
`;
=== BẢNG danh_muc_san_pham ===
ID: 1
Tên danh mục: Cà phê phin
Slug: ca-phe-phin
Loại: do_uong
Thứ tự hiển thị: 1
Mô tả: Những dòng cà phê phin đặc trưng của Trung Nguyên Legend.
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 2
Tên danh mục: Cà phê máy
Slug: ca-phe-may
Loại: do_uong
Thứ tự hiển thị: 2
Mô tả: Các món cà phê được chiết xuất bằng máy.
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 3
Tên danh mục: Cà phê pha chế
Slug: ca-phe-pha-che
Loại: do_uong
Thứ tự hiển thị: 3
Mô tả: "Các món cà phê sáng tạo, dễ uống và nổi bật."
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 4
Tên danh mục: Trà và Trà sữa
Slug: tra-tra-sua
Loại: do_uong
Thứ tự hiển thị: 4
Mô tả: "Các món trà, trà sữa thanh nhẹ và dễ uống."
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 5
Tên danh mục: Sinh tố và Đá xay
Slug: sinh-to-da-xay
Loại: do_uong
Thứ tự hiển thị: 5
Mô tả: Các món sinh tố và đá xay mát lạnh.
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 6
Tên danh mục: Nước ép
Slug: nuoc-ep
Loại: do_uong
Thứ tự hiển thị: 6
Mô tả: Các món nước ép trái cây.
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 7
Tên danh mục: Nước thanh nhiệt
Slug: nuoc-thanh-nhiet
Loại: do_uong
Thứ tự hiển thị: 7
Mô tả: "Các món thanh nhiệt, giải khát."
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 8
Tên danh mục: Matcha và Cacao
Slug: matcha-cacao
Loại: do_uong
Thứ tự hiển thị: 8
Mô tả: "Các món matcha, cacao và sữa tươi."
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 9
Tên danh mục: Bánh
Slug: banh
Loại: do_uong
Thứ tự hiển thị: 9
Mô tả: Các món bánh dùng kèm đồ uống.
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 38
Tên danh mục: Merchandise
Slug: merchandise
Loại: merchandise
Thứ tự hiển thị: 9
Mô tả: 
Hiển thị: true
Ngày tạo: 2026-05-29 03:31:11.310065+00
---
ID: 10
Tên danh mục: Món Extra
Slug: mon-extra
Loại: extra
Thứ tự hiển thị: 10
Mô tả: Các món thêm để tùy chỉnh đồ uống.
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 11
Tên danh mục: Cà phê bột phin
Slug: ca-phe-bot-phin
Loại: merchandise
Thứ tự hiển thị: 11
Mô tả: Sản phẩm cà phê bột phin Trung Nguyên Legend.
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 13
Tên danh mục: Cà phê hòa tan
Slug: ca-phe-hoa-tan
Loại: merchandise
Thứ tự hiển thị: 13
Mô tả: Sản phẩm cà phê hòa tan G7 và Legend.
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 14
Tên danh mục: Cà phê phin giấy
Slug: ca-phe-phin-giay
Loại: merchandise
Thứ tự hiển thị: 14
Mô tả: Sản phẩm cà phê phin giấy.
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 39
Tên danh mục: Dụng cụ pha cà phê
Slug: dung-cu-pha-ca-phe
Loại: merchandise
Thứ tự hiển thị: 15
Mô tả: 
Hiển thị: true
Ngày tạo: 2026-05-29 03:31:11.441479+00
---
ID: 16
Tên danh mục: "Ly
Slug:  tách và bình"
Loại: ly-tach-va-binh
Thứ tự hiển thị: 16
Mô tả: merchandise "Ly sứ, tách, bình và vật phẩm liên quan."
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 40
Tên danh mục: Bộ quà tặng
Slug: bo-qua-tang
Loại: merchandise
Thứ tự hiển thị: 17
Mô tả: 
Hiển thị: true
Ngày tạo: 2026-05-29 03:31:11.582496+00
---
ID: 41
Tên danh mục: Phụ kiện thương hiệu
Slug: phu-kien-thuong-hieu
Loại: merchandise
Thứ tự hiển thị: 18
Mô tả: 
Hiển thị: true
Ngày tạo: 2026-05-29 03:31:11.724613+00
---
ID: 19
Tên danh mục: Vật phẩm thương hiệu
Slug: vat-pham-thuong-hieu
Loại: merchandise
Thứ tự hiển thị: 80
Mô tả: Ly, bình giữ nhiệt, sổ tay, khăn và các vật phẩm thương hiệu Trung Nguyên Legend.
Hiển thị: true
Ngày tạo: 2026-05-25 09:12:27.465707+00
---
ID: 20
Tên danh mục: Cà phê Drip
Slug: ca-phe-drip
Loại: merchandise
Thứ tự hiển thị: 101
Mô tả: Cà phê phin giấy drip tiện lợi.
Hiển thị: true
Ngày tạo: 2026-05-25 09:47:28.449793+00
---
ID: 21
Tên danh mục: Cà phê phin
Slug: ca-phe-bot-sang-tao
Loại: merchandise
Thứ tự hiển thị: 102
Mô tả: Các dòng cà phê bột Sáng Tạo và Chế Phin.
Hiển thị: true
Ngày tạo: 2026-05-25 09:47:28.449793+00
---
ID: 23
Tên danh mục: Cà phê Legend
Slug: ca-phe-legend
Loại: merchandise
Thứ tự hiển thị: 104
Mô tả: Các dòng cà phê Legend đóng gói.
Hiển thị: true
Ngày tạo: 2026-05-25 09:47:28.449793+00
---
ID: 12
Tên danh mục: Cà phê hạt
Slug: ca-phe-hat
Loại: merchandise
Thứ tự hiển thị: 105
Mô tả: Các dòng cà phê hạt rang mộc Trung Nguyên Legend.
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 25
Tên danh mục: Dụng cụ pha chế
Slug: dung-cu-pha-che
Loại: merchandise
Thứ tự hiển thị: 106
Mô tả: Phin, dụng cụ pha cà phê và phụ kiện pha chế.
Hiển thị: true
Ngày tạo: 2026-05-25 09:47:28.449793+00
---
ID: 26
Tên danh mục: Ly, Tách, Bình giữ nhiệt
Slug: ly-tach-binh-giu-nhiet
Loại: merchandise
Thứ tự hiển thị: 107
Mô tả: Ly sứ, tách sứ, bình giữ nhiệt và ly giữ nhiệt Trung Nguyên Legend.
Hiển thị: true
Ngày tạo: 2026-05-25 09:47:28.449793+00
---
ID: 17
Tên danh mục:  Vật phẩm
Slug: vat-pham
Loại: merchandise
Thứ tự hiển thị: 109
Mô tả: Các hộp quà và gift set Trung Nguyên Legend.
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:58.75+00
---
ID: 29
Tên danh mục: Khác
Slug: khac
Loại: merchandise
Thứ tự hiển thị: 199
Mô tả: Các vật phẩm khác.
Hiển thị: true
Ngày tạo: 2026-05-25 09:47:28.449793+00
---

=== BẢNG san_pham_do_uong ===
ID: 1
Danh mục ID: 1
Tên sản phẩm: Coffee Legend
Slug: coffee-legend
Mô tả: Dòng cà phê phin đặc trưng, đậm đà và giàu năng lượng.
Giá đen: 165000.00
Giá sữa: 0.00
Là món nổi bật: true
Thứ tự hiển thị: 1
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 2
Danh mục ID: 1
Tên sản phẩm: Năng Lượng Tư Duy
Slug: nang-luong-tu-duy
Mô tả: Cà phê phin năng lượng tư duy.
Giá đen: 36000.00
Giá sữa: 41000.00
Là món nổi bật: false
Thứ tự hiển thị: 2
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 3
Danh mục ID: 1
Tên sản phẩm: Năng Lượng Khám Phá
Slug: nang-luong-kham-pha
Mô tả: Cà phê phin năng lượng khám phá.
Giá đen: 42000.00
Giá sữa: 47000.00
Là món nổi bật: false
Thứ tự hiển thị: 3
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 4
Danh mục ID: 1
Tên sản phẩm: Năng Lượng Ý Tưởng
Slug: nang-luong-y-tuong
Mô tả: Cà phê phin năng lượng ý tưởng.
Giá đen: 46000.00
Giá sữa: 51000.00
Là món nổi bật: false
Thứ tự hiển thị: 4
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 5
Danh mục ID: 1
Tên sản phẩm: Năng Lượng Sáng Tạo
Slug: nang-luong-sang-tao
Mô tả: Cà phê phin năng lượng sáng tạo.
Giá đen: 50000.00
Giá sữa: 55000.00
Là món nổi bật: false
Thứ tự hiển thị: 5
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 6
Danh mục ID: 1
Tên sản phẩm: Năng Lượng Thành Công
Slug: nang-luong-thanh-cong
Mô tả: Cà phê phin năng lượng thành công.
Giá đen: 55000.00
Giá sữa: 60000.00
Là món nổi bật: false
Thứ tự hiển thị: 6
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 7
Danh mục ID: 1
Tên sản phẩm: Năng Lượng Đột Phá
Slug: nang-luong-dot-pha
Mô tả: Cà phê phin năng lượng đột phá.
Giá đen: 74000.00
Giá sữa: 79000.00
Là món nổi bật: false
Thứ tự hiển thị: 7
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 79
Danh mục ID: 1
Tên sản phẩm: item test
Slug: item-test
Mô tả: Đây là sản phẩm nước uống thử nghiệm đặc biệt của VPC với giá siêu ưu đãi phục vụ cho việc kiểm thử hệ thống.
Giá đen: 1000.00
Giá sữa: 0.00
Là món nổi bật: true
Thứ tự hiển thị: 99
Hiển thị: true
Ngày tạo: 2026-05-28 07:57:11.060162+00
---
ID: 8
Danh mục ID: 2
Tên sản phẩm: Success Sữa Đá
Slug: success-sua-da
Mô tả: Cà phê máy pha cùng sữa đá, đậm vị và dễ uống.
Giá đen: 50000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 1
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 9
Danh mục ID: 2
Tên sản phẩm: Success Đá Viên
Slug: success-da-vien
Mô tả: Cà phê máy đậm vị dùng với đá viên.
Giá đen: 45000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 2
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 10
Danh mục ID: 2
Tên sản phẩm: Espresso
Slug: espresso
Mô tả: Cà phê espresso đậm đặc, hiện đại.
Giá đen: 42000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 3
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 11
Danh mục ID: 2
Tên sản phẩm: Americano
Slug: americano
Mô tả: Cà phê Americano nhẹ hơn espresso, dễ thưởng thức.
Giá đen: 42000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 4
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 12
Danh mục ID: 2
Tên sản phẩm: Double Espresso
Slug: double-espresso
Mô tả: Hai shot espresso mạnh mẽ và đậm đà.
Giá đen: 48000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 5
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 13
Danh mục ID: 2
Tên sản phẩm: Latte
Slug: latte
Mô tả: Cà phê latte béo nhẹ, dễ uống.
Giá đen: 73000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 6
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 14
Danh mục ID: 2
Tên sản phẩm: Cappuccino
Slug: cappuccino
Mô tả: Cà phê cappuccino thơm béo với lớp bọt sữa mịn.
Giá đen: 68000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 7
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 15
Danh mục ID: 2
Tên sản phẩm: Latte Yến Mạch
Slug: latte-yen-mach
Mô tả: Latte kết hợp sữa yến mạch thanh béo.
Giá đen: 79000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 8
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 16
Danh mục ID: 2
Tên sản phẩm: Cappuccino Yến Mạch
Slug: cappuccino-yen-mach
Mô tả: Cappuccino kết hợp sữa yến mạch.
Giá đen: 73000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 9
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 17
Danh mục ID: 3
Tên sản phẩm: Cà phê dừa
Slug: ca-phe-dua
Mô tả: Cà phê kết hợp vị dừa béo nhẹ, thơm mát và dễ uống.
Giá đen: 79000.00
Giá sữa: 0.00
Là món nổi bật: true
Thứ tự hiển thị: 1
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 18
Danh mục ID: 3
Tên sản phẩm: Cà phê hạnh nhân
Slug: ca-phe-hanh-nhan
Mô tả: Cà phê thơm vị hạnh nhân, phù hợp cho khách thích hương vị mới lạ.
Giá đen: 68000.00
Giá sữa: 0.00
Là món nổi bật: true
Thứ tự hiển thị: 2
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 19
Danh mục ID: 3
Tên sản phẩm: Cà phê muối Legend
Slug: ca-phe-muoi-legend
Mô tả: Vị cà phê đậm hòa cùng lớp kem muối béo mặn nhẹ.
Giá đen: 63000.00
Giá sữa: 0.00
Là món nổi bật: true
Thứ tự hiển thị: 3
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 20
Danh mục ID: 3
Tên sản phẩm: Bạc xỉu
Slug: bac-xiu
Mô tả: Cà phê sữa béo nhẹ, dễ uống.
Giá đen: 48000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 4
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 21
Danh mục ID: 3
Tên sản phẩm: Cà phê trứng
Slug: ca-phe-trung
Mô tả: Cà phê đậm vị kết hợp lớp kem trứng béo mịn.
Giá đen: 79000.00
Giá sữa: 0.00
Là món nổi bật: true
Thứ tự hiển thị: 5
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 22
Danh mục ID: 3
Tên sản phẩm: Cà phê Mother Land
Slug: ca-phe-mother-land
Mô tả: Cà phê pha chế mang hương vị đặc trưng.
Giá đen: 68000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 6
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 23
Danh mục ID: 3
Tên sản phẩm: Cold Brew Phương Đông
Slug: cold-brew-phuong-dong
Mô tả: Cold Brew hương vị Phương Đông thanh mát.
Giá đen: 63000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 7
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 24
Danh mục ID: 3
Tên sản phẩm: Cà phê Cold Brew
Slug: ca-phe-cold-brew
Mô tả: Cà phê ủ lạnh thanh nhẹ, phù hợp để giải nhiệt.
Giá đen: 48000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 8
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 25
Danh mục ID: 4
Tên sản phẩm: Trà hoa cúc Chamomile
Slug: tra-hoa-cuc-chamomile
Mô tả: Trà hoa cúc nhẹ nhàng, thư giãn.
Giá đen: 79000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 1
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 26
Danh mục ID: 4
Tên sản phẩm: Trà vải hoa hồng
Slug: tra-vai-hoa-hong
Mô tả: Trà vải thơm nhẹ kết hợp hương hoa hồng.
Giá đen: 68000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 2
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 27
Danh mục ID: 4
Tên sản phẩm: Trà đào cam sả
Slug: tra-dao-cam-sa
Mô tả: Trà đào cam sả thanh mát.
Giá đen: 68000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 3
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 28
Danh mục ID: 4
Tên sản phẩm: Trà lá nếp sen vàng
Slug: tra-la-nep-sen-vang
Mô tả: Trà thanh nhẹ, hương sen và lá nếp dịu, phù hợp để giải nhiệt.
Giá đen: 68000.00
Giá sữa: 0.00
Là món nổi bật: true
Thứ tự hiển thị: 4
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 30
Danh mục ID: 4
Tên sản phẩm: Trà sữa Legend
Slug: tra-sua-legend
Mô tả: Trà sữa mang hương vị Legend.
Giá đen: 58000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 6
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 31
Danh mục ID: 4
Tên sản phẩm: Trà cam quế đá
Slug: tra-cam-que-da
Mô tả: Trà cam quế dùng lạnh, thơm dịu.
Giá đen: 68000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 7
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 33
Danh mục ID: 5
Tên sản phẩm: Kim quất đá xay
Slug: kim-quat-da-xay
Mô tả: Kim quất đá xay chua nhẹ, mát lạnh.
Giá đen: 58000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 2
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 57
Danh mục ID: 5
Tên sản phẩm: Sinh tố Xoài
Slug: sinh-to-xoai
Mô tả: Sinh tố xoài tươi mát béo ngậy.
Giá đen: 63000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 51
Hiển thị: true
Ngày tạo: 2026-05-24 10:22:15.176753+00
---
ID: 58
Danh mục ID: 5
Tên sản phẩm: Sinh tố Bơ
Slug: sinh-to-bo
Mô tả: Sinh tố bơ thơm béo mịn màng.
Giá đen: 63000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 52
Hiển thị: true
Ngày tạo: 2026-05-24 10:22:15.450292+00
---
ID: 59
Danh mục ID: 5
Tên sản phẩm: Sinh tố Chanh Dây
Slug: sinh-to-chanh-day
Mô tả: Sinh tố chanh dây chua ngọt tươi mát.
Giá đen: 63000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 53
Hiển thị: true
Ngày tạo: 2026-05-24 10:22:15.717436+00
---
ID: 60
Danh mục ID: 5
Tên sản phẩm: Sinh tố Dâu
Slug: sinh-to-dau
Mô tả: Sinh tố dâu tây tươi ngon ngọt ngào.
Giá đen: 63000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 54
Hiển thị: true
Ngày tạo: 2026-05-24 10:22:15.980234+00
---
ID: 37
Danh mục ID: 6
Tên sản phẩm: Dừa tươi
Slug: dua-tuoi
Mô tả: Dừa tươi thanh mát tự nhiên.
Giá đen: 45000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 3
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 61
Danh mục ID: 6
Tên sản phẩm: Nước Ép Chanh Dây
Slug: nuoc-ep-chanh-day
Mô tả: Nước ép chanh dây chua ngọt thanh mát.
Giá đen: 58000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 61
Hiển thị: true
Ngày tạo: 2026-05-24 10:22:16.245587+00
---
ID: 62
Danh mục ID: 6
Tên sản phẩm: Cam vắt
Slug: cam-vat
Mô tả: Nước cam vắt nguyên chất giàu Vitamin C.
Giá đen: 58000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 62
Hiển thị: true
Ngày tạo: 2026-05-24 10:22:16.507329+00
---
ID: 63
Danh mục ID: 6
Tên sản phẩm: Nước thơm ép
Slug: nuoc-thom-ep
Mô tả: Nước thơm ép (dứa) ngọt thanh mát lạnh.
Giá đen: 58000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 63
Hiển thị: true
Ngày tạo: 2026-05-24 10:22:16.767917+00
---
ID: 64
Danh mục ID: 6
Tên sản phẩm: Dưa hấu
Slug: dua-hau
Mô tả: Nước ép dưa hấu tươi ngon giải nhiệt cực tốt.
Giá đen: 58000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 64
Hiển thị: true
Ngày tạo: 2026-05-24 10:22:17.031639+00
---
ID: 38
Danh mục ID: 7
Tên sản phẩm: Nước chanh dây thơm sả
Slug: nuoc-chanh-day-thom-sa
Mô tả: Nước chanh dây thơm sả giải nhiệt.
Giá đen: 58000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 1
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 39
Danh mục ID: 7
Tên sản phẩm: Hibiscus chanh dây hạt chia
Slug: hibiscus-chanh-day-hat-chia
Mô tả: Vị chua thanh của hibiscus và chanh dây kết hợp hạt chia tươi mát.
Giá đen: 58000.00
Giá sữa: 0.00
Là món nổi bật: true
Thứ tự hiển thị: 2
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 40
Danh mục ID: 7
Tên sản phẩm: Chanh sả gừng hạt chia
Slug: chanh-sa-gung-hat-chia
Mô tả: Thức uống thanh nhiệt với chanh, sả, gừng và hạt chia.
Giá đen: 58000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 3
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 41
Danh mục ID: 7
Tên sản phẩm: Nước chanh muối mật ong
Slug: nuoc-chanh-muoi-mat-ong
Mô tả: Nước chanh muối mật ong thanh nhẹ.
Giá đen: 45000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 4
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 42
Danh mục ID: 7
Tên sản phẩm: Nước suối
Slug: nuoc-suoi
Mô tả: Nước suối đóng chai.
Giá đen: 19000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 5
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 43
Danh mục ID: 8
Tên sản phẩm: Matcha Yến Mạch
Slug: matcha-yen-mach
Mô tả: Matcha thơm nhẹ kết hợp sữa yến mạch, phù hợp cho khách thích vị thanh béo.
Giá đen: 68000.00
Giá sữa: 0.00
Là món nổi bật: true
Thứ tự hiển thị: 1
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 34
Danh mục ID: 8
Tên sản phẩm: Trà xanh đá xay
Slug: tra-xanh-da-xay
Mô tả: Trà xanh đá xay mát lạnh, thơm nhẹ và béo thanh.
Giá đen: 58000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 3
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 45
Danh mục ID: 8
Tên sản phẩm: Cacao sữa
Slug: cacao-sua
Mô tả: Cacao sữa thơm béo.
Giá đen: 53000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 3
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 46
Danh mục ID: 8
Tên sản phẩm: Sữa tươi
Slug: sua-tuoi
Mô tả: Sữa tươi thanh nhẹ.
Giá đen: 38000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 4
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 29
Danh mục ID: 8
Tên sản phẩm: Trà xanh thạch cà phê
Slug: tra-xanh-thach-ca-phe
Mô tả: Trà xanh thơm nhẹ kết hợp thạch cà phê, vị thanh béo dễ uống.
Giá đen: 63000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 5
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 47
Danh mục ID: 9
Tên sản phẩm: Panna Cotta
Slug: panna-cotta
Mô tả: Bánh Panna Cotta mềm mịn.
Giá đen: 25000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 1
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 65
Danh mục ID: 9
Tên sản phẩm: Bánh Mousse Chanh Dây
Slug: banh-mousse-chanh-day
Mô tả: Bánh mousse chanh dây chua ngọt thanh mát, mềm mịn quyến rũ.
Giá đen: 39000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 901
Hiển thị: true
Ngày tạo: 2026-05-25 09:15:23.092575+00
---
ID: 66
Danh mục ID: 9
Tên sản phẩm: Bánh Mousse Red Velvet
Slug: banh-mousse-red-velvet
Mô tả: Bánh mousse Red Velvet sang trọng, mềm mại béo ngậy.
Giá đen: 39000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 902
Hiển thị: true
Ngày tạo: 2026-05-25 09:15:23.231321+00
---
ID: 67
Danh mục ID: 9
Tên sản phẩm: Bánh Mousse Dâu
Slug: banh-mousse-dau
Mô tả: Bánh mousse hương dâu tây tươi ngọt ngào thơm mịn.
Giá đen: 39000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 903
Hiển thị: true
Ngày tạo: 2026-05-25 09:15:23.363416+00
---
ID: 68
Danh mục ID: 9
Tên sản phẩm: Bánh Mousse Socola
Slug: banh-mousse-socola
Mô tả: Bánh mousse socola đậm vị ngọt đắng quyến rũ.
Giá đen: 39000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 904
Hiển thị: true
Ngày tạo: 2026-05-25 09:15:23.490941+00
---
ID: 69
Danh mục ID: 9
Tên sản phẩm: Bánh Croissant Không Nhân
Slug: banh-croissant-khong-nhan
Mô tả: Bánh sừng bò truyền thống thơm bơ tơi xốp, vỏ ngoài giòn rụm.
Giá đen: 39000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 905
Hiển thị: true
Ngày tạo: 2026-05-25 09:15:23.622973+00
---
ID: 70
Danh mục ID: 9
Tên sản phẩm: Bánh Croissant Hạnh Nhân
Slug: banh-croissant-hanh-nhan
Mô tả: Bánh sừng bò phủ hạnh nhân giòn thơm ngọt bùi.
Giá đen: 39000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 906
Hiển thị: true
Ngày tạo: 2026-05-25 09:15:23.754321+00
---
ID: 71
Danh mục ID: 9
Tên sản phẩm: Bánh Tiramisu
Slug: banh-tiramisu
Mô tả: Bánh Tiramisu truyền thống nước Ý thơm nồng nàn vị cafe.
Giá đen: 39000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 907
Hiển thị: true
Ngày tạo: 2026-05-25 09:15:23.886789+00
---
ID: 49
Danh mục ID: 10
Tên sản phẩm: Sữa tươi thêm
Slug: sua-tuoi-them
Mô tả: Topping sữa tươi thêm.
Giá đen: 10000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 1
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 50
Danh mục ID: 10
Tên sản phẩm: Sữa đặc thêm
Slug: sua-dac-them
Mô tả: Topping sữa đặc thêm.
Giá đen: 7000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 2
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 51
Danh mục ID: 10
Tên sản phẩm: Trân châu trắng
Slug: tran-chau-trang
Mô tả: Topping trân châu trắng.
Giá đen: 10000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 3
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 52
Danh mục ID: 10
Tên sản phẩm: Mật ong
Slug: mat-ong
Mô tả: Topping mật ong.
Giá đen: 5000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 4
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 53
Danh mục ID: 10
Tên sản phẩm: Thạch cà phê
Slug: thach-ca-phe
Mô tả: Topping thạch cà phê.
Giá đen: 10000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 5
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 54
Danh mục ID: 10
Tên sản phẩm: Milkfoam
Slug: milkfoam
Mô tả: Topping milkfoam.
Giá đen: 10000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 6
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 55
Danh mục ID: 10
Tên sản phẩm: Cà phê thêm
Slug: ca-phe-them
Mô tả: Phần cà phê thêm.
Giá đen: 10000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 7
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---
ID: 56
Danh mục ID: 10
Tên sản phẩm: Đào thêm
Slug: dao-them
Mô tả: Phần đào thêm.
Giá đen: 15000.00
Giá sữa: 0.00
Là món nổi bật: false
Thứ tự hiển thị: 8
Hiển thị: true
Ngày tạo: 2026-05-17 20:24:59.007+00
---

=== BẢNG san_pham_merchandise ===
ID: 6
Danh mục ID: 11
Tên sản phẩm: Cà phê Sáng Tạo 8 - 500gr
Slug: ca-phe-sang-tao-8-500gr
Mô tả: Dòng sản phẩm được mệnh danh là siêu phẩm cà phê sáng tạo của Trung Nguyên, mang hương thơm quyến rũ bậc nhất.
Giá: 520000.00
Còn bán: true
Thứ tự hiển thị: 6
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2024/11/ST-8-500gr-LE.png
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 22
Danh mục ID: 12
Tên sản phẩm: Cà phê Hạt Mộc Legend Success 1 Túi 1kg
Slug: ca-phe-hat-moc-legend-success-1-tui-1kg
Mô tả: Cà phê hạt mộc Legend Success 1 túi 1kg.
Giá: 459000.00
Còn bán: true
Thứ tự hiển thị: 22
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 23
Danh mục ID: 12
Tên sản phẩm: Cà phê Hạt Mộc Legend Success 2 Túi 1kg
Slug: ca-phe-hat-moc-legend-success-2-tui-1kg
Mô tả: Cà phê hạt mộc Legend Success 2 túi 1kg.
Giá: 690000.00
Còn bán: true
Thứ tự hiển thị: 23
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 24
Danh mục ID: 12
Tên sản phẩm: Cà phê Hạt Mộc Legend Success 3 Lon 340gr
Slug: ca-phe-hat-moc-legend-success-3-lon-340gr
Mô tả: Cà phê hạt mộc Legend Success 3 lon 340gr.
Giá: 345000.00
Còn bán: true
Thứ tự hiển thị: 24
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 25
Danh mục ID: 12
Tên sản phẩm: Cà phê Hạt Mộc Legend Success 8 Lon 340gr
Slug: ca-phe-hat-moc-legend-success-8-lon-340gr
Mô tả: Cà phê hạt mộc Legend Success 8 lon 340gr.
Giá: 507000.00
Còn bán: true
Thứ tự hiển thị: 25
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 13
Danh mục ID: 13
Tên sản phẩm: G7 3in1 Hộp 21 sachets
Slug: g7-3in1-hop-21-sachets
Mô tả: Cà phê hòa tan G7 3in1 hộp 21 sachets.
Giá: 88000.00
Còn bán: true
Thứ tự hiển thị: 13
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 14
Danh mục ID: 13
Tên sản phẩm: G7 50 sachets 16gr
Slug: g7-50-sachets-16gr
Mô tả: Cà phê hòa tan G7 bịch 50 sachets 16gr.
Giá: 197000.00
Còn bán: true
Thứ tự hiển thị: 14
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 15
Danh mục ID: 13
Tên sản phẩm: Passiona 3in1 Hộp 14 sticks
Slug: passiona-3in1-hop-14-sticks
Mô tả: Cà phê Passiona 3in1 hộp 14 sticks.
Giá: 87000.00
Còn bán: true
Thứ tự hiển thị: 15
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 16
Danh mục ID: 13
Tên sản phẩm: G7 2in1 Hộp 15 sachets
Slug: g7-2in1-hop-15-sachets
Mô tả: Cà phê hòa tan G7 2in1 hộp 15 sachets.
Giá: 79000.00
Còn bán: true
Thứ tự hiển thị: 16
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 17
Danh mục ID: 13
Tên sản phẩm: G7 Gu mạnh X2 12 sticks
Slug: g7-gu-manh-x2-12-sticks
Mô tả: Cà phê G7 Gu mạnh X2 hộp 12 sticks.
Giá: 78000.00
Còn bán: true
Thứ tự hiển thị: 17
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 19
Danh mục ID: 13
Tên sản phẩm: G7 Gold Rumi
Slug: g7-gold-rumi
Mô tả: Cà phê G7 Gold Rumi.
Giá: 89000.00
Còn bán: true
Thứ tự hiển thị: 19
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 20
Danh mục ID: 13
Tên sản phẩm: G7 Gold Picasso Latte
Slug: g7-gold-picasso-latte
Mô tả: Cà phê G7 Gold Picasso Latte.
Giá: 89000.00
Còn bán: true
Thứ tự hiển thị: 20
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 21
Danh mục ID: 13
Tên sản phẩm: G7 Gold Motherland
Slug: g7-gold-motherland
Mô tả: Cà phê G7 Gold Motherland.
Giá: 89000.00
Còn bán: true
Thứ tự hiển thị: 21
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 43
Danh mục ID: 13
Tên sản phẩm: Cà phê hòa tan sấy lạnh
Slug: cf-hoa-tan-say-lanh
Mô tả: Sản phẩm CF hòa tan sấy lạnh.
Giá: 226000.00
Còn bán: true
Thứ tự hiển thị: 43
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 35
Danh mục ID: 17
Tên sản phẩm: Bộ The Spirit Of Philosophy Hemingway
Slug: bo-the-spirit-of-philosophy-hemingway
Mô tả: Bộ The Spirit Of Philosophy Hemingway.
Giá: 1276000.00
Còn bán: true
Thứ tự hiển thị: 35
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 38
Danh mục ID: 17
Tên sản phẩm: Gift set Legend
Slug: gift-set-legend
Mô tả: Bộ quà tặng Legend.
Giá: 2431000.00
Còn bán: true
Thứ tự hiển thị: 38
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 39
Danh mục ID: 17
Tên sản phẩm: Hộp quà giàu có
Slug: hop-set-legend-225gr
Mô tả: Hộp set Legend 225gr.
Giá: 1255000.00
Còn bán: true
Thứ tự hiển thị: 39
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 40
Danh mục ID: 17
Tên sản phẩm: Túi Vải Trung Nguyên Legend – Bộ Sưu Tập 3 Nền Văn Minh
Slug: tui-vai-trung-nguyen-legend-bo-suu-tap-3-nen-van-minh
Mô tả: Túi vải Trung Nguyên Legend thuộc bộ sưu tập 3 Nền Văn Minh.
Giá: 75000.00
Còn bán: true
Thứ tự hiển thị: 40
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 44
Danh mục ID: 19
Tên sản phẩm: Sữa đặc có đường Brothers
Slug: sua-dac-co-duong-brothers
Mô tả: Sữa đặc có đường Brothers thơm béo dẻo ngọt, sự kết hợp hoàn hảo để tạo nên ly cà phê sữa đá truyền thống thơm ngon đậm đà.
Giá: 29000.00
Còn bán: true
Thứ tự hiển thị: 801
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/Sua-dac-EC-2.png
Ngày tạo: 2026-05-25 09:12:27.465707+00
---
ID: 41
Danh mục ID: 19
Tên sản phẩm: Sổ tay Legend
Slug: so-tay-legend
Mô tả: Sổ tay ghi chép Legend cao cấp với chất giấy mịn chống lóa, bìa in logo Trung Nguyên Legend sắc nét cùng những câu trích dẫn tri thức truyền cảm hứng.
Giá: 125000.00
Còn bán: true
Thứ tự hiển thị: 813
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/So-tay-LE.png
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 57
Danh mục ID: 19
Tên sản phẩm: Khăn rằn
Slug: khan-ran
Mô tả: Khăn rằn truyền thống Trung Nguyên Legend mang thông điệp ý chí kiên cường, dấn thân và khát vọng phụng sự của thế hệ trẻ.
Giá: 65000.00
Còn bán: true
Thứ tự hiển thị: 814
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/khan-LE.png
Ngày tạo: 2026-05-25 09:12:27.465707+00
---
ID: 1
Danh mục ID: 20
Tên sản phẩm: Cà phê Drip 1 - Culi Robusta
Slug: ca-phe-drip-1-culi-robusta
Mô tả: Đậm vị, mạnh mẽ, hương thơm nồng, hậu vị sâu. Phù hợp cho người thích cà phê đậm và cần tỉnh táo.
Giá: 120000.00
Còn bán: true
Thứ tự hiển thị: 1
Hiển thị: true
Hình ảnh: https://res.cloudinary.com/dojibbcof/image/upload/v1779951070/5000624_1_kj7gqw.jpg
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 2
Danh mục ID: 20
Tên sản phẩm: Cà phê Drip 2 - Robusta Arabica
Slug: ca-phe-drip-2-robusta-arabica
Mô tả: Cà phê phin giấy Drip 2 - Robusta Arabica.
Giá: 1383000.00
Còn bán: true
Thứ tự hiển thị: 2
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 3
Danh mục ID: 20
Tên sản phẩm: Cà phê Drip 4 - Premium Culi
Slug: ca-phe-drip-4-premium-culi
Mô tả: Cà phê phin giấy Drip 4 - Premium Culi.
Giá: 1458000.00
Còn bán: true
Thứ tự hiển thị: 3
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 4
Danh mục ID: 20
Tên sản phẩm: Cà phê Drip 5 - Culi Arabica
Slug: ca-phe-drip-5-culi-arabica
Mô tả: Cà phê phin giấy Drip 5 - Culi Arabica.
Giá: 1833000.00
Còn bán: true
Thứ tự hiển thị: 4
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 59
Danh mục ID: 20
Tên sản phẩm: Cà Phê Drip 8 – Legend
Slug: ca-phe-drip-8-legend
Mô tả: Cà phê hạt Drip 8 – Legend cao cấp, mang hương vị đậm sâu, mạnh mẽ và hậu vị bền lâu. Sản phẩm phù hợp cho khách hàng yêu thích gu cà phê mạnh, giàu năng lượng, có thể xay pha máy, pha phin hoặc sử dụng trong kinh doanh đồ uống.
Giá: 3330000.00
Còn bán: true
Thứ tự hiển thị: 5
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-28 08:55:48.81211+00
---
ID: 7
Danh mục ID: 21
Tên sản phẩm: Cà phê Chế Phin 1 425gr
Slug: ca-phe-che-phin-1-425gr
Mô tả: Cà phê Chế Phin 1 gói 425gr.
Giá: 154000.00
Còn bán: true
Thứ tự hiển thị: 7
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 8
Danh mục ID: 21
Tên sản phẩm: Cà phê Sáng tạo 1 340gr
Slug: ca-phe-sang-tao-1-340gr
Mô tả: Cà phê Sáng tạo 1 gói 340gr.
Giá: 93000.00
Còn bán: true
Thứ tự hiển thị: 8
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 9
Danh mục ID: 21
Tên sản phẩm: Cà phê Sáng tạo 2 340gr
Slug: ca-phe-sang-tao-2-340gr
Mô tả: Cà phê Sáng tạo 2 gói 340gr.
Giá: 108000.00
Còn bán: true
Thứ tự hiển thị: 9
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 10
Danh mục ID: 21
Tên sản phẩm: Cà phê Sáng tạo 3 340gr
Slug: ca-phe-sang-tao-3-340gr
Mô tả: Cà phê Sáng tạo 3 gói 340gr.
Giá: 130000.00
Còn bán: true
Thứ tự hiển thị: 10
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 11
Danh mục ID: 21
Tên sản phẩm: Cà phê Sáng tạo 4 340gr
Slug: ca-phe-sang-tao-4-340gr
Mô tả: Cà phê Sáng tạo 4 gói 340gr.
Giá: 148000.00
Còn bán: true
Thứ tự hiển thị: 11
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 12
Danh mục ID: 21
Tên sản phẩm: Cà phê Sáng tạo 5 340gr
Slug: ca-phe-sang-tao-5-340gr
Mô tả: Cà phê Sáng tạo 5 gói 340gr.
Giá: 180000.00
Còn bán: true
Thứ tự hiển thị: 12
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 42
Danh mục ID: 21
Tên sản phẩm: Cà phê chất tiên phong
Slug: cf-chat-tien-phong
Mô tả: Vật phẩm CF chất tiên phong.
Giá: 269000.00
Còn bán: true
Thứ tự hiển thị: 42
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 26
Danh mục ID: 23
Tên sản phẩm: Legend Classic - Hộp 12
Slug: legend-classic-hop-12
Mô tả: Cà phê Legend Classic hộp 12.
Giá: 58000.00
Còn bán: true
Thứ tự hiển thị: 26
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 27
Danh mục ID: 23
Tên sản phẩm: Legend Special Edition - Hộp 18
Slug: legend-special-edition-hop-18
Mô tả: Cà phê Legend Special Edition hộp 18.
Giá: 141000.00
Còn bán: true
Thứ tự hiển thị: 27
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 28
Danh mục ID: 23
Tên sản phẩm: Cà phê Legend Classic - Hộp 21 sachets
Slug: ca-phe-legend-classic-hop-21-sachets
Mô tả: Cà phê Legend Classic hộp 21 sachets.
Giá: 96000.00
Còn bán: true
Thứ tự hiển thị: 28
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 29
Danh mục ID: 23
Tên sản phẩm: Trung Nguyên Legend Classic - Bịch 50 sachets
Slug: trung-nguyen-legend-classic-bich-50-sachets
Mô tả: Trung Nguyên Legend Classic bịch 50 sachets.
Giá: 203000.00
Còn bán: true
Thứ tự hiển thị: 29
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 30
Danh mục ID: 25
Tên sản phẩm: Phin nhôm hoa văn Trung Nguyên
Slug: phin-nhom-hoa-van-trung-nguyen
Mô tả: Dụng cụ pha cà phê phin nhôm truyền thống được gia công tỉ mỉ với họa tiết Trống đồng đặc sắc lịch lãm.
Giá: 85000.00
Còn bán: true
Thứ tự hiển thị: 30
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2021/11/logo-trung-nguyen-legend.png
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 31
Danh mục ID: 25
Tên sản phẩm: Phin nhôm hoa văn Trung Nguyên nâu - Hộp giấy
Slug: phin-nhom-hoa-van-trung-nguyen-nau-hop-giay
Mô tả: Phin nhôm hoa văn Trung Nguyên màu nâu, hộp giấy.
Giá: 119000.00
Còn bán: true
Thứ tự hiển thị: 31
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 32
Danh mục ID: 25
Tên sản phẩm: Phin nhôm hoa văn Trung Nguyên vàng - Hộp giấy
Slug: phin-nhom-hoa-van-trung-nguyen-vang-hop-giay
Mô tả: Phin nhôm hoa văn Trung Nguyên màu vàng, hộp giấy.
Giá: 119000.00
Còn bán: true
Thứ tự hiển thị: 32
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 33
Danh mục ID: 25
Tên sản phẩm: Phin nhôm đen Việt Nam - Hộp giấy
Slug: phin-nhom-den-viet-nam-hop-giay
Mô tả: Phin nhôm đen Việt Nam, hộp giấy.
Giá: 120000.00
Còn bán: true
Thứ tự hiển thị: 33
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 34
Danh mục ID: 26
Tên sản phẩm: Ly Sứ Legend VIP Đen Trung Nguyên Legend – 350 ml
Slug: ly-su-legend-vip-den
Mô tả: Ly sứ gốm cao cấp màu đen bóng in logo thương hiệu Trung Nguyên Legend sắc sảo, dùng để thưởng thức những ly cà phê năng lượng nóng nồng nàn.
Giá: 145000.00
Còn bán: true
Thứ tự hiển thị: 34
Hiển thị: true
Hình ảnh: https://cafe.net.vn/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/6/0/6003796.jpg
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 37
Danh mục ID: 26
Tên sản phẩm: Bộ tách đĩa
Slug: bo-tach-dia
Mô tả: Bộ tách đĩa Trung Nguyên Legend.
Giá: 190000.00
Còn bán: true
Thứ tự hiển thị: 37
Hiển thị: true
Hình ảnh: 
Ngày tạo: 2026-05-17 20:24:59.153+00
---
ID: 45
Danh mục ID: 26
Tên sản phẩm: Bình giữ nhiệt Trung Nguyên Legend – Màu Trắng
Slug: binh-giu-nhiet-trung-nguyen-legend-mau-trang
Mô tả: Bình giữ nhiệt kim loại cao cấp màu trắng ngọc trai bóng, logo in sắc sảo thanh lịch, giữ nhiệt độ uống nóng lạnh vượt trội suốt cả ngày.
Giá: 350000.00
Còn bán: true
Thứ tự hiển thị: 802
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2021/11/Binh-giu-nhiet_WhiteCan-600x600.jpg
Ngày tạo: 2026-05-25 09:12:27.465707+00
---
ID: 46
Danh mục ID: 26
Tên sản phẩm: Bình giữ nhiệt Trung Nguyên Legend (Màu Đen)
Slug: binh-giu-nhiet-trung-nguyen-legend-mau-den
Mô tả: Bình giữ nhiệt kim loại cao cấp màu đen nhám huyền bí, logo in sắc sảo mạnh mẽ, giữ nhiệt độ uống nóng lạnh cực tốt.
Giá: 350000.00
Còn bán: true
Thứ tự hiển thị: 803
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2020/08/100758914_2825508094213680_4039200829587062784_n.jpg
Ngày tạo: 2026-05-25 09:12:27.465707+00
---
ID: 47
Danh mục ID: 26
Tên sản phẩm: Bình giữ nhiệt Trung Nguyên Legend – Màu Xám
Slug: binh-giu-nhiet-trung-nguyen-legend-mau-xam
Mô tả: Bình giữ nhiệt kim loại cao cấp màu xám hiện đại thanh tao, logo in tinh tế, giữ nhiệt độ uống nóng lạnh vượt trội.
Giá: 350000.00
Còn bán: true
Thứ tự hiển thị: 804
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2021/11/Gray-600x600.jpg
Ngày tạo: 2026-05-25 09:12:27.465707+00
---
ID: 48
Danh mục ID: 26
Tên sản phẩm: Ly Giữ Nhiệt Trung Nguyên Legend VF214 – 350ml
Slug: ly-giu-nhiet-trung-nguyen-legend-vf214-350ml
Mô tả: Ly giữ nhiệt inox 304 cao cấp 350ml màu đen nhám in logo lịch lãm, nắp đậy khít chống tràn, giữ nhiệt lạnh và nóng cực kỳ tốt và tiện lợi đem đi lại.
Giá: 210000.00
Còn bán: true
Thứ tự hiển thị: 805
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2025/09/Ly-Giu-Nhiet-VF214-%E2%80%93-350ml-mau-den-2.png
Ngày tạo: 2026-05-25 09:12:27.465707+00
---
ID: 49
Danh mục ID: 26
Tên sản phẩm: Bình giữ nhiệt – Ottoman
Slug: binh-giu-nhiet-ottoman
Mô tả: Bình giữ nhiệt kim loại tinh xảo in họa tiết và triết lý văn minh cà phê Ottoman - hướng về khía cạnh tâm linh, huyền bí phương Đông.
Giá: 350000.00
Còn bán: true
Thứ tự hiển thị: 806
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2025/04/TNL_BGN-Ottoman-1.png
Ngày tạo: 2026-05-25 09:12:27.465707+00
---
ID: 50
Danh mục ID: 26
Tên sản phẩm: Bình giữ nhiệt – Roman
Slug: binh-giu-nhiet-roman
Mô tả: Bình giữ nhiệt kim loại tinh tế in họa tiết và triết lý văn minh cà phê Roman - hướng về sự tráng lệ, khoa học nghệ thuật.
Giá: 350000.00
Còn bán: true
Thứ tự hiển thị: 807
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2025/04/TNL_BGN-roman.png
Ngày tạo: 2026-05-25 09:12:27.465707+00
---
ID: 51
Danh mục ID: 26
Tên sản phẩm: Bình giữ nhiệt – Thiền
Slug: binh-giu-nhiet-thien
Mô tả: Bình giữ nhiệt gốm kim loại tinh xảo in họa tiết và triết lý văn minh cà phê Thiền - hướng về sự tĩnh lặng bên trong.
Giá: 350000.00
Còn bán: true
Thứ tự hiển thị: 808
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2025/04/TNL_BGN-thien.png
Ngày tạo: 2026-05-25 09:12:27.465707+00
---
ID: 52
Danh mục ID: 26
Tên sản phẩm: Bình Giữ Nhiệt Trung Nguyên Legend Màu Đen – 350ml (Hạnh Phúc)
Slug: binh-giu-nhiet-trung-nguyen-legend-mau-den-350ml-hanh-phuc
Mô tả: Bình giữ nhiệt kim loại màu đen tuyền huyền bí, in thông điệp 'Hạnh Phúc' sâu sắc và năng lượng tươi vui từ Trung Nguyên Legend.
Giá: 350000.00
Còn bán: true
Thứ tự hiển thị: 809
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2024/11/TNL_BGN-hanh-phuc.png
Ngày tạo: 2026-05-25 09:12:27.465707+00
---
ID: 53
Danh mục ID: 26
Tên sản phẩm: Bình Giữ Nhiệt Trung Nguyên Legend Màu Xám – 350ml (Thiện Lành)
Slug: binh-giu-nhiet-trung-nguyen-legend-mau-xam-350ml-thien-lanh
Mô tả: Bình giữ nhiệt kim loại màu xám xi măng thời thượng, in thông điệp 'Thiện Lành' mộc mạc thanh cao đầy năng lượng tỉnh thức.
Giá: 350000.00
Còn bán: true
Thứ tự hiển thị: 810
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2024/11/TNL_BGN-thien-lanh.png
Ngày tạo: 2026-05-25 09:12:27.465707+00
---
ID: 54
Danh mục ID: 26
Tên sản phẩm: Bình Giữ Nhiệt Trung Nguyên Legend Màu Trắng – 350ml (Yêu Thương)
Slug: binh-giu-nhiet-trung-nguyen-legend-mau-trang-350ml-yeu-thuong
Mô tả: Bình giữ nhiệt kim loại màu trắng sữa, in thông điệp 'Yêu Thương' đầy triết lý và năng lượng tích cực từ Trung Nguyên Legend.
Giá: 350000.00
Còn bán: true
Thứ tự hiển thị: 811
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2024/11/TNL_BGN-yeu-thuong.png
Ngày tạo: 2026-05-25 09:12:27.465707+00
---
ID: 55
Danh mục ID: 26
Tên sản phẩm: Bình Giữ Nhiệt Bao Da Trung Nguyên Legend – 350ml
Slug: binh-giu-nhiet-bao-da-trung-nguyen-legend-350ml
Mô tả: Bình giữ nhiệt chất liệu inox cao cấp bọc bao da in nổi họa tiết thương hiệu tinh xảo, thể hiện đẳng cấp lịch lãm của người dùng.
Giá: 290000.00
Còn bán: true
Thứ tự hiển thị: 812
Hiển thị: true
Hình ảnh: https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/BGN-bao-da-LE.png
Ngày tạo: 2026-05-25 09:12:27.465707+00
---
ID: 58
Danh mục ID: 26
Tên sản phẩm: Bộ Tách Sứ Đen Trung Nguyên Legend – 300ml
Slug: bo-tach-su-den-trung-nguyen-legend-300ml
Mô tả: Bộ tách và đĩa sứ gốm cao cấp màu đen Trung Nguyên Legend dung tích 300ml, thích hợp thưởng thức các món cà phê máy espresso, cappuccino hay latte ấm nồng.
Giá: 195000.00
Còn bán: true
Thứ tự hiển thị: 815
Hiển thị: true
Hình ảnh: https://down-cvs-vn.img.susercontent.com/vn-11134517-7ras8-md45myo8th0cdd
Ngày tạo: 2026-05-25 09:12:27.465707+00
---

=== BẢNG thong_tin_khach_hang ===
ID: 84
Họ tên: Thanh thuỷ
Số điện thoại: 0862170739
Email: NULL
Địa chỉ: An cụu , huế
Ghi chú: 
Ngày tạo: 2026-06-08 13:01:33.408598+00
---
ID: 83
Họ tên: TRANFF
Số điện thoại: 0911111111111
Email: NULL
Địa chỉ: Nhận tại cửa hàng
Ghi chú: 
Ngày tạo: 2026-06-08 03:48:48.891399+00
---
ID: 82
Họ tên: TRANFF
Số điện thoại: 0911111111111
Email: NULL
Địa chỉ: Nhận tại cửa hàng
Ghi chú: 
Ngày tạo: 2026-06-08 03:47:40.626301+00
---
ID: 81
Họ tên: Yên Bình
Số điện thoại: 0943003366
Email: NULL
Địa chỉ: Trung Nguyên Legend sống flatform bà triệu huế
Ghi chú: 
Ngày tạo: 2026-06-08 03:00:39.779065+00
---
ID: 80
Họ tên: gyiu
Số điện thoại: 0965758686
Email: NULL
Địa chỉ: trường đại học kinh tế huế
Ghi chú: 
Ngày tạo: 2026-06-08 02:54:13.909254+00
---
ID: 79
Họ tên: Mai
Số điện thoại: 0834240479
Email: NULL
Địa chỉ: 10A Kiệt 66 Lê Lợi Thành phố Huế
Ghi chú: 
Ngày tạo: 2026-06-07 16:12:07.207226+00
---
ID: 78
Họ tên: Yên Bình
Số điện thoại: 0834240479
Email: NULL
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-07 16:03:43.927233+00
---
ID: 77
Họ tên: huy le
Số điện thoại: 0232323323
Email: NULL
Địa chỉ: 02 lê lợi
Ghi chú: 
Ngày tạo: 2026-06-07 12:55:24.584883+00
---
ID: 76
Họ tên: huy le
Số điện thoại: 0232323323
Email: NULL
Địa chỉ: 02 lê lợi
Ghi chú: 
Ngày tạo: 2026-06-07 12:55:16.307133+00
---
ID: 75
Họ tên: huy le
Số điện thoại: 0232323323
Email: NULL
Địa chỉ: 02 lê lợi
Ghi chú: 
Ngày tạo: 2026-06-07 12:52:52.718819+00
---
ID: 74
Họ tên: huy le
Số điện thoại: 0232323323
Email: NULL
Địa chỉ: 02 lê lợi
Ghi chú: Tôi Yêu Đàn Bà
Ngày tạo: 2026-06-07 12:51:20.166435+00
---
ID: 73
Họ tên: huy le
Số điện thoại: 0232323323
Email: NULL
Địa chỉ: 02 lê lợi
Ghi chú: 
Ngày tạo: 2026-06-07 12:42:14.485648+00
---
ID: 72
Họ tên: huy le
Số điện thoại: 0232323323
Email: NULL
Địa chỉ: 02 lê lợi
Ghi chú: 
Ngày tạo: 2026-06-07 12:40:50.96793+00
---
ID: 71
Họ tên: huy le
Số điện thoại: 0232323323
Email: NULL
Địa chỉ: 02 lê lợi
Ghi chú: 
Ngày tạo: 2026-06-07 12:40:34.19839+00
---
ID: 70
Họ tên: Nguyễn Thị Tuyết Mai
Số điện thoại: 0834240479
Email: NULL
Địa chỉ: 100 ngự bình an cựu huế
Ghi chú: 
Ngày tạo: 2026-06-06 16:08:43.472146+00
---
ID: 69
Họ tên: Mai
Số điện thoại: 0834240479
Email: NULL
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-06 16:07:02.088503+00
---
ID: 68
Họ tên: Nguyễn Thị Tuyết Mai
Số điện thoại: 0834240479
Email: NULL
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-06 15:35:41.686168+00
---
ID: 67
Họ tên: Bình
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-06 14:42:40.558446+00
---
ID: 66
Họ tên: Bình
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-06 14:13:17.176397+00
---
ID: 65
Họ tên: Yên Bình
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-06 12:51:53.567264+00
---
ID: 64
Họ tên: trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-06 12:34:50.365238+00
---
ID: 63
Họ tên: trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-06 12:17:58.84791+00
---
ID: 62
Họ tên: Yên Bình
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-06 12:13:51.138938+00
---
ID: 61
Họ tên: Yên Bình
Số điện thoại: 0834240479
Email: 
Địa chỉ: 
Ghi chú: 
Ngày tạo: 2026-06-06 12:01:29.012621+00
---
ID: 60
Họ tên: Yên Bình
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-06 11:52:28.709118+00
---
ID: 59
Họ tên: Bình
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-06 11:40:06.157092+00
---
ID: 58
Họ tên: Ánh
Số điện thoại: 0w98423986482734
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-06 11:16:34.799992+00
---
ID: 57
Họ tên: Ánh
Số điện thoại: 0w98423986482734
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-06 11:16:18.450522+00
---
ID: 56
Họ tên: Bình
Số điện thoại: 088888888
Email: 
Địa chỉ: đại học sư phạm huế
Ghi chú: 
Ngày tạo: 2026-06-06 09:48:56.289579+00
---
ID: 55
Họ tên: Đức
Số điện thoại: 0888888888
Email: 
Địa chỉ: 66 Lê Lợi Thành phố Huế
Ghi chú: Ko
Ngày tạo: 2026-06-06 07:30:21.731907+00
---
ID: 54
Họ tên: Yên Bình
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-05 05:48:49.305694+00
---
ID: 53
Họ tên: Nguyễn Thị Tuyết Mai
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-05 03:50:49.722692+00
---
ID: 52
Họ tên: Khách Test Biểu Đồ
Số điện thoại: 0900000000
Email: test@vpc.vn
Địa chỉ: Huế
Ghi chú: Dữ liệu test cho dashboard admin
Ngày tạo: 2026-06-04 12:47:39.740965+00
---
ID: 51
Họ tên: Trang
Số điện thoại: 0559884291
Email: 
Địa chỉ: 100 ngự bình an cựu huế
Ghi chú: 
Ngày tạo: 2026-06-04 06:08:33.776787+00
---
ID: 50
Họ tên: Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-03 02:57:16.509817+00
---
ID: 49
Họ tên: Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-03 01:31:00.716591+00
---
ID: 48
Họ tên: Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-03 00:22:11.994705+00
---
ID: 46
Họ tên: Lê Hoàng Em
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-06-01 00:52:23.141745+00
---
ID: 45
Họ tên: jnbjhbuhj
Số điện thoại: 0162102151
Email: 
Địa chỉ: ga hue
Ghi chú: 
Ngày tạo: 2026-05-30 12:31:55.116833+00
---
ID: 44
Họ tên: Lê Hoàng Em
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-05-29 05:30:11.212896+00
---
ID: 43
Họ tên: Lê Hoàng Em
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-05-29 02:35:42.792144+00
---
ID: 42
Họ tên: Lê Hoàng Em
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-05-29 02:34:10.073071+00
---
ID: 41
Họ tên: Lê Hoàng Em
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-05-26 02:33:40.939175+00
---
ID: 40
Họ tên: Lê Hoàng Em
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-05-26 01:11:42.279487+00
---
ID: 39
Họ tên: Lê Hoàng Em
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-05-26 01:10:06.459209+00
---
ID: 38
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-05-25 03:15:39.394409+00
---
ID: 37
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-05-25 03:09:10.051364+00
---
ID: 36
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-05-25 03:07:27.91749+00
---
ID: 35
Họ tên: huy le
Số điện thoại: 0232323323
Email: 
Địa chỉ: 102 an dương vương
Ghi chú: chuối
Ngày tạo: 2026-05-23 15:33:54.945948+00
---
ID: 34
Họ tên: gsgsh
Số điện thoại: 029933
Email: 
Địa chỉ: hdscbsdcm
Ghi chú: ydgsshc
Ngày tạo: 2026-05-23 14:53:33.903141+00
---
ID: 33
Họ tên: gsgsh
Số điện thoại: 029933
Email: 
Địa chỉ: hdscbsdcm
Ghi chú: ydgsshc
Ngày tạo: 2026-05-23 14:53:20.297412+00
---
ID: 32
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: 100 ngự bình an cựu huế
Ghi chú: 
Ngày tạo: 2026-05-23 14:25:58.539957+00
---
ID: 31
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-05-23 14:03:08.392008+00
---
ID: 30
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-05-23 13:55:15.006475+00
---
ID: 29
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: 100 ngự bình an cựu hue
Ghi chú: 
Ngày tạo: 2026-05-23 13:39:06.694868+00
---
ID: 28
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: 100 ngự bình an cựu hue
Ghi chú: 
Ngày tạo: 2026-05-23 13:38:53.036093+00
---
ID: 27
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: 100 ngự bình AN CỰU HUẾ
Ghi chú: 
Ngày tạo: 2026-05-23 12:58:49.799239+00
---
ID: 26
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: 100 ngự bình AN CỰU HUẾ
Ghi chú: 
Ngày tạo: 2026-05-23 12:58:43.658242+00
---
ID: 25
Họ tên: Lê Hoàng Em
Số điện thoại: 0559884291
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-05-22 03:06:06.839146+00
---
ID: 24
Họ tên: Lê Hoàng Em
Số điện thoại: 0559884291
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-05-22 02:18:08.462237+00
---
ID: 23
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-05-22 02:17:19.063457+00
---
ID: 22
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Ngày tạo: 2026-05-22 02:17:11.373419+00
---
ID: 21
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: 100 ngự bình an cựu huế
Ghi chú: 
Ngày tạo: 2026-05-21 08:44:35.290559+00
---
ID: 20
Họ tên: Lê Hoàng Em
Số điện thoại: 0559884291
Email: 
Địa chỉ: trường Đại học Khoa học Huế, Thành phố Huế
Ghi chú: 
Ngày tạo: 2026-05-21 08:21:32.31626+00
---
ID: 19
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: 100 ngự bình an cựu huế
Ghi chú: 
Ngày tạo: 2026-05-21 08:20:04.204915+00
---
ID: 18
Họ tên: Lê Hoàng Em
Số điện thoại: 0559884291
Email: 
Địa chỉ: Ngõ 44 Hoàng Diệu Đồng Hới
Ghi chú: 
Ngày tạo: 2026-05-21 07:54:03.472462+00
---
ID: 17
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 0834240479
Email: 
Địa chỉ: 100 ngự bình
Ghi chú: 
Ngày tạo: 2026-05-21 07:52:41.863602+00
---
ID: 16
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 834240479
Email: NULL
Địa chỉ: Trung Nguyên Legend Âu Lạc
Ghi chú: NULL
Ngày tạo: 2026-05-20 19:12:21.437+00
---
ID: 15
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 834240479
Email: NULL
Địa chỉ: Trung Nguyên Legend Âu Lạc
Ghi chú: NULL
Ngày tạo: 2026-05-20 19:12:18.517+00
---
ID: 14
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 834240479
Email: NULL
Địa chỉ: Trung Nguyên Legend Âu Lạc
Ghi chú: NULL
Ngày tạo: 2026-05-20 19:12:11.85+00
---
ID: 13
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 834240479
Email: NULL
Địa chỉ: Ngõ 44 Hoàng Diệu Đồng Hới
Ghi chú: NULL
Ngày tạo: 2026-05-20 16:21:27.147+00
---
ID: 12
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 834240479
Email: NULL
Địa chỉ: Ngõ 44 Hoàng Diệu Đồng Hới
Ghi chú: NULL
Ngày tạo: 2026-05-20 15:52:38.49+00
---
ID: 11
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 834240479
Email: NULL
Địa chỉ: Ngõ 44 Hoàng Diệu Đồng Hới
Ghi chú: NULL
Ngày tạo: 2026-05-20 15:49:39+00
---
ID: 10
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 834240479
Email: NULL
Địa chỉ: Ngách 41 Ngõ 44 Hoàng Diệu Đồng Hới Quảng Bình
Ghi chú: NULL
Ngày tạo: 2026-05-20 15:49:05.953+00
---
ID: 9
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 834240479
Email: NULL
Địa chỉ: Ngách 41 Ngõ 44 Hoàng Diệu Đồng Hới
Ghi chú: NULL
Ngày tạo: 2026-05-20 15:48:52.217+00
---
ID: 8
Họ tên: Lê Hoàng Em
Số điện thoại: 559884291
Email: NULL
Địa chỉ: Trung Nguyên Legend Âu Lạc
Ghi chú: NULL
Ngày tạo: 2026-05-20 15:36:43.59+00
---
ID: 7
Họ tên: Lê Hoàng Em
Số điện thoại: 559884291
Email: NULL
Địa chỉ: Trung Nguyên Legend Âu Lạc
Ghi chú: NULL
Ngày tạo: 2026-05-20 15:31:37.943+00
---
ID: 6
Họ tên: Lê Hoàng Em
Số điện thoại: 559884291
Email: NULL
Địa chỉ: 100 ngự bình
Ghi chú: NULL
Ngày tạo: 2026-05-20 12:43:54.833+00
---
ID: 5
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 1q32342423213
Email: NULL
Địa chỉ: NULL
Ghi chú: NULL
Ngày tạo: 2026-05-18 10:35:24.447+00
---
ID: 4
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 1q32342423213
Email: NULL
Địa chỉ: sdADSAsASQdwqd
Ghi chú: NULL
Ngày tạo: 2026-05-18 09:47:54.64+00
---
ID: 3
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 1q32342423213
Email: NULL
Địa chỉ: dgagsdfhfghfh
Ghi chú: NULL
Ngày tạo: 2026-05-18 01:05:28.16+00
---
ID: 2
Họ tên: Ngô Quỳnh Trang
Số điện thoại: 1q32342423213
Email: NULL
Địa chỉ: NULL
Ghi chú: NULL
Ngày tạo: 2026-05-17 21:34:34.737+00
---
ID: 1
Họ tên: Khách hàng mẫu
Số điện thoại: 389726999
Email: NULL
Địa chỉ: TP. Huế
Ghi chú: Dữ liệu mẫu để kiểm tra đơn hàng
Ngày tạo: 2026-05-17 20:24:59.163+00
---

=== BẢNG don_hang ===
ID: 6
Khách hàng ID: 6
Mã đơn hàng: DH1779255834840
Danh sách sản phẩm: Cà phê trứng x1 - 79.000đ
Tổng tiền: 
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: 
Phương thức thanh toán: 
Địa chỉ giao hàng: 
Ghi chú: 
Trạng thái: 
Ngày tạo: 
---
ID: 5
Khách hàng ID: 5
Mã đơn hàng: DH1779075324451
Danh sách sản phẩm: Coffee Legend  x1 - 165.000đ
Tổng tiền: 
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: 
Phương thức thanh toán: 
Địa chỉ giao hàng: 
Ghi chú: 
Trạng thái: 
Ngày tạo: 
---
ID: 3
Khách hàng ID: 3
Mã đơn hàng: DH1779041128165
Danh sách sản phẩm: Bánh ngọt các loại x1 - 39.000đ
Tổng tiền: 
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: 
Phương thức thanh toán: 
Địa chỉ giao hàng: 
Ghi chú: 
Trạng thái: 
Ngày tạo: 
---
ID: 2
Khách hàng ID: 2
Mã đơn hàng: DH1779028474740
Danh sách sản phẩm: Cà phê dừa x1 - 79.000đ
Tổng tiền: 
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: 
Phương thức thanh toán: 
Địa chỉ giao hàng: 
Ghi chú: 
Trạng thái: 
Ngày tạo: 
---
ID: 1
Khách hàng ID: 1
Mã đơn hàng: DH0001
Danh sách sản phẩm: Cà phê dừa x1
Tổng tiền: 
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: 
Phương thức thanh toán: 
Địa chỉ giao hàng: 
Ghi chú: 
Trạng thái: 
Ngày tạo: 
---
ID: 86
Khách hàng ID: 84
Mã đơn hàng: VPC-DH-20260608-200132
Danh sách sản phẩm: [{"name":"Dừa tươi","qty":1,"priceNum":45000,"priceLabel":"45.000đ"}]
Tổng tiền: 45000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: thanh_toan_khi_nhan_hang
Địa chỉ giao hàng: {"name":"Thanh thuỷ","phone":"0862170739","email":"","address":"An cụu , huế","distance":0,"delivery_type":"giao_hang_noi_thanh"}
Ghi chú: 
Trạng thái: da_dat_don
Ngày tạo: 2026-06-08 13:01:34.091745+00
---
ID: 85
Khách hàng ID: 83
Mã đơn hàng: VPC-DH-20260608-104847
Danh sách sản phẩm: [{"name":"item test","qty":2,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 2000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: den_lay_tai_quan
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: {"name":"TRANFF","phone":"0911111111111","email":"","address":"Nhận tại cửa hàng","distance":0,"delivery_type":"den_lay_tai_quan"}
Ghi chú: [SePay tự động] Xác nhận thanh toán thành công qua ngân hàng lúc 03:49:47 8/6/2026.
Trạng thái: da_thanh_toan
Ngày tạo: 2026-06-08 03:48:49.119113+00
---
ID: 84
Khách hàng ID: 82
Mã đơn hàng: VPC-DH-20260608-104739
Danh sách sản phẩm: [{"name":"Năng Lượng Đột Phá (Sữa)","qty":1,"priceNum":79000,"priceLabel":"79.000đ"},{"name":"Năng Lượng Tư Duy (Sữa)","qty":1,"priceNum":41000,"priceLabel":"41.000đ"}]
Tổng tiền: 120000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: den_lay_tai_quan
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: {"name":"TRANFF","phone":"0911111111111","email":"","address":"Nhận tại cửa hàng","distance":0,"delivery_type":"den_lay_tai_quan"}
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-08 03:47:40.82976+00
---
ID: 83
Khách hàng ID: 81
Mã đơn hàng: VPC-DH-20260608-100038
Danh sách sản phẩm: [{"name":"item test","qty":5,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 5000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: {"name":"Yên Bình","phone":"0943003366","email":"","address":"Trung Nguyên Legend sống flatform bà triệu huế","distance":0,"delivery_type":"giao_hang_noi_thanh"}
Ghi chú: [SePay tự động] Xác nhận thanh toán thành công qua ngân hàng lúc 03:01:34 8/6/2026.
Trạng thái: da_thanh_toan
Ngày tạo: 2026-06-08 03:00:39.987386+00
---
ID: 82
Khách hàng ID: 80
Mã đơn hàng: VPC-DH-20260608-095411
Danh sách sản phẩm: [{"name":"Trà vải hoa hồng","qty":1,"priceNum":68000,"priceLabel":"68.000đ"}]
Tổng tiền: 68000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: thanh_toan_khi_nhan_hang
Địa chỉ giao hàng: {"name":"gyiu","phone":"0965758686","email":"","address":"trường đại học kinh tế huế","distance":0,"delivery_type":"giao_hang_noi_thanh"}
Ghi chú: 
Trạng thái: da_dat_don
Ngày tạo: 2026-06-08 02:54:14.167069+00
---
ID: 81
Khách hàng ID: 79
Mã đơn hàng: VPC-DH-20260607-231206
Danh sách sản phẩm: [{"name":"item test","qty":4,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 4000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: {"name":"Mai","phone":"0834240479","email":"","address":"10A Kiệt 66 Lê Lợi Thành phố Huế","distance":0,"delivery_type":"giao_hang_noi_thanh"}
Ghi chú: [SePay tự động] Xác nhận thanh toán thành công qua ngân hàng lúc 16:14:11 7/6/2026.
Trạng thái: da_thanh_toan
Ngày tạo: 2026-06-07 16:12:07.428+00
---
ID: 80
Khách hàng ID: 78
Mã đơn hàng: VPC-DH-20260607-230342
Danh sách sản phẩm: [{"name":"item test","qty":3,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 3000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: {"name":"Yên Bình","phone":"0834240479","email":"","address":"TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ","distance":0,"delivery_type":"giao_hang_noi_thanh"}
Ghi chú: [SePay tự động] Xác nhận thanh toán thành công qua ngân hàng lúc 16:04:45 7/6/2026.
Trạng thái: da_thanh_toan
Ngày tạo: 2026-06-07 16:03:44.155757+00
---
ID: 79
Khách hàng ID: 77
Mã đơn hàng: VPC-DH-20260607-195524
Danh sách sản phẩm: [{"name":"item test","qty":2,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 2000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: den_lay_tai_quan
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: {"name":"huy le","phone":"0232323323","email":"","address":"02 lê lợi","distance":0,"delivery_type":"den_lay_tai_quan"}
Ghi chú: [SePay tự động] Xác nhận thanh toán thành công qua ngân hàng lúc 12:56:05 7/6/2026.
Trạng thái: da_giao
Ngày tạo: 2026-06-07 12:55:24.784414+00
---
ID: 78
Khách hàng ID: 76
Mã đơn hàng: VPC-DH-20260607-195515
Danh sách sản phẩm: [{"name":"item test","qty":2,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 2000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: den_lay_tai_quan
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: {"name":"huy le","phone":"0232323323","email":"","address":"02 lê lợi","distance":0,"delivery_type":"den_lay_tai_quan"}
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-07 12:55:16.510326+00
---
ID: 77
Khách hàng ID: 75
Mã đơn hàng: VPC-DH-20260607-195251
Danh sách sản phẩm: [{"name":"item test","qty":1,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 1000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: den_lay_tai_quan
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: {"name":"huy le","phone":"0232323323","email":"","address":"02 lê lợi","distance":0,"delivery_type":"den_lay_tai_quan"}
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-07 12:52:52.925585+00
---
ID: 76
Khách hàng ID: 74
Mã đơn hàng: VPC-DH-20260607-195119
Danh sách sản phẩm: [{"name":"item test","qty":1,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 1000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: den_lay_tai_quan
Phương thức thanh toán: thanh_toan_khi_nhan_hang
Địa chỉ giao hàng: {"name":"huy le","phone":"0232323323","email":"","address":"02 lê lợi","distance":0,"delivery_type":"den_lay_tai_quan"}
Ghi chú: Tôi Yêu Đàn Bà
Trạng thái: da_dat_don
Ngày tạo: 2026-06-07 12:51:20.369701+00
---
ID: 75
Khách hàng ID: 73
Mã đơn hàng: VPC-DH-20260607-194213
Danh sách sản phẩm: [{"name":"Chanh sả gừng hạt chia","qty":1,"priceNum":58000,"priceLabel":"58.000đ"}]
Tổng tiền: 58000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: {"name":"huy le","phone":"0232323323","email":"","address":"02 lê lợi","distance":0,"delivery_type":"giao_hang_noi_thanh"}
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-07 12:42:14.746914+00
---
ID: 74
Khách hàng ID: 72
Mã đơn hàng: VPC-DH-20260607-194050
Danh sách sản phẩm: [{"name":"Chanh sả gừng hạt chia","qty":1,"priceNum":58000,"priceLabel":"58.000đ"}]
Tổng tiền: 58000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: {"name":"huy le","phone":"0232323323","email":"","address":"02 lê lợi","distance":0,"delivery_type":"giao_hang_noi_thanh"}
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-07 12:40:51.41796+00
---
ID: 73
Khách hàng ID: 71
Mã đơn hàng: VPC-DH-20260607-194033
Danh sách sản phẩm: [{"name":"Chanh sả gừng hạt chia","qty":1,"priceNum":58000,"priceLabel":"58.000đ"}]
Tổng tiền: 58000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: {"name":"huy le","phone":"0232323323","email":"","address":"02 lê lợi","distance":0,"delivery_type":"giao_hang_noi_thanh"}
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-07 12:40:34.404803+00
---
ID: 72
Khách hàng ID: 70
Mã đơn hàng: VPC-DH-20260606-230842
Danh sách sản phẩm: [{"name":"Bánh Croissant Hạnh Nhân","qty":1,"priceNum":39000,"priceLabel":"39.000đ"}]
Tổng tiền: 39000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: {"name":"Nguyễn Thị Tuyết Mai","phone":"0834240479","email":"","address":"100 ngự bình an cựu huế","distance":0,"delivery_type":"giao_hang_noi_thanh"}
Ghi chú: [SePay tự động] Xác nhận thanh toán thành công qua ngân hàng lúc 16:09:12 6/6/2026.
Trạng thái: da_thanh_toan
Ngày tạo: 2026-06-06 16:08:43.927678+00
---
ID: 71
Khách hàng ID: 69
Mã đơn hàng: VPC-DH-20260606-230700
Danh sách sản phẩm: [{"name":"item test","qty":3,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 3000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: {"name":"Mai","phone":"0834240479","email":"","address":"TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ","distance":0,"delivery_type":"giao_hang_noi_thanh"}
Ghi chú: [SePay tự động] Xác nhận thanh toán thành công qua ngân hàng lúc 16:07:26 6/6/2026.
Trạng thái: da_thanh_toan
Ngày tạo: 2026-06-06 16:07:02.310551+00
---
ID: 70
Khách hàng ID: 68
Mã đơn hàng: VPC-DH-20260606-223540
Danh sách sản phẩm: [{"name":"item test","qty":5,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 5000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: {"name":"Nguyễn Thị Tuyết Mai","phone":"0834240479","email":"","address":"TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ","distance":0,"delivery_type":"giao_hang_noi_thanh"}
Ghi chú: [SePay tự động] Xác nhận thanh toán thành công qua ngân hàng lúc 15:36:32 6/6/2026.
Trạng thái: dang_lam_don
Ngày tạo: 2026-06-06 15:35:41.90398+00
---
ID: 69
Khách hàng ID: 67
Mã đơn hàng: VPC-DH-20260606-214239
Danh sách sản phẩm: [{"name":"item test","qty":5,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 20000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-06 14:42:40.786471+00
---
ID: 68
Khách hàng ID: 66
Mã đơn hàng: VPC-DH-20260606-211315
Danh sách sản phẩm: [{"name":"item test","qty":5,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 20000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-06 14:13:17.377051+00
---
ID: 67
Khách hàng ID: 65
Mã đơn hàng: VPC-DH-20260606-195152
Danh sách sản phẩm: [{"name":"item test","qty":5,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 20000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-06 12:51:53.768362+00
---
ID: 66
Khách hàng ID: 64
Mã đơn hàng: VPC-DH-20260606-193449
Danh sách sản phẩm: [{"name":"Trà lá nếp sen vàng","qty":1,"priceNum":68000,"priceLabel":"68.000đ"}]
Tổng tiền: 83000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-06 12:34:50.57+00
---
ID: 65
Khách hàng ID: 63
Mã đơn hàng: VPC-DH-20260606-191756
Danh sách sản phẩm: [{"name":"Trà lá nếp sen vàng","qty":1,"priceNum":68000,"priceLabel":"68.000đ"}]
Tổng tiền: 83000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-06 12:17:59.055406+00
---
ID: 64
Khách hàng ID: 62
Mã đơn hàng: VPC-DH-20260606-191350
Danh sách sản phẩm: [{"name":"item test","qty":6,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 6000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: den_lay_tai_quan
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: [SePay tự động] Xác nhận thanh toán thành công qua ngân hàng lúc 12:14:39 6/6/2026.
Trạng thái: da_thanh_toan
Ngày tạo: 2026-06-06 12:13:51.348325+00
---
ID: 63
Khách hàng ID: 61
Mã đơn hàng: VPC-DH-20260606-190128
Danh sách sản phẩm: [{"name":"item test","qty":6,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 6000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: den_lay_tai_quan
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: 
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-06 12:01:29.21416+00
---
ID: 62
Khách hàng ID: 60
Mã đơn hàng: VPC-DH-20260606-185228
Danh sách sản phẩm: [{"name":"item test","qty":6,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 21000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-06 11:52:28.909255+00
---
ID: 61
Khách hàng ID: 59
Mã đơn hàng: VPC-DH-20260606-184004
Danh sách sản phẩm: [{"name":"item test","qty":6,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 21000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-06 11:40:06.613131+00
---
ID: 60
Khách hàng ID: 58
Mã đơn hàng: VPC-DH-20260606-181634
Danh sách sản phẩm: [{"name":"item test","qty":6,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 21000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-06 11:16:35.00442+00
---
ID: 59
Khách hàng ID: 57
Mã đơn hàng: VPC-DH-20260606-181616
Danh sách sản phẩm: [{"name":"item test","qty":6,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 21000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-06 11:16:18.685989+00
---
ID: 58
Khách hàng ID: 56
Mã đơn hàng: VPC-DH-20260606-164854
Danh sách sản phẩm: [{"name":"item test","qty":5,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 20000.00
Phí ship: 15000.00
Khoảng cách km: 2.80
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: đại học sư phạm huế
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-06 09:48:56.762752+00
---
ID: 57
Khách hàng ID: 55
Mã đơn hàng: VPC-DH-20260606-143020
Danh sách sản phẩm: [{"name":"item test","qty":3,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 18000.00
Phí ship: 15000.00
Khoảng cách km: 2.81
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: 66 Lê Lợi Thành phố Huế
Ghi chú: Ko
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-06 07:30:22.365963+00
---
ID: 56
Khách hàng ID: 54
Mã đơn hàng: VPC-DH-20260605-124846
Danh sách sản phẩm: [{"name":"item test","qty":4,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 19000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-05 05:48:49.51326+00
---
ID: 55
Khách hàng ID: 53
Mã đơn hàng: VPC-DH-20260605-105047
Danh sách sản phẩm: [{"name":"item test","qty":4,"priceNum":1000,"priceLabel":"1.000đ"}]
Tổng tiền: 19000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-05 03:50:49.96309+00
---
ID: 54
Khách hàng ID: 52
Mã đơn hàng: VPC-TEST-003
Danh sách sản phẩm: [{"qty": 2, "name": "Sinh tố Dâu", "priceNum": 55000, "priceLabel": "55.000đ"}, {"qty": 1, "name": "G7 3in1 hộp 21 sachets", "priceNum": 58000, "priceLabel": "58.000đ"}]
Tổng tiền: 168000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: Đến lấy tại quán
Phương thức thanh toán: Chuyển khoản ngân hàng
Địa chỉ giao hàng: 
Ghi chú: Đơn test mặt hàng đã mua
Trạng thái: da_thanh_toan
Ngày tạo: 2026-06-04 12:48:47.021491+00
---
ID: 53
Khách hàng ID: 52
Mã đơn hàng: VPC-TEST-002
Danh sách sản phẩm: [{"qty": 3, "name": "Trà đào cam sả", "priceNum": 50000, "priceLabel": "50.000đ"}, {"qty": 1, "name": "Bạc xỉu", "priceNum": 45000, "priceLabel": "45.000đ"}]
Tổng tiền: 195000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: Giao hàng tận nơi
Phương thức thanh toán: Thanh toán khi nhận hàng
Địa chỉ giao hàng: Huế
Ghi chú: Đơn test dashboard
Trạng thái: hoan_thanh
Ngày tạo: 2026-06-04 12:48:47.021491+00
---
ID: 52
Khách hàng ID: 52
Mã đơn hàng: VPC-TEST-001
Danh sách sản phẩm: [{"qty": 2, "name": "Coffee Legend (Đen)", "priceNum": 45000, "priceLabel": "45.000đ"}, {"qty": 1, "name": "Sinh tố Dâu", "priceNum": 55000, "priceLabel": "55.000đ"}]
Tổng tiền: 145000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: Đến lấy tại quán
Phương thức thanh toán: Chuyển khoản ngân hàng
Địa chỉ giao hàng: 
Ghi chú: Đơn test biểu đồ
Trạng thái: da_chuyen_khoan
Ngày tạo: 2026-06-04 12:48:47.021491+00
---
ID: 51
Khách hàng ID: 51
Mã đơn hàng: VPC-DH-20260604-130829
Danh sách sản phẩm: item test x4 - 1.000đ
Tổng tiền: 19000.00
Phí ship: 15000.00
Khoảng cách km: 2.18
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: 100 ngự bình an cựu huế
Ghi chú: [SePay xác nhận 2026-06-04T06:33:54.556Z] VPC-DH-20260604-130829 VPC-DH-20260604-130829
Trạng thái: da_chuyen_khoan
Ngày tạo: 2026-06-04 06:08:33.999793+00
---
ID: 50
Khách hàng ID: 50
Mã đơn hàng: VPC-DH-20260603-095714
Danh sách sản phẩm: item test x4 - 1.000đ
Tổng tiền: 4000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-03 02:57:16.762973+00
---
ID: 49
Khách hàng ID: 49
Mã đơn hàng: VPC-DH-20260603-083058
Danh sách sản phẩm: item test x4 - 1.000đ
Tổng tiền: 4000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-03 01:31:00.930617+00
---
ID: 48
Khách hàng ID: 48
Mã đơn hàng: VPC-DH-20260603-072210
Danh sách sản phẩm: item test x3 - 1.000đ
Tổng tiền: 3000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: da_thanh_toan
Ngày tạo: 2026-06-03 00:22:12.180914+00
---
ID: 46
Khách hàng ID: 46
Mã đơn hàng: VPC-DH-20260601-075220
Danh sách sản phẩm: item test x3 - 1.000đ
Tổng tiền: 18000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-06-01 00:52:23.375239+00
---
ID: 45
Khách hàng ID: 45
Mã đơn hàng: VPC-DH-20260530-193153
Danh sách sản phẩm: Cà phê Drip 1 - Culi Robusta x1 - 120.000đ
Tổng tiền: 145000.00
Phí ship: 25000.00
Khoảng cách km: 3.64
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: thanh_toan_khi_nhan_hang
Địa chỉ giao hàng: ga hue
Ghi chú: 
Trạng thái: da_dat_don
Ngày tạo: 2026-05-30 12:31:55.372935+00
---
ID: 44
Khách hàng ID: 44
Mã đơn hàng: VPC-DH-20260529-123008
Danh sách sản phẩm: item test x3 - 1.000đ
Tổng tiền: 18000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: da_chuyen_khoan
Ngày tạo: 2026-05-29 05:30:11.754486+00
---
ID: 43
Khách hàng ID: 43
Mã đơn hàng: VPC-DH-20260529-093541
Danh sách sản phẩm: item test x2 - 1.000đ
Tổng tiền: 2000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: den_lay_tai_quan
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-05-29 02:35:43.071681+00
---
ID: 42
Khách hàng ID: 42
Mã đơn hàng: VPC-DH-20260529-093408
Danh sách sản phẩm: item test x2 - 1.000đ
Tổng tiền: 2000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: den_lay_tai_quan
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-05-29 02:34:10.648744+00
---
ID: 39
Khách hàng ID: 41
Mã đơn hàng: VPC-DH-20260526-093330
Danh sách sản phẩm: Bánh ngọt các loại (Mousse/Croissant) x1 - 39.000đ
Tổng tiền: 54000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-05-26 02:33:41.399425+00
---
ID: 38
Khách hàng ID: 40
Mã đơn hàng: VPC-DH-20260526-081140
Danh sách sản phẩm: Bánh ngọt các loại (Mousse/Croissant) x1 - 39.000đ
Tổng tiền: 54000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: da_chuyen_khoan
Ngày tạo: 2026-05-26 01:11:42.526795+00
---
ID: 37
Khách hàng ID: 39
Mã đơn hàng: VPC-DH-20260526-081004
Danh sách sản phẩm: Năng Lượng Thành Công (Sữa) x1 - 60.000đ; Bánh ngọt các loại (Mousse/Croissant) x1 - 39.000đ; Bình giữ nhiệt Trung Nguyên Legend – Màu Trắng x1 - 350.000đ; Bình giữ nhiệt Trung Nguyên Legend (Màu Đen) x1 - 350.000đ; Bình giữ nhiệt Trung Nguyên Legend – Màu Xám x1 - 350.000đ; Ly Giữ Nhiệt Trung Nguyên Legend VF214 – 350ml x1 - 210.000đ
Tổng tiền: 1374000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-05-26 01:10:06.682605+00
---
ID: 35
Khách hàng ID: 38
Mã đơn hàng: VPC-DH-20260525-101536
Danh sách sản phẩm: Coffee Legend  x1 - 165.000đ; Năng Lượng Sáng Tạo x1 - Đen: 50.000đ / Sữa: 55.000đ; Panna Cotta x1 - 25.000đ; Sữa tươi thêm x1 - 10.000đ; Trà xanh thạch cà phê x1 - 63.000đ; Success Sữa Đá x1 - 50.000đ
Tổng tiền: 378000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-05-25 03:15:39.594083+00
---
ID: 34
Khách hàng ID: 37
Mã đơn hàng: VPC-DH-20260525-100907
Danh sách sản phẩm: Coffee Legend  x1 - 165.000đ; Năng Lượng Sáng Tạo x1 - Đen: 50.000đ / Sữa: 55.000đ
Tổng tiền: 230000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: da_chuyen_khoan
Ngày tạo: 2026-05-25 03:09:10.259072+00
---
ID: 33
Khách hàng ID: 36
Mã đơn hàng: VPC-DH-20260525-100723
Danh sách sản phẩm: Coffee Legend  x1 - 165.000đ; Năng Lượng Sáng Tạo x1 - Đen: 50.000đ / Sữa: 55.000đ
Tổng tiền: 230000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: da_chuyen_khoan
Ngày tạo: 2026-05-25 03:07:28.124541+00
---
ID: 32
Khách hàng ID: 35
Mã đơn hàng: VPC-DH-20260523-223353
Danh sách sản phẩm: Matcha Yến Mạch x1 - 68.000đ
Tổng tiền: 68000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: den_lay_tai_quan
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: 102 an dương vương
Ghi chú: chuối
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-05-23 15:33:55.159769+00
---
ID: 31
Khách hàng ID: 34
Mã đơn hàng: VPC-DH-20260523-215334
Danh sách sản phẩm: Năng Lượng Ý Tưởng (Đen) x1 - 46.000đ; Năng Lượng Tư Duy (Đen) x1 - 36.000đ
Tổng tiền: 82000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: den_lay_tai_quan
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: hdscbsdcm
Ghi chú: ydgsshc
Trạng thái: da_chuyen_khoan
Ngày tạo: 2026-05-23 14:53:34.089085+00
---
ID: 30
Khách hàng ID: 33
Mã đơn hàng: VPC-DH-20260523-215319
Danh sách sản phẩm: Năng Lượng Ý Tưởng (Đen) x1 - 46.000đ; Năng Lượng Tư Duy (Đen) x1 - 36.000đ
Tổng tiền: 82000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: den_lay_tai_quan
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: hdscbsdcm
Ghi chú: ydgsshc
Trạng thái: da_chuyen_khoan
Ngày tạo: 2026-05-23 14:53:20.526552+00
---
ID: 29
Khách hàng ID: 32
Mã đơn hàng: VPC-DH-20260523-212555
Danh sách sản phẩm: Coffee Legend  x1 - 165.000đ; Năng Lượng Sáng Tạo x1 - Đen: 50.000đ / Sữa: 55.000đ
Tổng tiền: 230000.00
Phí ship: 15000.00
Khoảng cách km: 2.18
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: 100 ngự bình an cựu huế
Ghi chú: 
Trạng thái: da_chuyen_khoan
Ngày tạo: 2026-05-23 14:25:59.00225+00
---
ID: 28
Khách hàng ID: 31
Mã đơn hàng: VPC-DH-20260523-210306
Danh sách sản phẩm: Coffee Legend  x1 - 165.000đ
Tổng tiền: 180000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: da_chuyen_khoan
Ngày tạo: 2026-05-23 14:03:08.606031+00
---
ID: 27
Khách hàng ID: 30
Mã đơn hàng: VPC-DH-20260523-205511
Danh sách sản phẩm: Coffee Legend  x1 - 165.000đ
Tổng tiền: 180000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-05-23 13:55:15.197726+00
---
ID: 26
Khách hàng ID: 29
Mã đơn hàng: VPC-DH-20260523-203904
Danh sách sản phẩm: Cà phê Sáng tạo 1 - 250gr x1 - 93.000đ; Cà phê Sáng tạo 8 - 500gr x1 - 625.000đ; Coffee Legend  x2 - 165.000đ
Tổng tiền: 1063000.00
Phí ship: 15000.00
Khoảng cách km: 2.18
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: 100 ngự bình an cựu hue
Ghi chú: 
Trạng thái: da_thanh_toan
Ngày tạo: 2026-05-23 13:39:06.879694+00
---
ID: 25
Khách hàng ID: 28
Mã đơn hàng: VPC-DH-20260523-203850
Danh sách sản phẩm: Cà phê Sáng tạo 1 - 250gr x1 - 93.000đ; Cà phê Sáng tạo 8 - 500gr x1 - 625.000đ; Coffee Legend  x2 - 165.000đ
Tổng tiền: 1063000.00
Phí ship: 15000.00
Khoảng cách km: 2.18
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: 100 ngự bình an cựu hue
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-05-23 13:38:53.241952+00
---
ID: 19
Khách hàng ID: 22
Mã đơn hàng: VPC-DH-20260521-154435
Danh sách sản phẩm: Coffee Legend  x2 - 165.000đ; Americano x1 - 42.000đ
Tổng tiền: 387000.00
Phí ship: 15000.00
Khoảng cách km: 1.08
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: TRƯỜNG ĐẠI HỌC KINH TẾ HUẾ
Ghi chú: 
Trạng thái: cho_chuyen_khoan
Ngày tạo: 2026-05-22 02:17:11.596342+00
---
ID: 18
Khách hàng ID: 21
Mã đơn hàng: VPC-DH-20260521-152132
Danh sách sản phẩm: Cà phê dừa x1 - 79.000đ; Coffee Legend  x1 - 165.000đ
Tổng tiền: 259000.00
Phí ship: 15000.00
Khoảng cách km: 2.18
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: thanh_toan_khi_nhan_hang
Địa chỉ giao hàng: 100 ngự bình an cựu huế
Ghi chú: 
Trạng thái: da_dat_don
Ngày tạo: 2026-05-21 08:44:35.582955+00
---
ID: 17
Khách hàng ID: 20
Mã đơn hàng: VPC-DH-20260521-152004
Danh sách sản phẩm: Cà phê Sáng tạo 1 - 250gr x1 - 93.000đ
Tổng tiền: 123000.00
Phí ship: 15000.00
Khoảng cách km: 2.25
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: thanh_toan_khi_nhan_hang
Địa chỉ giao hàng: trường Đại học Khoa học Huế, Thành phố Huế
Ghi chú: 
Trạng thái: da_dat_don
Ngày tạo: 2026-05-21 08:21:32.586811+00
---
ID: 16
Khách hàng ID: 19
Mã đơn hàng: VPC-DH-20260521-145405
Danh sách sản phẩm: Coffee Legend  x1 - 165.000đ
Tổng tiền: 195000.00
Phí ship: 15000.00
Khoảng cách km: 2.18
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: thanh_toan_khi_nhan_hang
Địa chỉ giao hàng: 100 ngự bình an cựu huế
Ghi chú: 
Trạng thái: da_dat_don
Ngày tạo: 2026-05-21 08:20:04.599129+00
---
ID: 15
Khách hàng ID: 18
Mã đơn hàng: VPC-DH-20260521-145252
Danh sách sản phẩm: Cà phê dừa x1 - 79.000đ; Cà phê muối Legend x1 - 63.000đ; Cà phê trứng x1 - 79.000đ
Tổng tiền: 221000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: thanh_toan_khi_nhan_hang
Địa chỉ giao hàng: Ngõ 44 Hoàng Diệu Đồng Hới
Ghi chú: 
Trạng thái: da_dat_don
Ngày tạo: 2026-05-21 07:54:03.701824+00
---
ID: 14
Khách hàng ID: 17
Mã đơn hàng: VPC-DH-20260520-162129
Danh sách sản phẩm: Cà phê dừa x1 - 79.000đ; Matcha Yến Mạch x1 - 68.000đ; Bánh ngọt các loại (Mousse/Croissant) x1 - 39.000đ
Tổng tiền: 186000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: 100 ngự bình
Ghi chú: 
Trạng thái: 
Ngày tạo: 2026-05-21 07:52:42.121049+00
---
ID: 13
Khách hàng ID: 13
Mã đơn hàng: DH1779268887152
Danh sách sản phẩm: Coffee Legend  x2 - 165.000đ
Tổng tiền: 330000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: thanh_toan_khi_nhan_hang
Địa chỉ giao hàng: Ngõ 44 Hoàng Diệu Đồng Hới
Ghi chú: 
Trạng thái: don_moi
Ngày tạo: 2026-05-20 16:21:27.16+00
---
ID: 12
Khách hàng ID: 12
Mã đơn hàng: DH1779267158493
Danh sách sản phẩm: Coffee Legend  x2 - 165.000đ
Tổng tiền: 330000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: thanh_toan_khi_nhan_hang
Địa chỉ giao hàng: Ngõ 44 Hoàng Diệu Đồng Hới
Ghi chú: 
Trạng thái: don_moi
Ngày tạo: 2026-05-20 15:52:38.493+00
---
ID: 11
Khách hàng ID: 11
Mã đơn hàng: DH1779266979002
Danh sách sản phẩm: Coffee Legend  x2 - 165.000đ
Tổng tiền: 330000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: thanh_toan_khi_nhan_hang
Địa chỉ giao hàng: Ngõ 44 Hoàng Diệu Đồng Hới
Ghi chú: 
Trạng thái: don_moi
Ngày tạo: 2026-05-20 15:49:39.007+00
---
ID: 10
Khách hàng ID: 10
Mã đơn hàng: DH1779266945957
Danh sách sản phẩm: Coffee Legend  x2 - 165.000đ
Tổng tiền: 330000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: Ngách 41 Ngõ 44 Hoàng Diệu Đồng Hới Quảng Bình
Ghi chú: 
Trạng thái: don_moi
Ngày tạo: 2026-05-20 15:49:05.963+00
---
ID: 9
Khách hàng ID: 9
Mã đơn hàng: DH1779266932220
Danh sách sản phẩm: Coffee Legend  x2 - 165.000đ
Tổng tiền: 330000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: Ngách 41 Ngõ 44 Hoàng Diệu Đồng Hới
Ghi chú: 
Trạng thái: don_moi
Ngày tạo: 2026-05-20 15:48:52.227+00
---
ID: 8
Khách hàng ID: 8
Mã đơn hàng: DH1779266203593
Danh sách sản phẩm: Coffee Legend  x2 - 165.000đ
Tổng tiền: 330000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: Trung Nguyên Legend Âu Lạc
Ghi chú: 
Trạng thái: don_moi
Ngày tạo: 2026-05-20 15:36:43.593+00
---
ID: 7
Khách hàng ID: 7
Mã đơn hàng: DH1779265897949
Danh sách sản phẩm: Coffee Legend  x2 - 165.000đ
Tổng tiền: 330000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: giao_hang_noi_thanh
Phương thức thanh toán: chuyen_khoan
Địa chỉ giao hàng: Trung Nguyên Legend Âu Lạc
Ghi chú: 
Trạng thái: don_moi
Ngày tạo: 2026-05-20 15:31:37.96+00
---
ID: 4
Khách hàng ID: 4
Mã đơn hàng: DH1779072474647
Danh sách sản phẩm: Coffee Legend  x1 - 165.000đ
Tổng tiền: 165000.00
Phí ship: 0.00
Khoảng cách km: 0.00
Hình thức nhận hàng: den_lay_tai_quan
Phương thức thanh toán: thanh_toan_khi_nhan_hang
Địa chỉ giao hàng: sdADSAsASQdwqd
Ghi chú: 
Trạng thái: don_moi
Ngày tạo: 2026-05-18 09:47:54.66+00
---