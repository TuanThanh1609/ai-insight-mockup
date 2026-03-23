import { useState } from 'react';
import { Sparkles, Plus, X, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

// ─── Color palette for result chips ────────────────────────────────────
const COLOR_PALETTE = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#64748b', '#78716c',
];

// ─── Default column shape ────────────────────────────────────────────────
function makeColumn(label = '') {
  return {
    id: `col-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: label,
    prompt: '',
    type: 'enum',
    dataType: 'single_select',
    dataOptions: [],
  };
}

// ─── Result card (drag inside) ──────────────────────────────────────────
function ResultCard({ result, index, onChange, onRemove }) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <Card className="p-4 relative">
      {/* Remove */}
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 p-1 rounded text-on-surface-variant hover:bg-surface-container-low hover:text-error transition-colors cursor-pointer"
        aria-label="Xóa"
      >
        <X size={14} />
      </button>

      {/* Kết quả */}
      <div className="mb-3">
        <p className="text-[10px] font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
          Kết quả trả về
        </p>
        <input
          type="text"
          value={result.name}
          onChange={(e) => onChange({ ...result, name: e.target.value })}
          placeholder="VD: Di động"
          className="w-full bg-surface-container-lowest border border-[var(--color-outline-variant)] rounded-[--radius-sm] px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
        />
      </div>

      {/* Màu sắc */}
      <div className="mb-3">
        <p className="text-[10px] font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
          Cấu hình màu sắc
        </p>
        <div className="flex items-center gap-2">
          {/* Current color dot */}
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-7 h-7 rounded-full shrink-0 border border-white/30 shadow-sm cursor-pointer hover:scale-110 transition-transform"
            style={{ background: result.color }}
            aria-label="Chọn màu"
          />
          {/* Hex input */}
          <input
            type="text"
            value={result.color}
            onChange={(e) => {
              const val = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
              onChange({ ...result, color: val });
            }}
            placeholder="#ef4444"
            className="flex-1 bg-surface-container-lowest border border-[var(--color-outline-variant)] rounded-[--radius-sm] px-2 py-1.5 text-xs text-on-surface font-mono placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
          />
          {/* Color picker dropdown */}
          {showColorPicker && (
            <div className="absolute z-20 mt-1 bg-surface-container-lowest border border-[var(--color-outline-variant)] rounded-[--radius-md] p-2 shadow-modal grid grid-cols-5 gap-1.5">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => { onChange({ ...result, color: c }); setShowColorPicker(false); }}
                  className={cn(
                    'w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform border-2',
                    result.color === c ? 'border-on-surface' : 'border-transparent'
                  )}
                  style={{ background: c }}
                  aria-label={c}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mô tả */}
      <div>
        <p className="text-[10px] font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
          Mô tả cho kết quả
        </p>
        <textarea
          value={result.description}
          onChange={(e) => onChange({ ...result, description: e.target.value })}
          placeholder="Mô tả ngắn gọn kết quả này..."
          rows={2}
          className="w-full bg-surface-container-lowest border border-[var(--color-outline-variant)] rounded-[--radius-sm] px-3 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors resize-none leading-relaxed"
        />
      </div>
    </Card>
  );
}

// ─── Step indicators ─────────────────────────────────────────────────────
function StepIndicator({ steps, active }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              'flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all',
              i < active
                ? 'bg-primary text-on-primary'
                : i === active
                ? 'bg-primary text-on-primary ring-4 ring-primary/20'
                : 'bg-surface-container-low text-on-surface-variant'
            )}
          >
            {i < active ? <CheckCircle2 size={14} /> : i + 1}
          </div>
          <span
            className={cn(
              'ml-2 text-xs font-medium hidden sm:inline',
              i === active ? 'text-primary' : 'text-on-surface-variant'
            )}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <div className={cn('w-8 h-px mx-2', i < active ? 'bg-primary' : 'bg-surface-container-low')} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Modal ──────────────────────────────────────────────────────────
const STEPS = ['Thông tin', 'Xác định kết quả', 'Lưu Insight'];

export function CreateInsightFromScratchModal({ isOpen, onClose, onSave }) {
  const [step, setStep] = useState(0);
  const [insightName, setInsightName] = useState('');
  const [platform, setPlatform] = useState('all');
  const [column, setColumn] = useState({
    id: `col-${Date.now()}`,
    name: '',
    prompt: '',
    type: 'enum',
    dataType: 'single_select',
    dataOptions: [],
  });
  const [results, setResults] = useState([
    { name: 'Di động', color: '#3b82f6', description: 'Khách hàng có thể hiện sự quan tâm đến các sản phẩm Di động. Ví dụ: iPhone 17, Samsung Z Fold 7, Oppo Reno 15, Xiaomi...' },
    { name: 'Máy tính bảng', color: '#8b5cf6', description: 'Khách hàng có thể hiện sự quan tâm đến các sản phẩm Máy tính bảng. Ví dụ: iPad, Samsung Galaxy Tab, Huawei MatePad...' },
    { name: 'Mac', color: '#64748b', description: 'Khách hàng có thể hiện sự quan tâm đến các sản phẩm Mac của Apple như iMac, Macbook Air, Macbook Pro...' },
    { name: 'Máy cũ giá rẻ', color: '#ef4444', description: '' },
  ]);

  const reset = () => {
    setStep(0);
    setInsightName('');
    setPlatform('all');
    setColumn({ id: `col-${Date.now()}`, name: '', prompt: '', type: 'enum', dataType: 'single_select', dataOptions: [] });
    setResults([{ name: '', color: COLOR_PALETTE[0], description: '' }]);
  };

  const handleClose = () => { reset(); onClose(); };

  const canNext = () => {
    if (step === 0) return insightName.trim().length > 0;
    if (step === 1) return results.some((r) => r.name.trim().length > 0);
    return true;
  };

  const handleSave = () => {
    const validResults = results.filter((r) => r.name.trim());
    const newInsight = {
      id: `ins-${Date.now()}`,
      name: insightName.trim(),
      templateId: 'custom',
      platform,
      columnCount: 1,
      status: 'active',
      createdAt: new Date().toISOString(),
      conversationsCount: 0,
      isCustom: true,
    };
    onSave(newInsight);
    handleClose();
  };

  const updateResult = (index, updated) => setResults(results.map((r, i) => (i === index ? updated : r)));
  const removeResult = (index) => setResults(results.filter((_, i) => i !== index));
  const addResult = () =>
    setResults([...results, { name: '', color: COLOR_PALETTE[results.length % COLOR_PALETTE.length], description: '' }]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="xl">
      <ModalHeader>
        <div className="pr-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-primary" />
            <h2 className="font-display font-bold text-xl text-on-surface">Tạo Insight từ đầu</h2>
          </div>
          <p className="text-xs text-on-surface-variant">
            Tự thiết kế cấu hình phân tích AI theo nhu cầu riêng của bạn
          </p>
        </div>
      </ModalHeader>

      <ModalBody className="pt-2">
        <StepIndicator steps={STEPS} active={step} />

        {/* ── STEP 0: Thông tin ── */}
        {step === 0 && (
          <div className="flex flex-col gap-5">
            {/* Insight name */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
                Tên Insight <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={insightName}
                onChange={(e) => setInsightName(e.target.value)}
                placeholder="VD: Phân loại thiết bị quan tâm"
                className="w-full bg-surface-container-lowest border border-[var(--color-outline-variant)] rounded-[--radius-md] px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>

            {/* Platform */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">
                Nền tảng áp dụng
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'facebook', label: 'Facebook' },
                  { value: 'zalo', label: 'Zalo' },
                  { value: 'all', label: 'Tất cả kênh' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPlatform(opt.value)}
                    className={cn(
                      'flex-1 py-2 px-3 rounded-[--radius-md] text-xs font-medium transition-all border cursor-pointer',
                      platform === opt.value
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container-lowest text-on-surface-variant border-[var(--color-outline-variant)] hover:border-primary/40'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Column name */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
                Tên cột dữ liệu AI
              </label>
              <input
                type="text"
                value={column.name}
                onChange={(e) => setColumn({ ...column, name: e.target.value })}
                placeholder="VD: Thiết bị quan tâm"
                className="w-full bg-surface-container-lowest border border-[var(--color-outline-variant)] rounded-[--radius-md] px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
          </div>
        )}

        {/* ── STEP 1: Xác định kết quả (GenAI) ── */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            {/* Type filter chips */}
            <div>
              <p className="text-[10px] font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">
                Loại kết quả
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'genai', label: 'GenAI', icon: <Sparkles size={11} /> },
                  { value: 'enum', label: 'Thuộc tính', icon: null },
                  { value: 'tags', label: 'Tags', icon: null },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer',
                      opt.value === 'genai'
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container-low text-on-surface-variant border-[var(--color-outline-variant)] hover:border-primary/40'
                    )}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Result mode */}
            <div>
              <p className="text-[10px] font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">
                Chế độ kết quả
              </p>
              <div className="flex gap-2">
                {[
                  { value: 'predefined', label: 'Kết quả được xác định trước', note: 'AI sẽ phân loại vào 1 trong các kết quả' },
                  { value: 'dynamic', label: 'Kết quả do AI xác định', note: 'AI tự sinh kết quả phù hợp từ nội dung chat' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={cn(
                      'flex-1 text-left py-2.5 px-3 rounded-[--radius-md] text-xs font-medium transition-all border cursor-pointer',
                      opt.value === 'predefined'
                        ? 'bg-surface-container-lowest border-primary text-on-surface'
                        : 'bg-surface-container-lowest border-[var(--color-outline-variant)] text-on-surface-variant hover:border-primary/40'
                    )}
                  >
                    <div className="font-semibold mb-0.5">{opt.label}</div>
                    <div className="opacity-70 font-normal">{opt.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Result cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wide">
                  Các kết quả trả về ({results.length})
                </p>
                <Button variant="ghost" size="sm" onClick={addResult} className="gap-1">
                  <Plus size={12} /> Thêm kết quả
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((result, i) => (
                  <div key={i} className="relative">
                    <ResultCard
                      result={result}
                      index={i}
                      onChange={(updated) => updateResult(i, updated)}
                      onRemove={() => results.length > 1 && removeResult(i)}
                    />
                    {results.length > 1 && (
                      <button
                        onClick={() => removeResult(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer z-10"
                        aria-label="Xóa kết quả"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Lưu ── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            {/* Preview card */}
            <Card className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-[--radius-md] bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shrink-0">
                  <Sparkles size={18} className="text-on-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-on-surface">{insightName || 'Insight mới'}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {platform === 'facebook' ? 'Facebook' : platform === 'zalo' ? 'Zalo' : 'Tất cả kênh'}
                  </p>
                </div>
              </div>

              {/* Column info */}
              <div className="bg-surface-container-low rounded-[--radius-md] p-3 mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase">
                    {column.dataType === 'single_select' ? 'Lựa chọn' : column.dataType === 'dropdown' ? 'Dropdown' : 'Text'}
                  </span>
                  <span className="text-xs font-medium text-on-surface">{column.name || 'Cột dữ liệu AI'}</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  GenAI · {results.filter((r) => r.name).length} kết quả xác định trước
                </p>
              </div>

              {/* Result chips preview */}
              <div className="flex flex-wrap gap-2">
                {results.filter((r) => r.name).map((r, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full text-white"
                    style={{ background: r.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                    {r.name}
                  </span>
                ))}
              </div>
            </Card>

            {/* AI note */}
            <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/15 rounded-[--radius-md]">
              <Sparkles size={14} className="text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                AI sẽ phân tích từng hội thoại và gắn nhãn phù hợp vào 1 trong các kết quả trên. Kết quả được xác định trước giúp đảm bảo tính nhất quán của dữ liệu.
              </p>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        {step > 0 && (
          <Button variant="ghost" onClick={() => setStep(step - 1)} className="gap-1.5">
            <ChevronLeft size={14} />
            Quay lại
          </Button>
        )}
        <div className="flex-1" />
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        {step < 2 ? (
          <Button variant="ai-action" onClick={() => setStep(step + 1)} disabled={!canNext()}>
            Tiếp tục
            <ChevronRight size={14} />
          </Button>
        ) : (
          <Button variant="ai-action" onClick={handleSave}>
            <Sparkles size={14} />
            Lưu Insight
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
