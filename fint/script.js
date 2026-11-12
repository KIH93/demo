(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // шапка
  const top = document.getElementById('top');
  const onScroll = () => top.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // бургер
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  // раундовый таймер: 3 минуты работы, 1 минута отдыха, ускорен в 6 раз
  const tEl = document.getElementById('roundTime');
  const nEl = document.getElementById('roundNo');
  const bar = document.getElementById('roundBar');
  const timer = tEl.closest('.timer');
  let round = 1, rest = false, left = 180;
  const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  const draw = () => {
    tEl.textContent = fmt(left);
    nEl.textContent = rest ? 'отдых' : String(round).padStart(2, '0');
    timer.classList.toggle('is-rest', rest);
    bar.style.transform = `scaleX(${left / (rest ? 60 : 180)})`;
  };
  draw();
  if (!reduce) {
    setInterval(() => {
      left--;
      if (left < 0) {
        if (rest) { rest = false; round = round % 12 + 1; left = 180; }
        else { rest = true; left = 60; }
      }
      draw();
    }, 1000 / 6);
  }

  // параллакс первого экрана
  const hero = document.getElementById('hero');
  const word = hero.querySelector('.hero__word');
  const ropes = hero.querySelector('.hero__ropes');
  const arena = hero.querySelector('.hero__arena');
  if (!reduce) {
    let mx = 0, my = 0, sy = 0, raf = null;
    const apply = () => {
      raf = null;
      word.style.transform = `translate(${mx * -14}px, ${my * -8 + sy * .25}px)`;
      ropes.style.transform = `translate(${mx * 10}px, ${my * 6 + sy * -.08}px)`;
      arena.style.transform = `scale(1.04) translate(${mx * -6}px, ${sy * .35}px)`;
    };
    const req = () => { if (!raf) raf = requestAnimationFrame(apply); };
    hero.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - .5;
      my = (e.clientY - r.top) / r.height - .5;
      req();
    });
    window.addEventListener('scroll', () => {
      sy = Math.min(window.scrollY, window.innerHeight);
      req();
    }, { passive: true });
  }

  // счётчики
  const runCount = el => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.dec || '0', 10);
    if (reduce) { el.textContent = target.toFixed(dec).replace('.', ','); return; }
    const t0 = performance.now(), dur = 1400;
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const v = target * (1 - Math.pow(1 - p, 3));
      el.textContent = v.toFixed(dec).replace('.', ',');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // появление при прокрутке
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      if (el.dataset.count) runCount(el);
      else {
        el.classList.add('is-in');
        el.querySelectorAll('[data-count]').forEach(runCount);
      }
      io.unobserve(el);
    });
  }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
  document.querySelectorAll('[data-count]').forEach(el => { if (!el.closest('.reveal')) io.observe(el); });

  // вкладки направлений
  const tabs = document.querySelectorAll('.tabs [role="tab"]');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.setAttribute('aria-selected', x === t));
    document.querySelectorAll('.dirs').forEach(p => {
      const on = p.dataset.panel === t.dataset.tab;
      p.hidden = !on;
      if (on) p.querySelectorAll('.reveal').forEach(r => r.classList.add('is-in'));
    });
  }));

  // расписание (пример по материалам клуба)
  // c: adult, kids, girls, yoga; k: цвет полосы
  const S = [
    // утро
    ['пн', '09:00', 'Йога', 'Гульнара', 'adult yoga girls'],
    ['ср', '09:00', 'Йога', 'Гульнара', 'adult yoga girls'],
    ['пн', '10:30', 'Йога для беременных', 'Гульнара', 'yoga girls'],
    ['ср', '10:30', 'Йога для беременных', 'Гульнара', 'yoga girls'],
    ['вт', '10:00', 'Body Fitness', 'Яна', 'adult girls'],
    ['чт', '10:00', 'Body Fitness', 'Яна', 'adult girls'],
    ['ср', '10:00', 'Детская гимнастика', 'Людмила', 'kids'],
    ['чт', '10:00', 'Детская гимнастика', 'Людмила', 'kids'],
    ['пт', '09:00', 'Pilates Mat', 'Яна', 'adult girls'],
    // вечер пн-пт
    ...['пн', 'вт', 'ср', 'чт', 'пт'].flatMap(d => [
      [d, '16:00', 'Бокс', 'Рустам', 'adult box'],
      [d, '17:00', 'Детский бокс', 'Азамат', 'kids box'],
      [d, '18:00', 'Детский бокс', 'Азамат', 'kids box'],
      [d, '19:30', 'Кикбоксинг', 'Азамат', 'adult box'],
      [d, '19:15', 'Йога', 'Гульнара', 'adult yoga girls'],
    ]),
    ...['пн', 'ср', 'пт'].flatMap(d => [
      [d, '18:00', 'Детская гимнастика 4-10 лет', 'Людмила', 'kids'],
      [d, '19:00', 'Бокс', 'Рустам', 'adult box'],
      [d, '20:00', 'Растяжка с подкачкой', 'Людмила', 'adult girls'],
    ]),
    ...['вт', 'чт'].flatMap(d => [
      [d, '17:00', 'Детская йога', 'Гульнара', 'kids yoga'],
      [d, '17:30', 'Детский кикбоксинг', 'Азамат', 'kids box'],
      [d, '19:00', 'Женский бокс', 'Ранис', 'girls box'],
      [d, '19:00', 'Здоровая спина + ЛФК', 'Людмила', 'kids'],
      [d, '20:00', 'Body Fitness', 'Яна', 'adult girls'],
    ]),
    // суббота
    ['сб', '10:00', 'Бокс', 'Рустам', 'adult box'],
    ['сб', '11:00', 'Йога с суставной гимнастикой', 'Гульнара', 'adult yoga girls'],
    ['сб', '12:00', 'Женский бокс', 'Ранис', 'girls box'],
    ['сб', '13:30', 'Бокс', 'Ранис', 'adult box'],
  ];
  const days = [['пн', 'Пн'], ['вт', 'Вт'], ['ср', 'Ср'], ['чт', 'Чт'], ['пт', 'Пт'], ['сб', 'Сб']];
  const week = document.getElementById('week');
  week.innerHTML = days.map(([k, label]) => {
    const items = S.filter(s => s[0] === k).sort((a, b) => a[1].localeCompare(b[1]));
    return `<div class="day"><p class="day__name">${label}</p><div class="day__list">${
      items.map(s => `<div class="slot${s[4].includes('box') ? ' is-red' : ''}${s[4].split(' ')[0] === 'kids' ? ' is-kids' : ''}" data-c="${s[4]}"><b>${s[1]}</b><span>${s[2]}</span><small>${s[3]}</small></div>`).join('')
    }</div></div>`;
  }).join('');
  const chips = document.querySelectorAll('.chip');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.toggle('is-on', x === c));
    const f = c.dataset.f;
    week.classList.remove('is-filtered'); void week.offsetWidth; week.classList.toggle('is-filtered', f !== 'all');
    week.querySelectorAll('.slot').forEach(s => {
      s.classList.toggle('is-off', f !== 'all' && !s.dataset.c.split(' ').includes(f));
    });
  }));

  // форма (демо, без отправки)
  const form = document.getElementById('form');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    ['name', 'phone'].forEach(n => {
      const i = form.elements[n];
      const bad = n === 'phone' ? i.value.replace(/\D/g, '').length < 10 : !i.value.trim();
      i.classList.toggle('is-bad', bad);
      if (bad) ok = false;
    });
    if (!ok) { note.textContent = 'Заполните имя и телефон.'; note.classList.remove('is-ok'); return; }
    note.textContent = 'Готово! На демо заявка не отправляется, в рабочей версии она придёт администратору.';
    note.classList.add('is-ok');
    form.reset();
  });
})();
