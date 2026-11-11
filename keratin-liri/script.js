(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- seeded random ---------- */
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  var W = 1440, H = 640;

  /* ---------- "после": гладкие блестящие пряди ---------- */
  function drawAfter(svg) {
    var defs = el("defs", {}, svg);
    var bg = el("linearGradient", { id: "aBg", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el("stop", { offset: 0, "stop-color": "#f1e2cc" }, bg);
    el("stop", { offset: 1, "stop-color": "#e2c7a3" }, bg);
    var hair = el("linearGradient", { id: "aHair", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el("stop", { offset: 0, "stop-color": "#4a2f20" }, hair);
    el("stop", { offset: .55, "stop-color": "#7a4a2c" }, hair);
    el("stop", { offset: 1, "stop-color": "#a8713f" }, hair);
    el("rect", { width: W, height: H, fill: "url(#aBg)" }, svg);

    var r = rng(7);
    var g = el("g", {}, svg);
    for (var x = -40; x < W + 40; x += 7 + r() * 3) {
      var a = 30 + r() * 14, sw = 4 + r() * 4;
      var d = "M" + x.toFixed(1) + ",-20 C" + (x + a).toFixed(1) + "," + (H * .3).toFixed(1) + " " +
        (x - a).toFixed(1) + "," + (H * .62).toFixed(1) + " " + (x + 10 + r() * 8).toFixed(1) + "," + (H + 20);
      el("path", { d: d, fill: "none", stroke: "url(#aHair)", "stroke-width": sw.toFixed(1), "stroke-linecap": "round", opacity: (.82 + r() * .18).toFixed(2) }, g);
      if (r() < .45) el("path", { d: d, fill: "none", stroke: "#ffe9c7", "stroke-width": 1, "stroke-linecap": "round", opacity: .35 }, g);
    }
  }

  /* ---------- "до": тусклые, пушащиеся пряди ---------- */
  function drawBefore(svg) {
    var defs = el("defs", {}, svg);
    var bg = el("linearGradient", { id: "bBg", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el("stop", { offset: 0, "stop-color": "#e6ddd2" }, bg);
    el("stop", { offset: 1, "stop-color": "#d3c6b7" }, bg);
    el("rect", { width: W, height: H, fill: "url(#bBg)" }, svg);

    var r = rng(21);
    var g = el("g", {}, svg);
    var colors = ["#6b5444", "#7d6656", "#8f7a69", "#a08b78"];
    for (var x = -40; x < W + 40; x += 4.5 + r() * 3) {
      var d = "M" + x.toFixed(1) + ",-20";
      var cx = x, steps = 9;
      for (var i = 1; i <= steps; i++) {
        var y = -20 + (H + 40) * i / steps;
        cx += (r() - .5) * 26;
        var mx = cx + (r() - .5) * 40, my = y - (H / steps) * .5;
        d += " Q" + mx.toFixed(1) + "," + my.toFixed(1) + " " + cx.toFixed(1) + "," + y.toFixed(1);
      }
      el("path", { d: d, fill: "none", stroke: colors[(r() * colors.length) | 0], "stroke-width": (2.5 + r() * 3).toFixed(1), "stroke-linecap": "round", opacity: (.55 + r() * .4).toFixed(2) }, g);
    }
    // торчащие волоски
    for (var k = 0; k < 320; k++) {
      var fx = r() * W, fy = 20 + r() * (H - 40), len = 18 + r() * 34, ang = (r() - .5) * 2.4;
      var ex = fx + Math.sin(ang) * len, ey = fy - Math.cos(ang) * len;
      var qx = (fx + ex) / 2 + (r() - .5) * 26, qy = (fy + ey) / 2 + (r() - .5) * 26;
      el("path", { d: "M" + fx.toFixed(1) + "," + fy.toFixed(1) + " Q" + qx.toFixed(1) + "," + qy.toFixed(1) + " " + ex.toFixed(1) + "," + ey.toFixed(1), fill: "none", stroke: "#8f7a69", "stroke-width": 1.3, "stroke-linecap": "round", opacity: .7 }, g);
    }
  }

  var sb = document.getElementById("svgBefore"), sa = document.getElementById("svgAfter");
  if (sb && sa) { drawBefore(sb); drawAfter(sa); }

  /* ---------- слайдер сравнения ---------- */
  var stage = document.getElementById("compStage"), range = document.getElementById("compRange");
  var touched = false;
  function setPos(v) { stage.style.setProperty("--pos", v + "%"); }
  if (stage && range) {
    range.addEventListener("input", function () { touched = true; setPos(range.value); });
    range.addEventListener("pointerdown", function () { touched = true; stage.classList.add("is-drag"); });
    window.addEventListener("pointerup", function () { stage.classList.remove("is-drag"); });

    // автодемонстрация: шторка проходит туда-обратно один раз
    if (!reduce) {
      var keys = [[0, 50], [900, 50], [2000, 80], [3300, 24], [4400, 55]], t0 = null;
      var ease = function (t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
      var tick = function (ts) {
        if (touched) return;
        if (t0 === null) t0 = ts;
        var t = ts - t0, v = keys[keys.length - 1][1];
        for (var i = 1; i < keys.length; i++) {
          if (t < keys[i][0]) {
            var p = (t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]);
            v = keys[i - 1][1] + (keys[i][1] - keys[i - 1][1]) * ease(p);
            break;
          }
        }
        setPos(v.toFixed(2)); range.value = Math.round(v);
        if (t < keys[keys.length - 1][0]) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ---------- появление при прокрутке ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { threshold: .15, rootMargin: "0px 0px -40px 0px" }) : null;
  document.querySelectorAll(".reveal, .offer").forEach(function (n) {
    if (io && !reduce) io.observe(n); else n.classList.add("is-in");
  });

  /* ---------- месяцы абонемента ---------- */
  document.querySelectorAll(".months span").forEach(function (s, i) { s.style.setProperty("--i", i); });

  /* ---------- счётчик ---------- */
  document.querySelectorAll(".count").forEach(function (c) {
    var to = +c.dataset.to;
    if (reduce || !io) { c.textContent = to; return; }
    var o = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      o.disconnect();
      var s = null;
      var step = function (ts) {
        if (s === null) s = ts;
        var p = Math.min((ts - s) / 1400, 1);
        c.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: .4 });
    o.observe(c);
  });

  /* ---------- линия шагов заполняется при прокрутке ---------- */
  var steps = document.getElementById("steps-list");
  if (steps && !reduce) {
    var upd = function () {
      var r = steps.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(Math.max((vh * .85 - r.top) / (vh * .6), 0), 1);
      steps.style.setProperty("--prog", p.toFixed(3));
    };
    window.addEventListener("scroll", upd, { passive: true }); upd();
  } else if (steps) steps.style.setProperty("--prog", 1);

  /* ---------- цены: вкладки и длина ---------- */
  var fmt = function (n) { return "от " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " руб."; };
  var lenWrap = document.getElementById("lenWrap");
  function renderPrices(flash) {
    var idx = +(document.querySelector('input[name="len"]:checked') || { value: 0 }).value;
    document.querySelectorAll("[data-p]").forEach(function (b) {
      b.textContent = fmt(+b.dataset.p.split(",")[idx]);
      if (flash && !reduce) { b.classList.remove("flash"); void b.offsetWidth; b.classList.add("flash"); }
    });
  }
  renderPrices(false);
  document.querySelectorAll('input[name="len"]').forEach(function (i) { i.addEventListener("change", function () { renderPrices(true); }); });

  function tabset(list, onSelect) {
    var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
    function select(t) {
      tabs.forEach(function (x) { var on = x === t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; });
      onSelect(t);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var k = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
        if (!k) return;
        e.preventDefault();
        var n = tabs[(i + k + tabs.length) % tabs.length]; n.focus(); select(n);
      });
    });
  }
  var priceTabs = document.querySelector(".tabs");
  if (priceTabs) tabset(priceTabs, function (t) {
    document.querySelectorAll(".panel").forEach(function (p) { p.hidden = p.id !== t.getAttribute("aria-controls"); });
    if (lenWrap) lenWrap.hidden = t.id !== "t-hair";
  });

  /* ---------- карта по адресам ---------- */
  var maps = [
    { q: "Казань, Московская улица, 57а", t: "Карта: Казань, Московская улица, 57а" },
    { q: "Казань, 2-я Ленинградская улица, 4", t: "Карта: Казань, 2-я Ленинградская улица, 4" }
  ];
  var frame = document.getElementById("mapFrame"), addr = document.querySelector(".addr");
  if (frame && addr) tabset(addr, function (t) {
    var m = maps[+t.dataset.map];
    frame.title = m.t;
    frame.src = "https://yandex.ru/map-widget/v1/?text=" + encodeURIComponent(m.q) + "&z=16";
  });

  /* ---------- окно записи ---------- */
  var sheet = document.getElementById("bookSheet");
  document.querySelectorAll(".js-book").forEach(function (b) {
    b.addEventListener("click", function () {
      if (sheet && sheet.showModal) sheet.showModal();
      else location.hash = "#contacts";
    });
  });
  if (sheet) {
    sheet.addEventListener("click", function (e) {
      if (e.target === sheet || e.target.closest("[data-close]")) sheet.close();
    });
  }

  /* ---------- липкая кнопка на мобильных ---------- */
  var dock = document.getElementById("dock"), hero = document.querySelector(".comp"), contacts = document.getElementById("contacts");
  if (dock && hero) {
    var updDock = function () {
      var past = hero.getBoundingClientRect().bottom < 0;
      var atEnd = contacts && contacts.getBoundingClientRect().top < window.innerHeight * .5;
      dock.classList.toggle("is-on", past && !atEnd);
    };
    window.addEventListener("scroll", updDock, { passive: true }); updDock();
  }
})();
