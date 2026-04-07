import { X, Pencil, LayoutGrid } from 'lucide-react'
import { TEMPLATES } from './insight-v3-data'

function Switch({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? 'bg-[#0058be]' : 'bg-[#c2c6d6]'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`}
      />
    </button>
  )
}

function TemplateCard({ template, isActive, onToggle }) {
  return (
    <div className="border-b border-[#c2c6d6]/15 pb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Switch checked={isActive} onChange={onToggle} />
          <span className="font-semibold text-[#191c1e]">{template.name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#424754]">
          <span>{template.columns.length} column(s)</span>
          <span>•</span>
          <span>—</span>
          <button className="p-1 hover:bg-[#f2f4f6] rounded" title="Chỉnh sửa">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-[#f2f4f6] rounded" title="Cấu hình">
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isActive && (
        <div className="ml-10 space-y-1">
          {template.isPageSwitch && (
            <p className="text-xs text-[#0058be] italic mb-2">
              ↳ Chuyển sang TRANG RIÊNG — Bảng chiến dịch
            </p>
          )}
          {template.columns.map(col => (
            <div key={col.id} className="flex items-center gap-2 text-sm text-[#424754]">
              <span>•</span>
              <span>{col.label}</span>
              <button className="ml-auto p-0.5 hover:bg-[#f2f4f6] rounded">
                <Pencil className="w-3 h-3 text-[#424754]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function TemplateSelectionModal({ selectedTemplates, onToggle, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[720px] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c2c6d6]/15">
          <h2 className="text-lg font-semibold text-[#191c1e]">Cài đặt Insight</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#f2f4f6] rounded-md">
            <X className="w-5 h-5 text-[#424754]" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {TEMPLATES.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              isActive={selectedTemplates.includes(template.id)}
              onToggle={() => onToggle(template.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#c2c6d6]/15">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#424754] hover:bg-[#f2f4f6] rounded-md"
          >
            Hủy
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm bg-[#0058be] text-white rounded-md hover:bg-[#2170e4]"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}
