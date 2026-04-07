import { useState, useRef, useEffect } from 'react'
import { RefreshCw, Plus, X, ChevronDown } from 'lucide-react'

// Template definitions shared across all insight-v3 components
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

const INDUSTRIES = [
  { id: null, label: 'Tất cả' },
  { id: 'thoi-trang', label: 'Thời trang' },
  { id: 'me-va-be', label: 'Mẹ và Bé' },
  { id: 'my-pham', label: 'Mỹ phẩm' },
  { id: 'spa-tham-my', label: 'Spa / Thẩm mỹ' },
  { id: 'bat-dong-san', label: 'Bất động sản' },
  { id: 'fb', label: 'F&B' },
  { id: 'du-lich', label: 'Du lịch' },
]

const SORT_OPTIONS = [
  { id: 'newest', label: 'Mới nhất' },
  { id: 'oldest', label: 'Cũ nhất' },
  { id: 'duration', label: 'Thời gian hội thoại ↑' },
  { id: 'lead-quality', label: 'Lead chất lượng ↓' },
]

function useDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  return { open, setOpen, ref }
}

function ActiveTemplateChip({ id, onRemove }) {
  const t = TEMPLATES.find(t => t.id === id)
  if (!t) return null
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0058be]/10 text-[#0058be] text-xs font-medium rounded-full">
      <span>{t.name}</span>
      <button
        onClick={() => onRemove(id)}
        className="hover:bg-[#0058be]/20 rounded-full p-0.5"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}

function TemplateFilterDropdown({ selectedIndustry, onChange }) {
  const { open, setOpen, ref } = useDropdown()
  const selected = INDUSTRIES.find(i => i.id === selectedIndustry)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#c2c6d6]/30 rounded-md text-sm text-[#424754] hover:bg-[#f2f4f6]"
      >
        <span>{selected?.label || 'Tất cả'}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-[180px] bg-white rounded-lg shadow-lg border border-[#c2c6d6]/20 py-1 z-20">
          {INDUSTRIES.map(ind => (
            <button
              key={ind.id ?? 'all'}
              onClick={() => { onChange(ind.id); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-[#f2f4f6] ${selectedIndustry === ind.id ? 'text-[#0058be] font-medium' : 'text-[#424754]'}`}
            >
              {ind.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SortDropdown({ sortId, onChange }) {
  const { open, setOpen, ref } = useDropdown()
  const selected = SORT_OPTIONS.find(s => s.id === sortId)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#c2c6d6]/30 rounded-md text-sm text-[#424754] hover:bg-[#f2f4f6]"
      >
        <span>{selected?.label}</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 w-[180px] bg-white rounded-lg shadow-lg border border-[#c2c6d6]/20 py-1 z-20">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => { onChange(opt.id); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-[#f2f4f6] ${sortId === opt.id ? 'text-[#0058be] font-medium' : 'text-[#424754]'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function InsightV3Header({
  selectedTemplates = [],
  selectedIndustry,
  sortId,
  onIndustryChange,
  onSortChange,
  onOpenTemplateModal,
  onRemoveTemplate,
}) {
  return (
    <div className="bg-white border-b border-[#c2c6d6]/15 px-6 py-4">
      {/* Row 1: Title + Controls */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[1.25rem] font-semibold text-[#191c1e]">AI Insight V3</h1>
        <div className="flex items-center gap-2">
          <TemplateFilterDropdown
            selectedIndustry={selectedIndustry}
            onChange={onIndustryChange}
          />
          <SortDropdown sortId={sortId} onChange={onSortChange} />
          <button className="p-2 rounded-md hover:bg-[#f2f4f6]" title="Làm mới">
            <RefreshCw className="w-4 h-4 text-[#424754]" />
          </button>
          <button
            onClick={onOpenTemplateModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0058be] text-white rounded-md text-sm font-medium hover:bg-[#2170e4]"
          >
            <Plus className="w-4 h-4" />
            Thêm insight
          </button>
        </div>
      </div>

      {/* Row 2: Active template chips */}
      {selectedTemplates.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTemplates.map(id => (
            <ActiveTemplateChip key={id} id={id} onRemove={onRemoveTemplate} />
          ))}
        </div>
      )}
    </div>
  )
}
