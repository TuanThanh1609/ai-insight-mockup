import { useState } from 'react'

// ── Stubs — will be replaced by child components in Tasks 3-6 ──────────────────

function InsightV3Header({ onOpenTemplateModal }) {
  return (
    <div className="bg-white border-b border-[#c2c6d6]/15 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#191c1e]">AI Insight V3</h1>
        <button
          onClick={onOpenTemplateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0058be] text-white rounded-md text-sm font-medium hover:bg-[#2170e4]"
        >
          Thêm insight
        </button>
      </div>
    </div>
  )
}

function ConversationTable({ templates }) {
  return (
    <div className="flex-1 flex items-center justify-center text-[#424754]">
      <p>ConversationTable (templates: {templates?.length || 0}) — coming soon</p>
    </div>
  )
}

function CampaignDashboard() {
  return (
    <div className="flex-1 flex items-center justify-center text-[#424754]">
      <p>CampaignDashboard — coming soon</p>
    </div>
  )
}

function TemplateSelectionModal({ selectedTemplates, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl p-8 w-[400px]">
        <p className="text-sm text-[#424754]">TemplateSelectionModal — coming soon</p>
        <div className="flex gap-2 mt-4 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[#424754] hover:bg-[#f2f4f6] rounded-md">Hủy</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-[#0058be] text-white rounded-md hover:bg-[#2170e4]">Lưu</button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function InsightV3Page() {
  const [selectedTemplates, setSelectedTemplates] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('insight-v3-templates') || '[]')
    } catch {
      return []
    }
  })
  const [showTemplateModal, setShowTemplateModal] = useState(false)

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
      <InsightV3Header onOpenTemplateModal={() => setShowTemplateModal(true)} />
      {hasTemplate4 ? (
        <CampaignDashboard />
      ) : (
        <ConversationTable templates={selectedTemplates} />
      )}
      {showTemplateModal && (
        <TemplateSelectionModal
          selectedTemplates={selectedTemplates}
          onClose={() => setShowTemplateModal(false)}
          onSave={handleSaveTemplates}
        />
      )}
    </div>
  )
}
