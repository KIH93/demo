/* Линия ремонта, вариант 2. Иллюстрации: оригинальные SVG-сцены, рисуются здесь. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var PAL = {
    stone: { wall: "#EDE8E3", floor: "#B8A898", sky: "#E6ECEE", a: "#78716C", b: "#D9A15B", rug: "#F3EEE9", cab: "#FAF7F4", top: "#44403C", tile: "#FFFFFF" },
    sand:  { wall: "#F3ECE1", floor: "#D2BFA6", sky: "#E2ECEF", a: "#A8A29E", b: "#D97706", rug: "#FAF5F2", cab: "#FFFFFF", top: "#78716C", tile: "#EDE8E3" },
    night: { wall: "#E7E5E4", floor: "#8C8079", sky: "#DDE5E8", a: "#292524", b: "#D9A15B", rug: "#D6D3D1", cab: "#292524", top: "#D9A15B", tile: "#F5F5F4" },
    warm:  { wall: "#F5EFE8", floor: "#C4A484", sky: "#E3EBEE", a: "#B45309", b: "#E7E5E4", rug: "#EDE8E3", cab: "#F5F5F4", top: "#1C1917", tile: "#FFFFFF" },
    pale:  { wall: "#F4F1EE", floor: "#CFC3B5", sky: "#E8EEF0", a: "#D6D3D1", b: "#78716C", rug: "#FAF5F2", cab: "#FFFFFF", top: "#78716C", tile: "#F5F5F4" }
  };
  var S = 'stroke="#1C1917" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"';

  function room(p, back) {
    var planks = "";
    for (var i = 0; i < 6; i++) planks += '<path d="M' + (i * 80 - 40) + ' 300 L' + (150 + i * 20) + ' 212" stroke="rgba(0,0,0,.07)"/>';
    return '<rect width="400" height="212" fill="' + p.wall + '"/>' +
      '<rect y="210" width="400" height="90" fill="' + p.floor + '"/>' + planks +
      '<rect y="205" width="400" height="7" fill="#fff" ' + S + '/>' + (back || "");
  }
  function plant(x, y) {
    return '<path d="M' + x + ' ' + y + 'c-14-18-10-36 0-44 10 8 14 26 0 44zM' + x + ' ' + y + 'c-24-6-30-22-26-30 10 0 24 12 26 30zM' + x + ' ' + y + 'c24-6 30-22 26-30-10 0-24 12-26 30z" fill="#7C8B6F" ' + S + '/>' +
      '<path d="M' + (x - 13) + ' ' + y + 'h26l-4 26h-18z" fill="#f4efe7" ' + S + '/>';
  }
  function windowAt(x, y, w, h, p, cols) {
    var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + p.sky + '" ' + S + '/>';
    cols = cols || 2;
    for (var i = 1; i < cols; i++) s += '<path d="M' + (x + w * i / cols) + ' ' + y + 'v' + h + '" ' + S + '/>';
    s += '<path d="M' + (x + 8) + ' ' + (y + h - 14) + 'l' + (w * .35) + '-' + (h * .45) + '" stroke="#fff" stroke-width="5" opacity=".6"/>';
    return s;
  }

  var SCENES = {
    living: function (p) {
      return room(p) + windowAt(36, 36, 96, 128, p) +
        '<rect x="226" y="56" width="74" height="52" fill="' + p.b + '" ' + S + '/><path d="M236 98l16-22 12 14 10-8 16 16" fill="none" ' + S + '/>' +
        '<ellipse cx="262" cy="258" rx="128" ry="20" fill="' + p.rug + '"/>' +
        '<rect x="176" y="128" width="186" height="40" rx="12" fill="' + p.a + '" ' + S + '/>' +
        '<rect x="168" y="152" width="202" height="46" rx="12" fill="' + p.a + '" ' + S + '/>' +
        '<path d="M232 158v36M300 158v36M184 198v10M354 198v10" ' + S + '/>' +
        '<rect x="196" y="140" width="34" height="24" rx="8" fill="' + p.b + '" ' + S + '/>' +
        '<rect x="222" y="226" width="86" height="8" rx="3" fill="#fff" ' + S + '/><path d="M234 234v16M296 234v16" ' + S + '/>' +
        '<path d="M384 210V96M370 96h28l-6-26h-16z" fill="#fff" ' + S + '/>' + plant(70, 204);
    },
    kitchen: function (p) {
      var s = room(p) + '<rect x="28" y="96" width="250" height="40" fill="' + p.tile + '" ' + S + '/>';
      for (var x = 48; x < 278; x += 20) s += '<path d="M' + x + ' 96v40" stroke="rgba(0,0,0,.08)"/>';
      s += '<path d="M28 116h250" stroke="rgba(0,0,0,.08)"/>';
      s += '<rect x="28" y="34" width="250" height="62" fill="' + p.cab + '" ' + S + '/><path d="M90 34v62M152 34v62M214 34v62M80 80h6M142 80h6M204 80h6M266 80h-6" ' + S + '/>';
      s += '<rect x="24" y="134" width="258" height="8" fill="' + p.top + '" ' + S + '/><rect x="28" y="142" width="250" height="66" fill="' + p.cab + '" ' + S + '/><path d="M90 142v66M152 142v66M214 142v66M80 152h6M142 152h6" ' + S + '/>';
      s += '<path d="M176 126h50M196 126v-14h10" fill="none" ' + S + '/><rect x="44" y="128" width="40" height="6" fill="#1C1917"/>';
      s += '<rect x="292" y="28" width="66" height="180" rx="4" fill="#e6e2db" ' + S + '/><path d="M292 96h66M300 60v20M300 110v30" ' + S + '/>';
      s += '<rect x="110" y="222" width="190" height="62" fill="' + p.cab + '" ' + S + '/><rect x="104" y="214" width="202" height="9" fill="' + p.top + '" ' + S + '/>';
      s += '<path d="M170 0v176M250 0v176" stroke="#1C1917" stroke-width="1"/><path d="M156 176a14 12 0 0 1 28 0zM236 176a14 12 0 0 1 28 0z" fill="' + p.b + '" ' + S + '/>';
      return s + plant(374, 206);
    },
    bedroom: function (p) {
      return room(p, '<rect width="400" height="14" fill="#fff"/><path d="M0 14h400" stroke="#fff6cf" stroke-width="5"/><path d="M0 16.5h400" stroke="rgba(0,0,0,.08)"/>') +
        '<rect x="168" y="44" width="76" height="50" fill="' + p.b + '" ' + S + '/><path d="M180 84c14-26 34-26 52 0" fill="none" ' + S + '/>' +
        '<rect x="104" y="104" width="204" height="70" rx="10" fill="' + p.a + '" ' + S + '/>' +
        '<rect x="88" y="160" width="236" height="50" rx="8" fill="#fff" ' + S + '/>' +
        '<path d="M88 176h236v26a8 8 0 0 1-8 8H96a8 8 0 0 1-8-8z" fill="' + p.b + '" ' + S + '/>' +
        '<rect x="126" y="134" width="70" height="30" rx="10" fill="#fff" ' + S + '/><rect x="214" y="134" width="70" height="30" rx="10" fill="#fff" ' + S + '/>' +
        '<rect x="40" y="168" width="40" height="40" fill="' + p.cab + '" ' + S + '/><rect x="332" y="168" width="40" height="40" fill="' + p.cab + '" ' + S + '/>' +
        '<path d="M60 168v-22M50 146h20l-4-18h-12zM352 168v-22M342 146h20l-4-18h-12z" fill="#fff6cf" ' + S + '/>' +
        '<ellipse cx="206" cy="262" rx="150" ry="16" fill="' + p.rug + '"/>';
    },
    office: function (p) {
      var s = room(p) + windowAt(26, 26, 348, 112, p, 4);
      [[34, 0], [214, 1]].forEach(function (d) {
        var x = d[0];
        s += '<rect x="' + (x + 44) + '" y="134" width="56" height="34" rx="3" fill="#1C1917" ' + S + '/><path d="M' + (x + 72) + ' 168v6" ' + S + '/>';
        s += '<rect x="' + x + '" y="174" width="150" height="8" fill="' + p.top + '" ' + S + '/><path d="M' + (x + 8) + ' 182v28M' + (x + 142) + ' 182v28" ' + S + '/>';
        s += '<path d="M' + (x + 52) + ' 236h40M' + (x + 72) + ' 236v-14M' + (x + 56) + ' 222h32v-30a4 4 0 0 0-4-4h-24a4 4 0 0 0-4 4z" fill="' + p.a + '" ' + S + '/>';
        s += '<path d="M' + (x + 58) + ' 250l14-14 14 14" fill="none" ' + S + '/>';
      });
      return s + plant(196, 206);
    },
    house: function (p) {
      var s = room(p) + '<rect x="206" y="14" width="168" height="196" fill="' + p.sky + '" ' + S + '/>';
      s += '<path d="M262 14v196M318 14v196M206 80h168M206 146h168" ' + S + '/><path d="M220 196l60-90" stroke="#fff" stroke-width="7" opacity=".6"/>';
      var st = "M20 212";
      for (var i = 0; i < 7; i++) st += "h22v-24";
      s += '<path d="' + st + 'h20V212z" fill="' + p.b + '" ' + S + '/><path d="M20 160L174 40" stroke="#1C1917" stroke-width="1.6"/>';
      s += '<path d="M290 0v40M270 40h40M276 40v10M290 40v14M304 40v10" ' + S + '/><circle cx="276" cy="54" r="4" fill="#fff6cf" ' + S + '/><circle cx="290" cy="58" r="4" fill="#fff6cf" ' + S + '/><circle cx="304" cy="54" r="4" fill="#fff6cf" ' + S + '/>';
      s += '<ellipse cx="260" cy="262" rx="130" ry="18" fill="' + p.rug + '"/>';
      s += '<rect x="170" y="196" width="190" height="44" rx="10" fill="' + p.a + '" ' + S + '/><rect x="170" y="176" width="190" height="30" rx="10" fill="' + p.a + '" ' + S + '/>';
      return s;
    },
    raw: function (p, seed) {
      var r = rnd(seed || 7), s = '<rect width="400" height="212" fill="#bdb7ae"/><rect y="210" width="400" height="90" fill="#a59e93"/>';
      for (var i = 0; i < 70; i++) s += '<circle cx="' + (r() * 400).toFixed(1) + '" cy="' + (r() * 300).toFixed(1) + '" r="' + (r() * 1.6 + .4).toFixed(1) + '" fill="rgba(60,55,50,' + (r() * .25 + .1).toFixed(2) + ')"/>';
      s += '<path d="M0 212h400" stroke="rgba(0,0,0,.2)" stroke-width="2"/>';
      s += '<rect x="36" y="36" width="96" height="128" fill="#d6dfe1" opacity=".85" ' + S + '/><path d="M36 36l96 128M132 36L36 164" stroke="rgba(0,0,0,.08)" stroke-width="2"/>';
      s += '<path d="M170 0c0 30 10 40 0 70M240 0c4 20-12 34 2 52" fill="none" stroke="#23262b" stroke-width="2"/><circle cx="170" cy="72" r="4" fill="#d9b48f" ' + S + '/>';
      s += '<rect x="292" y="108" width="16" height="16" fill="#e8e4dc" ' + S + '/><path d="M300 124c0 20 18 30 14 60" fill="none" stroke="#c0392b" stroke-width="2"/>';
      s += '<path d="M200 214l26-120M232 214l-6-120M204 196h26M209 172h22M214 148h18M219 124h12" ' + S + '/>';
      s += '<path d="M320 254h44l-6 34h-32z" fill="#e8e4dc" ' + S + '/><path d="M320 254c4-10 40-10 44 0" fill="none" ' + S + '/>';
      s += '<path d="M60 284l16-34h46l10 34z" fill="#ddd2bf" ' + S + '/><path d="M80 262h36" stroke="rgba(0,0,0,.2)"/>';
      if (p && p.tag) s += p.tag;
      return s;
    }
  };
  function rnd(seed) { var x = seed; return function () { x = (x * 9301 + 49297) % 233280; return x / 233280; }; }
  function svg(scene, pal, extra) {
    return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none">' + SCENES[scene](PAL[pal] || {}, extra) + "</svg>";
  }


  /* ---------- pictures ---------- */
  $("#heroPic").innerHTML = svg("living", "stone").replace('viewBox="0 0 400 300"', 'viewBox="60 0 280 300"');
  $("#camPic").innerHTML = '<svg viewBox="0 50 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + SCENES.raw({}, 23) + "</svg>";
  $("#baBefore").innerHTML = svg("raw", "", 11);
  $("#baAfter").innerHTML = svg("living", "sand");

  /* ---------- menu ---------- */
  var menuBtn = $(".menu-btn"), menu = $("#menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.textContent = open ? "Закрыть" : "Меню";
    document.body.style.overflow = open ? "hidden" : "";
  }
  menuBtn.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });

  /* ---------- steps ---------- */
  var STEPS = [
    ["Замер и смета", "Приезжаем, обмеряем, смотрим стены, инженерию и окна. Считаем смету под ваш объект.", "показать объект", "1-3 дня"],
    ["Дизайн-проект", "Планировка, стиль, материалы и визуализация. Работаем сами или с вашим дизайнером.", "выбрать планировку и стиль", "2-4 недели"],
    ["Технический проект", "Розетки, выводы под технику, свет, вентиляция, электрика, тёплые полы. То, что сложнее всего переделать.", "сказать, где будет техника", "1-2 недели"],
    ["Договор и закупка", "Фиксируем смету и этапы. Материалы согласуете по ссылкам, фото и видео, привозим сами.", "согласовать позиции", "параллельно"],
    ["Черновые работы", "Перегородки, стяжка, штукатурка, электрика, сантехника, отопление.", "смотреть отчёты", "4-6 недель"],
    ["Чистовая отделка", "Плитка, полы, покраска, двери, потолки. Готовые поверхности укрываем защитой до конца работ.", "принять этапы по видео", "4-6 недель"],
    ["Приёмка и ключи", "Проходим объект вместе, устраняем замечания, сопровождаем до завоза мебели.", "забрать ключи", "1-3 дня"]
  ];
  var stepsEl = $("#steps");
  STEPS.forEach(function (s, i) {
    var li = document.createElement("li");
    li.className = "step rv";
    li.innerHTML = '<span class="sn">0' + (i + 1) + '</span><div class="body"><h3>' + s[0] + "</h3><p>" + s[1] + '</p></div><div class="meta"><span><b>От вас:</b> ' + s[2] + '</span><span class="t"><b>Срок:</b> ' + s[3] + " (пример)</span></div>";
    stepsEl.appendChild(li);
  });

  /* ---------- works ---------- */
  var WORKS = [
    ["flat", "living", "stone", "Двухкомнатная в новостройке", "62 м² · дизайн и ремонт"],
    ["flat", "kitchen", "night", "Кухня-гостиная с островом", "38 м² · под ключ"],
    ["flat", "bedroom", "sand", "Спальня с подсветкой потолка", "14 м² · натяжной потолок"],
    ["house", "house", "warm", "Коттедж, гостиная со вторым светом", "180 м² · техпроект и ремонт"],
    ["office", "office", "pale", "Офис в центре Казани", "70 м² · свет и сети"],
    ["rent", "living", "pale", "Квартира под аренду", "49 м² · практичные материалы"]
  ];
  var worksEl = $("#works");
  WORKS.forEach(function (w) {
    var f = document.createElement("figure");
    f.className = "work rv"; f.dataset.f = w[0];
    f.innerHTML = '<div class="pic">' + svg(w[1], w[2]) + '<span class="ex">пример</span></div><figcaption><b>' + w[3] + "</b><span>" + w[4] + "</span></figcaption>";
    worksEl.appendChild(f);
  });
  $$(".filters button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".filters button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      var n = 0;
      $$(".work", worksEl).forEach(function (w) {
        var show = b.dataset.f === "all" || w.dataset.f === b.dataset.f;
        w.hidden = !show; if (show) { n++; w.classList.add("in"); }
      });
      $("#worksStatus").textContent = "Показано работ: " + n;
    });
  });

  /* ---------- problem switch ---------- */
  var prob = $("#problem");
  $$(".switch button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".switch button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      prob.classList.toggle("ours", b.dataset.mode === "ours");
    });
  });

  /* ---------- before / after ---------- */
  var ba = $("#ba"), range = $("#baRange"), baBtns = $$(".ba-ctrl button");
  function setBA(v, fromRange) {
    ba.style.setProperty("--pos", v + "%");
    if (!fromRange) range.value = v;
    baBtns.forEach(function (x) { x.setAttribute("aria-pressed", +x.dataset.pos === +v); });
    range.setAttribute("aria-valuetext", v + "% до");
  }
  range.addEventListener("input", function () { ba.classList.add("drag"); setBA(range.value, true); });
  range.addEventListener("change", function () { ba.classList.remove("drag"); });
  baBtns.forEach(function (b) { b.addEventListener("click", function () { ba.classList.remove("drag"); setBA(b.dataset.pos); }); });

  /* ---------- remote feed (pausable) ---------- */
  var MSGS = [
    "<small>Прораб · 09:12</small>Доброе утро. Сегодня разводим электрику в спальне по техпроекту.",
    '<small>Прораб · 13:40</small>Выводы под ТВ и кондиционер готовы, фото:<span class="ph"><i></i><i></i><i></i></span>',
    "<small>Снабжение · 15:05</small>Нужно согласовать плитку в санузел, отправил два варианта.",
    "Берём второй вариант, спасибо.",
    "<small>Снабжение · 15:20</small>Принято. Привезём в четверг и примем сами.",
    '<small>Прораб · 18:30</small>Итог дня, видеообзор 0:48<span class="ph"><i></i></span>',
    "Созвонимся в 19:00 по смете?",
    "<small>Прораб · 18:42</small>Да, наберу в 19:00."
  ];
  var feed = $("#feed"), mi = 0, paused = reduce, pauseBtn = $("#feedPause");
  function pushMsg() {
    var h = MSGS[mi++ % MSGS.length], el = document.createElement("div");
    el.className = "msg" + (h.indexOf("<small>") === 0 ? "" : " me");
    el.innerHTML = h;
    feed.appendChild(el);
    while (feed.children.length > 4) feed.removeChild(feed.firstChild);
  }
  pushMsg(); pushMsg(); pushMsg();
  function setPause(p) {
    paused = p;
    pauseBtn.setAttribute("aria-pressed", p);
    pauseBtn.setAttribute("aria-label", p ? "Запустить ленту" : "Остановить ленту");
    pauseBtn.innerHTML = p ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  }
  setPause(paused);
  pauseBtn.addEventListener("click", function () { setPause(!paused); });
  setInterval(function () {
    if (paused || document.hidden) return;
    var r = feed.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) pushMsg();
  }, 2800);
  function clock() {
    var d = new Date(), p = function (n) { return (n < 10 ? "0" : "") + n; };
    $("#camTime").textContent = p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  }
  clock(); setInterval(clock, 1000);

  /* ---------- form ---------- */
  var form = $("#form"), phone = $("#phone"), nameIn = $("#name"), sum = $("#errSum");
  phone.addEventListener("input", function () {
    var d = phone.value.replace(/\D/g, "");
    if (d.charAt(0) === "8") d = "7" + d.slice(1);
    if (d && d.charAt(0) !== "7") d = "7" + d;
    d = d.slice(0, 11);
    var o = d ? "+7" : "";
    if (d.length > 1) o += " (" + d.slice(1, 4);
    if (d.length >= 4) o += ") " + d.slice(4, 7);
    if (d.length >= 7) o += "-" + d.slice(7, 9);
    if (d.length >= 9) o += "-" + d.slice(9, 11);
    phone.value = o;
    if (d.length === 11) mark("fPhone", true);
  });
  function mark(id, ok) {
    var f = $("#" + id); f.classList.toggle("bad", !ok);
    $("input", f).setAttribute("aria-invalid", !ok);
  }
  nameIn.addEventListener("blur", function () { if (nameIn.value.trim()) mark("fName", true); });
  phone.addEventListener("blur", function () { if (phone.value) mark("fPhone", phone.value.replace(/\D/g, "").length === 11); });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var errs = [], okName = !!nameIn.value.trim(), okPhone = phone.value.replace(/\D/g, "").length === 11;
    mark("fName", okName); mark("fPhone", okPhone);
    if (!okName) errs.push('<a href="#name">укажите имя</a>');
    if (!okPhone) errs.push('<a href="#phone">введите телефон полностью</a>');
    if (errs.length) {
      sum.innerHTML = "Проверьте форму: " + errs.join(", ");
      sum.classList.add("show"); sum.focus();
      return;
    }
    sum.classList.remove("show");
    form.classList.add("sent");
    var done = $(".done", form); done.setAttribute("tabindex", "-1"); done.focus();
  });

  /* ---------- scroll: reveal, progress, chapters, active step, sticky CTA ---------- */
  var chapters = $$("[data-chapter]"), chLinks = $$(".chapters a"), navLinks = $$(".nav a"), steps = $$(".step"), sticky = $("#sticky"), prog = $("#progress"), climax = $("#contact");
  function onScroll() {
    var vh = innerHeight, y = scrollY, max = document.documentElement.scrollHeight - vh;
    prog.style.width = (max > 0 ? y / max * 100 : 0) + "%";
    $$(".rv:not(.in)").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh - 24 && r.bottom > 0) el.classList.add("in");
    });
    var cur = chapters[0];
    chapters.forEach(function (c) { if (c.getBoundingClientRect().top < vh * .4) cur = c; });
    chLinks.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + cur.id); });
    navLinks.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + cur.id;
      a.classList.toggle("on", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    var best = null, bd = 1e9;
    steps.forEach(function (s) {
      var r = s.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - vh / 2);
      if (d < bd && r.bottom > 0 && r.top < vh) { bd = d; best = s; }
    });
    steps.forEach(function (s) { s.classList.toggle("active", s === best); });
    sticky.classList.toggle("show", y > vh * .8 && climax.getBoundingClientRect().top > vh * .6);
  }
  var ticking = false;
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); } }, { passive: true });
  addEventListener("resize", onScroll);
  addEventListener("load", onScroll);
  onScroll(); setTimeout(onScroll, 80);
})();
