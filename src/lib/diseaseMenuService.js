/**
 * diseaseMenuService.js
 *
 * Lưu trữ và đọc lựa chọn hạng mục khám bệnh của user trong localStorage.
 * Key: smax_disease_menu_{track}
 * Value: JSON array of disease IDs
 */

const KEYS = {
  conversation: 'smax_disease_menu_conversation',
  ads: 'smax_disease_menu_ads',
};

function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Đọc lựa chọn hạng mục đã lưu.
 * @param {'conversation'|'ads'} track
 * @returns {string[]|null} Mảng disease IDs hoặc null nếu chưa lưu
 */
export function getSelectedDiseases(track) {
  const key = KEYS[track];
  if (!key) return null;
  const raw = safeGetItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Lưu lựa chọn hạng mục vào localStorage.
 * @param {'conversation'|'ads'} track
 * @param {string[]} selectedIds Mảng disease IDs đã chọn
 */
export function saveSelectedDiseases(track, selectedIds) {
  const key = KEYS[track];
  if (!key) return;
  safeSetItem(key, JSON.stringify(selectedIds));
}

/**
 * Xóa lựa chọn đã lưu (reset).
 * @param {'conversation'|'ads'} track
 */
export function clearSelectedDiseases(track) {
  const key = KEYS[track];
  if (!key) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
