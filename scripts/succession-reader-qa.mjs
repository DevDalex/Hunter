import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.SUCCESSION_READER_QA_OUTPUT || '.succession-reader-qa');
const requestedExecutable = process.env.CHROMIUM_PATH || '';
const results = [];
const failures = [];
const mime = { '.css':'text/css; charset=utf-8','.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.json':'application/json; charset=utf-8' };

const firstAvailable = async (candidates) => { for (const candidate of candidates.filter(Boolean)) { try { await access(candidate); return candidate; } catch {} } return ''; };
const serve = async () => {
  await access(path.join(dist, 'index.html'));
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let filename = path.join(dist, pathname === '/' ? 'index.html' : pathname);
      if (!filename.startsWith(dist)) throw new Error('Invalid path');
      try { if ((await stat(filename)).isDirectory()) filename = path.join(dist, 'index.html'); } catch { filename = path.join(dist, 'index.html'); }
      response.setHeader('content-type', mime[path.extname(filename).toLowerCase()] || 'application/octet-stream');
      response.setHeader('cache-control', 'no-store');
      response.end(await readFile(filename));
    } catch (error) { response.statusCode = 500; response.end(error.message); }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return server;
};
const record = async (name, page, test) => {
  const runtimeErrors = []; page.on('pageerror', (error) => runtimeErrors.push(error.message));
  try { await test(); if (runtimeErrors.length) throw new Error(`Runtime errors: ${runtimeErrors.join(' | ')}`); results.push({ name, status:'passed' }); process.stdout.write(`✓ ${name}\n`); }
  catch (error) { const screenshot=path.join(output,`${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}.png`);await page.screenshot({path:screenshot,fullPage:true}).catch(()=>{});const failure={name,status:'failed',error:error.message,screenshot:path.relative(root,screenshot),runtimeErrors};failures.push(failure);results.push(failure);process.stdout.write(`✗ ${name} · ${error.message}\n`); }
};

await mkdir(output,{recursive:true});
const executablePath=await firstAvailable([requestedExecutable,chromium.executablePath(),'/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser']);
if(!executablePath)throw new Error('No Chromium executable is available.');
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu','--no-zygote']});
const server=await serve();const base=`http://127.0.0.1:${server.address().port}`;

try {
  const desktop=await browser.newPage({viewport:{width:1440,height:1000}});
  await record('Succession Chapter Bank reader route and ordered index',desktop,async()=>{
    await desktop.goto(`${base}/story/succession-contest/chapters?chapter=339&page=1&mode=continuous`,{waitUntil:'domcontentloaded',timeout:20_000});
    await desktop.waitForSelector('#arc-chapters .succession-reader__reader[data-reader-chapter="339"]',{timeout:15_000});
    if(await desktop.locator('.arc-page').count()!==1)throw new Error('Chapter Bank reader route is not rendered inside the Succession Story arc page');
    if(await desktop.locator('.arc-page__hero h1',{hasText:'Succession Contest'}).count()!==1)throw new Error('Succession Story hero is missing from the Chapter Bank route');
    if(await desktop.locator('main > .page-intro').count())throw new Error('Generic Succession workspace introduction leaked into the Story chapter route');
    if(await desktop.locator('#arc-chapters .succession-reader').count()!==1)throw new Error('Reader is not mounted in arc-chapters');

    const reader=desktop.locator('.succession-reader');const workspace=reader.locator('.succession-reader__reader');
    if(await reader.locator('.succession-reader__chapter-grid button').count()!==76)throw new Error('Reader does not expose Chapter Bank records 339–414 inclusively');
    const labels=await reader.locator('.succession-reader__chapter-grid button b').evaluateAll((nodes)=>nodes.map((node)=>Number(node.textContent)));
    if(labels[0]!==339||labels.at(-1)!==414)throw new Error(`Chapter Bank boundary drifted: ${labels[0]}–${labels.at(-1)}`);
    if(labels.some((value,index)=>index&&value!==labels[index-1]+1))throw new Error('Chapter Bank index is not sequential');
    if(await workspace.getAttribute('data-reader-chapter')!=='339')throw new Error('Direct route did not open Chapter 339');
    if(await workspace.getAttribute('data-reader-page-count')!=='0')throw new Error('Unapproved bank media was unexpectedly mounted');
    if(await reader.locator('.succession-reader__pages img').count())throw new Error('Reader rendered scans without stored bank media');
    if(!(await reader.locator('.succession-reader__empty').innerText()).includes('empty bank record'))throw new Error('Empty Chapter Bank boundary is not visible');

    await reader.getByRole('button',{name:/Next chapter/}).click();
    if(await workspace.getAttribute('data-reader-chapter')!=='340')throw new Error('Next chapter control did not open 340');
    if(!desktop.url().includes('/story/succession-contest/chapters')||!desktop.url().includes('chapter=340'))throw new Error('Chapter navigation left the Story route');
    await workspace.focus();await desktop.keyboard.press('PageDown');
    if(await workspace.getAttribute('data-reader-chapter')!=='341')throw new Error('PageDown did not move to Chapter 341');
    await desktop.keyboard.press('PageUp');
    if(await workspace.getAttribute('data-reader-chapter')!=='340')throw new Error('PageUp did not return to Chapter 340');

    await reader.locator('.succession-reader__search input').fill('414');
    if(await reader.locator('.succession-reader__chapter-grid button').count()!==1)throw new Error('Chapter Bank search did not isolate 414');
    await reader.getByRole('button',{name:/414/}).click();
    if(await workspace.getAttribute('data-reader-chapter')!=='414')throw new Error('Chapter directory did not open 414');
    if(!desktop.url().includes('chapter=414'))throw new Error('Chapter 414 Story route was not preserved');
  });
  await desktop.close();

  const mobile=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await record('Succession Chapter Bank reader mobile containment and reduced motion',mobile,async()=>{
    await mobile.goto(`${base}/story/succession-contest/chapters?chapter=414`,{waitUntil:'domcontentloaded',timeout:20_000});
    await mobile.waitForSelector('#arc-chapters .succession-reader__reader[data-reader-chapter="414"]',{timeout:15_000});
    const state=await mobile.evaluate(()=>{const reader=document.querySelector('.succession-reader');const workspace=document.querySelector('.succession-reader__reader');const chapterButton=document.querySelector('.succession-reader__chapter-grid button');return{overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth,readerWidth:reader?.getBoundingClientRect().width||0,workspaceWidth:workspace?.getBoundingClientRect().width||0,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,transition:chapterButton?getComputedStyle(chapterButton).transitionDuration:'',liveRegion:document.querySelector('.succession-reader__status')?.getAttribute('aria-live'),arcPage:Boolean(document.querySelector('.arc-page')),bankStatus:workspace?.getAttribute('data-bank-status')}});
    if(!state.arcPage)throw new Error('Mobile chapter route lost the Succession Story arc shell');
    if(state.overflow>1)throw new Error(`Reader overflowed mobile viewport by ${state.overflow}px`);
    if(state.readerWidth>390.5||state.workspaceWidth>390.5)throw new Error(`Reader panels exceed mobile width: ${JSON.stringify(state)}`);
    if(!state.reducedMotion)throw new Error('Reduced-motion emulation was not active');
    if(state.transition.split(',').map(Number.parseFloat).some((duration)=>duration>0.001))throw new Error(`Chapter button transition remains ${state.transition}`);
    if(state.liveRegion!=='polite')throw new Error('Reader status is not a polite live region');
    if(state.bankStatus!=='empty')throw new Error(`Empty Chapter 414 bank status changed to ${state.bankStatus}`);
  });
  await mobile.close();
} finally { await browser.close().catch(()=>{}); await new Promise((resolve)=>server.close(resolve)); }

const summary={generatedAt:new Date().toISOString(),checks:results.length,passed:results.length-failures.length,failed:failures.length};
await writeFile(path.join(output,'report.json'),`${JSON.stringify({summary,results},null,2)}\n`);await writeFile(path.join(output,'summary.json'),`${JSON.stringify(summary,null,2)}\n`);
console.log(`\nSuccession Chapter Bank reader QA: ${summary.passed}/${summary.checks} checks passed.`);if(failures.length)process.exitCode=1;
