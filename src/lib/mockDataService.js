/**
 * mockDataService.js
 *
 * Kiến trúc dữ liệu:
 *   conversations = SINGLE SOURCE OF TRUTH (đọc từ mockConversations hoặc runtime registry)
 *   analysis     = COMPUTED FROM conversations (computeAnalysisFromConversations)
 *
 * Luồng:
 *   1. getConversations(insightId) → { columns, rows }
 *   2. computeAnalysisFromConversations(conversations, crossFilter)
 *      → crossFilter filter rows trước khi tính → filter kích hoạt được
 *   3. InsightDetail: conversations + crossFilter thay đổi → analysis tự recompute
 *
 * Key convention:
 *   Template flow:    insightId = templateId = 'fsh-1'
 *   AI flow:         insightId = 'ai-ins-...'
 */

import { mockConversations } from '../data/mockConversations';

// ─── Module-level registry cho runtime data (AI-generated insights) ───────────
const runtimeConversations = {};   // { insightId: { columns, rows } }
const runtimeTrend         = {};   // { insightId: [...daily points] }

// ─── Seed pools ──────────────────────────────────────────────────────────────

const FIRST_NAMES_MALE   = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const FIRST_NAMES_FEMALE = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Trương', 'Hà', 'Phan', 'Đỗ', 'Lê'];
const LAST_NAMES_MALE    = ['Anh', 'Khoa', 'Minh', 'Tuấn', 'Hùng', 'Đức', 'Phong', 'Long', 'Thắng', 'Dũng', 'Nam', 'Quang', 'Việt', 'Tài', 'Trung'];
const LAST_NAMES_FEMALE  = ['Lan', 'Hương', 'Mai', 'Ngọc', 'Linh', 'Hà', 'Phương', 'Trang', 'Thảo', 'Yến', 'Anh', 'Chi', 'Vy', 'Lâm', 'Hoa'];
const LOCATIONS          = ['TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Biên Hòa', 'Nha Trang', 'Hạ Long', 'Vũng Tàu', 'Cà Mau', 'Quy Nhơn', 'Thanh Hóa'];
const PLATFORMS          = ['facebook', 'zalo'];

// ─── Smart pool selectors per industry ─────────────────────────────────────

const POOLS = {
  fashion: {
    products:     ['Áo thun oversize', 'Đầm công sở', 'Quần jeans', 'Túi xách', 'Giày sneaker', 'Áo sơ mi', 'Chân váy', 'Cardigan', 'Áo khoác', 'Váy maxi', 'Set bộ', 'Áo hai dây'],
    painPoints:   ['Tìm đầm đi tiệc', 'Cần đồ mùa hè', 'Chất liệu thoáng mát', 'Size chuẩn', 'Giá hợp lý', 'Phong cách tối giản', 'Đồ đi chơi', 'Công sở hàng ngày'],
    temperatures: ['Nóng', 'Nóng', 'Nóng', 'Ấm', 'Ấm', 'Lạnh'],
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

function generateCustomerName(seed) {
  const genderVal = seed % 3;
  const firstMale   = pick(FIRST_NAMES_MALE, seed * 3 + 1);
  const firstFemale = pick(FIRST_NAMES_FEMALE, seed * 3 + 2);
  const lastMale    = pick(LAST_NAMES_MALE, seed * 7 + 3);
  const lastFemale = pick(LAST_NAMES_FEMALE, seed * 7 + 4);
  const first = genderVal === 0 ? firstMale : firstFemale;
  const last  = genderVal === 0 ? lastMale  : lastFemale;
  const gender = genderVal === 0 ? 'Nam' : genderVal === 1 ? 'Nữ' : 'Không rõ';
  return { name: `${first} ${last}`, gender };
}

function seededRandom(seed, min, max) {
  const val = min + (Math.abs(Math.sin(seed * 9301 + 49297) * 233280) % (max - min));
  return Math.round(val);
}

// ─── Core generators ───────────────────────────────────────────────────────────

function deriveFieldKey(col, ci) {
  if (col.field) return col.field;
  if (col.name) {
    const normalized = col.name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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
 * Tạo mockup conversations rows + columns metadata
 * cho một insight mới (Template flow hoặc AI flow).
 */
export function generateConversations(insightId, columns, industry, rowCount = 20) {
  const pool = POOLS[industry] || POOLS.fashion;

  const colMeta = (columns || []).map((col, ci) => {
    const field = deriveFieldKey(col, ci);
    return { id: `${insightId}-${field}`, name: col.name, field };
  });

  if (!colMeta.find(c => c.field === 'customer')) {
    colMeta.unshift({ id: `${insightId}-customer`, name: 'Khách hàng', field: 'customer' });
  }
  if (!colMeta.find(c => c.field === 'platform')) {
    colMeta.push({ id: `${insightId}-platform`, name: 'Kênh', field: 'platform' });
  }

  const rows = Array.from({ length: rowCount }, (_, i) => {
    const seed = Date.now() + i * 137 + (insightId.charCodeAt(insightId.length - 1) || 0) * 31;
    const { name, gender } = generateCustomerName(seed);
    const row = {
      id:       `${insightId}-row-${i + 1}`,
      customer: name,
      gender,
      platform: pick(PLATFORMS, seed + 9),
      location: pick(LOCATIONS, seed + 5),
    };

    (columns || []).forEach((col, ci) => {
      const field = deriveFieldKey(col, ci);
      const s = seed + ci * 53;
      const n = (col.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const f = col.field || field;

      if (col.dataType === 'true_false' || col.dataType === 'boolean') {
        row[field] = seededRandom(s, 0, 10) < 3;
        return;
      }

      if (f === 'temperature' || n.includes('quan tam') || n.includes('nhiet') || n.includes('muc do')) {
        row[field] = weighted(pool.temperatures, [3, 3, 2, 2, 1], s);
      } else if (f === 'painpoint' || n.includes('pain point') || n.includes('nhu cau') || n.includes('cot loi')) {
        row[field] = pick(pool.painPoints, s);
      } else if (f === 'objection' || n.includes('rao can') || n.includes('ban khoan')) {
        row[field] = pick(pool.objections, s);
      } else if (f === 'product' || n.includes('san pham') || n.includes('mau') || n.includes('diem den') || n.includes('loai hinh')) {
        row[field] = pick(pool.products, s);
      } else if (f === 'competitor' || n.includes('doi thu')) {
        row[field] = pick(pool.competitors, s);
      } else if (n.includes('loi') || n.includes('mistake') || n.includes('sai')) {
        row[field] = pick(pool.mistakes, s);
      } else if (n.includes('khu vuc') || n.includes('location') || n.includes('tp')) {
        row[field] = pick(LOCATIONS, s);
      } else if (n.includes('size')) {
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

// ─── Analysis computation ────────────────────────────────────────────────────

/**
 * computeAnalysisFromConversations(conversations, crossFilter)
 *
 * SINGLE SOURCE OF TRUTH — analysis được tính từ conversations.rows.
 * crossFilter lọc rows trước khi tính → filter kích hoạt ngay.
 *
 * conversations: { columns, rows } — từ getConversations()
 * crossFilter:  { field, value } hoặc null
 */
export function computeAnalysisFromConversations(conversations, crossFilter) {
  let rows = conversations?.rows || [];
  const columns = conversations?.columns || [];
  if (rows.length === 0) return null;

  const fieldSet = new Set(columns.map(c => c.field));

  const hasAnyField = (names) => names.some((n) => fieldSet.has(n) || rows.some((r) => r[n] !== undefined));

  const pickBestField = (names) => {
    const scored = names
      .map((name) => ({
        name,
        score: rows.filter((r) => r[name] !== undefined && r[name] !== null && String(r[name]).trim() !== '').length,
      }))
      .sort((a, b) => b.score - a.score);

    return scored[0]?.score > 0 ? scored[0].name : null;
  };

  const topByField = (fieldName, limit = 5) => {
    if (!fieldName) return [];
    const map = {};
    rows.forEach((r) => {
      const v = r[fieldName];
      if (v !== undefined && v !== null && String(v).trim() !== '') {
        const key = String(v);
        map[key] = (map[key] || 0) + 1;
      }
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([text, count]) => ({ text, count }));
  };

  // Apply cross-filter BEFORE computing stats
  if (crossFilter) {
    rows = rows.filter((row) => {
      const fv = row[crossFilter.field];
      if (typeof crossFilter.value === 'boolean') return fv === crossFilter.value;
      return String(fv) === String(crossFilter.value);
    });
  }

  const total = rows.length;
  if (total === 0) {
    return {
      summary: { totalConversations: 0, analyzedAt: new Date().toISOString() },
      temperature: { hot: 0, warm: 0, cold: 0 },
      productInterest: [], topPainPoints: [], topObjections: [], topMistakes: [],
      junkRate: 0, qualityRate: 100,
      phoneCollection: { collected: 0, refused: 0, notAsked: 0 },
      attitude: { good: 0, average: 0, poor: 0 },
      gender: { female: 0, male: 0, unknown: 0 },
      topLocations: [], competitorMentions: { mentioned: 0, notMentioned: 0 },
      topCompetitors: [], negativeSentiment: { negative: 0, neutral: 0, positive: 0 },
    };
  }

  // Temperature (chỉ tính khi dataset có field nhiệt độ)
  const temperatureField = findFieldByKeywords(['muc do quan tam', 'lead temperature', 'nhiet do'], ['temperature', 'mucDoQuanTam']);
  const hasTemperature = !!temperatureField;
  const tempCount = { hot: 0, warm: 0, cold: 0 };
  if (hasTemperature) {
    rows.forEach((row) => {
      const t = row[temperatureField] || '';
      if (t === 'Nóng' || t === 'Hot') tempCount.hot++;
      else if (t === 'Ấm' || t === 'Warm') tempCount.warm++;
      else if (t === 'Lạnh' || t === 'Cold') tempCount.cold++;
    });
  }

  // Gender
  const genderCount = {
    female: rows.filter((r) => String(r.gender) === 'Nữ').length,
    male: rows.filter((r) => String(r.gender) === 'Nam').length,
    unknown: rows.filter((r) => !r.gender || r.gender === 'Không rõ').length,
  };

  // Top Locations
  const topLocations = topByField('location', 5);

  // Dynamic interest/pain/objection/mistake fields theo template
  const interestField = findFieldByKeywords(
    ['san pham', 'diem den', 'dich vu', 'loai hinh', 'food', 'món', 'mon', 'property', 'bat dong san'],
    ['product', 'food', 'service', 'destination', 'travelType', 'propertyType']
  );
  const painField = findFieldByKeywords(
    ['pain point', 'nhu cau cot loi', 'van de can giai quyet', 'van de'],
    ['painPoint', 'issue']
  );
  const objectionField = findFieldByKeywords(
    ['rao can', 'objection', 'tieu chi so sanh', 'criteria'],
    ['objection', 'criteria']
  );
  const mistakeField = findFieldByKeywords(
    ['loi mat khach', 'mistake', 'loi'],
    ['mistake']
  );

  // Guard: không cho phép card "Sản phẩm quan tâm" ăn nhầm field nhân khẩu học
  const blockedInterestFields = new Set(['gender', 'location', 'platform', 'phoneStatus', 'attitude']);
  const safeInterestField = blockedInterestFields.has(interestField) ? null : interestField;

  const topProducts = topByField(safeInterestField, 5);
  const topPain = topByField(painField, 5);
  const topObj = topByField(objectionField, 5);
  const topMistakes = topByField(mistakeField, 5);

  // Competitors
  const competitorNameField = findFieldByKeywords(['ten doi thu', 'doi thu', 'competitor'], ['competitorName', 'competitor']);
  const competitorFlagField = findFieldByKeywords(['co nhac den doi thu', 'has competitor'], ['hasCompetitor']);
  const hasCompetitorFields = !!competitorNameField || !!competitorFlagField;

  const competitors = {};
  if (competitorNameField) {
    rows.forEach((r) => {
      const c = r[competitorNameField];
      if (c && c !== 'Không có') competitors[c] = (competitors[c] || 0) + 1;
    });
  }

  const topComp = Object.entries(competitors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([text, count]) => ({ text, count }));

  const competitorMentioned = hasCompetitorFields
    ? rows.filter((r) => {
        const byFlag = competitorFlagField ? r[competitorFlagField] === true : false;
        const byName = competitorNameField ? !!r[competitorNameField] && r[competitorNameField] !== 'Không có' : false;
        return byFlag || byName;
      }).length
    : 0;
  const competitorNotMentioned = hasCompetitorFields ? Math.max(0, total - competitorMentioned) : 0;

  // Junk
  const hasJunkField = hasAnyField(['isJunk', 'junkLead']);
  const junkCount = hasJunkField ? rows.filter((r) => r.isJunk === true || r.junkLead === true).length : 0;
  const junkRate = hasJunkField ? Math.round((junkCount / total) * 100) : 0;

  // Sentiment (chỉ tính khi có field sentiment/isNegative)
  const sentimentField = findFieldByKeywords(['cam xuc', 'sentiment'], ['sentiment']);
  const negativeFlagField = findFieldByKeywords(['buc xuc', 'muc do buc xuc', 'is negative'], ['isNegative']);
  const hasSentiment = !!sentimentField || !!negativeFlagField;
  const negCount = hasSentiment
    ? rows.filter((r) => (negativeFlagField && r[negativeFlagField] === true) || (sentimentField && r[sentimentField] === 'Tiêu cực')).length
    : 0;
  const posCount = hasSentiment && sentimentField
    ? rows.filter((r) => r[sentimentField] === 'Tích cực').length
    : 0;
  const neuCount = hasSentiment ? Math.max(0, total - negCount - posCount) : 0;

  // Phone collection (chỉ tính khi có phoneStatus)
  const phoneField = findFieldByKeywords(['so dt', 'thu thap sdt', 'phone'], ['phoneStatus']);
  const hasPhoneStatus = !!phoneField;
  const phoneCollected = hasPhoneStatus ? rows.filter((r) => r[phoneField] === 'Đã cho SĐT').length : 0;
  const phoneRefused = hasPhoneStatus ? rows.filter((r) => r[phoneField] === 'Từ chối' || r[phoneField] === 'Khách từ chối').length : 0;
  const phoneNotAsked = hasPhoneStatus ? rows.filter((r) => !r[phoneField] || r[phoneField] === 'Chưa cho').length : 0;

  // Attitude (không auto dồn toàn bộ vào Kém khi thiếu field)
  const attitudeField = findFieldByKeywords(['thai do tu van', 'thai do sale', 'attitude'], ['attitude']);
  const hasAttitude = !!attitudeField;
  const attGood = hasAttitude ? rows.filter((r) => r[attitudeField] === 'Tốt').length : 0;
  const attAvg = hasAttitude ? rows.filter((r) => r[attitudeField] === 'Trung bình').length : 0;
  const attPoor = hasAttitude ? rows.filter((r) => r[attitudeField] === 'Kém').length : 0;

  return {
    summary: { totalConversations: total, analyzedAt: new Date().toISOString() },
    temperature: { hot: tempCount.hot, warm: tempCount.warm, cold: tempCount.cold },
    productInterest: topProducts,
    topPainPoints: topPain,
    topObjections: topObj,
    topMistakes,
    junkRate,
    qualityRate: hasJunkField ? Math.round(((total - junkCount) / total) * 100) : 100,
    phoneCollection: { collected: phoneCollected, refused: phoneRefused, notAsked: phoneNotAsked },
    attitude: { good: attGood, average: attAvg, poor: attPoor },
    gender: genderCount,
    topLocations,
    competitorMentions: {
      mentioned: competitorMentioned,
      notMentioned: competitorNotMentioned,
    },
    topCompetitors: topComp,
    negativeSentiment: { negative: negCount, neutral: neuCount, positive: posCount },
  };
}

// ─── Trend data ────────────────────────────────────────────────────────────────

export function generateTrendData(conversationsData, days = 7) {
  const rows = conversationsData?.rows || [];
  const total = rows.length;
  const now   = new Date();

  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    const dayStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    const baseCount = Math.round(total / days);
    const variance = Math.round((Math.sin(i * 1.7 + total * 0.1) + 1) * baseCount * 0.3);
    const count = Math.max(0, baseCount + variance + (i === days - 1 ? Math.round(total * 0.1) : 0));
    const hotPct  = 0.3 + Math.sin(i * 0.8) * 0.15;
    const warmPct = 0.35 + Math.cos(i * 0.6) * 0.1;

    return {
      date:       dayStr,
      Hội_thoại: count,
      'Nóng (%)':  Math.round((hotPct + Math.sin(i * 1.2) * 0.05) * 100),
      'Ấm (%)':   Math.round((warmPct + Math.cos(i * 0.9) * 0.05) * 100),
      'Lạnh (%)': Math.round(Math.max(0, 100 - (hotPct + warmPct + Math.sin(i) * 0.05) * 100)),
    };
  });
}

// ─── Public API ─────────────────────────────────────────────────────────────

export function registerInsightData(insightId, conversationsData) {
  runtimeConversations[insightId] = conversationsData;
  runtimeTrend[insightId] = generateTrendData(conversationsData, 7);
}

export function getConversations(insightId) {
  if (runtimeConversations[insightId]) return runtimeConversations[insightId];
  if (mockConversations[insightId]) return mockConversations[insightId];
  return null;
}

export function getTrendData(insightId) {
  if (runtimeTrend[insightId]) return runtimeTrend[insightId];
  if (mockConversations[insightId]) return generateTrendData(mockConversations[insightId], 7);
  return [];
}

export function hasMockData(insightId) {
  if (runtimeConversations[insightId]) return true;
  if (mockConversations[insightId]) return true;
  return false;
}
