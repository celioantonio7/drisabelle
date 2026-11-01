# Publicação e divulgação da clínica

A configuração atual usa `https://celioantonio7.github.io/drisabelle/`, endereço confirmado no GitHub Pages. Os dados públicos usados nos metadados estão em `config/site.json`. Não foram adicionados preços, horários, notas agregadas ou credenciais que não constam no projeto.

## Arquivos e metadados

- `public/sitemap.xml`: endereço canônico da página única. Âncoras como `#sobre` são seções da mesma página, sem URLs adicionais no sitemap.
- `public/robots.txt`: permite rastreamento e informa o sitemap.
- `index.html`: título com Taubaté, descrição, canonical, Open Graph, Twitter Card e JSON-LD com `Dentist`, `WebSite` e `WebPage`.
- A configuração é regenerada por `npm run seo`, automaticamente antes de `npm run dev` e `npm run build`. O bloco SEO do HTML deve ser alterado pela configuração, não editado manualmente.
- As informações principais e o contato também ficam disponíveis no HTML sem JavaScript. Não foram instalados pixels ou ferramentas de rastreamento.

## Domínio definitivo

1. Confirmar e registrar o domínio da clínica.
2. Configurar o domínio e HTTPS no GitHub Pages, seguindo a configuração DNS exibida pelo GitHub.
3. Alterar `url` em `config/site.json` para `https://DOMINIO-DA-CLINICA/`.
4. Em GitHub > Settings > Secrets and variables > Actions > Variables, configurar `BASE_PATH` como `/` para um domínio na raiz. `SITE_URL` é uma substituição opcional da URL do JSON; deixar vazia para usar o arquivo.
5. Executar `BASE_PATH=/ npm run build` e publicar. Confirmar que canonical, sitemap e imagens apontam para o domínio final.

Para build com substituição temporária, usar `SITE_URL=https://DOMINIO-DA-CLINICA/ BASE_PATH=/ npm run build`. O comando regenera os arquivos locais; executar `npm run seo` sem a variável restaura a configuração do JSON.

### Limitação do robots.txt no endereço atual

Google procura robots.txt na raiz da origem, em `https://celioantonio7.github.io/robots.txt`. O arquivo publicado em `/drisabelle/robots.txt` não controla o rastreamento do projeto. Para usar as diretivas enquanto estiver nesse endereço, publicar o arquivo na raiz do site de usuário do GitHub Pages. Isso depende do repositório separado `celioantonio7.github.io` e não foi alterado por este trabalho. O sitemap do projeto pode ser enviado diretamente ao Search Console. No domínio próprio na raiz, os arquivos deste projeto já ficam no local correto.

## Ativação de busca e divulgação

1. Verificar a propriedade do domínio no Google Search Console. A verificação exige acesso à conta Google e/ou DNS do proprietário.
2. Enviar `sitemap.xml` e solicitar a inspeção do endereço principal. No endereço atual, usar `https://celioantonio7.github.io/drisabelle/sitemap.xml`.
3. Testar o domínio publicado no Rich Results Test do Google e inspecionar o HTML renderizado no Search Console.
4. Vincular o endereço definitivo ao Perfil da Empresa no Google e ao Instagram já usados pela clínica. Confirmar nome, endereço e telefone antes de atualizar esses perfis.
5. Conferir a prévia ao compartilhar o link nos canais comerciais e testar os botões de WhatsApp e localização em um celular real.
6. Se houver campanhas, definir a conta de anúncios e os eventos de conversão desejados. Se forem adicionados formulários, analytics ou pixels, documentar o tratamento de dados e preparar a política de privacidade correspondente antes da ativação.
7. Confirmar com a responsável os direitos de uso das fotos, relatos e casos clínicos antes de campanhas ou de reutilizar o projeto para outros clientes.

O sitemap facilita a descoberta das URLs; ele não garante indexação ou posição nas buscas. Os cadastros externos, a verificação do domínio e as campanhas dependem das contas da clínica e ainda não foram executados.

Referências: [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt), [dados de negócios locais](https://developers.google.com/search/docs/appearance/structured-data/local-business).
