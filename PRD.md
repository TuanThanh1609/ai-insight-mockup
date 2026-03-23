TÀI LIỆU YÊU CẦU SẢN PHẨM (PRD)

Tên tính năng: Module Insight Ads (Cài đặt Insight & Báo cáo AI Đa kênh)
Người phụ trách (Owner): Tuấn
Trạng thái: Đang lên kế hoạch (Planning)
Độ ưu tiên: Cao (Chiến lược trọng điểm năm tới)

1. TỔNG QUAN DỰ ÁN (OVERVIEW)

1.1 Mục tiêu (Objective)

Xây dựng một Module chiến lược nhắm đến tệp khách hàng chạy Quảng cáo (Ads) và chăm sóc khách hàng trên đa nền tảng. Hệ thống sử dụng AI để phân tích nội dung hội thoại đa kênh (Facebook Messenger, Zalo OA, v.v.), kết nối với dữ liệu ID Chiến dịch quảng cáo (Ad ID) nhằm đánh giá chất lượng Lead (khách hàng tiềm năng) và đưa ra các đề xuất tối ưu chi phí quảng cáo (Ad spend) một cách thực tế, thay vì chỉ dựa trên các chỉ số kỹ thuật thông thường.

1.2 Bài toán hiện tại (Problem Statement)

Khó khăn trong Onboarding: Hiện tại, khi người dùng mới vào hệ thống Automation/AI, họ phải tự nghĩ ra các trường dữ liệu cần phân tích cho từng kênh. Quá trình này mất từ 10-20 phút, rất phức tạp và khiến người dùng dễ bỏ cuộc.

Hạn chế của báo cáo Ads truyền thống: Marketer chỉ nhìn thấy chiến dịch nào đắt/rẻ dựa trên giá mỗi tin nhắn (Cost per Message). Họ không biết được chiến dịch đó mang lại khách hàng có nhu cầu thật hay toàn "khách rác" (spam, hỏi cho vui), đặc biệt khó khăn khi đo lường chéo giữa việc click quảng cáo Facebook nhưng nhắn tin qua Zalo.

1.3 Giải pháp (Solution)

Đơn giản hóa quá trình cài đặt bằng hệ thống Template (Mẫu có sẵn) áp dụng chung hoặc tùy biến cho đặc thù từng kênh (Facebook/Zalo): "Click phát ăn luôn".

Xây dựng Dashboard Báo cáo AI: Phân tích nội dung chat đa kênh để đánh giá hiệu quả chiến dịch quảng cáo và gợi ý hành động cụ thể (Tắt/Bật chiến dịch).

2. PHẠM VI DỰ ÁN & YÊU CẦU CHI TIẾT (SCOPE & REQUIREMENTS)

Dự án được chia làm 2 Giai đoạn (Phases) do Tuấn chịu trách nhiệm phân tích và thiết kế luồng.

Phase 1: Xây dựng Thư viện Template Cài đặt Insight (Cấu hình)

Mục tiêu: Rút ngắn thời gian thiết lập cấu hình phân tích AI của người dùng xuống dưới 2 phút cho mọi kênh giao tiếp.

Yêu cầu tính năng:

Giao diện chọn Template (Template Library):

Khi người dùng click vào "Thêm mới Insight", hiển thị Popup/Modal chứa các Mẫu cấu hình đã được tạo sẵn (Có thể lọc theo Nền tảng: All, Facebook, Zalo).

Template cấp độ Bảng (Table Templates):

Tuấn cần nghiên cứu và định nghĩa sẵn các bộ Bảng tiêu chuẩn.

Ví dụ bắt buộc: Phân tích Nhu cầu khách hàng đa kênh, Phân tích phản hồi về nhân viên Sale, Phân tích chất lượng nguồn Lead từ Ads.

Template cấp độ Cột (Column Templates / AI Prompts):

Bên trong mỗi Bảng, hệ thống tự động sinh ra (hoặc cho phép chọn nhanh) các Cột dữ liệu mẫu. Các cột này thực chất là các câu lệnh (Prompt) yêu cầu AI bóc tách thông tin từ đoạn chat.

Các Cột mẫu cần có:

Sản phẩm/Dịch vụ khách hàng quan tâm là gì?

Khách hàng có để lại Số điện thoại không? (Dạng True/False).

Khách hàng này có đi từ nguồn Quảng cáo (Ads) vào không? (Kể cả Click-to-Zalo hay Click-to-Messenger).

Đánh giá nhu cầu của khách (Nóng/Ấm/Lạnh).

Đánh giá thái độ/cách trả lời của nhân viên tư vấn.

Phase 2: Xây dựng Dashboard Thống kê Ads AI (Báo cáo)

Mục tiêu: Cung cấp cho Marketer cái nhìn tổng quan về hiệu quả chiến dịch dựa trên chất lượng hội thoại, gom chung dữ liệu từ Facebook và Zalo vào một màn hình duy nhất.

Yêu cầu tính năng:

Thu thập dữ liệu:

Hệ thống tự động map (nối) dữ liệu hội thoại từ Inbox đa kênh với các dữ liệu chiến dịch mới (Ad ID, Campaign ID).

Dashboard Thống kê Tổng quan (Overview/Statistic):

Tạo một trang Dashboard chuyên biệt cho dân chạy Ads.

Hiển thị các chỉ số tổng quan: Tổng hội thoại, Hội thoại từ Ads (chia tỷ trọng Zalo/Facebook), Tỉ lệ chuyển đổi, Chi tiêu, v.v.

Tính năng "Đề xuất Chiến lược AI" (Core Feature):

Giao diện cần hiển thị danh sách các Chiến dịch (Campaigns) đang chạy trên các nền tảng.

Thay vì chỉ báo cáo số liệu vô hồn, AI phải đưa ra kết luận từ nội dung chat.

Ví dụ Output yêu cầu: * AI gắn cảnh báo: "Nên tắt Campaign A (Facebook) vì tỉ lệ khách rác/không tương tác lại quá cao".

AI gợi ý: "Nên vít thêm ngân sách Campaign B (Click-to-Zalo) vì khách hỏi sâu về sản phẩm và tỷ lệ chốt đơn cao".

Gợi ý ra các chiến dịch "Rác" (Junk Campaigns).

3. LUỒNG NGƯỜI DÙNG CƠ BẢN (USER FLOW)

Luồng Cài đặt nhanh (Phase 1):

User vào mục Cài đặt Insight -> Click Thêm mới.

Hệ thống hiển thị thư viện Template (có badge nhận diện Facebook/Zalo).

User chọn Template "Phân tích nhu cầu khách hàng chạy Ads Đa kênh".

Hệ thống tự động tạo Bảng và add sẵn 5-6 Cột phân tích mẫu (SĐT, Sản phẩm quan tâm, Mức độ nóng...).

User bấm Lưu -> AI bắt đầu chạy phân tích trên các hội thoại mới từ tất cả các kênh đã kết nối.

Luồng Xem Báo cáo (Phase 2):

User truy cập tab Thống kê / Dashboard Ads.

User nhìn thấy biểu đồ tổng quan nguồn khách từ Facebook và Zalo.

User lướt xuống bảng chi tiết các Ad ID.

User đọc cột "Gợi ý từ AI" để quyết định vào Trình quản lý quảng cáo (Facebook Ads Manager / Zalo Ads) tắt/bật chiến dịch tương ứng.

4. CHỈ SỐ THÀNH CÔNG (SUCCESS METRICS)

Time-to-value: Giảm thời gian cài đặt một Insight mới từ 10-20 phút xuống còn < 2 phút.

Adoption Rate: > 60% khách hàng có kết nối Fanpage/Zalo OA sử dụng các Template Insight có sẵn.

Engagement: Thời gian người dùng (đặc biệt là role Marketer/Ads) lưu lại trên trang Dashboard Báo cáo tăng lên 30%.

5. NHIỆM VỤ TIẾP THEO DÀNH CHO TUẤN (ACTION ITEMS)

$$$$

 Task 1: Lên danh sách chi tiết (Excel/Miro) toàn bộ các Template Bảng và Template Cột cần thiết cho dân chạy Ads trên cả Facebook và Zalo. Viết sẵn Prompt mô tả cho từng cột để truyền cho AI.

$$$$

 Task 2: Vẽ Wireframe (bản nháp giao diện) cho màn hình chọn Template (Phase 1), lưu ý bộ lọc hoặc tab phân loại theo kênh giao tiếp.

$$$$

 Task 3: Vẽ Wireframe cho màn hình Dashboard Thống kê Ads (Phase 2), xác định rõ vị trí đặt các dòng "Cảnh báo/Gợi ý tắt bật chiến dịch của AI" và icon phân biệt nguồn Zalo/Facebook.

$$$$

 Task 4: Phối hợp với team Data/Backend để đảm bảo việc lấy và đồng bộ Ad ID với dữ liệu hội thoại đa kênh đang diễn ra ổn định.