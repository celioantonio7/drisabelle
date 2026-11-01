import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const site = JSON.parse(readFileSync(resolve(root, 'config/site.json'), 'utf8'))
const url = new URL(process.env.SITE_URL || site.url)
if (url.protocol !== 'https:' || url.search || url.hash || url.username || url.password) {
  throw new Error('SITE_URL deve ser uma URL HTTPS pública, sem parâmetros, fragmentos ou credenciais.')
}
url.pathname = `${url.pathname.replace(/\/+$/, '')}/`
const canonical = url.href
const absolute = path => new URL(path, canonical).href
const escape = text => String(text).replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'}[char]))
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Dentist', '@id': `${canonical}#clinica`,
      name: site.name, url: canonical, telephone: site.telephone,
      description: site.description,
      image: absolute(site.image), logo: absolute(site.logo),
      sameAs: [site.instagram],
      address: {
        '@type': 'PostalAddress', streetAddress: site.streetAddress,
        addressLocality: site.addressLocality, addressRegion: site.addressRegion,
        postalCode: site.postalCode, addressCountry: site.addressCountry,
      },
      areaServed: { '@type': 'City', name: site.addressLocality },
      hasMap: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${site.streetAddress}, ${site.addressLocality} - ${site.addressRegion}, ${site.postalCode}`),
    },
    {
      '@type': 'WebSite', '@id': `${canonical}#website`,
      url: canonical, name: site.name, inLanguage: 'pt-BR',
      publisher: { '@id': `${canonical}#clinica` },
    },
    {
      '@type': 'WebPage', '@id': `${canonical}#webpage`,
      url: canonical, name: site.title, description: site.description,
      inLanguage: 'pt-BR', isPartOf: { '@id': `${canonical}#website` },
      about: { '@id': `${canonical}#clinica` },
      primaryImageOfPage: { '@type': 'ImageObject', url: absolute(site.image), width: site.imageWidth, height: site.imageHeight },
    },
  ],
}
const tags = [
  `<title>${escape(site.title)}</title>`,
  `<meta name="description" content="${escape(site.description)}" />`,
  '<meta name="robots" content="index, follow, max-image-preview:large" />',
  `<link rel="canonical" href="${escape(canonical)}" />`,
  '<meta name="theme-color" content="#ffffff" />',
  '<meta property="og:type" content="website" />',
  '<meta property="og:locale" content="pt_BR" />',
  `<meta property="og:site_name" content="${escape(site.name)}" />`,
  `<meta property="og:title" content="${escape(site.title)}" />`,
  `<meta property="og:description" content="${escape(site.description)}" />`,
  `<meta property="og:url" content="${escape(canonical)}" />`,
  `<meta property="og:image" content="${escape(absolute(site.image))}" />`,
  '<meta property="og:image:type" content="image/webp" />',
  `<meta property="og:image:width" content="${site.imageWidth}" />`,
  `<meta property="og:image:height" content="${site.imageHeight}" />`,
  `<meta property="og:image:alt" content="${escape(site.name)}: odontologia estética em ${escape(site.addressLocality)}" />`,
  '<meta name="twitter:card" content="summary_large_image" />',
  `<meta name="twitter:title" content="${escape(site.title)}" />`,
  `<meta name="twitter:description" content="${escape(site.description)}" />`,
  `<meta name="twitter:image" content="${escape(absolute(site.image))}" />`,
  `<meta name="twitter:image:alt" content="${escape(site.name)}: odontologia estética em ${escape(site.addressLocality)}" />`,
  `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`,
].join('\n    ')
const indexPath = resolve(root, 'index.html')
const html = readFileSync(indexPath, 'utf8')
const block = `<!-- SEO:START (gerado por npm run seo) -->\n    ${tags}\n    <!-- SEO:END -->`
if (!html.includes('<!-- SEO:START')) throw new Error('Bloco SEO não encontrado em index.html')
writeFileSync(indexPath, html.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, block))
writeFileSync(resolve(root, 'public/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${escape(canonical)}</loc>\n  </url>\n</urlset>\n`)
writeFileSync(resolve(root, 'public/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${absolute('sitemap.xml')}\n`)
console.log(`SEO gerado para ${canonical}`)
