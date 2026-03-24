import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const industryColors = {
  fashion:    'bg-pink-100 text-pink-700',
  mebaby:     'bg-blue-100 text-blue-700',
  cosmetics:  'bg-purple-100 text-purple-700',
  spa:        'bg-orange-100 text-orange-700',
  realestate: 'bg-teal-100 text-teal-700',
  fnb:        'bg-yellow-100 text-yellow-700',
  travel:     'bg-cyan-100 text-cyan-700',
};

const industryLabels = {
  fashion:    'Thời trang',
  mebaby:     'Mẹ và Bé',
  cosmetics:  'Mỹ phẩm',
  spa:        'Spa / Thẩm mỹ',
  realestate: 'Bất động sản',
  fnb:        'F&B',
  travel:     'Du lịch',
};

export function TemplateCard({ template, onSelect }) {
  const previewCols = template.columns.slice(0, 3);
  const extraCount = template.columns.length - 3;
  const badgeClass = industryColors[template.industry] || 'bg-surface-container-low text-on-surface-variant';

  return (
    <Card
      hover
      className="p-5 flex flex-col gap-4"
      onClick={() => onSelect(template)}
    >
      {/* Industry badge + template icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl" role="img" aria-label={template.name}>{template.icon}</span>
          {template.industry && (
            <span className={cn('inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full', badgeClass)}>
              {industryLabels[template.industry] || template.industry}
            </span>
          )}
        </div>
        <span className="text-[11px] text-on-surface-variant">{template.columns.length} cột AI</span>
      </div>

      {/* Title & description */}
      <div className="flex-1">
        <h3 className="font-display font-bold text-sm text-on-surface mb-1.5 leading-snug">
          {template.name}
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {template.description}
        </p>
      </div>

      {/* Column preview chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {previewCols.map((col) => (
          <span
            key={col.id}
            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium bg-surface-container-low rounded-full text-on-surface-variant"
          >
            <span>{col.icon}</span>
            <span className="hidden xs:inline">{col.name.slice(0, 10)}</span>
          </span>
        ))}
        {extraCount > 0 && (
          <span className="text-[10px] text-on-surface-variant font-medium px-1">
            +{extraCount}
          </span>
        )}
      </div>

      {/* Action */}
      <Button
        variant="primary"
        size="sm"
        className="w-full mt-auto"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(template);
        }}
      >
        Sử dụng
        <ArrowRight size={14} />
      </Button>
    </Card>
  );
}
