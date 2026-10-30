/* Дента Плюс: демо. Зубная карта, прайс с поиском, рассрочка, анимации */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var fmt = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };

  /* ---------- версия для слабовидящих ---------- */
  var a11yBtn = document.getElementById('a11yBtn');
  function setA11y(on) {
    root.classList.toggle('a11y', on);
    a11yBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    a11yBtn.querySelector('span').textContent = on ? 'Обычная версия' : 'Версия для слабовидящих';
    try { localStorage.setItem('dp-a11y', on ? '1' : '0'); } catch (e) {}
  }
  try { if (localStorage.getItem('dp-a11y') === '1') setA11y(true); } catch (e) {}
  a11yBtn.addEventListener('click', function () { setA11y(!root.classList.contains('a11y')); });

  /* ---------- шапка и меню ---------- */
  var top = document.getElementById('top');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var dock = document.querySelector('.dock');
  var hero = document.querySelector('.hero');
  function onScroll() {
    top.classList.toggle('is-scrolled', window.scrollY > 10);
    dock.classList.toggle('is-on', window.scrollY > hero.offsetHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- прайс ---------- */
  var PRICE = {
    'Терапия': [
      ['Лечение кариеса', 6500], ['Лечение пульпита, 1 канал', 8500], ['Лечение пульпита, 2 канала', 10500],
      ['Лечение пульпита, 3 канала', 13500], ['Лечение периодонтита', 10500, 19500], ['Штифтовая конструкция', 5500]
    ],
    'Гигиена': [
      ['Комплексная чистка: ультразвук, Air Flow, фторирование', 4300], ['Air Flow', 2400], ['Ультразвуковая чистка', 2400]
    ],
    'Хирургия': [
      ['Удаление зуба', 4000], ['Удаление подвижного зуба', 2000], ['Удаление зуба мудрости', 4000, 10500],
      ['Удаление ретинированного зуба', 7000], ['Резекция верхушки корня', 7000], ['Вскрытие абсцесса', 2500]
    ],
    'Имплантация': [
      ['Имплант Lanmiriot', 16000], ['Имплант Osstem, Dio, Riellens, ST', 21000], ['Имплант Inno, JD, HI-TEC', 29000],
      ['Имплант Straumann, Nobel', 45000], ['Имплант с коронкой под ключ', 36000, 77000], ['Синус-лифтинг закрытый', 15000],
      ['Синус-лифтинг открытый', 30000, 50000], ['Пластика десны', 15000], ['Хирургический шаблон', 10000],
      ['Протезирование "все на 4" и "все на 6"', 85000, 290000]
    ],
    'Ортопедия': [
      ['Металлокерамическая коронка', 12000], ['Циркониевая коронка', 17000], ['Съёмный протез', 21000],
      ['Термопластический протез', 45000], ['Бюгельный протез', 49000]
    ],
    'Ортодонтия': [
      ['Брекеты самолигирующие', 0], ['Брекеты лигатурные', 0], ['Элайнеры и капы', 0], ['Ретейнер', 0], ['Минивинт', 0]
    ],
    'Эстетика': [
      ['Отбеливание', 0], ['Винир', 0], ['Художественная реставрация', 6500]
    ],
    'Детям': [
      ['Осмотр и знакомство с врачом', 0, 0, 'бесплатно'], ['Лечение молочного зуба', 0], ['Удаление молочного зуба', 0]
    ],
    'Диагностика': [
      ['Консультация с планом лечения', 0, 0, 'бесплатно'], ['Прицельный снимок (радиовизиограф)', 0]
    ]
  };
  var cats = ['Все'].concat(Object.keys(PRICE));
  var curCat = 'Все';
  var pList = document.getElementById('pList');
  var pEmpty = document.getElementById('pEmpty');
  var pSearch = document.getElementById('pSearch');
  var pCats = document.getElementById('pCats');

  function priceText(r) {
    if (r[3]) return r[3];
    if (!r[1]) return 'после осмотра';
    if (r[2]) return fmt(r[1]) + ' - ' + fmt(r[2]) + ' руб.';
    return 'от ' + fmt(r[1]) + ' руб.';
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  cats.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'cat'; b.setAttribute('role', 'tab');
    b.dataset.cat = c;
    var n = c === 'Все' ? Object.keys(PRICE).reduce(function (s, k) { return s + PRICE[k].length; }, 0) : PRICE[c].length;
    b.innerHTML = esc(c) + '<sup>' + n + '</sup>';
    b.addEventListener('click', function () { curCat = c; renderPrice(); });
    pCats.appendChild(b);
  });

  function renderPrice() {
    var q = pSearch.value.trim().toLowerCase();
    var html = '', total = 0;
    Array.prototype.forEach.call(pCats.children, function (b) { b.setAttribute('aria-selected', b.dataset.cat === curCat ? 'true' : 'false'); });
    Object.keys(PRICE).forEach(function (c) {
      if (curCat !== 'Все' && curCat !== c) return;
      var rows = PRICE[c].filter(function (r) { return !q || r[0].toLowerCase().indexOf(q) > -1 || c.toLowerCase().indexOf(q) > -1; });
      if (!rows.length) return;
      total += rows.length;
      html += '<div class="pgroup"><h3>' + esc(c) + '</h3>' + rows.map(function (r, i) {
        var name = esc(r[0]);
        if (q) {
          var at = r[0].toLowerCase().indexOf(q);
          if (at > -1) name = esc(r[0].slice(0, at)) + '<mark>' + esc(r[0].slice(at, at + q.length)) + '</mark>' + esc(r[0].slice(at + q.length));
        }
        return '<div class="prow" style="animation-delay:' + Math.min(i * 30, 300) + 'ms"><span>' + name + '</span><b>' + priceText(r) + '</b></div>';
      }).join('') + '</div>';
    });
    pList.innerHTML = html;
    pList.hidden = !total;
    pEmpty.hidden = !!total;
  }
  pSearch.addEventListener('input', renderPrice);
  renderPrice();

  document.querySelectorAll('[data-filter]').forEach(function (a) {
    a.addEventListener('click', function () { curCat = a.dataset.filter; pSearch.value = ''; renderPrice(); });
  });

  /* ---------- зубная карта ---------- */
  var SHAPES = {
    inc: { root: 'M14 34Q16 6 20 4Q24 6 26 34Z', crown: 'M12 34Q11 56 20 58Q29 56 28 34Z', name: 'резец' },
    can: { root: 'M13 32Q16 0 20 0Q24 0 27 32Z', crown: 'M11 32Q10 50 20 60Q30 50 29 32Z', name: 'клык' },
    pre: { root: 'M12 34Q15 8 20 6Q25 8 28 34Z', crown: 'M8 34Q6 56 14 57Q20 54 26 57Q34 56 32 34Z', name: 'премоляр' },
    mol: { root: 'M7 32Q8 10 12 6Q15 14 18 32ZM22 32Q25 14 28 6Q32 10 33 32Z', crown: 'M4 32Q2 56 11 57Q16 53 20 56Q24 53 29 57Q38 56 36 32Z', name: 'моляр' }
  };
  function typeOf(n) { var d = n % 10; return d <= 2 ? 'inc' : d === 3 ? 'can' : d <= 5 ? 'pre' : 'mol'; }

  var C = {
    pain: { t: 'Болит', svc: 'Лечение кариеса или пульпита', from: 6500, cat: 'Терапия', topic: 'Болит зуб' },
    chip: { t: 'Скол, тёмное пятно', svc: 'Реставрация пломбой или коронка', from: 6500, cat: 'Терапия', topic: 'Болит зуб' },
    gone: { t: 'Зуба нет', svc: 'Имплант, затем коронка', from: 16000, cat: 'Имплантация', topic: 'Нет зуба, имплантация' },
    crown: { t: 'Нужна коронка', svc: 'Металлокерамика или цирконий', from: 12000, cat: 'Ортопедия', topic: 'Протезирование' },
    gum: { t: 'Кровит десна', svc: 'Профгигиена и осмотр дёсен', from: 2400, cat: 'Гигиена', topic: 'Чистка и отбеливание' },
    loose: { t: 'Шатается', svc: 'Осмотр, снимок, при необходимости удаление', from: 2000, cat: 'Хирургия', topic: 'Консультация и план лечения' },
    wisdom: { t: 'Режется восьмёрка', svc: 'Удаление зуба мудрости по сложности', from: 4000, to: 10500, cat: 'Хирургия', topic: 'Консультация и план лечения' },
    color: { t: 'Не нравится цвет', svc: 'Чистка, отбеливание или винир', from: 2400, cat: 'Эстетика', topic: 'Чистка и отбеливание' }
  };
  function complaintsFor(n) {
    var t = typeOf(n), d = n % 10;
    if (d === 8) return ['wisdom', 'pain', 'gone', 'gum'];
    if (t === 'inc' || t === 'can') return ['pain', 'chip', 'color', 'gone', 'loose'];
    return ['pain', 'chip', 'gone', 'crown', 'gum'];
  }

  var jawUp = document.getElementById('jawUp');
  var jawDown = document.getElementById('jawDown');
  var ctTooth = document.getElementById('ctTooth');
  var ctChips = document.getElementById('ctChips');
  var ctRes = document.getElementById('ctRes');
  var fTopic = document.getElementById('fTopic');
  var cur = { n: 36, c: 'pain' };

  function makeTooth(n, i, lower) {
    var s = SHAPES[typeOf(n)];
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'tooth'; b.style.setProperty('--i', i);
    b.dataset.n = n;
    b.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-label', 'Зуб ' + n + ', ' + s.name);
    b.innerHTML = '<svg viewBox="0 0 40 62" aria-hidden="true"><g' + (lower ? ' transform="matrix(1 0 0 -1 0 62)"' : '') + '><path class="root" d="' + s.root + '"/><path class="crown" d="' + s.crown + '"/></g></svg><small>' + n + '</small>';
    b.addEventListener('click', function () { pickTooth(n, true); });
    return b;
  }
  var up = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  var down = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
  up.forEach(function (n, i) { jawUp.appendChild(makeTooth(n, i, false)); });
  down.forEach(function (n, i) { jawDown.appendChild(makeTooth(n, 16 + i, true)); });

  function pickTooth(n, user) {
    cur.n = n;
    document.querySelectorAll('.tooth').forEach(function (t) { t.setAttribute('aria-pressed', +t.dataset.n === n ? 'true' : 'false'); });
    ctTooth.textContent = 'Зуб ' + n + ' · ' + SHAPES[typeOf(n)].name;
    var list = complaintsFor(n);
    if (list.indexOf(cur.c) < 0) cur.c = list[0];
    ctChips.innerHTML = '';
    list.forEach(function (k) {
      var c = document.createElement('button');
      c.type = 'button'; c.className = 'chip'; c.setAttribute('role', 'radio');
      c.setAttribute('aria-checked', k === cur.c ? 'true' : 'false');
      c.textContent = C[k].t;
      c.addEventListener('click', function () { cur.c = k; pickTooth(cur.n, true); });
      ctChips.appendChild(c);
    });
    var r = C[cur.c];
    ctRes.innerHTML = '<p class="res__svc">' + r.svc + '</p><p class="res__price">' +
      (r.to ? fmt(r.from) + ' - ' + fmt(r.to) : 'от ' + fmt(r.from)) + ' <small>руб., пример</small></p>' +
      '<p class="res__links"><a href="#book" data-topic="' + r.topic + '">Записаться с этим</a><a href="#price" data-cat="' + r.cat + '">Все цены раздела</a></p>';
    if (user && !reduce) { ctRes.classList.remove('swap'); void ctRes.offsetWidth; ctRes.classList.add('swap'); }
  }
  ctRes.addEventListener('click', function (e) {
    var a = e.target.closest('a'); if (!a) return;
    if (a.dataset.topic) fTopic.value = a.dataset.topic;
    if (a.dataset.cat) { curCat = a.dataset.cat; pSearch.value = ''; renderPrice(); }
  });
  pickTooth(36, false);

  /* ---------- рассрочка ---------- */
  var cSum = document.getElementById('cSum');
  var cSumOut = document.getElementById('cSumOut');
  var cPay = document.getElementById('cPay');
  var months = 6, shown = 10000, raf;
  function calc() {
    var sum = +cSum.value, target = sum / months;
    cSumOut.textContent = fmt(sum);
    cancelAnimationFrame(raf);
    if (reduce) { cPay.textContent = fmt(target); shown = target; return; }
    var from = shown, t0 = performance.now();
    (function step(t) {
      var k = Math.min((t - t0) / 400, 1), v = from + (target - from) * (1 - Math.pow(1 - k, 3));
      cPay.textContent = fmt(v); shown = v;
      if (k < 1) raf = requestAnimationFrame(step);
    })(t0);
  }
  cSum.addEventListener('input', calc);
  document.querySelectorAll('.calc__t').forEach(function (b) {
    b.addEventListener('click', function () {
      months = +b.dataset.m;
      document.querySelectorAll('.calc__t').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      calc();
    });
  });
  calc();

  /* ---------- форма (демо, без отправки) ---------- */
  var form = document.getElementById('book');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (f) {
      var bad = f.type === 'checkbox' ? !f.checked : f.value.trim().length < 2;
      f.classList.toggle('is-bad', bad);
      if (bad) ok = false;
    });
    var phone = form.elements.phone;
    if (phone.value.replace(/\D/g, '').length < 10) { phone.classList.add('is-bad'); ok = false; }
    if (!ok) { form.querySelector('.is-bad').focus(); return; }
    document.getElementById('formOk').hidden = false;
    form.reset();
  });

  /* ---------- появление при прокрутке и счётчики ---------- */
  function count(el) {
    var to = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduce || !to) { el.textContent = fmt(to) + suf; return; }
    var t0 = performance.now(), dur = to > 1000 ? 1300 : 1000;
    (function step(t) {
      var k = Math.min((t - t0) / dur, 1);
      el.textContent = fmt(to * (1 - Math.pow(1 - k, 3))) + suf;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  var steps = document.getElementById('stepsList');
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    steps.style.setProperty('--p', 1);
    return;
  }
  // небольшая задержка для соседних карточек
  document.querySelectorAll('.promos,.worry,.docs,.revs,.nums,.steps,.faq__list').forEach(function (g) {
    Array.prototype.forEach.call(g.querySelectorAll('.reveal'), function (el, i) { el.style.setProperty('--rd', (i % 6) * 0.08 + 's'); });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.add('is-in');
      el.querySelectorAll('[data-count]').forEach(count);
      if (el.matches('[data-count]')) count(el);
      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  new IntersectionObserver(function (en, o) {
    if (en[0].isIntersecting) { steps.style.setProperty('--p', 1); o.disconnect(); }
  }, { threshold: 0.4 }).observe(steps);
})();
