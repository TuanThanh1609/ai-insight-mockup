/**
 * PillarCard — DRY wrapper cho 4 Pillar components
 * @param {object} props
 * @param {React.ReactNode} props.icon — Lucide icon component
 * @param {string} props.title — Pillar title
 * @param {string} props.iconColor — Tailwind color class for icon bg
 * @param {string} props.iconTextColor — Tailwind color class for icon
 * @param {React.ReactNode} props.chart — Chart content
 * @param {React.ReactNode} props.commentary — Commentary strip (optional)
 * @param {React.ReactNode} props.header — Extra header (optional)
 */
export default function PillarCard({
  icon: Icon,
  title,
  iconBg = 'bg-primary/10',
  iconTextColor = 'text-primary',
  chart,
  commentary,
  header,
}) {
  return (
    <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className={`p-2 rounded-md ${iconBg}`}>
            <Icon size={16} className={iconTextColor} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-semibold text-primary leading-tight truncate">
            {title}
          </h3>
          {header && <div className="mt-0.5">{header}</div>}
        </div>
      </div>

      {/* Chart area */}
      {chart && <div className="flex-1">{chart}</div>}

      {/* Commentary */}
      {commentary && <div className="border-t border-[rgba(26,33,56,0.06)] pt-2.5">{commentary}</div>}
    </div>
  );
}
