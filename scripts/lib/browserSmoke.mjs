import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const waitForPreview = async (url, processHandle) => {
  let lastError;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (processHandle.exitCode !== null) throw new Error(`preview server exited early with code ${processHandle.exitCode}`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = new Error(`preview returned HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw lastError || new Error('preview server did not become ready');
};

export const withPreviewPage = async ({ port = 4173, path = '/' } = {}, callback) => {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const server = spawn(npm, ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: process.cwd(), env: process.env, stdio: ['ignore', 'pipe', 'pipe'],
  });
  let serverOutput = '';
  server.stdout.on('data', (chunk) => { serverOutput += String(chunk); });
  server.stderr.on('data', (chunk) => { serverOutput += String(chunk); });
  const baseUrl = `http://127.0.0.1:${port}`;
  let browser;
  try {
    await waitForPreview(baseUrl, server);
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    const response = await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' });
    if (!response?.ok()) throw new Error(`page load failed with HTTP ${response?.status() ?? 'unknown'}`);
    await callback({ page, baseUrl });
    if (pageErrors.length) throw new Error(`browser page errors: ${pageErrors.join(' | ')}`);
  } catch (error) {
    if (serverOutput.trim()) console.error(serverOutput.trim());
    throw error;
  } finally {
    if (browser) await browser.close();
    if (server.exitCode === null) server.kill('SIGTERM');
  }
};
