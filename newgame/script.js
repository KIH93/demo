(function () {
  "use strict";

  // Мобильное меню
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");
  function closeNav() {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
  }
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") closeNav();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  // Появление блоков при прокрутке
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }

  // Бриф: собираем текст и подставляем в ссылки мессенджеров. Никуда не отправляется.
  var form = document.getElementById("brief");
  var out = document.getElementById("brief-msg");
  var tg = document.getElementById("b-tg");
  var wa = document.getElementById("b-wa");

  function timeLabel(v) {
    return v.split(" (")[0].toLowerCase();
  }

  function update() {
    var zone = form.querySelector("input[name=zone]:checked").value;
    var day = form.elements.day.value.toLowerCase();
    var time = timeLabel(form.elements.time.value);
    var guests = form.elements.guests.value;
    var text = "Здравствуйте! Хочу забронировать: зона " + zone + ", " + day + ", " + time + ", гостей: " + guests + ".";
    out.textContent = text;
    var q = encodeURIComponent(text);
    tg.href = "https://t.me/newgamevidnoepc?text=" + q;
    wa.href = "https://wa.me/79005553336?text=" + q;
  }

  form.addEventListener("change", update);
  update();
})();
