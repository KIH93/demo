(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nf = new Intl.NumberFormat("ru-RU");

  /* буквы заголовка по очереди */
  document.querySelectorAll("[data-letters]").forEach(function (el) {
    var t = el.textContent;
    el.textContent = "";
    Array.prototype.forEach.call(t, function (c, i) {
      var s = document.createElement("span");
      s.className = "ch";
      s.style.setProperty("--i", i);
      s.setAttribute("aria-hidden", "true");
      s.textContent = c;
      el.appendChild(s);
    });
  });

  /* ГРИВА: пряди на canvas, курсор их расчёсывает */
  var cv = document.querySelector(".mane__canvas");
  if (cv && cv.getContext) {
    var ctx = cv.getContext("2d");
    var W = 0, H = 0, dpr = 1, strands = [], cx = 0, cy = 0;
    var mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    var SEG = 16;
    var palette = ["#e2b764", "#c9944f", "#a86d34", "#f0d49a", "#8a5a2b"];

    function build() {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2; cy = H * 0.46;
      var m = Math.min(W, H);
      var small = W < 700;
      var count = small ? 220 : 380;
      var r0 = m * (small ? 0.3 : 0.27);
      strands = [];
      for (var i = 0; i < count; i++) {
        var a = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.05;
        var rr = r0 * (0.85 + Math.random() * 0.3);
        // по бокам и снизу грива длиннее, как у льва
        var len = m * (0.28 + Math.random() * 0.22) * (1 + 0.35 * Math.abs(Math.cos(a)) + 0.25 * Math.max(0, Math.sin(a)));
        strands.push({
          a: a,
          x0: cx + Math.cos(a) * rr * (small ? 1 : 1.35),
          y0: cy + Math.sin(a) * rr,
          len: len,
          curl: (Math.random() - 0.5) * 1.1,
          ph: Math.random() * Math.PI * 2,
          w: 0.6 + Math.random() * 1.4,
          col: palette[(Math.random() * palette.length) | 0],
          al: 0.25 + Math.random() * 0.55,
          off: [] // смещение точек от курсора, сглаживается
        });
        for (var k = 0; k <= SEG; k++) strands[i].off.push({ x: 0, y: 0 });
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      mouse.x += (mouse.tx - mouse.x) * 0.18;
      mouse.y += (mouse.ty - mouse.y) * 0.18;
      var R = Math.min(W, H) * 0.16;
      var time = t * 0.001;
      ctx.lineCap = "round";
      for (var i = 0; i < strands.length; i++) {
        var s = strands[i];
        var x = s.x0, y = s.y0, ang = s.a;
        var step = s.len / SEG;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (var k = 1; k <= SEG; k++) {
          var f = k / SEG;
          ang += (s.curl * 0.06) + Math.sin(time * 0.9 + s.ph + f * 2.4) * 0.035 * f;
          x += Math.cos(ang) * step;
          y += Math.sin(ang) * step + f * f * 0.9; // лёгкая тяжесть
          var o = s.off[k];
          var dx = x + o.x - mouse.x, dy = y + o.y - mouse.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          var tx = 0, ty = 0;
          if (d < R && d > 0.1) {
            var p = (1 - d / R) * 46 * (0.35 + f);
            tx = (dx / d) * p; ty = (dy / d) * p;
          }
          o.x += (tx - o.x) * 0.12;
          o.y += (ty - o.y) * 0.12;
          ctx.lineTo(x + o.x, y + o.y);
        }
        ctx.strokeStyle = s.col;
        ctx.globalAlpha = s.al;
        ctx.lineWidth = s.w;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    var running = false, visible = true, raf = 0;
    function loop(t) { draw(t); if (running) raf = requestAnimationFrame(loop); }
    function start() { if (!running && visible && !reduce) { running = true; raf = requestAnimationFrame(loop); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    build();
    draw(0);
    start();

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { build(); draw(performance.now()); }, 150);
    });

    var hero = document.querySelector(".mane");
    function setPt(e) {
      var r = cv.getBoundingClientRect();
      mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
      if (reduce) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
    }
    hero.addEventListener("pointermove", setPt);
    hero.addEventListener("pointerdown", setPt);
    hero.addEventListener("pointerleave", function () { mouse.tx = -9999; mouse.ty = -9999; });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        visible ? start() : stop();
      }).observe(hero);
    }
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  }

  /* шапка и липкая кнопка */
  var top = document.querySelector(".top");
  var sticky = document.querySelector(".sticky-book");
  var contacts = document.getElementById("kontakty");
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle("is-solid", y > 40);
    var nearEnd = contacts && contacts.getBoundingClientRect().top < window.innerHeight * 0.6;
    sticky.classList.toggle("is-on", y > window.innerHeight * 0.7 && !nearEnd);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* счётчики */
  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    var to = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || "0", 10);
    var fmt = function (v) { return dec ? v.toFixed(dec).replace(".", ",") : nf.format(Math.round(v)); };
    if (reduce) { el.textContent = fmt(to); return; }
    var t0 = performance.now(), dur = 1400;
    (function tick(now) {
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* появление блоков */
  var revs = document.querySelectorAll(".reveal");
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        e.target.querySelectorAll("[data-count]").forEach(countUp);
        if (e.target.hasAttribute("data-count")) countUp(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revs.forEach(function (el) {
      var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty("--rd", Math.min(sib, 5) * 0.08 + "s");
      io.observe(el);
    });
    // счётчики первого экрана
    setTimeout(function () {
      document.querySelectorAll(".mane__bar [data-count]").forEach(countUp);
    }, 1300);
  } else {
    revs.forEach(function (el) { el.classList.add("is-in"); });
    counters.forEach(countUp);
  }

  /* конструктор визита */
  var boxes = document.querySelectorAll("[data-svc]");
  var list = document.querySelector("[data-total-list]");
  var sumEl = document.querySelector("[data-total-sum]");
  var minEl = document.querySelector("[data-total-min]");
  var isNew = document.querySelector("[data-new]");
  var combo = document.querySelector(".svc__combo");
  var COMBO = 2400, COMBO_MIN = 90, DISC = 300;

  function name(inp) { return inp.closest(".svc__card").querySelector(".svc__name").textContent; }
  function li(label, val) {
    var l = document.createElement("li");
    var a = document.createElement("span"); a.textContent = label;
    var b = document.createElement("b"); b.textContent = val;
    l.appendChild(a); l.appendChild(b);
    return l;
  }
  function calc() {
    var sel = {}, sum = 0, min = 0;
    list.innerHTML = "";
    boxes.forEach(function (b) { if (b.checked) sel[b.dataset.svc] = b; });
    var both = sel.cut && sel.beard;
    combo.classList.toggle("is-on", !!both);
    if (both) {
      list.appendChild(li("Комплекс: стрижка + борода", nf.format(COMBO) + " руб."));
      sum += COMBO; min += COMBO_MIN;
    }
    boxes.forEach(function (b) {
      if (!b.checked) return;
      if (both && (b.dataset.svc === "cut" || b.dataset.svc === "beard")) return;
      var p = +b.dataset.price;
      list.appendChild(li(name(b), nf.format(p) + " руб."));
      sum += p; min += +b.dataset.min;
    });
    if (!sum) {
      var e = li("Отметьте хотя бы одну услугу", "");
      e.className = "is-empty";
      list.appendChild(e);
    } else if (isNew.checked) {
      list.appendChild(li("Скидка новому клиенту", "−" + DISC + " руб."));
      sum = Math.max(0, sum - DISC);
    }
    sumEl.textContent = nf.format(sum);
    var h = Math.floor(min / 60), m = min % 60;
    minEl.textContent = min ? (h ? h + " ч " : "") + (m ? m + " мин" : "") : "0 мин";
    var bx = sumEl.parentNode;
    bx.classList.remove("bump"); void bx.offsetWidth; bx.classList.add("bump");
  }
  boxes.forEach(function (b) { b.addEventListener("change", calc); });
  isNew.addEventListener("change", calc);
  calc();

  /* галерея: перетаскивание мышью */
  var strip = document.querySelector(".strip");
  if (strip) {
    var down = false, sx = 0, sl = 0;
    strip.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      down = true; sx = e.clientX; sl = strip.scrollLeft; strip.classList.add("is-drag");
    });
    window.addEventListener("pointerup", function () { down = false; strip.classList.remove("is-drag"); });
    strip.addEventListener("pointermove", function (e) {
      if (!down) return;
      e.preventDefault();
      strip.scrollLeft = sl - (e.clientX - sx);
    });
  }
})();
