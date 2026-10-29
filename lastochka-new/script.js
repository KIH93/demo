// Ласточка NEW, демо. Иллюстрации портфолио нарисованы для макета (SVG), это не реальные работы студии.

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SWALLOW = 'M0 -44C5 -44 8 -40 8 -34C9 -28 10 -24 14 -22C40 -30 70 -34 96 -46C76 -26 50 -10 22 -4C18 4 14 14 10 20L26 56C18 46 10 36 0 30C-10 36 -18 46 -26 56L-10 20C-14 14 -18 4 -22 -4C-50 -10 -76 -26 -96 -46C-70 -34 -40 -30 -14 -22C-10 -24 -9 -28 -8 -34C-8 -40 -5 -44 0 -44Z';

const star = (x, y, r) =>
  `<path class="fill" d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z"/>`;

function branch() {
  let s = '<path d="M70 240C80 180 90 120 130 30"/>';
  for (let i = 0; i < 9; i++) {
    const t = i / 9;
    const x = 72 + t * 56 + t * t * 4;
    const y = 230 - t * 195;
    const side = i % 2 ? 1 : -1;
    const len = 26 - i * 1.6;
    const ex = x + side * len;
    const ey = y - len * 0.6;
    s += `<path d="M${x} ${y}Q${x + side * len * 0.2} ${ey - 8} ${ex} ${ey}Q${x + side * len * 0.8} ${y + 4} ${x} ${y}Z"/>`;
  }
  return s + star(150, 60, 6) + star(46, 120, 4);
}

const WORKS = [
  {
    cat: 'old', title: 'Ласточка', style: 'олдскул',
    svg: `<g transform="translate(100 110) rotate(-18)"><path class="fill" d="${SWALLOW}"/></g>
      <path class="bg" d="M40 194C70 182 130 182 160 194L154 218C130 208 70 208 46 218Z"/><path d="M40 194L24 208L46 218M160 194L176 208L154 218"/>
      <text x="100" y="202" text-anchor="middle" dominant-baseline="middle" font-family="Unbounded, sans-serif" font-size="12" fill="currentColor" stroke="none">УДАЧА</text>
      ${star(40, 60, 7)}${star(166, 160, 5)}`
  },
  {
    cat: 'fine', title: 'Полумесяц', style: 'fine line',
    svg: `<path d="M130 56A76 76 0 1 0 130 200A92 92 0 0 1 130 56Z"/>
      <path stroke-dasharray="1 6" d="M150 70L170 104L158 140L176 170"/>
      ${star(150, 70, 6)}${star(170, 104, 4)}${star(158, 140, 5)}${star(176, 170, 3)}`
  },
  {
    cat: 'graphic', title: 'Змея и кинжал', style: 'графика',
    svg: `<path d="M100 30L110 160H90Z"/><path d="M100 36V156"/><path d="M68 162H132"/><rect x="93" y="164" width="14" height="40" rx="3"/><circle cx="100" cy="212" r="7"/>
      <path stroke-width="8" d="M150 60C120 50 70 70 100 100S150 140 110 160S50 180 70 210"/>
      <path class="bg-s" stroke-width="3" d="M150 60C120 50 70 70 100 100S150 140 110 160S50 180 70 210"/>
      <circle class="fill" cx="152" cy="60" r="8"/><path d="M160 58L170 54M160 62L170 66"/>`
  },
  {
    cat: 'old', title: 'Роза', style: 'олдскул',
    svg: `<path class="fill" d="M70 96C56 108 60 136 80 144C94 150 108 150 122 144C142 136 146 108 130 96C122 112 80 112 70 96Z"/>
      <path d="M76 96C74 74 92 62 104 64C120 66 130 80 126 96C118 108 84 110 76 96Z"/>
      <path d="M92 90C90 80 98 74 106 76C112 78 114 86 108 90C104 92 100 88 102 84"/>
      <path d="M100 150C98 180 104 210 100 244"/>
      <path class="fill" d="M100 186C84 172 64 174 54 184C70 194 88 194 100 186Z"/><path d="M101 206C116 192 136 194 146 204C130 214 112 214 101 206Z"/>`
  },
  {
    cat: 'fine', title: 'Ветка', style: 'fine line ботаника',
    svg: branch()
  },
  {
    cat: 'graphic', title: 'Мотылёк', style: 'графика',
    svg: `<g id="wing"><path d="M100 110C116 72 160 54 178 76C190 92 170 118 100 120Z"/><path d="M100 126C130 126 160 146 150 176C142 196 112 180 100 130Z"/><circle class="fill" cx="150" cy="86" r="8"/><circle cx="132" cy="154" r="5"/><path d="M110 112C130 100 150 92 168 84"/></g>
      <use href="#wing" transform="translate(200 0) scale(-1 1)"/>
      <ellipse class="fill" cx="100" cy="128" rx="6" ry="30"/><path d="M98 100C92 80 84 70 74 66M102 100C108 80 116 70 126 66"/>`
  },
  {
    cat: 'fine', title: 'Ласточка в полёте', style: 'fine line',
    svg: `<g transform="translate(110 96) rotate(24) scale(.7)"><path stroke-width="3" d="${SWALLOW}"/></g>
      <path stroke-dasharray="2 7" d="M30 230C50 190 40 160 80 140"/>${star(48, 70, 5)}${star(160, 186, 7)}`
  },
  {
    cat: 'old', title: 'Сердце', style: 'олдскул',
    svg: `<path class="fill" d="M100 196C50 160 30 136 30 110C30 90 46 76 64 76C80 76 92 86 100 100C108 86 120 76 136 76C154 76 170 90 170 110C170 136 150 160 100 196Z"/>
      <path class="bg" d="M22 126C70 112 130 112 178 126L172 152C130 138 70 138 28 152Z"/>
      <text x="100" y="138" text-anchor="middle" dominant-baseline="middle" font-family="Unbounded, sans-serif" font-size="12" fill="currentColor" stroke="none">НАВСЕГДА</text>
      ${star(166, 56, 6)}${star(36, 216, 5)}`
  }
];

// Галерея
const gallery = document.getElementById('gallery');
const svgOpen = '<svg class="art" viewBox="0 0 200 260" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
WORKS.forEach((w, i) => {
  const b = document.createElement('button');
  b.className = 'tile';
  b.dataset.cat = w.cat;
  b.dataset.i = i;
  b.setAttribute('aria-label', `${w.title}, ${w.style}, иллюстрация-пример. Открыть крупно`);
  b.innerHTML = svgOpen + w.svg.replace('id="wing"', `id="wing${i}"`).replace('href="#wing"', `href="#wing${i}"`) + '</svg>' +
    `<span class="tile__label"><span>${w.title}</span><span>пример</span></span>`;
  gallery.appendChild(b);
});
// обводка змеи цветом фона
const style = document.createElement('style');
style.textContent = '.art .bg-s{stroke:var(--color-background)}.tile:hover .art .bg-s,.tile:focus-visible .art .bg-s,.lightbox__art .bg-s{stroke:var(--color-foreground)}';
document.head.appendChild(style);

const popTiles = tiles => tiles.forEach((t, i) => {
  t.classList.remove('pop');
  void t.offsetWidth;
  t.style.setProperty('--i', i);
  t.classList.add('pop');
});

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c === chip));
    const f = chip.dataset.filter;
    const shown = [];
    gallery.querySelectorAll('.tile').forEach(t => {
      const hide = f !== 'all' && t.dataset.cat !== f;
      t.classList.toggle('is-hidden', hide);
      if (!hide) shown.push(t);
    });
    if (!reduceMotion) popTiles(shown);
  });
});

// Лайтбокс
const lb = document.getElementById('lightbox');
const lbArt = lb.querySelector('.lightbox__art');
const lbCap = lb.querySelector('figcaption');
const lbClose = lb.querySelector('.lightbox__close');
let lastTile = null;
gallery.addEventListener('click', e => {
  const t = e.target.closest('.tile');
  if (!t) return;
  const w = WORKS[t.dataset.i];
  lastTile = t;
  lbArt.innerHTML = t.querySelector('svg').outerHTML;
  lbCap.textContent = `${w.title}, ${w.style}. Иллюстрация для демо, не работа студии.`;
  lb.hidden = false;
  lbClose.focus();
});
const closeLb = () => {
  if (lb.hidden) return;
  lb.hidden = true;
  if (lastTile) lastTile.focus();
};
lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lightbox__close')) closeLb(); });

// Меню
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
menu.querySelectorAll('li').forEach((li, i) => li.style.setProperty('--i', i));
const header = document.querySelector('.header');
const setMenu = open => {
  if (open) menu.style.top = `${header.getBoundingClientRect().bottom}px`;
  menu.hidden = !open;
  menu.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  document.body.style.overflow = open ? 'hidden' : '';
};
burger.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeLb();
  if (!menu.hidden) { setMenu(false); burger.focus(); }
});

// Калькулятор (условный, пример)
const form = document.getElementById('calc');
const out = document.getElementById('calcOut');
const calc = () => {
  const d = new FormData(form);
  const sum = Math.round(d.get('size') * d.get('detail') * d.get('color') / 500) * 500;
  out.textContent = `от ${sum.toLocaleString('ru-RU')} руб.`;
  out.classList.remove('bump'); void out.offsetWidth; out.classList.add('bump');
};
form.addEventListener('change', calc);

// Прогресс чтения, полёт ласточки, шаги главы 02
const bar = document.getElementById('progress');
const bird = document.getElementById('bird');
const steps = document.getElementById('steps');
const stepItems = [...steps.querySelectorAll('.step')];
let ticking = false;
const onScroll = () => {
  ticking = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;

  const r = steps.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
  steps.style.setProperty('--fill', p);
  stepItems.forEach(s => s.classList.toggle('is-active', s.getBoundingClientRect().top < innerHeight * 0.6));

  if (!reduceMotion && scrollY < innerHeight * 1.5) {
    const y = scrollY;
    bird.style.transform = `translate(${-y * 0.5}px, ${-y * 0.35}px) rotate(${-12 - y * 0.02}deg)`;
  }
};
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);
onScroll();

// Плавающая кнопка записи: после первого экрана и до финала
const fab = document.querySelector('.fab');
let heroOut = false, finaleIn = false;
const toggleFab = () => fab.classList.toggle('is-visible', heroOut && !finaleIn);
new IntersectionObserver(([e]) => { heroOut = !e.isIntersecting; toggleFab(); }).observe(document.querySelector('.hero'));
new IntersectionObserver(([e]) => { finaleIn = e.isIntersecting; toggleFab(); }).observe(document.getElementById('contacts'));

// Появление блоков со ступенчатой задержкой внутри родителя
document.querySelectorAll('.manifest, .price-rows, .masters, .reviews').forEach(list => {
  [...list.children].forEach((el, i) => el.style.setProperty('--i', i));
});
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
