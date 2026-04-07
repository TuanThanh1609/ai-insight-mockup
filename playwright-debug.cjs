const {chromium}=require('playwright');

(async function() {
  var b=await chromium.launch({headless:true,args:['--site-per-process-isolation']});
  var p=await b.newPage({viewport:{width:1536,height:960}});
  var errors=[];
  p.on('pageerror',function(e){errors.push('PAGEERROR:'+e.message);});

  // Step 1: Full conversation flow to create medical history
  var url='http://localhost:5173/insight/medical-checkup';
  await p.goto(url,{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(2000);

  // Inject medical history BEFORE any navigation so it persists
  await p.evaluate(function() {
    var record={
      id:'test-'+Date.now(),
      date:new Date().toISOString(),
      industry:'mother-baby',
      industryLabel:'Mẹ và Bé',
      customerGroup:'Test KH',
      quantity:1000,
      healthScore:6.5,
      diseases:[{id:'lead-quality',name:'Chất Lượng Leads',score:5.2}]
    };
    localStorage.setItem('medical_history_v2',JSON.stringify([record]));
    console.log('Injected medical history, count=1');
  });

  // Clear any previous session state by reloading
  await p.reload({waitUntil:'networkidle'});
  await p.waitForTimeout(2000);

  // Check Ads tab state
  var adsBtn=p.locator('button:has-text("📣")');
  var adsBtnDisabled=await adsBtn.getAttribute('disabled');
  console.log('Ads button disabled attr:',adsBtnDisabled);
  var adsBtnClass=await adsBtn.getAttribute('class');
  console.log('Ads button classes:',adsBtnClass?adsBtnClass.slice(0,100):'none');

  // Check localStorage directly
  var lsCheck=await p.evaluate(function() {
    return localStorage.getItem('medical_history_v2');
  });
  console.log('localStorage medical_history_v2:',lsCheck?'SET ('+lsCheck.length+' chars)':'NOT SET');

  // Click Ads tab to switch to it
  console.log('Clicking Ads tab...');
  await adsBtn.click();
  await p.waitForTimeout(1000);

  // Now step 1 wizard should be visible inside Ads section
  var step1Visible=await p.locator('button:has-text("Kết nối Ads")').first().isVisible();
  console.log('Step 1 "Kết nối Ads" visible inside Ads tab: '+step1Visible);

  // Verify wizard step 1
  var step1=await p.locator('button:has-text("Kết nối Ads")').first().isVisible();
  console.log('Step 1 visible: '+step1);

  // Step 1 → 2
  await p.locator('button:has-text("Kết nối Tài khoản Ads")').first().click();
  await p.waitForTimeout(3200);

  // Step 2 → 3
  var h2_2=await p.locator('h2').allTextContents();
  console.log('H2 after step1 connect: '+JSON.stringify(h2_2));
  await p.locator('button:has-text("Tiếp tục")').first().click();
  await p.waitForTimeout(600);

  // Step 3 → 4
  var h2_3=await p.locator('h2').allTextContents();
  console.log('H2 before date range continue: '+JSON.stringify(h2_3));
  await p.locator('button:has-text("Bắt đầu phân tích")').first().click();
  await p.waitForTimeout(600);

  // Step 4: crawl
  var h2_4=await p.locator('h2').allTextContents();
  console.log('H2 in step 4: '+JSON.stringify(h2_4));

  // Wait 12s for crawl to finish
  console.log('Waiting 12s for crawl...');
  await p.waitForTimeout(12000);

  // Check what's on page
  var body=await p.locator('body').textContent();
  var hasCrawl=body.indexOf('Đang phân tích chiến dịch')!==-1;
  var has100=body.indexOf('100%')!==-1;
  var hasDashboard=body.indexOf('Điểm Sức Khỏe Ads')!==-1;
  var hasROAS=body.indexOf('ROAS')!==-1;
  console.log('Has crawl text: '+hasCrawl);
  console.log('Has 100%: '+has100);
  console.log('Has dashboard (Điểm Sức Khỏe Ads): '+hasDashboard);
  console.log('Has ROAS: '+hasROAS);

  // Also check adsStep state via localStorage or DOM
  var stepIndicator=await p.locator('button:has-text("Kết quả")').count();
  console.log('Wizard "Kết quả" step visible: '+stepIndicator);

  console.log('Errors: '+JSON.stringify(errors));
  await b.close();
}());
