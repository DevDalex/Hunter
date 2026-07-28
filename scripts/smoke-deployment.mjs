const deploymentUrl = process.argv[2] || process.env.DEPLOYMENT_URL;

if (!deploymentUrl) {
  throw new Error('Usage: node scripts/smoke-deployment.mjs <deployment-url>');
}

const baseUrl = new URL(deploymentUrl);
const timeoutMs = 20_000;

/** @param {string} pathname */
async function request(pathname) {
  const url = new URL(pathname, baseUrl);
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
    headers: { 'user-agent': 'hunter-archive-release-smoke/1.0' },
  });
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status} ${response.statusText}`);
  }
  return response;
}

const shellResponse = await request('/');
const shell = await shellResponse.text();
if (!shell.includes('id="root"') || !shell.includes('<script')) {
  throw new Error('Deployment root did not contain the expected application shell.');
}

const buildInfoResponse = await request('/build-info.json');
const buildInfo = await buildInfoResponse.json();
if (buildInfo.app !== 'Hunter × Hunter Archive' || !buildInfo.commit) {
  throw new Error('Deployment build-info.json is missing the expected application identity.');
}

const mediaResponse = await request('/media/generated/chimera-ant/kite-phase.avif');
const mediaType = mediaResponse.headers.get('content-type') || '';
if (!mediaType.includes('image/avif')) {
  throw new Error(`Generated media returned unexpected content type: ${mediaType || 'missing'}`);
}
const mediaBytes = new Uint8Array(await mediaResponse.arrayBuffer());
if (mediaBytes.byteLength < 1_000) {
  throw new Error(`Generated media response is unexpectedly small: ${mediaBytes.byteLength} bytes.`);
}

console.log(JSON.stringify({
  deployment: baseUrl.origin,
  commit: buildInfo.commit,
  branch: buildInfo.branch,
  builtAt: buildInfo.builtAt,
  generatedMediaBytes: mediaBytes.byteLength,
}, null, 2));
