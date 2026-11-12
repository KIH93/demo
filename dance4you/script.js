(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- данные ---------- */
  var G = {
    pink: "linear-gradient(135deg,#3a0b2b,#ff2e7e)",
    violet: "linear-gradient(135deg,#1c0b3d,#7a2cff)",
    mix: "linear-gradient(135deg,#7a2cff,#ff2e7e)",
    cyan: "linear-gradient(135deg,#0b2a3d,#3fe0ff)",
    amber: "linear-gradient(135deg,#3d1f0b,#ffb547)",
    deep: "linear-gradient(135deg,#120b24,#4b1a6e)"
  };
  var STYLES = [
    { n: "High heels", f: ["adult"], age: "16+", lvl: "с нуля", ic: "👠", g: G.pink, d: "Пластика и уверенность на каблуках. Можно начать в кроссовках, каблуки по желанию." },
    { n: "K-pop", f: ["teen"], age: "12+", lvl: "с нуля", ic: "🎤", g: G.violet, d: "Хореография под любимые треки корейских групп, разучиваем связки целиком." },
    { n: "Hip-hop", f: ["teen", "adult"], age: "12+", lvl: "с нуля", ic: "🧢", g: G.amber, d: "Грув, базовые шаги и музыкальность. Хороший старт в уличных стилях." },
    { n: "Jazz-funk", f: ["teen", "adult"], age: "14+", lvl: "с нуля", ic: "✨", g: G.mix, d: "Яркая хореография с характером на стыке джаза, хип-хопа и шоу." },
    { n: "Dancehall", f: ["teen", "adult"], age: "12+", lvl: "с нуля", ic: "🌴", g: G.amber, d: "Ямайский стиль с энергией и юмором, отлично снимает напряжение после дня." },
    { n: "Dancemix", f: ["teen"], age: "12+", lvl: "с нуля", ic: "🎧", g: G.cyan, d: "Несколько стилей в одном классе. Подходит, если пока не выбрали своё." },
    { n: "Контемп", f: ["adult", "teen"], age: "14+", lvl: "любой", ic: "🌊", g: G.deep, d: "Свободное движение, работа с полом и дыханием, про ощущения, а не про позы." },
    { n: "Vogue", f: ["adult", "teen"], age: "14+", lvl: "с нуля", ic: "💃", g: G.pink, d: "Подиумная подача, руки и позы. Много уверенности и немного театра." },
    { n: "Strip-пластика", f: ["adult"], age: "16+", lvl: "с нуля", ic: "🖤", g: G.deep, d: "Женственная пластика и гибкость в бережном темпе, без оценок и стеснения." },
    { n: "Тверк", f: ["adult"], age: "16+", lvl: "с нуля", ic: "🔥", g: G.mix, d: "Работа бёдер и корпуса, заодно отличная нагрузка на ноги и спину." },
    { n: "Шаффл", f: ["teen", "adult"], age: "12+", lvl: "с нуля", ic: "⚡", g: G.cyan, d: "Быстрые шаги под электронную музыку, удобно повторять дома." },
    { n: "Afro", f: ["adult", "teen"], age: "14+", lvl: "с нуля", ic: "🥁", g: G.amber, d: "Ритм, заземлённость и много радости. Хорошо прокачивает выносливость." },
    { n: "House", f: ["adult", "teen"], age: "14+", lvl: "любой", ic: "🏠", g: G.violet, d: "Лёгкий прыгучий фрейстайл клубной культуры, про музыку и импровизацию." },
    { n: "Свадебный танец", f: ["adult"], age: "пары", lvl: "индивидуально", ic: "💍", g: G.pink, d: "Постановка первого танца под вашу песню, даже если оба никогда не танцевали." },
    { n: "Baby", f: ["kids"], age: "5-7 лет", lvl: "с нуля", ic: "🧸", g: G.amber, d: "Игровой формат: ритм, координация и первые танцевальные движения." },
    { n: "Kids", f: ["kids"], age: "8-11 лет", lvl: "с нуля", ic: "🌟", g: G.cyan, d: "Танцы для детей с основами хип-хопа и современной хореографии." },
    { n: "Kids Pro", f: ["kids"], age: "8-11 лет", lvl: "продолжающие", ic: "🏆", g: G.mix, d: "Для детей, которые уже танцуют и хотят выступать с постановками." },
    { n: "Full body", f: ["fit"], age: "12+", lvl: "любой", ic: "💪", g: G.violet, d: "Функциональная тренировка на всё тело под музыку." },
    { n: "Здоровая спина", f: ["fit"], age: "12+", lvl: "любой", ic: "🧘", g: G.cyan, d: "Мягкая работа с мышцами спины и осанкой. Подходит при сидячей работе." },
    { n: "Стретчинг", f: ["fit", "adult"], age: "12+", lvl: "любой", ic: "🤸", g: G.deep, d: "Растяжка и гибкость в спокойном темпе, можно с нулевой подготовкой." }
  ];

  var COL = { "Jazz Funk": "#ff2e7e", "Dancemix": "#3fe0ff", "K-pop": "#7a2cff", "Hip-Hop": "#ffb547", "Kids Pro": "#ff6fa8", "Baby": "#ffb547", "Kids": "#3fe0ff", "Dancehall": "#ffb547", "Full Body": "#7a2cff", "Здоровая спина": "#3fe0ff", "Stretching": "#ff6fa8", "Strip": "#ff2e7e" };
  function ageGroup(a) { return /5-7|8-11/.test(a) ? "kids" : (a === "16+" ? "adult" : "teen"); }
  var DAYS = [
    { k: "Пн", n: "Понедельник", s: [["18:00", "Jazz Funk", "14+", "Даша"], ["19:00", "Dancemix", "12+", "Аня"], ["20:00", "K-pop", "12+", "Карина"]] },
    { k: "Вт", n: "Вторник", s: [["17:00", "Hip-Hop", "12+", "Аня"], ["18:00", "Kids Pro", "8-11", "Аня"], ["18:00", "Baby", "5-7", "Настя"], ["19:00", "Kids", "8-11", "Настя"], ["20:00", "Dancehall", "12+", "Лилия"]] },
    { k: "Ср", n: "Среда", s: [["18:00", "Full Body", "12+", "Регина"], ["19:00", "Здоровая спина", "12+", "Регина"], ["20:00", "Stretching", "12+", "Айвика"], ["20:00", "K-pop", "12+", "Карина"], ["21:00", "Strip", "16+", "Айвика"]] },
    { k: "Чт", n: "Четверг", s: [["17:00", "Hip-Hop", "12+", "Аня"], ["18:00", "Kids Pro", "8-11", "Аня"], ["18:30", "Baby", "5-7", "Настя"], ["19:00", "Jazz Funk", "14+", "Даша"], ["20:00", "Dancemix", "12+", "Аня"], ["20:00", "Dancehall", "12+", "Лилия"]] },
    { k: "Пт", n: "Пятница", s: [["18:00", "Full Body", "12+", "Регина"], ["19:00", "Здоровая спина", "12+", "Регина"], ["19:00", "Kids", "8-11", "Настя"], ["20:00", "Stretching", "12+", "Айвика"], ["21:00", "Strip", "16+", "Айвика"]] }
  ];

  var PLANS = {
    dance: [
      ["1 занятие", "1 час", 700, ""], ["4 занятия", "28 дней, 1 направление", 2500, ""], ["8 занятий", "28 дней, 1 направление", 4000, "Чаще выбирают"],
      ["12 занятий", "28 дней, любые направления", 5500, ""], ["16 занятий", "28 дней, любые направления", 6500, ""], ["Безлимит танцы", "28 дней", 7500, ""]
    ],
    fit: [
      ["1 занятие", "1 час", 800, ""], ["4 занятия", "28 дней, 1 направление", 2800, ""], ["8 занятий", "28 дней, 1 направление", 4500, "Чаще выбирают"],
      ["12 занятий", "28 дней, любые направления", 6000, ""], ["16 занятий", "28 дней, любые направления", 7000, ""], ["Безлимит фитнес", "28 дней", 8000, ""]
    ],
    solo: [
      ["Персональный урок, танцы", "1 час с тренером", "от 2000", "Можно не стесняться"], ["Персональный урок, фитнес", "1 час с тренером", "от 2500", ""],
      ["Свадебный танец", "постановка для пары", "по запросу", ""], ["Аренда зала", "1 час", "от 700", ""]
    ]
  };

  var TEAM = [
    { n: "Аня", d: "Hip-hop, Dancemix, Kids Pro", g: G.amber },
    { n: "Даша", d: "Jazz-funk", g: G.pink },
    { n: "Карина", d: "K-pop", g: G.violet },
    { n: "Настя", d: "Baby, Kids", g: G.cyan },
    { n: "Лилия", d: "Dancehall", g: G.mix },
    { n: "Регина", d: "Full body, Здоровая спина", g: G.deep },
    { n: "Айвика", d: "Стретчинг, Strip-пластика", g: G.pink }
  ];

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function rub(v) { return typeof v === "number" ? v.toLocaleString("ru-RU") + " руб." : (/\d/.test(v) ? v + " руб." : v); }

  /* ---------- первый экран ---------- */
  var rises = document.querySelectorAll(".rise");
  rises.forEach(function (r, i) { setTimeout(function () { r.classList.add("in"); }, reduce ? 0 : 120 + i * 140); });

  var words = Array.prototype.slice.call(document.querySelectorAll(".lineup__wall span"));
  var litA = 0;
  function lightUp() {
    words.forEach(function (w) { w.classList.remove("lit", "lit2"); });
    litA = (litA + 3 + Math.floor(Math.random() * 5)) % words.length;
    words[litA].classList.add("lit");
    words[(litA + 7) % words.length].classList.add("lit2");
  }
  lightUp();
  if (!reduce) setInterval(lightUp, 1600);

  var jsDay = new Date().getDay(); // 0 вс
  var todayIdx = jsDay >= 1 && jsDay <= 5 ? jsDay - 1 : 0;
  var np = document.getElementById("nowplay");
  var npPrefix = np.previousSibling;
  if (todayIdx !== jsDay - 1) npPrefix.textContent = "В понедельник: ";
  var npI = 0;
  function nowplay() {
    var s = DAYS[todayIdx].s[npI % DAYS[todayIdx].s.length];
    np.textContent = s[1] + " " + s[2] + ", " + s[0];
    npI++;
  }
  nowplay();
  if (!reduce) setInterval(nowplay, 3200);

  /* ---------- направления ---------- */
  var grid = document.getElementById("stylesGrid");
  function renderStyles(f) {
    grid.innerHTML = "";
    STYLES.filter(function (s) { return f === "all" || s.f.indexOf(f) > -1; }).forEach(function (s, i) {
      var c = el("article", "style");
      c.style.animationDelay = (reduce ? 0 : i * 40) + "ms";
      c.innerHTML = '<div class="style__art" style="--g:' + s.g + '"><span class="style__mark">' + s.n + '</span><span class="style__icon" aria-hidden="true">' + s.ic + '</span></div>' +
        '<div class="style__body"><h3>' + s.n + '</h3><div class="style__meta"><span>' + s.age + '</span><span>' + s.lvl + '</span></div><p>' + s.d + '</p></div>';
      grid.appendChild(c);
    });
  }
  renderStyles("all");
  document.querySelectorAll("#styles .chip").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("#styles .chip").forEach(function (x) { x.classList.remove("is-on"); x.setAttribute("aria-selected", "false"); });
      b.classList.add("is-on"); b.setAttribute("aria-selected", "true");
      renderStyles(b.dataset.f);
    });
  });
  var fs = document.getElementById("formStyle");
  STYLES.forEach(function (s) { var o = el("option", null, s.n); fs.appendChild(o); });

  /* ---------- расписание ---------- */
  var daysBox = document.querySelector(".days");
  var board = document.getElementById("board");
  var ageSel = document.getElementById("ageSel");
  var curDay = todayIdx;
  DAYS.forEach(function (d, i) {
    var b = el("button", "day", d.k + "<small>" + d.s.length + " зан.</small>");
    b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-label", d.n);
    b.addEventListener("click", function () { curDay = i; renderBoard(); });
    daysBox.appendChild(b);
  });
  function renderBoard() {
    daysBox.querySelectorAll(".day").forEach(function (b, i) { b.classList.toggle("is-on", i === curDay); b.setAttribute("aria-selected", i === curDay); });
    board.innerHTML = "";
    var a = ageSel.value;
    var list = DAYS[curDay].s.filter(function (s) { return a === "all" || ageGroup(s[2]) === a; });
    if (!list.length) { board.appendChild(el("div", "empty", "В этот день нет занятий для выбранного возраста. Посмотрите другие дни.")); return; }
    list.forEach(function (s, i) {
      var r = el("div", "slot");
      r.style.setProperty("--c", COL[s[1]] || "#ff2e7e");
      r.style.animationDelay = (reduce ? 0 : i * 60) + "ms";
      var age = /-/.test(s[2]) ? s[2] + " лет" : s[2];
      r.innerHTML = '<span class="slot__time">' + s[0] + '</span><div><div class="slot__name">' + s[1] + '</div><div class="slot__who">Тренер: ' + s[3] + '</div></div><span class="slot__age">' + age + '</span>';
      board.appendChild(r);
    });
  }
  ageSel.addEventListener("change", renderBoard);
  renderBoard();

  /* ---------- цены ---------- */
  var plans = document.getElementById("plans");
  function renderPlans(t) {
    plans.innerHTML = "";
    PLANS[t].forEach(function (p, i) {
      var c = el("div", "plan" + (p[3] ? " plan--hot" : ""));
      c.style.animationDelay = (reduce ? 0 : i * 50) + "ms";
      var per = "";
      var m = /^(\d+) занят/.exec(p[0]);
      if (m && +m[1] > 1 && typeof p[2] === "number") per = '<div class="plan__per">' + Math.round(p[2] / +m[1]) + " руб. за занятие</div>";
      c.innerHTML = (p[3] ? '<span class="plan__tag">' + p[3] + "</span>" : "") + '<div class="plan__name">' + p[0] + '</div><div class="plan__term">' + p[1] + '</div><div class="plan__price">' + rub(p[2]) + "</div>" + per;
      plans.appendChild(c);
    });
  }
  renderPlans("dance");
  document.querySelectorAll(".tab").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(function (x) { x.classList.remove("is-on"); x.setAttribute("aria-selected", "false"); });
      b.classList.add("is-on"); b.setAttribute("aria-selected", "true");
      renderPlans(b.dataset.t);
    });
  });

  /* ---------- преподаватели ---------- */
  var tg = document.getElementById("teamGrid");
  TEAM.forEach(function (t) {
    var c = el("article", "coach reveal");
    c.innerHTML = '<div class="coach__ph" style="--g:' + t.g + '"><span class="coach__init" aria-hidden="true">' + t.n.charAt(0) + '</span><small>Фото после согласования</small></div><div class="coach__body"><h3>' + t.n + "</h3><p>" + t.d + "</p></div>";
    tg.appendChild(c);
  });

  /* ---------- залы: переключение света ---------- */
  var LIGHTS = [["warm", "тёплый"], ["neon", "неон"], ["cold", "холодный"], ["party", "цветной"]];
  document.querySelectorAll(".hall").forEach(function (h) {
    h.querySelector(".hall__room").addEventListener("click", function () {
      var i = LIGHTS.findIndex(function (l) { return l[0] === h.dataset.light; });
      var n = LIGHTS[(i + 1) % LIGHTS.length];
      h.dataset.light = n[0];
      h.querySelector(".hall__mode b").textContent = n[1];
    });
  });

  /* ---------- сертификат ---------- */
  var gs = document.getElementById("giftSum");
  document.querySelectorAll("#gift .chip").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("#gift .chip").forEach(function (x) { x.classList.remove("is-on"); });
      b.classList.add("is-on");
      gs.style.opacity = 0;
      setTimeout(function () { gs.textContent = b.dataset.sum; gs.style.opacity = 1; }, reduce ? 0 : 200);
    });
  });

  /* ---------- форма (демо) ---------- */
  var form = document.getElementById("form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    ["name", "phone"].forEach(function (k) {
      var i = form.elements[k];
      var bad = !i.value.trim() || (k === "phone" && i.value.replace(/\D/g, "").length < 10);
      i.classList.toggle("err", bad);
      if (bad) ok = false;
    });
    if (!ok) return;
    document.getElementById("formOk").hidden = false;
    form.reset();
  });

  /* ---------- меню ---------- */
  var burger = document.querySelector(".burger"), nav = document.querySelector(".nav");
  burger.addEventListener("click", function () {
    var o = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", o);
  });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }); });

  /* ---------- появление, счётчики, док ---------- */
  function count(b) {
    var to = +b.dataset.count, dec = +(b.dataset.dec || 0), suf = b.dataset.suffix || "";
    var from = b.hasAttribute("data-plain") ? to - 7 : 0;
    if (reduce) { b.textContent = to.toFixed(dec) + suf; return; }
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1400, 1), e = 1 - Math.pow(1 - p, 3);
      var v = from + (to - from) * e;
      b.textContent = (dec ? v.toFixed(dec) : Math.round(v)) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        var b = en.target.querySelector("[data-count]");
        if (b) count(b);
        io.unobserve(en.target);
      });
    }, { threshold: .15, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (r) { io.observe(r); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (r) { r.classList.add("in"); });
  }

  var dock = document.querySelector(".dock"), hero = document.querySelector(".lineup"), su = document.getElementById("signup");
  function onScroll() {
    var y = window.scrollY, h = hero.offsetHeight;
    var r = su.getBoundingClientRect();
    var inForm = r.top < window.innerHeight * .6 && r.bottom > 0;
    dock.classList.toggle("show", y > h * .7 && !inForm);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
