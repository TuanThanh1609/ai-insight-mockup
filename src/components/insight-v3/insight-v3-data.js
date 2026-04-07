// Shared template definitions for AI Insight V3
// All insight-v3 components import from here — single source of truth

export const TEMPLATES = [
  {
    id: 'template-1',
    name: 'Tư vấn chăm sóc',
    columns: [
      { id: 'tinh_hinh_tu_van', label: 'Tình hình tư vấn nhân viên' },
      { id: 'cham_soc_sau_mua', label: 'Chăm sóc sau mua' },
      { id: 'van_de_tu_choi', label: 'Vấn đề nhân viên nói chưa / không / từ chối' },
    ],
  },
  {
    id: 'template-2',
    name: 'Các vấn đề cần khắc phục',
    columns: [
      { id: 'chat_luong_hoi_thoai', label: 'Chất lượng hội thoại' },
      { id: 'nong_am_lanh', label: 'Nóng / Ấm / Lạnh' },
      { id: 'cham_diem_lead', label: 'Chấm điểm Lead' },
      { id: 'van_de_cl', label: 'Vấn đề chất lượng hội thoại' },
      { id: 'khach_im_lang', label: 'Khách im lặng' },
    ],
  },
  {
    id: 'template-3',
    name: 'Phản hồi khách hàng',
    columns: [
      { id: 'kh_noi_ve_gi', label: 'Khách hàng nói về điều gì nhiều' },
      { id: 'kh_buc_xuc', label: 'Khách hàng có bức xúc gì không' },
      { id: 'xu_huong_quan_tam', label: 'Xu hướng quan tâm của khách hàng' },
    ],
  },
  {
    id: 'template-4',
    name: 'Đánh giá chiến dịch',
    isPageSwitch: true,
    columns: [
      { id: 'ten_chien_dich', label: 'Tên chiến dịch' },
      { id: 'nen_tang', label: 'Nền tảng' },
      { id: 'ngan_sach', label: 'Ngân sách' },
      { id: 'chi_tieu', label: 'Chi tiêu' },
      { id: 'roas', label: 'ROAS' },
      { id: 'lead_chat_luong', label: 'Lead Chất lượng' },
      { id: 'lead_kem', label: 'Lead Kém chất lượng' },
      { id: 'lead_rac', label: 'Lead Rác' },
      { id: 'trang_thai_cd', label: 'Trạng thái' },
    ],
  },
]

export const INDUSTRIES = [
  { id: null, label: 'Tất cả' },
  { id: 'thoi-trang', label: 'Thời trang' },
  { id: 'me-va-be', label: 'Mẹ và Bé' },
  { id: 'my-pham', label: 'Mỹ phẩm' },
  { id: 'spa-tham-my', label: 'Spa / Thẩm mỹ' },
  { id: 'bat-dong-san', label: 'Bất động sản' },
  { id: 'fb', label: 'F&B' },
  { id: 'du-lich', label: 'Du lịch' },
]

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Mới nhất' },
  { id: 'oldest', label: 'Cũ nhất' },
  { id: 'duration', label: 'Thời gian hội thoại ↑' },
  { id: 'lead-quality', label: 'Lead chất lượng ↓' },
]
