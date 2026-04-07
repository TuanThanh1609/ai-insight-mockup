// CampaignDashboard — Template 4: Đánh giá chiến dịch
// Data: mockCampaigns từ src/data/mockCampaigns.js
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const CAMPAIGNS = [
  { id: 'c1', name: 'Fashion Spring Sale', platform: 'Facebook', budget: 50000000, spend: 48200000, revenue: 154240000, leads: 127, status: 'active' },
  { id: 'c2', name: 'MBB Back to School', platform: 'Zalo', budget: 30000000, spend: 29800000, revenue: 83440000, leads: 89, status: 'active' },
  { id: 'c3', name: 'Mỹ phẩm Promo', platform: 'Facebook', budget: 20000000, spend: 18100000, revenue: 34390000, leads: 45, status: 'needs-optimization' },
  { id: 'c4', name: 'Spa Weekend Deal', platform: 'Facebook', budget: 15000000, spend: 14900000, revenue: 11920000, leads: 12, status: 'paused' },
  { id: 'c5', name: 'BDS Central Launch', platform: 'Facebook', budget: 80000000, spend: 72000000, revenue: 288000000, leads: 234, status: 'active' },
  { id: 'c6', name: 'Du lịch Summer 2026', platform: 'Zalo', budget: 25000000, spend: 24800000, revenue: 62000000, leads: 67, status: 'active' },
  { id: 'c7', name: 'F&B Delivery April', platform: 'Facebook', budget: 10000000, spend: 9900000, revenue: 19800000, leads: 156, status: 'active' },
  { id: 'c8', name: 'Real Estate Nhà phố', platform: 'Facebook', budget: 60000000, spend: 55000000, revenue: 110000000, leads: 45, status: 'needs-optimization' },
]

function formatVND(n) {
  if (n >= 1000000000) return `${(n / 1000000000).toFixed(1)}B`
  if (n >= 1000000) return `${(n / 1000000).toFixed(0)}M`
  return `${n}`
}

function PlatformBadge({ platform }) {
  const colors = {
    Facebook: 'bg-[#3b82f6]/10 text-[#3b82f6]',
    Zalo: 'bg-[#8b5cf6]/10 text-[#8b5cf6]',
  }
  const cls = colors[platform] || 'bg-[#e0e3e5] text-[#424754]'
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${cls}`}>{platform}</span>
}

function RoasBadge({ roas }) {
  const color = roas >= 3 ? '#059669' : roas >= 1.5 ? '#d97706' : '#dc2626'
  const icon = roas >= 3 ? '↑' : roas >= 1.5 ? '↔' : '↓'
  return (
    <div className="flex items-center gap-1">
      <span style={{ color }} className="text-sm font-semibold">{roas.toFixed(1)}×</span>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    active: { label: 'Đang chạy', cls: 'bg-[#dcfce7] text-[#166534]', dot: '🟢' },
    'needs-optimization': { label: 'Cần tối ưu', cls: 'bg-[#fef9c3] text-[#854d0e]', dot: '🟡' },
    paused: { label: 'Tạm dừng', cls: 'bg-[#fee2e2] text-[#991b1b]', dot: '🔴' },
  }
  const { label, cls, dot } = map[status] || map.active
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${cls}`}>
      {dot} {label}
    </span>
  )
}

export function CampaignDashboard() {
  return (
    <div className="flex-1 overflow-auto bg-[#f7f9fb] min-h-0">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[1000px]">
          <thead className="sticky top-0 bg-[#f2f4f6] z-10 shadow-sm">
            <tr>
              {['TÊN CHIẾN DỊCH', 'NỀN TẢNG', 'NGÂN SÁCH', 'CHI TIÊU', 'ROAS', 'LEAD CHẤT LƯỢNG', 'LEAD KÉM', 'LEAD RÁC', 'TRẠNG THÁI'].map(h => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#424754] border-b border-[#c2c6d6]/15 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAMPAIGNS.map(c => {
              const roas = c.spend > 0 ? c.revenue / c.spend : 0
              const lq = Math.floor(c.leads * 0.65)
              const lk = Math.floor(c.leads * 0.22)
              const lr = Math.floor(c.leads * 0.13)
              return (
                <tr key={c.id} className="hover:bg-[#f2f4f6]/50 border-b border-[#c2c6d6]/10">
                  <td className="px-3 py-3">
                    <div className="text-sm font-medium text-[#191c1e]">{c.name}</div>
                  </td>
                  <td className="px-3 py-3"><PlatformBadge platform={c.platform} /></td>
                  <td className="px-3 py-3 text-sm text-[#424754]">{formatVND(c.budget)}</td>
                  <td className="px-3 py-3 text-sm text-[#424754]">{formatVND(c.spend)}</td>
                  <td className="px-3 py-3"><RoasBadge roas={roas} /></td>
                  <td className="px-3 py-3 text-sm font-medium" style={{ color: '#059669' }}>{lq}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: '#d97706' }}>{lk}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: '#dc2626' }}>{lr}</td>
                  <td className="px-3 py-3"><StatusBadge status={c.status} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="sticky bottom-0 bg-[#f7f9fb] border-t border-[#c2c6d6]/15 px-6 py-3 flex items-center justify-between">
        <span className="text-xs text-[#424754]">Showing 1-{CAMPAIGNS.length} of {CAMPAIGNS.length} campaigns</span>
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 text-sm text-[#424754] hover:bg-[#f2f4f6] rounded disabled:opacity-40" disabled>‹</button>
          <button className="px-2.5 py-1 text-xs bg-[#0058be] text-white rounded">1</button>
          <button className="px-2.5 py-1 text-sm text-[#424754] hover:bg-[#f2f4f6] rounded">›</button>
        </div>
      </div>
    </div>
  )
}
