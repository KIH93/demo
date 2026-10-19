/*
 * Контакты клиники в одном месте. Поменять здесь - обновится по всему сайту.
 *
 * Запасные номера из справочников (на демо не используются):
 *   +7 (843) 237-77-32
 *   +7 (843) 212-11-02 - единый номер сети
 */
var config = {
  phone: "+7 (843) 254-48-10",
  phoneHref: "tel:+78432548410",
  telegram: "https://t.me/+79047603949",
  whatsapp: "https://wa.me/79047603949", // заглушка, уточнить у клиники
  max: "#", // TODO: подставить ссылку на MAX
  gis: "https://2gis.ru/kazan/firm/2956015537175747"
};

(function () {
  document.documentElement.classList.remove("no-js");

  var links = {
    tel: config.phoneHref,
    tg: config.telegram,
    wa: config.whatsapp,
    max: config.max,
    gis: config.gis
  };

  document.querySelectorAll("[data-link]").forEach(function (el) {
    var href = links[el.getAttribute("data-link")];
    if (href) el.setAttribute("href", href);
  });
  document.querySelectorAll("[data-phone]").forEach(function (el) {
    el.textContent = config.phone;
  });

  // MAX пока без ссылки: не прыгаем наверх страницы
  document.querySelectorAll('[data-link="max"]').forEach(function (el) {
    el.addEventListener("click", function (e) {
      if (el.getAttribute("href") === "#") {
        e.preventDefault();
        el.setAttribute("title", "Ссылка на MAX появится позже");
      }
    });
  });

  // Мобильное меню
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("mobile-nav");
  if (burger && menu) {
    var setOpen = function (open) {
      menu.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    };
    burger.addEventListener("click", function () {
      setOpen(!menu.classList.contains("open"));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // Плавное появление блоков
  var items = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
