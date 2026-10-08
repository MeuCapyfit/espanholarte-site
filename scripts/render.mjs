/* Gera index.html a partir de js/config.js.
   Uso: node scripts/render.mjs
   O HTML sai pré-renderizado (texto, preços e links já no markup) para SEO e primeira pintura rápida.
   Em runtime, js/main.js reaplica os valores de js/config.js (preços/links), então editar o config já vale. */
import { writeFileSync } from 'node:fs';
import { CONFIG as C, ctaHref, whatsappHref } from '../js/config.js';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const WA_ICON = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 8.4c.2-.4.5-.4.8-.4.2 0 .4 0 .5.4l.7 1.6c.1.3 0 .5-.2.7l-.5.6c.8 1.4 1.7 2.2 3.1 3l.6-.6c.2-.2.4-.3.7-.2l1.6.8c.3.1.4.3.3.7-.2.9-1 1.4-1.9 1.3-3-.4-5.3-2.7-6.2-5.4-.1-.5 0-1.700.5-2.500Z" fill="currentColor"/></svg>';
const IG_ICON = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/></svg>';
const ARROW = '<svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const waAttrs = (msg) => {
  const h = whatsappHref(C, msg);
  return h ? `href="${esc(h)}" target="_blank" rel="noopener" data-wa data-msg="${esc(msg || C.whatsappGreeting)}"`
           : `href="#comecar" data-wa data-msg="${esc(msg || C.whatsappGreeting)}" data-pending="whatsapp"`;
};
const ctaAttrs = (o) => {
  const h = ctaHref(C, o.cta);
  const base = `data-cta="${o.id}" data-type="${o.cta.type}" data-msg="${esc(o.cta.message)}"`;
  if (h) return `href="${esc(h)}" target="_blank" rel="noopener" ${base}`;
  return `href="#comecar" ${base} data-pending="${o.cta.type}"`;
};
const lines = (arr) => arr.map(l => `<span class="ln"><span>${l}</span></span>`).join('');

const priceHTML = o => {
  const rows = o.price.rows.map(r => `<div class="price__row"><dt>${esc(r.label)}</dt><dd><b data-price="${o.id}">${esc(r.value)}</b>${r.unit ? `<small>${esc(r.unit)}</small>` : ''}</dd></div>`).join('');
  return `<dl class="price${o.price.rows.length > 1 ? ' price--multi' : ''}">${rows}</dl>${o.price.note ? `<p class="price__note">${esc(o.price.note)}</p>` : ''}`;
};

const pathHTML = (o, i) => `
    <article class="path path--${o.theme} rv" id="caminho-${o.id}" data-theme="${o.theme}">
      <span class="path__fill" aria-hidden="true"></span>
      <div class="path__inner">
        <div class="path__head">
          <span class="path__no" aria-hidden="true">0${i + 1}</span>
          <h3 class="path__title">${esc(o.path)}</h3>
          <p class="path__name">${esc(o.name)}</p>
        </div>
        <div class="path__body">
          <p class="path__who">${esc(o.who)}</p>
          <ul class="path__facts">${o.facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
          ${(o.details.length || o.schedule) ? `<button class="path__more" type="button" aria-expanded="false" aria-controls="det-${o.id}"><span>Mais detalhes</span><i aria-hidden="true"></i></button>
          <div class="path__details" id="det-${o.id}" hidden>
            ${o.details.length ? `<ul>${o.details.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
            ${o.schedule ? `<p class="path__sched" data-schedule>${esc(o.schedule)}</p>` : ''}
          </div>` : ''}
        </div>
        <div class="path__buy">
          ${priceHTML(o)}
          <a class="btn btn--solid path__cta" ${ctaAttrs(o)}><span>${esc(o.cta.label)}</span>${ARROW}</a>
        </div>
      </div>
    </article>`;

const faqHTML = C.faq.map((f, i) => `
      <details class="qa rv"${i === 0 ? '' : ''}>
        <summary><span class="qa__q">${esc(f.q)}</span><i class="qa__i" aria-hidden="true"></i></summary>
        <div class="qa__a"><p>${esc(f.a)}</p></div>
      </details>`).join('');

const wordsHTML = C.words.map((w, i) => `<span class="mf__word" data-i="${i}">${esc(w.es)}</span>`).join('');
const photosHTML = C.words.map((w, i) => `<img class="mf__photo${w.photo === 'bettiana-em-pe' ? ' flip' : ''}" data-i="${i}" src="assets/img/${w.photo}-sm.webp" srcset="assets/img/${w.photo}-sm.webp 370w, assets/img/${w.photo}.webp 800w" sizes="(max-width: 800px) 70vw, 36vw" alt="" loading="lazy" decoding="async">`).join('');
const capsHTML = C.words.map((w, i) => `<p class="mf__cap" data-i="${i}"><span>${esc(w.pt)}</span></p>`).join('');
const staticWords = C.words.map((w, i) => `<li><b>${esc(w.es)}</b> ${esc(w.pt)}</li>`).join('');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Espanholarte | Curso de espanhol para brasileiros com a Profa. Bettiana Navarro</title>
<meta name="description" content="Curso de espanhol para brasileiros com professores nativos e método focado em comunicação. Escolha seu caminho: curso A1, aulas particulares ou em dupla, conversação e Espanhol para Viagens.">
<meta name="theme-color" content="#FBF3E4">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="Espanholarte | Espanhol para falar. Não para decorar.">
<meta property="og:description" content="Curso de espanhol para brasileiros com a Profa. Bettiana Navarro, professora nativa do Uruguai. Quatro caminhos para o seu momento.">
<meta property="og:image" content="assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/favicon.png" type="image/png">
<link rel="preload" href="assets/fonts/fraunces.woff" as="font" type="font/woff" crossorigin>
<link rel="preload" href="assets/fonts/bricolage.woff" as="font" type="font/woff" crossorigin>
<script>document.documentElement.classList.add("js")</script>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<a class="skip" href="#caminhos">Pular para as modalidades</a>

<header class="hd" id="hd">
  <a class="hd__logo" href="#inicio" aria-label="Espanholarte, início"><img src="assets/img/logo.png" alt="Espanholarte, Profa. Bettiana Navarro" width="472" height="320"></a>
  <nav class="hd__nav" aria-label="Seções">
    <a href="#caminhos">Modalidades</a><a href="#metodo">Método</a><a href="#bettiana">Bettiana</a><a href="#comecar">Como começar</a><a href="#faq">Dúvidas</a>
  </nav>
  <a class="btn btn--solid hd__cta" ${waAttrs()}>${WA_ICON}<span>WhatsApp</span></a>
  <button class="hd__menu" type="button" aria-expanded="false" aria-controls="sheet"><span class="sr-only">Abrir menu</span><i></i><i></i></button>
</header>
<div class="sheet" id="sheet" hidden>
  <nav aria-label="Menu">
    <a href="#caminhos">Modalidades</a><a href="#metodo">Método</a><a href="#bettiana">Bettiana</a><a href="#comecar">Como começar</a><a href="#faq">Dúvidas</a>
  </nav>
  <a class="btn btn--solid" ${waAttrs()}>${WA_ICON}<span>Falar no WhatsApp</span></a>
</div>

<main id="main">

  <!-- 1. HERO -->
  <section class="hero" id="inicio" aria-labelledby="h1">
    <div class="hero__sun" aria-hidden="true"><i class="sun"></i><i class="ring"></i>
      <svg class="rays" viewBox="0 0 120 120"><g stroke="currentColor" stroke-width="5" stroke-linecap="round"><path d="M10 60 38 60"/><path d="M20 24 42 40"/><path d="M20 96 42 80"/></g></svg>
    </div>
    <div class="hero__copy">
      <p class="kicker hero__kicker"><span>Curso de espanhol para brasileiros</span><i></i><span>Profa. Bettiana Navarro</span></p>
      <h1 class="hero__title" id="h1">${lines(['Espanhol', 'para <em>falar.</em>', '<span class="soft">Não para</span>', '<span class="soft">decorar.</span>'])}</h1>
      <p class="hero__lead">Professores nativos e um método com foco na comunicação, feito para brasileiros que querem falar espanhol de verdade.</p>
      <div class="hero__cta">
        <a class="btn btn--solid" href="#caminhos"><span>Escolher meu caminho</span>${ARROW}</a>
        <a class="btn btn--line" ${waAttrs()}>${WA_ICON}<span>Falar no WhatsApp</span></a>
      </div>
      <ul class="hero__paths" aria-label="Os quatro caminhos">
        <li><a href="#caminho-a1"><b>01</b> Do zero</a></li>
        <li><a href="#caminho-particular"><b>02</b> Personalizado</a></li>
        <li><a href="#caminho-conversacao"><b>03</b> Conversação</a></li>
        <li><a href="#caminho-viagens"><b>04</b> Viagens</a></li>
      </ul>
    </div>
    <figure class="hero__photo">
      <img src="assets/img/bettiana-em-pe.webp" srcset="assets/img/bettiana-em-pe-sm.webp 367w, assets/img/bettiana-em-pe.webp 592w" sizes="(max-width: 800px) 80vw, 40vw" width="592" height="1069" alt="Bettiana Navarro, professora nativa do Uruguai, sorrindo com a mão no bolso" fetchpriority="high" decoding="async">
      <span class="hola" aria-hidden="true">¡Hola!</span>
    </figure>
  </section>

  <!-- 2. MANIFESTO -->
  <section class="mf" id="manifesto" aria-labelledby="mfT">
    <div class="mf__track">
      <div class="mf__stage" data-tone="yellow">
        <p class="kicker mf__kicker"><span>01</span><i></i><span>O jeito Espanholarte</span></p>
        <h2 class="mf__lead" id="mfT">Espanhol não é matéria.<br><em>É conversa.</em></h2>
        <div class="mf__words" aria-hidden="true">${wordsHTML}</div>
        <div class="mf__photos" aria-hidden="true">${photosHTML}</div>
        <div class="mf__caps" aria-hidden="true">${capsHTML}</div>
        <ol class="mf__dots" aria-hidden="true">${C.words.map((w, i) => `<li data-i="${i}"></li>`).join('')}</ol>
        <p class="mf__hint" aria-hidden="true">Role <i></i></p>
      </div>
    </div>
    <ul class="sr-only mf__sr">${staticWords}</ul>
  </section>

  <!-- 3. CAMINHOS (coração comercial) -->
  <section class="paths" id="caminhos" aria-labelledby="pT">
    <div class="wrap">
      <div class="paths__head">
        <p class="kicker rv"><span>02</span><i></i><span>Modalidades</span></p>
        <h2 class="display rv" id="pT">Um espanhol para o <em>seu momento.</em></h2>
        <p class="lead rv">Quatro caminhos. Escolha o que combina com o ponto em que você está agora.</p>
      </div>
      <div class="paths__list">${C.offers.map(pathHTML).join('')}
      </div>
    </div>
  </section>

  <!-- 4. MÉTODO -->
  <section class="method" id="metodo" aria-labelledby="mT">
    <div class="wrap method__grid">
      <figure class="method__photo rv">
        <span class="brush" aria-hidden="true"></span>
        <img src="assets/img/bettiana-pensando-sm.webp" srcset="assets/img/bettiana-pensando-sm.webp 375w, assets/img/bettiana-pensando.webp 604w" sizes="(max-width: 800px) 70vw, 34vw" width="604" height="973" alt="Bettiana Navarro com a mão no queixo, em expressão pensativa" loading="lazy" decoding="async">
      </figure>
      <div class="method__copy">
        <p class="kicker rv"><span>03</span><i></i><span>Método</span></p>
        <h2 class="display rv" id="mT">Aprender a se comunicar, <em>não só a estudar.</em></h2>
        <ol class="principles">
          <li class="rv"><b>Professores nativos</b><p>Pronúncia, expressões e o jeito de falar de quem é do idioma.</p></li>
          <li class="rv"><b>Foco na comunicação</b><p>Cada aula é pensada para você se comunicar em situações reais.</p></li>
          <li class="rv"><b>Prática desde o início</b><p>Desde a primeira aula, a conversa faz parte do caminho.</p></li>
          <li class="rv"><b>Feito para brasileiros</b><p>Um método claro, prático e pensado para quem fala português.</p></li>
        </ol>
      </div>
    </div>
  </section>

  <!-- 5. SOBRE BETTIANA -->
  <section class="about" id="bettiana" aria-labelledby="aT">
    <div class="wrap about__grid">
      <figure class="about__photo rv">
        <img src="assets/img/bettiana-caneca-sm.webp" srcset="assets/img/bettiana-caneca-sm.webp 528w, assets/img/bettiana-caneca.webp 852w" sizes="(max-width: 800px) 86vw, 38vw" width="852" height="1280" alt="Bettiana Navarro sorrindo, segurando uma caneca da Espanholarte" loading="lazy" decoding="async">
      </figure>
      <div class="about__copy">
        <p class="kicker rv"><span>04</span><i></i><span>Quem ensina</span></p>
        <h2 class="display rv" id="aT">Bettiana <em>Navarro</em></h2>
        <p class="about__role rv">Professora nativa do Uruguai e o rosto da Espanholarte.</p>
        <p class="lead rv">Ela ajuda brasileiros do mundo todo a se comunicar com confiança em espanhol, com aulas práticas e dinâmicas.</p>
        <p class="rv"><a class="btn btn--line" href="${esc(C.links.instagram)}" target="_blank" rel="noopener" data-ig>${IG_ICON}<span>@${esc(C.brand.instagramHandle)} no Instagram</span></a></p>
      </div>
    </div>
  </section>

  <!-- 6. COMO COMEÇAR -->
  <section class="start" id="comecar" aria-labelledby="sT">
    <div class="wrap start__grid">
      <div class="start__copy">
        <p class="kicker rv"><span>05</span><i></i><span>Como começar</span></p>
        <h2 class="display rv" id="sT">Vamos <em>conversar?</em></h2>
        <ol class="steps">
          <li class="rv"><b>01</b><p>Escolha o caminho que combina com o seu momento.</p></li>
          <li class="rv"><b>02</b><p>Chame no WhatsApp e conte seu objetivo e os dias e horários que você tem disponíveis.</p></li>
          <li class="rv"><b>03</b><p>Receba a indicação da melhor opção e a confirmação de disponibilidade.</p></li>
        </ol>
      </div>
      <div class="start__cta rv">
        <a class="btn btn--big" ${waAttrs()}>${WA_ICON}<span>Falar no WhatsApp</span></a>
        <p class="start__note">O Espanhol para Viagens você compra direto pela Hotmart, no botão do curso.</p>
        <ul class="start__forms" data-forms hidden>
          <li><a href="#" data-form="particulares" hidden>Pré-inscrição: aulas particulares</a></li>
          <li><a href="#" data-form="a1" hidden>Pré-inscrição: curso A1</a></li>
          <li><a href="#" data-form="conversacao" hidden>Pré-inscrição: conversação</a></li>
        </ul>
      </div>
    </div>
  </section>

  <!-- 7. FAQ -->
  <section class="faq" id="faq" aria-labelledby="fT">
    <div class="wrap faq__grid">
      <div>
        <p class="kicker rv"><span>06</span><i></i><span>Dúvidas</span></p>
        <h2 class="display rv" id="fT">Perguntas <em>frequentes.</em></h2>
      </div>
      <div class="faq__list">${faqHTML}
      </div>
    </div>
  </section>
</main>

<footer class="ft">
  <div class="wrap ft__in">
    <p class="ft__big" aria-hidden="true">Hablemos.</p>
    <div class="ft__row">
      <div class="ft__brand"><img src="assets/img/logo.png" alt="Espanholarte" width="236" height="160" loading="lazy"><p>Curso de espanhol para brasileiros<br>Profa. Bettiana Navarro</p></div>
      <nav class="ft__nav" aria-label="Rodapé"><a href="#caminhos">Modalidades</a><a href="#metodo">Método</a><a href="#bettiana">Bettiana</a><a href="#comecar">Como começar</a><a href="#faq">Dúvidas</a></nav>
      <div class="ft__soc">
        <a class="btn btn--line" ${waAttrs()}>${WA_ICON}<span>WhatsApp</span></a>
        <a class="btn btn--line" href="${esc(C.links.instagram)}" target="_blank" rel="noopener" data-ig>${IG_ICON}<span>Instagram</span></a>
      </div>
    </div>
    <p class="ft__copy">© <span data-year>2026</span> Espanholarte. Todos os direitos reservados.</p>
    <p class="ft__credit"><a href="https://www.forjaapps.com.br" target="_blank" rel="noopener noreferrer">Desenvolvido pela Forja Apps <svg class="ext" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M3 9 9 3M4.2 3H9v4.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="sr-only">(abre em nova aba)</span></a></p>
  </div>
</footer>

<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>
<script type="module" src="js/main.js"></script>
</body>
</html>
`;
writeFileSync(new URL('../index.html', import.meta.url), html);
console.log('index.html gerado', html.length, 'bytes');
