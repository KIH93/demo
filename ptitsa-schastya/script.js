(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* шапка и липкая кнопка */
  const top = document.querySelector('.top');
  const sticky = document.querySelector('.sticky');
  const hero = document.querySelector('.page');
  const signup = document.getElementById('signup');
  let signupVisible = false;
  const onScroll = () => {
    const y = window.scrollY;
    top.classList.toggle('is-scrolled', y > 10);
    sticky.classList.toggle('is-shown', y > hero.offsetHeight * 0.6 && !signupVisible);
  };
  new IntersectionObserver(([e]) => { signupVisible = e.isIntersecting; onScroll(); }, { threshold: 0.15 }).observe(signup);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* появление блоков */
  const reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
        el.style.transitionDelay = Math.min(sibs.indexOf(el), 5) * 90 + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* линия маршрута */
  const route = document.querySelector('.route');
  new IntersectionObserver(([e], o) => {
    if (e.isIntersecting) { route.classList.add('is-drawn'); o.disconnect(); }
  }, { threshold: 0.3 }).observe(route);

  /* счётчики */
  const counters = document.querySelectorAll('[data-count]');
  const runCount = el => {
    const to = +el.dataset.count;
    if (reduce || to === 0) { el.textContent = to; return; }
    const dur = 1300, t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.6 });
  counters.forEach(c => cio.observe(c));

  /* полёт бумажной птицы по пунктиру */
  const path = document.getElementById('flightPath');
  const flight = document.querySelector('.flight');
  const flyer = document.querySelector('.flyer');
  if (!reduce && path && flyer) {
    const len = path.getTotalLength();
    const svg = path.ownerSVGElement;
    const DUR = 7000, PAUSE = 3500;
    let start = null, visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
    const frame = t => {
      if (start === null) start = t + 2200; // ждём, пока допишется заголовок
      const el = t - start;
      if (el < 0 || !visible) { requestAnimationFrame(frame); return; }
      const cycle = el % (DUR + PAUSE);
      if (cycle > DUR) { flyer.style.opacity = 0; requestAnimationFrame(frame); return; }
      flight.classList.add('is-on');
      const p = cycle / DUR;
      const e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const a = path.getPointAtLength(e * len);
      const b = path.getPointAtLength(Math.min(e * len + 4, len));
      const m = svg.getScreenCTM();
      const box = hero.getBoundingClientRect();
      const toPx = pt => ({ x: m.a * pt.x + m.e - box.left, y: m.d * pt.y + m.f - box.top });
      const pa = toPx(a), pb = toPx(b);
      const ang = Math.atan2(pb.y - pa.y, pb.x - pa.x) * 180 / Math.PI;
      flyer.style.opacity = p < .04 ? p / .04 : p > .96 ? (1 - p) / .04 : 1;
      flyer.style.transform = `translate(${pa.x - 29}px, ${pa.y - 22}px) rotate(${ang}deg)`;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  } else if (flight) {
    flight.classList.add('is-on');
  }

  /* копирование промокода */
  document.querySelectorAll('[data-copy]').forEach(btn => {
    const label = btn.querySelector('.code__label');
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(btn.dataset.copy); } catch (_) {}
      btn.classList.add('is-copied');
      label.textContent = 'скопировано';
      setTimeout(() => { btn.classList.remove('is-copied'); label.textContent = 'скопировать'; }, 2000);
    });
  });

  /* фильтр расписания */
  const week = document.querySelector('.week');
  document.querySelectorAll('.chip').forEach(chip => {
    chip.setAttribute('aria-pressed', chip.classList.contains('is-on'));
    chip.addEventListener('click', () => {
      const f = chip.dataset.f;
      document.querySelectorAll('.chip').forEach(c => {
        c.classList.toggle('is-on', c === chip);
        c.setAttribute('aria-pressed', c === chip);
      });
      week.classList.toggle('is-filtered', f !== 'all');
      week.querySelectorAll('.slot').forEach(s => s.classList.toggle('is-match', s.dataset.k === f));
    });
  });

  /* таймер акции */
  const cd = document.querySelector('.ticket__cd');
  if (cd) {
    const end = new Date(cd.dataset.deadline).getTime();
    const word = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };
    const tick = () => {
      let s = Math.max(0, Math.floor((end - Date.now()) / 1000));
      if (!s) { cd.textContent = 'Акция завершена, следите за новыми в канале центра.'; return; }
      const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
      cd.innerHTML = `<span><b>${d}</b>${word(d, 'день', 'дня', 'дней')}</span><span><b>${h}</b>${word(h, 'час', 'часа', 'часов')}</span><span><b>${m}</b>мин</span>`;
      setTimeout(tick, 30000);
    };
    tick();
  }

  /* форма (демо) */
  const form = document.getElementById('form');
  const ok = form.querySelector('.form__ok');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.elements.name, phone = form.elements.phone;
    const digits = phone.value.replace(/\D/g, '');
    name.classList.toggle('is-bad', !name.value.trim());
    phone.classList.toggle('is-bad', digits.length < 10);
    if (!name.value.trim() || digits.length < 10) {
      ok.style.color = 'var(--coral)';
      ok.textContent = 'Заполните имя и телефон, пожалуйста.';
      return;
    }
    ok.style.color = '';
    ok.textContent = `Спасибо, ${name.value.trim()}! Это демо, заявка не отправлена. На рабочем сайте администратор перезвонит вам.`;
    form.reset();
  });
})();
