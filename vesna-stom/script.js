(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // шапка и плавающие кнопки
  var header = document.getElementById('header');
  var float = document.querySelector('.float');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    float.classList.toggle('is-on', y > 420);
    stepsProgress();
  }

  // мобильное меню
  var burger = document.getElementById('burger');
  var mnav = document.getElementById('mnav');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    mnav.classList.toggle('is-open', open);
  });
  mnav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { burger.setAttribute('aria-expanded', 'false'); mnav.classList.remove('is-open'); }
  });

  // схема двора: двор с маршрутом (x 690-1430, y 60-720) вписываем в место справа от легенды
  var map = document.getElementById('heroMap');
  var legend = document.querySelector('.legend');
  var mq = window.matchMedia('(max-width: 820px)');
  function fitMap() {
    var box = map.getBoundingClientRect(), W = box.width, H = box.height;
    if (!W || !H) return;
    var stacked = mq.matches;
    var L = stacked ? 0 : legend.getBoundingClientRect().right - box.left;
    var top = stacked ? 0 : 72;
    // на телефоне берём часть двора поуже, чтобы подписи читались
    var s = stacked ? Math.min((W - 12) / 660, 1.2) : Math.min((W - L - 40) / 740, (H - top - 40) / 660, 1.5);
    var x0 = stacked ? 750 - 6 / s : 690 - (L + 20) / s;
    var y0 = 390 - (top + (H - top) / 2) / s;
    map.setAttribute('viewBox', [x0, y0, W / s, H / s].map(function (n) { return n.toFixed(1); }).join(' '));
    map.setAttribute('preserveAspectRatio', 'xMinYMin meet');
  }
  fitMap();
  window.addEventListener('resize', fitMap);
  if (document.fonts) document.fonts.ready.then(fitMap);

  // маршрут и "пешеход" по нему
  var route = document.getElementById('route');
  var walker = document.querySelector('.m-walker');
  var len = route.getTotalLength();
  route.style.setProperty('--len', len);
  if (!reduce) {
    var start = null, delay = 2700, dur = 3600, pause = 1600;
    var step = function (t) {
      if (start === null) start = t;
      var e = t - start - delay;
      if (e >= 0) {
        var k = (e % (dur + pause)) / dur;
        if (k <= 1) {
          var s = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          var p = route.getPointAtLength(s * len);
          walker.setAttribute('cx', p.x); walker.setAttribute('cy', p.y);
          walker.style.opacity = k < .06 ? k / .06 : k > .94 ? (1 - k) / .06 : 1;
        } else walker.style.opacity = 0;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // появление блоков при прокрутке, с небольшой очередью внутри сетки
  var items = document.querySelectorAll('.reveal');
  items.forEach(function (el) {
    var sib = el.parentElement.querySelectorAll(':scope > .reveal');
    var i = Array.prototype.indexOf.call(sib, el);
    if (sib.length > 2) el.style.setProperty('--rd', (i % 4) * 0.08 + 's');
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); count(x.target); }
      });
    }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); count(el); });
  }

  // счётчики
  function count(el) {
    el.querySelectorAll('[data-count]').forEach(function (n) {
      var to = parseFloat(n.dataset.count), dec = +(n.dataset.dec || 0);
      var fmt = function (v) { return v.toFixed(dec).replace('.', ','); };
      if (reduce) { n.textContent = fmt(to); return; }
      var t0 = performance.now(), d = 1400;
      (function tick(t) {
        var k = Math.min((t - t0) / d, 1);
        n.textContent = fmt(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }

  // вкладки прайса
  var tabs = document.querySelectorAll('[role="tab"]');
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var n = tabs[(i + d + tabs.length) % tabs.length];
      select(n); n.focus();
    });
  });

  // линия шагов заполняется при прокрутке
  var steps = document.getElementById('stepsList');
  function stepsProgress() {
    var r = steps.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.min(Math.max((vh * .8 - r.top) / (r.height + vh * .3), 0), 1);
    steps.style.setProperty('--p', reduce ? 1 : p.toFixed(3));
  }

  // форма: собираем текст и открываем WhatsApp
  var form = document.getElementById('bookForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    ['name', 'phone'].forEach(function (k) {
      var f = form.elements[k], bad = f.value.trim().length < (k === 'phone' ? 6 : 2);
      f.classList.toggle('err', bad);
      if (bad && ok) { f.focus(); ok = false; }
    });
    if (!ok) { document.getElementById('formNote').textContent = 'Заполните имя и телефон.'; return; }
    var text = 'Здравствуйте! Хочу записаться: ' + form.elements.service.value + '. Имя: ' + form.elements.name.value.trim() + ', телефон: ' + form.elements.phone.value.trim();
    window.open('https://wa.me/79047170088?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', stepsProgress);
  onScroll();
})();
