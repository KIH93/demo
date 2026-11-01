(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.remove('no-js');

  // запуск анимации первого экрана
  requestAnimationFrame(function () { document.body.classList.add('loaded'); });

  // шапка с границей после прокрутки и липкая кнопка на мобильном
  var head = document.querySelector('.head');
  var sticky = document.getElementById('sticky');
  var hero = document.querySelector('.hero');
  function onScroll() {
    var y = window.scrollY;
    head.classList.toggle('is-scrolled', y > 8);
    sticky.classList.toggle('on', y > hero.offsetHeight * 0.7);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // счётчики
  function count(el) {
    var to = +el.dataset.count;
    var from = el.dataset.from ? +el.dataset.from : 0;
    if (reduce) { el.textContent = to; return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * e).toLocaleString('ru-RU');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // появление блоков при прокрутке
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(count);
  } else {
    // соседние элементы появляются по очереди
    items.forEach(function (el) {
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains('reveal'); });
      el.style.setProperty('--rd', (sibs.indexOf(el) % 6) * 0.08 + 's');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        en.target.querySelectorAll('[data-count]').forEach(count);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // демо-форма без отправки
  var form = document.getElementById('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var phone = form.phone;
    var ok = phone.value.replace(/\D/g, '').length >= 10;
    phone.classList.toggle('err', !ok);
    if (!ok) { phone.focus(); return; }
    form.querySelector('.form__ok').hidden = false;
    form.reset();
  });

  document.getElementById('y').textContent = new Date().getFullYear();
})();
