# [**Join 330+ Agencies & Brands**](https://go.mikefutia.com/scale-lm-delivery) 

# [**Inside SCALE AI**](https://go.mikefutia.com/scale-lm-delivery)

# 

# **The Claude Code Static Ad Generator Playbook for DTC Brands & Creative Agencies**

How to build a system inside Claude Code that generates production-ready static ads for any brand — from brand research to finished creatives — using Nano Banana 2 and the FAL API.

## **Who This Playbook Is For**

This playbook is for three people:

The DTC founder or head of growth who needs more static ad variations but doesn't have the budget or bandwidth to brief a designer every time you want to test a new angle, hook, or persona — and you're tired of doing it yourself in Canva.

The agency owner or creative director who's managing ad creative across multiple clients and needs a repeatable system that can spin up dozens of on-brand ad variations in minutes instead of days.

And the media buyer or creative strategist who's already using Claude Code for other workflows and wants to add a full image generation pipeline to their toolkit — one that actually matches the brand's visual identity instead of producing generic AI output.

If you've ever found a winning ad concept on Meta and thought "I wish I could spin up 20 variations of this in my brand's style without touching Canva or briefing a designer" — this playbook shows you exactly how to build that.

## **What You're Building**

By the end of this playbook, you'll have a project inside Claude Code that does three things:

First, it researches any brand you give it. You provide a brand name and URL, and Claude goes out with web search, pulls the brand's fonts, colors, packaging details, photography style, positioning, and competitive landscape, and compiles it all into a Brand DNA document. This is the same kind of reverse-engineering analysis a brand strategist would do before a campaign — except Claude does it in a few minutes.

Second, it generates ad-ready image prompts. You maintain a library of static ad templates — headline ads, us-vs-them comparisons, testimonial cards, UGC-style posts, review screenshots, stat callout radials, whatever formats you test. Claude reads the Brand DNA and fills in every template with brand-specific details: the exact hex colors, the typography style, the product description, the copy, the layout. Every prompt is immediately ready to fire into an image generation model.

Third, it generates the actual images. A Python script takes those finished prompts and sends them to Nano Banana 2 via the FAL API. If the template shows the actual product, it passes your product photos as reference images so the model matches your real packaging. If it's a lifestyle or UGC template, it uses text-to-image. Four images per prompt, 2K resolution, all downloaded into organized folders.

The end result: you go from "here's a brand name and a URL" to a folder full of production-ready static ads without ever leaving Claude Code.

## **Why This Architecture (And Why Not Just Use Higgsfield)**

You could do this manually. Open Claude, paste the brand research prompt, wait for the Brand DNA, paste the follow-up prompt with your templates, wait for the filled prompts, then copy each one into Higgsfield or Nano Banana's playground one at a time. That works for five ads. It doesn't work for forty.

The Claude Code approach solves three problems the manual workflow doesn't:

Automation. The Python script fires all your prompts to the API sequentially with no copy-pasting. You kick it off and walk away.

Product image reference. When you use the edit endpoint with image\_urls, Nano Banana 2 actually sees your product photos and matches the real packaging in the output. This is the difference between "generic protein bar" and "the exact Aloha wrapper with the right colors and label placement." The manual playground doesn't support this as cleanly.

Repeatability. Once the project is set up, running it for a new brand is three steps: create a folder, drop in product images, tell Claude the brand name and URL. The Brand DNA research, prompt generation, and image generation all happen automatically.

## **How It Works: The Three Phases**

### **Phase 1: Brand Research**

This is where Claude goes out and reverse-engineers the brand's visual identity. You give it a brand name and a URL, and it runs a structured research process.

It searches the web for the brand's design agency, public brand guidelines, typography, color palette, packaging photography, current Meta ads, and founding story. Then it fetches the actual brand URL and analyzes the site — hero copy, photography style, color application, layout density, packaging details. Finally, it searches for two or three direct competitors to establish how the brand differentiates visually.

All of this gets compiled into a Brand DNA document with a specific structure: brand overview, visual system (fonts, colors, CTA styles), photography direction (lighting, color grading, composition, mood), product details (physical description, label placement, distinctive features), ad creative style (typical formats, text overlay approach, UGC usage), and — critically — an Image Generation Prompt Modifier. That modifier is a 50-75 word paragraph that gets prepended to every single ad prompt so the outputs match the brand's visual identity.

The Brand DNA document saves to the brand folder and becomes the foundation for everything that follows.

### **Phase 2: Prompt Generation**

This is where Claude takes your template library and makes it brand-specific.

A template is a standardized image generation prompt with bracketed placeholders. For example, a headline ad template might specify: background color, headline text, subhead text, product description, camera angle, brand logo placement, and aspect ratio — but all as \[PLACEHOLDERS\] that need to be filled in.

You can build as many templates as you want. Headline ads. Offer promotions. Testimonial cards. Feature callouts. Us-vs-them comparisons. Before-and-after UGC. Negative marketing bait-and-switch. Press editorial layouts. Review cards. Stat surround callouts. Manifesto ads. Faux iPhone screenshots. Post-it note style. Whatever formats you test in your ad account, you build a template for it.

Claude reads the Brand DNA document, reads your template library, and fills in every placeholder with brand-specific details. It also tags each prompt with the correct aspect ratio and whether it needs product reference images. The output is a JSON file with every prompt ready to fire.

### **Phase 3: Image Generation**

A Python script handles the API calls. It does four things:

It reads the prompts.json file from the brand folder. It scans the product-images folder and uploads your photos to FAL's storage so they're accessible as URLs. For each prompt, it checks whether the template needs product reference images — if yes, it calls the edit endpoint with your product photos attached so Nano Banana 2 can see the real packaging; if no, it calls the standard text-to-image endpoint. It downloads four images per prompt into organized folders and generates an HTML gallery of everything.

The key technical detail: Nano Banana 2's edit endpoint accepts up to 14 reference images alongside a text prompt. When your template describes the actual product packaging, passing the real product photos dramatically improves output quality. The model doesn't have to guess what your product looks like — it can see it.

## **Setting It Up: Step by Step**

Step 1: Create the project folder structure.

You need three things at the root: a skills folder (where the orchestration files live), a skills/references subfolder (where templates and the generation script live), and a brands folder (where each brand gets its own workspace).

Step 2: Create the skill file.

The skill file (skills/SKILL.md) is the brain of the tool. It contains the full Brand Research system prompt, the Prompt Generation instructions, the FAL API details, and the interaction patterns so Claude knows how to run each phase. When you tell Claude "generate ads for \[brand\]," it reads this file and knows exactly what to do.

Tell Claude Code: "Create a file at skills/SKILL.md" — then paste in the following:

\---

name: static-ad-generator

description: Generate production-ready static ad images for any brand using Claude \+ Nano Banana 2\. End-to-end workflow from brand research → prompt generation → image generation via FAL API. Trigger on requests to create static ads, generate ad creatives, build ad images, or when user mentions Nano Banana, Higgsfield, FAL, or static ad generation. Also trigger when user drops a brand name \+ URL and asks for ad creatives.

\---

\# Static Ad Generator (Claude Code \+ Nano Banana 2\)

Generate 40+ production-ready static ad images for any brand — from brand research to finished creatives — entirely inside Claude Code.

\#\# Overview

This skill replaces the manual Claude → Higgsfield workflow with a fully automated pipeline:

1\. \*\*Brand Research\*\* → Claude builds a Brand DNA document via web search

2\. \*\*Prompt Generation\*\* → Claude fills 40 template prompts with brand-specific details

3\. \*\*Image Generation\*\* → Python script fires prompts to Nano Banana 2 via FAL API

No Higgsfield needed. No copy-pasting prompts. One command, 40+ ads.

\---

\#\# Prerequisites

\- \*\*FAL API key\*\* set as environment variable: \`export FAL\_KEY="your-key-here"\`

\- \*\*Python packages\*\*: \`requests\` (for FAL REST API calls)

\- \*\*Product images\*\* dropped in the brand folder before running

\---

\#\# Folder Structure

\~/brands/{brand-name}/

├── product-images/          \# Drop product PNGs/JPGs here before running

│   ├── product-front.png

│   ├── product-angle.png

│   └── ...

├── brand-dna.md             \# Generated by Phase 1

├── prompts.json             \# Generated by Phase 2

├── generate\_ads.py          \# Image generation script (Phase 3\)

└── outputs/                 \# Generated images organized by template

    ├── 01-headline/

    │   ├── headline\_v1.png

    │   └── prompt.txt

    ├── 02-offer-promotion/

    │   └── ...

    └── ...

\---

\#\# Phase 1: Brand Research & DNA Generation

When the user provides a brand name and URL, execute the Brand Research prompt below. Use web search extensively to gather real data.

\#\#\# Brand Research System Prompt

Role: Act as a Senior Brand Strategist conducting a full reverse-engineering of the target brand's visual and verbal identity.

Objective: Create a comprehensive Brand DNA document that will be used to write highly specific AI image generation prompts. Every detail matters because the output will be fed into an image model that needs exact specifications.

RESEARCH STEPS:

1\. EXTERNAL RESEARCH (use web search for each):

   \- Design credits: Search for "who designed \[Brand\] branding", "\[Brand\] design agency case study", "\[Brand\] rebrand"

   \- Public brand assets: Search for "\[Brand\] brand guidelines pdf", "\[Brand\] press kit", "\[Brand\] media kit", "\[Brand\] style guide"

   \- Typography: Search for "\[Brand\] font", "\[Brand\] typeface", "what font does \[Brand\] use"

   \- Colors: Search for "\[Brand\] brand colors", "\[Brand\] hex codes", "\[Brand\] color palette"

   \- Packaging: Search for "\[Brand\] packaging design", "\[Brand\] unboxing", "\[Brand\] product photography"

   \- Advertising: Search "\[Brand\] Meta Ad Library" for current ad creative styles

   \- Press and positioning: Search for "\[Brand\] brand story", "\[Brand\] founding story", "\[Brand\] mission"

2\. ON-SITE ANALYSIS (fetch and analyze the brand URL):

   \- Voice and Tone: Read hero copy, About page, and product descriptions. Give 5 distinct adjectives.

   \- Photography Style: Describe lighting, color grading, composition, and subject matter.

   \- Typography on site: Headline weight, body weight, letter-spacing, distinctive treatments.

   \- Color application: Primary vs accent usage. Background colors. CTA color.

   \- Layout density: Airy or dense? Grid-based or organic?

   \- Packaging details: Physical appearance (materials, colors, shape, label placement, textures, translucency, matte vs gloss).

3\. COMPETITIVE CONTEXT:

   \- Search for 2-3 direct competitors and note visual differentiation.

4\. OUTPUT FORMAT:

BRAND DNA DOCUMENT

\==================

BRAND OVERVIEW

Name / Tagline / Design Agency / Voice Adjectives \[5\] / Positioning / Competitive Differentiation

VISUAL SYSTEM

Primary Font / Secondary Font / Primary Color \[hex\] / Secondary Color \[hex\] / Accent Color \[hex\] / Background Colors / CTA Color and Style

PHOTOGRAPHY DIRECTION

Lighting / Color Grading / Composition / Subject Matter / Props and Surfaces / Mood

PRODUCT DETAILS

Physical Description / Label-Logo Placement / Distinctive Features / Packaging System

AD CREATIVE STYLE

Typical formats / Text overlay style / Photo vs illustration / UGC usage / Offer presentation

IMAGE GENERATION PROMPT MODIFIER

Write a single 50-75 word paragraph to prepend to any image prompt to match this brand's visual identity. Include exact colors, font descriptions, photography direction, and mood.

Save output as: \~/brands/{brand-name}/brand-dna.md

\---

\#\# Phase 2: Prompt Generation

After the Brand DNA is complete, generate brand-specific prompts from the 40 templates.

\#\#\# Prompt Generation System Prompt

Take the 40 template prompts from the reference file and fill them in with detail specifically for \[BRAND NAME\] that aligns with the Brand DNA document, especially the Image Generation Prompt Modifier and the Ad Creative Style section.

For each template:

1\. Replace all \[BRACKETED PLACEHOLDERS\] with brand-specific details

2\. Prepend the Image Generation Prompt Modifier from the Brand DNA

3\. Set the correct aspect\_ratio based on the template (most are 1:1 or 4:5 or 9:16)

4\. Determine if the template needs product reference images (needs\_product\_images: true/false)

   \- Templates describing the actual product packaging \= true

   \- Templates that are pure lifestyle/UGC/editorial with no product shown \= false

5\. Include the product name and any specific product details provided

Output as a JSON file with this structure:

{

  "brand": "Brand Name",

  "product": "Specific Product Name",

  "generated\_at": "ISO timestamp",

  "prompts": \[

    {

      "template\_number": 1,

      "template\_name": "headline",

      "prompt": "Full completed prompt text ready for Nano Banana 2...",

      "aspect\_ratio": "4:5",

      "needs\_product\_images": true,

      "notes": "Any generation notes or copy that should be refined"

    }

  \]

}

Reference file for templates: See references/template-prompts.md

Save output as: \~/brands/{brand-name}/prompts.json

\---

\#\# Phase 3: Image Generation via FAL API

Run the Python generation script to fire all prompts to Nano Banana 2\.

\#\#\# How to Execute

cd \~/brands/{brand-name}

python generate\_ads.py

Or generate specific templates only:

python generate\_ads.py \--templates 1,7,13,15

\#\#\# Script Behavior

The generate\_ads.py script (see references/generate\_ads.py):

1\. Reads prompts.json from the brand folder

2\. Scans product-images/ for available reference images

3\. For each prompt:

   \- If needs\_product\_images: true → uploads product images to FAL storage, calls fal-ai/nano-banana-2/edit with image\_urls

   \- If needs\_product\_images: false → calls fal-ai/nano-banana-2 (text-to-image)

4\. Downloads generated images to outputs/{template-number}-{template-name}/

5\. Saves the prompt text alongside each image as prompt.txt

6\. Generates an index.html gallery showing all generated ads

\#\#\# FAL API Details

Text-to-Image endpoint: fal-ai/nano-banana-2

\- Input: prompt, aspect\_ratio, num\_images, output\_format, resolution

\- Aspect ratios: auto, 21:9, 16:9, 3:2, 4:3, 5:4, 1:1, 4:5, 3:4, 2:3, 9:16

\- Resolution options: 0.5K, 1K, 2K, 4K (default: 1K)

Edit/Image-Reference endpoint: fal-ai/nano-banana-2/edit

\- Input: same as above \+ image\_urls (array of URLs, up to 14\)

\- Product images must be uploaded to FAL storage first or be publicly accessible URLs

\---

\#\# User Interaction Flow

\#\#\# Quick Start (user says "generate ads for \[brand\]")

1\. Ask for: brand name, URL, specific product name

2\. Confirm they have product images ready (or ask them to drop images in the folder)

3\. Run Phase 1 → Phase 2 → Phase 3 sequentially

4\. Present the output gallery

\#\#\# Selective Generation (user says "just generate templates 1, 7, 13")

1\. Confirm brand folder and prompts.json exist

2\. Run Phase 3 with \--templates filter

\#\#\# Re-run with New Product (user says "now do it for \[different SKU\]")

1\. Skip Phase 1 (Brand DNA already exists)

2\. Re-run Phase 2 with new product details

3\. Run Phase 3

\---

\#\# Key Technical Notes

\- Product images are critical for quality. The more reference images you provide (front, back, angled, lifestyle), the better Nano Banana 2 matches the real product in the output. 1-3 images is the sweet spot.

\- The edit endpoint is for product-reference generation. When the prompt describes the actual product packaging, we use /edit with image\_urls so the model sees the real product. For UGC, lifestyle, or editorial templates where no product is shown, we use standard text-to-image.

\- Aspect ratios matter for ad placement. 1:1 for feed, 4:5 for feed (more real estate), 9:16 for stories/reels. The templates specify the correct ratio.

\- Resolution: Default is 2K for production-quality output. Use 1K for faster test runs, 4K for hero assets.

\- Images per prompt: 4 images generated per prompt by default, giving you options to pick the best output. A full 40-template run \= 160 images.

\- Cost: \~$0.12 per image at 2K (1.5x the 1K rate). A full 40-template run at 4 images each \= \~$19.20. Use \--templates to generate selectively and control cost.

\- Copy refinement: The generated copy from Phase 2 is functional but generic. For best results, mine customer reviews (via Apify scraping) and inject real customer language before running Phase 3\.

Step 3: Create your template library.

This is your library of static ad formats (skills/references/template-prompts.md). Each template is a complete Nano Banana 2 prompt with bracketed placeholders for brand-specific details. The more templates you build, the more ad variations you get per brand.

This is the part you'll customize most over time. Every time you see a winning ad format on Meta that you want to replicate, you build a standardized template for it and add it to the library. The template should specify everything the image model needs: layout, typography, colors, composition, camera settings, and aspect ratio — but with placeholders for the brand-specific details.

Step 4: Add the generation script.

The Python script (skills/references/generate\_ads.py) handles all the FAL API communication. It reads prompts, uploads product images, fires requests to Nano Banana 2, polls for results, downloads images, and builds the gallery. You set your FAL API key as an environment variable and the script handles everything else.

Step 5: Create a brand folder and add product images.

For each brand you work on, create a subfolder inside brands/ with a product-images/ subfolder. Drop in 1-3 product photos — front of packaging, angled shot, lifestyle shot if you have one. These are the reference images that Nano Banana 2 uses to match your real product in the generated ads.

Step 6: Run the pipeline.

Tell Claude to read the skill file and run Phase 1 for your brand. Give it the brand name and URL. It builds the Brand DNA. Then tell it to run Phase 2 — it reads the Brand DNA and your templates, generates the filled prompts. Then tell it to run Phase 3 — it copies the generation script to the brand folder and fires everything to the API.

You can run all templates at once or pass specific template numbers to test a subset first.

## **The Template Library: How to Build Your Own**

This is the most important long-term asset in the system. Your template library is what makes the tool produce ads that match proven formats instead of random AI generations.

The process for building a new template:

Find a winning ad on Meta that's been running for months. Study the format — layout, text placement, photography style, trust elements, CTA structure. Write a Nano Banana 2 prompt that recreates that exact format but with bracketed placeholders for brand-specific details. Test it with a few brands to make sure the placeholders are general enough to work across different products. Add it to your template library.

Each template should specify: the visual layout and composition, text elements with placeholder copy, photography direction (camera angle, lighting, depth of field), color scheme using placeholder brand colors, aspect ratio for the intended ad placement, and whether it needs product reference images.

The templates are the system's competitive advantage. Anyone can call an image generation API. The value is having a curated library of proven ad formats that produce on-brand results consistently.

## **Cost and Performance**

Nano Banana 2 through the FAL API costs approximately $0.08 per image at 1K resolution, $0.12 at 2K, and $0.16 at 4K. At the default settings of 4 images per prompt at 2K resolution, a 5-template test run produces 20 images for about $2.40. A full 40-template run produces 160 images for about $19.20.

The 2K default is the sweet spot for production quality without excessive cost. Use 1K for rapid testing when you're dialing in templates. Use 4K only for hero assets.

Generation time varies, but expect 10-30 seconds per prompt depending on API load and resolution. A full 40-template run takes roughly 15-25 minutes.

## **Extending the System**

Once the base pipeline is working, there are a few natural extensions:

Customer review mining. Before Phase 2, use Apify to scrape customer reviews from the brand's site and feed real customer language into the copy fields. This replaces the generic Claude-generated copy with lines that actually resonate.

Batch brand processing. If you're an agency running this across multiple clients, you can script the entire pipeline to loop through a list of brands. Create the folder, run Phase 1-2-3, move to the next brand.

Copy refinement loop. After Phase 3, review the outputs and identify which templates produced the strongest results. Feed those back into Claude with notes on what to adjust, regenerate the prompts, and run Phase 3 again. The Brand DNA and templates stay the same — you're just iterating on copy and composition.

Template versioning. As you test ads and learn what converts, update your templates. The library is a living document that gets better over time as you incorporate learnings from real campaign performance.

## **Quick-Start Checklist**

* \[ \] Set up the project folder structure in Claude Code (skills/, skills/references/, brands/)  
* \[ \] Create the skill file with the Brand Research and Prompt Generation system prompts  
* \[ \] Build or import your template library  
* \[ \] Add the Python generation script  
* \[ \] Set your FAL API key as an environment variable  
* \[ \] Create a brand folder and drop in product images  
* \[ \] Run Phase 1 (Brand Research) → Phase 2 (Prompt Generation) → Phase 3 (Image Generation)  
* \[ \] Review the HTML gallery and pick winners for your ad account  
* \[ \] Iterate on templates based on what performs

