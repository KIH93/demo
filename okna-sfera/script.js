(function () {
  // mobile menu
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // material tabs
  var profiles = { pvc: 'profilePvc', alu: 'profileAlu', wood: 'profileWood' };
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var key = tab.dataset.tab;
      document.querySelectorAll('.tab').forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', on);
      });
      document.querySelectorAll('.mat__p').forEach(function (p) {
        p.hidden = p.dataset.panel !== key;
      });
      Object.keys(profiles).forEach(function (k) {
        document.getElementById(profiles[k]).toggleAttribute('hidden', k !== key);
      });
    });
  });

  // calculator: условные цены за м2 и опции, только для демонстрации
  var form = document.getElementById('calcForm');
  var RATE = { pvc: 7500, alu: 9500, wood: 16000, balcony: 11000 };
  var MIN = { pvc: 9900, alu: 12000, wood: 22000, balcony: 24000 };
  var OPT = { mount: 0.18, sill: 3200, slopes: 2800, net: 1400 };
  var sumEl = document.getElementById('sum');
  var shown = 0;

  function calc() {
    var type = form.type.value;
    var w = +form.w.value, h = +form.h.value;
    var qty = Math.max(1, Math.min(20, parseInt(form.qty.value, 10) || 1));
    document.getElementById('wOut').textContent = w;
    document.getElementById('hOut').textContent = h;
    var one = Math.max(MIN[type], (w * h / 10000) * RATE[type]);
    var opts = Array.prototype.map.call(form.querySelectorAll('[name=opt]:checked'), function (c) { return c.value; });
    if (opts.indexOf('mount') > -1) one *= 1 + OPT.mount;
    ['sill', 'slopes', 'net'].forEach(function (o) { if (opts.indexOf(o) > -1) one += OPT[o]; });
    animate(Math.round(one * qty / 100) * 100);
  }

  function animate(to) {
    var from = shown, start = performance.now();
    shown = to;
    (function step(t) {
      var k = Math.min(1, (t - start) / 350);
      sumEl.textContent = Math.round(from + (to - from) * k).toLocaleString('ru-RU');
      if (k < 1) requestAnimationFrame(step);
    })(start);
  }

  form.addEventListener('input', calc);
  form.querySelectorAll('[data-q]').forEach(function (b) {
    b.addEventListener('click', function () {
      form.qty.value = Math.max(1, Math.min(20, (parseInt(form.qty.value, 10) || 1) + +b.dataset.q));
      calc();
    });
  });

  // "Посчитать балкон" preselects balcony
  document.querySelectorAll('[data-type]').forEach(function (a) {
    a.addEventListener('click', function () {
      form.querySelector('[name=type][value=' + a.dataset.type + ']').checked = true;
      form.w.value = 300; form.h.value = 150;
      calc();
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var phone = form.phone;
    var ok = phone.value.replace(/\D/g, '').length >= 10;
    phone.classList.toggle('is-err', !ok);
    if (!ok) { phone.focus(); return; }
    document.getElementById('calcOk').hidden = false;
  });

  calc();
})();
