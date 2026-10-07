# Espanholarte — landing page
Site estático (HTML/CSS/JS ES modules). Sem build, sem dependências.
- `js/config.js`: preços, horário, textos comerciais e URLs (WhatsApp, Hotmart, formulários, Instagram).
- `node scripts/render.mjs`: regenera `index.html` (SEO) a partir do config.
- Servir: `python3 -m http.server`. Vercel: framework "Other", sem build, output na raiz.
