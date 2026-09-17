// Curated evergreen Louisburg identity experience.
// This complements the live feed; it does not replace the ORIGINALS backend designation.
(function(){
  if(document.getElementById('ll-only-overlay')) return;

  const fingerprints=[
    {icon:'🍎',cat:'Icons',title:'Louisburg Cider Mill',why:'A Louisburg landmark since 1977 and one of the town’s best-known regional destinations.',url:'https://www.louisburgcidermill.com/how-it-all-began'},
    {icon:'🍂',cat:'Traditions',title:'Ciderfest',why:'A fall Louisburg tradition since 1978 built around fresh cider, donuts, music, crafts and family activities.',url:'https://www.louisburgcidermill.com/ciderfest'},
    {icon:'🥤',cat:'Local Flavor',title:'Lost Trail Craft Soda',why:'Louisburg-brewed old-fashioned craft soda with a local family story tied to the Cider Mill.',url:'https://www.louisburgcidermill.com/wholesale/lost-trail-craft-soda'},
    {icon:'🔭',cat:'Icons',title:'Powell Observatory',why:'Home of the 30-inch Ruisinger telescope, one of the largest telescopes available for public viewing in a five-state area.',url:'https://www.askc.org/observatories/powell.html'},
    {icon:'☄️',cat:'Stories',title:'25890 Louisburg',why:'An asteroid was named Louisburg because the city is home to Powell Observatory.',url:'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=20025890'},
    {icon:'🏠',cat:'History',title:'The Little Round House',why:'A tiny Louisburg landmark that once served as a Kansas port-of-entry and inspection station before being restored at City Lake.',url:'https://www.louisburgkansas.gov/Facilities/Facility/Details/Ron-Weers-Park-10'},
    {icon:'💡',cat:'Wildcats',title:'Electric Light Show',why:'Miami County calls this a uniquely Louisburg tradition: the Wildcat band and dance team perform illuminated in neon before a fireworks finale.',url:'https://www.miamicountyks.gov/473/Louisburg-Area'},
    {icon:'🐾',cat:'Wildcats',title:'Wildcat Identity',why:'Purple, the Wildcats, school athletics, band and community school pride are woven deeply into Louisburg’s identity.',url:'https://www.usd416.org/'},
    {icon:'🎺',cat:'Traditions',title:'Labor Day Parade & Celebration',why:'The Broadway parade and American Legion Park celebration are a long-running hometown Labor Day tradition.',url:'https://www.miamicountyks.gov/473/Louisburg-Area'},
    {icon:'🏃',cat:'Traditions',title:'Cider Run & Fall Festival',why:'A downtown 5K, 10K and Kids Fun Run that ties Broadway directly into Louisburg’s fall cider season.',url:'https://www.louisburgkansas.com/louisburg-cider-run/'},
    {icon:'🇺🇸',cat:'Community',title:'Hometown Heroes',why:'Veteran banners displayed through historic downtown connect local military service stories to the streets of Louisburg.',url:'https://www.louisburgkansas.com/hometown-heroes/'},
    {icon:'🚘',cat:'Traditions',title:'Cruise the ’Burg',why:'The Louisburg Lions Club car show has become a long-running spring tradition centered on classic cars, trucks and motorcycles.',url:'https://www.miamicountyks.gov/473/Louisburg-Area'},
    {icon:'🎣',cat:'Traditions',title:'Louisburg Fishing Derby',why:'The Saturday-before-Father’s-Day youth fishing derby at City Lake is a recurring Louisburg community tradition.',url:'https://louisburgkansas.gov/234/Fishing-Derby'},
    {icon:'🎆',cat:'Traditions',title:'Freedom Fest',why:'Louisburg’s annual Fourth of July community celebration fills Lewis-Young Park before fireworks at dusk.',url:'https://louisburgkansas.gov/233/Freedom-Fest'},
    {icon:'✨',cat:'Traditions',title:'Holiday Magic on Broadway',why:'Downtown holiday activities, the Mayor’s tree lighting and the Light-Up Parade have become a winter Broadway tradition.',url:'https://www.miamicountyks.gov/473/Louisburg-Area'},
    {icon:'🎃',cat:'Seasonal',title:'Powell Pumpkin Patch',why:'A 35-acre pick-your-own pumpkin patch with a corn maze, free hayrides and a nature trail just outside town.',url:'https://powellpumpkinpatch.com/'},
    {icon:'🎄',cat:'Seasonal',title:'Pinestead Grove Farm',why:'The longtime Louisburg Christmas-tree-farm tradition continues on familiar land under its current Pinestead Grove name.',url:'https://www.pinesteadgrovefarm.com/'},
    {icon:'🐅',cat:'Icons',title:'Cedar Cove Conservation Center',why:'A Louisburg nonprofit wildlife sanctuary and education center built around endangered big-cat conservation.',url:'https://cedarcoveconservationcenter.org/'},
    {icon:'🏛️',cat:'History',title:'Historic Broadway',why:'Louisburg’s old commercial spine still carries buildings and stories from the town’s railroad, theater, school, church, service-station and gathering-place eras.',url:'https://www.louisburgkansas.gov/DocumentCenter/View/1468/Louisburg-History-Hunt-answers-PDF'},
    {icon:'🎭',cat:'History',title:'Fox Hall',why:'Donated to the city in 1952 for social, religious, civic and entertainment gatherings, Fox Hall remains a community room in the heart of downtown.',url:'https://louisburgkansas.gov/Facilities/Facility/Details/Fox-Hall-1'},
    {icon:'🛣️',cat:'History',title:'Frontier Military Scenic Byway',why:'US-69 along Louisburg follows the corridor of a military road built in the 1830s–1840s between frontier forts.',url:'https://louisburgkansas.gov/DocumentCenter/View/366/Louisburg-Comprehensive-Plan-12-4-17'},
    {icon:'🌳',cat:'Community',title:'Lewis-Young Park',why:'More than 200 acres of parkland donated for public enjoyment, now home to fields, trails, fishing, disc golf and Powell Observatory.',url:'https://louisburgkansas.gov/253/Lewis-Young-Park'},
    {icon:'🌊',cat:'Community',title:'City Lake & Ron Weers Park',why:'A 23-acre lake, walking loop, fishing, playground and the restored Little Round House make this one of Louisburg’s everyday gathering places.',url:'https://louisburgkansas.gov/Facilities/Facility/Details/City-Lake-9'},
    {icon:'⏳',cat:'Stories',title:'The 2068 Time Capsule',why:'Louisburg’s 2018 sesquicentennial reopened the centennial capsule and buried a new community time capsule to be opened in 2068.',url:'https://louisburgkansas.gov/247/More-About-Louisburg'},
    {icon:'🗞️',cat:'Stories',title:'Louisburg’s Newspaper Legacy',why:'The Louisburg Herald dates to 1876, leaving an unusually deep written record of local life and town history.',url:'https://chroniclingamerica.loc.gov/titles/places/kansas/Miami/'},
    {icon:'📍',cat:'Stories',title:'Why It Is Called Louisburg',why:'The town was known as St. Louis, New St. Louis and Little St. Louis before railroad confusion helped drive the change to Louisburg.',url:'https://louisburgkansas.gov/DocumentCenter/View/366/Louisburg-Comprehensive-Plan-12-4-17'}
  ];

  const style=document.createElement('style');
  style.id='ll-only-style';
  style.textContent=`
    .llOnlySheet{padding-top:14px}
    .llOnlyHero{background:linear-gradient(145deg,#251034,#4b216d);color:#fff;border-radius:20px;padding:18px;margin-bottom:13px;box-shadow:0 9px 23px rgba(50,20,71,.18)}
    .llOnlyHero .k{font-size:9px;font-weight:900;letter-spacing:.9px;text-transform:uppercase;opacity:.75;margin-bottom:6px}
    .llOnlyHero h2{font:800 29px/1.03 Georgia,serif;margin:0 0 7px}.llOnlyHero p{font-size:12px;line-height:1.48;margin:0;opacity:.9}
    .llOnlyMeta{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:8px 2px 11px;color:var(--muted);font-size:10px}
    .llOnlyFilters{display:flex;gap:6px;overflow:auto;padding:0 0 11px;scrollbar-width:none}.llOnlyFilters::-webkit-scrollbar{display:none}
    .llOnlyFilters button{border:1px solid #ddd2e2;background:#fff;color:var(--deep);border-radius:999px;padding:8px 10px;font-size:9px;font-weight:900;white-space:nowrap}
    .llOnlyFilters button.active{background:var(--deep);color:#fff;border-color:var(--deep)}
    .llOnlyGrid{display:grid;gap:9px}.llOnlyCard{background:#fff;border:1px solid #e1d7e5;border-left:4px solid var(--purple);border-radius:16px;padding:12px;box-shadow:0 5px 15px rgba(46,23,62,.045)}
    .llOnlyTop{display:grid;grid-template-columns:34px 1fr auto;gap:8px;align-items:start}.llOnlyIcon{font-size:21px;line-height:1}.llOnlyCard h3{font-size:14px;line-height:1.2;margin:0;color:var(--deep)}
    .llOnlyCat{font-size:8px;font-weight:900;background:#efe6f3;color:var(--purple);border-radius:999px;padding:4px 6px;white-space:nowrap}.llOnlyCard p{font-size:11px;line-height:1.45;color:#5f5862;margin:8px 0 0}
    .llOnlyCard a{display:inline-flex;margin-top:9px;font-size:9px;font-weight:900;color:var(--purple);text-decoration:none}.llOnlyCard a:after{content:' →'}
    .llOnlyLive{margin-top:15px;border-top:1px solid var(--line);padding-top:13px}.llOnlyLive h3{font:800 18px Georgia,serif;color:var(--deep);margin:0 0 6px}.llOnlyLive p{font-size:11px;line-height:1.45;color:var(--muted);margin:0}
    .llOnlyLiveList{display:grid;gap:7px;margin-top:9px}.llOnlyLiveItem{border:1px solid #e5dce8;background:#faf7fb;border-radius:13px;padding:9px}.llOnlyLiveItem b{display:block;font-size:11px;color:var(--deep);margin-bottom:2px}.llOnlyLiveItem span{font-size:9px;color:var(--muted)}
    @media(min-width:760px){.llOnlyGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `;
  document.head.appendChild(style);

  const trigger=document.querySelector('[data-more-cat="ORIGINALS"]');
  if(trigger){
    const b=trigger.querySelector('b'),s=trigger.querySelector('small');
    if(b)b.textContent='★ Only in Louisburg';
    if(s)s.textContent='Unique local places, traditions and experiences';
  }

  const overlay=document.createElement('div');
  overlay.className='overlay';
  overlay.id='ll-only-overlay';
  overlay.innerHTML=`<div class="sheet llOnlySheet" role="dialog" aria-modal="true" aria-labelledby="llOnlyTitle">
    <div class="sheetHead"><h2 id="llOnlyTitle">Only in Louisburg</h2><button class="close" type="button" aria-label="Close">×</button></div>
    <div class="llOnlyHero"><div class="k">The Louisburg fingerprint</div><h2>Only in Louisburg</h2><p>The places, traditions, local stories and experiences that make Louisburg feel like Louisburg. This is a permanent local guide — not just today’s feed.</p></div>
    <div class="llOnlyMeta"><span id="llOnlyCount"></span><span>Verified public sources</span></div>
    <div class="llOnlyFilters" id="llOnlyFilters"></div>
    <div class="llOnlyGrid" id="llOnlyGrid"></div>
    <div class="llOnlyLive"><h3>Happening now</h3><p>Current posts carrying the Louisburg-original designation appear here when something tied to the town’s fingerprint is active.</p><div class="llOnlyLiveList" id="llOnlyLiveList"></div></div>
  </div>`;
  document.body.appendChild(overlay);

  const cats=['All',...new Set(fingerprints.map(x=>x.cat))];
  let chosen='All';
  const filters=overlay.querySelector('#llOnlyFilters'),grid=overlay.querySelector('#llOnlyGrid'),count=overlay.querySelector('#llOnlyCount'),live=overlay.querySelector('#llOnlyLiveList');
  filters.innerHTML=cats.map((c,i)=>`<button type="button" class="${i===0?'active':''}" data-only-cat="${c}">${c}</button>`).join('');

  function render(){
    const arr=chosen==='All'?fingerprints:fingerprints.filter(x=>x.cat===chosen);
    count.textContent=`${arr.length} ${arr.length===1?'fingerprint':'fingerprints'}`;
    grid.innerHTML=arr.map(x=>`<article class="llOnlyCard"><div class="llOnlyTop"><div class="llOnlyIcon">${x.icon}</div><h3>${x.title}</h3><span class="llOnlyCat">${x.cat}</span></div><p>${x.why}</p><a href="${x.url}" target="_blank" rel="noopener noreferrer">Verified source</a></article>`).join('');
    renderLive();
  }

  function renderLive(){
    try{
      const items=(typeof state!=='undefined'&&state&&Array.isArray(state.items))?state.items:[];
      const current=items.filter(i=>{
        const ds=Array.isArray(i.designations)?i.designations:[];
        const ts=String(i.tags||'').toLowerCase();
        const isOriginal=ds.includes('LOUISBURG_ORIGINAL')||ts.split(/\s+/).includes('louisburg-original');
        return isOriginal&&(typeof fresh==='function'?fresh(i):true);
      }).slice(0,6);
      live.innerHTML=current.length?current.map(i=>`<div class="llOnlyLiveItem"><b>${String(i.headline||i.organization||'Louisburg update')}</b><span>${String(i.organization||'Louisburg')} · ${String(i.date||'current')}</span></div>`).join(''):'<div class="llOnlyLiveItem"><b>No designated activity right now.</b><span>The permanent Louisburg guide above stays available every day.</span></div>';
    }catch(e){
      live.innerHTML='<div class="llOnlyLiveItem"><b>Permanent guide available.</b><span>Current related activity will appear here when available.</span></div>';
    }
  }

  filters.addEventListener('click',e=>{
    const b=e.target.closest('[data-only-cat]');if(!b)return;
    chosen=b.dataset.onlyCat;
    filters.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));
    render();
  });

  const close=()=>overlay.classList.remove('open');
  overlay.querySelector('.close').addEventListener('click',close);
  overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))close()});

  if(trigger){
    trigger.onclick=e=>{e.preventDefault();e.stopPropagation();render();overlay.classList.add('open')};
  }

  render();
})();
