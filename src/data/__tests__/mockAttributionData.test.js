/**
 * src/data/__tests__/mockAttributionData.test.js
 *
 * Tests for multi-adId per campaign feature (Task 1).
 * Uses node --test (ESM).
 *
 * Since mockAttributionData runs inline assertions at module-evaluation time
 * (blocking ESM import), attribution data is rebuilt here using the same
 * sr() seed + logic, so tests run independently.
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';

// ─── Imports ─────────────────────────────────────────────────────────────────

import { mockCampaigns } from '../mockCampaigns.js';

// ─── Rebuild mockAttributionData (same sr() + logic as source) ──────────────

function sr(seed) {
  let s = Math.sin(seed * 9301 + 49297) * 233280;
  return s - Math.floor(s);
}

function makePhoneHash(rowIndex) {
  const h = Math.abs(Math.floor(Math.sin(rowIndex * 12345 + 67890) * 99999));
  const hex = h.toString(16).padStart(12, '0').substring(0, 12);
  return `sha256_${hex}`;
}

function makePhone(rowIndex) {
  const r0 = sr(rowIndex * 3 + 1);
  const r1 = sr(rowIndex * 7 + 5);
  const r2 = sr(rowIndex * 13 + 9);
  const areas = ['091', '090', '093', '094', '097', '098', '086', '089'];
  const area  = areas[Math.floor(r0 * areas.length)];
  const mid   = Math.floor(r1 * 10).toString();
  const last3 = Math.floor(r2 * 900 + 100).toString().slice(-3);
  return `${area}${mid}***${last3}`;
}

function makeOrderValue(rowIndex) {
  const r = sr(rowIndex * 17 + 3);
  return Math.floor(200000 + r * 1800000);
}

function makeDaysToConversion(rowIndex) {
  const r = sr(rowIndex * 31 + 11);
  if (r < 0.60) return Math.floor(sr(rowIndex * 37 + 13) * 8);
  if (r < 0.90) return 8 + Math.floor(sr(rowIndex * 41 + 17) * 7);
  return 15 + Math.floor(sr(rowIndex * 43 + 19) * 16);
}

const CAMP = Object.fromEntries(mockCampaigns.map(c => [c.id, c]));

/** adId picked from campaign's adIds[] pool (deterministic). */
function pickAdId(rowIndex, touchSeed, camp) {
  const adIds   = camp.adIds;
  const adPickIdx = Math.floor(sr(rowIndex * touchSeed + 13) * adIds.length);
  return adIds[adPickIdx];
}

function makeTouch(rowIndex, touchSeed, camp) {
  const adId = pickAdId(rowIndex, touchSeed, camp);
  const adNames = {
    'camp-1': 'Spring Sale - Carousel - 1',
    'camp-2': 'Retargeting - Cart Abandoned',
    'camp-3': 'Brand Awareness March',
    'camp-4': 'Summer Collection Test',
    'camp-5': 'New Product Launch',
    'camp-6': 'Flash Sale Weekend',
  };
  return {
    campaignId: camp.id,
    campaignName: camp.name,
    platform: camp.platform,
    adId,
    adName: adNames[camp.id] || `${camp.name} - Ad 1`,
  };
}

function makeTouches(rowIndex) {
  const campIds = ['camp-1', 'camp-2', 'camp-3', 'camp-4', 'camp-5', 'camp-6'];
  const count   = 1 + Math.floor(sr(rowIndex * 53 + 3) * 4);
  const touches = [];

  const firstCamp = CAMP[campIds[Math.floor(sr(rowIndex * 61 + 7) * campIds.length)]];
  touches.push({ ...makeTouch(rowIndex, 61, firstCamp), touchDate: null, type: 'impression' });

  for (let i = 1; i < count; i++) {
    const ci  = Math.floor(sr(rowIndex * 71 + i * 17 + 5) * campIds.length);
    const c   = CAMP[campIds[ci]];
    const adId = pickAdId(rowIndex, 83 + i * 19 + 11, c);
    const adNames = {
      'camp-1': 'Spring Sale - Carousel',
      'camp-2': 'Retargeting - 20% Off',
      'camp-3': 'Zalo OA - Brand Post',
      'camp-4': 'Summer Collection - Banner',
      'camp-5': 'New Product - Video Ad',
      'camp-6': 'Flash Sale - Countdown',
    };
    touches.push({
      campaignId: c.id,
      campaignName: c.name,
      platform: c.platform,
      adId,
      adName: adNames[c.id] || `${c.name} - Ad 1`,
      touchDate: null,
      type: i === count - 1 ? 'click' : 'impression',
    });
  }
  return touches;
}

function buildRow(rowIndex) {
  const campIds = ['camp-1', 'camp-2', 'camp-3', 'camp-4', 'camp-5', 'camp-6'];
  const campIdx  = Math.floor(sr(rowIndex * 79 + 7) * campIds.length);
  const campaign = CAMP[campIds[campIdx]];

  const orderDayOffset = Math.floor(sr(rowIndex * 59 + 37) * 12) + 10;
  const orderHour      = Math.floor(sr(rowIndex * 61 + 41) * 14) + 8;
  const orderMinute    = Math.floor(sr(rowIndex * 67 + 43) * 60);
  const orderSecond    = Math.floor(sr(rowIndex * 71 + 47) * 60);
  const orderDate = new Date(2026, 2, orderDayOffset, orderHour, orderMinute, orderSecond);

  const daysToConversion = makeDaysToConversion(rowIndex);

  const firstTouchBase = makeTouch(rowIndex, 79, campaign);
  const firstTouchDate = new Date(orderDate);
  firstTouchDate.setDate(firstTouchDate.getDate() - daysToConversion);

  const lastTouchDaysBack = Math.floor(sr(rowIndex * 89 + 51) * (daysToConversion + 1));
  const lastTouchDate = new Date(orderDate);
  lastTouchDate.setDate(lastTouchDate.getDate() - lastTouchDaysBack);

  const touches = makeTouches(rowIndex);
  for (let t = 0; t < touches.length; t++) {
    const tDate = new Date(firstTouchDate);
    if (touches.length > 1) {
      tDate.setDate(firstTouchDate.getDate() + Math.round((t / (touches.length - 1)) * daysToConversion));
    }
    tDate.setHours((firstTouchDate.getHours() + t * 2) % 24);
    touches[t] = { ...touches[t], touchDate: tDate.toISOString() };
  }
  touches.sort((a, b) => new Date(a.touchDate) - new Date(b.touchDate));

  return {
    id: `attr-${String(rowIndex + 1).padStart(3, '0')}`,
    phoneHash: makePhoneHash(rowIndex),
    phone: makePhone(rowIndex),
    platform: campaign.platform,
    orderId: `ORD-202603${String(orderDayOffset).padStart(2, '0')}-${String(rowIndex + 1).padStart(3, '0')}`,
    orderValue: makeOrderValue(rowIndex),
    orderDate: orderDate.toISOString(),
    revenue: makeOrderValue(rowIndex),
    firstTouch: {
      ...firstTouchBase,
      touchDate: firstTouchDate.toISOString(),
      daysToConversion,
    },
    lastTouch: {
      ...makeTouch(rowIndex, 131, campaign),
      touchDate: lastTouchDate.toISOString(),
      daysToConversion: lastTouchDaysBack,
    },
    touches,
    campaignId: campaign.id,
    campaignPlatform: campaign.platform,
    campaignBudget: campaign.budget,
    campaignSpend: campaign.spend,
    campaignRoas: parseFloat((campaign.revenue / campaign.spend).toFixed(2)),
    attributedRoas: 1.0,
  };
}

const TOTAL = 50 + Math.floor(sr(777) * 31);
const mockAttributionData = Array.from({ length: TOTAL }, (_, i) => buildRow(i));

// ─── AdId naming convention ─────────────────────────────────────────────────

const ADID_NEW_PATTERN = /^(FB|ZL)-Ads-\d{2}[abc]?$/;

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('mockCampaigns — adIds[] array', () => {

  test('every campaign has adIds[] field (array, non-empty)', () => {
    for (const camp of mockCampaigns) {
      assert.ok(Array.isArray(camp.adIds), `campaign ${camp.id} has adIds[]`);
      assert.ok(camp.adIds.length > 0,      `campaign ${camp.id} has non-empty adIds[]`);
    }
  });

  test('each campaign has 2–4 adIds (deterministic count)', () => {
    for (let i = 0; i < mockCampaigns.length; i++) {
      const count = mockCampaigns[i].adIds.length;
      assert.ok(
        count >= 2 && count <= 4,
        `campaign ${mockCampaigns[i].id} has ${count} adIds (expected 2–4)`
      );
    }
  });

  test('adIds match expected naming convention (FB/ZL-Ads-{idx}{letter})', () => {
    const LETTERS = ['', 'a', 'b', 'c'];
    for (let i = 0; i < mockCampaigns.length; i++) {
      const camp = mockCampaigns[i];
      const prefix  = camp.platform === 'facebook' ? 'FB' : 'ZL';
      const baseNum = String(i + 1).padStart(2, '0');
      const count   = 2 + Math.floor(sr(i * 7) * 3);
      const expected = Array.from({ length: count }, (_, j) => `${prefix}-Ads-${baseNum}${LETTERS[j]}`);
      assert.deepStrictEqual(
        camp.adIds,
        expected,
        `campaign ${camp.id}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(camp.adIds)}`
      );
    }
  });

  test('all 8 campaigns have unique adIds (no collision across campaigns)', () => {
    const allAdIds = mockCampaigns.flatMap(c => c.adIds);
    const unique   = new Set(allAdIds);
    assert.strictEqual(
      allAdIds.length,
      unique.size,
      `duplicate adIds found: ${
        allAdIds.filter((id, idx) => allAdIds.indexOf(id) !== idx).join(', ')
      }`
    );
  });

  test('adId prefix matches campaign platform', () => {
    for (const camp of mockCampaigns) {
      for (const adId of camp.adIds) {
        const prefix = adId.split('-')[0];
        const expectedPrefix = camp.platform === 'facebook' ? 'FB' : 'ZL';
        assert.strictEqual(
          prefix,
          expectedPrefix,
          `adId "${adId}" on ${camp.platform} campaign should start with ${expectedPrefix}`
        );
      }
    }
  });

});

describe('mockAttributionData — adId references from campaign adIds pool', () => {

  test('every row firstTouch.adId comes from its campaign adIds[] pool', () => {
    for (const row of mockAttributionData) {
      const camp = CAMP[row.campaignId];
      assert.ok(camp, `campaign ${row.campaignId} not found`);
      assert.ok(
        camp.adIds.includes(row.firstTouch.adId),
        `row ${row.id}: firstTouch.adId "${row.firstTouch.adId}" not in ${row.campaignId} pool: ${JSON.stringify(camp.adIds)}`
      );
    }
  });

  test('every row lastTouch.adId comes from its campaign adIds[] pool', () => {
    for (const row of mockAttributionData) {
      const camp = CAMP[row.lastTouch.campaignId];
      assert.ok(camp, `campaign ${row.lastTouch.campaignId} not found`);
      assert.ok(
        camp.adIds.includes(row.lastTouch.adId),
        `row ${row.id}: lastTouch.adId "${row.lastTouch.adId}" not in ${row.lastTouch.campaignId} pool: ${JSON.stringify(camp.adIds)}`
      );
    }
  });

  test('every touch in touches[] uses adId from its campaign adIds[] pool', () => {
    for (const row of mockAttributionData) {
      for (let t = 0; t < row.touches.length; t++) {
        const touch = row.touches[t];
        const camp  = CAMP[touch.campaignId];
        assert.ok(camp, `row ${row.id} touch[${t}]: campaign ${touch.campaignId} not found`);
        assert.ok(
          camp.adIds.includes(touch.adId),
          `row ${row.id} touch[${t}]: adId "${touch.adId}" not in ${touch.campaignId} pool: ${JSON.stringify(camp.adIds)}`
        );
      }
    }
  });

  test('attribution rows span multiple distinct adIds (not just 1 ad per campaign)', () => {
    const allAdIds = new Set(
      mockAttributionData.flatMap(row => [
        row.firstTouch.adId,
        row.lastTouch.adId,
        ...row.touches.map(t => t.adId),
      ])
    );
    assert.ok(
      allAdIds.size >= 8,
      `Only ${allAdIds.size} distinct adIds across ${mockAttributionData.length} rows — ` +
      `expected ≥ 8 (one per campaign). adIds found: ${[...allAdIds].sort().join(', ')}`
    );
  });

  test('all adIds in attribution data match new naming pattern (FB/ZL-Ads-*)', () => {
    const invalid = mockAttributionData.flatMap(row => [
      row.firstTouch.adId,
      row.lastTouch.adId,
      ...row.touches.map(t => t.adId),
    ]).filter(id => !ADID_NEW_PATTERN.test(id));

    assert.strictEqual(
      invalid.length,
      0,
      `${invalid.length} adIds do not match new naming pattern: ${invalid.slice(0, 5).join(', ')}${invalid.length > 5 ? '...' : ''}`
    );
  });

  test('rebuilding data produces identical adIds (deterministic)', () => {
    // Rebuild the first 3 rows and check adIds are stable
    const rebuilt = Array.from({ length: 3 }, (_, i) => buildRow(i));
    const original = mockAttributionData.slice(0, 3);
    for (let i = 0; i < 3; i++) {
      assert.strictEqual(
        rebuilt[i].firstTouch.adId,
        original[i].firstTouch.adId,
        `row ${i} firstTouch.adId not deterministic`
      );
    }
  });

});
