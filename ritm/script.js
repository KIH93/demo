(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* меню */
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  /* сценарии света */
  var hero = document.querySelector('.hero');
  var scenes = {
    morning: { k: '3000 K', d: 'мягкая подсветка ниши и естественный свет из окна' },
    day: { k: 'дневной свет', d: 'искусственный свет выключен, хватает окна' },
    evening: { k: '2700 K', d: 'люстра, бра, трековые споты и тёплый торшер' },
    night: { k: '2200 K', d: 'только LED-лента у пола и парящий профиль на 40%' }
  };
  var keys = document.querySelectorAll('.switch__keys button');
  var kEl = document.querySelector('.js-k');
  var dEl = document.querySelector('.js-desc');
  var userTouched = false;
  function setScene(name) {
    hero.setAttribute('data-scene', name);
    keys.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.set === name); });
    kEl.textContent = scenes[name].k;
    dEl.textContent = scenes[name].d;
  }
  keys.forEach(function (b) {
    b.addEventListener('click', function () { userTouched = true; setScene(b.dataset.set); });
  });
  /* автопоказ: пока пользователь не нажал, сцена сама проходит сутки один раз */
  if (!reduce) {
    var order = ['night', 'morning', 'day', 'evening'];
    var i = 0;
    setScene('night');
    var timer = setInterval(function () {
      if (userTouched) { clearInterval(timer); return; }
      i++;
      setScene(order[i]);
      if (i >= order.length - 1) clearInterval(timer);
    }, 2200);
  }

  /* бегущая лента: пауза при наведении */
  var row = document.querySelector('.ticker__row');
  row.addEventListener('mouseenter', function () { row.style.animationPlayState = 'paused'; });
  row.addEventListener('mouseleave', function () { row.style.animationPlayState = 'running'; });

  /* шпаргалка */
  var rooms = {
    living: { t: 'Гостиная', lux: 150, temp: 12, tv: '2700-3000 K', layers: [
      ['Общий', 'Люстра или парящая линия по периметру'],
      ['Акцент', 'Трековые споты на картину, полки, зону ТВ'],
      ['Уют', 'Торшер у дивана и подсветка ниши под шторы']],
      tip: 'Разведите свет минимум на две группы: "гости" и "кино".' },
    bed: { t: 'Спальня', lux: 100, temp: 5, tv: '2700 K', layers: [
      ['Общий', 'Мягкий рассеянный свет, лучше с диммером'],
      ['У кровати', 'Бра или подвесы с выключателем у изголовья'],
      ['Ночь', 'Лента у пола с датчиком движения']],
      tip: 'Проходной выключатель: включили у двери, выключили лёжа.' },
    kitchen: { t: 'Кухня', lux: 250, temp: 40, tv: '3000-4000 K', layers: [
      ['Рабочий', 'LED-лента под верхними шкафами, без теней на столешнице'],
      ['Над столом', 'Пара подвесов на высоте 70-80 см над столом'],
      ['Общий', 'Споты или трек по контуру кухни']],
      tip: 'Над рабочей зоной свет нейтральнее, над столом теплее.' },
    bath: { t: 'Ванная', lux: 200, temp: 45, tv: '3000-4000 K', layers: [
      ['Общий', 'Влагозащищённые споты, IP44 и выше'],
      ['Зеркало', 'Подсветка по бокам зеркала, без теней на лице'],
      ['Настроение', 'Лента в нише или под тумбой, отдельной группой']],
      tip: 'Выключатель снаружи или влагозащищённый внутри.' },
    hall: { t: 'Прихожая', lux: 75, temp: 30, tv: '3000-3500 K', layers: [
      ['Общий', 'Споты или линейный светильник вдоль коридора'],
      ['Зеркало', 'Свет спереди, чтобы видеть себя перед выходом'],
      ['Удобство', 'Датчик движения: свет сам, когда руки заняты']],
      tip: 'В длинном коридоре выключатели с двух концов.' }
  };
  var tabs = document.querySelectorAll('.cheat__tabs button');
  var luxEl = document.querySelector('.js-lux');
  var dial = document.querySelector('.dial__val');
  var tempEl = document.querySelector('.js-temp');
  var tvEl = document.querySelector('.js-tempval');
  var titleEl = document.querySelector('.js-room-title');
  var listEl = document.querySelector('.js-layers');
  var tipEl = document.querySelector('.js-tip');
  var luxAnim;
  function animNum(el, to, dur) {
    cancelAnimationFrame(luxAnim);
    var from = parseInt(el.textContent, 10) || 0, t0 = performance.now();
    if (reduce) { el.textContent = to; return; }
    (function f(t) {
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (p < 1) luxAnim = requestAnimationFrame(f);
    })(t0);
  }
  function setRoom(key) {
    var r = rooms[key];
    tabs.forEach(function (b) { b.setAttribute('aria-selected', b.dataset.room === key); });
    animNum(luxEl, r.lux, 900);
    dial.style.strokeDashoffset = 528 - 528 * (r.lux / 300);
    tempEl.style.left = r.temp + '%';
    tvEl.textContent = r.tv;
    titleEl.textContent = r.t;
    listEl.innerHTML = r.layers.map(function (l, n) {
      return '<li style="animation-delay:' + (n * 0.08) + 's"><b>' + l[0] + '</b><span>' + l[1] + '</span></li>';
    }).join('');
    tipEl.textContent = r.tip;
  }
  tabs.forEach(function (b) { b.addEventListener('click', function () { setRoom(b.dataset.room); }); });
  setRoom('living');

  /* калькулятор (условные цены) */
  var area = document.querySelector('.js-area'), areaV = document.querySelector('.js-area-v');
  var spots = document.querySelector('.js-spots'), spotsV = document.querySelector('.js-spots-v');
  var fl = document.querySelector('.js-float'), ni = document.querySelector('.js-niche');
  var sumEl = document.querySelector('.js-sum');
  var shown = 0, sumAnim;
  function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function calc() {
    var a = +area.value, film = +document.querySelector('input[name=film]:checked').value;
    var per = 4 * Math.sqrt(a);
    var s = a * film + spots.value * 450 + (fl.checked ? per * 950 : 0) + (ni.checked ? 3 * 1900 : 0);
    s = Math.round(s / 100) * 100;
    areaV.textContent = a; spotsV.textContent = spots.value;
    cancelAnimationFrame(sumAnim);
    var from = shown, t0 = performance.now();
    if (reduce) { shown = s; sumEl.textContent = fmt(s); return; }
    (function f(t) {
      var p = Math.min((t - t0) / 500, 1);
      shown = from + (s - from) * (1 - Math.pow(1 - p, 3));
      sumEl.textContent = fmt(shown);
      if (p < 1) sumAnim = requestAnimationFrame(f);
    })(t0);
  }
  document.querySelector('.calc').addEventListener('input', calc);
  calc();

  /* форма-демо */
  var form = document.querySelector('.form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.querySelector('.form__ok').hidden = false;
  });

  /* появление и счётчики */
  function count(el) {
    var to = +el.dataset.to, dec = +(el.dataset.dec || 0);
    if (reduce) { el.textContent = to.toFixed(dec).replace('.', ','); return; }
    var t0 = performance.now();
    (function f(t) {
      var p = Math.min((t - t0) / 1400, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * e).toFixed(dec).replace('.', ',');
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        en.target.querySelectorAll('.count').forEach(count);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal, .rev-top').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    document.querySelectorAll('.count').forEach(count);
  }
})();
