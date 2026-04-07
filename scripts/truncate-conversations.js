// Truncate ai_insight_conversations table
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const MCP_URL = "https://db.cdp.vn/mcp";

async function run() {
  const transport = new StdioClientTransport({ command: "npx", args: ["-y", "mcp-remote", MCP_URL] });
  const client = new Client({ name: "truncate-conversations", version: "1.0.0" }, { capabilities: {} });

  try {
    await client.connect(transport);
    console.log("✅ Connected to MCP");
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  }

  console.log("Truncating ai_insight_conversations...");
  const r = await client.callTool({ name: "execute_sql", arguments: { query: "TRUNCATE TABLE ai_insight_conversations RESTART IDENTITY CASCADE;" } });
  const txt = r.content?.[0]?.text || '';
  console.log("Result:", txt.substring(0, 300));

  await client.close();
  console.log("✅ Done!");
}

run().catch(err => { console.error("Fatal:", err.message); process.exit(1); });
