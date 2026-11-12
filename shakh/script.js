(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;

  // Удар по шарам
  const table = document.getElementById('table');
  const cue = document.getElementById('cue');
  const breakBalls = () => {
    if (reduce) return;
    table.classList.remove('break');
    void table.offsetWidth;
    table.classList.add('break');
  };
  breakBalls();
  cue.addEventListener('click', breakBalls);

  // Шапка и липкая кнопка
  const top = document.querySelector('.top');
  const sticky = document.querySelector('.sticky');
  const onScroll = () => {
    const y = scrollY;
    top.classList.toggle('is-solid', y > 40);
    sticky.classList.toggle('is-on', y > innerHeight * 0.7);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Филиал
  const maps = {
    t: 'Казань, Тэцевская улица, 4',
    s: 'Казань, улица Виктора Сажинова, 3'
  };
  const map = document.getElementById('map');
  const setBranch = (b, animate = true) => {
    if (body.dataset.branch === b) return;
    body.dataset.branch = b;
    document.querySelectorAll('[data-set-branch]').forEach(btn => {
      btn.setAttribute('aria-checked', String(btn.dataset.setBranch === b));
    });
    document.querySelectorAll(`[data-branch-panel="${b}"]`).forEach(p => {
      p.querySelectorAll('.reveal').forEach(r => r.classList.add('is-in'));
      if (animate && !reduce) {
        p.classList.remove('swap'); void p.offsetWidth; p.classList.add('swap');
      }
    });
    map.src = 'https://yandex.ru/map-widget/v1/?text=' + encodeURIComponent(maps[b]) + '&z=16';
    try { localStorage.setItem('shakh-branch', b); } catch (e) {}
  };
  document.querySelectorAll('[data-set-branch]').forEach(btn => {
    btn.addEventListener('click', () => setBranch(btn.dataset.setBranch));
  });
  try {
    const saved = localStorage.getItem('shakh-branch');
    if (saved === 's') setBranch('s', false);
  } catch (e) {}

  // Диалог записи
  const dlg = document.getElementById('book');
  document.querySelectorAll('[data-open-book]').forEach(b => b.addEventListener('click', () => {
    dlg.querySelectorAll('.book__opt').forEach(o => o.classList.toggle('is-cur', o.dataset.book === body.dataset.branch));
    if (dlg.showModal) dlg.showModal(); else location.hash = '#filialy';
  }));
  dlg.querySelector('[data-close-book]').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

  // Появление при прокрутке и счётчики
  const count = el => {
    const end = parseFloat(el.dataset.count);
    const dec = +(el.dataset.dec || 0);
    if (reduce) { el.textContent = end.toFixed(dec); return; }
    const t0 = performance.now(), dur = 1400;
    const step = t => {
      const k = Math.min(1, (t - t0) / dur);
      const v = end * (1 - Math.pow(1 - k, 3));
      el.textContent = v.toFixed(dec);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(i => i.classList.add('is-in'));
    document.querySelectorAll('[data-count]').forEach(count);
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      en.target.querySelectorAll('[data-count]').forEach(count);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  items.forEach(i => io.observe(i));
})();
