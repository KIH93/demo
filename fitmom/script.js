(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* шапка */
  var head = document.querySelector('.head');
  var dock = document.querySelector('.dock');
  function onScroll(){
    var y = window.scrollY;
    head.classList.toggle('is-scrolled', y > 10);
    dock.classList.toggle('is-shown', y > 520);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* счётчики */
  function fmt(n, dec){
    return dec ? n.toFixed(dec).replace('.', ',') : Math.round(n).toLocaleString('ru-RU').replace(/ /g,' ');
  }
  function count(el){
    var to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    if (reduce || to === 0) { el.textContent = fmt(to, dec); return; }
    var t0 = null, dur = 1400;
    function step(t){
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e, dec);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = fmt(0, dec);
    requestAnimationFrame(step);
  }

  /* появление при прокрутке */
  var targets = document.querySelectorAll('.reveal, [data-count], .steps__list');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el.dataset.count !== undefined) count(el);
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, {threshold:.15, rootMargin:'0px 0px -40px 0px'});
    targets.forEach(function(el){ io.observe(el); });
  } else {
    targets.forEach(function(el){ el.classList.add('is-in'); });
  }

  /* цели */
  var goals = {
    slim:{n:'01', p:.85, t:'Похудеть и почувствовать лёгкость', d:'Сочетание силовых и кардио: мышцы работают, пульс растёт, а тренер следит, чтобы нагрузка была по силам. Начните с двух-трёх занятий в неделю.', c:['Силовые тренировки','Зумба и танцы','Джампинг','Hot Iron','Бодифлекс']},
    back:{n:'02', p:.65, t:'Спина без зажимов и ровная осанка', d:'Пилатес укрепляет глубокие мышцы корпуса, а МФР снимает напряжение. Особенно полезно после родов и для тех, кто много сидит.', c:['Пилатес на реформере','Базовый пилатес','МФР','TRX']},
    flex:{n:'03', p:.5, t:'Гибкость и лёгкость в теле', d:'Мягкая растяжка без рывков и боли. Тело становится подвижнее, уходит скованность, а после занятия приятно расслабленно.', c:['Стретчинг','МФР','Пилатес на реформере','Базовый пилатес']},
    tone:{n:'04', p:.75, t:'Сильные мышцы и подтянутый силуэт', d:'Работа с весом и петлями TRX под контролем тренера. Программа под вашу цель: тонус, рельеф или набор мышечной массы.', c:['Силовые тренировки','TRX','Hot Iron','Пилатес на реформере']}
  };
  var ring = document.getElementById('goal-ring');
  var body = document.querySelector('.goals__body');
  var chips = document.getElementById('goal-chips');
  var tabs = document.querySelectorAll('.goal-tab');
  var dirGrid = document.querySelector('.dirs__grid');
  var dirs = document.querySelectorAll('.dir');

  function setGoal(key, first){
    var g = goals[key];
    document.getElementById('goal-num').textContent = g.n;
    document.getElementById('goal-title').textContent = g.t;
    document.getElementById('goal-text').textContent = g.d;
    chips.innerHTML = g.c.map(function(c,i){ return '<li style="--i:'+i+'">'+c+'</li>'; }).join('');
    ring.style.strokeDashoffset = 314 * (1 - g.p);
    if (!first) { body.classList.remove('swap'); void body.offsetWidth; body.classList.add('swap'); }
    dirs.forEach(function(d){ d.classList.toggle('is-match', !first && d.dataset.tags.split(' ').indexOf(key) > -1); });
    dirGrid.classList.toggle('is-filtered', !first);
  }
  tabs.forEach(function(t){
    t.addEventListener('click', function(){
      tabs.forEach(function(x){ x.classList.remove('is-active'); x.setAttribute('aria-selected','false'); });
      t.classList.add('is-active'); t.setAttribute('aria-selected','true');
      setGoal(t.dataset.goal);
    });
  });
  setGoal('slim', true);

  /* фильтр расписания */
  var fchips = document.querySelectorAll('.sched__filter .chip');
  var cls = document.querySelectorAll('.cls[data-k]');
  fchips.forEach(function(c){
    c.addEventListener('click', function(){
      fchips.forEach(function(x){ x.classList.remove('is-on'); });
      c.classList.add('is-on');
      var f = c.dataset.f;
      cls.forEach(function(el){ el.classList.toggle('is-dim', f !== 'all' && el.dataset.k !== f); });
    });
  });
})();
