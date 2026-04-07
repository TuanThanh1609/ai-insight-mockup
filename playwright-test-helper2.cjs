const {chromium}=require('playwright');

(async function() {
  var b=await chromium.launch({headless:true});
  var p=await b.newPage({viewport:{width:1536,height:960}});
  var errors=[];
  p.on('pageerror',function(e){errors.push('PAGEERROR:'+e.message);});
  p.on('console',function(m){if(m.type()==='error')errors.push('CONSOLE_ERR:'+m.text());});

  var url='http://localhost:5173/insight/medical-checkup';
  await p.goto(url,{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(2000);

  // Step 0: Fanpage connect
  console.log('Clicking Kết nối Fanpage...');
  await p.locator('button:has-text("Kết nối Fanpage")').first().click();
  await p.waitForTimeout(3000);

  // Step 1: Industry
  console.log('Clicking dropdown...');
  await p.locator('button:has-text("Chọn ngành hàng")').first().click();
  await p.waitForTimeout(400);
  await p.locator('button:has-text("Mẹ và Bé")').first().click();
  await p.waitForTimeout(200);
  await p.locator('textarea').first().fill('Test me va be');
  await p.waitForTimeout(200);
  await p.locator('button:has-text("Tiếp tục")').first().click();
  await p.waitForTimeout(500);

  // Step 2: Quantity
  var h2=p.locator('h2');
  var h2count=await h2.count();
  if(h2count>0){
    var h2text=await h2.allTextContents();
    console.log('Step 2 h2: '+JSON.stringify(h2text));
  }
  console.log('Clicking Bắt đầu Khám...');
  await p.locator('button:has-text("Bắt đầu Khám")').first().click();
  await p.waitForTimeout(500);

  // Step 3: Check crawl progress
  var h2count2=await p.locator('h2').count();
  if(h2count2>0){
    var h2text2=await p.locator('h2').allTextContents();
    console.log('Step 3 h2: '+JSON.stringify(h2text2));
  }

  // Wait for result
  console.log('Waiting 15s for crawl to complete...');
  var start=Date.now();

  // Try different selectors
  try {
    await p.waitForSelector('text=Chất Lượng Leads',{timeout:15000});
    var elapsed=Date.now()-start;
    console.log('SUCCESS: Chất Lượng Leads appeared after '+elapsed+'ms');
  } catch(e1) {
    var elapsed1=Date.now()-start;
    console.log('TIMEOUT Chất Lượng Leads after '+elapsed1+'ms');

    // Check what's actually on page
    var bodyText=await p.locator('body').textContent();
    console.log('Body contains "Leads": '+bodyText.includes('Leads'));
    console.log('Body contains "Chất": '+bodyText.includes('Chất'));
    console.log('Body contains "phân tích": '+bodyText.includes('phân tích'));
    console.log('Body contains "Thu thập": '+bodyText.includes('Thu thập'));
    console.log('Body contains "Đang": '+bodyText.includes('Đang'));

    // Also try MedicalResultStep selectors
    var resultSelectors=['text=Sức Khỏe','text=Khám Bệnh Hội Thoại','text=Gợi ý Smax','text=Điểm số','text=DiseaseItem'].filter(function(s){
      return bodyText.includes(s.replace('text=',''));
    });
    console.log('Found result selectors:',resultSelectors);
  }

  console.log('Errors: '+JSON.stringify(errors));
  await b.close();
}());
