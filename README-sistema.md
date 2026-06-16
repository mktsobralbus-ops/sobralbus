# Sobralbus — Sistema de Automação

## Estrutura de arquivos

```
sobralbus/
├── onibus.js              ← BANCO DE DADOS dos veículos (edite aqui)
├── gerar-paginas.js       ← Script gerador (rode com Node.js)
├── MODELO-pagina-produto.html  ← Template base das páginas
├── admin.html             ← Painel admin (RENOMEIE para algo discreto!)
├── assets/
│   └── js/
│       └── catalogo.js    ← Auto-gerado pelo script
└── pages/
    └── *.html             ← Auto-gerados pelo script
```

## Fluxo para adicionar um veículo

1. Coloque as fotos em `assets/CATEGORIA/PASTA/`
2. Abra o painel admin, preencha o formulário, gere o código
3. Cole o código no `onibus.js`
4. Rode: `node gerar-paginas.js`
5. Faça commit + push → Vercel publica automaticamente

## Painel Admin

Acesse via URL direta: `seusite.com/sb-ctrl-2024.html`
**RENOMEIE o arquivo admin.html antes de publicar!**

Credenciais padrão (troque no arquivo):
- admin / sb@2024!
- sobralbus / frota#953

## Segurança do painel

- Arquivo sem link em nenhuma página do site
- Renomeie para algo não óbvio
- Troque as senhas no código
- Opcional: bloqueie por IP no Vercel (vercel.json)
- Opcional: mova para Cloudflare Access (2FA gratuito)
