/* Линия ремонта: демо. Все иллюстрации рисуются здесь в SVG (оригинальная графика). */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- palettes & scenes ---------- */
  var PAL = {
    warm:  { wall: "#efe6da", floor: "#c9a27a", sky: "#dfe9ec", a: "#7d8b74", b: "#d9b48f", rug: "#e6dccd", cab: "#f4efe7", top: "#3a3f46", tile: "#e9e4dc" },
    green: { wall: "#e4ebe4", floor: "#b48d68", sky: "#e3edf0", a: "#2f6e55", b: "#e8c9a0", rug: "#f1ece3", cab: "#2f6e55", top: "#f4efe7", tile: "#ffffff" },
    gray:  { wall: "#e9e7e3", floor: "#8e8a84", sky: "#dde6ea", a: "#3f454d", b: "#c9a27a", rug: "#d8d3cb", cab: "#3f454d", top: "#c9a27a", tile: "#f2f0ec" },
    sand:  { wall: "#f3ece1", floor: "#d8bf9c", sky: "#e2ecef", a: "#b9875e", b: "#6f8f8a", rug: "#efe5d6", cab: "#fbf8f3", top: "#b9875e", tile: "#e6ddd0" },
    mint:  { wall: "#eef1ec", floor: "#bfa58a", sky: "#e1ecee", a: "#8fb9a3", b: "#23262b", rug: "#e9e4da", cab: "#ffffff", top: "#23262b", tile: "#dfe9e3" }
  };
  var S = 'stroke="#2b2e33" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"';

  function room(p, back) {
    var planks = "";
    for (var i = 0; i < 6; i++) planks += '<path d="M' + (i * 80 - 40) + ' 300 L' + (150 + i * 20) + ' 212" stroke="rgba(0,0,0,.07)"/>';
    return '<rect width="400" height="212" fill="' + p.wall + '"/>' +
      '<rect y="210" width="400" height="90" fill="' + p.floor + '"/>' + planks +
      '<rect y="205" width="400" height="7" fill="#fff" ' + S + '/>' + (back || "");
  }
  function plant(x, y) {
    return '<path d="M' + x + ' ' + y + 'c-14-18-10-36 0-44 10 8 14 26 0 44zM' + x + ' ' + y + 'c-24-6-30-22-26-30 10 0 24 12 26 30zM' + x + ' ' + y + 'c24-6 30-22 26-30-10 0-24 12-26 30z" fill="#5f9b78" ' + S + '/>' +
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
      s += '<path d="M176 126h50M196 126v-14h10" fill="none" ' + S + '/><rect x="44" y="128" width="40" height="6" fill="#2b2e33"/>';
      s += '<rect x="292" y="28" width="66" height="180" rx="4" fill="#e6e2db" ' + S + '/><path d="M292 96h66M300 60v20M300 110v30" ' + S + '/>';
      s += '<rect x="110" y="222" width="190" height="62" fill="' + p.cab + '" ' + S + '/><rect x="104" y="214" width="202" height="9" fill="' + p.top + '" ' + S + '/>';
      s += '<path d="M170 0v176M250 0v176" stroke="#2b2e33" stroke-width="1"/><path d="M156 176a14 12 0 0 1 28 0zM236 176a14 12 0 0 1 28 0z" fill="' + p.b + '" ' + S + '/>';
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
        s += '<rect x="' + (x + 44) + '" y="134" width="56" height="34" rx="3" fill="#2b2e33" ' + S + '/><path d="M' + (x + 72) + ' 168v6" ' + S + '/>';
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
      s += '<path d="' + st + 'h20V212z" fill="' + p.b + '" ' + S + '/><path d="M20 160L174 40" stroke="#2b2e33" stroke-width="1.6"/>';
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

  /* ---------- header, menu, scroll line ---------- */
  var header = $(".header"), fill = $("#scrollFill");
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle("scrolled", y > 8);
    if (fill) fill.style.height = (h > 0 ? y / h * 100 : 0) + "%";
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  var burger = $(".burger");
  burger.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", open);
  });
  $$("#mobileMenu a").forEach(function (a) { a.addEventListener("click", function () { document.body.classList.remove("menu-open"); burger.setAttribute("aria-expanded", false); }); });

  /* ---------- reveal (scroll check, works even where IntersectionObserver is throttled) ---------- */
  var watchers = [];
  function onVisible(el, fn, part) { watchers.push({ el: el, fn: fn, part: part || .15 }); checkVisible(); }
  function checkVisible() {
    var vh = innerHeight;
    $$(".rv:not(.in)").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh - 30 && r.bottom > 0) el.classList.add("in");
    });
    watchers = watchers.filter(function (w) {
      var r = w.el.getBoundingClientRect();
      if (r.top < vh * (1 - w.part) && r.bottom > 0) { w.fn(); return false; }
      return true;
    });
  }
  var ticking = false;
  function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; checkVisible(); }); } }
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  addEventListener("load", checkVisible);
  setTimeout(checkVisible, 60);

  /* nav highlight */
  var navLinks = $$(".nav a");
  var secIo = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      navLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(function (s) { secIo.observe(s); });

  /* ---------- hero line drawing ---------- */
  $$(".draw").forEach(function (p) {
    if (p.getTotalLength && !p.style.getPropertyValue("--len")) {
      try { p.style.setProperty("--len", Math.ceil(p.getTotalLength()) + 1); } catch (e) {}
    }
  });
  requestAnimationFrame(function () { setTimeout(function () { document.body.classList.add("drawn"); }, 150); });

  /* ---------- process ---------- */
  var STAGES = [
    { t: "Замер и смета", d: "Приезжаем на объект, обмеряем, смотрим стены, инженерию и окна. Цену по телефону не называем: честнее посчитать на месте.", l: ["бесплатный выезд на замер", "подробная смета под ваш объект", "ответы на все вопросы на месте"], you: "показать объект и рассказать, каким видите ремонт", time: "1-3 дня" },
    { t: "Дизайн-проект", d: "Продумываем планировку, стиль и материалы. Работаем сами или в связке с вашим дизайнером.", l: ["планировочное решение", "подбор отделки и мебели", "визуализация помещений"], you: "выбрать вариант планировки и стиль", time: "2-4 недели" },
    { t: "Технический проект", d: "До начала работ решаем всю \"начинку\". Это то, что потом не видно, но что сложнее всего переделать.", l: ["розетки и выводы под технику", "свет, вентиляция, электрика", "тёплые полы и сантехника"], you: "сказать, какая техника и где будет стоять", time: "1-2 недели" },
    { t: "Договор и закупка", d: "Фиксируем смету, этапы и сроки. Подбираем материалы, вы согласуете их по ссылкам, фото и видео.", l: ["цена в договоре не растёт", "закупка и доставка нашими силами", "приёмка материалов прорабом"], you: "согласовать позиции в мессенджере", time: "параллельно" },
    { t: "Черновые работы", d: "Перегородки, стяжка, штукатурка, инженерные сети. Готовим основу, на которой держится вся отделка.", l: ["перегородки и проёмы", "электрика, сантехника, отопление", "выравнивание стен и пола"], you: "смотреть отчёты и камеры", time: "4-6 недель" },
    { t: "Чистовая отделка", d: "Плитка, покраска, полы, двери, потолки. Готовые поверхности сразу закрываем защитой до конца работ.", l: ["защита пола, дверей и ванны", "натяжные потолки и свет", "установка дверей и сантехники"], you: "принять промежуточные этапы по видео", time: "4-6 недель" },
    { t: "Приёмка и ключи", d: "Проходим объект вместе, устраняем замечания и сопровождаем до завоза мебели.", l: ["совместная приёмка по чек-листу", "уборка после ремонта", "помощь до завоза мебели"], you: "забрать ключи и заезжать", time: "1-3 дня" }
  ];
  var stagesEl = $("#stages"), panel = $("#stagePanel"), sFill = $("#stagesFill"), cur = 0, auto = null;
  STAGES.forEach(function (s, i) {
    var li = document.createElement("li");
    li.innerHTML = '<button class="stage-btn" type="button"><span class="dot">' + (i + 1) + '</span><span class="t">' + s.t + "</span></button>";
    li.firstChild.addEventListener("click", function () { stopAuto(); setStage(i); if (innerWidth < 1000) panel.scrollIntoView({ behavior: "smooth", block: "nearest" }); });
    stagesEl.appendChild(li);
  });
  function setStage(i) {
    cur = (i + STAGES.length) % STAGES.length;
    var s = STAGES[cur];
    $$(".stage-btn", stagesEl).forEach(function (b, k) { b.classList.toggle("active", k === cur); b.classList.toggle("done", k < cur); });
    var btns = $$(".stage-btn", stagesEl);
    if (btns[cur]) sFill.style.height = (btns[cur].offsetTop + 10) + "px";
    panel.innerHTML = '<span class="sp-num">0' + (cur + 1) + '</span><div class="sp-body"><span class="tag" style="color:#7fd8a8">Этап ' + (cur + 1) + " из " + STAGES.length + "</span><h3>" + s.t + "</h3><p>" + s.d + "</p><ul>" +
      s.l.map(function (x) { return "<li>" + x + "</li>"; }).join("") + '</ul><div class="sp-meta"><span class="chip">От вас: ' + s.you + '</span><span class="chip ex2">Срок: ' + s.time + ' (пример)</span></div></div>' +
      '<div class="sp-nav"><button type="button" aria-label="Предыдущий этап" data-d="-1">←</button><button type="button" aria-label="Следующий этап" data-d="1">→</button></div>';
    $$(".sp-nav button", panel).forEach(function (b) { b.addEventListener("click", function () { stopAuto(); setStage(cur + +b.dataset.d); }); });
  }
  function stopAuto() { if (auto) { clearInterval(auto); auto = null; } }
  setStage(0);
  if (!reduce) {
    var pIo = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && !auto && cur === 0) auto = setInterval(function () { cur < STAGES.length - 1 ? setStage(cur + 1) : stopAuto(); }, 4200);
      if (!es[0].isIntersecting) stopAuto();
    }, { threshold: .5 });
    pIo.observe(panel);
  }

  var ORDER = [
    ["Окна", "сначала тёплый контур"], ["Перегородки", "задаём планировку"], ["Черновые", "штукатурка и стяжка"], ["Отопление", "радиаторы и тёплый пол"],
    ["Сантехника", "разводка и выводы"], ["Электрика", "по техпроекту"], ["Кондиционер", "трасса до отделки"], ["Гипсокартон", "короба и ниши"],
    ["Чистовая", "плитка и полы"], ["Двери", "после грязных работ"], ["Покраска", "финишный слой"], ["Мебель", "кухня и шкафы"], ["Декор", "свет, текстиль, мелочи"]
  ];
  var ol = $("#orderLine");
  ORDER.forEach(function (o, i) {
    var d = document.createElement("div");
    d.className = "ol-item";
    d.innerHTML = '<span class="n" style="--dl:' + (i * .16).toFixed(2) + 's">' + (i + 1) + "</span><b>" + o[0] + "</b><small>" + o[1] + "</small>";
    ol.appendChild(d);
  });
  onVisible($("#order"), function () { $("#order").classList.add("in"); }, .3);

  /* ---------- remote phone ---------- */
  var camView = $("#camView"), camSeeds = [7, 23, 51];
  function camShow(i) { camView.innerHTML = '<svg viewBox="0 30 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + SCENES.raw({}, camSeeds[i]) + "</svg>"; }
  camShow(0);
  $$("#camTabs button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$("#camTabs button").forEach(function (x) { x.classList.toggle("on", x === b); });
      camShow(+b.dataset.cam);
    });
  });
  function tick() {
    var d = new Date(), p = function (n) { return (n < 10 ? "0" : "") + n; };
    $("#camTime").textContent = p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
    $("#phClock").textContent = d.getHours() + ":" + p(d.getMinutes());
  }
  tick(); setInterval(tick, 1000);

  var MSGS = [
    '<small>Прораб · 09:12</small>Доброе утро! Сегодня разводим электрику в спальне по техпроекту.',
    '<small>Прораб · 13:40</small>Выводы под ТВ и кондиционер готовы, фото:<div class="thumbs"><span></span><span></span><span class="v"></span></div>',
    '<small>Снабжение · 15:05</small>Нужно согласовать плитку в санузел, два варианта:<div class="opts"><span>Вариант А</span><span>Вариант Б</span></div>',
    'Берём вариант Б 👍',
    '<small>Снабжение · 15:20</small>Принято. Привезём в четверг, примем сами.',
    '<small>Прораб · 18:30</small>Итог дня: видеообзор 0:48<div class="thumbs"><span class="v"></span></div>',
    'Созвонимся в 19:00 по смете?',
    '<small>Прораб · 18:42</small>Да, наберу в 19:00 💚'
  ];
  var feed = $("#feed"), mi = 0, feedOn = false;
  function pushMsg() {
    var html = MSGS[mi % MSGS.length], el = document.createElement("div");
    el.className = "msg" + (html.charAt(0) !== "<" ? " me" : "");
    el.innerHTML = html;
    feed.appendChild(el);
    while (feed.children.length > 4) feed.removeChild(feed.firstChild);
    mi++;
  }
  for (var k = 0; k < 2; k++) pushMsg();
  if (!reduce) setInterval(function () { if (!document.hidden) pushMsg(); }, 2600);

  /* ---------- before / after ---------- */
  $("#baBefore").innerHTML = svg("raw", "", 11);
  $("#baAfter").innerHTML = svg("living", "warm");
  var ba = $("#ba"), rng = $("input", ba);
  rng.addEventListener("input", function () { ba.style.setProperty("--pos", rng.value + "%"); });
  if (!reduce) {
    onVisible(ba, function () {
      var t0 = null;
      (function step(t) {
        if (!t0) t0 = t;
        var k = Math.min((t - t0) / 1800, 1), v = 50 + Math.sin(k * Math.PI * 2) * 22;
        ba.style.setProperty("--pos", v + "%"); rng.value = v;
        if (k < 1) requestAnimationFrame(step);
      })(performance.now());
    }, .4);
  }

  /* ---------- portfolio ---------- */
  var WORKS = [
    { f: "flat", s: "living", p: "warm", t: "Двухкомнатная в новостройке", m: ["62 м²", "дизайн + ремонт"] },
    { f: "flat", s: "kitchen", p: "green", t: "Кухня-гостиная с островом", m: ["38 м²", "под ключ"] },
    { f: "flat", s: "bedroom", p: "sand", t: "Спальня с подсветкой потолка", m: ["14 м²", "натяжной потолок"] },
    { f: "house", s: "house", p: "warm", t: "Коттедж, гостиная со вторым светом", m: ["180 м²", "техпроект + ремонт"] },
    { f: "house", s: "kitchen", p: "sand", t: "Кухня в загородном доме", m: ["24 м²", "под ключ"] },
    { f: "office", s: "office", p: "gray", t: "Офис в центре Казани", m: ["70 м²", "свет и сети"] },
    { f: "rent", s: "living", p: "mint", t: "Квартира под аренду", m: ["49 м²", "практичные материалы"] },
    { f: "rent", s: "bedroom", p: "gray", t: "Студия под сдачу", m: ["28 м²", "быстрый запуск"] },
    { f: "office", s: "office", p: "green", t: "Кабинет и переговорная", m: ["40 м²", "под ключ"] }
  ];
  var grid = $("#worksGrid");
  WORKS.forEach(function (w, i) {
    var a = document.createElement("article");
    a.className = "work rv"; a.dataset.f = w.f; a.style.setProperty("--rd", (i % 3 * .06) + "s");
    a.innerHTML = '<div class="pic">' + svg(w.s, w.p) + '<span class="ex">пример</span></div><div class="info"><h3>' + w.t + '</h3><div class="meta">' + w.m.map(function (x) { return "<span>" + x + "</span>"; }).join("") + "</div></div>";
    grid.appendChild(a);
  });
  $$("#filters button").forEach(function (b) {
    var n = b.dataset.f === "all" ? WORKS.length : WORKS.filter(function (w) { return w.f === b.dataset.f; }).length;
    b.insertAdjacentHTML("beforeend", "<sup>" + n + "</sup>");
    b.addEventListener("click", function () {
      $$("#filters button").forEach(function (x) { x.classList.toggle("on", x === b); });
      $$(".work", grid).forEach(function (w) {
        var show = b.dataset.f === "all" || w.dataset.f === b.dataset.f;
        w.classList.toggle("hide", !show);
        w.classList.remove("pop");
        if (show) { void w.offsetWidth; w.classList.add("pop", "in"); }
      });
    });
  });

  /* ---------- form ---------- */
  var phone = $("#fPhone");
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
  });
  $("#leadForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (phone.value.replace(/\D/g, "").length < 11) { phone.focus(); phone.style.borderColor = "#d9534f"; return; }
    phone.style.borderColor = "";
    this.classList.add("sent");
  });

  /* ---------- floating messenger ---------- */
  var fab = $("#fab"), fabBtn = $(".fab-main"), hint = $("#fabHint");
  fabBtn.addEventListener("click", function () {
    var o = fab.classList.toggle("open");
    fabBtn.setAttribute("aria-expanded", o);
  });
  setTimeout(function () { hint.classList.add("show"); setTimeout(function () { hint.classList.remove("show"); }, 5000); }, 5000);
})();
