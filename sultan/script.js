(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // счётчики
  function runCount(el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || '0', 10);
    var fmt = function (v) { return dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toLocaleString('ru-RU'); };
    if (reduce) { el.textContent = fmt(target); return; }
    var start = null, dur = 1400;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-count]');
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.classList.contains('reveal')) el.classList.add('is-in');
        if (el.dataset.count) runCount(el);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 0.08 + 's';
      io.observe(el);
    });
    counters.forEach(function (el) {
      if (el.closest('.mosaic')) setTimeout(function () { runCount(el); }, 700);
      else io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
    counters.forEach(runCount);
  }

  // липкая кнопка
  var sticky = document.querySelector('.sticky-book');
  var hero = document.querySelector('.mosaic');
  function onScroll() {
    var past = window.scrollY > hero.offsetTop + hero.offsetHeight - 80;
    var nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 120;
    sticky.classList.toggle('is-on', past && !nearEnd);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // окно записи
  var modal = document.getElementById('book');
  var form = document.getElementById('bookForm');
  var ok = modal.querySelector('.form__ok');
  var lastFocus = null;
  function open(service) {
    lastFocus = document.activeElement;
    form.hidden = false; ok.hidden = true; form.reset();
    if (service) form.service.value = service;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(function () { form.name.focus(); }, 50);
  }
  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('[data-book]').forEach(function (b) {
    b.addEventListener('click', function () { open(b.dataset.service); });
  });
  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.closest('[data-close]')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.name.value.trim() || form.phone.value.replace(/\D/g, '').length < 10) {
      (form.name.value.trim() ? form.phone : form.name).focus();
      return;
    }
    form.hidden = true; ok.hidden = false;
  });
})();
