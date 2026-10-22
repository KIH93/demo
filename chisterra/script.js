(function () {
  var WA = '79668022525';

  // header + mobile menu
  var header = document.querySelector('.header');
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
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // ---------- before / after: оригинальные SVG-иллюстрации ----------
  function sparkle(x, y, s) {
    return '<path fill="#fff" stroke="#bfe9e2" stroke-width="1" d="M' + x + ' ' + (y - s) + ' L' + (x + s * .28) + ' ' + (y - s * .28) + ' L' + (x + s) + ' ' + y + ' L' + (x + s * .28) + ' ' + (y + s * .28) + ' L' + x + ' ' + (y + s) + ' L' + (x - s * .28) + ' ' + (y + s * .28) + ' L' + (x - s) + ' ' + y + ' L' + (x - s * .28) + ' ' + (y - s * .28) + 'Z"/>';
  }

  function room(dirty) {
    var s = '<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">';
    // wall + floor
    s += '<rect width="600" height="400" fill="' + (dirty ? '#e6e1d4' : '#f1f9f7') + '"/>';
    s += '<rect y="300" width="600" height="100" fill="' + (dirty ? '#cdb998' : '#e8d8bf') + '"/>';
    s += '<g stroke="' + (dirty ? '#b9a27c' : '#dcc7a6') + '" stroke-width="2">';
    for (var i = 0; i < 7; i++) s += '<path d="M' + (i * 100 - 20) + ' 300 L' + (i * 110 - 60) + ' 400"/>';
    s += '<path d="M0 340 H600"/></g>';
    s += '<rect y="292" width="600" height="10" fill="' + (dirty ? '#d8d0bd' : '#fff') + '"/>';
    // window
    s += '<rect x="50" y="46" width="180" height="200" rx="6" fill="#fff"/>';
    s += '<rect x="62" y="58" width="156" height="176" fill="#a9def0"/>';
    s += '<g fill="#fff" opacity=".9"><ellipse cx="110" cy="100" rx="30" ry="9"/><ellipse cx="180" cy="150" rx="22" ry="7"/></g>';
    s += '<path d="M62 210 L100 180 L130 196 L170 170 L218 200 V234 H62z" fill="#8ccfc2"/>';
    if (dirty) {
      s += '<rect x="62" y="58" width="156" height="176" fill="#b7ad93" opacity=".7"/>';
      s += '<g fill="#9a8e74" opacity=".5"><circle cx="100" cy="90" r="18"/><circle cx="180" cy="200" r="22"/><circle cx="160" cy="110" r="10"/></g>';
      s += '<g stroke="#a39577" stroke-width="4" opacity=".55" fill="none" stroke-linecap="round"><path d="M80 150 q30 20 60 0"/><path d="M150 80 q20 30 50 10"/></g>';
    } else {
      s += '<path d="M80 70 L120 70 L76 120z" fill="#fff" opacity=".45"/>';
    }
    s += '<path d="M140 58 V234 M62 146 H218" stroke="#fff" stroke-width="8"/>';
    s += '<rect x="42" y="244" width="196" height="12" rx="3" fill="#fff"/>';
    // picture
    s += '<rect x="330" y="70" width="120" height="84" rx="4" fill="#fff"/>';
    s += '<rect x="338" y="78" width="104" height="68" fill="' + (dirty ? '#bdb59f' : '#cfeee8') + '"/>';
    s += '<circle cx="415" cy="98" r="10" fill="' + (dirty ? '#d6c79e' : '#ffd27a') + '"/><path d="M338 146 L370 112 L398 136 L418 120 L442 146z" fill="' + (dirty ? '#9fa58f' : '#5fb1a4') + '"/>';
    if (dirty) s += '<rect x="330" y="70" width="120" height="84" rx="4" fill="none" stroke="#a89d82" stroke-width="2" transform="rotate(-4 390 112)"/>';
    // sofa
    var so = dirty ? '#7aa9a0' : '#3fb3a3', sd = dirty ? '#5f8c84' : '#2a9a8b';
    s += '<rect x="280" y="190" width="270" height="70" rx="22" fill="' + sd + '"/>';
    s += '<rect x="296" y="200" width="116" height="52" rx="16" fill="' + so + '"/><rect x="420" y="200" width="116" height="52" rx="16" fill="' + so + '"/>';
    s += '<rect x="266" y="230" width="298" height="54" rx="20" fill="' + so + '"/>';
    s += '<rect x="258" y="214" width="34" height="76" rx="14" fill="' + sd + '"/><rect x="538" y="214" width="34" height="76" rx="14" fill="' + sd + '"/>';
    s += '<rect x="282" y="288" width="10" height="14" fill="#6d5a45"/><rect x="540" y="288" width="10" height="14" fill="#6d5a45"/>';
    s += '<rect x="440" y="208" width="54" height="38" rx="12" fill="' + (dirty ? '#d7c49a' : '#ffd27a') + '" transform="rotate(' + (dirty ? 18 : -8) + ' 467 227)"/>';
    // plant
    s += '<path d="M245 300 L240 262 H276 L271 300z" fill="#e88a62"/>';
    s += '<g fill="' + (dirty ? '#9aa36d' : '#4caf7a') + '"><path d="M258 262 C240 230 230 214 236 196 C252 214 258 236 258 262z"/><path d="M258 262 C268 228 284 214 296 210 C292 236 276 252 258 262z"/><path d="M258 262 C256 236 262 208 272 190 C278 214 270 242 258 262z"/></g>';
    if (dirty) {
      // stains, hair, dust, clutter
      s += '<g fill="#6b5a3e" opacity=".32"><ellipse cx="350" cy="252" rx="26" ry="10"/><ellipse cx="470" cy="262" rx="18" ry="8"/><ellipse cx="430" cy="226" rx="12" ry="9"/><ellipse cx="312" cy="226" rx="9" ry="7"/></g>';
      s += '<g stroke="#4c4033" stroke-width="1.4" opacity=".55" stroke-linecap="round">';
      for (var h = 0; h < 18; h++) { var hx = 300 + (h * 37) % 230, hy = 236 + (h * 13) % 40; s += '<path d="M' + hx + ' ' + hy + ' l' + (6 - h % 5 * 3) + ' ' + (3 + h % 3) + '"/>'; }
      s += '</g>';
      s += '<g fill="#9b8d72" opacity=".75"><ellipse cx="110" cy="330" rx="16" ry="6"/><ellipse cx="190" cy="372" rx="12" ry="5"/><ellipse cx="560" cy="330" rx="14" ry="5"/><ellipse cx="420" cy="360" rx="10" ry="4"/></g>';
      s += '<g fill="#7c6a4e">';
      for (var c = 0; c < 26; c++) s += '<circle cx="' + (40 + (c * 53) % 530) + '" cy="' + (318 + (c * 29) % 76) + '" r="' + (1.5 + c % 3) + '"/>';
      s += '</g>';
      s += '<rect x="80" y="318" width="70" height="44" rx="3" fill="#c49a64" transform="rotate(-8 115 340)"/><path d="M80 330 l70 -10" stroke="#a87f4c" stroke-width="3" transform="rotate(-8 115 340)"/>';
      s += '<path d="M330 345 q20 -12 36 0 l4 14 q-22 6 -44 0z" fill="#c76a6a"/>';
      s += '<rect x="470" y="330" width="40" height="26" rx="4" fill="#ddd2bb" transform="rotate(12 490 343)"/>';
      s += '<g stroke="#b5aa90" stroke-width="1.5" fill="none" opacity=".8"><path d="M0 0 q30 40 70 20"/><path d="M600 0 q-40 30 -80 10"/></g>';
    } else {
      s += '<rect x="0" y="300" width="600" height="100" fill="url(#shineA)" opacity=".5"/>';
      s += '<defs><linearGradient id="shineA" x1="0" x2="1"><stop offset=".2" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>';
      s += sparkle(120, 90, 14) + sparkle(200, 190, 9) + sparkle(470, 215, 12) + sparkle(330, 330, 11) + sparkle(520, 370, 8) + sparkle(400, 95, 8);
    }
    return s + '</svg>';
  }

  function kitchen(dirty) {
    var s = '<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">';
    s += '<rect width="600" height="400" fill="' + (dirty ? '#e4ded0' : '#f3faf8') + '"/>';
    // tiles
    s += '<rect x="0" y="120" width="600" height="130" fill="' + (dirty ? '#d9d3c2' : '#ffffff') + '"/>';
    s += '<g stroke="' + (dirty ? '#bdb39b' : '#d6ece8') + '" stroke-width="2">';
    for (var x = 0; x <= 600; x += 40) s += '<path d="M' + x + ' 120 V250"/>';
    for (var y = 120; y <= 250; y += 26) s += '<path d="M0 ' + y + ' H600"/>';
    s += '</g>';
    // upper cabinets
    s += '<rect x="0" y="0" width="190" height="110" fill="' + (dirty ? '#b9cfc8' : '#cdeee7') + '"/><rect x="410" y="0" width="190" height="110" fill="' + (dirty ? '#b9cfc8' : '#cdeee7') + '"/>';
    s += '<path d="M95 0 V110 M505 0 V110" stroke="' + (dirty ? '#a3bab3' : '#b5e1d8') + '" stroke-width="3"/>';
    s += '<g fill="#8a9d98"><rect x="80" y="86" width="6" height="16" rx="3"/><rect x="104" y="86" width="6" height="16" rx="3"/><rect x="490" y="86" width="6" height="16" rx="3"/><rect x="514" y="86" width="6" height="16" rx="3"/></g>';
    // hood
    s += '<path d="M240 0 H360 V60 L400 104 H200 L240 60z" fill="' + (dirty ? '#b8b3a6' : '#e3ecee') + '"/>';
    s += '<rect x="200" y="100" width="200" height="10" rx="3" fill="' + (dirty ? '#9f988a' : '#cbd8db') + '"/>';
    // counter + stove
    s += '<rect x="0" y="250" width="600" height="16" fill="' + (dirty ? '#a99d86' : '#d9c6a6') + '"/>';
    s += '<rect x="0" y="266" width="600" height="134" fill="' + (dirty ? '#b9cfc8' : '#cdeee7') + '"/>';
    s += '<rect x="200" y="244" width="200" height="14" rx="3" fill="#2b3a3d"/>';
    s += '<g fill="#475659"><ellipse cx="250" cy="248" rx="26" ry="4"/><ellipse cx="350" cy="248" rx="26" ry="4"/></g>';
    s += '<rect x="200" y="266" width="200" height="134" fill="' + (dirty ? '#bdb7aa' : '#e8eff0') + '"/>';
    s += '<rect x="220" y="300" width="160" height="80" rx="8" fill="' + (dirty ? '#3a2f22' : '#33474b') + '"/>';
    s += '<rect x="230" y="310" width="140" height="60" rx="5" fill="' + (dirty ? '#5a4632' : '#4f6a70') + '"/>';
    s += '<rect x="240" y="284" width="120" height="6" rx="3" fill="#8a9a9d"/>';
    s += '<g fill="#5d6f72"><circle cx="222" cy="280" r="4"/><circle cx="378" cy="280" r="4"/></g>';
    s += '<path d="M100 266 V400 M500 266 V400" stroke="' + (dirty ? '#a3bab3' : '#b5e1d8') + '" stroke-width="3"/>';
    s += '<g fill="#8a9d98"><rect x="86" y="280" width="6" height="16" rx="3"/><rect x="108" y="280" width="6" height="16" rx="3"/><rect x="486" y="280" width="6" height="16" rx="3"/><rect x="508" y="280" width="6" height="16" rx="3"/></g>';
    // shelf items
    s += '<rect x="470" y="210" width="26" height="40" rx="6" fill="' + (dirty ? '#b98b67' : '#ff8a5c') + '"/><rect x="504" y="222" width="22" height="28" rx="5" fill="' + (dirty ? '#a7a17f' : '#ffd27a') + '"/>';
    s += '<path d="M60 250 q0 -30 30 -30 q30 0 30 30z" fill="' + (dirty ? '#9aa36d' : '#4caf7a') + '"/>';
    if (dirty) {
      s += '<g fill="#8a6a3a" opacity=".42"><ellipse cx="270" cy="70" rx="22" ry="12"/><ellipse cx="330" cy="88" rx="30" ry="9"/><ellipse cx="300" cy="40" rx="14" ry="10"/></g>';
      s += '<g fill="#8a6a3a" opacity=".38">';
      for (var d = 0; d < 22; d++) s += '<circle cx="' + (190 + (d * 47) % 230) + '" cy="' + (140 + (d * 31) % 100) + '" r="' + (2 + d % 4) + '"/>';
      s += '</g>';
      s += '<g stroke="#7e6038" stroke-width="3" opacity=".45" stroke-linecap="round"><path d="M260 104 v18"/><path d="M330 104 v26"/><path d="M300 104 v12"/></g>';
      s += '<g fill="#2a2016" opacity=".55"><ellipse cx="270" cy="340" rx="30" ry="14"/><ellipse cx="330" cy="330" rx="24" ry="12"/></g>';
      s += '<ellipse cx="300" cy="252" rx="60" ry="5" fill="#5a3f22" opacity=".5"/>';
      // dishes
      s += '<g><ellipse cx="140" cy="248" rx="38" ry="7" fill="#e8e3d6"/><ellipse cx="142" cy="240" rx="34" ry="6" fill="#ddd6c5"/><ellipse cx="138" cy="232" rx="30" ry="6" fill="#e8e3d6"/><path d="M150 230 l30 -26" stroke="#9b8f78" stroke-width="4" stroke-linecap="round"/><ellipse cx="140" cy="232" rx="12" ry="2" fill="#b28a55" opacity=".6"/></g>';
      s += '<path d="M420 252 q10 -26 30 -20 q6 14 -4 20z" fill="#c9b493"/>';
      s += '<g fill="#a99d83" opacity=".5"><ellipse cx="80" cy="370" rx="22" ry="6"/><ellipse cx="560" cy="350" rx="16" ry="5"/></g>';
    } else {
      s += '<path d="M244 316 L280 316 L250 360 L234 360z" fill="#fff" opacity=".18"/>';
      s += '<path d="M250 10 L270 10 L232 96 L214 96z" fill="#fff" opacity=".5"/>';
      s += sparkle(300, 60, 12) + sparkle(380, 150, 9) + sparkle(250, 340, 10) + sparkle(150, 180, 8) + sparkle(520, 300, 10) + sparkle(60, 60, 8);
    }
    return s + '</svg>';
  }

  var scenes = { room: room, kitchen: kitchen };
  var ba = document.getElementById('ba');
  var before = document.getElementById('baBefore');
  var after = document.getElementById('baAfter');
  var range = ba.querySelector('.ba__range');
  function render(name) {
    before.innerHTML = scenes[name](true);
    after.innerHTML = scenes[name](false);
  }
  render('room');
  range.addEventListener('input', function () { ba.style.setProperty('--pos', range.value + '%'); });
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', on);
      });
      render(tab.dataset.scene);
    });
  });
  // небольшая подсказка: ползунок сам "проезжает" при первом показе
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var hinted = false;
    new IntersectionObserver(function (en, obs) {
      if (!en[0].isIntersecting || hinted) return;
      hinted = true; obs.disconnect();
      var t0 = null;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 1600, 1);
        var v = 50 + Math.sin(p * Math.PI * 2) * 22;
        ba.style.setProperty('--pos', v + '%'); range.value = v;
        if (p < 1) requestAnimationFrame(step);
      }
      setTimeout(function () { requestAnimationFrame(step); }, 500);
    }, { threshold: 0.6 }).observe(ba);
  }

  // ---------- калькулятор (условные цены, пример) ----------
  var RATES = {
    support: { label: 'Поддерживающая уборка', perM: 60, min: 2500 },
    general: { label: 'Генеральная уборка', perM: 120, min: 5000 },
    repair: { label: 'Уборка после ремонта', perM: 170, min: 7000 },
    house: { label: 'Уборка дома или дачи', perM: 140, min: 6000 }
  };
  var EXTRAS = {
    windows: { label: 'мытьё окон', price: 500 },
    balcony: { label: 'балкон или лоджия', price: 1000 },
    oven: { label: 'духовка', price: 1000 },
    fridge: { label: 'холодильник', price: 1000 },
    sofa: { label: 'химчистка дивана', price: 2500 }
  };
  var form = document.getElementById('calcForm');
  var area = document.getElementById('area');
  var areaOut = document.getElementById('areaOut');
  var sumEl = document.getElementById('sum');
  var winQty = document.getElementById('winQty');
  var winOut = document.getElementById('winOut');
  var windows = 3;

  function fmt(n) { return String(Math.round(n / 100) * 100).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function state() {
    var type = form.querySelector('input[name="type"]:checked').value;
    var extras = Array.prototype.map.call(form.querySelectorAll('input[name="extra"]:checked'), function (i) { return i.value; });
    var r = RATES[type];
    var total = Math.max(r.min, r.perM * +area.value);
    extras.forEach(function (e) { total += EXTRAS[e].price * (e === 'windows' ? windows : 1); });
    return { type: type, extras: extras, total: total };
  }
  function update() {
    areaOut.textContent = area.value + ' м²';
    var st = state();
    winQty.hidden = st.extras.indexOf('windows') < 0;
    var text = 'от ' + fmt(st.total) + ' руб.';
    if (sumEl.textContent !== text) {
      sumEl.textContent = text;
      sumEl.classList.remove('bump'); void sumEl.offsetWidth; sumEl.classList.add('bump');
    }
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  winQty.addEventListener('click', function (e) {
    var d = e.target.getAttribute('data-d');
    if (!d) return;
    e.preventDefault();
    windows = Math.min(20, Math.max(1, windows + +d));
    winOut.textContent = windows;
    update();
  });
  update();

  // сценарии: выбор типа уборки и переход к расчёту
  document.querySelectorAll('[data-pick]').forEach(function (b) {
    b.addEventListener('click', function () {
      var input = form.querySelector('input[name="type"][value="' + b.dataset.pick + '"]');
      if (input) { input.checked = true; update(); }
      document.getElementById('calc').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // phone mask
  var phone = document.getElementById('phone');
  phone.addEventListener('input', function () {
    var d = phone.value.replace(/\D/g, '');
    if (d[0] === '8') d = '7' + d.slice(1);
    if (d && d[0] !== '7') d = '7' + d;
    d = d.slice(0, 11);
    var o = '';
    if (d.length) o = '+7';
    if (d.length > 1) o += ' (' + d.slice(1, 4);
    if (d.length >= 4) o += ')';
    if (d.length > 4) o += ' ' + d.slice(4, 7);
    if (d.length > 7) o += '-' + d.slice(7, 9);
    if (d.length > 9) o += '-' + d.slice(9, 11);
    phone.value = o;
    phone.classList.remove('err');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var note = document.getElementById('formNote');
    var digits = phone.value.replace(/\D/g, '');
    if (digits.length !== 11) {
      phone.classList.add('err');
      note.textContent = 'Укажите телефон, чтобы менеджер мог перезвонить.';
      note.classList.add('err');
      phone.focus();
      return;
    }
    note.classList.remove('err');
    var st = state();
    var name = document.getElementById('name').value.trim();
    var lines = [
      'Здравствуйте! Хочу заказать уборку.',
      RATES[st.type].label + ', ' + area.value + ' м²'
    ];
    if (st.extras.length) lines.push('Дополнительно: ' + st.extras.map(function (x) { return EXTRAS[x].label + (x === 'windows' ? ' (' + windows + ' шт.)' : ''); }).join(', '));
    lines.push('Расчёт на сайте: от ' + fmt(st.total) + ' руб.');
    lines.push((name ? name + ', ' : '') + 'телефон ' + phone.value);
    note.textContent = 'Открываем WhatsApp с готовым сообщением...';
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });
})();
