const pptxgen = require('pptxgenjs');
const path = require('path');
const { chromium } = require('playwright');

const PX_PER_IN = 96;
const PT_PER_PX = 0.75;

async function html2pptx(htmlFile, pres) {
  const browser = await chromium.launch({ env: { TMPDIR: process.env.TMPDIR || '/tmp' } });
  const filePath = path.isAbsolute(htmlFile) ? htmlFile : path.join(process.cwd(), htmlFile);

  try {
    const page = await browser.newPage();
    await page.goto(`file://${filePath}`);

    const { width, height } = await page.evaluate(() => {
      const s = window.getComputedStyle(document.body);
      return { width: parseFloat(s.width), height: parseFloat(s.height) };
    });

    await page.setViewportSize({ width: Math.round(width), height: Math.round(height) });

    const { background, elements, placeholders, errors } = await page.evaluate(() => {
      const PX_PER_IN = 96, PT_PER_PX = 0.75;
      const pxToIn = px => px / PX_PER_IN;
      const pxToPt = px => parseFloat(px) * PT_PER_PX;

      const SINGLE_WEIGHT_FONTS = ['impact'];
      const shouldSkipBold = f => { if (!f) return false; const n = f.toLowerCase().replace(/['"]/g,'').split(',')[0].trim(); return SINGLE_WEIGHT_FONTS.includes(n); };

      const rgbToHex = s => {
        if (s === 'rgba(0, 0, 0, 0)' || s === 'transparent') return 'FFFFFF';
        const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!m) return 'FFFFFF';
        return m.slice(1).map(n => parseInt(n).toString(16).padStart(2,'0')).join('');
      };
      const extractAlpha = s => { const m = s.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/); if (!m || !m[4]) return null; const alpha = parseFloat(m[4]); return Math.round((1-alpha)*100); };

      const applyTextTransform = (text, tt) => {
        if (tt === 'uppercase') return text.toUpperCase();
        if (tt === 'lowercase') return text.toLowerCase();
        if (tt === 'capitalize') return text.replace(/\b\w/g, c => c.toUpperCase());
        return text;
      };

      const getRotation = (t, wm) => {
        let a = 0;
        if (wm === 'vertical-rl') a = 90; else if (wm === 'vertical-lr') a = 270;
        if (t && t !== 'none') { const m = t.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/); if (m) a += parseFloat(m[1]); }
        a = a % 360; if (a < 0) a += 360; return a === 0 ? null : a;
      };

      const parseBoxShadow = bs => {
        if (!bs || bs === 'none') return null;
        if (/inset/.test(bs)) return null;
        const cm = bs.match(/rgba?\([^)]+\)/);
        const parts = bs.match(/([-\d.]+)(px|pt)/g);
        if (!parts || parts.length < 2) return null;
        const ox = parseFloat(parts[0]), oy = parseFloat(parts[1]);
        const blur = parts.length > 2 ? parseFloat(parts[2]) : 0;
        let ang = Math.atan2(oy, ox) * (180/Math.PI);
        if (ang < 0) ang += 360;
        const off = Math.sqrt(ox*ox+oy*oy) * PT_PER_PX;
        let op = 0.5;
        if (cm) { const m = cm[0].match(/[\d.]+\)$/); if (m) op = parseFloat(m[0].replace(')','')); }
        return { type: 'outer', angle: Math.round(ang), blur: blur*0.75, color: cm ? rgbToHex(cm[0]) : '000000', offset: off, opacity: op };
      };

      const parseInline = (el, baseOpts = {}, runs = [], ttFn = x => x) => {
        let prevIsText = false;
        el.childNodes.forEach(node => {
          const isText = node.nodeType === Node.TEXT_NODE || node.tagName === 'BR';
          if (isText) {
            const text = node.tagName === 'BR' ? '\n' : ttFn(node.textContent.replace(/\s+/g,' '));
            const prev = runs[runs.length-1];
            if (prevIsText && prev) prev.text += text;
            else runs.push({ text, options: { ...baseOpts } });
          } else if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) {
            const opts = { ...baseOpts };
            const c = window.getComputedStyle(node);
            if (['SPAN','B','STRONG','I','EM','U'].includes(node.tagName)) {
              const isBold = c.fontWeight === 'bold' || parseInt(c.fontWeight) >= 600;
              if (isBold && !shouldSkipBold(c.fontFamily)) opts.bold = true;
              if (c.fontStyle === 'italic') opts.italic = true;
              if (c.textDecoration && c.textDecoration.includes('underline')) opts.underline = true;
              if (c.color && c.color !== 'rgb(0, 0, 0)') { opts.color = rgbToHex(c.color); const ta = extractAlpha(c.color); if (ta !== null) opts.transparency = ta; }
              if (c.fontSize) opts.fontSize = pxToPt(c.fontSize);
              if (c.textTransform && c.textTransform !== 'none') ttFn = t => applyTextTransform(t, c.textTransform);
              parseInline(node, opts, runs, ttFn);
            }
          }
          prevIsText = isText;
        });
        if (runs.length > 0) {
          runs[0].text = runs[0].text.replace(/^\s+/,'');
          runs[runs.length-1].text = runs[runs.length-1].text.replace(/\s+$/,'');
        }
        return runs.filter(r => r.text.length > 0);
      };

      const bodyStyle = window.getComputedStyle(document.body);
      const bgImage = bodyStyle.backgroundImage;
      let background = { type: 'color', value: rgbToHex(bodyStyle.backgroundColor) };
      if (bgImage && bgImage !== 'none') {
        const urlM = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
        if (urlM) background = { type: 'image', path: urlM[1] };
      }

      const elements = [], placeholders = [], errors = [];
      const textTags = new Set(['P','H1','H2','H3','H4','H5','H6','UL','OL','LI']);
      const processed = new Set();

      document.querySelectorAll('*').forEach(el => {
        if (processed.has(el)) return;

        if (textTags.has(el.tagName)) {
          const c = window.getComputedStyle(el);
          if ((c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)') || parseFloat(c.borderTopWidth) > 0 || parseFloat(c.borderRightWidth) > 0 || parseFloat(c.borderBottomWidth) > 0 || parseFloat(c.borderLeftWidth) > 0 || (c.boxShadow && c.boxShadow !== 'none')) {
            errors.push(`Text element <${el.tagName.toLowerCase()}> has unsupported styling`);
            return;
          }
        }

        if (el.className && typeof el.className === 'string' && el.className.includes('placeholder')) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0)
            placeholders.push({ id: el.id || `p${placeholders.length}`, x: pxToIn(rect.left), y: pxToIn(rect.top), w: pxToIn(rect.width), h: pxToIn(rect.height) });
          processed.add(el); return;
        }

        if (el.tagName === 'IMG') {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0)
            elements.push({ type: 'image', src: el.src, position: { x: pxToIn(rect.left), y: pxToIn(rect.top), w: pxToIn(rect.width), h: pxToIn(rect.height) } });
          processed.add(el); return;
        }

        if (el.tagName === 'DIV') {
          const c = window.getComputedStyle(el);
          const hasBg = c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)';
          const borderTop = parseFloat(c.borderTopWidth) || 0;
          const borderRight = parseFloat(c.borderRightWidth) || 0;
          const borderBottom = parseFloat(c.borderBottomWidth) || 0;
          const borderLeft = parseFloat(c.borderLeftWidth) || 0;
          const borders = [borderTop, borderRight, borderBottom, borderLeft];
          const hasBorder = borders.some(b => b > 0);
          const hasUniformBorder = hasBorder && borders.every(b => b === borders[0]);

          for (const node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
              errors.push(`DIV has unwrapped text: "${node.textContent.trim().substring(0,30)}..."`);
          }
          if (c.backgroundImage && c.backgroundImage !== 'none') { errors.push('BG images on DIV not supported'); return; }

          if (hasBg || hasBorder) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              const shadow = parseBoxShadow(c.boxShadow);
              const radius = parseFloat(c.borderRadius);
              const rectRadius = radius >= 50 ? 1 : radius > 0 ? (c.borderRadius.includes('pt') ? radius/72 : radius/96) : 0;
              if (hasBg || hasUniformBorder) {
                elements.push({
                  type: 'shape', text: '',
                  position: { x: pxToIn(rect.left), y: pxToIn(rect.top), w: pxToIn(rect.width), h: pxToIn(rect.height) },
                  shape: {
                    fill: hasBg ? rgbToHex(c.backgroundColor) : null,
                    transparency: hasBg ? extractAlpha(c.backgroundColor) : null,
                    line: hasUniformBorder ? { color: rgbToHex(c.borderColor), width: pxToPt(c.borderWidth) } : null,
                    rectRadius,
                    shadow
                  }
                });
              }
            }
          }
          processed.add(el); return;
        }

        if (el.tagName === 'UL' || el.tagName === 'OL') {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          const liEls = Array.from(el.querySelectorAll('li'));
          const items = [];
          liEls.forEach((li, idx) => {
            const isLast = idx === liEls.length - 1;
            const runs = parseInline(li, { breakLine: false });
            if (runs.length > 0) {
              runs[0].text = runs[0].text.replace(/^[•\-\*▪▸]\s*/,'');
              runs[0].options.bullet = { indent: 180 };
            }
            if (runs.length > 0 && !isLast) runs[runs.length-1].options.breakLine = true;
            items.push(...runs);
          });
          const c = window.getComputedStyle(liEls[0] || el);
          elements.push({
            type: 'list', items,
            position: { x: pxToIn(rect.left), y: pxToIn(rect.top), w: pxToIn(rect.width), h: pxToIn(rect.height) },
            style: {
              fontSize: pxToPt(c.fontSize),
              fontFace: c.fontFamily.split(',')[0].replace(/['"]/g,'').trim(),
              color: rgbToHex(c.color), transparency: extractAlpha(c.color),
              align: c.textAlign === 'start' ? 'left' : c.textAlign,
              lineSpacing: c.lineHeight && c.lineHeight !== 'normal' ? pxToPt(c.lineHeight) : null,
              paraSpaceBefore: 0, paraSpaceAfter: pxToPt(c.marginBottom),
              margin: [pxToPt(parseFloat(c.paddingLeft)), 0, 0, 0]
            }
          });
          liEls.forEach(li => processed.add(li));
          processed.add(el); return;
        }

        if (!textTags.has(el.tagName)) return;
        const rect = el.getBoundingClientRect();
        const text = el.textContent.trim();
        if (rect.width === 0 || rect.height === 0 || !text) return;
        const c = window.getComputedStyle(el);
        const rotation = getRotation(c.transform, c.writingMode);
        const isVert = rotation !== null && (rotation === 90 || rotation === 270);
        const getPos = r => {
          if (rotation === null) return { x: r.left, y: r.top, w: r.width, h: r.height };
          const cx = r.left + r.width/2, cy = r.top + r.height/2;
          return isVert ? { x: cx - r.height/2, y: cy - r.width/2, w: r.height, h: r.width } : { x: r.left, y: r.top, w: r.width, h: r.height };
        };
        const pos = getPos(rect);
        const hasFmt = el.querySelector('b,i,u,strong,em,span,br');
        if (hasFmt) {
          const runs = parseInline(el, {}, [], t => applyTextTransform(t, c.textTransform));
          elements.push({
            type: el.tagName.toLowerCase(), text: runs,
            position: { x: pxToIn(pos.x), y: pxToIn(pos.y), w: pxToIn(pos.w), h: pxToIn(pos.h) },
            style: {
              fontSize: pxToPt(c.fontSize), fontFace: c.fontFamily.split(',')[0].replace(/['"]/g,'').trim(),
              color: rgbToHex(c.color), transparency: extractAlpha(c.color),
              align: c.textAlign === 'start' ? 'left' : c.textAlign,
              lineSpacing: pxToPt(c.lineHeight), paraSpaceBefore: pxToPt(c.marginTop), paraSpaceAfter: pxToPt(c.marginBottom),
              margin: [pxToPt(parseFloat(c.paddingLeft)), pxToPt(parseFloat(c.paddingRight)), pxToPt(parseFloat(c.paddingBottom)), pxToPt(parseFloat(c.paddingTop))],
              rotate: rotation
            }
          });
        } else {
          const transformed = applyTextTransform(text, c.textTransform);
          const isBold = c.fontWeight === 'bold' || parseInt(c.fontWeight) >= 600;
          elements.push({
            type: el.tagName.toLowerCase(), text: transformed,
            position: { x: pxToIn(pos.x), y: pxToIn(pos.y), w: pxToIn(pos.w), h: pxToIn(pos.h) },
            style: {
              fontSize: pxToPt(c.fontSize), fontFace: c.fontFamily.split(',')[0].replace(/['"]/g,'').trim(),
              color: rgbToHex(c.color), transparency: extractAlpha(c.color),
              align: c.textAlign === 'start' ? 'left' : c.textAlign,
              lineSpacing: pxToPt(c.lineHeight), paraSpaceBefore: pxToPt(c.marginTop), paraSpaceAfter: pxToPt(c.marginBottom),
              margin: [pxToPt(parseFloat(c.paddingLeft)), pxToPt(parseFloat(c.paddingRight)), pxToPt(parseFloat(c.paddingBottom)), pxToPt(parseFloat(c.paddingTop))],
              bold: isBold && !shouldSkipBold(c.fontFamily),
              italic: c.fontStyle === 'italic',
              underline: c.textDecoration.includes('underline'),
              rotate: rotation
            }
          });
        }
        processed.add(el);
      });

      return { background, elements, placeholders, errors };
    });

    // Validation
    const bodyScroll = await page.evaluate(() => ({
      w: document.body.scrollWidth, h: document.body.scrollHeight,
      ow: document.body.offsetWidth, oh: document.body.offsetHeight
    }));
    const sw = (bodyScroll.w - bodyScroll.ow) * PT_PER_PX;
    const sh = (bodyScroll.h - bodyScroll.oh) * PT_PER_PX;
    if (sw > 0 || sh > 0) errors.push(`Overflow: ${sw.toFixed(1)}pt h, ${sh.toFixed(1)}pt v`);
    if (errors.length > 0) {
      console.warn(`  Warnings in ${path.basename(htmlFile)}: ${errors.join('; ')}`);
    }

    const slide = pres.addSlide();
    if (background.type === 'image') slide.background = { path: background.path };
    else if (background.type === 'color') slide.background = { color: background.value };

    for (const el of elements) {
      if (el.type === 'image') {
        const src = el.src.startsWith('file://') ? el.src.slice(7) : el.src;
        slide.addImage({ path: src, x: el.position.x, y: el.position.y, w: el.position.w, h: el.position.h });
      } else if (el.type === 'shape') {
        const opts = { x: el.position.x, y: el.position.y, w: el.position.w, h: el.position.h, shape: el.shape.rectRadius > 0 ? pres.ShapeType.roundRect : pres.ShapeType.rect };
        if (el.shape.fill) { opts.fill = { color: el.shape.fill }; if (el.shape.transparency != null) opts.fill.transparency = el.shape.transparency; }
        if (el.shape.line) opts.line = el.shape.line;
        if (el.shape.rectRadius > 0) opts.rectRadius = el.shape.rectRadius;
        if (el.shape.shadow) opts.shadow = el.shape.shadow;
        slide.addText(el.text || '', opts);
      } else if (el.type === 'list') {
        slide.addText(el.items, { x: el.position.x, y: el.position.y, w: el.position.w, h: el.position.h, fontSize: el.style.fontSize, fontFace: el.style.fontFace, color: el.style.color, align: el.style.align, valign: 'top', lineSpacing: el.style.lineSpacing, paraSpaceBefore: el.style.paraSpaceBefore, paraSpaceAfter: el.style.paraSpaceAfter, margin: el.style.margin });
      } else {
        const opts = { x: el.position.x, y: el.position.y, w: el.position.w, h: el.position.h, fontSize: el.style.fontSize, fontFace: el.style.fontFace, color: el.style.color, valign: 'top', lineSpacing: el.style.lineSpacing, paraSpaceBefore: el.style.paraSpaceBefore, paraSpaceAfter: el.style.paraSpaceAfter, margin: el.style.margin, inset: 0 };
        if (el.style.bold) opts.bold = true;
        if (el.style.italic) opts.italic = true;
        if (el.style.underline) opts.underline = true;
        if (el.style.align) opts.align = el.style.align;
        if (el.style.transparency != null) opts.transparency = el.style.transparency;
        if (el.style.rotate != null) opts.rotate = el.style.rotate;
        slide.addText(el.text, opts);
      }
    }

    return { slide, placeholders };
  } finally {
    await browser.close();
  }
}

async function main() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Smax AI';
  pptx.title = 'Khám Bệnh Hội Thoại — PRD v1.1';
  pptx.subject = 'AI Diagnostics · 9 Nhóm Bệnh · Chuyên gia Smax Gợi Ý';

  const slidesDir = path.join(__dirname, 'slides');
  const slideFiles = [
    '01-cover.html',
    '02-problem.html',
    '03-solution.html',
    '04-wizard.html',
    '05-diseases.html',
    '06-disease-detail.html',
    '07-health-score.html',
    '08-ai-recommendations.html',
    '09-architecture.html',
    '10-cta.html'
  ];

  for (const file of slideFiles) {
    process.stdout.write(`Converting ${file}... `);
    await html2pptx(path.join(slidesDir, file), pptx);
    console.log('OK');
  }

  const outPath = path.join(__dirname, '..', 'Khám-Bệnh-Hội-Thoại-PRD.pptx');
  await pptx.writeFile({ fileName: outPath });
  console.log(`\nDone! Output: ${outPath}`);
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
