// Frontend-only records. No requests are sent to SharePoint or a service desk.
const reportKinds = {
  it: {title:'IT podpora',action:'Nový požadavek',symbol:'monitor'},
  cleaning: {title:'Úklid',action:'Nahlásit nedostatek',symbol:'cleaning'},
  defects: {title:'Kniha závad',action:'Nahlásit závadu',symbol:'wrench'}
};
// Categories follow the most common topics in the original Helpdesk list (no category field exists there).
const itCategories = {
  'Tisk a kopírování':'printer',
  'Počítač a příslušenství':'monitor',
  'Software':'app',
  'Přístupy a účty':'key',
  'E-mail a Teams':'mail',
  'Telefon':'phone',
  'Ostatní':'more'
};
const reports = [
  {id:7,kind:'it',title:'Přístup ke sdílené složce',category:'Přístupy a účty',place:'',description:'Prosím o přístup ke složce projektových podkladů.',date:'2026-09-23T09:30',status:'V řešení',sample:true,files:[]},
  {id:8,kind:'it',title:'Tiskárna netiskne',category:'Tisk a kopírování',place:'',description:'Tisková úloha zůstává ve frontě.',date:'2026-09-22T10:15',status:'V řešení',sample:true,files:[]},
  {id:9,kind:'it',title:'Nastavení druhého monitoru',category:'Počítač a příslušenství',place:'',description:'Druhý monitor byl připojen a nastaven.',date:'2026-09-21T11:00',status:'Vyřešeno',resolvedAt:'2026-09-21T14:00',resolution:'Monitor byl připojen a nastaven.',sample:true,files:[]},
  {id:10,kind:'it',title:'Outlook nestahuje poštu',category:'E-mail a Teams',place:'',description:'Od rána nepřicházejí nové zprávy, odesílání funguje.',date:'2026-09-23T08:10',status:'V řešení',sample:true,files:[]},
  {id:11,kind:'it',title:'Instalace SPSS',category:'Software',place:'',description:'Prosím o instalaci SPSS na nový notebook.',date:'2026-09-18T13:40',status:'Vyřešeno',resolvedAt:'2026-09-19T10:00',resolution:'SPSS nainstalováno včetně licence.',sample:true,files:[]},
  {id:1,kind:'defects',title:'Nefunkční osvětlení',place:'2. patro · chodba',description:'Jedno ze stropních světel nesvítí.',date:'2026-09-23T08:30',status:'V řešení',sample:true,files:[]},
  {id:2,kind:'defects',title:'Uvolněná klika u dveří',place:'1. patro · zasedací místnost',description:'Klika se při otevírání dveří uvolňuje.',date:'2026-09-22T13:15',status:'V řešení',sample:true,files:[]},
  {id:3,kind:'defects',title:'Oprava zásuvky',place:'Přízemí · chodba',description:'Uvolněný kryt zásuvky byl opraven.',date:'2026-09-21T09:00',status:'Vyřešeno',sample:true,files:[]},
  {id:4,kind:'cleaning',title:'Nevynesené koše',place:'2. patro · kuchyňka',description:'Koše v kuchyňce zůstaly po úklidu plné.',date:'2026-09-23T09:00',status:'V řešení',sample:true,files:[]},
  {id:5,kind:'cleaning',title:'Chybí papírové ručníky',place:'1. patro · toalety',description:'Prosím o doplnění papírových ručníků.',date:'2026-09-22T10:00',status:'V řešení',sample:true,files:[]},
  {id:6,kind:'cleaning',title:'Úklid po jednání',place:'2. patro · velká zasedací místnost',description:'Místnost byla uklizena po pracovním jednání.',date:'2026-09-21T15:00',status:'Vyřešeno',sample:true,files:[]}
];
let reportStatus='Vše', reportQuery='', nextReportId=12;
window.addEventListener('hashchange',()=>{reportStatus='Vše';reportQuery='';});
function reportDate(value){return new Date(value).toLocaleString('cs-CZ',{day:'numeric',month:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'});}
function localDateTime(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}T${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;}
function reportRows(kind){
  const rows=reports.filter(r=>r.kind===kind&&(reportStatus==='Vše'||r.status===reportStatus)&&fold(r.title+' '+r.place+' '+(r.category||'')+' '+r.description).includes(fold(reportQuery))).sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
  return rows.length?rows.map(r=>`<button class="report-row ${r.status==='Vyřešeno'?'resolved':''}" data-report="${r.id}" aria-label="${esc(r.title)}"><span class="report-symbol" ${r.category?`title="${esc(r.category)}"`:''}>${icon(itCategories[r.category]||reportKinds[kind].symbol)}</span><span class="report-copy"><strong>${esc(r.title)}</strong><span>${esc(r.kind==='it'?r.category||'Ostatní':r.place||'Místo neuvedeno')}</span></span><span class="report-date">${reportDate(r.date)}</span>${reportStatusLabel(r)}</button>`).join(''):'<div class="empty">Žádná hlášení neodpovídají výběru.</div>';
}
function reportStatusLabel(r){return `<span class="report-status ${r.status==='Vyřešeno'?'resolved':''}">${r.status}</span>`;}
function reportsPage(kind){
  const config=reportKinds[kind];if(!config)return help();
  document.title=config.title+' · ÚZEI Intranet';
  main.innerHTML=`<div class="intro help-intro">${helpHeading(config.title)}<button class="primary" data-report-new="${kind}">＋ ${config.action}</button></div>`+`<div class="report-toolbar">${chips(['Vše','V řešení','Vyřešeno'],reportStatus,'report-status')}<input type="search" id="report-search" aria-label="Hledat v hlášeních" placeholder="${kind==='it'?'Hledat v požadavcích':'Hledat podle místa nebo popisu'}" value="${esc(reportQuery)}"></div><div class="report-list" id="report-list">${reportRows(kind)}</div><div id="report-message" class="report-message" role="status"></div>`;
}
function newReport(kind){
  openDialog(`<h2>${reportKinds[kind].action}</h2><form id="report-form" data-kind="${kind}" class="form-grid"><label class="full">Název<input name="title" required maxlength="120" placeholder="Stručně pojmenujte problém"></label>${kind==='it'?`<label class="full">Kategorie<select name="category" required><option value="" selected disabled>Vyberte kategorii</option>${Object.keys(itCategories).map(c=>`<option>${c}</option>`).join('')}</select></label>`:`<label class="full">Místo<input name="place" ${kind==='cleaning'?'required':''} maxlength="160" placeholder="Budova, patro, místnost"></label>`}<label class="full">Popis<textarea name="description" required maxlength="4000" rows="4" placeholder="Co se stalo a co je potřeba napravit?"></textarea></label><div class="full attachment-field"><span id="attachment-label">Fotografie nebo přílohy</span><input type="file" id="report-attachments" name="attachments" multiple accept="image/*,.pdf" hidden><button type="button" id="attachment-drop" aria-labelledby="attachment-label attachment-prompt"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V3m-5 5 5-5 5 5M4 15v5h16v-5"/></svg><span id="attachment-prompt">Přetáhněte soubory sem nebo <strong>vyberte z počítače</strong></span><small>Fotografie a PDF · nejvýše 5 souborů, každý do 10 MB</small></button><div id="attachment-list" aria-live="polite"></div></div><div id="report-error" class="full" role="alert"></div><div class="form-actions full"><button type="button" class="secondary" data-report-cancel>Zrušit</button><button class="primary" type="submit">${kind==='it'?'Přidat požadavek':'Přidat hlášení'}</button></div></form>`);
}
function reportDetail(id){
  const r=reports.find(r=>r.id===Number(id));if(!r)return;
  openDialog(`${reportStatusLabel(r)}<h2>${esc(r.title)}</h2><dl class="report-facts">${r.kind==='it'?`<div><dt>Kategorie</dt><dd>${esc(r.category||'Ostatní')}</dd></div>`:`<div><dt>Místo</dt><dd>${esc(r.place||'Neuvedeno')}</dd></div>`}<div><dt>Nahlášeno</dt><dd>${reportDate(r.date)}</dd></div></dl><p class="report-description">${esc(r.description)}</p>${r.files.length?`<div class="report-files">${r.files.map(f=>`<a href="${f.url}" download="${esc(f.name)}">${icon('documents')}${esc(f.name)}</a>`).join('')}</div>`:''}${r.kind==='it'?helpdeskResolution(r):''}<p class="form-note">${r.sample?'Ukázkové hlášení.':'Hlášení je pouze v tomto náhledu.'} Změny se neodesílají správci.</p><button class="primary" data-report-resolve="${r.id}">${r.status==='Vyřešeno'?'Vrátit do řešení':'Označit jako vyřešené'}</button>`);
}
let selectedAttachments=[];
function helpdeskResolution(r){
  return `<form class="form-grid helpdesk-resolution" id="helpdesk-resolution" data-id="${r.id}"><label class="full">Řešitel<input name="assignee" maxlength="160" value="${esc(r.assignee||'')}" placeholder="Jméno řešitele"></label><label class="full">Způsob řešení<textarea name="resolution" maxlength="4000" rows="4">${esc(r.resolution||'')}</textarea></label>${r.resolvedAt?`<p class="full">Vyřešeno ${reportDate(r.resolvedAt)}</p>`:''}<div class="full"><button class="secondary" type="submit">Uložit podrobnosti</button><span id="resolution-saved" role="status"></span></div></form>`;
}
document.addEventListener('submit',e=>{
  if(e.target.id!=='helpdesk-resolution')return;
  e.preventDefault();
  const r=reports.find(r=>r.id===Number(e.target.dataset.id)),data=new FormData(e.target);
  r.assignee=data.get('assignee').trim();r.resolution=data.get('resolution').trim();
  document.querySelector('#resolution-saved').textContent=' Uloženo';
});
function renderAttachments(){
  const transfer=new DataTransfer();selectedAttachments.forEach(f=>transfer.items.add(f));
  document.querySelector('#report-attachments').files=transfer.files;
  document.querySelector('#attachment-list').innerHTML=selectedAttachments.map((f,i)=>`<div class="attachment-row">${icon('documents')}<span>${esc(f.name)}<small>${f.size<1024*1024?Math.max(1,Math.round(f.size/1024))+' kB':(f.size/1024/1024).toFixed(1)+' MB'}</small></span><button type="button" class="icon-button" data-remove-attachment="${i}" aria-label="Odebrat ${esc(f.name)}">×</button></div>`).join('');
}
function addAttachments(files){
  const combined=[...selectedAttachments];
  for(const f of files)if(!combined.some(x=>x.name===f.name&&x.size===f.size&&x.lastModified===f.lastModified))combined.push(f);
  const error=document.querySelector('#report-error');
  if(combined.length>5||combined.some(f=>f.size>10*1024*1024))error.textContent='Přidejte nejvýše 5 souborů, každý do 10 MB.';
  else if(combined.some(f=>!f.type.startsWith('image/')&&!/\.pdf$/i.test(f.name)))error.textContent='Vyberte fotografie nebo soubory PDF.';
  else{selectedAttachments=combined;error.textContent='';}
  renderAttachments();
}
document.addEventListener('click',e=>{
  if(e.target.closest('#attachment-drop'))document.querySelector('#report-attachments').click();
  const remove=e.target.closest('[data-remove-attachment]');
  if(remove){selectedAttachments.splice(Number(remove.dataset.removeAttachment),1);renderAttachments();document.querySelector('#report-error').textContent='';}
});
document.addEventListener('change',e=>{if(e.target.id==='report-attachments')addAttachments([...e.target.files]);});
for(const event of ['dragenter','dragover','dragleave','drop'])document.addEventListener(event,e=>{
  const zone=e.target.closest?.('#attachment-drop');if(!zone)return;e.preventDefault();
  if(event==='dragenter'||event==='dragover'){zone.classList.add('drag-over');e.dataTransfer.dropEffect='copy';}
  if(event==='dragleave'&&!zone.contains(e.relatedTarget))zone.classList.remove('drag-over');
  if(event==='drop'){zone.classList.remove('drag-over');addAttachments([...e.dataTransfer.files]);}
});
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-report-new],[data-report],[data-report-status],[data-report-cancel],[data-report-resolve]');if(!el)return;
  if(el.dataset.reportNew){selectedAttachments=[];newReport(el.dataset.reportNew);}
  else if(el.dataset.report)reportDetail(el.dataset.report);
  else if(el.dataset.reportStatus){reportStatus=el.dataset.reportStatus;reportsPage(location.hash.split('/')[1]);}
  else if(el.hasAttribute('data-report-cancel'))document.querySelector('#detail').close();
  else if(el.dataset.reportResolve){const r=reports.find(r=>r.id===Number(el.dataset.reportResolve));r.status=r.status==='Vyřešeno'?'V řešení':'Vyřešeno';r.resolvedAt=r.status==='Vyřešeno'?localDateTime():'';document.querySelector('#detail').close();reportsPage(r.kind);}
});
document.addEventListener('input',e=>{if(e.target.id==='report-search'){reportQuery=e.target.value;document.querySelector('#report-list').innerHTML=reportRows(location.hash.split('/')[1]);}});
document.addEventListener('submit',e=>{
  if(e.target.id!=='report-form')return;e.preventDefault();
  const data=new FormData(e.target), files=[...e.target.elements.attachments.files];
  if(!data.get('title').trim()||!data.get('description').trim()||(e.target.dataset.kind==='cleaning'&&!data.get('place').trim())){document.querySelector('#report-error').textContent='Vyplňte prosím povinná pole.';return;}
  if(files.length>5||files.some(f=>f.size>10*1024*1024)){document.querySelector('#report-error').textContent='Přidejte nejvýše 5 souborů, každý do 10 MB.';return;}
  const kind=e.target.dataset.kind;
  reports.push({id:nextReportId++,kind,title:data.get('title').trim(),place:(data.get('place')||'').trim(),description:data.get('description').trim(),date:localDateTime(),category:data.get('category')||'',status:'V řešení',files:files.map(f=>({name:f.name,url:URL.createObjectURL(f)}))});
  reportStatus='Vše';reportQuery='';document.querySelector('#detail').close();reportsPage(kind);document.querySelector('#report-message').textContent='Hlášení přidáno do náhledu.';
});
