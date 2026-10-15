let orgScale=1, orgQuery='', orgLayout=[];
function orgSelection(){
  const query=fold(orgQuery.trim()), matches=new Set(), people=new Map();
  if(!query)return {visible:null,matches,people};
  const visible=new Set();
  directoryData.units.forEach(u=>{if(fold(u.code+' '+u.name).includes(query)){matches.add(u.code);unitDescendants(u.code).forEach(code=>visible.add(code));}});
  directoryData.staff.forEach(p=>{if(fold(p.name).includes(query)){matches.add(p.unit);visible.add(p.unit);if(!people.has(p.unit))people.set(p.unit,[]);people.get(p.unit).push(p.name);}});
  [...visible].forEach(code=>{let unit=unitByCode(code);while(unit){visible.add(unit.code);unit=unitByCode(unit.parent);}});
  return {visible,matches,people};
}
function layoutOrganization(selection){
  let leaf=0;const nodes=[];
  function place(code,depth){
    const children=directoryData.units.filter(u=>u.parent===code&&(!selection.visible||selection.visible.has(u.code))).map(u=>place(u.code,depth+1));
    const x=children.length?(children[0].x+children[children.length-1].x)/2:leaf++*252+20;
    const node={...unitByCode(code),x,y:depth*208+24,children};nodes.push(node);return node;
  }
  if(!selection.visible||selection.visible.size)place('1000',0);
  orgLayout=nodes;
  return {width:Math.max(1,leaf)*252+16,height:nodes.length?Math.max(...nodes.map(n=>n.y))+180:180};
}
function organizationPage(){
  document.title='Organizační struktura · ÚZEI Intranet';
  main.innerHTML=`<div class="org-frame" role="region" aria-label="Organizační struktura"><div class="org-toolbar"><input id="org-search" type="search" aria-label="Hledat osobu nebo oddělení" placeholder="Hledat osobu nebo oddělení" value="${esc(orgQuery)}"><div class="org-zoom"><button class="icon-button" data-org-action="out" aria-label="Oddálit">−</button><output id="org-scale">100 %</output><button class="icon-button" data-org-action="in" aria-label="Přiblížit">＋</button></div><span id="org-results" role="status"></span></div><div class="org-viewport" id="org-viewport" tabindex="0" aria-label="Organizační schéma; posun pomocí posuvníků nebo tažením"><div id="org-space"><div id="org-canvas"></div></div></div></div>`;
  drawOrganization(true);
}
function drawOrganization(fit=false){
  const selection=orgSelection(),size=layoutOrganization(selection),viewport=document.querySelector('#org-viewport');
  if(fit)orgScale=Math.max(.65,Math.min(1,(viewport.clientWidth-28)/size.width,(viewport.clientHeight-28)/size.height));
  const canvas=document.querySelector('#org-canvas');
  canvas.style.width=size.width+'px';canvas.style.height=size.height+'px';canvas.style.transform=`scale(${orgScale})`;
  const space=document.querySelector('#org-space');space.style.width=size.width*orgScale+'px';space.style.height=size.height*orgScale+'px';
  const lines=orgLayout.flatMap(n=>n.children.map(c=>`<path d="M${n.x+110} ${n.y+142}V${n.y+174}H${c.x+110}V${c.y}"/>`)).join('');
  canvas.innerHTML=orgLayout.length?`<svg class="org-connectors" width="${size.width}" height="${size.height}" aria-hidden="true">${lines}</svg>`+orgLayout.map(n=>{
    const members=directoryData.staff.filter(p=>unitDescendants(n.code).includes(p.unit)).length;
    const names=selection.people.get(n.code);
    return `<div class="org-node ${n.code==='1000'?'org-root':''} ${selection.matches.has(n.code)?'org-match':''}" style="left:${n.x}px;top:${n.y}px"><button class="org-unit" data-org-unit="${n.code}" aria-label="${esc(n.name)} · ${n.code}"><span class="org-code">${n.code} <span>${members} osob</span></span><strong>${esc(n.name)}</strong><span class="org-leader" data-tooltip="${esc(names?names.join(', '):n.leader)}">${esc(names?names.join(', '):n.leader)}</span></button></div>`;
  }).join(''):'<div class="empty">Žádná osoba ani oddělení neodpovídá hledání.</div>';
  document.querySelector('#org-scale').textContent=Math.round(orgScale*100)+' %';
  document.querySelector('#org-results').textContent=orgQuery.trim()?`Nalezené útvary: ${selection.matches.size}`:'';
  if(fit){const root=orgLayout.find(n=>n.code==='1000');viewport.scrollTo({left:root?Math.max(0,(root.x+110)*orgScale-viewport.clientWidth/2):0,top:0});}
}
function zoomOrganization(scale,clientX,clientY){
  const viewport=document.querySelector('#org-viewport'),canvas=document.querySelector('#org-canvas');
  const bounds=viewport.getBoundingClientRect(),before=canvas.getBoundingClientRect();
  const x=clientX??bounds.left+viewport.clientWidth/2,y=clientY??bounds.top+viewport.clientHeight/2;
  const localX=(x-before.left)/orgScale,localY=(y-before.top)/orgScale;
  orgScale=Math.max(.25,Math.min(1.6,scale));
  canvas.style.transform=`scale(${orgScale})`;
  const space=document.querySelector('#org-space');
  space.style.width=parseFloat(canvas.style.width)*orgScale+'px';
  space.style.height=parseFloat(canvas.style.height)*orgScale+'px';
  const after=canvas.getBoundingClientRect();
  viewport.scrollLeft+=after.left+localX*orgScale-x;
  viewport.scrollTop+=after.top+localY*orgScale-y;
  document.querySelector('#org-scale').textContent=Math.round(orgScale*100)+' %';
}
document.addEventListener('wheel',e=>{
  if(!e.target.closest('#org-viewport'))return;
  e.preventDefault();
  const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?document.querySelector('#org-viewport').clientHeight:1);
  zoomOrganization(orgScale*Math.exp(-Math.max(-300,Math.min(300,delta))*.002),e.clientX,e.clientY);
},{passive:false});
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-org-action],[data-org-unit]');if(!el)return;
  if(el.dataset.orgUnit){const oldUnit=directoryUnit,oldQuery=directoryQuery;directoryUnit=el.dataset.orgUnit;directoryQuery='';openDialog(directoryPanel());directoryUnit=oldUnit;directoryQuery=oldQuery;return;}
  zoomOrganization(orgScale+(el.dataset.orgAction==='in'?.15:-.15));
});
document.addEventListener('input',e=>{if(e.target.id==='org-search'){orgQuery=e.target.value;drawOrganization(true);}});
let orgDrag=null;
document.addEventListener('pointerdown',e=>{const view=e.target.closest('#org-viewport');if(!view||e.target.closest('button')||e.pointerType==='touch')return;
  // A press on the viewport's own scrollbar scrolls natively; don't start a pan that would move the other way.
  if(e.target===view&&(e.offsetX>=view.clientWidth||e.offsetY>=view.clientHeight))return;orgDrag={view,x:e.clientX,y:e.clientY,left:view.scrollLeft,top:view.scrollTop};view.setPointerCapture(e.pointerId);view.classList.add('dragging');});
document.addEventListener('pointermove',e=>{if(!orgDrag)return;orgDrag.view.scrollLeft=orgDrag.left-e.clientX+orgDrag.x;orgDrag.view.scrollTop=orgDrag.top-e.clientY+orgDrag.y;});
for(const event of ['pointerup','pointercancel'])document.addEventListener(event,()=>{if(orgDrag)orgDrag.view.classList.remove('dragging');orgDrag=null;});
