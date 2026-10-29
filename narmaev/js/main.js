// Демо-скрипты: меню, появление блоков, слайдер до/после, форма записи
(function () {
  var WA = "79503113434";

  var header = document.querySelector(".header");
  var burger = document.querySelector(".burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { header.classList.remove("is-open"); });
    });
  }

  var items = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }

  document.querySelectorAll(".compare").forEach(function (box) {
    var input = box.querySelector("input");
    var after = box.querySelector(".compare__after");
    var line = box.querySelector(".compare__line");
    var knob = box.querySelector(".compare__knob");
    function set(v) {
      after.style.clipPath = "inset(0 0 0 " + v + "%)";
      line.style.left = v + "%";
      knob.style.left = v + "%";
    }
    input.addEventListener("input", function () { set(input.value); });
    set(input.value);
  });

  document.querySelectorAll("form[data-book]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var text = "Здравствуйте! Хочу записаться на приём.\n" +
        "Имя: " + (d.get("name") || "") + "\n" +
        "Телефон: " + (d.get("phone") || "") + "\n" +
        "Услуга: " + (d.get("service") || "") + "\n" +
        "Удобное время: " + (d.get("time") || "");
      var ok = form.querySelector(".form__ok");
      if (ok) ok.classList.add("is-on");
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
  });
})();
