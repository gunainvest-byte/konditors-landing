// Gunita Queen — gaišais Instagram stils (pēc želatīna karuseļa paraugiem).
// PARAUGS: ganaša karuselis (6 slaidi) + rupjmaizes tortes pārdošanas posts un stāsts.
// Lietošana: kopē šo failu, nomaini slaidu saturu un foto, tad: node gq-ig-paraugs.cjs && node ig-render.cjs slides out/<mape>
// Vajag: playwright (NODE_PATH=$(npm root -g)), fontus no gq-brand skilla, foto no media/foto/.
const fs = require('node:fs');
const path = require('node:path');
const FONT = process.env.GQ_FONTS || require('node:child_process').execSync("find / -path '*gq-brand/assets/fonts' -type d 2>/dev/null | head -1").toString().trim();
const FOTO = process.env.GQ_FOTO || path.join(__dirname, '..', 'foto');
const f = n => 'file://' + path.join(FOTO, n);

const css = `
@font-face{font-family:'Playfair Display';src:url('file://${FONT}/PlayfairDisplay.ttf');font-weight:400 900}
@font-face{font-family:'Jost';src:url('file://${FONT}/Jost.ttf');font-weight:100 900}
@font-face{font-family:'EB Garamond';src:url('file://${FONT}/EBGaramond.ttf');font-weight:400 800}
:root{--bg:#FAF6EF;--navy:#1B2A41;--gold:#B8924E;--goldd:#9C7A3F;--text:#2E3646;--muted:#6B6F78;--line:#E7DCC8;--card:#FFFDF9}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1350px;overflow:hidden;background:var(--bg);font-family:'Jost';color:var(--text);position:relative}
body.story{height:1920px}
.bgglow{position:absolute;inset:0;background:radial-gradient(1200px 900px at 20% 0%,#FFFDF8 0%,rgba(255,253,248,0) 70%)}
.num{position:absolute;left:56px;top:52px;background:linear-gradient(160deg,#B8924E,#9C7A3F);color:#FFF8EC;font-family:'Playfair Display';font-weight:500;font-size:38px;padding:10px 20px;border-radius:4px;letter-spacing:.02em;box-shadow:0 2px 8px rgba(156,122,63,.25);z-index:5}
.brand{position:absolute;left:0;right:0;top:44px;display:flex;flex-direction:column;align-items:center;gap:8px;z-index:4}
.brand .row{display:flex;align-items:center;gap:22px}
.brand .ln{width:150px;height:1.5px;background:linear-gradient(90deg,rgba(184,146,78,0),#B8924E)}
.brand .ln.r{background:linear-gradient(270deg,rgba(184,146,78,0),#B8924E)}
.brand .dot{width:6px;height:6px;border-radius:50%;background:var(--gold)}
.brand .name{font-family:'Jost';font-weight:500;font-size:25px;letter-spacing:.34em;color:var(--gold);padding-left:.34em}
.crown{width:58px;height:40px}
.h{font-family:'Playfair Display';font-weight:700;color:var(--navy);line-height:1.04;letter-spacing:-.01em}
.h .g{color:var(--gold)}
.p{font-size:37px;line-height:1.38;color:var(--text)}
.handle{position:absolute;left:64px;bottom:44px;font-size:24px;color:var(--muted);letter-spacing:.04em;z-index:6}
.arrow{position:absolute;right:60px;bottom:36px;font-size:44px;color:var(--gold);z-index:6}
.checks{list-style:none;display:flex;flex-direction:column;gap:20px}
.checks li{display:flex;align-items:center;gap:20px;font-size:35px;color:var(--text)}
.ck{flex:none;width:44px;height:44px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center}
.box{background:var(--card);border:1.5px solid #D9C29A;border-radius:22px;display:flex;align-items:center;gap:26px;padding:28px 34px;box-shadow:0 6px 24px rgba(120,90,40,.07)}
.box .t{font-size:33px;line-height:1.32;font-weight:500;color:var(--navy)}
.box .lab{font-size:24px;letter-spacing:.2em;color:var(--gold);font-weight:600;margin-bottom:6px}
.photo{position:absolute;background-size:cover;background-position:center}
.fadeL{-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 22%);mask-image:linear-gradient(90deg,transparent 0,#000 22%)}
.fadeLB{-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 22%),linear-gradient(180deg,#000 72%,transparent 100%);-webkit-mask-composite:source-in;mask-image:linear-gradient(90deg,transparent 0,#000 22%),linear-gradient(180deg,#000 72%,transparent 100%);mask-composite:intersect}
.fadeT{-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 18%);mask-image:linear-gradient(180deg,transparent 0,#000 18%)}
.round{border-radius:28px;box-shadow:0 10px 30px rgba(60,40,20,.12)}
.steps{display:flex;flex-direction:column;gap:30px}
.step{display:flex;align-items:center;gap:22px}
.step .n{flex:none;width:58px;height:58px;border-radius:50%;background:var(--gold);color:#fff;font-family:'Playfair Display';font-weight:700;font-size:32px;display:flex;align-items:center;justify-content:center}
.step .ic{flex:none;width:52px;height:52px}
.step .tx{font-size:33px;line-height:1.3;color:var(--text)}
.step .tx b{color:var(--navy);font-weight:600}
.divider{display:flex;align-items:center;gap:16px}
.divider .l{height:1.5px;width:200px;background:var(--gold)}
.it{font-family:'EB Garamond';font-style:italic;color:var(--goldd)}
.kicker{font-size:26px;letter-spacing:.28em;color:var(--gold);font-weight:600}
`;

const crown = `<svg class="crown" viewBox="0 0 58 40" xmlns="http://www.w3.org/2000/svg"><path d="M4 14 L15 24 L29 6 L43 24 L54 14 L50 34 L8 34 Z" fill="#B8924E"/><rect x="8" y="35.5" width="42" height="3.5" rx="1.2" fill="#B8924E"/><circle cx="4" cy="12" r="3.2" fill="#B8924E"/><circle cx="29" cy="4.5" r="3.4" fill="#B8924E"/><circle cx="54" cy="12" r="3.2" fill="#B8924E"/></svg>`;
const check = `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const heart = `<svg width="26" height="24" viewBox="0 0 26 24"><path d="M13 22S2 15.2 2 8.3C2 4.8 4.7 2 8 2c2.1 0 3.9 1.1 5 2.8C14.1 3.1 15.9 2 18 2c3.3 0 6 2.8 6 6.3C24 15.2 13 22 13 22z" fill="#B8924E"/></svg>`;
const ico = {
  knife: `<svg class="ic" viewBox="0 0 52 52" fill="none" stroke="#B8924E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 42 L36 10 c4 4 4 10 0 14 L20 42 Z"/><path d="M8 44h14"/></svg>`,
  pot: `<svg class="ic" viewBox="0 0 52 52" fill="none" stroke="#B8924E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h36v14a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8z"/><path d="M4 22h4M44 22h4M20 14c0-3 3-3 3-6M28 14c0-3 3-3 3-6"/></svg>`,
  pour: `<svg class="ic" viewBox="0 0 52 52" fill="none" stroke="#B8924E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 30h32l-3 12H13z"/><path d="M30 6l10 6-6 8"/><path d="M34 20v6M34 29v.5"/></svg>`,
  spatula: `<svg class="ic" viewBox="0 0 52 52" fill="none" stroke="#B8924E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="26" cy="26" r="16"/><path d="M26 26c3-3 7-2 8 1M26 26c-3 3-7 2-8-1"/></svg>`,
  thermo: `<svg class="ic" viewBox="0 0 52 52" fill="none" stroke="#B8924E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 30V10a4 4 0 0 1 8 0v20a8 8 0 1 1-8 0z"/><path d="M26 34V18"/></svg>`,
  drop: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="#B8924E" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M28 6C20 18 14 25 14 33a14 14 0 0 0 28 0c0-8-6-15-14-27z"/><path d="M22 36a6 6 0 0 0 6 6"/></svg>`,
  hat: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="#B8924E" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 34c-6-1-9-6-7-11s8-6 11-3c1-5 5-8 8-8s7 3 8 8c3-3 9-2 11 3s-1 10-7 11"/><path d="M16 34v10h24V34"/></svg>`,
  blender: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="#B8924E" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="22" y="4" width="12" height="22" rx="4"/><path d="M26 26v12M30 26v12"/><path d="M20 44c2-4 14-4 16 0"/></svg>`,
};
const chrome = (n, total, opts = {}) => `
<div class="bgglow"></div>
${n ? `<div class="num">${n}/${total}</div>` : ''}
<div class="brand">${crown}<div class="row"><span class="ln"></span><span class="dot"></span><span class="name">GUNITA QUEEN</span><span class="dot"></span><span class="ln r"></span></div></div>
<div class="handle">@gunitaqueen</div>${opts.arrow === false ? '' : '<div class="arrow">→</div>'}`;
const page = (body, cls = '', w = 1080, h = 1350) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body class="${cls}" data-w="${w}" data-h="${h}">${body}</body></html>`;

// ---------- GANAŠS (izglītojošs karuselis, 6 slaidi) ----------
const T = 6;
const gan = [];
gan.push(page(`${chrome(1, T)}
<div class="photo fadeL" style="right:-40px;bottom:-30px;width:700px;height:860px;background-image:url('${f('ganass-blizgs.jpg')}');background-position:center 40%"></div>
<div style="position:absolute;left:72px;top:190px;width:940px;z-index:3">
  <div class="h" style="font-size:112px;text-transform:uppercase;letter-spacing:.005em">Kāpēc ganašs<br><span class="g">sadalās?</span></div>
  <div style="margin-top:30px;font-size:46px;line-height:1.25;color:var(--navy)">3 iemesli un kā<br>to izglābt</div>
  <div class="divider" style="margin:40px 0 36px"><span class="l"></span>${heart}<span class="l"></span></div>
  <div class="p" style="width:420px;font-size:35px">Gluds, spīdīgs ganašs nav veiksme. Tā ir emulsija, ko var vadīt.</div>
  <div class="it" style="width:420px;font-size:38px;margin-top:26px">Saglabā — noderēs pirms nākamās kūkas.</div>
</div>`));

gan.push(page(`${chrome(2, T)}
<div class="photo fadeLB" style="right:-20px;top:250px;width:470px;height:640px;background-image:url('${f('ganass-blizgs.jpg')}');background-position:62% 55%;background-size:160%"></div>
<div style="position:absolute;left:72px;top:200px;width:530px;z-index:3">
  <div class="h" style="font-size:88px">Ganašs ir<br><span class="g">emulsija</span></div>
  <div class="p" style="margin-top:34px">Šokolādes tauki un ūdens no saldā krējuma viens otru atgrūž. Ganašā tos satur kopā šokolādes lecitīns un piena olbaltumvielas.</div>
  <ul class="checks" style="margin-top:38px">
    <li><span class="ck">${check}</span>gluds un spīdīgs</li>
    <li><span class="ck">${check}</span>neizdala taukus</li>
    <li><span class="ck">${check}</span>labi stingst un griežas</li>
  </ul>
</div>
<div class="box" style="position:absolute;left:72px;right:72px;bottom:110px;z-index:4">${ico.drop}<div class="t">Ja emulsija izjūk, tauki atdalās — masa kļūst graudaina un eļļaina.</div></div>`));

gan.push(page(`${chrome(3, T)}
<div style="position:absolute;left:72px;top:196px;width:620px;z-index:3">
  <div class="h" style="font-size:80px">Kā pagatavot<br><span class="g">gludu ganašu?</span></div>
</div>
<div class="steps" style="position:absolute;left:72px;top:440px;width:600px;z-index:3">
  <div class="step"><span class="n">1</span>${ico.knife}<span class="tx">Sasmalcini šokolādi sīkos gabaliņos.</span></div>
  <div class="step"><span class="n">2</span>${ico.pot}<span class="tx">Uzkarsē saldo krējumu līdz vārīšanās sākumam.</span></div>
  <div class="step"><span class="n">3</span>${ico.pour}<span class="tx">Lej to uz šokolādes <b>3 daļās</b>.</span></div>
  <div class="step"><span class="n">4</span>${ico.spatula}<span class="tx">Emulģē no centra uz malām.</span></div>
  <div class="step"><span class="n">5</span>${ico.thermo}<span class="tx">Sviestu pievieno <b>35–40 °C</b> masai.</span></div>
</div>
<div class="photo round" style="right:56px;top:220px;width:300px;height:372px;background-image:url('${f('ganass-krejums-lej.jpg')}')"></div>
<div class="photo round" style="right:56px;top:616px;width:300px;height:372px;background-image:url('${f('ganass-blizgs.jpg')}');background-position:60% 60%"></div>
<div class="box" style="position:absolute;left:72px;right:72px;bottom:110px;z-index:4">${ico.blender}<div class="t">Rokas blenderi turi zem virsmas — tā masā neiekļūst gaiss.</div></div>`));

gan.push(page(`${chrome(4, T)}
<div style="position:absolute;left:72px;top:196px;width:940px;z-index:3">
  <div class="h" style="font-size:84px">Kāpēc tas <span class="g">sadalās?</span></div>
</div>
<div class="photo round" style="left:72px;top:340px;width:936px;height:470px;background-image:url('${f('ganass-sadalijies-vs-gluds.jpg')}');background-position:center 52%"></div>
<div style="position:absolute;left:72px;top:822px;width:936px;display:flex;justify-content:space-around;font-size:23px;letter-spacing:.24em;font-weight:600;color:var(--gold)"><span>SADALĪJIES</span><span>GLUDS</span></div>
<div style="position:absolute;left:72px;right:72px;top:886px;display:flex;flex-direction:column;gap:26px;z-index:3">
  <div class="step"><span class="n">1</span><span class="tx"><b>Viss krējums vienā reizē</b> — emulsijai nav laika izveidoties.</span></div>
  <div class="step"><span class="n">2</span><span class="tx"><b>Pārāk karsts</b> — pārkarsēta šokolāde izdala kakao sviestu.</span></div>
  <div class="step"><span class="n">3</span><span class="tx"><b>Par maz šķidruma</b> — tauku vairāk, nekā emulsija notur.</span></div>
</div>`));

gan.push(page(`${chrome(5, T)}
<div class="photo fadeLB" style="right:-30px;top:230px;width:470px;height:700px;background-image:url('${f('ganass-blizgs.jpg')}');background-position:72% 35%;background-size:175%"></div>
<div style="position:absolute;left:72px;top:200px;width:530px;z-index:3">
  <div class="h" style="font-size:88px">Kā to<br><span class="g">izglābt?</span></div>
  <div class="p" style="margin-top:30px;font-weight:500;color:var(--navy)">Neizmet — to gandrīz vienmēr var salabot.</div>
</div>
<div class="steps" style="position:absolute;left:72px;top:640px;width:530px;gap:28px;z-index:3">
  <div class="step"><span class="n">1</span><span class="tx">Pievieno <b>1–2 ēdamkarotes</b> silta saldā krējuma.</span></div>
  <div class="step"><span class="n">2</span><span class="tx">Emulģē ar rokas blenderi, līdz masa atkal spīd.</span></div>
</div>
<div class="box" style="position:absolute;left:72px;right:72px;bottom:110px;z-index:4">${ico.hat}<div><div class="lab">ŠEFA PADOMS</div><div class="t">Ja masa ir pārāk karsta, vispirms ļauj tai atdzist līdz ~35 °C.</div></div></div>`));

gan.push(page(`${chrome(6, T, { arrow: false })}
<div style="position:absolute;left:72px;right:72px;top:210px;text-align:center;z-index:3">
  <div class="h" style="font-size:96px">Saglabā,<br><span class="g">lai nepazūd</span></div>
  <div style="margin-top:28px;font-size:33px;color:var(--muted)">Seko @gunitaqueen — profesionāla konditorejas teorija</div>
</div>
<div class="photo" style="left:50%;transform:translateX(-50%);top:560px;width:230px;height:230px;border-radius:50%;background-image:url('${f('gunita-portrets-kafija.jpg')}');background-size:190%;background-position:58% 18%;border:4px solid #fff;box-shadow:0 8px 26px rgba(60,40,20,.18)"></div>
<div style="position:absolute;left:110px;right:110px;top:830px;text-align:center;z-index:3">
  <div class="p" style="font-size:36px;color:var(--navy)">Vai tev ganašs kādreiz ir sadalījies? Raksti komentāros, kas notika.</div>
</div>
<div class="box" style="position:absolute;left:96px;right:96px;bottom:150px;justify-content:center;text-align:center;z-index:4"><div><div class="lab">KONDITORS ABC · ONLINE KURSS</div><div class="t" style="font-size:31px">Krēmi, ganaši un pildījumi — viena no 20 nodarbībām.<br>Ievadcena 288 € līdz 29.11. · saite profilā</div></div></div>
<div class="it" style="position:absolute;left:0;right:0;bottom:72px;text-align:center;font-size:36px">by Gunita Queen</div>`));

// ---------- RUPJMAIZES TORTE (pārdošanas posts + stāsts) ----------
const rtPost = page(`${chrome(0, 0, { arrow: false }).replace('<div class="handle">@gunitaqueen</div>', '')}
<div class="photo fadeT" style="left:0;right:0;bottom:0;height:820px;background-image:url('${f('rupjmaizes-torte.jpg')}');background-position:center 62%"></div>
<div style="position:absolute;left:72px;right:72px;top:178px;text-align:center;z-index:3">
  <div class="kicker">ONLINE MEISTARKLASE</div>
  <div class="h" style="font-size:96px;margin-top:18px">Latvijai ir sava<br><span class="g">svētku torte</span></div>
  <div class="it" style="font-size:40px;margin-top:20px">Rupjmaize, āboli, dzērvenes un maigs krējums</div>
</div>
<div style="position:absolute;right:58px;top:590px;width:262px;height:262px;border-radius:50%;background:linear-gradient(160deg,#C29B57,#9C7A3F);color:#FFF8EC;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(60,40,20,.3);z-index:5;border:3px solid #F3E6CC">
  <div style="font-size:20px;letter-spacing:.16em;font-weight:600">SVĒTKU CENA</div>
  <div style="font-family:'Playfair Display';font-weight:700;font-size:84px;line-height:1">18 €</div>
  <div style="font-size:24px;margin-top:4px">līdz 15.11.</div>
  <div style="font-size:21px;opacity:.85;text-decoration:line-through">parasti 29 €</div>
</div>
<div style="position:absolute;left:64px;right:64px;bottom:56px;background:rgba(255,253,249,.94);border-radius:24px;padding:26px 30px;text-align:center;z-index:5;box-shadow:0 8px 26px rgba(30,20,10,.18)">
  <div style="font-size:30px;color:var(--navy);font-weight:500">10 video daļas · recepte PDF · piekļuve uz visiem laikiem</div>
  <div style="font-size:26px;letter-spacing:.22em;color:var(--gold);font-weight:600;margin-top:10px">SAITE PROFILĀ</div>
</div>`);

const rtStory = page(`${chrome(0, 0, { arrow: false }).replace('<div class="handle">@gunitaqueen</div>', '')}
<div class="photo fadeT" style="left:0;right:0;bottom:0;height:1180px;background-image:url('${f('rupjmaizes-torte.jpg')}');background-position:center 58%"></div>
<div style="position:absolute;left:72px;right:72px;top:250px;text-align:center;z-index:3">
  <div class="kicker">18. NOVEMBRIM · ONLINE MEISTARKLASE</div>
  <div class="h" style="font-size:104px;margin-top:22px">Latvijai ir sava<br><span class="g">svētku torte</span></div>
  <div class="it" style="font-size:44px;margin-top:22px">Pagatavo to kopā ar mani savā virtuvē</div>
</div>
<div style="position:absolute;left:50%;transform:translateX(-50%);top:760px;width:300px;height:300px;border-radius:50%;background:linear-gradient(160deg,#C29B57,#9C7A3F);color:#FFF8EC;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(60,40,20,.3);z-index:5;border:3px solid #F3E6CC">
  <div style="font-size:22px;letter-spacing:.16em;font-weight:600">SVĒTKU CENA</div>
  <div style="font-family:'Playfair Display';font-weight:700;font-size:98px;line-height:1">18 €</div>
  <div style="font-size:27px;margin-top:4px">līdz 15.11.</div>
  <div style="font-size:23px;opacity:.85;text-decoration:line-through">parasti 29 €</div>
</div>
<div style="position:absolute;left:80px;right:80px;bottom:300px;background:rgba(255,253,249,.94);border-radius:26px;padding:30px;text-align:center;z-index:5;box-shadow:0 8px 26px rgba(30,20,10,.18)">
  <div style="font-size:33px;color:var(--navy);font-weight:500;line-height:1.35">10 video daļas · recepte PDF<br>piekļuve uz visiem laikiem</div>
  <div style="font-size:28px;letter-spacing:.2em;color:var(--gold);font-weight:600;margin-top:12px">SAITE PROFILĀ ↑</div>
</div>`, 'story', 1080, 1920);

const out = process.env.GQ_OUT || path.join(process.cwd(), 'out');
for (const d of ['ganass', 'rupjmaizes']) fs.mkdirSync(path.join(out, d), { recursive: true });
gan.forEach((h, i) => fs.writeFileSync(path.join(out, 'ganass', `ganass-${i + 1}.html`), h));
fs.writeFileSync(path.join(out, 'rupjmaizes', 'rupjmaizes-1-posts.html'), rtPost);
fs.writeFileSync(path.join(out, 'rupjmaizes', 'rupjmaizes-2-stasts.html'), rtStory);
console.log('ok');
