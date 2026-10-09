(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var DEV = window.DEVELOPER_CONTACT;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  document.documentElement.classList.remove("no-js");

  /* ---------- Данные из конфига ---------- */
  var wa = function (n) { return "https://wa.me/" + n; };
  var tg = function (u) { return "https://t.me/" + u; };

  $$("[data-tel='main']").forEach(function (a) { a.href = "tel:" + C.mainPhone; });
  $$("[data-wa='main']").forEach(function (a) { a.href = wa(C.mainWhatsApp); });
  $$("[data-tg='main']").forEach(function (a) { a.href = tg(C.mainTelegram); });
  $$("[data-link]").forEach(function (a) {
    var url = C.links && C.links[a.getAttribute("data-link")];
    if (url) a.href = url;
  });
  $$("[data-text]").forEach(function (el) {
    var v = C[el.getAttribute("data-text")];
    if (v) el.textContent = v;
  });
  $$("[data-rating]").forEach(function (el) {
    var v = C.rating && C.rating[el.getAttribute("data-rating")];
    if (v !== undefined) el.textContent = v;
  });

  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  };
  var managersBox = $("#managers");
  if (managersBox && C.managers && C.managers.length) {
    managersBox.innerHTML = C.managers.map(function (m) {
      var n = esc(m.name);
      return '<article class="manager">' +
        '<span class="manager__avatar">' + n.charAt(0) + '</span>' +
        '<div class="manager__info"><h3>' + n + '</h3><a href="tel:' + esc(m.phone) + '">' + esc(m.phoneText) + '</a></div>' +
        '<div class="manager__btns">' +
          '<a class="icon-btn icon-btn--blue" href="tel:' + esc(m.phone) + '" aria-label="Позвонить: ' + n + '"><svg><use href="#i-phone"/></svg></a>' +
          (m.whatsapp ? '<a class="icon-btn icon-btn--wa" href="' + wa(esc(m.whatsapp)) + '" target="_blank" rel="noopener" aria-label="WhatsApp: ' + n + '"><svg><use href="#i-wa"/></svg></a>' : "") +
          (m.telegram ? '<a class="icon-btn icon-btn--tg" href="' + tg(esc(m.telegram)) + '" target="_blank" rel="noopener" aria-label="Telegram: ' + n + '"><svg><use href="#i-tg"/></svg></a>' : "") +
        '</div></article>';
    }).join("");
  }

  var dev = $("#dev-contact");
  if (dev && DEV) { dev.href = DEV.url; dev.textContent = DEV.text; }

  /* ---------- Шапка и меню ---------- */
  var header = $(".header");
  var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var burger = $("#burger"), nav = $("#nav");
  var setMenu = function (open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  };
  burger.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------- Открыто / закрыто (время салона) ---------- */
  function shopNow() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: C.timezone || "Europe/Moscow", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(new Date());
    var get = function (t) { return (parts.filter(function (p) { return p.type === t; })[0] || {}).value; };
    var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day: day, min: (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10) };
  }
  var toMin = function (s) { var p = s.split(":"); return +p[0] * 60 + +p[1]; };
  var dayNames = ["в воскресенье", "в понедельник", "во вторник", "в среду", "в четверг", "в пятницу", "в субботу"];

  function openStatus() {
    if (!C.hours) return null;
    var now = shopNow(), today = C.hours[now.day];
    if (today && now.min >= toMin(today[0]) && now.min < toMin(today[1])) {
      return { open: true, text: "Сейчас открыто до " + today[1] };
    }
    if (today && now.min < toMin(today[0])) {
      return { open: false, text: "Сейчас закрыто, откроемся сегодня в " + today[0] };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7, h = C.hours[d];
      if (h) return { open: false, text: "Сейчас закрыто, откроемся " + (i === 1 ? "завтра" : dayNames[d]) + " в " + h[0] };
    }
    return null;
  }
  function renderStatus() {
    var s;
    try { s = openStatus(); } catch (e) { s = null; }
    if (!s) return;
    $$("[data-open-status]").forEach(function (el) {
      el.textContent = s.text;
      el.classList.toggle("is-open", s.open);
      el.classList.toggle("is-closed", !s.open);
    });
    var day = shopNow().day;
    $$(".hours tr").forEach(function (tr) {
      tr.classList.toggle("is-today", tr.getAttribute("data-days").split(",").indexOf(String(day)) > -1);
    });
  }
  renderStatus();
  setInterval(renderStatus, 60000);

  /* ---------- Заявка с подставленной категорией ---------- */
  var form = $("#request"), topic = $("#topic"), comment = form.elements.comment;
  $$("[data-request]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var val = btn.getAttribute("data-request");
      for (var i = 0; i < topic.options.length; i++) {
        if (topic.options[i].text === val) { topic.selectedIndex = i; break; }
      }
      if (btn.hasAttribute("data-calc-request")) {
        comment.value = "Рассрочка: " + fmt(sumValue()) + " руб. на " + termValue() + " мес.";
      } else if (btn.hasAttribute("data-comment")) {
        comment.value = btn.getAttribute("data-comment");
      } else if (btn.closest(".product")) {
        comment.value = "Интересует: " + btn.closest(".product").querySelector("h4").textContent;
      }
      $("#contacts").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      setTimeout(function () { form.elements.name.focus({ preventScroll: true }); }, 500);
    });
  });

  /* ---------- Витрина: фильтр ---------- */
  $$(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      $$(".chip").forEach(function (c) { c.classList.toggle("is-active", c === chip); });
      $$(".product").forEach(function (p) { p.hidden = f !== "all" && p.getAttribute("data-kind") !== f; });
    });
  });

  /* ---------- Калькулятор рассрочки ---------- */
  var sumInput = $("#calc-sum"), range = $("#calc-range"), out = $("#calc-out");
  function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function sumValue() { return parseInt(sumInput.value.replace(/\D/g, ""), 10) || 0; }
  function termValue() { return +($("input[name='term']:checked") || { value: 12 }).value; }
  function calc() { out.textContent = fmt(sumValue() / termValue()) + " руб."; }
  sumInput.addEventListener("input", function () {
    var v = sumValue();
    sumInput.value = v ? fmt(v) : "";
    range.value = Math.min(Math.max(v, +range.min), +range.max);
    calc();
  });
  range.addEventListener("input", function () { sumInput.value = fmt(range.value); calc(); });
  $$("input[name='term']").forEach(function (r) { r.addEventListener("change", calc); });
  calc();

  /* ---------- Форма (демо, никуда не отправляется) ---------- */
  var err = $("#form-error"), done = $("#form-done");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.elements.name, phone = form.elements.phone, consent = form.elements.consent;
    var problems = [];
    name.classList.toggle("is-invalid", !name.value.trim());
    if (!name.value.trim()) problems.push("имя");
    var digits = phone.value.replace(/\D/g, "");
    var badPhone = digits.length < 10;
    phone.classList.toggle("is-invalid", badPhone);
    if (badPhone) problems.push("телефон");
    if (problems.length) { err.textContent = "Укажите " + problems.join(" и ") + "."; err.hidden = false; return; }
    if (!consent.checked) { err.textContent = "Нужно согласие на обработку данных."; err.hidden = false; return; }
    err.hidden = true;
    done.hidden = false;
  });

  /* ---------- Карта: грузим, когда блок близко ---------- */
  var map = $("#map");
  var loadMap = function () { if (!map.src) map.src = map.getAttribute("data-src"); };

  /* ---------- Появление при скролле ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });

    var mo = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { loadMap(); mo.disconnect(); }
    }, { rootMargin: "400px" });
    mo.observe(map);
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
    loadMap();
  }
})();
