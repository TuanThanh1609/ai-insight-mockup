// =====================================================================
// Script: Tạo bảng ai_insight_mockup + insert 50 records
// Supabase: https://db.cdp.vn (MCP endpoint: https://db.cdp.vn/mcp)
// =====================================================================

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const MCP_URL = "https://db.cdp.vn/mcp";

// 42 template IDs
const TEMPLATE_IDS = [
  'fsh-1','fsh-2','fsh-3','fsh-4','fsh-5','fsh-6',
  'mbb-1','mbb-2','mbb-3','mbb-4','mbb-5','mbb-6',
  'cos-1','cos-2','cos-3','cos-4','cos-5','cos-6',
  'spa-1','spa-2','spa-3','spa-4','spa-5','spa-6',
  'res-1','res-2','res-3','res-4','res-5','res-6',
  'fnb-1','fnb-2','fnb-3','fnb-4','fnb-5','fnb-6',
  'trv-1','trv-2','trv-3','trv-4','trv-5','trv-6',
];

// 50 sample records — mỗi record có 5-6 key fields (converted JSON)
const MOCK_RECORDS = [
  // FASHION
  { template_id:'fsh-1', customer_name:'Nguyễn Thị Lan',  phone:'0901234567', platform:'facebook', data_json: JSON.stringify({product:'Áo len dày', size:'M', temperature:'Nóng', pain_point:'Cần áo mùa đông cho văn phòng'}), converted_at:'2026-03-24T09:00:00Z' },
  { template_id:'fsh-1', customer_name:'Trần Đức Minh',    phone:'0912345678', platform:'zalo',      data_json: JSON.stringify({product:'Quần jeans wide leg', size:'28', temperature:'Ấm', pain_point:'Tìm quần ống rộng đi chơi Tết'}), converted_at:'2026-03-24T10:15:00Z' },
  { template_id:'fsh-2', customer_name:'Lê Thu Phương',   phone:'0934567890', platform:'facebook', data_json: JSON.stringify({is_junk:false, phone_status:'Đã cho SĐT', objection:'Chê giá đắt', ads_source:'Facebook Ads'}), converted_at:'2026-03-24T11:30:00Z' },
  { template_id:'fsh-2', customer_name:'Vũ Hoàng Yến',    phone:'0945678901', platform:'zalo',      data_json: JSON.stringify({is_junk:true, phone_status:'Đã cho SĐT', objection:'Hỏi cho biết', ads_source:'Zalo Ads'}), converted_at:'2026-03-24T12:00:00Z' },
  { template_id:'fsh-3', customer_name:'Phạm Minh Hoàng', phone:'0956789012', platform:'facebook', data_json: JSON.stringify({attitude:'Tốt', mistake:'Sale gửi sai size 2 lần'}), converted_at:'2026-03-24T13:45:00Z' },
  { template_id:'fsh-3', customer_name:'Bùi Thị Hương',   phone:'0967890123', platform:'zalo',      data_json: JSON.stringify({attitude:'Trung bình', mistake:'Không rep tin nhắn sau 2h'}), converted_at:'2026-03-24T14:00:00Z' },
  { template_id:'fsh-4', customer_name:'Đặng Hoàng Anh',  phone:'0978901234', platform:'facebook', data_json: JSON.stringify({gender:'Nữ', location:'TP.HCM', budget:'500K - 1M', segment:'Văn phòng'}), converted_at:'2026-03-24T15:30:00Z' },
  { template_id:'fsh-5', customer_name:'Cao Văn Tuấn',     phone:'0989012345', platform:'zalo',      data_json: JSON.stringify({has_competitor:true, competitor_name:'An Phước Store', compare_criteria:'Giá cả'}), converted_at:'2026-03-24T16:00:00Z' },
  { template_id:'fsh-6', customer_name:'Trịnh Thị Lan',  phone:'0990123456', platform:'facebook', data_json: JSON.stringify({message_type:'Hỏi về sản phẩm', satisfaction:'Hài lòng', can_refer:false}), converted_at:'2026-03-24T17:00:00Z' },
  { template_id:'fsh-6', customer_name:'Nguyễn Đức Hoàng',phone:'0901234500', platform:'zalo',      data_json: JSON.stringify({message_type:'Khiếu nại', satisfaction:'Không hài lòng', can_refer:false}), converted_at:'2026-03-24T17:30:00Z' },

  // MOTHER & BABY
  { template_id:'mbb-1', customer_name:'Trần Thị Hà',    phone:'0901234568', platform:'facebook', data_json: JSON.stringify({product:'Tã quần', baby_age:'6 tháng', temperature:'Nóng', pain_point:'Cần tã thấm hút tốt cho bé ngủ đêm'}), converted_at:'2026-03-23T09:00:00Z' },
  { template_id:'mbb-2', customer_name:'Lê Minh Tuấn',    phone:'0912345600', platform:'zalo',      data_json: JSON.stringify({is_junk:false, phone_status:'Đã cho SĐT', objection:'Lo ngại an toàn sản phẩm', bulk_interest:'Có'}), converted_at:'2026-03-23T10:30:00Z' },
  { template_id:'mbb-3', customer_name:'Phạm Thị Lan',    phone:'0934567800', platform:'facebook', data_json: JSON.stringify({attitude:'Tốt', mistake:'Sale tư vấn sai độ tuổi sử dụng'}), converted_at:'2026-03-23T11:00:00Z' },
  { template_id:'mbb-4', customer_name:'Vũ Thị Mai',      phone:'0945678902', platform:'zalo',      data_json: JSON.stringify({parent_gender:'Nữ', baby_age:'12 tháng', location:'Hà Nội', budget:'1M - 3M'}), converted_at:'2026-03-23T12:30:00Z' },
  { template_id:'mbb-5', customer_name:'Đặng Hoàng Minh', phone:'0956789001', platform:'facebook', data_json: JSON.stringify({has_competitor:true, competitor_name:'Con Cưng', compare_criteria:'An toàn / Chất lượng'}), converted_at:'2026-03-23T14:00:00Z' },
  { template_id:'mbb-6', customer_name:'Trịnh Thu Hà',     phone:'0967890100', platform:'zalo',      data_json: JSON.stringify({message_type:'Khiếu nại', frustration:true, urgency:'Cao'}), converted_at:'2026-03-23T15:30:00Z' },

  // COSMETICS
  { template_id:'cos-1', customer_name:'Nguyễn Thị Yến',  phone:'0901234570', platform:'facebook', data_json: JSON.stringify({product:'Kem dưỡng ẩm', skin_type:'Da khô', temperature:'Nóng', pain_point:'Da khô bong tróc mùa đông'}), converted_at:'2026-03-22T09:00:00Z' },
  { template_id:'cos-2', customer_name:'Lê Thị Hoa',      phone:'0912345601', platform:'zalo',      data_json: JSON.stringify({is_junk:false, phone_status:'Đã cho SĐT', objection:'Lo ngại hàng fake', ads_source:'Facebook Ads'}), converted_at:'2026-03-22T10:00:00Z' },
  { template_id:'cos-3', customer_name:'Trần Minh Anh',   phone:'0934567801', platform:'facebook', data_json: JSON.stringify({attitude:'Tốt', mistake:'Sale khoe sp chưa được kiểm định'}), converted_at:'2026-03-22T11:00:00Z' },
  { template_id:'cos-4', customer_name:'Phạm Thu Hương',  phone:'0945678903', platform:'zalo',      data_json: JSON.stringify({gender:'Nữ', location:'Đà Nẵng', budget:'500K - 1M', segment:'Sinh viên'}), converted_at:'2026-03-22T12:00:00Z' },
  { template_id:'cos-5', customer_name:'Vũ Đức Mạnh',      phone:'0956789002', platform:'facebook', data_json: JSON.stringify({has_competitor:true, competitor_name:'The Ordinary', compare_criteria:'Thành phần'}), converted_at:'2026-03-22T13:00:00Z' },
  { template_id:'cos-6', customer_name:'Đặng Thị Lan',    phone:'0967890101', platform:'zalo',      data_json: JSON.stringify({message_type:'Hỏi về dị ứng', satisfaction:'Trung bình', can_refer:false}), converted_at:'2026-03-22T14:00:00Z' },

  // SPA / BEAUTY SALON
  { template_id:'spa-1', customer_name:'Trần Thị Lan',     phone:'0901234571', platform:'facebook', data_json: JSON.stringify({treatment:'Triệt lông laser', temperature:'Nóng', pain_point:'Muốn triệt lông vĩnh viễn, da nhạy cảm'}), converted_at:'2026-03-21T09:00:00Z' },
  { template_id:'spa-2', customer_name:'Lê Minh Tuấn',    phone:'0912345602', platform:'zalo',      data_json: JSON.stringify({is_junk:false, phone_status:'Đã cho SĐT', objection:'Booking intent thấp', ads_source:'Zalo Ads'}), converted_at:'2026-03-21T10:30:00Z' },
  { template_id:'spa-3', customer_name:'Phạm Hoàng Yến',  phone:'0934567802', platform:'facebook', data_json: JSON.stringify({attitude:'Kém', mistake:'Sale không xác nhận lịch hẹn, KH đến không có người đón'}), converted_at:'2026-03-21T11:30:00Z' },
  { template_id:'spa-4', customer_name:'Nguyễn Thu Hà',   phone:'0945678904', platform:'zalo',      data_json: JSON.stringify({gender:'Nữ', location:'TP.HCM', budget:'3M - 5M', segment:'Nhân viên văn phòng'}), converted_at:'2026-03-21T12:30:00Z' },
  { template_id:'spa-5', customer_name:'Vũ Thị Mai',       phone:'0956789003', platform:'facebook', data_json: JSON.stringify({has_competitor:true, competitor_name:'Shynh Premium', compare_criteria:'Bác sĩ thực hiện'}), converted_at:'2026-03-21T13:30:00Z' },
  { template_id:'spa-6', customer_name:'Đặng Đức Hoàng',   phone:'0967890102', platform:'zalo',      data_json: JSON.stringify({message_type:'Khiếu nại', satisfaction:'Không hài lòng', can_refer:false}), converted_at:'2026-03-21T14:30:00Z' },

  // REAL ESTATE
  { template_id:'res-1', customer_name:'Trịnh Văn Minh',   phone:'0901234572', platform:'facebook', data_json: JSON.stringify({product:'Căn hộ chung cư', legal_status:'Sổ hồng', temperature:'Nóng', pain_point:'Tìm căn hộ 2PN, khu vực Thủ Đức, tầm 2-3 tỷ'}), converted_at:'2026-03-20T09:00:00Z' },
  { template_id:'res-2', customer_name:'Nguyễn Thị Lan',   phone:'0912345603', platform:'zalo',      data_json: JSON.stringify({is_junk:false, phone_status:'Đã cho SĐT', objection:'Pháp lý chưa rõ', ads_source:'Facebook Ads'}), converted_at:'2026-03-20T10:00:00Z' },
  { template_id:'res-3', customer_name:'Phạm Đức Hoàng',  phone:'0934567803', platform:'facebook', data_json: JSON.stringify({attitude:'Tốt', mistake:'Sale không gửi file brochure, KH phải hỏi lại'}), converted_at:'2026-03-20T11:00:00Z' },
  { template_id:'res-4', customer_name:'Lê Thu Phương',    phone:'0945678905', platform:'zalo',      data_json: JSON.stringify({gender:'Nữ', location:'TP.HCM', budget:'2-5 tỷ', segment:'Gia đình trẻ'}), converted_at:'2026-03-20T12:00:00Z' },
  { template_id:'res-5', customer_name:'Vũ Hoàng Minh',    phone:'0956789004', platform:'facebook', data_json: JSON.stringify({has_competitor:true, competitor_name:'Vingroup', compare_criteria:'Tiện ích'}), converted_at:'2026-03-20T13:00:00Z' },
  { template_id:'res-6', customer_name:'Trần Đức Anh',    phone:'0967890103', platform:'zalo',      data_json: JSON.stringify({message_type:'Yêu cầu xem nhà', urgency:'Cao', can_refer:false}), converted_at:'2026-03-20T14:00:00Z' },

  // F&B
  { template_id:'fnb-1', customer_name:'Nguyễn Văn Tùng',  phone:'0901234573', platform:'facebook', data_json: JSON.stringify({product:'Cơm gà', temperature:'Nóng', pain_point:'Tìm quán cơm gà ngon gần trường ĐH, giao nhanh'}), converted_at:'2026-03-19T11:00:00Z' },
  { template_id:'fnb-2', customer_name:'Trần Thị Hương',   phone:'0912345604', platform:'zalo',      data_json: JSON.stringify({is_junk:false, phone_status:'Đã cho SĐT', objection:'Quá xa không có chi nhánh gần', ads_source:'Zalo Ads'}), converted_at:'2026-03-19T12:00:00Z' },
  { template_id:'fnb-3', customer_name:'Lê Minh Hoàng',    phone:'0934567804', platform:'facebook', data_json: JSON.stringify({attitude:'Tốt', mistake:'Sale không xác nhận đơn giao hàng'}), converted_at:'2026-03-19T13:00:00Z' },
  { template_id:'fnb-4', customer_name:'Phạm Thu Lan',    phone:'0945678906', platform:'zalo',      data_json: JSON.stringify({gender:'Nữ', location:'Hà Nội', budget:'100K - 300K', segment:'Sinh viên'}), converted_at:'2026-03-19T14:00:00Z' },
  { template_id:'fnb-5', customer_name:'Vũ Đức Minh',      phone:'0956789005', platform:'facebook', data_json: JSON.stringify({has_competitor:true, competitor_name:'GrabFood', compare_criteria:'Giá cả'}), converted_at:'2026-03-19T15:00:00Z' },
  { template_id:'fnb-6', customer_name:'Đặng Thị Hoa',     phone:'0967890104', platform:'zalo',      data_json: JSON.stringify({message_type:'Review xấu', satisfaction:'Không hài lòng', can_refer:false}), converted_at:'2026-03-19T16:00:00Z' },

  // TRAVEL
  { template_id:'trv-1', customer_name:'Trịnh Thị Lan',   phone:'0901234574', platform:'facebook', data_json: JSON.stringify({destination:'Đà Nẵng', ota_competitor:'Traveloka', temperature:'Nóng', pain_point:'Book khách sạn 4 sao view biển, ngày 28-30/03, 2 người lớn'}), converted_at:'2026-03-18T09:00:00Z' },
  { template_id:'trv-2', customer_name:'Nguyễn Đức Hoàng',phone:'0912345605', platform:'zalo',      data_json: JSON.stringify({is_junk:false, phone_status:'Đã cho SĐT', objection:'So sánh với Agoda', ads_source:'Facebook Ads'}), converted_at:'2026-03-18T10:00:00Z' },
  { template_id:'trv-3', customer_name:'Lê Thu Hà',       phone:'0934567805', platform:'facebook', data_json: JSON.stringify({attitude:'Tốt', mistake:'Sale không cung cấp thông tin visa kịp thời'}), converted_at:'2026-03-18T11:00:00Z' },
  { template_id:'trv-4', customer_name:'Phạm Hoàng Minh',  phone:'0945678907', platform:'zalo',      data_json: JSON.stringify({gender:'Nam', location:'TP.HCM', budget:'10M - 20M', segment:'Couple'}), converted_at:'2026-03-18T12:00:00Z' },
  { template_id:'trv-5', customer_name:'Vũ Thị Lan',       phone:'0956789006', platform:'facebook', data_json: JSON.stringify({has_competitor:true, competitor_name:'Agoda', compare_criteria:'Giá cả'}), converted_at:'2026-03-18T13:00:00Z' },
  { template_id:'trv-6', customer_name:'Trần Minh Tuấn',   phone:'0967890105', platform:'zalo',      data_json: JSON.stringify({message_type:'Khiếu nại', urgency:'Cao', can_refer:false}), converted_at:'2026-03-18T14:00:00Z' },
];

async function run() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "mcp-remote", MCP_URL]
  });

  const client = new Client({ name: "supabase-mockup", version: "1.0.0" }, { capabilities: {} });

  try {
    await client.connect(transport);
    console.log("✅ Connected to MCP");
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  }

  // ── 1. Tạo bảng ai_insight_mockup ──────────────────────────────
  const createSQL = `
DROP TABLE IF EXISTS ai_insight_mockup;

CREATE TABLE ai_insight_mockup (
  id          UUID        DEFAULT gen_random_uuid(),
  template_id VARCHAR(50) NOT NULL,
  customer_name VARCHAR(100),
  phone       VARCHAR(20),
  platform    VARCHAR(20),
  data_json   JSONB       NOT NULL,
  converted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

COMMENT ON TABLE ai_insight_mockup IS 'Dữ liệu mockup — 50 records đại diện cho 42 template Insight AI (7 ngành × 6 insight)';
COMMENT ON COLUMN ai_insight_mockup.template_id IS 'Template ID (fsh-1..fsh-6, mbb-1..mbb-6, cos-1..cos-6, spa-1..spa-6, res-1..res-6, fnb-1..fnb-6, trv-1..trv-6)';
COMMENT ON COLUMN ai_insight_mockup.data_json IS 'Structured data fields theo định nghĩa cột của template';
`;

  console.log("\n📋 Creating table ai_insight_mockup...");
  let result = await client.callTool({ name: "execute_sql", arguments: { query: createSQL } });
  let parsed = JSON.parse(result.content?.[0]?.text || result.content?.[0]?.data || '{}');
  if (parsed.status === 201 || parsed.status === 204 || parsed.status === 200) {
    console.log("✅ Table created successfully");
  } else {
    console.log("⚠️  Create response:", JSON.stringify(parsed).substring(0, 200));
  }

  // ── 2. Insert 50 records ────────────────────────────────────────
  console.log("\n📥 Inserting 50 records...");

  for (let i = 0; i < MOCK_RECORDS.length; i++) {
    const rec = MOCK_RECORDS[i];
    const sql = `
INSERT INTO ai_insight_mockup (template_id, customer_name, phone, platform, data_json, converted_at)
VALUES (
  '${rec.template_id}',
  '${rec.customer_name.replace(/'/g, "''")}',
  '${rec.phone}',
  '${rec.platform}',
  '${rec.data_json.replace(/'/g, "''")}'::jsonb,
  '${rec.converted_at}'
);`;

    const res = await client.callTool({ name: "execute_sql", arguments: { query: sql } });
    let r;
    try { r = JSON.parse(res.content?.[0]?.text || '{}'); } catch { r = res; }
    const ok = r.status === 201 || r.status === 204 || r.status === 200;
    console.log(`  ${ok ? '✅' : '❌'} [${i+1}/50] ${rec.template_id} — ${rec.customer_name}`);
    if (!ok) console.log("     Error:", JSON.stringify(r).substring(0, 120));
  }

  // ── 3. Verify ───────────────────────────────────────────────────
  console.log("\n🔍 Verifying...");
  const verifyRes = await client.callTool({
    name: "execute_sql",
    arguments: { query: "SELECT COUNT(*) as total, COUNT(DISTINCT template_id) as unique_templates FROM ai_insight_mockup;" }
  });
  console.log("📊 Result:", verifyRes.content?.[0]?.text || verifyRes);

  await client.close();
  console.log("\n✅ Done!");
}

run().catch(err => {
  console.error("❌ Fatal error:", err.message);
  process.exit(1);
});
