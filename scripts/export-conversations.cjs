// Export all conversations from Supabase to JSON
const https = require('https');
const fs = require('fs');
const path = require('path');

const KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc3NDMyNzE0MCwiZXhwIjo0OTMwMDAwNzQwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.6qqm8ZjHqQRMJEH8ra-OKcKXkQq3S3oGxhftM9J687A';
const BASE = 'https://db.cdp.vn/rest/v1/ai_insight_conversations';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'apikey': KEY, 'Authorization': 'Bearer ' + KEY }
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching all conversations from Supabase...');
  const rows = [];
  let offset = 0;
  const limit = 1000;
  let totalFetched = 0;

  while (true) {
    const batch = await fetch(`${BASE}?select=*&limit=${limit}&offset=${offset}&order=template_id,converted_at`);
    if (!batch || batch.length === 0) break;
    rows.push(...batch);
    totalFetched += batch.length;
    offset += limit;
    process.stdout.write(`  Fetched ${totalFetched} rows...\r`);
    if (batch.length < limit) break;
  }

  console.log(`\nTotal fetched: ${rows.length}`);

  const outPath = path.join(__dirname, '..', 'src', 'data', 'supabase-conversations.json');
  fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), 'utf-8');
  console.log(`Written to: ${outPath}`);
  console.log(`File size: ${(fs.statSync(outPath).size / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
