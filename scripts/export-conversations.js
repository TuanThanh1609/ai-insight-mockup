// Export all rows from ai_insight_conversations via Supabase REST API
// → src/data/supabase-conversations.json
import { writeFileSync } from "fs";
import { join } from "path";

const SUPABASE_URL = "https://db.cdp.vn/rest/v1";
const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc3NDMyNzE0MCwiZXhwIjo0OTMwMDAwNzQwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.6qqm8ZjHqQRMJEH8ra-OKcKXkQq3S3oGxhftM9J687A";

const HEADERS = {
  "apikey": API_KEY,
  "Authorization": `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "count=none",
};

async function fetchPage(offset, limit = 1000) {
  const url = `${SUPABASE_URL}/ai_insight_conversations?select=id,template_id,customer_name,platform,data_json,converted_at&order=template_id,converted_at&offset=${offset}&limit=${limit}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

async function run() {
  console.log("Fetching data from Supabase REST API...");

  // Fetch total first
  const totalRes = await fetch(`${SUPABASE_URL}/ai_insight_conversations?select=id&limit=1`, { headers: HEADERS });
  // PostgREST doesn't return total count easily — just paginate until empty
  const total = 2100; // known from seed

  const allRows = [];
  const PAGE = 1000;
  for (let offset = 0; offset < total; offset += PAGE) {
    const rows = await fetchPage(offset, PAGE);
    if (!rows || rows.length === 0) break;
    allRows.push(...rows);
    process.stdout.write(`  Fetched ${allRows.length}/${total}\n`);
    if (rows.length < PAGE) break;
  }

  console.log(`\nGrouping ${allRows.length} rows by template_id...`);

  // Group by template_id, flatten data_json
  const grouped = {};
  for (const row of allRows) {
    const tid = row.template_id;
    if (!grouped[tid]) grouped[tid] = [];

    // Flat row: top-level metadata + spread data_json fields
    const flat = {
      id: row.id,
      customer: row.customer_name || row.customer,
      platform: row.platform,
      converted_at: row.converted_at,
    };
    if (row.data_json) {
      const dj = typeof row.data_json === "string" ? JSON.parse(row.data_json) : row.data_json;
      // Don't overwrite top-level fields
      for (const [k, v] of Object.entries(dj)) {
        if (!["id", "customer", "platform", "converted_at", "row"].includes(k)) {
          flat[k] = v;
        }
      }
    }
    grouped[tid].push(flat);
  }

  const outPath = join(process.cwd(), "src/data/supabase-conversations.json");
  writeFileSync(outPath, JSON.stringify(grouped, null, 2));
  console.log(`\n✅ Written: ${outPath}`);
  console.log(`   Templates: ${Object.keys(grouped).length}`);
  console.log(`   Total rows: ${allRows.length}`);
  for (const [tid, rows] of Object.entries(grouped)) {
    const fields = Object.keys(rows[0]).filter(k => !["id","customer","platform","converted_at"].includes(k));
    console.log(`   ${tid}: ${rows.length} rows | fields: ${fields.join(", ")}`);
  }
  console.log("\nDone!");
}

run().catch(err => { console.error("Fatal:", err.message); process.exit(1); });
