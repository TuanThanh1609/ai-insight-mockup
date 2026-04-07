import { useState } from 'react'
import { InsightV3Header } from '../components/insight-v3/InsightV3Header'
import { ConversationTable } from '../components/insight-v3/ConversationTable'
import { CampaignDashboard } from '../components/insight-v3/CampaignDashboard'
import { TemplateSelectionModal } from '../components/insight-v3/TemplateSelectionModal'
import { InsightSlidePanel } from '../components/insight-v3/InsightSlidePanel'
import { InsightAnalysisPanel } from '../components/insight-v3/InsightAnalysisPanel'
import { InsightInterpretationPanel } from '../components/insight-v3/InsightInterpretationPanel'

// ── Main Page ───────────────────────────────────────────────────────────────────

export default function InsightV3Page() {
  const [selectedTemplates, setSelectedTemplates] = useState(() => {
    try { return JSON.parse(localStorage.getItem('insight-v3-templates') || '[]') } catch { return [] }
  })
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [sortId, setSortId] = useState('newest')
  // activeInsightId = template id đang được focus trong bảng
  // null = show tất cả combined columns
  const [activeInsightId, setActiveInsightId] = useState(null)
  // panelType drives which slide panel is open
  const [panelType, setPanelType] = useState(null) // null | 'analysis' | 'interpretation'

  const toggleTemplate = (id) => {
    setSelectedTemplates(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  // Khi thay đổi template selection (bật/tắt trong modal) → reset activeInsightId
  const handleSaveTemplates = () => {
    localStorage.setItem('insight-v3-templates', JSON.stringify(selectedTemplates))
    setActiveInsightId(null)
    setShowTemplateModal(false)
  }

  const hasTemplate4 = selectedTemplates.includes('template-4')

  return (
    <div className="h-full flex flex-col">
      <InsightV3Header
        selectedTemplates={selectedTemplates}
        activeInsightId={activeInsightId}
        sortId={sortId}
        onInsightChange={setActiveInsightId}
        onSortChange={setSortId}
        onOpenTemplateModal={() => setShowTemplateModal(true)}
        onRemoveTemplate={toggleTemplate}
        onOpenAnalysis={() => setPanelType('analysis')}
        onOpenInterpretation={() => setPanelType('interpretation')}
      />
      {hasTemplate4 ? (
        <CampaignDashboard />
      ) : (
        <ConversationTable
          activeInsightId={activeInsightId}
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

      {/* InsightSlidePanel for Analysis — real data driven by activeInsightId */}
      <InsightSlidePanel
        isOpen={panelType === 'analysis'}
        onClose={() => setPanelType(null)}
        title="Phân Tích"
      >
        <InsightAnalysisPanel activeInsightId={activeInsightId} />
      </InsightSlidePanel>

      {/* InsightSlidePanel for Interpretation */}
      <InsightSlidePanel
        isOpen={panelType === 'interpretation'}
        onClose={() => setPanelType(null)}
        title="Diễn Giải"
      >
        <InsightInterpretationPanel activeInsightId={activeInsightId} />
      </InsightSlidePanel>
    </div>
  )
}