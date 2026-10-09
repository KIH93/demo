(function () {
  var C = window.ESC_CONFIG || {};

  function waLink(text) {
    return "https://wa.me/" + C.WHATSAPP_NUMBER + (text ? "?text=" + encodeURIComponent(text) : "");
  }
  function each(sel, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), fn);
  }
  function fmt(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  /* Контакты из config.js */
  each("[data-tel]", function (a) {
    var city = a.getAttribute("data-tel") === "city";
    a.href = "tel:" + (city ? C.PHONE_CITY : C.PHONE_MAIN);
    var t = a.querySelector("[data-tel-text]");
    if (t) t.textContent = city ? C.PHONE_CITY_TEXT : C.PHONE_MAIN_TEXT;
  });
  /* Мессенджеры на равных: WhatsApp получает текст в ссылке,
     для Telegram и MAX текст копируется в буфер перед открытием чата */
  var CH_URL = { tg: C.TELEGRAM_URL, max: C.MAX_URL };
  function setMsg(a, text) {
    if (text != null) a.setAttribute("data-msg", text);
    var ch = a.getAttribute("data-ch");
    a.href = ch === "wa" ? waLink(a.getAttribute("data-msg")) : CH_URL[ch];
  }
  each("[data-ch]", function (a) { setMsg(a); });

  var toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  var toastTimer;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 3500);
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-ch='tg'], [data-ch='max']");
    if (!a) return;
    var isMax = a.getAttribute("data-ch") === "max";
    var hint = isMax ? "В MAX найдите номер " + C.PHONE_MAIN_TEXT + " и вставьте текст в чат" : "Вставьте его в чат";
    var text = a.getAttribute("data-msg");
    if (!text || !navigator.clipboard) {
      if (isMax) showToast("В MAX напишите на номер " + C.PHONE_MAIN_TEXT);
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      showToast("Текст заявки скопирован. " + hint);
    }, function () {
      if (isMax) showToast("В MAX напишите на номер " + C.PHONE_MAIN_TEXT);
    });
  });

  each("[data-gis]", function (a) { a.href = C.GIS_URL; });
  each("[data-gis-route]", function (a) { a.href = C.GIS_ROUTE_URL; });
  each("[data-author]", function (a) { a.href = C.AUTHOR_CONTACT_URL; });
  each("[data-cfg]", function (el) {
    var v = C[el.getAttribute("data-cfg")];
    if (v != null) el.textContent = typeof v === "number" ? fmt(v) : v;
  });

  /* Плашка демо: закрывается до перезагрузки */
  var bar = document.querySelector(".demo-bar");
  if (bar) {
    bar.querySelector(".demo-bar__close").addEventListener("click", function () {
      bar.hidden = true;
    });
  }

  /* Мобильное меню */
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        burger.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });
  }

  /* Счётчики */
  var counters = document.querySelectorAll("[data-count]");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function run(el) {
    var target = C[el.getAttribute("data-count")] || 0;
    if (reduce) { el.textContent = fmt(target); return; }
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1200, 1);
      el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    each("[data-count]", function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(counters, run);
  }

  /* Подборщик "Что сломалось?" */
  var SYMPTOMS = {
    "Фотоаппарат": ["Не включается", "Чёрные кадры", "Не видит карту памяти", "Другое"],
    "Объектив": ["Не фокусируется", "Заклинил", "Ошибка связи с камерой", "Другое"],
    "Вспышка": ["Не срабатывает", "Не заряжается", "Нет связи с камерой", "Другое"],
    "Ноутбук": ["Не включается", "Греется и шумит", "Залит жидкостью", "Другое"],
    "Телефон": ["Разбит экран", "Не заряжается", "Быстро садится", "Другое"],
    "Робот-пылесос": ["Не заряжается", "Крутится на месте", "Ошибка на дисплее", "Другое"],
    "Кофемашина": ["Не греет воду", "Протекает", "Не мелет зерно", "Другое"],
    "Другое": ["Не включается", "Работает с перебоями", "Механическое повреждение", "Другое"]
  };
  var picker = document.querySelector(".picker");
  if (picker) {
    var devBox = picker.querySelector("[data-step='device']");
    var symBox = picker.querySelector("[data-step='symptom']");
    var symWrap = picker.querySelector(".picker__step--symptom");
    var result = picker.querySelector(".picker__result");
    var preview = picker.querySelector(".picker__text");
    var msgLinks = picker.querySelectorAll(".picker__msgs [data-ch]");
    var state = { device: null, symptom: null };

    function message() {
      return "Здравствуйте! Хочу записаться на диагностику. Техника: " + state.device.toLowerCase() +
        ", проблема: " + state.symptom.toLowerCase() + ". Пишу с сайта.";
    }
    function chip(label, group) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = label;
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () {
        each("." + group + " .chip", function (c) { c.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        if (group === "picker-dev") {
          state.device = label;
          state.symptom = null;
          result.hidden = true;
          symBox.innerHTML = "";
          SYMPTOMS[label].forEach(function (s) { symBox.appendChild(chip(s, "picker-sym")); });
          symWrap.hidden = false;
        } else {
          state.symptom = label;
          preview.textContent = message();
          Array.prototype.forEach.call(msgLinks, function (a) { setMsg(a, message()); });
          result.hidden = false;
        }
      });
      return b;
    }
    devBox.classList.add("picker-dev");
    symBox.classList.add("picker-sym");
    Object.keys(SYMPTOMS).forEach(function (d) { devBox.appendChild(chip(d, "picker-dev")); });
  }

  /* Карточки услуг без отдельной страницы: ведём в контакты с готовым сообщением */
  var soon = document.querySelector(".soon");
  each("[data-soon]", function (a) {
    a.addEventListener("click", function () {
      if (!soon) return;
      var name = a.getAttribute("data-soon");
      soon.querySelector(".soon__name").textContent = name;
      var text = "Здравствуйте! Интересует ремонт: " + name.toLowerCase() + ". Пишу с сайта.";
      each(".soon__msgs [data-ch]", function (l) { setMsg(l, text); });
      soon.hidden = false;
    });
  });
})();
