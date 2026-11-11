(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fmt = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };

  // шапка
  var top = document.querySelector('.top');
  var sticky = document.querySelector('.sticky');
  var hero = document.querySelector('.title');
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle('is-solid', y > 40);
    var nearEnd = window.innerHeight + y > document.body.scrollHeight - 220;
    sticky.classList.toggle('show', y > hero.offsetHeight * 0.7 && !nearEnd);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // мигание надписи после заставки
  setTimeout(function () { document.querySelector('.press').classList.add('on'); }, 2400);

  // счётчики
  function count(el) {
    var to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    var show = function (v) { el.textContent = dec ? v.toFixed(dec).replace('.', ',') : (el.dataset.sp ? fmt(v) : Math.round(v)); };
    if (reduce) return show(to);
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      show(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // появление при прокрутке
  var targets = document.querySelectorAll('.reveal, [data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.dataset.count) count(el); else el.classList.add('on');
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { if (el.dataset.count) count(el); else el.classList.add('on'); });
  }

  // калькулятор визита
  var boxes = document.querySelectorAll('.items input');
  var first = document.getElementById('first');
  var list = document.getElementById('pick');
  var sumEl = document.getElementById('sum');
  var note = document.getElementById('note');
  var wa = document.getElementById('wa-pick');
  var shown = 1000;

  function animateSum(to) {
    var from = shown; shown = to;
    sumEl.parentNode.classList.remove('bump'); void sumEl.offsetWidth; sumEl.parentNode.classList.add('bump');
    if (reduce) { sumEl.textContent = fmt(to); return; }
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 450, 1);
      sumEl.textContent = fmt(from + (to - from) * p);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function update() {
    var sum = 0, names = [], gift = false;
    list.innerHTML = '';
    boxes.forEach(function (b) {
      var row = b.closest('.item');
      var isGift = b.dataset.gift && first.checked;
      row.classList.toggle('is-gift', !!isGift);
      if (!b.checked) return;
      var price = +b.dataset.price;
      if (isGift) { gift = true; price = 0; }
      sum += price;
      names.push(b.dataset.name);
      var li = document.createElement('li');
      li.innerHTML = '<b></b><span></span>';
      li.firstChild.textContent = b.dataset.name;
      li.lastChild.textContent = isGift ? 'подарок' : fmt(price) + ' руб.';
      list.appendChild(li);
    });
    if (!names.length) {
      var li = document.createElement('li');
      li.textContent = 'Выберите хотя бы одну услугу';
      list.appendChild(li);
    }
    animateSum(sum);
    note.textContent = gift ? 'Ваксинг в подарок на первый визит. Цены условные' : 'Ориентировочно, по условному прайсу';
    var msg = 'Здравствуйте! Хочу записаться в Capital' + (names.length ? ': ' + names.join(', ') : '') + (first.checked ? '. Я у вас впервые.' : '.');
    wa.href = 'https://wa.me/79203217315?text=' + encodeURIComponent(msg);
  }
  boxes.forEach(function (b) { b.addEventListener('change', update); });
  first.addEventListener('change', update);
  update();
})();
