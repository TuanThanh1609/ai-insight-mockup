// =====================================================================
// Supabase Landing Page Integration
// Dùng native fetch → Supabase REST API
// =====================================================================
// Service Role Key bypasses RLS — dùng cho form submission landing page
// Lấy key: Supabase Dashboard → Project Settings → API → service_role secret
// =====================================================================

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://db.cdp.vn';
// Service role key — bypasses RLS, dùng cho client-side insert từ landing form
const SUPABASE_SERVICE_KEY =
  import.meta.env.VITE_SUPABASE_SERVICE_KEY || '';

/**
 * Gửi thông tin lead từ landing page → Supabase
 * @param {{ name: string, email: string, experience_rating?: number, consent_privacy: boolean }} data
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function saveLandingLead(data) {
  if (!SUPABASE_SERVICE_KEY) {
    console.warn('[supabaseLanding] VITE_SUPABASE_SERVICE_KEY chưa được set. Dữ liệu chỉ log console.');
    console.log('[supabaseLanding] Lead data:', data);
    // Simulate success trong dev mode để không block UX
    return { success: true, devMode: true };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/landing_leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        experience_rating: data.experience_rating || null,
        consent_privacy: data.consent_privacy === true,
        created_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMsg = `HTTP ${response.status}`;
      try {
        const parsed = JSON.parse(errorBody);
        errorMsg = parsed.message || parsed.error || errorMsg;
      } catch {
        errorMsg = errorBody || errorMsg;
      }
      return { success: false, error: errorMsg };
    }

    const resultData = await response.json();
    console.log('[supabaseLanding] Lead saved:', resultData);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || 'Lỗi kết nối mạng' };
  }
}
