(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function tween(from, to, dur, cb) {
    if (reduce || dur <= 0) { cb(to); return; }
    var t0 = performance.now();
    (function step(t) {
      var k = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      cb(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- шапка и панель связи ---------- */
  var top = document.querySelector(".top");
  var dock = document.querySelector(".dock");
  var sheet = document.querySelector(".sheet");
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle("is-scrolled", y > 8);
    if (dock) dock.classList.toggle("show", y > sheet.offsetHeight * 0.6);
    stepsProgress();
  }

  /* ---------- счётчики ---------- */
  function runCount(el) {
    var to = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    tween(0, to, 1400, function (v) { el.textContent = v.toFixed(dec).replace(".", ","); });
  }

  /* ---------- появление при прокрутке ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("on");
      en.target.querySelectorAll("[data-count]").forEach(runCount);
      if (en.target.id === "ba") hintBA();
      io.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }) : null;
  document.querySelectorAll(".rv").forEach(function (el) { io ? io.observe(el) : el.classList.add("on"); });

  // счётчики первого экрана
  document.querySelectorAll(".stamp [data-count]").forEach(function (el) {
    setTimeout(function () { runCount(el); }, reduce ? 0 : 900);
  });
  var areaT = document.querySelector(".plan .area");
  if (areaT) setTimeout(function () {
    tween(0, 24.4, 1600, function (v) { areaT.textContent = v.toFixed(1).replace(".", ","); });
  }, reduce ? 0 : 1400);

  /* ---------- иллюстрации комнат (SVG) ---------- */
  var uid = 0;
  var ROOMS = {
    living: { back: "#e8e0d2", side: "#dcd2c2", floor: "#b68c63", plank: "#a57c55" },
    kitchen: { back: "#e3e8e2", side: "#d5dcd4", floor: "#cfc7ba", plank: "#bdb4a6" },
    bath: { back: "#dce8ee", side: "#cddce4", floor: "#b8c6cf", plank: "#a9b8c2" },
    kids: { back: "#e9e1f0", side: "#ddd3e7", floor: "#c9b18c", plank: "#b89f79" },
    bed: { back: "#e4ddd6", side: "#d7cec5", floor: "#a88563", plank: "#977656" }
  };
  function cp(u, v) { // точка на плоскости потолка: u 0..1 поперёк, v 0..1 вглубь
    var x0 = 90 * v, w = 400 - 180 * v;
    return [x0 + u * w, 80 * v];
  }
  function furniture(room) {
    switch (room) {
      case "living":
        return '<rect x="160" y="104" width="64" height="40" rx="2" fill="#f4efe6" stroke="#b9ab95" stroke-width="2"/><path d="M168 136l14-14 10 8 12-12 14 18z" fill="#f2a93b" opacity=".7"/>' +
          '<ellipse cx="200" cy="248" rx="120" ry="20" fill="#000" opacity=".08"/>' +
          '<rect x="124" y="150" width="152" height="28" rx="10" fill="#4f6075"/><rect x="118" y="172" width="164" height="38" rx="10" fill="#5d6f86"/>' +
          '<rect x="114" y="164" width="18" height="44" rx="8" fill="#4f6075"/><rect x="268" y="164" width="18" height="44" rx="8" fill="#4f6075"/>' +
          '<rect x="140" y="160" width="34" height="22" rx="6" fill="#f2a93b" opacity=".85"/>' +
          '<rect x="292" y="182" width="16" height="30" rx="3" fill="#8b6b4e"/><circle cx="300" cy="168" r="16" fill="#6f8f6a"/><circle cx="292" cy="158" r="10" fill="#7fa07a"/>';
      case "kitchen":
        return '<rect x="100" y="90" width="200" height="40" fill="#f6f4ef" stroke="#c9c3b6" stroke-width="1.5"/><path d="M150 90v40M200 90v40M250 90v40" stroke="#c9c3b6" stroke-width="1.5"/>' +
          '<rect x="92" y="160" width="216" height="7" fill="#8a6a4f"/><rect x="94" y="167" width="212" height="48" fill="#f6f4ef" stroke="#c9c3b6" stroke-width="1.5"/>' +
          '<path d="M147 167v48M200 167v48M253 167v48" stroke="#c9c3b6" stroke-width="1.5"/><path d="M135 188h8M188 188h8M241 188h8M290 188h8" stroke="#8a8f99" stroke-width="2" stroke-linecap="round"/>' +
          '<path d="M180 160c0-10 6-14 12-14" stroke="#8a8f99" stroke-width="3" fill="none"/><rect x="228" y="150" width="24" height="10" rx="3" fill="#2f3b4c"/>' +
          '<ellipse cx="200" cy="268" rx="70" ry="10" fill="#000" opacity=".08"/><rect x="150" y="236" width="100" height="8" rx="3" fill="#8a6a4f"/><path d="M160 244v40M240 244v40" stroke="#8a6a4f" stroke-width="5"/>';
      case "bath":
        var t = "";
        for (var i = 1; i < 8; i++) t += '<path d="M' + (90 + i * 27.5) + ' 80V215" stroke="#c4d4dc" stroke-width="1.2"/>';
        for (var j = 1; j < 5; j++) t += '<path d="M90 ' + (80 + j * 27) + 'H310" stroke="#c4d4dc" stroke-width="1.2"/>';
        return t + '<rect x="174" y="96" width="52" height="40" rx="20" fill="#eef5f8" stroke="#a9bcc7" stroke-width="2"/>' +
          '<rect x="104" y="166" width="192" height="44" rx="14" fill="#fff" stroke="#c1ced6" stroke-width="2"/><rect x="104" y="162" width="192" height="10" rx="5" fill="#f4f8fa" stroke="#c1ced6" stroke-width="1.5"/>' +
          '<path d="M118 160v-18h14" stroke="#9aa6b2" stroke-width="3" fill="none"/><rect x="276" y="110" width="10" height="44" rx="3" fill="#f2a93b" opacity=".8"/>';
      case "kids":
        return '<rect x="210" y="100" width="44" height="34" rx="4" fill="#fff" stroke="#c7bad6" stroke-width="2"/><path d="m232 108 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#f2a93b"/>' +
          '<rect x="110" y="168" width="120" height="40" rx="8" fill="#f7f4ef"/><rect x="110" y="176" width="120" height="32" rx="8" fill="#7fa6c9"/><rect x="104" y="150" width="12" height="62" rx="4" fill="#b59a76"/>' +
          '<rect x="118" y="164" width="30" height="14" rx="6" fill="#fff"/>' +
          '<rect x="262" y="196" width="16" height="16" fill="#f2a93b"/><rect x="280" y="200" width="14" height="14" fill="#7fa6c9"/><rect x="270" y="182" width="14" height="14" fill="#e98b8b"/>';
      case "bed":
        return '<rect x="128" y="132" width="144" height="40" rx="8" fill="#8a7462"/>' +
          '<rect x="120" y="164" width="160" height="46" rx="8" fill="#f4f1ec"/><rect x="120" y="182" width="160" height="30" rx="8" fill="#c8b8a6"/>' +
          '<rect x="138" y="156" width="46" height="16" rx="6" fill="#fff"/><rect x="216" y="156" width="46" height="16" rx="6" fill="#fff"/>' +
          '<rect x="96" y="180" width="20" height="30" rx="3" fill="#8a7462"/><rect x="284" y="180" width="20" height="30" rx="3" fill="#8a7462"/>' +
          '<circle cx="106" cy="170" r="7" fill="#f2a93b" opacity=".85"/><circle cx="294" cy="170" r="7" fill="#f2a93b" opacity=".85"/>';
    }
    return "";
  }
  function roomSVG(room, state, variant) {
    var c = ROOMS[room] || ROOMS.living, id = "r" + (++uid), s = "";
    var after = state !== "before";
    s += '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
      '<linearGradient id="' + id + 'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfd7e1"/><stop offset=".45" stop-color="#ffffff"/><stop offset=".6" stop-color="#dfe5ec"/><stop offset="1" stop-color="#f6f8fa"/></linearGradient>' +
      '<radialGradient id="' + id + 'l"><stop offset="0" stop-color="#fff5df" stop-opacity=".95"/><stop offset="1" stop-color="#ffd58f" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + id + 'c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7bd" stop-opacity=".55"/><stop offset="1" stop-color="#ffe7bd" stop-opacity="0"/></linearGradient>' +
      '</defs>';
    // стены и пол
    s += '<polygon points="0,0 90,80 90,215 0,300" fill="' + c.side + '"/>';
    s += '<polygon points="400,0 310,80 310,215 400,300" fill="' + c.side + '"/>';
    s += '<rect x="90" y="80" width="220" height="135" fill="' + c.back + '"/>';
    s += '<polygon points="0,300 90,215 310,215 400,300" fill="' + c.floor + '"/>';
    for (var k = 1; k < 7; k++) {
      var fx = 90 + k * (220 / 7), bx = k * (400 / 7);
      s += '<path d="M' + fx + ' 215L' + bx + ' 300" stroke="' + c.plank + '" stroke-width="1"/>';
    }
    // окно на левой стене
    s += '<polygon points="22,70 66,104 66,176 22,196" fill="#cfe2ef" stroke="#fff" stroke-width="4"/><path d="M44 87v99" stroke="#fff" stroke-width="3"/>';
    s += furniture(room);

    // потолок
    var ceil = "0,0 400,0 310,80 90,80";
    if (after) {
      var fill = variant === "gloss" ? "url(#" + id + "g)" : "#f8f7f3";
      s += '<polygon points="' + ceil + '" fill="' + fill + '"/>';
      s += '<path d="M90 80H310" stroke="#d9d5cc" stroke-width="1.5"/>';
      if (variant === "float") {
        s += '<polygon class="rm-led" points="8,4 392,4 304,76 96,76" fill="none" stroke="#f2a93b" stroke-width="3" style="filter:drop-shadow(0 0 4px #f2a93b)"/>';
      }
      if (variant === "two") {
        var a = cp(.2, .25), b = cp(.8, .25), d = cp(.8, .8), e = cp(.2, .8);
        var pts = a.join(",") + " " + b.join(",") + " " + d.join(",") + " " + e.join(",");
        s += '<polygon points="' + pts + '" fill="#ffffff" stroke="#f2a93b" stroke-width="2.5" class="rm-led" style="filter:drop-shadow(0 0 5px #f2a93b)"/>';
      }
      if (variant === "gloss") {
        s += '<polygon points="140,0 200,0 150,80 110,80" fill="#fff" opacity=".55"/>';
      }
      // светильники и световые конусы
      var spots = room === "kids" ? [] : [[.22, .35], [.5, .35], [.78, .35], [.25, .78], [.5, .78], [.75, .78]];
      if (variant === "two") spots = [[.1, .2], [.9, .2], [.1, .85], [.9, .85]];
      spots.forEach(function (p) {
        var q = cp(p[0], p[1]);
        s += '<polygon points="' + (q[0] - 3) + ',' + q[1] + ' ' + (q[0] + 3) + ',' + q[1] + ' ' + (q[0] + 26) + ',' + (q[1] + 140) + ' ' + (q[0] - 26) + ',' + (q[1] + 140) + '" fill="url(#' + id + 'c)"/>';
        s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="14" fill="url(#' + id + 'l)"/>';
        s += '<ellipse cx="' + q[0] + '" cy="' + q[1] + '" rx="5" ry="2" fill="#fff6e3" stroke="#e7c48b" stroke-width=".8"/>';
      });
      if (room === "kids") {
        s += '<polygon points="' + ceil + '" fill="#26304a"/>';
        for (var n = 0; n < 38; n++) {
          var u = (n * 37 % 100) / 100, v = ((n * 53 + 11) % 97) / 100;
          var q2 = cp(u * .94 + .03, v * .92 + .04);
          s += '<circle class="rm-star" style="animation-delay:' + ((n * 0.37) % 2.4).toFixed(2) + 's" cx="' + q2[0].toFixed(1) + '" cy="' + q2[1].toFixed(1) + '" r="' + (n % 4 === 0 ? 1.8 : 1.1) + '" fill="#fff4d6"/>';
        }
      }
    } else {
      s += '<polygon points="' + ceil + '" fill="#c7c1b4"/>';
      s += '<ellipse cx="300" cy="30" rx="44" ry="14" fill="#a8946c" opacity=".45"/><ellipse cx="120" cy="52" rx="30" ry="9" fill="#a8946c" opacity=".35"/>';
      s += '<path d="M40 6l30 14 6 20 28 8M210 4l-8 22 18 16 -6 24M330 10l-18 10 4 18M150 30l40 6 10 18" fill="none" stroke="#6d665a" stroke-width="1.4"/>';
      s += '<path d="M250 0l-6 10 10 4 -4 9h18l-2-12 8-11z" fill="#e2ddd2"/>';
      s += '<path d="M90 80H310" stroke="#a49d90" stroke-width="2" stroke-dasharray="3 5"/>';
      s += '<g class="rm-bulb"><path d="M200 34V92" stroke="#2d2d2d" stroke-width="1.6"/><rect x="195" y="90" width="10" height="8" fill="#555"/><circle cx="200" cy="104" r="8" fill="#fff3c6"/><circle cx="200" cy="104" r="26" fill="#ffe9a6" opacity=".25"/></g>';
      s += '<rect width="400" height="300" fill="#3a2e1f" opacity=".16"/>';
    }
    s += "</svg>";
    return s;
  }
  function paint(el) {
    el.innerHTML = roomSVG(el.getAttribute("data-room"), el.getAttribute("data-state"), el.getAttribute("data-variant"));
  }
  document.querySelectorAll("[data-room]").forEach(paint);

  /* ---------- было / стало ---------- */
  var ba = document.getElementById("ba");
  var hinted = false;
  function hintBA() { if (!hinted && !reduce) { hinted = true; ba.classList.add("hint"); } }
  if (ba) {
    var range = ba.querySelector(".ba__range");
    range.addEventListener("input", function () { ba.style.setProperty("--pos", range.value + "%"); ba.classList.remove("hint"); });
    var tabs = document.querySelectorAll(".ba__rooms button");
    tabs.forEach(function (b) {
      b.addEventListener("click", function () {
        tabs.forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
        var room = b.getAttribute("data-set");
        ba.querySelectorAll(".ba__img").forEach(function (img) {
          img.setAttribute("data-room", room);
          img.setAttribute("data-variant", room === "living" ? "float" : room === "bath" ? "gloss" : "");
          paint(img);
        });
      });
    });
    ba.querySelector(".ba__img--after").setAttribute("data-variant", "float");
    paint(ba.querySelector(".ba__img--after"));
  }

  /* ---------- шаги: линия прогресса ---------- */
  var stepsEl = document.getElementById("stepsList");
  var stepItems = stepsEl ? stepsEl.querySelectorAll(".step") : [];
  function stepsProgress() {
    if (!stepsEl) return;
    var r = stepsEl.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    stepsEl.style.setProperty("--p", p.toFixed(3));
    stepItems.forEach(function (s, i) { s.classList.toggle("on", p >= (i + 0.5) / stepItems.length - 0.12); });
  }

  /* ---------- галерея: перетаскивание мышью ---------- */
  var gal = document.getElementById("gal");
  if (gal) {
    var down = false, sx = 0, sl = 0, moved = false;
    gal.addEventListener("mousedown", function (e) { down = true; moved = false; sx = e.pageX; sl = gal.scrollLeft; });
    window.addEventListener("mouseup", function () { down = false; gal.classList.remove("drag"); });
    gal.addEventListener("mousemove", function (e) {
      if (!down) return;
      var dx = e.pageX - sx;
      if (Math.abs(dx) > 4) { moved = true; gal.classList.add("drag"); }
      gal.scrollLeft = sl - dx;
    });
  }

  /* ---------- виды потолков: касание на мобильном ---------- */
  document.querySelectorAll(".type").forEach(function (t) {
    t.addEventListener("click", function () { t.classList.toggle("tap"); });
  });

  /* ---------- калькулятор (условные цены, пример) ---------- */
  var PRICE = { matte: 450, gloss: 520, satin: 550, fabric: 1300 };
  var NAMES = { matte: "матовое", gloss: "глянцевое", satin: "сатиновое", fabric: "тканевое" };
  var LIGHT = 400, FLOAT_M = 1100, CORNICE_M = 950, ROOM_MIN = 1500;
  var area = document.getElementById("area"), areaR = document.getElementById("areaRange");
  var roomsOut = document.getElementById("rooms"), lights = document.getElementById("lights"), lightsOut = document.getElementById("lightsOut");
  var flo = document.getElementById("float"), cor = document.getElementById("cornice");
  var sumEl = document.getElementById("sum"), list = document.getElementById("breakdown");
  var mini = document.getElementById("mini"), spotsEl = document.getElementById("miniSpots");
  var rooms = 1, shown = 0, lastText = "";

  function fill(r) { r.style.setProperty("--fill", ((r.value - r.min) / (r.max - r.min) * 100) + "%"); }
  function canvasType() { var c = document.querySelector('input[name="canvas"]:checked'); return c ? c.value : "matte"; }
  function calc() {
    var a = Math.max(1, Math.min(300, parseFloat(area.value) || 0));
    var type = canvasType(), n = parseInt(lights.value, 10);
    var perim = 4 * Math.sqrt(a / rooms) * rooms;
    var rows = [];
    var base = Math.max(a * PRICE[type], ROOM_MIN * rooms);
    rows.push(["Полотно " + NAMES[type] + ", " + fmt(a) + " м²", base]);
    if (n) rows.push(["Светильники, " + n + " шт.", n * LIGHT]);
    if (flo.checked) rows.push(["Парящий профиль, ~" + Math.round(perim) + " м", perim * FLOAT_M]);
    if (cor.checked) rows.push(["Скрытый карниз, ~" + (3 * rooms) + " м", 3 * rooms * CORNICE_M]);
    var total = rows.reduce(function (s, r) { return s + r[1]; }, 0);
    total = Math.round(total / 100) * 100;

    list.innerHTML = rows.map(function (r) { return "<li><span>" + r[0] + "</span><b>" + fmt(r[1]) + " руб.</b></li>"; }).join("");
    var from = shown; shown = total;
    tween(from, total, 600, function (v) { sumEl.textContent = fmt(v); });

    lightsOut.textContent = n + " шт.";
    fill(lights); fill(areaR);
    // мини-превью
    mini.className = "mini is-" + type + (flo.checked ? " is-float" : "") + (cor.checked ? " is-cornice" : "");
    var cols = Math.max(1, Math.ceil(Math.sqrt(n * 1.8)));
    spotsEl.style.gridTemplateColumns = "repeat(" + cols + ",1fr)";
    if (spotsEl.children.length !== n) {
      var h = "";
      for (var i = 0; i < n; i++) h += '<i style="animation-delay:' + (i * 0.03).toFixed(2) + 's"></i>';
      spotsEl.innerHTML = h;
    }
    lastText = "Здравствуйте! Посчитал потолок на сайте (пример): площадь " + fmt(a) + " м², комнат " + rooms + ", полотно " + NAMES[type] +
      ", светильников " + n + (flo.checked ? ", парящий профиль" : "") + (cor.checked ? ", скрытый карниз" : "") +
      ". Ориентировочно от " + fmt(total) + " руб. Подскажите точную стоимость.";
  }
  if (area) {
    area.addEventListener("input", function () { areaR.value = Math.min(150, area.value || 3); calc(); });
    areaR.addEventListener("input", function () { area.value = areaR.value; calc(); });
    lights.addEventListener("input", calc);
    [flo, cor].forEach(function (x) { x.addEventListener("change", calc); });
    document.querySelectorAll('input[name="canvas"]').forEach(function (x) { x.addEventListener("change", calc); });
    document.querySelectorAll(".stepper button").forEach(function (b) {
      b.addEventListener("click", function () {
        rooms = Math.max(1, Math.min(10, rooms + parseInt(b.getAttribute("data-step"), 10)));
        roomsOut.textContent = rooms; calc();
      });
    });
    var send = document.getElementById("sendCalc"), hint = document.getElementById("copyHint");
    send.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastText).then(function () {
          hint.textContent = "Расчёт скопирован. Вставьте его в чат MAX.";
          hint.classList.add("ok");
        }).catch(function () {});
      }
    });
    calc();
  }

  /* ---------- план: на узком экране обрезаем легенду ---------- */
  var planSvg = document.querySelector(".plan__svg");
  function fitPlan() { if (planSvg) planSvg.setAttribute("viewBox", window.innerWidth < 960 ? "0 0 850 520" : "0 0 1200 520"); }
  fitPlan();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { stepsProgress(); fitPlan(); });
  onScroll();
})();
