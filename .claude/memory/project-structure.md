# Thư Mục Dự Án (Chi Tiết)

```
d:\vibe-coding\Nâng cấp AI Insight\
├── .claude/
│   ├── agents/                 ← Marketing Agent prompts
│   │   ├── market-research-agent.md
│   │   ├── campaign-strategist-agent.md
│   │   ├── content.md
│   │   └── design-graphic.md
│   ├── memory/                 ← Memory files (chi tiết từ CLAUDE.md)
│   │   ├── track-a.md
│   │   ├── track-b.md
│   │   ├── track-c.md
│   │   ├── session-log.md
│   │   └── project-structure.md
│   └── rules/
│       └── deploy-vercel.md
├── template-insight.md          ← Nguồn truth cho prompt Insight (Track A)
├── CLAUDE.md                    ← Slim version (<250 dòng)
├── vercel.json                 ← SPA rewrite (fix 404 on F5)
├── PRD.md                       ← Product Requirements Document
├── PRD-Insight-v3.md           ← PRD mới cho Insight v3
├── DESIGN.md                    ← Design System ("The Intelligent Canvas")
├── index.html
├── package.json                 ← React 19 + Vite + Recharts + Lucide + framer-motion
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── api/
    │   └── smax-chat.js        ← Vercel API proxy chống CORS
    ├── lib/
    │   ├── utils.js
    │   ├── medicalService.js    ← 9 nhóm bệnh, seed data, lộ trình cải thiện
    │   ├── smaxAIService.js     ← Smax AI streaming + cache 24h
    │   ├── aiService.js        ← Custom AI (token.ai.vn) service
    │   ├── mockDataService.js  ← Runtime generator + computeAnalysis
    │   └── supabaseLanding.js ← Landing page → Supabase
    ├── data/
    │   ├── mockTemplates.js         ← 42 template (7 ngành × 6 insight)
    │   ├── mockConversations.js      ← Chat mẫu (legacy)
    │   ├── mockAnalysisResults.js    ← Kết quả AI mẫu (legacy)
    │   ├── mockCampaigns.js         ← 8 campaigns + daily breakdown
    │   ├── mockAIInsights.js         ← AI recommendations
    │   ├── mockInsightTrend.js       ← Trend data 7d/30d
    │   ├── mockConversationDetails.js ← Chi tiết hội thoại mock
    │   ├── supabase-conversations.json ← 3075+ rows từ Supabase
    │   ├── landingTestimonials.js    ← Landing page testimonials
    │   └── landingTemplates.js       ← Landing page 7 ngành preview
    ├── pages/
    │   ├── LandingPage.jsx          ← Landing page (route: /)
    │   ├── MedicalCheckupLanding.jsx ← Landing Khám Bệnh (route: /kham-benh)
    │   ├── OfficialPage.jsx          ← Campaign launch (route: /official)
    │   ├── InsightSettings.jsx       ← Track A: Cài đặt Insight
    │   ├── InsightDashboard.jsx      ← Track A: Insight Dashboard
    │   ├── OverviewDashboard.jsx     ← Track A: CEO Command Center
    │   ├── MedicalCheckup.jsx       ← Track A: Khám Bệnh (5-step wizard)
    │   ├── ImprovementRoadmapPage.jsx ← Track A: Lộ trình cải thiện
    │   ├── AdsDashboard.jsx         ← Track B: Tổng quan Ads
    │   └── AdsOptimization.jsx      ← Track B: Gợi ý tối ưu Ads
    └── components/
        ├── layout/                   ← Sidebar, Header, PageContainer
        ├── ui/                      ← Button, Badge, Card, Modal, Input, Toast, Tabs, RadarEffect
        ├── landing/                  ← Hero, Problem, Solution, HowItWorks, Testimonials, TemplateGallery, LeadCapture, Footer, TopNavBar, TrustSection
        ├── medical/                  ← 20+ components Khám Bệnh
        ├── overview/                 ← CEO Command Center components
        ├── ads/                      ← Khám Bệnh Ads components
        └── insight/                 ← Track A + Track B shared components
```

## Technology Stack

| Layer | Công nghệ |
|-------|-----------|
| Framework | React 19 (SPA) |
| Bundler | Vite 6 |
| Styling | Tailwind CSS v4 + CSS variables (glassmorphism, no-line UI) |
| Charts | Reamerics v2 |
| Icons | Lucide React |
| Fonts | Manrope (display) + Inter (body) |
| Animation | framer-motion |
| AI | Smax AI API, Custom AI (token.ai.vn) |

## Routes

| Route | Component | Sidebar |
|-------|-----------|---------|
| `/` | LandingPage | No |
| `/kham-benh` | MedicalCheckupLanding | No |
| `/official` | OfficialPage | No |
| `/insight/overview` | OverviewDashboard | Yes |
| `/insight/settings` | InsightSettings | Yes |
| `/insight/insight-dashboard` | InsightDashboard | Yes |
| `/insight/medical-checkup` | MedicalCheckup | Yes |
| `/insight/improvement-roadmap` | ImprovementRoadmapPage | Yes |
| `/insight/dashboard` | AdsDashboard | Yes |
| `/insight/ads-optimization` | AdsOptimization | Yes |
