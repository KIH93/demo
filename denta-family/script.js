(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  // первый экран: запуск по очереди
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { root.classList.add('ready'); });
  });

  // счётчики
  function count(el) {
    var to = parseFloat(el.dataset.count);
    if (reduce || !to) { el.textContent = to; return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  document.querySelectorAll('.wall [data-count]').forEach(function (el, i) {
    setTimeout(function () { count(el); }, reduce ? 0 : 1300 + i * 160);
  });

  // появление блоков при прокрутке
  var groups = new Map();
  document.querySelectorAll('.reveal').forEach(function (el) {
    var p = el.parentElement;
    var n = groups.get(p) || 0;
    el.style.setProperty('--n', n);
    groups.set(p, n + 1);
  });
  function done(el) {
    el.addEventListener('transitionend', function f() {
      el.classList.remove('reveal', 'is-in');
      el.style.removeProperty('--n');
      el.removeEventListener('transitionend', f);
    });
  }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        done(e.target);
        e.target.querySelectorAll('[data-count]').forEach(count);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.remove('reveal');
      el.querySelectorAll('[data-count]').forEach(count);
    });
  }

  // переключатель Взрослым / Детям
  var sw = document.querySelector('.switch');
  sw.querySelectorAll('.switch__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var kid = btn.dataset.tab === 'kid';
      sw.classList.toggle('is-kid', kid);
      sw.querySelectorAll('.switch__btn').forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-selected', on);
        var panel = document.getElementById(b.getAttribute('aria-controls'));
        panel.hidden = !on;
        if (on) {
          panel.querySelectorAll('.svc').forEach(function (c, i) { c.style.setProperty('--n', i); });
          panel.classList.remove('is-swap');
          void panel.offsetWidth;
          panel.classList.add('is-swap');
        }
      });
    });
  });

  // шапка, плавающая кнопка, линия шагов
  var top = document.querySelector('.top');
  var fab = document.querySelector('.fab');
  var steps = document.querySelector('.steps');
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle('is-scrolled', y > 10);
    fab.classList.toggle('is-on', y > 420);
    var r = steps.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.8 - r.top) / (r.height + vh * 0.3);
    steps.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
