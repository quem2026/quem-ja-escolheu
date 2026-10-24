const ENT="Entidades e manifestos";
const DATA=window.DATA||[];
const $=s=>document.querySelector(s);
const norm=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const people=DATA.filter(o=>o.aba!==ENT), ents=DATA.filter(o=>o.aba===ENT);
const ai=i=>i%11;
let q="";

/* números */
function countUp(el,n){if(reduce){el.textContent=n;return}const t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/900);el.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)}
$("#stats").innerHTML=[[people.length,"nomes"],[ents.length,"entidades e manifestos"]].map(([n,l])=>`<div class="stat"><b data-n="${n}">${n}</b><span>${l}</span></div>`).join("");
document.querySelectorAll(".stat b").forEach(b=>countUp(b,+b.dataset.n));
$("#upd").textContent="Atualizado em "+new Date().toLocaleDateString("pt-BR");

/* confete do topo: formas que desviam do texto */
function confete(){
  const hero=document.querySelector(".hero"),box=$("#confetti");if(!hero)return;
  const hr=hero.getBoundingClientRect(),avoid=[];
  const add=r=>{if(r.width&&r.height)avoid.push({l:r.left-hr.left,t:r.top-hr.top,r:r.right-hr.left,b:r.bottom-hr.top})};
  hero.querySelectorAll(".eyebrow,.lead,h1 .w,h1 .slot").forEach(el=>{const rg=document.createRange();rg.selectNodeContents(el);[...rg.getClientRects()].forEach(add)});
  hero.querySelectorAll(".btn,.stat").forEach(el=>add(el.getBoundingClientRect()));
  const M=44,cols=["#12a15a","#2d6cf6","#0b6b3a","#2d6cf6","#12a15a","#0b6b3a"];let h="";
  const ok=(x,y,s)=>avoid.every(a=>x+s+M<a.l||x-M>a.r||y+s+M<a.t||y-M>a.b);
  for(let i=0;i<18;i++){
    const s=10+Math.random()*22,c=cols[i%cols.length],shape=i%3;let x,y,found=false;
    for(let k=0;k<60&&!found;k++){x=Math.random()*(hr.width-s);y=Math.random()*(hr.height-s);found=ok(x,y,s)}
    if(!found)continue;
    const st=shape===0?"border-radius:50%":shape===1?"clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)":"border-radius:3px";
    h+=`<span style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;background:${c};${st};--d:${7+Math.random()*7}s;--l:-${Math.random()*8}s;--x:${(Math.random()-.5)*50}px;--y:${(Math.random()-.5)*50}px;--r:${Math.random()*180}deg;opacity:.6"></span>`;
  }
  box.innerHTML=h;
}
/* texto de marcador que se escreve */
const MOT=["e o Brasil soberano","e o direito das mulheres","e o direito dos trabalhadores","e a proteção da Amazônia","e o direito à cultura","e o investimento em ciência","e o investimento em educação","e o respeito aos povos indígenas","e o Brasil para todos"];
const stk=$("#stk"),slot=stk&&stk.parentElement;let si=0;
function escreve(t){
  let d=0;
  return t.split(" ").map(w=>`<span class="wd">${[...w].map(ch=>`<span class="lt" style="--d:${(d++*55)}ms">${ch}</span>`).join("")}</span>`).join(" ");
}
function medir(){
  if(!stk)return;slot.style.width=slot.style.height="";
  const keep=stk.innerHTML;let w=0,hh=0;
  stk.classList.add("static");
  MOT.forEach(t=>{stk.textContent=t;w=Math.max(w,stk.offsetWidth);hh=Math.max(hh,stk.offsetHeight)});
  stk.innerHTML=keep;stk.classList.remove("static");
  slot.style.width=Math.min(w+14,slot.parentElement.clientWidth)+"px";slot.style.height=(hh+10)+"px";
}
function cola(){
  if(!stk)return;
  stk.className="marker";void stk.offsetWidth;
  stk.style.setProperty("--r",(-1-Math.random()*2).toFixed(1)+"deg");
  stk.setAttribute("aria-label",MOT[si]);
  stk.innerHTML=escreve(MOT[si]);stk.classList.add("on");
  const dur=MOT[si].length*55+1000+2300;si=(si+1)%MOT.length;
  setTimeout(()=>{stk.classList.add("off");setTimeout(cola,400)},dur);
}
if(stk){if(reduce){stk.style.setProperty("--r","-2deg");stk.textContent=MOT[0]}else cola()}
medir();confete();setTimeout(()=>{medir();confete()},1000);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{medir();confete()});
let rz;addEventListener("resize",()=>{clearTimeout(rz);rz=setTimeout(()=>{medir();confete()},250)});

/* faixas de nomes */
(function(){
  const mk=list=>{const s=list.map(o=>`<span>${esc(o.nome.replace(/\s*\(.*?\)/g,""))}</span>`).join("");return s+s};
  const sh=people.slice().sort(()=>Math.random()-.5);
  [1,2,3,4,5,6,7,8].forEach(k=>{const s=(k-1)*53,l=[];for(let i=0;i<70;i++)l.push(sh[(s+i)%sh.length]);$("#belt"+k).innerHTML=mk(l)});
})();

/* mapa */
function card(o,i,n){
  const L=o.links||[],f=L.find(l=>/instagram\.com/i.test(l.url))||L[0];const lk=f?`<a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">Fonte</a>`:"";
  return `<li class="card a${ai(i)}" style="--n:${Math.min(n,40)}"><div class="tx"><button class="nm" type="button" data-i="${i}">${esc(o.nome)}</button><p class="cat">${esc(o.categoria)}</p></div><div class="lk">${lk}</div></li>`;
}
function render(){
  const list=people.map((o,i)=>[o,i]).filter(([o])=>(!q||norm(o.nome+" "+o.categoria+" "+(o.quem||"")).includes(q)));
  $("#count").textContent=list.length+(list.length===1?" nome":" nomes");
  $("#grid").innerHTML=list.map(([o,i],n)=>card(o,i,n)).join("");
  $("#empty").hidden=list.length>0;
}
$("#q").addEventListener("input",e=>{q=norm(e.target.value.trim());render()});
$("#grid").addEventListener("click",e=>{const b=e.target.closest(".nm");if(b)openDlg(+b.dataset.i)});
function openDlg(i){
  const o=people[i];$("#dc").textContent=o.categoria;$("#dt").textContent=o.nome;
  $("#dq").textContent=o.quem&&o.quem!==o.categoria?o.quem:"";
  $("#dl").innerHTML=(o.links||[]).slice().sort((x,y)=>/instagram\.com/i.test(y.url)-/instagram\.com/i.test(x.url)).map(l=>`<li><a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.rotulo)}</a></li>`).join("")+(o.instagram?`<li>Instagram: ${esc(o.instagram)}</li>`:"");
  const d=$("#dlg");d.showModal?d.showModal():d.setAttribute("open","");
}
$("#dx").addEventListener("click",()=>$("#dlg").close());
$("#dlg").addEventListener("click",e=>{if(e.target===$("#dlg"))$("#dlg").close()});


/* confete ao sortear */
function boom(){
  if(reduce)return;
  const c=document.createElement("canvas");c.className="boom";document.body.appendChild(c);
  const w=c.width=innerWidth,h=c.height=innerHeight,x=c.getContext("2d");
  const cols=["#ffd93d","#12a15a","#2d6cf6","#ffffff","#0b6b3a"];
  const ps=Array.from({length:110},()=>({x:w/2,y:h*.55,vx:(Math.random()-.5)*16,vy:-Math.random()*16-4,s:5+Math.random()*7,c:cols[Math.random()*cols.length|0],r:Math.random()*6,vr:(Math.random()-.5)*.4}));
  let t=0;(function f(){x.clearRect(0,0,w,h);ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.45;p.vx*=.99;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/3,p.s,p.s*.6);x.restore()});if(++t<90)requestAnimationFrame(f);else c.remove()})();
}
$("#rnd").onclick=()=>{boom();openDlg(Math.floor(Math.random()*people.length))};

/* entidades */
const GR=[["Manifestos e coletivos",["Manifesto","Coletivo"]],["Educação e ciência",["Entidade científica","Entidade de ensino superior","Entidade de educação profissional e tecnológica","Sindicato de docentes","Federação de professores","Federação de técnicos-administrativos","Fórum de servidores","Entidade estudantil"]],["Igreja e pastorais",["Entidade religiosa","Movimento religioso","Movimento ligado à Igreja"]],["Cultura e fãs",["Movimento cultural","Movimento de fãs"]],["Direitos e sociedade",["Direitos humanos","Movimento de mulheres","Instituto"]]];
const grp=o=>(GR.find(g=>g[1].includes(o.categoria))||["Outros"])[0];
let eg="Todos";
function ents_(){
  const names=["Todos",...GR.map(g=>g[0]).filter(n=>ents.some(o=>grp(o)===n))];
  $("#echips").innerHTML=names.map(n=>`<button class="chip" type="button" data-g="${esc(n)}" aria-pressed="${n===eg}">${esc(n)}<i>${n==="Todos"?ents.length:ents.filter(o=>grp(o)===n).length}</i></button>`).join("");
  $("#ents").innerHTML=ents.filter(o=>eg==="Todos"||grp(o)===eg).map(o=>`<li><b>${esc(o.nome)}</b><span>${esc(o.categoria)}</span>${o.links&&o.links[0]?`<span><a href="${esc(o.links[0].url)}" target="_blank" rel="noopener noreferrer">${esc(o.links[0].rotulo.length>60?o.links[0].rotulo.slice(0,58)+"…":o.links[0].rotulo)}</a></span>`:""}</li>`).join("");
}
$("#echips").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;eg=b.dataset.g;ents_()});
ents_();

/* entrada suave das seções */
if("IntersectionObserver" in window&&!reduce){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove("pre");io.unobserve(e.target)}}),{rootMargin:"0px 0px -8% 0px"});
  document.querySelectorAll(".rv").forEach(el=>{const r=el.getBoundingClientRect();if(r.top>innerHeight){el.classList.add("pre");io.observe(el)}});
}
render();
