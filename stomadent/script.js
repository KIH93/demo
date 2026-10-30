(() => {
  document.documentElement.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fmt = n => n.toLocaleString('ru-RU').replace(/ /g, ' ');

  /* шапка и мобильная панель */
  const head = $('#head');
  const dock = $('.dock');
  const hero = $('.hero');
  const onScroll = () => {
    head.classList.toggle('is-scrolled', scrollY > 10);
    dock.classList.toggle('show', scrollY > hero.offsetHeight * .5);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    nav.classList.toggle('open', open);
  });
  $$('a', nav).forEach(a => a.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }));

  /* ценники висят на верёвке: путь M0 12 Q 720 132 1440 12, y(u) = 12 + 240u(1-u) */
  const garland = $('.garland'), rope = $('.garland__rope');
  const hang = () => {
    const g = garland.getBoundingClientRect(), k = rope.getBoundingClientRect().height / 120;
    $$('.tag-p', garland).forEach(t => {
      t.style.setProperty('--y', '0px');
      const r = t.getBoundingClientRect();
      const u = (r.left + r.width / 2 - g.left) / g.width;
      t.style.setProperty('--y', ((12 + 240 * u * (1 - u)) * k).toFixed(1) + 'px');
    });
  };
  hang();
  addEventListener('resize', hang);

  /* счётчики */
  const count = el => {
    if (el.dataset.done) return;
    el.dataset.done = 1;
    const to = parseFloat(el.dataset.count);
    const dec = +(el.dataset.dec || 0);
    const from = el.dataset.from ? +el.dataset.from : el.dataset.plain !== undefined ? to - 14 : 0;
    const show = v => {
      if (dec) el.textContent = v.toFixed(dec).replace('.', ',');
      else el.textContent = el.dataset.sp !== undefined ? fmt(Math.round(v)) : String(Math.round(v));
    };
    if (reduce) return show(to);
    const t0 = performance.now(), dur = 1400;
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur);
      show(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  // в первом экране счётчики запускаем после появления
  setTimeout(() => $$('.facts [data-count]').forEach(count), 900);

  /* появление при прокрутке */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      $$('[data-count]', en.target).forEach(count);
      io.unobserve(en.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -60px 0px' }) : null;
  const observe = root => $$('.reveal', root).forEach((el, i) => {
    if (el.parentElement.children.length > 1) el.style.setProperty('--i', [...el.parentElement.children].indexOf(el) % 4);
    io ? io.observe(el) : el.classList.add('in');
  });
  observe(document);

  /* прайс */
  const PRICE = [
    ['Терапия', 'Лечение кариеса эмали', 3250],
    ['Терапия', 'Лечение пульпита, 1 канал', 2200],
    ['Терапия', 'Лечение периодонтита, 1 канал', 2400],
    ['Терапия', 'Восстановление зуба после эндодонтии', 4350],
    ['Терапия', 'Художественная реставрация', 4650],
    ['Терапия', 'Обезболивание (анестезия)', 750],
    ['Терапия', 'Изоляция коффердамом', 450],
    ['Терапия', 'Прицельный снимок', 500],
    ['Хирургия', 'Простое удаление зуба', 1950],
    ['Хирургия', 'Сложное удаление зуба', 2500],
    ['Хирургия', 'Удаление зуба мудрости', 6950],
    ['Хирургия', 'Иссечение капюшона', 1100],
    ['Хирургия', 'Френулопластика (уздечка)', 2500],
    ['Хирургия', 'Вестибулопластика', 5500],
    ['Хирургия', 'Гингивопластика', 8500],
    ['Ортопедия', 'Металлокерамическая коронка', 11000],
    ['Ортопедия', 'Безметалловая керамика', 17500],
    ['Ортопедия', 'Винир', 27000],
    ['Ортопедия', 'Вкладка', 27000],
    ['Ортопедия', 'Коронка на имплант (цирконий)', 31500],
    ['Ортопедия', 'Частичный съёмный акриловый протез', 14500],
    ['Ортопедия', 'Полный съёмный протез', 16500],
    ['Ортопедия', 'Бюгельный протез', 52000],
    ['Эстетика', 'Профессиональное отбеливание', 35000],
    ['Эстетика', 'Домашнее отбеливание', 7000],
    ['Ортодонтия', 'Металлические брекеты, 1 челюсть', 70000],
    ['Ортодонтия', 'Керамические брекеты, 1 челюсть', 90000],
    ['Ортодонтия', 'Трейнер', 15000],
    ['Ортодонтия', 'Элайнеры', 150000, 'от'],
    ['Имплантология', 'Имплант (Корея)', 25000],
    ['Имплантология', 'Формирователь десны', 2000],
    ['Имплантология', 'Закрытый синус-лифтинг', 20500],
    ['Имплантология', 'Открытый синус-лифтинг', 60000],
    ['Имплантология', 'Костная пластика', 35500],
    ['Профилактика', 'Профгигиена без фторирования', 4600],
    ['Профилактика', 'Профгигиена с фторированием', 5600],
    ['Профилактика', 'Air Flow, 1 челюсть', 1000],
    ['Профилактика', 'Ультразвуковая чистка, 1 челюсть', 1000],
    ['Профилактика', 'Герметизация фиссуры', 2500],
    ['Пародонтология', 'Аппликация лекарственного препарата', 200, 'пример'],
    ['Пародонтология', 'Кюретаж закрытый, 1 зуб', 1500, 'пример'],
    ['Пародонтология', 'Шинирование зубов', 8500, 'пример'],
    ['Неотложная помощь', 'Консультация врача', 0],
    ['Неотложная помощь', 'Вскрытие абсцесса', 1500, 'пример'],
    ['Неотложная помощь', 'Временная пломба при острой боли', 1200, 'пример'],
  ];
  const CATS = ['Все', ...new Set(PRICE.map(p => p[0]))];
  let cat = 'Все', q = '', all = false;
  const plList = $('#plList'), plCats = $('#plCats'), plQ = $('#plQ'), plCount = $('#plCount');
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const word = n => n % 10 === 1 && n % 100 !== 11 ? 'услуга' : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'услуги' : 'услуг');

  plCats.innerHTML = CATS.map(c => `<button type="button" class="chip" aria-pressed="${c === cat}">${c}</button>`).join('');
  const setCat = c => {
    cat = c;
    $$('.chip', plCats).forEach(b => b.setAttribute('aria-pressed', b.textContent === c));
    renderPrice();
  };
  plCats.addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) setCat(b.textContent); });

  function renderPrice() {
    const nq = q.trim().toLowerCase();
    const rows = PRICE.filter(p => (cat === 'Все' || p[0] === cat) && (!nq || (p[1] + ' ' + p[0]).toLowerCase().includes(nq)));
    plCount.textContent = `${rows.length} ${word(rows.length)}`;
    if (!rows.length) { plList.innerHTML = '<li class="pl__empty">Ничего не нашли. Попробуйте другое слово или спросите администратора.</li>'; return; }
    const cut = !all && !nq && cat === 'Все' && rows.length > 12;
    plList.innerHTML = (cut ? rows.slice(0, 12) : rows).map(([c, name, price, note], i) => {
      let n = esc(name);
      if (nq) n = n.replace(new RegExp(nq.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), m => `<mark>${m}</mark>`);
      const p = price === 0 ? 'бесплатно' : `${note === 'от' ? 'от ' : ''}${fmt(price)} руб.`;
      const tag = note === 'пример' ? ' <span class="tag">пример</span>' : '';
      return `<li style="animation-delay:${Math.min(i, 12) * 25}ms"><span>${n}${tag}</span><b>${p}</b><small>${c}</small></li>`;
    }).join('') + (cut ? `<li class="pl__more"><button type="button" class="btn btn--ghost btn--sm" id="plMore">Показать все ${rows.length} ${word(rows.length)}</button></li>` : '');
  }
  plList.addEventListener('click', e => { if (e.target.closest('#plMore')) { all = true; renderPrice(); } });
  plQ.addEventListener('input', () => { q = plQ.value; renderPrice(); });
  renderPrice();

  // карточки услуг открывают прайс с нужным направлением
  $$('.srv__c').forEach(c => c.addEventListener('click', () => { q = ''; plQ.value = ''; setCat(c.dataset.cat); }));

  /* подбор по ситуации */
  const SIT = [
    { k: 'Болит зуб', i: '⚡', h: 'Острая боль или чувствительность', p: 'Чаще всего это глубокий кариес или пульпит. Врач сделает снимок, снимет боль и предложит план лечения с ценой.', s: [['Консультация и осмотр', 'бесплатно'], ['Прицельный снимок', '500 руб.'], ['Анестезия', '750 руб.'], ['Лечение пульпита, 1 канал', 'от 2 200 руб.']], svc: 'Лечение зуба' },
    { k: 'Нет зуба', i: '◌', h: 'Восстановить отсутствующий зуб', p: 'Подойдёт имплант с коронкой, мостовидный протез или съёмная конструкция. На консультации сравним варианты по срокам и цене.', s: [['Консультация, план лечения', 'бесплатно'], ['Имплант (Корея)', '25 000 руб.'], ['Формирователь десны', '2 000 руб.'], ['Коронка на имплант (цирконий)', '31 500 руб.']], svc: 'Имплантация' },
    { k: 'Брекеты', i: '≋', h: 'Выровнять зубы', p: 'Ортодонт высшей категории, к. м. н., оценит прикус и подберёт систему: металлические или керамические брекеты, элайнеры или трейнер.', s: [['Консультация ортодонта', 'бесплатно'], ['Трейнер', '15 000 руб.'], ['Металлические брекеты, 1 челюсть', '70 000 руб.'], ['Элайнеры', 'от 150 000 руб.']], svc: 'Брекеты или элайнеры' },
    { k: 'Чистка', i: '✦', h: 'Профессиональная гигиена', p: 'Убираем камень и налёт, полируем и при желании покрываем фтором. Рекомендуем раз в полгода, это условие сохранения гарантии.', s: [['Ультразвук, 1 челюсть', '1 000 руб.'], ['Air Flow, 1 челюсть', '1 000 руб.'], ['Комплекс по акции, по средам', '4 600 руб.'], ['Комплекс с фторированием', '5 600 руб.']], svc: 'Профгигиена (акция)' },
    { k: 'Отбеливание', i: '☀', h: 'Сделать улыбку светлее', p: 'Перед отбеливанием нужна профгигиена. Врач оценит эмаль и подскажет, какой способ подойдёт: в кресле или домашний с каппами.', s: [['Профгигиена перед отбеливанием', '4 600 руб.'], ['Домашнее отбеливание', '7 000 руб.'], ['Профессиональное отбеливание', '35 000 руб.']], svc: 'Отбеливание' },
  ];
  const tabs = $('#sitTabs'), panel = $('#sitPanel');
  tabs.innerHTML = SIT.map((s, n) => `<button class="sit__tab" role="tab" type="button" id="sit-${n}" aria-selected="${n === 0}" aria-controls="sitPanel"><i aria-hidden="true">${s.i}</i>${s.k}</button>`).join('');
  const showSit = n => {
    const s = SIT[n];
    $$('.sit__tab', tabs).forEach((b, j) => b.setAttribute('aria-selected', j === n));
    panel.setAttribute('aria-labelledby', `sit-${n}`);
    panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
    panel.innerHTML = `<h3>${s.h}</h3><p>${s.p}</p>
      <ol class="steps">${s.s.map((r, j) => `<li><span>${j + 1}</span><span>${r[0]}</span><b>${r[1]}</b></li>`).join('')}</ol>
      <a class="btn" href="#zapis" data-service="${s.svc}">Записаться на консультацию<svg><use href="#i-arrow"/></svg></a>`;
  };
  tabs.addEventListener('click', e => { const b = e.target.closest('.sit__tab'); if (b) showSit($$('.sit__tab', tabs).indexOf(b)); });
  tabs.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    const all = $$('.sit__tab', tabs), cur = all.indexOf(document.activeElement);
    const nx = (cur + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + all.length) % all.length;
    all[nx].focus(); showSit(nx);
  });
  showSit(0);

  /* кнопки с выбором направления в форме */
  const sel = $('#bookService');
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-service]');
    if (!a) return;
    const opt = [...sel.options].find(o => o.text === a.dataset.service);
    if (opt) sel.value = opt.value;
  });

  /* форма записи (демо) */
  const form = $('#bookForm'), err = $('#formErr');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim(), phone = form.phone.value.replace(/\D/g, '');
    if (!name) return (err.textContent = 'Укажите, как к вам обращаться.', form.name.focus());
    if (phone.length < 10) return (err.textContent = 'Проверьте номер телефона.', form.phone.focus());
    if (!form.agree.checked) return (err.textContent = 'Нужно согласие на обработку данных.');
    err.textContent = '';
    $('.form__body', form).hidden = true;
    $('#formOk').hidden = false;
  });
})();
