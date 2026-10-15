const czechDate=iso=>{const [year,month,day]=iso.split('-');return `${day}. ${month}. ${year}`;};
function parseCzechDate(value){
  const match=value.trim().match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})$/);
  if(!match)return null;
  const [,day,month,year]=match,date=new Date(Number(year),Number(month)-1,Number(day),12);
  return date.getFullYear()===Number(year)&&date.getMonth()===Number(month)-1&&date.getDate()===Number(day)?calendarKey(date):null;
}
function dateField(id,value,name='',required=false){
  return `<span class="date-picker"><input id="${id}" ${name?`name="${name}"`:''} type="text" class="czech-date" value="${czechDate(value)}" placeholder="DD. MM. RRRR" aria-label="Datum" autocomplete="off" ${required?'required':''}><button type="button" class="date-toggle icon-button" data-date-open="${id}" aria-label="Vybrat datum" aria-expanded="false" aria-controls="${id}-picker">${icon('calendar')}</button><span id="${id}-picker" class="date-popover" popover="auto" role="dialog" aria-label="Výběr data"></span></span>`;
}
let activeDatePicker=null;
function drawDatePicker(focusDay){
  const state=activeDatePicker;if(!state)return;
  const selected=parseCzechDate(state.input.value),first=new Date(state.year,state.month,1,12),start=new Date(first);
  start.setDate(1-(first.getDay()+6)%7);
  state.popup.innerHTML=`<span class="date-picker-header"><button type="button" class="icon-button" data-date-month="-1" aria-label="Předchozí měsíc">‹</button><strong aria-live="polite">${first.toLocaleDateString('cs-CZ',{month:'long',year:'numeric'})}</strong><button type="button" class="icon-button" data-date-month="1" aria-label="Další měsíc">›</button></span><span class="date-picker-grid">${['Po','Út','St','Čt','Pá','So','Ne'].map(d=>`<span class="date-weekday">${d}</span>`).join('')}${Array.from({length:42},(_,i)=>{
    const date=new Date(start);date.setDate(start.getDate()+i);const key=calendarKey(date);
    return `<button type="button" data-date-pick="${key}" tabindex="${key===(focusDay||selected||calendarKey(first))?0:-1}" class="date-day ${date.getMonth()!==state.month?'date-outside':''} ${key===selected?'date-selected':''}" aria-label="${date.toLocaleDateString('cs-CZ',{day:'numeric',month:'long',year:'numeric'})}" aria-pressed="${key===selected}">${date.getDate()}</button>`;
  }).join('')}</span>`;
  if(focusDay)state.popup.querySelector(`[data-date-pick="${focusDay}"]`)?.focus();
}
function openDatePicker(id){
  const input=document.getElementById(id),popup=document.getElementById(id+'-picker');
  if(popup.matches(':popover-open')){popup.hidePopover();return;}
  const date=calendarDate(parseCzechDate(input.value)||calendarKey(new Date()));
  activeDatePicker={input,popup,year:date.getFullYear(),month:date.getMonth()};
  drawDatePicker();popup.showPopover();
  input.parentElement.querySelector('.date-toggle').setAttribute('aria-expanded','true');
  const rect=input.parentElement.getBoundingClientRect(),height=popup.offsetHeight,width=popup.offsetWidth;
  popup.style.left=Math.max(12,Math.min(rect.left,innerWidth-width-12))+'px';
  popup.style.top=Math.max(12,Math.min(rect.bottom+6,innerHeight-height-12,rect.bottom+height+18>innerHeight?rect.top-height-6:Infinity))+'px';
  popup.querySelector('[tabindex="0"]')?.focus();
  popup.ontoggle=()=>{
    if(!popup.matches(':popover-open')){input.parentElement?.querySelector('.date-toggle')?.setAttribute('aria-expanded','false');if(activeDatePicker?.popup===popup)activeDatePicker=null;}
  };
}
document.addEventListener('click',e=>{
  const trigger=e.target.closest('[data-date-open]');if(trigger){openDatePicker(trigger.dataset.dateOpen);return;}
  if(!activeDatePicker)return;
  const pick=e.target.closest('[data-date-pick]'),step=e.target.closest('[data-date-month]');
  if(pick){const {input,popup}=activeDatePicker;input.value=czechDate(pick.dataset.datePick);input.setCustomValidity('');popup.hidePopover();input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));document.getElementById(input.id)?.focus();}
  if(step){const state=activeDatePicker,date=new Date(state.year,state.month+Number(step.dataset.dateMonth),1,12);state.year=date.getFullYear();state.month=date.getMonth();drawDatePicker(calendarKey(date));}
});
document.addEventListener('input',e=>{if(e.target.matches('.czech-date'))e.target.setCustomValidity('');});
document.addEventListener('change',e=>{if(e.target.matches('.czech-date'))e.target.setCustomValidity(parseCzechDate(e.target.value)?'':'Zadejte platné datum ve formátu DD. MM. RRRR.');},true);
document.addEventListener('keydown',e=>{
  if(e.target.matches('.czech-date')&&e.key==='ArrowDown'){e.preventDefault();openDatePicker(e.target.id);return;}
  const state=activeDatePicker;if(!state||!state.popup.matches(':popover-open'))return;
  if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();state.popup.hidePopover();state.input.focus();return;}
  if(!e.target.matches('.date-day'))return;
  const date=calendarDate(e.target.dataset.datePick),steps={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};
  if(e.key in steps)date.setDate(date.getDate()+steps[e.key]);
  else if(e.key==='Home')date.setDate(date.getDate()-(date.getDay()+6)%7);
  else if(e.key==='End')date.setDate(date.getDate()+6-(date.getDay()+6)%7);
  else if(e.key==='PageUp'||e.key==='PageDown'){date.setDate(1);date.setMonth(date.getMonth()+(e.key==='PageDown'?1:-1));}
  else return;
  e.preventDefault();state.year=date.getFullYear();state.month=date.getMonth();drawDatePicker(calendarKey(date));
},true);
