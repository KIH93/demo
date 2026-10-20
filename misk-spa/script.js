(function () {
  // WhatsApp: предзаполненный текст
  var waText = encodeURIComponent("Здравствуйте! Пишу с сайта, хочу записаться.");
  document.querySelectorAll(".js-wa").forEach(function (a) {
    a.href = "https://wa.me/79600760145?text=" + waText;
  });

  // Мобильное меню
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");
  function closeNav() {
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
  }
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });

  // Появление секций
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Форма-бриф: в демо никуда не отправляется
  var form = document.getElementById("brief");
  var msg = form.querySelector(".brief__msg");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    ["name", "phone"].forEach(function (n) {
      var f = form.elements[n];
      var bad = !f.value.trim();
      f.classList.toggle("invalid", bad);
      f.setAttribute("aria-invalid", String(bad));
      if (bad && ok) { f.focus(); ok = false; }
    });
    if (!ok) return;
    msg.hidden = false;
    form.reset();
  });
})();
