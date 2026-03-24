// Debug: parse test + export
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { writeFileSync } from "fs";

const MCP_URL = "https://db.cdp.vn/mcp";

function parse(text) {
  const tagOpen = text.indexOf("<untrusted-data");
  if (tagOpen === -1) { console.log("NO TAG FOUND"); return null; }
  const contentStart = text.indexOf(">", tagOpen) + 1;
  const closeStart = text.indexOf("</untrusted-data", contentStart);
  if (closeStart === -1) { console.log("NO CLOSE TAG"); return null; }
  const json = text.slice(contentStart, closeStart).trim();
  console.log("JSON:", json.substring(0, 200));
  return JSON.parse(json);
}

async function run() {
  const transport = new StdioClientTransport({ command: "npx", args: ["-y", "mcp-remote", MCP_URL] });
  const client = new Client({ name: "debug-parse", version: "1.0.0" }, { capabilities: {} });
  await client.connect(transport);

  const r = await client.callTool({ name: "execute_sql", arguments: { query: "SELECT COUNT(*) as cnt FROM ai_insight_conversations" } });
  const result = parse(r.content[0].text);
  console.log("Result:", result);

  if (result?.[0]?.cnt > 0) {
    const allR = await client.callTool({ name: "execute_sql", arguments: { query: "SELECT id, template_id, customer_name, platform, data_json, converted_at FROM ai_insight_conversations ORDER BY template_id LIMIT 3" } });
    const all = parse(allR.content[0].text);
    console.log("Sample:", JSON.stringify(all, null, 2));
    writeFileSync("src/data/supabase-conversations-debug.json", JSON.stringify(all, null, 2));
    console.log("Written debug file");
  }

  await client.close();
  console.log("Done");
}

run().catch(e => { console.error("Fatal:", e.message); process.exit(1); });
