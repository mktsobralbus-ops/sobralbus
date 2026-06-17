// ═══════════════════════════════════════════════════
//  SOBRALBUS — GERADOR DE PÁGINAS v2
//  Uso: node gerar-paginas.js
// ═══════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');
const { catalogo } = require('./onibus.js');

const TEMPLATE_PATH = path.join(__dirname, 'MODELO-pagina-produto.html');
const OUTPUT_DIR    = path.join(__dirname, 'pages');
const CATALOGO_JS   = path.join(__dirname, 'assets', 'js', 'catalogo.js');

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('❌ Template não encontrado: MODELO-pagina-produto.html');
  process.exit(1);
}
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const jsDir = path.join(__dirname, 'assets', 'js');
if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, { recursive: true });

const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// ── Helpers ───────────────────────────────────────
function safe(str) {
  return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildSpecsHTML(specs) {
  return specs.map(s =>
    `\n            <div class="spec-row"><span class="spec-key">${s.key}</span><span class="spec-val">${s.val}</span></div>`
  ).join('');
}

function buildBadgesHTML(badges) {
  const classes = ['badge-green', 'badge-blue', 'badge-orange', 'badge-purple'];
  return badges.map((b, i) =>
    `<span class="badge ${classes[i % classes.length]}">${b}</span>`
  ).join('\n            ');
}

function buildImagesArray(imagens) {
  return '\n    ' + imagens.map(img => `"${img}"`).join(',\n    ') + '\n  ';
}

function buildSchemaSpecs(specs) {
  return specs.map(s =>
    `      {"@type":"PropertyValue","name":"${s.key}","value":"${s.val}"}`
  ).join(',\n') +
  ',\n      {"@type":"PropertyValue","name":"Financiamento","value":"Disponível"}' +
  ',\n      {"@type":"PropertyValue","name":"Troca","value":"Aceita"}';
}

// ── Gerar páginas ─────────────────────────────────
let gerados = 0, ignorados = 0;

catalogo.forEach(v => {
  if (!v.ativo) { ignorados++; return; }

  const canonical   = `https://sobralbus.com.br/pages/${v.slug}.html`;
  const seoTitle    = `${v.titulo} ${v.ano} | ${v.preco} | ${v.lugares} Lugares | Sobralbus`;
  const seoDesc     = `${v.titulo} com chassi ${v.chassi}, ano ${v.ano}, ${v.lugares} lugares. À venda por ${v.preco}. Financiamento e troca aceita. Sobralbus.`;
  const seoKeywords = `${v.titulo} à venda, ${v.chassi} seminovo, ônibus ${v.ano} nordeste, comprar ônibus Sobralbus`;
  const ogTitle     = `${v.titulo} ${v.ano} — ${v.preco} | Sobralbus`;
  const ogDesc      = `${v.titulo} à venda. ${v.chassi}, ${v.ano}, ${v.lugares} lugares. Financiamento e troca aceita.`;
  const ogAlt       = `${v.titulo} ${v.ano} — Sobralbus`;
  const twitterDesc = `${v.titulo} à venda. ${v.lugares} lugares, ${v.chassi}, ${v.ano}. Sobralbus.`;

  let pagina = template
    // ── SEO ──
    .replaceAll('%%SEO_TITLE%%',        seoTitle)
    .replaceAll('%%SEO_DESC%%',         seoDesc)
    .replaceAll('%%SEO_KEYWORDS%%',     seoKeywords)
    .replaceAll('%%CANONICAL%%',        canonical)
    .replaceAll('%%OG_TITLE%%',         ogTitle)
    .replaceAll('%%OG_DESC%%',          ogDesc)
    .replaceAll('%%OG_IMAGE%%',         v.ogImagem)
    .replaceAll('%%OG_ALT%%',           ogAlt)
    .replaceAll('%%PRECO_NUM%%',        String(v.precoNum))
    .replaceAll('%%TWITTER_DESC%%',     twitterDesc)
    // ── Schema.org ──
    .replaceAll('%%CHASSI_FABRICANTE%%', v.chassi.split(' ')[0])
    .replaceAll('%%SCHEMA_SPECS%%',     buildSchemaSpecs(v.specs))
    // ── HTML ──
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
    // ── JS ──
    .replaceAll('%%IMAGENS_ARRAY%%',    buildImagesArray(v.imagens))
    .replaceAll('%%WHATSAPP%%',         v.whatsapp);

  const outPath = path.join(OUTPUT_DIR, `${v.slug}.html`);
  fs.writeFileSync(outPath, pagina, 'utf-8');
  console.log(`  ✓ pages/${v.slug}.html  (${v.imagens.length} fotos | ${v.specs.length} specs)`);
  gerados++;
});

console.log(`\n✅ ${gerados} página(s) gerada(s). ${ignorados} ignorada(s).`);

// ── Gerar catalogo.js para o index ────────────────
const ativos = catalogo.filter(v => v.ativo);

const cardsJS = `// AUTO-GERADO — não edite manualmente
// Edite onibus.js e rode: node gerar-paginas.js

const catalogoData = ${JSON.stringify(ativos, null, 2)};

function gerarCards(lista) {
  return lista.map(v => \`
    <div class="bus-card reveal" data-category="\${v.categoria}">
      <div class="card-img-wrap">
        <img src="\${v.imagem.replace('../', '')}" alt="\${v.titulo}" loading="lazy" onerror="this.style.opacity='.3'">
        \${v.destaque ? '<span class="badge-destaque">Destaque</span>' : ''}
        <span class="badge-cat">\${
          v.categoria === 'rodoviario' ? 'Rodoviário' :
          v.categoria === 'urbano'     ? 'Urbano'     : 'Micro'
        }</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">\${v.titulo}</h3>
        <p class="card-meta">Marca: \${v.marca} · Chassi: \${v.chassi}</p>
        <div class="card-specs">
          <span>📅 \${v.ano}</span>
          <span>🔄 \${v.km} km</span>
          <span>👤 \${v.lugares} lugares</span>
        </div>
        <div class="card-price">\${v.preco}</div>
        <div class="card-btns">
          <a href="pages/\${v.slug}.html" class="btn-ver">Ver Detalhes</a>
          <a href="https://wa.me/5588996930066?text=\${v.whatsapp}" target="_blank" class="btn-wpp-card">WhatsApp</a>
        </div>
      </div>
    </div>
  \`).join('');
}

function filtrarCards(categoria) {
  const lista = categoria === 'todos'
    ? catalogoData
    : catalogoData.filter(v => v.categoria === categoria);
  document.getElementById('catalogo-grid').innerHTML = gerarCards(lista);
  document.querySelectorAll('.bus-card.reveal').forEach(el => revealObs.observe(el));
}

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  filtrarCards('todos');
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filtrarCards(btn.dataset.filter);
    });
  });
});
`;

fs.writeFileSync(CATALOGO_JS, cardsJS, 'utf-8');
console.log('✅ assets/js/catalogo.js atualizado.');
