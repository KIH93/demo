(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WA = 'https://wa.me/79934077792';
  const waLink = (text) => WA + '?text=' + encodeURIComponent(text);
  const fmt = (n) => n.toLocaleString('ru-RU').replace(/ /g, ' ');

  /* WhatsApp: текст по умолчанию */
  document.querySelectorAll('.js-wa').forEach((a) => {
    if (a.hasAttribute('data-who-wa') || a.hasAttribute('data-r-wa')) return;
    a.href = waLink(a.dataset.waText || 'Здравствуйте! Хочу записаться в Prime Time.');
  });

  /* Табло: перелистывающиеся буквы */
  const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  document.querySelectorAll('[data-flap]').forEach((row, ri) => {
    [...row.dataset.flap].forEach((ch, ci) => {
      const cell = document.createElement('span');
      cell.className = 'flap';
      const s = document.createElement('span');
      s.textContent = reduce ? ch : CH[Math.floor(Math.random() * CH.length)];
      cell.appendChild(s);
      row.appendChild(cell);
      if (reduce) return;
      const steps = 8 + ci * 3 + ri * 6;
      let k = 0;
      setTimeout(function spin() {
        k++;
        s.textContent = k >= steps ? ch : CH[Math.floor(Math.random() * CH.length)];
        cell.classList.remove('tick'); void cell.offsetWidth; cell.classList.add('tick');
        if (k < steps) setTimeout(spin, 55 + k * 3);
      }, 250 + ri * 120);
    });
  });

  document.querySelectorAll('.timetable__rows li').forEach((li, i) => li.style.setProperty('--r-i', i));

  /* Статусы на табло иногда перелистываются */
  if (!reduce) {
    const states = ['СВОБОДНО', '2 МЕСТА', 'СВОБОДНО', 'ЗАНЯТО', '1 МЕСТО'];
    const sts = [...document.querySelectorAll('.tt__st')];
    setInterval(() => {
      const el = sts[Math.floor(Math.random() * sts.length)];
      const next = states[Math.floor(Math.random() * states.length)];
      el.style.transition = 'opacity .18s';
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = next;
        el.classList.toggle('tt__st--busy', next === 'ЗАНЯТО');
        el.style.opacity = '1';
      }, 180);
    }, 3200);
  }

  /* Часы и шкала дня */
  const clock = document.querySelector('[data-clock]');
  const sun = document.querySelector('[data-sun]');
  const dayTxt = document.querySelector('[data-daytxt]');
  const tickClock = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    clock.textContent = hh + ':' + mm;
    const h = d.getHours() + d.getMinutes() / 60;
    const pos = Math.min(1, Math.max(0, (h - 9) / 12));
    sun.style.setProperty('--pos', (pos * 100).toFixed(1) + '%');
    dayTxt.textContent = (h >= 9 && h < 21)
      ? 'Сейчас ' + hh + ':' + mm + ', студия работает до 21:00 (пример графика)'
      : 'Сейчас ' + hh + ':' + mm + ', студия откроется в 09:00 (пример графика). Онлайн-запись работает всегда.';
  };
  tickClock();
  setInterval(tickClock, 30000);

  /* Кто идёт на стрижку */
  const WHO = {
    she: { tip: 'Для вас: стрижка, цвет и уход в одном визите.', items: [['Женская стрижка', 'от 1 200'], ['Окрашивание', 'от 4 000*'], ['Ботокс волос', 'от 3 500*'], ['Укладка', 'от 1 000*']], wa: 'женскую стрижку' },
    he: { tip: 'Для вас: стрижка и борода за один заход.', items: [['Мужская стрижка', 'от 1 300'], ['Оформление бороды', 'от 700*'], ['Стрижка + борода', 'от 1 800*']], wa: 'мужскую стрижку' },
    kid: { tip: 'Для ребёнка: быстро, спокойно, родитель рядом.', items: [['Детская стрижка', 'от 800*'], ['Плетение кос', 'от 1 500*'], ['Выезд на дом', 'по запросу']], wa: 'детскую стрижку' },
    family: { tip: 'Для всей семьи: запишем всех на одно время, чтобы никто не ждал.', items: [['Женская стрижка', 'от 1 200'], ['Мужская стрижка', 'от 1 300'], ['Детская стрижка', 'от 800*'], ['Выезд на дом', 'по запросу']], wa: 'стрижки для всей семьи' }
  };
  const tabs = document.querySelectorAll('[data-who]');
  const tipEl = document.querySelector('[data-who-tip]');
  const listEl = document.querySelector('[data-who-list]');
  const whoWa = document.querySelector('[data-who-wa]');
  const setWho = (key) => {
    const w = WHO[key];
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.who === key)));
    tipEl.textContent = w.tip;
    const price = (p) => p === 'по запросу' ? p : p.replace('*', '') + ' руб.' + (p.includes('*') ? '*' : '');
    listEl.innerHTML = w.items.map((it, i) => `<li style="--c:${i}">${it[0]}<b>${price(it[1])}</b></li>`).join('');
    whoWa.href = waLink('Здравствуйте! Хочу записаться в Prime Time на ' + w.wa + '.');
  };
  tabs.forEach((t) => t.addEventListener('click', () => setWho(t.dataset.who)));
  setWho('she');

  /* Конструктор образа */
  const form = document.querySelector('.builder__form');
  const rList = document.querySelector('[data-r-list]');
  const rDisc = document.querySelector('[data-r-disc]');
  const rDiscVal = document.querySelector('[data-r-discval]');
  const rTotal = document.querySelector('[data-r-total]');
  const rTime = document.querySelector('[data-r-time]');
  const rWa = document.querySelector('[data-r-wa]');
  const first = document.getElementById('first');
  let shown = 0;
  const animateTo = (to) => {
    if (reduce) { rTotal.textContent = fmt(to); shown = to; return; }
    const from = shown, t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 450);
      const v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      rTotal.textContent = fmt(v);
      if (p < 1) requestAnimationFrame(step); else shown = to;
    };
    requestAnimationFrame(step);
  };
  const calc = () => {
    const picked = ['cut', 'care', 'style'].map((n) => form.querySelector(`input[name="${n}"]:checked`)).filter((i) => +i.value > 0);
    let sum = 0, min = 0;
    rList.innerHTML = picked.length ? picked.map((i) => {
      sum += +i.value; min += +i.dataset.min;
      return `<li><span>${i.dataset.name}</span><span>${fmt(+i.value)} руб.</span></li>`;
    }).join('') : '<li><span>Выберите хотя бы одну услугу</span><span></span></li>';
    const disc = first.checked ? Math.round(sum * 0.15) : 0;
    rDisc.style.display = disc ? '' : 'none';
    rDiscVal.textContent = '−' + fmt(disc) + ' руб.';
    const total = sum - disc;
    animateTo(total);
    const h = Math.floor(min / 60), m = min % 60;
    rTime.textContent = min ? (h ? h + ' ч' : '') + (m ? ' ' + m + ' мин' : '') : '0 мин';
    const names = picked.map((i) => i.dataset.name).join(' + ');
    rWa.href = waLink('Здравствуйте! Хочу записаться в Prime Time: ' + (names || 'консультация') + '. Примерный расчёт на сайте: от ' + fmt(total) + ' руб.' + (first.checked ? ' Я у вас впервые.' : ''));
  };
  form.addEventListener('change', calc);
  calc();

  /* Появление при прокрутке и счётчики */
  const counters = (root) => root.querySelectorAll('[data-count]').forEach((el) => {
    if (el.dataset.done) return; el.dataset.done = 1;
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    if (reduce) { el.textContent = to.toFixed(dec); return; }
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 1200);
      el.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    counters(e.target);
    io.unobserve(e.target);
  }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }) : null;
  document.querySelectorAll('.cards, .team__grid, .gal, .quotes').forEach((g) => {
    g.querySelectorAll('.reveal').forEach((el, i) => el.style.setProperty('--d', (i % 4) * 0.08 + 's'));
  });
  document.querySelectorAll('.reveal').forEach((el) => io ? io.observe(el) : (el.classList.add('is-in'), counters(el)));

  /* Липкая кнопка записи на мобильном */
  const dock = document.querySelector('.dock');
  const hero = document.getElementById('board');
  const contacts = document.getElementById('contacts');
  const onScroll = () => {
    const past = hero.getBoundingClientRect().bottom < 0;
    const atContacts = contacts.getBoundingClientRect().top < window.innerHeight * 0.6;
    dock.classList.toggle('is-on', past && !atContacts);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
