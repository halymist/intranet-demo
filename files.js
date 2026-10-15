let fileRequest=0, fileItems=[];
const folderCache=new Map();
function readFolder(path,refresh=false){
  if(!refresh&&folderCache.has(path))return folderCache.get(path);
  const pending=(async()=>{
    const response=await fetch('/api/folder?path='+encodeURIComponent(path));
    if(!response.ok)throw new Error(String(response.status));
    return (await response.json()).items;
  })();
  folderCache.set(path,pending);
  pending.catch(()=>{if(folderCache.get(path)===pending)folderCache.delete(path);});
  return pending;
}
const fileRoots=['/HLAVN INNOST ZEI','/VNITN PEDPISY','/Manuly','/FORMULE K POUIT','/ABLONY','/ZPISY Z PV','/ZPRÁVY ZE SLUŽEBNÍCH CEST A PREZENTACE','/ZEI','/SEZNAMY','/Elektronick dc kontrola'];
const fileRootNames=['Projekty a úkoly','Předpisy a řády','Návody k systémům a technice','Formuláře','Šablony','Zápisy z porad vedení','Zprávy ze služebních cest a prezentace','Informace o ÚZEI','Seznamy','Elektronická řídící kontrola'];
const fileRoute=path=>'#files?path='+encodeURIComponent(path);
function fileBreadcrumbs(entries){
  return `<nav class="file-breadcrumbs" aria-label="Cesta ke složce">${entries.map((entry,i)=>`<a href="${esc(entry.url)}" ${i===entries.length-1?'aria-current="page"':''}>${esc(entry.title)}</a>`).join('<span aria-hidden="true">/</span>')}</nav>`;
}
function libraryFolder(href){
  const url=new URL(href,location.href);if(url.origin!=='http://intranet')return null;
  const path=url.searchParams.get('RootFolder')||decodeURIComponent(url.pathname).replace(/\/Forms\/AllItems\.aspx$/i,'').replace(/\/$/,'');
  return fileRoots.some(root=>path===root||url.searchParams.has('RootFolder')&&path.startsWith(root+'/'))?path:null;
}
function fileRows(){
  const rows=[...fileItems].sort((a,b)=>(a.kind==='folder'?0:1)-(b.kind==='folder'?0:1)||a.name.localeCompare(b.name,'cs',{numeric:true}));
  document.querySelector('#file-list').innerHTML=rows.length?rows.map(item=>{
    const folder=item.kind==='folder',size=Number(item.size),meta=folder?'Složka':[(size/1024/1024>=1?(size/1024/1024).toFixed(1)+' MB':Math.max(1,Math.round(size/1024))+' kB'),item.modified?new Date(item.modified).toLocaleDateString('cs-CZ'):''].filter(Boolean).join(' · ');
    return `<a class="doc-row" href="${esc(folder?fileRoute(item.path):base+item.path.split('/').map(encodeURIComponent).join('/'))}" ${folder?'':'target="_blank" rel="noopener"'}>${icon(folder?'projects':'documents')}<span class="doc-copy"><strong>${esc(item.name)}</strong><small>${esc([item.group,meta].filter(Boolean).join(' · '))}</small></span></a>`;
  }).join(''):'<div class="empty">Tato složka je prázdná.</div>';
}
async function filesPage(path,refresh=false){
  const request=++fileRequest,parts=path.split('/').filter(Boolean);
  const rootIndex=fileRoots.indexOf('/'+parts[0]);
  const labels=parts.map((name,i)=>i===0&&rootIndex>=0?fileRootNames[rootIndex]:name);
  const trail=parts.map((name,i)=>({title:labels[i],url:rootIndex===0&&i===0?'#projects':fileRoute('/'+parts.slice(0,i+1).join('/'))}));
  if(rootIndex!==0)trail.unshift({title:'Dokumenty',url:'#documents'});
  const active=document.querySelector(`#nav a[href="#${rootIndex===0?'projects':'documents'}"]`);
  if(active){active.classList.add('active');active.setAttribute('aria-current','page');}
  document.title=(labels.at(-1)||'Soubory')+' · ÚZEI Intranet';
  main.innerHTML=intro(esc(labels.at(-1)||'Soubory'),'',fileBreadcrumbs(trail))+`<div id="file-list" aria-live="polite"><div class="file-loading" role="status"><span class="sr-only">Načítání souborů</span><div aria-hidden="true">${Array.from({length:5},()=>'<div class="file-skeleton"><span class="skeleton-icon"></span><span class="skeleton-copy"><span></span><span></span></span></div>').join('')}</div></div></div>`;
  try{
    let items=await readFolder(path,refresh);
    if(request!==fileRequest||!location.hash.startsWith('#files?'))return;
    // A folder holding only one subfolder is a dead end: open the subfolder instead (replace keeps Back working).
    if(items.length===1&&items[0].kind==='folder'){location.replace(fileRoute(items[0].path));return;}
    if(path==='/VNITN PEDPISY'){
      const groups=await Promise.all(items.filter(item=>item.kind==='folder').map(async folder=>{
        const child=await readFolder(folder.path,refresh);
        return child.map(item=>({...item,group:folder.name}));
      }));
      items=[...items.filter(item=>item.kind==='file'),...groups.flat()];
    }
    if(request!==fileRequest||!location.hash.startsWith('#files?'))return;
    fileItems=items;fileRows();
    document.querySelector('#file-list').dataset.loaded='true';
  }catch(error){
    if(request!==fileRequest||!location.hash.startsWith('#files?'))return;
    document.querySelector('#file-list').innerHTML=`<div class="empty"><p>${error.message==='401'||error.message==='403'?'K této složce nemáte přístup.':'Složku se nepodařilo načíst. Zkontrolujte připojení k pracovní síti.'}</p><button class="secondary" id="file-retry">Zkusit znovu</button></div>`;
  }
}
document.addEventListener('click',e=>{
  if(e.target.closest('#file-retry')){filesPage(new URLSearchParams(location.hash.split('?')[1]).get('path')||'',true);return;}
  const link=e.target.closest('a[href]');if(!link||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
  const path=libraryFolder(link.href);if(path){e.preventDefault();location.hash=fileRoute(path);}
});
