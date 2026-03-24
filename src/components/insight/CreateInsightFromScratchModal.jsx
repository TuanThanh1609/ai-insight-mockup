import { useState, useCallback } from 'react';
import {
  Sparkles, Plus, X, ChevronRight, ChevronLeft,
  CheckCircle2, Building2, Zap, Loader2, AlertCircle, Trash2, Edit3, Eye
} from 'lucide-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';
import { callCustomAI, buildBusinessPrompt, SCALE_OPTIONS, INDUSTRIES_WITH_LABELS } from '../../lib/aiService';

// ─── Color palette for result chips ──────────────────────────────────────────
const COLOR_PALETTE = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#64748b', '#78716c',
];

const INSIGHT_ICONS = ['🎯', '📊', '⭐', '👤', '⚔️', '🔔'];

// ─── Step indicators ───────────────────────────────────────────────────────────
function StepIndicator({ steps, active }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center">
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
              'ml-2 text-xs font-medium hidden sm:inline whitespace-nowrap',
              i === active ? 'text-primary' : 'text-on-surface-variant'
            )}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div className={cn('w-8 h-px mx-2', i < active ? 'bg-primary' : 'bg-surface-container-low')} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── AI Loading spinner ───────────────────────────────────────────────────────
function AIGenerating({ message }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 size={24} className="text-primary animate-spin" />
        </div>
        <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-primary/30 animate-ping" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-on-surface mb-1">{message}</p>
        <p className="text-xs text-on-surface-variant">Đang kết nối Custom AI của bạn...</p>
      </div>
    </div>
  );
}

// ─── Error banner ─────────────────────────────────────────────────────────────
function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-[--radius-md] mb-4">
      <AlertCircle size={18} className="text-error shrink-0" />
      <p className="flex-1 text-xs text-error">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-xs font-semibold text-error hover:underline shrink-0">
          Thử lại
        </button>
      )}
    </div>
  );
}

// ─── Business Info Form (Step 0) ─────────────────────────────────────────────
function BusinessInfoForm({ data, onChange }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Tên doanh nghiệp */}
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
          Tên Doanh nghiệp <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={data.businessName}
          onChange={(e) => onChange({ ...data, businessName: e.target.value })}
          placeholder="VD: Maison De Mode, Bibo Mart, Luxe Spa..."
          className="w-full bg-surface-container-lowest border border-[var(--color-outline-variant)] rounded-[--radius-md] px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
        />
      </div>

      {/* Ngành hàng */}
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">
          Ngành hàng <span className="text-error">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {INDUSTRIES_WITH_LABELS.map((ind) => (
            <button
              key={ind.id}
              onClick={() => onChange({ ...data, industry: ind.id, industryLabel: ind.label })}
              className={cn(
                'flex items-center gap-2 py-2.5 px-3 rounded-[--radius-md] text-xs font-medium transition-all border cursor-pointer text-left',
                data.industry === ind.id
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant border-[var(--color-outline-variant)] hover:border-primary/40'
              )}
            >
              <span className="text-base leading-none">{ind.icon}</span>
              <span>{ind.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quy mô */}
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">
          Quy mô doanh nghiệp
        </label>
        <div className="flex flex-wrap gap-2">
          {SCALE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange({ ...data, scale: opt })}
              className={cn(
                'py-1.5 px-3 rounded-full text-xs font-medium transition-all border cursor-pointer',
                data.scale === opt
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-low text-on-surface-variant border-[var(--color-outline-variant)] hover:border-primary/40'
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Tập khách hàng */}
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
          Tập khách hàng mục tiêu
        </label>
        <textarea
          value={data.targetAudience}
          onChange={(e) => onChange({ ...data, targetAudience: e.target.value })}
          placeholder="VD: Phụ nữ 25-40 tuổi, thu nhập trung bình-cao, quan tâm sản phẩm chăm sóc da..."
          rows={3}
          className="w-full bg-surface-container-lowest border border-[var(--color-outline-variant)] rounded-[--radius-md] px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none leading-relaxed"
        />
      </div>

      {/* Mong muốn phân tích */}
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
          Mong muốn phân tích dữ liệu hội thoại
        </label>
        <textarea
          value={data.analysisGoals}
          onChange={(e) => onChange({ ...data, analysisGoals: e.target.value })}
          placeholder="VD: Muốn biết khách hàng thường hỏi về vấn đề gì, phát hiện khách có ý định mua hay chỉ thăm dò, đánh giá chất lượng tư vấn của nhân viên..."
          rows={3}
          className="w-full bg-surface-container-lowest border border-[var(--color-outline-variant)] rounded-[--radius-md] px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none leading-relaxed"
        />
      </div>

      {/* AI hint */}
      <div className="flex items-start gap-2.5 p-3 bg-primary/5 border border-primary/15 rounded-[--radius-md]">
        <Zap size={14} className="text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-on-surface-variant leading-relaxed">
          <strong className="text-primary font-semibold">Custom AI</strong> sẽ phân tích thông tin bên trên và tự gen ra{' '}
          <strong>1 Master Business Insight</strong> cùng{' '}
          <strong>6 Insight chi tiết</strong> phù hợp với ngành của bạn. Bạn có thể chỉnh sửa trước khi lưu.
        </p>
      </div>
    </div>
  );
}

// ─── Preview Insight Card (Step 1 & 2) ───────────────────────────────────────
function InsightPreviewCard({ insight, index, selected, onToggle, onEdit, editing, onSaveEdit, onCancelEdit }) {
  const [editData, setEditData] = useState(insight);

  return (
    <div
      className={cn(
        'relative rounded-[--radius-lg] border transition-all',
        selected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-[var(--color-outline-variant)] bg-surface-container-lowest hover:border-primary/30'
      )}
    >
      {/* Toggle checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          'absolute top-3 right-3 w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer z-10',
          selected
            ? 'bg-primary border-primary text-on-primary'
            : 'bg-surface-container-lowest border-[var(--color-outline-variant)] hover:border-primary/50'
        )}
      >
        {selected && <CheckCircle2 size={12} />}
      </button>

      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start gap-3 pr-8">
          <div
            className="w-9 h-9 rounded-[--radius-md] bg-surface-container-low flex items-center justify-center shrink-0 text-lg"
          >
            {insight.icon}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-on-surface leading-tight">{insight.name}</h4>
            <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{insight.description}</p>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {(insight.columns || []).map((col, ci) => (
            <span
              key={ci}
              className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-medium"
            >
              <span className="opacity-60">{ci + 1}</span>
              {col.name}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-on-surface-variant/60 mt-2">
          {insight.columns?.length || 0} cột · {insight.columns?.find(c => c.type === 'single_select') || insight.columns?.find(c => c.type === 'dropdown') ? 'Có dropdown' : 'Text'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 pb-3 border-t border-[var(--color-outline-variant)]/50 pt-2">
        <button
          onClick={onToggle}
          className={cn(
            'flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded transition-colors cursor-pointer',
            selected
              ? 'text-primary bg-primary/10'
              : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
          )}
        >
          {selected ? <CheckCircle2 size={10} /> : null}
          {selected ? 'Đã chọn' : 'Chọn'}
        </button>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer ml-auto"
        >
          <Edit3 size={10} />
          Sửa
        </button>
      </div>

      {/* Edit overlay */}
      {editing && (
        <InsightEditModal
          insight={{ ...insight }}
          onSave={(updated) => { onSaveEdit(updated); }}
          onClose={onCancelEdit}
        />
      )}
    </div>
  );
}

// ─── Insight Edit Modal ──────────────────────────────────────────────────────
function InsightEditModal({ insight, onSave, onClose }) {
  const [data, setData] = useState({ ...insight });

  const updateColumn = (ci, updated) => {
    const cols = [...data.columns];
    cols[ci] = updated;
    setData({ ...data, columns: cols });
  };

  const addColumn = () => {
    setData({
      ...data,
      columns: [...data.columns, {
        name: '',
        prompt: '',
        type: 'single_select',
        dataOptions: [''],
      }],
    });
  };

  const removeColumn = (ci) => {
    setData({ ...data, columns: data.columns.filter((_, i) => i !== ci) });
  };

  const updateOption = (ci, oi, val) => {
    const opts = [...data.columns[ci].dataOptions];
    opts[oi] = val;
    updateColumn(ci, { ...data.columns[ci], dataOptions: opts });
  };

  const addOption = (ci) => {
    const opts = [...data.columns[ci].dataOptions, ''];
    updateColumn(ci, { ...data.columns[ci], dataOptions: opts });
  };

  const removeOption = (ci, oi) => {
    const opts = data.columns[ci].dataOptions.filter((_, i) => i !== oi);
    updateColumn(ci, { ...data.columns[ci], dataOptions: opts });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest rounded-[--radius-xl] shadow-modal w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-outline-variant)]">
          <div>
            <h3 className="font-display font-bold text-base text-on-surface">Sửa Insight</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">{data.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-[--radius-md] hover:bg-surface-container-low transition-colors cursor-pointer text-on-surface-variant">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Name + Icon */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase">Tên Insight</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full bg-surface-container-low border border-[var(--color-outline-variant)] rounded-[--radius-md] px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase">Icon</label>
              <div className="flex flex-wrap gap-1 bg-surface-container-low border border-[var(--color-outline-variant)] rounded-[--radius-md] p-2 h-[42px] overflow-y-auto">
                {INSIGHT_ICONS.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => setData({ ...data, icon: ic })}
                    className={cn(
                      'w-7 h-7 rounded text-sm flex items-center justify-center cursor-pointer transition-colors',
                      data.icon === ic ? 'bg-primary/20 ring-1 ring-primary' : 'hover:bg-surface-container-lowest'
                    )}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase">Mô tả</label>
            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              rows={2}
              className="w-full bg-surface-container-low border border-[var(--color-outline-variant)] rounded-[--radius-md] px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Columns */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-on-surface-variant uppercase">Các cột dữ liệu ({data.columns?.length || 0})</label>
              <Button variant="ghost" size="sm" onClick={addColumn} className="gap-1 text-xs">
                <Plus size={11} /> Thêm cột
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              {(data.columns || []).map((col, ci) => (
                <Card key={ci} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-primary uppercase">Cột {ci + 1}</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={col.type}
                        onChange={(e) => updateColumn(ci, { ...col, type: e.target.value, dataOptions: ['single_select','dropdown'].includes(e.target.value) ? (col.dataOptions?.length ? col.dataOptions : ['']) : null })}
                        className="bg-surface-container-low border border-[var(--color-outline-variant)] rounded px-2 py-1 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="short_text">Short Text</option>
                        <option value="single_select">Single Select</option>
                        <option value="dropdown">Dropdown (Multi-tag)</option>
                        <option value="true_false">True / False</option>
                      </select>
                      <button onClick={() => removeColumn(ci)} className="p-1 rounded text-error/70 hover:text-error hover:bg-error/10 transition-colors cursor-pointer">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={col.name}
                      onChange={(e) => updateColumn(ci, { ...col, name: e.target.value })}
                      placeholder="Tên cột (VD: Lead Temperature)"
                      className="w-full bg-surface-container-lowest border border-[var(--color-outline-variant)] rounded-[--radius-sm] px-3 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary"
                    />
                    <textarea
                      value={col.prompt}
                      onChange={(e) => updateColumn(ci, { ...col, prompt: e.target.value })}
                      placeholder="Prompt cho AI trích xuất dữ liệu..."
                      rows={2}
                      className="w-full bg-surface-container-lowest border border-[var(--color-outline-variant)] rounded-[--radius-sm] px-3 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary resize-none leading-relaxed"
                    />

                    {/* Options for select/dropdown */}
                    {['single_select', 'dropdown'].includes(col.type) && (
                      <div>
                        <p className="text-[10px] font-semibold text-on-surface-variant mb-1.5 uppercase">Các lựa chọn</p>
                        <div className="flex flex-col gap-1">
                          {(col.dataOptions || []).map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => updateOption(ci, oi, e.target.value)}
                                placeholder={`Lựa chọn ${oi + 1}`}
                                className="flex-1 bg-surface-container-low border border-[var(--color-outline-variant)] rounded-[--radius-sm] px-2 py-1.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary"
                              />
                              <button onClick={() => removeOption(ci, oi)} className="p-1 text-error/60 hover:text-error cursor-pointer">
                                <X size={11} />
                              </button>
                            </div>
                          ))}
                          <button onClick={() => addOption(ci)} className="flex items-center gap-1 text-[10px] text-primary hover:underline cursor-pointer py-1">
                            <Plus size={10} /> Thêm lựa chọn
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-[var(--color-outline-variant)]">
          <Button variant="ghost" size="sm" onClick={onClose}>Hủy</Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => { onSave(data); onClose(); }}
            disabled={!data.name.trim() || !data.columns?.length}
          >
            <Sparkles size={13} />
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Master Insight Banner ────────────────────────────────────────────────────
function MasterInsightBanner({ master, onEdit }) {
  if (!master) return null;
  return (
    <div className="mb-5 rounded-[--radius-lg] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-[--radius-md] bg-primary/15 flex items-center justify-center shrink-0 text-xl">
          {master.icon || '🏢'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary uppercase tracking-wide">
              Master AI Business Insight
            </span>
            {onEdit && (
              <button onClick={onEdit} className="p-0.5 text-primary/60 hover:text-primary transition-colors cursor-pointer">
                <Edit3 size={11} />
              </button>
            )}
          </div>
          <h3 className="font-display font-bold text-sm text-on-surface">{master.name}</h3>
          <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{master.description}</p>
          {master.focusAreas?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {master.focusAreas.map((area, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-medium">
                  {area}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Modal ─────────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Doanh nghiệp' },
  { label: 'AI tạo Insight' },
  { label: 'Xác nhận' },
  { label: 'Lưu' },
];

export function CreateInsightFromScratchModal({ isOpen, onClose, onSave }) {
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [retryFn, setRetryFn] = useState(null);

  // Business form data
  const [businessData, setBusinessData] = useState({
    businessName: '',
    industry: '',
    industryLabel: '',
    scale: '',
    targetAudience: '',
    analysisGoals: '',
  });

  // AI-generated data
  const [masterInsight, setMasterInsight] = useState(null);
  const [generatedInsights, setGeneratedInsights] = useState([]);
  const [selectedInsightIds, setSelectedInsightIds] = useState([]);

  // Editing state
  const [editingInsightIndex, setEditingInsightIndex] = useState(null);
  const [editingMaster, setEditingMaster] = useState(false);

  // ─── Reset ──────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setStep(0);
    setGenerating(false);
    setAiError('');
    setRetryFn(null);
    setBusinessData({ businessName: '', industry: '', industryLabel: '', scale: '', targetAudience: '', analysisGoals: '' });
    setMasterInsight(null);
    setGeneratedInsights([]);
    setSelectedInsightIds([]);
    setEditingInsightIndex(null);
    setEditingMaster(false);
  }, []);

  const handleClose = useCallback(() => { reset(); onClose(); }, [reset, onClose]);

  // ─── Step 0 → 1: Call AI ────────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (!businessData.industry) return;
    setGenerating(true);
    setAiError('');
    setRetryFn(null);

    try {
      const prompt = buildBusinessPrompt(businessData);
      const result = await callCustomAI(prompt);

      setMasterInsight(result.masterInsight);
      setGeneratedInsights(result.insights || []);
      setSelectedInsightIds((result.insights || []).map((_, i) => i));
      setStep(1);
    } catch (err) {
      console.error('AI Generation Error:', err);
      setAiError(err.message || 'Không thể kết nối Custom AI. Vui lòng kiểm tra API Key và thử lại.');
      setRetryFn(() => handleGenerate);
    } finally {
      setGenerating(false);
    }
  }, [businessData]);

  // ─── Can proceed ───────────────────────────────────────────────────────
  const canNext0 = businessData.businessName.trim().length > 0 && businessData.industry.length > 0;
  const canNext1 = generatedInsights.length > 0 && selectedInsightIds.length > 0;

  // ─── Toggle insight selection ───────────────────────────────────────────
  const toggleInsight = (index) => {
    setSelectedInsightIds((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const selectAll = () => setSelectedInsightIds(generatedInsights.map((_, i) => i));
  const selectNone = () => setSelectedInsightIds([]);

  // ─── Edit insight ────────────────────────────────────────────────────────
  const handleSaveEdit = (index, updated) => {
    const updatedList = [...generatedInsights];
    updatedList[index] = updated;
    setGeneratedInsights(updatedList);
    setEditingInsightIndex(null);
  };

  // ─── Save ───────────────────────────────────────────────────────────────
  const handleSave = () => {
    const selected = generatedInsights
      .filter((_, i) => selectedInsightIds.includes(i))
      .map((ins, globalIndex) => ({
        id: `ai-ins-${Date.now()}-${globalIndex}`,
        name: ins.name,
        description: ins.description,
        templateId: 'ai-generated',
        industry: businessData.industry,
        platform: 'all',
        columnCount: ins.columns?.length || 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        conversationsCount: 0,
        isCustom: true,
        isAIGenerated: true,
        masterInsightName: masterInsight?.name,
        columns: (ins.columns || []).map((col, ci) => ({
          id: `col-${Date.now()}-${ci}`,
          name: col.name,
          prompt: col.prompt,
          type: col.type === 'single_select' || col.type === 'dropdown' ? 'enum' : 'text',
          dataType: col.type,
          dataOptions: col.dataOptions || null,
          icon: '📊',
        })),
      }));

    onSave({
      masterInsight,
      insights: selected,
    });

    handleClose();
  };

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="2xl">
      <ModalHeader>
        <div className="pr-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-primary" />
            <h2 className="font-display font-bold text-xl text-on-surface">Tạo Insight bằng AI</h2>
          </div>
          <p className="text-xs text-on-surface-variant">
            Khai báo thông tin doanh nghiệp → AI tự gen 6 Insight phù hợp
          </p>
        </div>
      </ModalHeader>

      <ModalBody className="pt-2">
        <StepIndicator steps={STEPS} active={step} />

        {/* ── STEP 0: Thông tin Doanh nghiệp ── */}
        {step === 0 && (
          <BusinessInfoForm data={businessData} onChange={setBusinessData} />
        )}

        {/* ── STEP 1: AI Generating ── */}
        {step === 1 && (
          <div>
            {generating && <AIGenerating message="AI đang tạo 6 Insight cho bạn..." />}
            {aiError && <ErrorBanner message={aiError} onRetry={retryFn} />}

            {!generating && !aiError && masterInsight && (
              <>
                {/* Master Insight Banner */}
                <MasterInsightBanner
                  master={masterInsight}
                  onEdit={() => setEditingMaster(true)}
                />

                {/* Insight cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {generatedInsights.map((ins, i) => (
                    <InsightPreviewCard
                      key={i}
                      insight={ins}
                      index={i}
                      selected={selectedInsightIds.includes(i)}
                      onToggle={() => toggleInsight(i)}
                      onEdit={() => setEditingInsightIndex(i)}
                      editing={editingInsightIndex === i}
                      onSaveEdit={(updated) => handleSaveEdit(i, updated)}
                      onCancelEdit={() => setEditingInsightIndex(null)}
                    />
                  ))}
                </div>

                {/* Selection controls */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[var(--color-outline-variant)]/50">
                  <span className="text-xs text-on-surface-variant">
                    Đã chọn: <strong className="text-on-surface">{selectedInsightIds.length}</strong> / {generatedInsights.length}
                  </span>
                  <div className="flex gap-2 ml-auto">
                    <button onClick={selectAll} className="text-[11px] text-primary hover:underline cursor-pointer">
                      Chọn tất cả
                    </button>
                    <span className="text-on-surface-variant">·</span>
                    <button onClick={selectNone} className="text-[11px] text-on-surface-variant hover:underline cursor-pointer">
                      Bỏ chọn
                    </button>
                  </div>
                </div>

                {/* Tip */}
                <div className="flex items-start gap-2 mt-4 p-3 bg-primary/5 border border-primary/15 rounded-[--radius-md]">
                  <Sparkles size={12} className="text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    AI đã tạo 6 insight theo <strong className="text-primary">{businessData.industryLabel || businessData.industry}</strong>. Bạn có thể{' '}
                    <strong>sửa tên, mô tả, cột dữ liệu</strong> trước khi lưu. Chỉ những insight được chọn mới được tạo.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── STEP 2: Confirm Summary ── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            {/* Master summary */}
            <Card className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[--radius-md] bg-primary/10 flex items-center justify-center shrink-0 text-xl">
                  {masterInsight?.icon || '🏢'}
                </div>
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary uppercase tracking-wide">
                    Master Business Insight
                  </span>
                  <h3 className="font-display font-bold text-base text-on-surface mt-1.5">{masterInsight?.name}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">{masterInsight?.description}</p>
                </div>
              </div>
            </Card>

            {/* Selected insights list */}
            <div>
              <p className="text-xs font-semibold text-on-surface-variant mb-3 uppercase tracking-wide">
                {selectedInsightIds.length} Insight sẽ được tạo
              </p>
              <div className="flex flex-col gap-2">
                {selectedInsightIds.map((idx) => {
                  const ins = generatedInsights[idx];
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-[--radius-md] bg-surface-container-low">
                      <span className="text-lg">{ins.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-on-surface">{ins.name}</p>
                        <p className="text-xs text-on-surface-variant truncate">{ins.description}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface-variant">
                        {ins.columns?.length || 0} cột
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Business summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-[--radius-md] bg-surface-container-low">
                <p className="text-[10px] font-semibold text-on-surface-variant uppercase mb-1">Doanh nghiệp</p>
                <p className="text-sm font-medium text-on-surface">{businessData.businessName}</p>
              </div>
              <div className="p-3 rounded-[--radius-md] bg-surface-container-low">
                <p className="text-[10px] font-semibold text-on-surface-variant uppercase mb-1">Ngành hàng</p>
                <p className="text-sm font-medium text-on-surface">{businessData.industryLabel || businessData.industry}</p>
              </div>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        {step > 0 && !generating && (
          <Button variant="ghost" onClick={() => setStep(step - 1)} className="gap-1.5">
            <ChevronLeft size={14} />
            Quay lại
          </Button>
        )}
        <div className="flex-1" />
        <Button variant="ghost" onClick={handleClose}>Hủy</Button>

        {/* Step 0: Generate */}
        {step === 0 && (
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={!canNext0 || generating}
          >
            {generating ? (
              <><Loader2 size={14} className="animate-spin" /> Đang tạo...</>
            ) : (
              <><Sparkles size={14} /> Tạo Insight bằng AI</>
            )}
          </Button>
        )}

        {/* Step 1: Next to confirm */}
        {step === 1 && !generating && !aiError && (
          <Button
            variant="primary"
            onClick={() => setStep(2)}
            disabled={selectedInsightIds.length === 0}
          >
            Xác nhận ({selectedInsightIds.length})
            <ChevronRight size={14} />
          </Button>
        )}

        {/* Step 2: Save */}
        {step === 2 && (
          <Button variant="primary" onClick={handleSave}>
            <Sparkles size={14} />
            Tạo {selectedInsightIds.length} Insight
          </Button>
        )}
      </ModalFooter>

      {/* Master edit modal */}
      {editingMaster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-[--radius-xl] shadow-modal w-full max-w-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-on-surface">Sửa Master Insight</h3>
              <button onClick={() => setEditingMaster(false)} className="p-2 rounded hover:bg-surface-container-low cursor-pointer text-on-surface-variant">
                <X size={16} />
              </button>
            </div>
            <MasterInsightEdit
              data={masterInsight}
              onChange={setMasterInsight}
              onClose={() => setEditingMaster(false)}
            />
          </div>
        </div>
      )}

      {/* Insight edit modal (overlay version) */}
      {editingInsightIndex !== null && (
        <InsightEditModal
          insight={generatedInsights[editingInsightIndex]}
          onSave={(updated) => handleSaveEdit(editingInsightIndex, updated)}
          onClose={() => setEditingInsightIndex(null)}
        />
      )}
    </Modal>
  );
}

// ─── Master Insight Edit ─────────────────────────────────────────────────────
function MasterInsightEdit({ data, onChange, onClose }) {
  const [local, setLocal] = useState(data);

  const addFocus = () => setLocal({ ...local, focusAreas: [...(local.focusAreas || []), ''] });
  const removeFocus = (i) => setLocal({ ...local, focusAreas: local.focusAreas.filter((_, idx) => idx !== i) });
  const updateFocus = (i, val) => {
    const arr = [...local.focusAreas];
    arr[i] = val;
    setLocal({ ...local, focusAreas: arr });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase">Tên Master Insight</label>
        <input type="text" value={local.name || ''} onChange={(e) => setLocal({ ...local, name: e.target.value })}
          className="w-full bg-surface-container-low border border-[var(--color-outline-variant)] rounded-[--radius-md] px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase">Mô tả</label>
        <textarea value={local.description || ''} onChange={(e) => setLocal({ ...local, description: e.target.value })}
          rows={3}
          className="w-full bg-surface-container-low border border-[var(--color-outline-variant)] rounded-[--radius-md] px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary resize-none leading-relaxed" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-on-surface-variant uppercase">Focus Areas</label>
          <button onClick={addFocus} className="flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer">
            <Plus size={10} /> Thêm
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          {(local.focusAreas || []).map((area, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={area} onChange={(e) => updateFocus(i, e.target.value)}
                placeholder={`Focus area ${i + 1}`}
                className="flex-1 bg-surface-container-low border border-[var(--color-outline-variant)] rounded-[--radius-sm] px-3 py-1.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary" />
              <button onClick={() => removeFocus(i)} className="p-1 text-error/60 hover:text-error cursor-pointer"><X size={12} /></button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" size="sm" onClick={onClose}>Hủy</Button>
        <Button variant="primary" size="sm" onClick={() => { onChange(local); onClose(); }}>
          <Sparkles size={12} /> Lưu
        </Button>
      </div>
    </div>
  );
}
