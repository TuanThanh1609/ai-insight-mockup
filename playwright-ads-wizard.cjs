/**
 * Playwright test: Ads Wizard — Step 4 treo → Dashboard fix
 *
 * Flow:
 * 1. Full conversation wizard → creates medical_history_v2 in localStorage
 * 2. Reload page so getMedicalHistory() picks up the record
 * 3. Click Ads tab (unlocked) → wizard step 1
 * 4. Step 1→2→3→4 (crawl progress)
 * 5. CRITICAL: after crawl 100%, dashboard must appear (not stuck on step 4)
 */
const {chromium}=require('playwright');

(async function() {
  var b=await chromium.launch({headless:true});
  var p=await b.newPage({viewport:{width:1536,height:960}});
  var errors=[];
  p.on('pageerror',function(e){errors.push('PAGEERROR:'+e.message);});
  p.on('console',function(m){if(m.type()==='error')errors.push('CONSOLE_ERR:'+m.text());});

  var url='http://localhost:5173/insight/medical-checkup';

  // ── PART 1: Run conversation wizard to create medical history ───────────
  console.log('[1/2] Conversation wizard → create medical history...');
  await p.goto(url,{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(2000);

  // Step 0: Fanpage connect
  await p.locator('button:has-text("Kết nối Fanpage")').first().click();
  await p.waitForTimeout(3000);

  // Step 1: Industry form
  await p.locator('button:has-text("Chọn ngành hàng")').first().click();
  await p.waitForTimeout(400);
  await p.locator('button:has-text("Mẹ và Bé")').first().click();
  await p.waitForTimeout(200);
  await p.locator('textarea').first().fill('Test me va be');
  await p.waitForTimeout(200);
  await p.locator('button:has-text("Tiếp tục")').first().click();
  await p.waitForTimeout(500);

  // Step 2: Quantity → start crawl
  await p.locator('button:has-text("Bắt đầu Khám")').first().click();
  // Progress bar animation needs time to start
  await p.waitForTimeout(1000);

  // Wait for conversation result — needs ~15-16s for crawl
  // Use waitForFunction (partial text, no strict exact match)
  await p.waitForFunction(function(){
    return document.body.textContent.indexOf('Leads')!==-1 &&
           document.body.textContent.indexOf('Chất')!==-1;
  },{timeout:30000});
  console.log('  ✓ Conversation result visible');

  // Verify medical_history_v2 was saved
  var historyRaw=await p.evaluate(function(){
    return localStorage.getItem('medical_history_v2');
  });
  var history=historyRaw?JSON.parse(historyRaw):[];
  console.log('  ✓ Medical history records: '+history.length);

  // Reload so React re-evaluates getMedicalHistory() from localStorage
  console.log('  Reloading to pick up medical history...');
  await p.reload({waitUntil:'networkidle'});
  await p.waitForTimeout(2000);

  // Verify Ads tab is now enabled
  var adsTab=p.locator('button:has-text("📣")');
  var adsDisabled=await adsTab.getAttribute('disabled');
  console.log('  Ads tab disabled attr: '+(adsDisabled?'YES - still locked':'NO - unlocked'));

  // ── PART 2: Ads Wizard ──────────────────────────────────────────────────
  console.log('\n[2/2] Ads Wizard test...');

  // Click Ads tab
  await adsTab.click();
  await p.waitForTimeout(800);

  // Verify Ads wizard step 1 content
  var wizardContent=await p.locator('h2').allTextContents();
  console.log('  H2 in Ads section: '+JSON.stringify(wizardContent));

  // Step 1 → 2: click the CTA button (not the step indicator)
  await p.locator('button:has-text("Kết nối Tài khoản Ads")').first().click();
  await p.waitForTimeout(3200);

  // Step 2 → 3: campaign select — click Tiếp tục
  var h2_step2=await p.locator('h2').allTextContents();
  console.log('  H2 at step 2: '+JSON.stringify(h2_step2));
  await p.locator('button:has-text("Tiếp tục")').first().click();
  await p.waitForTimeout(600);

  // Step 3 → 4: date range → "Bắt đầu phân tích"
  var h2_step3=await p.locator('h2').allTextContents();
  console.log('  H2 at step 3: '+JSON.stringify(h2_step3));
  await p.locator('button:has-text("Bắt đầu phân tích")').first().click();
  await p.waitForTimeout(600);

  // Step 4: verify crawl progress
  var h2_step4=await p.locator('h2').allTextContents();
  console.log('  H2 in step 4: '+JSON.stringify(h2_step4));
  var diseaseGroupVisible=await p.locator('text=ROAS Thực vs Ảo').isVisible();
  console.log('  ✓ Disease group list visible: '+diseaseGroupVisible);

  // ── CRITICAL: Dashboard must appear after crawl ─────────────────────────
  console.log('\n  Waiting for dashboard (max 14s crawl)...');
  var dashboardAppeared=false;
  var startTime=Date.now();

  try {
    await p.waitForSelector('text=Điểm Sức Khỏe Ads',{timeout:14000});
    var elapsed=Date.now()-startTime;
    dashboardAppeared=true;
    console.log('  ✓✓ DASHBOARD appeared after ~'+elapsed+'ms — Bug FIX verified!');
  } catch(e) {
    var elapsed=Date.now()-startTime;
    console.log('  ✗ Dashboard did NOT appear after '+elapsed+'ms');

    // Debug: what's on page?
    var body=await p.locator('body').textContent();
    console.log('    Body has "Đang phân tích chiến dịch": '+(body.indexOf('Đang phân tích chiến dịch')!==-1));
    console.log('    Body has "100%": '+(body.indexOf('100%')!==-1));
    console.log('    Body has "Điểm Sức Khỏe Ads": '+(body.indexOf('Điểm Sức Khỏe Ads')!==-1));
  }

  // ── Final ──────────────────────────────────────────────────────────────
  console.log('\n=== RESULT ===');
  console.log('Console errors: '+errors.length);
  if(errors.length) errors.forEach(function(e){console.log('  ERROR: '+e);});

  if(dashboardAppeared) {
    var checks={
      healthScore: await p.locator('text=Điểm Sức Khỏe Ads').count(),
      filterTabs:  await p.locator('text=Tất cả').first().isVisible(),
      diseaseCard: await p.locator('text=ROAS Thực vs Ảo').first().isVisible(),
    };
    console.log('Dashboard checks:',JSON.stringify(checks));
    console.log('\n✅ TEST PASSED — Ads wizard → Dashboard flow works!');
  } else {
    console.log('\n❌ TEST FAILED');
  }

  await b.close();
  process.exit(dashboardAppeared && errors.length===0?0:1);
}());
