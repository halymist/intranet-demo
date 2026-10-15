const searchDialog = document.querySelector('#search-dialog');
const searchInput = document.querySelector('#search');
const searchResults = document.querySelector('#search-results');
function updateSearch() {
  const query = fold(searchInput.value.trim());
  const entries = [
    ...services.map(s => ({title:s.title, keywords:'', type:'Kontakty a pomoc', symbol:s.symbol, url:s.url})),
    ...usefulLinks.map(l => ({title:l.title, keywords:l.group, type:'Odkaz', symbol:'links', url:l.url})),
    ...docs.map(d => ({title:d.title, keywords:d.keywords||'', type:'Dokument', symbol:'documents', url:d.url ? (d.url.startsWith('#')||/^https?:/.test(d.url)?d.url:base+d.url) : '#documents/'+d.category})),
    ...projects.map(p => ({title:p.title, keywords:p.description, type:'Projekt', symbol:'projects', url:folders(p.root)})),
    ...news.map(n => ({title:n.title, keywords:n.description, type:n.date, symbol:'news', url:base+n.url}))
  ].filter(item => !query || fold(item.title+' '+item.keywords).includes(query));
  searchResults.innerHTML = entries.length ? entries.map(item => `<a class="search-result" href="${esc(item.url)}" ${item.url.startsWith('#')?'':'target="_blank" rel="noopener"'}>${icon(item.symbol)}<span>${esc(item.title)}</span><small>${esc(item.type)}</small></a>`).join('') : '<p class="search-empty">Nic jsme nenašli. Zkuste jiný výraz.</p>';
  document.querySelector('#search-status').textContent = `Počet výsledků: ${entries.length}`;
}
function openSearch() { updateSearch(); searchDialog.showModal(); searchInput.focus(); }
document.querySelector('#search-toggle').addEventListener('click',openSearch);
document.querySelector('#search-close').addEventListener('click',()=>searchDialog.close());
searchInput.addEventListener('input',updateSearch);
searchResults.addEventListener('click',e=>{if(e.target.closest('a'))searchDialog.close();});
searchDialog.addEventListener('click',e=>{if(e.target===searchDialog){const r=searchDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)searchDialog.close();}});
document.querySelector('#search-form').addEventListener('submit',()=>searchDialog.close());
searchDialog.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();searchDialog.close();return;}
  if(!['ArrowDown','ArrowUp'].includes(e.key))return;
  const rows=[...searchResults.querySelectorAll('a')];if(!rows.length)return;
  e.preventDefault();const index=rows.indexOf(document.activeElement);
  rows[(index+(e.key==='ArrowDown'?1:-1)+rows.length)%rows.length].focus();
});
document.addEventListener('keydown',e=>{
  if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.querySelector('dialog[open]')){e.preventDefault();openSearch();}
});
