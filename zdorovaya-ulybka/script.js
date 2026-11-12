(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Зубная формула ---------- */
  var SHAPES = {
    inc: { root: "M15 32C15 20 17 8 20 3c3 5 5 17 5 29z", crown: "M11 31h18c1 10-1 20-5 26h-8c-4-6-6-16-5-26z" },
    can: { root: "M15 32C15 18 17 6 20 0c3 6 5 18 5 32z", crown: "M12 31h16c1 11-3 20-8 27-5-7-9-16-8-27z" },
    pre: { root: "M13 32c0-11 3-21 7-27 4 6 7 16 7 27z", crown: "M9 31h22c2 8 1 17-3 24-3 2-5 1-8 2-3-1-5 0-8-2-4-7-5-16-3-24z" },
    mol: { root: "M7 32c0-10 2-19 5-25 3 6 5 15 5 25zM23 32c1-10 3-19 6-25 3 6 4 15 4 25z", crown: "M5 31h30c2 8 1 18-3 25-4 2-8-1-12 0-4-1-8 2-12 0-4-7-5-17-3-25z" }
  };
  var INFO = {
    inc: { type: "Резец, передний зуб", list: ["Лечение кариеса от <b>3 500 руб.</b>", "Виниры из циркония", "Отбеливание Amazing White", "Реставрация"], svc: "Лечение кариеса" },
    can: { type: "Клык", list: ["Реставрация", "Лечение клиновидного дефекта", "Брекеты Damon Q от <b>62 000 руб.</b>"], svc: "Брекеты" },
    pre: { type: "Премоляр, малый коренной", list: ["Лечение каналов от <b>4 000 руб.</b>", "Металлокерамическая коронка <b>9 500 руб.</b>", "Замена пломбы"], svc: "Лечение каналов" },
    mol: { type: "Моляр, жевательный зуб", list: ["Коронка из циркония <b>20 500 руб.</b>", "Имплант Osstem под ключ <b>49 500 руб.</b>", "Лечение каналов"], svc: "Имплантация" },
    wis: { type: "Зуб мудрости", list: ["Удаление хирургом от <b>5 000 руб.</b>", "Рентген-снимок перед удалением", "Хирург по субботам до 17:00"], svc: "Удаление зуба" }
  };
  function kind(n) { var d = n % 10; return d <= 2 ? "inc" : d === 3 ? "can" : d <= 5 ? "pre" : "mol"; }
  function info(n) { return n % 10 === 8 ? INFO.wis : INFO[kind(n)]; }

  var top = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  var low = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
  var spots = [16, 24, 36, 45, 12, 47];
  var all = [];

  function build(row, nums, flip) {
    nums.forEach(function (n, i) {
      var s = SHAPES[kind(n)];
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tooth";
      b.dataset.n = n;
      b.style.setProperty("--i", flip ? i + 16 : i);
      b.setAttribute("aria-label", "Зуб " + n + ": " + info(n).type);
      var t = flip ? ' transform="translate(0 60) scale(1 -1)"' : "";
      var spot = spots.indexOf(n) > -1 ? '<circle class="spot" cx="' + (n % 10 > 5 ? 24 : 21) + '" cy="44" r="3.6"/>' : "";
      b.innerHTML = '<svg viewBox="0 0 40 60" aria-hidden="true"><g' + t + '><path class="root" d="' + s.root + '"/><path class="crown" d="' + s.crown + '"/>' + spot + "</g></svg><span>" + n + "</span>";
      b.addEventListener("click", function () { stopTour(); select(n); });
      row.appendChild(b);
      all.push(b);
    });
  }
  build(document.getElementById("jawTop"), top, false);
  build(document.getElementById("jawLow"), low, true);

  var card = document.getElementById("toothCard");
  var tcNum = document.getElementById("tcNum");
  var tcType = document.getElementById("tcType");
  var tcList = document.getElementById("tcList");
  var tcBtn = document.getElementById("tcBtn");
  var current = null;

  function select(n) {
    var d = info(n);
    all.forEach(function (b) { b.classList.toggle("is-on", +b.dataset.n === n); b.setAttribute("aria-pressed", +b.dataset.n === n); });
    var el = document.querySelector('.tooth[data-n="' + n + '"]');
    if (el) el.classList.add("is-healed");
    tcNum.textContent = n;
    tcType.textContent = d.type;
    tcList.innerHTML = d.list.map(function (x) { return "<li>" + x + "</li>"; }).join("");
    tcBtn.dataset.service = d.svc;
    if (current !== null) { card.classList.remove("is-swap"); void card.offsetWidth; card.classList.add("is-swap"); }
    current = n;
  }
  select(16);
  // первый зуб "залечен" только когда тур дойдёт до него
  document.querySelector('.tooth[data-n="16"]').classList.remove("is-healed");

  var tour = [16, 24, 36, 11, 45, 13, 47, 12, 38], ti = 0, timer = null;
  function stopTour() { if (timer) { clearInterval(timer); timer = null; } }
  if (!reduce) {
    setTimeout(function () {
      if (current === 16) document.querySelector('.tooth[data-n="16"]').classList.add("is-healed");
      timer = setInterval(function () { ti = (ti + 1) % tour.length; select(tour[ti]); }, 2800);
    }, 2200);
  }
  document.querySelector(".formula").addEventListener("mouseenter", stopTour);

  /* ---------- Предзаполнение услуги в форме ---------- */
  var sel = document.getElementById("svcSelect");
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-service]");
    if (!a) return;
    var v = a.dataset.service;
    for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === v) sel.selectedIndex = i;
  });

  /* ---------- Фильтр цен ---------- */
  var tabs = document.querySelectorAll(".tab");
  var rows = document.querySelectorAll(".price__row");
  function filter(f) {
    tabs.forEach(function (t) { var on = t.dataset.f === f; t.classList.toggle("is-on", on); t.setAttribute("aria-selected", on); });
    var k = 0;
    rows.forEach(function (r) {
      var show = f === "all" || r.dataset.c === f;
      r.classList.toggle("is-hidden", !show);
      r.classList.remove("is-flash");
      if (show && !reduce) { r.style.animationDelay = (k++ * 40) + "ms"; void r.offsetWidth; r.classList.add("is-flash"); }
    });
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { filter(t.dataset.f); }); });
  document.querySelectorAll("[data-tab]").forEach(function (a) { a.addEventListener("click", function () { filter(a.dataset.tab); }); });

  /* ---------- Счётчики ---------- */
  function fmt(v, el) {
    var dec = +el.dataset.dec || 0;
    var s = v.toFixed(dec).replace(".", ",");
    if (el.dataset.sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return s;
  }
  function count(el) {
    var to = parseFloat(el.dataset.to);
    if (reduce) { el.textContent = fmt(to, el); return; }
    var t0 = null, dur = 1600;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e, el);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Появление при прокрутке ---------- */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, sib = el.parentElement.querySelectorAll(":scope > .reveal");
        var idx = Array.prototype.indexOf.call(sib, el);
        el.style.transitionDelay = Math.min(idx, 6) * 70 + "ms";
        el.classList.add("is-in");
        el.querySelectorAll(".count").forEach(count);
        io.unobserve(el);
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
    document.querySelectorAll(".count").forEach(count);
  }

  /* ---------- Форма (демо) ---------- */
  var form = document.getElementById("booking");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    ["name", "phone"].forEach(function (n) {
      var f = form.elements[n], bad = f.value.trim().length < (n === "phone" ? 10 : 2);
      f.classList.toggle("is-err", bad);
      if (bad) ok = false;
    });
    if (ok) document.getElementById("formDone").hidden = false;
  });
})();
