// Прогрессив Стом, демо
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // шапка и меню
  const top = $('#top'), nav = $('#nav'), burger = $('#burger');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('a', nav).forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  // плавающая кнопка записи и тень шапки
  const hero = $('.hero'), floatCta = $('#floatCta'), form = $('#zapis');
  let formVisible = false;
  new IntersectionObserver(([e]) => { formVisible = e.isIntersecting; onScroll(); }).observe(form);
  function onScroll() {
    const y = scrollY;
    top.classList.toggle('is-stuck', y > 10);
    floatCta.classList.toggle('is-on', y > hero.offsetHeight * .7 && !formVisible);
    updatePath();
  }

  // путь лечения: линия заполняется при прокрутке
  const steps = $('#steps'), stepEls = $$('.step', steps), meter = $('#pathMeter');
  function updatePath() {
    const r = steps.getBoundingClientRect();
    const mid = innerHeight * .55;
    const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
    steps.style.setProperty('--fill', p.toFixed(3));
    let cur = 0;
    stepEls.forEach((s, i) => {
      const on = s.getBoundingClientRect().top < mid;
      s.classList.toggle('is-on', on);
      if (on) cur = i;
    });
    if (meter) meter.textContent = String(cur + 1).padStart(2, '0');
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // появление блоков и счётчики
  const fmt = (v, dec) => dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toLocaleString('ru-RU');
  function count(el) {
    const end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0;
    if (reduce) { el.textContent = fmt(end, dec); return; }
    const t0 = performance.now(), dur = 1400;
    const tick = t => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(end * e, dec);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    $$('[data-count]', e.target).forEach(count);
    io.unobserve(e.target);
  }), { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    io.observe(el);
  });

  // лента отзывов: дублируем для бесшовной прокрутки
  const track = $('.marquee__track');
  if (track && !reduce) $$('li', track).forEach(li => {
    const c = li.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    track.appendChild(c);
  });

  // вкладки прайса
  const tabs = $$('[role="tab"]');
  function select(tab) {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const n = tabs[(i + d + tabs.length) % tabs.length];
      select(n); n.focus();
    });
  });

  // кнопки со своей услугой подставляют её в форму
  const service = $('#service');
  $$('[data-service]').forEach(a => a.addEventListener('click', () => { service.value = a.dataset.service; }));

  // форма: демо, ничего не отправляет
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    ['name', 'phone'].forEach(n => {
      const f = form.elements[n], bad = n === 'phone' ? f.value.replace(/\D/g, '').length < 10 : !f.value.trim();
      f.closest('.field').classList.toggle('is-bad', bad);
      if (bad) ok = false;
    });
    const agree = form.elements.agree;
    agree.closest('.check').classList.toggle('is-bad', !agree.checked);
    if (!agree.checked) ok = false;
    if (!ok) return;
    $('#formOk').hidden = false;
    form.reset();
  });
})();
