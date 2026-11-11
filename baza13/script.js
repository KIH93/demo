(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wall = document.querySelector('.wall');

  // Счётчики
  function count(el) {
    var to = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || '0', 10);
    var fmt = function (v) {
      var s = v.toFixed(dec);
      if (el.dataset.sp) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return s;
    };
    if (reduce) { el.textContent = fmt(to); return; }
    var t0 = null, dur = 1300;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Первый экран: ячейки по очереди, затем открывается дверца 13
  requestAnimationFrame(function () {
    document.body.classList.add('is-ready');
    wall.querySelectorAll('[data-count]').forEach(function (el) { setTimeout(function () { count(el); }, reduce ? 0 : 500); });
    if (reduce) wall.classList.add('is-open');
    else setTimeout(function () { wall.classList.add('is-open'); }, 200);
  });

  // Появление блоков при прокрутке
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.transitionDelay = Math.min(sib, 5) * 80 + 'ms';
        el.classList.add('in');
        el.querySelectorAll('[data-count]').forEach(count);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { if (!wall.contains(el)) io.observe(el); });
  } else {
    items.forEach(function (el) {
      el.classList.add('in');
      el.querySelectorAll('[data-count]').forEach(count);
    });
  }

  // Вкладки услуг
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.toggle('is-on', t === tab); t.setAttribute('aria-selected', t === tab); });
      document.querySelectorAll('.list[data-panel]').forEach(function (p) {
        var on = p.dataset.panel === tab.dataset.tab;
        p.hidden = !on;
        if (on) { p.classList.add('in'); p.classList.remove('swap'); void p.offsetWidth; p.classList.add('swap'); }
      });
    });
  });

  // Филиалы: переключение карты и маршрута
  var map = document.getElementById('map');
  var route = document.getElementById('route');
  var routes = [
    'https://yandex.ru/maps/?rtext=~' + encodeURIComponent('Казань, проспект Ибрагимова, 61'),
    'https://yandex.ru/maps/?rtext=~' + encodeURIComponent('Казань, улица Юлиуса Фучика, 30')
  ];
  var branches = document.querySelectorAll('.branch');
  branches.forEach(function (b, i) {
    b.addEventListener('click', function () {
      branches.forEach(function (x) { x.classList.toggle('is-on', x === b); });
      if (map.src !== b.dataset.map) map.src = b.dataset.map;
      route.href = routes[i];
    });
  });

  // Липкая кнопка записи после первого экрана
  var sticky = document.querySelector('.sticky');
  var final = document.querySelector('.final');
  function onScroll() {
    var past = window.scrollY > wall.offsetHeight * 0.7;
    var r = final.getBoundingClientRect();
    var atFinal = r.top < window.innerHeight && r.bottom > 0;
    sticky.classList.toggle('show', past && !atFinal);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
