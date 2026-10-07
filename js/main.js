/* ESPANHOLARTE — comportamento. Sem dependências. Scroll nativo (sem scroll hijacking). */
import { CONFIG as C, ctaHref, whatsappHref } from './config.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- hidratação a partir do config (preços, links, horário, formulários) ---------- */
function setLink(a, href) {
  if (href) { a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.removeAttribute('data-pending'); }
  else { a.setAttribute('href', '#comecar'); a.removeAttribute('target'); a.setAttribute('data-pending', a.dataset.type || 'whatsapp'); }
}
$$('[data-wa]').forEach(a => setLink(a, whatsappHref(C, a.dataset.msg)));
C.offers.forEach(o => {
  const a = $(`[data-cta="${o.id}"]`); if (a) setLink(a, ctaHref(C, o.cta));
  const art = $(`#caminho-${o.id}`); if (!art) return;
  $$('[data-price]', art).forEach((b, i) => { if (o.price.rows[i]) b.textContent = o.price.rows[i].value; });
  const s = $('[data-schedule]', art); if (s) { s.textContent = o.schedule || ''; s.hidden = !o.schedule; }
});
const forms = C.links.forms || {}; let anyForm = false;
$$('[data-form]').forEach(a => { const u = forms[a.dataset.form]; if (u) { a.href = u; a.target = '_blank'; a.rel = 'noopener'; a.hidden = false; anyForm = true; } else a.hidden = true; });
const fl = $('[data-forms]'); if (fl) fl.hidden = !anyForm;
$$('[data-ig]').forEach(a => { if (C.links.instagram) a.href = C.links.instagram; });
$$('[data-year]').forEach(e => e.textContent = new Date().getFullYear());

/* ---------- aviso para destinos ainda não configurados ---------- */
const toast = $('#toast'); let tt;
document.addEventListener('click', e => {
  const a = e.target.closest('[data-pending]'); if (!a) return;
  e.preventDefault();
  toast.textContent = a.dataset.pending === 'hotmart' ? 'Link de compra em configuração. Em breve por aqui.' : 'Link do WhatsApp em configuração. Em breve por aqui.';
  toast.hidden = false; clearTimeout(tt); tt = setTimeout(() => toast.hidden = true, 3600);
});

/* ---------- header + menu mobile ---------- */
const hd = $('#hd'), menu = $('.hd__menu'), sheet = $('#sheet');
const onScroll = () => hd.classList.toggle('is-solid', scrollY > 24);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const closeMenu = () => { sheet.hidden = true; menu.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open)); sheet.hidden = !open; document.body.style.overflow = open ? 'hidden' : '';
  hd.classList.toggle('is-solid', open || scrollY > 24);
});
sheet.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) { closeMenu(); menu.focus(); } });
matchMedia('(min-width:960px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

/* ---------- revelações ---------- */
const rv = $$('.rv');
if (reduce || !('IntersectionObserver' in window)) rv.forEach(e => e.classList.add('in'));
else {
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  rv.forEach(e => io.observe(e));
}

/* ---------- "mais detalhes" ---------- */
$$('.path__more').forEach(b => b.addEventListener('click', () => {
  const d = document.getElementById(b.getAttribute('aria-controls')); const open = b.getAttribute('aria-expanded') !== 'true';
  b.setAttribute('aria-expanded', String(open)); d.hidden = !open; $('span', b).textContent = open ? 'Menos detalhes' : 'Mais detalhes';
}));

/* ---------- manifesto: cena fixa dirigida pelo progresso do scroll ---------- */
const mf = $('.mf');
if (mf && !reduce) {
  const track = $('.mf__track', mf), stage = $('.mf__stage', mf);
  const words = $$('.mf__word', mf), photos = $$('.mf__photo', mf), caps = $$('.mf__cap', mf), dots = $$('.mf__dots li', mf);
  const n = words.length; let cur = -1, raf = 0;
  const tones = C.words.map(w => w.tone);
  const set = (i, p) => {
    if (i !== cur) {
      cur = i; stage.dataset.tone = tones[i];
      [words, photos, caps, dots].forEach(list => list.forEach((el, k) => {
        el.classList.toggle('is-on', k === i); el.classList.toggle('is-past', k < i);
      }));
    }
    photos[i].style.setProperty('--lp', p.toFixed(3));
  };
  const update = () => {
    raf = 0;
    const r = track.getBoundingClientRect(), span = r.height - innerHeight;
    const prog = Math.min(.9999, Math.max(0, -r.top / span));
    const f = prog * n, i = Math.min(n - 1, Math.floor(f));
    set(i, f - i);
  };
  const req = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener('scroll', req, { passive: true }); addEventListener('resize', req);
  update();
}

/* ---------- hero: leve parallax da foto (desliga em reduced-motion) ---------- */
const hp = $('.hero__photo');
if (hp && !reduce) {
  let q = 0;
  addEventListener('scroll', () => { if (q) return; q = requestAnimationFrame(() => { q = 0; const y = Math.min(scrollY, innerHeight); hp.style.transform = `translateY(${(y * .08).toFixed(1)}px)`; }); }, { passive: true });
}
