/**
 * mockAttributionData.js
 *
 * Mock customer journey attribution data: Ads → Conversation → Order
 * Each row = 1 attributed order linked via phone hash.
 *
 * Deterministic: seeded by row index using sr() from medicalService.js
 */

import { mockCampaigns } from './mockCampaigns';

// ─── Campaign Reference Map ────────────────────────────────────────────────

const CAMP = mockCampaigns.reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {});

// ─── Seeded PRNG (sine-based, same as medicalService.js) ─────────────────

function sr(seed) {
  let s = Math.sin(seed * 9301 + 49297) * 233280;
  return s - Math.floor(s);
}

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Deterministic count 50–80 based on a fixed seed. */
function getRowCount() {
  return 50 + Math.floor(sr(777) * 31); // 50–80
}

/** VN phone masked: 0912***789 */
function maskPhone(area, prefix, suffix) {
  return `${area}${prefix}***${suffix}`;
}

/** Deterministic phone hash from row index. */
function makePhoneHash(rowIndex) {
  const h = Math.abs(Math.floor(Math.sin(rowIndex * 12345 + 67890) * 99999));
  const hex = h.toString(16).padStart(12, '0').substring(0, 12); // always 12 hex chars
  return `sha256_${hex}`;
}

/** Deterministic VN phone digits from row index.
 *  Format: 091x***y789  (first 4 digits visible, last 3 visible, 4 masked)
 *  Regex: /^\d{4}\*\*\*\d{3}$/
 */
function makePhone(rowIndex) {
  const r0 = sr(rowIndex * 3 + 1);
  const r1 = sr(rowIndex * 7 + 5);
  const r2 = sr(rowIndex * 13 + 9);

  const areas = ['091', '090', '093', '094', '097', '098', '086', '089'];
  const area = areas[Math.floor(r0 * areas.length)];                   // 3 digits
  const mid = Math.floor(r1 * 10).toString();                           // 4th digit (0–9)
  const last3 = Math.floor(r2 * 900 + 100).toString().slice(-3);        // last 3 digits (100–999)
  return `${area}${mid}***${last3}`; // e.g. 0912***789
}

/** Deterministic order value 200K–2M VND. */
function makeOrderValue(rowIndex) {
  const r = sr(rowIndex * 17 + 3);
  return Math.floor(200000 + r * 1800000);
}

/** Deterministic platform: 70% facebook, 30% zalo. */
function makePlatform(rowIndex) {
  return sr(rowIndex * 23 + 7) < 0.70 ? 'facebook' : 'zalo';
}

/** Deterministic days-to-conversion:
 *  60% → 0–7 days
 *  30% → 8–14 days
 *  10% → 15–30 days
 */
function makeDaysToConversion(rowIndex) {
  const r = sr(rowIndex * 31 + 11);
  if (r < 0.60) return Math.floor(sr(rowIndex * 37 + 13) * 8);        // 0–7
  if (r < 0.90) return 8 + Math.floor(sr(rowIndex * 41 + 17) * 7);    // 8–14
  return 15 + Math.floor(sr(rowIndex * 43 + 19) * 16);                // 15–30
}

/** Make a campaign reference (first-touch or last-touch). */
function makeTouch(rowIndex, touchSeed, isFirst) {
  const campIds = ['camp-1', 'camp-2', 'camp-3', 'camp-4', 'camp-5', 'camp-6'];
  const campIdx = Math.floor(sr(rowIndex * touchSeed + 7) * campIds.length);
  const campId = campIds[campIdx];
  const camp = CAMP[campId];

  const platform = camp.platform;
  const adPrefix = platform === 'facebook' ? 'FB' : 'ZL';
  const adIdx = Math.floor(sr(rowIndex * touchSeed + 13) * 10) + 1;
  const adId = `${adPrefix}-AD-${String(adIdx).padStart(3, '0')}`;

  const adNames = {
    'camp-1': 'Spring Sale - Carousel - 1',
    'camp-2': 'Retargeting - Cart Abandoned',
    'camp-3': 'Brand Awareness March',
    'camp-4': 'Summer Collection Test',
    'camp-5': 'New Product Launch',
    'camp-6': 'Flash Sale Weekend',
  };

  return {
    campaignId: campId,
    campaignName: camp.name,
    platform,
    adId,
    adName: adNames[campId] || `${camp.name} - Ad ${adIdx}`,
  };
}

/** Make touches array (1–4 events). */
function makeTouches(rowIndex) {
  const count = 1 + Math.floor(sr(rowIndex * 53 + 3) * 4); // 1–4
  const campIds = ['camp-1', 'camp-2', 'camp-3', 'camp-4', 'camp-5', 'camp-6'];
  const touchTypes = ['impression', 'click'];

  const touches = [];

  // First touch
  const first = makeTouch(rowIndex, 61, true);
  touches.push({
    ...first,
    touchDate: null, // filled after ordering by time
    type: 'impression',
  });

  for (let i = 1; i < count; i++) {
    const campIdx = Math.floor(sr(rowIndex * 71 + i * 17 + 5) * campIds.length);
    const campId = campIds[campIdx];
    const camp = CAMP[campId];
    const platform = camp.platform;
    const adPrefix = platform === 'facebook' ? 'FB' : 'ZL';
    const adIdx = Math.floor(sr(rowIndex * 83 + i * 19 + 11) * 10) + 1;
    const adId = `${adPrefix}-AD-${String(adIdx).padStart(3, '0')}`;

    const adNames = {
      'camp-1': 'Spring Sale - Carousel',
      'camp-2': 'Retargeting - 20% Off',
      'camp-3': 'Zalo OA - Brand Post',
      'camp-4': 'Summer Collection - Banner',
      'camp-5': 'New Product - Video Ad',
      'camp-6': 'Flash Sale - Countdown',
    };

    touches.push({
      campaignId: campId,
      campaignName: camp.name,
      platform,
      adId,
      adName: adNames[campId] || `${camp.name} - Ad ${adIdx}`,
      touchDate: null,
      type: i === count - 1 ? 'click' : (sr(rowIndex * 97 + i * 23 + 7) < 0.5 ? 'click' : 'impression'),
    });
  }

  return touches;
}

/** ~20% untracked (null matchedConversationId). */
function makeMatchedConversation(rowIndex, campaignPlatform) {
  const tracked = sr(rowIndex * 41 + 29) > 0.20;
  if (!tracked) return { id: null, temp: null, date: null };

  const temps = ['Nóng', 'Nóng', 'Nóng', 'Ấm', 'Ấm', 'Ấm', 'Lạnh'];
  const tempIdx = Math.floor(sr(rowIndex * 47 + 31) * temps.length);
  const temp = temps[tempIdx];

  return {
    id: `fsh-1-row-${String(rowIndex * 3 + 42).padStart(3, '0')}`,
    temp,
    date: null,
  };
}

/** Build a single attribution row. */
function buildRow(rowIndex) {
  const id = `attr-${String(rowIndex + 1).padStart(3, '0')}`;

  const phoneHash = makePhoneHash(rowIndex);
  const phone = makePhone(rowIndex);
  const platform = makePlatform(rowIndex);
  const orderValue = makeOrderValue(rowIndex);
  const daysToConversion = makeDaysToConversion(rowIndex);

  // Order date: random in March 2026, anchored to last touch
  const orderDayOffset = Math.floor(sr(rowIndex * 59 + 37) * 12) + 10; // 10–21 March
  const orderHour = Math.floor(sr(rowIndex * 61 + 41) * 14) + 8;        // 08–21
  const orderMinute = Math.floor(sr(rowIndex * 67 + 43) * 60);
  const orderSecond = Math.floor(sr(rowIndex * 71 + 47) * 60);
  const orderDate = new Date(2026, 2, orderDayOffset, orderHour, orderMinute, orderSecond);

  const orderId = `ORD-202603${String(orderDayOffset).padStart(2, '0')}-${String(rowIndex + 1).padStart(3, '0')}`;

  // First touch
  const firstTouchBase = makeTouch(rowIndex, 79, true);
  const firstTouchDaysBack = daysToConversion + Math.floor(sr(rowIndex * 73 + 39) * 10);
  const firstTouchDate = new Date(orderDate);
  firstTouchDate.setDate(firstTouchDate.getDate() - firstTouchDaysBack);
  firstTouchDate.setHours(
    Math.floor(sr(rowIndex * 73 + 39) * 14) + 8,
    Math.floor(sr(rowIndex * 79 + 41) * 60),
    Math.floor(sr(rowIndex * 83 + 43) * 60)
  );

  // Last touch: always closer to order (within daysToConversion)
  const lastTouchDaysBack = Math.floor(sr(rowIndex * 89 + 51) * (daysToConversion + 1));
  const lastTouchDate = new Date(orderDate);
  lastTouchDate.setDate(lastTouchDate.getDate() - lastTouchDaysBack);
  lastTouchDate.setHours(
    Math.floor(sr(rowIndex * 89 + 51) * 14) + 8,
    Math.floor(sr(rowIndex * 97 + 53) * 60),
    Math.floor(sr(rowIndex * 101 + 57) * 60)
  );

  // Build touches
  const touches = makeTouches(rowIndex);

  // Assign dates to touches in chronological order
  // touch[0] = first (earliest), last touch = touch[last]
  const totalTouchDuration = daysToConversion; // days spread over all touches

  for (let t = 0; t < touches.length; t++) {
    const tDate = new Date(firstTouchDate);
    if (touches.length > 1) {
      const fraction = t / (touches.length - 1);
      const daysOffset = Math.round(fraction * totalTouchDuration);
      tDate.setDate(firstTouchDate.getDate() + daysOffset);
    }
    // Small hour offset per touch
    tDate.setHours(
      (firstTouchDate.getHours() + t * 2) % 24,
      Math.floor(sr(rowIndex * 109 + t * 31 + 7) * 60),
      Math.floor(sr(rowIndex * 113 + t * 37 + 11) * 60)
    );
    touches[t] = { ...touches[t], touchDate: tDate.toISOString() };
  }

  // Sort touches by time
  touches.sort((a, b) => new Date(a.touchDate) - new Date(b.touchDate));

  // Campaign for this row (first touch campaign)
  const campaignId = firstTouchBase.campaignId;
  const campaign = CAMP[campaignId] || CAMP['camp-1'];

  // Attributed ROAS = campaign ROAS × (0.6–1.0)
  const attributedRoasMultiplier = 0.6 + sr(rowIndex * 127 + 61) * 0.4;
  const attributedRoas = parseFloat((campaign.roas * attributedRoasMultiplier).toFixed(2));

  // Matched conversation
  const matched = makeMatchedConversation(rowIndex, platform);
  const matchedDate = matched.id
    ? new Date(orderDate.getTime() - 1000 * 60 * (Math.floor(sr(rowIndex * 131 + 67) * 30) + 5))
    : null;

  return {
    id,
    phoneHash,
    phone,
    platform,
    orderId,
    orderValue,
    orderDate: orderDate.toISOString(),
    revenue: orderValue,

    firstTouch: {
      ...firstTouchBase,
      touchDate: firstTouchDate.toISOString(),
      daysToConversion,
    },

    lastTouch: {
      ...makeTouch(rowIndex, 131, false),
      touchDate: lastTouchDate.toISOString(),
      daysToConversion: lastTouchDaysBack,
    },

    touches,

    matchedConversationId: matched.id,
    matchedConversationTemp: matched.temp,
    conversationDate: matchedDate ? matchedDate.toISOString() : null,

    campaignId,
    campaignPlatform: campaign.platform,
    campaignBudget: campaign.budget,
    campaignSpend: campaign.spend,
    campaignRoas: campaign.roas,
    attributedRoas,
  };
}

// ─── Build Dataset ─────────────────────────────────────────────────────────

const TOTAL = getRowCount();

const mockAttributionData = Array.from({ length: TOTAL }, (_, i) => buildRow(i));

// ─── Filter Function ──────────────────────────────────────────────────────

/**
 * Filter attribution rows by campaign IDs and/or date range.
 * @param {string[]} [campaignIds]  — e.g. ['camp-1', 'camp-2']
 * @param {{ start: Date, end: Date }} [dateRange]
 * @returns {object[]}
 */
export function getAttributionData(campaignIds, dateRange) {
  let result = mockAttributionData;

  if (campaignIds && campaignIds.length > 0) {
    result = result.filter(row => campaignIds.includes(row.campaignId));
  }

  if (dateRange && dateRange.start && dateRange.end) {
    const start = dateRange.start instanceof Date ? dateRange.start : new Date(dateRange.start);
    const end = dateRange.end instanceof Date ? dateRange.end : new Date(dateRange.end);
    result = result.filter(row => {
      const d = new Date(row.orderDate);
      return d >= start && d <= end;
    });
  }

  return result;
}

// ─── Inline Tests (Node.js) ────────────────────────────────────────────────

function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition, msg) {
    if (condition) {
      passed++;
      console.log(`  ✅ ${msg}`);
    } else {
      failed++;
      console.error(`  ❌ FAIL: ${msg}`);
    }
  }

  console.log('\n── mockAttributionData Tests ───────────────────────────────────');

  // Test 1: Correct row count (50–80)
  const count = mockAttributionData.length;
  assert(count >= 50 && count <= 80, `Row count ${count} is in range 50–80`);

  // Test 2: All rows have required fields
  const required = ['id', 'phoneHash', 'phone', 'platform', 'orderId', 'orderValue',
    'orderDate', 'revenue', 'firstTouch', 'lastTouch', 'touches',
    'matchedConversationId', 'matchedConversationTemp',
    'campaignId', 'campaignPlatform', 'campaignBudget', 'campaignSpend',
    'campaignRoas', 'attributedRoas'];
  for (const row of mockAttributionData) {
    for (const field of required) {
      assert(row[field] !== undefined, `Row ${row.id} has field "${field}"`);
    }
  }

  // Test 3: Phone is masked correctly (3 digits + *** + 3 digits)
  for (const row of mockAttributionData) {
    assert(/^\d{3}\*\*\*\d{3}$/.test(row.phone), `Row ${row.id} phone "${row.phone}" is masked correctly`);
  }

  // Test 4: Platform is facebook or zalo
  for (const row of mockAttributionData) {
    assert(['facebook', 'zalo'].includes(row.platform), `Row ${row.id} platform "${row.platform}" is valid`);
  }

  // Test 5: Order value in 200K–2M VND
  for (const row of mockAttributionData) {
    assert(row.orderValue >= 200000 && row.orderValue <= 2000000,
      `Row ${row.id} orderValue ${row.orderValue} is in range`);
  }

  // Test 6: Revenue === orderValue
  for (const row of mockAttributionData) {
    assert(row.revenue === row.orderValue, `Row ${row.id} revenue === orderValue`);
  }

  // Test 7: firstTouch.date before lastTouch.date
  for (const row of mockAttributionData) {
    assert(new Date(row.firstTouch.touchDate) <= new Date(row.lastTouch.touchDate),
      `Row ${row.id} firstTouch before lastTouch`);
  }

  // Test 8: touches is sorted by time
  for (const row of mockAttributionData) {
    for (let i = 1; i < row.touches.length; i++) {
      assert(
        new Date(row.touches[i - 1].touchDate) <= new Date(row.touches[i].touchDate),
        `Row ${row.id} touches[${i - 1}] <= touches[${i}]`
      );
    }
  }

  // Test 9: firstTouch is first touch in array
  for (const row of mockAttributionData) {
    if (row.touches.length > 0) {
      assert(
        row.firstTouch.campaignId === row.touches[0].campaignId,
        `Row ${row.id} firstTouch campaign matches touches[0]`
      );
    }
  }

  // Test 10: lastTouch is last touch in array
  for (const row of mockAttributionData) {
    if (row.touches.length > 0) {
      assert(
        row.lastTouch.campaignId === row.touches[row.touches.length - 1].campaignId,
        `Row ${row.id} lastTouch campaign matches touches[last]`
      );
    }
  }

  // Test 11: ~20% untracked
  const untracked = mockAttributionData.filter(r => r.matchedConversationId === null).length;
  const untrackedPct = (untracked / count * 100).toFixed(1);
  assert(untracked >= 1 && untracked <= Math.ceil(count * 0.35),
    `Untracked rows ${untracked}/${count} (${untrackedPct}%) is within expected ~20% range`);

  // Test 12: matchedConversationTemp only when tracked
  for (const row of mockAttributionData) {
    if (row.matchedConversationId === null) {
      assert(row.matchedConversationTemp === null,
        `Row ${row.id} temp is null when untracked`);
    } else {
      assert(['Nóng', 'Ấm', 'Lạnh'].includes(row.matchedConversationTemp),
        `Row ${row.id} temp "${row.matchedConversationTemp}" is valid`);
    }
  }

  // Test 13: attributedRoas is within 60–100% of campaignRoas
  for (const row of mockAttributionData) {
    const ratio = row.attributedRoas / row.campaignRoas;
    assert(ratio >= 0.59 && ratio <= 1.01,
      `Row ${row.id} attributedRoas ${row.attributedRoas} / ${row.campaignRoas} = ${ratio.toFixed(2)} in range`);
  }

  // Test 14: orderId format
  for (const row of mockAttributionData) {
    assert(/^ORD-202603\d{2}-\d{3,}$/.test(row.orderId),
      `Row ${row.id} orderId "${row.orderId}" format is valid`);
  }

  // Test 15: campaignId exists in mockCampaigns
  for (const row of mockAttributionData) {
    assert(CAMP[row.campaignId] !== undefined,
      `Row ${row.id} campaignId "${row.campaignId}" exists in mockCampaigns`);
  }

  // Test 16: getAttributionData filter by campaignIds
  const filtered = getAttributionData(['camp-1']);
  assert(filtered.length <= count && filtered.every(r => r.campaignId === 'camp-1'),
    `getAttributionData(['camp-1']) returns ${filtered.length} rows all camp-1`);

  // Test 17: getAttributionData filter by dateRange
  const dateRangeResult = getAttributionData([], {
    start: new Date('2026-03-10'),
    end: new Date('2026-03-15'),
  });
  assert(
    dateRangeResult.length <= count &&
    dateRangeResult.every(r => {
      const d = new Date(r.orderDate);
      return d >= new Date('2026-03-10') && d <= new Date('2026-03-15');
    }),
    `getAttributionData(dateRange) returns ${dateRangeResult.length} rows within range`
  );

  // Test 18: Deterministic — same seed produces same data
  const original = mockAttributionData[0].phone;
  assert(original === mockAttributionData[0].phone,
    'Data is deterministic (first row phone unchanged on re-run)');

  // Test 19: daysToConversion consistency
  for (const row of mockAttributionData) {
    const diff = Math.round(
      (new Date(row.orderDate) - new Date(row.firstTouch.touchDate)) / 86400000
    );
    assert(
      Math.abs(diff - row.firstTouch.daysToConversion) <= 1,
      `Row ${row.id} daysToConversion ${row.firstTouch.daysToConversion} ≈ actual diff ${diff}`
    );
  }

  // Test 20: touches has 1–4 events
  for (const row of mockAttributionData) {
    assert(
      row.touches.length >= 1 && row.touches.length <= 4,
      `Row ${row.id} touches count ${row.touches.length} is 1–4`
    );
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log(`\n  Results: ${passed} passed / ${failed} failed`);
  if (failed > 0) {
    console.error(`  ${failed} test(s) FAILED — fix before committing.`);
    process.exit(1);
  } else {
    console.log('  All tests passed! ✅\n');
  }
}

runTests();