const {chromium}=require('playwright');
(async function(){
  const b=await chromium.launch({headless:true});
  const p=await b.newPage();
  const errors=[];
  p.on('pageerror',e=>errors.push('PAGEERROR:'+e.message));
  await p.goto('http://localhost:5173/insight/medical-checkup',{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(2000);

  // step 0: Fanpage connect
  await p.locator('button:has-text("Kết nối Fanpage")').first().click();
  await p.waitForTimeout(3000);

  // step 1: Industry form - click dropdown
  const industryDropdown=await p.locator('button:has-text("Chọn ngành hàng")').first();
  const dropVisible=await industryDropdown.isVisible();
  console.log('Industry dropdown visible:',dropVisible);
  await industryDropdown.click();
  await p.waitForTimeout(500);
  await p.locator('button:has-text("Mẹ và Bé")').first().click();
  await p.waitForTimeout(300);
  await p.locator('textarea').first().fill('Test me va be');
  await p.waitForTimeout(200);
  await p.locator('button:has-text("Tiếp tục")').first().click();
  await p.waitForTimeout(500);

  // step 2: Quantity select
  const h22=await p.locator('h2').allTextContents();
  console.log('H2 at step 2:',h22);
  await p.locator('button:has-text("Bắt đầu Khám")').first().click();
  await p.waitForTimeout(500);

  // step 3: crawl progress
  const h23=await p.locator('h2').allTextContents();
  console.log('H2 at step 3:',h23);

  // wait for result (step 4)
  await p.waitForTimeout(12000);
  const h24=await p.locator('h2').allTextContents();
  console.log('H2 after crawl:',h24);
  const hasLeads=await p.locator('text=Chất Lượng Leads').isVisible();
  console.log('Has Chất Lượng Leads:',hasLeads);
  console.log('Errors:',errors);
  await b.close();
}())
