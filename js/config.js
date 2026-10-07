/* ESPANHOLARTE — configuração central.
   Preços, horários, textos comerciais e DESTINOS (WhatsApp, Hotmart, formulários, Instagram) ficam aqui.
   Depois de editar este arquivo, rode `node scripts/render.mjs` para atualizar o HTML pré-renderizado (SEO).
   Mesmo sem rodar, o navegador aplica os valores deste arquivo ao carregar a página. */

export const CONFIG = {
  brand: {
    name: 'Espanholarte',
    teacher: 'Profa. Bettiana Navarro',
    instagramHandle: 'espanholarte'
  },

  /* ---------- DESTINOS ----------
     Deixe vazio ('') o que ainda não foi fornecido. Os botões continuam na página e mostram um aviso
     "link em configuração" ao serem clicados. Nada aqui é inventado. */
  links: {
    /* WhatsApp: somente dígitos com DDI+DDD, ex.: '5511999999999'.  PENDENTE: número final da Bettiana. */
    whatsappNumber: '',
    /* Instagram: handle visível nos materiais da cliente (@espanholarte). Confirmar o perfil final. */
    instagram: 'https://www.instagram.com/espanholarte/',
    /* Checkout do Espanhol para Viagens (Hotmart). PENDENTE: confirmar o link final do produto. */
    hotmartViagens: '',
    /* Pré-inscrições (Google Forms atuais). Opcional: se preenchidos, aparecem em "Como começar". */
    forms: { particulares: '', a1: '', conversacao: '' }
  },

  whatsappGreeting: 'Olá, Bettiana! Vim pelo site da Espanholarte.',

  /* ---------- OFERTAS (ordem = ordem na página) ---------- */
  offers: [
    {
      id: 'a1',
      theme: 'yellow',
      path: 'Quero começar do zero',
      name: 'Curso de Espanhol para Iniciantes (A1)',
      who: 'Para quem quer aprender espanhol desde o zero, ou já tentou antes e travou na hora de falar.',
      price: { rows: [{ label: 'Mensalidade', value: 'R$ 200', unit: '/mês' }], note: 'Duração de 6 meses' },
      facts: [
        '1 encontro por semana, de 1h, ao vivo no Google Meet',
        'Turma pequena: no máximo 6 alunos',
        'Aulas gravadas e material incluídos'
      ],
      details: [
        'Método prático, com comunicação desde o início',
        '2 aulas de conversação por mês como bônus',
        'Certificado de conclusão'
      ],
      cta: { type: 'whatsapp', label: 'Quero começar do zero', message: 'Olá, Bettiana! Quero saber mais sobre o Curso de Espanhol para Iniciantes (A1).' }
    },
    {
      id: 'particular',
      theme: 'orange',
      path: 'Quero algo personalizado',
      name: 'Aulas particulares e em dupla',
      who: 'Para quem quer aprender no seu ritmo, com foco no que realmente precisa: viagem, trabalho, conversação, provas…',
      price: {
        rows: [
          { label: 'Individual · 1x por semana', value: 'R$ 300', unit: '/mês' },
          { label: 'Individual · 2x por semana', value: 'R$ 500', unit: '/mês' },
          { label: 'Em dupla · 1x por semana', value: 'R$ 220', unit: '/mês por pessoa' },
          { label: 'Em dupla · 2x por semana', value: 'R$ 370', unit: '/mês por pessoa' }
        ],
        note: ''
      },
      facts: [
        'Aulas ao vivo pelo Google Meet',
        'Plano de estudos personalizado',
        'Material e exercícios incluídos'
      ],
      details: [
        'Foco total no seu objetivo desde a primeira aula',
        'Acompanhamento próximo durante todo o processo',
        'Contrato de 3 ou 6 meses (opcional)'
      ],
      cta: { type: 'whatsapp', label: 'Quero aulas personalizadas', message: 'Olá, Bettiana! Quero saber mais sobre as aulas particulares / em dupla.' }
    },
    {
      id: 'conversacao',
      theme: 'red',
      path: 'Quero destravar minha fala',
      name: 'Aulas de Conversação',
      who: 'Para quem já tem conhecimento do espanhol e quer treinar a fala, aprender expressões e gírias nativas e se divertir praticando.',
      price: { rows: [{ label: '4 encontros', value: 'R$ 160', unit: '/mês' }], note: '' },
      facts: [
        '1 encontro por semana, de 60 minutos',
        'Turma reduzida, para garantir participação ativa',
        'Material de suporte na plataforma de estudos'
      ],
      details: ['Ambiente dinâmico, divertido e focado na fluência oral'],
      /* Horário do material atual. Conteúdo mutável: apague o texto para ocultar. */
      schedule: 'Horário atual da turma: sábados, 9h',
      cta: { type: 'whatsapp', label: 'Quero destravar minha fala', message: 'Olá, Bettiana! Quero saber mais sobre as aulas de conversação.' }
    },
    {
      id: 'viagens',
      theme: 'ink',
      path: 'Vou viajar',
      name: 'Espanhol para Viagens',
      who: 'Para quem vai viajar e quer se preparar em espanhol.',
      price: { rows: [{ label: 'À vista', value: 'R$ 147', unit: '' }], note: 'Condições de pagamento no checkout da Hotmart' },
      facts: [
        'Curso gravado',
        'Compra direto pela Hotmart'
      ],
      details: [],
      cta: { type: 'hotmart', label: 'Quero viajar falando', message: 'Olá, Bettiana! Quero saber mais sobre o Espanhol para Viagens.' }
    }
  ],

  /* ---------- FAQ: somente o que os materiais da cliente respondem ---------- */
  faq: [
    {
      q: 'As aulas são online?',
      a: 'Sim. As aulas particulares, o curso A1 e as aulas de conversação acontecem ao vivo pelo Google Meet. O Espanhol para Viagens é um curso gravado.'
    },
    {
      q: 'Qual modalidade é a certa para mim?',
      a: 'Se você está começando do zero, o caminho é o Curso A1. Se quer um plano feito sob medida, as aulas particulares ou em dupla. Se já tem uma base e quer treinar a fala, as aulas de conversação. E se a prioridade é uma viagem, o Espanhol para Viagens.'
    },
    {
      q: 'Posso estudar em dupla?',
      a: 'Pode. As aulas particulares têm a opção em dupla, com valor por pessoa.'
    },
    {
      q: 'Quantos alunos há por turma?',
      a: 'No curso A1, a turma é pequena, com no máximo 6 alunos. Nas aulas de conversação, a turma é reduzida.'
    },
    {
      q: 'O curso A1 tem aulas gravadas?',
      a: 'Sim. Além do encontro semanal ao vivo, o curso inclui aulas gravadas para assistir quando quiser, e o material completo.'
    },
    {
      q: 'Existe contrato nas aulas particulares?',
      a: 'O contrato de 3 ou 6 meses é opcional.'
    },
    {
      q: 'Como compro o Espanhol para Viagens?',
      a: 'A compra é feita direto no checkout da Hotmart, pelo botão do curso nesta página.'
    },
    {
      q: 'Atende alunos de qualquer lugar do Brasil?',
      a: 'Sim. As aulas são online, então você pode participar de qualquer região.'
    }
  ],

  /* Palavras do manifesto (HABLAR / CONECTAR / VIAJAR / VIVIR) */
  words: [
    { es: 'HABLAR', pt: 'Falar desde o primeiro dia.', photo: 'bettiana-maos', tone: 'yellow' },
    { es: 'CONECTAR', pt: 'Entender e ser entendido, em situações reais.', photo: 'bettiana-queixo', tone: 'orange' },
    { es: 'VIAJAR', pt: 'Chegar à próxima viagem preparado.', photo: 'bettiana-banco', tone: 'cream' },
    { es: 'VIVIR', pt: 'Usar o espanhol no seu dia a dia.', photo: 'bettiana-em-pe', tone: 'red' }
  ]
};

/* ---------- helpers compartilhados (navegador + render) ---------- */
export function whatsappHref(cfg, message) {
  const n = (cfg.links.whatsappNumber || '').replace(/\D/g, '');
  if (!n) return '';
  return `https://wa.me/${n}?text=${encodeURIComponent(message || cfg.whatsappGreeting)}`;
}
export function ctaHref(cfg, cta) {
  if (cta.type === 'hotmart') return cfg.links.hotmartViagens || '';
  return whatsappHref(cfg, cta.message);
}
