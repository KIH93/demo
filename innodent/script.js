(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // шапка становится плотной после первого экрана
  var top = document.querySelector('.top');
  function onScroll() {
    top.classList.toggle('is-solid', window.scrollY > 40);
    updatePath();
  }

  // полоса прогресса в блоке "Как проходит лечение"
  var steps = document.querySelector('.steps');
  var bar = document.getElementById('pathBar');
  function updatePath() {
    if (!steps || !bar) return;
    var r = steps.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.6 - r.top) / r.height;
    bar.style.width = Math.max(0, Math.min(1, p)) * 100 + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // счётчики
  function count(el) {
    var to = parseFloat(el.dataset.to);
    var dec = parseInt(el.dataset.dec || '0', 10);
    if (reduce || to === 0) { el.textContent = to.toFixed(dec); return; }
    var start = null, dur = 1400;
    function step(t) {
      if (!start) start = t;
      var k = Math.min(1, (t - start) / dur);
      var v = to * (1 - Math.pow(1 - k, 3));
      el.textContent = v.toFixed(dec);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // появление блоков при прокрутке
  var targets = document.querySelectorAll('.reveal, .implant, .count');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) {
      el.classList.add('is-in', 'is-on');
      if (el.classList.contains('count')) count(el);
    });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.classList.contains('count')) count(el);
        else if (el.classList.contains('implant')) el.classList.add('is-on');
        else el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  // небольшая задержка для соседних карточек
  document.querySelectorAll('.services, .team, .quotes, .steps, .offers').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--rd', i * 0.08 + 's'); });
  });

  // калькулятор рассрочки (пример)
  var sum = document.getElementById('sum');
  var sumOut = document.getElementById('sumOut');
  var per = document.getElementById('perMonth');
  function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' руб.'; }
  function calc() {
    sumOut.textContent = fmt(sum.value);
    per.textContent = fmt(sum.value / 12);
  }
  if (sum) { sum.addEventListener('input', calc); calc(); }
})();
