# Track C — Marketing Team Agents (Chi Tiết)

## C1. Agent Roster

Dự án có **4 agents chuyên biệt** trong `.claude/agents/`:

| Agent | File | Vai trò | Đầu ra |
|-------|------|---------|--------|
| **Market Research Agent** | `market-research-agent.md` | Nghiên cứu thị trường, TAM/SAM, đối thủ, xu hướng, SWOT/PESTEL, personas | Báo cáo, DOCX, PPTX, XLSX, PDF |
| **Campaign Strategist Agent** | `campaign-strategist-agent.md` | Thiết kế chiến dịch, kế hoạch đa kênh, brief Content/Design/Media | Master Campaign Plan, briefs |
| **Social Content Agent** | `content.md` | Tạo nội dung sáng tạo: social post, landing page, slide, document | HTML, PPTX, DOCX, social copy |
| **Graphic Design Agent** | `design-graphic.md` | Tạo hình ảnh, banner, landing page bằng AI tools (nanobanana, Stitch, Canva) | PNG/JPG, UI screens |

## C2. Điều Phối — Mô Hình Pipeline

Khi nhận **kế hoạch triển khai marketing**, điều phối agents theo pipeline:

```
Bước 1 — MARKET RESEARCH (chạy song song nếu cần)
  └─ Market Research Agent
      → Đầu ra: Research Report (DOCX) + Competitor Matrix (XLSX)

Bước 2 — CAMPAIGN STRATEGY (chạy sau khi research xong)
  └─ Campaign Strategist Agent
      → Đầu ra: Master Campaign Plan (DOCX) + briefs cho từng team

Bước 3 — CONTENT CREATION (chạy song song, nhận brief từ Strategist)
  └─ Social Content Agent
      → Đầu ra: Social posts, landing page copy, email sequences, slide decks

Bước 4 — VISUAL DESIGN (chạy song song với Content, nhận brief từ Strategist)
  └─ Graphic Design Agent
      → Đầu ra: Banner ads, social images, hero visuals, UI screens

Bước 5 — CONSOLIDATION
  └─ Synthesize tất cả đầu ra → trình kết quả cho user
```

## C3. Khi Nào Gọi Agent Nào

| Tình huống | Agent gọi |
|-----------|-----------|
| Cần nghiên cứu thị trường mới (size, đối thủ, xu hướng) | Market Research Agent |
| Cần lên kế hoạch chiến dịch marketing đầy đủ | Campaign Strategist Agent |
| Cần tạo nội dung cụ thể: post, landing page, slide, doc | Social Content Agent |
| Cần tạo hình ảnh quảng cáo, banner, UI design | Graphic Design Agent |
| Cần cả nghiên cứu + chiến dịch + nội dung + design | Chạy pipeline: Research → Strategy → Content → Design |

## C4. Cách Triển Khai — Nhận Kế Hoạch Marketing

### Khi user bàn giao 1 kế hoạch triển khai marketing:

**Bước 1: Phân tích brief**
- Xác định mục tiêu (thương hiệu? sản phẩm mới? event? lead generation?)
- Xác định audience mục tiêu
- Xác định timeline và ngân sách
- Kiểm tra có research data sẵn không

**Bước 2: Gọi agents theo sequence**
```
1. Market Research Agent (nếu chưa có data)
   → "Research [industry/market] for [product/campaign]. Focus on: competitors, audience personas, market size, trends."

2. Campaign Strategist Agent (sau research)
   → "Build a full-funnel campaign plan for [objective]. Audience: [description]. Product: [description]. Timeline: [duration]."

3. Social Content Agent + Graphic Design Agent (song song, nhận brief từ Strategist)
   → "Create [specific content pieces] based on the campaign brief. Brand: [brand guidelines]."
   → "Generate [visual assets] for the campaign. Style: [style guide]. Dimensions: [specs]."
```

**Bước 3: Tổng hợp kết quả**
- Gom tất cả đầu ra từ các agents
- Kiểm tra consistency (message, visual, tone)
- Trình báo cáo tổng hợp cho user

## C5. Output Directory Structure

```
output/
├── marketing/
│   ├── {YYYY-MM-DD}-{campaign-name}/
│   │   ├── research/          ← Market Research Agent outputs
│   │   │   ├── research-report.docx
│   │   │   ├── competitor-matrix.xlsx
│   │   │   └── audience-personas.pdf
│   │   ├── strategy/          ← Campaign Strategist Agent outputs
│   │   │   ├── master-campaign-plan.docx
│   │   │   ├── content-brief.md
│   │   │   ├── design-brief.md
│   │   │   └── media-brief.md
│   │   ├── content/           ← Social Content Agent outputs
│   │   │   ├── social-posts.md
│   │   │   ├── landing-page-copy.html
│   │   │   └── email-sequences.docx
│   │   └── visuals/           ← Graphic Design Agent outputs
│   │       ├── banners/
│   │       ├── hero-images/
│   │       └── social-assets/
└── designs/                   ← nanobanana / Stitch outputs
    └── {YYYY-MM-DD}/
```

## C6. Các File Agent

| Agent File | Mục đích |
|-----------|----------|
| `.claude/agents/market-research-agent.md` | Nghiên cứu thị trường — TAM/SAM/SOM, đối thủ, personas, SWOT, PESTEL |
| `.claude/agents/campaign-strategist-agent.md` | Chiến lược chiến dịch — full-funnel plan, team briefs (Content/Design/Media) |
| `.claude/agents/content.md` | Nội dung sáng tạo — social posts, landing pages, slides, documents |
| `.claude/agents/design-graphic.md` | Thiết kế đồ họa — hình ảnh qua nanobanana/Stitch/Canva |
