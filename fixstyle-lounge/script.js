(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // меню
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      burger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
  });

  // счётчики
  function count(el) {
    var to = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || '0', 10);
    var fmt = function (v) {
      var s = v.toFixed(dec);
      if (!dec && v >= 1000) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return s;
    };
    if (reduce) { el.textContent = fmt(to); return; }
    var start = null, dur = 1600;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // появление при прокрутке
  var targets = document.querySelectorAll('.reveal, [data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el.classList.contains('reveal')) el.classList.add('is-in');
        if (el.dataset.count) count(el);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('is-in'); if (el.dataset.count) count(el); });
  }

  // вкладки услуг
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
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

  // до / после
  document.querySelectorAll('.ba__frame').forEach(function (f) {
    var r = f.querySelector('.ba__range');
    r.addEventListener('input', function () { f.style.setProperty('--pos', r.value + '%'); });
  });

  // линия ритуала и липкая кнопка
  var steps = document.querySelector('.steps');
  var hero = document.querySelector('.lounge');
  var sticky = document.querySelector('.sticky-cta');
  var contacts = document.getElementById('contacts');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var vh = window.innerHeight;
    var r = steps.getBoundingClientRect();
    var p = (vh * 0.75 - r.top) / (r.height || 1);
    steps.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
    var hb = hero.getBoundingClientRect().bottom;
    var ct = contacts.getBoundingClientRect().top;
    sticky.classList.toggle('is-on', hb < 0 && ct > vh * 0.6);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
})();
