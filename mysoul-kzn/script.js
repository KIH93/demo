(function () {
  // WhatsApp: предзаполненный текст
  var waText = encodeURIComponent("Здравствуйте! Пишу с сайта, хочу записаться.");
  document.querySelectorAll(".js-wa").forEach(function (a) {
    a.href = "https://wa.me/79600884949?text=" + waText;
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

  // Ссылки из карточек услуг раскрывают нужный раздел прайса
  document.querySelectorAll('a[href^="#price-"]').forEach(function (a) {
    a.addEventListener("click", function () {
      var d = document.querySelector(a.getAttribute("href"));
      if (d) d.open = true;
    });
  });

  // Плавающая панель связи: после первого экрана
  var bar = document.querySelector(".mbar");
  var hero = document.querySelector(".hero");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      bar.classList.toggle("show", !en[0].isIntersecting);
    }, { threshold: 0.15 }).observe(hero);
  } else {
    bar.classList.add("show");
  }

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
})();
