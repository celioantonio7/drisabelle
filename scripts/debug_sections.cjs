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

server.listen(4574, async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
  
  await page.goto('http://localhost:4574');
  await page.evaluate(() => {
    const s = document.getElementById('sobre');
    if (s) s.scrollIntoView();
  });
  await page.waitForTimeout(1000);
  
  const el = await page.locator('#sobre').first();
  await el.screenshot({ path: path.resolve(__dirname, '../public/img/actual_sobre_view.png') });
  console.log('Saved actual_sobre_view.png');

  const elRes = await page.locator('#resultados').first();
  await elRes.screenshot({ path: path.resolve(__dirname, '../public/img/actual_resultados_view.png') });
  console.log('Saved actual_resultados_view.png');

  const elHero = await page.locator('#inicio').first();
  await elHero.screenshot({ path: path.resolve(__dirname, '../public/img/actual_hero_view.png') });
  console.log('Saved actual_hero_view.png');

  await browser.close();
  server.close();
  process.exit(0);
});

