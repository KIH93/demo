(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* первый экран по очереди */
  $$('[data-h]').forEach(el => el.style.setProperty('--i', el.dataset.h));
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add('is-ready'), 60));

  /* шапка и липкая кнопка */
  const top = $('#top');
  const sticky = $('#sticky');
  const book = $('#zapis');
  const onScroll = () => {
    const y = window.scrollY;
    top.classList.toggle('is-stuck', y > 8);
    const bookTop = book.getBoundingClientRect().top;
    sticky.classList.toggle('show', y > 520 && bookTop > window.innerHeight * .6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* часы на табло, время Казани */
  const clock = $('#clock');
  const kazanNow = () => {
    const p = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const h = +p.find(x => x.type === 'hour').value;
    const m = +p.find(x => x.type === 'minute').value;
    return { h, m };
  };
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const { h, m } = kazanNow();
    clock.innerHTML = `${pad(h)}<span class="colon">:</span>${pad(m)}`;
  };
  tick();
  setInterval(tick, 15000);

  /* табло с перекидными буквами (окна условные) */
  const DIRS = [
    ['Терапия', 'кариес и пломбы', 'свободно'],
    ['Гигиена', 'чистка и камень', 'свободно'],
    ['Хирургия', 'удаление зуба', '1 место'],
    ['Детям', 'первый визит', 'свободно'],
    ['Имплантация', 'консультация', 'свободно'],
    ['Ортодонтия', 'брекеты', '1 место'],
    ['Ортопедия', 'коронки', 'свободно'],
    ['Терапия', 'лечение каналов', 'свободно'],
    ['Эстетика', 'отбеливание', '1 место'],
    ['Рентген', 'снимок на месте', 'свободно']
  ];
  const SLOTS = (() => {
    let { h, m } = kazanNow();
    let t = h * 60 + m + 40;
    t = Math.ceil(t / 30) * 30;
    if (t < 9 * 60 || t > 19 * 60) t = 9 * 60;
    const out = [];
    for (let i = 0; i < 24; i++) {
      out.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`);
      t += 30;
      if (t > 19 * 60) t = 9 * 60;
    }
    return out;
  })();
  const CHARS = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ0123456789';
  const ROWS = window.innerWidth < 760 ? 4 : 5;
  const list = $('#boardRows');

  const makeCells = (wrap, text) => {
    wrap.textContent = '';
    [...text].forEach(ch => {
      const c = document.createElement('span');
      c.className = ch === ' ' ? 'cell cell--sp' : 'cell';
      c.textContent = ch === ' ' ? '' : ch;
      wrap.appendChild(c);
    });
  };

  const flapTo = (wrap, text) => {
    if (reduce) { makeCells(wrap, text); return; }
    const target = [...text.toUpperCase()];
    let cells = [...wrap.children];
    while (cells.length < target.length) {
      const c = document.createElement('span');
      c.className = 'cell';
      wrap.appendChild(c);
      cells.push(c);
    }
    cells.forEach((c, i) => {
      const goal = target[i];
      if (goal === undefined) { c.remove(); return; }
      if (goal === ' ') { c.className = 'cell cell--sp'; c.textContent = ''; return; }
      c.className = 'cell';
      if (c.textContent === goal) return;
      let n = 3 + Math.floor(Math.random() * 5) + Math.floor(i / 3);
      const step = () => {
        c.classList.remove('flip');
        void c.offsetWidth;
        c.classList.add('flip');
        c.textContent = n <= 0 ? goal : CHARS[Math.floor(Math.random() * CHARS.length)];
        if (n-- > 0) setTimeout(step, 55);
      };
      setTimeout(step, i * 18);
    });
  };

  let dirIdx = 0;
  let slotIdx = 0;
  const nextData = () => {
    const d = DIRS[dirIdx++ % DIRS.length];
    return [d[0], d[1], SLOTS[slotIdx++ % SLOTS.length], d[2]];
  };
  const rows = [];
  for (let r = 0; r < ROWS; r++) {
    const li = document.createElement('li');
    li.className = 'board__row';
    const cols = [0, 1, 2, 3].map(() => {
      const w = document.createElement('span');
      w.className = 'cells';
      li.appendChild(w);
      return w;
    });
    list.appendChild(li);
    rows.push({ li, cols });
  }
  const fill = (row, data) => {
    data.forEach((t, i) => flapTo(row.cols[i], t));
    row.cols[3].className = 'cells ' + (data[3] === 'свободно' ? 'st--ok' : 'st--few');
  };
  const sr = document.createElement('p');
  sr.className = 'sr';
  list.after(sr);
  const describe = () => {
    sr.textContent = 'Пример: ' + rows.map(r => r.cols.map(c => [...c.children].map(x => x.textContent || ' ').join('')).join(', ')).join('; ');
  };

  rows.forEach((row, i) => setTimeout(() => fill(row, nextData()), reduce ? 0 : 700 + i * 220));
  setTimeout(describe, 3000);

  if (!reduce) {
    let which = 0;
    setInterval(() => {
      if (document.hidden) return;
      fill(rows[which % ROWS], nextData());
      which++;
    }, 2800);
  }

  /* счётчики */
  const countUp = el => {
    const end = parseFloat(el.dataset.count);
    const dec = +(el.dataset.dec || 0);
    const fmt = v => v.toFixed(dec).replace('.', ',');
    if (reduce) { el.textContent = fmt(end); return; }
    const t0 = performance.now();
    const dur = 1400;
    const frame = now => {
      const k = Math.min(1, (now - t0) / dur);
      el.textContent = fmt(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  /* появление при прокрутке */
  const groups = new Map();
  $$('.reveal').forEach(el => {
    const p = el.parentElement;
    const n = groups.get(p) || 0;
    el.style.setProperty('--d', n);
    groups.set(p, n + 1);
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(el => io.observe(el));

    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        countUp(e.target);
        cio.unobserve(e.target);
      });
    }, { threshold: .6 });
    $$('[data-count]').forEach(el => cio.observe(el));

    const steps = $('#steps');
    const sio = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { steps.classList.add('is-on'); sio.disconnect(); }
    }, { threshold: .4 });
    sio.observe(steps);
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }

  /* вкладки прайса */
  const tabs = $$('.tabs [role="tab"]');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
    $$('[data-panel]').forEach(p => {
      const on = p.dataset.panel === tab.dataset.tab;
      p.hidden = !on;
      if (on) $$('li', p).forEach((li, i) => li.style.setProperty('--n', i));
    });
  }));

  /* рассрочка (пример) */
  const months = $('#months');
  const perMonth = $('#perMonth');
  const calc = () => {
    perMonth.textContent = Math.ceil(35000 / +months.value).toLocaleString('ru-RU');
  };
  months.addEventListener('change', calc);
  calc();

  /* сертификат */
  const giftSum = $('#giftSum');
  $$('.gift__opts button').forEach(b => b.addEventListener('click', () => {
    $$('.gift__opts button').forEach(x => x.classList.toggle('on', x === b));
    giftSum.textContent = (+b.dataset.sum).toLocaleString('ru-RU');
    giftSum.classList.remove('bump');
    void giftSum.offsetWidth;
    giftSum.classList.add('bump');
  }));

  /* услуга из карточки попадает в форму */
  const service = $('#service');
  $$('[data-service]').forEach(a => a.addEventListener('click', () => {
    const v = a.dataset.service;
    const opt = [...service.options].find(o => o.text === v);
    if (opt) service.value = opt.text;
  }));

  /* форма: на демо без отправки */
  const form = $('#form');
  const msg = $('#formMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.elements.name;
    const phone = form.elements.phone;
    const agree = form.elements.agree;
    const digits = phone.value.replace(/\D/g, '');
    name.classList.toggle('is-bad', !name.value.trim());
    phone.classList.toggle('is-bad', digits.length < 10);
    if (!name.value.trim() || digits.length < 10 || !agree.checked) {
      msg.className = 'form__msg err';
      msg.textContent = !agree.checked && name.value.trim() && digits.length >= 10
        ? 'Отметьте согласие на обработку данных.'
        : 'Проверьте имя и телефон.';
      return;
    }
    msg.className = 'form__msg ok';
    msg.textContent = 'Спасибо! Это демо, заявка никуда не отправлена. На рабочем сайте она придёт администратору в WhatsApp или на почту.';
    form.reset();
  });
})();
