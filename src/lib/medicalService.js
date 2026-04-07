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

    // Mock topObjections / topMistakes (computed from conversations by the UI if needed)
    const topObjections = [];
    const topMistakes = [];

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
      topObjections,
      topMistakes,
    };
  });

  // Sort worst-first (lowest score = worst disease)
  return diseases.sort((a, b) => a.score - b.score);
}

// ─── Health Score ─────────────────────────────────────────────────────────

export function getHealthScore(diseases) {
  if (!diseases || diseases.length === 0) return null;
  const avg = diseases.reduce((sum, d) => sum + d.score, 0) / diseases.length;
  return parseFloat(avg.toFixed(1));
}

export function getHealthLabel(score) {
  if (score == null || isNaN(score)) return '—';
  if (score <= 3)   return 'NGHIÊM TRỌNG';
  if (score <= 5)   return 'CẢNH BÁO';
  if (score <= 7)   return 'CẦN CẢI THIỆN';
  return 'TỐT';
}

export function getHealthColor(score) {
  if (score == null || isNaN(score)) return '#94a3b8';
  if (score <= 3)   return '#BF3003';
  if (score <= 5)   return '#d97706';
  if (score <= 7)   return '#0052FF';
  return '#059669';
}

// ─── Crawl Simulation ──────────────────────────────────────────────────────

export async function crawlConversations(config, onProgress) {
  const { quantity = 1000, industry = 'thoi-trang' } = config;
  const STEP_DURATION = Math.max(80, Math.round(quantity / 20)); // ~20 steps

  // Yield immediately so React can paint step 3 before the first setCrawlProgress
  await new Promise(r => setTimeout(r, 0));

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

  // 1. Junk Lead = is_junk === true (handle boolean AND string "true"/"false")
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

// supabase-conversations.json is a FLAT ARRAY (6202 records, indexed 0..6201),
// NOT a nested object. Each record has `template_id` field.
function _buildSupaIndex() {
  const idx = {};
  for (const row of supabaseConversationsRaw) {
    const tid = row.template_id;
    if (!idx[tid]) idx[tid] = [];
    // Flatten data_json so callers get flat row objects
    idx[tid].push({
      ...row.data_json,
      id: row.id,
      customer: row.customer_name || row.customer || row.data_json?.customer,
      platform: row.platform,
      converted_at: row.converted_at,
      created_at: row.created_at,
    });
  }
  return idx;
}
let _supaIndex = null;
function _getSupaIndex() {
  if (!_supaIndex) _supaIndex = _buildSupaIndex();
  return _supaIndex;
}

/**
 * loadConversations(industry, limit)
 * Load conversations from supabase-conversations.json.
 * Picks templates matching the industry, up to `limit` total.
 * Returns FLAT rows (fields from data_json + top-level metadata).
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
  const idx = _getSupaIndex();

  // Flatten selected templates — index by template_id
  let all = [];
  for (const tid of templateIds) {
    if (idx[tid]) {
      all = all.concat(idx[tid]);
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

// ─── Interpretation / Diễn Giải ─────────────────────────────────────────────

/**
 * generateInterpretation(disease)
 * Trả về object diễn giải text bằng tiếng Việt, giúp user
 * không quen đọc chart vẫn hiểu nhanh tình hình.
 *
 * @param {Object} disease — disease object từ computeDiagnosis()
 * @returns {{ diagnosis: string, keyConcern: string, bottomLine: string, summary: string }}
 */
export function generateInterpretation(disease) {
  const { id, label, score, severity, severityColor, metrics } = disease;

  // Helper: lấy metric value by key
  const m = (key) => metrics.find(m => m.key === key)?.value ?? 0;

  // Helper: lấy trạng thái text từ % value
  const pct = (v, thresholds) => {
    if (v >= thresholds.good) return 'tốt';
    if (v >= thresholds.warn) return 'ở mức trung bình';
    return 'đáng báo động';
  };

  switch (id) {
    case 'lead-quality': {
      const junk = m('junkLeadPercent');
      const phone = m('phoneCollected');
      const cvr   = m('conversionRate');
      return {
        diagnosis: `Nhóm "Chất Lượng Nguồn Lead" hiện đạt ${score}/10. ` +
          `Trong tổng số hội thoại được phân tích, có tới ${junk}% là "khách rác" — ` +
          `những người không có ý định mua thật (click nhầm ads, tin tự động, hoặc chat không liên quan). ` +
          `Chỉ ${phone}% khách để lại SĐT — tỉ lệ thu thập thông tin liên hệ thấp, ` +
          `ảnh hưởng trực tiếp đến khả năng chốt đơn sau đó.`,
        keyConcern: junk > 30
          ? `⚠️ Junk Lead vượt ngưỡng 30% — hơn 1/3 ngân sách quảng cáo bị lãng phí vào khách không có giá trị. Cần rà soát lại targeting và ad creative.`
          : junk > 20
          ? `⚠️ Junk Lead ở mức ${junk}% — ngân sách có phần bị lãng phí. Nên cải thiện câu hỏi sàng lọc trong ads.`
          : `✅ Junk Lead ở mức chấp nhận được (${junk}%). Ngân sách quảng cáo được sử dụng tương đối hiệu quả.`,
        bottomLine: `Tóm lại: Shop đang nhận được ${cvr}% hội thoại có khách hàng tiềm năng thật sự. ` +
          `${phone}% trong số đó để lại SĐT — đây là nhóm có thể follow-up để chốt đơn. ` +
          `Nếu muốn tăng doanh thu, ưu tiên: (1) giảm junk qua ad creative, (2) tăng thu thập SĐT bằng CTA rõ ràng.`,
        summary: `Junk Lead ${junk}% · SĐT thu thập ${phone}% · Tỉ lệ chốt ${cvr}%`,
      };
    }

    case 'response-speed': {
      const avgMin  = m('avgResponseMinutes');
      const remind  = m('remindRate');
      const offer   = m('personalOfferRate');
      return {
        diagnosis: `Nhóm "Phản Hồi & Chăm Sóc" hiện đạt ${score}/10. ` +
          `Thời gian phản hồi trung bình là ${avgMin} phút — ` +
          avgMin < 5
            ? `một con số rất tốt, khách được chú ý gần như ngay lập tức. `
            : avgMin < 15
            ? `tốc độ chấp nhận được, nhưng vẫn có thể cải thiện thêm. `
            : `đây là mức chậm — khách online có attention span rất ngắn, dễ bỏ đi nếu chờ lâu. ` +
          `Tỉ lệ nhắc nhở khách (remind) chỉ đạt ${remind}%, và ưu đãi cá nhân hóa chỉ ${offer}%.`,
        keyConcern: avgMin > 20
          ? `⚠️ Phản hồi trung bình ${avgMin} phút — quá chậm cho khách online. Nghiên cứu cho thấy phản hồi sau 5 phút giảm 50% khả năng chốt đơn.`
          : avgMin > 10
          ? `⚠️ Phản hồi trung bình ${avgMin} phút — nên cài auto-reply để giữ khách trong thời gian chờ.`
          : `✅ Thời gian phản hồi khá nhanh (${avgMin} phút). Duy trì và tối ưu thêm.`,
        bottomLine: `Tóm lại: Shop ${avgMin < 10 ? 'đang phản hồi khá nhanh' : avgMin < 20 ? 'có thể cải thiện tốc độ phản hồi' : 'cần cải thiện tốc độ phản hồi gấp'}. ` +
          `Ngoài ra, chỉ ${remind}% khách được nhắc nhở khi chưa rep — ` +
          `đây là nhóm "bỏ qua" không quay lại. ` +
          `Cần đặt KPI phản hồi dưới 10 phút và cài auto-reply cho khung giờ ngoài.`,
        summary: `TB phản hồi ${avgMin}p · Remind KH ${remind}% · Ưu đãi cá nhân ${offer}%`,
      };
    }

    case 'staff-performance': {
      const goodAtt  = m('goodAttitudePercent');
      const mistake  = m('mistakeRate');
      const correct  = m('correctAdviceRate');
      return {
        diagnosis: `Nhóm "Nhân Viên Tư Vấn" hiện đạt ${score}/10. ` +
          `Trong các hội thoại được phân tích, ${goodAtt}% được đánh giá là có thái độ tốt, ` +
          `${mistake}% ghi nhận lỗi mất khách, và ${correct}% nhân viên tư vấn đúng và phù hợp.`,
        keyConcern: mistake > 20
          ? `⚠️ Tỉ lệ lỗi mất khách lên tới ${mistake}% — gần 1/4 khách rời đi vì nhân viên tư vấn không đúng cách. Đây là vấn đề nghiêm trọng cần giải quyết ngay.`
          : mistake > 10
          ? `⚠️ Lỗi mất khách ở mức ${mistake}% — cần audit hội thoại để tìm pattern lỗi.`
          : `✅ Tỉ lệ lỗi mất khách ở mức thấp (${mistake}%). Đội ngũ đang làm việc khá tốt.`,
        bottomLine: `Tóm lại: ${goodAtt}% hội thoại có thái độ nhân viên được đánh giá tích cực. ` +
          `Tuy nhiên, ${mistake}% khách bị mất do lỗi tư vấn — mỗi lỗi = 1 khách không quay lại. ` +
          `Nên tổ chức buổi training objection handling hàng tuần và audit 10 hội thoại có vấn đề.`,
        summary: `Thái độ tốt ${goodAtt}% · Lỗi mất khách ${mistake}% · Tư vấn đúng ${correct}%`,
      };
    }

    case 'competitor': {
      const compMention = m('competitorMentionRate');
      const priceComp   = m('priceComparisonRate');
      return {
        diagnosis: `Nhóm "Đối Thủ Cạnh Tranh" hiện đạt ${score}/10. ` +
          `Có ${compMention}% hội thoại có khách nhắc đến đối thủ, ` +
          `trong đó ${priceComp}% khách chủ động so sánh giá.`,
        keyConcern: compMention > 30
          ? `⚠️ Khách nhắc đến đối thủ trong ${compMention}% cuộc trò chuyện — đây là tín hiệu cảnh báo. Khách đang so sánh trước khi quyết định.`
          : compMention > 15
          ? `⚠️ Đối thủ được nhắc đến trong ${compMention}% hội thoại — cần chuẩn bị battle card để xử lý.`
          : `✅ Khách ít nhắc đến đối thủ (${compMention}%). Shop đang giữ được lợi thế trong cuộc đua.`,
        bottomLine: `Tóm lại: ${compMention}% khách đang cân nhắc đối thủ bên cạnh shop. ` +
          `Trong số đó, ${priceComp}% so sánh về giá — đây là cuộc chiến shop khó thắng nếu chỉ cạnh tranh giá. ` +
          `Hãy chuẩn bị battle card nhấn mạnh USP (chất lượng, bảo hành, dịch vụ) thay vì giảm giá.`,
        summary: `Nhắc đến đối thủ ${compMention}% · So sánh giá ${priceComp}%`,
      };
    }

    case 'post-purchase': {
      const postCare = m('postCareProgramRate');
      const reviewRisk = m('reviewRiskRate');
      const urgency = m('urgencyRate');
      return {
        diagnosis: `Nhóm "CSKH & Hậu Mua" hiện đạt ${score}/10. ` +
          `Chỉ ${postCare}% khách được chăm sóc sau mua, ` +
          `${reviewRisk}% có nguy cơ để lại review xấu, ` +
          `và ${urgency}% thể hiện sự gấp gáp (có thể là khiếu nại tiềm ẩn).`,
        keyConcern: reviewRisk > 20
          ? `⚠️ Risk review xấu ở mức ${reviewRisk}% — gần 1/4 khách có thể để lại review tiêu cực nếu không được chăm sóc kịp thời. Đây là nguy cơ lớn cho brand.`
          : reviewRisk > 10
          ? `⚠️ Risk review ở mức ${reviewRisk}% — nên chủ động gửi tin cảm ơn và invite review sau mua.`
          : `✅ Risk review ở mức thấp (${reviewRisk}%). Tuy nhiên vẫn nên duy trì chương trình CSKH sau mua.`,
        bottomLine: `Tóm lại: ${postCare}% khách được chăm sóc sau mua — ` +
          `con số này quá thấp nếu muốn xây dựng base khách hàng trung thành. ` +
          `Sau ${reviewRisk}% hội thoại có dấu hiệu bất mãn có thể dẫn đến review xấu. ` +
          `Nên triển khai tin nhắn chăm sóc tự động sau 3 ngày mua hàng.`,
        summary: `CSKH sau mua ${postCare}% · Risk review ${reviewRisk}% · Urgency ${urgency}%`,
      };
    }

    case 'objection-handling': {
      const objRate  = m('objectionRate');
      const script   = m('scriptFollowRate');
      const ghost    = m('ghostRate');
      return {
        diagnosis: `Nhóm "Kịch Bản Tư Vấn" hiện đạt ${score}/10. ` +
          `Có ${objRate}% hội thoại gặp objection (khách đặt câu hỏi rào cản), ` +
          `chỉ ${script}% nhân viên follow đúng kịch bản tư vấn, ` +
          `và ${ghost}% khách "bốc hơi" (seen không rep).`,
        keyConcern: ghost > 20
          ? `⚠️ ${ghost}% khách "bốc hơi" — đây là nhóm đã quan tâm nhưng không được follow-up. Đây là lead tiềm năng bị lãng phí.`
          : ghost > 10
          ? `⚠️ ${ghost}% khách bỏ giữa chừng — nên có kịch bản follow-up trong 48h.`
          : `✅ Tỉ lệ khách bốc hơi ở mức thấp (${ghost}%). Đội ngũ đang theo dõi khách tốt.`,
        bottomLine: `Tóm lại: ${objRate}% khách đặt objection — đây là tín hiệu họ đang cân nhắc mua. ` +
          `Nhân viên follow đúng kịch bản chỉ ${script}% — cần training script chuẩn. ` +
          `Với ${ghost}% khách bốc hơi, nên có 3 tin nhắn follow-up trong 48h để "giành lại" lead.`,
        summary: `Objection ${objRate}% · Follow script ${script}% · Khách bốc hơi ${ghost}%`,
      };
    }

    case 'abandoned-chat': {
      const abandon   = m('abandonRate');
      const noClosure = m('noClosureRate');
      const noFinal   = m('noFinalMsgRate');
      return {
        diagnosis: `Nhóm "Cuộc Trò Chuyện Bỏ Dở" hiện đạt ${score}/10. ` +
          `${abandon}% hội thoại bị bỏ giữa chừng, ` +
          `${noClosure}% không có kết thúc rõ ràng, ` +
          `và ${noFinal}% thiếu tin nhắn cuối từ phía shop.`,
        keyConcern: abandon > 25
          ? `⚠️ Hơn 1/4 hội thoại bị bỏ dở — đây là lượng lớn lead tiềm năng bị lãng phí. Cần cài notification alert để nhân viên không bỏ sót khách.`
          : abandon > 15
          ? `⚠️ Tỉ lệ bỏ dở ${abandon}% — có thể do nhân viên chưa để ý khách mới hoặc khách chờ lâu.`
          : `✅ Tỉ lệ bỏ dở ở mức thấp (${abandon}%). Cuộc trò chuyện được duy trì tốt.`,
        bottomLine: `Tóm lại: ${abandon}% cuộc trò chuyện không có kết quả rõ ràng. ` +
          `Nguyên nhân có thể đến từ: nhân viên chưa nhận notification khách mới, ` +
          `khách chờ lâu rồi bỏ đi, hoặc không có kịch bản "đang typing..." giữ chỗ. ` +
          `Cài notification Zalo OA và kịch bản chờ là 2 hành động ưu tiên.`,
        summary: `Bỏ giữa chừng ${abandon}% · Không kết thúc ${noClosure}% · Không tin nhắn cuối ${noFinal}%`,
      };
    }

    case 'tone-language': {
      const badTone    = m('badToneRate');
      const emojiOver  = m('emojiOveruseRate');
      const longMsg    = m('longMsgRate');
      return {
        diagnosis: `Nhóm "Ngôn Ngữ & Cách Giao Tiếp" hiện đạt ${score}/10. ` +
          `Có ${badTone}% hội thoại sử dụng giọng không phù hợp (quá formal, quá casual, hoặc thiếu chuyên nghiệp), ` +
          `${emojiOver}% over-emoji (dùng quá nhiều icon cảm xúc), ` +
          `và ${longMsg}% gửi tin nhắn quá dài khiến khách khó đọc.`,
        keyConcern: badTone > 15
          ? `⚠️ ${badTone}% hội thoại có giọng không phù hợp — điều này ảnh hưởng trực tiếp đến perception của khách về brand.`
          : badTone > 5
          ? `⚠️ Một phần nhỏ (${badTone}%) giọng văn chưa đồng nhất — nên ban hành guide giọng văn cho team.`
          : `✅ Giọng văn nhất quán và chuyên nghiệp (${badTone}% bất thường).`,
        bottomLine: `Tóm lại: Phong cách giao tiếp ảnh hưởng đến trust của khách. ` +
          `${badTone}% dùng giọng chưa phù hợp, ${emojiOver}% over-emoji, ${longMsg}% tin quá dài. ` +
          `Nên quy định: không quá 3 emoji/câu, tin không quá 3 dòng, luôn kết thúc bằng câu hỏi mở.`,
        summary: `Giọng không phù hợp ${badTone}% · Over-emoji ${emojiOver}% · Tin quá dài ${longMsg}%`,
      };
    }

    case 'upsell': {
      const attempt  = m('upsellAttemptRate');
      const success  = m('upsellSuccessRate');
      const ignored  = m('ignoredRecRate');
      return {
        diagnosis: `Nhóm "Upsell / Cross-sell" hiện đạt ${score}/10. ` +
          `Chỉ ${attempt}% hội thoại có nhân viên gợi ý sản phẩm bổ sung, ` +
          `trong đó ${success}% upsell thành công, ` +
          `và ${ignored}% khách bỏ qua gợi ý của nhân viên.`,
        keyConcern: attempt < 20
          ? `⚠️ Chỉ ${attempt}% hội thoại có upsell attempt — team đang bỏ qua cơ hội tăng AOV (giá trị đơn hàng trung bình). Upsell là cách tăng doanh thu nhanh nhất mà không tốn thêm chi phí quảng cáo.`
          : attempt < 35
          ? `⚠️ Upsell attempt ở mức ${attempt}% — có cải thiện nhưng chưa đủ. Script upsell chuẩn có thể tăng đáng kể.`
          : `✅ Upsell attempt ở mức khá (${attempt}%). Nên tập trung cải thiện tỉ lệ thành công.`,
        bottomLine: `Tóm lại: Mỗi hội thoại là cơ hội tăng AOV. ` +
          `Hiện chỉ ${attempt}% được upsell, và ${ignored}% trong số đó bị khách bỏ qua — ` +
          `script upsell chưa đủ hấp dẫn. ` +
          `Nên dùng cross-sell script: "Kèm theo [sản phẩm bổ sung]" kèm bundle discount rõ ràng.`,
        summary: `Upsell attempt ${attempt}% · Thành công ${success}% · KH bỏ qua ${ignored}%`,
      };
    }

    default: {
      return {
        diagnosis: `Nhóm "${label}" hiện đạt ${score}/10 — ` +
          `mức ${severity.toLowerCase()}. Các chỉ số cần được xem xét để đưa ra hành động cải thiện phù hợp.`,
        keyConcern: `📊 Điểm số ${score}/10 cho thấy nhóm này ${score < 5 ? 'đang gặp vấn đề nghiêm trọng' : score < 7 ? 'cần được cải thiện' : 'đang ở mức chấp nhận được'}.`,
        bottomLine: `Tóm lại: Cần xem xét các chỉ số cụ thể bên dưới và áp dụng khuyến nghị phù hợp từ Chuyên gia Smax.`,
        summary: `Điểm ${score}/10 · ${metrics.length} chỉ số được theo dõi`,
      };
    }
  }
}

// ─── Industry List ─────────────────────────────────────────────────────────

// ─── Overall Summary — Tóm Tắt Tổng Quan ────────────────────────────────

/**
 * generateOverallSummary(diseases)
 * Tạo tổng kết tổng quan 2-3 dòng tiếng Việt cho Bảng Tóm Tắt.
 *
 * @param {Array} diseases — diseases sorted worst-first from computeDiagnosis()
 * @returns {{ headline: string, diagnosis: string, severityCounts: {nang, trungBinh, nhe} }}
 */
export function generateOverallSummary(diseases) {
  if (!diseases || diseases.length === 0) {
    return {
      headline: 'Chưa có dữ liệu',
      diagnosis: 'Hãy hoàn thành khám bệnh để xem tổng quan.',
      severityCounts: { nang: 0, trungBinh: 0, nhe: 0 },
    };
  }

  const severe      = diseases.filter(d => d.severity === 'NẶNG');
  const moderate   = diseases.filter(d => d.severity === 'TRUNG BÌNH');
  const mild        = diseases.filter(d => d.severity === 'NHẸ');
  const avgScore    = diseases.reduce((s, d) => s + d.score, 0) / diseases.length;
  const worst       = diseases[0];  // sorted worst-first
  const worstScore  = worst?.score ?? 0;
  const best        = diseases[diseases.length - 1];
  const bestScore   = best?.score ?? 0;

  // Headline label
  let headline;
  if (avgScore <= 3) headline = 'NGHIÊM TRỌNG';
  else if (avgScore <= 5) headline = 'CẢNH BÁO';
  else if (avgScore <= 7) headline = 'CẦN CẢI THIỆN';
  else headline = 'TỐT';

  // Diagnosis paragraph
  let diagnosis;
  if (severe.length >= 3) {
    diagnosis = `Bức tranh tổng cho thấy ${severe.length} nhóm bệnh nghiêm trọng cần xử lý ngay, ` +
      `bao gồm "${worst.label}" (${worstScore}/10). ` +
      `Điểm sức khỏe hội thoại trung bình chỉ ${avgScore.toFixed(1)}/10 — ` +
      `đây là tín hiệu cảnh báo rõ ràng về chất lượng chăm sóc khách hàng hiện tại.`;
  } else if (severe.length >= 1) {
    diagnosis = `Có ${severe.length} nhóm bệnh nghiêm trọng cần ưu tiên, ` +
      `nổi bật nhất là "${worst.label}" (${worstScore}/10). ` +
      moderate.length > 0
        ? `${moderate.length} nhóm khác ở mức trung bình. `
        : '' +
      `Điểm sức khỏe hội thoại trung bình: ${avgScore.toFixed(1)}/10.`;
  } else if (moderate.length >= 4) {
    diagnosis = `Không có nhóm bệnh nghiêm trọng — đây là tín hiệu tốt. ` +
      `Tuy nhiên, ${moderate.length} nhóm đang ở mức trung bình cần được cải thiện, ` +
      `đặc biệt là "${worst.label}" (${worstScore}/10). ` +
      `Nếu được xử lý tốt, điểm sức khỏe có thể tăng lên mức TỐT.`;
  } else {
    diagnosis = `Bức tranh tổng quan khả quan. ` +
      `${mild.length > 0 ? `${mild.length} nhóm đang ở mức tốt, ` : ''}` +
      moderate.length > 0 ? `${moderate.length} nhóm cần cải thiện nhẹ. ` : '' +
      `Nhóm cần chú ý nhất: "${worst.label}" (${worstScore}/10). ` +
      `Điểm sức khỏe trung bình: ${avgScore.toFixed(1)}/10.`;
  }

  return {
    headline,
    diagnosis,
    severityCounts: {
      nang: severe.length,
      trungBinh: moderate.length,
      nhe: mild.length,
    },
    worstLabel: worst?.label,
    worstScore,
    bestLabel: best?.label,
    bestScore,
    avgScore: parseFloat(avgScore.toFixed(1)),
  };
}

export const INDUSTRIES = [
  { value: 'thoi-trang', label: 'Thời trang', icon: '👗' },
  { value: 'me-va-be',   label: 'Mẹ và Bé',   icon: '👶' },
  { value: 'my-pham',    label: 'Mỹ phẩm',    icon: '💄' },
  { value: 'spa',        label: 'Spa / Thẩm mỹ', icon: '💆' },
  { value: 'bds',        label: 'Bất động sản', icon: '🏠' },
  { value: 'fb',         label: 'F&B / Ăn uống', icon: '🍜' },
  { value: 'du-lich',    label: 'Du lịch',     icon: '✈️' },
];

// ─── Improvement Roadmap ───────────────────────────────────────────────────

const ROADMAP_STATUS_KEY = 'roadmap-status';

/**
 * generateImprovementRoadmap(diseases, conversations)
 * Tạo 4-phase roadmap với jobs và sub-tasks từ diseases data.
 *
 * Phase mapping:
 *  Phase 1 (W1-2): Ổn định nền tảng  → diseases score thấp nhất
 *  Phase 2 (W3-4): Cải thiện chất lượng → diseases score trung bình thấp
 *  Phase 3 (W5-6): Tối ưu quy trình    → diseases score trung bình cao
 *  Phase 4 (W7-8): Mở rộng quy mô     → diseases còn lại + tổng hợp
 */
export function generateImprovementRoadmap(diseases, conversations = []) {
  if (!diseases || diseases.length === 0) {
    return _emptyRoadmap();
  }

  // Sort diseases by score ascending (worst first)
  const sorted = [...diseases].sort((a, b) => a.score - b.score);
  const worst    = sorted[0];
  const midLow   = sorted[Math.floor(sorted.length * 0.33)] || sorted[1];
  const midHigh  = sorted[Math.floor(sorted.length * 0.66)] || sorted[sorted.length - 1];
  const healthScore = getHealthScore(diseases);

  // ── Leads KPIs from conversations ──
  const total = conversations.length || 1;
  const kpi = computeLeadsKPI(conversations);
  const junkPct    = kpi.junkLeadPercent;
  const phonePct   = kpi.phoneCollectionRate;
  const hotPct     = kpi.conversionRate;

  // ── Metrics overview ──
  const metrics = {
    healthScore,
    criticalCount: diseases.filter(d => d.severity === 'NẶNG').length,
    actionCount:  _countAllJobs(diseases),
    timeWeeks: 8,
  };

  // ── Phase 1 ──
  const phase1 = _buildPhase1(worst, junkPct, phonePct);

  // ── Phase 2 ──
  const phase2 = _buildPhase2(midLow);

  // ── Phase 3 ──
  const phase3 = _buildPhase3(midHigh, hotPct);

  // ── Phase 4 ──
  const phase4 = _buildPhase4(healthScore);

  return { metrics, phases: [phase1, phase2, phase3, phase4] };
}

/** Compute realistic date range for each phase based on today */
function _phaseDateRange(phaseIndex) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() + (phaseIndex - 1) * 14); // phase 1 starts today
  const end = new Date(start);
  end.setDate(start.getDate() + 13); // +13 days = 2 weeks
  const fmt = d => `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  return { dateStart: fmt(start), dateEnd: fmt(end), daysTotal: 14 };
}

/** Sum estimatedDays across all sub-tasks of a job */
function _jobEstimatedDays(job) {
  return (job.subTasks || []).reduce((s, st) => s + (st.estimatedDays || 1), 0);
}

/** Sum estimatedDays across all jobs of a phase */
function _phaseEstimatedDays(phase) {
  return (phase.jobs || []).reduce((s, j) => s + _jobEstimatedDays(j), 0);
}

function _emptyRoadmap() {
  return {
    metrics: { healthScore: 0, criticalCount: 0, actionCount: 0, timeWeeks: 8 },
    phases: [],
  };
}

function _countAllJobs(diseases) {
  return diseases.reduce((sum, d) => sum + (d.recommendations?.length || 0), 0);
}

function _buildPhase1(worst, junkPct, phonePct) {
  const beforeLQ = worst?.score ?? 3;
  const dates = _phaseDateRange(1);
  return {
    id: 'phase-1',
    title: 'Ổn định nền tảng',
    weeks: 'W1-2',
    color: '#BF3003',
    phaseIndex: 1,
    dateStart: dates.dateStart,
    dateEnd: dates.dateEnd,
    estimatedDays: 13,
    projectedMetrics: [
      {
        label: 'Lead Quality',
        before: beforeLQ,
        after: Math.min(10, parseFloat((beforeLQ + 3).toFixed(1))),
        unit: 'điểm',
        direction: 'up',
      },
      {
        label: 'Junk Lead',
        before: junkPct,
        after: Math.max(0, junkPct - 20),
        unit: '%',
        direction: 'down',
      },
    ],
    jobs: [
      {
        id: 'job-1-1',
        title: 'Thiết lập quy trình phản hồi nhanh',
        icon: '⏱',
        priority: 'HIGH',
        severity: worst?.severity ?? 'Nghiêm trọng',
        diseases: [worst?.id].filter(Boolean),
        completionPercent: 0,
        subTasks: [
          { id: 'st-1-1-1', title: 'Cài đặt auto-reply trong 24h', estimatedDays: 1 },
          { id: 'st-1-1-2', title: 'Soạn 5 template trả lời nhanh', estimatedDays: 2 },
          { id: 'st-1-1-3', title: 'Training nhân viên về quy trình mới', estimatedDays: 2 },
          { id: 'st-1-1-4', title: 'Test và tối ưu thời gian phản hồi', estimatedDays: 3 },
        ],
      },
      {
        id: 'job-1-2',
        title: 'Tối ưu chất lượng nguồn lead',
        icon: '📊',
        priority: 'HIGH',
        severity: worst?.severity ?? 'Nghiêm trọng',
        diseases: ['lead-quality'],
        completionPercent: 0,
        subTasks: [
          { id: 'st-1-2-1', title: 'Rà soát lại targeting Facebook Ads', estimatedDays: 2 },
          { id: 'st-1-2-2', title: 'Viết lại ad creative giảm junk', estimatedDays: 2 },
          { id: 'st-1-2-3', title: 'Thêm câu hỏi sàng lọc trong form', estimatedDays: 1 },
        ],
      },
      {
        id: 'job-1-3',
        title: 'Thiết lập thu thập SĐT',
        icon: '📞',
        priority: 'MEDIUM',
        severity: 'Trung bình',
        diseases: ['lead-quality'],
        completionPercent: 0,
        subTasks: [
          { id: 'st-1-3-1', title: 'Thiết kế CTA thu thập SĐT hiệu quả', estimatedDays: 1 },
          { id: 'st-1-3-2', title: 'Cài đặt popup/landing page thu SĐT', estimatedDays: 2 },
        ],
      },
    ],
  };
}

function _buildPhase2(midLow) {
  const beforeRS = midLow?.score ?? 4;
  const dates = _phaseDateRange(2);
  return {
    id: 'phase-2',
    title: 'Cải thiện chất lượng',
    weeks: 'W3-4',
    color: '#0052FF',
    phaseIndex: 2,
    dateStart: dates.dateStart,
    dateEnd: dates.dateEnd,
    estimatedDays: 13,
    projectedMetrics: [
      {
        label: 'Response Speed',
        before: beforeRS,
        after: Math.min(10, parseFloat((beforeRS + 2.5).toFixed(1))),
        unit: 'điểm',
        direction: 'up',
      },
      {
        label: 'Phone Collection',
        before: 30,
        after: 50,
        unit: '%',
        direction: 'up',
      },
    ],
    jobs: [
      {
        id: 'job-2-1',
        title: 'Đào tạo đội ngũ tư vấn',
        icon: '👥',
        priority: 'HIGH',
        severity: midLow?.severity ?? 'Trung bình',
        diseases: ['staff-performance'],
        completionPercent: 0,
        subTasks: [
          { id: 'st-2-1-1', title: 'Soạn playbook objection handling', estimatedDays: 2 },
          { id: 'st-2-1-2', title: 'Training 1 buổi (2h) cho toàn team', estimatedDays: 1 },
          { id: 'st-2-1-3', title: 'Role-play tình huống khách hàng', estimatedDays: 1 },
          { id: 'st-2-1-4', title: 'Đánh giá sau training', estimatedDays: 1 },
        ],
      },
      {
        id: 'job-2-2',
        title: 'Cải thiện tốc độ phản hồi',
        icon: '⚡',
        priority: 'HIGH',
        severity: midLow?.severity ?? 'Trung bình',
        diseases: ['response-speed'],
        completionPercent: 0,
        subTasks: [
          { id: 'st-2-2-1', title: 'Đặt KPI phản hồi < 10 phút', estimatedDays: 1 },
          { id: 'st-2-2-2', title: 'Cài alert thông báo khách mới', estimatedDays: 2 },
          { id: 'st-2-2-3', title: 'Thiết lập ca trực online liên tục', estimatedDays: 2 },
        ],
      },
      {
        id: 'job-2-3',
        title: 'Xây dựng thư viện script chuẩn',
        icon: '📜',
        priority: 'MEDIUM',
        severity: 'Nhẹ',
        diseases: ['staff-performance', 'objection-handling'],
        completionPercent: 0,
        subTasks: [
          { id: 'st-2-3-1', title: 'Viết 10 script cho objection phổ biến', estimatedDays: 3 },
          { id: 'st-2-3-2', title: 'Tạo template tin nhắn cá nhân hóa', estimatedDays: 2 },
        ],
      },
    ],
  };
}

function _buildPhase3(midHigh, hotPct) {
  const beforeObj = midHigh?.score ?? 4;
  const beforeCvr = hotPct || 10;
  const dates = _phaseDateRange(3);
  return {
    id: 'phase-3',
    title: 'Tối ưu quy trình',
    weeks: 'W5-6',
    color: '#7C3AED',
    phaseIndex: 3,
    dateStart: dates.dateStart,
    dateEnd: dates.dateEnd,
    estimatedDays: 13,
    projectedMetrics: [
      {
        label: 'Objection Handling',
        before: beforeObj,
        after: Math.min(10, parseFloat((beforeObj + 3).toFixed(1))),
        unit: 'điểm',
        direction: 'up',
      },
      {
        label: 'Conversion Rate',
        before: beforeCvr,
        after: Math.min(100, beforeCvr + 10),
        unit: '%',
        direction: 'up',
      },
    ],
    jobs: [
      {
        id: 'job-3-1',
        title: 'Tối ưu kịch bản chốt đơn',
        icon: '🎯',
        priority: 'HIGH',
        severity: midHigh?.severity ?? 'Trung bình',
        diseases: ['objection-handling'],
        completionPercent: 0,
        subTasks: [
          { id: 'st-3-1-1', title: 'A/B test 3 phiên bản script', estimatedDays: 2 },
          { id: 'st-3-1-2', title: 'Theo dõi tỉ lệ chốt đơn hàng ngày', estimatedDays: 1 },
          { id: 'st-3-1-3', title: 'Tinh chỉnh script theo data', estimatedDays: 2 },
        ],
      },
      {
        id: 'job-3-2',
        title: 'Triển khai automation',
        icon: '🤖',
        priority: 'MEDIUM',
        severity: 'Nhẹ',
        diseases: ['response-speed', 'abandoned-chat'],
        completionPercent: 0,
        subTasks: [
          { id: 'st-3-2-1', title: 'Cài chatbot tự động nhắc khách', estimatedDays: 3 },
          { id: 'st-3-2-2', title: 'Thiết lập tin nhắn follow-up tự động', estimatedDays: 2 },
          { id: 'st-3-2-3', title: 'Test và tối ưu flow automation', estimatedDays: 2 },
        ],
      },
      {
        id: 'job-3-3',
        title: 'Theo dõi & đo lường hiệu quả',
        icon: '📊',
        priority: 'LOW',
        severity: 'Nhẹ',
        diseases: ['lead-quality', 'objection-handling'],
        completionPercent: 0,
        subTasks: [
          { id: 'st-3-3-1', title: 'Setup dashboard theo dõi KPIs', estimatedDays: 2 },
          { id: 'st-3-3-2', title: 'Weekly report review với team', estimatedDays: 1 },
        ],
      },
    ],
  };
}

function _buildPhase4(healthScore) {
  const beforeHS = healthScore || 5;
  const dates = _phaseDateRange(4);
  return {
    id: 'phase-4',
    title: 'Mở rộng quy mô',
    weeks: 'W7-8',
    color: '#059669',
    phaseIndex: 4,
    dateStart: dates.dateStart,
    dateEnd: dates.dateEnd,
    estimatedDays: 13,
    projectedMetrics: [
      {
        label: 'Overall Health',
        before: beforeHS,
        after: Math.min(10, parseFloat((beforeHS + 2).toFixed(1))),
        unit: 'điểm',
        direction: 'up',
      },
      {
        label: 'ROAS',
        before: 1.2,
        after: 1.8,
        unit: '×',
        direction: 'up',
      },
    ],
    jobs: [
      {
        id: 'job-4-1',
        title: 'Triển khai CSKH sau mua',
        icon: '💬',
        priority: 'HIGH',
        severity: 'Nghiêm trọng',
        diseases: ['post-purchase'],
        completionPercent: 0,
        subTasks: [
          { id: 'st-4-1-1', title: 'Thiết kế workflow CSKH sau mua', estimatedDays: 2 },
          { id: 'st-4-1-2', title: 'Cài đặt tin nhắn chăm sóc tự động', estimatedDays: 3 },
          { id: 'st-4-1-3', title: 'Theo dõi satisfaction score', estimatedDays: 1 },
        ],
      },
      {
        id: 'job-4-2',
        title: 'Phân tích đối thủ cạnh tranh',
        icon: '⚔',
        priority: 'MEDIUM',
        severity: 'Trung bình',
        diseases: ['competitor'],
        completionPercent: 0,
        subTasks: [
          { id: 'st-4-2-1', title: 'Nghiên cứu 5 đối thủ hàng đầu', estimatedDays: 3 },
          { id: 'st-4-2-2', title: 'Viết battle card cho từng đối thủ', estimatedDays: 2 },
          { id: 'st-4-2-3', title: 'Training team về USP của shop', estimatedDays: 1 },
        ],
      },
      {
        id: 'job-4-3',
        title: 'Mở rộng chiến dịch upsell',
        icon: '📈',
        priority: 'LOW',
        severity: 'Nhẹ',
        diseases: ['upsell'],
        completionPercent: 0,
        subTasks: [
          { id: 'st-4-3-1', title: 'Thiết kế cross-sell bundle products', estimatedDays: 2 },
          { id: 'st-4-3-2', title: 'A/B test upsell message scripts', estimatedDays: 2 },
        ],
      },
    ],
  };
}

/**
 * Lưu / đọc 3-state sub-task status từ localStorage.
 * Status map: { [subTaskId]: 'todo' | 'in-progress' | 'done' }
 *
 * Backward compat: nếu key cũ 'roadmap-checked-{industry}' tồn tại
 * (chỉ có list of IDs = all 'done'), migrate tự động.
 */
export function getRoadmapStatus(industry = 'default') {
  try {
    // ── Migration: từ old format (array of IDs) → new format (status map) ──
    const legacyKey = `roadmap-checked-${industry}`;
    const legacyRaw = localStorage.getItem(legacyKey);
    if (legacyRaw) {
      const legacyIds = JSON.parse(legacyRaw);
      const statusMap = {};
      for (const id of legacyIds) statusMap[id] = 'done';
      localStorage.setItem(`${ROADMAP_STATUS_KEY}-${industry}`, JSON.stringify(statusMap));
      localStorage.removeItem(legacyKey);
      return statusMap;
    }

    const raw = localStorage.getItem(`${ROADMAP_STATUS_KEY}-${industry}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveRoadmapStatus(industry, statusMap) {
  localStorage.setItem(`${ROADMAP_STATUS_KEY}-${industry}`, JSON.stringify(statusMap));
}

/** Legacy — kept for compat, maps 'done' IDs from new status map */
export function getRoadmapChecked(industry = 'default') {
  const statusMap = getRoadmapStatus(industry);
  return Object.entries(statusMap)
    .filter(([, s]) => s === 'done')
    .map(([id]) => id);
}

export function saveRoadmapChecked(industry, checkedIds) {
  // legacy write — migrate existing done IDs into status map
  const existing = getRoadmapStatus(industry);
  const statusMap = { ...existing };
  for (const id of checkedIds) {
    if (statusMap[id] === undefined) statusMap[id] = 'done';
  }
  saveRoadmapStatus(industry, statusMap);
}
