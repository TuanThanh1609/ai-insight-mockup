// =====================================================================
// Mock trend data — Insight Detail → "Xu hướng Insight theo thời gian"
// Two periods: 7 days (Tuần) and 30 days (Tháng)
// =====================================================================

function genWeek(base, key) {
  const jitter = () => Math.round((Math.random() - 0.4) * base * 0.3);
  const baseDate = new Date('2026-03-23');
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - (6 - i));
    return {
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      nong: Math.max(5, base.nong + jitter()),
      am: Math.max(10, base.am + jitter()),
      lang: Math.max(3, base.lang + jitter()),
      daCho: Math.max(1, base.daCho + jitter()),
      chuaCho: Math.max(1, base.chuaCho + jitter()),
      tuChoi: Math.max(0, base.tuChoi + jitter()),
    };
  });
}

function genMonth(base) {
  const jitter = () => Math.round((Math.random() - 0.4) * base.nong * 0.15);
  const baseDate = new Date('2026-03-23');
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - (29 - i));
    return {
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      nong: Math.max(3, base.nong + jitter()),
      am: Math.max(8, base.am + jitter()),
      lang: Math.max(2, base.lang + jitter()),
      daCho: Math.max(1, base.daCho + jitter()),
      chuaCho: Math.max(1, base.chuaCho + jitter()),
      tuChoi: Math.max(0, base.tuChoi + jitter()),
    };
  });
}

export const mockInsightTrend = {
  'fsh-1': {
    label: 'Phân tích Nhu Cầu KH',
    metrics: [
      { key: 'nong', label: 'Nóng', color: '#ef4444' },
      { key: 'am', label: 'Ấm', color: '#f59e0b' },
      { key: 'lang', label: 'Lạnh', color: '#3b82f6' },
    ],
    week: genWeek({ nong: 58, am: 124, lang: 52 }, 'nong'),
    month: genMonth({ nong: 58, am: 124, lang: 52 }),
  },
  'fsh-2': {
    label: 'Đánh Giá Chất Lượng Lead',
    metrics: [
      { key: 'daCho', label: 'Đã cho SĐT', color: '#10b981' },
      { key: 'chuaCho', label: 'Chưa cho', color: '#6b7280' },
      { key: 'tuChoi', label: 'Từ chối', color: '#ef4444' },
    ],
    week: genWeek({ nong: 51, am: 83, lang: 22 }, 'daCho'),
    month: genMonth({ nong: 51, am: 83, lang: 22 }),
  },
  'fsh-3': {
    label: 'Đánh Giá Nhân Viên',
    metrics: [
      { key: 'tot', label: 'Tốt', color: '#10b981' },
      { key: 'tb', label: 'Trung bình', color: '#f59e0b' },
      { key: 'kem', label: 'Kém', color: '#ef4444' },
    ],
    week: genWeek({ nong: 268, am: 112, lang: 32 }, 'tot'),
    month: genMonth({ nong: 268, am: 112, lang: 32 }),
  },
  'fsh-4': {
    label: 'Chân Dung Khách Hàng',
    metrics: [
      { key: 'nong', label: 'Nữ', color: '#ec4899' },
      { key: 'am', label: 'Nam', color: '#3b82f6' },
      { key: 'lang', label: 'Không rõ', color: '#94a3b8' },
    ],
    week: genWeek({ nong: 148, am: 42, lang: 8 }, 'nong'),
    month: genMonth({ nong: 148, am: 42, lang: 8 }),
  },
  'fsh-5': {
    label: 'Phân Tích Đối Thủ',
    metrics: [
      { key: 'nong', label: 'Có nhắc đối thủ', color: '#ef4444' },
      { key: 'am', label: 'Không nhắc', color: '#10b981' },
    ],
    week: genWeek({ nong: 79, am: 188, lang: 0 }, 'nong'),
    month: genMonth({ nong: 79, am: 188, lang: 0 }),
  },
  'fsh-6': {
    label: 'Phân Tích Hậu Mua',
    metrics: [
      { key: 'nong', label: 'Hỏi đơn hàng', color: '#3b82f6' },
      { key: 'am', label: 'Đổi/Trả', color: '#f59e0b' },
      { key: 'lang', label: 'Khác', color: '#94a3b8' },
    ],
    week: genWeek({ nong: 62, am: 28, lang: 13 }, 'nong'),
    month: genMonth({ nong: 62, am: 28, lang: 13 }),
  },
};
