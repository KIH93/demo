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
const pair = (ids) => `${lower(ids[0])} + ${lower(ids[1])}`;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function matchComplex() {
  const promo = [...state.zones].filter((z) => PROMO.includes(z));
  if (promo.length !== 2) return null;
  return COMPLEXES.find((c) => c.zones.every((z) => promo.includes(z))) || null;
}

let toastTimer;
function toast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 3200);
}

/* ---------- Zones (picker keys + wizard chips share state) ---------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-zone]');
  if (!btn) return;
  const id = btn.dataset.zone;
  state.zones.has(id) ? state.zones.delete(id) : state.zones.add(id);
  update();
});

$$('[data-single]').forEach((group) => group.addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  const key = group.dataset.single;
  state[key] = state[key] === btn.dataset.value ? '' : btn.dataset.value;
  $$('.chip', group).forEach((b) => b.setAttribute('aria-pressed', b.dataset.value === state[key]));
  renderMessage();
}));

$('#name').addEventListener('input', (e) => { state.name = e.target.value.trim(); renderMessage(); });

/* ---------- Picker result ---------- */
function renderPicker() {
  const box = $('#picker-result');
  const selected = [...state.zones];
  const promo = selected.filter((z) => PROMO.includes(z));
  const other = selected.filter((z) => !PROMO.includes(z));
  const match = matchComplex();
  let html = '';

  if (!selected.length) {
    box.innerHTML = `<p class="result__title">Выберите хотя бы одну зону</p>
      <p class="result__text">Зоны с пометкой "акция" входят в акционные комплексы.</p>`;
    return;
  }
  if (match) {
    html += `<p class="result__title">Подходит Комплекс ${match.id}</p>
      <p class="result__text">${ZONES[match.zones[0]]} + ${lower(match.zones[1])}</p>
      <p class="result__price"><strong>${match.price}</strong><s>вместо ${match.old}</s></p>`;
  } else if (promo.length === 3) {
    html += `<p class="result__title">Одним комплексом не получится</p>
      <p class="result__text">Например, Комплекс 03 (бикини глубокое + голени) за 2 450 руб., а подмышки отдельно: стоимость уточняйте у администратора.</p>`;
  } else if (promo.length === 1) {
    const options = COMPLEXES.filter((c) => c.zones.includes(promo[0]));
    html += `<p class="result__title">Добавьте вторую зону</p>
      <p class="result__text">${ZONES[promo[0]]} входят в такие комплексы:</p>
      <div class="result__opts">${options.map((c) => `<button type="button" class="btn btn--ghost" data-apply="${c.id}">Комплекс ${c.id}: ${pair(c.zones)}</button>`).join('')}</div>`;
  } else {
    html += `<p class="result__title">Подберём на консультации</p>
      <p class="result__text">Для этих зон акционного комплекса сейчас нет.</p>`;
  }
  if (other.length) {
    html += `<ul class="result__list">${other.map((id) => `<li><span>${ZONES[id]}</span><span>стоимость уточняйте</span></li>`).join('')}</ul>`;
  }
  html += `<a class="btn btn--gold btn--block" href="#zapis" data-goto>Записаться с этим выбором</a>`;
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
  $$('[data-complex]').forEach((c) => c.classList.toggle('is-picked', Boolean(match && state.zones.size === 2 && c.dataset.complex === match.id)));
  renderPicker();
  renderMessage();
}

/* ---------- Wizard ---------- */
const wizard = $('[data-wizard]');
let step = 1;
function showStep(n, focus = true) {
  step = n;
  $$('.wizard__step', wizard).forEach((s) => s.classList.toggle('is-active', Number(s.dataset.step) === n));
  $$('[data-dot]', wizard).forEach((d) => {
    const k = Number(d.dataset.dot);
    d.classList.toggle('is-current', k === n);
    d.classList.toggle('is-done', k < n);
    if (k === n) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
  });
  if (focus) {
    const target = $(`.wizard__step[data-step="${n}"]`, wizard).querySelector('legend, .legend');
    if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  }
}
wizard.addEventListener('click', (e) => {
  if (e.target.closest('[data-next]')) showStep(Math.min(step + 1, 3));
  if (e.target.closest('[data-prev]')) showStep(Math.max(step - 1, 1));
});
showStep(1, false);

function goToBooking(toStep) {
  if (toStep) showStep(toStep, false);
  $('#zapis').scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
  setTimeout(() => $('#zapis-title').focus({ preventScroll: true }), 500);
}
$$('[data-book]').forEach((btn) => btn.addEventListener('click', () => {
  state.zones = new Set(COMPLEXES.find((c) => c.id === btn.dataset.book).zones);
  update();
  goToBooking(2);
  toast(`Комплекс ${btn.dataset.book} выбран, осталось два шага`);
}));
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-goto]')) { e.preventDefault(); goToBooking(state.zones.size ? 2 : 1); }
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

update();
