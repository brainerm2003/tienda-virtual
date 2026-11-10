const K={u:'rsl_users',s:'rsl_session',k:'rsl_stock'},WA='573045256225';
// Productos de ejemplo: reemplázalos por los de tu catálogo (c: eu | sa | actual, b: 1 = más vendida, s: stock)
const P=[
{id:1,n:'Manchester United 1999',c:'eu',a:['#c8102e','#ffffff'],p:89000,s:6,b:1},
{id:2,n:'FC Barcelona 2009',c:'eu',a:['#a50044','#004d98'],p:89000,s:8,b:1},
{id:3,n:'AC Milan 1994',c:'eu',a:['#c8102e','#000000'],p:85000,s:3},
{id:4,n:'Colombia 1990',c:'sa',a:['#fcd116','#003893'],p:85000,s:10,b:1},
{id:5,n:'Brasil 1970',c:'sa',a:['#fedd00','#009c3b'],p:89000,s:5},
{id:6,n:'Argentina 1986',c:'sa',a:['#75aadb','#ffffff'],p:89000,s:7,b:1},
{id:7,n:'Real Madrid 2025/26',c:'actual',a:['#ffffff','#febe10'],p:99000,s:12},
{id:8,n:'FC Barcelona 2025/26',c:'actual',a:['#a50044','#004d98'],p:99000,s:9},
{id:9,n:'Argentina 2026',c:'actual',a:['#75aadb','#ffffff'],p:99000,s:2}];
const $=(s,r=document)=>r.querySelector(s),
ls=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},
sv=(k,v)=>localStorage.setItem(k,JSON.stringify(v)),
users=()=>ls(K.u,[]),me=()=>users().find(u=>u.email===ls(K.s,null)),
stock=id=>ls(K.k,{})[id]??P.find(p=>p.id===id).s,
cop=n=>'$'+n.toLocaleString('es-CO'),
esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
async function h(t){if(!crypto.subtle)return btoa(unescape(encodeURIComponent(t)));
const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
// Segmentos: Potencial = sin compras · Nuevo = 1 compra reciente · Antiguo = 2+ compras o más de 90 días de registro
function seg(u){const d=(Date.now()-u.creado)/864e5,c=u.compras.length;return !c?'Potencial':(c>=2||d>90?'Antiguo':'Nuevo')}
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',3500)}
function nav(){const u=me();document.body.insertAdjacentHTML('afterbegin',`<header><a href="index.html"><img src="logo.jpeg" alt="RetroSport Legends"></a><nav><a href="index.html#mas-vendidas">Más vendidas</a><a href="index.html#eu">Retros Europeas</a><a href="index.html#sa">Retros Suramericanas</a><a href="index.html#actual">Actuales</a>${u?`<span>Hola, ${esc(u.nombre.split(' ')[0])}</span><button class="btn o" id="out">Cerrar sesión</button>`:`<a href="login.html">Iniciar sesión</a><a class="btn" href="registro.html">Registrarme</a>`}</nav></header><div id="toast" role="status"></div>`);
$('#out')?.addEventListener('click',()=>{localStorage.removeItem(K.s);location.href='index.html'})}
const shirt=a=>`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M30 10 10 25l10 15 8-5v55h44V35l8 5 10-15L70 10Q50 24 30 10Z" fill="${a[0]}"/><path d="M28 55h44v10H28Z" fill="${a[1]}" opacity=".85"/><path d="M30 10Q50 24 70 10" fill="none" stroke="${a[1]}" stroke-width="3"/></svg>`;
const card=p=>{const s=stock(p.id);return `<article class="card">${shirt(p.a)}<h3>${p.n}</h3><span class="pr">${cop(p.p)}</span><span class="st ${s<4?'low':''}">${s?`Quedan ${s} unidades`:'Agotada'}</span><button class="btn" data-buy="${p.id}" ${s?'':'disabled'}>Comprar</button></article>`};
function fill(){const S={'mas-vendidas':P.filter(p=>p.b),eu:P.filter(p=>p.c=='eu'),sa:P.filter(p=>p.c=='sa'),actual:P.filter(p=>p.c=='actual')};
for(const k in S){const g=$('#g-'+k);if(g)g.innerHTML=S[k].map(card).join('')}}
function buy(id){const u=me();
if(!u){toast('Inicia sesión para comprar');setTimeout(()=>location.href='login.html',900);return}
const p=P.find(x=>x.id==id);if(stock(id)<1)return;
const st=ls(K.k,{});st[id]=stock(id)-1;sv(K.k,st);
const all=users(),i=all.findIndex(x=>x.email==u.email);all[i].compras.push({id,n:p.n,p:p.p,f:Date.now()});sv(K.u,all);
fill();toast('Pedido registrado. Te llevamos a WhatsApp para coordinar el pago.');
setTimeout(()=>open(`https://wa.me/${WA}?text=`+encodeURIComponent(`Hola RetroSport Legends, soy ${u.nombre}. Quiero comprar: ${p.n} (${cop(p.p)}).`),'_blank'),1200)}
async function registro(f){const d=Object.fromEntries(new FormData(f)),m=$('.msg',f),all=users();d.email=d.email.trim().toLowerCase();
if(all.some(u=>u.email==d.email)){m.textContent='Ese correo ya está registrado. Inicia sesión.';return}
if(d.pass.length<6){m.textContent='La contraseña debe tener mínimo 6 caracteres.';return}
all.push({nombre:d.nombre.trim(),email:d.email,tel:d.tel,origen:d.origen,pass:await h(d.pass),creado:Date.now(),compras:[]});
sv(K.u,all);sv(K.s,d.email);location.href='index.html'}
async function login(f){const d=Object.fromEntries(new FormData(f)),m=$('.msg',f),u=users().find(x=>x.email==d.email.trim().toLowerCase());
if(!u||u.pass!==await h(d.pass)){m.textContent='Correo o contraseña incorrectos.';return}
sv(K.s,u.email);location.href='index.html'}
function admin(){const PIN='retro2026'; // Demo: con un backend real esto se reemplaza por autenticación del servidor
if(sessionStorage.a!=PIN){const x=prompt('PIN de administrador');if(x!=PIN){document.body.innerHTML='<p style="padding:3rem">Acceso denegado. <a href="index.html">Volver a la tienda</a></p>';return}sessionStorage.a=PIN}
let f='Todos';const L={Potencial:'Potenciales',Nuevo:'Nuevos',Antiguo:'Antiguos'};
const draw=()=>{const U=users().map(u=>({...u,s:seg(u)})),V=f=='Todos'?U:U.filter(u=>u.s==f);
$('#stats').innerHTML=`<div><b>${U.length}</b>Registrados</div>`+Object.keys(L).map(s=>`<div><b>${U.filter(u=>u.s==s).length}</b>${L[s]}</div>`).join('');
$('#rows').innerHTML=V.map(u=>`<tr><td>${esc(u.nombre)}</td><td>${esc(u.email)}</td><td>${esc(u.tel)}</td><td>${esc(u.origen)}</td><td>${new Date(u.creado).toLocaleDateString('es-CO')}</td><td>${u.compras.length}</td><td><span class="tag">${u.s}</span></td></tr>`).join('')||'<tr><td colspan="7">No hay clientes en este grupo todavía.</td></tr>'};
document.querySelectorAll('[data-seg]').forEach(b=>b.onclick=()=>{f=b.dataset.seg;draw()});
$('#csv').onclick=()=>{const r=[['Nombre','Correo','WhatsApp','Origen','Registro','Compras','Segmento'],...users().map(u=>[u.nombre,u.email,u.tel,u.origen,new Date(u.creado).toISOString().slice(0,10),u.compras.length,seg(u)])];
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+r.map(x=>x.map(v=>`"${v}"`).join(',')).join('\n')],{type:'text/csv'}));a.download='clientes-retrosport.csv';a.click()};
draw()}
nav();const pg=document.body.dataset.p;
if(pg=='home'){fill();document.addEventListener('click',e=>{const b=e.target.closest('[data-buy]');if(b)buy(+b.dataset.buy)})}
if(pg=='admin')admin();
$('form[data-f]')?.addEventListener('submit',e=>{e.preventDefault();({registro,login}[e.target.dataset.f])(e.target)});
