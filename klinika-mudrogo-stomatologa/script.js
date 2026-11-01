(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Появление первого экрана по очереди
  requestAnimationFrame(function () {
    setTimeout(function () { root.classList.add('is-ready'); }, 60);
  });

  // Счётчики цифр
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    if (reduced) { el.textContent = target.toFixed(dec); return; }
    var start = null, dur = 1400;
    function tick(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    }
    el.textContent = (0).toFixed(dec);
    requestAnimationFrame(tick);
  }

  // Появление блоков при прокрутке
  var reveals = document.querySelectorAll('.reveal');
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.hasAttribute('data-count')) runCount(el);
        else {
          var siblings = el.parentNode.querySelectorAll(':scope > .reveal');
          var i = Array.prototype.indexOf.call(siblings, el);
          el.style.transitionDelay = (Math.max(i, 0) % 4) * 0.09 + 's';
          el.classList.add('is-in');
        }
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    counters.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Отрывной календарь с советами
  var stack = document.getElementById('tips');
  var nextBtn = document.getElementById('tipNext');
  var busy = false, timer;
  function tear() {
    if (busy || !stack) return;
    var top = stack.firstElementChild;
    if (reduced) { stack.appendChild(top); return; }
    busy = true;
    top.classList.add('is-torn');
    setTimeout(function () {
      top.classList.remove('is-torn');
      stack.appendChild(top);
      busy = false;
    }, 900);
  }
  function auto() {
    clearInterval(timer);
    if (!reduced) timer = setInterval(tear, 6000);
  }
  if (nextBtn) nextBtn.addEventListener('click', function () { tear(); auto(); });
  auto();

  // Вкладки цен
  var tabs = document.querySelectorAll('.price-tabs button');
  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabs.forEach(function (b) { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-selected', b === btn); });
      document.querySelectorAll('.price-group').forEach(function (g) {
        g.classList.toggle('is-active', g.getAttribute('data-group') === btn.getAttribute('data-tab'));
      });
    });
  });

  // Кнопка "Записать ребёнка" выбирает услугу в форме
  var select = document.getElementById('serviceSelect');
  document.querySelectorAll('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () { if (select) select.value = a.getAttribute('data-service'); });
  });

  // Форма: на демо без отправки
  var form = document.getElementById('form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = form.querySelector('.form__ok');
    var name = form.elements.name, phone = form.elements.phone;
    if (!name.value.trim()) { name.focus(); return; }
    if (phone.value.replace(/\D/g, '').length < 10) { phone.focus(); return; }
    ok.hidden = false;
    form.reset();
  });
})();
