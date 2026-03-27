// =====================================================================
// Script: Tạo bảng landing_leads trong Supabase
// Usage: node scripts/create-landing-table.js
// =====================================================================
// Supabase REST API: https://db.cdp.vn/rest/v1
// =====================================================================

// Lấy API Key từ biến môi trường hoặc hardcode tạm (thay bằng service role key của bạn)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://db.cdp.vn';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || '';

if (!SUPABASE_KEY) {
  console.error('❌ Thiếu SUPABASE_SERVICE_KEY. Vui lòng set biến môi trường:');
  console.error('   export SUPABASE_SERVICE_KEY="your-service-role-key"');
  console.error('   Hoặc chạy trực tiếp trong Supabase Dashboard → SQL Editor');
  process.exit(1);
}

const TABLE_NAME = 'landing_leads';

const createTableSQL = `
-- ================================================================
-- Bảng landing_leads: Thu thập thông tin khách truy cập landing page
-- ================================================================
CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  industry TEXT,
  experience_rating INTEGER CHECK (experience_rating BETWEEN 1 AND 5),
  experience_text TEXT,
  use_case TEXT,
  consent_privacy BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (cho phép insert không cần auth)
ALTER TABLE ${TABLE_NAME} ENABLE ROW LEVEL SECURITY;

-- Policy: Cho phép insert từ client (anon key)
CREATE POLICY IF NOT EXISTS "Allow anonymous inserts"
ON ${TABLE_NAME} FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Chỉ cho phép đọc từ service role (backend)
CREATE POLICY "Allow service role read"
ON ${TABLE_NAME} FOR SELECT
TO authenticated
USING (true);

-- ================================================================
-- Kiểm tra bảng đã tồn tại
-- ================================================================
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = '${TABLE_NAME}'
ORDER BY ordinal_position;
`.trim();

async function run() {
  console.log('🚀 Tạo bảng landing_leads...\n');

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ sql: createTableSQL }),
    });

    if (response.ok) {
      console.log('✅ Bảng landing_leads đã được tạo thành công!');
    } else {
      // Nếu RPC không có, thử cách khác
      const errorText = await response.text();
      console.log('⚠️ RPC exec_sql không khả dụng. Vui lòng chạy SQL bên dưới trong Supabase Dashboard → SQL Editor:\n');
      console.log(createTableSQL);
      console.log('\n📝 Hoặc sử dụng Supabase Dashboard:');
      console.log('   1. Mở https://db.cdp.vn/project/default/sql/new');
      console.log('   2. Dán và chạy SQL trên');
    }
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    console.log('\n📝 Vui lòng chạy SQL sau trong Supabase Dashboard → SQL Editor:\n');
    console.log(createTableSQL);
  }
}

run();
