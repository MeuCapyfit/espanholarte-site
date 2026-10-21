/* ESPANHOLARTE — Google Analytics 4 (propriedade exclusiva da Espanholarte).
   Só telemetria: não altera layout nem comportamento da página.
   Nenhum dado pessoal é enviado (nunca data-msg, textos digitados, telefone ou e-mail).
   QA: abra a página com ?ga_debug=1 para os eventos aparecerem no DebugView do GA4. */
(function () {
  var ID = 'G-XXXXXXXXXX'; /* Measurement ID da propriedade "Site Espanholarte" */
  if (window.__espanholarteGA) return; /* garante uma única instalação/listener */
  window.__espanholarteGA = true;
  if (!/^G-[A-Z0-9]{6,}$/.test(ID) || ID === 'G-XXXXXXXXXX') return; /* sem ID válido: não faz nada */

  var debug = /[?&]ga_debug=1\b/.test(location.search);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('js', new Date());
  gtag('config', ID, debug ? { debug_mode: true } : {});

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  (document.head || document.documentElement).appendChild(s);

  function send(name, params) {
    try {
      if (debug) params.debug_mode = true;
      window.gtag('event', name, params);
    } catch (e) { /* nunca quebrar a navegação */ }
  }

  /* onde o clique aconteceu, pelo contexto do elemento (sem depender de texto) */
  function where(a) {
    if (a.closest('#sheet')) return 'menu_mobile';
    if (a.closest('#hd')) return 'header';
    if (a.closest('#inicio')) return 'hero';
    if (a.closest('#caminhos')) return 'modalidades';
    if (a.closest('#bettiana')) return 'sobre_bettiana';
    if (a.closest('#comecar')) return 'como_comecar';
    if (a.closest('footer')) return 'footer';
    return 'outro';
  }

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a || a.hasAttribute('data-pending')) return;
    var loc = where(a);
    var course = a.getAttribute('data-cta') || '';
    var type = a.getAttribute('data-type') || '';

    if (course) send('course_interest', { course: course, cta_location: loc });

    if (a.hasAttribute('data-wa') || type === 'whatsapp') {
      var p = { cta_location: loc, cta_name: course || 'whatsapp_' + loc };
      if (course) p.course = course;
      send('whatsapp_click', p);
    } else if (type === 'hotmart') {
      send('hotmart_click', { course: course || 'viagens', cta_location: loc });
    } else if (a.hasAttribute('data-ig')) {
      send('instagram_click', { cta_location: loc });
    }
  }, true);
})();
