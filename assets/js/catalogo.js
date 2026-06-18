// AUTO-GERADO por gerar-paginas.js — não edite manualmente
// Edite onibus.js e rode: node gerar-paginas.js

(function() {
  const dados = [
  {
    "slug": "marcopolo-paradiso-new-g7",
    "titulo": "Marcopolo Paradiso New G7 1800 DD - MB O500 RSD",
    "marca": "Marcopolo",
    "chassi": "Mercedes-Benz O500 RSD",
    "ano": 2020,
    "km": "989.000",
    "lugares": 60,
    "preco": "R$ 1.350.000",
    "categoria": "rodoviario",
    "destaque": true,
    "imagem": "assets/rodoviario/fzj/A.png",
    "whatsapp": "Olá,%20tenho%20interesse%20no%20ônibus%20Rodoviário%20Marcopolo%20Paradiso%20New%20G7%201800%20DD.%20Gostaria%20de%20mais%20informações."
  },
  {
    "slug": "comil-invictus-dd-mb-o500",
    "titulo": "Comil Invictus DD - MB O500 RSD",
    "marca": "Comil",
    "chassi": "Mercedes-Benz O500 RSD",
    "ano": 2019,
    "km": "1.200.000",
    "lugares": 43,
    "preco": "R$ 1.150.000",
    "categoria": "rodoviario",
    "destaque": true,
    "imagem": "assets/rodoviario/acz/A.png",
    "whatsapp": "Olá,%20tenho%20interesse%20no%20ônibus%20rodoviário%20Comil%20Invictus%20DDno%20valor%20de%20R$%201.150.000,00.%20Gostaria%20de%20mais%20informações."
  }
];

  const SVG_CAL  = '<svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
  const SVG_KM   = '<svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>';
  const SVG_SEAT = '<svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>';

  function buildCard(v) {
    const catName   = v.categoria === 'rodoviario' ? 'Rodoviário' : v.categoria === 'urbano' ? 'Urbano' : 'Micro';
    const destBadge = v.destaque ? '<span class="bus-badge badge-highlight">Destaque</span>' : '';
    return `
        <div class="bus-card reveal" data-type="${v.categoria}">
          <div class="bus-card-image">
            <img loading="lazy" decoding="async" src="${v.imagem}" alt="${v.titulo}" onerror="this.style.opacity='.2'">
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
