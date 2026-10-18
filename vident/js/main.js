(function () {
  var C = window.CONTACTS || {};
  var G = window.GIS || {};
  var root = document.documentElement;

  // Мессенджеры: реальная ссылка только если в config нет TODO
  document.querySelectorAll("[data-msg]").forEach(function (a) {
    var url = C[a.getAttribute("data-msg")];
    if (url && url.indexOf("TODO") === -1) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
    }
  });

  // Бейдж 2ГИС показываем только при заполненных данных
  var badge = document.getElementById("gis-badge");
  if (badge && G.rating && G.reviews) {
    badge.textContent = "Рейтинг в 2ГИС: " + G.rating + " из 5, " + G.reviews + " отзывов";
    if (G.url) badge.href = G.url;
    badge.hidden = false;
  }

  // "Позвонить": на телефоне звонок, на десктопе показываем номера
  var desktop = window.matchMedia("(hover: hover) and (pointer: fine)");
  function fmt(p) {
    var d = p.replace(/\D/g, "").slice(1);
    return "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6, 8) + "-" + d.slice(8);
  }
  function closePops() {
    document.querySelectorAll(".call-pop").forEach(function (p) { p.remove(); });
    document.querySelectorAll(".js-call[aria-expanded]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
  }
  document.querySelectorAll(".js-call").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (!desktop.matches || btn.closest(".sticky-bar")) return;
      e.preventDefault();
      var wrap = btn.parentElement;
      var open = wrap.querySelector(".call-pop");
      closePops();
      if (open) return;
      var pop = document.createElement("div");
      pop.className = "call-pop";
      [C.phone, C.phone2].filter(Boolean).forEach(function (p) {
        var a = document.createElement("a");
        a.href = "tel:" + p;
        a.textContent = fmt(p);
        pop.appendChild(a);
      });
      var t = document.createElement("span");
      t.textContent = "Ежедневно с 9:00 до 21:00";
      pop.appendChild(t);
      wrap.appendChild(pop);
      btn.setAttribute("aria-expanded", "true");
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".call-wrap")) closePops();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePops();
  });

  // Версия для слабовидящих
  var toggle = document.querySelector(".a11y-toggle");
  function setA11y(on) {
    root.classList.toggle("a11y", on);
    toggle.setAttribute("aria-pressed", on ? "true" : "false");
    try { localStorage.setItem("vident-a11y", on ? "1" : "0"); } catch (e) {}
  }
  try { if (localStorage.getItem("vident-a11y") === "1") setA11y(true); } catch (e) {}
  toggle.addEventListener("click", function () { setA11y(!root.classList.contains("a11y")); });

  // Появление при скролле
  var items = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    root.classList.add("js-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }
})();
