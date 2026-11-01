(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var root = document.documentElement;
  if (!reduce) root.classList.add('js-anim');

  /* ---------- Иллюстрация: ряд зубов с брекетами (оригинальная SVG для демо) ---------- */
  var SIDE_W = [84, 66, 70, 62, 60, 64, 64, 62];
  var SIDE_H = [150, 132, 152, 124, 120, 108, 104, 100];
  var W = SIDE_W.slice().reverse().concat(SIDE_W);
  var H = SIDE_H.slice().reverse().concat(SIDE_H);
  var CANINE = { 5: 1, 10: 1 };
  // [поворот, сдвиг x, сдвиг y] в начале лечения
  var CROOKED = [[-5,0,-4],[4,2,6],[-6,-3,-5],[8,4,10],[-7,-4,-6],[9,5,12],[-8,-6,4],[6,6,-5],
                 [-9,-5,9],[7,4,-4],[-6,-4,8],[5,3,-6],[-6,-2,5],[4,2,-4],[-4,0,6],[3,0,-3]];
  var TOP = 40, GAP = 5, BR_Y = TOP + 82;

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function toothPath(x0, w, h, canine) {
    var x1 = x0 + w, b = TOP + h, r = 12;
    var bottom = canine
      ? 'L' + (x1 - 3) + ' ' + (b - 16) + ' Q' + (x0 + w / 2) + ' ' + (b + 10) + ' ' + (x0 + 3) + ' ' + (b - 16)
      : 'L' + (x1 - 3) + ' ' + (b - r) + ' Q' + (x1 - 3) + ' ' + b + ' ' + (x1 - 3 - r) + ' ' + b +
        ' L' + (x0 + 3 + r) + ' ' + b + ' Q' + (x0 + 3) + ' ' + b + ' ' + (x0 + 3) + ' ' + (b - r);
    return 'M' + x0 + ' ' + (TOP - 20) + ' L' + x1 + ' ' + (TOP - 20) + ' ' + bottom + ' Z';
  }

  function buildTeeth(svg) {
    if (!document.getElementById('metal')) {
      var sprite = document.querySelector('svg[aria-hidden="true"]');
      var defs = el('defs', {}, sprite);
      var g = el('linearGradient', { id: 'metal', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      el('stop', { offset: '0', 'stop-color': '#f4f6fb' }, g);
      el('stop', { offset: '.5', 'stop-color': '#b8bfd0' }, g);
      el('stop', { offset: '1', 'stop-color': '#e3e7f0' }, g);
    }
    var total = W.reduce(function (a, b) { return a + b; }, 0) + GAP * (W.length - 1);
    var x = (1440 - total) / 2;
    var teethLayer = el('g', {}, svg);
    var items = [];
    W.forEach(function (w, i) {
      var g = el('g', { 'class': 'tooth' }, teethLayer);
      el('path', { d: toothPath(x, w, H[i], CANINE[i]) }, g);
      el('path', { 'class': 'shine', d: 'M' + (x + 14) + ' ' + (TOP + 40) + ' L' + (x + 14) + ' ' + (TOP + H[i] - 34) }, g);
      items.push({ g: g, cx: x + w / 2, py: TOP + H[i] / 2, x0: x, x1: x + w });
      x += w + GAP;
    });
    // десна поверх корней
    var edge = '';
    var first = items[0], last = items[items.length - 1];
    edge += 'M1440 ' + (TOP + 30) + ' L' + last.x1 + ' ' + (TOP + 30);
    for (var j = items.length - 1; j >= 0; j--) {
      edge += ' Q' + items[j].cx + ' ' + (TOP + 2) + ' ' + items[j].x0 + ' ' + (TOP + 30);
    }
    edge += ' L0 ' + (TOP + 30);
    el('path', { 'class': 'gum', d: 'M0 0 H1440 V' + (TOP + 30) + edge.replace(/^M1440 \d+/, '') + ' Z' }, svg);
    el('path', { 'class': 'gum-edge', d: edge }, svg);
    var wire = el('path', { 'class': 'wire' }, svg);
    var brLayer = el('g', {}, svg);
    items.forEach(function (it) {
      it.br = el('g', { 'class': 'br' }, brLayer);
      el('rect', { x: -12, y: -10, width: 24, height: 20, rx: 4 }, it.br);
      el('line', { x1: -12, y1: 0, x2: 12, y2: 0 }, it.br);
    });
    var state = { items: items, wire: wire, t: 0 };
    setT(state, 0);
    return state;
  }

  function setT(s, t) {
    s.t = t;
    var e = 1 - t, pts = [];
    s.items.forEach(function (it, i) {
      var c = CROOKED[i], rot = c[0] * e, dx = c[1] * e, dy = c[2] * e;
      it.g.setAttribute('transform', 'translate(' + dx + ' ' + dy + ') rotate(' + rot + ' ' + it.cx + ' ' + it.py + ')');
      var a = rot * Math.PI / 180, vy = BR_Y - it.py;
      var bx = it.cx - vy * Math.sin(a) + dx, by = it.py + vy * Math.cos(a) + dy;
      it.br.setAttribute('transform', 'translate(' + bx.toFixed(2) + ' ' + by.toFixed(2) + ') rotate(' + rot.toFixed(2) + ')');
      pts.push(bx.toFixed(1) + ' ' + by.toFixed(1));
    });
    var f = s.items[0], l = s.items[s.items.length - 1];
    s.wire.setAttribute('d', 'M' + (f.x0 - 30) + ' ' + pts[0].split(' ')[1] + ' L' + pts.join(' L') + ' L' + (l.x1 + 30) + ' ' + pts[pts.length - 1].split(' ')[1]);
  }

  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function tween(s, to, dur, onStep) {
    if (s.raf) cancelAnimationFrame(s.raf);
    if (reduce) { setT(s, to); if (onStep) onStep(to); return; }
    var from = s.t, t0 = performance.now();
    (function frame(now) {
      var k = Math.min(1, (now - t0) / dur);
      var v = from + (to - from) * ease(k);
      setT(s, v);
      if (onStep) onStep(v);
      if (k < 1) s.raf = requestAnimationFrame(frame);
    })(t0);
  }

  var hero = buildTeeth(document.getElementById('heroTeeth'));
  var sim = buildTeeth(document.getElementById('simTeeth'));

  /* ---------- Появление первого экрана ---------- */
  document.querySelectorAll('[data-hero]').forEach(function (n) { n.style.setProperty('--i', n.getAttribute('data-hero')); });
  requestAnimationFrame(function () { root.classList.add('ready'); });
  setTimeout(function () { tween(hero, 1, 2800); }, reduce ? 0 : 1100);
  setTimeout(function () { document.querySelectorAll('.facts [data-count]').forEach(count); }, reduce ? 0 : 1300);

  /* ---------- Счётчики ---------- */
  function count(n) {
    if (n.dataset.done) return;
    n.dataset.done = 1;
    var end = parseFloat(n.dataset.count), dec = +(n.dataset.dec || 0);
    var fmt = function (v) { return v.toFixed(dec).replace('.', ','); };
    if (reduce) { n.textContent = fmt(end); return; }
    var t0 = performance.now(), dur = 1400;
    (function frame(now) {
      var k = Math.min(1, (now - t0) / dur);
      n.textContent = fmt(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(frame);
    })(t0);
  }

  /* ---------- Появление блоков при прокрутке ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll('[data-count]').forEach(count);
      if (en.target.classList.contains('sim')) autoplay();
      io.unobserve(en.target);
    });
  }, { threshold: .18, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(function (n) { io.observe(n); });

  /* ---------- Брекеты: ползунок по месяцам и тип замков ---------- */
  var range = document.getElementById('month'), label = document.getElementById('monthLabel'), touched = false;
  function monthText(m) {
    if (m === 0) return 'Начало лечения';
    if (m === 18) return '18 мес.: зубы выровнены (пример)';
    return m + ' мес. лечения';
  }
  range.addEventListener('input', function () {
    touched = true;
    var m = +range.value;
    label.textContent = monthText(m);
    tween(sim, m / 18, 450);
  });
  function autoplay() {
    if (touched) return;
    setTimeout(function () {
      if (touched) return;
      tween(sim, 1, 3600, function (v) {
        if (touched) return;
        var m = Math.round(v * 18);
        range.value = m;
        label.textContent = monthText(m);
      });
    }, reduce ? 0 : 500);
  }
  document.querySelectorAll('.seg button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.seg button').forEach(function (x) {
        x.classList.toggle('is-on', x === b);
        x.setAttribute('aria-pressed', x === b);
      });
      document.getElementById('simTeeth').classList.toggle('is-clear', b.dataset.kind === 'clear');
    });
  });

  /* ---------- Линия шагов приёма ---------- */
  var steps = document.getElementById('steps');
  function stepsProgress() {
    var r = steps.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.max(0, Math.min(1, (vh * .85 - r.top) / (vh * .55)));
    steps.style.setProperty('--p', reduce ? 1 : p.toFixed(3));
  }

  /* ---------- Шапка и липкая кнопка ---------- */
  var head = document.querySelector('.head'), sticky = document.getElementById('sticky');
  var heroEl = document.querySelector('.hero'), book = document.getElementById('zapis');
  function onScroll() {
    head.classList.toggle('is-scrolled', window.scrollY > 10);
    var past = heroEl.getBoundingClientRect().bottom < 0;
    var atForm = book.getBoundingClientRect().top < window.innerHeight && book.getBoundingClientRect().bottom > 0;
    sticky.classList.toggle('show', past && !atForm);
    stepsProgress();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Филиалы ---------- */
  var MAP = 'https://yandex.ru/map-widget/v1/?z=16&text=';
  var BRANCHES = [
    {
      name: 'ул. Петербургская, 44, 1 этаж',
      sub: 'ЖК "Терра Милано", Вахитовский район',
      metro: 'метро "Площадь Тукая" и "Суконная слобода"',
      hours: 'пн-пт 9:00-20:00, сб 9:00-15:00 (пример)',
      tel: 'Запись по телефону и в мессенджерах',
      map: MAP + encodeURIComponent('Казань, ул. Петербургская, 44')
    },
    {
      name: 'пр. Ямашева, 92',
      sub: 'Ново-Савиновский район',
      metro: 'как добраться: уточняется (пример)',
      hours: 'график уточняется (пример)',
      tel: 'Телефон филиала уточняется, пока запись по общему номеру (пример)',
      map: MAP + encodeURIComponent('Казань, проспект Ямашева, 92')
    }
  ];
  var tabs = document.querySelectorAll('.tabs [role="tab"]');
  var info = document.querySelector('.branch__info');
  var fBranch = document.getElementById('fBranch');
  function setBranch(i, focus) {
    var b = BRANCHES[i];
    tabs.forEach(function (t, k) {
      t.setAttribute('aria-selected', k === i);
      t.tabIndex = k === i ? 0 : -1;
    });
    if (focus) tabs[i].focus();
    document.getElementById('panel').setAttribute('aria-labelledby', 'tab-' + i);
    document.getElementById('bName').textContent = b.name;
    document.getElementById('bSub').textContent = b.sub;
    document.getElementById('bMetro').lastChild.textContent = b.metro;
    document.getElementById('bHours').textContent = b.hours;
    document.getElementById('bTelNote').textContent = b.tel;
    var map = document.getElementById('bMap');
    map.src = b.map;
    map.title = 'Карта: Казань, ' + b.name;
    fBranch.selectedIndex = i;
    info.classList.remove('swap'); void info.offsetWidth; info.classList.add('swap');
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { setBranch(i); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') setBranch(i ? 0 : 1, true);
    });
  });
  document.querySelectorAll('[data-branch-link]').forEach(function (a) {
    a.addEventListener('click', function () { setBranch(+a.dataset.branchLink); });
  });

  /* ---------- Форма (демо, без отправки) ---------- */
  var fService = document.getElementById('fService');
  document.querySelectorAll('[data-service]').forEach(function (c) {
    c.addEventListener('click', function () {
      for (var i = 0; i < fService.options.length; i++) {
        if (fService.options[i].text === c.dataset.service) fService.selectedIndex = i;
      }
    });
  });
  var form = document.getElementById('form'), msg = document.getElementById('formMsg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var phone = form.phone, digits = phone.value.replace(/\D/g, '');
    if (digits.length < 10) {
      phone.classList.add('err');
      phone.focus();
      msg.textContent = 'Укажите номер телефона, чтобы администратор мог перезвонить.';
      return;
    }
    phone.classList.remove('err');
    msg.textContent = 'Спасибо! На рабочем сайте заявка уйдёт администратору филиала "' + fBranch.value + '". Это демо, поэтому заявка не отправлена.';
    form.reset();
  });
})();
