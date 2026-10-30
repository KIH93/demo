(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // Прайс по данным Dikidi (часть из 83 услуг)
  const CATS = [
    { id: 'all', name: 'Все' },
    { id: 'cons', name: 'Консультации' },
    { id: 'ter', name: 'Терапия' },
    { id: 'endo', name: 'Каналы' },
    { id: 'hyg', name: 'Гигиена' },
    { id: 'sur', name: 'Хирургия' },
    { id: 'ort', name: 'Ортопедия' },
    { id: 'an', name: 'Анестезия' }
  ];
  const P = [
    ['cons', 'Плановый осмотр', 0, 'осмотр'],
    ['cons', 'Первичная консультация', 500, 'консультация', true],
    ['cons', 'План лечения с расшифровкой снимка', 700, 'снимок рентген'],
    ['ter', 'Лечение начального кариеса', 3500, 'кариес пломба вылечить зуб'],
    ['ter', 'Лечение среднего кариеса', 4000, 'кариес пломба вылечить зуб'],
    ['ter', 'Лечение глубокого кариеса', 4500, 'кариес пломба вылечить зуб'],
    ['ter', 'Лечение пульпита', 5500, 'пульпит нерв вылечить зуб'],
    ['ter', 'Лечение периодонтита', 8500, 'периодонтит вылечить зуб'],
    ['ter', 'Художественная реставрация', 5500, 'реставрация эстетика', true],
    ['ter', 'Восстановление зуба на штифте', 5800, 'штифт'],
    ['ter', 'Замена пломбы', 3500, 'пломба'],
    ['ter', 'Закрытие клиновидного дефекта', 4300, 'клиновидный дефект'],
    ['endo', 'Пульпит, 1 канал', 5500, 'пульпит каналы', true],
    ['endo', 'Пульпит, 2 канала', 7000, 'пульпит каналы', true],
    ['endo', 'Пульпит, 3 канала', 8500, 'пульпит каналы', true],
    ['endo', 'Пульпит, 4 канала', 10000, 'пульпит каналы', true],
    ['endo', 'Периодонтит, 1 канал', 8500, 'периодонтит каналы'],
    ['endo', 'Периодонтит, 2 канала', 10000, 'периодонтит каналы'],
    ['endo', 'Периодонтит, 3 канала', 11500, 'периодонтит каналы'],
    ['endo', 'Периодонтит, 4 канала', 13000, 'периодонтит каналы'],
    ['hyg', 'Чистка Air Flow', 2500, 'чистка гигиена налёт'],
    ['hyg', 'Ультразвуковая чистка', 2750, 'чистка гигиена камень'],
    ['hyg', 'УЗ-чистка с полировкой', 3000, 'чистка гигиена полировка'],
    ['hyg', 'Профессиональная гигиена полости рта', 4000, 'чистка гигиена комплекс'],
    ['hyg', 'Глубокое фторирование', 2500, 'фтор эмаль'],
    ['hyg', 'Скайс (украшение на зуб)', 1650, 'скайс страз'],
    ['sur', 'Простое удаление зуба', 2500, 'удаление удалить зуб'],
    ['sur', 'Иссечение капюшона', 1800, 'капюшон зуб мудрости'],
    ['ort', 'Коронка металлокерамическая', 14000, 'коронка'],
    ['ort', 'Коронка цельнолитая', 8000, 'коронка'],
    ['ort', 'Коронка штампованная', 7700, 'коронка'],
    ['ort', 'Коронка из диоксида циркония', 26000, 'коронка цирконий'],
    ['ort', 'Пресскерамика E.max', 26000, 'коронка вкладка керамика'],
    ['ort', 'Полный съёмный протез из акрила', 25000, 'протез съёмный'],
    ['ort', 'Бюгельный протез на кламмерах', 30000, 'протез бюгельный', true],
    ['ort', 'Бюгельный протез на замках', 32000, 'протез бюгельный', true],
    ['ort', 'Ацеталовый протез', 43800, 'протез ацеталовый'],
    ['ort', 'Индивидуальная капа', 8700, 'капа'],
    ['an', 'Аппликационная анестезия', 500, 'обезболивание анестезия'],
    ['an', 'Артикаин с адреналином', 750, 'обезболивание анестезия'],
    ['an', 'Анестезия без адреналина', 1000, 'обезболивание анестезия']
  ].map(([cat, name, price, kw, from]) => ({ cat, name, price, kw, from }));

  const priceTxt = p => p.price === 0 ? 'бесплатно' : (p.from ? 'от ' : '') + fmt(p.price) + ' руб.';
  const norm = s => s.toLowerCase().replace(/ё/g, 'е').trim();
  const match = (p, q) => { q = norm(q); return !q || norm(p.name + ' ' + p.kw).includes(q); };

  /* ---------- Гранёный фон первого экрана ---------- */
  const fac = document.getElementById('facets');
  if (fac) {
    const W = 1440, H = 760, cols = 12, rows = 6, cw = W / cols, rh = H / rows;
    const pts = [];
    let seed = 7;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    for (let r = 0; r <= rows; r++) {
      pts[r] = [];
      for (let c = 0; c <= cols; c++) {
        const edge = r === 0 || r === rows || c === 0 || c === cols;
        pts[r][c] = [c * cw + (edge ? 0 : (rnd() - .5) * cw * .7), r * rh + (edge ? 0 : (rnd() - .5) * rh * .7)];
      }
    }
    let html = '';
    const tri = (a, b, c, i) => {
      const x = (a[0] + b[0] + c[0]) / 3, y = (a[1] + b[1] + c[1]) / 3;
      // ярче к правому краю и вниз, у текста почти прозрачно
      const w = Math.min(1, Math.max(0, (x / W - .35) * 1.4 + (y / H) * .25));
      const l = 96 - w * 14 - rnd() * 5;
      html += `<polygon points="${a} ${b} ${c}" fill="hsl(${214 + rnd() * 10} ${70 + w * 20}% ${l}%)" style="--i:${i % 17}"/>`;
    };
    let i = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const a = pts[r][c], b = pts[r][c + 1], d = pts[r + 1][c], e = pts[r + 1][c + 1];
      if ((r + c) % 2) { tri(a, b, e, i++); tri(a, e, d, i++); } else { tri(a, b, d, i++); tri(b, e, d, i++); }
    }
    fac.innerHTML = html;
  }

  /* ---------- Бегущие ленты ценников ---------- */
  const tapeItems = P.filter(p => p.price > 0);
  const fill = (el, list) => {
    if (!el) return;
    const one = list.map(p => `<span class="pt"><i></i>${p.name}<b>${priceTxt(p)}</b></span>`).join('');
    el.innerHTML = one + one;
  };
  fill(document.getElementById('tapeA'), tapeItems.filter((_, i) => i % 2 === 0));
  fill(document.getElementById('tapeB'), tapeItems.filter((_, i) => i % 2 === 1));

  /* ---------- Меняющееся слово в заголовке ---------- */
  const word = document.getElementById('heroWord');
  if (word && !reduce) {
    const words = ['вылечить зуб', 'чистка', 'коронка', 'вылечить канал', 'протез'];
    let k = 0;
    setInterval(() => {
      word.classList.add('out');
      setTimeout(() => {
        k = (k + 1) % words.length;
        word.textContent = words[k];
        word.classList.remove('out');
      }, 320);
    }, 3200);
  }

  /* ---------- Поиск на первом экране ---------- */
  const hs = document.getElementById('heroSearch');
  const hr = document.getElementById('heroRes');
  const renderHero = () => {
    const q = hs.value;
    if (!q.trim()) { hr.innerHTML = ''; hr.classList.remove('on'); return; }
    const res = P.filter(p => match(p, q)).slice(0, 4);
    hr.classList.add('on');
    hr.innerHTML = res.length
      ? res.map((p, i) => `<li style="--r:${i}"><span>${p.name}</span><i></i><b>${priceTxt(p)}</b></li>`).join('') +
        `<li class="finder__all"><a href="#ceny" data-goto="${q.replace(/"/g, '')}">Смотреть все в прайсе</a></li>`
      : '<li class="finder__none">Не нашли такую услугу. Напишите нам, подскажем.</li>';
  };
  if (hs) {
    hs.addEventListener('input', renderHero);
    document.querySelectorAll('.finder__chips button').forEach(b => b.addEventListener('click', () => {
      hs.value = b.dataset.q; renderHero(); hs.focus();
    }));
    hr.addEventListener('click', e => {
      const a = e.target.closest('[data-goto]');
      if (a) { ps.value = a.dataset.goto; setCat('all'); renderPrice(); }
    });
  }

  /* ---------- Полный прайс ---------- */
  const tabs = document.getElementById('priceTabs');
  const list = document.getElementById('priceList');
  const ps = document.getElementById('priceSearch');
  const empty = document.getElementById('priceEmpty');
  let cat = 'all';
  tabs.innerHTML = CATS.map(c => `<button type="button" role="tab" data-c="${c.id}" aria-selected="${c.id === 'all'}">${c.name}</button>`).join('');
  const setCat = c => {
    cat = c;
    tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', b.dataset.c === c));
  };
  const renderPrice = () => {
    const q = ps.value;
    const groups = CATS.filter(c => c.id !== 'all' && (cat === 'all' || cat === c.id));
    let html = '', total = 0, i = 0;
    groups.forEach(g => {
      const items = P.filter(p => p.cat === g.id && match(p, q));
      if (!items.length) return;
      total += items.length;
      html += `<div class="pgroup"><h3>${g.name}</h3><ul>` +
        items.map(p => `<li style="--r:${Math.min(i++, 14)}"><span>${p.name}</span><i></i><b${p.price === 0 ? ' class="free-b"' : ''}>${priceTxt(p)}</b></li>`).join('') +
        '</ul></div>';
    });
    list.innerHTML = html;
    empty.hidden = total > 0;
  };
  tabs.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) { setCat(b.dataset.c); renderPrice(); }
  });
  ps.addEventListener('input', renderPrice);
  renderPrice();

  /* ---------- Меню ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    document.body.classList.toggle('menu-open', open);
  });
  nav.addEventListener('click', e => {
    if (e.target.closest('a')) { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); document.body.classList.remove('menu-open'); }
  });
  const top = document.getElementById('top');
  const onScroll = () => top.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Счётчики ---------- */
  const count = el => {
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), sp = 'sp' in el.dataset;
    const out = v => { const s = v.toFixed(dec).replace('.', ','); el.textContent = sp ? fmt(s) : s; };
    if (reduce || to === 0) return out(to);
    const t0 = performance.now(), dur = 1300;
    const tick = t => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      out(to * e);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ---------- Появление при прокрутке ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll('[data-count]').forEach(count);
      if (en.target.dataset.count) count(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: .18, rootMargin: '0px 0px -40px 0px' }) : null;
  const watch = document.querySelectorAll('.reveal, .finder, #steps');
  if (io && !reduce) watch.forEach(el => io.observe(el));
  else { watch.forEach(el => el.classList.add('in')); document.querySelectorAll('[data-count]').forEach(count); }

  /* ---------- Форма записи ---------- */
  const form = document.getElementById('bookForm');
  const err = document.getElementById('formErr');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name') || '').trim();
    if (!name) { err.hidden = false; form.name.focus(); return; }
    err.hidden = true;
    const time = (fd.get('time') || '').trim();
    const text = `Здравствуйте! Меня зовут ${name}. Хочу записаться: ${fd.get('svc')}.` + (time ? ` Удобное время: ${time}.` : '');
    const to = e.submitter && e.submitter.dataset.to;
    const url = to === 'tg' ? 'https://t.me/+79874190468' : 'https://wa.me/79874190468?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener');
  });
})();
