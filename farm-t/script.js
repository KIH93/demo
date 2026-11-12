(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* header shadow */
  var header = $(".header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* крупный шрифт */
  var eye = $("#eyeToggle");
  function setBig(on) {
    root.classList.toggle("big", on);
    eye.setAttribute("aria-pressed", on ? "true" : "false");
    try { localStorage.setItem("farmt-big", on ? "1" : "0"); } catch (e) {}
  }
  try { if (localStorage.getItem("farmt-big") === "1") setBig(true); } catch (e) {}
  eye.addEventListener("click", function () { setBig(!root.classList.contains("big")); });

  /* счётчики */
  function countUp(el) {
    var to = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    var fmt = function (v) { return dec ? v.toFixed(dec).replace(".", ",") : String(Math.round(v)); };
    if (reduce) { el.textContent = fmt(to); return; }
    var dur = 1300, t0 = null;
    el.textContent = fmt(0);
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  $$(".grid-hero [data-count]").forEach(function (el, i) {
    setTimeout(function () { countUp(el); }, reduce ? 0 : 350 + i * 90);
  });

  /* появление при прокрутке */
  var steps = $("#stepsList");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });

    var so = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { steps.style.setProperty("--p", "1"); so.disconnect(); }
    }, { threshold: 0.4 });
    so.observe(steps);
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
    steps.style.setProperty("--p", "1");
  }

  /* вкладки услуг */
  var tabs = $$('[role="tab"]');
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute("aria-controls"));
      p.hidden = !on;
      p.classList.remove("is-in");
      if (on) { void p.offsetWidth; p.classList.add("is-in"); }
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(t); });
    t.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") n = tabs[0];
      if (e.key === "End") n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  /* поиск по ценам */
  var search = $("#priceSearch");
  var rows = $$("#priceRows tr");
  rows.forEach(function (r) { r.cells[0].setAttribute("data-t", r.cells[0].textContent); });
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  search.addEventListener("input", function () {
    var q = search.value.trim().toLowerCase();
    var shown = 0;
    rows.forEach(function (r) {
      var txt = r.cells[0].getAttribute("data-t");
      var hit = !q || txt.toLowerCase().indexOf(q) !== -1;
      r.hidden = !hit;
      if (hit) shown++;
      r.cells[0].innerHTML = "";
      if (q && hit) {
        var parts = txt.split(new RegExp("(" + esc(q) + ")", "i"));
        parts.forEach(function (part, idx) {
          if (idx % 2) { var m = document.createElement("mark"); m.textContent = part; r.cells[0].appendChild(m); }
          else r.cells[0].appendChild(document.createTextNode(part));
        });
      } else {
        r.cells[0].textContent = txt;
      }
    });
    $("#priceEmpty").hidden = shown > 0;
  });

  /* отзывы */
  var revs = $("#revs");
  function revStep(dir) {
    var card = $(".rev", revs);
    var w = card ? card.getBoundingClientRect().width + 14 : 300;
    revs.scrollBy({ left: dir * w, behavior: reduce ? "auto" : "smooth" });
  }
  $("#revPrev").addEventListener("click", function () { revStep(-1); });
  $("#revNext").addEventListener("click", function () { revStep(1); });

  /* липкая кнопка */
  var sticky = $("#stickyBook");
  var hero = $(".grid-hero");
  var contacts = $("#contacts");
  function stickyCheck() {
    var past = hero.getBoundingClientRect().bottom < 0;
    var c = contacts.getBoundingClientRect();
    var atContacts = c.top < window.innerHeight * 0.6 && c.bottom > 0;
    sticky.classList.toggle("is-on", past && !atContacts);
  }
  window.addEventListener("scroll", stickyCheck, { passive: true });
  stickyCheck();

  /* онлайн-запись */
  var dlg = $("#bookDialog");
  var form = $("#bookForm");
  var svc = $("#bkService");
  var daysBox = $("#bkDays");
  var slotsBox = $("#bkSlots");
  var err = $("#bkErr");
  var picked = { day: null, time: null };
  var wd = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  var mon = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

  function pickBtn(box, btn) {
    $$("button", box).forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
  }
  function buildSlots(date) {
    slotsBox.innerHTML = "";
    picked.time = null;
    var end = date.getDay() === 6 ? 14 : 19;
    var seed = date.getDate() * 7 + date.getMonth();
    for (var h = 8; h < end; h++) {
      for (var m = 0; m < 60; m += 30) {
        var t = h + ":" + (m ? "30" : "00");
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = t;
        b.setAttribute("aria-pressed", "false");
        if ((h * 3 + m + seed) % 5 === 0) { b.disabled = true; b.setAttribute("aria-label", t + ", занято"); }
        b.addEventListener("click", (function (bb, tt) { return function () { picked.time = tt; pickBtn(slotsBox, bb); }; })(b, t));
        slotsBox.appendChild(b);
      }
    }
  }
  function buildDays() {
    daysBox.innerHTML = "";
    var d = new Date();
    var added = 0, first = null;
    for (var i = 0; added < 8 && i < 14; i++) {
      var day = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      if (day.getDay() === 0) continue;
      var b = document.createElement("button");
      b.type = "button";
      b.innerHTML = "<b>" + day.getDate() + " " + mon[day.getMonth()] + "</b><small>" + (i === 0 ? "сегодня" : i === 1 ? "завтра" : wd[day.getDay()]) + "</small>";
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", (function (bb, dd) { return function () { picked.day = dd; pickBtn(daysBox, bb); buildSlots(dd); }; })(b, day));
      daysBox.appendChild(b);
      if (!first) first = { b: b, d: day };
      added++;
    }
    picked.day = first.d; pickBtn(daysBox, first.b); buildSlots(first.d);
  }

  function openBook(service) {
    $("#bookBody").hidden = false;
    $("#bookDone").hidden = true;
    err.hidden = true;
    if (service) {
      var opt = $$("option", svc).filter(function (o) { return o.textContent === service; })[0];
      if (!opt) { opt = document.createElement("option"); opt.textContent = service; svc.appendChild(opt); }
      svc.value = opt.textContent;
    }
    buildDays();
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }
  function closeBook() { if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); }

  $$(".js-book").forEach(function (b) {
    b.addEventListener("click", function () { openBook(b.getAttribute("data-service")); });
  });
  $("#bookClose").addEventListener("click", closeBook);
  $("#bookOk").addEventListener("click", closeBook);
  dlg.addEventListener("click", function (e) { if (e.target === dlg) closeBook(); });

  /* маска телефона */
  var phone = $("#bkPhone");
  phone.addEventListener("input", function () {
    var d = phone.value.replace(/\D/g, "");
    if (d[0] === "8") d = "7" + d.slice(1);
    if (d && d[0] !== "7") d = "7" + d;
    d = d.slice(0, 11);
    var r = "";
    if (d.length) r = "+7";
    if (d.length > 1) r += " (" + d.slice(1, 4);
    if (d.length >= 4) r += ")";
    if (d.length > 4) r += " " + d.slice(4, 7);
    if (d.length > 7) r += "-" + d.slice(7, 9);
    if (d.length > 9) r += "-" + d.slice(9, 11);
    phone.value = r;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("#bkName").value.trim();
    var digits = phone.value.replace(/\D/g, "");
    var msg = "";
    if (!picked.time) msg = "Выберите время приёма.";
    else if (name.length < 2) msg = "Укажите имя.";
    else if (digits.length !== 11) msg = "Укажите телефон полностью.";
    if (msg) { err.textContent = msg; err.hidden = false; return; }
    err.hidden = true;
    var d = picked.day;
    $("#bkSummary").textContent = name + ", вы выбрали: " + svc.value + ", " + d.getDate() + " " + mon[d.getMonth()] + " в " + picked.time + ".";
    $("#bookBody").hidden = true;
    $("#bookDone").hidden = false;
    form.reset();
  });
})();
