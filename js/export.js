/* ---------- PNG export (uses globals from app.js) ---------- */
function loadImg(src) {
  return new Promise(resolve => {
    if (!src) return resolve(null);
    const i = new Image();
    i.crossOrigin = 'anonymous';
    i.onload = () => resolve(i);
    i.onerror = () => resolve(null);
    i.src = src;
  });
}
function cutPath(x, tx, ty, w, h, c) {
  x.beginPath();
  x.moveTo(tx + c, ty); x.lineTo(tx + w, ty); x.lineTo(tx + w, ty + h); x.lineTo(tx, ty + h); x.lineTo(tx, ty + c);
  x.closePath();
}
function fit(x, txt, maxW, size, min, fam) {
  while (size > min) {
    x.font = size + 'px ' + fam;
    if (x.measureText(txt).width <= maxW) return;
    size -= 2;
  }
  x.font = min + 'px ' + fam;
}

let shareFile = null;

async function makeImage() {
  const modal = $('modal'), msg = $('msg'), out = $('out'), dl = $('dl');
  modal.hidden = false; out.removeAttribute('src'); dl.hidden = true; $('sharenow').hidden = true; shareFile = null;
  msg.textContent = 'מכינים תמונה…';
  try {
    try {
      await Promise.all([
        document.fonts.load('80px "Secular One"', 'אבגדה'),
        document.fonts.load('800 30px Heebo', 'אבגדה'),
      ]);
      await document.fonts.ready;
    } catch (e) {}

    const items = JOBS.filter(j => A[j.id]); // Only assigned roles get a tile
    if (!items.length) {msg.textContent = "עדיין אין שיבוצים"; return; }
    const imgs = await Promise.all(items.map(j => loadImg(T.get(A[j.id].photo)));

    const W = 1080, M = 48, G = 18, TW = (W - 2 * M - G) / 2, TH = 340, HD = 310, FT = 150;
    const R = Math.ceil(items.length / 2), H = HD + R * (TH + G) - G + FT;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const x = c.getContext('2d');
    x.direction = 'rtl'; x.textAlign = 'right'; x.textBaseline = 'alphabetic';

    x.fillStyle = BLUE; x.fillRect(0, 0, W, H);
    fit(x, TITLE, W - 2 * M, 140, 60, DF);
    x.fillStyle = YEL; x.fillText(TITLE, W - M, 210);
    x.font = '800 34px ' + BF; x.fillStyle = WH;
    x.fillText(Object.keys(A).length + ' מתוך ' + JOBS.length + ' תפקידים מאוישים', W - M, 270);

    items.forEach((j, i) => {
      const tn = A[j.id], t = tn && T.get(tn), im = imgs[i];
      const tx = W - M - TW - (i % 2) * (TW + G), ty = HD + Math.floor(i / 2) * (TH + G), pad = 26;
      x.save();
      cutPath(x, tx, ty, TW, TH, 40); x.clip();

      if (t) {
        if (im) {
          const s = Math.max(TW / im.width, TH / im.height), dw = im.width * s, dh = im.height * s;
          x.drawImage(im, tx + (TW - dw) / 2, ty + (TH - dh) * .25, dw, dh);
        } else {
          x.fillStyle = color(t.name); x.fillRect(tx, ty, TW, TH);
          x.font = Math.round(TH * .6) + 'px ' + DF; x.textAlign = 'center';
          x.fillStyle = INK; x.globalAlpha = .85;
          x.fillText([...t.name][0], tx + TW / 2, ty + TH * .62);
          x.globalAlpha = 1; x.textAlign = 'right';
        }
        const g = x.createLinearGradient(0, ty + TH * .3, 0, ty + TH);
        g.addColorStop(0, 'rgba(11,17,69,0)'); g.addColorStop(1, 'rgba(11,17,69,.94)');
        x.fillStyle = g; x.fillRect(tx, ty, TW, TH);
      }

      fit(x, j.title, TW - 2 * pad, 60, 30, DF);
      x.fillStyle = t ? YEL : INK;
      x.fillText(j.title, tx + TW - pad, ty + TH - (t ? 68 : 30));
      if (t) {
        x.font = '800 28px ' + BF; x.fillStyle = '#fff';
        x.fillText(t.name, tx + TW - pad, ty + TH - 28);
      }
      x.restore();
    });

    x.font = '800 28px ' + BF; x.fillStyle = 'rgba(242,245,255,.75)';
    x.fillText(FOOTER, W - M, H - 56);
    x.textAlign = 'left';
    x.fillText(new Date().toLocaleDateString('he-IL'), M, H - 56);

    const url = c.toDataURL('image/png');
    out.src = url; dl.href = url; dl.hidden = false; msg.textContent = '';
    c.toBlob(b => {
      if (!b) return;
      const f = new File([b], 'shefa-remix.png', { type: 'image/png' });
      if (matchMedia('(pointer: coarse)').matches && navigator.canShare && navigator.canShare({ files: [f] })) {
        shareFile = f; $('sharenow').hidden = false;
      }
    }, 'image/png');
  } catch (e) {
    msg.textContent = 'יצירת התמונה נכשלה. נסו שוב.';
  }
}

$('share').onclick = makeImage;
$('sharenow').onclick = async () => {
  if (!shareFile) return;
  try { await navigator.share({ files: [shareFile], title: TITLE }); } catch (e) {}
};
$('close').onclick = () => { $('modal').hidden = true; };
document.addEventListener('keydown', e => { if (e.key === 'Escape') $('modal').hidden = true; });
