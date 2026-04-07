import { X, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

export function AIInsightPanel({ campaign, insight, isOpen, onClose }) {
  if (!isOpen || !campaign || !insight) return null;

  const actionColorMap = {
    success: 'border-tertiary-container',
    warning: 'border-warning-container',
    danger: 'border-error-container',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-on-surface/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[400px] z-50 flex flex-col">
        <div className="flex-1 bg-surface-container-lowest/95 glass overflow-y-auto flex flex-col">
          {/* Gradient header */}
          <div className="px-6 pt-8 pb-6 bg-gradient-to-r from-primary to-primary-dim">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <span className="text-white/80 text-xs font-medium">Phân tích AI</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-white/80 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <h2 className="font-display font-bold text-white text-lg leading-tight mb-1">
              {campaign.name}
            </h2>
            <div className="flex items-center gap-2">
              <Badge platform={campaign.platform} size="sm">
                {campaign.platform === 'facebook' ? 'Facebook' : 'Zalo'}
              </Badge>
              <span className="text-white/70 text-xs">
                {campaign.conversations} hội thoại
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-6 flex flex-col gap-6">
            {/* Alert type */}
            <div className={cn('rounded-md p-4 border-l-4', actionColorMap[insight.actionColor])}>
              <div className="text-2xl mb-2">{insight.icon}</div>
              <h3 className="font-display font-bold text-sm text-on-surface mb-2">{insight.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{insight.description}</p>
            </div>

            {/* Lead quality breakdown */}
            <div>
              <p className="text-xs font-semibold text-on-surface-variant mb-3">Phân tích chất lượng Lead</p>
              <div className="flex flex-col gap-2">
                <QualityBar label="Khách rác / Không tương tác" value={insight.metrics.junkRate} color="#fee2e2" />
                <QualityBar label="Quan tâm thật" value={insight.metrics.qualityRate} color="#d1fae5" />
                <QualityBar label="Spam" value={insight.metrics.spamRate} color="#fef3c7" />
              </div>
            </div>

            {/* Comparison */}
            <Card className="p-4">
              <p className="text-xs font-semibold text-on-surface-variant mb-3">So sánh với channel trung bình</p>
              <div className="flex flex-col gap-2">
                <ComparisonRow label={`Lead chất lượng ${campaign.platform === 'facebook' ? 'FB' : 'Zalo'}`} value={`${insight.comparison.campaignLead}%`} />
                <ComparisonRow label="Trung bình kênh" value={`${insight.comparison.channelAvg}%`} />
                <ComparisonRow
                  label="Chênh lệch"
                  value={`${insight.comparison.diff > 0 ? '+' : ''}${insight.comparison.diff}%`}
                  highlight
                  positive={insight.comparison.diff > 0}
                />
              </div>
            </Card>

            {/* Recommendation */}
            <Card className="p-4 border-l-4 border-primary">
              <p className="text-xs font-semibold text-primary mb-2">💡 Gợi ý từ AI</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">{insight.recommendation}</p>
            </Card>

            {/* Confidence */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-on-surface-variant">Độ tin cậy</span>
                <span className="text-xs font-bold text-on-surface">{insight.confidence}%</span>
              </div>
              <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-700"
                  style={{ width: `${insight.confidence}%` }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 mt-auto pt-2">
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={() => window.open('https://adsmanager.facebook.com', '_blank')}
              >
                <ExternalLink size={15} />
                Mở Ads Manager
              </Button>
              <Button variant="primary" className="w-full justify-center" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function QualityBar({ label, value, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-on-surface-variant">{label}</span>
        <span className="text-xs font-bold text-on-surface">{value}%</span>
      </div>
      <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

function ComparisonRow({ label, value, highlight, positive }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-on-surface-variant">{label}</span>
      <span className={cn(
        'text-xs font-bold',
        highlight ? (positive ? 'text-on-tertiary-container' : 'text-on-error-container') : 'text-on-surface'
      )}>
        {value}
      </span>
    </div>
  );
}
