import { useState, useRef, useEffect } from 'react'
import { RefreshCw, Plus, X, ChevronDown, BarChart2, FileText } from 'lucide-react'
import { TEMPLATES, SORT_OPTIONS } from './insight-v3-data'

// Re-export for backward compatibility
export { TEMPLATES }

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

/**
 * InsightSelectDropdown — "Lựa chọn Insight"
 *
 * UX: Hick's Law — dropdown là navigation giữa các bảng INSIGHT RIÊNG BIỆT.
 * Mỗi lần chọn 1 insight → bảng hiện columns CỦA INSIGHT ĐÓ (không cộng dồn).
 * 6 cột cố định luôn hiển thị cùng insight-specific columns.
 */
function InsightSelectDropdown({ selectedTemplates, activeInsightId, onInsightChange }) {
  const { open, setOpen, ref } = useDropdown()
  const [search, setSearch] = useState('')

  // Chỉ hiện khi có ≥1 template đã activate
  if (selectedTemplates.length === 0) return null

  const activeTemplates = selectedTemplates
    .map(id => TEMPLATES.find(t => t.id === id))
    .filter(Boolean)

  const filtered = search.trim()
    ? activeTemplates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
    : activeTemplates

  const selected = TEMPLATES.find(t => t.id === activeInsightId)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#c2c6d6]/30 rounded-md text-sm hover:bg-[#f2f4f6] min-w-[180px]"
      >
        {/* UX: Visibility of System Status — show selected insight name */}
        <span className={`text-sm ${selected ? 'text-[#191c1e] font-medium' : 'text-[#9ca3af]'}`}>
          {selected ? selected.name : 'Lựa chọn Insight'}
        </span>
        <ChevronDown className="w-4 h-4 ml-auto shrink-0 text-[#9ca3af]" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-[260px] bg-white rounded-xl shadow-xl border border-[#c2c6d6]/20 z-30 overflow-hidden">
          {/* Search */}
          <div className="px-3 py-2 border-b border-[#c2c6d6]/10">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm insight..."
              className="w-full text-sm text-[#191c1e] placeholder-[#9ca3af] bg-transparent outline-none"
              autoFocus
            />
          </div>

          {/* Options — NO "all combined" option */}
          <div className="py-1 max-h-[240px] overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-xs text-[#9ca3af]">Không tìm thấy</p>
            )}

            {filtered.map(t => (
              <button
                key={t.id}
                onClick={() => { onInsightChange(t.id); setSearch(''); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-[#f2f4f6] flex items-center gap-2 ${activeInsightId === t.id ? 'text-[#0058be] font-semibold' : 'text-[#424754]'}`}
              >
                {/* UX: Nielsen #4 Consistency — dot indicator matches active state */}
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeInsightId === t.id ? 'bg-[#0058be]' : 'bg-[#c2c6d6]'}`} />
                <span>{t.name}</span>
                <span className="ml-auto text-[11px] text-[#9ca3af]">{t.columns.length} cột</span>
              </button>
            ))}
          </div>
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
  activeInsightId,
  sortId,
  onInsightChange,
  onSortChange,
  onOpenTemplateModal,
  onRemoveTemplate,
  onOpenAnalysis,
  onOpenInterpretation,
}) {
  return (
    <div className="bg-white border-b border-[#c2c6d6]/15 px-6 py-4">
      {/* Row 1: Title + Controls */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[1.25rem] font-semibold text-[#191c1e]">AI Insight V3</h1>
        <div className="flex items-center gap-2">
          {/* Lựa chọn Insight — chỉ hiện khi có template đã activate */}
          <InsightSelectDropdown
            selectedTemplates={selectedTemplates}
            activeInsightId={activeInsightId}
            onInsightChange={onInsightChange}
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

          {/* 2 NÚT MỚI */}
          <button
            onClick={onOpenAnalysis}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#fa6e5b] text-white rounded-md text-sm font-medium hover:bg-[#e85a4a] transition-colors"
          >
            <BarChart2 className="w-4 h-4" />
            Phân Tích
          </button>
          <button
            onClick={onOpenInterpretation}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#fa6e5b] text-white rounded-md text-sm font-medium hover:bg-[#e85a4a] transition-colors"
          >
            <FileText className="w-4 h-4" />
            Diễn Giải
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
