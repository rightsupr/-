const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const path = require('node:path');

const PORT = 4173;
const OUTPUT = path.join('docs', 'screenshots', 'calorielens-home.png');

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, attempts = 30) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) return;
    } catch (error) {
      // Server is still starting.
    }
    await wait(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function main() {
  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });

  const server = spawn('python3', ['-m', 'http.server', String(PORT)], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  try {
    await waitForServer(`http://127.0.0.1:${PORT}/`);
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: OUTPUT, fullPage: true });
    await browser.close();
    console.log(`Screenshot saved to ${OUTPUT}`);
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
