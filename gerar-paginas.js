// ═══════════════════════════════════════════════════
//  SOBRALBUS — GERADOR v4
//  Uso: node gerar-paginas.js
//  Gera: páginas produto + catalogo.js (index carrega via JS)
// ═══════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');
const { catalogo } = require('./onibus.js');

const TEMPLATE_PATH = path.join(__dirname, 'MODELO-pagina-produto.html');
const OUTPUT_DIR    = path.join(__dirname, 'pages');
const JS_DIR        = path.join(__dirname, 'assets', 'js');
const CATALOGO_JS   = path.join(JS_DIR, 'catalogo.js');

if (!fs.existsSync(TEMPLATE_PATH)) { console.error('❌ MODELO-pagina-produto.html não encontrado'); process.exit(1); }
if (!fs.existsSync(OUTPUT_DIR))    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(JS_DIR))        fs.mkdirSync(JS_DIR, { recursive: true });

const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
const ativos   = catalogo.filter(v => v.ativo);

// ── Helpers ───────────────────────────────────────
const buildSpecsHTML  = specs  => specs.map(s => `\n            <div class="spec-row"><span class="spec-key">${s.key}</span><span class="spec-val">${s.val}</span></div>`).join('');
const buildBadgesHTML = badges => { const c=['badge-green','badge-blue','badge-orange','badge-purple']; return badges.map((b,i)=>`<span class="badge ${c[i%c.length]}">${b}</span>`).join('\n            '); };
const buildImgsArray  = imgs   => '\n    ' + imgs.map(i=>`"${i}"`).join(',\n    ') + '\n  ';
const buildSchema     = specs  => specs.map(s=>`      {"@type":"PropertyValue","name":"${s.key}","value":"${s.val}"}`).join(',\n') + ',\n      {"@type":"PropertyValue","name":"Financiamento","value":"Disponível"},\n      {"@type":"PropertyValue","name":"Troca","value":"Aceita"}';

// ══ 1. PÁGINAS PRODUTO ════════════════════════════
console.log('\n📄 Gerando páginas produto...');
let gerados = 0, ignorados = 0;

catalogo.forEach(v => {
  if (!v.ativo) { ignorados++; return; }
  const url = `https://sobralbus.com.br/pages/${v.slug}.html`;

  let p = template
    .replaceAll('%%SEO_TITLE%%',        `${v.titulo} ${v.ano} | ${v.preco} | ${v.lugares} Lugares | Sobralbus`)
    .replaceAll('%%SEO_DESC%%',         `${v.titulo} com chassi ${v.chassi}, ano ${v.ano}, ${v.lugares} lugares. À venda por ${v.preco}. Financiamento e troca aceita.`)
    .replaceAll('%%SEO_KEYWORDS%%',     `${v.titulo} à venda, ${v.chassi} seminovo, ônibus ${v.ano} nordeste, comprar ônibus Sobralbus`)
    .replaceAll('%%CANONICAL%%',        url)
    .replaceAll('%%OG_TITLE%%',         `${v.titulo} ${v.ano} — ${v.preco} | Sobralbus`)
    .replaceAll('%%OG_DESC%%',          `${v.titulo} à venda. ${v.chassi}, ${v.ano}, ${v.lugares} lugares. Financiamento e troca aceita.`)
    .replaceAll('%%OG_IMAGE%%',         v.ogImagem)
    .replaceAll('%%OG_ALT%%',           `${v.titulo} ${v.ano} — Sobralbus`)
    .replaceAll('%%PRECO_NUM%%',        String(v.precoNum))
    .replaceAll('%%TWITTER_DESC%%',     `${v.titulo} à venda. ${v.lugares} lugares, ${v.chassi}, ${v.ano}. Sobralbus.`)
    .replaceAll('%%CHASSI_FABRICANTE%%',v.chassi.split(' ')[0])
    .replaceAll('%%SCHEMA_SPECS%%',     buildSchema(v.specs))
    .replaceAll('%%TITULO%%',           v.titulo)
    .replaceAll('%%MARCA%%',            v.marca)
    .replaceAll('%%CHASSI%%',           v.chassi)
    .replaceAll('%%ANO%%',              String(v.ano))
    .replaceAll('%%KM%%',               v.km)
    .replaceAll('%%LUGARES%%',          String(v.lugares))
    .replaceAll('%%PRECO%%',            v.preco)
    .replaceAll('%%DESCRICAO%%',        v.descricao)
    .replaceAll('%%BREADCRUMB%%',       v.titulo)
    .replaceAll('%%BADGES_HTML%%',      buildBadgesHTML(v.badges))
    .replaceAll('%%SPECS_HTML%%',       buildSpecsHTML(v.specs))
    .replaceAll('%%PRIMEIRA_IMAGEM%%',  v.imagens[0])
    .replaceAll('%%IMAGENS_ARRAY%%',    buildImgsArray(v.imagens))
    .replaceAll('%%WHATSAPP%%',         v.whatsapp);

  fs.writeFileSync(path.join(OUTPUT_DIR, `${v.slug}.html`), p, 'utf-8');
  console.log(`  ✓ pages/${v.slug}.html  (${v.imagens.length} fotos | ${v.specs.length} specs)`);
  gerados++;
});
console.log(`  → ${gerados} gerada(s), ${ignorados} ignorada(s).`);

// ══ 2. CATALOGO.JS — carregado pelo index no browser ══
console.log('\n⚙️  Gerando assets/js/catalogo.js...');

const SVG_CAL  = `<svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`;
const SVG_KM   = `<svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`;
const SVG_SEAT = `<svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`;

// Serializar dados para JS (sem imagens e specs para manter leve)
const dadosCards = ativos.map(v => ({
  slug:       v.slug,
  titulo:     v.titulo,
  marca:      v.marca,
  chassi:     v.chassi,
  ano:        v.ano,
  km:         v.km,
  lugares:    v.lugares,
  preco:      v.preco,
  categoria:  v.categoria,
  destaque:   v.destaque,
  imagem:     v.imagem.replace('../', ''),
  whatsapp:   v.whatsapp,
}));

const cardsJS = `// AUTO-GERADO por gerar-paginas.js — não edite manualmente
// Edite onibus.js e rode: node gerar-paginas.js

(function() {
  const dados = ${JSON.stringify(dadosCards, null, 2)};

  const SVG_CAL  = '${SVG_CAL.replace(/'/g, "\\'")}';
  const SVG_KM   = '${SVG_KM.replace(/'/g, "\\'")}';
  const SVG_SEAT = '${SVG_SEAT.replace(/'/g, "\\'")}';

  function buildCard(v) {
    const catName   = v.categoria === 'rodoviario' ? 'Rodoviário' : v.categoria === 'urbano' ? 'Urbano' : 'Micro';
    const destBadge = v.destaque ? '<span class="bus-badge badge-highlight">Destaque</span>' : '';
    return \`
        <div class="bus-card reveal" data-type="\${v.categoria}">
          <div class="bus-card-image">
            <img loading="lazy" decoding="async" src="\${v.imagem}" alt="\${v.titulo}" onerror="this.style.opacity='.2'">
            \${destBadge}
            <span class="badge-type">\${catName}</span>
          </div>
          <div class="bus-card-content">
            <h3 class="bus-card-title">\${v.titulo}</h3>
            <p class="bus-card-brand">\${v.marca}</p>
            <div class="bus-card-specs">
              <span class="bus-card-spec">\${SVG_CAL}\${v.ano}</span>
              <span class="bus-card-spec">\${SVG_KM}\${v.km} km</span>
              <span class="bus-card-spec">\${SVG_SEAT}\${v.lugares} lugares</span>
            </div>
            <div class="bus-card-price">\${v.preco}</div>
            <div class="bus-card-actions">
              <a href="pages/\${v.slug}.html" target="_blank" class="btn btn-primary">Ver Detalhes</a>
              <a href="https://wa.me/5588996930066?text=\${v.whatsapp}" target="_blank" class="btn btn-accent">WhatsApp</a>
            </div>
          </div>
        </div>\`;
  }

  function renderCards(filtro) {
    const grid = document.getElementById('bus-grid');
    if (!grid) return;
    const lista = filtro === 'todos' ? dados : dados.filter(v => v.categoria === filtro);
    grid.innerHTML = lista.length
      ? lista.map(buildCard).join('')
      : '<p style="grid-column:1/-1;text-align:center;padding:3rem;color:#64748b">Nenhum veículo encontrado.</p>';
    // Reveal
    grid.querySelectorAll('.bus-card.reveal').forEach(el => revealObs.observe(el));
  }

  // Reveal observer
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.08 });

  // Inicializar
  document.addEventListener('DOMContentLoaded', function() {
    renderCards('todos');

    // Filtros (compatível com data-filter e data-type)
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // Limpar busca se existir
        const si = document.getElementById('searchInput');
        const ts = document.getElementById('typeSelect');
        if (si) si.value = '';
        if (ts) ts.value = '';
        renderCards(this.dataset.filter);
      });
    });

    // Busca (se existir)
    function performSearch() {
      const term = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
      const cat  = document.getElementById('typeSelect')?.value || '';
      document.querySelectorAll('[data-filter]').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === (cat || 'todos'));
      });
      const grid = document.getElementById('bus-grid');
      if (!grid) return;
      const lista = dados.filter(v => {
        const matchCat  = !cat || v.categoria === cat;
        const matchTerm = !term || v.titulo.toLowerCase().includes(term) || v.marca.toLowerCase().includes(term) || v.categoria.includes(term);
        return matchCat && matchTerm;
      });
      grid.innerHTML = lista.length
        ? lista.map(buildCard).join('')
        : '<p style="grid-column:1/-1;text-align:center;padding:3rem;color:#64748b">Nenhum veículo encontrado.</p>';
      grid.querySelectorAll('.bus-card.reveal').forEach(el => revealObs.observe(el));
    }

    document.getElementById('searchBtn')?.addEventListener('click', performSearch);
    document.getElementById('searchInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') performSearch(); });
    document.getElementById('typeSelect')?.addEventListener('change', performSearch);
  });
})();
`;

fs.writeFileSync(CATALOGO_JS, cardsJS, 'utf-8');
console.log('  ✓ assets/js/catalogo.js gerado.');
console.log('\n✅ Pronto! Próximo passo:');
console.log('   git add . && git commit -m "Atualiza catálogo" && git push\n');
