(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- данные (цены: метка src = из Dikidi на 11.11.2026, остальное пример) ---------- */
  var PRICES = {
    v: [
      { n: "Мужская стрижка", d: "1 ч", p: 800, from: true, src: false, note: "в поиске Dikidi 800 руб., уточняется" },
      { n: "Удлинённая стрижка", d: "1 ч", p: 1300, from: true, src: true },
      { n: "Стрижка + оформление бороды", d: "1 ч 30 мин", p: 1800, src: true, note: "комбо" },
      { n: "Стрижка + чёрная маска", d: "1 ч 30 мин", p: 1700, src: true, note: "комбо" },
      { n: "Оформление бороды и усов", d: "30 мин", p: 500, src: false },
      { n: "Детская стрижка", d: "1 ч", p: 800, src: false, note: "до 10 лет" },
      { n: "Патчи", d: "30 мин", p: 300, src: true },
      { n: "Ваксинг, одна зона", d: "15 мин", p: 300, src: false },
      { n: "Био-завивка", d: "2 ч", p: 5000, from: true, src: true }
    ],
    f: [
      { n: "Мужская стрижка, PRO", d: "1 ч", p: 1000, src: true },
      { n: "Мужская стрижка, TOP", d: "1 ч", p: 1200, src: true },
      { n: "Удлинённая стрижка", d: "1 ч", p: 1100, from: true, src: true },
      { n: "Детская стрижка, PRO", d: "1 ч", p: 800, src: true, note: "до 10 лет" },
      { n: "Детская стрижка, TOP", d: "1 ч", p: 1000, src: true, note: "до 10 лет" },
      { n: "Стрижка + оформление бороды", d: "1 ч 30 мин", p: 1700, src: false, note: "комбо" },
      { n: "Оформление бороды и усов", d: "30 мин", p: 600, src: false },
      { n: "Стрижка + чёрная маска", d: "1 ч 30 мин", p: 1500, src: false, note: "комбо" },
      { n: "Ваксинг, одна зона", d: "15 мин", p: 300, src: false }
    ]
  };

  var TEAM = [
    { n: "Хан", g: "TOP", r: "5,0", c: "74 и 72 оценки", b: ["v", "f"], t: "Работает в обоих филиалах" },
    { n: "Эдик", g: "TOP", r: "5,0", c: "56 и 101 оценка", b: ["v", "f"], t: "Работает в обоих филиалах" },
    { n: "Роял", g: "TOP", r: "5,0", c: "274 оценки", b: ["f"], t: "Больше всех оценок в команде" },
    { n: "Даянч", g: "TOP", r: "4,9", c: "69 оценок", b: ["v"], t: "Мужские стрижки и борода" },
    { n: "Оматилло", g: "TOP", r: "4,9", c: "102 оценки", b: ["f"], t: "Мужские и детские стрижки" },
    { n: "Наргиз", g: "PRO", r: "5,0", c: "41 оценка", b: ["v"], t: "Мужские и детские стрижки" }
  ];
  var BR = { v: "Вишневского, 14", f: "Фучика, 50" };

  function rub(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " руб."; }
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------- шапка, меню ---------- */
  var top = $("#top");
  function onScroll() { top.classList.toggle("is-solid", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var burger = $(".burger"), nav = $("#nav");
  burger.addEventListener("click", function () {
    var open = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    nav.classList.toggle("is-open", open);
  });
  $$("#nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      burger.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });

  /* ---------- параллакс сцены ---------- */
  var scene = $(".hero__scene"), hero = $(".hero");
  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    hero.addEventListener("mousemove", function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * -18;
      var y = (e.clientY / window.innerHeight - 0.5) * -12;
      scene.style.setProperty("--px", x.toFixed(1) + "px");
      scene.style.setProperty("--py", y.toFixed(1) + "px");
    });
  }

  /* ---------- цены ---------- */
  var list = $("#priceList");
  function renderPrices(b) {
    list.innerHTML = PRICES[b].map(function (s, i) {
      return '<li style="--k:' + i + '"><span class="price__name">' + s.n +
        (s.src ? '<span class="price__tag price__tag--src">Dikidi</span>' : '<span class="price__tag">пример</span>') +
        (s.note ? "<small>" + s.note + "</small>" : "") + '</span>' +
        '<span class="price__time">' + s.d + '</span>' +
        '<span class="price__cost">' + (s.from ? "от " : "") + rub(s.p) + "</span></li>";
    }).join("");
  }
  $$(".tab").forEach(function (t) {
    t.addEventListener("click", function () {
      $$(".tab").forEach(function (x) { x.classList.toggle("is-on", x === t); x.setAttribute("aria-selected", String(x === t)); });
      renderPrices(t.dataset.branch);
    });
  });
  renderPrices("v");

  /* ---------- мастера ---------- */
  var team = $("#team");
  function renderTeam(f) {
    var items = TEAM.filter(function (m) { return f === "all" || m.b.indexOf(f) > -1; });
    team.innerHTML = items.map(function (m, i) {
      return '<li class="card" style="--k:' + i + '">' +
        '<div class="card__face" aria-hidden="true"><i></i><i></i><i></i><i></i><b>' + m.n.charAt(0) + '</b>' +
        '<span class="card__grade' + (m.g === "PRO" ? " card__grade--pro" : "") + '">' + m.g + ' BARBER</span></div>' +
        '<div class="card__row"><h3>' + m.n + '</h3><span class="card__rate"><svg><use href="#i-star"/></svg>' + m.r + '</span></div>' +
        '<p class="card__meta">' + m.t + ' · ' + m.c + '</p>' +
        '<div class="card__br">' + m.b.map(function (b) { return "<span>" + BR[b] + "</span>"; }).join("") + '</div>' +
        '<button class="btn btn--sm card__book" type="button" data-master="' + m.n + '" data-b="' + m.b[0] + '">Записаться к мастеру</button>' +
        "</li>";
    }).join("");
  }
  $$(".chip").forEach(function (c) {
    c.addEventListener("click", function () {
      $$(".chip").forEach(function (x) { x.classList.toggle("is-on", x === c); x.setAttribute("aria-pressed", String(x === c)); });
      renderTeam(c.dataset.filter);
    });
  });
  renderTeam("all");

  /* ---------- лента форм ---------- */
  var strip = $("#strip");
  $$("[data-strip]").forEach(function (b) {
    b.addEventListener("click", function () {
      var card = strip.querySelector(".form");
      var step = card ? card.getBoundingClientRect().width + 18 : 300;
      strip.scrollBy({ left: step * Number(b.dataset.strip), behavior: reduce ? "auto" : "smooth" });
    });
  });
  (function drag() {
    var down = false, sx = 0, sl = 0, moved = false;
    strip.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      down = true; moved = false; sx = e.clientX; sl = strip.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 4) { moved = true; strip.classList.add("is-drag"); }
      strip.scrollLeft = sl - dx;
    });
    window.addEventListener("pointerup", function () {
      down = false;
      if (moved) strip.classList.remove("is-drag");
    });
  })();

  /* ---------- форма записи ---------- */
  var fB = $("#fBranch"), fS = $("#fService"), fM = $("#fMaster"), fD = $("#fDate"), fT = $("#fTime"),
      fN = $("#fName"), fP = $("#fPhone"), fF = $("#fFirst"), sum = $("#bookSum"), msg = $("#bookMsg");

  function fillBranch() {
    var b = fB.value;
    fS.innerHTML = PRICES[b].map(function (s, i) {
      return '<option value="' + i + '">' + s.n + ", " + (s.from ? "от " : "") + rub(s.p) + "</option>";
    }).join("");
    fM.innerHTML = '<option value="">Любой свободный</option>' + TEAM.filter(function (m) { return m.b.indexOf(b) > -1; })
      .map(function (m) { return '<option value="' + m.n + '">' + m.n + ", " + m.g + " BARBER</option>"; }).join("");
    updSum();
  }
  function fillTimes() {
    var out = [];
    for (var h = 9; h <= 20; h++) { out.push(h + ":00"); if (h < 20) out.push(h + ":30"); }
    fT.innerHTML = out.map(function (t) { return "<option>" + t + "</option>"; }).join("");
    fT.value = "18:00";
  }
  function updSum() {
    var s = PRICES[fB.value][Number(fS.value) || 0];
    if (!s) return;
    var p = s.p, label = (s.from ? "от " : "");
    if (fF.checked) {
      sum.innerHTML = "<span>С учётом скидки 20%</span><b><s>" + label + rub(p) + "</s>" + label + rub(Math.round(p * 0.8 / 10) * 10) + "</b>";
    } else {
      sum.innerHTML = "<span>" + s.d + " · " + BR[fB.value] + "</span><b>" + label + rub(p) + "</b>";
    }
  }
  var today = new Date();
  var iso = function (d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  fD.min = iso(today);
  var tmr = new Date(today.getTime() + 864e5);
  fD.value = iso(tmr);
  fillTimes();
  fB.addEventListener("change", fillBranch);
  fS.addEventListener("change", updSum);
  fF.addEventListener("change", updSum);
  fillBranch();

  fP.addEventListener("input", function () {
    var d = fP.value.replace(/\D/g, "");
    if (d.charAt(0) === "8") d = "7" + d.slice(1);
    if (d && d.charAt(0) !== "7") d = "7" + d;
    d = d.slice(0, 11);
    var r = "+7";
    if (d.length > 1) r += " " + d.slice(1, 4);
    if (d.length > 4) r += " " + d.slice(4, 7);
    if (d.length > 7) r += "-" + d.slice(7, 9);
    if (d.length > 9) r += "-" + d.slice(9, 11);
    fP.value = d ? r : "";
  });

  $("#bookForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var okN = fN.value.trim().length > 1, okP = fP.value.replace(/\D/g, "").length === 11;
    fN.classList.toggle("is-bad", !okN);
    fP.classList.toggle("is-bad", !okP);
    if (!okN || !okP) {
      msg.style.color = "#f0a093";
      msg.textContent = "Проверьте имя и телефон.";
      (okN ? fP : fN).focus();
      return;
    }
    var s = PRICES[fB.value][Number(fS.value) || 0];
    msg.style.color = "";
    msg.textContent = "Демо: заявка не отправлена. " + fN.value.trim() + ", на рабочем сайте здесь будет подтверждение: " +
      s.n.toLowerCase() + ", " + BR[fB.value] + ", " + fD.value.split("-").reverse().join(".") + " в " + fT.value + ".";
  });

  // кнопка "Записаться к мастеру" в карточке
  team.addEventListener("click", function (e) {
    var b = e.target.closest("[data-master]");
    if (!b) return;
    fB.value = b.dataset.b;
    fillBranch();
    fM.value = b.dataset.master;
    $("#booking").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    setTimeout(function () { fN.focus({ preventScroll: true }); }, reduce ? 0 : 700);
  });

  /* ---------- появление и счётчики ---------- */
  function count(el) {
    var to = parseFloat(el.dataset.count), dec = Number(el.dataset.dec || 0);
    var fmt = function (v) {
      var s = v.toFixed(dec).replace(".", ",");
      return dec ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };
    if (reduce) { el.textContent = fmt(to); return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(to * e);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        $$("[data-count]", en.target).forEach(count);
        io.unobserve(en.target);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
    $$("[data-count]").forEach(count);
  }

  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
