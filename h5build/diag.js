const { JSDOM, VirtualConsole } = require('jsdom');
const fs=require('fs'), path=require('path');
const D='/workspace/h5build/dist/build/h5';
const vc=new VirtualConsole();
vc.on('jsdomError',e=>console.log('[jsdomError]',e.message.slice(0,400)));
vc.on('error',(...a)=>console.log('[err]',String(a[0]).slice(0,300)));
vc.on('warn',(...a)=>console.log('[warn]',String(a[0]).slice(0,200)));
vc.on('log',(...a)=>console.log('[log]',String(a[0]).slice(0,200)));

const html=fs.readFileSync(path.join(D,'index.html'),'utf8').replace(/<script[^>]*><\/script>/g,'');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'http://localhost/',virtualConsole:vc});
const w=dom.window;
w.matchMedia=q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){},onchange:null,dispatchEvent(){return false}});
if(!w.requestAnimationFrame) w.requestAnimationFrame=cb=>setTimeout(()=>cb(Date.now()),16);
console.log('注入 chunk-vendors...');
w.eval(fs.readFileSync(path.join(D,'static/js/chunk-vendors.54dda971.js'),'utf8'));
console.log('  Vue?',typeof w.Vue,'| webpackJsonp?',typeof w.webpackJsonp);
console.log('注入 index...');
w.eval(fs.readFileSync(path.join(D,'static/js/index.86017b13.js'),'utf8'));
console.log('  uni?',typeof w.uni);
setTimeout(()=>{
  const app=w.document.querySelector('#app');
  console.log('#app children:',app?app.children.length:'none');
  const t=(w.document.body.textContent||'').replace(/\s+/g,' ').trim();
  console.log('body text len:',t.length);
  console.log('preview:',t.slice(0,600));
},6000);
