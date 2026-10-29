(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Время в Казани (UTC+3)
  function kazanNow() {
    var d = new Date();
    var parts = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d);
    var h = 0, m = 0;
    parts.forEach(function (p) {
      if (p.type === 'hour') h = parseInt(p.value, 10) % 24;
      if (p.type === 'minute') m = parseInt(p.value, 10);
    });
    return { h: h, m: m };
  }

  function periodOf(h) {
    if (h >= 5 && h < 11) return ['morning', 'утро, принимаем по записи'];
    if (h >= 11 && h < 17) return ['day', 'день, принимаем по записи'];
    if (h >= 17 && h < 23) return ['evening', 'вечер, принимаем по записи'];
    return ['night', 'ночь, принимаем по записи'];
  }

  // Цвет часа на шкале суток: ночь синяя, рассвет тёплый, день светлый
  var hourColors = [
    ['#2b3f8f', '#1f2d66'], ['#2b3f8f', '#1f2d66'], ['#2b3f8f', '#1f2d66'], ['#2f4596', '#22316d'], ['#3b4f9c', '#2a3a78'],
    ['#7a5aa0', '#4f4386'], ['#d98466', '#9a5f86'], ['#f2a65a', '#d98466'], ['#f7c06b', '#f2a65a'], ['#f8d27c', '#f7c06b'],
    ['#f9de95', '#f8d27c'], ['#fbe7aa', '#f9de95'], ['#fbe7aa', '#f9de95'], ['#fbe7aa', '#f9de95'], ['#f9de95', '#f8d27c'],
    ['#f8d27c', '#f7c06b'], ['#f7c06b', '#f2a65a'], ['#f2a65a', '#e98a5a'], ['#e98a5a', '#c9635f'], ['#b9586c', '#80497a'],
    ['#6e4a86', '#4a3c7c'], ['#45428a', '#2f3474'], ['#36408c', '#25306b'], ['#2b3f8f', '#1f2d66']
  ];

  var hero = document.querySelector('.hero');
  var hEl = document.querySelector('[data-h]');
  var mEl = document.querySelector('[data-m]');
  var pEl = document.querySelector('[data-period-text]');
  var bar = document.querySelector('.day__bar');

  if (bar) {
    for (var i = 0; i < 24; i++) {
      var li = document.createElement('li');
      li.style.setProperty('--h', i);
      li.style.setProperty('--c1', hourColors[i][0]);
      li.style.setProperty('--c2', hourColors[i][1]);
      li.setAttribute('aria-label', (i < 10 ? '0' : '') + i + ':00, приём по записи');
      bar.appendChild(li);
    }
  }

  function tick() {
    var t = kazanNow();
    var hh = (t.h < 10 ? '0' : '') + t.h;
    var mm = (t.m < 10 ? '0' : '') + t.m;
    if (hEl) hEl.textContent = hh;
    if (mEl) mEl.textContent = mm;
    var p = periodOf(t.h);
    if (hero) hero.setAttribute('data-period', p[0]);
    if (pEl) pEl.textContent = p[1];
    if (bar) {
      Array.prototype.forEach.call(bar.children, function (li, idx) {
        li.classList.toggle('is-past', idx < t.h);
        li.classList.toggle('is-now', idx === t.h);
        if (idx === t.h) li.setAttribute('data-label', 'сейчас ' + hh + ':' + mm);
        else li.removeAttribute('data-label');
      });
    }
  }
  tick();
  setInterval(tick, 15000);

  // Появление первого экрана
  requestAnimationFrame(function () {
    document.body.classList.add('ready');
    var day = document.querySelector('.day');
    if (day) day.classList.add('on');
  });

  // Счётчики
  function count(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    if (reduce) { el.textContent = target.toFixed(dec); return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var k = Math.min((ts - start) / dur, 1);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = (target * e).toFixed(dec);
      if (k < 1) requestAnimationFrame(step);
    }
    el.textContent = (0).toFixed(dec);
    requestAnimationFrame(step);
  }

  // Появление блоков при прокрутке
  var revealEls = document.querySelectorAll('.reveal, .path li');
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });

    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { count(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('on'); });
  }

  // Линия пути пациента заполняется при прокрутке
  var pathWrap = document.querySelector('[data-path]');
  var fab = document.querySelector('.fab');
  var ticking = false;
  function onScroll() {
    ticking = false;
    if (pathWrap) {
      var r = pathWrap.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.75 - r.top) / r.height;
      pathWrap.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
    }
    if (fab && hero) {
      fab.classList.toggle('show', hero.getBoundingClientRect().bottom < window.innerHeight * 0.5);
    }
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
})();
