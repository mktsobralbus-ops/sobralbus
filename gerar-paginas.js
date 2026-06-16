// ═══════════════════════════════════════════════════
//  SOBRALBUS — GERADOR DE PÁGINAS
//  Uso: node gerar-paginas.js
//  Gera automaticamente o HTML de cada veículo
// ═══════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const { catalogo } = require('./onibus.js');

// Lê o template base
const TEMPLATE_PATH = path.join(__dirname, 'MODELO-pagina-produto.html');
const OUTPUT_DIR    = path.join(__dirname, 'pages');

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('❌ Template não encontrado: MODELO-pagina-produto.html');
  process.exit(1);
}
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// ── Gerar páginas individuais ──────────────────────
let gerados = 0;
let ignorados = 0;

catalogo.forEach(v => {
  if (!v.ativo) { ignorados++; return; }

  // Monta a ficha técnica
  const specsHTML = v.specs.map(s => `
            <div class="specs-row">
              <span class="spec-key">${s.key}</span>
              <span class="spec-val">${s.val}</span>
            </div>`).join('');

  // Monta os badges
  const badgesHTML = v.badges.map((b, i) => {
    const cls = i === 0 ? 'badge-green' : 'badge-blue';
    return `<span class="badge ${cls}">${b}</span>`;
  }).join('\n            ');

  // Monta o array de imagens para o JS
  const imgsJS = v.imagens.map(img => `    "${img}"`).join(',\n');

  // Monta o Schema.org specs
  const schemaSpecs = v.specs.map(s =>
    `      {"@type":"PropertyValue","name":"${s.key}","value":"${s.val}"}`
  ).join(',\n');

  // Breadcrumb span
  const breadcrumb = v.titulo;

  // Build page
  let pagina = template
    // SEO
    .replace(/MODELO CHASSI ANO \| R\$ 000\.000 \| 00 Lugares \| Sobralbus/g,
      `${v.titulo} ${v.ano} | ${v.preco} | ${v.lugares} Lugares | Sobralbus`)
    .replace(/MODELO com chassi CHASSI, ano ANO, 00 lugares\. DIFERENCIAIS\. À venda por R\$ 000\.000\./g,
      `${v.titulo} com chassi ${v.chassi}, ano ${v.ano}, ${v.lugares} lugares. À venda por ${v.preco}. Financiamento e troca aceita.`)
    .replace(/MODELO à venda, CHASSI seminovo, ônibus ANO nordeste, comprar ônibus Sobralbus/g,
      `${v.titulo} à venda, ${v.chassi} seminovo, ônibus ${v.ano} nordeste, comprar ônibus Sobralbus`)
    .replace(/https:\/\/sobralbus\.com\.br\/pages\/SLUG\.html/g,
      `https://sobralbus.com.br/pages/${v.slug}.html`)
    .replace(/MODELO CHASSI ANO — R\$ 000\.000 \| Sobralbus/g,
      `${v.titulo} ${v.ano} — ${v.preco} | Sobralbus`)
    .replace(/MODELO à venda\. CHASSI, ANO, 00 lugares\. Financiamento e troca aceita\./g,
      `${v.titulo} à venda. ${v.chassi}, ${v.ano}, ${v.lugares} lugares. Financiamento e troca aceita.`)
    .replace(/https:\/\/sobralbus\.com\.br\/assets\/CATEGORIA\/PASTA\/A\.png/g, v.ogImagem)
    .replace(/MODELO CHASSI ANO — Sobralbus/g, `${v.titulo} ${v.ano} — Sobralbus`)
    .replace(/content="000000">/g, `content="${v.precoNum}">`)
    .replace(/content="MODELO CHASSI ANO — R\$ 000\.000">/g,
      `content="${v.titulo} ${v.ano} — ${v.preco}">`)
    .replace(/content="MODELO à venda\. 00 lugares, CHASSI, ANO\. Sobralbus\.">/g,
      `content="${v.titulo} à venda. ${v.lugares} lugares, ${v.chassi}, ${v.ano}. Sobralbus.">`)
    // Schema.org
    .replace(/"name": "MODELO — CHASSI ANO",/g, `"name": "${v.titulo} ${v.ano}",`)
    .replace(/"description": "DESCRIÇÃO PARA O GOOGLE\.",/g,
      `"description": "${v.descricao}",`)
    .replace(/"name":"MARCA"/g, `"name":"${v.marca}"`)
    .replace(/"name":"FABRICANTE_CHASSI"/g, `"name":"${v.chassi.split(' ')[0]}"`)
    .replace(/"model": "MODELO",/g, `"model": "${v.titulo}",`)
    .replace(/"vehicleModelDate": "ANO",/g, `"vehicleModelDate": "${v.ano}",`)
    .replace(/"seatingCapacity": 0,/g, `"seatingCapacity": ${v.lugares},`)
    .replace(/"price": "000000",/g, `"price": "${v.precoNum}",`)
    .replace(/\{"@type":"PropertyValue","name":"CARROCERIA","value":"CARROCERIA"\},[\s\S]*?\{"@type":"PropertyValue","name":"Troca","value":"Aceita"\}/,
      schemaSpecs + ',\n      {"@type":"PropertyValue","name":"Financiamento","value":"Disponível"},\n      {"@type":"PropertyValue","name":"Troca","value":"Aceita"}')
    .replace(/"name":"MODELO CHASSI","item":"https:\/\/sobralbus\.com\.br\/pages\/SLUG\.html"/g,
      `"name":"${v.titulo}","item":"https://sobralbus.com.br/pages/${v.slug}.html"`)
    // HTML badges
    .replace(/<!-- ✏️ badges.*?-->\n            <span class="badge badge-green">BADGE_1<\/span>\n            <span class="badge badge-blue">BADGE_2<\/span>/,
      `<!-- badges -->\n            ${badgesHTML}`)
    // Imagem principal
    .replace(/<!-- ✏️ src = primeira imagem da pasta -->\n          <img id="mainImg" src="\.\.\/assets\/CATEGORIA\/PASTA\/A\.png" alt="MODELO CHASSI ANO — Sobralbus"/,
      `<img id="mainImg" src="${v.imagens[0]}" alt="${v.titulo} ${v.ano} — Sobralbus"`)
    // Título e marca
    .replace(/<!-- ✏️ -->\n          <h1 class="bus-title">MODELO — CHASSI<\/h1>/,
      `<h1 class="bus-title">${v.titulo}</h1>`)
    .replace(/<!-- ✏️ -->\n          <p class="bus-brand">Marca: MARCA &nbsp;·&nbsp; Chassi: CHASSI<\/p>/,
      `<p class="bus-brand">Marca: ${v.marca} &nbsp;·&nbsp; Chassi: ${v.chassi}</p>`)
    // Quick specs
    .replace(/<strong>ANO<\/strong>/, `<strong>${v.ano}</strong>`)
    .replace(/<strong>000\.000 km<\/strong>/, `<strong>${v.km} km</strong>`)
    .replace(/<strong>00 lugares<\/strong>/, `<strong>${v.lugares} lugares</strong>`)
    // Descrição
    .replace(/<!-- ✏️ Descrição detalhada do veículo -->\n            <p class="desc-text">DESCRIÇÃO DETALHADA DO VEÍCULO\. Fale sobre diferenciais, estado de conservação, equipamentos e uso ideal\.<\/p>/,
      `<p class="desc-text">${v.descricao}</p>`)
    // Preço
    .replace(/<!-- ✏️ -->\n            <div class="price-value">R\$ 000\.000<\/div>/,
      `<div class="price-value">${v.preco}</div>`)
    // WhatsApp
    .replace(/Olá,%20tenho%20interesse%20no%20MODELO/g, v.whatsapp)
    // Ficha técnica
    .replace(/<!-- ✏️ Preencha as linhas abaixo -->[\s\S]*?<!-- ✏️ Adicione ou remova linhas conforme necessário -->/,
      `<!-- specs -->${specsHTML}`)
    // Breadcrumb
    .replace(/<!-- ✏️ Nome do veículo -->\n      MODELO — CHASSI/, breadcrumb)
    // JS images array
    .replace(/\/\/ ✏️ Substitua pelos caminhos reais das imagens\n    "\.\.\/assets\/CATEGORIA\/PASTA\/A\.png",\n    "\.\.\/assets\/CATEGORIA\/PASTA\/B\.png",\n    \/\/ adicione mais conforme necessário/,
      `// imagens\n${imgsJS}`);

  const outPath = path.join(OUTPUT_DIR, `${v.slug}.html`);
  fs.writeFileSync(outPath, pagina, 'utf-8');
  console.log(`  ✓ ${v.slug}.html`);
  gerados++;
});

console.log(`\n✅ ${gerados} página(s) gerada(s). ${ignorados} ignorada(s) (ativo: false).`);

// ── Gerar cards JS para o index ───────────────────
const ativos = catalogo.filter(v => v.ativo);

const cardsJS = `// AUTO-GERADO por gerar-paginas.js — não edite manualmente
// Edite onibus.js e rode: node gerar-paginas.js

const catalogoData = ${JSON.stringify(ativos, null, 2)};

function gerarCards(lista) {
  return lista.map(v => \`
    <div class="bus-card reveal" data-category="\${v.categoria}">
      <div class="card-img-wrap">
        <img src="\${v.imagem.replace('../', '')}" alt="\${v.titulo}" loading="lazy">
        \${v.destaque ? '<span class="badge-destaque">Destaque</span>' : ''}
        <span class="badge-cat">\${v.categoria === 'rodoviario' ? 'Rodoviário' : v.categoria === 'urbano' ? 'Urbano' : 'Micro'}</span>
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
  const lista = categoria === 'todos' ? catalogoData : catalogoData.filter(v => v.categoria === categoria);
  document.getElementById('catalogo-grid').innerHTML = gerarCards(lista);
  // re-observar reveal
  document.querySelectorAll('.bus-card.reveal').forEach(el => observer.observe(el));
}

// IntersectionObserver para reveal nos cards
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  filtrarCards('todos');
  // Botões de filtro
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filtrarCards(btn.dataset.filter);
    });
  });
});
`;

fs.writeFileSync(path.join(__dirname, 'assets/js/catalogo.js'), cardsJS, 'utf-8');
console.log('✅ assets/js/catalogo.js gerado.');
