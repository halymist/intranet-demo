let calendarView='day';
const calendarDate=value=>new Date(value+'T12:00:00');
const calendarKey=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
function calendarControls(){
  return `<div class="calendar-controls"><div class="tabs" aria-label="Zobrazení kalendáře">${[['day','Den'],['week','Týden'],['month','Měsíc']].map(([view,label])=>`<button class="chip ${calendarView===view?'active':''}" data-calendar-view="${view}" aria-pressed="${calendarView===view}">${label}</button>`).join('')}</div><div class="calendar-navigation"><button class="icon-button" data-calendar-step="-1" aria-label="Předchozí období">‹</button>${dateField('booking-day',bookingDate)}<button class="icon-button" data-calendar-step="1" aria-label="Další období">›</button></div></div>`;
}
function calendarBookings(date){
  const defaults=date==='2026-09-23'?[
    {resource:'Velká zasedací místnost',start:'09:00',end:'10:30',purpose:'Pracovní setkání'},
    {resource:'Malá zasedací místnost',start:'13:00',end:'14:00',purpose:'Projektová porada'},
    {resource:'Stolní tenis',start:'15:00',end:'16:00',purpose:'Stolní tenis'}
  ]:[];
  const bookings=demoBookings.filter(b=>b.startDate<=date&&b.endDate>=date&&!(b.endDate===date&&b.end==='00:00')).map(b=>({
    ...b,start:b.startDate<date?'00:00':b.start,end:b.endDate>date?'24:00':b.end,
    period:b.startDate!==b.endDate?`${czechDate(b.startDate)} ${b.start} – ${czechDate(b.endDate)} ${b.end}`:''
  }));
  return [...defaults,...bookings].sort((a,b)=>a.start.localeCompare(b.start));
}
// The day view shows working hours only: rooms and cars are used, and returned, between 6:00 and 21:00.
const dayStart=6*60,dayEnd=21*60,daySpan=dayEnd-dayStart;
function reservationDay(){
  const minutes=time=>Number(time.slice(0,2))*60+Number(time.slice(3));
  const events=calendarBookings(bookingDate);
  // Hour lines as elements: a repeating background drops lines when 15 columns round to fractional pixels.
  const hourLines=Array.from({length:daySpan/60-1},(_,i)=>`<i class="hour-line" style="left:${(i+1)/(daySpan/60)*100}%"></i>`).join('');
  main.innerHTML=`<div class="intro help-intro">${helpHeading('Rezervace','#home','Domů')}<button class="primary" data-book>＋ Nová rezervace</button></div>`+calendarControls()+`<div class="calendar timeline-calendar"><div class="calendar-inner timeline-inner"><div class="calendar-head timeline-head"><div>Místo / vozidlo</div><div class="timeline-hours">${hourLines}${Array.from({length:daySpan/60},(_,index)=>`<span style="left:${index/(daySpan/60)*100}%">${dayStart/60+index}:00</span>`).join('')}</div></div>${resources.map(resource=>{
    const lanes=[],bookings=events.filter(b=>b.resource===resource).map(b=>{
      // Clip to the visible window; a booking wholly outside it is pinned to the nearest edge as one hour.
      let start=Math.max(dayStart,minutes(b.start)),end=Math.min(dayEnd,minutes(b.end));
      if(end<=dayStart){start=dayStart;end=dayStart+60;}else if(start>=dayEnd){start=dayEnd-60;end=dayEnd;}
      let lane=lanes.findIndex(value=>value<=start);
      if(lane<0)lane=lanes.length;lanes[lane]=end;
      return {...b,left:(start-dayStart)/daySpan*100,width:(end-start)/daySpan*100,lane};
    });
    return `<div class="calendar-row timeline-row"><div class="timeline-resource">${esc(resource)}</div><div class="booking-track timeline-track" style="height:${Math.max(88,lanes.length*66+24)}px">${hourLines}${bookings.map(b=>{
      const label=b.start==='00:00'&&b.end==='24:00'?'Celý den':b.period&&b.end==='24:00'?'od '+b.start:b.period&&b.start==='00:00'?'do '+b.end:b.start+'–'+b.end;
      const description=[resource,label,b.purpose,b.period].filter(Boolean).join(' · ');
      // One-hour blocks are too narrow for a range; show the start and leave the rest to the tooltip.
      const short=b.width*daySpan/100<=60&&!b.period;
      return `<div class="slot timeline-slot" tabindex="0" aria-label="${esc(description)}" data-tooltip="${esc(description)}" style="left:${b.left}%;width:${b.width}%;top:${12+b.lane*66}px"><span>${esc(short?b.start:label)}</span><small>${esc(b.purpose)}</small>${b.period?`<small class="booking-period">${esc(b.period)}</small>`:''}</div>`;
    }).join('')}</div></div>`;
  }).join('')}</div></div>`;
  // On narrow screens the timeline scrolls; start an hour before the first booking.
  const track=document.querySelector('.timeline-track'),first=events.length?Math.min(...events.map(b=>minutes(b.start))):8*60;
  document.querySelector('.timeline-calendar').scrollLeft=track.clientWidth*Math.max(0,first-60-dayStart)/daySpan;
}

function reservationCalendar(){
  const selected=calendarDate(bookingDate),start=calendarDate(bookingDate);
  if(calendarView==='month')start.setDate(1);
  start.setDate(start.getDate()-(start.getDay()+6)%7);
  const length=calendarView==='month'?42:7;
  main.innerHTML=`<div class="intro help-intro">${helpHeading('Rezervace','#home','Domů')}<button class="primary" data-book>＋ Nová rezervace</button></div>`+calendarControls()+`<div class="reservation-grid-wrap"><div class="reservation-grid ${calendarView}">${['Po','Út','St','Čt','Pá','So','Ne'].map(day=>`<div class="calendar-weekday">${day}</div>`).join('')}${Array.from({length},(_,i)=>{
    const date=new Date(start);date.setDate(start.getDate()+i);const key=calendarKey(date),events=calendarBookings(key);
    return `<button class="calendar-cell ${date.getMonth()!==selected.getMonth()?'outside':''} ${key===bookingDate?'selected':''}" data-calendar-day="${key}" aria-label="${date.toLocaleDateString('cs-CZ')}, ${events.length} rezervací"><span class="calendar-day-number">${date.getDate()}.${calendarView==='week'?' '+(date.getMonth()+1)+'.':''}</span>${events.map(event=>`<span class="calendar-event"><strong>${event.start==='00:00'&&event.end==='24:00'?'Celý den':esc(event.start)+'–'+esc(event.end)}</strong><span>${esc(event.resource)}</span>${calendarView==='week'?`<small>${esc(event.purpose)}</small>`:''}</span>`).join('')}</button>`;
  }).join('')}</div></div>`;
}
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-calendar-view],[data-calendar-step],[data-calendar-day]');if(!el)return;
  if(el.dataset.calendarView)calendarView=el.dataset.calendarView;
  if(el.dataset.calendarDay){bookingDate=el.dataset.calendarDay;calendarView='day';}
  if(el.dataset.calendarStep){
    const date=calendarDate(bookingDate),step=Number(el.dataset.calendarStep);
    if(calendarView==='month'){const day=date.getDate();date.setDate(1);date.setMonth(date.getMonth()+step);date.setDate(Math.min(day,new Date(date.getFullYear(),date.getMonth()+1,0).getDate()));}
    else date.setDate(date.getDate()+step*(calendarView==='week'?7:1));
    bookingDate=calendarKey(date);
  }
  reservations();
});
