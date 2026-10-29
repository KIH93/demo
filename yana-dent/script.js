// Яна-Дент, демо
document.documentElement.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// заголовок по буквам
document.querySelectorAll('[data-split]').forEach(el => {
  const txt = el.textContent;
  el.textContent = '';
  [...txt].forEach((c, i) => {
    const s = document.createElement('span');
    s.className = 'ch' + (c === '-' ? ' ch--dash' : '');
    s.style.setProperty('--c', i);
    s.setAttribute('aria-hidden', 'true');
    s.textContent = c;
    el.appendChild(s);
  });
});

// на телефоне чипы едут лентой: дублируем набор для бесшовного цикла
const chips = document.querySelector('.chips');
if (chips) {
  [...chips.children].forEach(li => {
    const c = li.cloneNode(true);
    c.classList.add('chip--dup');
    c.setAttribute('aria-hidden', 'true');
    chips.appendChild(c);
  });
}

// шапка и нижняя панель
const header = document.querySelector('.top');
const dock = document.querySelector('.dock');
const hero = document.querySelector('.hero');
const onScroll = () => {
  const y = scrollY;
  header.classList.toggle('is-scrolled', y > 10);
  dock.classList.toggle('is-on', y > hero.offsetHeight * .6);
  updateSteps();
};

// появление блоков
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(e.target);
  });
}, { threshold: .18, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal, .smile').forEach(el => io.observe(el));

// счётчики
function countUp(el) {
  const to = +el.dataset.count, from = +(el.dataset.from || 0), dec = +(el.dataset.dec || 0);
  const fmt = v => dec ? v.toFixed(dec) : Math.round(v).toString();
  if (reduce) { el.textContent = fmt(to); return; }
  const dur = 1600, t0 = performance.now();
  const tick = t => {
    const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(from + (to - from) * e);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// вкладки прайса
const tabs = [...document.querySelectorAll('[role="tab"]')];
const bar = document.querySelector('.tabs__bar');
function moveBar(t) {
  bar.style.width = t.offsetWidth + 'px';
  bar.style.transform = `translateX(${t.offsetLeft}px)`;
}
function select(t) {
  tabs.forEach(x => {
    const on = x === t;
    x.setAttribute('aria-selected', on);
    x.tabIndex = on ? 0 : -1;
    document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
  });
  moveBar(t);
  t.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => select(t));
  t.addEventListener('keydown', e => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    const n = tabs[(i + d + tabs.length) % tabs.length];
    n.focus(); select(n);
  });
});
addEventListener('load', () => moveBar(tabs.find(t => t.getAttribute('aria-selected') === 'true')));
addEventListener('resize', () => moveBar(tabs.find(t => t.getAttribute('aria-selected') === 'true')));

// отзывы: стрелки и перетаскивание
const revs = document.getElementById('revs');
document.querySelectorAll('.rnav').forEach(b => b.addEventListener('click', () => {
  const card = revs.querySelector('.rev');
  revs.scrollBy({ left: (card.offsetWidth + 18) * +b.dataset.dir, behavior: reduce ? 'auto' : 'smooth' });
}));
let drag = null;
revs.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'mouse') return;
  drag = { x: e.clientX, s: revs.scrollLeft };
  revs.style.scrollSnapType = 'none';
  revs.style.cursor = 'grabbing';
});
addEventListener('pointermove', e => { if (drag) revs.scrollLeft = drag.s - (e.clientX - drag.x); });
addEventListener('pointerup', () => {
  if (!drag) return;
  drag = null;
  revs.style.scrollSnapType = '';
  revs.style.cursor = '';
});

// шаги: линия заполняется при прокрутке
const stepsList = document.getElementById('steps-list');
const fill = stepsList.querySelector('.steps__fill');
const steps = [...stepsList.querySelectorAll('.step')];
function updateSteps() {
  const r = stepsList.getBoundingClientRect();
  const mid = innerHeight * .6;
  const p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
  fill.style.setProperty('--p', p.toFixed(3));
  steps.forEach(s => s.classList.toggle('is-on', s.getBoundingClientRect().top + 24 < mid));
}

// лёгкий параллакс чипов за курсором
if (!reduce && matchMedia('(pointer:fine)').matches) {
  hero.addEventListener('pointermove', e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    chips.style.transform = `translate(${x * -18}px, ${y * -12}px)`;
  });
  chips.style.transition = 'transform .6s cubic-bezier(.2,.7,.2,1)';
}

// форма в демо ничего не отправляет
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const phone = e.target.phone.value.replace(/\D/g, '');
  const msg = document.getElementById('form-msg');
  msg.textContent = phone.length < 10
    ? 'Укажите номер телефона, пожалуйста.'
    : 'Спасибо! Это демо, заявка никуда не отправлена. На рабочем сайте она придёт администратору.';
});

addEventListener('scroll', onScroll, { passive: true });
onScroll();
