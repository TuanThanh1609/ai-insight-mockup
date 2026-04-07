/**
 * Mock data — 50 rows × 3 template insight
 *
 * UX: Miller's Law — chunked data per template cho cognitive clarity.
 * Mỗi bảng = 50 rows với đầy đủ field theo template.
 */

// ── Shared pools ────────────────────────────────────────────────────────────────

const NAMES = [
  'Nguyễn Thị Mai Anh', 'Trần Văn Hùng', 'Lê Minh Phương', 'Phạm Đức Thắng',
  'Hoàng Thu Hà', 'Vũ Hoàng Nam', 'Đặng Thị Lan Chi', 'Bùi Quang Minh',
  'Cao Thị Thu Hằng', 'Đinh Văn Cường', 'Lý Thị Mai', 'Trịnh Hoàng Long',
  'Ngô Thị Kim Oanh', 'Phạm Văn Bình', 'Vũ Thị Hương Giang', 'Trần Quang Huy',
  'Lê Thị Ngọc Ánh', 'Nguyễn Đình Khải', 'Trịnh Thị Minh Thư', 'Bùi Hoàng Đức',
  'Đặng Văn Tiến', 'Cao Thị Hồng Nhung', 'Nguyễn Hoàng Gia Bảo', 'Phạm Thị Thu Trang',
  'Trần Đình Phong', 'Vũ Thị Mai Liên', 'Lê Văn Sơn', 'Nguyễn Thị Thanh Hà',
  'Hoàng Đình Tuấn', 'Phạm Thị Hải Yến', 'Trịnh Văn Khánh', 'Lý Thị Hoa',
  'Đặng Hoàng Nam', 'Ngô Đình Quang', 'Bùi Thị Thu Hà', 'Trần Văn Khang',
  'Nguyễn Thị Thanh Mai', 'Phạm Hoàng Duy', 'Vũ Thị Thanh Thúy', 'Lê Đình Thành',
  'Trịnh Thị Minh Huệ', 'Hoàng Văn Minh', 'Nguyễn Thị Phương Linh', 'Đặng Văn Hải',
  'Cao Hoàng Nam', 'Lý Thị Thuỳ Dương', 'Trần Văn Lâm', 'Nguyễn Thị Hồng Phúc',
]

const CHANNELS = ['Facebook', 'Zalo OA', 'Di Động Việt', 'Instagram', 'Shopee Live']
const STAFFS = ['Minh N.', 'Lan T.', 'Hoa N.', 'Tuấn V.', 'Phương M.', 'Khoa N.', 'Ngọc T.', '—']
const STATUSES = ['close', 'open', 'spam', 'close', 'close', 'open', 'close', 'open', 'close', 'open']

const TOPICS = [
  'Đổi trả BH', 'Sạc nhanh 20W', 'iPhone 16 Pro Max', 'Galaxy A37 5G',
  'OPPO Reno15 F', 'vivo V30e', 'Xiaomi Redmi Note 14', 'Realme C75',
  'Samsung Galaxy S25', 'iPhone 15', 'Nokia C32', 'Tecno Spark 30 Pro',
  'Bảo hành pin', 'Phụ kiện tai nghe', 'Cáp sạc Type-C', 'Ốp lưng chống sốc',
  'Khuyến mãi tháng 4', 'Đặt hàng online', 'Giao hàng tận nơi', 'Thanh toán COD',
]

// ── Template 1: Tư vấn chăm sóc ────────────────────────────────────────────

const T1_TINH_HINH = ['Tốt', 'Trung bình', 'Kém', 'Tốt', 'Tốt', 'Trung bình', 'Tốt', 'Kém', 'Tốt', 'Trung bình']
const T1_CHAM_SOC = ['Đã chăm sóc', 'Chưa chăm sóc', 'Đã chăm sóc', 'Đã chăm sóc', 'Chưa chăm sóc', 'Đã chăm sóc', 'Đã chăm sóc', 'Chưa chăm sóc', 'Đã chăm sóc', 'Chưa chăm sóc']
const T1_VAN_DE = ['Không', 'Chưa hỏi', 'Từ chối', 'Không', 'Không', 'Chưa hỏi', 'Không', 'Từ chối', 'Không', 'Chưa hỏi']

// ── Template 2: Các vấn đề cần khắc phục ──────────────────────────────────

const T2_CHAT_LUONG = ['Tốt', 'Kém', 'Trung bình', 'Tốt', 'Kém', 'Trung bình', 'Tốt', 'Trung bình', 'Kém', 'Tốt']
const T2_NONG_AM_LANH = ['Nóng', 'Ấm', 'Lạnh', 'Ấm', 'Nóng', 'Lạnh', 'Ấm', 'Nóng', 'Ấm', 'Lạnh']
const T2_CHAM_DIEM = ['9/10', '5/10', '7/10', '8/10', '4/10', '6/10', '10/10', '7/10', '5/10', '8/10']
const T2_VAN_DE_CL = ['Tốt', 'Chất lượng kém', 'Cần cải thiện', 'Tốt', 'Chất lượng kém', 'Cần cải thiện', 'Tốt', 'Cần cải thiện', 'Chất lượng kém', 'Tốt']
const T2_KHACH_IM = ['Bình thường', 'Im lặng', 'Bình thường', 'Im lặng', 'Bình thường', 'Bình thường', 'Im lặng', 'Bình thường', 'Bình thường', 'Im lặng']

// ── Template 3: Phản hồi khách hàng ───────────────────────────────────────

const T3_NOI_VE = [
  'Giá cả sản phẩm', 'Chất lượng sản phẩm', 'Dịch vụ giao hàng', 'Chế độ bảo hành',
  'Khuyến mãi hấp dẫn', 'Tư vấn viên nhiệt tình', 'Đa dạng sản phẩm', 'Thanh toán tiện lợi',
  'Hậu mãi sau mua', 'Giá cả hợp lý',
]
const T3_BUC_XUC = ['Không bức xúc', 'Hơi không hài lòng', 'Bức xúc', 'Không bức xúc', 'Hơi không hài lòng', 'Không bức xúc', 'Bức xúc', 'Không bức xúc', 'Hơi không hài lòng', 'Không bức xúc']
const T3_XU_HUONG = [
  'Quan tâm giá', 'Quan tâm chất lượng', 'Quan tâm bảo hành', 'Quan tâm khuyến mãi',
  'Quan tâm giao hàng', 'Quan tâm đa dạng', 'Quan tâm thanh toán', 'Quan tâm hậu mãi',
  'Quan tâm tư vấn', 'Quan tâm thương hiệu',
]

// ── Generator ────────────────────────────────────────────────────────────────

function rnd(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rndIdx(arr, i) {
  return arr[i % arr.length]
}

function pad(n, len = 2) {
  return String(n).padStart(len, '0')
}

function genDate(i) {
  // spread rows from 07/04 back
  const day = Math.max(1, 7 - Math.floor(i / 7))
  const hour = 8 + Math.floor((i * 37) % 10)
  const min = Math.floor((i * 53) % 60)
  const day2 = Math.max(1, day + 1)
  return {
    created_at: `${pad(day)}/04/2026, ${pad(hour)}:${pad(min)}`,
    closed_at: `${pad(day2)}/04/2026, ${pad(hour + 1)}:${pad((min + 13) % 60)}`,
  }
}

function genRow(i, templateId) {
  const { created_at, closed_at } = genDate(i)
  const base = {
    customer_name: NAMES[i % NAMES.length],
    customer_id: `zl${628100000 + i}23456789`,
    channel_name: CHANNELS[i % CHANNELS.length],
    staff_name: STAFFS[i % STAFFS.length],
    status: STATUSES[i % STATUSES.length],
    created_at,
    closed_at,
    topic_tag: TOPICS[i % TOPICS.length],
  }

  if (templateId === 'template-1') {
    return {
      ...base,
      tinh_hinh_tu_van: rndIdx(T1_TINH_HINH, i),
      cham_soc_sau_mua: rndIdx(T1_CHAM_SOC, i),
      van_de_tu_choi: rndIdx(T1_VAN_DE, i),
    }
  }
  if (templateId === 'template-2') {
    return {
      ...base,
      chat_luong_hoi_thoai: rndIdx(T2_CHAT_LUONG, i),
      nong_am_lanh: rndIdx(T2_NONG_AM_LANH, i),
      cham_diem_lead: rndIdx(T2_CHAM_DIEM, i),
      van_de_cl: rndIdx(T2_VAN_DE_CL, i),
      khach_im_lang: rndIdx(T2_KHACH_IM, i),
    }
  }
  if (templateId === 'template-3') {
    return {
      ...base,
      kh_noi_ve_gi: rndIdx(T3_NOI_VE, i),
      kh_buc_xuc: rndIdx(T3_BUC_XUC, i),
      xu_huong_quan_tam: rndIdx(T3_XU_HUONG, i),
    }
  }
  return base
}

// Pre-generate 50 rows per template
export const MOCK_DATA = {
  'template-1': Array.from({ length: 50 }, (_, i) => genRow(i, 'template-1')),
  'template-2': Array.from({ length: 50 }, (_, i) => genRow(i, 'template-2')),
  'template-3': Array.from({ length: 50 }, (_, i) => genRow(i, 'template-3')),
}

// Default dataset (when no insight selected) — 50 rows base
export const MOCK_DEFAULT = Array.from({ length: 50 }, (_, i) => genRow(i, null))
