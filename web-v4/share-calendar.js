(()=>{
  if(window.__llShareCalendarInstalled)return;
  window.__llShareCalendarInstalled=true;

  const appHosts=/louisburglocalks\.com|brewandbrewscompany-bot\.github\.io/i;

  function getItem(id){
    try{
      if(typeof window.findItem==='function'){
        const x=window.findItem(id);
        if(x)return x;
      }
      if(typeof window.favoriteItems==='function'){
        return (window.favoriteItems()||[]).find(x=>String(x.id)===String(id))||null;
      }
    }catch(e){}
    return null;
  }

  function sourceUrl(i){
    const u=String(i&&i.originalUrl||'').trim();
    return /^https?:\/\//i.test(u)&&!appHosts.test(u)?u:'';
  }

  function shareText(i){
    const parts=[
      i.headline||i.organization||'Louisburg update',
      i.organization||'',
      [i.date,i.time,i.location].filter(Boolean).join(' · '),
      i.summary||''
    ].filter(Boolean);
    const u=sourceUrl(i);
    if(u)parts.push(u);
    return parts.join('\n\n');
  }

  async function shareItem(i){
    if(!i)return;
    const title=i.headline||i.organization||'Louisburg update';
    const text=shareText(i);
    if(navigator.share){
      try{
        await navigator.share({title,text});
        return;
      }catch(e){
        if(e&&e.name==='AbortError')return;
      }
    }
    try{
      await navigator.clipboard.writeText(text);
      alert('Copied — paste it into text, email, Facebook, Messenger, or anywhere you want.');
    }catch(e){
      window.prompt('Copy and share this:',text);
    }
  }

  function escICS(v){
    return String(v??'')
      .replace(/\\/g,'\\\\')
      .replace(/\r?\n/g,'\\n')
      .replace(/,/g,'\\,')
      .replace(/;/g,'\\;');
  }
  const pad=n=>String(n).padStart(2,'0');

  function parseClock(v){
    const s=String(v||'').trim();
    let m=s.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
    if(!m)return null;
    let h=Number(m[1]),min=Number(m[2]||0);
    if(m[3]){
      h%=12;
      if(m[3].toUpperCase()==='PM')h+=12;
    }
    if(h>23||min>59)return null;
    return {h,min};
  }

  function calendarRange(i){
    const d=String(i.date||'').slice(0,10);
    const dm=d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(!dm)return null;
    const y=Number(dm[1]),mo=Number(dm[2]),day=Number(dm[3]);
    const raw=String(i.time||'').trim();
    if(!raw)return {allDay:true,start:dm[1]+dm[2]+dm[3]};
    const parts=raw.split(/\s*(?:-|–|—|to)\s*/i).filter(Boolean);
    const a=parseClock(parts[0]),b=parts[1]?parseClock(parts[1]):null;
    if(!a)return {allDay:true,start:dm[1]+dm[2]+dm[3]};
    const start=new Date(y,mo-1,day,a.h,a.min,0);
    const end=b?new Date(y,mo-1,day,b.h,b.min,0):new Date(start.getTime()+3600000);
    if(end<=start)end.setDate(end.getDate()+1);
    const fmt=x=>''+x.getFullYear()+pad(x.getMonth()+1)+pad(x.getDate())+'T'+pad(x.getHours())+pad(x.getMinutes())+'00';
    return {allDay:false,start:fmt(start),end:fmt(end)};
  }

  function addToCalendar(i){
    if(!i)return;
    const r=calendarRange(i);
    if(!r){
      alert('This item does not have a usable event date yet.');
      return;
    }
    const title=i.headline||i.organization||'Louisburg event';
    const desc=[i.organization||'',i.summary||''].filter(Boolean).join('\n\n');
    const lines=[
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Louisburg Local//Personal Calendar Export//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:'+escICS(String(i.id||Date.now()))+'@louisburg',
      'DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z'),
      'SUMMARY:'+escICS(title)
    ];
    if(r.allDay){
      const y=Number(r.start.slice(0,4)),mo=Number(r.start.slice(4,6)),d=Number(r.start.slice(6,8));
      const n=new Date(y,mo-1,d);n.setDate(n.getDate()+1);
      lines.push('DTSTART;VALUE=DATE:'+r.start);
      lines.push('DTEND;VALUE=DATE:'+n.getFullYear()+pad(n.getMonth()+1)+pad(n.getDate()));
    }else{
      lines.push('DTSTART;TZID=America/Chicago:'+r.start);
      lines.push('DTEND;TZID=America/Chicago:'+r.end);
    }
    if(i.location)lines.push('LOCATION:'+escICS(i.location));
    if(desc)lines.push('DESCRIPTION:'+escICS(desc));
    lines.push('END:VEVENT','END:VCALENDAR');

    const blob=new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download=(String(title).replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'')||'event')+'.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
  }

  function makeButton(label,attr){
    const b=document.createElement('button');
    b.type='button';
    b.textContent=label;
    b.setAttribute(attr,'');
    return b;
  }

  function decorateCards(root=document){
    root.querySelectorAll('.eventCard[data-id] .miniActions').forEach(a=>{
      if(!a.querySelector('[data-ll-calendar]'))a.appendChild(makeButton('📅 Calendar','data-ll-calendar'));
      if(!a.querySelector('[data-ll-share]'))a.appendChild(makeButton('↗ Share','data-ll-share'));
    });
    root.querySelectorAll('.dealCard[data-id] .miniActions').forEach(a=>{
      if(!a.querySelector('[data-ll-share]'))a.appendChild(makeButton('↗ Share','data-ll-share'));
    });
    root.querySelectorAll('.feedCard[data-id] .actions').forEach(a=>{
      if(!a.querySelector('[data-ll-share]')){
        const b=makeButton('↗ Share','data-ll-share');
        const detail=a.querySelector('[data-detail]');
        detail?a.insertBefore(b,detail):a.appendChild(b);
      }
    });
  }

  function decorateDetail(i){
    const c=document.getElementById('detailContent');
    if(!c||!i)return;
    let actions=c.querySelector('.profileActions');
    if(!actions){
      actions=document.createElement('div');
      actions.className='profileActions';
      c.appendChild(actions);
    }
    const old=actions.querySelector('[data-copy]');
    if(old)old.remove();

    if(typeof window.catMatch==='function'&&window.catMatch(i,'EVENTS')&&!actions.querySelector('[data-ll-calendar-detail]')){
      const a=document.createElement('a');
      a.href='#';a.textContent='📅 Add to calendar';a.setAttribute('data-ll-calendar-detail','');a.dataset.itemId=i.id;
      actions.insertBefore(a,actions.firstChild);
    }
    if(!actions.querySelector('[data-ll-share-detail]')){
      const a=document.createElement('a');
      a.href='#';a.textContent='↗ Share';a.setAttribute('data-ll-share-detail','');a.dataset.itemId=i.id;
      const afterCal=actions.querySelector('[data-ll-calendar-detail]');
      afterCal&&afterCal.nextSibling?actions.insertBefore(a,afterCal.nextSibling):actions.appendChild(a);
    }
  }

  try{
    if(typeof window.openDetail==='function'&&!window.openDetail.__llWrapped){
      const original=window.openDetail;
      const wrapped=function(i){
        original(i);
        setTimeout(()=>decorateDetail(i),0);
      };
      wrapped.__llWrapped=true;
      window.openDetail=wrapped;
    }
  }catch(e){}

  document.addEventListener('click',async e=>{
    const share=e.target.closest('[data-ll-share]');
    if(share){
      const card=share.closest('[data-id]');
      if(!card)return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      await shareItem(getItem(card.dataset.id));
      return;
    }
    const cal=e.target.closest('[data-ll-calendar]');
    if(cal){
      const card=cal.closest('[data-id]');
      if(!card)return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      addToCalendar(getItem(card.dataset.id));
      return;
    }
    const sd=e.target.closest('[data-ll-share-detail]');
    if(sd){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      await shareItem(getItem(sd.dataset.itemId));
      return;
    }
    const cd=e.target.closest('[data-ll-calendar-detail]');
    if(cd){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      addToCalendar(getItem(cd.dataset.itemId));
    }
  },true);

  decorateCards();
  new MutationObserver(()=>decorateCards()).observe(document.body,{childList:true,subtree:true});
})();