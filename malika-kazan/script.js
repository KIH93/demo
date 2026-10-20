(function () {
  // WhatsApp: предзаполненный текст (TODO: номер WhatsApp уточнить у клиента)
  var waText = encodeURIComponent("Здравствуйте! Пишу с сайта, хочу записаться.");
  document.querySelectorAll(".js-wa").forEach(function (a) {
    a.href = "https://wa.me/79173968598?text=" + waText;
  });

  // Плавающая кнопка "Позвонить": после первого экрана
  var fab = document.querySelector(".fab");
  var hero = document.querySelector(".hero");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      fab.classList.toggle("show", !en[0].isIntersecting);
    }, { threshold: 0.1 }).observe(hero);
  } else {
    fab.classList.add("show");
  }

  // Появление блоков
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
