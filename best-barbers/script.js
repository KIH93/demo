(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Доска: раскладываем строки на отдельные буквы */
  var d = 0;
  document.querySelectorAll('.board__line').forEach(function (line) {
    var text = line.getAttribute('data-type') || '';
    var words = text.split(' ');
    words.forEach(function (word, wi) {
      var w = document.createElement('span');
      w.style.display = 'inline-block';
      w.style.whiteSpace = 'nowrap';
      Array.from(word).forEach(function (c) {
        var s = document.createElement('span');
        s.className = 'ch';
        s.textContent = c;
        s.style.setProperty('--tilt', ((Math.random() - 0.5) * 3).toFixed(2) + 'deg');
        s.style.setProperty('--d', d);
        d += 24;
        w.appendChild(s);
      });
      line.appendChild(w);
      if (wi < words.length - 1) {
        var sp = document.createElement('span');
        sp.className = 'sp';
        sp.textContent = ' ';
        line.appendChild(sp);
        d += 20;
      }
    });
    d += 80;
  });

  var board = document.querySelector('.board');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      if (board) board.classList.add('on');
      root.classList.add('loaded');
    });
  });

  /* Появление блоков при прокрутке + счётчики */
  function count(el) {
    var to = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var fmt = function (v) { return v.toFixed(dec).replace('.', ','); };
    if (reduce) { el.textContent = fmt(to); return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var items = document.querySelectorAll('.reveal, [data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el.hasAttribute('data-count')) { if (!el.hasAttribute('data-done')) { el.setAttribute('data-done', ''); count(el); } }
        else el.classList.add('seen');
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el, i) {
      if (el.classList.contains('reveal')) el.style.transitionDelay = ((i % 4) * 0.08) + 's';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('seen'); if (el.hasAttribute('data-count')) count(el); });
  }

  /* Вкладки прайса */
  var tabs = Array.from(document.querySelectorAll('.tab'));
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!k) return;
      var next = tabs[(i + k + tabs.length) % tabs.length];
      selectTab(next); next.focus();
    });
  });

  /* Филиалы: переключение карты и телефона */
  var branches = Array.from(document.querySelectorAll('.branch'));
  var frame = document.getElementById('mapFrame');
  var call = document.getElementById('branchCall');
  var phones = ['tel:+79196293535', 'tel:+79867140992'];
  branches.forEach(function (b, i) {
    b.addEventListener('click', function () {
      branches.forEach(function (x) {
        var on = x === b;
        x.classList.toggle('is-on', on);
        x.setAttribute('aria-selected', on);
        x.tabIndex = on ? 0 : -1;
      });
      if (frame && frame.src !== b.dataset.map) frame.src = b.dataset.map;
      if (call) call.href = phones[i];
    });
  });

  /* Липкая кнопка записи после первого экрана */
  var dock = document.querySelector('.dock');
  var hero = document.querySelector('.hero');
  var foot = document.querySelector('.foot');
  function onScroll() {
    var y = window.scrollY;
    var past = hero && y > hero.offsetHeight * 0.7;
    var atFoot = foot && (y + window.innerHeight) > foot.offsetTop + 120;
    dock.classList.toggle('show', !!past && !atFoot);
    /* если блок пролистали слишком быстро, всё равно показываем его */
    document.querySelectorAll('.reveal:not(.seen), [data-count]:not([data-done])').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        if (el.hasAttribute('data-count')) { el.setAttribute('data-done', ''); count(el); }
        else el.classList.add('seen');
        if (io) io.unobserve(el);
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
