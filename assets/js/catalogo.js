// AUTO-GERADO pelo painel admin — não edite manualmente

(function() {
  const dados = [
  {
    "slug": "comil-invictus-dd-1800-mb-o500-rsd",
    "titulo": "Comil Invictus DD 1800 - MB O500 Rsd",
    "marca": "Comil",
    "chassi": "Mercedes-Benz O500 RSDD",
    "ano": 2019,
    "km": "1.200.000",
    "lugares": 43,
    "preco": "R$ 1.150.000",
    "categoria": "rodoviario",
    "destaque": true,
    "imagem": "assets/rodoviario/acz/A.png",
    "whatsapp": "Olá,%20tenho%20interesse%20no%20Ônibus%20Rodoviário%20Comil%20Invictus%20DD%201800%com%20valor%20de%20R$%201.150.00,00.%20Gostaria%20de%20mais%20informações."
  }
];
  window.__sobralbusCatalogo = dados;

  const SVG_CAL  = '<svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
  const SVG_KM   = '<svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>';
  const SVG_SEAT = '<svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>';

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
    grid.innerHTML = lista.length ? lista.map(buildCard).join('') : '<p style="grid-column:1/-1;text-align:center;padding:3rem;color:#64748b">Nenhum veículo encontrado.</p>';
    grid.querySelectorAll('.bus-card.reveal').forEach(el => revealObs.observe(el));
  }

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.08 });

  document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('bus-grid')) return;
    renderCards('todos');
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderCards(this.dataset.filter);
      });
    });
  });
})();
