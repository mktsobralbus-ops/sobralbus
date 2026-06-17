// ═══════════════════════════════════════════════════
//  SOBRALBUS — BANCO DE DADOS DOS VEÍCULOS
//  Edite este arquivo para adicionar/remover veículos
//  Execute: node gerar-paginas.js após cada alteração
// ═══════════════════════════════════════════════════

const catalogo = [
    {
    slug:       "marcopolo-paradiso-new-g7",
    titulo:     "Marcopolo Paradiso New G7 1800 DD - MB O500 RSD",
    marca:      "Marcopolo",
    chassi:     "Mercedes-Benz O500 RSD",
    ano:        2020,
    km:         "989.000",
    lugares:    60,
    preco:      "R$ 1.350.000",
    precoNum:   1350000,
    categoria:  "rodoviario",
    destaque:   true,
    ativo:      true,
    imagem:     "../assets/rodoviario/fzj/A.png",
    ogImagem:   "https://sobralbus.com.br/assets/rodoviario/fzj/A.png",
    descricao:  "O Marcopolo Paradiso New G7 1800 DD 2019/2020, sobre chassi Mercedes-Benz O500 RSDD, oferece conforto, desempenho e excelente estado de conservação. Conta com 12 poltronas leito total no piso inferior e 48 semi leito no superior, além de ar-condicionado Spheros/Valeo, geladeiras e carregadores USB/USB-C em todas as poltronas. Possui manutenção em dia, pneus dianteiros novos, rodas de alumínio e pintura nova na cor laranja. Seu conjunto garante conforto aos passageiros e eficiência operacional. É ideal para turismo, fretamento executivo e viagens rodoviárias de média e longa distância.",
    specs: [
      { key: "Carroceria", val: "Marcopolo Paradiso New G7" },
      { key: "Chassi", val: "Mercedes-Benz O500 RSD" },
      { key: "Ano", val: "2020" },
      { key: "Quilometragem", val: "989.000" },
      { key: "Lugares", val: "60 (12 no piso inferior e 48 no piso superior)" },
      { key: "Combustível", val: "Diesel" },
      { key: "Câmbio", val: "Mecânico" },
      { key: "Tipo", val: "Rodoviário" },
      { key: "Estado", val: "Sobral — CE" },
      { key: "Documentação", val: "Em dia" },
      { key: "Banheiro", val: "Sim" },
      { key: "Geladeira", val: "Sim (nos dois pisos)" },
      { key: "Carregador USB", val: "Sim (e tipo C)" },
      { key: "Ar-Condicionado", val: "Sim (Spheros/Valeo)" },
    ],
    badges:     ["Destaque", "Rodoviário"],
    imagens:    [
    "../assets/rodoviario/fzj/A.png",
    "../assets/rodoviario/fzj/B.png",
    "../assets/rodoviario/fzj/C.png",
    "../assets/rodoviario/fzj/D.png",
    "../assets/rodoviario/fzj/E.png",
    "../assets/rodoviario/fzj/F.png",
    "../assets/rodoviario/fzj/G.png",
    "../assets/rodoviario/fzj/H.png",
    "../assets/rodoviario/fzj/I.png",
    "../assets/rodoviario/fzj/J.png",
    "../assets/rodoviario/fzj/K.png",
    "../assets/rodoviario/fzj/L.png",
    "../assets/rodoviario/fzj/M.png",
    "../assets/rodoviario/fzj/N.png",
    "../assets/rodoviario/fzj/O.png",
    "../assets/rodoviario/fzj/P.png",
    "../assets/rodoviario/fzj/Q.png",
    "../assets/rodoviario/fzj/R.png",
    "../assets/rodoviario/fzj/S.png",
    "../assets/rodoviario/fzj/T.png"
    ],
    whatsapp:   "Olá,%20tenho%20interesse%20no%20ônibus%20Rodoviário%20Marcopolo%20Paradiso%20New%20G7%201800%20DD.%20Gostaria%20de%20mais%20informações.",
  },
];

module.exports = { catalogo };
