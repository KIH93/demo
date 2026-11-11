(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* шапка и липкая кнопка */
  var top = document.getElementById('top');
  var sticky = document.querySelector('[data-sticky]');
  var hero = document.querySelector('.dye');
  var contacts = document.getElementById('contacts');
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle('is-scrolled', y > 10);
    var past = hero.getBoundingClientRect().bottom < 0;
    var atContacts = contacts.getBoundingClientRect().top < window.innerHeight * 0.6;
    sticky.classList.toggle('is-on', past && !atContacts);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* перелив за курсором на слове Mais */
  var word = document.querySelector('[data-dye]');
  if (word && !reduce) {
    word.parentElement.addEventListener('pointermove', function (e) {
      var r = word.getBoundingClientRect();
      word.style.setProperty('--x', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      word.style.setProperty('--y', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }

  /* бегущая лента: дублируем для бесшовной прокрутки */
  var tape = document.querySelector('[data-tape]');
  if (tape) {
    var items = Array.prototype.slice.call(tape.children);
    items.forEach(function (li) {
      var c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      tape.appendChild(c);
    });
  }

  /* пряди для иллюстрации до/после (одинаковая геометрия в двух слоях) */
  function rand(seed) {
    return function () {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }
  document.querySelectorAll('[data-strands]').forEach(function (g) {
    var grad = g.getAttribute('data-strands');
    var rnd = rand(7);
    var n = 34;
    for (var i = 0; i < n; i++) {
      var x = 40 + (320 * i) / (n - 1) + (rnd() - 0.5) * 14;
      var amp = 18 + rnd() * 10;
      var ph = 1;
      var d = 'M' + x.toFixed(1) + ' -10';
      var y = -10;
      var seg = 4;
      for (var k = 0; k < seg; k++) {
        var y2 = y + 135;
        var sway = amp * ph * (k % 2 ? -1 : 1);
        d += ' C' + (x + sway).toFixed(1) + ' ' + (y + 45).toFixed(1) + ',' + (x + sway).toFixed(1) + ' ' + (y + 90).toFixed(1) + ',' + x.toFixed(1) + ' ' + y2.toFixed(1);
        y = y2;
      }
      var p = document.createElementNS(SVGNS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('stroke', 'url(#' + grad + ')');
      p.setAttribute('stroke-width', (9 + rnd() * 9).toFixed(1));
      p.setAttribute('opacity', (0.75 + rnd() * 0.25).toFixed(2));
      g.appendChild(p);
      if (rnd() > 0.55) {
        var h = p.cloneNode();
        h.setAttribute('stroke', '#fff');
        h.setAttribute('stroke-width', '1.6');
        h.setAttribute('opacity', '0.22');
        h.setAttribute('transform', 'translate(3 0)');
        g.appendChild(h);
      }
    }
    if (!reduce) g.classList.add('strands-sway');
  });

  /* до/после */
  var ba = document.querySelector('[data-ba]');
  var stage = ba && ba.querySelector('.ba__stage');
  var range = ba && ba.querySelector('.ba__range');
  var touched = false;
  function setP(v) { stage.style.setProperty('--p', v + '%'); }
  if (range) {
    range.addEventListener('input', function () { touched = true; setP(range.value); });
  }

  /* выбор оттенка "после" */
  var palettes = {
    blonde: ['#5a3626', '#b98d62', '#f1e2c4'],
    copper: ['#4a2a1f', '#b0603a', '#eaa577'],
    rose: ['#5a3626', '#c08a80', '#f2d3c9']
  };
  var stops = document.querySelectorAll('#g-after stop');
  document.querySelectorAll('.shade').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.shade').forEach(function (o) {
        o.classList.toggle('is-on', o === b);
        o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
      });
      var pal = palettes[b.getAttribute('data-after')];
      stops.forEach(function (s, i) { s.style.stopColor = pal[i]; });
    });
  });

  function demoSlide() {
    if (reduce || touched) return;
    var start = null;
    var dur = 2600;
    function step(t) {
      if (touched) return;
      if (!start) start = t;
      var k = Math.min((t - start) / dur, 1);
      var v = 50 + Math.sin(k * Math.PI * 2) * 22 * (1 - k * 0.3);
      if (k === 1) v = 50;
      setP(v.toFixed(1));
      range.value = v;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* длина линий для отрисовки */
  document.querySelectorAll('.draw').forEach(function (p) {
    try { p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 1); } catch (e) {}
  });

  /* счётчики */
  function fmt(v, dec) { return dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toLocaleString('ru-RU'); }
  function count(el) {
    var to = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    if (reduce) { el.textContent = fmt(to, dec); return; }
    var start = null;
    var dur = 1400;
    function step(t) {
      if (!start) start = t;
      var k = Math.min((t - start) / dur, 1);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(to * e, dec);
      if (k < 1) requestAnimationFrame(step);
    }
    el.textContent = fmt(0, dec);
    requestAnimationFrame(step);
  }

  /* появление при прокрутке */
  if (!('IntersectionObserver' in window)) {
    document.documentElement.classList.add('no-js');
    document.querySelectorAll('.card').forEach(function (c) { c.classList.add('is-in'); });
    return;
  }
  document.querySelectorAll('.cards, .amen, .nums, .rev, .steps, .price').forEach(function (group) {
    Array.prototype.forEach.call(group.querySelectorAll('.reveal'), function (el, i) {
      el.style.setProperty('--rd', (i * 0.08).toFixed(2) + 's');
    });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.add('is-in');
      el.querySelectorAll('[data-count]').forEach(count);
      if (el.hasAttribute('data-count')) count(el);
      if (el === ba) setTimeout(demoSlide, 500);
      io.unobserve(el);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* счётчики первого экрана запускаем сразу после появления */
  setTimeout(function () {
    document.querySelectorAll('.dye [data-count]').forEach(count);
  }, reduce ? 0 : 900);
})();
