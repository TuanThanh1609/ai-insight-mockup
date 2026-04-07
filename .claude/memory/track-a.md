# Track A — Cài Đặt Insight (Chi Tiết)

> Nguồn truth: `template-insight.md` — mọi thay đổi về prompt/column phải cập nhật vào đây.

## A1. Mục Tiêu & Tổng Quan

**Mục tiêu:** AI Engine phân tích hội thoại đa kênh → trả về structured data fields theo prompt được cấu hình sẵn theo từng ngành.

**Cấu trúc:** 7 ngành × 6 insight = 42 template. Mỗi insight gồm 2–5 cột (field/prompt) có kiểu dữ liệu cố định.

**Output của AI:** Một đoạn chat → nhiều dòng structured data (mỗi dòng = 1 conversation × 1 insight × N columns)

## A2. Các Ngành & Key Insight Đặc Thù

| # | Ngành | Key Insight | Đặc thù nổi bật |
|---|-------|------------|-----------------|
| 1 | Thời trang (Fashion) | Lead Temperature, Competitor, Retargeting | Size, mùa, hàng real/fake |
| 2 | Mẹ và Bé (Mother & Baby) | Safety Concern, Baby Age, Bulk Interest | An toàn sản phẩm, tuổi bé |
| 3 | Mỹ phẩm / Làm đẹp (Cosmetics) | Skin Type, Ingredient Concern, Real/Fake | Da dầu/khô/nhạy cảm, K-beauty |
| 4 | Spa / Thẩm mỹ (Beauty Salon) | Treatment Type, Booking Intent, Before-After | Liệu trình, bác sĩ, đặt lịch |
| 5 | Bất động sản (Real Estate) | Legal Status, Budget, Site Visit | Pháp lý, sổ đỏ/sổ hồng, cò mồi |
| 6 | F&B — Nhà hàng / Ăn uống | Booking/Delivery Intent, Food Review | Đặt bàn, giao hàng, app delivery |
| 7 | Tư vấn Du lịch (Travel) | Destination, OTA Competitor, Deposit Intent | OTA, visa, đặt cọc |

## A3. 6 Insight Pattern Chung (Áp Dụng Mọi Ngành)

Mỗi ngành đều có đúng 6 insight theo pattern nhất quán:

| # | Tên Insight | Các Cột (Columns) |
|---|------------|-------------------|
| 1 | Phân Tích Nhu Cầu Khách Hàng | Sản phẩm, Pain Point, Lead Temperature |
| 2 | Đánh Giá Chất Lượng Nguồn Lead (Ads) | Junk Lead, SĐT thu thập, Objection, Ads Source |
| 3 | Đánh Giá Nhân Viên Tư Vấn | Thái độ tư vấn, Lỗi mất khách |
| 4 | Phân Tích Chân Dung Khách Hàng | Giới tính, Location, Budget, Customer Segment |
| 5 | Phân Tích Đối Thủ Cạnh Tranh | Competitor mentioned, Tên, Tiêu chí so sánh |
| 6 | Phân Tích Hậu Mua / Chăm Sóc Sau Mua | Post-purchase intent, Urgency, Review risk |

## A4. Kiểu Dữ Liệu Của Các Cột (Field Types)

| Kiểu | Mô tả | Ví dụ |
|------|--------|-------|
| `True / False` | Boolean trả lời đúng/sai | Junk Lead, Bức xúc |
| `Short Text` | Văn bản ngắn dưới 12 chữ | Sản phẩm, Pain Point |
| `Single Choice` | 1 lựa chọn trong dropdown | Lead Temperature, Giới tính |
| `Multi-tag / Dropdown` | 1 hoặc nhiều tag | Objection, Tiêu chí so sánh |

## A5. Key Fields Quan Trọng

### Lead Temperature — Dùng chung
- **Nóng:** Hỏi giá + xin SĐT + hỏi "còn không" + hỏi mua ngay → cần ≥ 2 tín hiệu
- **Ấm:** Đang tư vấn, hỏi thêm nhưng chưa chốt
- **Lạnh:** 1 câu + seen không rep, HOẶC từ chối trực tiếp

### Junk Lead — Dùng chung
- **True** khi: khách gửi tin tự động từ ads rồi không rep, chat không liên quan, bấm nhầm
- Ngược lại → **False**

### Objection — Khác nhau theo ngành
- **Thời trang:** Giá đắt, Phí ship, Không có size, Hàng fake
- **Mẹ và Bé:** Lo ngại an toàn, Hỏi chồng
- **Mỹ phẩm:** Lo ngại hàng fake, Hỏi về thành phần
- **BDS:** Pháp lý chưa rõ, Ngân sách không xác nhận
- **F&B:** Quá xa, Không có chi nhánh gần
- **Du lịch:** So sánh với OTA (Traveloka/Agoda)

### Priority Escalation — Xử lý KHẨN cấp
- **Thời trang/F&B/Du lịch:** Review xấu, dọa bóc phốt
- **Mẹ và Bé:** Khiếu nại an toàn sản phẩm (sức khỏe con)
- **Mỹ phẩm:** Khiếu nại dị ứng, phản ứng da
- **Spa/Thẩm mỹ:** Phản ứng bất lợi sau dịch vụ
- **BDS:** Khiếu nại chất lượng xây dựng, pháp lý

## A6. Luật Xử Lý Quan Trọng

### Từ ngữ tiêu cực → Bức xúc = True
- "tức", "dọa", "kiện", "bóc phốt", "đăng review xấu", "hoàn tiền", "trả hàng"
- Đặc biệt nghiêm trọng khi liên quan sức khỏe / an toàn

### Từ ngữ tích cực → Giới thiệu được = True
- "giới thiệu bạn", "quay lại", "review tốt", "khen", "sẽ ủng hộ"

### Single Choice quy tắc
- Khách hỏi nhiều thứ → chọn tiêu chí nổi bật nhất / mới nhất
- Không đề cập → giá trị mặc định: "Không xác định" / "Không đề cập"

### Ngưỡng Lead Temperature
- **Nóng:** ≥ 2 tín hiệu chốt (hỏi giá + hỏi còn hàng + để lại SĐT)
- **Lạnh:** 1 câu + seen không rep HOẶC từ chối trực tiếp

## A7. Các File Track A

| File | Vai trò |
|------|---------|
| `src/pages/InsightSettings.jsx` | Layout chính — Template library + insight management |
| `src/components/insight/TemplateLibrary.jsx` | Thư viện template, lọc theo ngành/insight |
| `src/components/insight/TemplateCard.jsx` | Card template, preview prompt + columns |
| `src/components/insight/CreateInsightFromScratchModal.jsx` | Modal tạo insight mới từ đầu |
| `src/components/insight/ColumnTemplatePicker.jsx` | Chọn kiểu cột (field type) khi tạo insight |
| `src/components/insight/InsightTable.jsx` | Bảng hiển thị insight với columns |
| `src/components/insight/InsightDetailModal.jsx` | Modal chi tiết insight |
| `src/components/insight/AIInsightPanel.jsx` | Panel AI phân tích chat |
| `src/components/insight/InsightDetail.jsx` | Full-page detail view (không còn modal) |
| `src/components/insight/DynamicMetricsGrid.jsx` | Dynamic metrics grid với 6+ chart types |
| `src/components/insight/InsightTrendChart.jsx` | Stacked Bar/Area chart xu hướng |
| `src/data/mockTemplates.js` | Danh sách template (7 ngành × 6 insight) |
| `src/data/mockConversations.js` | Dữ liệu chat mẫu |
| `src/data/mockAnalysisResults.js` | Kết quả phân tích AI mẫu |
| `src/lib/mockDataService.js` | Runtime generator + computeAnalysisFromConversations |
| `src/lib/aiService.js` | AI service cho Custom AI endpoint |
| `src/data/supabase-conversations.json` | 3075+ rows từ Supabase |

**Nguồn truth cho prompt:** `template-insight.md` — mọi thay đổi về prompt/column phải cập nhật vào đây.

## A8. Luồng Thêm Ngành Mới

1. Copy pattern từ ngành gần nhất trong `template-insight.md`
2. Tạo 6 insight theo đúng 6 pattern chung (xem A3)
3. Điều chỉnh **Objection** và **Priority** theo đặc thù ngành (xem A5)
4. Thêm vào `mockTemplates.js`
5. Cập nhật `template-insight.md`
