const TABS = ['dashboard','profile','career','calendar','tournaments','rankings','budget','sponsors','documents','settings'];
const RANKING_SYSTEMS = ['ITF Junior','Tennis Europe','FRT Romania','WTA','UTR','WTN'];
const CATEGORIES = ['Girls 18U','U16','U14','U12','Open','Professional'];
const LEVELS = ['ITF Junior J30','ITF Junior J60','ITF Junior J100','ITF Junior J200','ITF Junior J300','ITF Junior J500','Junior Grand Slam','Tennis Europe U12','Tennis Europe U14','Tennis Europe U16','FRT U12','FRT U14','FRT U16','FRT U18','W15','W35','Training','Sponsor/Admin'];
const SURFACES = ['Clay','Hard','Indoor','Grass','Carpet'];
const STATUS = ['Research','Acceptance list','Target','Planned','Confirmed','Active','Completed','Skipped'];
const PRIORITY = ['A','B','C','Watch'];
const SPONSOR_STAGE = ['Research','Prospect','Contacted','Meeting','Proposal sent','Negotiating','Committed','Active','Completed','Renewal','Closed lost'];
const CONTRACT_STATUS = ['Not started','Drafting','Sent','Signed','Expired','Cancelled'];
const PAYMENT_STATUS = ['Not invoiced','Invoice scheduled','Invoiced','Partially paid','Paid','Overdue'];
const BUDGET_STATUS = ['Needed','Planned','Quoted','Committed','Paid'];
const CAREER_TYPES = ['Trophy','Final','Semifinal','Ranking','Tournament','Training','Sponsor','Media','Other'];
const BUDGET_CATEGORIES = ['Entry fee','Travel','Lodging','Meals','Coach travel','Coaching','Equipment','Strings','Physio / recovery','Local transport','Training block','Emergency buffer','Other'];
const SPONSORED_ITEMS = {
  'Tournament travel': {deliverables:'Pre-event tournament brief, post-event result update, expense summary, thank-you email', advice:'Attach the Tournament Travel Brief and Budget Request. Best for local companies, service businesses, and family/community brands.'},
  'Coaching block': {deliverables:'Training plan summary, monthly progress note, coach update, thank-you email', advice:'Attach the Athlete Development Plan and Budget Request. Best for sponsors who want to fund measurable progress.'},
  'Equipment package': {deliverables:'Photo update, equipment use summary, thank-you email, monthly progress note', advice:'Attach the Athlete Profile / Media Kit and Local Sponsor Email. Keep the ask smaller and concrete.'},
  'Recovery / physio': {deliverables:'Recovery support summary, monthly update, thank-you email', advice:'Attach the Development Plan and explain performance protection, injury prevention, and tournament readiness.'},
  'Season partner': {deliverables:'Monthly sponsor update, quarterly progress report, season review, agreed recognition, renewal conversation', advice:'Attach the Corporate Sponsorship Proposal, Season Budget Overview, and Athlete Profile / Media Kit.'},
  'Local prep block': {deliverables:'Training block update, photo if appropriate, thank-you email', advice:'Attach the Local Sponsor Email and Athlete Profile. Best for small local businesses and warm introductions.'}
};
const KEY = 'andreea-os-v4-clean';
let state = load();
let active = 'dashboard';

function id(){ return Math.random().toString(36).slice(2,10); }
function clone(v){ return JSON.parse(JSON.stringify(v)); }
function todayParts(){ const now = new Date(); return {year: now.getFullYear(), month: now.getMonth()}; }
function createDefaultState(){
  const now = todayParts();
  const t1=id(), t2=id(), t3=id(), t4=id(), t5=id(), t6=id();
  return {
    athlete:{
      firstName:'Andreea', lastName:'Olariu', sport:'Tennis', city:'Timișoara, Romania', country:'Romania', age:'16',
      club:'Sport 4 Fun Timișoara', coach:'TBD', school:'TBD', rankingSystem:'ITF Junior', ranking:'503', careerHigh:'464', seasonHigh:'491', rankingGoal:'Top 300 ITF Junior',
      summary:'Andreea Olariu is a Romanian junior tennis player from Timișoara competing on the international junior pathway. The operating focus is simple: build the right tournament schedule, fund the travel and training load, track ranking progress, and give sponsors a clear, credible athlete story to support.',
      strengths:'International junior tournament experience, proven doubles results in J60 events, competitive clay-court pathway, coachable profile, and a clear family commitment behind the tennis project.',
      needs:'Funded tournament travel, planned training blocks, recovery support, equipment support, sponsor reporting, and a disciplined calendar that prioritizes events with ranking and development value.',
      cutout:'assets/andreea-cutout.png', background:'assets/andreea-bg.jpg'
    },
    career:[
      {id:id(), date:'2025', type:'Trophy', title:'J60 Ulcinj doubles champion', body:'Won a J60 doubles title during a strong Montenegro competition block.'},
      {id:id(), date:'2025', type:'Trophy', title:'J60 Podgorica doubles champion', body:'Added another J60 doubles trophy in Podgorica, reinforcing international junior credibility.'},
      {id:id(), date:'2025', type:'Final', title:'Podgorica singles finalist', body:'Reached a singles final in the Montenegro swing, showing singles progression alongside doubles success.'},
      {id:id(), date:'2026', type:'Ranking', title:'ITF Junior ranking path', body:'Current ITF Junior ranking tracked at 503 with career high 464 and season high 491.'}
    ],
    tournaments:[
      {id:t1, name:'J60 Frederiksberg', start:'2026-02-09', end:'2026-02-15', track:'ITF Junior', level:'ITF Junior J60', surface:'Indoor', city:'Copenhagen', country:'Denmark', status:'Completed', priority:'B', result:'Played 2026 J60 indoor event.'},
      {id:t2, name:'J60 Larnaca', start:'2026-03-02', end:'2026-03-08', track:'ITF Junior', level:'ITF Junior J60', surface:'Hard', city:'Larnaca', country:'Cyprus', status:'Completed', priority:'B', result:'Played 2026 J60 event at Herodotou Tennis Academy.'},
      {id:t3, name:'J60 Dunakeszi', start:'2026-05-05', end:'2026-05-11', track:'ITF Junior', level:'ITF Junior J60', surface:'Clay', city:'Dunakeszi', country:'Hungary', status:'Active', priority:'A', result:'Current tournament block.'},
      {id:t4, name:'J60 Ulcinj', start:'2026-05-11', end:'2026-05-17', track:'ITF Junior', level:'ITF Junior J60', surface:'Clay', city:'Ulcinj', country:'Montenegro', status:'Acceptance list', priority:'A', result:''},
      {id:t5, name:'J60 Podgorica Open', start:'2026-05-18', end:'2026-05-24', track:'ITF Junior', level:'ITF Junior J60', surface:'Clay', city:'Podgorica', country:'Montenegro', status:'Acceptance list', priority:'A', result:''},
      {id:t6, name:'J200 Targu Jiu', start:'2026-05-18', end:'2026-05-22', track:'ITF Junior', level:'ITF Junior J200', surface:'Clay', city:'Târgu Jiu', country:'Romania', status:'Acceptance list', priority:'A', result:''}
    ],
    rankings:[
      {id:id(), system:'ITF Junior', category:'Girls 18U', value:'503', date:'2026-05-07', goal:'Top 300'},
      {id:id(), system:'ITF Junior', category:'Girls 18U', value:'464', date:'Career high', goal:'Beat career high'},
      {id:id(), system:'Tennis Europe', category:'U16', value:'TBD', date:'2026-05-07', goal:'Track if active'},
      {id:id(), system:'FRT Romania', category:'U18', value:'TBD', date:'2026-05-07', goal:'Track domestic position'}
    ],
    budget:[],
    sponsors:[
      {id:id(), company:'Auchan Romania', contact:'CSR or Marketing Manager', email:'', package:'Community Partner', ask:3000, stage:'Prospect', contract:'Not started', agreementStart:'', agreementEnd:'', paymentStatus:'Not invoiced', paidAmount:0, scheduledPayment:'', sponsoredItem:'Tournament travel', sponsoredEventId:t5, deliverables:SPONSORED_ITEMS['Tournament travel'].deliverables, nextAction:'Find CSR contact and send sponsor proposal', renewal:'', notes:'Fictional prospect. Use the community and youth sport support angle.'},
      {id:id(), company:'Neața Omelette Bistro', contact:'Owner or Manager', email:'', package:'Local Supporter', ask:750, stage:'Prospect', contract:'Not started', agreementStart:'', agreementEnd:'', paymentStatus:'Not invoiced', paidAmount:0, scheduledPayment:'', sponsoredItem:'Equipment package', sponsoredEventId:'', deliverables:SPONSORED_ITEMS['Equipment package'].deliverables, nextAction:'Send local sponsor email or visit in person', renewal:'', notes:'Fictional local breakfast place prospect.'},
      {id:id(), company:'Local Business Prospect', contact:'Owner or Marketing Manager', email:'', package:'Local Partner', ask:1500, stage:'Prospect', contract:'Not started', agreementStart:'', agreementEnd:'', paymentStatus:'Not invoiced', paidAmount:0, scheduledPayment:'', sponsoredItem:'Local prep block', sponsoredEventId:t4, deliverables:SPONSORED_ITEMS['Local prep block'].deliverables, nextAction:'Send intro email', renewal:'', notes:'Use for warm local sponsor targets.'}
    ],
    settings:{senderName:'Eric', senderEmail:'', phone:'', defaultAsk:1500},
    calendar:now,
    selected:{tournamentId:t4, sponsorId:'', doc:'proposal'}
  };
}
function addDefaultBudgets(s){
  if(s.budget && s.budget.length) return s;
  const costs = {
    'J60 Frederiksberg': [['Travel',900],['Lodging',650],['Meals',220],['Entry fee',80],['Equipment',120]],
    'J60 Larnaca': [['Travel',850],['Lodging',500],['Meals',220],['Entry fee',80],['Coach travel',300]],
    'J60 Dunakeszi': [['Travel',500],['Lodging',350],['Meals',160],['Entry fee',80],['Strings',80]],
    'J60 Ulcinj': [['Travel',650],['Lodging',450],['Meals',190],['Entry fee',80],['Physio / recovery',120]],
    'J60 Podgorica Open': [['Travel',650],['Lodging',450],['Meals',190],['Entry fee',80],['Coach travel',300]],
    'J200 Targu Jiu': [['Travel',250],['Lodging',300],['Meals',160],['Entry fee',100],['Local transport',80]]
  };
  s.budget = [];
  s.tournaments.forEach(t => {
    (costs[t.name] || [['Travel',500],['Lodging',350],['Entry fee',80]]).forEach(([cat, amount]) => {
      s.budget.push({id:id(), eventId:t.id, category:cat, description:`${cat} for ${t.name}`, amount, status:t.status === 'Completed' ? 'Paid' : 'Needed'});
    });
  });
  s.budget.push({id:id(), eventId:'', category:'Training block', description:'General monthly training and match preparation', amount:1800, status:'Planned'});
  s.budget.push({id:id(), eventId:'', category:'Equipment', description:'Shoes, racquet maintenance, strings, grips', amount:850, status:'Needed'});
  return s;
}
function load(){
  try{ const raw=localStorage.getItem(KEY); return raw ? migrate(JSON.parse(raw)) : addDefaultBudgets(createDefaultState()); }
  catch{ return addDefaultBudgets(createDefaultState()); }
}
function migrate(s){
  const fresh = createDefaultState();
  s.athlete = {...fresh.athlete, ...(s.athlete||{})};
  s.career = (s.career||fresh.career).map(c=>({...c,id:c.id||id(),type:c.type||'Other'}));
  s.tournaments = (s.tournaments||fresh.tournaments).map(t=>({...t,id:t.id||id()}));
  s.rankings = (s.rankings||fresh.rankings).map(r=>({...r,id:r.id||id()}));
  s.sponsors = (s.sponsors||fresh.sponsors).map(x=>({...x,id:x.id||id(),contract:x.contract||'Not started',paymentStatus:x.paymentStatus||'Not invoiced',paidAmount:x.paidAmount||0,sponsoredItem:x.sponsoredItem||'Tournament travel',sponsoredEventId:x.sponsoredEventId||'',deliverables:x.deliverables||SPONSORED_ITEMS['Tournament travel'].deliverables}));
  s.settings = {...fresh.settings, ...(s.settings||{})};
  s.calendar = s.calendar || fresh.calendar;
  s.selected = s.selected || fresh.selected;
  s = addDefaultBudgets(s);
  return s;
}
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
function money(v){ return new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(v||0)); }
function date(d){ return d ? new Date(d+'T00:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : 'TBD'; }
function esc(s){ return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function opt(list,val){ return list.map(x=>`<option value="${esc(x)}" ${x==val?'selected':''}>${esc(x)}</option>`).join(''); }
function tournamentOptions(val){ return `<option value="">General / season</option>` + state.tournaments.map(t=>`<option value="${t.id}" ${t.id==val?'selected':''}>${esc(t.name)}</option>`).join(''); }
function eventName(id){ return state.tournaments.find(t=>t.id===id)?.name || 'General / season'; }
function eventCost(eventId){ return state.budget.filter(b=>b.eventId===eventId).reduce((a,b)=>a+Number(b.amount||0),0); }
function generalCost(){ return state.budget.filter(b=>!b.eventId).reduce((a,b)=>a+Number(b.amount||0),0); }
function eventCommitted(eventId){ return state.sponsors.filter(s=>s.sponsoredEventId===eventId && !['Closed lost'].includes(s.stage)).reduce((a,s)=>a+Number(s.ask||0),0); }
function eventPaid(eventId){ return state.sponsors.filter(s=>s.sponsoredEventId===eventId).reduce((a,s)=>a+Number(s.paidAmount||0),0); }
function eventGap(eventId){ return Math.max(0, eventCost(eventId)-eventCommitted(eventId)); }
function totalBudget(){ return state.budget.reduce((a,b)=>a+Number(b.amount||0),0); }
function totalSponsors(){ return state.sponsors.reduce((a,b)=>a+Number(b.ask||0),0); }
function sponsorPaid(){ return state.sponsors.reduce((a,b)=>a+Number(b.paidAmount||0),0); }
function currentSponsor(){ return state.sponsors.find(s=>s.id===state.selected.sponsorId) || state.sponsors[0] || {}; }
function currentTournament(){ return state.tournaments.find(t=>t.id===state.selected.tournamentId) || state.tournaments[0] || {}; }
function recommendedDoc(s){ if(!s) return 'Sponsor Proposal One-Pager'; const item=s.sponsoredItem||''; if(item.includes('Season')) return 'Corporate Sponsorship Proposal + Season Budget Overview'; if(item.includes('Tournament')) return 'Tournament Travel Brief + Budget Request'; if(item.includes('Equipment')) return 'Athlete Profile / Media Kit + Local Sponsor Email'; return 'Local Sponsor Email + Athlete Profile / Media Kit'; }
function nav(){ document.getElementById('nav').innerHTML=TABS.map(t=>`<button class="${t===active?'active':''}" data-tab="${t}">${t[0].toUpperCase()+t.slice(1)}</button>`).join(''); }
function chrome(){
  const a=state.athlete;
  document.getElementById('heroName').textContent=`${a.firstName} ${a.lastName}`.trim();
  document.getElementById('heroSummary').textContent=a.summary;
  document.getElementById('heroCutout').src=a.cutout;
  document.querySelector('.hero-bg').style.backgroundImage=`url('${a.background}')`;
  document.getElementById('heroItf').textContent=a.ranking||'TBD';
  document.getElementById('heroBudget').textContent=money(totalBudget());
  document.getElementById('heroPipeline').textContent=money(totalSponsors());
  document.getElementById('metrics').innerHTML=`<div class="metric"><span>Schedule</span><strong>${state.tournaments.length}</strong><p>Known events and target tournaments tracked.</p></div><div class="metric"><span>Ranking path</span><strong>${esc(a.ranking)}</strong><p>${esc(a.rankingSystem)} · Career high ${esc(a.careerHigh)}</p></div><div class="metric"><span>Funding need</span><strong>${money(totalBudget())}</strong><p>All event and season budget rows.</p></div><div class="metric"><span>Collected</span><strong>${money(sponsorPaid())}</strong><p>Paid sponsor money tracked.</p></div>`;
}
function header(title,desc,action=''){ return `<div class="section-head"><div><h2>${title}</h2><p>${desc}</p></div><div class="toolbar">${action}</div></div>`; }
function setActive(tab){ active=tab; render(); setTimeout(()=>scrollTo({top:0,behavior:'smooth'}),0); }
function renderDashboard(){
  const next=[...state.tournaments].filter(t=>t.status!=='Completed').sort((a,b)=>(a.start||'9999').localeCompare(b.start||'9999'))[0] || state.tournaments[0];
  const gap=Math.max(0,totalBudget()-totalSponsors());
  document.getElementById('dashboard').innerHTML = header('Funding command center','The family operating screen: what the next event costs, what is funded, who can help, and which document to send next.') + `<div class="surface-strip"><span class="active">Clay calendar</span><span>Hard court</span><span>Indoor block</span><span>Ranking path</span><span>Sponsor delivery</span></div><div class="cards"><div class="card"><div class="label">Next priority event</div><h3>${esc(next?.name||'Add event')}</h3><p>${date(next?.start)} · ${esc(next?.city||'TBD')} · cost ${money(eventCost(next?.id))} · gap ${money(eventGap(next?.id))}</p><div class="actions"><button class="btn" data-edit-tournament="${next?.id||''}">Edit event</button></div></div><div class="card"><div class="label">Funding gap</div><h3>${money(gap)}</h3><p>${money(totalSponsors())} sponsor pipeline against ${money(totalBudget())} total model.</p><div class="actions"><button class="btn" data-tab="budget">Open budget</button></div></div><div class="card"><div class="label">Next sponsor move</div><h3>${esc(state.sponsors[0]?.nextAction||'Add sponsor')}</h3><p>${esc(state.sponsors[0]?.company||'No sponsor')} · send ${recommendedDoc(state.sponsors[0])}</p><div class="actions"><button class="btn" data-tab="sponsors">Open sponsors</button></div></div></div>` + tableSchedule('Upcoming schedule', state.tournaments);
}
function tableSchedule(title,items){ return `<div class="section-head"><div><h2>${title}</h2><p>Click any row to edit the source tournament. Event costs come from budget rows linked to that tournament.</p></div></div><div class="table-wrap"><table><thead><tr><th>Event</th><th>Dates</th><th>Track</th><th>Level</th><th>Surface</th><th>Status</th><th>Cost</th><th>Committed</th><th>Gap</th></tr></thead><tbody>${items.map(t=>`<tr class="${state.selected.tournamentId===t.id?'selected':''}" data-edit-tournament="${t.id}"><td>${esc(t.name)}</td><td>${date(t.start)} to ${date(t.end)}</td><td>${esc(t.track)}</td><td>${esc(t.level)}</td><td>${esc(t.surface)}</td><td>${esc(t.status)}</td><td>${money(eventCost(t.id))}</td><td>${money(eventCommitted(t.id))}</td><td>${money(eventGap(t.id))}</td></tr>`).join('')}</tbody></table></div>`; }
function renderProfile(){
  const a=state.athlete;
  document.getElementById('profile').innerHTML = header('Profile','Core athlete facts used across the media kit, proposals, emails, and sponsor updates.') + `<div class="form-grid">${field('First name','athlete','firstName',a.firstName)}${field('Last name','athlete','lastName',a.lastName)}${field('Sport','athlete','sport',a.sport)}${field('City','athlete','city',a.city)}${field('Club','athlete','club',a.club)}${field('Coach','athlete','coach',a.coach)}${field('Ranking system','athlete','rankingSystem',a.rankingSystem,'select',RANKING_SYSTEMS)}${field('Ranking','athlete','ranking',a.ranking)}${field('Career high','athlete','careerHigh',a.careerHigh)}${field('Season high','athlete','seasonHigh',a.seasonHigh)}${field('Ranking goal','athlete','rankingGoal',a.rankingGoal)}${field('School','athlete','school',a.school)}${field('Athlete summary','athlete','summary',a.summary,'textarea','', 'w12')}${field('Strengths','athlete','strengths',a.strengths,'textarea','','w6')}${field('Development needs','athlete','needs',a.needs,'textarea','','w6')}</div>`;
}
function iconFor(type){ const map={Trophy:'🏆',Final:'🥈',Semifinal:'🎾',Ranking:'📈',Tournament:'📍',Training:'⚡',Sponsor:'🤝',Media:'📰',Other:'★'}; return map[type] || '★'; }
function renderCareer(){
  const highlights=state.career.slice(0,4);
  document.getElementById('career').innerHTML = header('Career roadmap','A sponsor-facing success story first. Editable career data underneath.') + `<div class="career-showcase"><div class="career-roadmap-shell"><div class="career-strip-meta"><div><div class="career-strip-kicker">Competitive pathway</div><div class="career-strip-copy">A visual storyline of trophies, finals, ranking movement, and international tournament momentum.</div></div><div class="career-rank-chip"><div class="mini">Current position</div><strong>${esc(state.athlete.ranking)}</strong><span>${esc(state.athlete.rankingSystem)} current ranking<br>Career high ${esc(state.athlete.careerHigh)}<br>Goal: ${esc(state.athlete.rankingGoal)}</span></div></div><div class="career-roadmap">${highlights.map((e,i)=>`<div class="roadmap-step ${i%2===0?'up':'down'}"><div class="roadmap-card"><div class="roadmap-topline"><div class="roadmap-year">${esc(e.date||'TBD')}</div><div class="roadmap-type">${esc(e.type||'Milestone')}</div></div><h4 class="roadmap-title">${esc(e.title)}</h4><p class="roadmap-copy">${esc(e.body)}</p></div><div class="roadmap-node-wrap"><div class="roadmap-node"><span class="roadmap-icon">${iconFor(e.type)}</span></div></div></div>`).join('')}</div></div><div class="career-admin"><h4 class="career-admin-title">Career data editor</h4><button class="btn primary" id="addCareer">Add milestone</button><br><br><div class="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Title</th><th>Details</th><th></th></tr></thead><tbody>${state.career.map((e,i)=>`<tr><td>${cell('career',i,'date',e.date)}</td><td><select data-scope="career" data-idx="${i}" data-key="type">${opt(CAREER_TYPES,e.type)}</select></td><td>${cell('career',i,'title',e.title)}</td><td><textarea data-scope="career" data-idx="${i}" data-key="body">${esc(e.body)}</textarea></td><td><button class="btn danger" data-delete="career:${i}">Delete</button></td></tr>`).join('')}</tbody></table></div></div></div>`;
}
function renderCalendar(){
  const y=Number(state.calendar.year), m=Number(state.calendar.month);
  const first=new Date(y,m,1), last=new Date(y,m+1,0), start=(first.getDay()+6)%7;
  const monthName=first.toLocaleDateString('en-GB',{month:'long',year:'numeric'});
  const cells=[]; for(let i=0;i<start;i++) cells.push('<div class="day blank"></div>');
  for(let d=1; d<=last.getDate(); d++){
    const iso=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const ev=state.tournaments.filter(t=>t.start===iso || dateInRange(iso,t.start,t.end));
    cells.push(`<div class="day" data-add-date="${iso}"><div class="day-num">${d}</div>${ev.map(e=>`<span class="pill ${e.track==='Training'?'training':e.track==='Sponsor/Admin'?'sponsor':''}" data-edit-tournament="${e.id}">${esc(e.name)}</span>`).join('')}</div>`);
  }
  document.getElementById('calendar').innerHTML = header('Calendar','Choose month and year. Click an event to edit it. Click an empty day to create a new schedule item.',`<button class="btn" id="prevMonth">Prev</button><input class="compact-input" type="month" id="monthPicker" value="${y}-${String(m+1).padStart(2,'0')}"><button class="btn" id="nextMonth">Next</button>`) + `<div class="calendar-head"><div class="calendar-title">${esc(monthName)}</div><div class="muted">Monday first calendar · ${state.tournaments.length} schedule items</div></div><div class="calendar-scroll"><div class="weekdays">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(x=>`<div class="weekday">${x}</div>`).join('')}</div><div class="calendar">${cells.join('')}</div></div>`;
}
function dateInRange(iso,start,end){ return start && end && iso>=start && iso<=end; }
function renderTournaments(){
  document.getElementById('tournaments').innerHTML = header('Tournaments','Each tournament is the parent record. Costs are pulled from budget rows linked to the event. Sponsor commitments are pulled from sponsor records linked to the event.',`<button class="btn primary" id="addTournament">Add tournament</button>`) + `<div class="table-wrap"><table><thead><tr><th>Name</th><th>Start</th><th>End</th><th>Track</th><th>Level</th><th>Surface</th><th>Status</th><th>Priority</th><th>Event cost</th><th>Committed</th><th>Gap</th><th>Result</th><th></th></tr></thead><tbody>${state.tournaments.map((t,i)=>`<tr id="tour-${t.id}" class="${state.selected.tournamentId===t.id?'selected':''}"><td>${cell('tournaments',i,'name',t.name)}</td><td>${cell('tournaments',i,'start',t.start,'date')}</td><td>${cell('tournaments',i,'end',t.end,'date')}</td><td>${cell('tournaments',i,'track',t.track)}</td><td>${selectCell('tournaments',i,'level',t.level,LEVELS)}</td><td>${selectCell('tournaments',i,'surface',t.surface,SURFACES)}</td><td>${selectCell('tournaments',i,'status',t.status,STATUS)}</td><td>${selectCell('tournaments',i,'priority',t.priority,PRIORITY)}</td><td>${money(eventCost(t.id))}</td><td>${money(eventCommitted(t.id))}</td><td>${money(eventGap(t.id))}</td><td>${cell('tournaments',i,'result',t.result)}</td><td><button class="btn danger" data-delete="tournaments:${i}">Delete</button></td></tr>`).join('')}</tbody></table></div>`;
}
function renderRankings(){
  document.getElementById('rankings').innerHTML = header('Rankings','Track each ranking system separately. Junior tennis can involve ITF Junior, Tennis Europe age groups, FRT domestic ranking, WTA, UTR, and WTN.',`<button class="btn primary" id="addRanking">Add ranking</button>`) + `<div class="table-wrap"><table><thead><tr><th>System</th><th>Category</th><th>Value</th><th>Date</th><th>Goal</th><th></th></tr></thead><tbody>${state.rankings.map((r,i)=>`<tr><td>${selectCell('rankings',i,'system',r.system,RANKING_SYSTEMS)}</td><td>${selectCell('rankings',i,'category',r.category,CATEGORIES)}</td><td>${cell('rankings',i,'value',r.value)}</td><td>${cell('rankings',i,'date',r.date,'text')}</td><td>${cell('rankings',i,'goal',r.goal)}</td><td><button class="btn danger" data-delete="rankings:${i}">Delete</button></td></tr>`).join('')}</tbody></table></div>`;
}
function renderBudget(){
  const byEvent=state.tournaments.map(t=>`<div class="card"><div class="label">${esc(t.level)}</div><h3>${esc(t.name)}</h3><p>${date(t.start)} · cost ${money(eventCost(t.id))} · committed ${money(eventCommitted(t.id))} · gap ${money(eventGap(t.id))}</p><div class="actions"><button class="btn" data-edit-tournament="${t.id}">Edit event</button></div></div>`).join('');
  document.getElementById('budget').innerHTML = header('Budget','Budget is event-linked. Pick the event for each cost row. Tournament totals update automatically from these rows.',`<button class="btn primary" id="addBudget">Add budget item</button>`) + `<div class="cards">${byEvent}<div class="card"><div class="label">General season</div><h3>${money(generalCost())}</h3><p>Training, equipment, or costs not tied to one event.</p></div></div><div class="section-head"><div><h2>Budget line items</h2><p>These rows are the source of truth for event cost and funding gap.</p></div></div><div class="table-wrap"><table><thead><tr><th>Event</th><th>Category</th><th>Description</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>${state.budget.map((b,i)=>`<tr><td><select data-scope="budget" data-idx="${i}" data-key="eventId">${tournamentOptions(b.eventId)}</select></td><td><select data-scope="budget" data-idx="${i}" data-key="category">${opt(BUDGET_CATEGORIES,b.category)}</select></td><td>${cell('budget',i,'description',b.description)}</td><td>${cell('budget',i,'amount',b.amount,'number')}</td><td><select data-scope="budget" data-idx="${i}" data-key="status">${opt(BUDGET_STATUS,b.status)}</select></td><td><button class="btn danger" data-delete="budget:${i}">Delete</button></td></tr>`).join('')}</tbody></table></div>`;
}
function renderSponsors(){
  const sponsorCards=state.sponsors.map((s,i)=>{ const guide=SPONSORED_ITEMS[s.sponsoredItem]||SPONSORED_ITEMS['Tournament travel']; return `<div class="sponsor-card"><div class="badge ${s.paymentStatus==='Paid'?'green':s.stage==='Active'?'gold':''}">${esc(s.stage)}</div><h3>${esc(s.company)}</h3><div class="status-line"><span>${money(s.ask)} ask</span><span>${money(s.paidAmount)} paid</span><span>${esc(s.paymentStatus)}</span><span>${esc(s.contract)}</span></div><p class="muted">${esc(s.sponsoredItem)} · ${esc(eventName(s.sponsoredEventId))} · ${esc(s.nextAction||'No next action')}</p><div class="advice-box"><strong>Approach:</strong> ${esc(guide.advice)}<br><strong>Suggested attachment:</strong> ${esc(recommendedDoc(s))}</div><div class="actions"><button class="btn" data-email-sponsor="${i}">Generate email</button><button class="btn danger" data-delete="sponsors:${i}">Delete</button></div></div>`; }).join('');
  document.getElementById('sponsors').innerHTML = header('Sponsors','CRM for prospects, agreements, sponsor obligations, payments, deliverables, and follow-up emails.',`<button class="btn primary" id="addSponsor">Add sponsor</button>`) + `<div class="sponsor-grid"><div>${sponsorCards}</div><div><div class="email-box" id="emailBox">Choose a sponsor and click Generate email.</div><br><button class="btn primary" id="copyEmail">Copy email</button></div></div><div class="section-head"><div><h2>Sponsor database</h2><p>Sponsored item is guided. Choose one and deliverables auto-populate unless manually edited afterward.</p></div></div><div class="table-wrap"><table><thead><tr><th>Company</th><th>Contact</th><th>Email</th><th>Package</th><th>Ask</th><th>Paid</th><th>Stage</th><th>Contract</th><th>Payment</th><th>Scheduled pay</th><th>Sponsored event</th><th>Sponsored item</th><th>Deliverables</th><th>Agreement start</th><th>Agreement end</th><th>Next action</th></tr></thead><tbody>${state.sponsors.map((s,i)=>`<tr><td>${cell('sponsors',i,'company',s.company)}</td><td>${cell('sponsors',i,'contact',s.contact)}</td><td>${cell('sponsors',i,'email',s.email)}</td><td>${cell('sponsors',i,'package',s.package)}</td><td>${cell('sponsors',i,'ask',s.ask,'number')}</td><td>${cell('sponsors',i,'paidAmount',s.paidAmount,'number')}</td><td><select data-scope="sponsors" data-idx="${i}" data-key="stage">${opt(SPONSOR_STAGE,s.stage)}</select></td><td><select data-scope="sponsors" data-idx="${i}" data-key="contract">${opt(CONTRACT_STATUS,s.contract)}</select></td><td><select data-scope="sponsors" data-idx="${i}" data-key="paymentStatus">${opt(PAYMENT_STATUS,s.paymentStatus)}</select></td><td>${cell('sponsors',i,'scheduledPayment',s.scheduledPayment,'date')}</td><td><select data-scope="sponsors" data-idx="${i}" data-key="sponsoredEventId">${tournamentOptions(s.sponsoredEventId)}</select></td><td><select data-scope="sponsors" data-idx="${i}" data-key="sponsoredItem">${opt(Object.keys(SPONSORED_ITEMS),s.sponsoredItem)}</select></td><td>${cell('sponsors',i,'deliverables',s.deliverables)}</td><td>${cell('sponsors',i,'agreementStart',s.agreementStart,'date')}</td><td>${cell('sponsors',i,'agreementEnd',s.agreementEnd,'date')}</td><td>${cell('sponsors',i,'nextAction',s.nextAction)}</td></tr>`).join('')}</tbody></table></div>`;
}
function docs(){
  const NL='\n'; const a=state.athlete, full=`${a.firstName} ${a.lastName}`.trim(), next=currentTournament(), s=currentSponsor();
  const gap = totalBudget()-sponsorPaid();
  return {
    dev:['Athlete Development Plan',`${full} · ${a.sport} · ${a.city}`,[['Executive Summary',`${full} is a Romanian junior tennis player from Timișoara building an international tournament pathway. The working objective is to fund the right schedule, protect training quality, track ranking movement, and communicate progress professionally to supporters.`],['Current Position',`${a.rankingSystem}: ${a.ranking}. Career high: ${a.careerHigh}. Season high: ${a.seasonHigh}. Goal: ${a.rankingGoal}.`],['Strengths',a.strengths],['Development Priorities',a.needs],['Target Schedule',state.tournaments.map(t=>`${date(t.start)} to ${date(t.end)} · ${t.name} · ${t.level} · ${t.surface} · ${money(eventCost(t.id))}`).join(NL)],['Funding Picture',`Total budget model: ${money(totalBudget())}. Sponsor pipeline: ${money(totalSponsors())}. Paid: ${money(sponsorPaid())}. Open gap: ${money(gap)}.`]]],
    mediaKit:['Athlete Profile / Media Kit',full,[['Short Bio',a.summary],['Career Highlights',state.career.map(c=>`${c.date}: ${c.title}`).join(NL)],['Current Ranking',`${a.rankingSystem}: ${a.ranking}. Career high ${a.careerHigh}.`],['Why Support Andreea','Support can be tied to tournament travel, training, equipment, recovery, and ranking development with clear reporting and sponsor deliverables.']]],
    localEmail:['Local Sponsor Email',`For ${s.company||'Sponsor'}`,[['Subject',`Local sponsorship opportunity: ${full}`],['Email Body',sponsorEmail(s)],['Attach',recommendedDoc(s)],['Approach Note',(SPONSORED_ITEMS[s.sponsoredItem]||SPONSORED_ITEMS['Tournament travel']).advice]]],
    corporateEmail:['Corporate Sponsor Email',s.company||'Corporate prospect',[['Subject',`Partnership opportunity supporting Romanian junior tennis player ${full}`],['Email Body',corporateEmail(s)],['Attach','Corporate Sponsorship Proposal + Athlete Profile / Media Kit + Season Budget Overview']]],
    followup:['Sponsor Follow-Up Email',s.company||'Sponsor',[['Email Body',`Hi ${s.contact||'[Name]'},${NL}${NL}I wanted to follow up on the sponsorship opportunity for ${full}. The current ask is ${money(s.ask||state.settings.defaultAsk)} and can be tied directly to ${s.sponsoredItem||'a specific development cost'}.${NL}${NL}Would it be useful if I sent a one-page summary with the budget, tournament schedule, and sponsor deliverables?${NL}${NL}Best,${NL}${state.settings.senderName}`]]],
    thanks:['Sponsor Thank You Email',s.company||'Sponsor',[['Email Body',`Hi ${s.contact||'[Name]'},${NL}${NL}Thank you for supporting ${full}. Your contribution helps with real tennis development costs: training, travel, competition, equipment, and recovery. We will keep you updated with clear progress notes and event summaries.${NL}${NL}Best,${NL}${state.settings.senderName}`]]],
    update:['Sponsor Update',full,[['Overview',`${full} continues toward ${a.rankingGoal}.`],['Recent Activity',state.tournaments.map(t=>`${t.name}: ${t.result||'pending / research'}`).join(NL)],['Current Focus',a.needs],['Sponsor Deliverables',s.deliverables||'No deliverables entered yet.']]],
    proposal:['Sponsor Proposal One-Pager',s.company||'Sponsor',[['Opportunity',`Support ${full}, a Romanian junior tennis player building an international tournament pathway.`],['The Ask',`${money(s.ask||state.settings.defaultAsk)} for ${s.package||'sponsor support'}.`],['Use of Funds',s.sponsoredItem ? `${s.sponsoredItem} · ${eventName(s.sponsoredEventId)}` : 'Tournament travel, training blocks, equipment, and recovery support.'],['Sponsor Value','A clear athlete story, specific use of funds, agreed deliverables, progress updates, and a credible local sport development angle.'],['Deliverables',s.deliverables||'Sponsor updates and recognition where appropriate.'],['Next Step',s.nextAction||'Schedule a 15 minute conversation.']]],
    corporate:['Corporate Sponsorship Proposal',s.company||'Corporate prospect',[['Why This Matters',`${full} is building a structured international junior tennis pathway from Romania. The sponsor can support a clear, specific development plan rather than a vague request.`],['Sponsor Package',`${s.package||'Partner'} · Suggested ask: ${money(s.ask||state.settings.defaultAsk)}.`],['Business Value','Community association, youth sport support, healthy lifestyle alignment, clear reporting, athlete story, and local visibility where appropriate.'],['Recommended Attachments','Athlete Profile / Media Kit, Season Budget Overview, Tournament Calendar One-Pager.']]],
    trip:['Tournament Travel Brief',next.name||'Tournament',[['Event',[next.name||'TBD',`${date(next.start)} to ${date(next.end)}`,`${next.city||'TBD'}, ${next.country||''}`,`${next.level||''} · ${next.surface||''}`].join(NL)],['Event Budget',money(eventCost(next.id))],['Funding Status',`Committed: ${money(eventCommitted(next.id))}. Paid: ${money(eventPaid(next.id))}. Gap: ${money(eventGap(next.id))}.`],['Purpose',`Competition reps aligned to ranking goal: ${a.rankingGoal}.`]]],
    calendar:['Tournament Calendar One-Pager','Season schedule',[['Schedule',state.tournaments.map(t=>`${date(t.start)} to ${date(t.end)} · ${t.name} · ${t.city}, ${t.country} · ${t.level} · ${money(eventCost(t.id))}`).join(NL)]]],
    budget:['Budget Request',money(totalBudget()),[['Tournament Costs',state.tournaments.map(t=>`${t.name}: ${money(eventCost(t.id))} cost · ${money(eventCommitted(t.id))} committed · ${money(eventGap(t.id))} gap`).join(NL)],['Line Items',state.budget.map(b=>`${eventName(b.eventId)} · ${b.category}: ${b.description} · ${money(b.amount)} · ${b.status}`).join(NL)]]],
    seasonBudget:['Season Budget Overview',money(totalBudget()),[['Summary',`Total modeled need: ${money(totalBudget())}. Sponsor pipeline: ${money(totalSponsors())}. Paid: ${money(sponsorPaid())}. Open funding gap: ${money(gap)}.`],['By Event',state.tournaments.map(t=>`${t.name}: ${money(eventCost(t.id))}`).join(NL)],['General Costs',`General season costs: ${money(generalCost())}.`]]],
    agreement:['Sponsor Agreement Summary',s.company||'Sponsor',[['Sponsor',s.company||''],['Support Amount',money(s.ask||0)],['Paid Amount',money(s.paidAmount||0)],['Sponsored Event',eventName(s.sponsoredEventId)],['Sponsored Item',s.sponsoredItem||''],['Deliverables',s.deliverables||''],['Agreement Window',`${s.agreementStart||'TBD'} to ${s.agreementEnd||'TBD'}`],['Contract Status',s.contract||'Not started'],['Payment Status',s.paymentStatus||'Not invoiced']]],
    checklist:['Sponsor Deliverables Checklist',s.company||'Sponsor',[['Deliverables',s.deliverables||'No deliverables entered.'],['Payment Status',s.paymentStatus||'Not invoiced'],['Next Action',s.nextAction||'No next action.'],['Renewal Date',s.renewal||'TBD']]],
    paymentReminder:['Sponsor Payment Reminder',s.company||'Sponsor',[['Email Body',`Hi ${s.contact||'[Name]'},${NL}${NL}A quick note on the sponsorship payment for ${full}. The scheduled payment date is ${s.scheduledPayment||'[scheduled date]'}, with payment status marked as ${s.paymentStatus||'Not invoiced'}.${NL}${NL}Please let me know if you need an updated summary, agreement details, or payment information.${NL}${NL}Best,${NL}${state.settings.senderName}`]]],
    postTournament:['Post-Tournament Report',next.name||'Tournament',[['Event',`${next.name||'TBD'} · ${date(next.start)} to ${date(next.end)}`],['Result',next.result||'Result not entered yet.'],['Budget Used',money(eventCost(next.id))],['Sponsor Note',`This report can be sent to ${s.company||'a sponsor'} as proof of activity and progress.`]]],
    seasonReview:['Season Review',full,[['Overview',`${full} season review based on entered events, rankings, sponsor support, and results.`],['Tournament Record',state.tournaments.map(t=>`${t.name}: ${t.result||'No result entered'}`).join(NL)],['Funding Review',`Budget: ${money(totalBudget())}. Sponsor pipeline: ${money(totalSponsors())}. Paid: ${money(sponsorPaid())}.`],['Next Season Focus',a.needs]]],
    parentPlan:['Parent Action Plan','Ramona and family workflow',[['This Week','Confirm next event cost, identify funding gap, choose two sponsor prospects, send local sponsor email, schedule follow-up.'],['This Month','Update career highlights, confirm tournament calendar, track payments, send sponsor updates, keep receipts and budget lines current.'],['Operating Rule','Every tournament should have a cost, a funding source, a gap, and a document package attached to it.']]],
    coachSummary:['Coach / Training Summary',full,[['Athlete',full],['Strengths',a.strengths],['Development Needs',a.needs],['Upcoming Events',state.tournaments.filter(t=>t.status!=='Completed').map(t=>`${t.name} · ${date(t.start)} · ${t.surface}`).join(NL)]]]
  };
}
function sponsorEmail(s){ const a=state.athlete, full=`${a.firstName} ${a.lastName}`.trim(); return `Hi ${s.contact||'[Name]'},\n\nI am reaching out because we are building a structured development and sponsorship plan for ${full}, a Romanian junior tennis player based in ${a.city}.\n\n${a.summary}\n\nCurrent ranking context: ${a.rankingSystem} ${a.ranking}, career high ${a.careerHigh}, with a goal of ${a.rankingGoal}.\n\nWe are looking for a ${s.package||'sponsor'} partner at ${money(s.ask||state.settings.defaultAsk)} to support ${s.sponsoredItem||'tournament travel, training, equipment, and recovery'}. In return, we can provide: ${s.deliverables||'periodic updates and recognition where appropriate'}.\n\nWould you be open to a short conversation next week?\n\nBest,\n${state.settings.senderName}`; }
function corporateEmail(s){ const a=state.athlete, full=`${a.firstName} ${a.lastName}`.trim(); return `Hi ${s.contact||'[Name]'},\n\nI am contacting you about a structured sponsorship opportunity supporting ${full}, a Romanian junior tennis player from ${a.city}.\n\nThis is designed as a specific, accountable partnership: a defined support amount, a clear use of funds, and agreed reporting deliverables.\n\nThe proposed package is ${s.package||'Corporate Partner'} at ${money(s.ask||state.settings.defaultAsk)}. Support would be connected to ${s.sponsoredItem||'tournament travel and athlete development'}, with deliverables including ${s.deliverables||'progress updates and event reporting'}.\n\nCan I send over a one-page proposal and season budget summary?\n\nBest,\n${state.settings.senderName}`; }
function renderDocuments(){
  const D=docs(); const keys=Object.keys(D); if(!keys.includes(state.selected.doc)) state.selected.doc='proposal'; const d=D[state.selected.doc];
  document.getElementById('documents').innerHTML = header('Documents','Generate formatted documents from dashboard inputs. Choose sponsor, event, and document type. Print, copy, or download HTML.',`<button class="btn primary" onclick="window.print()">Print / PDF</button>`) + `<div class="doc-options"><div class="field w12"><label>Sponsor</label><select data-selected="sponsorId">${state.sponsors.map(s=>`<option value="${s.id}" ${s.id===state.selected.sponsorId?'selected':''}>${esc(s.company)}</option>`).join('')}</select></div><div class="field w12"><label>Event</label><select data-selected="tournamentId">${state.tournaments.map(t=>`<option value="${t.id}" ${t.id===state.selected.tournamentId?'selected':''}>${esc(t.name)}</option>`).join('')}</select></div><div class="field w12"><label>Document</label><select data-selected="doc">${Object.entries(D).map(([k,v])=>`<option value="${k}" ${k===state.selected.doc?'selected':''}>${esc(v[0])}</option>`).join('')}</select></div></div><div class="doc-layout"><div class="doc-list">${Object.entries(D).map(([k,v])=>`<button class="${k===state.selected.doc?'active':''}" data-doc="${k}">${v[0]}</button>`).join('')}</div><div><div class="doc-paper" id="docPaper">${docHtml(d)}</div><button class="btn primary" id="copyDoc">Copy document text</button><button class="btn" id="downloadDoc">Download .html</button></div></div>`;
}
function docHtml(d){
  const sections=d[2].map(([h,b])=>`<section class="doc-sec"><h4>${esc(h)}</h4><p>${esc(b)}</p></section>`).join('');
  const callout = `<div class="doc-callout"><div><strong>Athlete</strong>${esc(state.athlete.firstName)} ${esc(state.athlete.lastName)}</div><div><strong>Ranking</strong>${esc(state.athlete.rankingSystem)} ${esc(state.athlete.ranking)}</div><div><strong>Funding need</strong>${money(totalBudget())}</div></div>`;
  return `<h1>${esc(d[0])}</h1><div class="sub">${esc(d[1])}</div>${callout}${sections}`;
}
function renderSettings(){ document.getElementById('settings').innerHTML = header('Settings','Export and import data, control reusable sender fields, and keep this local browser copy backed up.') + `<div class="form-grid">${field('Sender name','settings','senderName',state.settings.senderName)}${field('Sender email','settings','senderEmail',state.settings.senderEmail)}${field('Phone','settings','phone',state.settings.phone)}${field('Default ask','settings','defaultAsk',state.settings.defaultAsk,'number')}</div><br><button class="btn primary" id="exportBtn">Export JSON backup</button> <label class="btn" for="importFile">Import JSON backup</label><input id="importFile" type="file" accept="application/json" style="display:none"> <button class="btn danger" id="resetBtn">Reset demo data</button>`; }
function field(label,scope,key,val,type='text',options='',cls=''){ if(type==='textarea') return `<div class="field ${cls}"><label>${label}</label><textarea data-scope="${scope}" data-key="${key}">${esc(val)}</textarea></div>`; if(type==='select') return `<div class="field ${cls}"><label>${label}</label><select data-scope="${scope}" data-key="${key}">${opt(options,val)}</select></div>`; return `<div class="field ${cls}"><label>${label}</label><input type="${type}" data-scope="${scope}" data-key="${key}" value="${esc(val)}"></div>`; }
function cell(scope,i,key,val,type='text'){ return `<input type="${type}" data-scope="${scope}" data-idx="${i}" data-key="${key}" value="${esc(val)}">`; }
function selectCell(scope,i,key,val,list){ return `<select data-scope="${scope}" data-idx="${i}" data-key="${key}">${opt(list,val)}</select>`; }
function addTournament(start=''){ const t={id:id(), name:'New Tournament', start:start, end:start, track:'ITF Junior', level:'ITF Junior J60', surface:'Clay', city:'', country:'', status:'Research', priority:'B', result:''}; state.tournaments.push(t); state.budget.push({id:id(), eventId:t.id, category:'Travel', description:`Travel for ${t.name}`, amount:0, status:'Needed'}); state.selected.tournamentId=t.id; setActive('tournaments'); }
function render(){ save(); nav(); chrome(); renderDashboard(); renderProfile(); renderCareer(); renderCalendar(); renderTournaments(); renderRankings(); renderBudget(); renderSponsors(); renderDocuments(); renderSettings(); document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===active)); }
document.addEventListener('click',e=>{
  const tab=e.target.closest('[data-tab]')?.dataset.tab || e.target.closest('[data-go]')?.dataset.go; if(tab){ setActive(tab); return; }
  const tour=e.target.closest('[data-edit-tournament]')?.dataset.editTournament; if(tour){ state.selected.tournamentId=tour; setActive('tournaments'); setTimeout(()=>document.getElementById('tour-'+tour)?.scrollIntoView({block:'center',behavior:'smooth'}),60); return; }
  const day=e.target.closest('[data-add-date]')?.dataset.addDate; if(day && !e.target.closest('[data-edit-tournament]')){ addTournament(day); return; }
  const doc=e.target.closest('[data-doc]')?.dataset.doc; if(doc){ state.selected.doc=doc; renderDocuments(); return; }
  const em=e.target.closest('[data-email-sponsor]')?.dataset.emailSponsor; if(em!=null){ state.selected.sponsorId=state.sponsors[Number(em)].id; document.getElementById('emailBox').textContent=sponsorEmail(state.sponsors[Number(em)]); save(); return; }
  const del=e.target.closest('[data-delete]')?.dataset.delete; if(del){ const [scope,i]=del.split(':'); state[scope].splice(Number(i),1); render(); return; }
  if(e.target.id==='addCareer'){ state.career.push({id:id(), date:new Date().getFullYear().toString(), type:'Other', title:'New milestone', body:''}); render(); return; }
  if(e.target.id==='addTournament'){ addTournament(); return; }
  if(e.target.id==='addRanking'){ state.rankings.push({id:id(), system:'ITF Junior', category:'Girls 18U', value:'', date:'', goal:''}); render(); return; }
  if(e.target.id==='addBudget'){ state.budget.push({id:id(), eventId:state.selected.tournamentId||'', category:'Travel', description:'New budget item', amount:0, status:'Needed'}); render(); return; }
  if(e.target.id==='addSponsor'){ state.sponsors.push({id:id(), company:'New Sponsor', contact:'', email:'', package:'Local Partner', ask:1000, stage:'Prospect', contract:'Not started', agreementStart:'', agreementEnd:'', paymentStatus:'Not invoiced', paidAmount:0, scheduledPayment:'', sponsoredItem:'Tournament travel', sponsoredEventId:state.selected.tournamentId||'', deliverables:SPONSORED_ITEMS['Tournament travel'].deliverables, nextAction:'Research contact', renewal:'', notes:''}); render(); return; }
  if(e.target.id==='copyEmail'){ navigator.clipboard.writeText(document.getElementById('emailBox').textContent); return; }
  if(e.target.id==='copyDoc'){ navigator.clipboard.writeText(document.getElementById('docPaper').innerText); return; }
  if(e.target.id==='downloadDoc'){ downloadHtmlDoc(); return; }
  if(e.target.id==='exportBtn'){ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='andreea-athlete-os-backup.json'; a.click(); return; }
  if(e.target.id==='resetBtn' && confirm('Reset all data?')){ localStorage.removeItem(KEY); state=addDefaultBudgets(createDefaultState()); render(); return; }
  if(e.target.id==='prevMonth'){ state.calendar.month--; if(state.calendar.month<0){ state.calendar.month=11; state.calendar.year--; } render(); return; }
  if(e.target.id==='nextMonth'){ state.calendar.month++; if(state.calendar.month>11){ state.calendar.month=0; state.calendar.year++; } render(); return; }
});
document.addEventListener('input',e=>{
  const el=e.target; const {scope,idx,key}=el.dataset; if(!scope) return; const val=el.type==='number'?Number(el.value||0):el.value; if(idx!=null) state[scope][Number(idx)][key]=val; else state[scope][key]=val; if(scope==='sponsors' && key==='sponsoredItem'){ const guide=SPONSORED_ITEMS[val]; if(guide) state.sponsors[Number(idx)].deliverables=guide.deliverables; } save(); chrome();
});
document.addEventListener('change',async e=>{
  const el=e.target;
  if(el.dataset.selected){ state.selected[el.dataset.selected]=el.value; save(); render(); return; }
  const {scope,idx,key}=el.dataset; if(scope){ const val=el.type==='number'?Number(el.value||0):el.value; if(idx!=null) state[scope][Number(idx)][key]=val; else state[scope][key]=val; if(scope==='sponsors' && key==='sponsoredItem'){ const guide=SPONSORED_ITEMS[val]; if(guide) state.sponsors[Number(idx)].deliverables=guide.deliverables; } render(); return; }
  if(el.id==='monthPicker'){ const [y,m]=el.value.split('-').map(Number); state.calendar.year=y; state.calendar.month=m-1; render(); return; }
  if(el.id==='importFile'){ const f=el.files[0]; if(!f) return; try{ state=migrate(JSON.parse(await f.text())); render(); alert('Imported'); } catch { alert('Could not import file'); } }
});
function downloadHtmlDoc(){
  const title = document.querySelector('#docPaper h1')?.textContent || 'Athlete OS Document';
  const body = document.getElementById('docPaper').innerHTML;
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>body{font-family:Inter,Arial,sans-serif;color:#0c1726;padding:48px;max-width:900px;margin:auto}h1{font-size:46px;line-height:.95;letter-spacing:-.04em}.sub{color:#60748d}.doc-callout{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:18px 0}.doc-callout div{background:#eef4fb;padding:14px;border-left:4px solid #89d9c9}.doc-callout strong{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.14em;color:#647990;margin-bottom:6px}.doc-sec{border-top:1px solid #dbe5f2;padding:18px 0}.doc-sec h4{margin:0 0 10px;color:#667b96;letter-spacing:.16em;text-transform:uppercase;font-size:12px}.doc-sec p{white-space:pre-line;line-height:1.85;margin:0}</style></head><body>${body}</body></html>`;
  const blob = new Blob([html],{type:'text/html'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=title.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.html'; a.click();
}
render();
