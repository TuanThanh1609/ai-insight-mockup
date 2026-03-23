// =====================================================================
// Mock trend data — Insight Detail → "Xu hướng Insight theo thời gian"
// Two periods: 7 days (Tuần) and 30 days (Tháng)
// All trend entries share the same full data shape; chart only renders keys
// that match the current insight's metrics.
// =====================================================================

const BASE_DATE = new Date('2026-03-23');

function jitter(base, range) {
  return Math.round((Math.random() - 0.4) * base * range);
}

function genSeries(base, days, range) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(BASE_DATE);
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      // shared keys
      nong: Math.max(3, base.nong + jitter(base.nong, range)),
      am: Math.max(5, base.am + jitter(base.am, range)),
      lang: Math.max(1, base.lang + jitter(base.lang, range)),
      daCho: Math.max(1, base.daCho + jitter(base.daCho, range)),
      chuaCho: Math.max(1, base.chuaCho + jitter(base.chuaCho, range)),
      tuChoi: Math.max(0, base.tuChoi + jitter(base.tuChoi, range)),
      // attitude keys
      tot: Math.max(5, base.tot + jitter(base.tot, range)),
      tb: Math.max(2, base.tb + jitter(base.tb, range)),
      kem: Math.max(0, base.kem + jitter(base.kem, range)),
    };
  });
}

export const mockInsightTrend = {
  'fsh-1': {
    label: 'Phân tích Nhu Cầu KH',
    metrics: [
      { key: 'nong', label: 'Nóng',       color: '#ef4444' },
      { key: 'am',   label: 'Ấm',         color: '#f59e0b' },
      { key: 'lang', label: 'Lạnh',       color: '#3b82f6' },
    ],
    week:  genSeries({ nong: 58, am: 124, lang: 52, daCho: 0, chuaCho: 0, tuChoi: 0, tot: 0, tb: 0, kem: 0 }, 7, 0.30),
    month: genSeries({ nong: 58, am: 124, lang: 52, daCho: 0, chuaCho: 0, tuChoi: 0, tot: 0, tb: 0, kem: 0 }, 30, 0.12),
  },
  'fsh-2': {
    label: 'Đánh Giá Chất Lượng Lead',
    metrics: [
      { key: 'daCho',   label: 'Đã cho SĐT', color: '#10b981' },
      { key: 'chuaCho', label: 'Chưa cho',    color: '#6b7280' },
      { key: 'tuChoi', label: 'Từ chối',    color: '#ef4444' },
    ],
    week:  genSeries({ nong: 0, am: 0, lang: 0, daCho: 51, chuaCho: 83, tuChoi: 22, tot: 0, tb: 0, kem: 0 }, 7, 0.30),
    month: genSeries({ nong: 0, am: 0, lang: 0, daCho: 51, chuaCho: 83, tuChoi: 22, tot: 0, tb: 0, kem: 0 }, 30, 0.12),
  },
  'fsh-3': {
    label: 'Đánh Giá Nhân Viên',
    metrics: [
      { key: 'tot', label: 'Tốt',         color: '#10b981' },
      { key: 'tb',  label: 'Trung bình', color: '#f59e0b' },
      { key: 'kem', label: 'Kém',        color: '#ef4444' },
    ],
    week:  genSeries({ nong: 0, am: 0, lang: 0, daCho: 0, chuaCho: 0, tuChoi: 0, tot: 268, tb: 112, kem: 32 }, 7, 0.30),
    month: genSeries({ nong: 0, am: 0, lang: 0, daCho: 0, chuaCho: 0, tuChoi: 0, tot: 268, tb: 112, kem: 32 }, 30, 0.12),
  },
  'fsh-4': {
    label: 'Chân Dung Khách Hàng',
    metrics: [
      { key: 'nong', label: 'Nữ',        color: '#ec4899' },
      { key: 'am',   label: 'Nam',       color: '#3b82f6' },
      { key: 'lang', label: 'Không rõ',  color: '#94a3b8' },
    ],
    week:  genSeries({ nong: 148, am: 42, lang: 8, daCho: 0, chuaCho: 0, tuChoi: 0, tot: 0, tb: 0, kem: 0 }, 7, 0.30),
    month: genSeries({ nong: 148, am: 42, lang: 8, daCho: 0, chuaCho: 0, tuChoi: 0, tot: 0, tb: 0, kem: 0 }, 30, 0.12),
  },
  'fsh-5': {
    label: 'Phân Tích Đối Thủ',
    metrics: [
      { key: 'nong', label: 'Có nhắc đối thủ', color: '#ef4444' },
      { key: 'am',   label: 'Không nhắc',        color: '#10b981' },
    ],
    week:  genSeries({ nong: 79, am: 188, lang: 0, daCho: 0, chuaCho: 0, tuChoi: 0, tot: 0, tb: 0, kem: 0 }, 7, 0.30),
    month: genSeries({ nong: 79, am: 188, lang: 0, daCho: 0, chuaCho: 0, tuChoi: 0, tot: 0, tb: 0, kem: 0 }, 30, 0.12),
  },
  'fsh-6': {
    label: 'Phân Tích Hậu Mua',
    metrics: [
      { key: 'nong', label: 'Hỏi đơn hàng', color: '#3b82f6' },
      { key: 'am',   label: 'Đổi/Trả',       color: '#f59e0b' },
      { key: 'lang', label: 'Khác',           color: '#94a3b8' },
    ],
    week:  genSeries({ nong: 62, am: 28, lang: 13, daCho: 0, chuaCho: 0, tuChoi: 0, tot: 0, tb: 0, kem: 0 }, 7, 0.30),
    month: genSeries({ nong: 62, am: 28, lang: 13, daCho: 0, chuaCho: 0, tuChoi: 0, tot: 0, tb: 0, kem: 0 }, 30, 0.12),
  },
};
