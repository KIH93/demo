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

const ZONES = [
  { id: 'armpits', label: 'Подмышки' },
  { id: 'bikini', label: 'Бикини глубокое' },
  { id: 'shins', label: 'Голени' },
  { id: 'hips', label: 'Бёдра' },
  { id: 'arms', label: 'Руки' },
  { id: 'face', label: 'Лицо' },
  { id: 'belly', label: 'Живот' },
  { id: 'back', label: 'Спина' },
];

const COMPLEXES = [
  { id: '01', zones: ['bikini', 'armpits'], price: '1 890 руб.', old: '3 800 руб.' },
  { id: '02', zones: ['shins', 'armpits'], price: '1 890 руб.', old: '3 800 руб.' },
  { id: '03', zones: ['bikini', 'shins'], price: '2 450 руб.', old: '5 000 руб.' },
];

const PROMO_ZONES = ['armpits', 'bikini', 'shins'];

const state = { zones: new Set(), before: '', time: '', name: '' };

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const zoneLabel = (id) => ZONES.find((z) => z.id === id).label;
const zonesText = (ids) => ids.map((id, i) => (i ? zoneLabel(id).toLowerCase() : zoneLabel(id))).join(' + ');

function matchComplex() {
  const promo = [...state.zones].filter((z) => PROMO_ZONES.includes(z));
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

/* ---------- Zone chips (picker + brief share one state) ---------- */
function renderZoneChips() {
  $$('[data-zones]').forEach((box) => {
    box.innerHTML = ZONES.map((z) => `
      <button type="button" class="chip" data-zone="${z.id}" aria-pressed="${state.zones.has(z.id)}">
        <svg class="ico" aria-hidden="true"><use href="#i-check"/></svg>${z.label}
      </button>`).join('');
  });
}

function syncZoneChips() {
  $$('[data-zone]').forEach((b) => b.setAttribute('aria-pressed', state.zones.has(b.dataset.zone)));
}

document.addEventListener('click', (e) => {
  const chip = e.target.closest('[data-zone]');
  if (!chip) return;
  const id = chip.dataset.zone;
  state.zones.has(id) ? state.zones.delete(id) : state.zones.add(id);
  update();
});

$$('[data-single]').forEach((group) => {
  group.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const key = group.dataset.single;
    state[key] = state[key] === chip.dataset.value ? '' : chip.dataset.value;
    $$('.chip', group).forEach((c) => c.setAttribute('aria-pressed', c.dataset.value === state[key]));
    renderMessage();
  });
});

$('#name').addEventListener('input', (e) => {
  state.name = e.target.value.trim();
  renderMessage();
});

/* ---------- Picker result ---------- */
function renderPicker() {
  const box = $('#picker-result');
  const selected = [...state.zones];
  const promo = selected.filter((z) => PROMO_ZONES.includes(z));
  const other = selected.filter((z) => !PROMO_ZONES.includes(z));
  const match = matchComplex();
  box.classList.toggle('is-match', Boolean(match));

  if (!selected.length) {
    box.innerHTML = `
      <p class="res__title">Отметьте одну или несколько зон</p>
      <p class="res__text">Подскажем, какой акционный комплекс подходит, или предложим консультацию.</p>`;
    return;
  }

  let html = '';
  if (match) {
    html += `
      <p class="res__title">Вам подходит Комплекс ${match.id}</p>
      <p class="res__text">${zonesText(match.zones)}</p>
      <p class="res__price"><strong>${match.price}</strong><s>вместо ${match.old}</s></p>`;
  } else if (promo.length === 3) {
    html += `
      <p class="res__title">Все три зоны есть в акциях</p>
      <p class="res__text">Одним комплексом их нет. Например, Комплекс 03 (бикини глубокое + голени) за 2 450 руб., а стоимость подмышек отдельно уточните у администратора.</p>`;
  } else if (promo.length === 1) {
    const options = COMPLEXES.filter((c) => c.zones.includes(promo[0]));
    html += `
      <p class="res__title">Зона "${zoneLabel(promo[0]).toLowerCase()}" есть в акционных комплексах</p>
      <p class="res__text">Добавьте вторую зону, чтобы получить цену комплекса:</p>
      <div class="res__actions">${options.map((c) => `<button type="button" class="res__link" data-apply="${c.id}">Комплекс ${c.id}: ${zonesText(c.zones).toLowerCase()}, ${c.price}</button>`).join('')}</div>`;
  } else {
    html += `
      <p class="res__title">Подберём на консультации</p>
      <p class="res__text">Для этих зон акционного комплекса сейчас нет. Мастер подскажет оптимальный вариант.</p>`;
  }

  if (other.length) {
    html += `<ul class="res__list">${other.map((id) => `<li><span>${zoneLabel(id)}</span><span>стоимость уточняйте</span></li>`).join('')}</ul>`;
  }

  html += `<div class="res__actions"><a class="btn btn--call" href="#contact" data-goto-contact>Записаться с этим выбором</a></div>`;
  box.innerHTML = html;
}

document.addEventListener('click', (e) => {
  const apply = e.target.closest('[data-apply]');
  if (apply) {
    const c = COMPLEXES.find((x) => x.id === apply.dataset.apply);
    state.zones = new Set(c.zones);
    update();
  }
});

/* ---------- Message ---------- */
function buildMessage() {
  const lines = ['Здравствуйте! Хочу записаться на лазерную эпиляцию в KazanLazer.'];
  const match = matchComplex();
  const selected = [...state.zones];
  if (match && selected.length === 2) {
    lines.push(`Интересует акционный Комплекс ${match.id}: ${zonesText(match.zones).toLowerCase()}.`);
  } else if (selected.length) {
    lines.push(`Интересуют зоны: ${selected.map((id) => zoneLabel(id).toLowerCase()).join(', ')}.`);
  }
  if (state.before === 'yes') lines.push('Раньше уже делала лазерную эпиляцию.');
  if (state.before === 'no') lines.push('Лазерную эпиляцию буду делать впервые.');
  if (state.time) lines.push(`Удобное время: ${state.time}.`);
  if (state.name) lines.push(`Меня зовут ${state.name}.`);
  lines.push('Подскажите, пожалуйста, свободные окна.');
  return lines.join('\n');
}

function renderMessage() {
  $('#message').textContent = buildMessage();
}

function highlightCards() {
  const match = matchComplex();
  $$('[data-complex]').forEach((card) => {
    card.classList.toggle('is-picked', Boolean(match && state.zones.size === 2 && card.dataset.complex === match.id));
  });
}

function update() {
  syncZoneChips();
  renderPicker();
  renderMessage();
  highlightCards();
}

/* ---------- Booking from cards ---------- */
function goToContact() {
  const target = $('#contact');
  target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  setTimeout(() => $('#contact h2').focus({ preventScroll: true }), 500);
}
$('#contact h2').setAttribute('tabindex', '-1');

$$('[data-book]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const c = COMPLEXES.find((x) => x.id === btn.dataset.book);
    state.zones = new Set(c.zones);
    update();
    goToContact();
    toast(`Комплекс ${c.id} добавлен в сообщение`);
  });
});

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-goto-contact]')) {
    e.preventDefault();
    goToContact();
  }
});

/* ---------- Contacts ---------- */
const demoHint = 'Демо: контакт появится после подключения';

$$('[data-contact="phone"]').forEach((a) => {
  if (CONFIG.phone) a.href = `tel:${CONFIG.phone}`;
  a.addEventListener('click', (e) => {
    if (!CONFIG.phone) { e.preventDefault(); toast(demoHint); }
  });
});

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

$$('[data-messenger]').forEach((a) => {
  a.addEventListener('click', async (e) => {
    const type = a.dataset.messenger;
    const text = buildMessage();
    e.preventDefault();

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
  });
});

/* ---------- Static links & text ---------- */
const links = {
  vk: CONFIG.vk,
  gis: CONFIG.gis,
  yamap: `https://yandex.ru/maps/?text=${encodeURIComponent(CONFIG.address)}`,
};
$$('[data-link]').forEach((a) => { a.href = links[a.dataset.link] || '#'; });
$$('[data-text="address"]').forEach((el) => { el.textContent = CONFIG.address; });
$$('[data-text="hours"]').forEach((el) => { el.textContent = CONFIG.hours || 'Уточняйте по телефону'; });

/* ---------- Mobile menu ---------- */
const burger = $('.burger');
const nav = $('#nav');
function setMenu(open) {
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

/* ---------- Reveal on scroll ---------- */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.reveal').forEach((el) => io.observe(el));
} else {
  $$('.reveal').forEach((el) => el.classList.add('is-visible'));
}

renderZoneChips();
update();
