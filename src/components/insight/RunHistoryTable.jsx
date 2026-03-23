import { Clock, Phone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

const statusConfig = {
  'Hoàn thành': { icon: CheckCircle2, color: 'text-[#059669]', bg: 'bg-[#059669]/10', label: 'Hoàn thành' },
  'Lỗi': { icon: AlertCircle, color: 'text-[#dc2626]', bg: 'bg-[#dc2626]/10', label: 'Lỗi' },
  'Đang chạy': { icon: Loader2, color: 'text-[#d97706]', bg: 'bg-[#d97706]/10', label: 'Đang chạy' },
};

export function RunHistoryTable({ runs }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-outline-variant">
            <th className="text-left py-3 px-4 text-xs font-semibold text-on-surface-variant whitespace-nowrap">
              Tên lần chạy
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-on-surface-variant whitespace-nowrap">
              Thời gian bắt đầu
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-on-surface-variant whitespace-nowrap">
              Thời gian kết thúc
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-on-surface-variant whitespace-nowrap">
              Thời lượng
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-on-surface-variant whitespace-nowrap">
              Số hội thoại
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-on-surface-variant whitespace-nowrap">
              Điểm TB
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-on-surface-variant whitespace-nowrap">
              Trạng thái
            </th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => {
            const status = statusConfig[run.status] || statusConfig['Hoàn thành'];
            const StatusIcon = status.icon;
            return (
              <tr
                key={run.id}
                className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-on-surface-variant shrink-0" />
                    <span className="font-medium text-on-surface text-sm">{run.runName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-on-surface-variant text-xs whitespace-nowrap">{run.startTime}</td>
                <td className="py-3 px-4 text-on-surface-variant text-xs whitespace-nowrap">{run.endTime}</td>
                <td className="py-3 px-4 text-on-surface-variant text-xs whitespace-nowrap">{run.duration}</td>
                <td className="py-3 px-4 text-right text-on-surface font-medium text-sm whitespace-nowrap">
                  {run.conversations.toLocaleString('vi-VN')}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden w-16">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${run.avgScore}%`,
                          background: run.avgScore >= 70 ? '#059669' : run.avgScore >= 50 ? '#d97706' : '#dc2626',
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-on-surface w-8 text-right">{run.avgScore}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium',
                    status.color, status.bg
                  )}>
                    <StatusIcon size={11} className={cn(run.status === 'Đang chạy' && 'animate-spin')} />
                    {status.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}