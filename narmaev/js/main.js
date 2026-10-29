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

  var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // счётчики в цифрах
  var counters = document.querySelectorAll("[data-count]");
  function run(el) {
    var to = +el.getAttribute("data-count"), t0 = null;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1400, 1), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString("ru-RU");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (!calm && "IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { el.textContent = "0"; co.observe(el); });
  }

  // свечение карточек услуг за курсором
  document.querySelectorAll(".svc").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // лёгкий параллакс иллюстрации на первом экране
  var art = document.querySelector(".hero__art svg");
  if (art && !calm && matchMedia("(pointer: fine)").matches) {
    document.querySelector(".hero").addEventListener("pointermove", function (e) {
      var x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      art.style.transform = "translate(" + x * -14 + "px," + y * -14 + "px) rotate(" + x * 1.5 + "deg)";
    });
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
