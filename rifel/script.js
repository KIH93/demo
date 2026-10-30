(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.classList.remove('no-js');

  // Первый экран появляется по очереди
  doc.classList.add('loaded');

  // Лента лет 2000...2026, дублируем для бесшовной прокрутки
  var track = document.getElementById('yearsTrack');
  if (track) {
    var html = '';
    for (var y = 2000; y <= 2026; y++) {
      var cls = 'yr', label = '';
      if (y === 2000) { cls += ' yr--key'; label = '<small>открытие</small>'; }
      if (y === 2026) { cls += ' yr--now'; label = '<small>сегодня</small>'; }
      html += '<span class="' + cls + '">' + y + label + '</span>';
    }
    track.innerHTML = html + html;
  }

  // Счётчик лет
  function countUp(el) {
    var end = +el.getAttribute('data-count');
    if (reduce) { el.textContent = end; return; }
    var t0 = null, dur = 1600;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  document.querySelectorAll('[data-count]').forEach(function (el) {
    setTimeout(function () { countUp(el); }, reduce ? 0 : 900);
  });

  // Шапка, плавающая кнопка
  var top = document.querySelector('.top');
  var fab = document.querySelector('.fab');
  var book = document.getElementById('book');
  var bookVisible = false;
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle('is-scrolled', y > 10);
    fab.classList.toggle('show', y > 600 && !bookVisible);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Мобильное меню
  var burger = document.querySelector('.burger');
  var mnav = document.getElementById('mnav');
  burger.addEventListener('click', function () {
    var open = mnav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  mnav.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      mnav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // Появление блоков при прокрутке
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });

    var lab = document.getElementById('labSteps');
    var labIo = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { lab.classList.add('go'); labIo.disconnect(); }
    }, { threshold: 0.35 });
    labIo.observe(lab);

    var bookIo = new IntersectionObserver(function (entries) {
      bookVisible = entries[0].isIntersecting;
      onScroll();
    });
    bookIo.observe(book);
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    document.getElementById('labSteps').classList.add('go');
  }

  // Услуги: раскрытие
  document.querySelectorAll('.srv__row').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  });

  // Ссылки с услугой подставляют её в форму
  var sel = document.getElementById('serviceSel');
  var urgentChk = document.getElementById('urgentChk');
  document.querySelectorAll('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      var s = a.getAttribute('data-service');
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].text === s) sel.selectedIndex = i;
      }
      urgentChk.checked = s === 'Неотложная помощь';
    });
  });

  // Калькулятор рассрочки (пример)
  var sum = document.getElementById('sum');
  var sumOut = document.getElementById('sumOut');
  var perMonth = document.getElementById('perMonth');
  var months = 6;
  function fmt(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function calc() {
    var v = +sum.value;
    sumOut.textContent = fmt(v) + ' руб.';
    perMonth.textContent = fmt(Math.ceil(v / months / 10) * 10);
    perMonth.classList.add('bump');
    setTimeout(function () { perMonth.classList.remove('bump'); }, 180);
  }
  sum.addEventListener('input', calc);
  document.querySelectorAll('.calc__months button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.calc__months button').forEach(function (x) {
        x.classList.remove('on'); x.setAttribute('aria-checked', 'false');
      });
      b.classList.add('on'); b.setAttribute('aria-checked', 'true');
      months = +b.getAttribute('data-m');
      calc();
    });
  });
  calc();

  // Вкладки прайса
  var tabs = document.querySelectorAll('[role="tab"]');
  function selectTab(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', on);
      x.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(x.getAttribute('aria-controls'));
      panel.hidden = !on;
      if (on) panel.classList.add('in');
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var n = tabs[(i + d + tabs.length) % tabs.length];
      selectTab(n); n.focus();
    });
  });

  // Демо-форма
  var form = document.getElementById('book');
  var ok = document.getElementById('formOk');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = false;
    ['name', 'phone'].forEach(function (n) {
      var f = form.elements[n];
      var empty = !f.value.trim() || (n === 'phone' && f.value.replace(/\D/g, '').length < 10);
      f.classList.toggle('err', empty);
      if (empty) bad = true;
    });
    if (bad) { ok.textContent = 'Укажите имя и телефон.'; return; }
    ok.textContent = 'Спасибо! Это демо, заявка не отправлена. На рабочем сайте её получит администратор.';
    form.reset();
  });
})();
