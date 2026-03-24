/**
 * mockDataService.js
 * Runtime mock data generator — tạo conversations + analysis results
 * cho mọi insight mới (Template flow lẫn AI flow).
 *
 * Kiến trúc:
 *   insights[] → stored in localStorage (user's insight list)
 *   Mỗi insight có thể có:
 *     - conversations: chỉ lookup từ mockConversations[key] (static 42 templates)
 *     - HOẶC runtimeConversations[key]: injected vào InsightDetail
 *
 * Key convention:
 *   Template flow:    key = template.id (e.g. 'fsh-1')
 *   AI flow:         key = insight.id (e.g. 'ai-ins-174...-0')
 *
 * Với AI flow, ta lưu runtime data vào module-level Map (không cần localStorage).
 * Với Template flow, ta tạo data cho template mới chưa có trong mockConversations.
 */

import { mockConversations } from '../data/mockConversations';
import { mockAnalysisResults } from '../data/mockAnalysisResults';

// ─── Module-level registry cho runtime data (AI-generated insights) ───────────
const runtimeConversations = {};   // { insightId: { columns, rows } }
const runtimeAnalysis      = {};   // { insightId: { summary, temperature, ... } }
const runtimeTrend         = {};   // { insightId: [...daily points...] }

// ─── Seed pools ──────────────────────────────────────────────────────────────

const FIRST_NAMES_MALE   = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const FIRST_NAMES_FEMALE = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Trương', 'Hà', 'Phan', 'Đỗ', 'Lê'];
const LAST_NAMES_MALE    = ['Anh', ' Khoa', 'Minh', 'Tuấn', 'Hùng', 'Đức', 'Phong', 'Long', 'Thắng', 'Dũng', 'Nam', 'Quang', 'Việt', 'Tài', 'Trung'];
const LAST_NAMES_FEMALE  = ['Lan', 'Hương', 'Mai', 'Ngọc', 'Linh', 'Hà', 'Phương', 'Trang', 'Thảo', 'Yến', 'Anh', 'Chi', 'Vy', 'Lâm', 'Hoa'];
const LOCATIONS          = ['TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Biên Hòa', 'Nha Trang', 'Hạ Long', 'Vũng Tàu', 'Cà Mau', 'Quy Nhơn', 'Thanh Hóa'];
const PLATFORMS          = ['facebook', 'zalo'];

// ─── Smart pool selectors per industry ───────────────────────────────────────

const POOLS = {
  fashion: {
    products:     ['Áo thun oversize', 'Đầm công sở', 'Quần jeans', 'Túi xách', 'Giày sneaker', 'Áo sơ mi', 'Chân váy', 'Cardigan', 'Áo khoác', 'Váy maxi', 'Set bộ', 'Áo hai dây'],
    painPoints:   ['Tìm đầm đi tiệc', 'Cần đồ mùa hè', 'Chất liệu thoáng mát', 'Size chuẩn', 'Giá hợp lý', 'Phong cách tối giản', 'Đồ đi chơi', 'Công sở hàng ngày'],
    temperatures: ['Nóng', 'Nóng', 'Nóng', 'Ấm', 'Ấm', 'Lạnh'], // weighted toward hot
    objections:   ['Giá đắt', 'Phí ship', 'Không có size', 'Hàng có hàng không', 'Chờ sale', 'Xem thêm'],
    mistakes:     ['Không tư vấn size', 'Không hỏi mục đích mua', 'Rep trễ', 'Không gửi ảnh thật', 'Chat hời hợt'],
    competitors:  ['Zara', 'H&M', 'Uniqlo', 'Shein', 'Coolmate', 'YODY', 'Mayori'],
  },
  mebaby: {
    products:     ['Tã', 'Sữa công thức', 'Bỉm', 'Máy hâm sữa', 'Ghế ăn dặm', 'Bình sữa', 'Khăn ướt', 'Son dưỡng', 'Kem chống hăm', 'Yến mạch', 'Bánh ăn dặm', 'Dầu tắm'],
    painPoints:   ['An toàn cho bé', 'Tuổi bé phù hợp', 'Không hóa chất', 'Giá cả', 'Chất lượng', 'Nguồn gốc rõ ràng'],
    temperatures: ['Nóng', 'Nóng', 'Ấm', 'Ấm', 'Lạnh'],
    objections:   ['Lo ngại an toàn', 'Hỏi chồng', 'So sánh giá', 'Chờ khuyến mãi', 'Mua thử', 'Hỏi thêm về thành phần'],
    mistakes:     ['Không hỏi tuổi bé', 'Không đề cập an toàn', 'Rep trễ giờ', 'Gửi sp không phù hợp tuổi', 'Tư vấn thiếu'],
    competitors:  ['Pampers', 'Huggies', 'Mead Johnson', 'Friso', 'Aptamil', 'Bobby'],
  },
  cosmetics: {
    products:     ['Serum vitamin C', 'Kem chống nắng', 'Kem dưỡng ẩm', 'Sữa rửa mặt', 'Tẩy tế bào chết', 'Mặt nạ', 'Son môi', 'Phấn nước', 'Eye cream', 'Tinh chất', 'Kem nền', 'Xịt khoáng'],
    painPoints:   ['Da dầu hay mụn', 'Da nhạy cảm', 'Trị thâm nám', 'Cấp ẩm sâu', 'Chống lão hóa', 'Thu nhỏ lỗ chân lông'],
    temperatures: ['Nóng', 'Nóng', 'Ấm', 'Ấm', 'Lạnh'],
    objections:   ['Lo ngại hàng fake', 'Hỏi thành phần', 'Da có phản ứng không', 'So sánh với sp khác', 'Giá cao', 'Chờ review'],
    mistakes:     ['Không hỏi loại da', 'Không đề cập test thử', 'Gửi sp không phù hợp', 'Không tư vấn cách dùng'],
    competitors:  ['The Ordinary', 'Some By Mi', 'COSRX', 'Laneige', 'SK-II', 'Cocoon', 'Garnier'],
  },
  spa: {
    products:     ['Trị nám laser', 'Triệt lông', 'Nâng cơ RF', 'Trị mụn', 'Kem dưỡng sau liệu trình', 'Tẩy tế bào', 'Massage thư giãn', 'Đắp mặt nạ', 'Trị sẹo', 'Cấy collagen'],
    painPoints:   ['Kết quả có ngay không', 'Bác sĩ có kinh nghiệm', 'Liệu trình bao lâu', 'Giá hợp lý', 'Có bảo hành không'],
    temperatures: ['Nóng', 'Ấm', 'Ấm', 'Lạnh', 'Lạnh'],
    objections:   ['Giá cao', 'Sợ đau', 'Cần xem review trước', 'Hỏi bác sĩ', 'So sánh chỗ khác'],
    mistakes:     ['Không tư vấn liệu trình', 'Không hẹn đúng giờ', 'Tư vấn quá nhiều sp', 'Không theo dõi sau'],
    competitors:  ['Thu Cúc', 'Kangnam', 'Ngon', 'La Fille', 'Dalat Hasfarm'],
  },
  realestate: {
    products:     ['Căn hộ 2PN', 'Nhà phố', 'Đất nền', 'Biệt thự', 'Căn hộ Studio', 'Shophouse', 'Condotel', 'Officetel'],
    painPoints:   ['Pháp lý sạch không', 'Vị trí gần trung tâm', 'Ngân sách phù hợp', 'Hạ tầng xung quanh', 'Tính thanh khoản', 'Cho thuê được không'],
    temperatures: ['Nóng', 'Nóng', 'Ấm', 'Lạnh'],
    objections:   ['Pháp lý chưa rõ', 'Ngân sách không xác nhận', 'Cò mồi', 'Xem thực tế', 'So sánh dự án', 'Chờ giảm giá'],
    mistakes:     ['Gửi bđs không phù hợp budget', 'Không đề cập pháp lý', 'Cố chốt quá sớm', 'Không hẹn xem nhà'],
    competitors:  ['Novaland', 'Vingroup', 'Keangnam', 'Hưng Thịnh', 'Phú Long', 'Cen Land'],
  },
  fnb: {
    products:     ['Set lunch', 'Buffet', 'Giao tận nơi', 'Đặt bàn', 'Combo gia đình', 'Menu trẻ em', 'Đồ uống', 'Bánh ngọt'],
    painPoints:   ['Quán gần không', 'Có giao hàng không', 'Không gian đẹp', 'Đồ ăn ngon', 'Giá cả', 'Đông không'],
    temperatures: ['Nóng', 'Nóng', 'Ấm', 'Ấm', 'Lạnh'],
    objections:   ['Quá xa', 'Không có chi nhánh gần', 'Giá cao', 'Chờ khuyến mãi', 'Xem review'],
    mistakes:     ['Không hỏi số người', 'Không xác nhận giờ đến', 'Rep trễ', 'Không gửi menu'],
    competitors:  ['Kichi Kichi', 'Gogi House', 'Pizza 4P', 'Little Japan', 'Sushi Kei', 'Phở 24'],
  },
  travel: {
    products:     ['Tour Nha Trang 3N2Đ', 'Vé máy bay', 'Khách sạn 5 sao', 'Combo tiết kiệm', 'Visa', 'Bảo hiểm du lịch', 'Tour Hàn Quốc', 'Resort biển'],
    painPoints:   ['Budget bao nhiêu', 'Có visa không', 'Thời điểm nào đẹp', 'An toàn không', 'Có phù hợp gia đình không'],
    temperatures: ['Nóng', 'Nóng', 'Ấm', 'Lạnh', 'Lạnh'],
    objections:   ['So sánh với Traveloka', 'So sánh với Agoda', 'Đặt cọc bao nhiêu', 'Hoàn tiền được không', 'Hỏi về visa'],
    mistakes:     ['Không hỏi ngày đi', 'Không tư vấn tour phù hợp', 'Gửi tour không đúng budget', 'Rep trễ'],
    competitors:  ['Traveloka', 'Agoda', 'Vietnam Airlines', 'Vietravel', 'Saigontourist', 'Klook'],
  },
};

// ─── Pure utility helpers ─────────────────────────────────────────────────────

function pick(arr, seed) {
  return arr[Math.abs(seed) % arr.length];
}

function weighted(arr, weights, seed) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.abs(seed) % total;
  for (let i = 0; i < arr.length; i++) {
    r -= weights[i];
    if (r < 0) return arr[i];
  }
  return arr[arr.length - 1];
}

function generateCustomerName(seed, gender) {
  const firstMale   = pick(FIRST_NAMES_MALE, seed * 3 + 1);
  const firstFemale = pick(FIRST_NAMES_FEMALE, seed * 3 + 2);
  const lastMale    = pick(LAST_NAMES_MALE, seed * 7 + 3);
  const lastFemale  = pick(LAST_NAMES_FEMALE, seed * 7 + 4);
  const genderVal  = seed % 3 === 0 ? 'male' : seed % 3 === 1 ? 'female' : 'unknown';
  const first = genderVal === 'male' ? firstMale : firstFemale;
  const last  = genderVal === 'male' ? lastMale  : lastFemale;
  return { name: `${first} ${last}`, gender: genderVal };
}

function seededRandom(seed, min, max) {
  const val = min + (Math.abs(Math.sin(seed * 9301 + 49297) * 233280) % (max - min));
  return Math.round(val);
}

// ─── Core generators ───────────────────────────────────────────────────────────

/**
 * Derive a camelCase field key from a column name or explicit field property.
 * Falls back to 'field_0', 'field_1', ... if no name is available.
 */
function deriveFieldKey(col, ci) {
  if (col.field) return col.field;
  if (col.name) {
    // Normalize: lowercase, remove accents, spaces/hyphens → camelCase
    const normalized = col.name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip diacritics
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .split(' ')
      .map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1))
      .join('');
    return normalized || `field_${ci}`;
  }
  return `field_${ci}`;
}

/**
 * generateConversations(insightId, columns, industry, rowCount = 20)
 *
 * Tạo mockup conversation rows + columns metadata
 * cho một insight mới (Template flow hoặc AI flow).
 *
 * columns: array of { name, field?, dataType?, dataOptions? }
 */
export function generateConversations(insightId, columns, industry, rowCount = 20) {
  const pool = POOLS[industry] || POOLS.fashion;

  // Build columns metadata with stable field keys
  const colMeta = (columns || []).map((col, ci) => {
    const field = deriveFieldKey(col, ci);
    return {
      id:    `${insightId}-${field}`,
      name:  col.name,
      field,
    };
  });

  // Always include customer + platform columns
  if (!colMeta.find(c => c.field === 'customer')) {
    colMeta.unshift({ id: `${insightId}-customer`, name: 'Khách hàng', field: 'customer' });
  }
  if (!colMeta.find(c => c.field === 'platform')) {
    colMeta.push({ id: `${insightId}-platform`, name: 'Kênh', field: 'platform' });
  }

  // Generate rows
  const rows = Array.from({ length: rowCount }, (_, i) => {
    const seed = Date.now() + i * 137 + (insightId.charCodeAt(insightId.length - 1) || 0) * 31;
    const { name, gender } = generateCustomerName(seed, null);
    const row = {
      id:       `${insightId}-row-${i + 1}`,
      customer: name,
      gender:   gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : 'Không rõ',
      platform: pick(PLATFORMS, seed + 9),
      location: pick(LOCATIONS, seed + 5),
    };

    // Fill data per column
    (columns || []).forEach((col, ci) => {
      const field = deriveFieldKey(col, ci);
      const s = seed + ci * 53;
      const n = col.name?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || '';
      const f = col.field || field;

      if (col.dataType === 'true_false' || col.dataType === 'boolean') {
        row[field] = seededRandom(s, 0, 10) < 3; // ~30% true
        return;
      }

      // Smart value selection based on field name
      if (f === 'temperature' || n.includes('quan tâm') || n.includes('nhiệt') || n.includes('mức độ')) {
        row[field] = weighted(pool.temperatures, [3, 3, 2, 2, 1], s);
      } else if (f === 'painpoint' || n.includes('nhu cầu') || n.includes('pain') || n.includes('cốt lõi')) {
        row[field] = pick(pool.painPoints, s);
      } else if (f === 'objection' || n.includes('rào cản') || n.includes('objection') || n.includes('băn khoăn')) {
        row[field] = pick(pool.objections, s);
      } else if (f === 'product' || n.includes('sản phẩm') || n.includes('mẫu')) {
        row[field] = pick(pool.products, s);
      } else if (f === 'competitor' || f === 'competitorname' || n.includes('đối thủ') || n.includes('competitor')) {
        row[field] = pick(pool.competitors, s);
      } else if (n.includes('lỗi') || n.includes('mistake') || n.includes('sai')) {
        row[field] = pick(pool.mistakes, s);
      } else if (n.includes('khu vực') || n.includes('location') || n.includes('tp') || n.includes('tỉnh')) {
        row[field] = pick(LOCATIONS, s);
      } else if (n.includes('size') || n.includes('size')) {
        row[field] = pick(['S', 'M', 'L', 'XL', 'Freesize', '28', '29', '30', '31', '32'], s);
      } else if (col.dataOptions?.length > 0) {
        row[field] = pick(col.dataOptions, s);
      } else {
        row[field] = pick(pool.products, s);
      }
    });

    return row;
  });

  return { columns: colMeta, rows };
}

/**
 * generateAnalysis(conversationsData)
 *
 * Tạo analysis results từ conversations data.
 * Chỉ cần conversations.rows để tính toán summary + metric cards.
 */
export function generateAnalysis(conversationsData) {
  const rows = conversationsData?.rows || [];
  if (rows.length === 0) return null;

  const seed = Date.now();
  const total = rows.length;

  // Temperature
  const tempCount = { hot: 0, warm: 0, cold: 0 };
  rows.forEach(row => {
    const t = row.temperature || row.mucDoQuanTam || '';
    if (t === 'Nóng' || t === 'Hot') tempCount.hot++;
    else if (t === 'Ấm' || t === 'Warm') tempCount.warm++;
    else tempCount.cold++;
  });

  // Smart counts
  const getCount = (field, val) => rows.filter(r => String(r[field]) === String(val)).length;
  const genderCount = {
    female: getCount('gender', 'Nữ'),
    male:   getCount('gender', 'Nam'),
    unknown: getCount('gender', 'Không rõ') + getCount('gender', null) + getCount('gender', ''),
  };
  const locations = {};
  rows.forEach(r => { if (r.location) locations[r.location] = (locations[r.location] || 0) + 1; });
  const topLocations = Object.entries(locations).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([text, count]) => ({ text, count }));

  const products = {};
  rows.forEach(r => { if (r.product) products[r.product] = (products[r.product] || 0) + 1; });
  const topProducts = Object.entries(products).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ text: name, count }));

  // Pain points
  const painPoints = {};
  rows.forEach(r => { if (r.painPoint) painPoints[r.painPoint] = (painPoints[r.painPoint] || 0) + 1; });
  const topPain = Object.entries(painPoints).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([text, count]) => ({ text, count }));

  // Objections
  const objections = {};
  rows.forEach(r => { if (r.objection) objections[r.objection] = (objections[r.objection] || 0) + 1; });
  const topObj = Object.entries(objections).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([text, count]) => ({ text, count }));

  // Competitors
  const competitors = {};
  rows.forEach(r => { if (r.competitorName || r.competitor) { const c = r.competitorName || r.competitor; competitors[c] = (competitors[c] || 0) + 1; } });
  const topComp = Object.entries(competitors).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ text: name, count }));

  // Junk
  const junkCount = rows.filter(r => r.isJunk === true || r.junkLead === true).length;
  const junkRate  = Math.round((junkCount / total) * 100);

  // Sentiment
  const negCount  = rows.filter(r => r.isNegative === true || r.sentiment === 'Tiêu cực' || r.sentiment === 'negative').length;
  const posCount  = rows.filter(r => r.sentiment === 'Tích cực' || r.sentiment === 'positive').length;
  const neuCount  = total - negCount - posCount;

  // Phone collection
  const phoneCollected = rows.filter(r => r.phoneStatus === 'Đã cho SĐT').length;
  const phoneRefused   = rows.filter(r => r.phoneStatus === 'Từ chối').length;
  const phoneNotAsked  = rows.filter(r => !r.phoneStatus || r.phoneStatus === 'Chưa cho').length;

  // Attitude
  const attGood  = seededRandom(seed + 1, Math.round(total * 0.4), Math.round(total * 0.7));
  const attAvg   = seededRandom(seed + 2, Math.round(total * 0.15), Math.round(total * 0.35));
  const attPoor  = total - attGood - attAvg;

  const analyzedAt = new Date(Date.now() - seededRandom(seed, 5, 180) * 60 * 1000).toISOString();

  return {
    summary: {
      totalConversations: total,
      analyzedAt,
    },
    temperature:       { hot: tempCount.hot, warm: tempCount.warm, cold: tempCount.cold },
    productInterest:  topProducts,
    topPainPoints:    topPain.length > 0 ? topPain : [{ text: 'Chưa có đủ dữ liệu', count: 1 }],
    topObjections:    topObj.length > 0 ? topObj : [{ text: 'Không có rào cản nổi bật', count: 1 }],
    junkRate,
    qualityRate: Math.round(((total - junkCount) / total) * 100),
    phoneCollection: { collected: phoneCollected, refused: phoneRefused, notAsked: phoneNotAsked },
    attitude:        { good: attGood, average: attAvg, poor: Math.max(0, attPoor) },
    gender:          genderCount,
    topLocations:    topLocations.length > 0 ? topLocations : [{ text: 'TP.HCM', count: Math.round(total * 0.3) }],
    competitorMentions: {
      mentioned: rows.filter(r => r.competitorName || r.competitor).length,
      notMentioned: rows.filter(r => !r.competitorName && !r.competitor).length,
    },
    topCompetitors: topComp.length > 0 ? topComp : [{ text: 'Chưa nhắc đến đối thủ', count: 1 }],
    negativeSentiment: { negative: negCount, neutral: neuCount, positive: posCount },
  };
}

/**
 * generateTrendData(conversationsData, days = 7)
 *
 * Tạo daily trend points (phù hợp InsightTrendChart).
 */
export function generateTrendData(conversationsData, days = 7) {
  const rows = conversationsData?.rows || [];
  const total = rows.length;
  const now   = new Date();

  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    const dayStr  = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    // Simulate organic daily counts
    const baseCount = Math.round(total / days);
    const variance = Math.round((Math.sin(i * 1.7 + total * 0.1) + 1) * baseCount * 0.3);
    const count = Math.max(0, baseCount + variance + (i === days - 1 ? Math.round(total * 0.1) : 0));

    const hotPct  = 0.3 + Math.sin(i * 0.8) * 0.15;
    const warmPct = 0.35 + Math.cos(i * 0.6) * 0.1;

    return {
      date:         dayStr,
      Hội_thoại:    count,
      'Nóng (%)':   Math.round((hotPct + Math.sin(i * 1.2) * 0.05) * 100),
      'Ấm (%)':     Math.round((warmPct + Math.cos(i * 0.9) * 0.05) * 100),
      'Lạnh (%)':   Math.round(Math.max(0, 100 - (hotPct + warmPct + Math.sin(i) * 0.05) * 100)),
    };
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * registerInsightData(insightId, conversationsData)
 *
 * Đăng ký mock data vào registry.
 * Gọi ngay sau khi tạo insight mới (Template flow hoặc AI flow).
 */
export function registerInsightData(insightId, conversationsData) {
  runtimeConversations[insightId] = conversationsData;
  runtimeAnalysis[insightId]      = generateAnalysis(conversationsData);
  runtimeTrend[insightId]         = generateTrendData(conversationsData, 7);
}

/**
 * getInsightData(insightId)
 *
 * Trả về { conversations, analysis, trend }
 * Thứ tự ưu tiên:
 *   1. runtimeConversations[key]  (AI flow / template mới)
 *   2. mockConversations[key]    (static template)
 *
 * Với Template flow:
 *   - Nếu insight có templateId đã có trong mockConversations → dùng mock
 *   - Nếu chưa có → generate runtime + register
 */
export function getInsightData(insightId, templateId) {
  // Ưu tiên 1: runtime data đã đăng ký
  if (runtimeConversations[insightId]) {
    return {
      conversations: runtimeConversations[insightId],
      analysis:      runtimeAnalysis[insightId] || null,
      trend:         runtimeTrend[insightId] || [],
    };
  }

  // Ưu tiên 2: static mock data (chỉ cho Template flow với known templateId)
  const staticKey = templateId || insightId;
  if (mockConversations[staticKey]) {
    return {
      conversations: mockConversations[staticKey],
      analysis:      mockAnalysisResults[staticKey] || null,
      trend:         runtimeTrend[staticKey] || generateTrendData(mockConversations[staticKey], 7),
    };
  }

  // Ưu tiên 3: fallback — không có data
  return { conversations: null, analysis: null, trend: [] };
}

/**
 * getTrendData(insightId)
 *
 * Lấy trend data cho InsightTrendChart.
 * Fallback: generate từ conversations nếu chưa có.
 */
export function getTrendData(insightId) {
  if (runtimeTrend[insightId]) return runtimeTrend[insightId];

  // Thử lookup static
  if (mockConversations[insightId]) {
    return generateTrendData(mockConversations[insightId], 7);
  }

  return [];
}

/**
 * hasMockData(insightId, templateId)
 *
 * Kiểm tra xem insight có data để hiển thị hay không.
 */
export function hasMockData(insightId, templateId) {
  if (runtimeConversations[insightId]) return true;
  const key = templateId || insightId;
  if (mockConversations[key]) return true;
  return false;
}

/**
 * getConversations(insightId)
 * Tiện ích: lấy nhanh conversations cho InsightDetail
 */
export function getConversations(insightId) {
  if (runtimeConversations[insightId]) return runtimeConversations[insightId];
  if (mockConversations[insightId]) return mockConversations[insightId];
  return null;
}

/**
 * getAnalysis(insightId)
 * Tiện ích: lấy nhanh analysis cho InsightDetail
 */
export function getAnalysis(insightId) {
  if (runtimeAnalysis[insightId]) return runtimeAnalysis[insightId];
  if (mockAnalysisResults[insightId]) return mockAnalysisResults[insightId];
  return null;
}
