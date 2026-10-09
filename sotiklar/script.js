(function () {
  document.documentElement.classList.add('js');

  // Мобильное меню
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function closeMenu() {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
  }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // Готовый текст сообщения в WhatsApp
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = 'https://wa.me/79600483757?text=' + encodeURIComponent(a.getAttribute('data-wa'));
  });

  // Появление блоков при прокрутке
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Плавающие кнопки после первого экрана
  var fab = document.getElementById('fab');
  var hero = document.querySelector('.hero');
  function onScroll() {
    var past = window.scrollY > hero.offsetHeight - 80;
    var nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 160;
    fab.classList.toggle('is-visible', past && !nearEnd);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Демо-форма: проверка полей, без отправки
  var form = document.getElementById('orderForm');
  var msg = document.getElementById('formMsg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    var name = form.elements.name, phone = form.elements.phone, agree = form.elements.agree;
    [name, phone].forEach(function (f) { f.closest('.field').classList.remove('is-error'); });
    agree.closest('.check').classList.remove('is-error');
    if (!name.value.trim()) { name.closest('.field').classList.add('is-error'); ok = false; }
    if (phone.value.replace(/\D/g, '').length < 10) { phone.closest('.field').classList.add('is-error'); ok = false; }
    if (!agree.checked) { agree.closest('.check').classList.add('is-error'); ok = false; }
    msg.hidden = false;
    if (!ok) {
      msg.className = 'form__msg is-error';
      msg.textContent = 'Заполните имя, телефон и отметьте согласие.';
      return;
    }
    msg.className = 'form__msg';
    msg.textContent = 'Это демо-версия, заявка не отправлена. На готовом сайте она сразу придёт мастеру.';
  });
})();
