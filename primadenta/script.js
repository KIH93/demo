(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- схема квартала ---------- */
  var svg = document.getElementById("qmap");
  if (svg) {
    var W = 1440, H = 900;
    // улицы: [координата, ширина, главная?]
    var V = [[120, 14], [300, 34, 1], [520, 16], [758, 22], [1000, 16], [1132, 34, 1], [1320, 14]];
    var Hs = [[60, 14], [170, 16], [300, 30, 1], [450, 14], [600, 34, 1], [760, 16], [860, 14]];
    var gS = document.getElementById("mStreets");
    var gB = document.getElementById("mBlocks");

    function el(name, attrs, parent) {
      var n = document.createElementNS(NS, name);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      parent.appendChild(n);
      return n;
    }
    // локальная улица y=450 не проходит через квартал клиники
    function hSegs(h) {
      if (h[0] === 450) return [[0, 758], [1000, W]];
      return [[0, W]];
    }
    V.forEach(function (v) {
      el("line", { x1: v[0], y1: 0, x2: v[0], y2: H, "stroke-width": v[1], class: "m-st" + (v[2] ? " m-st--main" : "") }, gS);
    });
    Hs.forEach(function (h) {
      hSegs(h).forEach(function (s) {
        el("line", { x1: s[0], y1: h[0], x2: s[1], y2: h[0], "stroke-width": h[1], class: "m-st" + (h[2] ? " m-st--main" : "") }, gS);
      });
    });
    V.concat().filter(function (v) { return v[2]; }).forEach(function (v) {
      el("line", { x1: v[0], y1: 0, x2: v[0], y2: H, class: "m-st--mid" }, gS);
    });
    Hs.filter(function (h) { return h[2]; }).forEach(function (h) {
      el("line", { x1: 0, y1: h[0], x2: W, y2: h[0], class: "m-st--mid" }, gS);
    });

    var seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

    var xs = [[0, 0]].concat(V).concat([[W, 0]]);
    var ys = [[0, 0]].concat(Hs).concat([[H, 0]]);
    var bi = 0;
    var parks = { "3-1": 1, "0-4": 1, "5-5": 1, "2-6": 1, "6-2": 1 };

    for (var i = 0; i < xs.length - 1; i++) {
      for (var j = 0; j < ys.length - 1; j++) {
        var x0 = xs[i][0] + xs[i][1] / 2 + 12, x1 = xs[i + 1][0] - xs[i + 1][1] / 2 - 12;
        var y0 = ys[j][0] + ys[j][1] / 2 + 12, y1 = ys[j + 1][0] - ys[j + 1][1] / 2 - 12;
        // квартал клиники: два ряда домов, сама клиника рисуется отдельно
        var isClinic = xs[i][0] === 758 && (ys[j][0] === 300 || ys[j][0] === 450);
        if (isClinic) {
          if (ys[j][0] === 300) {
            house(x0, y0, x1 - x0, 64);
            house(x0, 533, x1 - x0, 38);
          }
          continue;
        }
        var w = x1 - x0, h = y1 - y0;
        if (w < 30 || h < 30) continue;
        if (parks[i + "-" + j]) {
          el("rect", { x: x0, y: y0, width: w, height: h, rx: 14, class: "m-park", style: "--bi:" + (bi++) }, gB);
          el("rect", { x: x0 + 8, y: y0 + 8, width: w - 16, height: h - 16, rx: 10, class: "m-park m-park--trees", style: "--bi:" + (bi++) }, gB);
          continue;
        }
        var horiz = w >= h;
        var n = Math.max(1, Math.min(4, Math.round((horiz ? w : h) / 110)));
        var gap = 12, len = ((horiz ? w : h) - gap * (n - 1)) / n;
        for (var k = 0; k < n; k++) {
          var depth = (horiz ? h : w) * (0.45 + rnd() * 0.45);
          var off = rnd() < 0.5 ? 0 : (horiz ? h : w) - depth;
          if (horiz) house(x0 + k * (len + gap), y0 + off, len, depth);
          else house(x0 + off, y0 + k * (len + gap), depth, len);
        }
      }
    }
    function house(x, y, w, h) {
      if (w <= 0 || h <= 0) return;
      el("rect", { x: x.toFixed(1), y: y.toFixed(1), width: w.toFixed(1), height: h.toFixed(1), rx: 7, class: "m-b" + (rnd() < 0.35 ? " m-b--alt" : ""), style: "--bi:" + (bi++) }, gB);
    }

    // на телефоне показываем фрагмент схемы вокруг клиники
    var mq = window.matchMedia("(max-width: 760px)");
    function fit() {
      if (mq.matches) {
        svg.setAttribute("viewBox", "296 110 900 640");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      } else {
        svg.setAttribute("viewBox", "0 0 1440 900");
        svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
      }
    }
    fit();
    if (mq.addEventListener) mq.addEventListener("change", fit);

    if (reduce) {
      var w0 = svg.querySelector(".m-walker");
      if (w0) w0.parentNode.removeChild(w0);
    }
  }

  /* ---------- меню ---------- */
  var burger = document.querySelector(".burger");
  var mnav = document.getElementById("mnav");
  if (burger && mnav) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      burger.setAttribute("aria-label", open ? "Открыть меню" : "Закрыть меню");
      mnav.hidden = open;
    });
    mnav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { mnav.hidden = true; burger.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---------- появление при прокрутке и счётчики ---------- */
  function count(node) {
    var to = parseFloat(node.getAttribute("data-count"));
    var from = parseFloat(node.getAttribute("data-from") || "0");
    var dec = parseInt(node.getAttribute("data-dec") || "0", 10);
    var suf = node.getAttribute("data-suffix") || "";
    function fmt(v) { return v.toFixed(dec).replace(".", ",") + suf; }
    if (reduce || to === from) { node.textContent = fmt(to); return; }
    var t0 = null, dur = 1600;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      node.textContent = fmt(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    }
    node.textContent = fmt(from);
    requestAnimationFrame(step);
  }

  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        var c = en.target.querySelector("[data-count]");
        if (c) count(c);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (n) { io.observe(n); });
  } else {
    items.forEach(function (n) { n.classList.add("is-in"); });
  }

  /* ---------- вкладки цен ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".ptabs [role=tab]"));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(t); });
    t.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      var nx = tabs[(i + d + tabs.length) % tabs.length];
      select(nx); nx.focus();
    });
  });

  /* ---------- выбор услуги из карточек ---------- */
  var sel = document.getElementById("serviceSel");
  document.querySelectorAll("[data-service]").forEach(function (a) {
    a.addEventListener("click", function () {
      var v = a.getAttribute("data-service");
      if (!sel) return;
      for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === v) sel.selectedIndex = i;
    });
  });

  /* ---------- форма (демо, без отправки) ---------- */
  var form = document.getElementById("booking");
  if (form) {
    var ok = form.querySelector(".form__ok");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = false;
      ["name", "phone"].forEach(function (n) {
        var f = form.elements[n];
        var err = !f.value.trim() || (n === "phone" && f.value.replace(/\D/g, "").length < 10);
        f.classList.toggle("is-err", err);
        if (err) bad = true;
      });
      if (bad) { ok.textContent = "Проверьте имя и телефон."; ok.style.color = "#c2553a"; return; }
      ok.style.color = "";
      ok.textContent = "Спасибо! На демо заявка не отправляется, на настоящем сайте администратор перезвонит.";
      form.reset();
    });
  }
})();
