import { chromium } from 'playwright';

const ROOT='https://louisburglocalks.com/';
const EXPECTED_REPO='brewandbrewscompany-bot/louisburg-local-web';
const EXPECTED_BUILD='20260918-r39';
const errors=[];
const check=(ok,msg)=>{ if(!ok) errors.push(msg); };

async function waitForProduction(page,name){
  for(let i=0;i<36;i++){
    const repo=await page.locator('meta[name="ll-production-repo"]').getAttribute('content').catch(()=>null);
    const build=await page.locator('meta[name="ll-production-build"]').getAttribute('content').catch(()=>null);
    if(repo===EXPECTED_REPO && build===EXPECTED_BUILD) return true;
    await page.waitForTimeout(5000);
    await page.reload({waitUntil:'domcontentloaded',timeout:45000}).catch(()=>{});
  }
  errors.push(name+': custom domain never reached '+EXPECTED_BUILD);
  return false;
}

async function visibleFeedMismatches(frame,predicate){
  return frame.locator('#feed .feedCard:visible').evaluateAll((cards,src)=>{
    const fn=new Function('item','win','return ('+src+')(item,win)');
    return cards.filter(card=>{
      const item=window.findItem&&window.findItem(card.dataset.id);
      return !item || !fn(item,window);
    }).map(card=>card.dataset.id);
  },predicate.toString());
}

async function inspect(viewport,name){
  const browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport,isMobile:name==='mobile',hasTouch:name==='mobile'});
  const page=await context.newPage();
  try{
    await page.goto(ROOT,{waitUntil:'domcontentloaded',timeout:45000});
    if(!await waitForProduction(page,name)) return;

    check((await page.title()).includes('Louisburg Local'),name+': wrong title');
    check(await page.locator('meta[name="theme-color"][content="#4b216d"]').count()===1,name+': PWA theme color missing');
    check(await page.locator('link[rel="manifest"][href="/manifest.webmanifest"]').count()===1,name+': PWA manifest link missing');
    const manifestResp=await context.request.get(ROOT+'manifest.webmanifest');
    check(manifestResp.ok(),name+': manifest.webmanifest not reachable');
    if(manifestResp.ok()){
      const manifest=await manifestResp.json();
      check(manifest.theme_color==='#4b216d',name+': manifest theme_color mismatch');
      check(manifest.background_color==='#4b216d',name+': manifest background_color mismatch');
      check(manifest.display==='standalone',name+': manifest display is not standalone');
    }
    check(await page.locator('#v4frame').count()===1,name+': production iframe missing');
    check((await page.locator('.menuVisit span').innerText()).toLowerCase().includes('unique visitors'),name+': counter label is not unique visitors');
    check(await page.locator('#shareApproxArea').count()===0,name+': removed geography button returned');
    check((await page.content()).includes('G-P37SNQNJN1'),name+': GA4 measurement ID missing from production source');
    check(await page.locator('script[src*="googletagmanager.com/gtag/js"]').count()===1,name+': standard GA4 loader missing');
    check(await page.locator('body').evaluate(()=>!window.dataLayer?.some(x=>Array.isArray(x)&&x[0]==='config'&&x[1]==='G-P37SNQNJN1')),name+': smoke traffic configured GA4');
    check(await page.locator('body').evaluate(()=>navigator.webdriver===true),name+': smoke browser is not flagged automated');

    const drawerWidth=await page.locator('#rightDrawer').evaluate(el=>el.getBoundingClientRect().width);
    if(name==='mobile') check(drawerWidth<=320 && drawerWidth<=viewport.width*.76,name+': filter drawer too wide: '+drawerWidth);
    else check(drawerWidth<=330,name+': desktop filter drawer too wide: '+drawerWidth);

    const robots=await context.request.get(ROOT+'robots.txt');
    check(robots.ok(),name+': robots.txt not reachable');
    if(robots.ok()) check((await robots.text()).includes('Sitemap: https://louisburglocalks.com/sitemap.xml'),name+': robots sitemap declaration missing');

    const sitemap=await context.request.get(ROOT+'sitemap.xml');
    check(sitemap.ok(),name+': sitemap.xml not reachable');
    if(sitemap.ok()){
      const xml=await sitemap.text();
      check(xml.includes('<loc>https://louisburglocalks.com/</loc>'),name+': homepage missing from sitemap');
      check(xml.includes('/about.html</loc>'),name+': About missing from sitemap');
      check(xml.includes('/web-v4/history.html</loc>'),name+': History missing from sitemap');
    }

    const verify=await context.request.get(ROOT+'googled3854f03f7860ff5.html');
    check(verify.ok(),name+': Google verification file not reachable');

    const frame=page.frameLocator('#v4frame');
    await frame.locator('body').waitFor({state:'visible',timeout:30000});

    let feedStatus='';
    for(let i=0;i<80;i++){
      feedStatus=await frame.locator('#feedStatus').innerText().catch(()=> '');
      if(/^live\s*·/i.test(feedStatus)) break;
      await page.waitForTimeout(500);
    }
    check(/^live\s*·/i.test(feedStatus),name+': feed did not reach live state: '+feedStatus);
    check(await frame.locator('#homeScreen .feedCard').count()>0,name+': home feed has no cards');

    const quick=frame.locator('#v5QuickStrip');
    await quick.waitFor({state:'visible',timeout:20000});
    for(const key of ['ALL','TODAY','FAVORITES','DEALS','EVENTS','FOOD','FAMILY','SPORTS','HIRING']){
      check(await quick.locator('[data-v5-quick="'+key+'"]').count()===1,name+': missing quick '+key);
    }

    const deals=quick.locator('[data-v5-quick="DEALS"]');
    await deals.click();
    await page.waitForTimeout(350);
    check(await deals.getAttribute('aria-pressed')==='true',name+': Deals did not remain selected');
    const purple=await deals.evaluate(el=>getComputedStyle(el).backgroundColor);
    check(purple==='rgb(75, 33, 109)',name+': Deals selected color is '+purple);
    const dealState=await frame.locator('body').evaluate(()=>window.LLUI?.getSelection?.());
    check(dealState?.cat==='DEALS' && dealState?.section==='ALL' && dealState?.source==='',name+': Deals state mismatch '+JSON.stringify(dealState));
    const badDeals=await visibleFeedMismatches(frame,(item,win)=>win.catMatch&&win.catMatch(item,'DEALS'));
    check(badDeals.length===0,name+': Deals leaked non-deal cards: '+badDeals.join(','));

    const today=quick.locator('[data-v5-quick="TODAY"]');
    await today.click();
    await page.waitForTimeout(350);
    check(await today.getAttribute('aria-pressed')==='true',name+': Today did not remain selected');
    const todayPurple=await today.evaluate(el=>getComputedStyle(el).backgroundColor);
    check(todayPurple==='rgb(75, 33, 109)',name+': Today selected color is '+todayPurple);
    const todayState=await frame.locator('body').evaluate(()=>window.LLUI?.getSelection?.());
    check(todayState?.cat==='ALL' && todayState?.section==='TODAY',name+': Today state mismatch '+JSON.stringify(todayState));
    const badToday=await visibleFeedMismatches(frame,(item,win)=>String(item.date||'').slice(0,10)===win.lbToday() && win.sectionMatch(item,'TODAY'));
    check(badToday.length===0,name+': Today leaked non-today cards: '+badToday.join(','));

    const topFilter=frame.locator('#v5TopFilter');
    check(await topFilter.count()===1,name+': filter button missing');
    if(await topFilter.count()) await topFilter.click();
    await page.locator('#rightDrawer').waitFor({state:'visible',timeout:5000});
    await page.locator('#categoryChoices [data-filter-cat="EVENTS"]').click();
    await page.locator('#timeChoices [data-filter-time="TODAY"]').click();
    await page.locator('#sourceChoices [data-filter-source="Facebook"]').click();
    await page.waitForTimeout(250);
    const drawerState=await frame.locator('body').evaluate(()=>window.LLUI?.getSelection?.());
    check(drawerState?.cat==='EVENTS' && drawerState?.section==='TODAY' && drawerState?.source==='Facebook',name+': drawer state mismatch '+JSON.stringify(drawerState));
    const badDrawer=await visibleFeedMismatches(frame,(item,win)=>win.catMatch(item,'EVENTS') && win.sectionMatch(item,'TODAY') && String(item.date||'').slice(0,10)===win.lbToday() && win.sourceName(item)==='Facebook');
    check(badDrawer.length===0,name+': combined drawer filters leaked cards: '+badDrawer.join(','));
    await page.locator('#rightDrawer .close').click();

    const all=quick.locator('[data-v5-quick="ALL"]');
    await all.click();
    await page.waitForTimeout(250);
    check(await all.getAttribute('aria-pressed')==='true',name+': All did not become selected');
    const resetState=await frame.locator('body').evaluate(()=>window.LLUI?.getSelection?.());
    check(resetState?.cat==='ALL' && resetState?.section==='ALL' && resetState?.source==='',name+': quick All did not reset state '+JSON.stringify(resetState));
    check(await page.locator('#categoryChoices .choice.active').getAttribute('data-filter-cat')==='ALL',name+': drawer category did not reset');
    check(await page.locator('#timeChoices .choice.active').getAttribute('data-filter-time')==='ALL',name+': drawer time did not reset');
    check(await page.locator('#sourceChoices .choice.active').getAttribute('data-filter-source')==='',name+': drawer source did not reset');

    for(const [screen,selector] of [['directory','.directoryCard'],['events','.eventCard'],['favorites','#favoritesScreen'],['more','#moreScreen']]){
      const button=name==='desktop'
        ? frame.locator('#v5PrimaryNav [data-v5-nav="'+screen+'"]')
        : frame.locator('.bottom [data-nav="'+screen+'"]');
      check(await button.count()===1,name+': '+screen+' nav missing');
      if(await button.count()){
        await button.click();
        await page.waitForTimeout(300);
        if(screen==='favorites'||screen==='more') check(await frame.locator(selector).evaluate(el=>el.classList.contains('active')).catch(()=>false),name+': '+screen+' did not activate');
        else check(await frame.locator(selector).count()>0 || await frame.locator('#'+screen+'Screen .empty').count()>0,name+': '+screen+' did not render');
      }
    }

    const homeButton=name==='desktop'
      ? frame.locator('#v5PrimaryNav [data-v5-nav="home"]')
      : frame.locator('.bottom [data-nav="home"]');
    await homeButton.click();
    await page.waitForTimeout(250);

    const search=frame.locator('#v5TopSearch');
    check(await search.count()===1,name+': search button missing');
    if(await search.count()){
      // Global/top search must route to the Directory when Directory is active.
      const directoryButton=name==='desktop'
        ? frame.locator('#v5PrimaryNav [data-v5-nav="directory"]')
        : frame.locator('.bottom [data-nav="directory"]');
      await directoryButton.click();
      await page.waitForTimeout(250);
      await search.click();
      const input=frame.locator('#v5SearchInput');
      await input.fill('Woolwork');
      await page.waitForTimeout(350);
      check((await frame.locator('#directorySearch').inputValue()).toLowerCase()==='woolwork',name+': top search did not route to Directory search');
      const wool=frame.locator('#directoryList .directoryCard:visible h3');
      const names=await wool.allTextContents();
      check(names.some(v=>/WoolWorks/i.test(v)),name+': WoolWorks was not found from Directory search');
      check(names.length===1,name+': Directory search leaked unrelated listings: '+names.join(' | '));
      await input.fill('');
      await page.waitForTimeout(200);
      await frame.locator('#v5SearchClose').click();

      // Home/global search must still route to current activity when Home is active.
      const homeButton2=name==='desktop'
        ? frame.locator('#v5PrimaryNav [data-v5-nav="home"]')
        : frame.locator('.bottom [data-nav="home"]');
      await homeButton2.click();
      await page.waitForTimeout(200);
      await search.click();
      await input.fill('Louisburg');
      await page.waitForTimeout(250);
      check((await frame.locator('#homeSearch').inputValue())==='Louisburg',name+': top search did not route back to Home search');
      await frame.locator('#v5SearchClose').click();
    }

    // Detail -> Local Profile must remain in-app and must not trigger a history-back to Home.
    const detailCard=frame.locator('#feed .feedCard[data-id]').first();
    if(await detailCard.count()){
      const detailId=await detailCard.getAttribute('data-id');
      const detailButton=detailCard.locator('[data-detail]').first();
      if(await detailButton.count()) await detailButton.click();
      else await detailCard.click();
      await frame.locator('#detailOverlay.open').waitFor({state:'visible',timeout:5000});
      const profileLink=frame.locator('#detailOverlay [data-profile-link]').first();
      check(await profileLink.count()===1,name+': Local profile link missing from Post Details');
      if(await profileLink.count()){
        await profileLink.click();
        await page.waitForTimeout(250);
        check(await frame.locator('#profileOverlay').evaluate(el=>el.classList.contains('open')).catch(()=>false),name+': Local profile did not open');
        check(!await frame.locator('#detailOverlay').evaluate(el=>el.classList.contains('open')).catch(()=>true),name+': Post Details stayed open behind Local profile');
        const screenAfterProfile=await frame.locator('body').evaluate(()=>window.LLUI?.getSelection?.().screen);
        check(screenAfterProfile==='home',name+': Local profile changed underlying feed screen unexpectedly: '+screenAfterProfile);
        const profileTitle=await frame.locator('#profileContent .profileIdentity h2').innerText().catch(()=> '');
        check(profileTitle.trim().length>0,name+': Local profile content did not render');
        const profileFav=frame.locator('#profileContent [data-id] [data-favorite]').first();
        if(await profileFav.count()){
          const beforeFav=await profileFav.getAttribute('aria-pressed');
          await profileFav.click();
          await page.waitForTimeout(100);
          const afterFav=await profileFav.getAttribute('aria-pressed');
          check(afterFav!==beforeFav,name+': Local Profile favorite did not toggle');
          await profileFav.click();
          await page.waitForTimeout(100);
          check(await profileFav.getAttribute('aria-pressed')===beforeFav,name+': Local Profile favorite did not toggle back');
        }
        await frame.locator('#profileOverlay [data-close]').click();
        await page.waitForTimeout(150);
      }
    }

    const media=frame.locator('#feed .feedCard .media[data-image-zoom]').first();
    if(await media.count()){
      await media.click();
      await page.waitForTimeout(200);
      check(await frame.locator('#imageZoomOverlay').evaluate(el=>el.classList.contains('open')).catch(()=>false),name+': image zoom did not open');
      check(await page.locator('body').evaluate(el=>el.classList.contains('flyoutsLocked')).catch(()=>false),name+': flyouts not locked during image zoom');
      await frame.locator('.imageZoomClose').click();
      await page.waitForTimeout(150);
      check(!await page.locator('body').evaluate(el=>el.classList.contains('flyoutsLocked')).catch(()=>true),name+': flyouts stayed locked after image close');
    }

    if(name==='mobile'){
      const width=await frame.locator('body').evaluate(el=>el.scrollWidth);
      check(width<=viewport.width+4,name+': horizontal overflow '+width+' > '+viewport.width);
      check(await frame.locator('.bottom').count()===1,name+': mobile bottom navigation missing');
    }

    // History must open as a top-level page and remain indexable.
    const historyResp=await context.request.get(ROOT+'web-v4/history.html');
    check(historyResp.ok(),name+': history page not reachable');
    if(historyResp.ok()){
      const html=await historyResp.text();
      check(/rel="canonical" href="https:\/\/louisburglocalks\.com\/web-v4\/history\.html"/i.test(html),name+': history canonical missing');
    }

  }catch(err){
    errors.push(name+': uncaught smoke error: '+String(err?.stack||err));
  }finally{
    await browser.close();
  }
}

await inspect({width:1440,height:1000},'desktop');
await inspect({width:390,height:844},'mobile');

if(errors.length){
  console.error('LOUISBURG LOCAL PRODUCTION SMOKE FAILED');
  for(const e of errors) console.error('- '+e);
  process.exit(1);
}
console.log('LOUISBURG LOCAL PRODUCTION SMOKE PASSED: custom domain, SEO files, live feed, purple quick filters, strict Today, combined drawer filters, navigation, search, image zoom, mobile layout, and history.');
