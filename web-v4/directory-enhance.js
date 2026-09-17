// Louisburg Local V4 enhancement loader.
// Keeps the verified-directory enhancement intact while adding the About Louisburg Local experience.
(function(){
  function installAbout(){
    if(document.getElementById('ll-about-card')) return;

    const moreGrid=document.querySelector('#moreScreen .moreGrid');
    if(!moreGrid) return;

    if(!document.getElementById('ll-about-style')){
      const style=document.createElement('style');
      style.id='ll-about-style';
      style.textContent=`
        .llAboutCard{grid-column:1/-1;min-height:112px;background:linear-gradient(135deg,var(--deep2),var(--purple));color:#fff;border:0;border-radius:20px;padding:17px 18px;text-align:left;box-shadow:0 10px 24px rgba(50,20,71,.18);position:relative;overflow:hidden}
        .llAboutCard:after{content:"";position:absolute;width:150px;height:150px;border-radius:50%;right:-54px;top:-78px;background:rgba(255,255,255,.08)}
        .llAboutCard b{display:block;color:#fff;font:800 21px/1.12 Georgia,serif;margin:0 0 7px;position:relative;z-index:1}
        .llAboutCard small{display:block;color:rgba(255,255,255,.82);font-size:12px;line-height:1.42;max-width:520px;position:relative;z-index:1}
        .llAboutSheet{padding-top:14px}
        .llAboutHero{background:linear-gradient(135deg,var(--deep2),var(--purple));color:#fff;border-radius:19px;padding:18px;margin-bottom:14px;box-shadow:0 8px 20px rgba(50,20,71,.16)}
        .llAboutKicker{font-size:9px;font-weight:900;letter-spacing:.9px;text-transform:uppercase;opacity:.78;margin-bottom:6px}
        .llAboutHero h2{font:800 29px/1.04 Georgia,serif;margin:0 0 7px}
        .llAboutHero p{margin:0;font-size:13px;line-height:1.48;opacity:.9}
        .llAboutSection{border-top:1px solid var(--line);padding:14px 2px}
        .llAboutSection:first-of-type{border-top:0}
        .llAboutSection h3{font:800 18px Georgia,serif;color:var(--deep);margin:0 0 8px}
        .llAboutSection p{margin:0;color:#514a55;font-size:13px;line-height:1.55}
        .llAboutRows{display:grid;gap:8px;margin-top:9px}
        .llAboutRow{display:grid;grid-template-columns:34px 1fr;gap:9px;align-items:start;background:#faf7fb;border:1px solid #e7deea;border-radius:14px;padding:10px}
        .llAboutRow i{font-style:normal;font-size:18px;line-height:1}
        .llAboutRow b{display:block;color:var(--deep);font-size:12px;margin-bottom:2px}
        .llAboutRow span{display:block;color:var(--muted);font-size:11px;line-height:1.4}
        .llAboutNote{background:#f1e9f5;border-left:4px solid var(--purple);border-radius:13px;padding:11px 12px;color:#4d4152;font-size:11px;line-height:1.5}
        .llAboutVersion{text-align:center;color:var(--muted);font-size:9px;padding:5px 0 2px}
      `;
      document.head.appendChild(style);
    }

    const card=document.createElement('button');
    card.id='ll-about-card';
    card.type='button';
    card.className='llAboutCard';
    card.setAttribute('aria-haspopup','dialog');
    card.innerHTML='<b>ⓘ About Louisburg Local</b><small>What the app is, how it works and where the information comes from.</small>';
    moreGrid.prepend(card);

    const overlay=document.createElement('div');
    overlay.className='overlay';
    overlay.id='aboutOverlay';
    overlay.innerHTML=`<div class="sheet llAboutSheet" role="dialog" aria-modal="true" aria-labelledby="llAboutTitle">
      <div class="sheetHead"><h2 id="llAboutTitle">About the app</h2><button class="close" type="button" aria-label="Close">×</button></div>
      <div class="llAboutHero">
        <div class="llAboutKicker">Louisburg, Kansas · Community hub</div>
        <h2>Louisburg Local</h2>
        <p>One place to see what is happening around Louisburg — current local activity, businesses, events, deals, community information and more.</p>
      </div>
      <div class="llAboutSection">
        <h3>Built for Louisburg</h3>
        <p>Louisburg Local is an independent community project created to make local information easier to find. Instead of checking dozens of websites and public pages, the app brings useful Louisburg activity together in one simple local feed.</p>
        <div class="llAboutRows">
          <div class="llAboutRow"><i>⚡</i><div><b>Current local activity</b><span>Fresh posts, specials, events, openings, notices and other timely updates.</span></div></div>
          <div class="llAboutRow"><i>✓</i><div><b>Verified local directory</b><span>Louisburg businesses and organizations remain findable even when they have nothing new to post.</span></div></div>
          <div class="llAboutRow"><i>⌖</i><div><b>Louisburg first</b><span>The app is focused on Louisburg, Kansas and filters out unrelated places and stale activity.</span></div></div>
        </div>
      </div>
      <div class="llAboutSection">
        <h3>Where the information comes from</h3>
        <p>Louisburg Local gathers information from verified public sources such as first-party business and organization websites, public social posts, schools, city and community sources, calendars and other publicly available local information. Current, exact first-party sources are preferred whenever they are available.</p>
      </div>
      <div class="llAboutSection">
        <h3>How the live feed stays useful</h3>
        <p>Current activity is checked for the correct organization, Louisburg relevance, timing and duplicates before it is eligible for the live feed. Time-sensitive items are allowed to expire when they are over so yesterday's activity does not look like today's.</p>
      </div>
      <div class="llAboutSection">
        <h3>Open to the community</h3>
        <p>Residents can browse without creating an account. A business, nonprofit, church, club, school or service provider does not have to submit a post to be included in the verified directory when reliable public information is available.</p>
      </div>
      <div class="llAboutNote"><b>Independent community project.</b> Louisburg Local is not an official City of Louisburg or USD 416 website, and inclusion of a business or organization does not imply endorsement.</div>
      <div class="llAboutVersion">Louisburg Local · V5</div>
    </div>`;
    document.body.appendChild(overlay);

    const close=()=>overlay.classList.remove('open');
    card.addEventListener('click',()=>overlay.classList.add('open'));
    overlay.querySelector('.close').addEventListener('click',close);
    overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))close()});

    // V5 flyout About should open this panel directly, not just the More screen.
    try{
      const p=window.parent;
      if(p&&p!==window&&p.document){
        // Keep one Louisburg Local brand title in the drawer and the close button at the right.
        const leftHead=p.document.querySelector('#leftDrawer .drawerHead');
        const duplicateTitle=leftHead&&leftHead.querySelector('h2');
        if(duplicateTitle) duplicateTitle.remove();
        if(leftHead){
          leftHead.style.justifyContent='flex-end';
          leftHead.style.marginBottom='2px';
        }

        const about=[...p.document.querySelectorAll('.navButton')].find(b=>/About Louisburg Local/i.test(b.textContent||''));
        if(about){
          about.removeAttribute('data-screen');
          about.onclick=e=>{
            e.preventDefault();
            if(typeof p.showScreen==='function') p.showScreen('more');
            else{
              const more=document.querySelector('[data-nav="more"]');
              if(more) more.click();
              if(typeof p.closeDrawers==='function') p.closeDrawers(false);
            }
            setTimeout(()=>card.click(),40);
          };
        }
      }
    }catch(e){}
  }

  const core=document.createElement('script');
  core.src='directory-enhance-core.js?v=about-20260916';
  core.onload=installAbout;
  core.onerror=installAbout;
  document.head.appendChild(core);
})();
