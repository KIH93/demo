(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fmt(n, dec) {
    return dec ? n.toFixed(dec) : Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ');
  }

  // Счётчик цифр
  function count(el) {
    var to = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    if (reduce) { el.textContent = fmt(to, dec); return; }
    var start = null, dur = 1400;
    function tick(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)), dec);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Итог в чеке считается после "печати"
  var total = document.querySelector('.receipt [data-count]');
  if (total) setTimeout(function () { count(total); }, reduce ? 0 : 3000);

  // Появление блоков при прокрутке
  var items = document.querySelectorAll('.reveal, .steps');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
    document.querySelectorAll('[data-count]').forEach(function (el) { if (el !== total) count(el); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        e.target.querySelectorAll('[data-count]').forEach(count);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // Шапка и плавающая кнопка
  var top = document.querySelector('.top');
  var fab = document.querySelector('.fab');
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle('is-scrolled', y > 10);
    fab.classList.toggle('is-on', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Калькулятор рассрочки (пример)
  var sum = document.getElementById('sum');
  var sumOut = document.getElementById('sumOut');
  var payOut = document.getElementById('payOut');
  function calc() {
    var term = parseInt(document.querySelector('input[name=term]:checked').value, 10);
    var s = parseInt(sum.value, 10);
    var p = (s - sum.min) / (sum.max - sum.min) * 100;
    sum.style.setProperty('--p', p + '%');
    sumOut.textContent = fmt(s) + ' руб.';
    payOut.textContent = fmt(Math.ceil(s / term / 100) * 100) + ' руб.';
    payOut.classList.remove('bump');
    void payOut.offsetWidth;
    payOut.classList.add('bump');
  }
  if (sum) {
    sum.addEventListener('input', calc);
    document.querySelectorAll('input[name=term]').forEach(function (r) { r.addEventListener('change', calc); });
    calc();
  }
})();
