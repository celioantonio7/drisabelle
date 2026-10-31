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

server.listen(4572, async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
  
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));
  
  await page.goto('http://localhost:4572');
  await page.waitForTimeout(1000);
  
  // Find canvas and move mouse over it
  const canvas = await page.locator('#sobre canvas').first();
  const box = await canvas.boundingBox();
  console.log('Canvas bounding box:', box);
  if (box) {
    await page.mouse.move(box.x + 50, box.y + 50);
    await page.mouse.move(box.x + 150, box.y + 150, { steps: 15 });
    await page.mouse.move(box.x + 250, box.y + 100, { steps: 15 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.resolve(__dirname, 'test_fluid_hover.png') });
    console.log('Saved test_fluid_hover.png');
  }

  await browser.close();
  server.close();
  process.exit(0);
});

