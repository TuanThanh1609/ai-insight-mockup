import { useState } from 'react'
import { InsightV3Header } from './components/insight-v3/InsightV3Header'

// ── Stubs — will be replaced in Tasks 5 & 6 ───────────────────────────────────

function ConversationTable({ templates, industry, sortId }) {
  return (
    <div className="flex-1 flex items-center justify-center text-[#424754] bg-[#f7f9fb] min-h-0">
      <p className="text-sm">
        ConversationTable — templates: {templates?.length || 0} | industry: {industry || 'all'} | sort: {sortId}
      </p>
    </div>
  )
}

function CampaignDashboard() {
  return (
    <div className="flex-1 flex items-center justify-center text-[#424754] bg-[#f7f9fb] min-h-0">
      <p className="text-sm">CampaignDashboard — chiến dịch campaigns</p>
    </div>
  )
}

function TemplateSelectionModal({ selectedTemplates, onToggle, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl p-6 w-[400px] space-y-3">
        <p className="text-sm font-medium text-[#191c1e]">Template Selection (coming soon)</p>
        {['template-1', 'template-2', 'template-3', 'template-4'].map(id => (
          <div key={id} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={id}
              checked={selectedTemplates.includes(id)}
              onChange={() => onToggle(id)}
              className="accent-[#0058be]"
            />
            <label htmlFor={id} className="text-sm text-[#424754]">{id}</label>
          </div>
        ))}
        <div className="flex gap-2 mt-4 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[#424754] hover:bg-[#f2f4f6] rounded-md">Hủy</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-[#0058be] text-white rounded-md hover:bg-[#2170e4]">Lưu</button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────────────────

export default function InsightV3Page() {
  const [selectedTemplates, setSelectedTemplates] = useState(() => {
    try { return JSON.parse(localStorage.getItem('insight-v3-templates') || '[]') } catch { return [] }
  })
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [sortId, setSortId] = useState('newest')

  const toggleTemplate = (id) => {
    setSelectedTemplates(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const handleSaveTemplates = () => {
    localStorage.setItem('insight-v3-templates', JSON.stringify(selectedTemplates))
    setShowTemplateModal(false)
  }

  const hasTemplate4 = selectedTemplates.includes('template-4')

  return (
    <div className="h-full flex flex-col">
      <InsightV3Header
        selectedTemplates={selectedTemplates}
        selectedIndustry={selectedIndustry}
        sortId={sortId}
        onIndustryChange={setSelectedIndustry}
        onSortChange={setSortId}
        onOpenTemplateModal={() => setShowTemplateModal(true)}
        onRemoveTemplate={toggleTemplate}
      />
      {hasTemplate4 ? (
        <CampaignDashboard />
      ) : (
        <ConversationTable
          templates={selectedTemplates}
          industry={selectedIndustry}
          sortId={sortId}
        />
      )}
      {showTemplateModal && (
        <TemplateSelectionModal
          selectedTemplates={selectedTemplates}
          onToggle={toggleTemplate}
          onClose={() => setShowTemplateModal(false)}
          onSave={handleSaveTemplates}
        />
      )}
    </div>
  )
}