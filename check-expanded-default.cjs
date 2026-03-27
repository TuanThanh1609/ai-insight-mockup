const { chromium } = require('@playwright/test');

(async () => {
  const base = process.env.TEST_URL || 'http://127.0.0.1:4175';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1536, height: 960 } });

  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(`${base}/insight/medical-checkup`, { waitUntil: 'networkidle' });

  await page.locator('button:has-text("Kết nối Fanpage")').first().click();
  await page.waitForTimeout(2500);
  await page.locator('button:has-text("Chọn ngành hàng")').first().click();
  await page.locator('button:has-text("Mẹ và Bé")').first().click();
  await page.locator('textarea[placeholder*="Mô tả ngắn"]').first().fill('Mẹ bỉm 24-50');
  await page.locator('button:has-text("Tiếp tục")').first().click();
  await page.locator('button:has-text("Bắt đầu Khám")').first().click();

  await page.waitForSelector('text=Chất Lượng Leads', { timeout: 20000 });
  await page.waitForTimeout(1500);

  const collapseCount = await page.locator('button:has-text("Thu gọn")').count();
  const detailTabCount = await page.locator('button:has-text("Chi tiết")').count();

  console.log('=== DEFAULT MODE CHECK ===');
  console.log('collapseCount:', collapseCount);
  console.log('detailTabCount:', detailTabCount);
  console.log('consoleErrors:', errors.length);
  if (errors.length) console.log(errors);

  await browser.close();
})();
