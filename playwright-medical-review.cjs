const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1536, height: 960 } });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  const baseUrl = process.env.TEST_URL || 'http://localhost:5173';
  const url = `${baseUrl}/insight/medical-checkup`;
  await page.goto(url, { waitUntil: 'networkidle' });

  // Step 1
  await page.locator('button:has-text("Kết nối Fanpage")').first().click();
  await page.waitForTimeout(2500);

  // Step 2
  await page.locator('button:has-text("Chọn ngành hàng")').first().click();
  await page.locator('button:has-text("Mẹ và Bé")').first().click();
  await page.locator('textarea[placeholder*="Mô tả ngắn"]').first().fill('Mẹ bỉm 24-50, mua online định kỳ');
  await page.locator('button:has-text("Tiếp tục")').first().click();

  // Step 3
  await page.locator('button:has-text("Bắt đầu Khám")').first().click();

  // Step 4 -> Step 5
  await page.waitForTimeout(4500);
  await page.waitForSelector('text=Chất Lượng Leads', { timeout: 20000 });

  // Verify key UI blocks exist
  const checks = {
    leadsDashboard: await page.locator('text=Chất Lượng Leads').count(),
    metric1: await page.locator('text=Leads rác').count(),
    metric2: await page.locator('text=Thu thập SĐT').count(),
    metric3: await page.locator('text=Tỉ lệ chốt đơn').count(),
    metric4: await page.locator('text=Khách hàng cũ quay lại').count(),
    alertsPanel: await page.locator('text=Cảnh báo khẩn').count(),
    smaxPanel: await page.locator('text=Gợi ý Smax').count(),
    hasTabs: await page.locator('button:has-text("Tổng quan")').count(),
    hasDetailTab: await page.locator('button:has-text("Chi tiết")').count(),
  };

  // Expand first disease and open detail tab
  const firstExpand = page.locator('button:has-text("Xem chi tiết →")').first();
  if (await firstExpand.count()) {
    await firstExpand.click();
    await page.waitForTimeout(400);

    const detailTab = page.locator('button:has-text("Chi tiết")').first();
    if (await detailTab.count()) {
      await detailTab.click();
      await page.waitForTimeout(600);
    }
  }

  // Verify conversation list appears
  const conversationSignals = {
    searchInput: await page.locator('input[placeholder*="Tìm kiếm hội thoại"]').count(),
    filterTat: await page.locator('button:has-text("Tất")').count(),
  };

  console.log('=== PLAYWRIGHT REVIEW ===');
  console.log('URL:', url);
  console.log('Checks:', checks);
  console.log('Conversation tab checks:', conversationSignals);
  console.log('Console errors count:', consoleErrors.length);
  if (consoleErrors.length) {
    console.log('Console errors:', consoleErrors);
  }

  await browser.close();
})();
