/* ============================================================
   ANDREEA OLARIU · CAMPAIGN HQ
   Single-file dashboard. localStorage state. SVG charts.
   ============================================================ */

/* ---- Domain constants -------------------------------------- */
const TABS = ['dashboard','profile','career','calendar','tournaments','rankings','budget','sponsors','documents','settings'];
const RANKING_SYSTEMS = ['ITF Junior','Tennis Europe','FRT Romania','WTA','UTR','WTN'];
const CATEGORIES = ['Girls 18U','U16','U14','U12','Open','Professional'];
const LEVELS = ['ITF Junior J30','ITF Junior J60','ITF Junior J100','ITF Junior J200','ITF Junior J300','ITF Junior J500','Junior Grand Slam','Tennis Europe U12','Tennis Europe U14','Tennis Europe U16','FRT U12','FRT U14','FRT U16','FRT U18','W15','W35','Training','Sponsor/Admin'];
const SURFACES = ['Clay','Hard','Indoor','Grass','Carpet'];
const STATUS = ['Research','Acceptance list','Target','Planned','Confirmed','Active','Completed','Skipped'];
const PRIORITY = ['A','B','C','Watch'];
const SPONSOR_STAGE = ['Research','Prospect','Contacted','Meeting','Proposal sent','Negotiating','Committed','Active','Completed','Renewal','Closed lost'];
const FUNNEL_STAGES = ['Prospect','Contacted','Meeting','Proposal sent','Negotiating','Committed','Active'];
const CONTRACT_STATUS = ['Not started','Drafting','Sent','Signed','Expired','Cancelled'];
const PAYMENT_STATUS = ['Not invoiced','Invoice scheduled','Invoiced','Partially paid','Paid','Overdue'];
const BUDGET_STATUS = ['Needed','Planned','Quoted','Committed','Paid'];
const CAREER_TYPES = ['Trophy','Final','Semifinal','Ranking','Tournament','Training','Sponsor','Media','Other'];
const BUDGET_CATEGORIES = ['Tournament travel','Accommodation and meals','Coaching and training','Equipment and stringing','Recovery / physio','Local transport','Entry fees','Video and reporting','Training block','Emergency buffer','Other'];
const SPONSOR_LEVELS = [
  {label:'Supporter', range:'€500-€1,000', use:'Equipment, strings, entry fees, or local travel.'},
  {label:'Equipment Partner', range:'€1,500-€2,500', use:'Shoes, strings, grips, racquet support, equipment maintenance.'},
  {label:'Tournament Partner', range:'€5,000', use:'One international tournament block.'},
  {label:'Season Partner', range:'€10,000-€15,000', use:'Multiple tournament and training blocks.'},
  {label:'Main Partner', range:'€25,000+', use:'Full campaign contribution.'},
  {label:'In-kind Partner', range:'Value varies', use:'Hotel, physio, gym, travel, equipment, media, training support.'}
];
const SPONSORED_ITEMS = {
  'Tournament travel': {deliverables:'Pre-event tournament brief, post-event result update, expense summary, thank-you email', advice:'Local companies, service businesses, and family/community brands. Pair with the Tournament Travel Brief and Budget Request.'},
  'Coaching block': {deliverables:'Training plan summary, monthly progress note, coach update, thank-you email', advice:'Sponsors who want to fund measurable progress. Pair with the Athlete Development Plan and Budget Request.'},
  'Equipment package': {deliverables:'Photo update, equipment use summary, monthly progress note, thank-you email', advice:'Local retailers and warm leads. Pair with the Athlete Profile / Media Kit and Local Sponsor Email.'},
  'Recovery / physio': {deliverables:'Recovery support summary, monthly update, thank-you email', advice:'Health-and-wellness brands. Frame as performance protection, injury prevention, and tournament readiness.'},
  'Season partner': {deliverables:'Monthly sponsor update, quarterly progress report, season review, agreed recognition, renewal conversation', advice:'Larger corporate / CSR. Pair with the Corporate Sponsorship Proposal, Season Budget Overview, and Athlete Profile.'},
  'Local prep block': {deliverables:'Training block update, photo if appropriate, thank-you email', advice:'Best for small local businesses and warm introductions. Pair with the Local Sponsor Email and Athlete Profile.'}
};

const SURFACE_CSS = s => 'surface-' + (s||'').toLowerCase().replace(/[^a-z]/g,'') || 'clay';
const STATUS_CSS = s => 'pill-status ' + (s||'').toLowerCase().replace(/[^a-z]/g,'');

const KEY = 'andreea-os-v6';
let state;          // initialized at end after all helpers/factories defined
let active = 'dashboard';
let funnelFilter = '';

/* ---- Utilities --------------------------------------------- */
const id = () => Math.random().toString(36).slice(2,10);
const clone = v => JSON.parse(JSON.stringify(v));
const todayParts = () => { const n=new Date(); return {year:n.getFullYear(), month:n.getMonth()}; };
const todayISO = () => { const n=new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`; };
const money = v => new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(v||0));
const moneyShort = v => { const n=Number(v||0); if(n>=10000) return '€'+(n/1000).toFixed(1).replace(/\.0$/,'')+'k'; return money(n); };
const dateShort = d => d ? new Date(d+'T00:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) : 'TBD';
const dateLong = d => d ? new Date(d+'T00:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : 'TBD';
const esc = s => String(s??'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const opt = (list,val) => list.map(x=>`<option value="${esc(x)}" ${x==val?'selected':''}>${esc(x)}</option>`).join('');
const eventName = id => state.tournaments.find(t=>t.id===id)?.name || 'General / season';
const eventCost = id => state.budget.filter(b=>b.eventId===id).reduce((a,b)=>a+Number(b.amount||0),0);
const generalCost = () => state.budget.filter(b=>!b.eventId).reduce((a,b)=>a+Number(b.amount||0),0);
const eventCommitted = id => state.sponsors.filter(s=>s.sponsoredEventId===id && !['Closed lost','Research'].includes(s.stage)).reduce((a,s)=>a+Number(s.ask||0),0);
const eventPaid = id => state.sponsors.filter(s=>s.sponsoredEventId===id).reduce((a,s)=>a+Number(s.paidAmount||0),0);
const eventGap = id => Math.max(0, eventCost(id)-eventCommitted(id));
const totalBudget = () => state.budget.reduce((a,b)=>a+Number(b.amount||0),0);
const totalSponsors = () => state.sponsors.filter(s=>!['Closed lost','Research'].includes(s.stage)).reduce((a,b)=>a+Number(b.ask||0),0);
const sponsorPaid = () => state.sponsors.reduce((a,b)=>a+Number(b.paidAmount||0),0);
const fundingGap = () => Math.max(0, totalBudget() - sponsorPaid());
const currentSponsor = () => state.sponsors.find(s=>s.id===state.selected.sponsorId) || state.sponsors[0] || {};
const currentTournament = () => state.tournaments.find(t=>t.id===state.selected.tournamentId) || state.tournaments[0] || {};
const upcoming = () => [...state.tournaments].filter(t=>t.status!=='Completed' && t.status!=='Skipped' && t.start && t.start>=todayISO()).sort((a,b)=>a.start.localeCompare(b.start));
const nextEvent = () => upcoming()[0] || state.tournaments.find(t=>t.status==='Active') || state.tournaments[0];
const daysUntil = iso => { if(!iso) return null; const ms=(new Date(iso+'T00:00:00')-new Date(todayISO()+'T00:00:00'));return Math.round(ms/86400000); };

/* ---- Default state ----------------------------------------- */
function createDefaultState(){
  const today=todayISO();
  const t1=id(),t2=id(),t3=id(),t4=id(),t5=id(),t6=id();
  return {
    athlete:{
      firstName:'Andreea',lastName:'Olariu',sport:'Tennis',
      city:'Timișoara',country:'Romania',dob:'2010-03-03',age:'16',
      club:'Sport 4 Fun Timișoara',coach:'TBD',school:'TBD',
      rankingSystem:'ITF Junior',ranking:'503',careerHigh:'464',seasonHigh:'491',rankingGoal:'Top 300 ITF Junior',
      handed:'Right',height:'',
      summary:'Romanian junior tennis player from Timișoara. Verified national titles, European junior recognition, ITF junior results, and Romania team participation. The 2026 campaign is built on disciplined scheduling, ranking conversion, and clear sponsor reporting.',
      strengths:'International junior tournament experience, two ITF J60 doubles titles in 2025, competitive clay-court pathway, coachable profile, and a serious family commitment behind the project.',
      needs:'Funded tournament travel, planned training blocks, recovery support, equipment support, sponsor reporting, and a disciplined calendar that prioritises events with ranking and development value.',
      cutout:'assets/andreea-cutout.png'
    },
    career:[
      {id:id(),date:'2022',type:'Trophy',title:'Romanian U12 National Champion',body:'Romanian U12 singles and doubles champion. Romanian press reported she did not drop a singles set in the run.',source:'Reported in Romanian press'},
      {id:id(),date:'2022',type:'Final',title:'U12 European Team — Best Player',body:'Romania reached the European U12 final stage. Andreea was reported as the tournament’s best player.',source:'Radio România Timișoara'},
      {id:id(),date:'2022',type:'Trophy',title:'Tennis Europe U14 winner — Manacor',body:'Won the Tennis Europe U14 event at the Rafa Nadal Tennis Academy. Five wins through the draw, defeated the top seed in the final.',source:'Opinia Timișoarei'},
      {id:id(),date:'2024',type:'Trophy',title:'Romanian U14 Winter National Champion',body:'Won the Romanian U14 winter national singles title. Reported No. 16 in Tennis Europe U14 around that time.',source:'Radio România Timișoara'},
      {id:id(),date:'2025',type:'Trophy',title:'Two ITF J60 doubles titles',body:'Won J60 doubles titles in Ulcinj and Podgorica during the Montenegro clay block.',source:'ITF profile'},
      {id:id(),date:'2025',type:'Final',title:'J60 Podgorica singles finalist',body:'Reached the singles final in Podgorica, showing singles progression alongside doubles success.',source:'ITF profile'},
      {id:id(),date:'2026',type:'Ranking',title:'Romania U16 team qualification',body:'Part of the Romania U16 team that qualified for the European final phase.',source:'FRT'},
      {id:id(),date:'2026',type:'Ranking',title:'ITF Junior 503 — career high 464',body:'Current ITF Junior ranking 503. Career high 464. Season high 491. Goal Top 300.',source:'ITF profile'}
    ],
    tournaments:[
      {id:t1,name:'J60 Frederiksberg',start:'2026-02-09',end:'2026-02-15',track:'ITF Junior',level:'ITF Junior J60',surface:'Indoor',city:'Copenhagen',country:'Denmark',status:'Completed',priority:'B',result:'R32 singles · R16 doubles',points:0,outcome:'L'},
      {id:t2,name:'J60 Larnaca',start:'2026-03-02',end:'2026-03-08',track:'ITF Junior',level:'ITF Junior J60',surface:'Hard',city:'Larnaca',country:'Cyprus',status:'Completed',priority:'B',result:'R16 singles · QF doubles',points:6,outcome:'L'},
      {id:t3,name:'J60 Dunakeszi',start:'2026-05-05',end:'2026-05-11',track:'ITF Junior',level:'ITF Junior J60',surface:'Clay',city:'Dunakeszi',country:'Hungary',status:'Active',priority:'A',result:'In progress',points:0,outcome:''},
      {id:t4,name:'J60 Ulcinj',start:'2026-05-11',end:'2026-05-17',track:'ITF Junior',level:'ITF Junior J60',surface:'Clay',city:'Ulcinj',country:'Montenegro',status:'Acceptance list',priority:'A',result:'',points:0,outcome:''},
      {id:t5,name:'J60 Podgorica Open',start:'2026-05-18',end:'2026-05-24',track:'ITF Junior',level:'ITF Junior J60',surface:'Clay',city:'Podgorica',country:'Montenegro',status:'Acceptance list',priority:'A',result:'',points:0,outcome:''},
      {id:t6,name:'J200 Targu Jiu',start:'2026-05-18',end:'2026-05-22',track:'ITF Junior',level:'ITF Junior J200',surface:'Clay',city:'Târgu Jiu',country:'Romania',status:'Acceptance list',priority:'A',result:'',points:0,outcome:''}
    ],
    rankings:[
      {id:id(),system:'ITF Junior',category:'Girls 18U',value:'503',date:'2026-05-07',goal:'Top 300'},
      {id:id(),system:'ITF Junior',category:'Girls 18U',value:'491',date:'2026-04-15',goal:''},
      {id:id(),system:'ITF Junior',category:'Girls 18U',value:'478',date:'2026-03-15',goal:''},
      {id:id(),system:'ITF Junior',category:'Girls 18U',value:'472',date:'2026-02-15',goal:''},
      {id:id(),system:'ITF Junior',category:'Girls 18U',value:'464',date:'2025-11-30',goal:'Career high'},
      {id:id(),system:'ITF Junior',category:'Girls 18U',value:'498',date:'2025-08-30',goal:''},
      {id:id(),system:'Tennis Europe',category:'U16',value:'TBD',date:'2026-05-07',goal:'Track if active'},
      {id:id(),system:'FRT Romania',category:'U18',value:'TBD',date:'2026-05-07',goal:'Track domestic position'}
    ],
    budget:[],
    sponsors:[
      {id:id(),company:'Auchan Romania',contact:'CSR / Marketing Manager',email:'',phone:'',package:'Tournament Partner',ask:5000,stage:'Prospect',contract:'Not started',agreementStart:'',agreementEnd:'',paymentStatus:'Not invoiced',paidAmount:0,scheduledPayment:'',sponsoredItem:'Tournament travel',sponsoredEventId:t5,deliverables:SPONSORED_ITEMS['Tournament travel'].deliverables,nextAction:'Find CSR contact and send corporate outreach email',renewal:'',notes:'Hypothetical prospect — community / youth-sport angle.'},
      {id:id(),company:'Hotel Timișoara Group',contact:'Owner / GM',email:'',phone:'',package:'In-kind Partner',ask:1500,stage:'Contacted',contract:'Not started',agreementStart:'',agreementEnd:'',paymentStatus:'Not invoiced',paidAmount:0,scheduledPayment:'',sponsoredItem:'Local prep block',sponsoredEventId:t3,deliverables:SPONSORED_ITEMS['Local prep block'].deliverables,nextAction:'Follow up with owner — proposed in-kind nights for May block',renewal:'',notes:'Warm intro through coach.'},
      {id:id(),company:'BCR (Banca Comercială Română)',contact:'CSR Lead',email:'',phone:'',package:'Season Partner',ask:10000,stage:'Research',contract:'Not started',agreementStart:'',agreementEnd:'',paymentStatus:'Not invoiced',paidAmount:0,scheduledPayment:'',sponsoredItem:'Season partner',sponsoredEventId:'',deliverables:SPONSORED_ITEMS['Season partner'].deliverables,nextAction:'Find right CSR contact and request introductory meeting',renewal:'',notes:'Larger corporate prospect — Romanian women’s sport angle.'},
      {id:id(),company:'Local Restaurant Group',contact:'Owner',email:'',phone:'',package:'Equipment Partner',ask:1500,stage:'Meeting',contract:'Not started',agreementStart:'',agreementEnd:'',paymentStatus:'Not invoiced',paidAmount:0,scheduledPayment:'',sponsoredItem:'Equipment package',sponsoredEventId:'',deliverables:SPONSORED_ITEMS['Equipment package'].deliverables,nextAction:'Send proposal one-pager after Tuesday meeting',renewal:'',notes:'Family-known business in Timișoara.'},
      {id:id(),company:'Diaspora Supporter (RO)',contact:'Family friend network',email:'',phone:'',package:'Supporter',ask:750,stage:'Contacted',contract:'Not started',agreementStart:'',agreementEnd:'',paymentStatus:'Not invoiced',paidAmount:0,scheduledPayment:'',sponsoredItem:'Equipment package',sponsoredEventId:'',deliverables:SPONSORED_ITEMS['Equipment package'].deliverables,nextAction:'Follow up after weekend',renewal:'',notes:'Romanian diaspora private supporter angle.'}
    ],
    settings:{senderName:'Eric',senderEmail:'',phone:'',defaultAsk:1500,annualBudget:45500},
    calendar:todayParts(),
    selected:{tournamentId:t4,sponsorId:'',doc:'sponsorOnePager'}
  };
}

function defaultBudgetRows(s){
  if(s.budget && s.budget.length) return s;
  const cost = {
    'J60 Frederiksberg':[['Tournament travel',900],['Accommodation and meals',650],['Coaching and training',300],['Equipment and stringing',120],['Entry fees',80]],
    'J60 Larnaca':[['Tournament travel',850],['Accommodation and meals',500],['Coaching and training',300],['Equipment and stringing',120],['Entry fees',80]],
    'J60 Dunakeszi':[['Tournament travel',500],['Accommodation and meals',350],['Coaching and training',300],['Equipment and stringing',80],['Entry fees',80]],
    'J60 Ulcinj':[['Tournament travel',650],['Accommodation and meals',450],['Coaching and training',350],['Recovery / physio',150],['Entry fees',80]],
    'J60 Podgorica Open':[['Tournament travel',650],['Accommodation and meals',450],['Coaching and training',350],['Recovery / physio',150],['Entry fees',80]],
    'J200 Targu Jiu':[['Tournament travel',250],['Accommodation and meals',300],['Coaching and training',300],['Local transport',80],['Entry fees',100]]
  };
  s.budget=[];
  s.tournaments.forEach(t=>{
    (cost[t.name] || [['Tournament travel',500],['Accommodation and meals',350],['Entry fees',80]]).forEach(([cat,amt])=>{
      s.budget.push({id:id(),eventId:t.id,category:cat,description:`${cat} for ${t.name}`,amount:amt,status:t.status==='Completed'?'Paid':'Needed'});
    });
  });
  s.budget.push({id:id(),eventId:'',category:'Training block',description:'Monthly training and match preparation',amount:1800,status:'Planned'});
  s.budget.push({id:id(),eventId:'',category:'Equipment and stringing',description:'Shoes, racquet maintenance, strings, grips',amount:850,status:'Needed'});
  s.budget.push({id:id(),eventId:'',category:'Recovery / physio',description:'Physio sessions, recovery, nutrition support',amount:1200,status:'Needed'});
  return s;
}

function load(){
  try{ const raw=localStorage.getItem(KEY); return raw ? migrate(JSON.parse(raw)) : defaultBudgetRows(createDefaultState()); }
  catch{ return defaultBudgetRows(createDefaultState()); }
}
function migrate(s){
  const f = createDefaultState();
  s.athlete = {...f.athlete, ...(s.athlete||{})};
  s.career = (s.career||f.career).map(c=>({...c, id:c.id||id(), type:c.type||'Other'}));
  s.tournaments = (s.tournaments||f.tournaments).map(t=>({...t, id:t.id||id(), points:t.points||0, outcome:t.outcome||''}));
  s.rankings = (s.rankings||f.rankings).map(r=>({...r, id:r.id||id()}));
  s.sponsors = (s.sponsors||f.sponsors).map(x=>({
    ...x, id:x.id||id(),
    contract:x.contract||'Not started',
    paymentStatus:x.paymentStatus||'Not invoiced',
    paidAmount:x.paidAmount||0,
    sponsoredItem:x.sponsoredItem||'Tournament travel',
    sponsoredEventId:x.sponsoredEventId||'',
    deliverables:x.deliverables||SPONSORED_ITEMS['Tournament travel'].deliverables
  }));
  s.settings = {...f.settings, ...(s.settings||{})};
  s.calendar = s.calendar || f.calendar;
  s.selected = s.selected || f.selected;
  return defaultBudgetRows(s);
}
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }

/* ---- Toast ------------------------------------------------- */
function toast(msg){
  const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('show'),1800);
}

/* ---- Chrome ------------------------------------------------ */
function nav(){
  const lbl = {dashboard:'Dashboard',profile:'Profile',career:'Career',calendar:'Calendar',tournaments:'Tournaments',rankings:'Rankings',budget:'Budget',sponsors:'Sponsors',documents:'Documents',settings:'Settings'};
  document.getElementById('nav').innerHTML = TABS.map(t=>`<button class="${t===active?'active':''}" data-tab="${t}">${lbl[t]}</button>`).join('');
}

function chrome(){
  const a=state.athlete; const ne=nextEvent();
  document.getElementById('heroCutout').src = a.cutout || 'assets/andreea-cutout.png';
  document.getElementById('heroTagline').textContent = a.summary;
  const wins = state.tournaments.filter(t=>t.outcome==='W').length;
  const losses = state.tournaments.filter(t=>t.outcome==='L').length;
  const liveText = state.tournaments.find(t=>t.status==='Active') ? 'LIVE · ' + (state.tournaments.find(t=>t.status==='Active').name) : 'CAMPAIGN ACTIVE · 2026';
  document.getElementById('liveChipText').textContent = liveText;
  document.getElementById('footerStamp').textContent = 'Updated ' + dateLong(todayISO());

  const days = ne ? daysUntil(ne.start) : null;
  const sb = [
    {lbl:`${a.rankingSystem}`, val:a.ranking, sub:`Career high ${a.careerHigh}`, cls:''},
    {lbl:'Goal', val:'300', sub:a.rankingGoal, cls:'gold'},
    {lbl:'Match record', val:`${wins}-${losses}`, sub:'Tracked outcomes', cls:''},
    {lbl:'Funding need', val:moneyShort(totalBudget()), sub:'Season model', cls:'money'},
    {lbl:'Pipeline', val:moneyShort(totalSponsors()), sub:'Active sponsor asks', cls:'money'},
    {lbl:'Next on court', val: ne ? (days>0 ? days+'d' : days===0 ? 'TODAY' : 'NOW') : '—', sub: ne ? ne.name : 'Add a tournament', cls:'live'}
  ];
  document.getElementById('scoreboard').innerHTML = sb.map(c=>`
    <div class="score-cell">
      <div class="lbl">${c.lbl}</div>
      <div class="val ${c.cls||''}">${esc(c.val)}</div>
      <div class="sub">${esc(c.sub)}</div>
    </div>`).join('');
}

function header(title,desc,toolbar=''){
  return `<div class="section-head"><div><div class="kicker">Campaign HQ</div><h2 class="ttl">${esc(title)}</h2><p class="desc">${esc(desc)}</p></div><div class="toolbar">${toolbar}</div></div>`;
}

/* ---- Dashboard --------------------------------------------- */
function renderDashboard(){
  const ne = nextEvent();
  const days = ne ? daysUntil(ne.start) : null;
  const ne_cost = ne ? eventCost(ne.id) : 0;
  const ne_committed = ne ? eventCommitted(ne.id) : 0;
  const ne_gap = ne ? eventGap(ne.id) : 0;
  const top = topThreeTasks();
  const bySurface = {Clay:0,Hard:0,Indoor:0,Grass:0,Carpet:0};
  state.tournaments.forEach(t=>{ if(bySurface.hasOwnProperty(t.surface)) bySurface[t.surface]++; });

  const html = header('Matchday operations','One screen per day. Pick the next event, see what it costs, see who can help close it, and grab the right document.') +
    `<div class="dash-grid">
      <div class="next-event-card surface-${(ne?.surface||'clay').toLowerCase()}">
        <div class="kicker">${esc(ne?.level || 'Next priority event')}</div>
        <h3>${esc(ne?.name || 'Add a tournament')}</h3>
        <div class="meta">${ne ? `${dateLong(ne.start)} → ${dateLong(ne.end)} · ${esc(ne.city||'')}, ${esc(ne.country||'')} · ${esc(ne.surface||'')}` : 'No upcoming event scheduled.'}</div>
        <div class="countdown">
          <div class="seg"><strong>${ne?(days>0?days:days===0?'0':'—'):'—'}</strong><span>${ne?(days>0?'days out':days===0?'today':'completed'):'no event'}</span></div>
          <div class="seg"><strong>${moneyShort(ne_cost)}</strong><span>event cost</span></div>
          <div class="seg"><strong>${moneyShort(ne_committed)}</strong><span>committed</span></div>
          <div class="seg" style="color:${ne_gap>0?'var(--live)':'var(--win)'}"><strong style="color:inherit">${moneyShort(ne_gap)}</strong><span>funding gap</span></div>
        </div>
        ${ne ? gaugeRowFor(ne) : ''}
        <div class="hero-actions" style="margin-top:14px">
          <button class="btn primary" data-go="documents" data-doc="tournamentBrief">Generate travel brief</button>
          <button class="btn ghost" data-edit-tournament="${ne?.id||''}">Edit event</button>
          <button class="btn ghost" data-go="sponsors">Find a sponsor</button>
        </div>
      </div>

      <div class="card tasks-card">
        <div class="card-accent" style="background:linear-gradient(90deg,var(--live),var(--gold))"></div>
        <div class="label">Top three plays today</div>
        <h3 style="margin-top:8px;font-size:24px">Action queue</h3>
        <ul>${top.map((t,i)=>`<li><span class="num">${i+1}</span><div><strong>${esc(t.title)}</strong><small>${esc(t.detail)}</small></div><button class="btn tiny" data-go="${t.tab}">Open</button></li>`).join('')}</ul>
      </div>
    </div>` +

    `<div class="cards" style="margin-top:18px">
      <div class="card">
        <div class="card-accent"></div>
        <div class="label">Funding gap</div>
        <h3>${money(fundingGap())}</h3>
        <p>${money(sponsorPaid())} collected · ${money(totalSponsors())} pipeline · ${money(totalBudget())} season model.</p>
        <div class="actions"><button class="btn" data-go="budget">Open budget</button><button class="btn" data-go="sponsors">Open sponsors</button></div>
      </div>
      <div class="card">
        <div class="card-accent" style="background:linear-gradient(90deg,var(--pipe),var(--money))"></div>
        <div class="label">Sponsor pipeline</div>
        <h3>${state.sponsors.filter(s=>!['Closed lost','Research'].includes(s.stage)).length} active</h3>
        <p>${state.sponsors.filter(s=>s.stage==='Committed' || s.stage==='Active').length} committed · ${state.sponsors.filter(s=>s.stage==='Meeting' || s.stage==='Negotiating' || s.stage==='Proposal sent').length} in conversation.</p>
        <div class="actions"><button class="btn" data-go="sponsors">Open pipeline</button></div>
      </div>
      <div class="card">
        <div class="card-accent" style="background:linear-gradient(90deg,var(--gold),var(--clay))"></div>
        <div class="label">Schedule load</div>
        <h3>${state.tournaments.length} events</h3>
        <p>${bySurface.Clay} clay · ${bySurface.Hard} hard · ${bySurface.Indoor} indoor · ${state.tournaments.filter(t=>t.priority==='A').length} priority A.</p>
        <div class="actions"><button class="btn" data-go="calendar">Open calendar</button><button class="btn" data-go="tournaments">Open list</button></div>
      </div>
    </div>` +

    rankingChartCard() +
    pipelineFunnelCard() +
    resultsHeatmapCard() +
    `<div class="chart-card">
      <div class="chart-head"><h3>Upcoming schedule</h3><div class="legend"><span><i style="background:var(--clay)"></i>Clay</span><span><i style="background:var(--hard)"></i>Hard</span><span><i style="background:var(--indoor)"></i>Indoor</span></div></div>
      ${tableSchedule(state.tournaments)}
    </div>`;
  document.getElementById('dashboard').innerHTML = html;
}

function topThreeTasks(){
  const tasks=[];
  const ne = nextEvent();
  if(ne){
    const gap = eventGap(ne.id);
    if(gap>0) tasks.push({title:`Close funding gap on ${ne.name}`, detail:`${money(gap)} still needed for ${ne.level} · ${dateShort(ne.start)}`, tab:'sponsors'});
    else tasks.push({title:`Send Tournament Travel Brief — ${ne.name}`, detail:`Update sponsors before ${dateShort(ne.start)}`, tab:'documents'});
  }
  const stale = state.sponsors.find(s=>s.stage==='Contacted' || s.stage==='Proposal sent');
  if(stale) tasks.push({title:`Follow up — ${stale.company}`, detail: stale.nextAction || 'Send follow-up email after 7-10 days.', tab:'sponsors'});
  const meeting = state.sponsors.find(s=>s.stage==='Meeting');
  if(meeting) tasks.push({title:`Prep for meeting — ${meeting.company}`, detail:`Review the Sponsor Meeting Guide and confirm the ask: ${money(meeting.ask)}.`, tab:'documents'});
  if(tasks.length<3){
    const noNext = state.sponsors.find(s=>!s.nextAction);
    if(noNext) tasks.push({title:`Set next action — ${noNext.company}`, detail:'No next action defined. Decide an outreach step.', tab:'sponsors'});
  }
  if(tasks.length<3){
    tasks.push({title:'Send the monthly sponsor update', detail:'Open Documents → Monthly Sponsor Report.', tab:'documents'});
  }
  return tasks.slice(0,3);
}

function gaugeRowFor(ev){
  const cost=eventCost(ev.id), committed=eventCommitted(ev.id), paid=eventPaid(ev.id);
  const tiles = [
    {lbl:'Funded',val: cost? Math.min(100, Math.round(committed/cost*100)) : 0, h:`${moneyShort(committed)}`, p:`of ${moneyShort(cost)} event budget`},
    {lbl:'Paid',val: cost? Math.min(100, Math.round(paid/cost*100)) : 0, h:`${moneyShort(paid)}`, p:`actually received`},
    {lbl:'Sponsors',val: Math.min(100, state.sponsors.filter(s=>s.sponsoredEventId===ev.id).length*25), h:`${state.sponsors.filter(s=>s.sponsoredEventId===ev.id).length}`, p:`linked to this event`}
  ];
  return `<div class="gauge-row">${tiles.map(t=>`
    <div class="gauge-tile">
      ${gaugeSvg(t.val)}
      <div><div class="lbl">${t.lbl}</div><h4>${esc(t.h)}</h4><p>${esc(t.p)}</p></div>
    </div>`).join('')}</div>`;
}

/* ---- SVG charts -------------------------------------------- */
function gaugeSvg(percent){
  const r = 36, c = 2*Math.PI*r;
  const dash = c * (Math.max(0,Math.min(100,percent))/100);
  return `<div class="gauge"><svg viewBox="0 0 96 96">
    <defs><linearGradient id="gaugeGrad${percent}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#d65a3a"/><stop offset="100%" stop-color="#ffc94d"/></linearGradient></defs>
    <circle class="gtrack" cx="48" cy="48" r="${r}" stroke-width="9"/>
    <circle class="gprog" cx="48" cy="48" r="${r}" stroke-width="9" stroke="url(#gaugeGrad${percent})" stroke-dasharray="${dash} ${c}" transform="rotate(-90 48 48)"/>
    <text class="glabel" x="48" y="46">${percent}%</text>
    <text class="gsub" x="48" y="62">funded</text>
  </svg></div>`;
}

function rankingChartCard(){
  const r = state.rankings.filter(x=>x.system==='ITF Junior' && x.value!=='TBD' && Number(x.value));
  if(r.length<2) return '';
  const sorted = [...r].filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x.date)).sort((a,b)=>a.date.localeCompare(b.date));
  if(sorted.length<2) return '';
  const W=900,H=300,pad={l:48,r:24,t:20,b:36};
  const xs = sorted.map(s=>new Date(s.date+'T00:00:00').getTime());
  const ys = sorted.map(s=>Number(s.value));
  const minX=Math.min(...xs), maxX=Math.max(...xs);
  const yMin=Math.min(...ys, 300), yMax=Math.max(...ys);
  const xScale = x => pad.l + (x-minX)/(maxX-minX||1) * (W-pad.l-pad.r);
  // ranking is "lower = better" so we INVERT the y-axis (higher rank# = lower on chart)
  const yScale = y => pad.t + (y-yMin)/(yMax-yMin||1) * (H-pad.t-pad.b);
  const points = sorted.map(s=>({x:xScale(new Date(s.date+'T00:00:00').getTime()), y:yScale(Number(s.value)), val:s.value, date:s.date}));
  const linePath = 'M ' + points.map(p=>`${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ');
  const areaPath = linePath + ` L ${points[points.length-1].x.toFixed(1)} ${H-pad.b} L ${points[0].x.toFixed(1)} ${H-pad.b} Z`;
  const goal = 300;
  const goalY = yScale(goal);
  const careerHigh = Number(state.athlete.careerHigh);
  const chY = yScale(careerHigh);
  // grid
  const gridYs = [yMin, Math.round((yMin+yMax)/2), yMax];
  const labels = sorted.filter((_,i)=>i%Math.ceil(sorted.length/6)===0 || i===sorted.length-1);
  return `<div class="chart-card">
    <div class="chart-head">
      <div><h3>Ranking trajectory · ITF Junior</h3><div class="muted" style="font-size:13px;margin-top:4px">Lower number is better. Goal Top ${goal}.</div></div>
      <div class="legend">
        <span><i style="background:var(--clay)"></i>Ranking</span>
        <span><i style="background:var(--gold);height:1.5px"></i>Career high (${careerHigh})</span>
        <span><i style="background:var(--money);height:1.5px"></i>Goal (${goal})</span>
      </div>
    </div>
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="trajGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#d65a3a" stop-opacity=".5"/><stop offset="100%" stop-color="#d65a3a" stop-opacity="0"/></linearGradient>
      </defs>
      <g class="chart-area-grid">
        ${gridYs.map(y=>{const py=yScale(y);return `<line x1="${pad.l}" x2="${W-pad.r}" y1="${py}" y2="${py}"/>`;}).join('')}
      </g>
      ${chY>pad.t&&chY<H-pad.b?`<line x1="${pad.l}" x2="${W-pad.r}" y1="${chY}" y2="${chY}" class="chart-line career"/>`:''}
      ${goalY>pad.t&&goalY<H-pad.b?`<line x1="${pad.l}" x2="${W-pad.r}" y1="${goalY}" y2="${goalY}" class="chart-line goal"/>`:''}
      <path d="${areaPath}" class="chart-area"/>
      <path d="${linePath}" class="chart-line"/>
      ${points.map((p,i)=>`<circle cx="${p.x}" cy="${p.y}" r="${i===points.length-1?6:4}" class="chart-dot"/>`).join('')}
      ${gridYs.map(y=>`<text class="chart-axis" x="${pad.l-8}" y="${yScale(y)+4}" text-anchor="end">${y}</text>`).join('')}
      ${labels.map(s=>`<text class="chart-axis" x="${xScale(new Date(s.date+'T00:00:00').getTime())}" y="${H-12}" text-anchor="middle">${s.date.slice(2,7)}</text>`).join('')}
    </svg>
  </div>`;
}

function pipelineFunnelCard(){
  const stages = FUNNEL_STAGES;
  const counts = stages.map(st => ({
    stage: st,
    n: state.sponsors.filter(s=>s.stage===st).length,
    amt: state.sponsors.filter(s=>s.stage===st).reduce((a,s)=>a+Number(s.ask||0),0)
  }));
  return `<div class="chart-card">
    <div class="chart-head">
      <div><h3>Sponsor pipeline</h3><div class="muted" style="font-size:13px;margin-top:4px">Click a stage to filter the sponsor list.</div></div>
      <div class="legend"><span>${state.sponsors.length} total prospects</span></div>
    </div>
    <div class="funnel">${counts.map(c=>{
      const cls = c.stage==='Active' ? 'active' : c.stage==='Committed' ? 'committed' : '';
      return `<div class="funnel-stage ${cls}" data-funnel="${c.stage}"><div class="lbl">${esc(c.stage)}</div><div class="num">${c.n}</div><div class="amt">${moneyShort(c.amt)}</div></div>`;
    }).join('')}</div>
  </div>`;
}

function resultsHeatmapCard(){
  // Group tournaments by surface
  const surfaces = ['Clay','Hard','Indoor','Grass'];
  const sorted = [...state.tournaments].sort((a,b)=>(a.start||'').localeCompare(b.start||''));
  return `<div class="chart-card">
    <div class="chart-head">
      <div><h3>Tournament heat map</h3><div class="muted" style="font-size:13px;margin-top:4px">Surface coded · click a cell to edit the event.</div></div>
      <div class="legend">
        <span><i style="background:var(--win)"></i>Win</span>
        <span><i style="background:var(--loss)"></i>Loss</span>
        <span><i style="background:var(--clay)"></i>Clay</span>
        <span><i style="background:var(--hard)"></i>Hard</span>
        <span><i style="background:var(--indoor)"></i>Indoor</span>
      </div>
    </div>
    <div class="heat-rows">
      ${surfaces.map(surf=>{
        const cells = sorted.filter(t=>t.surface===surf);
        if(!cells.length) return '';
        return `<div>
          <div class="heat-label">${surf} · ${cells.length} events</div>
          <div class="heat-grid">
            ${cells.map(t=>`<div class="heat-cell ${SURFACE_CSS(t.surface)} ${t.outcome==='W'?'win':t.outcome==='L'?'loss':''}" data-edit-tournament="${t.id}" title="${esc(t.name)} · ${esc(t.start||'')} · ${esc(t.result||'no result')}">
              <div class="top">${esc((t.level||'').replace('ITF Junior ','').replace('Tennis Europe ','TE '))}</div>
              <div class="res">${esc(t.outcome||'·')}</div>
            </div>`).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function tableSchedule(items){
  return `<div class="table-wrap"><table>
    <thead><tr><th></th><th>Event</th><th>Dates</th><th>Level</th><th>Surface</th><th>Status</th><th>Pri</th><th>Cost</th><th>Committed</th><th>Gap</th></tr></thead>
    <tbody>${items.map(t=>`<tr class="${state.selected.tournamentId===t.id?'selected':''}" data-edit-tournament="${t.id}">
      <td class="row-bar ${SURFACE_CSS(t.surface)}"><div></div></td>
      <td><strong>${esc(t.name)}</strong><div class="muted" style="font-size:12px">${esc(t.city||'')}, ${esc(t.country||'')}</div></td>
      <td>${dateShort(t.start)} → ${dateShort(t.end)}</td>
      <td>${esc(t.level||'')}</td>
      <td>${esc(t.surface||'')}</td>
      <td><span class="${STATUS_CSS(t.status)}"><span class="d"></span>${esc(t.status||'')}</span></td>
      <td><span class="pill-priority ${t.priority}">${esc(t.priority||'')}</span></td>
      <td>${moneyShort(eventCost(t.id))}</td>
      <td>${moneyShort(eventCommitted(t.id))}</td>
      <td style="color:${eventGap(t.id)>0?'var(--live)':'var(--win)'}">${moneyShort(eventGap(t.id))}</td>
    </tr>`).join('')}</tbody>
  </table></div>`;
}

/* ---- Profile ----------------------------------------------- */
function renderProfile(){
  const a=state.athlete;
  document.getElementById('profile').innerHTML = header('Athlete profile','Source-of-truth identity card. Edits here flow into every document, email, and sponsor pitch.') +
    `<div class="form-grid">
      ${field('First name','athlete','firstName',a.firstName)}
      ${field('Last name','athlete','lastName',a.lastName)}
      ${field('Sport','athlete','sport',a.sport)}
      ${field('Date of birth','athlete','dob',a.dob,'date')}
      ${field('City','athlete','city',a.city)}
      ${field('Country','athlete','country',a.country)}
      ${field('Club','athlete','club',a.club)}
      ${field('Coach','athlete','coach',a.coach)}
      ${field('School','athlete','school',a.school)}
      ${field('Handed','athlete','handed',a.handed)}
      ${field('Height','athlete','height',a.height)}
      ${field('Ranking system','athlete','rankingSystem',a.rankingSystem,'select',RANKING_SYSTEMS)}
      ${field('Ranking','athlete','ranking',a.ranking)}
      ${field('Career high','athlete','careerHigh',a.careerHigh)}
      ${field('Season high','athlete','seasonHigh',a.seasonHigh)}
      ${field('Ranking goal','athlete','rankingGoal',a.rankingGoal)}
      ${field('Athlete summary','athlete','summary',a.summary,'textarea','','w12')}
      ${field('Strengths','athlete','strengths',a.strengths,'textarea','','w6')}
      ${field('Development needs','athlete','needs',a.needs,'textarea','','w6')}
    </div>`;
}

/* ---- Career ------------------------------------------------ */
function renderCareer(){
  const order = state.career.slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  const cls = t => t==='Trophy'?'win': t==='Final'?'final': t==='Ranking'?'rank': '';
  document.getElementById('career').innerHTML = header('Career storyline','Verified results, milestones, and ranking moments. The story sponsors and journalists need to read in 30 seconds.') +
    `<div class="career-track">${order.slice(0,8).map(c=>`
      <div class="career-step ${cls(c.type)}">
        <div class="yr">${esc(c.date||'')}</div>
        <div class="typ">${esc(c.type||'')}</div>
        <h4>${esc(c.title||'')}</h4>
        <p>${esc(c.body||'')}</p>
        ${c.source ? `<div class="muted" style="margin-top:8px;font-size:11px;letter-spacing:.12em;text-transform:uppercase">Source · ${esc(c.source)}</div>`:''}
      </div>`).join('')}</div>
    <div class="career-admin">
      <div class="section-head" style="margin-top:0;padding-bottom:10px"><div><h2 class="ttl" style="font-size:32px">Career data editor</h2><p class="desc">Add, edit, or remove storyline entries. Most recent shows first.</p></div><div class="toolbar"><button class="btn primary" id="addCareer">Add milestone</button></div></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Date</th><th>Type</th><th>Title</th><th>Details</th><th>Source</th><th></th></tr></thead>
        <tbody>${state.career.map((e,i)=>`<tr>
          <td>${cell('career',i,'date',e.date)}</td>
          <td><select data-scope="career" data-idx="${i}" data-key="type">${opt(CAREER_TYPES,e.type)}</select></td>
          <td>${cell('career',i,'title',e.title)}</td>
          <td><textarea data-scope="career" data-idx="${i}" data-key="body">${esc(e.body)}</textarea></td>
          <td>${cell('career',i,'source',e.source||'')}</td>
          <td><button class="btn tiny danger" data-delete="career:${i}">×</button></td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>`;
}

/* ---- Calendar ---------------------------------------------- */
function renderCalendar(){
  const y=Number(state.calendar.year), m=Number(state.calendar.month);
  const first=new Date(y,m,1), last=new Date(y,m+1,0), start=(first.getDay()+6)%7;
  const monthName=first.toLocaleDateString('en-GB',{month:'long',year:'numeric'});
  const cells=[]; for(let i=0;i<start;i++) cells.push('<div class="day blank"></div>');
  const today = todayISO();
  for(let d=1; d<=last.getDate(); d++){
    const iso=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const ev=state.tournaments.filter(t=>t.start===iso || dateInRange(iso,t.start,t.end));
    cells.push(`<div class="day ${iso===today?'today':''}" data-add-date="${iso}">
      <div class="day-num">${d}</div>
      ${ev.map(e=>`<span class="day-pill ${e.track==='Training'?'training':e.track==='Sponsor/Admin'?'sponsor':SURFACE_CSS(e.surface)}" data-edit-tournament="${e.id}">${esc(e.name)}</span>`).join('')}
    </div>`);
  }
  document.getElementById('calendar').innerHTML = header('Calendar','Click any day to add a tournament. Click any pill to edit it. Pills are colour-coded by surface.', `<button class="btn" id="prevMonth">← Prev</button><input class="compact-input" type="month" id="monthPicker" value="${y}-${String(m+1).padStart(2,'0')}"><button class="btn" id="nextMonth">Next →</button>`) +
    `<div class="calendar-head"><div class="calendar-title">${esc(monthName)}</div><div class="muted">Mon-first calendar · ${state.tournaments.length} schedule items</div></div>
    <div class="calendar-scroll calendar-scroll-x"><div class="weekdays">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(x=>`<div class="weekday">${x}</div>`).join('')}</div><div class="calendar">${cells.join('')}</div></div>`;
}
function dateInRange(iso,start,end){ return start && end && iso>=start && iso<=end; }

/* ---- Tournaments ------------------------------------------- */
function renderTournaments(){
  document.getElementById('tournaments').innerHTML = header('Tournaments','One row per event. Costs come from budget rows linked to the event. Sponsor commitments come from sponsor records linked to the event.',`<button class="btn primary" id="addTournament">+ Tournament</button>`) +
    `<div class="table-wrap"><table>
      <thead><tr><th></th><th>Name</th><th>Start</th><th>End</th><th>Level</th><th>Surface</th><th>Status</th><th>Pri</th><th>Cost</th><th>Committed</th><th>Gap</th><th>W/L</th><th>Result</th><th></th></tr></thead>
      <tbody>${state.tournaments.map((t,i)=>`<tr id="tour-${t.id}" class="${state.selected.tournamentId===t.id?'selected':''}">
        <td class="row-bar ${SURFACE_CSS(t.surface)}"><div></div></td>
        <td>${cell('tournaments',i,'name',t.name)}</td>
        <td>${cell('tournaments',i,'start',t.start,'date')}</td>
        <td>${cell('tournaments',i,'end',t.end,'date')}</td>
        <td>${selectCell('tournaments',i,'level',t.level,LEVELS)}</td>
        <td>${selectCell('tournaments',i,'surface',t.surface,SURFACES)}</td>
        <td>${selectCell('tournaments',i,'status',t.status,STATUS)}</td>
        <td>${selectCell('tournaments',i,'priority',t.priority,PRIORITY)}</td>
        <td>${moneyShort(eventCost(t.id))}</td>
        <td>${moneyShort(eventCommitted(t.id))}</td>
        <td style="color:${eventGap(t.id)>0?'var(--live)':'var(--win)'}">${moneyShort(eventGap(t.id))}</td>
        <td>${selectCell('tournaments',i,'outcome',t.outcome,['','W','L','SF','F','QF'])}</td>
        <td>${cell('tournaments',i,'result',t.result)}</td>
        <td><button class="btn tiny danger" data-delete="tournaments:${i}">×</button></td>
      </tr>`).join('')}</tbody>
    </table></div>`;
}

/* ---- Rankings ---------------------------------------------- */
function renderRankings(){
  document.getElementById('rankings').innerHTML = header('Rankings','Track each ranking system separately. Ranking history feeds the trajectory chart on the dashboard.',`<button class="btn primary" id="addRanking">+ Ranking entry</button>`) +
    rankingChartCard() +
    `<div class="table-wrap" style="margin-top:18px"><table>
      <thead><tr><th>System</th><th>Category</th><th>Value</th><th>Date</th><th>Goal / note</th><th></th></tr></thead>
      <tbody>${state.rankings.map((r,i)=>`<tr>
        <td>${selectCell('rankings',i,'system',r.system,RANKING_SYSTEMS)}</td>
        <td>${selectCell('rankings',i,'category',r.category,CATEGORIES)}</td>
        <td>${cell('rankings',i,'value',r.value)}</td>
        <td>${cell('rankings',i,'date',r.date)}</td>
        <td>${cell('rankings',i,'goal',r.goal)}</td>
        <td><button class="btn tiny danger" data-delete="rankings:${i}">×</button></td>
      </tr>`).join('')}</tbody>
    </table></div>`;
}

/* ---- Budget ------------------------------------------------ */
function renderBudget(){
  const byEvent = state.tournaments.map(t=>{
    const cost=eventCost(t.id), committed=eventCommitted(t.id), gap=eventGap(t.id);
    const pct = cost? Math.min(100, Math.round(committed/cost*100)) : 0;
    return `<div class="card ${SURFACE_CSS(t.surface)}">
      <div class="card-accent"></div>
      <div class="label">${esc(t.level)}</div>
      <h3>${esc(t.name)}</h3>
      <p>${dateShort(t.start)} · ${moneyShort(cost)} · gap <strong style="color:${gap>0?'var(--live)':'var(--win)'}">${moneyShort(gap)}</strong></p>
      <div class="gauge-row" style="grid-template-columns:1fr;margin-top:14px">
        <div class="gauge-tile">${gaugeSvg(pct)}<div><div class="lbl">Funded</div><h4>${moneyShort(committed)}</h4><p>of ${moneyShort(cost)} · ${state.sponsors.filter(s=>s.sponsoredEventId===t.id).length} sponsor link(s)</p></div></div>
      </div>
      <div class="actions"><button class="btn" data-edit-tournament="${t.id}">Open event</button></div>
    </div>`;
  }).join('');
  document.getElementById('budget').innerHTML = header('Budget','Budget is event-linked. Pick the event for each cost row. Tournament totals update automatically.',`<button class="btn primary" id="addBudget">+ Budget item</button>`) +
    `<div class="cards">${byEvent}<div class="card">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--pipe),var(--money))"></div>
      <div class="label">General season</div>
      <h3>${money(generalCost())}</h3>
      <p>Training, equipment, and items not tied to one event.</p>
    </div></div>
    <div class="section-head" style="margin-top:30px"><div><h2 class="ttl" style="font-size:32px">Budget line items</h2><p class="desc">Source of truth for every event cost and the season funding gap.</p></div></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Event</th><th>Category</th><th>Description</th><th>Amount</th><th>Status</th><th></th></tr></thead>
      <tbody>${state.budget.map((b,i)=>`<tr>
        <td><select data-scope="budget" data-idx="${i}" data-key="eventId"><option value="">General / season</option>${state.tournaments.map(t=>`<option value="${t.id}" ${t.id==b.eventId?'selected':''}>${esc(t.name)}</option>`).join('')}</select></td>
        <td><select data-scope="budget" data-idx="${i}" data-key="category">${opt(BUDGET_CATEGORIES,b.category)}</select></td>
        <td>${cell('budget',i,'description',b.description)}</td>
        <td>${cell('budget',i,'amount',b.amount,'number')}</td>
        <td><select data-scope="budget" data-idx="${i}" data-key="status">${opt(BUDGET_STATUS,b.status)}</select></td>
        <td><button class="btn tiny danger" data-delete="budget:${i}">×</button></td>
      </tr>`).join('')}</tbody>
    </table></div>`;
}

/* ---- Sponsors ---------------------------------------------- */
function renderSponsors(){
  const filtered = funnelFilter ? state.sponsors.filter(s=>s.stage===funnelFilter) : state.sponsors;
  const cur = currentSponsor();
  const list = filtered.map(s=>{
    const cls = SURFACE_CSS('clay'); // visual placeholder
    const guide = SPONSORED_ITEMS[s.sponsoredItem] || SPONSORED_ITEMS['Tournament travel'];
    return `<div class="sponsor-card ${s.id===cur.id?'selected':''}" data-select-sponsor="${s.id}">
      <div class="head"><div><h3>${esc(s.company)}</h3><div class="muted" style="font-size:13px">${esc(s.contact||'No contact yet')}</div></div>
      <span class="pill-status ${s.stage==='Active'||s.stage==='Committed'?'active':'acceptance'}"><span class="d"></span>${esc(s.stage)}</span></div>
      <div class="row"><span>${esc(s.package||'Partner')}</span><span>${moneyShort(s.ask)} ask</span><span>${moneyShort(s.paidAmount)} paid</span><span>${esc(s.sponsoredItem||'')}</span></div>
      <div class="next"><strong style="color:var(--ink)">Next:</strong> ${esc(s.nextAction || 'No next action set')}</div>
    </div>`;
  }).join('') || '<div class="muted" style="padding:30px;text-align:center;border:1px dashed var(--line)">No sponsors in this stage yet.</div>';

  const guide = SPONSORED_ITEMS[cur.sponsoredItem] || SPONSORED_ITEMS['Tournament travel'];

  document.getElementById('sponsors').innerHTML = header('Sponsor pipeline','CRM for prospects, conversations, agreements, payments, and renewals. Click a stage in the funnel to filter.', `<button class="btn primary" id="addSponsor">+ Sponsor</button>${funnelFilter?`<button class="btn" id="clearFunnel">Clear filter: ${esc(funnelFilter)}</button>`:''}`) +
    pipelineFunnelCard() +
    `<div class="sponsor-grid" style="margin-top:18px">
      <div class="sponsor-list">${list}</div>
      <div class="sponsor-side">
        <div class="card">
          <div class="card-accent"></div>
          <div class="label">Selected sponsor</div>
          <h3>${esc(cur.company || 'No sponsor')}</h3>
          <p>${esc(cur.contact||'No contact')} · ${esc(cur.package||'')}</p>
          <div class="advice-box"><strong>Approach:</strong> ${esc(guide.advice)}<br><strong>Suggested document:</strong> ${esc(recommendedDoc(cur))}</div>
          <div class="actions">
            <button class="btn primary" data-go="documents" data-doc="${suggestedDocKey(cur)}">Generate document</button>
            <button class="btn" data-email-preview>Preview outreach email</button>
          </div>
        </div>
        <div class="card" style="margin-top:14px">
          <div class="label">Outreach email preview</div>
          <div class="email-box" id="emailBox">Click "Preview outreach email" to draft the right template for ${esc(cur.company||'this sponsor')}.</div>
          <div class="actions"><button class="btn primary" id="copyEmail">Copy email</button><button class="btn" id="mailtoEmail">Open in mail app</button></div>
        </div>
      </div>
    </div>
    <div class="section-head" style="margin-top:30px"><div><h2 class="ttl" style="font-size:32px">Sponsor database</h2><p class="desc">Inline editable CRM. Sponsored item drives the recommended document and deliverables.</p></div></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Company</th><th>Contact</th><th>Email</th><th>Package</th><th>Ask</th><th>Paid</th><th>Stage</th><th>Contract</th><th>Payment</th><th>Sponsored event</th><th>Sponsored item</th><th>Next action</th><th></th></tr></thead>
      <tbody>${state.sponsors.map((s,i)=>`<tr>
        <td>${cell('sponsors',i,'company',s.company)}</td>
        <td>${cell('sponsors',i,'contact',s.contact)}</td>
        <td>${cell('sponsors',i,'email',s.email)}</td>
        <td>${cell('sponsors',i,'package',s.package)}</td>
        <td>${cell('sponsors',i,'ask',s.ask,'number')}</td>
        <td>${cell('sponsors',i,'paidAmount',s.paidAmount,'number')}</td>
        <td><select data-scope="sponsors" data-idx="${i}" data-key="stage">${opt(SPONSOR_STAGE,s.stage)}</select></td>
        <td><select data-scope="sponsors" data-idx="${i}" data-key="contract">${opt(CONTRACT_STATUS,s.contract)}</select></td>
        <td><select data-scope="sponsors" data-idx="${i}" data-key="paymentStatus">${opt(PAYMENT_STATUS,s.paymentStatus)}</select></td>
        <td><select data-scope="sponsors" data-idx="${i}" data-key="sponsoredEventId"><option value="">General / season</option>${state.tournaments.map(t=>`<option value="${t.id}" ${t.id==s.sponsoredEventId?'selected':''}>${esc(t.name)}</option>`).join('')}</select></td>
        <td><select data-scope="sponsors" data-idx="${i}" data-key="sponsoredItem">${opt(Object.keys(SPONSORED_ITEMS),s.sponsoredItem)}</select></td>
        <td>${cell('sponsors',i,'nextAction',s.nextAction)}</td>
        <td><button class="btn tiny danger" data-delete="sponsors:${i}">×</button></td>
      </tr>`).join('')}</tbody>
    </table></div>`;
}

function recommendedDoc(s){
  if(!s) return 'Sponsor Proposal One-Pager';
  const item=s.sponsoredItem||'';
  if(item==='Season partner') return 'Corporate Sponsorship Proposal + Season Budget';
  if(item==='Tournament travel') return 'Tournament Travel Brief + Local Sponsor Email';
  if(item==='Equipment package') return 'Athlete Profile / Media Kit + Local Sponsor Email';
  if(item==='Coaching block') return 'Athlete Development Plan + Budget Request';
  if(item==='Recovery / physio') return 'Athlete Profile + Recovery Use-of-Funds Note';
  return 'Local Sponsor Email + One-Page Sponsor Sheet';
}

function suggestedDocKey(s){
  if(!s) return 'sponsorOnePager';
  const item=s.sponsoredItem||'';
  if(item==='Season partner') return 'corporateProposal';
  if(item==='Tournament travel') return 'tournamentBrief';
  if(item==='Equipment package' || item==='Local prep block') return 'localSponsorEmail';
  return 'sponsorOnePager';
}

/* ---- Documents (the heart) --------------------------------- */
const NL='\n';
function docsCatalog(){
  const a=state.athlete, full=`${a.firstName} ${a.lastName}`.trim();
  const s=currentSponsor();
  const ne=currentTournament();
  const guide = SPONSORED_ITEMS[s.sponsoredItem] || SPONSORED_ITEMS['Tournament travel'];

  // Pitch / public-facing
  const sponsorOnePager = {
    cat:'Pitch materials',
    title:'Local Sponsor One-Pager',
    sub:`${full} · 2026 development campaign`,
    band:[['Athlete', `${full}, age ${a.age}`],['Ranking', `${a.rankingSystem} ${a.ranking}`],['Funding need', money(state.settings.annualBudget||totalBudget())]],
    sections:[
      ['Become a local supporter of '+full, `${full} is a Romanian junior tennis player from ${a.city}, building an international pathway through national titles, European junior recognition, and ITF junior results. The next stage is more expensive and more demanding: higher-level tournaments, travel, coaching support, equipment, fitness, recovery, and consistent match exposure. Local partners can help turn momentum into a structured 2026 development campaign.`],
      ['Verified accomplishments', null, listFrom(state.career.filter(c=>c.type==='Trophy'||c.type==='Final').slice(0,6).map(c=>`${c.title} (${c.date})`))],
      ['What a local sponsor makes possible', null, listFrom([
        'Tournament blocks: travel, lodging, meals, local transport, entry logistics.',
        'Coaching support: shared coach weeks, match analysis, tactical planning.',
        'Training and recovery: court time, fitness, physio, recovery, nutrition support.',
        'Equipment and content: strings, shoes, racquets, video, photography, sponsor updates.'
      ])],
      ['Suggested first commitment', `A strong first commitment funds one tournament block or one training block. Contact ${state.settings.senderName||'us'} to discuss the right fit for your business.`],
      ['Sources', `Official ITF profile · Official WTA profile · Radio România Timișoara · Opinia Timișoarei. Full source links available on request.`]
    ]
  };

  const sponsorDeck = {
    cat:'Pitch materials',
    title:'2026 Sponsor Proposal',
    sub:`Andreea Olariu · Romanian ITF Junior Tennis Player · Prepared for corporate, local, and individual partners`,
    band:[['Campaign', '2026 development'],['Stage', 'ITF Junior'],['Home base', a.city+', '+a.country]],
    sections:[
      ['A story of ambition, discipline, and momentum', `${full} has already built a real record in Romanian and international junior tennis. The next step is turning that momentum into sustained international progress. From ${a.city} to international junior competition, ${full} has progressed from national titles in Romania to European recognition, ITF junior results, and national team participation. Behind those milestones is the daily reality of serious junior tennis: training, travel, coaching, recovery, and a family commitment that grows as the level rises.${NL}${NL}This proposal invites partners to support an athlete at an important development stage, where the right help can expand access to stronger tournament opportunities and accelerate the path ahead.`],
      ['Athlete snapshot', null, kvFrom([
        ['Name', full],['Nationality', a.country],['Date of birth', a.dob || 'TBD'],['Stage','ITF Junior Circuit and early women\'s ITF exposure'],['Home base', `${a.city} pathway with national and international junior results`],['2026 focus','Ranking growth, competition efficiency, and long-term development']
      ])],
      ['Verified performance foundation', null, listFrom(state.career.filter(c=>c.type==='Trophy' || c.type==='Final').map(c=>`${c.date} — ${c.title}: ${c.body}`))],
      ['2026 campaign plan', `Ranking conversion: prioritise J30 and J60 events where deep runs and ranking points are realistic.${NL}Selective escalation: add J100 or higher events when acceptance, surface, and travel cost align.${NL}Cost-controlled scheduling: cluster tournament weeks by geography and surface to improve efficiency.${NL}Pathway flexibility: maintain junior ITF progress while preserving long-term professional and academic options.`],
      ['What your support funds', null, listFrom([
        'Tournament blocks — travel, lodging, meals, local transport, entry logistics.',
        'Coaching support — coach travel, shared coaching weeks, match analysis, tactical planning.',
        'Training & recovery — court time, fitness, physio, recovery, nutrition support.',
        'Equipment & content — racquets, strings, shoes, video, photography, sponsor reporting.'
      ])],
      ['Partnership levels', null, tableFrom(['Level','Contribution','Funds','Partner benefits'], SPONSOR_LEVELS.map(l=>[l.label, l.range, l.use, levelBenefits(l.label)]))],
      ['Transparent reporting', `Monthly update — results, ranking movement, photos, athlete note, and next month plan.${NL}Proof folder — official profiles, press, draws, certificates, photos, and video links.${NL}Budget discipline — spending categories tied to tournament or training blocks.${NL}Renewal path — deliverable tracker, partner assets, and timing for continued support.`],
      ['Next step', `Partner with ${full}'s 2026 campaign. Recommended first commitment: one tournament block or one training block.${NL}${NL}Contact ${state.settings.senderName||'[Family contact]'} ${state.settings.senderEmail?'· '+state.settings.senderEmail:''} ${state.settings.phone?'· '+state.settings.phone:''}`]
    ]
  };

  const developmentPlan = {
    cat:'Pitch materials',
    title:'2026 Development & Sponsorship Plan',
    sub:`${full} · Strategic plan for serious sponsor, foundation, and academy conversations`,
    band:[['Annual budget model', money(state.settings.annualBudget||totalBudget())],['Pipeline', money(totalSponsors())],['Funding gap', money(fundingGap())]],
    sections:[
      ['Executive summary',`${full} is a Romanian junior tennis player from ${a.city} with verified national titles, European junior recognition, Romanian team participation, and ITF junior circuit results. The purpose of this plan is to organise her next stage as a clear 2026 development campaign, not as an undefined request for help.${NL}${NL}The central objective is to support a disciplined international schedule that improves results, strengthens ranking position, creates better match footage, and preserves long-term options in junior ITF tennis, selective women's ITF exposure, academy development, and U.S. college recruiting.`],
      ['Athlete snapshot', a.summary],
      ['Verified performance foundation', null, listFrom(state.career.filter(c=>['Trophy','Final','Ranking'].includes(c.type)).map(c=>`${c.date}: ${c.title} — ${c.body}`))],
      ['The development challenge', `Junior tennis is expensive because opportunity depends on repetition: training blocks, tournament blocks, coach support, travel, accommodation, recovery, stringing, shoes, and planning. The tournament entry fee is only one small piece of the real cost.${NL}${NL}Access — higher-level tournament opportunities require travel, acceptance planning, and reliable support around the player.${NL}Consistency — a single strong result is useful, but sponsors and institutions respond better to a season plan with targets and reporting.${NL}Timing — at ${a.age}, the next 12 to 24 months matter. Results, ranking, academics, and video should be organized now.${NL}Sustainability — the family needs a model that avoids emotional spending and funds the highest-return tournament and training decisions.`],
      ['2026 objectives', `Competition — build a targeted ITF junior schedule centred on ranking conversion and meaningful match experience.${NL}Performance — convert J30/J60 events into deep runs and use J100 opportunities selectively when draw, surface, and cost make sense.${NL}Development — support coaching, fitness, recovery, and match analysis around tournament blocks.${NL}Visibility — produce stronger match video, sponsor updates, photography, and source-backed media materials.${NL}Pathway — keep open junior ITF progress, selective women's ITF events, academy support, and U.S. college recruiting.`],
      ['Target schedule', null, tableFrom(['Dates','Event','Level','Surface','Cost'], state.tournaments.map(t=>[`${dateShort(t.start)} → ${dateShort(t.end)}`, t.name, t.level, t.surface, money(eventCost(t.id))]))],
      ['Funding picture', `Total budget model: ${money(state.settings.annualBudget||totalBudget())}. Sponsor pipeline: ${money(totalSponsors())}. Paid: ${money(sponsorPaid())}. Open funding gap: ${money(fundingGap())}. Suggested first ask for a sponsor: fund one tournament block or one training block.`],
      ['Sponsor value and deliverables', `Visibility — logo or name in sponsor materials, promo video, landing page, and permitted apparel or training gear.${NL}Content — thank-you posts, tournament photos, short video assets, and selected sponsor mentions.${NL}Community — meet-and-greet, junior tennis clinic, sponsor visit, signed photo, or local press moment.${NL}Reporting — monthly update covering results, next events, photos, ranking movement, and use-of-funds summary.${NL}Compliance — logo use and sponsor categories checked against tournament, federation, apparel, and amateur eligibility rules before activation.`],
      ['Parallel pathway options', `Junior ITF — J30/J60/J100 planning to build ranking, experience, and match footage.${NL}Selective women's ITF — W15 events when cost, access, and readiness are favourable.${NL}Federation / foundation — proper application pathways, nomination criteria, wildcards, and development support.${NL}Academy — short training blocks, coach review, or partial scholarship support.${NL}U.S. college — build athletic and academic materials early; confirm NCAA amateurism / academic requirements.`]
    ]
  };

  const mediaKit = {
    cat:'Pitch materials',
    title:'Press Kit & Athlete Profile',
    sub:`${full} · For media, sponsors, federations, and event programs`,
    band:[['Profile','ITF Junior'],['Born', a.dob || ''],['Home', a.city]],
    sections:[
      ['Short bio', `${full} is a Romanian ITF junior tennis player from ${a.city}. She has earned Romanian national junior titles, represented Romania in junior team competition, received European junior recognition, and competed internationally across Tennis Europe and ITF junior events. Her 2026 campaign focuses on continued ranking growth, disciplined tournament planning, and long-term development.`],
      ['Long bio', `${full} is a Romanian junior tennis player from ${a.city} competing on the ITF junior pathway. Her early results include national junior titles in Romania, European team recognition, and international junior competition experience. Romanian media has reported her U12 national singles and doubles titles, her recognition as best player at the U12 European final tournament, her U14 national progress, and her ITF J60 results in Montenegro.${NL}${NL}${full}'s development story reflects the reality of high-performance junior tennis: serious training, frequent travel, tournament planning, coaching support, physical preparation, recovery, school coordination, and family commitment. The 2026 campaign is designed to build on her verified results through a targeted international competition plan while keeping long-term academic and tennis options open.`],
      ['One-sentence', `${full} is a Romanian ITF junior tennis player from ${a.city} building an international pathway through national results, European recognition, and a disciplined 2026 development plan.`],
      ['Verified accomplishments', null, listFrom(state.career.filter(c=>['Trophy','Final','Ranking'].includes(c.type)).map(c=>`${c.title} (${c.date})`))],
      ['Story angles for journalists', null, listFrom([
        'Local excellence from '+a.city+': a young athlete building a path into international junior tennis.',
        'The cost of opportunity: high-performance junior tennis requires travel, coaching, tournament access, recovery, and family sacrifice before prize money is available.',
        'Romanian tennis legacy: connecting local junior development to a meaningful national tennis history.',
        'Women\'s sport and youth ambition: a young Romanian female athlete pursuing an international pathway with discipline.',
        'Community-backed athlete model: local sponsors funding specific blocks with transparent updates.'
      ])],
      ['Tone', 'Use empathy without sounding desperate. Lead with verified results, then explain cost and opportunity. Frame support as partnership, not charity. Keep the dream visible without promising rankings that have not happened yet.']
    ]
  };

  // Outreach emails
  const localEmail = {
    cat:'Outreach emails',
    title:'Local Sponsor Email · Template 1',
    sub:`To ${s.company || '[Sponsor]'}`,
    band:[['Audience', 'Local clinic, gym, hotel, restaurant, IT company, dealer, real estate, or family business'],['Best attachment', 'Local Sponsor One-Pager'],['Subject', `Supporting a Romanian junior tennis player from ${a.city}`]],
    sections:[
      ['Subject', `Supporting a Romanian junior tennis player from ${a.city}`],
      ['Email body', emailLocal(s)],
      ['Attach', 'Local Sponsor One-Pager']
    ],
    email:{subject:`Supporting a Romanian junior tennis player from ${a.city}`, body:emailLocal(s), to:s.email}
  };

  const corporateEmail = {
    cat:'Outreach emails',
    title:'Corporate / CSR Email · Template 2',
    sub:`To ${s.company || '[Corporate prospect]'}`,
    band:[['Audience', 'Larger company, marketing or CSR lead, bank, insurer, technology, regional brand'],['Best attachment', 'Sponsor Deck + One-Pager'],['Subject', `Partnership opportunity: ${full} 2026 tennis campaign`]],
    sections:[
      ['Subject', `Partnership opportunity: ${full} 2026 tennis development campaign`],
      ['Email body', emailCorporate(s)],
      ['Attach', '2026 Sponsor Proposal (deck) + Local Sponsor One-Pager']
    ],
    email:{subject:`Partnership opportunity: ${full} 2026 tennis development campaign`, body:emailCorporate(s), to:s.email}
  };

  const privateEmail = {
    cat:'Outreach emails',
    title:'Private / Diaspora Email · Template 3',
    sub:`To ${s.company || '[Private supporter]'}`,
    band:[['Audience','Individual supporter, Romanian entrepreneur, family friend, diaspora contact'],['Best attachment','One-pager or short deck'],['Subject', `A personal introduction: supporting ${full}`]],
    sections:[
      ['Subject', `A personal introduction: supporting ${full}'s tennis pathway`],
      ['Email body', emailPrivate(s)],
      ['Attach', 'Local Sponsor One-Pager']
    ],
    email:{subject:`A personal introduction: supporting ${full}'s tennis pathway`, body:emailPrivate(s), to:s.email}
  };

  const introEmail = {
    cat:'Outreach emails',
    title:'Warm Intro Request · Template 4',
    sub:`To ${s.contact || '[Mutual contact]'}`,
    band:[['Audience','Someone who may know a sponsor / journalist / foundation'],['Best attachment','None on first ask'],['Subject', `Could you introduce me to someone who may support ${full}?`]],
    sections:[
      ['Subject', `Could you introduce me to someone who may support a Romanian junior tennis player?`],
      ['Email body', emailIntro(s)]
    ],
    email:{subject:`Could you introduce me to someone who may support a Romanian junior tennis player?`, body:emailIntro(s), to:s.email}
  };

  const followupEmail = {
    cat:'Outreach emails',
    title:'Follow-Up After No Reply · Template 5',
    sub:'Use 7-10 days after the first message',
    band:[['Audience', 'Send in original thread'],['Tone', 'Short, polite'],['Subject', `Following up: ${full} sponsorship materials`]],
    sections:[
      ['Subject', `Following up: ${full} sponsorship materials`],
      ['Email body', emailFollowup(s)]
    ],
    email:{subject:`Following up: ${full} sponsorship materials`, body:emailFollowup(s), to:s.email}
  };

  const thankCallEmail = {
    cat:'Outreach emails',
    title:'Thank-You After Positive Call · Template 6',
    sub:'Send within 24 hours of a sponsor call',
    band:[['Audience','Sponsor who has agreed to review materials'],['Tone','Specific and grateful'],['Subject', `Thank you for speaking with me about ${full}`]],
    sections:[
      ['Subject', `Thank you for speaking with me about ${full}`],
      ['Email body', emailThankCall(s)]
    ],
    email:{subject:`Thank you for speaking with me about ${full}`, body:emailThankCall(s), to:s.email}
  };

  const nextStepsEmail = {
    cat:'Outreach emails',
    title:'Next Steps After Sponsor Interest · Template 7',
    sub:'After the sponsor says they want details',
    band:[['Audience','Confirmed interest, asking what is next'],['Attach','Agreement template + budget'],['Subject', `Next steps for supporting ${full}'s 2026 campaign`]],
    sections:[
      ['Subject', `Next steps for supporting ${full}'s 2026 campaign`],
      ['Email body', emailNextSteps(s)]
    ],
    email:{subject:`Next steps for supporting ${full}'s 2026 campaign`, body:emailNextSteps(s), to:s.email}
  };

  // Operations
  const tournamentBrief = {
    cat:'Operations',
    title:'Tournament Travel Brief',
    sub:`${ne.name||'Next event'} · Internal + sponsor-facing summary`,
    band:[['Event', ne.name||'TBD'],['Dates', `${dateShort(ne.start)} → ${dateShort(ne.end)}`],['Cost', money(eventCost(ne.id))]],
    sections:[
      ['Event', `${ne.name||'TBD'}${NL}${dateLong(ne.start)} → ${dateLong(ne.end)}${NL}${ne.city||''}, ${ne.country||''}${NL}${ne.level||''} · ${ne.surface||''} · Priority ${ne.priority||''}`],
      ['Event budget', null, tableFrom(['Category','Amount','Status'], state.budget.filter(b=>b.eventId===ne.id).map(b=>[b.category, money(b.amount), b.status]))],
      ['Funding status', `Total cost: ${money(eventCost(ne.id))}.${NL}Committed: ${money(eventCommitted(ne.id))}.${NL}Paid: ${money(eventPaid(ne.id))}.${NL}Gap: ${money(eventGap(ne.id))}.`],
      ['Linked sponsors', null, listFrom(state.sponsors.filter(x=>x.sponsoredEventId===ne.id).map(x=>`${x.company} — ${money(x.ask)} (${x.stage})`)) || `None linked yet.`],
      ['Purpose', `Competition reps aligned to ranking goal: ${a.rankingGoal}.`]
    ]
  };

  const monthlyReport = {
    cat:'Operations',
    title:'Monthly Sponsor Report',
    sub:`${full} · ${new Date().toLocaleDateString('en-GB',{month:'long',year:'numeric'})} · For ${s.company||'[Sponsor]'}`,
    band:[['Tournaments played', String(state.tournaments.filter(t=>t.status==='Completed').length)],['Match record', `${state.tournaments.filter(t=>t.outcome==='W').length}-${state.tournaments.filter(t=>t.outcome==='L').length}`],['Support used', moneyShort(state.budget.filter(b=>b.status==='Paid').reduce((a,b)=>a+Number(b.amount||0),0))]],
    sections:[
      ['Athlete note', `Thank you for helping me compete this month. Your support helped cover travel, equipment, and tournament expenses, allowing me to focus on preparation and performance.`],
      ['Tournaments played', null, tableFrom(['Event','Level','Result','Notes'], state.tournaments.filter(t=>t.status==='Completed' || t.status==='Active').map(t=>[`${t.name} · ${t.city}, ${t.country}`, t.level, t.result || '—', t.priority?`Priority ${t.priority}`:'']))],
      ['Use of funds summary', null, tableFrom(['Category','Amount','Status'], state.budget.filter(b=>b.status==='Paid' || b.status==='Committed').slice(0,8).map(b=>[`${b.category} · ${eventName(b.eventId)}`, money(b.amount), b.status]))],
      ['Next month plan', null, tableFrom(['Date','Event','Location','Objective'], upcoming().slice(0,4).map(t=>[dateShort(t.start), t.name, `${t.city||''}, ${t.country||''}`, t.priority==='A'?'Ranking points':'Match volume']))],
      ['Sponsor deliverables checklist', null, listFrom([
        `Monthly update sent — ${todayISO()}`,
        `Social thank-you post — ${s.company?'pending approval':'not applicable'}`,
        `Photo or video asset — pending`,
        `Logo visibility, where permitted — ${s.company?'pending':'n/a'}`,
        `Sponsor meeting / activation — to schedule`
      ])],
      ['Closing note', `Thank you again for supporting ${full}. The next priority is ${nextEvent()?.name||'the next event'}. Please let me know if you would like a short call or any additional reporting.`]
    ]
  };

  const sponsorAgreement = {
    cat:'Operations',
    title:'Sponsorship Agreement',
    sub:`Template for ${s.company||'[Sponsor]'} · ${full} 2026 campaign`,
    band:[['Sponsor', s.company||'[Sponsor]'],['Contribution', money(s.ask||state.settings.defaultAsk)],['Use of funds', s.sponsoredItem||'TBD']],
    sections:[
      ['Key terms summary', null, kvFrom([
        ['Effective date','[Date]'],
        ['Sponsor', `${s.company||'[Sponsor legal name]'} · [registration number] · [address]`],
        ['Athlete / Guardian', `${full}, represented by parent/guardian [Guardian full legal name], [address]`],
        ['Campaign', `${full} 2026 tennis development and competition campaign`],
        ['Contribution', `${money(s.ask||state.settings.defaultAsk)} cash and/or [in-kind support description]`],
        ['Term', `${s.agreementStart||'[Start]'} → ${s.agreementEnd||'[End]'}`],
        ['Payment schedule','[Single payment / installments / reimbursement / in-kind delivery]'],
        ['Primary benefits','As described in Exhibit A'],
        ['Governing law','Romania']
      ])],
      ['1. Purpose', `The purpose of this Agreement is to document the Sponsor's support for ${full}'s tennis development and competition activities during the Term. The sponsorship is intended to support defined athletic development needs, which may include tournament travel, lodging, entry logistics, coaching support, training, recovery, equipment, stringing, video, reporting, and related campaign expenses.`],
      ['2. Sponsorship contribution', `The Sponsor will provide the contribution described in the Key Terms Summary and Exhibit B. Cash contributions must be paid according to the payment schedule. In-kind support must be delivered according to the scope, timing, and quality standards agreed in Exhibit B.`],
      ['3. Use of funds', `The Athlete / Guardian will use the contribution for the campaign purposes described in this Agreement and Exhibit B. Unless otherwise agreed in writing, funds may be allocated across tournament blocks, training blocks, coaching, travel, equipment, recovery, and campaign administration based on the Athlete / Guardian's reasonable judgment and the needs of the campaign.`],
      ['4. Sponsor benefits', `The Sponsor will receive the benefits described in Exhibit A. Benefits may include sponsor listing, thank-you content, campaign updates, permitted logo use, photos, sponsor mentions, local activation, or other agreed benefits. No benefit is guaranteed unless it is specifically listed in Exhibit A.`],
      ['5. Tournament, federation, apparel, eligibility compliance', `All sponsorship benefits are subject to applicable tournament, federation, apparel, image-rights, school, amateur eligibility, and other sporting rules. The parties agree that no logo placement, apparel use, content use, or commercial benefit will be implemented if it would create a compliance concern. If a promised benefit cannot be delivered due to an applicable rule, the parties will work in good faith to provide a reasonable substitute benefit.`],
      ['6. Minor athlete protection', `Because ${full} is a minor, all legal approvals, payments, consents, deliverables, and communications requiring authority must be handled through her parent or legal guardian. The Sponsor agrees to communicate professionally and respectfully, and to avoid any direct commercial pressure on the Athlete.`],
      ['7. Reporting', `The Athlete / Guardian will provide the reporting described in Exhibit A. Unless otherwise agreed, reporting may include tournament results, ranking movement when available, photos, next tournament plans, and a general use-of-funds summary.`],
      ['8. No guarantee of results', `The Sponsor understands that sport performance is uncertain. The Athlete / Guardian does not guarantee rankings, match results, tournament entries, media coverage, professional status, college recruitment, prize money, or any specific competitive outcome.`],
      ['9. Termination', `Either party may terminate for material breach if the breach is not cured within 10 business days after written notice. Either party may also terminate immediately if continued association would create a serious legal, reputational, safety, eligibility, or welfare concern.`],
      ['Exhibit A — Sponsor benefits and deliverables', null, tableFrom(['Benefit','Description','Timing','Notes'], [
        ['Sponsor listing','Sponsor name/logo appears in approved sponsor materials','During Term','Logo file required'],
        ['Thank-you post','One thank-you post or story on approved channel','[Date/window]','Guardian approval required'],
        ['Monthly update','Results, photos, next plan, short progress note','Monthly','Email PDF or message'],
        ['Permitted logo use','Logo on training/event apparel only where rules allow','As permitted','Must be checked before use'],
        ['Local activation','Photo visit, clinic, meet-and-greet, or sponsor event','[Date/window]','Subject to schedule']
      ])],
      ['Exhibit B — Use of funds', null, tableFrom(['Category','Amount','Purpose'], [
        ['Tournament block','€[amount]','Travel, lodging, local transport, meals, entry'],
        ['Coaching support','€[amount]','Coach travel, shared coach, match review'],
        ['Training & recovery','€[amount]','Courts, fitness, physio, recovery'],
        ['Equipment & stringing','€[amount]','Racquets, shoes, strings, grips'],
        ['Video & reporting','€[amount]','Video, photos, sponsor updates']
      ])],
      ['Note', `This document is a practical business template, not legal advice. Have a local lawyer or qualified advisor review before signature, especially for larger sponsorships.`]
    ]
  };

  const welcomePackage = {
    cat:'Operations',
    title:'Sponsor Welcome & Onboarding',
    sub:`For ${s.company||'[Sponsor]'} · First 72 hours after yes`,
    band:[['Action 1','Confirm terms'],['Action 2','Collect assets'],['Action 3','Begin reporting']],
    sections:[
      ['Welcome email', emailWelcome(s)],
      ['Onboarding checklist', null, listFrom([
        'Confirm sponsor level and amount or in-kind value.',
        'Confirm exact use of funds (equipment, tournament block, training block, coaching, recovery, season).',
        'Send sponsorship agreement or confirmation.',
        'Collect sponsor legal name, billing details, logo, brand guidelines, recognition preferences.',
        'Confirm public vs private support.',
        'Confirm allowed social tags, website link, preferred wording.',
        'Confirm payment timing, method, receipt needs.',
        'Confirm whether sponsor content requires approval before posting.',
        'Add to CRM and deliverables tracker.',
        'Schedule first sponsor update date.'
      ])],
      ['First 30 days timing', null, tableFrom(['Timing','Action'], [
        ['Day 1-2','Send thank-you, confirmation, agreement, sponsor information form.'],
        ['Day 3-5','Collect logo, wording, public recognition approval, payment/in-kind details.'],
        ['Day 5-7','Finalize payment or in-kind delivery plan, update CRM.'],
        ['Day 7-10','Publish sponsor announcement if approved.'],
        ['Day 10-20','Send early behind-the-scenes update or training note.'],
        ['Day 20-30','Send first short sponsor update or include in monthly report.']
      ])],
      ['Sponsor announcement copy', `We are proud to welcome ${s.company||'[Sponsor]'} as a supporter of ${full}'s 2026 tennis development campaign. Their support will help fund ${s.sponsoredItem||'[specific use of funds]'}, an important part of ${full}'s continued training, competition, and international development pathway. Thank you, ${s.company||'[Sponsor]'}, for supporting Romanian junior sport and helping create opportunity for a young athlete from ${a.city}.`]
    ]
  };

  const meetingScript = {
    cat:'Operations',
    title:'Sponsor Meeting Script',
    sub:`20-minute call template for ${s.company||'[Sponsor]'}`,
    band:[['Step 1','Prepare the ask'],['Step 2','Lead the meeting'],['Step 3','Close the next step']],
    sections:[
      ['Pre-meeting checklist', null, listFrom([
        'Sponsor profile — know the business, decision maker, community interests.',
        'Right document — local sheet for small business; full deck for larger sponsors.',
        `Specific ask — ${money(s.ask||state.settings.defaultAsk)} for ${s.sponsoredItem||'[use of funds]'}.`,
        'Use of funds — know exactly what that amount funds.',
        'Proof ready — ITF/WTA links, media coverage, photos, video, proof folder.',
        'Next step ready — second meeting, agreement draft, intro to another sponsor, or decision date.'
      ])],
      ['20-minute agenda', null, tableFrom(['Time','Topic'], [
        ['0-2 min','Thank, frame, why we asked for the meeting.'],
        ['2-6 min',`Tell ${full}'s story — background, results, ambition, why support matters now.`],
        ['6-10 min','Explain the 2026 campaign and what the money funds.'],
        ['10-14 min','Show sponsor options and recommend one level.'],
        ['14-17 min','Ask questions — what matters to them, visibility, timeline.'],
        ['17-20 min','Close with a specific next step and follow-up date.']
      ])],
      ['Discovery questions', null, listFrom([
        'Have you supported local athletes, youth sport, education, or community projects before?',
        'Would your organization prefer cash support, in-kind support, or a mix?',
        'Is visibility important, or is community impact the main priority?',
        'Would a local event, clinic, or sponsor visit be useful to you?',
        'Who else should review this before a decision is made?',
        'What timing would work best for a decision?',
        'Is there someone in your network who may care about Romanian tennis, women\'s sport, or youth development?'
      ])],
      ['Closing wording', `Based on our conversation, would ${money(s.ask||state.settings.defaultAsk)} for ${s.sponsoredItem||'a tournament block'} be a fit, or would you prefer to start at a different level? Either way, I can send a one-page summary and a draft agreement so we can move forward when you are ready.`],
      ['Follow-up email', emailThankCall(s)]
    ]
  };

  const renewalEmail = {
    cat:'Operations',
    title:'Sponsor Renewal Conversation',
    sub:`To ${s.company||'[Sponsor]'} · After delivering value`,
    band:[['Audience','Existing sponsor'],['Goal','Renew at next level'],['Subject', `${full} sponsorship update and renewal conversation`]],
    sections:[
      ['Subject', `${full} sponsorship update and renewal conversation`],
      ['Email body', emailRenewal(s)]
    ],
    email:{subject:`${full} sponsorship update and renewal conversation`, body:emailRenewal(s), to:s.email}
  };

  const seasonReview = {
    cat:'Operations',
    title:'Season Review',
    sub:`${full} · Annual sponsor and family review`,
    band:[['Tournaments', String(state.tournaments.length)],['Matches W-L', `${state.tournaments.filter(t=>t.outcome==='W').length}-${state.tournaments.filter(t=>t.outcome==='L').length}`],['Funding paid', money(sponsorPaid())]],
    sections:[
      ['Overview', `${full} 2026 season review based on entered events, rankings, sponsor support, and results.`],
      ['Tournament record', null, tableFrom(['Event','Level','Surface','Result','Outcome'], state.tournaments.map(t=>[t.name, t.level, t.surface, t.result||'—', t.outcome||'—']))],
      ['Ranking trajectory', `${a.rankingSystem} current ${a.ranking}. Career high ${a.careerHigh}. Season high ${a.seasonHigh}. Goal ${a.rankingGoal}.`],
      ['Funding review', `Modeled need: ${money(state.settings.annualBudget||totalBudget())}. Pipeline: ${money(totalSponsors())}. Paid: ${money(sponsorPaid())}. Open gap: ${money(fundingGap())}.`],
      ['Sponsor recognition', null, listFrom(state.sponsors.filter(x=>x.paidAmount>0).map(x=>`${x.company} — ${money(x.paidAmount)}`)) || 'No paid sponsors recorded yet.'],
      ['Next season focus', a.needs]
    ]
  };

  const ninetyDay = {
    cat:'Strategy',
    title:'90-Day Action Roadmap',
    sub:`${full} · The operating cadence for the next quarter`,
    band:[['Phase 1','Days 1-30 — Foundation'],['Phase 2','Days 31-60 — Outreach'],['Phase 3','Days 61-90 — Activate']],
    sections:[
      ['Days 1-30 — Foundation', null, listFrom([
        'Confirm tournament calendar in Tournaments tab.',
        'Confirm budget per event in Budget tab.',
        'Update career storyline with verified results only.',
        'Confirm ranking entries — current, season high, career high.',
        'Identify 10 sponsor prospects (local + corporate + private).',
        'Build proof folder: ITF profile, WTA profile, press links, photos, video.',
        'Lock the campaign one-pager and sponsor deck (already in Documents).'
      ])],
      ['Days 31-60 — Outreach', null, listFrom([
        'Send Local Sponsor Email to 5 local prospects.',
        'Send Corporate / CSR Email to 2 corporate prospects.',
        'Send Warm Intro Request to 3 mutual contacts.',
        'Follow-up after 7-10 days on every silent prospect.',
        'Schedule meetings with anyone interested.',
        'Update sponsor stages in the pipeline after every interaction.',
        'Generate Tournament Travel Brief for the next event.'
      ])],
      ['Days 61-90 — Activate', null, listFrom([
        'Convert at least one prospect to Committed.',
        'Generate Sponsorship Agreement for first signed sponsor.',
        'Send Sponsor Welcome & Onboarding to new sponsors.',
        'Generate first Monthly Sponsor Report.',
        'Publish sponsor announcement after written approval.',
        'Set renewal conversation 60 days before agreement end.',
        'Run Season Review at the end of the quarter.'
      ])]
    ]
  };

  const pressRelease = {
    cat:'Media',
    title:'Press Release',
    sub:`${full} · For local media and tennis outlets`,
    band:[['Released',dateLong(todayISO())],['Contact',state.settings.senderName||'[Family contact]'],['Email', state.settings.senderEmail||'[email]']],
    sections:[
      ['Headline', `${full} announces 2026 international junior tennis development campaign from ${a.city}`],
      ['Lead paragraph', `${full}, a Romanian junior tennis player from ${a.city}, has launched a structured 2026 development campaign focused on disciplined international competition, ranking growth, and long-term pathway development. ${full} has built a verified record through Romanian national titles, European junior recognition, and ITF junior results.`],
      ['Verified accomplishments', null, listFrom(state.career.filter(c=>c.type==='Trophy' || c.type==='Final').map(c=>`${c.title} (${c.date})`))],
      ['Quote', `"This campaign is about building a real plan around tournament selection, training quality, and clear sponsor reporting," said the family. "We want to give partners a credible, organised story to support, not a vague request for help."`],
      ['Sponsor opportunity', `Local businesses, corporate partners, foundations, and private supporters can support specific parts of the campaign — tournament blocks, equipment, recovery, training — with documented use of funds and monthly reporting. Suggested first commitment: one tournament block or training block.`],
      ['Contact', `${state.settings.senderName||'[Family contact]'}${state.settings.senderEmail?' · '+state.settings.senderEmail:''}${state.settings.phone?' · '+state.settings.phone:''}`],
      ['Sources', 'Radio România Timișoara · Opinia Timișoarei · Official ITF profile · Official WTA profile.']
    ]
  };

  const budgetRequest = {
    cat:'Strategy',
    title:'Budget Request',
    sub:`Season model · ${money(state.settings.annualBudget||totalBudget())}`,
    band:[['Total need', money(state.settings.annualBudget||totalBudget())],['Pipeline', money(totalSponsors())],['Open gap', money(fundingGap())]],
    sections:[
      ['Tournament costs', null, tableFrom(['Event','Cost','Committed','Gap'], state.tournaments.map(t=>[t.name, money(eventCost(t.id)), money(eventCommitted(t.id)), money(eventGap(t.id))]))],
      ['Line items', null, tableFrom(['Event','Category','Description','Amount','Status'], state.budget.map(b=>[eventName(b.eventId), b.category, b.description, money(b.amount), b.status]))]
    ]
  };

  const calendarOnePager = {
    cat:'Strategy',
    title:'Tournament Calendar One-Pager',
    sub:'Season schedule snapshot',
    band:[['Events', String(state.tournaments.length)],['Priority A', String(state.tournaments.filter(t=>t.priority==='A').length)],['Surfaces', new Set(state.tournaments.map(t=>t.surface)).size+' types']],
    sections:[
      ['Schedule', null, tableFrom(['Dates','Event','City, Country','Level','Surface','Cost','Priority'], state.tournaments.map(t=>[`${dateShort(t.start)} → ${dateShort(t.end)}`, t.name, `${t.city||''}, ${t.country||''}`, t.level, t.surface, money(eventCost(t.id)), t.priority]))]
    ]
  };

  return {
    sponsorOnePager, sponsorDeck, developmentPlan, mediaKit,
    localEmail, corporateEmail, privateEmail, introEmail, followupEmail, thankCallEmail, nextStepsEmail,
    tournamentBrief, monthlyReport, sponsorAgreement, welcomePackage, meetingScript, renewalEmail, seasonReview,
    ninetyDay, pressRelease, budgetRequest, calendarOnePager
  };
}

function levelBenefits(label){
  const map = {
    'Supporter':'Thank-you post, supporter listing, quarterly update',
    'Equipment Partner':'Logo in deck/video, signed photo, social post package',
    'Tournament Partner':'Tournament updates, photos, permitted logo use',
    'Season Partner':'Monthly reports, local media push, clinic or meet-and-greet',
    'Main Partner':'Primary positioning, full reporting, custom activation plan',
    'In-kind Partner':'Recognition matched to value provided, agreed activation'
  };
  return map[label]||'';
}

/* ---- Email templates --------------------------------------- */
function emailLocal(s){
  const a=state.athlete, full=`${a.firstName} ${a.lastName}`;
  return `Hello ${s.contact||'[Name]'},

I am reaching out to introduce ${full}, a Romanian junior tennis player from ${a.city} with national titles, international junior results, and Romanian team experience.

${full} is preparing for her 2026 development campaign, which includes selected ITF junior tournaments, training blocks, equipment, travel, coaching support, and recovery. The costs of competing internationally are significant, and we are looking for local partners who want to support a serious young athlete with a clear plan.

A local partnership can be structured around a defined amount, for example support for one tournament block, equipment, recovery, or travel. In return, partners receive clear recognition, updates, photos, and permitted visibility in ${full}'s campaign materials.

I attached a one-page summary. Would you be open to a short conversation next week to see whether this could be a fit for ${s.company||'[Company Name]'}?

Thank you,
${state.settings.senderName||'[Your name]'}
${state.settings.phone||''}
${state.settings.senderEmail||''}`;
}
function emailCorporate(s){
  const a=state.athlete, full=`${a.firstName} ${a.lastName}`;
  return `Hello ${s.contact||'[Name]'},

I am writing to share a potential partnership opportunity involving ${full}, a Romanian ITF junior tennis player from ${a.city}. ${full} has built a verified junior record that includes Romanian national titles, European junior recognition, Romanian team participation, and recent ITF junior results.

The 2026 campaign is focused on disciplined international development: selected ITF junior tournament blocks, coaching support, training, travel, equipment, recovery, and structured reporting for partners.

We are looking for partners who want to support Romanian youth sport, women's sport, and a young athlete with a serious development pathway. Partnership levels can be built around a specific tournament block, equipment support, season support, or a larger campaign role.

I attached the sponsor deck for review. Would you be open to a brief call to discuss whether there is a fit with ${s.company||'[Company Name]'}'s marketing, CSR, or community initiatives?

Thank you,
${state.settings.senderName||'[Your name]'}
${state.settings.phone||''}
${state.settings.senderEmail||''}`;
}
function emailPrivate(s){
  const a=state.athlete, full=`${a.firstName} ${a.lastName}`;
  return `Hello ${s.contact||'[Name]'},

I wanted to share the story of ${full}, a young Romanian tennis player from ${a.city} who has already earned national and international junior results. Her family is working hard to give her the opportunity to continue competing at a serious level, but international junior tennis brings major costs: coaching, travel, tournaments, equipment, recovery, and training.

We are approaching this professionally, with a clear 2026 plan, verified results, and defined sponsorship options rather than an open-ended request. A contribution can be tied to a specific need, such as one tournament block, travel support, equipment, or training.

I attached a short summary. If ${full}'s story resonates with you, would you be open to a short call or to reviewing the materials?

Thank you,
${state.settings.senderName||'[Your name]'}`;
}
function emailIntro(s){
  const a=state.athlete, full=`${a.firstName} ${a.lastName}`;
  return `Hello ${s.contact||'[Name]'},

I hope you are well. I am helping organize sponsorship materials for ${full}, a Romanian junior tennis player from ${a.city} with national titles and international junior results.

We are looking for thoughtful introductions to people or organizations that may support youth sport, women's sport, Romanian athletes, or high-performance junior tennis. This could be a local business, corporate sponsor, foundation, sports contact, or private supporter.

Would anyone come to mind who might be open to reviewing a short one-page summary or sponsor deck? A warm introduction would be very helpful.

Thank you,
${state.settings.senderName||'[Your name]'}`;
}
function emailFollowup(s){
  const full=`${state.athlete.firstName} ${state.athlete.lastName}`;
  return `Hello ${s.contact||'[Name]'},

I wanted to follow up on my note about ${full}'s 2026 tennis development campaign.

We are looking for partners who may be interested in supporting a defined tournament block, training block, equipment support, or a broader season partnership. I would be grateful for a short conversation or for any guidance on the right person to contact.

Would next week be a possible time for a brief call?

Thank you,
${state.settings.senderName||'[Your name]'}`;
}
function emailThankCall(s){
  const a=state.athlete, full=`${a.firstName} ${a.lastName}`;
  return `Hi ${s.contact||'[Name]'},

Thank you again for taking the time to speak with me about ${full}'s 2026 tennis campaign.

As discussed, ${full} is a Romanian junior tennis player from ${a.city} with verified national and international junior results. We are building a structured support plan around tournament blocks, training, coaching, travel, equipment, recovery, and sponsor reporting.

I have attached:
1. One-page sponsor summary
2. Sponsor deck
3. Proposed partnership level
4. Supporting links or proof folder, if useful

The partnership level we discussed was ${money(s.ask||state.settings.defaultAsk)} for ${s.sponsoredItem||'[use of funds]'}.

Please let me know if you would like any changes or if someone else should be included in the next conversation. I will follow up on [date] unless I hear from you sooner.

Best,
${state.settings.senderName||'[Your name]'}`;
}
function emailNextSteps(s){
  const full=`${state.athlete.firstName} ${state.athlete.lastName}`;
  return `Hello ${s.contact||'[Name]'},

Thank you again for your interest in supporting ${full}. The next step would be to confirm the sponsorship level or specific use of funds.

A few options are:

1. Supporter: €500 to €1,000 — equipment, stringing, entry fees, or local travel.
2. Equipment Partner: €1,500 to €2,500 — equipment and maintenance.
3. Tournament Partner: €5,000 — one international tournament block.
4. Season Partner: €10,000 to €15,000 — multiple tournament or training blocks.
5. Main Partner: €25,000+ — larger campaign role.

Once the level is confirmed, we can prepare a simple sponsorship agreement, confirm deliverables, and set up monthly updates.

Thank you,
${state.settings.senderName||'[Your name]'}`;
}
function emailWelcome(s){
  const a=state.athlete, full=`${a.firstName} ${a.lastName}`;
  return `Hi ${s.contact||'[Name]'},

Thank you again for agreeing to support ${full}'s 2026 tennis development campaign. We are grateful for your confidence and want to make the process clear and professional.

Based on our conversation, the sponsorship would be:
- Sponsor level: ${s.package||'[level]'}
- Contribution: ${money(s.ask||state.settings.defaultAsk)}
- Use of funds: ${s.sponsoredItem||'[specific use]'}
- Sponsorship period: ${s.agreementStart||'[start]'} to ${s.agreementEnd||'[end]'}
- Sponsor recognition: [public / private / to confirm]

The next steps are:
1. confirm the sponsorship details,
2. finalize the simple sponsorship agreement,
3. collect your logo and preferred recognition wording (if public recognition is approved),
4. confirm payment or in-kind delivery timing,
5. begin sponsor updates according to the agreed schedule.

Attached are the draft agreement and sponsor information form. Please let me know if anything should be adjusted before we finalize.

Thank you again for supporting ${full}'s next stage.

Best,
${state.settings.senderName||'[Your name]'}`;
}
function emailRenewal(s){
  const a=state.athlete, full=`${a.firstName} ${a.lastName}`;
  return `Hi ${s.contact||'[Name]'},

Thank you again for supporting ${full}'s 2026 campaign.

I wanted to share a brief summary of what your support helped make possible:
- [result / training / tournament / equipment / travel item]
- [sponsor update or deliverable]
- [progress or next step]

We are now planning the next phase of the campaign, including ${nextEvent()?.name||'[next tournament block]'}.

Would you be open to a short conversation about renewing or extending your support for the next stage? A useful next commitment would be ${money((s.ask||state.settings.defaultAsk))}, which would fund [specific use].

Thank you again for being part of ${full}'s journey.

Best,
${state.settings.senderName||'[Your name]'}`;
}

/* ---- Document section helpers ------------------------------ */
function listFrom(arr){
  if(!arr || !arr.length) return null;
  return `<ul>${arr.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
}
function tableFrom(headers, rows){
  if(!rows.length) return '<p class="muted">No data</p>';
  return `<table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c||'')}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
function kvFrom(rows){
  return `<table><tbody>${rows.map(([k,v])=>`<tr><td style="background:#f1f5fa;font-weight:700;width:30%">${esc(k)}</td><td>${esc(v||'')}</td></tr>`).join('')}</tbody></table>`;
}

/* ---- Documents render -------------------------------------- */
function renderDocuments(){
  const D = docsCatalog();
  const keys = Object.keys(D);
  if(!keys.includes(state.selected.doc)) state.selected.doc='sponsorOnePager';
  const d = D[state.selected.doc];

  // group by category
  const cats = {};
  keys.forEach(k => { (cats[D[k].cat] = cats[D[k].cat]||[]).push({key:k, t:D[k].title}); });

  const sponsorSelect = `<div class="field"><label>Sponsor</label><select data-selected="sponsorId">${state.sponsors.map(x=>`<option value="${x.id}" ${x.id===state.selected.sponsorId?'selected':''}>${esc(x.company)}</option>`).join('')}</select></div>`;
  const eventSelect = `<div class="field"><label>Event</label><select data-selected="tournamentId">${state.tournaments.map(t=>`<option value="${t.id}" ${t.id===state.selected.tournamentId?'selected':''}>${esc(t.name)}</option>`).join('')}</select></div>`;
  const docSelect = `<div class="field"><label>Document</label><select data-selected="doc">${keys.map(k=>`<option value="${k}" ${k===state.selected.doc?'selected':''}>${esc(D[k].title)}</option>`).join('')}</select></div>`;

  document.getElementById('documents').innerHTML = header('Document studio','Pick a sponsor and an event. Every document below auto-fills with current ranking, tournaments, budget, and contact data. Print to PDF or copy email body.', `<button class="btn primary" onclick="window.print()">Print / save as PDF</button>`) +
    `<div class="doc-options form-grid" style="grid-template-columns:repeat(3,1fr);grid-column:span 12">${sponsorSelect}${eventSelect}${docSelect}</div>
    <div class="doc-layout">
      <div class="doc-categories">${Object.entries(cats).map(([cat,docs])=>`
        <div class="doc-cat">${esc(cat)}</div>
        ${docs.map(({key,t})=>`<button class="doc-list-btn ${key===state.selected.doc?'active':''}" data-doc="${key}">${esc(t)}</button>`).join('')}
      `).join('')}</div>
      <div>
        <div class="doc-paper" id="docPaper">${docHtml(d)}</div>
        <div class="doc-actions">
          <button class="btn primary" onclick="window.print()">Print / save as PDF</button>
          <button class="btn" id="copyDocText">Copy as plain text</button>
          ${d.email ? `<button class="btn gold" id="copyEmailBody">Copy email body</button><button class="btn" id="copyEmailSubject">Copy subject</button><button class="btn" id="mailto">Open in mail app</button>` : ''}
        </div>
      </div>
    </div>`;
}

function docHtml(d){
  const a=state.athlete;
  const band = (d.band||[]).map(([k,v])=>`<div class="b"><strong>${esc(k)}</strong><span>${esc(v)}</span></div>`).join('');
  const sections = (d.sections||[]).map(([h,b,html])=>`
    <section class="doc-sec">
      <h4>${esc(h)}</h4>
      ${html ? `<div class="body">${html}</div>` : `<p>${esc(b||'')}</p>`}
    </section>`).join('');
  return `<h1>${esc(d.title)}</h1>
    <div class="sub">${esc(d.sub||'')}</div>
    <div class="doc-band">${band}</div>
    ${sections}
    <div class="doc-sec" style="border-top:none;padding-top:6px;color:#5b7188;font-size:11px;letter-spacing:.18em;text-transform:uppercase;margin-top:24px">Generated ${dateLong(todayISO())} · ${esc(a.firstName)} ${esc(a.lastName)} · Campaign HQ</div>`;
}

/* ---- Settings ---------------------------------------------- */
function renderSettings(){
  document.getElementById('settings').innerHTML = header('Settings','Sender details that appear in every email and document. Export and import data as JSON for backups.') +
    `<div class="form-grid">
      ${field('Sender name','settings','senderName',state.settings.senderName)}
      ${field('Sender email','settings','senderEmail',state.settings.senderEmail)}
      ${field('Phone','settings','phone',state.settings.phone)}
      ${field('Default sponsor ask','settings','defaultAsk',state.settings.defaultAsk,'number')}
      ${field('Annual budget model','settings','annualBudget',state.settings.annualBudget,'number')}
    </div>
    <div style="margin-top:24px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn primary" id="exportBtn">Export JSON backup</button>
      <label class="btn" for="importFile">Import JSON backup</label>
      <input id="importFile" type="file" accept="application/json" style="display:none">
      <button class="btn danger" id="resetBtn">Reset demo data</button>
    </div>`;
}

/* ---- Generic helpers -------------------------------------- */
function field(label,scope,key,val,type='text',options='',cls=''){
  if(type==='textarea') return `<div class="field ${cls}"><label>${label}</label><textarea data-scope="${scope}" data-key="${key}">${esc(val)}</textarea></div>`;
  if(type==='select') return `<div class="field ${cls}"><label>${label}</label><select data-scope="${scope}" data-key="${key}">${opt(options,val)}</select></div>`;
  return `<div class="field ${cls}"><label>${label}</label><input type="${type}" data-scope="${scope}" data-key="${key}" value="${esc(val)}"></div>`;
}
function cell(scope,i,key,val,type='text'){ return `<input type="${type}" data-scope="${scope}" data-idx="${i}" data-key="${key}" value="${esc(val)}">`; }
function selectCell(scope,i,key,val,list){ return `<select data-scope="${scope}" data-idx="${i}" data-key="${key}">${opt(list,val)}</select>`; }

function addTournament(start=''){
  const t = {id:id(),name:'New tournament',start,end:start,track:'ITF Junior',level:'ITF Junior J60',surface:'Clay',city:'',country:'',status:'Research',priority:'B',result:'',points:0,outcome:''};
  state.tournaments.push(t);
  state.budget.push({id:id(),eventId:t.id,category:'Tournament travel',description:`Travel for ${t.name}`,amount:0,status:'Needed'});
  state.selected.tournamentId=t.id;
  setActive('tournaments');
}

function setActive(tab){ active=tab; render(); setTimeout(()=>scrollTo({top:0,behavior:'smooth'}),0); }

function render(){
  save(); nav(); chrome();
  renderDashboard(); renderProfile(); renderCareer(); renderCalendar();
  renderTournaments(); renderRankings(); renderBudget(); renderSponsors();
  renderDocuments(); renderSettings();
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active', p.id===active));
}

/* ---- Events ------------------------------------------------ */
document.addEventListener('click', e => {
  const tabBtn=e.target.closest('[data-tab]'); if(tabBtn){ setActive(tabBtn.dataset.tab); return; }
  const goBtn=e.target.closest('[data-go]'); if(goBtn){ if(goBtn.dataset.doc) state.selected.doc=goBtn.dataset.doc; setActive(goBtn.dataset.go); return; }

  const tour=e.target.closest('[data-edit-tournament]')?.dataset.editTournament;
  if(tour && !e.target.closest('[data-doc]') && !e.target.closest('[data-go]')){
    state.selected.tournamentId=tour; setActive('tournaments');
    setTimeout(()=>document.getElementById('tour-'+tour)?.scrollIntoView({block:'center',behavior:'smooth'}),60);
    return;
  }
  const day=e.target.closest('[data-add-date]')?.dataset.addDate;
  if(day && !e.target.closest('[data-edit-tournament]')){ addTournament(day); return; }

  const docKey=e.target.closest('[data-doc]')?.dataset.doc;
  if(docKey){ state.selected.doc=docKey; renderDocuments(); return; }

  const stage=e.target.closest('[data-funnel]')?.dataset.funnel;
  if(stage){ funnelFilter = (funnelFilter===stage ? '' : stage); setActive('sponsors'); return; }

  const ssel=e.target.closest('[data-select-sponsor]')?.dataset.selectSponsor;
  if(ssel){ state.selected.sponsorId=ssel; renderSponsors(); return; }

  const del=e.target.closest('[data-delete]')?.dataset.delete;
  if(del){ const [scope,i]=del.split(':'); state[scope].splice(Number(i),1); render(); return; }

  if(e.target.id==='clearFunnel'){ funnelFilter=''; render(); return; }
  if(e.target.id==='addCareer'){ state.career.push({id:id(),date:String(new Date().getFullYear()),type:'Other',title:'New milestone',body:'',source:''}); render(); return; }
  if(e.target.id==='addTournament'){ addTournament(); return; }
  if(e.target.id==='addRanking'){ state.rankings.push({id:id(),system:'ITF Junior',category:'Girls 18U',value:'',date:todayISO(),goal:''}); render(); return; }
  if(e.target.id==='addBudget'){ state.budget.push({id:id(),eventId:state.selected.tournamentId||'',category:'Tournament travel',description:'New budget item',amount:0,status:'Needed'}); render(); return; }
  if(e.target.id==='addSponsor'){ state.sponsors.push({id:id(),company:'New sponsor',contact:'',email:'',phone:'',package:'Local Partner',ask:state.settings.defaultAsk,stage:'Prospect',contract:'Not started',agreementStart:'',agreementEnd:'',paymentStatus:'Not invoiced',paidAmount:0,scheduledPayment:'',sponsoredItem:'Tournament travel',sponsoredEventId:state.selected.tournamentId||'',deliverables:SPONSORED_ITEMS['Tournament travel'].deliverables,nextAction:'Research contact',renewal:'',notes:''}); render(); return; }

  if(e.target.id==='copyEmail'){
    const txt=document.getElementById('emailBox').textContent;
    navigator.clipboard.writeText(txt).then(()=>toast('Email copied'));
    return;
  }
  if(e.target.id==='mailtoEmail'){
    const cur=currentSponsor();
    const subj = `Supporting ${state.athlete.firstName} ${state.athlete.lastName}`;
    const body = document.getElementById('emailBox').textContent;
    location.href = `mailto:${cur.email||''}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    return;
  }
  if(e.target.matches('[data-email-preview]') || e.target.closest('[data-email-preview]')){
    const cur=currentSponsor();
    document.getElementById('emailBox').textContent = emailLocal(cur);
    return;
  }

  if(e.target.id==='copyDocText'){
    const txt = document.getElementById('docPaper').innerText;
    navigator.clipboard.writeText(txt).then(()=>toast('Document copied as text'));
    return;
  }
  if(e.target.id==='copyEmailBody'){
    const D = docsCatalog(); const d = D[state.selected.doc];
    if(d.email){ navigator.clipboard.writeText(d.email.body).then(()=>toast('Email body copied')); }
    return;
  }
  if(e.target.id==='copyEmailSubject'){
    const D = docsCatalog(); const d = D[state.selected.doc];
    if(d.email){ navigator.clipboard.writeText(d.email.subject).then(()=>toast('Subject copied')); }
    return;
  }
  if(e.target.id==='mailto'){
    const D = docsCatalog(); const d = D[state.selected.doc];
    if(d.email){ location.href = `mailto:${d.email.to||''}?subject=${encodeURIComponent(d.email.subject)}&body=${encodeURIComponent(d.email.body)}`; }
    return;
  }

  if(e.target.id==='exportBtn'){
    const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='andreea-campaign-hq-backup.json'; a.click(); return;
  }
  if(e.target.id==='resetBtn' && confirm('Reset to demo data? This wipes your local edits.')){
    localStorage.removeItem(KEY); state=defaultBudgetRows(createDefaultState()); render(); toast('Reset to demo data'); return;
  }
  if(e.target.id==='prevMonth'){ state.calendar.month--; if(state.calendar.month<0){state.calendar.month=11;state.calendar.year--;} render(); return; }
  if(e.target.id==='nextMonth'){ state.calendar.month++; if(state.calendar.month>11){state.calendar.month=0;state.calendar.year++;} render(); return; }
});

document.addEventListener('input', e => {
  const el=e.target; const {scope,idx,key}=el.dataset; if(!scope) return;
  const val = el.type==='number' ? Number(el.value||0) : el.value;
  if(idx!=null) state[scope][Number(idx)][key]=val; else state[scope][key]=val;
  if(scope==='sponsors' && key==='sponsoredItem'){ const guide=SPONSORED_ITEMS[val]; if(guide) state.sponsors[Number(idx)].deliverables=guide.deliverables; }
  save(); chrome();
});

document.addEventListener('change', async e => {
  const el=e.target;
  if(el.dataset.selected){ state.selected[el.dataset.selected]=el.value; save(); render(); return; }
  const {scope,idx,key}=el.dataset;
  if(scope){
    const val = el.type==='number' ? Number(el.value||0) : el.value;
    if(idx!=null) state[scope][Number(idx)][key]=val; else state[scope][key]=val;
    if(scope==='sponsors' && key==='sponsoredItem'){ const guide=SPONSORED_ITEMS[val]; if(guide) state.sponsors[Number(idx)].deliverables=guide.deliverables; }
    render(); return;
  }
  if(el.id==='monthPicker'){ const [y,m]=el.value.split('-').map(Number); state.calendar.year=y; state.calendar.month=m-1; render(); return; }
  if(el.id==='importFile'){ const f=el.files[0]; if(!f) return; try{ state=migrate(JSON.parse(await f.text())); render(); toast('Backup imported'); }catch{ alert('Could not import file'); } }
});

state = load();
render();
