(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Меню поверх страницы
  var btn = $('.bar__menu'), menu = $('#menu');
  function toggleMenu(open) {
    btn.setAttribute('aria-expanded', open);
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  btn.addEventListener('click', function () { toggleMenu(menu.hidden); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { toggleMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { toggleMenu(false); btn.focus(); } });

  // Вкладки ритуалов для лица
  var tabs = $$('[role="tab"]');
  function select(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', on);
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
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

  // Появление заголовков и конверта
  var watch = $$('.h2, .manifest__text, .env');
  watch.forEach(function (el) { if (!el.classList.contains('env')) el.classList.add('wipe'); });
  if (reduce) watch.forEach(function (el) { el.classList.add('is-in'); });
  function reveal(vh) {
    watch = watch.filter(function (el) {
      if (el.getBoundingClientRect().top < vh * 0.88) { el.classList.add('is-in'); return false; }
      return true;
    });
  }

  // Скролл: плотная шапка, расхождение слова в hero, заполнение линии ритуала
  var bar = $('.bar'), lines = reduce ? [] : $$('[data-drift]');
  var path = $('.path'), stops = $$('.stop'), ticking = false;
  function onScroll() {
    var y = window.scrollY, vh = window.innerHeight;
    bar.classList.toggle('is-solid', y > 40);
    reveal(vh);
    if (y < vh * 1.2) lines.forEach(function (l) {
      l.style.transform = 'translateX(' + (y * parseFloat(l.dataset.drift)) + 'px)';
    });
    var r = path.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
    path.style.setProperty('--p', p);
    stops.forEach(function (s) { s.classList.toggle('is-on', s.getBoundingClientRect().top < vh * 0.6); });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // MAX: ссылка пока неизвестна (TODO), клик ничего не делает
  $$('[data-todo]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });
})();
