#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const page = await readFile('public/admin/chapters/direct.html', 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Import confirmation audit failed: ${message}`); };

assert(page.includes('Accepted — import queued ✓'), 'queued button confirmation is missing');
assert(page.includes('Accepted: Chapter ${payload.chapter} was queued'), 'inline queued result is missing');
assert(page.includes('Open GitHub import job'), 'GitHub Actions link is missing');
assert(page.includes('Import was not accepted'), 'inline failure state is missing');
assert(page.includes("document.querySelectorAll('.page-choice input[type=checkbox], #reviewed, #replace')"), 'submitted controls are not locked after acceptance');
assert(!page.includes("showStatus(`Chapter ${payload.chapter} import was queued with ${payload.pageCount} selected pictures.\\nGitHub is downloading"), 'old off-screen-only success message is still present');

const submitStart = page.indexOf("const payload=await api('/api/admin/chapter/import'");
const submitEnd = page.indexOf('} catch(error)', submitStart);
const successBlock = submitStart >= 0 && submitEnd > submitStart ? page.slice(submitStart, submitEnd) : '';
assert(successBlock && !successBlock.includes("$('reviewed').checked=false"), 'successful submission must not silently uncheck the review confirmation');

console.log('Import submit confirmation audit passed.');
