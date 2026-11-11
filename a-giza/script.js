(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- helpers ---------- */
  function rng(seed) { // детерминированный генератор, чтобы рисунок был одинаковым
    return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  }
  function cubic(p, t) {
    var u = 1 - t;
    return {
      x: u*u*u*p[0] + 3*u*u*t*p[2] + 3*u*t*t*p[4] + t*t*t*p[6],
      y: u*u*u*p[1] + 3*u*u*t*p[3] + 3*u*t*t*p[5] + t*t*t*p[7]
    };
  }
  function tangent(p, t) {
    var a = cubic(p, Math.max(0, t - 0.01)), b = cubic(p, Math.min(1, t + 0.01));
    var dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
    return { x: dx / l, y: dy / l };
  }
  function el(name, attrs) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function draw(group, delayMs) {
    if (reduce) { group.classList.add("drawn"); return; }
    group.getBoundingClientRect();
    setTimeout(function () { requestAnimationFrame(function () { group.classList.add("drawn"); }); }, delayMs || 30);
  }

  /* ---------- бровь из отдельных волосков ---------- */
  // c: контрольные точки кривой (x0,y0,x1,y1,x2,y2,x3,y3), w: толщина у начала, n: число волосков
  function brow(group, c, opt) {
    opt = opt || {};
    group.classList.remove("drawn");
    group.innerHTML = "";
    var r = rng(opt.seed || 7), n = opt.n || 240, w = opt.w || 34, total = opt.dur || 1600;
    for (var i = 0; i < n; i++) {
      var t = Math.pow(r(), 0.85);
      var p = cubic(c, t), tg = tangent(c, t);
      var nx = tg.y, ny = -tg.x; // нормаль вверх
      var thick = w * (1 - t * 0.82);
      var off = (r() - 0.5) * thick;
      var x = p.x + nx * off, y = p.y + ny * off;
      // у начала волоски растут вверх, дальше ложатся вдоль кривой
      var up = Math.max(0, 1 - t * 3.2);
      var dx = tg.x * (1 - up) + 0.25 * up, dy = tg.y * (1 - up) - 1 * up;
      var dl = Math.hypot(dx, dy); dx /= dl; dy /= dl;
      var len = (opt.len || 30) * (0.6 + r() * 0.6) * (1 - t * 0.35);
      var line = el("line", {
        x1: x.toFixed(1), y1: y.toFixed(1),
        x2: (x + dx * len).toFixed(1), y2: (y + dy * len).toFixed(1),
        "stroke-width": (opt.sw || 2.4) * (0.7 + r() * 0.5),
        opacity: (0.55 + r() * 0.42).toFixed(2)
      });
      line.style.setProperty("--len", Math.ceil(len) + 1);
      line.style.setProperty("--dl", (t * total / 1000 + r() * 0.15).toFixed(2) + "s");
      group.appendChild(line);
    }
  }

  /* ---------- ресницы вдоль верхнего века ---------- */
  // profile(t) -> множитель длины; vol: 1..3
  function lashes(group, c, opt) {
    group.classList.remove("drawn");
    group.innerHTML = "";
    var r = rng(opt.seed || 11), n = opt.n || 46, vol = opt.vol || 1;
    for (var i = 0; i < n; i++) {
      var t = 0.04 + (i / (n - 1)) * 0.92;
      var p = cubic(c, t), tg = tangent(c, t);
      var nx = tg.y, ny = -tg.x;
      var base = opt.len * opt.profile(t);
      for (var k = 0; k < vol; k++) {
        var spread = (k - (vol - 1) / 2) * 0.16;
        var len = base * (0.86 + r() * 0.2);
        var side = (t - 0.5) * 1.1 + spread; // наклон к краям глаза
        var ex = p.x + (nx + tg.x * side) * len, ey = p.y + (ny + tg.y * side) * len;
        var cx = p.x + nx * len * 0.55, cy = p.y + ny * len * 0.55;
        var path = el("path", {
          d: "M" + p.x.toFixed(1) + " " + p.y.toFixed(1) + " Q" + cx.toFixed(1) + " " + cy.toFixed(1) + " " + ex.toFixed(1) + " " + ey.toFixed(1),
          "stroke-width": (opt.sw || 2.6) * (vol > 1 ? 0.8 : 1)
        });
        path.style.setProperty("--len", Math.ceil(len * 1.2));
        path.style.setProperty("--dl", ((opt.delay || 0) + i * 0.022).toFixed(2) + "s");
        group.appendChild(path);
      }
    }
  }

  /* ---------- первый экран ---------- */
  var heroBrow = document.getElementById("browHairs");
  var heroLash = document.getElementById("lashes");
  var upperLid = [330, 270, 450, 170, 760, 160, 900, 258];
  if (heroBrow) {
    brow(heroBrow, [300, 168, 470, 70, 760, 40, 990, 128], { n: 560, w: 60, len: 40, sw: 2.8, dur: 1700, seed: 5 });
    lashes(heroLash, upperLid, { n: 52, len: 58, delay: 1.3, profile: function (t) { return 0.5 + Math.pow(t, 1.3) * 0.75; } });
    draw(heroBrow, 650);
    draw(heroLash, 650);

    var eye = document.getElementById("eyeLid");
    if (!reduce) {
      var blink = function () {
        eye.classList.remove("blink"); void eye.getBBox(); eye.classList.add("blink");
        setTimeout(blink, 3800 + Math.random() * 3500);
      };
      setTimeout(blink, 3600);
      eye.addEventListener("animationend", function () { eye.classList.remove("blink"); });

      // зрачок следит за курсором
      var iris = document.getElementById("irisGroup"), svg = document.getElementById("heroEye");
      window.addEventListener("pointermove", function (e) {
        var b = svg.getBoundingClientRect();
        var cx = b.left + b.width * 0.51, cy = b.top + b.height * 0.62;
        var dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (b.width * 0.6)));
        var dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 400));
        iris.style.transform = "translate(" + (dx * 70).toFixed(1) + "px," + (dy * 14).toFixed(1) + "px)";
      }, { passive: true });
    }
  }

  /* ---------- плитка галереи с ресницами ---------- */
  document.querySelectorAll(".lashTile").forEach(function (g) {
    lashes(g, [40, 220, 110, 170, 200, 170, 260, 215], { n: 26, len: 70, sw: 2.2, profile: function (t) { return 0.6 + t * 0.5; } });
    g.classList.add("drawn");
  });

  /* ---------- вкладки услуг ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var ink = document.querySelector(".tabs__ink");
  function moveInk(t) { if (!ink) return; ink.style.width = t.offsetWidth + "px"; ink.style.transform = "translateX(" + t.offsetLeft + "px)"; }
  function selectTab(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.classList.toggle("is-on", on);
      x.setAttribute("aria-selected", on);
      x.tabIndex = on ? 0 : -1;
      var p = document.getElementById(x.getAttribute("aria-controls"));
      p.hidden = !on; p.classList.toggle("is-on", on);
    });
    moveInk(t);
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(t); });
    t.addEventListener("keydown", function (e) {
      var k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (k) { var n = tabs[(i + k + tabs.length) % tabs.length]; selectTab(n); n.focus(); }
    });
  });
  if (tabs[0]) { moveInk(tabs[0]); window.addEventListener("resize", function () { moveInk(document.querySelector(".tab.is-on")); }); }

  /* ---------- подбор ---------- */
  var mBrow = document.getElementById("mBrow"), mLash = document.getElementById("mLash");
  var mLid = [210, 260, 300, 185, 520, 178, 610, 252];
  var brows = {
    oval:   { c: [190, 150, 300, 90, 470, 72, 640, 120], t: "Мягкий изгиб", d: "Овальному лицу подходят почти любые формы. Чаще всего выбирают мягкий изгиб с плавным хвостиком." },
    round:  { c: [190, 158, 320, 100, 450, 52, 630, 128], t: "Выраженный излом", d: "Для круглого лица часто выбирают более высокий излом: он визуально вытягивает овал." },
    square: { c: [190, 150, 320, 82, 480, 70, 640, 116], t: "Округлая дуга", d: "Округлая дуга без резких углов смягчает выраженную линию скул и подбородка." },
    heart:  { c: [195, 148, 330, 98, 480, 84, 630, 126], t: "Плавная линия", d: "При лице сердечком обычно подходят плавные брови средней высоты без высокого излома." },
    long:   { c: [185, 140, 320, 112, 480, 106, 650, 122], t: "Почти прямые", d: "Для вытянутого лица выбирают более прямые брови: они визуально расширяют лицо." }
  };
  var effects = {
    natural:  { t: "Натуральный", d: "Ресницы почти как свои, только гуще и выразительнее. Подходит на каждый день.", p: function (t) { return 0.62 + Math.sin(t * Math.PI) * 0.18; } },
    fox:      { t: "Лисий", d: "Длина плавно растёт к внешнему уголку и вытягивает глаз.", p: function (t) { return 0.4 + Math.pow(t, 1.6) * 0.95; } },
    doll:     { t: "Кукольный", d: "Самые длинные ресницы в центре, глаз выглядит более открытым и округлым.", p: function (t) { return 0.45 + Math.sin(t * Math.PI) * 0.6; } },
    squirrel: { t: "Беличий", d: "Акцент ближе к внешнему краю, но не в самом уголке. Игривый и аккуратный эффект.", p: function (t) { return 0.45 + Math.exp(-Math.pow((t - 0.78) / 0.16, 2)) * 0.75; } }
  };
  var volNames = { 1: "классика", 2: "2D", 3: "3D" };
  var mode = "brow";
  var res = document.querySelector(".match__res"), mt = document.getElementById("matchTitle"), mx = document.getElementById("matchText"), cap = document.getElementById("matchCap");
  function val(name) { var i = document.querySelector('input[name="' + name + '"]:checked'); return i ? i.value : null; }
  function swapRes(title, text) {
    mt.textContent = title; mx.textContent = text;
    res.classList.remove("swap"); void res.offsetWidth; res.classList.add("swap");
  }
  function renderBrow() {
    var b = brows[val("face")];
    brow(mBrow, b.c, { n: 260, w: 34, len: 28, sw: 2.3, dur: 900, seed: 9 });
    draw(mBrow);
    swapRes(b.t, b.d);
    cap.textContent = "Схема формы, не фото работы";
  }
  function renderLash(withBrow) {
    var e = effects[val("effect")], v = +val("vol");
    lashes(mLash, mLid, { n: 34, len: 46, vol: v, sw: 2.4, profile: e.p, seed: 3 });
    draw(mLash);
    swapRes(e.t + ", " + volNames[v], e.d);
    cap.textContent = "Схема эффекта, не фото работы";
  }
  function lashBase() { // короткие свои ресницы для режима бровей
    lashes(mLash, mLid, { n: 30, len: 26, vol: 1, sw: 2, profile: function () { return 1; }, seed: 3 });
    draw(mLash);
  }
  if (mBrow) {
    brow(mBrow, brows.oval.c, { n: 260, w: 34, len: 28, sw: 2.3, dur: 900, seed: 9 });
    lashBase();
    cap.textContent = "Схема формы, не фото работы";
    var drawnOnce = false;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en, o) {
        if (en[0].isIntersecting && !drawnOnce) { drawnOnce = true; draw(mBrow, 200); o.disconnect(); }
      }, { threshold: 0.4 }).observe(mBrow.ownerSVGElement);
    } else draw(mBrow);

    document.querySelectorAll('input[name="face"]').forEach(function (i) { i.addEventListener("change", renderBrow); });
    document.querySelectorAll('input[name="effect"],input[name="vol"]').forEach(function (i) { i.addEventListener("change", function () { renderLash(); }); });

    var sw = Array.prototype.slice.call(document.querySelectorAll(".switch__b"));
    sw.forEach(function (b) {
      b.addEventListener("click", function () {
        mode = b.dataset.mode;
        sw.forEach(function (x) { var on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; });
        document.getElementById("browOpts").hidden = mode !== "brow";
        document.getElementById("lashEffect").hidden = mode !== "lash";
        document.getElementById("lashVol").hidden = mode !== "lash";
        if (mode === "brow") { lashBase(); renderBrow(); } else { renderLash(); }
      });
    });
  }

  /* ---------- появление при прокрутке и счётчики ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    // лёгкая очередность внутри групп
    document.querySelectorAll(".panel, .masters__row, .rev__grid, .stats, .steps, .faq__list, .strip").forEach(function (g) {
      Array.prototype.forEach.call(g.querySelectorAll(".reveal"), function (x, i) { x.style.setProperty("--rd", (i * 0.09) + "s"); });
    });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (r) { io.observe(r); });

    var cio = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var elx = e.target, to = +elx.dataset.count, dec = +(elx.dataset.dec || 0), t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var k = Math.min(1, (ts - t0) / 1400), v = to * (1 - Math.pow(1 - k, 3));
          elx.textContent = dec ? v.toFixed(dec) : Math.round(v);
          if (k < 1) requestAnimationFrame(step);
        }
        elx.textContent = dec ? (0).toFixed(dec) : "0";
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-count]").forEach(function (c) { cio.observe(c); });
  } else {
    doc.classList.add("no-io");
  }

  /* ---------- шапка и липкая кнопка ---------- */
  var top = document.querySelector(".top"), sticky = document.querySelector(".sticky-book"), hero = document.querySelector(".gaze"), contacts = document.getElementById("contacts");
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle("is-scrolled", y > 8);
    var past = hero.getBoundingClientRect().bottom < 0;
    var atContacts = contacts.getBoundingClientRect().top < window.innerHeight * 0.6;
    sticky.classList.toggle("is-on", past && !atContacts);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
