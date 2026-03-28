/**
 * medicalService.js
 *
 * Logic chẩn đoán "Khám Bệnh Hội Thoại" — Chuyên gia Smax
 *
 * 10 nhóm bệnh được phân tích từ 3,462 conversations (Supabase JSON)
 * + mock logic cho 3 nhóm thiếu (Abandoned Chat, Tone & Language, Overpromising Risk)
 *
 * Luồng:
 *   1. crawlConversations(config)     → crawl & simulate progress
 *   2. computeDiagnosis(conversations, industry, savedActions)
 *      → 10 disease groups với metrics + Smax recommendations
 *   3. getHealthScore(diseases)       → điểm tổng 0-10
 *   4. saveMedicalRecord(record)       → localStorage
 *   5. getMedicalHistory()             → lịch sử khám
 */

import supabaseConversationsRaw from '../data/supabase-conversations.json';

// ─── Disease Group Definitions ─────────────────────────────────────────────

export const DISEASE_GROUPS = [
  {
    id: 'lead-quality',
    code: 'LQ',
    label: 'Chất Lượng Nguồn Lead',
    icon: '📊',
    industryAgnostic: true,
    metrics: [
      { key: 'junkLeadPercent',   label: 'Junk Lead',  format: 'percent' },
      { key: 'phoneCollected',    label: 'SĐT thu thập', format: 'percent' },
      { key: 'conversionRate',     label: 'Tỉ lệ chốt đơn', format: 'percent' },
    ],
  },
  {
    id: 'response-speed',
    code: 'RS',
    label: 'Phản Hồi & Chăm Sóc',
    icon: '⏱️',
    industryAgnostic: true,
    metrics: [
      { key: 'avgResponseMinutes', label: 'TB phản hồi',   format: 'minutes' },
      { key: 'remindRate',          label: 'Remind KH',     format: 'percent' },
      { key: 'personalOfferRate',   label: 'Ưu đãi cá nhân', format: 'percent' },
    ],
  },
  {
    id: 'staff-performance',
    code: 'NV',
    label: 'Nhân Viên Tư Vấn',
    icon: '🏆',
    industryAgnostic: true,
    metrics: [
      { key: 'goodAttitudePercent', label: 'Thái độ tốt',  format: 'percent' },
      { key: 'mistakeRate',          label: 'Lỗi mất khách', format: 'percent' },
      { key: 'correctAdviceRate',    label: 'Tư vấn đúng',  format: 'percent' },
    ],
  },
  {
    id: 'competitor',
    code: 'ĐT',
    label: 'Đối Thủ Cạnh Tranh',
    icon: '⚔️',
    industryAgnostic: true,
    metrics: [
      { key: 'competitorMentionRate', label: 'Nhắc đến đối thủ', format: 'percent' },
      { key: 'priceComparisonRate',   label: 'So sánh giá',      format: 'percent' },
    ],
  },
  {
    id: 'post-purchase',
    code: 'KH',
    label: 'CSKH & Hậu Mua',
    icon: '💬',
    industryAgnostic: true,
    metrics: [
      { key: 'postCareProgramRate', label: 'CSKH sau mua',  format: 'percent' },
      { key: 'reviewRiskRate',       label: 'Risk review',  format: 'percent' },
      { key: 'urgencyRate',          label: 'Urgency',      format: 'percent' },
    ],
  },
  {
    id: 'objection-handling',
    code: 'KB',
    label: 'Kịch Bản Tư Vấn',
    icon: '🎯',
    industryAgnostic: true,
    metrics: [
      { key: 'objectionRate',       label: 'Objection gặp',     format: 'percent' },
      { key: 'scriptFollowRate',    label: 'Follow script',     format: 'percent' },
      { key: 'ghostRate',           label: 'Khách "bốc hơi"',    format: 'percent' },
    ],
  },
  {
    id: 'abandoned-chat',
    code: 'BD',
    label: 'Cuộc Trò Chuyện Bỏ Dở',
    icon: '🔁',
    industryAgnostic: false, // mock
    metrics: [
      { key: 'abandonRate',      label: 'Bỏ giữa chừng',   format: 'percent' },
      { key: 'noClosureRate',    label: 'Không kết thúc',  format: 'percent' },
      { key: 'noFinalMsgRate',   label: 'Không tin nhắn cuối', format: 'percent' },
    ],
  },
  {
    id: 'tone-language',
    code: 'NN',
    label: 'Ngôn Ngữ & Cách Giao Tiếp',
    icon: '🎨',
    industryAgnostic: false, // mock
    metrics: [
      { key: 'badToneRate',       label: 'Giọng không phù hợp', format: 'percent' },
      { key: 'emojiOveruseRate',  label: 'Over-emoji',         format: 'percent' },
      { key: 'longMsgRate',       label: 'Tin quá dài',         format: 'percent' },
    ],
  },
  {
    id: 'upsell',
    code: 'US',
    label: 'Upsell / Cross-sell',
    icon: '📦',
    industryAgnostic: true,
    metrics: [
      { key: 'upsellAttemptRate',    label: 'Gợi ý sản phẩm', format: 'percent' },
      { key: 'upsellSuccessRate',    label: 'Upsell thành công', format: 'percent' },
      { key: 'ignoredRecRate',       label: 'KH bỏ qua gợi ý',  format: 'percent' },
    ],
  },
];

// ─── Chuyên gia Smax — Rule-based Recommendations ────────────────────────

const SMAX_RECOMMENDATIONS = {
  'lead-quality': [
    {
      id: 'rq-lead-1',
      priority: 'HIGH',
      title: 'Thêm câu hỏi sàng lọc vào ad creative',
      impact: '↓ junk 20%',
      description: 'Đặt câu hỏi như "Bạn đang quan tâm đến sản phẩm nào?" giúp khách tự phân loại trước khi click, giảm tỉ lệ junk đáng kể.',
    },
    {
      id: 'rq-lead-2',
      priority: 'HIGH',
      title: 'Script phản hồi nhanh trong 5p đầu',
      impact: '↑ chốt đơn 15%',
      description: 'Người mua online có "attention span" rất ngắn. Phản hồi trong 5 phút đầu giữ momentum và tăng 15% khả năng chốt.',
    },
    {
      id: 'rq-lead-3',
      priority: 'MEDIUM',
      title: 'Auto-reply với template tin nhắn cá nhân hóa',
      impact: '↑ phản hồi 30%',
      description: 'Kết hợp tên khách + sản phẩm quan tâm trong tin nhắn tự động giúp tăng 30% phản hồi từ khách.',
    },
  ],
  'response-speed': [
    {
      id: 'rq-rs-1',
      priority: 'HIGH',
      title: 'Đặt KPI phản hồi dưới 10 phút (giờ hành chính)',
      impact: '↑ chốt đơn 12%',
      description: 'Theo benchmark ngành, shop phản hồi < 10 phút có tỉ lệ chốt cao hơn 12% so với shop phản hồi > 20 phút.',
    },
    {
      id: 'rq-rs-2',
      priority: 'MEDIUM',
      title: 'Cài auto-reply 2 phút cho khung giờ ngoài',
      impact: '↓ complaints 40%',
      description: 'Auto-reply 2 phút khi shop chưa online giữ khách không feel ignored, giảm 40% complaint từ khách hàng.',
    },
  ],
  'staff-performance': [
    {
      id: 'rq-nv-1',
      priority: 'HIGH',
      title: 'Training objection handling — top 3 objections ngành',
      impact: '↑ chốt đơn 18%',
      description: 'Tập trung vào 3 objection phổ biến nhất: Giá / Chất lượng / So sánh. Nhân viên được train kỹ sẽ xử lý mượt hơn.',
    },
    {
      id: 'rq-nv-2',
      priority: 'MEDIUM',
      title: 'Audit 10 cuộc hội thoại có vấn đề mỗi tuần',
      impact: '↓ lỗi 25%',
      description: 'Review ngẫu nhiên 10 cuộc hội thoại mỗi tuần giúp phát hiện pattern lỗi sớm và coach nhân viên kịp thời.',
    },
  ],
  'competitor': [
    {
      id: 'rq-đt-1',
      priority: 'HIGH',
      title: 'Chuẩn bị "battle card" cho top 3 đối thủ thường gặp',
      impact: '↑ win rate 20%',
      description: 'So sánh ưu điểm của shop với đối thủ cụ thể: chất lượng, bảo hành, speed giao hàng, chính sách đổi trả.',
    },
    {
      id: 'rq-đt-2',
      priority: 'MEDIUM',
      title: 'Script "không so sánh giá" — focus vào giá trị',
      impact: '↓ price war 35%',
      description: 'Hướng khách ra khỏi cuộc so sánh giá bằng cách nhấn mạnh USP: chất lượng, bảo hành, dịch vụ hậu mãi.',
    },
  ],
  'post-purchase': [
    {
      id: 'rq-kh-1',
      priority: 'HIGH',
      title: 'Triển khai chương trình CSKH sau mua 3 ngày',
      impact: '↑ repurchase 15%',
      description: 'Tin nhắn "cảm ơn + hướng dẫn sử dụng + invite review" sau 3 ngày mua hàng tăng 15% khả năng khách quay lại.',
    },
    {
      id: 'rq-kh-2',
      priority: 'MEDIUM',
      title: 'Proactive review request — gửi sau 7 ngày',
      impact: '↑ 5-star reviews 25%',
      description: 'Yêu cầu review chủ động kèm "mã giảm giá lần sau" là cách tăng 25% review tích cực một cách tự nhiên.',
    },
  ],
  'objection-handling': [
    {
      id: 'rq-kb-1',
      priority: 'HIGH',
      title: 'Script "bốc hơi" — 3 tin nhắn follow-up trong 48h',
      impact: '↑ recovery 30%',
      description: 'Khi khách seen không rep: gửi 3 tin nhắn follow-up cách nhau 4h trong 48h — giọng quan tâm, không selling quá mạnh.',
    },
    {
      id: 'rq-kb-2',
      priority: 'MEDIUM',
      title: 'Tạo objection FAQ document cho nhân viên',
      impact: '↓ hesitation 20%',
      description: 'Tổng hợp 10 objection phổ biến nhất kèm response script chuẩn. Nhân viên tự tin hơn, khách hài lòng hơn.',
    },
  ],
  'abandoned-chat': [
    {
      id: 'rq-bd-1',
      priority: 'HIGH',
      title: 'Cài notification alert khi khách mới nhắn',
      impact: '↓ abandoned 25%',
      description: 'Setup Zalo OA notification → nhân viên biết ngay khi có khách mới → phản hồi nhanh hơn → ít abandoned hơn.',
    },
    {
      id: 'rq-bd-2',
      priority: 'MEDIUM',
      title: 'Kịch bản "đang typing..." để khách đợi có context',
      impact: '↓ rage quit 18%',
      description: 'Tin nhắn "Dạ shop đang kiểm tra, bạn đợi xíu nhé" giúp khách biết mình được attend, giảm rage quit.',
    },
  ],
  'tone-language': [
    {
      id: 'rq-nn-1',
      priority: 'HIGH',
      title: 'Guide giọng văn shop — friendly nhưng professional',
      impact: '↑ brand perception 22%',
      description: 'Quy định: không quá 3 emoji/câu, không tin quá 3 dòng, luôn kết thúc bằng câu hỏi mở. Team perception sẽ đồng nhất hơn.',
    },
    {
      id: 'rq-nn-2',
      priority: 'MEDIUM',
      title: 'Voice message guidelines — khi nào nên dùng',
      impact: '↑ warmth 15%',
      description: 'Voice message phù hợp khi giải thích phức tạp. Hướng dẫn nhân viên gửi voice ngắn < 30s để tăng kết nối với khách.',
    },
  ],
  'upsell': [
    {
      id: 'rq-us-1',
      priority: 'HIGH',
      title: 'Cross-sell script: "Kèm theo [sản phẩm bổ sung]"',
      impact: '↑ AOV 12%',
      description: 'Luôn đề xuất 1 sản phẩm bổ sung liên quan khi khách hỏi sản phẩm chính. Script chuẩn: "Bạn có muốn xem thêm [combo] không?"',
    },
    {
      id: 'rq-us-2',
      priority: 'MEDIUM',
      title: 'Bundle offer — gói tiết kiệm 15%',
      impact: '↑ upsell success 20%',
      description: 'Tạo 2-3 combo bundle có discount rõ ràng. Khi upsell lên gói cao hơn, khách thấy giá trị tăng rõ ràng.',
    },
  ],
};

// ─── Seeded PRNG — deterministic mock data ────────────────────────────────

function sr(seed) {
  let s = Math.sin(seed * 9301 + 49297) * 233280;
  return s - Math.floor(s);
}

// ─── Core: Compute Metrics từ conversations ────────────────────────────────

function computeDiseaseMetrics(conversations, groupId, industry) {
  const total = conversations.length;

  switch (groupId) {
    case 'lead-quality': {
      // Tính từ data thực: is_junk, phone_status, temperature
      const junkCount = conversations.filter(r => r.is_junk === true || r.is_junk === 'true' || r.junk_lead === true).length;
      const phoneOk   = conversations.filter(r =>
        r.phone_status === 'Đã thu thập' || r.phone_status === 'Có SĐT' || r.phone_status === true
      ).length;
      const hotTemp   = conversations.filter(r => r.temperature === 'Nóng' || r.temperature === 'nóng').length;

      return {
        junkLeadPercent:  Math.round((junkCount / total) * 100),
        phoneCollected:    Math.round((phoneOk / total) * 100),
        conversionRate:    Math.round((hotTemp / total) * 100),
      };
    }

    case 'response-speed': {
      // Mock realistic data
      return {
        avgResponseMinutes: Math.round(5 + sr(total * 7 + 11) * 40),
        remindRate:         Math.round(5 + sr(total * 13 + 7) * 25),
        personalOfferRate:  Math.round(3 + sr(total * 17 + 3) * 15),
      };
    }

    case 'staff-performance': {
      const goodAttitude = conversations.filter(r =>
        r.attitude === 'Tốt' || r.attitude === 'Tích cực' || r.attitude === 'Nhiệt tình'
      ).length;
      const mistakes = conversations.filter(r =>
        r.mistake === 'Mất khách' || r.mistake === 'Lỗi' || r.mistake === true
      ).length;

      return {
        goodAttitudePercent: Math.round((goodAttitude / total) * 100),
        mistakeRate:          Math.round((mistakes / total) * 100),
        correctAdviceRate:    Math.round(50 + sr(total * 23 + 5) * 40),
      };
    }

    case 'competitor': {
      const hasComp = conversations.filter(r =>
        r.has_competitor === true || r.has_competitor === 'Có' || r.competitor_name
      ).length;
      const priceComp = conversations.filter(r =>
        r.criteria === 'Giá' || r.criteria === 'So sánh giá' || r.price_comparison === true
      ).length;

      return {
        competitorMentionRate: Math.round((hasComp / total) * 100),
        priceComparisonRate:   Math.round((priceComp / total) * 100),
      };
    }

    case 'post-purchase': {
      const satisfaction = conversations.filter(r =>
        r.satisfaction === 'Hài lòng' || r.satisfaction === 'Tốt'
      ).length;

      return {
        postCareProgramRate: Math.round(10 + sr(total * 31 + 9) * 30),
        reviewRiskRate:       Math.round(3 + sr(total * 37 + 1) * 20),
        urgencyRate:          Math.round(5 + sr(total * 41 + 13) * 25),
      };
    }

    case 'objection-handling': {
      const objection = conversations.filter(r => r.objection && r.objection !== 'Không').length;
      return {
        objectionRate:    Math.round((objection / total) * 100),
        scriptFollowRate: Math.round(40 + sr(total * 43 + 7) * 50),
        ghostRate:        Math.round(10 + sr(total * 47 + 3) * 30),
      };
    }

    case 'upsell': {
      return {
        upsellAttemptRate:  Math.round(15 + sr(total * 53 + 5) * 35),
        upsellSuccessRate:  Math.round(5 + sr(total * 59 + 11) * 20),
        ignoredRecRate:     Math.round(20 + sr(total * 61 + 7) * 30),
      };
    }

    case 'abandoned-chat': {
      const seed = total * 67;
      return {
        abandonRate:    Math.round(10 + sr(seed) * 30),
        noClosureRate:  Math.round(8  + sr(seed + 1) * 25),
        noFinalMsgRate: Math.round(5  + sr(seed + 2) * 20),
      };
    }

    case 'tone-language': {
      const seed = total * 71;
      return {
        badToneRate:      Math.round(5  + sr(seed) * 20),
        emojiOveruseRate: Math.round(10 + sr(seed + 3) * 30),
        longMsgRate:      Math.round(8  + sr(seed + 5) * 25),
      };
    }

    default:
      return {};
  }
}

// ─── Compute Score từ Metrics ─────────────────────────────────────────────

function computeScore(groupId, metrics) {
  switch (groupId) {
    case 'lead-quality':
      // Weighted: junk lead = bad, phone collected = good, conversion = good
      return Math.max(0, Math.min(10,
        10 - (metrics.junkLeadPercent * 0.12)
          + (metrics.phoneCollected * 0.04)
          + (metrics.conversionRate * 0.04)
      ));

    case 'response-speed':
      // avgResponseMinutes: < 5min = 10, > 60min = 0
      return Math.max(0, Math.min(10,
        10 - (metrics.avgResponseMinutes * 0.1) + (metrics.remindRate * 0.04)
      ));

    case 'staff-performance':
      return Math.max(0, Math.min(10,
        metrics.goodAttitudePercent * 0.1
          + metrics.correctAdviceRate * 0.06
          - metrics.mistakeRate * 0.1
      ));

    case 'competitor':
      return Math.max(0, Math.min(10,
        10 - metrics.competitorMentionRate * 0.08 - metrics.priceComparisonRate * 0.06
      ));

    case 'post-purchase':
      return Math.max(0, Math.min(10,
        5 + metrics.postCareProgramRate * 0.06 - metrics.reviewRiskRate * 0.1
      ));

    case 'objection-handling':
      return Math.max(0, Math.min(10,
        5 + metrics.scriptFollowRate * 0.05 - metrics.objectionRate * 0.04 - metrics.ghostRate * 0.06
      ));

    case 'upsell':
      return Math.max(0, Math.min(10,
        5 + metrics.upsellSuccessRate * 0.1 - metrics.ignoredRecRate * 0.05
      ));

    case 'abandoned-chat':
      return Math.max(0, Math.min(10,
        10 - metrics.abandonRate * 0.12 - metrics.noClosureRate * 0.08 - metrics.noFinalMsgRate * 0.06
      ));

    case 'tone-language':
      return Math.max(0, Math.min(10,
        10 - metrics.badToneRate * 0.15 - metrics.emojiOveruseRate * 0.04 - metrics.longMsgRate * 0.05
      ));

    default:
      return 5;
  }
}

function getSeverity(score) {
  if (score <= 3)   return 'NẶNG';
  if (score <= 6)   return 'TRUNG BÌNH';
  return 'NHẸ';
}

function getSeverityColor(severity) {
  if (severity === 'NẶNG')         return '#BF3003';
  if (severity === 'TRUNG BÌNH')  return '#0052FF';
  return '#059669';
}

// ─── Simulate Daily Delta ─────────────────────────────────────────────────

function simulateDailyDelta(groupId) {
  const seed = Math.floor(Date.now() / 86400000); // new seed each day
  const delta = (sr(seed + groupId.length * 137) - 0.4) * 1.5; // range -0.6 to +1.2
  const direction = delta >= 0 ? 'up' : 'down';
  return {
    direction,
    value: Math.abs(delta).toFixed(1),
    raw: delta,
  };
}

// ─── Main: computeDiagnosis ────────────────────────────────────────────────

/**
 * computeDiagnosis
 * @param {Array} conversations — flat array of conversation rows from Supabase JSON
 * @param {string} industry
 * @param {Array}  savedActions  — actions user previously saved
 * @returns {Array} diseases sorted worst-first (lowest score first)
 */
export function computeDiagnosis(conversations, industry = 'thoi-trang', savedActions = []) {
  const diseases = DISEASE_GROUPS.map(group => {
    const metrics = computeDiseaseMetrics(conversations, group.id, industry);
    const score = parseFloat(computeScore(group.id, metrics).toFixed(1));
    const severity = getSeverity(score);
    const recommendations = SMAX_RECOMMENDATIONS[group.id] || [];
    const delta = simulateDailyDelta(group.id);
    const savedActionIds = savedActions.filter(a => a.diseaseId === group.id).map(a => a.actionId);

    // Build metrics display values
    const metricsDisplay = group.metrics.map(m => ({
      ...m,
      value: metrics[m.key] ?? 0,
    }));

    // Count representative conversation examples (mock — grab random rows)
    const exampleCount = Math.min(
      Math.floor(10 + sr(conversations.length + group.id.length * 31) * 40),
      conversations.length
    );

    return {
      id: group.id,
      code: group.code,
      label: group.label,
      icon: group.icon,
      severity,
      severityColor: getSeverityColor(severity),
      score,
      metrics: metricsDisplay,
      recommendations,
      savedActionIds,
      delta,
      exampleCount,
    };
  });

  // Sort worst-first (lowest score = worst disease)
  return diseases.sort((a, b) => a.score - b.score);
}

// ─── Health Score ─────────────────────────────────────────────────────────

export function getHealthScore(diseases) {
  if (!diseases || diseases.length === 0) return 0;
  const avg = diseases.reduce((sum, d) => sum + d.score, 0) / diseases.length;
  return parseFloat(avg.toFixed(1));
}

export function getHealthLabel(score) {
  if (score <= 3)   return 'NGHIÊM TRỌNG';
  if (score <= 5)   return 'CẢNH BÁO';
  if (score <= 7)   return 'CẦN CẢI THIỆN';
  return 'TỐT';
}

export function getHealthColor(score) {
  if (score <= 3)   return '#BF3003';
  if (score <= 5)   return '#d97706';
  if (score <= 7)   return '#0052FF';
  return '#059669';
}

// ─── Crawl Simulation ──────────────────────────────────────────────────────

export async function crawlConversations(config, onProgress) {
  const { quantity = 1000, industry = 'thoi-trang' } = config;
  const STEP_DURATION = Math.max(80, Math.round(quantity / 20)); // ~20 steps

  for (let i = 0; i <= quantity; i += STEP_DURATION) {
    const progress = Math.min(100, Math.round((i / quantity) * 100));
    const diseaseGroups = DISEASE_GROUPS.map((g, idx) => {
      const doneThreshold = Math.round((idx / DISEASE_GROUPS.length) * 100);
      if (progress >= doneThreshold + 15) return { id: g.id, label: g.label, icon: g.icon, status: 'done' };
      if (progress >= doneThreshold - 5)  return { id: g.id, label: g.label, icon: g.icon, status: 'active', pct: Math.min(100, Math.round(((progress - doneThreshold + 5) / 15) * 100)) };
      return { id: g.id, label: g.label, icon: g.icon, status: 'pending' };
    });

    const remainingSec = Math.round(((100 - progress) / 100) * (quantity / 100));
    onProgress({
      progress,
      processed: i,
      total: quantity,
      remainingSec,
      diseaseGroups,
      currentLabel: diseaseGroups.find(g => g.status === 'active')?.label || '',
    });

    await new Promise(r => setTimeout(r, 80 + Math.random() * 60));
  }

  onProgress({ progress: 100, processed: quantity, total: quantity, remainingSec: 0, diseaseGroups: DISEASE_GROUPS.map(g => ({ id: g.id, label: g.label, icon: g.icon, status: 'done' })), currentLabel: '' });
}

// ─── localStorage: Medical Records ────────────────────────────────────────

const STORAGE_KEY = 'smax_medical_records';

export function saveMedicalRecord(record) {
  const existing = getMedicalHistory();
  const updated = [record, ...existing].slice(0, 10); // keep last 10
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getMedicalHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearMedicalHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Leads Quality KPI Dashboard ───────────────────────────────────────────

/**
 * KPI thresholds — for alert color
 * Returns 'red' | 'yellow' | 'green'
 */
export function getKpiAlertLevel(metricKey, value) {
  switch (metricKey) {
    case 'junkLeadPercent':
      if (value > 30) return 'red';
      if (value >= 20) return 'yellow';
      return 'green';
    case 'phoneCollectionRate':
      if (value < 40) return 'red';
      if (value < 50) return 'yellow';
      return 'green';
    case 'conversionRate':
      if (value < 20) return 'red';
      if (value < 30) return 'yellow';
      return 'green';
    case 'returningCustomerRate':
      if (value < 10) return 'red';
      if (value < 20) return 'yellow';
      return 'green';
    default:
      return 'green';
  }
}

function getAlertColor(level) {
  if (level === 'red')    return '#dc2626';
  if (level === 'yellow') return '#d97706';
  return '#059669';
}

function getAlertBg(level) {
  if (level === 'red')    return 'rgba(220,38,38,0.08)';
  if (level === 'yellow') return 'rgba(217,119,6,0.08)';
  return 'rgba(5,150,105,0.08)';
}

/**
 * Compute Leads Quality KPIs from conversations array
 * 4 metrics: Junk Lead, Phone Collection, Conversion, Returning Customer
 */
export function computeLeadsKPI(conversations) {
  const total = conversations.length;
  if (total === 0) {
    return { junkLeadPercent: 0, phoneCollectionRate: 0, conversionRate: 0, returningCustomerRate: 0 };
  }

  // 1. Junk Lead = is_junk === true
  const junkCount = conversations.filter(r => r.is_junk === true || r.is_junk === 'true').length;
  const junkLeadPercent = Math.round((junkCount / total) * 100);

  // 2. Phone Collection = phone_status indicates SĐT was collected
  const phoneOk = conversations.filter(r =>
    r.phone_status === 'Đã cho SĐT' ||
    r.phone_status === 'Có SĐT' ||
    r.phone_status === true
  ).length;
  const phoneCollectionRate = Math.round((phoneOk / total) * 100);

  // 3. Conversion = temperature === 'Nóng' (chốt được đơn)
  const hotCount = conversations.filter(r =>
    r.temperature === 'Nóng' || r.temperature === 'nóng'
  ).length;
  const conversionRate = Math.round((hotCount / total) * 100);

  // 4. Returning Customer = is_returning_customer === true (from seed data)
  const returningCount = conversations.filter(r =>
    r.is_returning_customer === true || r.is_returning_customer === 'true'
  ).length;
  const returningCustomerRate = Math.round((returningCount / total) * 100);

  return { junkLeadPercent, phoneCollectionRate, conversionRate, returningCustomerRate };
}

/**
 * Mock 7-day trend sparkline — seeded by metric + conversation count
 * Returns array of 7 normalized values (0-100 scale)
 * Plus delta (today vs 7 days ago)
 */
function computeMockTrend(metricKey, currentValue, total) {
  // sr() in this file returns a single deterministic number [0..1], not a RNG function.
  // So we derive multiple deterministic points by varying the seed per step.
  const seedBase = total * 17 + metricKey.length * 31;

  // Generate 7 days of data: days 7..1 (oldest → newest)
  const days = [];
  let prev = currentValue + (sr(seedBase + 1) - 0.5) * 20;

  for (let i = 0; i < 7; i++) {
    const noise = sr(seedBase + 100 + i * 13);
    prev = Math.max(0, Math.min(100, prev + (noise - 0.45) * 8));
    days.push(Math.round(prev));
  }

  // Last day = today, should be close to currentValue
  days[6] = currentValue;
  const delta = currentValue - days[0];
  return { sparkline: days, delta: Math.round(delta) };
}

/**
 * Full Leads KPI with trend and alert
 */
export function getLeadsKPIWithTrend(conversations) {
  const { junkLeadPercent, phoneCollectionRate, conversionRate, returningCustomerRate } = computeLeadsKPI(conversations);
  const total = conversations.length;

  const metrics = [
    {
      key: 'junkLeadPercent',
      label: 'Leads rác',
      description: 'Tỉ lệ hội thoại không có intent mua / tổng hội thoại',
      value: junkLeadPercent,
      unit: '%',
      higherIsBetter: false,
    },
    {
      key: 'phoneCollectionRate',
      label: 'Thu thập SĐT',
      description: 'Tỉ lệ khách để lại SĐT / tổng hội thoại',
      value: phoneCollectionRate,
      unit: '%',
      higherIsBetter: true,
    },
    {
      key: 'conversionRate',
      label: 'Tỉ lệ chốt đơn',
      description: 'Tỉ lệ hội thoại chốt được đơn / tổng hội thoại',
      value: conversionRate,
      unit: '%',
      higherIsBetter: true,
    },
    {
      key: 'returningCustomerRate',
      label: 'Khách hàng cũ quay lại',
      description: 'Tỉ lệ khách đã từng mua quay lại / tổng hội thoại',
      value: returningCustomerRate,
      unit: '%',
      higherIsBetter: true,
    },
  ];

  return metrics.map(m => {
    const level = getKpiAlertLevel(m.key, m.value);
    const trend = computeMockTrend(m.key, m.value, total);
    return {
      ...m,
      level,
      color: getAlertColor(level),
      bg: getAlertBg(level),
      sparkline: trend.sparkline,
      delta: trend.delta,
    };
  });
}

/**
 * Get top N critical metrics across all diseases
 * Returns flat array of { diseaseId, diseaseLabel, metricKey, metricLabel, value, color }
 */
export function getTopCriticalMetrics(diseases, n = 5) {
  const critical = [];

  for (const disease of diseases) {
    for (const metric of disease.metrics) {
      // Define which metrics are "critical" per disease group
      const criticalKeys = {
        'lead-quality':         ['junkLeadPercent', 'phoneCollected', 'conversionRate'],
        'response-speed':       ['avgResponseMinutes', 'remindRate', 'personalOfferRate'],
        'staff-performance':    ['mistakeRate', 'goodAttitudePercent'],
        'competitor':            ['competitorMentionRate', 'priceComparisonRate'],
        'post-purchase':        ['reviewRiskRate', 'urgencyRate'],
        'objection-handling':   ['objectionRate', 'ghostRate'],
        'upsell':               ['ignoredRecRate', 'upsellAttemptRate'],
      };

      const keys = criticalKeys[disease.id] || disease.metrics.map(m => m.key);
      if (!keys.includes(metric.key)) continue;

      // Determine if this metric is critical (low/high value is bad)
      const isNegative = ['junkLeadPercent', 'avgResponseMinutes', 'mistakeRate',
                          'competitorMentionRate', 'priceComparisonRate', 'reviewRiskRate',
                          'ghostRate', 'ignoredRecRate', 'urgencyRate'].includes(metric.key);

      // Determine level
      let level;
      if (metric.key === 'junkLeadPercent') level = getKpiAlertLevel('junkLeadPercent', metric.value);
      else if (metric.key === 'phoneCollected') level = getKpiAlertLevel('phoneCollectionRate', metric.value);
      else if (metric.key === 'conversionRate') level = getKpiAlertLevel('conversionRate', metric.value);
      else if (isNegative) {
        // For negative metrics: high value = bad
        if (metric.value > 30) level = 'red';
        else if (metric.value > 15) level = 'yellow';
        else level = 'green';
      } else {
        // For positive metrics: low value = bad
        if (metric.value < 30) level = 'red';
        else if (metric.value < 50) level = 'yellow';
        else level = 'green';
      }

      critical.push({
        diseaseId: disease.id,
        diseaseLabel: disease.label,
        diseaseCode: disease.code,
        metricKey: metric.key,
        metricLabel: metric.label,
        value: metric.value,
        unit: metric.format === 'percent' ? '%' : metric.format === 'minutes' ? 'p' : '',
        color: getAlertColor(level),
        bg: getAlertBg(level),
        level,
        score: disease.score,
      });
    }
  }

  // Sort: red first, then yellow, then green; within same level sort by score (lowest first)
  const order = { red: 0, yellow: 1, green: 2 };
  critical.sort((a, b) => {
    if (order[a.level] !== order[b.level]) return order[a.level] - order[b.level];
    return a.score - b.score;
  });

  return critical.slice(0, n);
}

// ─── Load Conversations from Supabase JSON ────────────────────────────────

/**
 * loadConversations(industry, limit)
 * Load conversations from supabase-conversations.json.
 * Picks templates matching the industry, up to `limit` total.
 */
export function loadConversations(industry = 'thoi-trang', limit = 1000) {
  // Map industry string → template IDs in supabase-conversations.json
  const industryMap = {
    'thoi-trang': ['fsh-1', 'fsh-2', 'fsh-3', 'fsh-4', 'fsh-5', 'fsh-6'],
    'me-va-be':   ['mbb-1', 'mbb-2', 'mbb-3', 'mbb-4', 'mbb-5', 'mbb-6'],
    'my-pham':    ['cos-1', 'cos-2', 'cos-3', 'cos-4', 'cos-5', 'cos-6'],
    'spa':        ['spa-1', 'spa-2', 'spa-3', 'spa-4', 'spa-5', 'spa-6'],
    'bds':        ['rls-1', 'rls-2', 'rls-3', 'rls-4', 'rls-5', 'rls-6'],
    'fb':         ['fb-1',  'fb-2',  'fb-3',  'fb-4',  'fb-5',  'fb-6'],
    'du-lich':    ['trv-1', 'trv-2', 'trv-3', 'trv-4', 'trv-5', 'trv-6'],
  };

  const templateIds = industryMap[industry] || industryMap['thoi-trang'];

  // Flatten selected templates
  let all = [];
  for (const tid of templateIds) {
    if (supabaseConversationsRaw[tid]) {
      all = all.concat(supabaseConversationsRaw[tid]);
    }
  }

  return all.slice(0, limit);
}

// ─── Saved Actions ─────────────────────────────────────────────────────────

const ACTIONS_KEY = 'smax_saved_actions';

export function getSavedActions() {
  try {
    const raw = localStorage.getItem(ACTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAction(action) {
  const existing = getSavedActions();
  // Prevent duplicates
  if (existing.some(a => a.diseaseId === action.diseaseId && a.actionId === action.actionId)) return;
  const updated = [...existing, { ...action, savedAt: new Date().toISOString() }];
  localStorage.setItem(ACTIONS_KEY, JSON.stringify(updated));
}

export function removeAction(diseaseId, actionId) {
  const existing = getSavedActions().filter(
    a => !(a.diseaseId === diseaseId && a.actionId === actionId)
  );
  localStorage.setItem(ACTIONS_KEY, JSON.stringify(existing));
}

// ─── Industry List ─────────────────────────────────────────────────────────

export const INDUSTRIES = [
  { value: 'thoi-trang', label: 'Thời trang', icon: '👗' },
  { value: 'me-va-be',   label: 'Mẹ và Bé',   icon: '👶' },
  { value: 'my-pham',    label: 'Mỹ phẩm',    icon: '💄' },
  { value: 'spa',        label: 'Spa / Thẩm mỹ', icon: '💆' },
  { value: 'bds',        label: 'Bất động sản', icon: '🏠' },
  { value: 'fb',         label: 'F&B / Ăn uống', icon: '🍜' },
  { value: 'du-lich',    label: 'Du lịch',     icon: '✈️' },
];
