(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* заголовок по буквам */
  let c = 0;
  document.querySelectorAll('[data-split]').forEach(el => {
    const t = el.textContent; el.textContent = '';
    [...t].forEach(ch => {
      const s = document.createElement('span');
      s.className = 'ch'; s.textContent = ch; s.style.setProperty('--c', c++);
      el.appendChild(s);
    });
  });

  /* шапка и липкая кнопка */
  const top = document.getElementById('top');
  const sticky = document.getElementById('sticky');
  const alti = document.querySelector('.alti');
  const dot = document.getElementById('altiDot');
  const val = document.getElementById('altiVal');
  const onScroll = () => {
    const y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    top.classList.toggle('is-solid', y > 40);
    sticky.classList.toggle('is-on', y > innerHeight * .7);
    alti.classList.toggle('is-on', y > innerHeight * .4);
    const p = h > 0 ? Math.min(1, y / h) : 0;
    dot.style.top = (p * 100) + '%';
    val.textContent = (6 * (1 - p)).toFixed(1).replace('.', ',');
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* меню */
  const burger = document.getElementById('burger'), nav = document.getElementById('nav');
  burger.addEventListener('click', () => {
    const o = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', o); nav.classList.toggle('is-open', o);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open');
  }));

  /* счётчики */
  const count = el => {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    const fmt = v => v.toFixed(dec).replace('.', ',');
    if (reduce) { el.textContent = fmt(end); return; }
    const t0 = performance.now(), d = 1400;
    const step = t => {
      const k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(end * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* появление при прокрутке */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    e.target.querySelectorAll('[data-count]').forEach(count);
    io.unobserve(e.target);
  }), { threshold: .18, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  setTimeout(() => document.querySelectorAll('.rig [data-count]').forEach(count), reduce ? 0 : 1500);

  /* расписание (пример) */
  const names = { air: 'Воздушная гимнастика', pole: 'Пилонный спорт', acro: 'Акробатика' };
  const week = [
    ['Пн', [['09:00','air','Полотна','начинающие'],['18:30','pole','Пилон','начинающие'],['20:00','air','Кольцо','продолжающие']]],
    ['Вт', [['10:00','acro','Акробатика','все уровни'],['19:00','pole','Пилон','продолжающие'],['20:30','air','Полотна','начинающие']]],
    ['Ср', [['09:00','air','Кольцо','начинающие'],['18:30','acro','Акробатика и растяжка','все уровни'],['20:00','pole','Пилон','начинающие']]],
    ['Чт', [['10:00','pole','Пилон','начинающие'],['19:00','air','Полотна','продолжающие'],['20:30','acro','Акробатика','все уровни']]],
    ['Пт', [['09:00','acro','Акробатика','все уровни'],['18:30','air','Кольцо','начинающие'],['20:00','pole','Пилон','продолжающие']]],
    ['Сб', [['11:00','air','Полотна','начинающие'],['12:30','pole','Пилон','все уровни'],['14:00','acro','Акробатика','все уровни']]],
    ['Вс', [['11:00','air','Кольцо и полотна','все уровни'],['12:30','acro','Растяжка','все уровни']]]
  ];
  const daysEl = document.getElementById('days'), slotsEl = document.getElementById('slots');
  let cur = (new Date().getDay() + 6) % 7, filter = 'all';
  const base = new Date(); base.setDate(base.getDate() - cur);
  week.forEach(([d], i) => {
    const b = document.createElement('button');
    const dt = new Date(base); dt.setDate(base.getDate() + i);
    b.className = 'day'; b.setAttribute('role', 'tab'); b.dataset.i = i;
    b.innerHTML = `<b>${d}</b><small>${dt.getDate()}.${String(dt.getMonth() + 1).padStart(2, '0')}</small>`;
    b.addEventListener('click', () => { cur = i; render(); });
    daysEl.appendChild(b);
  });
  const render = () => {
    daysEl.querySelectorAll('.day').forEach((b, i) => b.setAttribute('aria-selected', i === cur));
    const list = week[cur][1].filter(s => filter === 'all' || s[1] === filter);
    slotsEl.innerHTML = list.length ? list.map((s, k) =>
      `<div class="slot" data-d="${s[1]}" style="--k:${k}"><span class="slot__t">${s[0]}</span><div><div class="slot__n">${s[2]}</div><div class="slot__m">${names[s[1]]} · 60 мин · Спартаковская</div></div><span class="slot__lvl">${s[3]}</span></div>`
    ).join('') : '<p class="slots__empty">В этот день занятий по направлению нет. Выберите другой день.</p>';
  };
  document.querySelectorAll('.chip').forEach(ch => ch.addEventListener('click', () => {
    filter = ch.dataset.f;
    document.querySelectorAll('.chip').forEach(x => { x.classList.toggle('is-on', x === ch); x.setAttribute('aria-pressed', x === ch); });
    render();
  }));
  render();

  /* филиалы: переключение карты */
  const map = document.getElementById('map');
  document.querySelectorAll('.branch').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.branch').forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-selected', x === b); });
    map.src = 'https://yandex.ru/map-widget/v1/?text=' + encodeURIComponent(b.dataset.q) + '&z=16';
    map.title = 'Карта: Воздушный дом, ' + b.dataset.name;
  }));
})();
