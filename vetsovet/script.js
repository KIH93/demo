(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Шапка: тень при прокрутке
  var top = document.querySelector('.top');
  var dock = document.getElementById('dock');
  var hero = document.querySelector('.hero');
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle('is-scrolled', y > 10);
    if (dock && hero) dock.classList.toggle('is-on', y > hero.offsetHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Меню на мобильном
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    burger.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
    nav.classList.toggle('is-open', !open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Открыть меню');
      nav.classList.remove('is-open');
    }
  });

  // Счётчики
  function count(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    if (reduce) { el.textContent = target.toFixed(dec); return; }
    var start = null, dur = 1400;
    function tick(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var v = target * (1 - Math.pow(1 - p, 3));
      el.textContent = v.toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Появление при прокрутке
  var els = document.querySelectorAll('.reveal, .steps__line, .map');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        en.target.querySelectorAll('[data-count]').forEach(count);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
    document.querySelectorAll('[data-count]').forEach(count);
  }

  // Подбор услуг по питомцу
  var btns = document.querySelectorAll('.filter__btn');
  var cards = document.querySelectorAll('.card[data-pets]');
  var hint = document.getElementById('filterHint');
  var pets = document.querySelectorAll('.pet');
  function applyFilter(f) {
    btns.forEach(function (b) {
      var on = b.getAttribute('data-filter') === f;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', String(on));
    });
    cards.forEach(function (c) {
      var list = c.getAttribute('data-pets').split(' ');
      var match = f === 'all' || list.indexOf(f) !== -1;
      c.classList.toggle('is-dim', !match);
      c.classList.toggle('is-match', f !== 'all' && match);
    });
    hint.hidden = f !== 'other';
    pets.forEach(function (p) { p.classList.toggle('is-picked', p.getAttribute('data-pet') === f); });
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () { applyFilter(b.getAttribute('data-filter')); });
  });
  pets.forEach(function (p) {
    p.addEventListener('click', function () {
      applyFilter(p.getAttribute('data-pet'));
      document.getElementById('services').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });
})();
