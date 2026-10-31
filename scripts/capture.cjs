const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const distDir = path.resolve(__dirname, '../dist');
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
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }
  
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(4569, async () => {
  console.log('Static server listening on 4569');
  
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  
  // 1. Desktop Hero (1672 x 941)
  {
    const page = await browser.newPage({ viewport: { width: 1672, height: 941 } });
    await page.goto('http://localhost:4569');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.resolve(__dirname, 'current_hero_1672.png') });
  }

  // 2. Desktop Especialidades (1536 x 1024)
  {
    const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
    await page.goto('http://localhost:4569');
    await page.evaluate(() => {
      const el = document.getElementById('especialidades');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.resolve(__dirname, 'current_spec_1536.png') });
  }

  // 3. Desktop Sobre (Lando Norris Fluid Reveal)
  {
    const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
    await page.goto('http://localhost:4569');
    await page.evaluate(() => {
      const el = document.getElementById('sobre');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.resolve(__dirname, 'current_sobre_1536.png') });
  }

  // 4. Desktop Resultados (3D Wobble Spiral + Hexagon Honeycomb)
  {
    const page = await browser.newPage({ viewport: { width: 1672, height: 1100 } });
    await page.goto('http://localhost:4569');
    await page.evaluate(() => {
      const el = document.getElementById('resultados');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.resolve(__dirname, 'current_resultados_1672.png') });
  }

  // 5. Desktop Footer (Monumental Brand Typography & Surge)
  {
    const page = await browser.newPage({ viewport: { width: 1672, height: 941 } });
    await page.goto('http://localhost:4569');
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.resolve(__dirname, 'current_footer_1672.png') });
  }

  // 6. Mobile View (390 x 844) - Hero
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('http://localhost:4569');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.resolve(__dirname, 'current_mobile_hero.png') });
  }

  // 7. Mobile View - Resultados
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('http://localhost:4569');
    await page.evaluate(() => {
      const el = document.getElementById('resultados');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.resolve(__dirname, 'current_mobile_resultados.png') });
  }

  await browser.close();
  server.close();
  console.log('All screenshots captured successfully!');
  process.exit(0);
});
