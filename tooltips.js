// Shared light tooltips, matching the compact labels in ÚZEI AI.
const tooltip=document.createElement('div');
tooltip.id='app-tooltip';tooltip.className='app-tooltip';tooltip.setAttribute('role','tooltip');tooltip.setAttribute('popover','manual');
document.body.append(tooltip);
let tooltipTarget=null,tooltipTimer=null;
const tooltipSelector='[data-tooltip],.icon-button[aria-label]';
function hideTooltip(){
  clearTimeout(tooltipTimer);
  if(tooltipTarget){
    const ids=(tooltipTarget.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&id!==tooltip.id);
    if(ids.length)tooltipTarget.setAttribute('aria-describedby',ids.join(' '));else tooltipTarget.removeAttribute('aria-describedby');
  }
  tooltipTarget=null;
  if(tooltip.matches(':popover-open'))tooltip.hidePopover();
}
function queueTooltip(target,delay){
  if(target===tooltipTarget)return;
  hideTooltip();if(!target||target.disabled)return;
  tooltipTarget=target;
  tooltipTimer=setTimeout(()=>{
    if(!target.isConnected){hideTooltip();return;}
    const label=target.dataset.tooltip||target.getAttribute('aria-label');if(!label)return;
    tooltip.textContent=label;tooltip.showPopover();
    const rect=target.getBoundingClientRect(),width=tooltip.offsetWidth,height=tooltip.offsetHeight;
    tooltip.style.left=Math.max(8,Math.min(rect.left+rect.width/2-width/2,innerWidth-width-8))+'px';
    tooltip.style.top=Math.max(8,rect.bottom+height+16>innerHeight?rect.top-height-8:rect.bottom+8)+'px';
    target.setAttribute('aria-describedby',[(target.getAttribute('aria-describedby')||''),tooltip.id].filter(Boolean).join(' '));
  },delay);
}
document.addEventListener('pointerover',e=>{if(e.pointerType!=='touch')queueTooltip(e.target.closest(tooltipSelector),350);});
document.addEventListener('pointerout',e=>{if(tooltipTarget&&!tooltipTarget.contains(e.relatedTarget))hideTooltip();});
document.addEventListener('focusin',e=>{if(e.target.matches(':focus-visible'))queueTooltip(e.target.closest(tooltipSelector),0);});
document.addEventListener('focusout',hideTooltip);
document.addEventListener('pointerdown',hideTooltip,true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')hideTooltip();},true);
document.addEventListener('scroll',hideTooltip,true);
window.addEventListener('resize',hideTooltip);
window.addEventListener('hashchange',hideTooltip);
new MutationObserver(()=>{if(tooltipTarget&&!tooltipTarget.isConnected)hideTooltip();}).observe(document.querySelector('main'),{childList:true,subtree:true});
