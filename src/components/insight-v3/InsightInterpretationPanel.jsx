/**
 * Interpretation panel — markdown text summary
 */
const INTERPRETATION = `
## Tổng quan thực trạng

### 📊 Chất lượng hội thoại

Trong 7 ngày qua, hệ thống đã ghi nhận **15.000 cuộc hội thoại** qua các kênh Facebook và Zalo OA. Điểm đáng chú ý là tỷ lệ **Lead Nóngchiếm 34%** — đây là tín hiệu tích cực cho thấy nội dung tư vấn đang chạm đúng nhu cầu khách hàng.

Tuy nhiên, tỷ lệ **Khách rác ở mức 937 (6%)** — đây là nhóm cần được lọc sớm để tránh lãng phí nhân sự.

---

### 🔥 Lead Nóng — Cần ưu tiên

**5.167 Lead Nóng** đã được phân loại — đây là nhóm khách hàng có ý định mua rõ ràng nhất. Đặc điểm chung của nhóm này:

- Đặt câu hỏi cụ thể về giá và tính năng sản phẩm
- Hỏi về chế độ bảo hành và đổi trả
- So sánh giá giữa các sản phẩm cùng phân khúc

**Hành động ngay:** Phân công nhân viên CSKH gọi lại trong 24h với nhóm Lead Nóng từ ngày 06-07/04.

---

### 💬 Cảm xúc khách hàng

| Trạng thái | Tỷ lệ | Hành động |
|---|---|---|
| ✅ Tích cực (55%) | 55% | Duy trì — tiếp tục script hiện tại |
| 🟡 Băn khoăn (26%) | 26% | Cần FAQ rõ ràng hơn |
| 🔴 Tiêu cực (20%) | 20% | **Ưu tiên cao** — kiểm tra phễu chuyển đổi |

---

### ⚠️ Pain Points nổi bật

1. **Da lão hóa sớm (1.316 lượt)** — Nhu cầu tư vấn serum chống lão hóa cao nhất. Đây là cơ hội upsell serum dưỡng ẩm cao cấp.

2. **Muốn được giảm giá (1.301 lượt)** — Khách hàng nhạy cảm về giá. Cân nhắc chương trình khuyến mãi theo ngưỡng mua.

3. **Tìm mẫu phù hợp (1.298 lượt)** — Thiếu công cụ gợi ý sản phẩm theo loại da. Cần thêm quiz tư vấn da.

---

### 💡 Lời khuyên chuyên gia

#### Ngắn hạn (1-2 tuần)
- Tạo **template FAQ tự động** trả lời 80% câu hỏi về giá và bảo hành
- Thiết lập **bot phân loại Lead** tự động ngay lần nhắn đầu tiên
- Đẩy thông báo **"Khuyến mãi 48h"** tới nhóm khách đã băn khoăn

#### Trung hạn (1 tháng)
- Xây dựng **Skin Quiz** tích hợp Zalo OA — gợi ý sản phẩm theo loại da
- A/B test 3-5 scripts tư vấn khác nhau → chọn script có conversion cao nhất
- Tạo **Lookalike Audience** từ nhóm Lead Nóng để nhắm quảng cáo

#### Dài hạn (3 tháng)
- Xây dựng **CRM riêng** cho nhóm khách hàng Mỹ phẩm — theo dõi lifecycle
- Huấn luyện AI mô hình phân loại Lead Nóng/Ấm/Lạnh tự động
- Thiết lập **weekly report** tự động gửi về inbox quản lý

---

### 📈 KPIs theo dõi tuần tới

| Chỉ số | Baseline | Mục tiêu |
|---|---|---|
| Lead Nóng rate | 34% | 40% |
| Khách rác rate | 6% | < 4% |
| Thời gian phản hồi | 4 phút | < 2 phút |
| Conversion rate | 12% | 18% |
`

export function InsightInterpretationPanel() {
  const renderMarkdown = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-base font-bold text-[#191c1e] mt-5 mb-2">{line.slice(3)}</h2>
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-sm font-semibold text-[#191c1e] mt-4 mb-2">{line.slice(4)}</h3>
      }
      if (line.startsWith('#### ')) {
        return <h4 key={i} className="text-xs font-semibold text-[#0052FF] mt-3 mb-1 uppercase tracking-wide">{line.slice(5)}</h4>
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="text-sm text-[#424754] ml-4 mb-1 list-disc">{line.slice(2)}</li>
      }
      if (line.startsWith('|')) {
        const cells = line.split('|').filter(c => c.trim())
        const isHeader = cells.every(c => c.trim().match(/^[A-Z]/))
        return (
          <div key={i} className={`grid gap-2 text-sm ${cells.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} ${isHeader ? 'font-semibold text-[#191c1e] border-b border-[#c2c6d6]/15 pb-1' : 'text-[#424754] py-1'}`}>
            {cells.map((cell, j) => (
              <span key={j} className="truncate">{cell.trim()}</span>
            ))}
          </div>
        )
      }
      if (line.match(/^\d+\.\s/)) {
        return <li key={i} className="text-sm text-[#424754] ml-4 mb-1 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>
      }
      if (line.trim() === '---') {
        return <hr key={i} className="border-[#c2c6d6]/15 my-4" />
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2" />
      }
      const parts = line.split(/(\*\*[^*]+\*\*)/)
      return (
        <p key={i} className="text-sm text-[#424754] leading-relaxed mb-1">
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={j} className="font-semibold text-[#191c1e]">{part.slice(2, -2)}</strong>
              : part
          )}
        </p>
      )
    })
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block px-2 py-0.5 bg-[#0058be]/10 text-[#0058be] text-xs font-medium rounded">Tổng hợp</span>
      </div>
      <div className="space-y-1">
        {renderMarkdown(INTERPRETATION)}
      </div>
    </div>
  )
}
