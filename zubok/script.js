(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Название по буквам
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var text = el.textContent;
    el.setAttribute('aria-label', text);
    el.textContent = '';
    Array.from(text).forEach(function (ch, i) {
      var s = document.createElement('span');
      s.className = 'ch';
      s.style.setProperty('--i', i);
      s.setAttribute('aria-hidden', 'true');
      s.textContent = ch;
      el.appendChild(s);
    });
  });

  // Счётчики
  function runCount(el) {
    var to = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || '0', 10);
    if (reduce) { el.textContent = to.toFixed(dec).replace('.', ','); return; }
    var start = null, dur = 1400;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var v = to * (1 - Math.pow(1 - p, 3));
      el.textContent = v.toFixed(dec).replace('.', ',');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Шапка с линией при прокрутке
  var top = document.querySelector('.top');
  function onScroll() { top.classList.toggle('is-stuck', window.scrollY > 10); updateSteps(); }

  // Прогресс шагов
  var steps = document.querySelector('.steps');
  var stepItems = steps ? steps.querySelectorAll('.step') : [];
  function updateSteps() {
    if (!steps) return;
    var r = steps.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.7 - r.top) / r.height;
    p = Math.max(0, Math.min(1, p));
    steps.style.setProperty('--prog', p.toFixed(3));
    stepItems.forEach(function (s, i) {
      s.classList.toggle('is-on', p >= (i + 0.5) / stepItems.length || p >= 0.999);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateSteps);
  onScroll();

  // Появление блоков
  var groups = new Map();
  document.querySelectorAll('.reveal').forEach(function (el) {
    var parent = el.parentElement;
    var n = groups.get(parent) || 0;
    el.style.setProperty('--rd', (n * 0.08) + 's');
    groups.set(parent, n + 1);
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        e.target.querySelectorAll('[data-count]').forEach(runCount);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }
  // Счётчик на первом экране
  document.querySelectorAll('.hero [data-count]').forEach(function (el) {
    setTimeout(function () { runCount(el); }, reduce ? 0 : 500);
  });

  // Калькулятор рассрочки (пример)
  var range = document.getElementById('sum');
  var sumOut = document.getElementById('sumOut');
  var payOut = document.getElementById('payOut');
  var bar = document.getElementById('payBar');
  var chips = document.querySelectorAll('.calc__parts .chip');
  var parts = 6;
  function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' руб.'; }
  function calc() {
    var v = +range.value;
    sumOut.textContent = fmt(v);
    payOut.textContent = fmt(Math.ceil(v / parts / 10) * 10);
    var pct = (v - range.min) / (range.max - range.min) * 100;
    range.style.setProperty('--p', pct + '%');
  }
  function drawBar() {
    bar.innerHTML = '';
    for (var i = 0; i < parts; i++) {
      var s = document.createElement('i');
      s.style.animationDelay = (i * 0.04) + 's';
      bar.appendChild(s);
    }
  }
  if (range) {
    range.addEventListener('input', calc);
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        chips.forEach(function (x) { x.setAttribute('aria-checked', 'false'); });
        c.setAttribute('aria-checked', 'true');
        parts = +c.dataset.parts;
        calc(); drawBar();
      });
    });
    calc(); drawBar();
  }

  // Плавающая кнопка связи
  var fab = document.getElementById('fab');
  var fabBtn = document.getElementById('fabBtn');
  var menu = document.getElementById('fabMenu');
  function setFab(open) {
    fab.classList.toggle('is-open', open);
    fabBtn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    menu.querySelectorAll('a').forEach(function (a) { a.tabIndex = open ? 0 : -1; });
  }
  fabBtn.addEventListener('click', function () { setFab(!fab.classList.contains('is-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setFab(false); });
  document.addEventListener('click', function (e) { if (!fab.contains(e.target)) setFab(false); });
})();
