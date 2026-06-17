// ═══════════════════════════════════════════════════
//  SOBRALBUS — GERADOR COMPLETO v3
//  Uso: node gerar-paginas.js
//  Gera: páginas produto + index.html + catalogo.js
// ═══════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');
const { catalogo } = require('./onibus.js');

const TEMPLATE_PATH = path.join(__dirname, 'MODELO-pagina-produto.html');
const INDEX_PATH    = path.join(__dirname, 'index.html');
const OUTPUT_DIR    = path.join(__dirname, 'pages');
const CATALOGO_JS   = path.join(__dirname, 'assets', 'js', 'catalogo.js');

// ── Verificações ──────────────────────────────────
if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('❌ MODELO-pagina-produto.html não encontrado');
  process.exit(1);
}
if (!fs.existsSync(INDEX_PATH)) {
  console.error('❌ index.html não encontrado');
  process.exit(1);
}
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const jsDir = path.join(__dirname, 'assets', 'js');
if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, { recursive: true });

const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
const ativos   = catalogo.filter(v => v.ativo);

// ── SVG Icons reutilizáveis ───────────────────────
const SVG_CAL  = `<svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`;
const SVG_KM   = `<svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`;
const SVG_SEAT = `<svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`;

// ── Helpers ───────────────────────────────────────
function buildCard(v) {
  const imgSrc  = v.imagem.replace('../', '');
  const catName = v.categoria === 'rodoviario' ? 'Rodoviário' : v.categoria === 'urbano' ? 'Urbano' : 'Micro';
  const destBadge = v.destaque ? `\n            <span class="bus-badge badge-highlight">Destaque</span>` : '';
  return `
        <div class="bus-card reveal" data-type="${v.categoria}">
          <div class="bus-card-image">
            <img loading="lazy" decoding="async" src="${imgSrc}" alt="${v.titulo}" onerror="this.style.opacity='.2'">
            ${destBadge}
            <span class="badge-type">${catName}</span>
          </div>
          <div class="bus-card-content">
            <h3 class="bus-card-title">${v.titulo}</h3>
            <p class="bus-card-brand">${v.marca}</p>
            <div class="bus-card-specs">
              <span class="bus-card-spec">${SVG_CAL}${v.ano}</span>
              <span class="bus-card-spec">${SVG_KM}${v.km} km</span>
              <span class="bus-card-spec">${SVG_SEAT}${v.lugares} lugares</span>
            </div>
            <div class="bus-card-price">${v.preco}</div>
            <div class="bus-card-actions">
              <a href="pages/${v.slug}.html" target="_blank" class="btn btn-primary">Ver Detalhes</a>
              <a href="https://wa.me/5588996930066?text=${v.whatsapp}" target="_blank" class="btn btn-accent">WhatsApp</a>
            </div>
          </div>
        </div>`;
}

function buildSpecsHTML(specs) {
  return specs.map(s =>
    `\n            <div class="spec-row"><span class="spec-key">${s.key}</span><span class="spec-val">${s.val}</span></div>`
  ).join('');
}

function buildBadgesHTML(badges) {
  const cls = ['badge-green','badge-blue','badge-orange','badge-purple'];
  return badges.map((b,i) => `<span class="badge ${cls[i%cls.length]}">${b}</span>`).join('\n            ');
}

function buildImagesArray(imagens) {
  return '\n    ' + imagens.map(i => `"${i}"`).join(',\n    ') + '\n  ';
}

function buildSchemaSpecs(specs) {
  return specs.map(s =>
    `      {"@type":"PropertyValue","name":"${s.key}","value":"${s.val}"}`
  ).join(',\n') +
  ',\n      {"@type":"PropertyValue","name":"Financiamento","value":"Disponível"}' +
  ',\n      {"@type":"PropertyValue","name":"Troca","value":"Aceita"}';
}

// ══ 1. GERAR PÁGINAS PRODUTO ═════════════════════
console.log('\n📄 Gerando páginas produto...');
let gerados = 0, ignorados = 0;

catalogo.forEach(v => {
  if (!v.ativo) { ignorados++; return; }

  const canonical   = `https://sobralbus.com.br/pages/${v.slug}.html`;
  const seoTitle    = `${v.titulo} ${v.ano} | ${v.preco} | ${v.lugares} Lugares | Sobralbus`;
  const seoDesc     = `${v.titulo} com chassi ${v.chassi}, ano ${v.ano}, ${v.lugares} lugares. À venda por ${v.preco}. Financiamento e troca aceita. Sobralbus.`;

  let pagina = template
    .replaceAll('%%SEO_TITLE%%',        seoTitle)
    .replaceAll('%%SEO_DESC%%',         seoDesc)
    .replaceAll('%%SEO_KEYWORDS%%',     `${v.titulo} à venda, ${v.chassi} seminovo, ônibus ${v.ano} nordeste, comprar ônibus Sobralbus`)
    .replaceAll('%%CANONICAL%%',        canonical)
    .replaceAll('%%OG_TITLE%%',         `${v.titulo} ${v.ano} — ${v.preco} | Sobralbus`)
    .replaceAll('%%OG_DESC%%',          `${v.titulo} à venda. ${v.chassi}, ${v.ano}, ${v.lugares} lugares. Financiamento e troca aceita.`)
    .replaceAll('%%OG_IMAGE%%',         v.ogImagem)
    .replaceAll('%%OG_ALT%%',           `${v.titulo} ${v.ano} — Sobralbus`)
    .replaceAll('%%PRECO_NUM%%',        String(v.precoNum))
    .replaceAll('%%TWITTER_DESC%%',     `${v.titulo} à venda. ${v.lugares} lugares, ${v.chassi}, ${v.ano}. Sobralbus.`)
    .replaceAll('%%CHASSI_FABRICANTE%%',v.chassi.split(' ')[0])
    .replaceAll('%%SCHEMA_SPECS%%',     buildSchemaSpecs(v.specs))
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
    .replaceAll('%%IMAGENS_ARRAY%%',    buildImagesArray(v.imagens))
    .replaceAll('%%WHATSAPP%%',         v.whatsapp);

  fs.writeFileSync(path.join(OUTPUT_DIR, `${v.slug}.html`), pagina, 'utf-8');
  console.log(`  ✓ pages/${v.slug}.html  (${v.imagens.length} fotos | ${v.specs.length} specs)`);
  gerados++;
});
console.log(`  → ${gerados} gerada(s), ${ignorados} ignorada(s).`);

// ══ 2. ATUALIZAR INDEX.HTML ═══════════════════════
console.log('\n🏠 Atualizando index.html...');
let indexHtml = fs.readFileSync(INDEX_PATH, 'utf-8');

if (!indexHtml.includes('%%CARDS_HTML%%')) {
  console.error('  ❌ index.html não tem o marcador %%CARDS_HTML%%');
  console.error('     Adicione %%CARDS_HTML%% dentro do <div class="bus-grid">');
} else {
  const cardsHTML = ativos.map(buildCard).join('');
  indexHtml = indexHtml.replace('%%CARDS_HTML%%', cardsHTML);
  fs.writeFileSync(INDEX_PATH, indexHtml, 'utf-8');
  console.log(`  ✓ ${ativos.length} card(s) injetado(s) no index.html`);
}

// ══ 3. GERAR CATALOGO.JS (fallback) ═════════════
console.log('\n⚙️  Gerando assets/js/catalogo.js...');
const cardsJS = `// AUTO-GERADO — não edite manualmente
// Edite onibus.js e rode: node gerar-paginas.js
const catalogoData = ${JSON.stringify(ativos, null, 2)};
`;
fs.writeFileSync(CATALOGO_JS, cardsJS, 'utf-8');
console.log('  ✓ assets/js/catalogo.js atualizado.');

console.log('\n✅ Tudo gerado! Próximo passo: git add . && git commit -m "Atualiza catálogo" && git push\n');
