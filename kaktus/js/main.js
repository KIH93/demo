(function () {
  var data = window.SITE_DATA || {};

  // Блоки связи из одного шаблона, чтобы кнопки везде были одинаковыми
  var tpl = document.getElementById("tpl-contact");
  document.querySelectorAll("[data-contact]").forEach(function (el) {
    el.appendChild(tpl.content.cloneNode(true));
  });

  // Режим работы
  document.querySelectorAll("[data-hours]").forEach(function (el) {
    if (data.hours) el.textContent = data.hours;
  });

  // Услуги: аккордеон на <details>
  var box = document.querySelector("[data-services]");
  (data.services || []).forEach(function (s, i) {
    var d = document.createElement("details");
    d.className = "acc__item";
    if (i === 0) d.open = true;

    var sum = document.createElement("summary");
    sum.innerHTML = '<span class="acc__title"></span><span class="acc__plus" aria-hidden="true"></span>';
    sum.querySelector(".acc__title").textContent = s.title;
    d.appendChild(sum);

    var body = document.createElement("div");
    body.className = "acc__body";
    var p = document.createElement("p");
    p.textContent = s.text;
    body.appendChild(p);

    var ul = document.createElement("ul");
    ul.className = "price";
    s.items.forEach(function (it) {
      var li = document.createElement("li");
      var n = document.createElement("span");
      var v = document.createElement("b");
      n.textContent = it.name;
      v.textContent = it.price;
      if (it.price === "уточняется") v.className = "is-tbd";
      li.appendChild(n);
      li.appendChild(v);
      ul.appendChild(li);
    });
    body.appendChild(ul);
    d.appendChild(body);
    box.appendChild(d);
  });

  // Плавное появление блоков при прокрутке
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".sec .wrap").forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }
})();
