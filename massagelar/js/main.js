(function () {
  document.documentElement.classList.add('js');

  // Переключатель количества гостей в спа-программах
  var buttons = document.querySelectorAll('.guests__btn');
  var prices = document.querySelectorAll('.program__price span');
  var labels = document.querySelectorAll('.program__for');
  var forText = { 1: 'за 1 гостя', 2: 'за 2 гостей', 3: 'за 3 гостей' };

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var n = btn.getAttribute('data-guests');
      buttons.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      prices.forEach(function (el) {
        el.textContent = el.getAttribute('data-p' + n);
        el.parentNode.classList.remove('price-pop');
        void el.parentNode.offsetWidth;
        el.parentNode.classList.add('price-pop');
      });
      labels.forEach(function (el) { el.textContent = forText[n]; });
    });
  });

  // Плавное появление секций
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(function (el) { io.observe(el); });
})();
