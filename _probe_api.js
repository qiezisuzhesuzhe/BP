const crypto = require('crypto');
const { execFile } = require('child_process');
const appKey = 'JgA5IzxI';
const appSecret = '11dc6d9857597cf3cf613348acf1fb5c1a9bc717';
const deviceImei = '867561088869642';

const probes = [
  {path: '/api/v1/dev/getRealTimeData', body: {deviceImei}},
  {path: '/api/v1/dev/getLatestData', body: {deviceImei}},
  {path: '/api/v1/devData/get', body: {deviceImei}},
  {path: '/api/v1/data/get', body: {deviceImei}},
  {path: '/api/v1/dev/getData', body: {deviceImei}},
  {path: '/api/v1/device/getRealTimeData', body: {deviceImei}},
  {path: '/api/v1/dev/event', body: {deviceImei, pageSize: 5}},
  {path: '/api/v1/event/list', body: {deviceImei, pageSize: 5}},
  {path: '/api/v1/dev/getEvent', body: {deviceImei, pageSize: 5}},
  {path: '/api/v1/dev/snapshot', body: {deviceImei}},
  {path: '/api/v1/dev/data', body: {deviceImei}},
  {path: '/api/v1/attribute/getList', body: {deviceModelName: 'SM-C03'}},
  {path: '/api/v1/dev/model', body: {}}
];

async function probeOne(p) {
  const path = p.path;
  const ts = String(Date.now());
  const sig = crypto.createHash('md5').update(path + ts + appSecret).digest('hex');
  const body = JSON.stringify(p.body);
  const url = 'https://webapi.nbiotyun.com' + path;
  return new Promise(resolve => {
    const args = ['-s', '--max-time', '15', '-X', 'POST', url, '-H', 'Content-Type:application/json;charset=UTF-8', '-H', 'appKey:' + appKey, '-H', 'timestamp:' + ts, '-H', 'signature:' + sig, '-d', body];
    execFile('curl', args, { maxBuffer: 4 * 1024 * 1024 }, (err, stdout) => {
      if (err) return resolve({path, err: err.message});
      let d = null;
      try { d = JSON.parse(stdout); } catch (e) {}
      resolve({path, code: d && d.code, message: d && d.message, dataKeys: d && d.data && typeof d.data === 'object' ? Object.keys(d.data).slice(0, 20) : null, raw: (stdout||'').slice(0, 250)});
    });
  });
}

(async () => {
  for (const p of probes) {
    const r = await probeOne(p);
    const ok = r.code === 'OK' || r.code === 0 || (r.message && !/not found|lack|invalid|no such/i.test(r.message));
    const tag = ok ? '[OK]  ' : '[FAIL]';
    console.log(tag, r.path, "code=", r.code, "msg=", (r.message||"").slice(0, 100));
    if (r.dataKeys) console.log('      keys:', r.dataKeys.join(', '));
    if (ok && r.raw && r.raw.includes('attrList')) console.log('      raw:', r.raw.slice(0, 400));
  }
})();
