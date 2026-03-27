// =====================================================================
// Script: Tạo bảng landing_leads trong Supabase qua MCP
// Sử dụng @modelcontextprotocol/sdk (đã có trong project)
// Usage: node scripts/create-landing-table-mcp.js
// =====================================================================

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const MCP_URL = "https://db.cdp.vn/mcp";

const CREATE_TABLE_SQL = `
-- ================================================================
-- Bảng landing_leads: Thu thập thông tin khách truy cập landing page
-- ================================================================
CREATE TABLE IF NOT EXISTS landing_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  experience_rating INTEGER CHECK (experience_rating BETWEEN 1 AND 5),
  consent_privacy BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE landing_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Cho phép insert từ client (anon key)
DROP POLICY IF EXISTS "Allow anonymous inserts" ON landing_leads;
CREATE POLICY "Allow anonymous inserts"
ON landing_leads FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Cho phép đọc từ authenticated (backend)
DROP POLICY IF EXISTS "Allow service role read" ON landing_leads;
CREATE POLICY "Allow service role read"
ON landing_leads FOR SELECT
TO authenticated
USING (true);
`.trim();

async function run() {
  console.log("🚀 Kết nối Supabase MCP...\n");

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "mcp-remote", MCP_URL],
  });

  const client = new Client({ name: "create-landing-table", version: "1.0.0" }, { capabilities: {} });

  try {
    await client.connect(transport);
    console.log("✅ Kết nối MCP thành công!\n");

    console.log("📋 Tạo bảng landing_leads...\n");
    const result = await client.callTool({
      name: "execute_sql",
      arguments: { query: CREATE_TABLE_SQL },
    });

    console.log("✅ Kết quả:");
    console.log(JSON.stringify(result, null, 2));

    // Verify table
    console.log("\n📋 Kiểm tra bảng đã tạo...");
    const verifyResult = await client.callTool({
      name: "execute_sql",
      arguments: {
        query: `
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_name = 'landing_leads'
          ORDER BY ordinal_position;
        `,
      },
    });
    console.log("✅ Cấu trúc bảng:");
    console.log(JSON.stringify(verifyResult, null, 2));

    await client.close();
    console.log("\n🎉 Hoàn tất! Bảng landing_leads đã sẵn sàng.");
  } catch (err) {
    console.error("❌ Lỗi:", err.message || err);
    process.exit(1);
  }
}

run();
