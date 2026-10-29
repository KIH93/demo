(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // шапка с границей и липкая кнопка на мобильном
  var header = document.getElementById('header');
  var sticky = document.querySelector('.sticky-cta');
  var booking = document.getElementById('booking');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    var b = booking.getBoundingClientRect();
    var nearForm = b.top < window.innerHeight && b.bottom > 0;
    sticky.classList.toggle('is-shown', y > 500 && !nearForm);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // счётчики
  function count(el) {
    var target = +el.dataset.count;
    if (reduce) { el.textContent = target; return; }
    var start = null, dur = 1200;
    function tick(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // появление при прокрутке
  var items = document.querySelectorAll('.rv, #stepsList');
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('is-in', 'is-on'); });
    document.querySelectorAll('[data-count]').forEach(count);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        el.style.transitionDelay = Math.min(siblings, 6) * 0.08 + 's';
        el.classList.add('is-in');
        if (el.id === 'stepsList') el.classList.add('is-on');
        var c = el.querySelector('[data-count]');
        if (c) count(c);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // форма (демо, без отправки)
  var form = document.getElementById('form');
  var ok = document.getElementById('formOk');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = false;
    ['name', 'phone'].forEach(function (n) {
      var f = form.elements[n];
      var empty = n === 'phone' ? f.value.replace(/\D/g, '').length < 10 : !f.value.trim();
      f.classList.toggle('is-err', empty);
      if (empty && !bad) { f.focus(); bad = true; }
    });
    if (bad) return;
    ok.hidden = false;
    form.reset();
  });
})();
