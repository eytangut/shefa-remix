/* ---------- Constants (shared with export.js) ---------- */
const BLUE = '#1236C8', INK = '#0B1145', YEL = '#FFD21F', RED = '#FF4B2B', MINT = '#2EE6A6', WH = '#F2F5FF';
const PH = ['#FF4B2B', '#FFD21F', '#2EE6A6', '#FF8FB8', '#7AD7FF', '#FF9A1F'];  // placeholder colors
const TILE = [YEL, RED, MINT, WH];
const DF = '"Secular One", "Arial Hebrew", Arial, sans-serif';
const BF = 'Heebo, "Arial Hebrew", Arial, sans-serif';
const KEY = 'school-gov-v2';

const $ = id => document.getElementById(id);
const T = new Map(TEACHERS.map(t => [t.name, t]));
const seen = {};
JOBS.forEach(j => { seen[j.title] = (seen[j.title] || 0) + 1; j.id = j.title + '#' + seen[j.title]; });

/* ---------- Helpers ---------- */
function color(name) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PH[h % PH.length];
}
function el(tag, cls, txt) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt != null) e.textContent = txt;
  return e;
}

/* ---------- State ---------- */
let A = {};          // assignments: job id -> teacher name
let sel = null;      // teacher currently picked
let pop = null;      // job that was just filled (plays the stamp animation)
let drag = null;     // teacher being dragged
let intro = true;    // true only for the first render (entrance animation)
let lastCount = -1;
let wasFull = null;

try {
  const saved = JSON.parse(localStorage.getItem(KEY) || '{}'), used = new Set();
  for (const j of JOBS) {
    const n = saved[j.id];
    if (n && T.has(n) && !used.has(n)) { A[j.id] = n; used.add(n); }
  }
} catch (e) {}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(A)); } catch (e) {}
}
function assign(job, name) {
  for (const k in A) if (A[k] === name) delete A[k];
  A[job] = name; sel = null; pop = job; save(); render();
}
function unassign(name) {
  for (const k in A) if (A[k] === name) delete A[k];
  sel = null; pop = null; save(); render();
}

/* ---------- Building blocks ---------- */
function photo(t) {
  const p = el('div', 'ph');
  p.style.background = color(t.name);
  p.appendChild(el('span', null, [...t.name][0]));
  if (t.photo) {
    const i = new Image();
    i.alt = ''; i.decoding = 'async';
    i.onerror = () => i.remove();
    i.src = t.photo;
    p.appendChild(i);
  }
  return p;
}
function dragOn(node, name) {
  node.draggable = true;
  node.addEventListener('dragstart', e => {
    drag = name;
    e.dataTransfer.setData('text/plain', name);
    e.dataTransfer.effectAllowed = 'move';
  });
  node.addEventListener('dragend', () => { drag = null; render(); });
}

/* ---------- Render ---------- */
function jobTile(j, i) {
  const tn = A[j.id], t = tn && T.get(tn);
  const cls = ['tile', 'c' + (i % 4)];
  if (t) cls.push('full');
  if (t && sel === tn) cls.push('picked');
  if (pop === j.id) cls.push('pop');
  if (intro) cls.push('in');

  const d = el('div', cls.join(' '));
  d.style.setProperty('--i', i);
  d.tabIndex = 0;
  d.setAttribute('role', 'button');

  if (t) { d.appendChild(photo(t)); d.appendChild(el('div', 'sc')); dragOn(d, tn); }
  const lb = el('div', 'lb');
  lb.appendChild(el('h3', 'jt', j.title));
  if (t) lb.appendChild(el('p', 'tn', t.name));
  d.appendChild(lb);

  if (t) {
    const x = el('button', 'x', '×');
    x.setAttribute('aria-label', 'הסרת ' + t.name);
    x.onclick = e => { e.stopPropagation(); unassign(tn); };
    d.appendChild(x);
  }
  d.onclick = () => {
    if (sel && sel !== tn) { assign(j.id, sel); return; }
    sel = t ? (sel === tn ? null : tn) : null;
    pop = null; render();
  };
  d.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); d.click(); } };
  d.addEventListener('dragover', e => { if (drag) { e.preventDefault(); d.classList.add('over'); } });
  d.addEventListener('dragleave', () => d.classList.remove('over'));
  d.addEventListener('drop', e => { e.preventDefault(); if (drag) assign(j.id, drag); });
  return d;
}

function teacherChip(t, i) {
  const b = el('button', 't' + (sel === t.name ? ' on' : '') + (intro ? ' in' : ''));
  b.style.setProperty('--i', i + 4);
  b.appendChild(photo(t));
  b.appendChild(el('span', 'n', t.name));
  b.onclick = () => { sel = sel === t.name ? null : t.name; pop = null; render(); };
  dragOn(b, t.name);
  return b;
}

function render() {
  const grid = $('grid');
  grid.innerHTML = '';
  grid.classList.toggle('targeting', !!sel);   // dashed "drop here" hints while a teacher is picked
  JOBS.forEach((j, i) => grid.appendChild(jobTile(j, i)));

  const placed = new Set(Object.values(A));
  const free = TEACHERS.filter(t => !placed.has(t.name));
  const list = $('list'), scroll = list.scrollLeft;
  list.innerHTML = '';
  free.forEach((t, i) => list.appendChild(teacherChip(t, i)));
  if (!free.length) list.appendChild(el('div', 'done', 'כל המורים שובצו'));
  list.scrollLeft = scroll;

  $('pcount').textContent = 'מורים פנויים (' + free.length + ')';
  $('cnt').textContent = placed.size + ' מתוך ' + JOBS.length + ' תפקידים מאוישים';
  $('bar').style.setProperty('--p', placed.size / JOBS.length);
  if (lastCount !== -1 && lastCount !== placed.size) {
    $('cnt').classList.remove('bump'); void $('cnt').offsetWidth; $('cnt').classList.add('bump');
  }
  lastCount = placed.size;
  // Cue: all roles filled -> highlight the export button
  const full = Object.keys(A).length === JOBS.length;
  $('share').classList.toggle('ready', full);
  $('hint').textContent = full ? 'הכול מוכן! לחצו על "צרו תמונה"' : 'לחצו על מישהו, ואז על תפקיד בשבילו';
  if (full && wasFull === false) window.scrollTo({ top: 0, behaviour: 'smooth' });
  wasFull = full;
  pop = null; intro = false;
}

/* ---------- Events ---------- */
const pool = $('pool');
pool.addEventListener('dragover', e => {
  if (drag && Object.values(A).includes(drag)) { e.preventDefault(); pool.classList.add('over'); }
});
pool.addEventListener('dragleave', () => pool.classList.remove('over'));
pool.addEventListener('drop', e => {
  e.preventDefault(); pool.classList.remove('over');
  if (drag) unassign(drag);
});
$('reset').onclick = () => {
  if (Object.keys(A).length && !confirm('לאפס את כל השיבוצים?')) return;
  A = {}; sel = null; save(); render();
};

$('ttl').textContent = TITLE;
document.title = TITLE;
render();
