/* Линия ремонта, вариант 3 (Hallmark · Terrazzo). Слоты фото и форма без подключённого адреса. */
window.hallmarkSlots = (m) => { for (const [k, v] of Object.entries(m)) { const s = document.querySelector(`[data-slot="${k}"]`); if (!s) continue; const im = new Image(); im.src = typeof v === 'string' ? v : v.src; im.alt = (typeof v === 'object' && v.alt) || s.dataset.alt || ''; s.querySelectorAll(':scope > img').forEach((o) => o.remove()); s.prepend(im); } };
document.querySelectorAll('[data-slot] img').forEach((i) => { if (i.complete && !i.naturalWidth) i.remove(); else i.addEventListener('error', () => i.remove(), { once: true }); });

const phone = document.getElementById('phone');
phone.addEventListener('input', () => {
  let d = phone.value.replace(/\D/g, '');
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (d && !d.startsWith('7')) d = '7' + d;
  d = d.slice(0, 11);
  let o = d ? '+7' : '';
  if (d.length > 1) o += ' (' + d.slice(1, 4);
  if (d.length >= 4) o += ') ' + d.slice(4, 7);
  if (d.length >= 7) o += '-' + d.slice(7, 9);
  if (d.length >= 9) o += '-' + d.slice(9, 11);
  phone.value = o;
  if (d.length === 11) phone.removeAttribute('aria-invalid');
});

document.querySelectorAll('form[data-endpoint]').forEach((form) => {
  const help = form.querySelector('[aria-live]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = phone.value.replace(/\D/g, '').length === 11;
    phone.setAttribute('aria-invalid', String(!ok));
    help.classList.toggle('err', !ok);
    if (!ok) { help.textContent = 'Номер неполный. Введите 11 цифр, например +7 950 324-09-11.'; phone.focus(); return; }
    if (!form.dataset.endpoint) { help.textContent = 'Заявка не отправлена: форма демо-версии пока не подключена. Позвоните или напишите в WhatsApp.'; return; }
    fetch(form.dataset.endpoint, { method: 'POST', body: new FormData(form) })
      .then((r) => { help.textContent = r.ok ? 'Заявка ушла. Перезвоним на ' + phone.value + '.' : 'Заявка не ушла. Попробуйте через минуту или позвоните.'; })
      .catch(() => { help.textContent = 'Заявка не ушла. Попробуйте через минуту или позвоните.'; });
  });
});
