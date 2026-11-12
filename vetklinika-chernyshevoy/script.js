(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* шапка */
  var top = document.querySelector('.top');
  var onScroll = function () { top.classList.toggle('is-scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* меню */
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
  });

  /* лента: дублируем для бесшовного цикла */
  var track = document.querySelector('.ticker__track');
  if (track && !reduce) {
    Array.prototype.slice.call(track.children).forEach(function (li) {
      var c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c);
    });
  }

  /* счётчики */
  function fmt(v, dec) { return dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toLocaleString('ru-RU'); }
  function count(el) {
    var end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    if (reduce) { el.textContent = fmt(end, dec); return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(end * e, dec);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = fmt(0, dec);
    requestAnimationFrame(step);
  }

  /* появление при прокрутке */
  var reveals = document.querySelectorAll('.reveal');
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el.hasAttribute('data-count')) count(el); else el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    counters.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* прайс */
  var prices = [
    [['Приём терапевта', 'осмотр и консультация', 'от 870 руб.*'], ['Приём хирурга', 'консультация перед операцией', 'от 980 руб.*'], ['Повторный приём', 'в течение 14 дней', '600 руб.'], ['Консультация по анализам', 'разбор результатов', '500 руб.']],
    [['Кастрация кота', '', 'от 2 900 руб.*'], ['Стерилизация кошки', '', 'от 5 800 руб.*'], ['Лапароскопическая стерилизация', 'малоинвазивно', 'от 9 500 руб.'], ['Кастрация кролика', '', 'от 3 200 руб.']],
    [['УЗИ брюшной полости', '', '1 500 руб.'], ['Рентген', 'один снимок', '1 200 руб.'], ['Общий анализ крови', 'в лаборатории клиники', '900 руб.'], ['Микроскопия соскоба', '', '500 руб.']],
    [['Комплексная вакцинация', 'препарат включён', '1 800 руб.'], ['Прививка от бешенства', '', '700 руб.'], ['Оформление ветпаспорта', '', '300 руб.'], ['Удаление клеща', '', '400 руб.']],
    [['Стрижка когтей', '', '400 руб.'], ['Гигиеническая стрижка кошки', '', 'от 2 000 руб.'], ['Комплексный груминг собаки', 'зависит от породы', 'от 2 500 руб.'], ['Ультразвуковая чистка зубов', '', 'от 3 500 руб.']]
  ];
  var ptable = document.getElementById('ptable');
  var tabs = document.querySelectorAll('.tabs button');
  function renderPrices(i) {
    ptable.innerHTML = prices[i].map(function (r, k) {
      return '<div class="prow" style="--i:' + k + '"><span class="prow__name">' + r[0] + (r[1] ? '<small>' + r[1] + '</small>' : '') + '</span><span class="prow__price">' + r[2] + '</span></div>';
    }).join('');
  }
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      renderPrices(+b.dataset.tab);
    });
  });
  renderPrices(0);

  /* реакции */
  document.querySelectorAll('.react').forEach(function (r) {
    function toggle() {
      var on = r.classList.toggle('is-on');
      var n = +r.dataset.n + (on ? 1 : 0);
      r.querySelector('i').textContent = n;
      r.classList.remove('pop'); void r.offsetWidth; r.classList.add('pop');
    }
    r.addEventListener('click', toggle);
    r.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  /* выбор услуги из карточки */
  var select = document.getElementById('service');
  document.querySelectorAll('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      var v = a.dataset.service;
      for (var i = 0; i < select.options.length; i++) if (select.options[i].text === v) select.selectedIndex = i;
    });
  });

  /* форма */
  var form = document.getElementById('form');
  var err = document.getElementById('formErr');
  var done = document.getElementById('formDone');
  var phone = form.elements.phone;
  var date = form.elements.date;
  var d = new Date(); date.min = d.toISOString().slice(0, 10);

  phone.addEventListener('input', function () {
    var x = phone.value.replace(/\D/g, '');
    if (x[0] === '8') x = '7' + x.slice(1);
    if (x && x[0] !== '7') x = '7' + x;
    x = x.slice(0, 11);
    var o = x ? '+7' : '';
    if (x.length > 1) o += ' (' + x.slice(1, 4);
    if (x.length >= 4) o += ')';
    if (x.length > 4) o += ' ' + x.slice(4, 7);
    if (x.length > 7) o += '-' + x.slice(7, 9);
    if (x.length > 9) o += '-' + x.slice(9, 11);
    phone.value = o;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = [];
    var name = form.elements.name;
    [name, phone].forEach(function (f) { f.parentNode.classList.remove('is-bad'); });
    if (!name.value.trim()) bad.push(name);
    if (phone.value.replace(/\D/g, '').length < 11) bad.push(phone);
    if (bad.length) {
      bad.forEach(function (f) { f.parentNode.classList.add('is-bad'); });
      err.textContent = 'Укажите имя и телефон, чтобы администратор мог связаться.';
      bad[0].focus();
      return;
    }
    err.textContent = '';
    done.hidden = false;
    done.querySelector('button').focus();
  });
  document.getElementById('formAgain').addEventListener('click', function () {
    form.reset(); done.hidden = true;
  });
})();
