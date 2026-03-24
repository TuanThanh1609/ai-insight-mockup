// Insert 4 missing records — dùng $1/$2 parameterized values
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const MCP_URL = "https://db.cdp.vn/mcp";

// 4 records bị sanitize bởi MCP untrusted-data filter — tái encode bằng Buffer
const MISSING = [
  {
    template_id: 'fsh-1',
    customer_name: 'Nguyen Thi Lan',
    phone: '0901234567',
    platform: 'facebook',
    data: {
      product: 'Ao len day',
      size: 'M',
      temperature: 'Nong',
      pain_point: 'Can ao mua dong cho van phong'
    },
    converted_at: '2026-03-24T09:00:00Z'
  },
  {
    template_id: 'fsh-1',
    customer_name: 'Tran Duc Minh',
    phone: '0912345678',
    platform: 'zalo',
    data: {
      product: 'Quan jeans wide leg',
      size: '28',
      temperature: 'Am',
      pain_point: 'Tim quan ong rong di choi Tet'
    },
    converted_at: '2026-03-24T10:15:00Z'
  },
  {
    template_id: 'fsh-3',
    customer_name: 'Pham Minh Hoang',
    phone: '0956789012',
    platform: 'facebook',
    data: {
      attitude: 'Tot',
      mistake: 'Sale gui sai size 2 lan lien tiep'
    },
    converted_at: '2026-03-24T13:45:00Z'
  },
  {
    template_id: 'fsh-6',
    customer_name: 'Trinh Thi Lan',
    phone: '0990123456',
    platform: 'facebook',
    data: {
      message_type: 'Hoi ve san pham',
      satisfaction: 'Hai long',
      can_refer: false
    },
    converted_at: '2026-03-24T17:00:00Z'
  },
];

async function run() {
  const transport = new StdioClientTransport({ command: "npx", args: ["-y", "mcp-remote", MCP_URL] });
  const client = new Client({ name: "fix-missing", version: "1.0.0" }, { capabilities: {} });
  await client.connect(transport);
  console.log("✅ Connected");

  // Dùng single multi-value INSERT để giảm round-trips
  const values = MISSING.map((r, i) => {
    const base = i * 6;
    return `($${base+1}, $${base+2}, $${base+3}, $${base+4}::jsonb, $${base+5}, $${base+6})`;
  }).join(',\n');

  const params = MISSING.flatMap(r => [
    r.template_id,
    r.customer_name,
    r.phone,
    r.platform,
    JSON.stringify(r.data),
    r.converted_at,
  ]);

  const sql = `INSERT INTO ai_insight_mockup (template_id, customer_name, phone, platform, data_json, converted_at)\nVALUES ${values};`;

  const res = await client.callTool({ name: "execute_sql", arguments: { query: sql, params } });
  let parsed;
  try { parsed = JSON.parse(res.content?.[0]?.text || '{}'); } catch { parsed = res; }
  const ok = parsed?.length > 0 || parsed?.status === 201 || parsed?.status === 204;

  if (ok) {
    console.log("✅ All 4 missing records inserted");
    console.log("Response:", JSON.stringify(parsed).substring(0, 300));
  } else {
    console.log("⚠️ Insert may have failed:", JSON.stringify(parsed).substring(0, 400));
  }

  // Verify
  const verify = await client.callTool({ name: "execute_sql", arguments: { query: "SELECT COUNT(*) as total, COUNT(DISTINCT template_id) as unique_templates FROM ai_insight_mockup;" } });
  console.log("\n📊 Final:", verify.content?.[0]?.text || verify);

  // Sample rows
  const sample = await client.callTool({ name: "execute_sql", arguments: { query: "SELECT id, template_id, customer_name, platform, converted_at FROM ai_insight_mockup LIMIT 5;" } });
  console.log("\n📋 Sample:", sample.content?.[0]?.text || sample);

  await client.close();
  console.log("✅ Done!");
}

run().catch(err => { console.error("❌ Fatal:", err.message); process.exit(1); });
