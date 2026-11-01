# Dental Studio Template

Template de site institucional para clínicas odontológicas, feito com React, TypeScript e Vite. Inclui layout Bento, cards com glassmorphism, animações de tipografia e transições SVG controladas pela rolagem.

A versão atual está personalizada para a Dra. Isabella Ferro. O código original do projeto é disponibilizado sob a [licença MIT](LICENSE), com as exceções de componentes de terceiros e conteúdo descritas abaixo.

## Recursos

- Hero responsiva com fotografia, chamadas para avaliação e cards de serviços.
- Transição serpentina com GSAP e ScrollTrigger.
- Apresentação da profissional com cards empilhados e interação por arraste.
- Especialidades, experiência, FAQ com rotação 3D e galeria de resultados.
- Comparador antes/depois e carrossel de depoimentos.
- Rodapé expansível, links de WhatsApp, Instagram e localização.
- Imagens WebP, respeito a `prefers-reduced-motion` e navegação por teclado nos controles interativos.
- Sitemap, robots.txt, canonical, metadados sociais e dados estruturados de negócio local.

## Tecnologias

React 19, TypeScript, Vite 8, GSAP, Three.js e Lucide. As versões instaladas estão no `package-lock.json`.

## Executar localmente

Use Node.js 22 LTS e npm.

```sh
npm ci
npm run dev
```

O terminal informa a URL local disponível.

```sh
npm run build    # gera a versão de produção em dist/
npm run preview  # serve o build localmente
npm run lint     # verifica o código com Oxlint
npm run seo      # regenera sitemap, robots.txt e metadados
```

## Personalizar

| Conteúdo | Arquivo ou diretório |
| --- | --- |
| Domínio, título, descrição e dados estruturados da clínica | `config/site.json` |
| WhatsApp, Instagram, endereço, navegação e perguntas frequentes | `src/data.ts` |
| Fotos, logotipo e favicon | `public/` e `public/img/` |
| Estilos gerais e superfícies de vidro | `src/index.css` e `src/GlassSurfaces.css` |
| Seções da página | `src/components/` |
| Metadados, sitemap e robots.txt | `scripts/generate-seo.mjs` |

Mantenha telefone, endereço e identidade consistentes em `config/site.json`, `src/data.ts` e no conteúdo das seções. O bloco SEO de `index.html` é gerado automaticamente; altere a configuração em vez desse bloco.

## Publicar

O workflow em `.github/workflows/deploy.yml` publica a branch `main` no GitHub Pages. O endereço padrão deste repositório usa `/drisabelle/`.

Para hospedar na raiz de um domínio próprio:

```sh
SITE_URL=https://seu-dominio.com.br/ BASE_PATH=/ npm run build
```

No GitHub Actions, as variáveis de repositório `SITE_URL` e `BASE_PATH` podem substituir a configuração padrão. Configure também o domínio, o DNS e o HTTPS no provedor escolhido.

Veja [SEO_LANCAMENTO.md](SEO_LANCAMENTO.md) para a configuração do domínio, a limitação do robots.txt em subdiretórios e os passos de ativação no Search Console.

## Licença e créditos

A [licença MIT](LICENSE) cobre o código original disponibilizado pelo titular deste repositório. Preserve o aviso de copyright ao reutilizá-lo.

Componentes incorporados e dependências mantêm suas licenças próprias. O Depth Carousel, adaptado do React Bits, usa [MIT + Commons Clause](src/components/DepthCarousel.LICENSE), que contém condições adicionais para redistribuição e venda de componentes. Portanto, o pacote completo não deve ser apresentado como integralmente MIT. Consulte [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Fotografias, logotipos, marcas, depoimentos e casos clínicos não estão incluídos na concessão MIT. Para adaptar o template a outra clínica, substitua esses materiais por conteúdo com autorização de uso.
