/**
 * AI Service — Custom AI Endpoint (token.ai.vn)
 *
 * Endpoint : https://token.ai.vn/v1/chat/completions
 * Model    : gpt-4.1-mini
 * Key      : sk-LEd49hmmEG9L4kB_aYYGhHHJirAsbtLkmyNReBe_yYgv3IRtAIhp8vJ_hjE
 */

// ─── Config ──────────────────────────────────────────────────────────────────
const AI_ENDPOINT = 'https://token.ai.vn/v1/chat/completions';
const AI_MODEL    = 'gpt-4.1-mini';
const AI_KEY     = 'sk-LEd49hmmEG9L4kB_aYYGhHHJirAsbtLkmyNReBe_yYgv3IRtAIhp8vJ_hjE';

// ─── Prompt System Prompt ───────────────────────────────────────────────────
const SYSTEM_PROMPT = `Bạn là một chuyên gia phân tích hội thoại khách hàng (Conversation Intelligence) cho doanh nghiệp Việt Nam.

Nhiệm vụ của bạn: Dựa trên thông tin doanh nghiệp được cung cấp, hãy sinh ra:
1. MỘT "Master AI Insight Business" — tổng quan chiến lược phân tích hội thoại cho doanh nghiệp đó
2. SÁU "Insight chi tiết" — mỗi insight gồm: Tên, Mô tả, Icon, và danh sách các Cột (columns) với: Tên cột, Prompt AI, Kiểu dữ liệu (single_select / true_false / short_text / dropdown)

## 6 Pattern Insight Cố Định (áp dụng mọi ngành)

| # | Tên Insight | Mục đích |
|---|-------------|----------|
| 1 | Phân Tích Nhu Cầu Khách Hàng | Trích xuất sản phẩm, pain point, mức độ quan tâm |
| 2 | Đánh Giá Chất Lượng Nguồn Lead | Junk lead, thu thập SĐT, objection, nguồn Ads |
| 3 | Đánh Giá Nhân Viên Tư Vấn | Thái độ tư vấn, kịch bản bán hàng, hiệu suất chốt đơn, bỏ sót hội thoại, khách im lặng |
| 4 | Phân Tích Chân Dung Khách Hàng | Giới tính, location, budget, phân khúc KH |
| 5 | Phân Tích Đối Thủ Cạnh Tranh | Đối thủ được nhắc, tên, tiêu chí so sánh |
| 6 | Phân Tích Hậu Mua / Chăm Sóc Sau Mua | Mục đích tin nhắn, mức độ bức xúc, giới thiệu được |

## Chi tiết Pattern #3 — Đánh Giá Nhân Viên Tư Vấn (BẮT BUỘC)
Insight #3 phải có đúng 5 cột sau:

| # | Tên cột | Kiểu | Options |
|---|---------|------|---------|
| 1 | Thái độ tư vấn | single_select | ["Tốt", "Trung bình", "Kém"] |
| 2 | Kịch bản bán hàng | single_select | ["Tư vấn chi phí", "Khai thác thông tin", "Ưu đãi cá nhân hóa", "Giải quyết vấn đề"] |
| 3 | Chốt đơn thành công | true_false | — |
| 4 | Bỏ sót hội thoại | true_false | — |
| 5 | Khách im lặng | true_false | — |

## Kiểu dữ liệu cột
- \`single_select\`: 1 lựa chọn duy nhất trong dropdown (3-6 options)
- \`true_false\`: Boolean đúng/sai
- \`short_text\`: Văn bản ngắn dưới 12 chữ
- \`dropdown\`: 1 hoặc nhiều tags

## Quy tắc quan trọng
- Tất cả output phải là TIẾNG VIỆT
- Mỗi insight gồm 2-5 cột
- Mỗi cột phải có: name, prompt, type (một trong: single_select / true_false / short_text / dropdown)
- Nếu type = single_select hoặc dropdown → phải có dataOptions (array 3-6 strings)
- Đặc biệt chú ý objection đặc thù của ngành
- Lead Temperature luôn là: ["Nóng", "Ấm", "Lạnh"]

## Output Format (JSON)
{
  "masterInsight": {
    "name": "Tên Master Insight",
    "description": "Mô tả chiến lược phân tích tổng quan",
    "icon": "🏢",
    "focusAreas": ["Focus 1", "Focus 2", "Focus 3"]
  },
  "insights": [
    {
      "name": "Tên Insight",
      "description": "Mô tả ngắn",
      "icon": "🎯",
      "columns": [
        {
          "name": "Tên cột",
          "prompt": "Prompt chi tiết cho AI trích xuất",
          "type": "single_select | true_false | short_text | dropdown",
          "dataOptions": ["Option 1", "Option 2"] // null nếu type = short_text / true_false
        }
      ]
    }
  ]
}`;

// ─── Call AI ─────────────────────────────────────────────────────────────────
/**
 * Gọi Custom AI endpoint.
 * @param {string} userPrompt - Prompt người dùng (thông tin doanh nghiệp)
 * @returns {Promise<{masterInsight, insights}>}
 */
export async function callCustomAI(userPrompt) {
  const response = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userPrompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI API Error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? '';

  // Parse JSON từ response
  // AI có thể trả markdown code block → strip
  const jsonStr = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error(`AI trả về không phải JSON hợp lệ: ${jsonStr.slice(0, 200)}`);
  }
}

// ─── Build User Prompt ───────────────────────────────────────────────────────
/**
 * Build prompt từ thông tin doanh nghiệp.
 */
export function buildBusinessPrompt({ businessName, industry, industryLabel, scale, targetAudience, analysisGoals }) {
  return `## Thông tin Doanh nghiệp

- **Tên doanh nghiệp:** ${businessName}
- **Ngành hàng:** ${industryLabel} (${industry})
- **Quy mô:** ${scale}
- **Tập khách hàng mục tiêu:** ${targetAudience}
- **Mong muốn phân tích hội thoại:** ${analysisGoals}

Hãy sinh Master AI Insight Business và 6 Insight chi tiết phù hợp với doanh nghiệp này.`;
}

// ─── Scale options ───────────────────────────────────────────────────────────
export const SCALE_OPTIONS = [
  'Cá nhân / Freelancer',
  'Doanh nghiệp nhỏ (1-5 nhân viên)',
  'Doanh nghiệp nhỏ & vừa (5-20 nhân viên)',
  'Doanh nghiệp vừa (20-50 nhân viên)',
  'Doanh nghiệp lớn (50+ nhân viên)',
];

// ─── Industry mapping ────────────────────────────────────────────────────────
export const INDUSTRIES_WITH_LABELS = [
  { id: 'fashion',    label: 'Thời trang',       icon: '👗' },
  { id: 'mebaby',     label: 'Mẹ và Bé',          icon: '🍼' },
  { id: 'cosmetics',  label: 'Mỹ phẩm / Làm đẹp',  icon: '💄' },
  { id: 'spa',        label: 'Spa / Thẩm mỹ',      icon: '💆' },
  { id: 'realestate', label: 'Bất động sản',        icon: '🏠' },
  { id: 'fnb',        label: 'F&B / Nhà hàng',      icon: '🍜' },
  { id: 'travel',     label: 'Du lịch',             icon: '✈️' },
  { id: 'ecommerce',  label: 'Thương mại điện tử', icon: '🛒' },
  { id: 'education',  label: 'Giáo dục / Đào tạo', icon: '📚' },
  { id: 'healthcare', label: 'Y tế / Sức khỏe',    icon: '🏥' },
  { id: 'automotive', label: 'Ô tô / Xe máy',     icon: '🚗' },
  { id: 'other',      label: 'Ngành khác',          icon: '📦' },
];
