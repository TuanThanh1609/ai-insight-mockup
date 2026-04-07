# Quy tắc chống deploy nhầm (Vercel)

## Checklist bắt buộc trước khi báo deploy xong

1. Kiểm tra alias hiện tại:
   - `npx vercel alias ls | grep "ai-insight-mockup.vercel.app"`
2. Alias phải trỏ đúng deployment mới nhất (không dùng deployment cũ dù status `Ready`).
3. Verify trực tiếp route chính:
   - `https://ai-insight-mockup.vercel.app/insight/medical-checkup`
4. Nếu gặp `404: NOT_FOUND`:
   - kiểm tra `vercel.json` nằm ở **root project** (không đặt trong `src/`)
   - redeploy rồi kiểm tra lại alias
5. Chỉ xác nhận “deploy xong” khi thỏa cả 2 điều kiện:
   - Alias đúng
   - Route hoạt động bình thường

## Ghi nhớ
- Không kết luận bằng deployment URL suffix nếu URL đó yêu cầu login.
- Ưu tiên xác nhận trên alias public chính thức.