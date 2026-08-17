const { JSDOM, VirtualConsole } = require('jsdom');
const fs=require('fs'), path=require('path');
const D='/workspace/h5build/dist/build/h5';
const vc=new VirtualConsole();
['jsdomError','error','warn','log','info'].forEach(k=>vc.on(k,(...a)=>console.log('['+k+']',String(a[0]&&a[0].message||a[0]).slice(0,500))));
const html=fs.readFileSync(path.join(D,'index.html'),'utf8').replace(/<script[^>]*><\/script>/g,'');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'http://localhost/',virtualConsole:vc});
const w=dom.window;
w.matchMedia=q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){},onchange:null,dispatchEvent(){return false}});
w.requestAnimationFrame=w.requestAnimationFrame||(cb=>setTimeout(()=>cb(Date.now()),16));
w.addEventListener('error',e=>console.log('[window.onerror]',e.message));
try{ w.eval(fs.readFileSync(path.join(D,'static/js/chunk-vendors.54dda971.js'),'utf8')); }
catch(e){ console.log('[vendors THROW]',e.message.slice(0,400)); }
try{ w.eval(fs.readFileSync(path.join(D,'static/js/index.86017b13.js'),'utf8')); }
catch(e){ console.log('[index THROW]',e.constructor.name, e.message.slice(0,600)); console.log((e.stack||'').split('\n').slice(0,8).join('\n')); }
setTimeout(()=>{
  console.log('--- after wait ---');
  console.log('#app children:',(w.document.querySelector('#app')||{}).children?.length);
  console.log('text:',(w.document.body.textContent||'').replace(/\s+/g,' ').slice(0,300));
},5000);
