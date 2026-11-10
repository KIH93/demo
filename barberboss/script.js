(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Запись: пока ведёт в WhatsApp с готовым текстом (на сайте можно подключить YClients)
  const wa = 'https://wa.me/79297232223?text=' + encodeURIComponent('Здравствуйте! Хочу записаться в Barberboss.');
  document.querySelectorAll('.js-book').forEach(a => { a.href = wa; });

  // Вывеска: буквы зажигаются по очереди
  const word = document.querySelector('[data-sign]');
  if (word) {
    [...word.dataset.sign].forEach((ch, i) => {
      const s = document.createElement('span');
      s.textContent = ch;
      s.style.setProperty('--i', i);
      if (i === 6) s.classList.add('flick'); // одна буква иногда "моргает", как у настоящей вывески
      word.appendChild(s);
    });
  }

  // Счётчики
  const runCount = el => {
    const end = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.dec || '0', 10);
    const fmt = v => v.toFixed(dec).replace('.', ',');
    if (reduce) { el.textContent = fmt(end); return; }
    const dur = 1400, t0 = performance.now();
    const step = t => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(end * e);
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = fmt(0);
    requestAnimationFrame(step);
  };

  // Первый экран: цена считается после появления вывески
  const heroPrice = document.querySelector('.price [data-count]');
  if (heroPrice && !reduce) heroPrice.textContent = '0';
  if (heroPrice) setTimeout(() => runCount(heroPrice), reduce ? 0 : 1900);

  // Карта лояльности: штампы ставятся по очереди
  const stampCard = el => {
    el.querySelectorAll('.stamp').forEach((s, i) => {
      setTimeout(() => s.classList.add('is-on'), reduce ? 0 : 350 + i * 550);
    });
  };

  // Появление при прокрутке
  const items = document.querySelectorAll('.reveal');
  const groups = new Map();
  items.forEach(el => {
    const p = el.parentElement;
    const n = groups.get(p) || 0;
    el.style.setProperty('--rd', (n * 0.09) + 's');
    groups.set(p, n + 1);
  });

  const onIn = el => {
    el.classList.add('is-in');
    el.querySelectorAll('[data-count]').forEach(runCount);
    if (el.matches('[data-stamps]')) stampCard(el);
  };

  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { onIn(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(onIn);
  }

  // Табы прайса
  const tabs = [...document.querySelectorAll('.tab')];
  const select = tab => {
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      const p = document.getElementById(t.getAttribute('aria-controls'));
      p.hidden = !on;
      p.classList.toggle('is-on', on);
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      select(n); n.focus();
    });
  });

  // Липкая кнопка записи после первого экрана
  const sticky = document.querySelector('.sticky');
  const hero = document.querySelector('.facade');
  if (sticky && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => sticky.classList.toggle('is-on', !en.isIntersecting), { threshold: 0.05 }).observe(hero);
  } else if (sticky) {
    sticky.classList.add('is-on');
  }
})();
