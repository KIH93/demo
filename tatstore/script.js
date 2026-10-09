// Липкая кнопка "Позвонить" прячется, пока на экране виден блок связи
(function () {
  var sticky = document.getElementById('sticky-call');
  if (!sticky || !('IntersectionObserver' in window)) return;

  var blocks = document.querySelectorAll('.contact');
  var visible = new Set();

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) visible.add(e.target);
      else visible.delete(e.target);
    });
    sticky.classList.toggle('is-hidden', visible.size > 0);
  }, { threshold: 0.2 });

  blocks.forEach(function (b) { io.observe(b); });
})();
