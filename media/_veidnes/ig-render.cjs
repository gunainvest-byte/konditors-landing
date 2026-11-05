// ig-render.cjs — HTML → PNG/JPG slaidi un HTML animācija → MP4 rīls
// Lietošana:
//   node ig-render.cjs slides <mape>                 # katru <mape>/*.html → tāda paša nosaukuma .jpg (izmērs no <body data-w data-h>)
//   node ig-render.cjs reel <fails.html> <sek> <out.mp4>   # CSS animācijas kadri → 30 fps H.264
// HTML jāatver no faila (file://), lai ielādējas lokālie fonti (@font-face ar file:// ceļu).
const { chromium } = require('playwright');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

async function size(page) {
  return page.evaluate(() => ({
    w: +(document.body.dataset.w || 1080),
    h: +(document.body.dataset.h || 1350),
  }));
}

(async () => {
  const [mode, a, b, c] = process.argv.slice(2);
  const browser = await chromium.launch();
  try {
    if (mode === 'slides') {
      const files = fs.readdirSync(a).filter(f => f.endsWith('.html')).sort();
      for (const f of files) {
        const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
        await page.goto('file://' + path.resolve(a, f));
        const { w, h } = await size(page);
        await page.setViewportSize({ width: w, height: h });
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: path.resolve(a, f.replace(/\.html$/, '.jpg')), type: 'jpeg', quality: 92 });
        await page.close();
        console.log('slide', f);
      }
    } else if (mode === 'reel') {
      const secs = +b, fps = 30, out = path.resolve(c);
      const frames = fs.mkdtempSync(path.join(path.dirname(out), 'frames-'));
      const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
      await page.goto('file://' + path.resolve(a));
      await page.evaluate(() => document.fonts.ready);
      for (let i = 0; i < secs * fps; i++) {
        const t = (i / fps) * 1000;
        await page.evaluate(t => document.getAnimations().forEach(x => { x.pause(); x.currentTime = t; }), t);
        await page.screenshot({ path: path.join(frames, `f${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 90 });
      }
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(frames, 'f%05d.jpg'),
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
      fs.rmSync(frames, { recursive: true, force: true });
      console.log('reel', out);
    } else {
      console.log('mode: slides | reel');
    }
  } finally {
    await browser.close();
  }
})();
