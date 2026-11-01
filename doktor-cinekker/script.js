(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Шапка с линией при прокрутке и липкая кнопка на мобильном
  var head = document.querySelector('.head');
  var sticky = document.querySelector('.sticky');
  function onScroll() {
    var y = window.scrollY;
    head.classList.toggle('is-scrolled', y > 10);
    sticky.classList.toggle('is-on', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Счётчики цифр
  function count(el) {
    var to = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || '0', 10);
    if (reduce) { el.textContent = to.toFixed(dec); return; }
    var start = performance.now(), dur = 1400;
    (function tick(t) {
      var p = Math.min((t - start) / dur, 1);
      el.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  // Появление блоков при прокрутке
  var targets = document.querySelectorAll('.reveal, .fan, .steps, [data-count]');
  function show(el) {
    if (el.dataset.count) count(el); else el.classList.add('is-on');
  }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el, i) {
      // соседние элементы появляются с небольшой задержкой друг за другом
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      if (el.classList.contains('reveal')) el.style.setProperty('--rd', Math.min(sib, 5) * 0.07 + 's');
      io.observe(el);
    });
  } else {
    targets.forEach(show);
  }

  // Переписка на первом экране: сообщения появляются по очереди
  var chat = document.getElementById('chat');
  var status = document.getElementById('chatStatus');
  var msgs = chat.querySelectorAll('.msg');
  if (reduce) {
    msgs.forEach(function (m) { m.classList.add('is-on'); });
  } else {
    var typing = document.createElement('span');
    typing.className = 'typing';
    typing.innerHTML = '<i></i><i></i><i></i>';
    var i = 0;
    function next() {
      if (i >= msgs.length) return;
      var m = msgs[i];
      var doctor = !m.classList.contains('msg--me');
      if (doctor) {
        chat.insertBefore(typing, m);
        status.textContent = 'печатает...';
        status.classList.add('is-typing');
        setTimeout(function () {
          typing.remove();
          status.textContent = 'врач-стоматолог · в сети';
          status.classList.remove('is-typing');
          m.classList.add('is-on');
          i++; setTimeout(next, 900);
        }, 1500);
      } else {
        m.classList.add('is-on');
        i++; setTimeout(next, 1100);
      }
    }
    setTimeout(next, 1100);
  }

  // Вкладки цен
  var tabs = document.querySelectorAll('.tabs button');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      document.querySelectorAll('.price__list').forEach(function (l) {
        l.classList.toggle('is-on', l.id === b.dataset.tab);
      });
    });
  });

  // Форма заявки: на демо без отправки
  var form = document.getElementById('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (f) {
      var bad = !f.value.trim();
      f.classList.toggle('is-err', bad);
      if (bad) ok = false;
    });
    if (ok) {
      document.getElementById('formOk').hidden = false;
      form.reset();
    }
  });
})();
