(function () {
  'use strict';
  var PHONE = '79375257259';
  var WA = 'https://wa.me/' + PHONE;
  document.documentElement.classList.add('js');

  // Бургер-меню
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Появление блоков
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Фильтр адресов по районам
  var chips = document.querySelectorAll('.chip');
  var branches = document.querySelectorAll('.branch');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      branches.forEach(function (b) {
        b.hidden = f !== 'all' && b.getAttribute('data-district') !== f;
        b.classList.add('is-in');
      });
    });
  });

  // "Узнать стоимость"
  var modal = document.getElementById('askModal');
  var topicEl = document.getElementById('askTopic');
  var askWa = document.getElementById('askWa');
  var askTg = document.getElementById('askTg');
  document.querySelectorAll('.js-ask').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var topic = btn.getAttribute('data-topic') || 'ремонт';
      var text = 'Здравствуйте! Хочу узнать стоимость: ' + topic + '. Модель устройства: ';
      askWa.href = WA + '?text=' + encodeURIComponent(text);
      topicEl.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
      if (modal && typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        window.open(askWa.href, '_blank', 'noopener');
      }
    });
  });
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.close();
    });
    askTg.addEventListener('click', function () { modal.close(); });
    askWa.addEventListener('click', function () { modal.close(); });
  }

  // Форма заявки -> WhatsApp
  var form = document.getElementById('reqForm');
  var phone = form.elements.phone;
  var err = document.getElementById('phoneErr');
  function phoneOk(v) {
    var d = v.replace(/\D/g, '');
    if (d.length === 10) return true;
    return d.length === 11 && (d[0] === '7' || d[0] === '8');
  }
  phone.addEventListener('input', function () {
    if (phone.getAttribute('aria-invalid') === 'true' && phoneOk(phone.value)) {
      phone.removeAttribute('aria-invalid');
      err.textContent = '';
    }
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!phoneOk(phone.value)) {
      phone.setAttribute('aria-invalid', 'true');
      err.textContent = 'Введите номер в формате +7 900 000-00-00';
      phone.focus();
      return;
    }
    var f = form.elements;
    var lines = ['Здравствуйте! Заявка с сайта.'];
    if (f.name.value.trim()) lines.push('Имя: ' + f.name.value.trim());
    lines.push('Телефон: ' + phone.value.trim());
    if (f.device.value.trim()) lines.push('Устройство: ' + f.device.value.trim());
    if (f.problem.value.trim()) lines.push('Что случилось: ' + f.problem.value.trim());
    window.open(WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });
})();
