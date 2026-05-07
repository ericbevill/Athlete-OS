(function(){
  const KEY = 'andreea-athlete-os-pro-v1';
  const data0 = window.AOS_DEFAULT_DATA;
  const options = window.AOS_OPTIONS;
  let state = loadState();
  let activePage = 'dashboard';
  let calendarDate = new Date();
  let selectedDoc = state.documents?.selected || 'developmentPlan';
  let selectedSponsorEmail = '';

  const pages = [
    ['dashboard','Dashboard'], ['profile','Profile'], ['career','Career'], ['calendar','Calendar'], ['tournaments','Tournaments'], ['rankings','Rankings'], ['budget','Budget'], ['sponsors','Sponsors'], ['documents','Documents'], ['settings','Settings']
  ];
  const documents = [
    ['developmentPlan','Development Plan','Season strategy, profile, goals, calendar, and budget.'],
    ['athleteProfile','Athlete Profile / Media Kit','Sponsor-ready short profile for sharing.'],
    ['sponsorIntro','Local Sponsor Email','Intro email filled from sponsor and athlete data.'],
    ['sponsorProposal','Sponsor Proposal One-Pager','Ask, package, deliverables, and use of funds.'],
    ['tournamentBrief','Tournament Travel Brief','Selected next event, purpose, schedule, and budget.'],
    ['calendarOnePager','Tournament Calendar One-Pager','Upcoming season schedule for family and sponsors.'],
    ['budgetRequest','Budget Request','Specific funding needs by category.'],
    ['sponsorUpdate','Sponsor Update','Progress note for current sponsors.'],
    ['thankYou','Sponsor Thank You Email','Post-commitment or post-event thank-you.'],
    ['agreementSummary','Sponsor Agreement Summary','Plain-English tracker for contract terms.']
  ];

  const $ = (s,p=document)=>p.querySelector(s);
  const $$ = (s,p=document)=>Array.from(p.querySelectorAll(s));
  const esc = v => String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const attr = v => esc(v).replace(/`/g,'&#96;');
  const money = v => new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(v||0));
  const dateText = v => v ? new Date(v+'T00:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : 'TBD';
  const clone = v => JSON.parse(JSON.stringify(v));
  const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

  function loadState(){ try { return JSON.parse(localStorage.getItem(KEY)) || clone(data0); } catch { return clone(data0); } }
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
  function athleteName(){ const a=state.athlete; return `${a.firstName||''} ${a.lastName||''}`.trim() || a.displayName || 'Andreea Olariu'; }
  function totalBudget(){ return state.budget.reduce((s,b)=>s+Number(b.amount||0),0); }
  function totalSponsorAsk(){ return state.sponsors.reduce((s,b)=>s+Number(b.ask||0),0); }
  function nextTournament(){ return state.tournaments.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled' && t.status !== 'Skipped').sort((a,b)=>(a.start||'9999').localeCompare(b.start||'9999'))[0] || state.tournaments.sort((a,b)=>(a.start||'9999').localeCompare(b.start||'9999'))[0]; }
  function latestRanking(){ return state.rankings.find(r=>r.system === 'ITF Junior Ranking') || state.rankings[0]; }

  function render(){
    save();
    renderNav(); renderHero(); renderDashboard(); renderProfile(); renderCareer(); renderCalendar(); renderTournaments(); renderRankings(); renderBudget(); renderSponsors(); renderDocumentTiles(); renderDocumentPreview();
  }

  function renderNav(){
    const desktop = $('#desktopNav'); desktop.innerHTML = pages.map(([id,label])=>`<button data-page="${id}" class="${activePage===id?'active':''}">${label}</button>`).join('');
    const mobile = $('#mobileNav'); mobile.innerHTML = pages.map(([id,label])=>`<option value="${id}" ${activePage===id?'selected':''}>${label}</option>`).join('');
    $('#mobileName').textContent = athleteName();
    $$('.page').forEach(p => p.classList.toggle('active', p.dataset.page === activePage));
  }

  function renderHero(){
    const a = state.athlete, next = nextTournament();
    $('#heroName').textContent = athleteName();
    $('#sideName').textContent = athleteName().split(' ')[0] || 'Andreea';
    $('#sideSub').textContent = `${a.sport || 'Tennis'} · ${a.city || 'Romania'}`;
    $('#heroStory').textContent = a.heroSummary || a.sponsorStory || '';
    $('#heroMeta').innerHTML = [
      ['Sport',a.sport], ['Base',a.city], ['Ranking',a.currentRankingLabel], ['Target',a.targetRanking]
    ].map(([k,v])=>`<div class="metaItem"><span>${esc(k)}</span><strong>${esc(v||'TBD')}</strong></div>`).join('');
    $('#heroFigure').src = a.cutoutPath || 'assets/andreea-cutout.png';
    $('#heroFigure').onerror = function(){ this.style.display = 'none'; };
    $('#dashboardStats').innerHTML = [
      ['Tournaments', state.tournaments.length, 'Tracked events across ITF, Tennis Europe, FRT, and training blocks.'],
      ['Annual budget', money(totalBudget()), 'Training, travel, equipment, recovery, and competition plan.'],
      ['Sponsor pipeline', money(totalSponsorAsk()), `${state.sponsors.length} prospects, asks, or active sponsor records.`],
      ['Ranking target', a.targetRanking || 'TBD', a.currentRankingLabel || 'Current ranking not entered.']
    ].map(([k,v,p])=>`<div class="statCard"><span>${esc(k)}</span><strong>${esc(v)}</strong><p>${esc(p)}</p></div>`).join('');
  }

  function renderDashboard(){
    const next = nextTournament();
    $('#nextTournamentCard').innerHTML = next ? `
      <h4>Next tournament focus</h4>
      <div class="scoreMain">${esc(next.name)}</div>
      <div class="scoreMeta">${dateText(next.start)} to ${dateText(next.end)} · ${esc(next.city || 'TBD')}, ${esc(next.country || '')}</div>
      <div class="scoreMetrics">
        <div><span>Track</span><strong>${esc(next.track || 'TBD')}</strong></div>
        <div><span>Level</span><strong>${esc(next.level || 'TBD')}</strong></div>
        <div><span>Budget</span><strong>${money(next.budget)}</strong></div>
      </div>` : '<h4>Next tournament focus</h4><div class="scoreMain">Add event</div>';
    const ranks = state.rankings.slice(0,5);
    $('#rankingLadder').innerHTML = `<h4>Ranking board</h4>${ranks.map(r=>{
      const n = Number(r.numericValue || 0); const pct = n ? Math.max(4, Math.min(100, 100 - (n/700*100))) : 12;
      return `<div class="ladderItem"><div>${esc(r.system)}</div><div class="ladderTrack"><div class="ladderFill" style="width:${pct}%"></div></div><strong>${esc(r.value)}</strong></div>`;
    }).join('')}`;
    $('#upcomingRows').innerHTML = state.tournaments.slice().sort((a,b)=>(a.start||'9999').localeCompare(b.start||'9999')).slice(0,8).map(t=>`
      <tr><td>${esc(t.name)}</td><td>${dateText(t.start)} - ${dateText(t.end)}</td><td>${esc(t.track)}</td><td>${esc(t.level)}</td><td>${statusTag(t.status)}</td><td>${money(t.budget)}</td></tr>`).join('');
  }

  function renderProfile(){
    const a = state.athlete;
    const fields = [
      ['firstName','First name','text','w3'], ['lastName','Last name','text','w3'], ['displayName','Display name','text','w3'], ['country','Country','text','w3'],
      ['city','Base city','text','w3'], ['sport','Sport','text','w3'], ['handedness','Handedness','text','w3'], ['birthDate','Birth date','date','w3'],
      ['ageCategory','Current category','select','w3', options.ageCategories], ['coach','Coach','text','w3'], ['club','Club','text','w3'], ['height','Height','text','w3'],
      ['currentRankingLabel','Current ranking label','text','w6'], ['careerHighLabel','Career high label','text','w3'], ['targetRanking','Target ranking','text','w3'],
      ['wtaStatus','WTA status','text','w6'], ['contactName','Contact name','text','w3'], ['contactEmail','Contact email','email','w3'],
      ['heroSummary','Hero summary','textarea','w12'], ['sponsorStory','Sponsor story','textarea','w12'], ['goal12Months','12-month goal','textarea','w6'], ['developmentNeeds','Development priorities','textarea','w6'], ['strengths','Strengths','textarea','w6'], ['sourceNote','Source note','textarea','w6'],
      ['cutoutPath','Cutout PNG path','text','w6'], ['backgroundPath','Background image path','text','w6']
    ];
    $('#profileForm').innerHTML = fields.map(f => fieldHtml('athlete', f[0], f[1], a[f[0]], f[2], f[3], null, f[4])).join('');
  }

  function renderCareer(){
    $('#careerTimeline').innerHTML = state.milestones.slice().sort((a,b)=>(b.date||b.year||'').localeCompare(a.date||a.year||'')).map(m=>`
      <div class="timelineItem">
        <div class="timelineDate">${esc(m.date ? dateText(m.date) : m.year)}</div>
        <div class="timelineBody"><h4>${esc(m.title)}</h4><p>${esc(m.description)}</p><div class="timelineMeta">${statusTag(m.type)}${m.result?`<span class="tag blue">${esc(m.result)}</span>`:''}${m.source?`<span class="tag gold">${esc(m.source)}</span>`:''}</div></div>
      </div>`).join('');
    $('#milestoneEditor').innerHTML = state.milestones.map((m,i)=>editCard('milestone', i, m.title, m.type, [
      ['year','Year','text','w2'], ['date','Exact date','date','w3'], ['type','Type','text','w3'], ['result','Result','text','w4'], ['title','Title','text','w12'], ['description','Description','textarea','w12'], ['source','Source / verification note','text','w12']
    ])).join('');
  }

  function renderCalendar(){
    const title = calendarDate.toLocaleDateString('en-GB',{month:'long',year:'numeric'});
    $('#calendarTitle').textContent = title;
    const y = calendarDate.getFullYear(), m = calendarDate.getMonth();
    const first = new Date(y,m,1); const start = new Date(first); start.setDate(first.getDate() - ((first.getDay()+6)%7));
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    let html = days.map(d=>`<div class="calHead">${d}</div>`).join('');
    for(let i=0;i<42;i++){
      const d = new Date(start); d.setDate(start.getDate()+i);
      const iso = d.toISOString().slice(0,10);
      const events = calendarEventsFor(iso);
      html += `<div class="calDay ${d.getMonth()!==m?'mutedDay':''}"><div class="calDate">${d.getDate()}</div>${events.map(e=>`<span class="calEvent">${esc(e)}</span>`).join('')}</div>`;
    }
    $('#calendarGrid').innerHTML = html;
  }

  function calendarEventsFor(iso){
    const events=[];
    state.tournaments.forEach(t=>{ if(t.start && t.end && iso>=t.start && iso<=t.end) events.push(`${t.level}: ${t.name}`); else if(t.start===iso) events.push(`${t.level}: ${t.name}`); });
    state.sponsors.forEach(s=>{ if(s.renewalDate===iso) events.push(`Sponsor renewal: ${s.company}`); });
    state.milestones.forEach(m=>{ if(m.date===iso) events.push(`Milestone: ${m.title}`); });
    return events.slice(0,3);
  }

  function renderTournaments(){
    $('#tournamentEditor').innerHTML = state.tournaments.map((t,i)=>editCard('tournament', i, t.name, `${t.track} · ${t.level}`, [
      ['name','Tournament / event name','text','w6'], ['track','Track','select','w6',options.tournamentTracks], ['level','Level','select','w3',options.tournamentLevels], ['ageCategory','Age category','select','w3',options.ageCategories], ['surface','Surface','select','w3',options.surfaces], ['priority','Priority','select','w3',options.priorities], ['start','Start date','date','w3'], ['end','End date','date','w3'], ['city','City','text','w3'], ['country','Country','text','w3'], ['status','Status','select','w3',options.statuses], ['budget','Budget EUR','number','w3'], ['result','Result','text','w6'], ['notes','Notes / purpose','textarea','w12']
    ])).join('');
  }

  function renderRankings(){
    $('#rankingEditor').innerHTML = state.rankings.map((r,i)=>editCard('ranking', i, r.system, `${r.category} · ${r.value}`, [
      ['system','Ranking system','select','w4',options.rankingSystems], ['category','Category','select','w3',options.ageCategories], ['date','Date','date','w2'], ['value','Display value','text','w3'], ['numericValue','Numeric value','number','w3'], ['note','Note','textarea','w9']
    ])).join('');
  }

  function renderBudget(){
    $('#budgetRows').innerHTML = state.budget.map((b,i)=>`
      <tr><td>${cellInput('budget',i,'category',b.category,'select',options.budgetCategories)}</td><td>${cellInput('budget',i,'description',b.description)}</td><td>${cellInput('budget',i,'amount',b.amount,'number')}</td><td>${cellInput('budget',i,'status',b.status)}</td><td>${cellInput('budget',i,'fundingTarget',b.fundingTarget,'select',options.sponsorPackages)}</td></tr>`).join('');
  }

  function renderSponsors(){
    $('#sponsorEditor').innerHTML = state.sponsors.map((s,i)=>editCard('sponsor', i, s.company, `${s.stage} · ${money(s.ask)} · ${s.contractStatus}`, [
      ['company','Company','text','w4'], ['contactName','Contact name','text','w4'], ['email','Email','email','w4'], ['phone','Phone','text','w3'], ['category','Category','text','w3'], ['package','Package','select','w3',options.sponsorPackages], ['ask','Ask EUR','number','w3'], ['stage','Stage','select','w3',options.sponsorStages], ['contractStatus','Contract status','select','w3',options.contractStatuses], ['renewalDate','Renewal / follow-up date','date','w3'], ['nextAction','Next action','text','w12'], ['value','Value proposition','textarea','w6'], ['deliverables','Deliverables / obligations','textarea','w6'], ['notes','Notes','textarea','w12']
    ])).join('');
    const sel = $('#sponsorSelect');
    sel.innerHTML = state.sponsors.map((s,i)=>`<option value="${i}" ${i===state.documents.selectedSponsorIndex?'selected':''}>${esc(s.company)}</option>`).join('');
    $('#sponsorTemplateSelect').value = state.documents.selectedSponsorTemplate || 'intro';
    if(!selectedSponsorEmail) selectedSponsorEmail = buildSponsorEmail(Number(sel.value||0), $('#sponsorTemplateSelect').value).body;
    $('#sponsorEmailOutput').innerHTML = textDocHtml('Generated Sponsor Email', '', selectedSponsorEmail);
  }

  function renderDocumentTiles(){
    $('#documentGrid').innerHTML = documents.map(([id,title,desc])=>`<div class="docTile ${selectedDoc===id?'active':''}" data-doc="${id}"><span>${id.replace(/[A-Z]/g,m=>' '+m).trim()}</span><strong>${esc(title)}</strong><p>${esc(desc)}</p></div>`).join('');
  }

  function renderDocumentPreview(){
    const doc = buildDocument(selectedDoc);
    $('#docTitle').textContent = doc.title;
    $('#docSubtitle').textContent = doc.subtitle || 'Generated from dashboard data.';
    $('#documentPreview').innerHTML = doc.sections ? docHtml(doc) : textDocHtml(doc.title, doc.subtitle, doc.body || '');
  }

  function buildDocument(id){
    const a=state.athlete, name=athleteName(), next=nextTournament(), budget=totalBudget(), sponsor=state.sponsors[state.documents.selectedSponsorIndex || 0] || state.sponsors[0] || {};
    const upcoming = state.tournaments.slice().sort((x,y)=>(x.start||'9999').localeCompare(y.start||'9999')).slice(0,8);
    const milestones = state.milestones.slice().sort((x,y)=>(y.date||y.year||'').localeCompare(x.date||x.year||'')).slice(0,6);
    const commonSub = `${name} · ${a.sport} · ${a.city}`;
    const docs = {
      developmentPlan: {title:'Athlete Development Plan', subtitle:commonSub, sections:[
        ['Profile', `${a.sponsorStory}\n\nCurrent: ${a.currentRankingLabel}. Career high: ${a.careerHighLabel}. Target: ${a.targetRanking}.`],
        ['12-month objective', a.goal12Months], ['Strengths', a.strengths], ['Development priorities', a.developmentNeeds],
        ['Tournament roadmap', upcoming.map(t=>`${dateText(t.start)}: ${t.name} · ${t.level} · ${t.city}, ${t.country} · ${money(t.budget)} · ${t.status}`).join('\n')],
        ['Budget summary', `Current planned season need: ${money(budget)}. Budget includes ${state.budget.map(b=>b.category).filter((v,i,a)=>a.indexOf(v)===i).join(', ')}.`]
      ]},
      athleteProfile: {title:'Athlete Profile / Media Kit', subtitle:commonSub, sections:[
        ['Short bio', a.sponsorStory], ['Career highlights', milestones.map(m=>`${m.year}: ${m.title} · ${m.result}`).join('\n')], ['Ranking and pathway', `${a.currentRankingLabel}\n${a.careerHighLabel}\n${a.wtaStatus}\nTarget: ${a.targetRanking}`], ['Sponsor fit', 'A local or regional partner can support specific costs, receive progress updates, and be associated with a disciplined Romanian junior athlete pathway.']
      ]},
      sponsorIntro: buildSponsorEmail(state.documents.selectedSponsorIndex || 0, 'intro'),
      sponsorProposal: {title:'Sponsor Proposal One-Pager', subtitle:`Prepared for ${sponsor.company || 'Sponsor'}`, sections:[
        ['Opportunity', `${sponsor.company || 'The sponsor'} can support ${name} through a ${sponsor.package || 'sponsorship'} package.`], ['Suggested ask', `${money(sponsor.ask || Math.ceil(budget/3))}`], ['Use of funds', state.budget.map(b=>`${b.category}: ${b.description} · ${money(b.amount)}`).join('\n')], ['Deliverables', sponsor.deliverables || 'Progress updates, recognition where appropriate, and transparent reporting.'], ['Next action', sponsor.nextAction || 'Schedule a short call.']
      ]},
      tournamentBrief: {title:'Tournament Travel Brief', subtitle: next ? `${next.name} · ${dateText(next.start)} to ${dateText(next.end)}` : 'No event selected', sections:[
        ['Event', next ? `${next.name}\n${next.track}\n${next.level} · ${next.ageCategory}\n${next.city}, ${next.country}\nSurface: ${next.surface}` : 'Add a tournament.'], ['Purpose', next?.notes || 'Ranking-targeted competition block.'], ['Budget', money(next?.budget || 0)], ['Result / post-event notes', next?.result || 'To be completed after event.']
      ]},
      calendarOnePager: {title:'Tournament Calendar One-Pager', subtitle:commonSub, sections:[
        ['Calendar', upcoming.map(t=>`${dateText(t.start)} - ${dateText(t.end)} · ${t.name} · ${t.level} · ${t.status} · ${money(t.budget)}`).join('\n')], ['Planning note', 'Use this one-pager to discuss the next competition block with family, coaches, and sponsors.']
      ]},
      budgetRequest: {title:'Budget Request', subtitle:`Current planned need: ${money(budget)}`, sections:[
        ['Funding needs', state.budget.map(b=>`${b.category}: ${b.description} · ${money(b.amount)} · ${b.status}`).join('\n')], ['Sponsor-ready packages', `Tournament trip sponsor: ${money(1500)}\nMonthly training sponsor: ${money(600)}\nEquipment sponsor: ${money(250)}\nSeason partner: ${money(4500)}`]
      ]},
      sponsorUpdate: {title:'Sponsor Update', subtitle:`Progress note for ${sponsor.company || 'Sponsor'}`, sections:[
        ['Overview', `${name} continues to work toward: ${a.goal12Months}`], ['Recent highlights', milestones.slice(0,3).map(m=>`${m.title}: ${m.result}`).join('\n')], ['Current focus', a.developmentNeeds], ['Upcoming calendar', upcoming.slice(0,4).map(t=>`${dateText(t.start)}: ${t.name} · ${t.level}`).join('\n')], ['Thank you', `Thank you for supporting ${name}'s development pathway.`]
      ]},
      thankYou: buildSponsorEmail(state.documents.selectedSponsorIndex || 0, 'thankyou'),
      agreementSummary: {title:'Sponsor Agreement Summary', subtitle:`${sponsor.company || 'Sponsor'} · ${sponsor.contractStatus || 'No status'}`, sections:[
        ['Sponsor', `${sponsor.company || ''}\nContact: ${sponsor.contactName || ''}\nEmail: ${sponsor.email || ''}`], ['Package and ask', `${sponsor.package || ''}\nAsk / committed value: ${money(sponsor.ask || 0)}`], ['Deliverables', sponsor.deliverables || 'Add deliverables.'], ['Contract status', `${sponsor.contractStatus || 'No agreement'}\nRenewal / follow-up: ${sponsor.renewalDate || 'TBD'}`], ['Notes', sponsor.notes || '']
      ]}
    };
    return docs[id] || docs.developmentPlan;
  }

  function buildSponsorEmail(index, type){
    const a=state.athlete, s=state.sponsors[index] || {}, name=athleteName(), next=nextTournament();
    const salutation = s.contactName || '[Name]';
    const bodies = {
      intro: {title:'Local Sponsor Email', subtitle:`Prepared for ${s.company || 'Sponsor'}`, body:`Subject: Local sponsorship opportunity for ${name}\n\nHi ${salutation},\n\nI am reaching out because we are building a clear development and support plan for ${name}, a Romanian junior tennis player based in ${a.city}.\n\n${a.sponsorStory}\n\nThe current 12-month objective is: ${a.goal12Months}\n\nWe are looking for partners who want to support a specific and transparent athlete pathway. A sponsorship could support a tournament trip, a monthly training block, equipment, or a larger season package. The current planned budget is ${money(totalBudget())}.\n\nFor ${s.company || 'your company'}, the most natural package may be: ${s.package || 'Tournament trip sponsor'} at approximately ${money(s.ask || 0)}.\n\nIn return, we can provide professional progress updates, sponsor recognition where appropriate, and transparent reporting on how the support is used.\n\nWould you be open to a 15-minute conversation next week?\n\nBest,\n${a.contactName || '[Your Name]'}`},
      followup: {title:'Sponsor Follow-Up Email', subtitle:`Prepared for ${s.company || 'Sponsor'}`, body:`Subject: Following up on Andreea Olariu sponsorship idea\n\nHi ${salutation},\n\nI wanted to follow up on the idea of ${s.company || 'your company'} supporting ${name}'s junior tennis development.\n\nThe next concrete focus is ${next ? `${next.name} (${dateText(next.start)}, ${next.level})` : 'the next tournament block'}, and the sponsorship ask we are currently modeling is ${money(s.ask || 0)}.\n\nThis is designed to be specific and measurable: support tied to training, tournament travel, equipment, and sponsor updates rather than a vague request.\n\nWould a short call this week or next be possible?\n\nBest,\n${a.contactName || '[Your Name]'}`},
      update: {title:'Sponsor Update Email', subtitle:`Prepared for ${s.company || 'Sponsor'}`, body:`Subject: ${name} progress update\n\nHi ${salutation},\n\nHere is a quick update on ${name}'s tennis pathway.\n\nCurrent focus: ${a.goal12Months}\n\nRecent highlights:\n${state.milestones.slice(0,3).map(m=>`- ${m.title}: ${m.result}`).join('\n')}\n\nUpcoming schedule:\n${state.tournaments.slice(0,4).map(t=>`- ${dateText(t.start)}: ${t.name} (${t.level}, ${t.status})`).join('\n')}\n\nThank you for supporting this development pathway.\n\nBest,\n${a.contactName || '[Your Name]'}`},
      thankyou: {title:'Sponsor Thank You Email', subtitle:`Prepared for ${s.company || 'Sponsor'}`, body:`Subject: Thank you for supporting ${name}\n\nHi ${salutation},\n\nThank you for supporting ${name}'s tennis development. Your support helps cover real development costs and gives us a stronger foundation for tournament planning, training, and sponsor reporting.\n\nWe will keep the updates specific and transparent: calendar, use of funds, progress, results, and the next development priority.\n\nThank you again,\n${a.contactName || '[Your Name]'}`}
    };
    return bodies[type] || bodies.intro;
  }

  function fieldHtml(scope,key,label,value,type='text',width='w4',index=null,opts=null){
    const dataAttrs = `data-scope="${scope}" data-key="${key}" ${index!==null?`data-index="${index}"`:''}`;
    let input = '';
    if(type==='textarea') input = `<textarea ${dataAttrs}>${esc(value)}</textarea>`;
    else if(type==='select') input = `<select ${dataAttrs}>${(opts||[]).map(o=>`<option value="${attr(o)}" ${o===value?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
    else input = `<input type="${type}" ${dataAttrs} value="${attr(value)}">`;
    return `<div class="field ${width}"><label>${esc(label)}</label>${input}</div>`;
  }
  function cellInput(scope,index,key,value,type='text',opts=null){
    if(type==='select') return `<select data-scope="${scope}" data-index="${index}" data-key="${key}">${(opts||[]).map(o=>`<option value="${attr(o)}" ${o===value?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
    return `<input type="${type}" data-scope="${scope}" data-index="${index}" data-key="${key}" value="${attr(value)}">`;
  }
  function editCard(scope,index,title,sub,fields){
    const obj = collection(scope)[index];
    return `<div class="editCard"><div class="editCardHead"><div><h4>${esc(title || 'New item')}</h4><p>${esc(sub || '')}</p></div><button class="button ghost small" data-remove="${scope}" data-index="${index}">Remove</button></div><div class="formGrid">${fields.map(f=>fieldHtml(scope,f[0],f[1],obj[f[0]],f[2],f[3],index,f[4])).join('')}</div></div>`;
  }
  function collection(scope){ return scope==='tournament'?state.tournaments:scope==='ranking'?state.rankings:scope==='budget'?state.budget:scope==='sponsor'?state.sponsors:scope==='milestone'?state.milestones:[]; }
  function statusTag(v){ const s=String(v||''); const cls = /confirm|active|champion|signed|completed/i.test(s)?'green':/research|shortlist|prospect|planned/i.test(s)?'blue':/need|final|target/i.test(s)?'gold':'blue'; return `<span class="tag ${cls}">${esc(s)}</span>`; }
  function docHtml(doc){ return `<h1>${esc(doc.title)}</h1><div class="sub">${esc(doc.subtitle || '')}</div>${doc.sections.map(([h,b])=>`<section class="docSec"><h4>${esc(h)}</h4><p>${esc(b)}</p></section>`).join('')}`; }
  function textDocHtml(title,sub,body){ return `<h1>${esc(title)}</h1>${sub?`<div class="sub">${esc(sub)}</div>`:''}<section class="docSec"><p>${esc(body)}</p></section>`; }
  function currentDocText(){ const doc=buildDocument(selectedDoc); if(doc.body) return `${doc.title}\n${doc.subtitle || ''}\n\n${doc.body}`; return `${doc.title}\n${doc.subtitle || ''}\n\n${doc.sections.map(([h,b])=>`${h}\n${b}`).join('\n\n')}`; }

  document.addEventListener('click', e=>{
    const pageBtn = e.target.closest('[data-page]');
    if(pageBtn && pageBtn.closest('#desktopNav')) { activePage = pageBtn.dataset.page; render(); window.scrollTo(0,0); }
    const jump = e.target.closest('[data-jump]'); if(jump){ activePage = jump.dataset.jump; render(); window.scrollTo(0,0); }
    const docTile = e.target.closest('[data-doc]'); if(docTile){ selectedDoc = docTile.dataset.doc; state.documents.selected = selectedDoc; render(); }
    const remove = e.target.closest('[data-remove]'); if(remove){ const col=collection(remove.dataset.remove); if(col.length>1 || confirm('Remove this only item?')){ col.splice(Number(remove.dataset.index),1); render(); } }
  });
  $('#mobileNav').addEventListener('change', e=>{ activePage=e.target.value; render(); window.scrollTo(0,0); });
  document.addEventListener('input', e=>{
    const el=e.target; const {scope,key,index}=el.dataset; if(!scope || !key) return;
    const value = el.type==='number' ? Number(el.value || 0) : el.value;
    if(scope==='athlete') state.athlete[key] = value; else collection(scope)[Number(index)][key]=value;
    render();
  });
  $('#addTournament').onclick = ()=>{ state.tournaments.push({name:'New tournament',track:'ITF World Tennis Tour Juniors',level:'J60',ageCategory:'ITF Juniors',start:'',end:'',city:'',country:'',surface:'Clay',status:'Researching',priority:'B',budget:0,result:'',notes:''}); render(); };
  $('#addRanking').onclick = ()=>{ state.rankings.push({system:'ITF Junior Ranking',category:'ITF Juniors',date:new Date().toISOString().slice(0,10),value:'',numericValue:'',note:''}); render(); };
  $('#addBudget').onclick = ()=>{ state.budget.push({category:'Coaching',description:'New budget item',amount:0,status:'Planned',fundingTarget:'Monthly training sponsor'}); render(); };
  $('#addSponsor').onclick = ()=>{ state.sponsors.push({company:'New Sponsor Prospect',contactName:'',email:'',phone:'',category:'Local Sponsor',package:'Tournament trip sponsor',ask:1000,stage:'Prospect',contractStatus:'No agreement',nextAction:'Research contact',renewalDate:'',deliverables:'',value:'',notes:''}); render(); };
  $('#addMilestone').onclick = ()=>{ state.milestones.push({year:String(new Date().getFullYear()),date:'',type:'Result',title:'New milestone',result:'',description:'',source:''}); render(); };
  $('#prevMonth').onclick = ()=>{ calendarDate.setMonth(calendarDate.getMonth()-1); renderCalendar(); };
  $('#nextMonth').onclick = ()=>{ calendarDate.setMonth(calendarDate.getMonth()+1); renderCalendar(); };
  $('#sponsorSelect').addEventListener('change', e=>{ state.documents.selectedSponsorIndex = Number(e.target.value); selectedSponsorEmail = buildSponsorEmail(state.documents.selectedSponsorIndex, $('#sponsorTemplateSelect').value).body; render(); });
  $('#sponsorTemplateSelect').addEventListener('change', e=>{ state.documents.selectedSponsorTemplate = e.target.value; selectedSponsorEmail = buildSponsorEmail(state.documents.selectedSponsorIndex || 0, e.target.value).body; render(); });
  $('#generateSponsorEmail').onclick = ()=>{ selectedSponsorEmail = buildSponsorEmail(state.documents.selectedSponsorIndex || 0, state.documents.selectedSponsorTemplate || 'intro').body; render(); };
  $('#copySponsorEmail').onclick = async()=>{ await navigator.clipboard.writeText(selectedSponsorEmail || ''); alert('Sponsor email copied.'); };
  $('#printSponsorEmail').onclick = ()=>{ selectedDoc = 'sponsorIntro'; activePage='documents'; render(); setTimeout(()=>window.print(),100); };
  $('#printDocument').onclick = ()=>window.print();
  $('#copyDocument').onclick = async()=>{ await navigator.clipboard.writeText(currentDocText()); alert('Document copied.'); };
  $('#downloadDocument').onclick = ()=>{ const doc=buildDocument(selectedDoc); const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(doc.title)}</title></head><body>${$('#documentPreview').innerHTML}</body></html>`; const blob=new Blob([html],{type:'text/html'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${slug(doc.title)}.html`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),500); };
  $('#exportJson').onclick = ()=>{ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='andreea-athlete-os-backup.json'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),500); };
  $('#importJson').addEventListener('change', async e=>{ const f=e.target.files[0]; if(!f) return; try{ state=JSON.parse(await f.text()); render(); alert('Backup imported.'); } catch { alert('Could not import JSON.'); } e.target.value=''; });
  $('#resetData').onclick = ()=>{ if(confirm('Reset to preloaded Andreea data?')){ state=clone(data0); selectedSponsorEmail=''; render(); } };

  render();
})();
