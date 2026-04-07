import { useState } from 'react'
import { TEMPLATES } from './insight-v3-data'
import { MOCK_DATA, MOCK_DEFAULT } from './insight-v3-mock-data'

// 6 cột cố định luôn hiển thị
const FIXED_COLUMNS = [
  { id: 'customer', label: 'KHÁCH HÀNG', width: '180px' },
  { id: 'channel', label: 'KÊNH', width: '130px' },
  { id: 'staff', label: 'NV', width: '90px' },
  { id: 'status', label: 'TRẠNG THÁI', width: '110px' },
  { id: 'time', label: 'THỜI GIAN', width: '150px' },
  { id: 'topic', label: 'TOPIC/TAG', width: '150px' },
]

// Mỗi insight = 1 bảng riêng biệt
function getInsightColumns(activeInsightId) {
  if (!activeInsightId) return []
  const t = TEMPLATES.find(t => t.id === activeInsightId && !t.isPageSwitch)
  return t ? t.columns : []
}

// Chọn dataset theo activeInsightId
function getDataset(activeInsightId) {
  if (!activeInsightId) return MOCK_DEFAULT
  return MOCK_DATA[activeInsightId] || MOCK_DEFAULT
}

function StatusChip({ status }) {
  const styles = {
    close: 'bg-[#dcfce7] text-[#166534]',
    open: 'bg-[#dbeafe] text-[#1e40af]',
    spam: 'bg-[#fee2e2] text-[#991b1b]',
  }
  const cls = styles[status] || styles.open
  const icon = status === 'close' ? '✅' : status === 'spam' ? '🔴' : ''
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${cls}`}>
      {icon} {status ? status.charAt(0).toUpperCase() + status.slice(1) : '—'}
    </span>
  )
}

export function ConversationTable({ activeInsightId, sortId }) {
  const insightColumns = getInsightColumns(activeInsightId)
  const allColumns = [...FIXED_COLUMNS, ...insightColumns]
  const dataset = getDataset(activeInsightId)

  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  // Sort
  const sorted = [...dataset].sort((a, b) => {
    if (sortId === 'oldest') return a.created_at.localeCompare(b.created_at)
    if (sortId === 'newest') return b.created_at.localeCompare(a.created_at)
    return 0
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const startIdx = (page - 1) * PAGE_SIZE
  const paginatedRows = sorted.slice(startIdx, startIdx + PAGE_SIZE)

  const handlePage = (p) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  // UX: Nielsen #1 Visibility of System Status — show current dataset context
  const datasetLabel = activeInsightId
    ? (TEMPLATES.find(t => t.id === activeInsightId)?.name || activeInsightId)
    : 'Tất cả hội thoại'

  return (
    <div className="flex-1 overflow-auto bg-[#f7f9fb] min-h-0">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[900px]">
          <thead className="sticky top-0 bg-[#f2f4f6] z-10 shadow-sm">
            <tr>
              {allColumns.map(col => (
                <th
                  key={col.id}
                  style={{ width: col.width }}
                  className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#424754] border-b border-[#c2c6d6]/15 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, i) => (
              <tr
                key={`${startIdx}-${i}`}
                className="hover:bg-[#f2f4f6]/50 border-b border-[#c2c6d6]/10"
              >
                {/* KHÁCH HÀNG */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0058be]/10 flex items-center justify-center text-xs font-medium text-[#0058be] border-2 border-white shrink-0">
                      {row.customer_name?.[0] || '?'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#191c1e] truncate">{row.customer_name}</div>
                      <div className="text-[11px] text-[#424754] truncate">{row.customer_id}</div>
                    </div>
                  </div>
                </td>
                {/* KÊNH */}
                <td className="px-3 py-3 text-sm text-[#424754] whitespace-nowrap">{row.channel_name}</td>
                {/* NV */}
                <td className="px-3 py-3 text-sm text-[#424754]">{row.staff_name}</td>
                {/* TRẠNG THÁI */}
                <td className="px-3 py-3"><StatusChip status={row.status} /></td>
                {/* THỜI GIAN */}
                <td className="px-3 py-3">
                  <div className="text-xs text-[#424754]">{row.created_at}</div>
                  <div className="text-[11px] text-[#424754]/60">{row.closed_at}</div>
                </td>
                {/* TOPIC/TAG */}
                <td className="px-3 py-3 text-sm text-[#424754]">{row.topic_tag}</td>
                {/* Insight-specific columns */}
                {insightColumns.map(col => (
                  <td key={col.id} className="px-3 py-3 text-sm text-[#424754]">
                    {row[col.id] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* UX: Nielsen #1 Visibility of System Status — pagination with total count */}
      <div className="sticky bottom-0 bg-[#f7f9fb] border-t border-[#c2c6d6]/15 px-6 py-3 flex items-center justify-between">
        <span className="text-xs text-[#424754]">
          {datasetLabel} — Showing {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, sorted.length)} of {sorted.length} results
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePage(page - 1)}
            disabled={page <= 1}
            className="px-2 py-1 text-sm text-[#424754] hover:bg-[#f2f4f6] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ‹
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let p = i + 1
            if (totalPages > 5) {
              if (page > 3) p = page - 2 + i
              if (page > totalPages - 2) p = totalPages - 4 + i
            }
            if (p < 1 || p > totalPages) return null
            return (
              <button
                key={p}
                onClick={() => handlePage(p)}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${p === page ? 'bg-[#0058be] text-white' : 'text-[#424754] hover:bg-[#f2f4f6]'}`}
              >
                {p}
              </button>
            )
          })}
          <button
            onClick={() => handlePage(page + 1)}
            disabled={page >= totalPages}
            className="px-2 py-1 text-sm text-[#424754] hover:bg-[#f2f4f6] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
