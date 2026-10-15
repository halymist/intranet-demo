const icons = {
 organization:'<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5M5 17v-5h14v5"/>',
 links:'<path d="m10 13 4-4M8 15l-1 1a3 3 0 0 1-4-4l4-4a3 3 0 0 1 4 0M16 9l1-1a3 3 0 0 1 4 4l-4 4a3 3 0 0 1-4 0"/>',
 video:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m10 8 6 4-6 4z"/>',
 monitor:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
 printer:'<path d="M7 9V3h10v6M7 17H4v-7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v7h-3"/><rect x="7" y="14" width="10" height="7"/>',
 app:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
 key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M15 8l2 2"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
 phone:'<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/>',
 more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 wrench:'<path d="M14 6a5 5 0 0 0-6 6l-5 5a2.1 2.1 0 0 0 3 3l5-5a5 5 0 0 0 6-6l-3 3-3-3z"/>',
 cleaning:'<path d="m14 10 6-7M11 9l5 4-3 4-5-4zM8 13l5 4-2 4H3l1-5zM7 17l-1 4M10 18l-1 3"/>',
 contacts:'<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M3 7h4M3 12h4M3 17h4M9 17c0-4 7-4 7 0"/><circle cx="12.5" cy="9" r="2.5"/>',
 wifi:'<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 eyeOff:'<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
 check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
 copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
 home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>', news:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h3M8 18h8"/>', projects:'<path d="M3 7h7l2 2h9v11H3zM3 7V4h7l2 3h7v2"/>', calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h3M14 14h3M7 17h3"/>', documents:'<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6"/>', help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 17h.01"/>', clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>', wallet:'<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 8V5l14-2v3M21 11h-6v5h6M17 13.5h.01"/>', shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6zM12 8v8M8 12h8"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.documents}</svg>`;
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fold = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const base = 'http://intranet';
const library = '/HLAVN%20INNOST%20ZEI/Forms/AllItems.aspx';
const folders = root => base + library + '?RootFolder=' + encodeURIComponent('/HLAVN INNOST ZEI/' + root);
const external = (url,label,cls='text-link') => `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${label} ↗</a>`;
const news = [
 ...hrNews,
 {date:'21. 9. 2026',category:'Předpisy',title:'Aktualizovaný interní protikorupční program',description:'Nové znění programu a související přílohy jsou dostupné ve vnitřních předpisech. Účinnost od 21. září 2026.',file:'Interní protikorupční program',url:'/VNITN%20PEDPISY/NIA/NIA_26_07_interni_protikorupcni_program.pdf'},
 {date:'23. 9. 2026',category:'Zápisy',title:'Zápis z porady vedení č. 34',description:'Zápis z jednání vedení ÚZEI dne 22. září 2026.',file:'Zápis z porady vedení · PDF',url:'/ZPISY%20Z%20PV/Zápisy%20PV%202026/34zapis2026.pdf'},
 {date:'16. 9. 2026',category:'Služební cesty',title:'Zpráva z konference EAAE v Chanii',description:'Zpráva ze zahraniční služební cesty a účasti na konferenci v Řecku, 9.–13. září 2026.',file:'Zpráva ze služební cesty · PDF',url:'/ZPRÁVY%20ZE%20SLUŽEBNÍCH%20CEST%20A%20PREZENTACE/Zprávy%20ze%20služebních%20cest/2026-09-09-13-zprava.pdf'},
 {date:'15. 9. 2026',category:'Organizace',title:'Aktuální řídící schéma ÚZEI',description:'Přehled organizační struktury a útvarů platný od 1. září 2026.',file:'Řídící schéma · PDF',url:'/ZEI/Řídící%20schéma/2026_09_01_ridici_schema_cz.pdf'},
 {date:'15. 9. 2026',category:'Služební cesty',title:'Zpráva z geografického kongresu v Košicích',description:'Účast na společném kongresu České a Slovenské geografické společnosti, 7.–10. září 2026.',file:'Zpráva ze služební cesty · PDF',url:'/ZPRÁVY%20ZE%20SLUŽEBNÍCH%20CEST%20A%20PREZENTACE/Zprávy%20ze%20služebních%20cest/2026-09-07-10-zprava.pdf'}
];
news.sort((a,b)=>{const key=d=>d.split('.').map(v=>v.trim()).reverse().map(v=>v.padStart(2,'0')).join('-');return key(b.date).localeCompare(key(a.date));});
const categories = [
 {id:'procurement',title:'Veřejné zakázky',icon:'documents'},
 {id:'rules',title:'Předpisy a řády',root:'/VNITN PEDPISY',description:'Pracovní řád, vnitřní předpisy a pravidla organizace.',icon:'documents'},
 {id:'safety',title:'Bezpečnost a pracoviště',description:'Lékárničky, evakuační plány, požární ochrana a první pomoc.',icon:'shield'},
 {id:'forms',title:'Formuláře',root:'/FORMULE K POUIT',icon:'documents'},
 {id:'templates',title:'Šablony',root:'/ABLONY',icon:'projects'},
 {id:'minutes',title:'Zápisy z porad vedení',root:'/ZPISY Z PV',icon:'news'},
 {id:'reports',title:'Zprávy ze služebních cest a prezentace',root:'/ZPRÁVY ZE SLUŽEBNÍCH CEST A PREZENTACE',icon:'documents'},
 {id:'guides',title:'Návody k systémům a technice',root:'/Manuly',icon:'help'},
 {id:'control',title:'Elektronická řídící kontrola',root:'/Elektronick dc kontrola',icon:'documents'},
 {id:'organization',title:'O ÚZEI',root:'/ZEI',description:'Informace a dokumenty o ústavu.',icon:'home'}
];
const docs = [
 ...procurementDocs,
 {title:'Vnitřní předpisy a pracovní řád',category:'rules',type:'Knihovna dokumentů',url:'/VNITN%20PEDPISY/Forms/AllItems.aspx',keywords:'řád pravidla'},
 {title:'Umístění lékárniček v objektech ÚZEI',category:'safety',type:'PDF · původní intranet',url:'/Manuly/lekarnicky.pdf',keywords:'lékárnička první pomoc zdraví'},
 {title:'Evakuační plány',category:'safety',type:'Ukázka zařazení · podklady budou doplněny',keywords:'evakuace požár únikové cesty'},
 {title:'Požární ochrana a nouzové kontakty',category:'safety',type:'Ukázka zařazení · podklady budou doplněny',keywords:'bezpečnost bozp první pomoc'},
 {title:'Formuláře k použití',category:'forms',type:'Knihovna formulářů',url:'/FORMULE%20K%20POUIT/Forms/AllItems.aspx'},
 {title:'Šablony dokumentů',category:'templates',type:'Knihovna šablon',url:'/ABLONY/Forms/AllItems.aspx'},
 {title:'Zápisy z porad vedení',category:'minutes',type:'Archiv zápisů',url:'/ZPISY%20Z%20PV/Forms/AllItems.aspx'},
 {title:'Zprávy ze služebních cest a prezentace',category:'reports',type:'Knihovna zpráv',url:'/ZPRÁVY%20ZE%20SLUŽEBNÍCH%20CEST%20A%20PREZENTACE/Forms/AllItems.aspx'},
 {title:'Návody k systémům a technice',category:'guides',type:'Knihovna návodů',url:'/Manuly/Forms/AllItems.aspx',keywords:'manuály návody docházka email tiskárna telefon'},
 {title:'Elektronická řídící kontrola',category:'control',type:'Návody a procesní schémata',url:'/Elektronick%20dc%20kontrola'},
 {title:'Informace o ÚZEI',category:'organization',type:'Knihovna dokumentů',url:'/ZEI/Forms/AllItems.aspx'}
];
const projects = [
 // All top-level folders of HLAVNÍ ČINNOSTI ÚZEI (read-only review 30 September 2026); year ranges describe the folder contents at that date.
 {title:'Interní výzkumné projekty',type:'Projekty',description:'Ročníky 2011–2026 · návrhy, prezentace, hodnocení a podklady.',root:'Interní projekty'},
 {title:'Národní projekty',type:'Projekty',description:'Dokumenty a podklady k národním výzkumným projektům.',root:'Externí projekty/Národní projekty'},
 {title:'Mezinárodní projekty',type:'Projekty',description:'Společné výzkumné projekty a mezinárodní spolupráce.',root:'Externí projekty/Mezinárodní projekty'},
 {title:'TÚ',type:'Úkoly',description:'Ročníky 2011–2026.',root:'TÚ'},
 {title:'MTÚ · operativní činnost',type:'Úkoly',description:'Ročníky 2011–2024 · podklady k operativní činnosti.',root:'MTÚ - operativní činnost'},
 {title:'MTÚ 2020 · zadávací listy',type:'Úkoly',description:'Zadání a výstupy MTÚ 2020.',root:'MTÚ 2020 - zadávací listy'},
 {title:'PÚ · podpůrné úkoly',type:'Úkoly',description:'Ročník 2023.',root:'PÚ - Podpůrné úkoly'},
 {title:'Zpráva o stavu zemědělství',type:'Výstupy',description:'Zprávy za roky 1996–2025 a podklady k nim.',root:'Zpráva o stavu zemědělství'},
 {title:'Databáze Baseline',type:'Výstupy',description:'',root:'Databáze Baseline'},
 {title:'Číselník úkolů ÚZEI',type:'Výstupy',description:'',root:'Číselník úkolů ÚZEI'},
 {title:'Akreditace zemědělských poradců',type:'Další',description:'',root:'Akreditace zemědělských poradců'},
 {title:'Roční seminář pro vodoprávní úřady',type:'Další',description:'',root:'Roční seminář pro vodoprávní úřady'}
];
const usefulLinks = [
 {title:'Disk X · 1000, 1200',group:'Sdílené dokumenty',url:'http://dms1000/Dokumenty/Forms/AllItems.aspx'},
 {title:'Disk X · 1100',group:'Sdílené dokumenty',url:'http://dms1100/Dokumenty/Forms/AllItems.aspx'},
 {title:'Disk X · 1010',group:'Sdílené dokumenty',url:'http://dms1200/Dokumenty/Forms/AllItems.aspx'},
 {title:'Disk X · 1300',group:'Sdílené dokumenty',url:'http://dms/Dokumenty/Forms/AllItems.aspx'},
 {title:'ÚZEI',group:'Odborné zdroje a weby',url:'https://uzei.cz/'},
 {title:'FADN',group:'Odborné zdroje a weby',url:'https://fadn.cz/cz/'},
 {title:'Knihovna Antonína Švehly',group:'Odborné zdroje a weby',url:'https://kas.uzei.cz/'},
 {title:'Časopisy KAŠ',group:'Odborné zdroje a weby',url:'http://casokas/'},
 {title:'Elektronické informační zdroje',group:'Odborné zdroje a weby',url:'https://kas.uzei.cz/jak-na-to'},
 {title:'Web of Science',group:'Odborné zdroje a weby',url:'https://kas.uzei.cz/dalsi-odborne-zdroje'},
 {title:'Agronavigátor',group:'Odborné zdroje a weby',url:'https://agronavigator.cz/'},
 {title:'Akvanavigátor',group:'Odborné zdroje a weby',url:'https://akvanavigator.cz/cz/'},
 {title:'Zemědělská škola',group:'Odborné zdroje a weby',url:'https://zemedelskaskola.cz/'},
 {title:'eAGRI',group:'Odborné zdroje a weby',url:'http://eagri.cz/public/web/mze/'},
 {title:'Organizace podřízené MZe',group:'Odborné zdroje a weby',url:'http://eagri.cz/public/web/mze/ministerstvo-zemedelstvi/o-ministerstvu/podrizene-organizace/'}
];
function linksPage(){
  main.innerHTML=intro('Užitečné odkazy')+[...new Set(usefulLinks.map(l=>l.group))].map(group=>`<section class="project-group"><h2 class="group-title">${group}</h2><div class="grid compact-grid">${usefulLinks.filter(l=>l.group===group).map(l=>`<a class="document-card destination-card" href="${esc(l.url)}" target="_blank" rel="noopener"><span class="destination-icon">${icon(group==='Sdílené dokumenty'?'projects':'links')}</span><h3>${l.title}</h3></a>`).join('')}</div></section>`).join('');
}
const navItems=[['home','Domů','home'],['news','Aktuality','news'],['projects','Projekty a úkoly','projects'],['documents','Dokumenty','documents'],['help','Kontakty a pomoc','help'],['links','Užitečné odkazy','links']];
const main=document.querySelector('main');
let current='home', filter='Vše', bookingDate='2026-09-23';
const demoBookings=[];
function helpHeading(title,href='#help',label='Kontakty a pomoc'){return `<div class="help-heading"><a href="${href}" class="help-back icon-button" aria-label="Zpět na ${label}" data-tooltip="${label}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7"/></svg></a><h1>${esc(title)}</h1></div>`;}
function intro(title,description,action=''){return `<div class="intro"><h1>${title}</h1>${action}</div>`;}
function chips(values,active,attribute='filter'){return `<div class="tabs">${values.map(v=>`<button class="chip ${v===active?'active':''}" data-${attribute}="${esc(v)}" aria-pressed="${v===active}">${esc(v)}</button>`).join('')}</div>`;}
function newsRows(items){
  if(!items.length)return '<div class="empty">V této kategorii nejsou žádné aktuality.</div>';
  return `<div class="news-feed">${items.map(n=>{
    const [day,month,year]=n.date.split('.').map(v=>v.trim());
    const months=['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];
    return `<a class="news-item news-entry" href="${esc(base+n.url)}" target="_blank" rel="noopener" aria-label="${esc(n.title)}"><time class="news-date" datetime="${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}" aria-label="${n.date}"><strong>${day}</strong><span>${months[Number(month)-1]}</span>${Number(year)!==new Date().getFullYear()?`<span class="news-year">${year}</span>`:''}</time><span class="news-copy"><span class="news-kicker"><span>${n.category}</span></span><span class="news-headline">${n.title}</span><span class="news-summary">${n.description}</span></span></a>`;
  }).join('')}</div>`;
}
function todayPanel(){return `<section class="side-panel"><div class="section-head"><h2>Rezervace dnes</h2><span class="reservation-today-date"><span>23. září</span>${icon('calendar')}</span></div><div class="booking"><div class="booking-time">09:00<br>10:30</div><div class="booking-info"><strong>Velká zasedací místnost</strong><small>Pracovní setkání · 2. patro</small></div></div><div class="booking"><div class="booking-time">13:00<br>14:00</div><div class="booking-info"><strong>Malá zasedací místnost</strong><small>Projektová porada · 1. patro</small></div></div><div class="booking"><div class="booking-time">15:00<br>16:00</div><div class="booking-info"><strong>Stolní tenis</strong><small>Ping pong · kryt CO</small></div></div><a class="wide-button" href="#reservations">Zobrazit rezervace</a></section>`;}
// Visitor Wi-Fi from the original homepage. The password is masked on screen (shoulder-surfing), not secret: it is in this file.
const visitorWifi={network:'Uzei_Public',password:'Public-Manesova75'};
function wifiPanel(){return `<section class="side-panel wifi-panel" aria-labelledby="wifi-title"><div class="section-head"><h2 id="wifi-title">Wi-Fi pro návštěvy</h2><span class="wifi-mark">${icon('wifi')}</span></div><dl class="wifi-facts"><div><dt>Síť</dt><dd><code>${esc(visitorWifi.network)}</code></dd></div><div><dt>Heslo</dt><dd><code id="wifi-password">••••••••••</code><button type="button" class="icon-button" id="wifi-reveal" aria-pressed="false" aria-label="Zobrazit heslo" data-tooltip="Zobrazit heslo">${icon('eye')}</button><button type="button" class="icon-button" id="wifi-copy" aria-label="Kopírovat heslo" data-tooltip="Kopírovat heslo">${icon('copy')}</button></dd></div></dl><span id="wifi-status" class="sr-only" role="status"></span></section>`;}
document.addEventListener('click',async e=>{
  const reveal=e.target.closest('#wifi-reveal'),copy=e.target.closest('#wifi-copy');
  if(reveal){
    const shown=reveal.getAttribute('aria-pressed')!=='true',label=shown?'Skrýt heslo':'Zobrazit heslo';
    document.querySelector('#wifi-password').textContent=shown?visitorWifi.password:'••••••••••';
    reveal.setAttribute('aria-pressed',String(shown));reveal.setAttribute('aria-label',label);reveal.dataset.tooltip=label;reveal.innerHTML=icon(shown?'eyeOff':'eye');
  }
  if(copy){
    const status=document.querySelector('#wifi-status');
    clearTimeout(copy.resetTimer);
    try{
      await navigator.clipboard.writeText(visitorWifi.password);status.textContent='Heslo zkopírováno';copy.dataset.tooltip='Zkopírováno';
      // Visible confirmation: the icon turns into a check and the password briefly highlights.
      copy.innerHTML=icon('check');copy.classList.add('copied');
      const code=document.querySelector('#wifi-password');code.classList.remove('copied');void code.offsetWidth;code.classList.add('copied');
    }
    catch{status.textContent='Heslo se nepodařilo zkopírovat';copy.dataset.tooltip='Kopírování se nepodařilo';}
    copy.resetTimer=setTimeout(()=>{copy.dataset.tooltip='Kopírovat heslo';copy.innerHTML=icon('copy');copy.classList.remove('copied');},1600);
  }
});
function home(){main.innerHTML=`<div class="quicklinks"><a class="quick ai" href="https://uzei.wildsgrove.com/" target="_blank" rel="noopener"><span>✳</span><strong>ÚZEI AI</strong><small>Váš AI asistent pro každodenní práci</small></a><a class="quick" href="http://dochazka.uzei.lan" target="_blank" rel="noopener">${icon('clock')}<strong>Docházka</strong><small>Příchody, odchody a absence</small></a><a class="quick" href="http://permezd.uzei.lan/eFluxPam/Login.Aspx?ReturnUrl=%2feFluxPam" target="_blank" rel="noopener">${icon('wallet')}<strong>Platy</strong><small>Mzdový portál</small></a><a class="quick" href="#reservations">${icon('calendar')}<strong>Rezervace</strong><small>Místnosti, vozidla a stolní tenis</small></a></div><div class="home-columns"><section><div class="section-head"><h2>Co je nového</h2><a class="text-link" href="#news">Všechny aktuality</a></div><div id="news-list">${newsRows(news)}</div></section><aside class="home-aside">${wifiPanel()}${todayPanel()}</aside></div>`;fitHomeNews();}
// Desktop home fills exactly one screen: show only the news entries that fit. Elsewhere show the latest four.
const homeFits=matchMedia('(min-width:1001px) and (min-height:890px)');
function fitHomeNews(){
  const list=document.querySelector('.home-view #news-list');if(!list)return;
  // Extra entries are removed, not hidden, so the last shown entry keeps :last-child styling.
  list.innerHTML=newsRows(homeFits.matches?news:news.slice(0,4));
  if(!homeFits.matches)return;
  const feed=list.querySelector('.news-feed');
  document.body.classList.add('measuring');
  while(feed.children.length>1&&feed.scrollHeight>feed.clientHeight)feed.lastElementChild.remove();
  document.body.classList.remove('measuring');
}
window.addEventListener('resize',fitHomeNews);
function documentRow(d){
  const content=`${icon(d.type.startsWith('Videonávod')?'video':'documents')}<span class="doc-copy"><strong>${esc(d.title)}</strong><small>${esc(d.type)}</small></span>`;
  if(!d.url)return `<button type="button" class="doc-row" data-placeholder="${esc(d.title)}" aria-label="${esc(d.title)}">${content}</button>`;
  const internal=d.url.startsWith('#');
  return `<a class="doc-row" href="${esc(internal||/^https?:/.test(d.url)?d.url:base+d.url)}" ${internal?'':'target="_blank" rel="noopener"'}>${content}</a>`;
}
function documentsPage(category){
  const cat=categories.find(c=>c.id===category);
  if(cat?.root){location.replace(fileRoute(cat.root));return;}
  main.innerHTML=intro(cat?.title||'Dokumenty','',cat?fileBreadcrumbs([{title:'Dokumenty',url:'#documents'},{title:cat.title,url:'#documents/'+cat.id}]):'')+(cat
    ? `<div>${docs.filter(d=>d.category===cat.id).map(documentRow).join('')}</div>`
    : `<div class="grid compact-grid">${categories.map(c=>`<a class="document-card destination-card" href="${c.root?fileRoute(c.root):'#documents/'+c.id}"><span class="destination-icon">${icon(c.icon)}</span><h2>${c.title}</h2><span class="destination-arrow" aria-hidden="true">→</span></a>`).join('')}</div>`);
}
function projectsPage(){
  const groups=[['Projekty','Projekty'],['Úkoly','Úkoly'],['Výstupy','Výstupy a podklady'],['Další','Další činnosti']];
  main.innerHTML=intro('Projekty a úkoly')
    +groups.map(([type,title])=>`<section class="project-group" aria-label="${title}"><h2 class="group-title">${title}</h2><div class="grid compact-grid">${projects.filter(p=>p.type===type).map(p=>`<a class="document-card destination-card" href="${esc(folders(p.root))}" target="_blank" rel="noopener"><span class="destination-icon">${icon('projects')}</span><span class="destination-copy"><h3>${p.title}</h3>${p.description?`<small>${p.description}</small>`:''}</span><span class="destination-arrow" aria-hidden="true">→</span></a>`).join('')}</div></section>`).join('');
}
const resources=['Velká zasedací místnost','Malá zasedací místnost','Stolní tenis','Vozidlo · Octavia','Vozidlo · Superb'];
function reservations(){if(calendarView==='day')reservationDay();else reservationCalendar();}
const services=[
    {title:'IT podpora',url:'#help/it',symbol:'monitor'},
    {title:'Kniha závad',url:'#help/defects',symbol:'wrench'},
    {title:'Úklid',url:'#help/cleaning',symbol:'cleaning'},
    {title:'Jmenný seznam',url:'#help/directory',symbol:'contacts'},
    {title:'Organizační struktura',url:'#organization',symbol:'organization'},
  ];
function help(){
  main.innerHTML=intro('Kontakty a pomoc')+`<div class="grid compact-grid">${services.map(s=>`<div class="service-block"><a class="document-card destination-card" href="${esc(s.url)}" ${s.url.startsWith('#')?'':'target="_blank" rel="noopener"'}><span class="destination-icon">${icon(s.symbol)}</span><h2>${s.title}</h2></a></div>`).join('')}</div>`;
}
function searchPage(query){const q=fold(query);const ss=services.filter(s=>fold(s.title).includes(q));const ls=usefulLinks.filter(l=>fold(l.title+' '+l.group).includes(q));const matches=docs.filter(d=>fold(d.title+' '+d.type+' '+(d.keywords||'')).includes(q));const ns=news.filter(n=>fold(n.title+' '+n.description).includes(q));const ps=projects.filter(p=>fold(p.title+' '+p.description).includes(q));main.innerHTML=intro('Výsledky hledání',query?`Hledáte „${esc(query)}“`:'Zadejte hledaný výraz do pole nahoře.')+(query?'<p class="sub">Hledání v ukázkovém katalogu; obsah souborů se zatím neprohledává.</p>'+((matches.length+ns.length+ps.length+ls.length+ss.length)?`${ss.length?'<h2 style="margin-top:28px">Kontakty a pomoc</h2>'+ss.map(s=>`<a class="doc-row" href="${esc(s.url)}">${icon(s.symbol)}<strong>${esc(s.title)}</strong></a>`).join(''):''}${matches.length?'<h2 style="margin-top:28px">Dokumenty</h2>'+matches.map(documentRow).join(''):''}${ps.length?'<h2 style="margin-top:28px">Projekty</h2>'+ps.map(p=>`<a class="doc-row" href="${esc(folders(p.root))}" target="_blank" rel="noopener">${icon('projects')}<strong>${esc(p.title)}</strong></a>`).join(''):''}${ls.length?'<h2 style="margin-top:28px">Užitečné odkazy</h2>'+ls.map(l=>`<a class="doc-row" href="${esc(l.url)}" target="_blank" rel="noopener">${icon('links')}<strong>${l.title}</strong></a>`).join(''):''}${ns.length?'<h2 style="margin-top:28px">Aktuality</h2>'+newsRows(ns):''}`:'<div class="empty">Nic jsme nenašli. Zkuste kratší výraz, například „řád“ nebo „lékárnička“.</div>'):'');}
function openDialog(content){document.querySelector('#dialog-content').innerHTML=content;document.querySelector('#detail').showModal();}
// Clicking the backdrop (outside the dialog box) closes it, as in the search dialog.
document.querySelector('#detail').addEventListener('click',e=>{const d=e.currentTarget;if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});
function bookingForm(){openDialog(`<h2>Nová rezervace</h2><form id="booking-form" class="form-grid"><label class="full">Co chcete rezervovat<select name="resource">${resources.map(r=>`<option>${r}</option>`).join('')}</select></label><label class="full">Účel<input name="purpose" required maxlength="100" placeholder="Např. projektová porada"></label><fieldset class="booking-bound full"><legend>Od</legend><label>Datum${dateField('booking-form-date',bookingDate,'startDate',true)}</label><label>Čas<input name="start" type="text" pattern="([01][0-9]|2[0-3]):[0-5][0-9]" maxlength="5" data-tooltip="Čas ve formátu HH:mm (24 hodin)" aria-label="Čas od" placeholder="HH:mm" value="10:00" required></label></fieldset><fieldset class="booking-bound full"><legend>Do</legend><label>Datum${dateField('booking-end-date',bookingDate,'endDate',true)}</label><label>Čas<input name="end" type="text" pattern="([01][0-9]|2[0-3]):[0-5][0-9]" maxlength="5" data-tooltip="Čas ve formátu HH:mm (24 hodin)" aria-label="Čas do" placeholder="HH:mm" value="11:00" required></label></fieldset><div class="full" id="form-error" role="alert"></div><button class="primary full" type="submit">Založit</button></form>`);}

function render(){const hash=location.hash.slice(1)||'home';const [page,category]=hash.split('?')[0].split('/');current=page;document.body.classList.toggle('organization-view',page==='organization');document.body.classList.toggle('home-view',page==='home');document.querySelector('#nav').innerHTML=navItems.map(([id,title,ic])=>`<a href="#${id}" ${id===page||(id==='home'&&page==='reservations')||(id==='documents'&&page==='safety')||(id==='help'&&page==='organization')?'class="active" aria-current="page"':''}>${icon(ic)}${title}</a>`).join('');const title=navItems.find(n=>n[0]===page)?.[1]||(page==='reservations'?'Rezervace':page==='safety'?'Bezpečnost a první pomoc':page==='search'?'Hledání':'Domů');document.title=title+' · ÚZEI Intranet';if(page==='home')home();else if(page==='news')main.innerHTML=intro('Aktuality','Důležité informace a nově publikované dokumenty.')+chips(['Vše','Předpisy','Zápisy','Služební cesty','Organizace','HR'],filter)+newsRows(news.filter(n=>filter==='Vše'||n.category===filter));else if(page==='documents'||page==='safety')documentsPage(page==='safety'?'safety':category);else if(page==='projects')projectsPage();else if(page==='reservations')reservations();else if(page==='help'){if(category==='directory')directoryPage();else if(reportKinds[category])reportsPage(category);else help();}else if(page==='links')linksPage();else if(page==='files')filesPage(new URLSearchParams(hash.split('?')[1]).get('path')||'');else if(page==='organization')organizationPage();else if(page==='search')searchPage(new URLSearchParams(hash.split('?')[1]).get('q')||'');else home();}
document.addEventListener('click',e=>{const el=e.target.closest('[data-filter],[data-book],[data-placeholder]');if(!el)return;if(el.hasAttribute('data-filter')){filter=el.dataset.filter;render();}else if(el.hasAttribute('data-book'))bookingForm();else if(el.hasAttribute('data-placeholder'))openDialog(`<div class="eyebrow">DOKUMENTY · NÁHLED</div><h2>${esc(el.dataset.placeholder)}</h2><p>Toto je připravené místo v nové struktuře. Konkrétní podklady a jejich umístění je ještě potřeba ověřit a doplnit.</p>`);});
document.addEventListener('change',e=>{if(e.target.id==='booking-day'&&e.target.value){const date=parseCzechDate(e.target.value);if(date){bookingDate=date;reservations();}}});
document.addEventListener('submit',e=>{if(e.target.id==='search-form'){e.preventDefault();const q=document.querySelector('#search').value.trim();location.hash='search?q='+encodeURIComponent(q);}if(e.target.id==='booking-form'){e.preventDefault();const b=Object.fromEntries(new FormData(e.target));b.startDate=parseCzechDate(b.startDate);b.endDate=parseCzechDate(b.endDate);if(!b.startDate||!b.endDate){document.querySelector('#form-error').textContent='Zadejte platné datum.';return;}if(b.endDate+'T'+b.end<=b.startDate+'T'+b.start){document.querySelector('#form-error').textContent='Konec rezervace musí být později než její začátek.';return;}demoBookings.push(b);bookingDate=b.startDate;document.querySelector('dialog').close();reservations();}});
window.addEventListener('hashchange',()=>{filter='Vše';render();window.scrollTo(0,0);main.focus({preventScroll:true});});
render();
