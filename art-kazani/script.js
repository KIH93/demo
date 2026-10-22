// Мобильное меню
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  nav.classList.add('anim');
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
}));

// Галерея фактур
const TEX = {
  venetian: ['Венецианская штукатурка', 'Многослойное покрытие с глубиной и мягким блеском. Каждый слой полируется вручную.', 'гостиная, холл, спальня', '3 до 5 дней на комнату'],
  marble: ['Имитация мрамора', 'Рисунок прожилок наносится вручную, поверхность выглядит как камень, но весит в разы меньше.', 'акцентная стена, камин, ванная', '4 до 6 дней на стену'],
  concrete: ['Микробетон', 'Тонкое бесшовное покрытие 2 до 3 мм. Можно наносить на стены, пол, столешницы и даже на плитку.', 'лофт, ванная, кухня, офис', '5 до 7 дней на помещение'],
  stone: ['Колотый камень', 'Рельефная штукатурка с эффектом скола. Выразительно смотрится с боковой подсветкой.', 'прихожая, лестница, фасад камина', '3 до 4 дня на стену'],
  stencil: ['Штукатурка с трафаретом', 'Повторяющийся орнамент по декоративной основе. Узор и цвет подбираем под интерьер.', 'спальня, детская, ниши', '2 до 4 дня на стену'],
  gloss: ['Глянцевый натяжной потолок', 'Отражает свет и визуально поднимает комнату. Монтаж за один день без пыли.', 'гостиная, кухня, санузел', '1 день на комнату'],
  wood: ['Полы', 'Стяжка, выравнивание, ламинат, инженерная доска, плитка. Готовим основание под любое покрытие.', 'вся квартира', '2 до 5 дней'],
  marmorin: ['Марморин', 'Матовая известковая штукатурка с мягкой игрой тона. Дышит и подходит для спален.', 'спальня, детская, кабинет', '3 до 5 дней на комнату']
};
const texInfo = document.getElementById('texInfo');
document.querySelectorAll('.tex').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.tex').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const [t, d, where, term] = TEX[btn.dataset.t];
  texInfo.innerHTML = `<h3>${t}</h3><p>${d}</p><dl><div><dt>Где уместна</dt><dd>${where}</dd></div><div><dt>Срок работ</dt><dd>${term} (пример)</dd></div></dl>`;
}));

// До и после: условные иллюстрации комнат
const wallBefore = '<rect width="800" height="400" filter="url(#f-concrete)"/>';
const CASES = [
  {
    caption: 'Гостиная 24 м²: стяжка, выравнивание стен, венецианская штукатурка, глянцевый потолок. Срок 5 недель (пример).',
    before: `<svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">${wallBefore}
      <path d="M0 300h800v100H0z" fill="#6f6a64"/><path d="M0 300h800" stroke="#4c4844" stroke-width="3"/>
      <rect x="470" y="90" width="200" height="150" fill="#9fb3c2" stroke="#7a7570" stroke-width="10"/>
      <path d="M150 0v60" stroke="#333" stroke-width="2"/><circle cx="150" cy="70" r="10" fill="#f5e7a8"/>
      <path d="M90 300l40-110 40 110M260 200h120v100" fill="none" stroke="#4c4844" stroke-width="4" opacity=".5"/>
      <rect x="560" y="300" width="70" height="40" fill="#8a8580"/><rect x="580" y="285" width="40" height="18" fill="#9a958f"/></svg>`,
    after: `<svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice"><rect width="800" height="400" filter="url(#f-venetian)"/>
      <rect width="800" height="34" fill="#f6f3ee"/><ellipse cx="260" cy="12" rx="160" ry="10" fill="#fff" opacity=".9"/>
      <rect x="0" y="300" width="800" height="100" filter="url(#f-wood)"/>
      <rect x="470" y="90" width="200" height="150" fill="#bcd3e0" stroke="#f3eee7" stroke-width="10"/><path d="M570 90v150" stroke="#f3eee7" stroke-width="6"/>
      <rect x="440" y="80" width="26" height="220" fill="#d7c3a8"/><rect x="674" y="80" width="26" height="220" fill="#d7c3a8"/>
      <rect x="70" y="230" width="300" height="70" rx="10" fill="#4a3f36"/><rect x="80" y="205" width="280" height="40" rx="12" fill="#5d5046"/>
      <rect x="120" y="190" width="60" height="34" rx="8" fill="#c0643b"/><path d="M150 34v70" stroke="#2a2520" stroke-width="2"/><path d="M125 104h50l-10 22h-30z" fill="#2a2520"/>
      <rect x="560" y="320" width="90" height="10" fill="#2a2520"/><path d="M600 260c-20-30 0-50 5-60 5 10 25 30 5 60z" fill="#6c7a52"/><rect x="590" y="258" width="22" height="42" fill="#efe6da"/></svg>`
  },
  {
    caption: 'Санузел 4 м²: замена труб, гидроизоляция, крупноформатная плитка, скрытый бачок, подсветка. Срок 3 недели (пример).',
    before: `<svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice"><rect width="800" height="400" fill="#b4c2b6"/>
      <g stroke="#93a296" stroke-width="2">${Array.from({length:16},(_,i)=>`<path d="M${i*52} 0v400"/>`).join('')}${Array.from({length:9},(_,i)=>`<path d="M0 ${i*50}h800"/>`).join('')}</g>
      <rect x="90" y="220" width="320" height="110" rx="14" fill="#e9e6df" stroke="#a8a49d" stroke-width="4"/>
      <path d="M520 0v400M545 0v400" stroke="#6d6a66" stroke-width="10"/><circle cx="532" cy="130" r="18" fill="#7f6b53"/>
      <rect x="600" y="230" width="90" height="100" rx="8" fill="#ebe7e0"/><rect x="606" y="160" width="78" height="70" fill="#e1ddd5"/>
      <path d="M0 330h800v70H0z" fill="#8c8a83"/><path d="M220 20v60" stroke="#333" stroke-width="2"/><circle cx="220" cy="90" r="9" fill="#f5e7a8"/></svg>`,
    after: `<svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice"><rect width="800" height="400" filter="url(#f-marble)"/>
      <g stroke="#d8d0c4" stroke-width="1.5">${Array.from({length:6},(_,i)=>`<path d="M${i*160} 0v400"/>`).join('')}<path d="M0 200h800"/></g>
      <rect x="70" y="210" width="360" height="120" rx="6" fill="#fbfaf7"/><rect x="70" y="200" width="360" height="16" fill="#efe9e0"/>
      <rect x="470" y="70" width="70" height="260" fill="#2a2520" opacity=".08"/><rect x="580" y="110" width="140" height="90" rx="8" fill="#cfdde3" stroke="#bda98e" stroke-width="6"/>
      <rect x="560" y="226" width="180" height="16" fill="#5d4a3a"/><rect x="560" y="242" width="180" height="88" fill="#6b5545"/><ellipse cx="650" cy="226" rx="40" ry="8" fill="#fff"/>
      <rect x="0" y="330" width="800" height="70" filter="url(#f-concrete)"/>
      <path d="M0 6h800" stroke="#ffe9c4" stroke-width="10" opacity=".8"/></svg>`
  },
  {
    caption: 'Лоджия 6 м²: утепление, обшивка, микробетон, рабочее место у окна. Срок 2 недели (пример).',
    before: `<svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">${wallBefore}
      <rect x="120" y="40" width="560" height="200" fill="#a9bccb"/><g stroke="#7f7a74" stroke-width="10" fill="none"><rect x="120" y="40" width="560" height="200"/><path d="M260 40v200M400 40v200M540 40v200"/></g>
      <rect x="0" y="240" width="800" height="160" fill="#7c776f"/><path d="M0 300h800" stroke="#605c56" stroke-width="3"/>
      <rect x="560" y="280" width="90" height="70" fill="#8d6d4d"/><rect x="580" y="250" width="60" height="30" fill="#9b7c5c"/><rect x="160" y="300" width="40" height="70" fill="#5f6f7c"/></svg>`,
    after: `<svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice"><rect width="800" height="400" filter="url(#f-concrete)"/>
      <rect x="120" y="40" width="560" height="190" fill="#c7dde9"/><g stroke="#f6f3ee" stroke-width="10" fill="none"><rect x="120" y="40" width="560" height="190"/><path d="M400 40v190"/></g>
      <rect x="0" y="230" width="800" height="70" fill="#e8dfd3"/><rect x="0" y="300" width="800" height="100" filter="url(#f-wood)"/>
      <rect x="160" y="226" width="300" height="14" fill="#7a5a40"/><rect x="180" y="240" width="10" height="90" fill="#2a2520"/><rect x="430" y="240" width="10" height="90" fill="#2a2520"/>
      <rect x="250" y="190" width="80" height="36" rx="3" fill="#2a2520"/><rect x="520" y="260" width="70" height="60" rx="10" fill="#c0643b"/>
      <path d="M680 230c-15-40 10-60 14-70 6 12 30 34 6 70z" fill="#6c7a52"/><rect x="672" y="228" width="34" height="44" fill="#efe6da"/></svg>`
  }
];
const baBefore = document.getElementById('baBefore');
const baAfter = document.getElementById('baAfter');
const baHandle = document.getElementById('baHandle');
const baRange = document.getElementById('baRange');
const baCaption = document.getElementById('baCaption');
function setCase(i) {
  baBefore.innerHTML = CASES[i].before;
  baAfter.innerHTML = CASES[i].after;
  baCaption.textContent = CASES[i].caption;
}
function setSplit(v) {
  baBefore.style.clipPath = `inset(0 ${100 - v}% 0 0)`;
  baHandle.style.left = v + '%';
}
baRange.addEventListener('input', e => setSplit(e.target.value));
document.querySelectorAll('.ba-tab').forEach(t => t.addEventListener('click', () => {
  document.querySelectorAll('.ba-tab').forEach(x => { x.classList.remove('active'); x.setAttribute('aria-selected', false); });
  t.classList.add('active'); t.setAttribute('aria-selected', true);
  setCase(+t.dataset.case);
}));
setCase(0);

// Калькулятор (условные ставки, руб. за м²)
const RATE = { cosm: 4500, cap: 9000, key: 14000 };
const OBJ = { flat: 1, new: 0.92, house: 1.15, office: 0.95 };
const form = document.getElementById('calcForm');
const area = document.getElementById('area');
const fmt = n => Math.round(n / 1000) * 1000;
function calc() {
  const a = +area.value;
  document.getElementById('areaOut').textContent = a;
  const obj = form.obj.value, lvl = form.lvl.value;
  let sum = a * RATE[lvl] * OBJ[obj];
  const opts = [...form.querySelectorAll('[name=opt]:checked')].map(x => x.value);
  if (opts.includes('decor')) sum += a * 0.8 * 1800;
  if (opts.includes('ceil')) sum += a * 650;
  if (opts.includes('bath')) sum += 180000;
  let weeks = Math.ceil(a / ({ cosm: 25, cap: 12, key: 9 })[lvl]) + (opts.length ? 1 : 0);
  weeks = Math.max(weeks, 1);
  document.getElementById('calcSum').textContent = fmt(sum).toLocaleString('ru-RU') + ' руб.';
  const w = weeks % 10 === 1 && weeks % 100 !== 11 ? 'неделя' : [2,3,4].includes(weeks % 10) && ![12,13,14].includes(weeks % 100) ? 'недели' : 'недель';
  document.getElementById('calcTerm').textContent = `срок около ${weeks} ${w}`;
}
form.addEventListener('input', calc);
calc();

// Заявка (демо, без отправки)
document.getElementById('reqForm').addEventListener('submit', e => {
  e.preventDefault();
  const phone = e.target.phone;
  const note = document.getElementById('reqNote');
  if (phone.value.replace(/\D/g, '').length < 10) {
    phone.classList.add('err');
    note.className = 'form-note';
    note.textContent = 'Укажите телефон, чтобы мы могли перезвонить.';
    phone.focus();
    return;
  }
  phone.classList.remove('err');
  note.className = 'form-note ok';
  note.textContent = 'Спасибо! Это демо, заявка никуда не отправлена.';
  e.target.reset();
});

// Появление блоков при прокрутке
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.sec-head, .services, .tex-grid, .steps, .delivery, .ba, .reviews, .price-cards, .calc, .contact-grid > *').forEach(el => {
  el.classList.add('rv'); io.observe(el);
});
