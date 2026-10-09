(function () {
  'use strict';

  var WA = 'https://wa.me/79377787000';
  var TG = 'https://t.me/apple_production_r';

  var PRICES = {
    iphone: [
      ['Диагностика', 0],
      ['Замена дисплея', 1000],
      ['Замена стекла дисплея', 1990],
      ['Замена аккумулятора', 990],
      ['Замена заднего стекла', 2490],
      ['Замена стекла камеры', 990],
      ['Замена корпуса', 2490],
      ['Восстановление после воды', 1490],
      ['Чистка динамиков', 490],
      ['Перепрошивка', 990],
      ['Ремонт Face ID', 4900],
      ['Ремонт платы', 2490],
      ['Замена камеры', 1990],
      ['Замена шлейфа зарядки', 1990],
      ['Замена микрофона', 1990],
      ['Разблокировка / снятие пароля', 990],
      ['Установка защитного стекла', 100],
      ['Установка бронеплёнки', 100]
    ],
    samsung: [
      ['Диагностика', 0],
      ['Замена дисплея', 1490],
      ['Замена стекла дисплея', 1990],
      ['Замена аккумулятора', 990],
      ['Замена заднего стекла', 990],
      ['Замена корпуса', 1490],
      ['Восстановление после воды', 1490],
      ['Перепрошивка', 990],
      ['Разблокировка', 990],
      ['Замена разъёма питания', 990],
      ['Ремонт платы', 2490]
    ],
    huawei: [
      ['Диагностика', 0],
      ['Замена дисплея', 1490],
      ['Замена стекла дисплея', 1990],
      ['Замена аккумулятора', 1490],
      ['Замена заднего стекла', 990],
      ['Замена стекла камеры', 990]
    ],
    xiaomi: { text: 'Ремонтируем Xiaomi, POCO и другие Android-смартфоны.', items: ['Диагностика', 'Ремонт смартфона'] },
    laptop: { text: 'Ремонтируем ноутбуки и MacBook.', items: ['Диагностика', 'Ремонт ноутбука или MacBook'] },
    console: { text: 'Обслуживаем игровые приставки, например чистим PS5 от пыли с заменой термопасты.', items: ['Диагностика', 'Чистка приставки от пыли и замена термопасты', 'Ремонт приставки'] }
  };

  var NAMES = { iphone: 'iPhone', samsung: 'Samsung', huawei: 'Huawei / Honor', xiaomi: 'Xiaomi / POCO', laptop: 'ноутбук / MacBook', console: 'игровая приставка' };

  function fmt(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function waLink(text) { return WA + '?text=' + encodeURIComponent(text); }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* Меню */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* Шапка и липкая кнопка */
  var header = document.querySelector('.header');
  var sticky = document.querySelector('.sticky-wa');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    var nearEnd = window.innerHeight + y > document.body.scrollHeight - 160;
    sticky.classList.toggle('is-visible', y > 420 && !nearEnd);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Прайс */
  var list = document.getElementById('priceList');
  var search = document.getElementById('priceSearch');
  var tabs = document.querySelectorAll('.tab');
  var current = 'iphone';

  function row(brand, name, cost) {
    var msg = 'Здравствуйте! Интересует: ' + name + ' (' + NAMES[brand] + '). Модель: ';
    var costHtml = cost === null ? '<span class="prow__cost">по запросу</span>'
      : cost === 0 ? '<span class="prow__cost prow__cost--free">бесплатно</span>'
      : '<span class="prow__cost">от ' + fmt(cost) + ' руб.</span>';
    return '<div class="prow"><span class="prow__name">' + esc(name) + '</span>' + costHtml +
      '<div class="prow__acts"><span class="prow__label">Узнать точнее:</span>' +
      '<a class="prow__ask" href="' + waLink(msg) + '" target="_blank" rel="noopener" aria-label="Узнать точнее в WhatsApp: ' + esc(name) + '"><svg class="ic" aria-hidden="true"><use href="#i-wa"/></svg>WhatsApp</a>' +
      '<a class="prow__ask prow__ask--tg" href="' + TG + '" target="_blank" rel="noopener" data-msg="' + esc(msg) + '" aria-label="Узнать точнее в Telegram: ' + esc(name) + '"><svg class="ic" aria-hidden="true"><use href="#i-tg"/></svg>Telegram</a></div></div>';
  }

  /* Telegram не подставляет текст в чат, поэтому копируем его в буфер и показываем подсказку */
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  var toastTimer;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 4000);
  }
  function copyForTg(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('Текст скопирован. Вставьте его в чат Telegram и допишите модель.');
      }, function () { showToast('Напишите в Telegram: ' + text); });
    } else {
      showToast('Напишите в Telegram: ' + text);
    }
  }

  function render() {
    var q = search.value.trim().toLowerCase();
    var data = PRICES[current];
    var html = '';
    if (Array.isArray(data)) {
      data.forEach(function (r) {
        if (!q || r[0].toLowerCase().indexOf(q) !== -1) html += row(current, r[0], r[1]);
      });
    } else {
      if (!q) html += '<div class="price__ondemand"><p>' + esc(data.text) + ' Цена по запросу, диагностика бесплатно.</p></div>';
      data.items.forEach(function (name) {
        if (!q || name.toLowerCase().indexOf(q) !== -1) html += row(current, name, name === 'Диагностика' ? 0 : null);
      });
    }
    list.innerHTML = html || '<p class="price__empty">Ничего не нашли. Напишите нам в WhatsApp, подскажем по любой поломке.</p>';
  }

  function setTab(id) {
    current = id;
    tabs.forEach(function (t) {
      var on = t.dataset.tab === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) list.setAttribute('aria-label', 'Цены: ' + t.textContent);
    });
    render();
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { setTab(t.dataset.tab); });
    t.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var arr = Array.prototype.slice.call(tabs);
      var i = arr.indexOf(t) + (e.key === 'ArrowRight' ? 1 : -1);
      var next = arr[(i + arr.length) % arr.length];
      next.focus();
      setTab(next.dataset.tab);
    });
  });
  search.addEventListener('input', render);
  list.addEventListener('click', function (e) {
    var a = e.target.closest('.prow__ask--tg');
    if (a) copyForTg(a.dataset.msg);
  });

  document.querySelectorAll('.device').forEach(function (d) {
    d.addEventListener('click', function () {
      search.value = '';
      setTab(d.dataset.tab);
      document.getElementById('prices').scrollIntoView({ behavior: 'smooth' });
    });
  });

  setTab('iphone');

  /* Отзывы */
  var slider = document.getElementById('revSlider');
  function slide(dir) {
    var card = slider.querySelector('.review');
    var step = card ? card.getBoundingClientRect().width + 16 : 300;
    slider.scrollBy({ left: dir * step, behavior: 'smooth' });
  }
  document.getElementById('revPrev').addEventListener('click', function () { slide(-1); });
  document.getElementById('revNext').addEventListener('click', function () { slide(1); });
  slider.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); slide(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); slide(-1); }
  });

  /* Заявка */
  var form = document.getElementById('orderForm');
  var hint = document.getElementById('formHint');
  var via = 'wa';
  form.querySelectorAll('button[type="submit"]').forEach(function (b) {
    b.addEventListener('click', function () { via = b.dataset.via; });
  });

  function check(el) {
    var ok = el.value.trim().length >= (el.minLength > 0 ? el.minLength : 1);
    el.closest('.field').classList.toggle('is-invalid', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    return ok;
  }

  form.querySelectorAll('[required]').forEach(function (el) {
    el.addEventListener('input', function () { if (el.closest('.field').classList.contains('is-invalid')) check(el); });
    el.addEventListener('change', function () { if (el.closest('.field').classList.contains('is-invalid')) check(el); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = null;
    form.querySelectorAll('[required]').forEach(function (el) { if (!check(el) && !bad) bad = el; });
    if (bad) { bad.focus(); return; }

    var f = form.elements;
    var text = 'Здравствуйте! Заявка на ремонт.\n' +
      'Устройство: ' + f.device.value + '\n' +
      (f.model.value.trim() ? 'Модель: ' + f.model.value.trim() + '\n' : '') +
      'Что случилось: ' + f.issue.value.trim() + '\n' +
      'Имя: ' + f.name.value.trim();

    if (via === 'wa') {
      hint.hidden = true;
      window.open(waLink(text), '_blank', 'noopener');
    } else {
      // Telegram не принимает готовый текст для чата с пользователем, поэтому копируем его в буфер
      hint.textContent = 'Текст заявки скопирован. Вставьте его в чат Telegram.';
      hint.hidden = false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function () { hint.textContent = 'Скопируйте текст и отправьте его в Telegram: ' + text; });
      } else {
        hint.textContent = 'Скопируйте текст и отправьте его в Telegram: ' + text;
      }
      window.open(TG, '_blank', 'noopener');
    }
  });
})();
