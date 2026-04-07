import { useState } from 'react';
import {
  List, LayoutGrid, Download, Trash2,
  ChevronLeft, ChevronRight, AlertTriangle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { RunHistoryTable } from './RunHistoryTable';
import { cn } from '../../lib/utils';

const RESULT_TABS = [
  { value: 'results', label: 'Kết quả đánh giá' },
  { value: 'history', label: 'Lịch sử chạy' },
];

const RESULT_FILTERS = (total) => [
  { label: 'Tất cả', value: 'all', count: total },
  { label: 'Không đạt', value: 'không đạt', count: 20 },
  { label: 'Đạt', value: 'đạt', count: 80 },
  { label: 'Bỏ qua', value: 'bỏ qua', count: 10 },
];

const PAGE_SIZE = 10;

function ResultBadge({ result }) {
  if (result === 'đạt') {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium bg-[#059669]/10 text-[#059669]">
        Đạt
      </span>
    );
  }
  if (result === 'không đạt') {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium bg-[#dc2626]/10 text-[#dc2626]">
        Không đạt
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium bg-surface-container-low text-on-surface-variant">
      Bỏ qua
    </span>
  );
}

function ScoreBar({ score }) {
  const color = score >= 70 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626';
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden flex-1 min-w-[48px]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-xs font-semibold text-on-surface w-7 text-right shrink-0">
        {score}
      </span>
    </div>
  );
}

export function EvaluationResultsTable({ results, runHistory }) {
  const [activeTab, setActiveTab] = useState('results');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list');

  const filters = RESULT_FILTERS(results.length);

  const filtered = activeFilter === 'all'
    ? results
    : results.filter((r) => r.result === activeFilter);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleFilterChange(filter) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex items-center justify-between mb-4">
        <Tabs
          tabs={RESULT_TABS}
          activeTab={activeTab}
          onChange={(val) => { setActiveTab(val); setCurrentPage(1); }}
          className="w-auto"
        />
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-surface-container-low rounded-sm p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded-sm transition-colors cursor-pointer',
                viewMode === 'list'
                  ? 'bg-surface-container-lowest text-on-surface shadow-[0_1px_2px_rgba(44,52,55,0.08)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded-sm transition-colors cursor-pointer',
                viewMode === 'grid'
                  ? 'bg-surface-container-lowest text-on-surface shadow-[0_1px_2px_rgba(44,52,55,0.08)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          {/* Export buttons */}
          <Button variant="primary" size="sm" className="gap-1.5">
            <Download size={13} />
            CSV
          </Button>
          <Button variant="primary" size="sm" className="gap-1.5">
            <Download size={13} />
            Excel
          </Button>
          <Button variant="primary" size="sm" className="gap-1.5">
            <Trash2 size={13} />
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'history' ? (
        <Card className="p-0 overflow-hidden">
          <RunHistoryTable runs={runHistory} />
        </Card>
      ) : (
        <>
          {/* Filter chips */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => handleFilterChange(f.value)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border',
                  activeFilter === f.value
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container-low hover:text-on-surface'
                )}
              >
                {f.label}
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full font-semibold',
                  activeFilter === f.value
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-container-low text-on-surface-variant'
                )}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Table */}
          <Card className="p-0 overflow-hidden">
            {viewMode === 'list' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-on-surface-variant whitespace-nowrap">
                        Tên khách hàng
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-on-surface-variant whitespace-nowrap">
                        Ngày chat
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-on-surface-variant whitespace-nowrap">
                        Kết quả
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-on-surface-variant">
                        Nội dung đánh giá
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-on-surface-variant whitespace-nowrap">
                        Điểm
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-on-surface-variant whitespace-nowrap">
                        Vấn đề
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="font-medium text-on-surface text-sm">{row.name}</span>
                        </td>
                        <td className="py-3 px-4 text-on-surface-variant text-xs whitespace-nowrap">
                          {row.chatDate}
                        </td>
                        <td className="py-3 px-4">
                          <ResultBadge result={row.result} />
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                            {row.evaluation}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <ScoreBar score={row.score} />
                        </td>
                        <td className="py-3 px-4 text-center">
                          {row.issues > 0 ? (
                            <div className="flex items-center justify-center gap-1">
                              <AlertTriangle size={12} className="text-[#d97706]" />
                              <span className="text-xs font-semibold text-[#d97706]">{row.issues}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-on-surface-variant">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Grid view */
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {paginated.map((row) => (
                  <div
                    key={row.id}
                    className="p-4 rounded-md border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm text-on-surface">{row.name}</p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">{row.chatDate}</p>
                      </div>
                      <ResultBadge result={row.result} />
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3 mb-3">
                      {row.evaluation}
                    </p>
                    <div className="flex items-center justify-between">
                      <ScoreBar score={row.score} />
                      {row.issues > 0 && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle size={11} className="text-[#d97706]" />
                          <span className="text-[11px] font-semibold text-[#d97706]">{row.issues} vấn đề</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant">
              <p className="text-xs text-on-surface-variant">
                Hiển thị {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} trong {filtered.length} kết quả
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      'w-7 h-7 rounded-sm text-xs font-medium transition-colors cursor-pointer',
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
