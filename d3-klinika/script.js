(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // счётчики цифр
  function countUp(el) {
    var to = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || '0', 10);
    if (reduce) { el.textContent = to.toFixed(dec); return; }
    var t0 = null, dur = 1400;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // появление блоков при прокрутке
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      en.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(en.target);
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // путь пациента: иллюстрация меняется по активному шагу
  var stage = document.getElementById('stage');
  var num = document.getElementById('stageNum');
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));
  function setStep(n) {
    for (var i = 1; i <= 6; i++) stage.classList.toggle('is-' + i, i <= n);
    num.textContent = '0' + n;
    steps.forEach(function (s) {
      var k = +s.dataset.step;
      s.classList.toggle('is-on', k === n);
      s.classList.toggle('is-past', k < n);
    });
  }
  var stepIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) setStep(+en.target.dataset.step);
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(function (s) { stepIo.observe(s); });
  setStep(1);

  // за этап / под ключ
  var seg = document.querySelector('.seg');
  var calc = document.getElementById('calc');
  seg.addEventListener('click', function (e) {
    var b = e.target.closest('.seg__btn');
    if (!b) return;
    var mode = b.dataset.mode;
    seg.dataset.mode = mode;
    calc.dataset.mode = mode;
    seg.querySelectorAll('.seg__btn').forEach(function (x) {
      var on = x === b;
      x.classList.toggle('is-on', on);
      x.setAttribute('aria-selected', on);
    });
  });

  // в FAQ открыт только один вопрос
  var qas = document.querySelectorAll('.qa');
  qas.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) qas.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  // форма: собирает сообщение для WhatsApp
  var form = document.getElementById('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    form.name.classList.toggle('is-err', !name);
    form.phone.classList.toggle('is-err', phone.replace(/\D/g, '').length < 10);
    if (!name || phone.replace(/\D/g, '').length < 10) {
      document.getElementById('formHint').textContent = 'Заполните имя и телефон, чтобы мы могли связаться.';
      return;
    }
    var text = 'Здравствуйте! Хочу записаться: ' + form.topic.value + '. Меня зовут ' + name + ', телефон ' + phone + '.';
    window.open('https://wa.me/79083424996?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });
})();
