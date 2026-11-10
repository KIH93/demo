(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Заголовок: разбиваем на буквы для поочерёдного появления
  var idx = 0;
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var text = el.textContent;
    el.textContent = '';
    text.split('').forEach(function (c) {
      var s = document.createElement('span');
      s.className = 'ch';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', idx++);
      s.textContent = c;
      el.appendChild(s);
    });
  });

  // Шапка становится плотной при прокрутке, липкая кнопка появляется после первого экрана
  var top = document.querySelector('.top');
  var sticky = document.querySelector('.sticky');
  var stage = document.querySelector('.stage');
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle('is-solid', y > 20);
    sticky.classList.toggle('is-on', y > stage.offsetHeight * 0.7);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Луч прожектора слегка следует за курсором
  var beam = document.querySelector('.stage__beam');
  if (!reduce && window.matchMedia('(pointer:fine)').matches) {
    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      var k = (e.clientX - r.left) / r.width - 0.5;
      beam.style.setProperty('--beam', (-k * 14).toFixed(2) + 'deg');
    });
    stage.addEventListener('pointerleave', function () { beam.style.setProperty('--beam', '0deg'); });
  }

  // Подсветка карточек филиалов под курсором
  document.querySelectorAll('.spot').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Вкладки прайса
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs__btn'));
  function select(btn) {
    tabs.forEach(function (b) {
      var on = b === btn;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
      document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { select(b); });
    b.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var n = tabs[(i + d + tabs.length) % tabs.length];
      select(n); n.focus();
    });
  });

  // Счётчики
  function count(el) {
    var end = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || '0', 10);
    if (reduce) { el.textContent = end.toFixed(dec); return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var v = end * (1 - Math.pow(1 - p, 3));
      el.textContent = v.toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = (0).toFixed(dec);
    requestAnimationFrame(step);
  }

  // Появление блоков при прокрутке
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
    document.querySelectorAll('[data-count]').forEach(count);
    return;
  }
  // небольшая задержка для соседних элементов в одной сетке
  items.forEach(function (el) {
    var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.setProperty('--rd', (Math.min(sib, 4) * 0.08) + 's');
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      en.target.querySelectorAll('[data-count]').forEach(count);
      if (en.target.dataset.count) count(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
