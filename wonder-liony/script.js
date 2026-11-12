(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // меню
  var burger = document.querySelector('.burger'), nav = document.getElementById('nav');
  burger.addEventListener('click', function(){
    var o = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', o);
  });
  nav.addEventListener('click', function(e){
    if(e.target.tagName === 'A'){ nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
  });

  // лестница + глагол + лев
  var verb = document.getElementById('verb'), lion = document.getElementById('walker'),
      stairs = document.getElementById('stairs'), btns = stairs.querySelectorAll('.stair');
  var current = 1, timer = null;

  function placeLion(i, hop){
    var b = btns[i], box = stairs.getBoundingClientRect(), r = b.getBoundingClientRect();
    var w = lion.offsetWidth;
    var x = r.left - box.left + r.width/2 - w/2;
    var y = -(box.bottom - r.top) + 6;
    lion.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    if(hop && !reduce){ lion.classList.remove('hop'); void lion.offsetWidth; lion.classList.add('hop'); }
  }
  function setStep(i, hop){
    current = i;
    btns.forEach(function(b, k){ b.setAttribute('aria-selected', k === i); });
    lion.dataset.stage = i;
    var w = btns[i].dataset.verb;
    if(verb.textContent !== w){
      if(reduce){ verb.textContent = w; }
      else{
        verb.classList.remove('swap'); void verb.offsetWidth; verb.classList.add('swap');
        setTimeout(function(){ verb.textContent = w; }, 260);
      }
    }
    placeLion(i, hop);
  }
  function auto(){
    clearInterval(timer);
    if(reduce) return;
    timer = setInterval(function(){ setStep((current + 1) % 3, true); }, 3200);
  }
  btns.forEach(function(b, k){
    b.addEventListener('click', function(){ setStep(k, true); auto(); });
  });
  window.addEventListener('resize', function(){ placeLion(current, false); });
  // ждём шрифты и анимацию появления
  setTimeout(function(){ placeLion(current, false); }, 50);
  (document.fonts && document.fonts.ready || Promise.resolve()).then(function(){ placeLion(current, false); });
  setTimeout(auto, 1600);

  // подбор ступени по возрасту
  var age = document.getElementById('age'), out = document.getElementById('ageOut'),
      hint = document.getElementById('ageHint'), steps = document.querySelectorAll('.step'),
      formAge = document.getElementById('formAge');
  var names = ['0 ступень "I can sing"', 'I ступень "I can speak"', 'II ступень "I can read"'];
  function years(n){ var m = n % 10, h = n % 100; if(m === 1 && h !== 11) return n + ' год'; if(m >= 2 && m <= 4 && (h < 12 || h > 14)) return n + ' года'; return n + ' лет'; }
  function onAge(){
    var n = +age.value, s = n <= 5 ? 0 : n <= 8 ? 1 : 2;
    out.textContent = years(n);
    hint.textContent = 'Подходит ' + names[s] + '. На пробном занятии педагог подтвердит уровень.';
    steps.forEach(function(el){ el.classList.toggle('is-on', +el.dataset.step === s); });
    if(formAge) formAge.selectedIndex = n - 3;
  }
  age.addEventListener('input', onAge); onAge();

  // появление при прокрутке + счётчики
  function count(el){
    var to = +el.dataset.to, dec = +(el.dataset.dec || 0), t0 = null, dur = 1400;
    if(reduce){ el.textContent = to.toFixed(dec); return; }
    function f(t){ if(!t0) t0 = t; var p = Math.min((t - t0)/dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (to*e).toFixed(dec); if(p < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  var targets = document.querySelectorAll('.reveal, .stage, .report');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        e.target.classList.add('on');
        e.target.querySelectorAll('.count').forEach(count);
        io.unobserve(e.target);
      });
    }, {threshold:.18, rootMargin:'0px 0px -40px 0px'});
    targets.forEach(function(t){ io.observe(t); });
  } else {
    targets.forEach(function(t){ t.classList.add('on'); t.querySelectorAll('.count').forEach(count); });
  }

  // демо-форма
  var form = document.getElementById('trial'), ok = document.getElementById('formOk');
  form.addEventListener('submit', function(e){ e.preventDefault(); ok.hidden = false; });
})();
