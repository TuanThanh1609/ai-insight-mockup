/**
 * smaxAIService.js
 *
 * Streaming AI wrapper cho Smax AI endpoint.
 * Endpoint : https://smaxai.cdp.vn/api/chat
 * Key      : 3a914320759947da9124f10b1b7d53df
 */

// Always use /api/smax-chat — works in both environments:
// - Dev:  Vite proxy rewrites /api/smax-chat → smaxai.cdp.vn/api/chat
// - Prod: Vercel serverless rewrites /api/smax-chat → smaxai.cdp.vn/api/chat
const SMAX_API_URL = '/api/smax-chat';
const SMAX_API_KEY = '3a914320759947da9124f10b1b7d53df';
const CACHE_TTL_MS  = 24 * 60 * 60 * 1000; // 24h

// ─── Cache helpers ───────────────────────────────────────────────────────────

function getCacheKey(industry, diseaseId) {
  return `smax-rec-${industry}-${diseaseId}`;
}

function readCache(industry, diseaseId) {
  try {
    const raw = localStorage.getItem(getCacheKey(industry, diseaseId));
    if (!raw) return null;
    const { response, fetchedAt } = JSON.parse(raw);
    if (Date.now() - fetchedAt > CACHE_TTL_MS) return null;
    return response;
  } catch {
    return null;
  }
}

function writeCache(industry, diseaseId, response) {
  try {
    localStorage.setItem(getCacheKey(industry, diseaseId), JSON.stringify({
      response,
      fetchedAt: Date.now(),
    }));
  } catch {
    // localStorage full — ignore
  }
}

function clearCache(industry) {
  try {
    if (industry) {
      const prefix = `smax-rec-${industry}-`;
      Object.keys(localStorage)
        .filter(k => k.startsWith(prefix))
        .forEach(k => localStorage.removeItem(k));
    } else {
      Object.keys(localStorage)
        .filter(k => k.startsWith('smax-rec-'))
        .forEach(k => localStorage.removeItem(k));
    }
  } catch {
    // ignore
  }
}

// ─── Prompt builder ─────────────────────────────────────────────────────────

/**
 * Build prompt cho 1 nhóm phân tích.
 * Dùng ngôn ngữ kinh doanh — tránh trigger Azure OpenAI content filter.
 * @param {object} opts
 * @param {object} opts.disease        — { id, label, metrics[] }
 * @param {string} opts.industry       — 'fashion' | 'mebaby' | ...
 * @param {string} opts.industryLabel  — 'Thời trang' | 'Mẹ và Bé' | ...
 * @param {object[]} opts.topObjections — [{ name, pct }]
 * @param {object[]} opts.topMistakes   — [{ name, pct }]
 * @returns {string}
 */
export function buildDiseasePrompt({ disease, industryLabel, topObjections = [], topMistakes = [] }) {
  const weakMetrics = disease.metrics
    .filter(m => {
      const highIsBad = ['junkLeadPercent','mistakeRate','ghostRate','avgResponseMinutes',
                          'abandonRate','noClosureRate','noFinalMsgRate','badToneRate',
                          'emojiOveruseRate','longMsgRate','reviewRiskRate','urgencyRate',
                          'objectionRate','ignoredRecRate'].includes(m.key);
      if (highIsBad) return m.value > 30;
      return m.value < 50;
    })
    .map(m => `${m.label}: ${m.value}%`)
    .slice(0, 3);

  const objectionList = topObjections
    .slice(0, 3)
    .map(o => `${o.name} (${o.pct}%)`)
    .join(', ');

  const mistakeList = topMistakes
    .slice(0, 3)
    .map(m => `${m.name} (${m.pct}%)`)
    .join(', ');

  const parts = [
    `Phan tich nhom chi so "${disease.label}" cho nghanh ${industryLabel}.`,
  ];

  if (weakMetrics.length > 0) {
    parts.push(`Chi so can toi uu: ${weakMetrics.join(', ')}.`);
  }
  if (objectionList) {
    parts.push(`Rao can cua khach: ${objectionList}.`);
  }
  if (mistakeList) {
    parts.push(`Diem gap van de: ${mistakeList}.`);
  }

  parts.push(
    'Hay goi y 2-3 hanh dong cu the (neu co the dung tinh nang Smax) de cai thien chi so nay. TRA LOI DUNG DINH DANG JSON sau, khong co gi khac ngoai JSON: {"actions":[{"title":"Tieu de hanh dong","smax_feature":"Ten tinh nang Smax","impact":"Tac dong mong doi","steps":["Buoc 1 cu the","Buoc 2 cu the","Buoc 3 cu the"]}]}'
  );

  return parts.join(' ');
}

// ─── Streaming AI call ──────────────────────────────────────────────────────

/**
 * Gọi Smax AI — proxy trả JSON { text }.
 * Parse JSON actions → gọi onActions(actions[]).
 *
 * @param {string} prompt
 * @param {function} onChunk      — (text: string) => void  streaming preview
 * @param {function} onDone        — (actions: array) => void  structured data
 * @param {function} onError       — (err: Error) => void
 * @returns {{ abort: () => void }}
 */
export function askSmaxAI(prompt, { onChunk, onDone, onError } = {}) {
  let aborted = false;

  (async () => {
    try {
      const response = await fetch(SMAX_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': SMAX_API_KEY,
        },
        body: JSON.stringify({
          query: prompt,
          lang: 'vi',
          history: [],
        }),
      });

      // Smax upstream (Azure OpenAI) may return HTTP 200 with error JSON body
      // e.g. {"error": "OpenAI API Error", "message": "400 Provider API error..."}
      let rawText = '';
      try {
        const data = await response.json();
        // If Smax returns an error-formatted response, surface it
        if (data.error || data.message) {
          throw new Error(data.message || data.error || `Smax API error ${response.status}`);
        }
        rawText = data.text || '';
      } catch (parseOrApiErr) {
        // re-throw if it's our intentional API error
        if (parseOrApiErr.message.startsWith('Smax') || parseOrApiErr.message.includes('Provider API error')) {
          throw parseOrApiErr;
        }
        // For truly unparseable bodies (empty / not JSON)
        if (response.ok) {
          rawText = '';
        } else {
          const fallbackText = await response.text().catch(() => 'Unknown error');
          throw new Error(`API ${response.status}: ${fallbackText}`);
        }
      }

      if (aborted) return;

      const cleanText = rawText
        .replace(/\[THINKING\][\s\S]*?\[\/THINKING\]/g, '\n\n')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/^---+\s*$/gm, '')
        .trim();

      if (aborted) return;

      // Parse JSON actions (full object)
      let actions = [];
      const jsonStart = cleanText.indexOf('{');
      const jsonEnd = cleanText.lastIndexOf('}');

      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const jsonCandidate = cleanText.slice(jsonStart, jsonEnd + 1);
        try {
          const parsed = JSON.parse(jsonCandidate);
          if (parsed.actions && Array.isArray(parsed.actions)) {
            actions = normalizeSmaxActions(parsed.actions);
          }
        } catch {
          actions = extractActionsFromText(cleanText);
        }
      } else {
        actions = extractActionsFromText(cleanText);
      }

      if (aborted) return;

      // Preview: "X hành động được gợi ý" — simulate typing
      const preview = actions.length > 0
        ? `${actions.length} hành động được gợi ý`
        : 'Đang xử lý…';

      let i = 0;
      const step = () => {
        if (aborted) return;
        const end = Math.min(i + 3 + Math.floor(Math.random() * 3), preview.length);
        if (i >= preview.length) {
          onDone?.(actions);
          return;
        }
        let cut = end;
        while (cut > i && preview[cut] !== ' ' && preview[cut] !== '\n') cut--;
        if (cut === i) cut = end;
        const slice = preview.slice(i, cut || end);
        if (slice) onChunk?.(slice);
        i = cut || end;
        setTimeout(step, 20 + Math.random() * 15);
      };
      step();

    } catch (err) {
      if (!aborted && onError) {
        onError(err);
      }
    }
  })();

  return { abort: () => { aborted = true; } };
}

/**
 * Normalize Smax AI response → internal action schema.
 * Smax returns: { actions: [{ name, description }] }
 * Internal needs:  { title, smax_feature, impact, steps }
 */
function normalizeSmaxActions(rawActions) {
  return rawActions.map(action => {
    // title: prefer name, fallback to first line of description
    const title = action.title || action.name || action.action || '';

    // description: used for steps if no steps[] array
    const desc = action.description || action.content || '';

    // steps: prefer array, else split description into lines
    let steps = [];
    if (Array.isArray(action.steps) && action.steps.length > 0) {
      steps = action.steps;
    } else if (desc) {
      // Split description by sentences or newlines
      steps = desc
        .split(/[.。]\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 10)
        .slice(0, 4);
    }

    // smax_feature: from field, or try to extract from description
    let smax_feature = action.smax_feature || '';
    if (!smax_feature && desc) {
      // Look for feature mentions in description
      const featMatch = desc.match(/(?:tinh nang|Smax|Chatbot|Trigger|AI|Ecom|Messenger|Ads)[^\n.]{0,40}/i);
      if (featMatch) smax_feature = featMatch[0].replace(/[.。,]$/, '').trim();
    }
    if (!smax_feature) smax_feature = 'Tinh nang Smax';

    // impact: prefer field, else try extract ↑/↓ from description
    let impact = action.impact || '';
    if (!impact && desc) {
      const impactMatch = desc.match(/(?:↑|↑|tang|giam|↑)[^,.。]{0,25}/);
      if (impactMatch) impact = impactMatch[0].trim();
    }

    return {
      title: title.slice(0, 80),
      smax_feature,
      impact,
      steps,
    };
  });
}

/**
 * Fallback: extract actions từ plain text khi JSON parse fail.
 * Được gọi khi Smax AI trả về markdown thay vì JSON.
 */
function extractActionsFromText(text) {
  // 1. Remove JSON blocks (to avoid "1." inside JSON corrupting extraction)
  const withoutJson = text.replace(/\{[\s\S]*?\}/g, '');

  // 2. Also strip markdown links [text](url) → text
  const cleaned = withoutJson
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\n{3,}/g, '\n\n');

  const actions = [];

  // ── Strategy A: numbered list items ──────────────────────────────────
  const numberedBlocks = cleaned.split(/(?:\n|^)\s*(?:\d{1,2}\.)\s+/);
  for (const block of numberedBlocks) {
    const lines = block.trim().split('\n').filter(l => l.trim());
    if (lines.length === 0) continue;

    const titleLine = lines[0]
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/^[-•]\s*/, '')
      .replace(/\.$/, '')
      .trim();

    // Skip noise
    if (!titleLine || titleLine.length < 10 || titleLine.startsWith('"') || titleLine.startsWith('{') || titleLine.toLowerCase().includes('tạm thời') || titleLine.toLowerCase().includes('không có')) continue;

    const steps = [];
    for (const line of lines.slice(1)) {
      const stepText = line
        .replace(/^[•\-\d.)\s]+/, '')
        .replace(/\*\*/g, '')
        .replace(/^\s*[-–]\s*/, '')
        .trim();
      if (stepText && stepText.length > 5 && stepText.length < 150) {
        steps.push(stepText);
      }
    }

    // Try to extract smax_feature if link text mentions Smax/tính năng
    let smax_feature = '';
    let impact = '';
    const fullBlock = lines.join(' ');
    if (fullBlock.toLowerCase().includes('smax') || fullBlock.toLowerCase().includes('tính năng')) {
      const linkMatch = fullBlock.match(/\[([^\]]+)\]/g);
      if (linkMatch) {
        const last = linkMatch[linkMatch.length - 1].replace(/[\[\]]/g, '');
        if (!last.includes('http')) smax_feature = last;
      }
    }

    // Try to extract impact from parentheses: ↑ 15%, ↓ 20%
    const impactMatch = titleLine.match(/(?:↑|↓|↑|⇧)([^,。.]+)/);
    if (impactMatch) impact = impactMatch[0].trim();

    actions.push({
      title: titleLine.slice(0, 80),
      smax_feature: smax_feature || 'Tính năng Smax',
      impact: impact || '',
      steps: steps.slice(0, 4),
    });
  }

  // ── Strategy B: bullet blocks if A gave nothing ─────────────────────
  if (actions.length === 0) {
    const bulletBlocks = cleaned.split(/(?:\n|^)\s*[•\-–]\s+/);
    for (const block of bulletBlocks) {
      const lines = block.trim().split('\n').filter(l => l.trim());
      if (lines.length === 0) continue;
      const titleLine = lines[0].replace(/\*\*/g, '').replace(/\*/g, '').trim();
      if (!titleLine || titleLine.length < 10) continue;
      const steps = lines.slice(1, 5)
        .map(l => l.replace(/^[•\-\d.)\s]+/, '').replace(/\*\*/g, '').trim())
        .filter(s => s.length > 5);
      actions.push({
        title: titleLine.slice(0, 80),
        smax_feature: 'Tính năng Smax',
        impact: '',
        steps: steps.slice(0, 3),
      });
    }
  }

  // ── Strategy C: paragraph-style (when Smax returns prose) ────────────
  if (actions.length === 0) {
    // Split into sentences, find ones that look like action recommendations
    const sentences = cleaned.split(/[.。]\s+/).filter(s => s.trim().length > 20);
    for (const sentence of sentences.slice(0, 6)) {
      const clean = sentence.trim().replace(/\*\*/g, '');
      // Skip sentences that are just explanations/intro
      if (clean.length < 15) continue;
      if (clean.toLowerCase().includes('tuy nhiên') && clean.length < 40) continue;
      if (clean.toLowerCase().startsWith('nếu bạn')) continue;
      actions.push({
        title: clean.slice(0, 80),
        smax_feature: 'Tính năng Smax',
        impact: '',
        steps: [],
      });
    }
  }

  return actions.slice(0, 3);
}

// ─── High-level: cached call ────────────────────────────────────────────────

/**
 * Gọi AI cho 1 nhóm bệnh, có cache.
 * Cache HIT  → simulate streaming từ text đã lưu
 * Cache MISS → gọi API thật
 *
 * @param {object} opts
 * @param {object} opts.disease
 * @param {string} opts.industry
 * @param {string} opts.industryLabel
 * @param {object[]} opts.topObjections
 * @param {object[]} opts.topMistakes
 * @param {function} opts.onChunk
 * @param {function} opts.onDone
 * @param {function} opts.onError
 * @returns {{ cached: boolean, controller: { abort: () => void }|null }}
 */
export function askSmaxForDisease({
  disease,
  industry,
  industryLabel,
  topObjections = [],
  topMistakes = [],
  onChunk,
  onDone,
  onError,
}) {
  // 1. Cache HIT → simulate streaming
  const cached = readCache(industry, disease.id);
  if (cached !== null) {
    // Cache stores the AI response text; parse it back to actions
    let actions = [];
    const jsonStart = cached.indexOf('{');
    const jsonEnd = cached.lastIndexOf('}');
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      try {
        const parsed = JSON.parse(cached.slice(jsonStart, jsonEnd + 1));
        if (parsed.actions && Array.isArray(parsed.actions)) {
          actions = normalizeSmaxActions(parsed.actions);
        }
      } catch {
        actions = extractActionsFromText(cached);
      }
    } else {
      actions = extractActionsFromText(cached);
    }

    const preview = actions.length > 0
      ? `${actions.length} hành động được gợi ý`
      : 'Chưa có hành động gợi ý';

    // Simulate streaming the preview text
    const chunks = preview.match(/[\s\S]{1,6}(?:\s|$)|[\s\S]{1,6}$/g) || [preview];
    let idx = 0;
    const tick = () => {
      if (idx < chunks.length) {
        onChunk?.(chunks[idx]);
        idx++;
        setTimeout(tick, 12);
      } else {
        onDone?.(actions); // ← FIX: pass parsed actions so panel gets data
      }
    };
    setTimeout(tick, 0);
    return { cached: true, controller: null };
  }

  // 2. Cache MISS → real API call
  const prompt = buildDiseasePrompt({ disease, industryLabel, topObjections, topMistakes });

  const { abort } = askSmaxAI(prompt, {
    onChunk,
    onError: (err) => {
      onError?.(err);
    },
    onDone,
  });

  return { cached: false, controller: { abort } };
}

/**
 * Lưu full response vào cache (gọi sau khi streaming xong).
 */
export function cacheSmaxResponse(industry, diseaseId, fullText) {
  writeCache(industry, diseaseId, fullText);
}

/**
 * Xóa cache (khi data thay đổi).
 */
export { clearCache };

// ─── Roadmap AI: generate context-aware sub-tasks ───────────────────────────

const ROADMAP_AI_CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

function getRoadmapAICacheKey(industry, jobId) {
  return `roadmap-ai-subtasks-${industry}-${jobId}`;
}

function readRoadmapAICache(industry, jobId) {
  try {
    const raw = localStorage.getItem(getRoadmapAICacheKey(industry, jobId));
    if (!raw) return null;
    const { data, fetchedAt } = JSON.parse(raw);
    if (Date.now() - fetchedAt > ROADMAP_AI_CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function writeRoadmapAICache(industry, jobId, data) {
  try {
    localStorage.setItem(getRoadmapAICacheKey(industry, jobId), JSON.stringify({
      data,
      fetchedAt: Date.now(),
    }));
  } catch {
    // ignore
  }
}

/**
 * Build prompt for roadmap sub-task generation.
 * @param {object} opts
 * @param {object} opts.disease       — { label, score, severity }
 * @param {object} opts.job           — { id, title }
 * @param {string} opts.industryLabel  — e.g. 'Thời trang'
 * @returns {string}
 */
function buildRoadmapPrompt({ disease, job, industryLabel }) {
  return [
    `Ban la chuyen gia marketing va cham soc khach hang cho nghanh ${industryLabel}.`,
    `Nhom chi so "${disease.label}" hien tai co diem ${disease.score}/10, muc do ${disease.severity}.`,
    `Hay de xuat 3-4 dau viec cu the de hoan thanh: "${job.title}".`,
    `Tra loi DUNG DINH DANG JSON sau, khong co gi khac ngoai JSON:`,
    `{"subTasks":[{"title":"Ten dau viec ngắn gon (dưới 60 ký tự)","estimatedDays":1,"notes":"Ghi chú ngắn nếu cần"}]}`,
    `estimatedDays: 1-5 ngày.`,
  ].join(' ');
}

/**
 * Parse AI response for roadmap sub-tasks.
 */
function parseRoadmapSubTasksResponse(text) {
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart < 0 || jsonEnd <= jsonStart) return null;
  try {
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    if (Array.isArray(parsed.subTasks) && parsed.subTasks.length > 0) {
      return parsed.subTasks.map((st, i) => ({
        id: `ai-st-${Date.now()}-${i}`,
        title: (st.title || '').slice(0, 80),
        estimatedDays: Math.min(5, Math.max(1, parseInt(st.estimatedDays, 10) || 1)),
        notes: st.notes || '',
        isAI: true,
      }));
    }
  } catch {
    // try text fallback below
  }
  return null;
}

/**
 * Generate sub-tasks for a specific job using SMAX AI.
 * Falls back to null if AI fails → caller uses static sub-tasks.
 *
 * @param {object} opts
 * @param {object} opts.disease
 * @param {object} opts.job
 * @param {string} opts.industry
 * @param {string} opts.industryLabel
 * @returns {Promise<Array|null>}
 */
export async function generateRoadmapSubTasks({ disease, job, industry, industryLabel }) {
  // 1. Cache check
  const cached = readRoadmapAICache(industry, job.id);
  if (cached) return cached;

  // 2. Call AI
  const prompt = buildRoadmapPrompt({ disease, job, industryLabel });

  try {
    const response = await fetch(SMAX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': SMAX_API_KEY,
      },
      body: JSON.stringify({
        query: prompt,
        lang: 'vi',
        history: [],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawText = (data.text || data.error || '').toString().trim();

    if (!rawText || rawText.includes('error')) {
      return null;
    }

    const cleanText = rawText
      .replace(/\[THINKING\][\s\S]*?\[\/THINKING\]/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .trim();

    const subTasks = parseRoadmapSubTasksResponse(cleanText);

    if (subTasks && subTasks.length > 0) {
      writeRoadmapAICache(industry, job.id, subTasks);
      return subTasks;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Batch-generate sub-tasks for all jobs using SMAX AI.
 * Runs in parallel, respects cache, returns map { [jobId]: subTasks[] }.
 *
 * @param {object} opts
 * @param {object[]} opts.jobs
 * @param {object} opts.disease
 * @param {string} opts.industry
 * @param {string} opts.industryLabel
 * @returns {Promise<Record<string, Array>>}
 */
export async function generateAllRoadmapSubTasks({ jobs, disease, industry, industryLabel }) {
  const results = {};

  await Promise.allSettled(
    jobs.map(async (job) => {
      const subTasks = await generateRoadmapSubTasks({ disease, job, industry, industryLabel });
      if (subTasks) results[job.id] = subTasks;
    })
  );

  return results;
}
