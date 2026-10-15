let directoryQuery='', directoryUnit='';
const unitByCode = code => directoryData.units.find(u=>u.code===code);
function unitDescendants(code){return [code,...directoryData.units.filter(u=>u.parent===code).flatMap(u=>unitDescendants(u.code))];}
function directoryPeople(){
  const allowed=directoryUnit?unitDescendants(directoryUnit):null;
  return directoryData.staff.filter(p=>(!allowed||allowed.includes(p.unit))&&fold(p.name+' '+p.unit+' '+unitByCode(p.unit).name+' '+p.email+' '+p.office).includes(fold(directoryQuery))).sort((a,b)=>a.name.localeCompare(b.name,'cs'));
}
function personRows(people){return people.length?people.map(p=>`<div class="person-row"><div class="person-name"><strong>${esc(p.name)}</strong><button class="person-unit" data-unit="${p.unit}">${p.unit} · ${esc(unitByCode(p.unit).name)}</button></div><div class="person-contact">${p.email?`<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`:'<span>Kontakt není v ověřeném seznamu</span>'}${p.phone?`<a href="tel:${p.phone.replace(/\s/g,'')}">${esc(p.phone)}</a>`:''}${p.office?`<span>${esc(p.office)}</span>`:''}</div></div>`).join(''):'<div class="empty">Žádný kolega ani kolegyně neodpovídá výběru.</div>';}
function directoryPanel(){
  const unit=unitByCode(directoryUnit),people=directoryPeople();
  return `${unit?`<div class="unit-heading"><span class="eyebrow">${unit.code}</span><h2>${esc(unit.name)}</h2><p>${esc(unit.leader)}</p></div>`:''}<div class="people-list">${personRows(people)}</div>`;
}
function directoryPage(){
  directoryUnit='';
  document.title='Jmenný seznam · ÚZEI Intranet';
  main.innerHTML=`<div class="directory-heading">${helpHeading('Jmenný seznam')}<div class="directory-toolbar"><input id="directory-search" type="search" aria-label="Hledat v seznamu lidí" placeholder="Jméno, útvar, pracoviště" value="${esc(directoryQuery)}"></div></div><div class="directory-layout"><section id="directory-panel">${directoryPanel()}</section></div>`;
}
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-unit]');if(!el)return;
  directoryQuery=el.dataset.unit;
  if(location.hash.startsWith('#organization')){document.querySelector('#detail').close();location.hash='help/directory';return;}
  directoryPage();
});
document.addEventListener('input',e=>{if(e.target.id==='directory-search'){directoryQuery=e.target.value;document.querySelector('#directory-panel').innerHTML=directoryPanel();}});
