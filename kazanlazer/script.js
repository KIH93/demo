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

/* ---------- Zones: picker switches + chat answers share one state ---------- */
function renderZoneControls() {
  $('[data-toggles]').innerHTML = ZONES.map((z) => `
    <li><button type="button" class="toggle" role="switch" data-zone="${z.id}" aria-checked="false">
      <span class="toggle__label">${z.label}${PROMO_ZONES.includes(z.id) ? '<span class="toggle__mark">акция</span>' : ''}</span>
      <span class="toggle__sw" aria-hidden="true"></span>
    </button></li>`).join('');
  $$('[data-zones]').forEach((box) => {
    box.innerHTML = ZONES.map((z) => `<button type="button" class="ans" data-zone="${z.id}" aria-pressed="false">${z.label}</button>`).join('');
  });
}

function syncZoneControls() {
  $$('[data-zone]').forEach((b) => {
    const on = String(state.zones.has(b.dataset.zone));
    b.setAttribute(b.getAttribute('role') === 'switch' ? 'aria-checked' : 'aria-pressed', on);
  });
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-zone]');
  if (!btn) return;
  const id = btn.dataset.zone;
  state.zones.has(id) ? state.zones.delete(id) : state.zones.add(id);
  update();
});

$$('[data-single]').forEach((group) => {
  group.addEventListener('click', (e) => {
    const btn = e.target.closest('.ans');
    if (!btn) return;
    const key = group.dataset.single;
    state[key] = state[key] === btn.dataset.value ? '' : btn.dataset.value;
    $$('.ans', group).forEach((b) => b.setAttribute('aria-pressed', b.dataset.value === state[key]));
    renderMessage();
  });
});

$('#name').addEventListener('input', (e) => {
  state.name = e.target.value.trim();
  renderMessage();
});

/* ---------- Picker verdict ---------- */
function renderPicker() {
  const box = $('#picker-result');
  const selected = [...state.zones];
  const promo = selected.filter((z) => PROMO_ZONES.includes(z));
  const other = selected.filter((z) => !PROMO_ZONES.includes(z));
  const match = matchComplex();

  if (!selected.length) {
    box.innerHTML = `
      <p class="v__kicker">Подсказка</p>
      <p class="v__title">Включите одну или несколько зон</p>
      <p class="v__text">Зоны с отметкой "акция" входят в акционные комплексы. Подскажем подходящий или предложим консультацию.</p>`;
    return;
  }

  let html = '';
  if (match) {
    html += `
      <p class="v__kicker">Подходит</p>
      <p class="v__title">Комплекс ${match.id}: ${zonesText(match.zones).toLowerCase()}</p>
      <p class="v__price"><strong>${match.price}</strong><s>вместо ${match.old}</s></p>`;
  } else if (promo.length === 3) {
    html += `
      <p class="v__kicker">Почти</p>
      <p class="v__title">Все три зоны есть в акциях, но одним комплексом их нет</p>
      <p class="v__text">Например, Комплекс 03 (бикини глубокое + голени) за 2 450 руб., а стоимость подмышек отдельно уточните у администратора.</p>`;
  } else if (promo.length === 1) {
    const options = COMPLEXES.filter((c) => c.zones.includes(promo[0]));
    html += `
      <p class="v__kicker">Добавьте вторую зону</p>
      <p class="v__title">Зона "${zoneLabel(promo[0]).toLowerCase()}" есть в акционных комплексах</p>
      <div class="v__opts">${options.map((c) => `<button type="button" class="v__opt" data-apply="${c.id}">Комплекс ${c.id}: ${zonesText(c.zones).toLowerCase()}, ${c.price}</button>`).join('')}</div>`;
  } else {
    html += `
      <p class="v__kicker">Консультация</p>
      <p class="v__title">Для этих зон акционного комплекса сейчас нет</p>
      <p class="v__text">Мастер подскажет оптимальный вариант на консультации.</p>`;
  }

  if (other.length) {
    html += `<ul class="v__list">${other.map((id) => `<li><span>${zoneLabel(id)}</span><span>стоимость уточняйте</span></li>`).join('')}</ul>`;
  }

  html += `<a class="v__go" href="#contact" data-goto-contact>Записаться с этим выбором</a>`;
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
  if (state.before === 'yes') lines.push('Опыт лазерной эпиляции уже был.');
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
  $$('.medal').forEach((card) => {
    card.classList.toggle('is-picked', Boolean(match && state.zones.size === 2 && card.dataset.complex === match.id));
  });
}

function update() {
  syncZoneControls();
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

/* ---------- Floating call button ---------- */
const fab = $('.fab');
const onScroll = () => fab.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.9);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

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

renderZoneControls();
update();
