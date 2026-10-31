const http = require('http')
const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')

const distDir = path.resolve(__dirname, '../dist')
const OUT_DIR = '/home/celio/.gemini/antigravity/brain/363074a6-96c2-4b0c-9070-cb26fe4c151c'

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0])
  if (reqPath === '/') reqPath = '/index.html'
  const filePath = path.join(distDir, reqPath)

  if (!fs.existsSync(filePath)) {
    res.writeHead(404)
    res.end('Not Found')
    return
  }

  const ext = path.extname(filePath)
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' })
  fs.createReadStream(filePath).pipe(res)
})

server.listen(4575, async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    // ================= 1. DESKTOP (1672 x 941) =================
    const dPage = await browser.newPage({ viewport: { width: 1672, height: 941 } })
    await dPage.goto('http://localhost:4575', { waitUntil: 'networkidle' })

    // Capture Preloader while active (~3800ms in, fully written)
    await dPage.waitForTimeout(3800)
    await dPage.screenshot({ path: path.join(OUT_DIR, 'v_desk_00_preloader.jpg'), quality: 85 })

    // Wait for Preloader to finish fading out (> 5850ms total)
    await dPage.waitForTimeout(2300)

    // 01 Hero Desktop
    await dPage.screenshot({ path: path.join(OUT_DIR, 'v_desk_01_hero.jpg'), quality: 85 })

    // 02 Sobre Desktop (Default Adulta + Hover Criança)
    await dPage.evaluate(() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'instant', block: 'start' }))
    await dPage.waitForTimeout(500)
    await dPage.screenshot({ path: path.join(OUT_DIR, 'v_desk_02_sobre_default.jpg'), quality: 85 })

    // Move mouse across FluidRevealCanvas to reveal Criança
    const canvasBox = await dPage.locator('.fluid-reveal-canvas').boundingBox()
    if (canvasBox) {
      await dPage.mouse.move(canvasBox.x + canvasBox.width * 0.25, canvasBox.y + canvasBox.height * 0.35)
      for (let i = 0; i <= 14; i++) {
        await dPage.mouse.move(
          canvasBox.x + canvasBox.width * (0.25 + i * 0.035),
          canvasBox.y + canvasBox.height * (0.35 + (i % 2) * 0.18),
        )
        await dPage.waitForTimeout(20)
      }
      await dPage.screenshot({ path: path.join(OUT_DIR, 'v_desk_02_sobre_hover.jpg'), quality: 85 })
    }

    // 03 Especialidades Desktop
    await dPage.evaluate(() => document.getElementById('especialidades')?.scrollIntoView({ behavior: 'instant', block: 'start' }))
    await dPage.waitForTimeout(500)
    await dPage.screenshot({ path: path.join(OUT_DIR, 'v_desk_03_especialidades.jpg'), quality: 85 })

    // 04 Experiencia Desktop
    await dPage.evaluate(() => document.getElementById('experiencia')?.scrollIntoView({ behavior: 'instant', block: 'start' }))
    await dPage.waitForTimeout(500)
    await dPage.screenshot({ path: path.join(OUT_DIR, 'v_desk_04_experiencia.jpg'), quality: 85 })

    // 05 FAQ Desktop
    await dPage.evaluate(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'instant', block: 'start' }))
    await dPage.waitForTimeout(500)
    await dPage.screenshot({ path: path.join(OUT_DIR, 'v_desk_05_faq.jpg'), quality: 85 })

    // 06 Resultados Desktop (Spiral 3D + Colmeia)
    await dPage.evaluate(() => document.getElementById('resultados')?.scrollIntoView({ behavior: 'instant', block: 'start' }))
    await dPage.waitForTimeout(800)
    await dPage.screenshot({ path: path.join(OUT_DIR, 'v_desk_06_resultados.jpg'), quality: 85 })

    // Click first Colmeia hexagon to open Modal
    await dPage.locator('.colmeia-hex-wrapper').first().click()
    await dPage.waitForTimeout(350)
    await dPage.screenshot({ path: path.join(OUT_DIR, 'v_desk_06_modal.jpg'), quality: 85 })
    await dPage.locator('.case-modal-close').click()
    await dPage.waitForTimeout(250)

    // 07 Footer Desktop (Closed by default, then click MAIS ^ to Expand)
    await dPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await dPage.waitForTimeout(400)
    await dPage.screenshot({ path: path.join(OUT_DIR, 'v_desk_07_footer_closed.jpg'), quality: 85 })

    await dPage.locator('.footer-mais-toggle-btn').click()
    await dPage.waitForTimeout(550)
    await dPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await dPage.waitForTimeout(300)
    await dPage.screenshot({ path: path.join(OUT_DIR, 'v_desk_07_footer_expanded.jpg'), quality: 85 })

    // ================= 2. MOBILE (390 x 844) =================
    const mPage = await browser.newPage({ viewport: { width: 390, height: 844 } })
    await mPage.goto('http://localhost:4575', { waitUntil: 'networkidle' })
    await mPage.waitForTimeout(6000)

    // 01 Hero Mobile
    await mPage.screenshot({ path: path.join(OUT_DIR, 'v_mob_01_hero.jpg'), quality: 85 })

    // 02 Sobre Mobile
    await mPage.evaluate(() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'instant', block: 'start' }))
    await mPage.waitForTimeout(400)
    await mPage.screenshot({ path: path.join(OUT_DIR, 'v_mob_02_sobre.jpg'), quality: 85 })

    // 03 Especialidades Mobile
    await mPage.evaluate(() => document.getElementById('especialidades')?.scrollIntoView({ behavior: 'instant', block: 'start' }))
    await mPage.waitForTimeout(400)
    await mPage.screenshot({ path: path.join(OUT_DIR, 'v_mob_03_especialidades.jpg'), quality: 85 })

    // 04 Experiencia Mobile
    await mPage.evaluate(() => document.getElementById('experiencia')?.scrollIntoView({ behavior: 'instant', block: 'start' }))
    await mPage.waitForTimeout(400)
    await mPage.screenshot({ path: path.join(OUT_DIR, 'v_mob_04_experiencia.jpg'), quality: 85 })

    // 05 FAQ Mobile
    await mPage.evaluate(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'instant', block: 'start' }))
    await mPage.waitForTimeout(400)
    await mPage.screenshot({ path: path.join(OUT_DIR, 'v_mob_05_faq.jpg'), quality: 85 })

    // 06 Resultados Mobile
    await mPage.evaluate(() => document.getElementById('resultados')?.scrollIntoView({ behavior: 'instant', block: 'start' }))
    await mPage.waitForTimeout(600)
    await mPage.screenshot({ path: path.join(OUT_DIR, 'v_mob_06_resultados.jpg'), quality: 85 })

    // 07 Footer Mobile (Closed & Expanded)
    await mPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await mPage.waitForTimeout(400)
    await mPage.screenshot({ path: path.join(OUT_DIR, 'v_mob_07_footer_closed.jpg'), quality: 85 })

    await mPage.locator('.footer-mais-toggle-btn').click()
    await mPage.waitForTimeout(550)
    await mPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await mPage.waitForTimeout(300)
    await mPage.screenshot({ path: path.join(OUT_DIR, 'v_mob_07_footer_expanded.jpg'), quality: 85 })

    console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!')
  } finally {
    await browser.close()
    server.close()
    process.exit(0)
  }
})
