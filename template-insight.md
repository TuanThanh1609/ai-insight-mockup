# BỘ TEMPLATE AI INSIGHT (PROMPTS)
## Theo Ngành — Tự động hóa phân tích hội thoại đa kênh

> Tài liệu này chứa cấu hình chi tiết cho các **Bảng** và **Cột** (các câu lệnh Prompt) để AI Engine phân tích dữ liệu từ các đoạn hội thoại đa kênh (Facebook, Zalo, Website Chat...).
>
> **Cấu trúc:** 7 ngành × 6 insight mẫu = 42 template sẵn dùng. Mỗi ngành có 6 insight phù hợp với đặc thù kinh doanh riêng.

---

## NHÓM NGÀNH 1: THỜI TRANG

### Ngành: Thời trang (Fashion / Clothing Store)

**Đặc thù ngành:**
- Sản phẩm đa dạng về size, màu sắc, chất liệu
- Tỉ lệ khách hỏi size rất cao (→ cần track size interest)
- Khách thường so sánh với thương hiệu khác (→ cần competitor tracking)
- Mùa / trend ảnh hưởng lớn đến nhu cầu
- Retargeting khách cũ rất quan trọng (→ cần purchase intent)

---

#### Insight 1: Phân Tích Nhu Cầu Khách Hàng Thời Trang

**Mục đích:** Giúp Marketer và Sale nắm bắt nhanh khách đang muốn gì — phong cách, size, mức giá — mà không cần đọc lại toàn bộ tin nhắn.

**1. Sản phẩm / Mẫu quan tâm**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Trích xuất tên chính xác sản phẩm, mã sản phẩm, hoặc loại item khách đang hỏi trong đoạn hội thoại. Nếu hỏi chung chung ("có gì mới không"), ghi "Không xác định".

**2. Size quan tâm**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách hàng có hỏi về size nào không? Trích xuất size được nhắc đến (VD: "M", "Size L", "Freesize", "38", "fit M"). Nếu không hỏi size, ghi "Không đề cập".

**3. Mức độ quan tâm (Lead Temperature)**

- Loại dữ liệu: Lựa chọn đơn (Nóng / Ấm / Lạnh)
- AI Prompt: Phân tích toàn bộ hội thoại và phân loại:
  - **Nóng:** Chủ động hỏi giá, hỏi phí ship, xin địa chỉ cửa hàng, để lại SĐT, hỏi "còn không", hỏi "mua ngay được không".
  - **Ấm:** Đang nhờ tư vấn thêm về size/màu/chất liệu nhưng chưa chốt.
  - **Lạnh:** Chỉ nhắn "chấm", hỏi một câu rồi không rep (seen không rep), hoặc từ chối mua.

**4. Nhu cầu cốt lõi (Pain Point)**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Dựa vào nội dung chat, khách đang gặp vấn đề gì hoặc mong muốn điều gì lớn nhất? (VD: "Tìm đầm đi tiệc dưới 1 triệu", "Cần áo len dày cho mùa đông", "Mua quà sinh nhật mẹ"). Tóm tắt dưới 12 chữ.

---

#### Insight 2: Đánh Giá Chất Lượng Nguồn Lead Ads Thời Trang

**Mục đích:** Dashboard đề xuất TẮT / BẬT chiến dịch quảng cáo dựa trên chất lượng lead thực tế.

**1. Khách hàng rác (Junk Lead)**

- Loại dữ liệu: True / False
- AI Prompt: Trả lời True nếu: khách gửi tin nhắn tự động từ quảng cáo rồi không rep lại dù Sale đã chat; khách chat nội dung không liên quan; khách bấm nhầm. Ngược lại, nếu khách có tương tác thực sự, trả False.

**2. Trạng thái thu thập SĐT**

- Loại dữ liệu: Lựa chọn đơn (Đã cho SĐT / Chưa cho / Khách từ chối)
- AI Prompt: Kiểm tra khách đã cung cấp SĐT hợp lệ trong đoạn chat chưa. Đã cho SĐT nếu tìm thấy số. Khách từ chối nếu Sale xin nhưng khách bảo không tiện. Chưa cho nếu Sale chưa xin hoặc khách chưa gửi.

**3. Rào cản chốt đơn (Objection)**

- Loại dữ liệu: Phân loại (Dropdown / Tags)
- AI Prompt: Xác định lý do chính khiến khách hàng lưỡng lự. Chỉ xuất ra 1 trong: Chê giá đắt, Phí ship cao, Chưa tin tưởng chất lượng / hàng real, Hỏi cho biết, Cần hỏi ý kiến người thân, Không có size, Đang cân nhắc nhiều shop, Không có rào cản.

**4. Nguồn Ads**

- Loại dữ liệu: Lựa chọn đơn (Facebook Ads / Zalo Ads / Tiktok Ads / Không rõ)
- AI Prompt: Dựa vào nội dung hội thoại hoặc tag hệ thống, xác định khách đến từ nguồn quảng cáo nào. Nếu không xác định được, ghi "Không rõ".

---

#### Insight 3: Đánh Giá Nhân Viên Tư Vấn Thời Trang

**Mục đích:** Kiểm soát chất lượng phản hồi của team chăm sóc khách hàng.

**1. Đánh giá Thái độ tư vấn**

- Loại dữ liệu: Lựa chọn đơn (Tốt / Trung bình / Kém)
- AI Prompt: Đánh giá thái độ của nhân viên Sale:
  - **Tốt:** Lịch sự (có dạ/vâng/cảm ơn), trả lời đúng trọng tâm, CÓ đặt câu hỏi mở ("Anh/chị thích phong cách nào ạ?", "Dùng cho dịp nào ạ?"), hỗ trợ khách chọn size.
  - **Trung bình:** Trả lời đủ thông tin nhưng thụ động, khách hỏi gì đáp nấy.
  - **Kém:** Trả lời cộc lốc, trả lời sai câu hỏi về size/màu/số lượng, thiếu tôn trọng.

**2. Lỗi mất khách do Sale**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Nếu khách tỏ không hài lòng hoặc dừng chat, tìm xem Sale có mắc lỗi gì? Tóm tắt dưới 10 chữ (VD: "Không tư vấn size", "Bỏ quên khách", "Trả lời giá sai"). Nếu Sale làm tốt hoặc khách tự không mua vì lý do cá nhân, ghi "Không có lỗi".

---

#### Insight 4: Phân Tích Chân Dung Khách Hàng Thời Trang

**Mục đích:** Trích xuất dữ liệu nhân khẩu học giúp Marketer target Ads chính xác hơn.

**1. Giới tính dự đoán**

- Loại dữ liệu: Lựa chọn đơn (Nam / Nữ / Không rõ)
- AI Prompt: Dựa vào cách xưng hô (anh/chị/em/mình/tớ) hoặc tên hiển thị, dự đoán giới tính. Nếu không có dấu hiệu, ghi "Không rõ".

**2. Khu vực địa lý (Location)**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách nhắc đến đang ở đâu hoặc muốn giao đến tỉnh/thành/phố/quận/huyện nào? Trích xuất địa danh đó. Nếu không, ghi "Không xác định".

**3. Khoảng ngân sách**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách có nhắc đến giới hạn số tiền họ có thể chi trả không? (VD: "dưới 300k", "tầm 500k - 1 triệu", "không giới hạn"). Trích xuất khoảng giá đó. Nếu không, ghi "Không đề cập".

**4. Phân loại khách hàng**

- Loại dữ liệu: Lựa chọn đơn (Khách mới / Khách quen / Khách hoàn tiền)
- AI Prompt: Dựa vào nội dung chat và hành vi, khách này thuộc loại nào? Khách quen nếu có dấu hiệu đã mua hoặc nhắc đến đơn cũ. Khách hoàn tiền nếu hỏi về trả hàng/hoàn tiền. Các trường hợp còn lại là Khách mới.

---

#### Insight 5: Phân Tích Đối Thủ Cạnh Tranh Thời Trang

**Mục đích:** Cảnh báo sớm cho Sale và định hướng chiến lược Cạnh tranh cho team Marketing.

**1. Có nhắc đến đối thủ không?**

- Loại dữ liệu: True / False
- AI Prompt: Trả lời True nếu khách nhắc tên, gửi hình/link của thương hiệu, shop hoặc sản phẩm đối thủ để so sánh. Ngược lại, trả False.

**2. Tên đối thủ / Thương hiệu khác**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Nếu khách nhắc đến thương hiệu khác, trích xuất chính xác tên thương hiệu/shop đó. Nếu không, ghi "Không có".

**3. Tiêu chí so sánh**

- Loại dữ liệu: Phân loại (Dropdown: Giá cả / Chất lượng / Phong cách / Phí giao hàng / Uy tín thương hiệu / Hàng real vs hàng fake)
- AI Prompt: Khách đang mang yếu tố nào ra so sánh với bên mình? Trích xuất nhóm tiêu chí tương ứng. Nếu không so sánh, ghi "Không có".

---

#### Insight 6: Phân Tích Nhu Cầu Mua Lại Thời Trang (Retargeting)

**Mục đích:** Lọc nhanh khách cũ có nhu cầu mua lại hoặc giới thiệu bạn bè.

**1. Phân loại mục đích tin nhắn**

- Loại dữ liệu: Lựa chọn đơn (Hỏi về đơn hàng / Xin đổi trả / Hỏi sản phẩm mới / Khác)
- AI Prompt: Phân loại mục đích chính:
  - **Hỏi về đơn hàng:** Giục giao, hỏi mã vận đơn, hỏi tình trạng đơn.
  - **Xin đổi trả:** Yêu cầu đổi size/màu, hoàn tiền, bóc phốt.
  - **Hỏi sản phẩm mới:** Nhắc đến sản phẩm mới, hỏi collection mới.
  - **Khác:** Các trường hợp còn lại.

**2. Mức độ hài lòng**

- Loại dữ liệu: Lựa chọn đơn (Hài lòng / Trung bình / Không hài lòng)
- AI Prompt: Dựa vào từ ngữ và emoji khách sử dụng, đánh giá mức độ hài lòng của khách với sản phẩm/dịch vụ. Không hài lòng nếu có từ tiêu cực rõ ràng, dọa trả hàng, hoặc phàn nàn.

**3. Khách có giới thiệu được không?**

- Loại dữ liệu: True / False
- AI Prompt: Khách có thể hiện ý định giới thiệu bạn bè, mua tặng, hoặc quay lại mua tiếp không? (VD: "Đẹp lắm, mình sẽ giới thiệu bạn mình", "Lần sau lại mua thêm"). Trả True nếu có tín hiệu mua lại hoặc giới thiệu.

---

---

## NHÓM NGÀNH 2: MẸ VÀ BÉ

### Ngành: Mẹ và Bé (Mother & Baby Store)

**Đặc thù ngành:**
- Khách hàng chủ yếu là mẹ (nữ, 20-40 tuổi) — cần track parent gender
- Sản phẩm theo giai đoạn tuổi bé (sơ sinh, 0-6m, 6-12m, 1-3y, 3y+) — cần track baby age
- An toàn và chất lượng là ưu tiên số 1 → cần safety concern
- Mua sỉ / mua combo nhiều → cần track bulk interest
- Mùa sinh nhật, ngày lễ ảnh hưởng mạnh đến nhu cầu
- Khách thường nhắc "con mình" hoặc "bé nhà"

---

#### Insight 1: Phân Tích Nhu Cầu Khách Hàng Mẹ và Bé

**Mục đích:** Nắm bắt nhanh mẹ đang tìm gì cho con — sản phẩm, độ tuổi bé, mức giá.

**1. Sản phẩm / Danh mục quan tâm**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Trích xuất tên sản phẩm hoặc danh mục mẹ đang hỏi (VD: "sữa công thức", "tã", "đồ ăn dặm", "bỉm"). Nếu hỏi chung chung, ghi "Không xác định".

**2. Độ tuổi bé / Giai đoạn**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Mẹ nhắc bé bao nhiêu tháng / tuổi chưa? Trích xuất độ tuổi được nhắc đến (VD: "con 5 tháng", "bé nhà 2 tuổi rưỡi", "sơ sinh"). Nếu không đề cập, ghi "Không xác định".

**3. Mức độ quan tâm (Lead Temperature)**

- Loại dữ liệu: Lựa chọn đơn (Nóng / Ấm / Lạnh)
- AI Prompt:
  - **Nóng:** Hỏi giá, xin địa chỉ cửa hàng, hỏi "còn hàng không", để lại SĐT, hỏi "mua giao được không".
  - **Ấm:** Đang nhờ tư vấn thêm về tính năng, độ tuổi phù hợp, so sánh sản phẩm.
  - **Lạnh:** Chỉ hỏi 1 câu rồi không rep, hoặc từ chối.

**4. Nhu cầu cốt lõi (Pain Point)**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Mẹ đang gặp vấn đề gì hoặc mong muốn điều gì? (VD: "Con bị táo bón cần sữa gì", "Tìm đồ cho bé 6 tháng ăn dặm", "Cần giao gấp vì hết hàng"). Tóm tắt dưới 12 chữ.

---

#### Insight 2: Đánh Giá Chất Lượng Nguồn Lead Ads Mẹ và Bé

**Mục đích:** Đánh giá chất lượng chiến dịch Ads — tỉ lệ lead thực sự mua sỉ / mua nhiều cho con.

**1. Khách hàng rác**

- Loại dữ liệu: True / False
- AI Prompt: Trả True nếu khách gửi tin nhắn tự động rồi không rep; chat nội dung không liên quan; bấm nhầm. Ngược lại, trả False.

**2. Trạng thái thu thập SĐT**

- Loại dữ liệu: Lựa chọn đơn (Đã cho SĐT / Chưa cho / Khách từ chối)
- AI Prompt: Kiểm tra mẹ đã cung cấp SĐT hợp lệ chưa.

**3. Rào cản chốt đơn**

- Loại dữ liệu: Phân loại (Chê giá đắt, Phí ship cao, Lo ngại an toàn / chất lượng, Hỏi cho biết, Cần hỏi chồng, Cần hỏi người thân, Đang cân nhắc, Không có rào cản)
- AI Prompt: Xác định lý do chính. Đặc biệt lưu ý "Lo ngại an toàn / chất lượng" — rất phổ biến trong ngành Mẹ và Bé.

**4. Quan tâm mua sỉ / Combo**

- Loại dữ liệu: True / False
- AI Prompt: Mẹ có nhắc đến việc mua nhiều sản phẩm cùng lúc, mua cho nhiều bé, hoặc hỏi giá sỉ / giá combo không? Trả True nếu có.

---

#### Insight 3: Đánh Giá Nhân Viên Tư Vấn Mẹ và Bé

**Mục đích:** Kiểm soát chất lượng phản hồi — đặc biệt quan trọng vì mẹ rất cẩn thận về an toàn.

**1. Đánh giá Thái độ tư vấn**

- Loại dữ liệu: Lựa chọn đơn (Tốt / Trung bình / Kém)
- AI Prompt:
  - **Tốt:** Lịch sự, trả lời đúng trọng tâm, CÓ đặt câu hỏi mở ("Con bao nhiêu tháng rồi ạ?", "Mẹ quan tâm về vấn đề gì của bé ạ?"), giải đáp lo lắng về an toàn sản phẩm.
  - **Trung bình:** Trả lời đủ thông tin nhưng thụ động.
  - **Kém:** Trả lời cộc lốc, không trả lời được câu hỏi về độ tuổi phù hợp, không giải quyết lo lắng an toàn.

**2. Lỗi mất khách do Sale**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Tóm tắt lỗi Sale gây mất khách dưới 10 chữ. (VD: "Không giải đáp lo ngại về an toàn", "Bỏ quên khách"). Nếu Sale tốt, ghi "Không có lỗi".

---

#### Insight 4: Phân Tích Chân Dung Khách Hàng Mẹ và Bé

**Mục đích:** Vẽ chân dung khách hàng mục tiêu — độ tuổi con, vùng miền, ngân sách — để target Ads hiệu quả.

**1. Giới tính phụ huynh**

- Loại dữ liệu: Lựa chọn đơn (Mẹ / Bố / Người thân / Không rõ)
- AI Prompt: Dựa vào cách xưng hô và nội dung, xác định người nhắn là ai. (VD: "mình" + nói về con = Mẹ; "vợ mình" hoặc "chồng mình nhờ" = Bố; "bà ngoại" = Người thân).

**2. Độ tuổi bé**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Trích xuất độ tuổi bé được nhắc đến. Nếu không, ghi "Không xác định".

**3. Khu vực địa lý**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách nhắc đến địa điểm giao hàng hoặc nơi ở không? Trích xuất tên tỉnh/thành/phố.

**4. Khoảng ngân sách**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách có nhắc đến số tiền có thể chi trả cho con không? (VD: "dưới 500k cho đợt này", "tầm 1-2 triệu"). Nếu không, ghi "Không đề cập".

---

#### Insight 5: Phân Tích Đối Thủ Mẹ và Bé

**Mục đích:** Theo dõi thương hiệu sữa / tã / đồ dùng bé đối thủ được nhắc đến nhiều nhất.

**1. Có nhắc đến đối thủ không?**

- Loại dữ liệu: True / False
- AI Prompt: Mẹ có so sánh sản phẩm / thương hiệu khác không?

**2. Tên đối thủ / Thương hiệu**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Trích xuất tên thương hiệu được nhắc (VD: "雀巢", "Friso", "Bobby", "Pampers"). Nếu không, ghi "Không có".

**3. Tiêu chí so sánh**

- Loại dữ liệu: Phân loại (Giá cả / Chất lượng / An toàn / Giao hàng / Uy tín / Không có)
- AI Prompt: Mẹ đang so sánh yếu tố gì? (VD: "bên kia có vitamin D" → Chất lượng; "đắt hơn bên kia" → Giá cả).

---

#### Insight 6: Phân Tích Chăm Sóc Sau Mua Mẹ và Bé

**Mục đích:** Xử lý nhanh khiếu nại về an toàn sản phẩm và các vấn đề hậu mãi.

**1. Phân loại mục đích tin nhắn**

- Loại dữ liệu: Lựa chọn đơn (Hỏi giao hàng / Xin hướng dẫn sử dụng / Khiếu nại lỗi-an toàn / Xin đổi trả / Khác)
- AI Prompt:
  - **Hỏi giao hàng:** Giục đơn, hỏi mã vận đơn.
  - **Xin hướng dẫn sử dụng:** Hỏi cách pha sữa, cách dùng tã, cách bảo quản.
  - **Khiếu nại lỗi-an toàn:** Báo sản phẩm có vấn đề, nghi ngờ hàng giả, hàng hết date — ƯU TIÊN CAO NHẤT.
  - **Xin đổi trả:** Yêu cầu đổi size tã, đổi vị sữa.
  - **Khác:** Các trường hợp còn lại.

**2. Mức độ bức xúc**

- Loại dữ liệu: True / False
- AI Prompt: Mẹ có thể hiện sự tức giận, thất vọng, dọa đăng review xấu, hoặc đe dọa bóc phốt không? Đặc biệt lưu ý các từ liên quan đến sức khỏe / an toàn con. Trả True nếu có tiêu cực rõ ràng.

---

---

## NHÓM NGÀNH 3: MỸ PHẨM / LÀM ĐẸP

### Ngành: Mỹ phẩm / Làm đẹp (Cosmetics / Beauty)

**Đặc thù ngành:**
- Da dầu / da khô / da nhạy cảm là các pain point phổ biến nhất
- Khách thường hỏi về thành phần (đặc biệt serum, kem dưỡng)
- Hàng real vs hàng fake là objection lớn
- Review / cảm nhận từ người dùng khác rất quan trọng → cần track review concern
- Mùa (mùa đông cần dưỡng ẩm, mùa hè cần chống nắng)
- Xu hướng K-beauty, J-beauty rất phổ biến

---

#### Insight 1: Phân Tích Nhu Cầu Khách Hàng Mỹ Phẩm

**Mục đích:** Nắm bắt nhanh khách đang tìm sản phẩm gì cho vấn đề da nào, mức giá bao nhiêu.

**1. Sản phẩm / Dịch vụ quan tâm**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Trích xuất tên sản phẩm hoặc loại sản phẩm khách đang hỏi (VD: "serum trị mụn", "kem chống nắng", "toner"). Nếu hỏi chung, ghi "Không xác định".

**2. Loại da / Vấn đề da**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách có nhắc đến loại da hoặc vấn đề da của mình không? (VD: "da dầu nhờn", "da nhạy cảm", "mụn ẩn", "nám"). Trích xuất chính xác. Nếu không, ghi "Không xác định".

**3. Mức độ quan tâm**

- Loại dữ liệu: Lựa chọn đơn (Nóng / Ấm / Lạnh)
- AI Prompt:
  - **Nóng:** Hỏi giá, hỏi "còn không", để lại SĐT, hỏi giao hôm nay được không.
  - **Ấm:** Đang tư vấn về thành phần, so sánh 2 sản phẩm, nhưng chưa chốt.
  - **Lạnh:** Hỏi 1 câu rồi không rep, hoặc từ chối.

**4. Nhu cầu cốt lõi (Pain Point)**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách đang gặp vấn đề gì với làn da? (VD: "Trị mụn ẩn lâu năm", "Tìm kem dưỡng cho da nhạy cảm", "Cần serum giá bình dân"). Tóm tắt dưới 12 chữ.

---

#### Insight 2: Đánh Giá Chất Lượng Nguồn Lead Ads Mỹ Phẩm

**Mục đích:** Đánh giá chiến dịch Ads dựa trên chất lượng lead và tỉ lệ thu thập SĐT.

**1. Khách hàng rác**

- Loại dữ liệu: True / False
- AI Prompt: Trả True nếu khách gửi tin nhắn tự động từ ads rồi không rep; chat nội dung không liên quan (spam review, quảng cáo khác). Ngược lại, trả False.

**2. Trạng thái thu thập SĐT**

- Loại dữ liệu: Lựa chọn đơn (Đã cho SĐT / Chưa cho / Khách từ chối)

**3. Rào cản chốt đơn**

- Loại dữ liệu: Phân loại (Chê giá đắt, Phí ship cao, Lo ngại hàng fake / không real, Hỏi cho biết, Đang cân nhắc nhiều nơi, Hỏi thêm về thành phần, Không có rào cản)
- AI Prompt: Xác định lý do chính. "Lo ngại hàng fake" là objection đặc trưng ngành mỹ phẩm.

**4. Yêu cầu chứng minh real**

- Loại dữ liệu: True / False
- AI Prompt: Khách có yêu cầu xem hóa đơn nhập, date, hình ảnh chụp thực tế sản phẩm, hoặc hỏi "có real không" không? Trả True nếu có.

---

#### Insight 3: Đánh Giá Nhân Viên Tư Vấn Mỹ Phẩm

**Mục đích:** Kiểm soát chất lượng tư vấn về thành phần sản phẩm và vấn đề da.

**1. Đánh giá Thái độ tư vấn**

- Loại dữ liệu: Lựa chọn đơn (Tốt / Trung bình / Kém)
- AI Prompt:
  - **Tốt:** Lịch sự, trả lời đúng trọng tâm, CÓ đặt câu hỏi mở ("Da anh/chị có hay bị kích ứng không ạ?", "Anh/chị quan tâm vấn đề gì nhất ạ?"), giải thích thành phần rõ ràng, khuyến khích dùng thử.
  - **Trung bình:** Trả lời đủ thông tin nhưng không hỏi về tình trạng da.
  - **Kém:** Trả lời sai về thành phần, không trả lời được câu hỏi về da nhạy cảm, thiếu tôn trọng.

**2. Lỗi mất khách do Sale**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Tóm tắt lỗi Sale dưới 10 chữ (VD: "Không giải đáp lo ngại về hàng fake", "Bỏ quên khách sau 1 tiếng").

---

#### Insight 4: Phân Tích Chân Dung Khách Hàng Mỹ Phẩm

**Mục đích:** Vẽ chân dung khách hàng — loại da, vùng miền, ngân sách, tuổi — để Marketer target đúng people.

**1. Giới tính**

- Loại dữ liệu: Lựa chọn đơn (Nam / Nữ / Không rõ)

**2. Loại da / Vấn đề da**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách nhắc đến loại da hoặc vấn đề da của mình không? (VD: "da mình dầu lắm", "bị nám mặt"). Trích xuất. Nếu không, ghi "Không xác định".

**3. Khu vực địa lý**

- Loại dữ liệu: Văn bản ngắn (Short Text)

**4. Khoảng ngân sách**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách có nhắc đến số tiền sẵn chi cho mỹ phẩm không? (VD: "tầm 500k - 1 triệu/tháng", "dưới 300k cho con serum này"). Trích xuất khoảng giá. Nếu không, ghi "Không đề cập".

---

#### Insight 5: Phân Tích Đối Thủ Mỹ Phẩm

**Mục đích:** Cảnh báo khi khách so sánh với các thương hiệu mỹ phẩm nổi tiếng (K-beauty, J-beauty, dược mỹ phẩm...).

**1. Có nhắc đến đối thủ không?**

- Loại dữ liệu: True / False

**2. Tên đối thủ / Thương hiệu**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Trích xuất tên thương hiệu được nhắc (VD: "Some By Mi", "La Roche-Posay", "Dr. G", "Cocoon", "Klum"). Nếu không, ghi "Không có".

**3. Tiêu chí so sánh**

- Loại dữ liệu: Phân loại (Giá cả / Thành phần / Hiệu quả / Hàng real / Phí ship / Uy tín / Không có)
- AI Prompt: Khách so sánh yếu tố gì? (VD: "bên kia có BHA" → Thành phần; "rẻ hơn bên Thefaceshop" → Giá cả).

---

#### Insight 6: Phân Tích Chăm Sóc Sau Mua Mỹ Phẩm

**Mục đích:** Ưu tiên xử lý các khiếu nại về phản ứng da, dị ứng — có thể gây khủng hoảng truyền thông.

**1. Phân loại mục đích tin nhắn**

- Loại dữ liệu: Lựa chọn đơn (Hỏi giao hàng / Xin hướng dẫn sử dụng / Khiếu nại dị ứng / Khiếu nại khác / Xin đổi trả / Khác)
- AI Prompt:
  - **Khiếu nại dị ứng:** Báo bị nổi mẩn, ngứa, kích ứng sau khi dùng — ƯU TIÊN CAO NHẤT.
  - **Hỏi giao hàng:** Giục đơn, hỏi mã vận đơn.
  - **Xin hướng dẫn sử dụng:** Hỏi cách dùng serum, cách dùng kem, thứ tự apply.
  - **Khiếu nại khác:** Giao sai màu, hết date, thiếu sản phẩm.
  - **Khác:** Các trường hợp còn lại.

**2. Mức độ bức xúc**

- Loại dữ liệu: True / False
- AI Prompt: Khách có thể hiện tức giận, dọa đăng review xấu, dọa bóc phốt, hoặc đe dọa kiện cáo không? Trả True nếu có tiêu cực rõ ràng. Đặc biệt nghiêm trọng nếu liên quan đến sức khỏe da.

---

---

## NHÓM NGÀNH 4: SPA / THẨM MỸ

### Ngành: Spa / Thẩm mỹ (Beauty Salon / Aesthetic Clinic)

**Đặc thù ngành:**
- Dịch vụ theo liệu trình (cần track treatment type)
- Khách cần tư vấn chi tiết về hiệu quả, thời gian, số buổi, giá
- Booking / đặt lịch là bước quan trọng (→ cần track booking intent)
- Khách thường hỏi về trước - sau (results), độ an toàn, bác sĩ
- Khách mới vs khách cũ có nhu cầu hoàn toàn khác
- Giá dịch vụ spa/thẩm mỹ cao hơn bán lẻ → price sensitivity cao

---

#### Insight 1: Phân Tích Nhu Cầu Khách Spa / Thẩm Mỹ

**Mục đích:** Nắm bắt nhanh khách đang quan tâm dịch vụ nào, vấn đề gì, mức độ quan tâm ra sao.

**1. Dịch vụ / Liệu trình quan tâm**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Trích xuất tên dịch vụ hoặc liệu trình khách đang hỏi (VD: "triệt lông", "nâng mũi", "facial", "massage body", "trị nám"). Nếu hỏi chung, ghi "Không xác định".

**2. Vấn đề cần giải quyết**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách đang gặp vấn đề gì muốn cải thiện? (VD: "mụn ẩn ở trán", "nám sau sinh", "da xuống tông", "muốn thon gọn"). Trích xuất. Nếu không, ghi "Không xác định".

**3. Mức độ quan tâm**

- Loại dữ liệu: Lựa chọn đơn (Nóng / Ấm / Lạnh)
- AI Prompt:
  - **Nóng:** Hỏi giá chi tiết, hỏi lịch trống, để lại SĐT, hỏi "đặt được không", hỏi bác sĩ ai.
  - **Ấm:** Đang tư vấn về hiệu quả, thời gian, số buổi nhưng chưa hỏi về lịch.
  - **Lạnh:** Hỏi 1 câu rồi không rep, hoặc từ chối.

**4. Nhu cầu cốt lõi**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách đang mong đợi điều gì nhất? (VD: "Cần làm gấp trước tiệc", "Muốn không đau", "Tìm giá rẻ nhất"). Tóm tắt dưới 12 chữ.

---

#### Insight 2: Đánh Giá Chất Lượng Nguồn Lead Spa / Thẩm Mỹ

**Mục đích:** Đánh giá chất lượng lead — tỉ lệ khách thực sự đặt lịch hay chỉ hỏi giá.

**1. Khách hàng rác**

- Loại dữ liệu: True / False
- AI Prompt: Trả True nếu khách gửi tin nhắn tự động từ ads rồi không rep; hỏi giá để so sánh với competitor rồi biến mất; chat nội dung không liên quan. Ngược lại, trả False.

**2. Trạng thái thu thập SĐT**

- Loại dữ liệu: Lựa chọn đơn (Đã cho SĐT / Chưa cho / Khách từ chối)

**3. Ý định đặt lịch (Booking Intent)**

- Loại dữ liệu: Lựa chọn đơn (Đã đặt / Có ý định / Thăm dò / Không rõ)
- AI Prompt:
  - **Đã đặt:** Khách đã chốt được ngày giờ cụ thể.
  - **Có ý định:** Khách hỏi lịch trống, hỏi "có đặt được không", để lại SĐT để nhân viên gọi lại.
  - **Thăm dò:** Chỉ hỏi giá, hỏi dịch vụ nhưng chưa hỏi về lịch.
  - **Không rõ:** Không đủ thông tin để xác định.

**4. Rào cản chốt đơn**

- Loại dữ liệu: Phân loại (Chê giá đắt, Sợ đau / không an toàn, Cần xem review trước, Hỏi người thân, Đang cân nhắc nhiều nơi, Thời gian / lịch không phù hợp, Không có rào cản)
- AI Prompt: Xác định lý do chính. "Sợ đau / không an toàn" là objection đặc trưng ngành thẩm mỹ.

---

#### Insight 3: Đánh Giá Nhân Viên Tư Vấn Spa / Thẩm Mỹ

**Mục đích:** Kiểm soát chất lượng tư vấn — đặc biệt về hiệu quả dịch vụ, thời gian, và giá cả.

**1. Đánh giá Thái độ tư vấn**

- Loại dữ liệu: Lựa chọn đơn (Tốt / Trung bình / Kém)
- AI Prompt:
  - **Tốt:** Lịch sự, trả lời đúng trọng tâm, CÓ đặt câu hỏi mở ("Chị muốn cải thiện vấn đề gì ạ?", "Chị đã làm dịch vụ nào trước đó chưa ạ?"), giải thích rõ về hiệu quả, số buổi, chăm sóc sau.
  - **Trung bình:** Trả lời đủ thông tin nhưng thụ động.
  - **Kém:** Trả lời cộc lốc, không trả lời được câu hỏi về hiệu quả / độ an toàn, gây mất tin cậy.

**2. Lỗi mất khách do Sale**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Tóm tắt lỗi Sale dưới 10 chữ. (VD: "Không tư vấn đúng về số buổi", "Trả lời cộc lốc về giá"). Nếu Sale tốt, ghi "Không có lỗi".

---

#### Insight 4: Phân Tích Chân Dung Khách Spa / Thẩm Mỹ

**Mục đích:** Hiểu khách hàng — độ tuổi, vùng miền, ngân sách, mức độ thẩm mỹ — để Marketer target đúng.

**1. Giới tính**

- Loại dữ liệu: Lựa chọn đơn (Nam / Nữ / Không rõ)

**2. Độ tuổi dự đoán**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Dựa vào nội dung chat, khách thuộc nhóm tuổi nào? (VD: nhắc "trẻ hóa", "nám tuổi trung niên" → trung niên; nhắc "trị mụn thanh thiên niên" → trẻ). Nếu không xác định, ghi "Không rõ".

**3. Khu vực địa lý**

- Loại dữ liệu: Văn bản ngắn (Short Text)

**4. Khoảng ngân sách**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách nhắc đến số tiền có thể chi cho dịch vụ này không? (VD: "tầm 2-3 triệu cho lần đầu", "không giới hạn nếu hiệu quả"). Nếu không, ghi "Không đề cập".

---

#### Insight 5: Phân Tích Đối Thủ Spa / Thẩm Mỹ

**Mục đích:** Theo dõi thương hiệu clinic / spa đối thủ được nhắc đến và lý do khách so sánh.

**1. Có nhắc đến đối thủ không?**

- Loại dữ liệu: True / False

**2. Tên đối thủ / Thương hiệu**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Trích xuất tên clinic hoặc spa đối thủ được nhắc đến. Nếu không, ghi "Không có".

**3. Tiêu chí so sánh**

- Loại dữ liệu: Phân loại (Giá cả / Bác sĩ có tay nghề / Công nghệ / Review thực tế / Uy tín thương hiệu / Vị trí / Không có)
- AI Prompt: Khách so sánh yếu tố gì? (VD: "bên Kangnam giá rẻ hơn" → Giá; "bên Vinmec có bác sĩ nổi tiếng" → Bác sĩ).

---

#### Insight 6: Phân Tích Chăm Sóc Sau Dịch Vụ Spa / Thẩm Mỹ

**Mục đích:** Theo dõi phản hồi sau liệu trình — phát hiện sớm khách không hài lòng hoặc có phản ứng bất lợi.

**1. Phân loại mục đích tin nhắn**

- Loại dữ liệu: Lựa chọn đơn (Hỏi chăm sóc sau / Báo phản ứng bất lợi / Khiếu nại / Hẹn lịch buổi tiếp / Khác)
- AI Prompt:
  - **Báo phản ứng bất lợi:** Báo bị sưng, đỏ, bỏng sau dịch vụ — ƯU TIÊN CAO NHẤT, cần xử lý khẩn.
  - **Hỏi chăm sóc sau:** Hỏi cách chăm sóc da/sau laser/sau tiêm.
  - **Khiếu nại:** Giao sai dịch vụ, không đúng giờ, không đúng bác sĩ.
  - **Hẹn lịch buổi tiếp:** Khách muốn tiếp tục liệu trình.
  - **Khác:** Các trường hợp còn lại.

**2. Mức độ bức xúc**

- Loại dữ liệu: True / False
- AI Prompt: Khách có thể hiện tức giận rõ ràng, dọa đăng review xấu, hoặc yêu cầu hoàn tiền không? Đặc biệt nghiêm trọng nếu liên quan đến phản ứng bất lợi trên da.

---

---

## NHÓM NGÀNH 5: TƯ VẤN BẤT ĐỘNG SẢN

### Ngành: Tư vấn Bất động sản (Real Estate Agency)

**Đặc thù ngành:**
- Sản phẩm có giá trị cực lớn — tỉ lệ chốt thấp (1-5%) → cần track qualified lead rất kỹ
- Khách hỏi rất nhiều về vị trí, giá, pháp lý, tiện ích, ngân hàng hỗ trợ vay
- Pháp lý (sổ đỏ, sổ hồng, hợp đồng mua bán) là objection phổ biến nhất
- Khách thường "đi thăm" (đi site visit) trước khi quyết định → cần track site visit intent
- Cò mồi / khách nhắn "hỏi chơi" rất phổ biến → cần track budget confirmation
- Mùa (đầu năm, cuối năm) và lãi suất ngân hàng ảnh hưởng mạnh đến nhu cầu
- Đối thủ là các sàn BĐS lớn (Rever, Batdongsan.com.vn, Propzy)

---

#### Insight 1: Phân Tích Nhu Cầu Khách Hàng Bất Động Sản

**Mục đích:** Nắm bắt nhanh khách đang tìm loại BĐS nào, ở đâu, ngân sách bao nhiêu.

**1. Loại BĐS quan tâm**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Trích xuất loại bất động sản khách đang hỏi (VD: "chung cư", "nhà phố", "đất nền", "biệt thự", "shophouse", "căn hộ studio"). Nếu hỏi chung chung, ghi "Không xác định".

**2. Khu vực / Vị trí quan tâm**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách nhắc đến quận/huyện, khu vực, hoặc dự án cụ thể nào không? (VD: "Quận 7", "Thủ Đức", "Bình Dương", "dự án Vinhomes"). Trích xuất tên khu vực. Nếu không, ghi "Không xác định".

**3. Mức độ quan tâm (Lead Temperature)**

- Loại dữ liệu: Lựa chọn đơn (Nóng / Ấm / Lạnh)
- AI Prompt:
  - **Nóng:** Hỏi giá chi tiết, hỏi "có thể đi thăm không", để lại SĐT, hỏi về pháp lý / sổ, hỏi vay ngân hàng, hỏi "chốt được không".
  - **Ấm:** Đang tư vấn về vị trí, tiện ích, giá nhưng chưa hẹn đi thăm hoặc hỏi về pháp lý chi tiết.
  - **Lạnh:** Hỏi 1-2 câu chung chung rồi không rep, hoặc từ chối.

**4. Nhu cầu cốt lõi (Pain Point)**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách đang gặp vấn đề gì hoặc mong muốn điều gì? (VD: "Cần mua gấp trước Tết", "Tìm đất đầu tư dưới 2 tỷ", "Muốn mua nhà cho con đi làm"). Tóm tắt dưới 12 chữ.

---

#### Insight 2: Đánh Giá Chất Lượng Nguồn Lead Bất Động Sản

**Mục đích:** Đánh giá chiến dịch quảng cáo BĐS — tỉ lệ khách có tiền thật vs cò mồi / khách hỏi chơi.

**1. Khách hàng rác (Cò mồi / Không có nhu cầu thật)**

- Loại dữ liệu: True / False
- AI Prompt: Trả True nếu khách thuộc trường hợp: nhắn tự động từ ads rồi không rep; hỏi giá chung chung để thu thập thông tin (cò mồi); nhắn cho nhiều sàn cùng lúc; không có ngân sách rõ ràng. Ngược lại, trả False.

**2. Trạng thái thu thập SĐT**

- Loại dữ liệu: Lựa chọn đơn (Đã cho SĐT / Chưa cho / Khách từ chối)
- AI Prompt: Kiểm tra khách đã cung cấp SĐT hợp lệ chưa.

**3. Ngân sách xác nhận**

- Loại dữ liệu: Lựa chọn đơn (Đã xác nhận ngân sách / Ngân sách chung chung / Chưa đề cập / Không có nhu cầu mua)
- AI Prompt: Khách đã xác nhận được khoảng tiền cụ thể chưa? (VD: "tôi có 3 tỷ", "vay được tầm 2 tỷ" → Đã xác nhận; "xem giá thôi" → Không có nhu cầu mua; "dưới 2 tỷ" nhưng chưa rõ nguồn tiền → Ngân sách chung chung).

**4. Rào cản chốt đơn**

- Loại dữ liệu: Phân loại (Chê giá đắt, Pháp lý chưa rõ ràng, Chưa đủ tiền trả trước, Vị trí không phù hợp, Cần hỏi vợ/chồng/người thân, Đang so sánh nhiều dự án, Lãi suất ngân hàng cao, Hỏi cho biết, Không có rào cản)
- AI Prompt: Xác định lý do chính. "Pháp lý chưa rõ ràng" và "Ngân sách xác nhận" là hai objection đặc trưng nhất của ngành BĐS.

**5. Ý định đi thăm (Site Visit)**

- Loại dữ liệu: Lựa chọn đơn (Đã hẹn đi thăm / Có ý định / Thăm dò / Không rõ)
- AI Prompt: Khách đã hẹn được ngày đi thăm chưa, hay chỉ mới hỏi thông tin?

---

#### Insight 3: Đánh Giá Nhân Viên Tư Vấn Bất Động Sản

**Mục đích:** Kiểm soát chất lượng tư vấn — đặc biệt về pháp lý, tài chính, và tính chuyên nghiệp.

**1. Đánh giá Thái độ tư vấn**

- Loại dữ liệu: Lựa chọn đơn (Tốt / Trung bình / Kém)
- AI Prompt:
  - **Tốt:** Lịch sự, trả lời đúng trọng tâm, CÓ đặt câu hỏi mở ("Anh/chị cần mua để ở hay đầu tư ạ?", "Ngân sách hiện tại là bao nhiêu ạ?", "Anh/chị ưu tiên vị trí hay giá cả hơn ạ?"), giải thích rõ về pháp lý, hỗ trợ tính toán tài chính, không gây áp lực mua.
  - **Trung bình:** Trả lời đủ thông tin nhưng thụ động, không hỏi về nhu cầu.
  - **Kém:** Trả lời cộc lốc, thông tin sai về pháp lý / giá, gây áp lực mua, không follow-up khách.

**2. Lỗi mất khách do Sale**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Tóm tắt lỗi Sale gây mất khách dưới 10 chữ. (VD: "Không gửi được thông tin pháp lý", "Hẹn đi thăm rồi bỏ lỡ", "Báo giá không chính xác"). Nếu Sale tốt, ghi "Không có lỗi".

---

#### Insight 4: Phân Tích Chân Dung Khách Hàng Bất Động Sản

**Mục đích:** Vẽ chân dung khách hàng — phân khúc (để ở / đầu tư / mua sỉ), ngân sách, vùng ưu tiên — để Marketer target đúng nhóm có khả năng mua.

**1. Giới tính**

- Loại dữ liệu: Lựa chọn đơn (Nam / Nữ / Không rõ)

**2. Phân khúc khách hàng**

- Loại dữ liệu: Lựa chọn đơn (Mua để ở / Đầu tư cho thuê / Đầu tư tăng giá / Mua sỉ / Không rõ)
- AI Prompt: Dựa vào nội dung chat, khách thuộc nhóm nào?
  - **Mua để ở:** Nhắc "ở đây", "muốn chuyển nhà", "mua cho gia đình".
  - **Đầu tư cho thuê:** Nhắc "cho thuê", "lấy tiền cho thuê trả ngân hàng", "cashflow".
  - **Đầu tư tăng giá:** Nhắc "hy vọng giá lên", "đất nền tương lai", "dự án sắp có hạ tầng".
  - **Mua sỉ:** Nhắc "mua nhiều", "đầu tư dàn", "quan hệ".

**3. Khu vực ưu tiên**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách nhắc đến khu vực/quận/tỉnh nào muốn mua? Trích xuất tên khu vực. Nếu không, ghi "Không xác định".

**4. Khoảng ngân sách**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách có nhắc đến số tiền có thể chi trả hoặc vay được không? (VD: "tổng 5 tỷ", "trả trước 2 tỷ vay 3 tỷ", "dưới 3 tỷ"). Trích xuất khoảng giá. Nếu không, ghi "Không đề cập".

---

#### Insight 5: Phân Tích Đối Thủ Bất Động Sản

**Mục đích:** Theo dõi khi khách so sánh với dự án, sàn BĐS khác hoặc chủ đầu tư khác.

**1. Có nhắc đến đối thủ không?**

- Loại dữ liệu: True / False
- AI Prompt: Khách có nhắc đến dự án BĐS khác, sàn BĐS khác (Rever, Propzy, Batdongsan.com.vn), hoặc chủ đầu tư khác để so sánh không?

**2. Tên đối thủ / Dự án khác**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Trích xuất tên dự án, sàn, hoặc chủ đầu tư đối thủ được nhắc đến. (VD: "Vinhomes", "Novaland", "Rever", "dự án bên Akaraka"). Nếu không, ghi "Không có".

**3. Tiêu chí so sánh**

- Loại dữ liệu: Phân loại (Giá cả / Vị trí / Pháp lý / Tiện ích / Chủ đầu tư / Hỗ trợ vay ngân hàng / Thanh toán linh hoạt / Không có)
- AI Prompt: Khách đang so sánh yếu tố gì? (VD: "bên kia có sổ đỏ luôn" → Pháp lý; "bên Rever có nhiều dự án hơn" → Chủ đầu tư; "vay được 70% bên này" → Hỗ trợ vay).

---

#### Insight 6: Phân Tích Hậu Mua Bất Động Sản (Chăm Sóc Khách Sau Giao Dịch)

**Mục đích:** Theo dõi tiến độ thanh toán, phát hiện khách không hài lòng về chất lượng xây dựng, và phát hiện sớm nguy cơ tranh chấp pháp lý.

**1. Phân loại mục đích tin nhắn**

- Loại dữ liệu: Lựa chọn đơn (Hỏi tiến độ thanh toán / Hỏi tiến độ xây dựng / Khiếu nại chất lượng / Hỏi pháp lý - sổ / Xin tư vấn đầu tư tiếp / Khác)
- AI Prompt:
  - **Hỏi tiến độ thanh toán:** Khách hỏi đợt đóng tiền tiếp theo, số tiền, ngày đóng.
  - **Hỏi tiến độ xây dựng:** Khách hỏi công trình đang xây đến đâu, bàn giao khi nào.
  - **Khiếu nại chất lượng:** Báo nhà xây có vấn đề (nứt, thấm dột, không đúng thiết kế) — ƯU TIÊN CAO.
  - **Hỏi pháp lý - sổ:** Hỏi khi nào được cấp sổ, thủ tục sang tên, thế chấp.
  - **Xin tư vấn đầu tư tiếp:** Khách muốn mua thêm BĐS khác, giới thiệu khách mới.
  - **Khác:** Các trường hợp còn lại.

**2. Mức độ bức xúc**

- Loại dữ liệu: True / False
- AI Prompt: Khách có thể hiện sự tức giận rõ ràng, dọa kiện, dọa bóc phốt lên mạng xã hội, hoặc đe dọa không thanh toán tiếp không? Trả True nếu có tiêu cực rõ ràng. Đặc biệt nghiêm trọng nếu liên quan đến pháp lý hoặc chất lượng xây dựng.

**3. Khách có giới thiệu được không?**

- Loại dữ liệu: True / False
- AI Prompt: Khách có thể hiện ý định giới thiệu bạn bè, người thân mua BĐS, hoặc quay lại mua thêm không? (VD: "Mình sẽ giới thiệu bạn mình", "Lần sau có đất hay mình sẽ ủng hộ"). Trả True nếu có tín hiệu tích cực.

---

---

## NHÓM NGÀNH 6: F&B — CHUỖI NHÀ HÀNG ĂN UỐNG

### Ngành: Chuỗi Nhà hàng / Quán ăn / F&B (Food & Beverage)

**Đặc thù ngành:**
- Khách hỏi nhiều về menu, giá, địa điểm chi nhánh, giờ mở cửa
- Đặt bàn / đặt giao hàng là hành vi chốt quan trọng nhất → cần track booking/delivery intent
- Khách thường gửi hình ảnh món ăn hoặc so sánh với đối thủ (food blogger review culture)
- Review trên mạng xã hội, Google, Foody ảnh hưởng cực lớn đến quyết định
- Khách cũ quay lại / giới thiệu bạn bè là nguồn khách quan trọng
- Mùa (Tết, cuối tuần, lễ) và thời tiết ảnh hưởng mạnh đến nhu cầu
- Đối thủ đa dạng: chuỗi (KFC, Lotteria, Starbuck...), quán local, Food delivery apps (GrabFood, ShopeeFood, Baemin)

---

#### Insight 1: Phân Tích Nhu Cầu Khách Hàng F&B

**Mục đích:** Nắm bắt nhanh khách đang tìm món gì, muốn ăn tại quán hay giao về, mức giá bao nhiêu.

**1. Món ăn / Danh mục quan tâm**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Trích xuất tên món ăn hoặc danh mục món khách đang hỏi (VD: "cơm tấm", "bún bò", "bánh mì", "menu trưa công ty"). Nếu hỏi chung chung ("menu có gì"), ghi "Không xác định".

**2. Loại hình phục vụ**

- Loại dữ liệu: Lựa chọn đơn (Ăn tại quán / Giao hàng / Đặt bàn / Không rõ)
- AI Prompt: Khách muốn ăn tại quán, giao hàng, hay đặt bàn trước? Nếu không đề cập, ghi "Không rõ".

**3. Mức độ quan tâm (Lead Temperature)**

- Loại dữ liệu: Lựa chọn đơn (Nóng / Ấm / Lạnh)
- AI Prompt:
  - **Nóng:** Hỏi giá, hỏi "còn món không", hỏi giờ mở cửa, để lại SĐT để đặt bàn / đặt giao, hỏi "giao được không".
  - **Ấm:** Đang tìm hiểu menu, hỏi thành phần, hỏi địa chỉ chi nhánh nhưng chưa đặt.
  - **Lạnh:** Hỏi 1 câu chung chung rồi không rep, hoặc từ chối.

**4. Nhu cầu cốt lõi (Pain Point)**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách đang gặp vấn đề gì hoặc mong muốn điều gì? (VD: "Cần giao gấp trưa nay", "Tìm quán gần chỗ làm", "Muốn đặt bàn cho 10 người tối nay"). Tóm tắt dưới 12 chữ.

---

#### Insight 2: Đánh Giá Chất Lượng Nguồn Lead F&B

**Mục đích:** Đánh giá chiến dịch quảng cáo F&B — tỉ lệ khách đặt bàn / đặt giao thực tế vs chỉ hỏi giá.

**1. Khách hàng rác**

- Loại dữ liệu: True / False
- AI Prompt: Trả True nếu khách gửi tin nhắn tự động từ ads; nhắn để hỏi giá rồi đặt ở đối thủ; spam nội dung không liên quan. Ngược lại, trả False.

**2. Trạng thái thu thập SĐT**

- Loại dữ liệu: Lựa chọn đơn (Đã cho SĐT / Chưa cho / Khách từ chối)
- AI Prompt: Kiểm tra khách đã cung cấp SĐT hợp lệ chưa.

**3. Rào cản chốt đơn**

- Loại dữ liệu: Phân loại (Chê giá đắt, Phí giao hàng cao, Quá xa / Không có chi nhánh gần, Không giao được / Hết món, Đang cân nhắc nhiều nơi, Hỏi cho biết, Không có rào cản)
- AI Prompt: Xác định lý do chính. "Quá xa / Không có chi nhánh gần" là objection đặc trưng của ngành F&B.

**4. Đã đặt bàn / đặt giao chưa**

- Loại dữ liệu: Lựa chọn đơn (Đã đặt / Có ý định / Thăm dò / Không rõ)
- AI Prompt: Khách đã chốt được đặt bàn / đặt giao chưa, hay chỉ đang hỏi thông tin?

---

#### Insight 3: Đánh Giá Nhân Viên Tư Vấn F&B

**Mục đích:** Kiểm soát chất lượng phản hồi — đặc biệt về menu, khuyến mãi, và tốc độ phục vụ.

**1. Đánh giá Thái độ tư vấn**

- Loại dữ liệu: Lựa chọn đơn (Tốt / Trung bình / Kém)
- AI Prompt:
  - **Tốt:** Lịch sự, trả lời đúng trọng tâm, CÓ đặt câu hỏi mở ("Anh/chị cần đặt cho mấy người ạ?", "Anh/chị có dị ứng thực phẩm gì không ạ?", "Có cần gợi ý món kèm không ạ?"), giới thiệu khuyến mãi phù hợp, hỗ trợ đặt bàn nhanh.
  - **Trung bình:** Trả lời đủ thông tin nhưng thụ động.
  - **Kém:** Trả lời cộc lốc, không trả lời được câu hỏi về thành phần / dị ứng, không hỗ trợ đặt bàn.

**2. Lỗi mất khách do Sale**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Tóm tắt lỗi Sale gây mất khách dưới 10 chữ. (VD: "Không hỗ trợ đặt bàn nhanh", "Không thông báo hết món kịp", "Trả lời chậm 30 phút+"). Nếu Sale tốt, ghi "Không có lỗi".

---

#### Insight 4: Phân Tích Chân Dung Khách Hàng F&B

**Mục đích:** Hiểu khách — nhóm đối tượng, mục đích ăn uống, vùng giao, ngân sách — để Marketer target đúng nhóm.

**1. Giới tính**

- Loại dữ liệu: Lựa chọn đơn (Nam / Nữ / Không rõ)

**2. Nhóm đối tượng**

- Loại dữ liệu: Lựa chọn đơn (Công sở / học sinh / sinh viên / Gia đình có con nhỏ / Cặp đôi / Nhóm bạn / Không rõ)
- AI Prompt: Dựa vào nội dung chat, khách thuộc nhóm nào?
  - **Công sở:** Nhắc "trưa công ty", "cơm trưa", "ăn gần chỗ làm".
  - **Gia đình có con nhỏ:** Nhắc "con", "bé", "đi cả nhà", "trẻ em".
  - **Nhóm bạn:** Nhắc "bạn", "bọn mình", "đi 5-6 người".

**3. Mục đích ăn uống**

- Loại dữ liệu: Lựa chọn đơn (Ăn thường ngày / Liên hoan / Sinh nhật / Hẹn hò / Liên hoan công ty / Không rõ)
- AI Prompt: Dựa vào nội dung chat, khách ăn với mục đích gì?

**4. Khoảng ngân sách**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách nhắc đến số tiền dự kiến chi cho bữa ăn không? (VD: "dưới 200k/người", "trọn gói 500k", "tiệc 2 triệu cho 10 người"). Nếu không, ghi "Không đề cập".

---

#### Insight 5: Phân Tích Đối Thủ F&B

**Mục đích:** Theo dõi khi khách so sánh với chuỗi F&B khác hoặc ứng dụng giao đồ ăn (GrabFood, ShopeeFood, Baemin...).

**1. Có nhắc đến đối thủ không?**

- Loại dữ liệu: True / False
- AI Prompt: Khách có nhắc đến chuỗi F&B khác, quán ăn khác, hoặc ứng dụng giao đồ ăn (GrabFood, ShopeeFood, Baemin, GoFood...) để so sánh không?

**2. Tên đối thủ**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Trích xuất tên thương hiệu / quán ăn / app giao đồ ăn được nhắc. (VD: "KFC", "Lotteria", "Starbucks", "Quán cơm bình dân bên đường", "GrabFood"). Nếu không, ghi "Không có".

**3. Tiêu chí so sánh**

- Loại dữ liệu: Phân loại (Giá cả / Chất lượng món ăn / Tốc độ giao hàng / Không gian quán / Đa dạng menu / App khuyến mãi nhiều hơn / Không có)
- AI Prompt: Khách đang so sánh yếu tố gì? (VD: "bên kia giao nhanh hơn" → Tốc độ giao hàng; "rẻ hơn bên KFC 20k" → Giá cả).

---

#### Insight 6: Phân Tích Trải Nghiệm Khách Hàng F&B (Review & Feedback)

**Mục đích:** Phát hiện sớm khách không hài lòng về món ăn, phục vụ, hoặc giao hàng — nguy cơ review xấu cao trên Google, Foody, mạng xã hội.

**1. Phân loại mục đích tin nhắn**

- Loại dữ liệu: Lựa chọn đơn (Phản hồi tích cực / Khiếu nại món ăn / Khiếu nại giao hàng / Hỏi về khuyến mãi / Đặt bàn / Khác)
- AI Prompt:
  - **Phản hồi tích cực:** Khách khen món ngon, phục vụ tốt, muốn quay lại — ƯU TIÊN CAO để khen team và lấy đó làm điểm chuẩn.
  - **Khiếu nại món ăn:** Báo món ăn không ngon, hỏng, không đúng như mô tả, thiếu topping — ƯU TIÊN CAO.
  - **Khiếu nại giao hàng:** Báo giao sai món, giao chậm, đóng gói kém — ƯU TIÊN CAO.
  - **Hỏi về khuyến mãi:** Khách hỏi về voucher, deal, chương trình tích điểm.
  - **Đặt bàn:** Khách muốn đặt bàn trước.
  - **Khác:** Các trường hợp còn lại.

**2. Mức độ bức xúc**

- Loại dữ liệu: True / False
- AI Prompt: Khách có thể hiện tức giận rõ ràng, dọa đăng review xấu lên Google/Foody, dọa bóc phốt, hoặc yêu cầu hoàn tiền không? Trả True nếu có tiêu cực rõ ràng. Đặc biệt nghiêm trọng nếu liên quan đến vệ sinh an toàn thực phẩm.

**3. Khách có giới thiệu được không?**

- Loại dữ liệu: True / False
- AI Prompt: Khách có thể hiện ý định quay lại, giới thiệu bạn bè, đăng story review tích cực không? (VD: "Món ngon quá, mình sẽ review cho bạn", "Lần sau lại đến"). Trả True nếu có tín hiệu tích cực rõ ràng.

---

---

## NHÓM NGÀNH 7: TƯ VẤN DU LỊCH

### Ngành: Tư vấn Du lịch (Travel Agency / Tour Booking)

**Đặc thù ngành:**
- Khách hỏi rất nhiều về lịch trình, giá, địa điểm — cần track destination
- Mùa cao điểm (Tết, hè, lễ) ảnh hưởng mạnh đến nhu cầu
- Khách cần tư vấn chi tiết về khách sạn, ăn uống, transport, visa
- Booking thường qua nhiều bước: hỏi giá → cân nhắc → đặt cọc
- Khách nhắc đến số người, ngày đi, ngân sách → cần track travel profile
- Đối thủ là các OTA (Traveloka, VNBooking, Agoda) rất mạnh

---

#### Insight 1: Phân Tích Nhu Cầu Khách Du Lịch

**Mục đích:** Nắm bắt nhanh khách đang muốn đi đâu, khi nào, với ai, mức giá bao nhiêu.

**1. Điểm đến quan tâm**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Trích xuất tên địa điểm / điểm đến khách đang hỏi (VD: "Đà Nẵng", "Phú Quốc", "Nha Trang", "Hàn Quốc", "tour Nhật Bản"). Nếu hỏi chung chung, ghi "Không xác định".

**2. Loại hình du lịch**

- Loại dữ liệu: Lựa chọn đơn (Tour trọn gói / Tự túc / Du lịch mạo hiểm / Du lịch nghỉ dưỡng / Du lịch công tác / Không rõ)
- AI Prompt: Dựa vào nội dung chat, khách đang quan tâm loại hình du lịch nào?

**3. Mức độ quan tâm**

- Loại dữ liệu: Lựa chọn đơn (Nóng / Ấm / Lạnh)
- AI Prompt:
  - **Nóng:** Hỏi giá chi tiết, hỏi lịch khởi hành cụ thể, để lại SĐT, hỏi "đặt cọc được không", hỏi "còn chỗ không".
  - **Ấm:** Đang tư vấn về điểm đến, khách sạn, lịch trình nhưng chưa hỏi về giá cụ thể hoặc đặt cọc.
  - **Lạnh:** Hỏi 1 câu rồi không rep, hoặc từ chối.

**4. Nhu cầu cốt lõi**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách đang quan tâm điều gì nhất? (VD: "Tìm tour tiết kiệm dưới 5 triệu", "Cần đi gấp cuối tuần này", "Muốn đi Nhật mùa hoa anh đào"). Tóm tắt dưới 12 chữ.

---

#### Insight 2: Đánh Giá Chất Lượng Nguồn Lead Du Lịch

**Mục đích:** Đánh giá chiến dịch quảng cáo du lịch — tỉ lệ khách đặt cọc thực tế vs chỉ tham khảo giá.

**1. Khách hàng rác**

- Loại dữ liệu: True / False
- AI Prompt: Trả True nếu khách gửi tin nhắn tự động từ ads; nhắn để so sánh giá rồi đặt ở nơi khác; chat nội dung không liên quan. Ngược lại, trả False.

**2. Trạng thái thu thập SĐT**

- Loại dữ liệu: Lựa chọn đơn (Đã cho SĐT / Chưa cho / Khách từ chối)

**3. Rào cản chốt đơn**

- Loại dữ liệu: Phân loại (Chê giá đắt, Phí phụ thu / visa, Hỏi cho biết, So sánh với OTA (Traveloka/Agoda), Cần hỏi người đi cùng, Ngày chưa chốt, Không có rào cản)
- AI Prompt: Xác định lý do chính. "So sánh với OTA" là objection đặc trưng ngành du lịch — khách thường so sánh giá với Traveloka, Agoda, Klook.

**4. Nhu cầu đặt cọc**

- Loại dữ liệu: Lựa chọn đơn (Đã đặt cọc / Hỏi đặt cọc / Thăm dò / Không rõ)
- AI Prompt: Khách đã đặt cọc chưa, hay chỉ hỏi thông tin?

---

#### Insight 3: Đánh Giá Nhân Viên Tư Vấn Du Lịch

**Mục đích:** Kiểm soát chất lượng tư vấn — đặc biệt về lịch trình, khách sạn, giá cả, visa.

**1. Đánh giá Thái độ tư vấn**

- Loại dữ liệu: Lựa chọn đơn (Tốt / Trung bình / Kém)
- AI Prompt:
  - **Tốt:** Lịch sự, trả lời đúng trọng tâm, CÓ đặt câu hỏi mở ("Anh/chị dự định đi mấy người ạ?", "Có yêu cầu gì đặc biệt về khách sạn không ạ?", "Đi ngày nào ạ?"), gợi ý được điểm đến phù hợp, xử lý objection giá tốt.
  - **Trung bình:** Trả lời đủ thông tin nhưng thụ động.
  - **Kém:** Trả lời cộc lốc, thông tin sai về lịch trình / giá, không follow-up khách.

**2. Lỗi mất khách do Sale**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Tóm tắt lỗi Sale dưới 10 chữ. (VD: "Giá báo khác với thực tế", "Không gửi lịch trình chi tiết", "Bỏ quên khách 2 ngày"). Nếu Sale tốt, ghi "Không có lỗi".

---

#### Insight 4: Phân Tích Chân Dung Khách Du Lịch

**Mục đích:** Hiểu khách hàng — điểm đến yêu thích, ngân sách, mùa đi, nhóm đối tượng — để Marketer personalise Ads.

**1. Điểm đến yêu thích**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách nhắc đến địa điểm họ thích hoặc đã từng đi không? Trích xuất tên địa điểm. Nếu không, ghi "Không xác định".

**2. Quốc gia / Vùng lãnh thổ**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách muốn đi trong nước hay nước ngoài? Trích xuất quốc gia/vùng lãnh thổ (VD: "Hàn Quốc", "Nhật Bản", "Đà Nẵng", "Phú Quốc"). Nếu hỏi chung, ghi "Trong nước" hoặc "Nước ngoài".

**3. Số người đi**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách nhắc đến số lượng người đi chưa? (VD: "2 người lớn 1 trẻ em", "đi cùng gia đình 5 người", "solo"). Trích xuất. Nếu không, ghi "Không đề cập".

**4. Khoảng ngân sách**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Khách nhắc đến số tiền dự định chi cho chuyến đi không? (VD: "dưới 10 triệu cho 2 người", "tour cao cấp không giới hạn"). Nếu không, ghi "Không đề cập".

---

#### Insight 5: Phân Tích Đối Thủ Du Lịch

**Mục đích:** Theo dõi khi khách so sánh với các OTA (Traveloka, Agoda, Klook, Vntrip...) hoặc công ty du lịch khác.

**1. Có nhắc đến đối thủ không?**

- Loại dữ liệu: True / False
- AI Prompt: Khách có nhắc đến OTA (Traveloka, Agoda, Klook, Mytour...) hoặc công ty du lịch khác để so sánh không?

**2. Tên đối thủ**

- Loại dữ liệu: Văn bản ngắn (Short Text)
- AI Prompt: Trích xuất tên đối thủ được nhắc. Nếu không, ghi "Không có".

**3. Tiêu chí so sánh**

- Loại dữ liệu: Phân loại (Giá cả / Lịch trình / Khách sạn / Visa / Hỗ trợ 24/7 / Uy tín / Không có)
- AI Prompt: Khách so sánh yếu tố gì? (VD: "bên Klook rẻ hơn 500k" → Giá cả; "Agoda có lịch linh hoạt hơn" → Lịch trình).

---

#### Insight 6: Phân Tích Hậu Du Lịch / Khiếu Nại Sau Tour

**Mục đích:** Phát hiện sớm khách không hài lòng sau chuyến đi — nguy cơ review xấu cao.

**1. Phân loại mục đích tin nhắn**

- Loại dữ liệu: Lựa chọn đơn (Khiếu nại dịch vụ / Hỏi hoàn tiền / Xin bồi thường / Phản hồi tích cực / Hỏi đặt tour mới / Khác)
- AI Prompt:
  - **Khiếu nại dịch vụ:** Báo khách sạn không đúng như mô tả, xe hỏng, hướng dẫn viên kém, bữa ăn không đảm bảo — ƯU TIÊN CAO.
  - **Hỏi hoàn tiền / Xin bồi thường:** Khách yêu cầu hoàn tiền hoặc bồi thường — ƯU TIÊN CAO NHẤT, nguy cơ review xấu rất cao.
  - **Phản hồi tích cực:** Khách khen dịch vụ tốt, muốn giới thiệu bạn bè.
  - **Hỏi đặt tour mới:** Khách quay lại hỏi tour khác.
  - **Khác:** Các trường hợp còn lại.

**2. Mức độ bức xúc**

- Loại dữ liệu: True / False
- AI Prompt: Khách có thể hiện tức giận rõ ràng, dọa đăng review xấu, dọa kiện, hoặc đề nghị bồi thường không? Trả True nếu có tiêu cực rõ ràng. Đặc biệt nghiêm trọng nếu liên quan đến an toàn trong chuyến đi.

**3. Khách có giới thiệu được không?**

- Loại dữ liệu: True / False
- AI Prompt: Khách có thể hiện ý định giới thiệu bạn bè, đi tour tiếp, hoặc khen ngợi dịch vụ để lan tỏa không? Trả True nếu có tín hiệu tích cực rõ ràng.
