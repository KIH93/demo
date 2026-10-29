(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  // первый экран: запуск последовательного появления
  requestAnimationFrame(function () { root.classList.add('is-ready'); });

  // шапка и нижняя панель
  var top = document.querySelector('.top');
  var dock = document.querySelector('.dock');
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle('is-scrolled', y > 10);
    dock.classList.toggle('is-on', y > 420);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // появление блоков при прокрутке и счётчики
  var items = document.querySelectorAll('.reveal');
  var counters = document.querySelectorAll('[data-count]');
  function count(el) {
    var end = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || '0', 10);
    if (reduce) { el.textContent = end.toFixed(dec); return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min((t - t0) / dur, 1);
      k = 1 - Math.pow(1 - k, 3);
      el.textContent = (end * k).toFixed(dec);
      if (k < 1) requestAnimationFrame(step);
    }
    el.textContent = (0).toFixed(dec);
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-count]').forEach(count);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // вкладки "Взрослым" / "Детям"
  var tabs = document.querySelector('.tabs');
  var tabBtns = tabs.querySelectorAll('.tab');
  function setTab(name, focus) {
    tabs.dataset.on = name;
    tabBtns.forEach(function (b) {
      var on = b.dataset.tab === name;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
      var pane = document.getElementById(b.getAttribute('aria-controls'));
      pane.hidden = !on;
      pane.classList.toggle('is-on', on);
    });
  }
  tabBtns.forEach(function (b) {
    b.addEventListener('click', function () { setTab(b.dataset.tab); });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        setTab(b.dataset.tab === 'adult' ? 'kid' : 'adult', true);
      }
    });
  });
  document.querySelectorAll('[data-open-tab]').forEach(function (a) {
    a.addEventListener('click', function () { setTab(a.dataset.openTab); });
  });

  // форма консультации: собираем текст и открываем WhatsApp
  var form = document.getElementById('consult-form');
  var hint = document.getElementById('form-hint');
  var f = form.elements;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = f.name.value.trim();
    var phone = f.phone.value.trim();
    f.name.classList.toggle('bad', !name);
    f.phone.classList.toggle('bad', phone.replace(/\D/g, '').length < 10);
    if (!name || phone.replace(/\D/g, '').length < 10) {
      hint.textContent = 'Укажите имя и телефон, чтобы мы могли связаться с вами.';
      return;
    }
    var who = form.querySelector('input[name="who"]:checked').value;
    var note = f.note.value.trim();
    var text = 'Здравствуйте! Хочу записать ' + who + ' на бесплатную консультацию.\nИмя: ' + name + '\nТелефон: ' + phone + (note ? '\nВопрос: ' + note : '');
    hint.textContent = 'Открываем WhatsApp...';
    window.open('https://wa.me/79372800244?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });
})();
