import { Card } from '../ui/Card';
import { MessageSquare, CheckCircle2, AlertTriangle, Trophy } from 'lucide-react';

export function InsightSummaryCards({ stats }) {
  const cards = [
    {
      label: 'Hội thoại đã phân tích',
      value: stats.analyzedConversations.toLocaleString('vi-VN'),
      icon: MessageSquare,
      color: 'text-primary',
      bg: 'bg-primary/10',
      sub: null,
    },
    {
      label: 'Tỉ lệ đạt',
      value: `${stats.achievementRate}%`,
      icon: CheckCircle2,
      color: 'text-[#059669]',
      bg: 'bg-[#059669]/10',
      sub: (
        <div className="mt-1">
          <span className="inline-flex items-center text-[10px] text-[#059669] font-medium px-1.5 py-0.5 rounded-full bg-[#059669]/10">
            ↑ 5% so với tháng trước
          </span>
        </div>
      ),
    },
    {
      label: 'Vấn đề phát hiện',
      value: stats.issuesDetected.toLocaleString('vi-VN'),
      icon: AlertTriangle,
      color: 'text-[#db2777]',
      bg: 'bg-[#db2777]/10',
      sub: (
        <div className="mt-1">
          <span className="inline-flex items-center text-[10px] text-[#db2777] font-medium px-1.5 py-0.5 rounded-full bg-[#db2777]/10">
            ↓ 12% so với tháng trước
          </span>
        </div>
      ),
    },
    {
      label: 'Điểm trung bình',
      value: `${stats.avgScore}/100`,
      icon: Trophy,
      color: 'text-[#d97706]',
      bg: 'bg-[#d97706]/10',
      sub: (
        <div className="mt-1">
          <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden w-full max-w-[120px]">
            <div
              className="h-full bg-[#d97706] rounded-full transition-all duration-700"
              style={{ width: `${stats.avgScore}%` }}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium">{card.label}</span>
              <div className={`p-2 rounded-[--radius-sm] ${card.bg}`}>
                <Icon size={16} className={card.color} />
              </div>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-on-surface leading-none">
                {card.value}
              </p>
              {card.sub}
            </div>
          </Card>
        );
      })}
    </div>
  );
}