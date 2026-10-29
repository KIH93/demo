/* ============================================================
   CONFIG: контакты студии. Заполнить перед публикацией.
   Пустое значение = кнопка ведёт на "#" и показывает подсказку.
   ============================================================ */
const CONFIG = {
  phone: '',      // TODO: телефон в формате +79XXXXXXXXX
  telegram: '',   // TODO: имя пользователя Telegram без @
  whatsapp: '',   // TODO: номер WhatsApp, только цифры, например 79XXXXXXXXX
  max: '',        // TODO: ссылка на чат в MAX
  address: 'Казань, ул. Пушкина, 1/55а',
  hours: '',      // TODO: график работы, например "Ежедневно 10:00-21:00"
  vk: 'https://vk.ru/lazernaya_epilyaciya_k',
  gis: 'https://2gis.ru/kazan/search/KazanLazer%20%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD%D0%B0%201%2F55%D0%B0', // TODO: прямая ссылка на карточку 2ГИС
};

const ZONES = {
  armpits: 'Подмышки', bikini: 'Бикини глубокое', shins: 'Голени', hips: 'Бёдра',
  arms: 'Руки', face: 'Лицо', belly: 'Живот', back: 'Спина',
};
const COMPLEXES = [
  { id: '01', zones: ['bikini', 'armpits'], price: '1 890 руб.', old: '3 800 руб.' },
  { id: '02', zones: ['shins', 'armpits'], price: '1 890 руб.', old: '3 800 руб.' },
  { id: '03', zones: ['bikini', 'shins'], price: '2 450 руб.', old: '5 000 руб.' },
];
const PROMO = ['armpits', 'bikini', 'shins'];
const state = { zones: new Set(), before: '', time: '', name: '' };

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const lower = (id) => ZONES[id].toLowerCase();
const pair = (ids) => `${ZONES[ids[0]].toLowerCase()} и ${lower(ids[1])}`;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

function matchComplex() {
  const promo = [...state.zones].filter((z) => PROMO.includes(z));
  if (promo.length !== 2) return null;
  return COMPLEXES.find((c) => c.zones.every((z) => promo.includes(z))) || null;
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 3200);
}

/* ---------- Zones, shared by the picker and the booking ---------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-zone]');
  if (!btn) return;
  const id = btn.dataset.zone;
  state.zones.has(id) ? state.zones.delete(id) : state.zones.add(id);
  update();
});

$$('[data-single]').forEach((group) => {
  group.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    const key = group.dataset.single;
    state[key] = state[key] === btn.dataset.value ? '' : btn.dataset.value;
    $$('.pill', group).forEach((b) => b.setAttribute('aria-pressed', b.dataset.value === state[key]));
    renderMessage();
  });
});

$('#name').addEventListener('input', (e) => { state.name = e.target.value.trim(); renderMessage(); });

/* ---------- Picker result: the figure ---------- */
function renderPicker() {
  const box = $('#picker-result');
  const selected = [...state.zones];
  const promo = selected.filter((z) => PROMO.includes(z));
  const other = selected.filter((z) => !PROMO.includes(z));
  const match = matchComplex();
  let html = '';

  if (!selected.length) {
    box.innerHTML = `
      <p class="figure__big figure__big--soft">Выберите зоны</p>
      <p class="figure__line">Подмышки, бикини глубокое и голени входят в акционные комплексы.</p>`;
    return;
  }
  if (match) {
    html += `<p class="figure__big">${match.price}</p>
      <p class="figure__line">Комплекс ${match.id}: ${pair(match.zones)}, вместо <s>${match.old}</s></p>`;
  } else if (promo.length === 3) {
    html += `<p class="figure__big figure__big--soft">Два комплекса или один</p>
      <p class="figure__line">Одним комплексом три зоны не берутся. Например, Комплекс 03 за 2 450 руб., подмышки отдельно: стоимость уточняйте.</p>`;
  } else if (promo.length === 1) {
    const options = COMPLEXES.filter((c) => c.zones.includes(promo[0]));
    html += `<p class="figure__big figure__big--soft">Добавьте вторую зону</p>
      <div class="figure__opts">${options.map((c) => `<button type="button" class="pill" data-apply="${c.id}">Комплекс ${c.id}: ${pair(c.zones)}</button>`).join('')}</div>`;
  } else {
    html += `<p class="figure__big figure__big--soft">Подберём на консультации</p>
      <p class="figure__line">Для этих зон акционного комплекса сейчас нет.</p>`;
  }
  if (other.length) {
    html += `<ul class="figure__rest">${other.map((id) => `<li><span>${ZONES[id]}</span><span>стоимость уточняйте</span></li>`).join('')}</ul>`;
  }
  html += `<a class="btn btn--quiet" href="#zapis" data-goto>Записаться с этим выбором</a>`;
  box.innerHTML = html;
}

document.addEventListener('click', (e) => {
  const apply = e.target.closest('[data-apply]');
  if (!apply) return;
  state.zones = new Set(COMPLEXES.find((c) => c.id === apply.dataset.apply).zones);
  update();
});

/* ---------- Message ---------- */
function buildMessage() {
  const lines = ['Здравствуйте! Хочу записаться на лазерную эпиляцию в KazanLazer.'];
  const match = matchComplex();
  const selected = [...state.zones];
  if (match && selected.length === 2) lines.push(`Интересует акционный Комплекс ${match.id}: ${pair(match.zones)}.`);
  else if (selected.length) lines.push(`Интересуют зоны: ${selected.map(lower).join(', ')}.`);
  if (state.before === 'yes') lines.push('Опыт лазерной эпиляции уже был.');
  if (state.before === 'no') lines.push('Лазерную эпиляцию буду делать впервые.');
  if (state.time) lines.push(`Удобное время: ${state.time}.`);
  if (state.name) lines.push(`Меня зовут ${state.name}.`);
  lines.push('Подскажите, пожалуйста, свободные окна.');
  return lines.join('\n');
}
function renderMessage() { $('#message').textContent = buildMessage(); }

function update() {
  $$('[data-zone]').forEach((b) => b.setAttribute('aria-pressed', state.zones.has(b.dataset.zone)));
  const match = matchComplex();
  $$('[data-book]').forEach((b) => b.classList.toggle('is-picked', Boolean(match && state.zones.size === 2 && b.dataset.book === match.id)));
  renderPicker();
  renderMessage();
}

/* ---------- Going to the booking ---------- */
function goToBooking() {
  $('#zapis').scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth' });
  setTimeout(() => $('#book-title').focus({ preventScroll: true }), 500);
}
$$('[data-book]').forEach((btn) => btn.addEventListener('click', () => {
  state.zones = new Set(COMPLEXES.find((c) => c.id === btn.dataset.book).zones);
  update();
  goToBooking();
}));
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-goto]')) { e.preventDefault(); goToBooking(); }
});

/* ---------- Contacts ---------- */
const demoHint = 'Демо: контакт появится после подключения';
$$('[data-contact="phone"]').forEach((a) => {
  if (CONFIG.phone) a.href = `tel:${CONFIG.phone}`;
  a.addEventListener('click', (e) => { if (!CONFIG.phone) { e.preventDefault(); toast(demoHint); } });
});

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.className = 'sr-only';
    document.body.append(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove(); return ok;
  }
}

$$('[data-messenger]').forEach((a) => a.addEventListener('click', async (e) => {
  e.preventDefault();
  const type = a.dataset.messenger;
  const text = buildMessage();
  if (type === 'max') {
    const ok = await copyText(text);
    toast(ok ? 'Текст скопирован, вставьте в чат' : 'Не удалось скопировать текст');
    if (CONFIG.max) setTimeout(() => window.open(CONFIG.max, '_blank', 'noopener'), 600);
    return;
  }
  const url = type === 'telegram'
    ? CONFIG.telegram && `https://t.me/${CONFIG.telegram}?text=${encodeURIComponent(text)}`
    : CONFIG.whatsapp && `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  if (!url) { toast(demoHint); return; }
  window.open(url, '_blank', 'noopener');
}));

const links = { vk: CONFIG.vk, gis: CONFIG.gis, yamap: `https://yandex.ru/maps/?text=${encodeURIComponent(CONFIG.address)}` };
$$('[data-link]').forEach((a) => { a.href = links[a.dataset.link] || '#'; });
if (CONFIG.hours) $$('[data-text="hours"]').forEach((el) => { el.textContent = CONFIG.hours; });

/* ---------- The light: water caustics, colours read from the tokens ---------- */
function tokenRGB(name) {
  const probe = $('#tone-probe');
  probe.style.color = `var(${name})`;
  const c = document.createElement('canvas').getContext('2d');
  c.fillStyle = getComputedStyle(probe).color;
  c.fillRect(0, 0, 1, 1);
  const [r, g, b] = c.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

const FRAG = `
precision mediump float;
uniform vec2 res; uniform float t; uniform vec3 shade; uniform vec3 deep; uniform vec3 light; uniform vec3 warm;
void main() {
  vec2 uv = gl_FragCoord.xy / res.y;
  float time = t * 0.42 + 23.0;
  vec2 p = mod(uv * 6.28318 * 0.9, 6.28318) - 250.0;
  vec2 i = p; float c = 1.0; float inten = 0.005;
  for (int n = 0; n < 5; n++) {
    float tt = time * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 5.0;
  c = 1.17 - pow(c, 1.4);
  float v = clamp(pow(abs(c), 6.0) * 1.35, 0.0, 1.0);
  float depth = gl_FragCoord.y / res.y;
  vec3 base = mix(deep, shade, 0.55 + 0.45 * depth);
  vec3 col = mix(base, light, v);
  col = mix(col, warm, smoothstep(0.55, 1.0, v) * 0.25);
  gl_FragColor = vec4(col, 1.0);
}`;
const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';

function startPool(pool) {
  const canvas = $('.pool__light', pool);
  const btn = $('[data-loop-toggle]', pool);
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) { btn.hidden = true; return; }
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { btn.hidden = true; return; }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (n) => gl.getUniformLocation(prog, n);
  gl.uniform3fv(u('shade'), tokenRGB('--color-shade'));
  gl.uniform3fv(u('deep'), tokenRGB('--color-shade-2'));
  gl.uniform3fv(u('light'), tokenRGB('--color-light'));
  gl.uniform3fv(u('warm'), tokenRGB('--spec-warm'));

  const s = { seen: false, hover: false, focus: false, held: reduced.matches, t: Math.random() * 40, last: 0, raf: 0 };
  const resize = () => {
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u('res'), canvas.width, canvas.height);
    draw();
  };
  const draw = () => { gl.uniform1f(u('t'), s.t); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
  const frame = (now) => {
    if (s.last) s.t += Math.min(now - s.last, 64) / 1000;
    s.last = now; draw();
    s.raf = requestAnimationFrame(frame);
  };
  const sync = () => {
    const run = s.seen && !s.hover && !s.focus && !s.held;
    cancelAnimationFrame(s.raf); s.last = 0;
    if (run) s.raf = requestAnimationFrame(frame);
    btn.textContent = s.held ? 'Пуск' : 'Пауза';
    btn.hidden = reduced.matches;
  };
  btn.addEventListener('click', () => { s.held = !s.held; sync(); });
  [['pointerenter', 'hover', true], ['pointerleave', 'hover', false], ['focusin', 'focus', true], ['focusout', 'focus', false]]
    .forEach(([type, key, val]) => pool.parentElement.addEventListener(type, () => { s[key] = val; sync(); }));
  new IntersectionObserver(([e]) => { s.seen = e.isIntersecting; sync(); }).observe(pool);
  new ResizeObserver(resize).observe(canvas);
  resize();
  sync();
}
$$('[data-loop]').forEach(startPool);

update();
