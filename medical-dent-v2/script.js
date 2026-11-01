(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* первый экран по очереди */
  $$('[data-h]').forEach(el => el.style.setProperty('--i', el.dataset.h));
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add('is-ready'), 60));

  /* шапка и липкая кнопка */
  const top = $('#top');
  const sticky = $('#sticky');
  const book = $('#zapis');
  const onScroll = () => {
    const y = window.scrollY;
    top.classList.toggle('is-stuck', y > 8);
    const bookTop = book.getBoundingClientRect().top;
    sticky.classList.toggle('show', y > 520 && bookTop > window.innerHeight * .6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* слово в заголовке меняется по кругу */
  const rot = $('#rot');
  const WORDS = ['всей семьи', 'мамы', 'папы', 'ребёнка', 'бабушки', 'дедушки'];
  if (rot && !reduce) {
    let w = 0;
    setInterval(() => {
      if (document.hidden) return;
      rot.classList.add('out');
      setTimeout(() => {
        w = (w + 1) % WORDS.length;
        rot.textContent = WORDS[w];
        rot.classList.remove('out');
      }, 380);
    }, 2600);
  }

  /* лента направлений: копия карточек для бесшовной прокрутки */
  const track = $('.ribbon__track');
  if (track && !reduce) {
    [...track.children].forEach(c => {
      const k = c.cloneNode(true);
      k.setAttribute('aria-hidden', 'true');
      k.tabIndex = -1;
      track.appendChild(k);
    });
  }

  /* счётчики */
  const countUp = el => {
    const end = parseFloat(el.dataset.count);
    const dec = +(el.dataset.dec || 0);
    const fmt = v => v.toFixed(dec).replace('.', ',');
    if (reduce) { el.textContent = fmt(end); return; }
    const t0 = performance.now();
    const dur = 1400;
    const frame = now => {
      const k = Math.min(1, (now - t0) / dur);
      el.textContent = fmt(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  /* появление при прокрутке */
  const groups = new Map();
  $$('.reveal').forEach(el => {
    const p = el.parentElement;
    const n = groups.get(p) || 0;
    el.style.setProperty('--d', n);
    groups.set(p, n + 1);
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(el => io.observe(el));

    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        countUp(e.target);
        cio.unobserve(e.target);
      });
    }, { threshold: .6 });
    $$('[data-count]').forEach(el => cio.observe(el));

    const steps = $('#steps');
    const sio = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { steps.classList.add('is-on'); sio.disconnect(); }
    }, { threshold: .4 });
    sio.observe(steps);
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }

  /* вкладки прайса */
  const tabs = $$('.tabs [role="tab"]');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
    $$('[data-panel]').forEach(p => {
      const on = p.dataset.panel === tab.dataset.tab;
      p.hidden = !on;
      if (on) $$('li', p).forEach((li, i) => li.style.setProperty('--n', i));
    });
  }));

  /* рассрочка (пример) */
  const months = $('#months');
  const perMonth = $('#perMonth');
  const calc = () => {
    perMonth.textContent = Math.ceil(35000 / +months.value).toLocaleString('ru-RU');
  };
  months.addEventListener('change', calc);
  calc();

  /* сертификат */
  const giftSum = $('#giftSum');
  $$('.gift__opts button').forEach(b => b.addEventListener('click', () => {
    $$('.gift__opts button').forEach(x => x.classList.toggle('on', x === b));
    giftSum.textContent = (+b.dataset.sum).toLocaleString('ru-RU');
    giftSum.classList.remove('bump');
    void giftSum.offsetWidth;
    giftSum.classList.add('bump');
  }));

  /* услуга из карточки попадает в форму */
  const service = $('#service');
  $$('[data-service]').forEach(a => a.addEventListener('click', () => {
    const v = a.dataset.service;
    const opt = [...service.options].find(o => o.text === v);
    if (opt) service.value = opt.text;
  }));

  /* форма: на демо без отправки */
  const form = $('#form');
  const msg = $('#formMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.elements.name;
    const phone = form.elements.phone;
    const agree = form.elements.agree;
    const digits = phone.value.replace(/\D/g, '');
    name.classList.toggle('is-bad', !name.value.trim());
    phone.classList.toggle('is-bad', digits.length < 10);
    if (!name.value.trim() || digits.length < 10 || !agree.checked) {
      msg.className = 'form__msg err';
      msg.textContent = !agree.checked && name.value.trim() && digits.length >= 10
        ? 'Отметьте согласие на обработку данных.'
        : 'Проверьте имя и телефон.';
      return;
    }
    msg.className = 'form__msg ok';
    msg.textContent = 'Спасибо! Это демо, заявка никуда не отправлена. На рабочем сайте она придёт администратору в WhatsApp или на почту.';
    form.reset();
  });
})();
