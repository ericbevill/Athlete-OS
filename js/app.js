/* ============================================================
   ANDREEA OLARIU · CAMPAIGN HQ
   Single-file dashboard. localStorage state. SVG charts.
   ============================================================ */

/* ---- Domain constants -------------------------------------- */
const TABS = ['dashboard','profile','career','calendar','tournaments','rankings','budget','sponsors','documents','settings'];
const RANKING_SYSTEMS = ['ITF Junior','Tennis Europe','FRT Romania','German LK','German B/A','WTA','UTR','WTN'];
const CATEGORIES = ['Girls 18U','U16','U14','U12','German club','Open','Professional'];
const LEVELS = ['ITF Junior J30','ITF Junior J60','ITF Junior J100','ITF Junior J200','ITF Junior J300','ITF Junior J500','Junior Grand Slam','Tennis Europe U12','Tennis Europe U14','Tennis Europe U16','FRT U12','FRT U14','FRT U16','FRT U18','German Ostliga Damen','German Club League','German LK Registration','W15','W35','Training','Sponsor/Admin'];
const SURFACES = ['Clay','Hard','Indoor','Grass','Carpet'];
const STATUS = ['Research','Acceptance list','Rostered','Target','Planned','Scheduled','Confirmed','Active','Completed','Skipped'];
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


const VERIFIED_CAREER_ROWS = [
  {
    "date": "2019-08-21",
    "type": "Trophy",
    "title": "Romanian U10 team champion",
    "body": "Won the Romanian U10 girls team title with Dyadora Timișoara. Romanian press reported the team won every tie 3-0 and did not lose a set.",
    "source": "Radio România Timișoara, 2019 U10 team championship"
  },
  {
    "date": "2020-06-30",
    "type": "Trophy",
    "title": "Cupa TC București U10 champion",
    "body": "Won the U10 title at the first FRT event after the pandemic pause. Reported no sets lost and only two games conceded in four matches.",
    "source": "Radio România Timișoara, 30 Jun 2020"
  },
  {
    "date": "2021-07-20",
    "type": "Tournament",
    "title": "Romania U12 team selection",
    "body": "Selected for Romania U12 girls team competition while one year under the age category.",
    "source": "Radio România Timișoara, July 2021"
  },
  {
    "date": "2021-09-13",
    "type": "Trophy",
    "title": "Romanian U12 interclub champion",
    "body": "Won the Romanian U12 mixed team title with CS Major București, while primarily registered with Sport 4 Fun Timișoara.",
    "source": "Radio România Timișoara, Sept 2021"
  },
  {
    "date": "2022-06-20",
    "type": "Trophy",
    "title": "Romanian U12 singles and doubles champion",
    "body": "Won the Romanian U12 national singles and doubles titles in Bucharest for Sport 4 Fun Timișoara. Reported no set lost in singles.",
    "source": "Radio România Timișoara, 20 Jun 2022"
  },
  {
    "date": "2022-06-20",
    "type": "Trophy",
    "title": "HAI Cup Arad U12 singles and doubles champion",
    "body": "Won singles and doubles at HAI Cup Arad, a Tennis Europe U12 event, in the same month as the national U12 double.",
    "source": "Radio România Timișoara, 20 Jun 2022"
  },
  {
    "date": "2022-08-08",
    "type": "Final",
    "title": "European U12 team runner-up with Romania",
    "body": "Helped Romania finish runner-up in the European U12 team finals in Ajaccio. Romanian press reported she was named best player of the final tournament.",
    "source": "Radio România Timișoara, Aug 2022"
  },
  {
    "date": "2022-11-14",
    "type": "Trophy",
    "title": "Tennis Europe U14 champion at Rafa Nadal Academy",
    "body": "Won a Tennis Europe U14 title in Manacor at age 12, beating the top seed in the final.",
    "source": "Radio România Timișoara, Nov 2022"
  },
  {
    "date": "2022-11-23",
    "type": "Final",
    "title": "European U12 Festival finalist",
    "body": "Reached the singles final at the European U12 Festival at the Rafa Nadal Academy. Also reached the doubles semifinals with Maria Valentina Pop.",
    "source": "Cuget Liber, Nov 2022"
  },
  {
    "date": "2023-01-01",
    "type": "Training",
    "title": "Training block in France",
    "body": "Public reporting later stated she had trained from January 2023 at the academy founded by Jo-Wilfried Tsonga and Thierry Ascione near Nice.",
    "source": "Radio România Timișoara, Jan 2024 report"
  },
  {
    "date": "2023-03-05",
    "type": "Trophy",
    "title": "FOCUS / ROBEY Open U14 champion",
    "body": "Won the Tennis Europe U14 event in Rotterdam, defeating Antonia Stoyanov in the final.",
    "source": "CoreTennis results snapshot"
  },
  {
    "date": "2023-04-29",
    "type": "Final",
    "title": "J30 Timișoara singles finalist",
    "body": "Reached an ITF junior J30 singles final in Timișoara during the transition into ITF junior events.",
    "source": "CoreTennis results snapshot"
  },
  {
    "date": "2023-05-20",
    "type": "Final",
    "title": "Dr. Oetker Junior Trophy U14 finalist",
    "body": "Reached a Tennis Europe U14 final in Romania.",
    "source": "CoreTennis results snapshot"
  },
  {
    "date": "2023-09-17",
    "type": "Trophy",
    "title": "Alibaba U14 champion, Humenné",
    "body": "Won the Tennis Europe U14 event in Humenné, beating Oliwia Sybicka in the final.",
    "source": "CoreTennis results snapshot"
  },
  {
    "date": "2023-12-03",
    "type": "Semifinal",
    "title": "J30 Fes singles semifinalist",
    "body": "Reached the singles semifinal at ITF junior J30 Fes.",
    "source": "CoreTennis results snapshot"
  },
  {
    "date": "2024-01-09",
    "type": "Trophy",
    "title": "Romanian U14 winter national champion",
    "body": "Won the Romanian U14 winter national singles title in Bucharest and reached the doubles final. Report listed her at Tennis Europe U14 No. 16.",
    "source": "Radio România Timișoara, 9 Jan 2024"
  },
  {
    "date": "2024-03-17",
    "type": "Tournament",
    "title": "J60 Blagnac quarterfinalist",
    "body": "Reached an ITF junior J60 quarterfinal in Blagnac.",
    "source": "CoreTennis results snapshot"
  },
  {
    "date": "2024-05-12",
    "type": "Semifinal",
    "title": "Torneo U16 Tolentino semifinalist",
    "body": "Reached a Tennis Europe U16 semifinal in Tolentino.",
    "source": "CoreTennis results snapshot"
  },
  {
    "date": "2024-06-16",
    "type": "Semifinal",
    "title": "Torneo U16 Milano semifinalist",
    "body": "Reached a Tennis Europe U16 semifinal in Milano.",
    "source": "CoreTennis results snapshot"
  },
  {
    "date": "2024-07-14",
    "type": "Semifinal",
    "title": "J30 Stobreč semifinalist",
    "body": "Reached the singles semifinal at ITF junior J30 Stobreč.",
    "source": "CoreTennis results snapshot"
  },
  {
    "date": "2024-08-25",
    "type": "Tournament",
    "title": "J100 Barcelona RCTB quarterfinalist",
    "body": "Reached an ITF junior J100 quarterfinal in Barcelona.",
    "source": "CoreTennis results snapshot"
  },
  {
    "date": "2024-11-10",
    "type": "Final",
    "title": "J60 Cairo singles finalist and doubles champion",
    "body": "Reached a J60 Cairo singles final. Federation search result reported a doubles title in Cairo.",
    "source": "CoreTennis and FRT public result snippets"
  },
  {
    "date": "2025-03-17",
    "type": "Trophy",
    "title": "J60 Colomiers doubles champion",
    "body": "Reported as doubles champion with Sofia Kryvorucho, plus singles quarterfinal result.",
    "source": "FRT public result snippet"
  },
  {
    "date": "2025-05-26",
    "type": "Trophy",
    "title": "Montenegro ITF J60 doubles title block",
    "body": "Won J60 doubles trophies in Ulcinj and Podgorica with Yelena Lebeau. Also reached a singles semifinal in Ulcinj and singles final in Podgorica.",
    "source": "Radio România Timișoara, May 2025"
  },
  {
    "date": "2025-07-21",
    "type": "Tournament",
    "title": "W15 Cluj-Napoca women pro transition appearance",
    "body": "Listed in women pro ITF W15 Cluj-Napoca qualifying context.",
    "source": "CoreTennis results snapshot"
  },
  {
    "date": "2025-09-15",
    "type": "Tournament",
    "title": "W15 Câmpulung appearance",
    "body": "Listed in women pro ITF W15 Câmpulung activity, early professional transition exposure.",
    "source": "CoreTennis results snapshot"
  },
  {
    "date": "2025-11-16",
    "type": "Tournament",
    "title": "J60 Nairobi quarterfinalist",
    "body": "Reached an ITF junior J60 Nairobi quarterfinal.",
    "source": "CoreTennis results snapshot"
  },
  {
    "date": "2025-11-23",
    "type": "Tournament",
    "title": "J100 Nairobi R16",
    "body": "Reached the round of 16 at ITF junior J100 Nairobi.",
    "source": "CoreTennis results snapshot"
  },
  {
    "date": "2026-02-21",
    "type": "Tournament",
    "title": "Romania U16 Winter Cups fourth place",
    "body": "Part of the Romanian U16 team that qualified from Limassol and finished fourth at the finals.",
    "source": "ProSport and FRT public result snippets"
  },
  {
    "date": "2026-05-07",
    "type": "Ranking",
    "title": "ITF junior ranking profile snapshot",
    "body": "Public profiles show ITF junior profile active, WTA profile present but no current WTA singles ranking. CoreTennis secondary snapshot lists ITF junior ranking 503, season high 491, career high 464.",
    "source": "ITF, WTA, CoreTennis public profile snapshots"
  }
];
const VERIFIED_TOURNAMENT_ROWS = [
  {
    "name": "Romanian U10 Team Championship",
    "start": "2019-08-21",
    "end": "2019-08-25",
    "track": "Romanian National / FRT",
    "level": "FRT U12",
    "surface": "Clay",
    "city": "Unknown",
    "country": "Romania",
    "status": "Completed",
    "priority": "C",
    "result": "Team champion with Dyadora Timișoara",
    "points": 0,
    "outcome": "W",
    "notes": "Radio România Timișoara"
  },
  {
    "name": "Cupa TC București powered by Champion Bowl",
    "start": "2020-06-27",
    "end": "2020-06-30",
    "track": "Romanian National / FRT",
    "level": "FRT U12",
    "surface": "Clay",
    "city": "Bucharest",
    "country": "Romania",
    "status": "Completed",
    "priority": "C",
    "result": "U10 singles champion",
    "points": 0,
    "outcome": "W",
    "notes": "Radio România Timișoara"
  },
  {
    "name": "European U12 Team Qualifiers",
    "start": "2021-07-20",
    "end": "2021-07-25",
    "track": "Romanian National / FRT",
    "level": "FRT U12",
    "surface": "Clay",
    "city": "Cyprus",
    "country": "Cyprus",
    "status": "Completed",
    "priority": "B",
    "result": "Romania U12 team selection",
    "points": 0,
    "outcome": "",
    "notes": "Radio România Timișoara"
  },
  {
    "name": "Romanian U12 Interclub Championship",
    "start": "2021-09-13",
    "end": "2021-09-19",
    "track": "Romanian National / FRT",
    "level": "FRT U12",
    "surface": "Clay",
    "city": "Bucharest",
    "country": "Romania",
    "status": "Completed",
    "priority": "B",
    "result": "Team champion with CS Major București",
    "points": 0,
    "outcome": "W",
    "notes": "Radio România Timișoara"
  },
  {
    "name": "Romanian U12 National Championships",
    "start": "2022-06-20",
    "end": "2022-06-26",
    "track": "Romanian National / FRT",
    "level": "FRT U12",
    "surface": "Clay",
    "city": "Bucharest",
    "country": "Romania",
    "status": "Completed",
    "priority": "A",
    "result": "Singles and doubles champion",
    "points": 0,
    "outcome": "W",
    "notes": "Radio România Timișoara"
  },
  {
    "name": "HAI Cup Arad",
    "start": "2022-06-13",
    "end": "2022-06-19",
    "track": "Tennis Europe",
    "level": "Tennis Europe U12",
    "surface": "Clay",
    "city": "Arad",
    "country": "Romania",
    "status": "Completed",
    "priority": "A",
    "result": "U12 singles and doubles champion",
    "points": 0,
    "outcome": "W",
    "notes": "Radio România Timișoara"
  },
  {
    "name": "European Summer Cup U12 Finals",
    "start": "2022-08-05",
    "end": "2022-08-08",
    "track": "Tennis Europe",
    "level": "Tennis Europe U12",
    "surface": "Clay",
    "city": "Ajaccio",
    "country": "France",
    "status": "Completed",
    "priority": "A",
    "result": "Romania runner-up; best player report",
    "points": 0,
    "outcome": "F",
    "notes": "Radio România Timișoara"
  },
  {
    "name": "Rafa Nadal Academy U14",
    "start": "2022-11-07",
    "end": "2022-11-13",
    "track": "Tennis Europe",
    "level": "Tennis Europe U14",
    "surface": "Hard",
    "city": "Manacor",
    "country": "Spain",
    "status": "Completed",
    "priority": "A",
    "result": "Singles champion",
    "points": 0,
    "outcome": "W",
    "notes": "Radio România Timișoara"
  },
  {
    "name": "European U12 Festival",
    "start": "2022-11-21",
    "end": "2022-11-27",
    "track": "Tennis Europe",
    "level": "Tennis Europe U12",
    "surface": "Hard",
    "city": "Manacor",
    "country": "Spain",
    "status": "Completed",
    "priority": "A",
    "result": "Singles finalist; doubles semifinalist",
    "points": 0,
    "outcome": "F",
    "notes": "Cuget Liber"
  },
  {
    "name": "FOCUS / ROBEY Open U14",
    "start": "2023-02-27",
    "end": "2023-03-05",
    "track": "Tennis Europe",
    "level": "Tennis Europe U14",
    "surface": "Indoor",
    "city": "Rotterdam",
    "country": "Netherlands",
    "status": "Completed",
    "priority": "B",
    "result": "Singles champion",
    "points": 0,
    "outcome": "W",
    "notes": "CoreTennis"
  },
  {
    "name": "J30 Timișoara",
    "start": "2023-04-24",
    "end": "2023-04-30",
    "track": "ITF Junior",
    "level": "ITF Junior J30",
    "surface": "Clay",
    "city": "Timișoara",
    "country": "Romania",
    "status": "Completed",
    "priority": "B",
    "result": "Singles finalist",
    "points": 0,
    "outcome": "F",
    "notes": "CoreTennis"
  },
  {
    "name": "Dr. Oetker Junior Trophy U14",
    "start": "2023-05-15",
    "end": "2023-05-21",
    "track": "Tennis Europe",
    "level": "Tennis Europe U14",
    "surface": "Clay",
    "city": "Romania",
    "country": "Romania",
    "status": "Completed",
    "priority": "B",
    "result": "Singles finalist",
    "points": 0,
    "outcome": "F",
    "notes": "CoreTennis"
  },
  {
    "name": "Alibaba U14 Humenné",
    "start": "2023-09-11",
    "end": "2023-09-17",
    "track": "Tennis Europe",
    "level": "Tennis Europe U14",
    "surface": "Clay",
    "city": "Humenné",
    "country": "Slovakia",
    "status": "Completed",
    "priority": "B",
    "result": "Singles champion",
    "points": 0,
    "outcome": "W",
    "notes": "CoreTennis"
  },
  {
    "name": "J30 Fes",
    "start": "2023-11-27",
    "end": "2023-12-03",
    "track": "ITF Junior",
    "level": "ITF Junior J30",
    "surface": "Clay",
    "city": "Fes",
    "country": "Morocco",
    "status": "Completed",
    "priority": "B",
    "result": "Singles semifinalist",
    "points": 0,
    "outcome": "SF",
    "notes": "CoreTennis"
  },
  {
    "name": "Romanian U14 Winter Nationals",
    "start": "2024-01-03",
    "end": "2024-01-09",
    "track": "Romanian National / FRT",
    "level": "FRT U14",
    "surface": "Indoor",
    "city": "Bucharest",
    "country": "Romania",
    "status": "Completed",
    "priority": "A",
    "result": "Singles champion; doubles finalist",
    "points": 0,
    "outcome": "W",
    "notes": "Radio România Timișoara"
  },
  {
    "name": "J60 Blagnac",
    "start": "2024-03-11",
    "end": "2024-03-17",
    "track": "ITF Junior",
    "level": "ITF Junior J60",
    "surface": "Hard",
    "city": "Blagnac",
    "country": "France",
    "status": "Completed",
    "priority": "B",
    "result": "Singles quarterfinalist",
    "points": 0,
    "outcome": "QF",
    "notes": "CoreTennis"
  },
  {
    "name": "Torneo U16 Tolentino",
    "start": "2024-05-06",
    "end": "2024-05-12",
    "track": "Tennis Europe",
    "level": "Tennis Europe U16",
    "surface": "Clay",
    "city": "Tolentino",
    "country": "Italy",
    "status": "Completed",
    "priority": "B",
    "result": "Singles semifinalist",
    "points": 0,
    "outcome": "SF",
    "notes": "CoreTennis"
  },
  {
    "name": "Torneo U16 Milano",
    "start": "2024-06-10",
    "end": "2024-06-16",
    "track": "Tennis Europe",
    "level": "Tennis Europe U16",
    "surface": "Clay",
    "city": "Milano",
    "country": "Italy",
    "status": "Completed",
    "priority": "B",
    "result": "Singles semifinalist",
    "points": 0,
    "outcome": "SF",
    "notes": "CoreTennis"
  },
  {
    "name": "J30 Stobreč",
    "start": "2024-07-08",
    "end": "2024-07-14",
    "track": "ITF Junior",
    "level": "ITF Junior J30",
    "surface": "Clay",
    "city": "Stobreč",
    "country": "Croatia",
    "status": "Completed",
    "priority": "B",
    "result": "Singles semifinalist",
    "points": 0,
    "outcome": "SF",
    "notes": "CoreTennis"
  },
  {
    "name": "J100 Barcelona RCTB",
    "start": "2024-08-19",
    "end": "2024-08-25",
    "track": "ITF Junior",
    "level": "ITF Junior J100",
    "surface": "Clay",
    "city": "Barcelona",
    "country": "Spain",
    "status": "Completed",
    "priority": "A",
    "result": "Singles quarterfinalist",
    "points": 0,
    "outcome": "QF",
    "notes": "CoreTennis"
  },
  {
    "name": "J60 Cairo Gezira",
    "start": "2024-10-28",
    "end": "2024-11-03",
    "track": "ITF Junior",
    "level": "ITF Junior J60",
    "surface": "Clay",
    "city": "Cairo",
    "country": "Egypt",
    "status": "Completed",
    "priority": "B",
    "result": "Singles semifinalist",
    "points": 0,
    "outcome": "SF",
    "notes": "CoreTennis"
  },
  {
    "name": "J60 Cairo Maadi",
    "start": "2024-11-04",
    "end": "2024-11-10",
    "track": "ITF Junior",
    "level": "ITF Junior J60",
    "surface": "Clay",
    "city": "Cairo",
    "country": "Egypt",
    "status": "Completed",
    "priority": "A",
    "result": "Singles finalist; doubles title reported",
    "points": 0,
    "outcome": "F",
    "notes": "CoreTennis / FRT snippet"
  },
  {
    "name": "J60 Warsaw",
    "start": "2025-02-17",
    "end": "2025-02-23",
    "track": "ITF Junior",
    "level": "ITF Junior J60",
    "surface": "Indoor",
    "city": "Warsaw",
    "country": "Poland",
    "status": "Completed",
    "priority": "B",
    "result": "Singles quarterfinalist",
    "points": 0,
    "outcome": "QF",
    "notes": "CoreTennis"
  },
  {
    "name": "J60 Colomiers",
    "start": "2025-03-10",
    "end": "2025-03-16",
    "track": "ITF Junior",
    "level": "ITF Junior J60",
    "surface": "Hard",
    "city": "Colomiers",
    "country": "France",
    "status": "Completed",
    "priority": "B",
    "result": "Singles quarterfinalist; doubles champion reported",
    "points": 0,
    "outcome": "QF",
    "notes": "CoreTennis / FRT snippet"
  },
  {
    "name": "J30 Subotica",
    "start": "2025-04-07",
    "end": "2025-04-13",
    "track": "ITF Junior",
    "level": "ITF Junior J30",
    "surface": "Clay",
    "city": "Subotica",
    "country": "Serbia",
    "status": "Completed",
    "priority": "B",
    "result": "Singles semifinalist",
    "points": 0,
    "outcome": "SF",
    "notes": "CoreTennis"
  },
  {
    "name": "J30 Timișoara",
    "start": "2025-04-28",
    "end": "2025-05-04",
    "track": "ITF Junior",
    "level": "ITF Junior J30",
    "surface": "Clay",
    "city": "Timișoara",
    "country": "Romania",
    "status": "Completed",
    "priority": "B",
    "result": "Singles semifinalist",
    "points": 0,
    "outcome": "SF",
    "notes": "CoreTennis"
  },
  {
    "name": "J60 Ulcinj",
    "start": "2025-05-12",
    "end": "2025-05-18",
    "track": "ITF Junior",
    "level": "ITF Junior J60",
    "surface": "Clay",
    "city": "Ulcinj",
    "country": "Montenegro",
    "status": "Completed",
    "priority": "A",
    "result": "Singles semifinalist; doubles champion",
    "points": 0,
    "outcome": "SF",
    "notes": "Radio România Timișoara"
  },
  {
    "name": "J60 Podgorica",
    "start": "2025-05-19",
    "end": "2025-05-25",
    "track": "ITF Junior",
    "level": "ITF Junior J60",
    "surface": "Clay",
    "city": "Podgorica",
    "country": "Montenegro",
    "status": "Completed",
    "priority": "A",
    "result": "Singles finalist; doubles champion",
    "points": 0,
    "outcome": "F",
    "notes": "Radio România Timișoara"
  },
  {
    "name": "W15 Cluj-Napoca",
    "start": "2025-07-21",
    "end": "2025-07-27",
    "track": "ITF Women",
    "level": "W15",
    "surface": "Clay",
    "city": "Cluj-Napoca",
    "country": "Romania",
    "status": "Completed",
    "priority": "B",
    "result": "Women pro transition qualifying context",
    "points": 0,
    "outcome": "",
    "notes": "CoreTennis"
  },
  {
    "name": "W15 Câmpulung",
    "start": "2025-09-15",
    "end": "2025-09-21",
    "track": "ITF Women",
    "level": "W15",
    "surface": "Clay",
    "city": "Câmpulung",
    "country": "Romania",
    "status": "Completed",
    "priority": "B",
    "result": "Women pro transition appearance",
    "points": 0,
    "outcome": "L",
    "notes": "CoreTennis"
  },
  {
    "name": "J60 Nairobi",
    "start": "2025-11-10",
    "end": "2025-11-16",
    "track": "ITF Junior",
    "level": "ITF Junior J60",
    "surface": "Clay",
    "city": "Nairobi",
    "country": "Kenya",
    "status": "Completed",
    "priority": "B",
    "result": "Singles quarterfinalist",
    "points": 0,
    "outcome": "QF",
    "notes": "CoreTennis"
  },
  {
    "name": "J100 Nairobi",
    "start": "2025-11-17",
    "end": "2025-11-23",
    "track": "ITF Junior",
    "level": "ITF Junior J100",
    "surface": "Clay",
    "city": "Nairobi",
    "country": "Kenya",
    "status": "Completed",
    "priority": "B",
    "result": "Singles R16",
    "points": 0,
    "outcome": "L",
    "notes": "CoreTennis"
  },
  {
    "name": "U16 Winter Cups Qualifying",
    "start": "2026-02-02",
    "end": "2026-02-08",
    "track": "Romanian National / FRT",
    "level": "FRT U16",
    "surface": "Hard",
    "city": "Limassol",
    "country": "Cyprus",
    "status": "Completed",
    "priority": "A",
    "result": "Romania qualified for finals",
    "points": 0,
    "outcome": "W",
    "notes": "ProSport"
  },
  {
    "name": "U16 Winter Cups Finals",
    "start": "2026-02-17",
    "end": "2026-02-21",
    "track": "Romanian National / FRT",
    "level": "FRT U16",
    "surface": "Indoor",
    "city": "Brest",
    "country": "France",
    "status": "Completed",
    "priority": "A",
    "result": "Romania finished fourth",
    "points": 0,
    "outcome": "SF",
    "notes": "FRT snippet"
  },
  {
    "name": "J60 Frederiksberg",
    "start": "2026-02-09",
    "end": "2026-02-15",
    "track": "ITF Junior",
    "level": "ITF Junior J60",
    "surface": "Indoor",
    "city": "Frederiksberg / Copenhagen",
    "country": "Denmark",
    "status": "Completed",
    "priority": "B",
    "result": "1R / R32 loss as No. 2 seed",
    "matchRecord": "Lost to Valerie Hafstrom (SWE, Q) 6-3 7-6(5).",
    "points": 0,
    "outcome": "1R",
    "notes": "CoreTennis and Junior Tennis Database show 1R result; use as verified 2026 ITF junior result."
  },
  {
    "name": "J60 Larnaca",
    "start": "2026-03-02",
    "end": "2026-03-08",
    "track": "ITF Junior",
    "level": "ITF Junior J60",
    "surface": "Hard",
    "city": "Larnaca",
    "country": "Cyprus",
    "status": "Completed",
    "priority": "B",
    "result": "1/16 listing on CoreTennis profile; draw shows wins as No. 1 seed",
    "matchRecord": "Draw table shows Olariu [1] with 6-0 6-0, 6-1 7-6(4), and 6-3 Ret. results in her section. Final placement should be double-checked against ITF draw before sponsor publication.",
    "points": 0,
    "outcome": "Needs verify",
    "notes": "CoreTennis profile lists 1/16 for 2026 stats, while tournament table indicates a deeper run. Keep flagged until official ITF draw is reconciled."
  },
  {
    "name": "TC Wolfsberg Pforzheim Damen roster",
    "start": "2025-04-15",
    "end": "2025-09-30",
    "track": "German Club League / nuLiga",
    "level": "German Club League",
    "surface": "Clay",
    "city": "Pforzheim",
    "country": "Germany",
    "status": "Completed",
    "priority": "B",
    "result": "Registered on Sommer 2025 Damen roster",
    "matchRecord": "nuLiga roster lists Olariu, Andreea (ROU gA), ID 21065884, LK2.5, B/A127, rank 13 for TC Wolfsberg Pforzheim Damen.",
    "points": 0,
    "outcome": "Rostered",
    "notes": "German club registration record; match appearances still need individual Spielbericht checks."
  },
  {
    "name": "TLZ Espenhain Damen roster / LK",
    "start": "2026-03-04",
    "end": "2026-06-30",
    "track": "German Club League / nuLiga",
    "level": "German LK Registration",
    "surface": "Clay",
    "city": "Espenhain / Rötha",
    "country": "Germany",
    "status": "Rostered",
    "priority": "A",
    "result": "Rostered for TLZ Espenhain Damen; LK2.8 on 06.05.2026",
    "matchRecord": "nuLiga lists LK3.6 on 04.03.2026, LK2.7 on 01.04.2026, and LK2.8 on 06.05.2026.",
    "points": 0,
    "outcome": "Rostered",
    "notes": "Add individual match reports when confirmed. Women team is Ostliga Damen; men's team is 2. Bundesliga Herren Süd."
  },
  {
    "name": "Internationaler TC vs TLZ Espenhain Damen",
    "start": "2026-05-02",
    "end": "2026-05-02",
    "track": "German Club League / nuLiga",
    "level": "German Ostliga Damen",
    "surface": "Clay",
    "city": "Berlin / Germany",
    "country": "Germany",
    "status": "Completed",
    "priority": "A",
    "result": "TLZ Espenhain won team tie 5-4",
    "matchRecord": "Team score: Internationaler TC 4-5 TLZ Espenhain; sets 9-10; games 73-82. Individual Andreea line not confirmed from public snippet.",
    "points": 0,
    "outcome": "Team W",
    "notes": "nuLiga meeting list; click Spielbericht manually to confirm whether Andreea played singles/doubles."
  },
  {
    "name": "TLZ Espenhain Damen vs Grunewald TC",
    "start": "2026-05-09",
    "end": "2026-05-09",
    "track": "German Club League / nuLiga",
    "level": "German Ostliga Damen",
    "surface": "Clay",
    "city": "Espenhain / Rötha",
    "country": "Germany",
    "status": "Scheduled",
    "priority": "A",
    "result": "Scheduled Ostliga Damen tie",
    "matchRecord": "Scheduled for 11:00 local time. Confirm lineup and result after match report posts.",
    "points": 0,
    "outcome": "Scheduled",
    "notes": "nuLiga fixture."
  },
  {
    "name": "SV Berliner Bären vs TLZ Espenhain Damen",
    "start": "2026-05-16",
    "end": "2026-05-16",
    "track": "German Club League / nuLiga",
    "level": "German Ostliga Damen",
    "surface": "Clay",
    "city": "Berlin",
    "country": "Germany",
    "status": "Scheduled",
    "priority": "A",
    "result": "Scheduled Ostliga Damen tie",
    "matchRecord": "Scheduled for 11:00 local time. Confirm lineup and result after match report posts.",
    "points": 0,
    "outcome": "Scheduled",
    "notes": "nuLiga fixture."
  },
  {
    "name": "SV Zehlendorfer Wespen II vs TLZ Espenhain Damen",
    "start": "2026-05-30",
    "end": "2026-05-30",
    "track": "German Club League / nuLiga",
    "level": "German Ostliga Damen",
    "surface": "Clay",
    "city": "Berlin",
    "country": "Germany",
    "status": "Scheduled",
    "priority": "A",
    "result": "Scheduled Ostliga Damen tie",
    "matchRecord": "Scheduled for 11:00 local time. Confirm lineup and result after match report posts.",
    "points": 0,
    "outcome": "Scheduled",
    "notes": "nuLiga fixture."
  },
  {
    "name": "TLZ Espenhain Damen vs BW DD Blasewitz II",
    "start": "2026-06-13",
    "end": "2026-06-13",
    "track": "German Club League / nuLiga",
    "level": "German Ostliga Damen",
    "surface": "Clay",
    "city": "Espenhain / Rötha",
    "country": "Germany",
    "status": "Scheduled",
    "priority": "A",
    "result": "Scheduled Ostliga Damen tie",
    "matchRecord": "Scheduled for 13:30 local time. Confirm lineup and result after match report posts.",
    "points": 0,
    "outcome": "Scheduled",
    "notes": "nuLiga fixture."
  },
  {
    "name": "TLZ Espenhain Damen vs Erfurter TC RW",
    "start": "2026-06-20",
    "end": "2026-06-20",
    "track": "German Club League / nuLiga",
    "level": "German Ostliga Damen",
    "surface": "Clay",
    "city": "Espenhain / Rötha",
    "country": "Germany",
    "status": "Scheduled",
    "priority": "A",
    "result": "Scheduled Ostliga Damen tie",
    "matchRecord": "Scheduled for 11:00 local time. Confirm lineup and result after match report posts.",
    "points": 0,
    "outcome": "Scheduled",
    "notes": "nuLiga fixture."
  },
  {
    "name": "Tennis-Club SCC Berlin II vs TLZ Espenhain Damen",
    "start": "2026-06-27",
    "end": "2026-06-27",
    "track": "German Club League / nuLiga",
    "level": "German Ostliga Damen",
    "surface": "Clay",
    "city": "Berlin",
    "country": "Germany",
    "status": "Scheduled",
    "priority": "A",
    "result": "Scheduled Ostliga Damen tie",
    "matchRecord": "Scheduled for 11:00 local time. Confirm lineup and result after match report posts.",
    "points": 0,
    "outcome": "Scheduled",
    "notes": "nuLiga fixture."
  },
  {
    "name": "J60 Dunakeszi",
    "start": "2026-05-05",
    "end": "2026-05-11",
    "track": "ITF Junior",
    "level": "ITF Junior J60",
    "surface": "Clay",
    "city": "Dunakeszi",
    "country": "Hungary",
    "status": "Planned",
    "priority": "A",
    "result": "2026 clay block tracking row",
    "points": 0,
    "outcome": "",
    "notes": "ITF acceptance list snapshot"
  },
  {
    "name": "J60 Ulcinj 2026",
    "start": "2026-05-11",
    "end": "2026-05-17",
    "track": "ITF Junior",
    "level": "ITF Junior J60",
    "surface": "Clay",
    "city": "Ulcinj",
    "country": "Montenegro",
    "status": "Planned",
    "priority": "A",
    "result": "2026 clay block tracking row",
    "points": 0,
    "outcome": "",
    "notes": "ITF acceptance list snapshot"
  },
  {
    "name": "J60 Podgorica 2026",
    "start": "2026-05-18",
    "end": "2026-05-24",
    "track": "ITF Junior",
    "level": "ITF Junior J60",
    "surface": "Clay",
    "city": "Podgorica",
    "country": "Montenegro",
    "status": "Planned",
    "priority": "A",
    "result": "2026 clay block tracking row",
    "points": 0,
    "outcome": "",
    "notes": "ITF acceptance list snapshot"
  },
  {
    "name": "J200 Târgu Jiu 2026",
    "start": "2026-05-18",
    "end": "2026-05-22",
    "track": "ITF Junior",
    "level": "ITF Junior J200",
    "surface": "Clay",
    "city": "Târgu Jiu",
    "country": "Romania",
    "status": "Planned",
    "priority": "A",
    "result": "2026 Romania tracking row",
    "points": 0,
    "outcome": "",
    "notes": "ITF acceptance list snapshot"
  }
];
const VERIFIED_RANKING_ROWS = [
  {
    "system": "FRT Romania",
    "category": "U12",
    "value": "17",
    "date": "2019-08-21",
    "goal": "FRT U10 ranking reported in Romanian press"
  },
  {
    "system": "Tennis Europe",
    "category": "U14",
    "value": "16",
    "date": "2024-01-09",
    "goal": "Tennis Europe U14 ranking reported by Radio România Timișoara"
  },
  {
    "system": "ITF Junior",
    "category": "Girls 18U",
    "value": "532",
    "date": "2025-05-26",
    "goal": "Reported as best ITF junior ranking at that time"
  },
  {
    "system": "ITF Junior",
    "category": "Girls 18U",
    "value": "464",
    "date": "2025-11-30",
    "goal": "Career high per CoreTennis secondary snapshot; date to verify"
  },
  {
    "system": "ITF Junior",
    "category": "Girls 18U",
    "value": "491",
    "date": "2026-02-15",
    "goal": "Season high per CoreTennis secondary snapshot; date to verify"
  },
  {
    "system": "ITF Junior",
    "category": "Girls 18U",
    "value": "503",
    "date": "2026-05-07",
    "goal": "Current secondary-source snapshot"
  },
  {
    "system": "German LK",
    "category": "German club",
    "value": "3.6",
    "date": "2026-03-04",
    "goal": "nuLiga TLZ Espenhain LK snapshot"
  },
  {
    "system": "German LK",
    "category": "German club",
    "value": "2.7",
    "date": "2026-04-01",
    "goal": "nuLiga TLZ Espenhain LK snapshot"
  },
  {
    "system": "German LK",
    "category": "German club",
    "value": "2.8",
    "date": "2026-05-06",
    "goal": "nuLiga TLZ Espenhain LK snapshot"
  },
  {
    "system": "German B/A",
    "category": "German club",
    "value": "350",
    "date": "2026-05-06",
    "goal": "nuLiga TLZ Espenhain B/A value shown on roster"
  },
  {
    "system": "Tennis Europe",
    "category": "U16",
    "value": "288",
    "date": "2026-02-04",
    "goal": "Reported in Greek Winter Cups coverage; needs official Tennis Europe profile check before sponsor PDF"
  },
  {
    "system": "FRT Romania",
    "category": "Current national ranking",
    "value": "TBD",
    "date": "2026-05-08",
    "goal": "No verified current FRT national ranking found in accessible public sources"
  },
  {
    "system": "WTA",
    "category": "Professional",
    "value": "Unranked",
    "date": "2026-05-08",
    "goal": "WTA profile shows current singles rank as blank / dash and $0 prize money"
  },
  {
    "system": "UTR",
    "category": "Rating",
    "value": "TBD",
    "date": "2026-05-08",
    "goal": "Research needed; requires verified UTR profile or account access"
  },
  {
    "system": "WTN",
    "category": "World Tennis Number",
    "value": "TBD",
    "date": "2026-05-08",
    "goal": "Research needed; requires verified WTN source"
  }
];
const SPONSOR_LEAD_ROWS = [
  {
    "company": "Banca Transilvania",
    "category": "Banking / financial services",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "National bank; youth performance and disciplined planning angle."
  },
  {
    "company": "BCR",
    "category": "Banking / financial services",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "National bank; structured season partner proposal."
  },
  {
    "company": "BRD Groupe Societe Generale",
    "category": "Banking / financial services",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "National bank; women in sport and Romanian performance pathway."
  },
  {
    "company": "Raiffeisen Bank Romania",
    "category": "Banking / financial services",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "National bank; community visibility and measurable campaign updates."
  },
  {
    "company": "ING Bank Romania",
    "category": "Banking / financial services",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "Digital bank; data-backed athlete operating model."
  },
  {
    "company": "UniCredit Bank Romania",
    "category": "Banking / financial services",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "Corporate sponsor prospect; use professional deck and budget overview."
  },
  {
    "company": "CEC Bank",
    "category": "Banking / financial services",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "Romanian national brand; local athlete development angle."
  },
  {
    "company": "Patria Bank",
    "category": "Banking / financial services",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Mid-sized financial sponsor prospect; specific tournament block ask."
  },
  {
    "company": "Alpha Bank Romania",
    "category": "Banking / financial services",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Financial sponsor prospect; verify current sponsorship contact."
  },
  {
    "company": "Garanti BBVA Romania",
    "category": "Banking / financial services",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Financial sponsor prospect; performance and youth ambition angle."
  },
  {
    "company": "Allianz-Tiriac",
    "category": "Insurance",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "Insurance partner prospect; risk, planning, and recovery narrative."
  },
  {
    "company": "Groupama Romania",
    "category": "Insurance",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Insurance prospect; concrete travel block sponsorship."
  },
  {
    "company": "NN Romania",
    "category": "Insurance / pensions",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "Long-term planning narrative; suitable for season partner ask."
  },
  {
    "company": "Metropolitan Life Romania",
    "category": "Insurance",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Corporate sponsor prospect; family security and youth development angle."
  },
  {
    "company": "OMV Petrom",
    "category": "Energy",
    "package": "Main Partner",
    "ask": 25000,
    "sponsoredItem": "Season partner",
    "notes": "Large national corporate prospect; only approach with full deck and budget."
  },
  {
    "company": "Rompetrol",
    "category": "Energy",
    "package": "Season Partner",
    "ask": 15000,
    "sponsoredItem": "Season partner",
    "notes": "National fuel and mobility angle for tournament travel."
  },
  {
    "company": "MOL Romania",
    "category": "Energy / fuel",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Travel-linked prospect; pitch one international tournament block."
  },
  {
    "company": "E.ON Romania",
    "category": "Utilities",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "National utility prospect; structured reporting required."
  },
  {
    "company": "Enel Romania / PPC Romania",
    "category": "Utilities",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "Energy brand prospect; verify current local brand and contact."
  },
  {
    "company": "Aqua Carpatica",
    "category": "Beverage",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Recovery / physio",
    "notes": "Hydration and recovery angle; in-kind plus cash option."
  },
  {
    "company": "Borsec",
    "category": "Beverage",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Recovery / physio",
    "notes": "Romanian hydration brand; tournament hydration support."
  },
  {
    "company": "Dorna",
    "category": "Beverage",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Recovery / physio",
    "notes": "Hydration support prospect; verify current brand team."
  },
  {
    "company": "La Fantana",
    "category": "Beverage / water services",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Recovery / physio",
    "notes": "Hydration support and local visibility angle."
  },
  {
    "company": "Carrefour Romania",
    "category": "Retail",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "National retail partner prospect; youth sport and family audience."
  },
  {
    "company": "Kaufland Romania",
    "category": "Retail",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "National retailer; local community and measurable reporting."
  },
  {
    "company": "Lidl Romania",
    "category": "Retail",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "National retailer; approach via partnerships or marketing."
  },
  {
    "company": "Mega Image",
    "category": "Retail",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Retail prospect; focus on concrete event funding."
  },
  {
    "company": "Auchan Romania",
    "category": "Retail",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Retail prospect already present in draft; keep as one tournament block ask."
  },
  {
    "company": "Selgros Romania",
    "category": "Retail",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Retail / wholesale prospect; regional business contact route."
  },
  {
    "company": "Profi Romania",
    "category": "Retail",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Romanian retail footprint; local community angle."
  },
  {
    "company": "eMAG",
    "category": "E-commerce / technology retail",
    "package": "Season Partner",
    "ask": 15000,
    "sponsoredItem": "Season partner",
    "notes": "National tech retail prospect; campaign dashboard and data story fit."
  },
  {
    "company": "Altex Romania",
    "category": "Electronics retail",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Retail prospect; youth performance and family audience."
  },
  {
    "company": "Flanco",
    "category": "Electronics retail",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Equipment package",
    "notes": "Equipment and content support angle."
  },
  {
    "company": "Dedeman",
    "category": "Home improvement retail",
    "package": "Season Partner",
    "ask": 15000,
    "sponsoredItem": "Season partner",
    "notes": "Large Romanian company; pitch only with polished deck."
  },
  {
    "company": "Brico Depot Romania",
    "category": "Home improvement retail",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Retail prospect; local community and family angle."
  },
  {
    "company": "Mobexpert",
    "category": "Furniture / retail",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Romanian brand; athlete development story."
  },
  {
    "company": "Decathlon Romania",
    "category": "Sports retail",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Equipment package",
    "notes": "Sports equipment partner; cash or in-kind."
  },
  {
    "company": "Intersport Romania",
    "category": "Sports retail",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Equipment package",
    "notes": "Sports retail prospect; shoes, apparel, strings support."
  },
  {
    "company": "Hervis Sports Romania",
    "category": "Sports retail",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Equipment package",
    "notes": "Sports retail prospect; local and national activation."
  },
  {
    "company": "Sportisimo Romania",
    "category": "Sports retail",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Equipment package",
    "notes": "Sports retail prospect; equipment and campaign updates."
  },
  {
    "company": "Wilson Romania distributor",
    "category": "Tennis equipment",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Equipment package",
    "notes": "Tennis-specific equipment route; verify distributor."
  },
  {
    "company": "Babolat Romania distributor",
    "category": "Tennis equipment",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Equipment package",
    "notes": "Tennis-specific equipment route; verify distributor."
  },
  {
    "company": "HEAD Romania distributor",
    "category": "Tennis equipment",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Equipment package",
    "notes": "Tennis-specific equipment route; verify distributor."
  },
  {
    "company": "Yonex Romania distributor",
    "category": "Tennis equipment",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Equipment package",
    "notes": "Tennis-specific equipment route; verify distributor."
  },
  {
    "company": "Nike Romania retail partner",
    "category": "Sports apparel",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Equipment package",
    "notes": "Apparel / shoes prospect; verify local partnership route."
  },
  {
    "company": "adidas Romania retail partner",
    "category": "Sports apparel",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Equipment package",
    "notes": "Apparel / shoes prospect; verify local partnership route."
  },
  {
    "company": "Puma Romania retail partner",
    "category": "Sports apparel",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Equipment package",
    "notes": "Apparel prospect; youth athlete story."
  },
  {
    "company": "Continental Automotive Romania",
    "category": "Automotive / technology",
    "package": "Season Partner",
    "ask": 15000,
    "sponsoredItem": "Season partner",
    "notes": "Strong Timișoara-region corporate prospect; professional deck required."
  },
  {
    "company": "Bosch Service Solutions Timișoara",
    "category": "Technology / services",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "Timișoara employer brand and performance pathway angle."
  },
  {
    "company": "HELLA Romania",
    "category": "Automotive technology",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "Timișoara automotive tech prospect; verify current brand structure."
  },
  {
    "company": "Flex Timișoara",
    "category": "Manufacturing / electronics",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Regional employer brand prospect."
  },
  {
    "company": "Nokia Timișoara",
    "category": "Technology",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "Technology employer brand; local excellence angle."
  },
  {
    "company": "Atos Romania Timișoara",
    "category": "Technology services",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Tech services prospect; verify current entity/contact."
  },
  {
    "company": "Endava Romania",
    "category": "Technology services",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Tech company prospect; data-backed campaign fit."
  },
  {
    "company": "NTT DATA Romania",
    "category": "Technology services",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Technology services prospect; local and national angle."
  },
  {
    "company": "Accenture Romania",
    "category": "Technology / consulting",
    "package": "Season Partner",
    "ask": 10000,
    "sponsoredItem": "Season partner",
    "notes": "Corporate employer brand prospect; women in performance angle."
  },
  {
    "company": "Bitdefender",
    "category": "Cybersecurity",
    "package": "Season Partner",
    "ask": 15000,
    "sponsoredItem": "Season partner",
    "notes": "Romanian tech success story; approach only with full deck."
  },
  {
    "company": "UiPath",
    "category": "Software",
    "package": "Season Partner",
    "ask": 15000,
    "sponsoredItem": "Season partner",
    "notes": "Romanian tech success story; global Romanian pathway angle."
  },
  {
    "company": "Zitec",
    "category": "Technology services",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Romanian tech prospect; measurable campaign reporting."
  },
  {
    "company": "Digi Romania",
    "category": "Telecom / media",
    "package": "Season Partner",
    "ask": 15000,
    "sponsoredItem": "Season partner",
    "notes": "Media and telecom prospect; athlete profile visibility."
  },
  {
    "company": "Orange Romania",
    "category": "Telecom",
    "package": "Season Partner",
    "ask": 15000,
    "sponsoredItem": "Season partner",
    "notes": "Telecom sponsor prospect; youth digital storytelling."
  },
  {
    "company": "Vodafone Romania",
    "category": "Telecom",
    "package": "Season Partner",
    "ask": 15000,
    "sponsoredItem": "Season partner",
    "notes": "Telecom sponsor prospect; national reach."
  },
  {
    "company": "Telekom Romania Mobile",
    "category": "Telecom",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Telecom prospect; verify current contact route."
  },
  {
    "company": "Fan Courier",
    "category": "Logistics",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Travel and logistics angle; national company."
  },
  {
    "company": "Sameday",
    "category": "Logistics",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Fast-growing logistics prospect; youth performance angle."
  },
  {
    "company": "Cargus",
    "category": "Logistics",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Logistics prospect; concrete event ask."
  },
  {
    "company": "DHL Romania",
    "category": "Logistics",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "International logistics fit for travel pathway."
  },
  {
    "company": "TAROM",
    "category": "Travel",
    "package": "In-kind Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Flight support prospect; in-kind travel support."
  },
  {
    "company": "Wizz Air Romania route team",
    "category": "Travel",
    "package": "In-kind Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Travel support prospect; verify sponsorship route."
  },
  {
    "company": "Iulius Town Timișoara",
    "category": "Retail / property",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "High-value local visibility and community activation."
  },
  {
    "company": "Shopping City Timișoara",
    "category": "Retail / property",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Local mall activation and sponsor visibility."
  },
  {
    "company": "Hotel Timișoara",
    "category": "Hospitality",
    "package": "In-kind Partner",
    "ask": 1500,
    "sponsoredItem": "Local prep block",
    "notes": "Local hospitality partner; meetings, events, lodging support."
  },
  {
    "company": "NH Timișoara",
    "category": "Hospitality",
    "package": "In-kind Partner",
    "ask": 1500,
    "sponsoredItem": "Local prep block",
    "notes": "Hospitality prospect; in-kind lodging or meeting space."
  },
  {
    "company": "Mercure Timișoara",
    "category": "Hospitality",
    "package": "In-kind Partner",
    "ask": 1500,
    "sponsoredItem": "Local prep block",
    "notes": "Hospitality prospect; local prep block support."
  },
  {
    "company": "Tresor Le Palais Timișoara",
    "category": "Hospitality",
    "package": "In-kind Partner",
    "ask": 2500,
    "sponsoredItem": "Local prep block",
    "notes": "Premium local hospitality prospect."
  },
  {
    "company": "Pensiunea / hotel partner near Timișoara",
    "category": "Hospitality",
    "package": "In-kind Partner",
    "ask": 1000,
    "sponsoredItem": "Local prep block",
    "notes": "Generic local hospitality slot; replace with warm lead."
  },
  {
    "company": "World Class Romania",
    "category": "Fitness",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Coaching block",
    "notes": "Fitness and training support prospect."
  },
  {
    "company": "Smartfit Timișoara",
    "category": "Fitness",
    "package": "Equipment Partner",
    "ask": 1500,
    "sponsoredItem": "Coaching block",
    "notes": "Local fitness support prospect."
  },
  {
    "company": "Gym One Timișoara",
    "category": "Fitness",
    "package": "Equipment Partner",
    "ask": 1500,
    "sponsoredItem": "Coaching block",
    "notes": "Local fitness support prospect."
  },
  {
    "company": "Kinetic Sport & Medicine Timișoara prospect",
    "category": "Recovery / physio",
    "package": "In-kind Partner",
    "ask": 1500,
    "sponsoredItem": "Recovery / physio",
    "notes": "Recovery support lead; verify provider and contact."
  },
  {
    "company": "Regina Maria Timișoara",
    "category": "Private healthcare",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Recovery / physio",
    "notes": "Medical and recovery support prospect."
  },
  {
    "company": "MedLife Timișoara",
    "category": "Private healthcare",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Recovery / physio",
    "notes": "Medical partner prospect; recovery and prevention angle."
  },
  {
    "company": "Dental clinic Timișoara prospect",
    "category": "Healthcare services",
    "package": "Supporter",
    "ask": 1000,
    "sponsoredItem": "Equipment package",
    "notes": "Local business lead; replace with actual warm clinic."
  },
  {
    "company": "Orthopedic / sports medicine clinic prospect",
    "category": "Healthcare services",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Recovery / physio",
    "notes": "Recovery support prospect; replace with actual contact."
  },
  {
    "company": "Automobile Bavaria Timișoara",
    "category": "Auto dealership",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Local premium dealership prospect."
  },
  {
    "company": "Porsche Timișoara",
    "category": "Auto dealership",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Premium auto dealership prospect; local visibility."
  },
  {
    "company": "Toyota Timișoara dealer",
    "category": "Auto dealership",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Auto dealership prospect; travel and reliability angle."
  },
  {
    "company": "Mercedes-Benz Timișoara dealer",
    "category": "Auto dealership",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Premium dealership prospect; verify local entity."
  },
  {
    "company": "Ford Timișoara dealer",
    "category": "Auto dealership",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Tournament travel",
    "notes": "Local dealership prospect; practical travel support."
  },
  {
    "company": "Tazz",
    "category": "Food delivery / tech",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Timișoara-origin tech and consumer brand angle."
  },
  {
    "company": "Glovo Romania",
    "category": "Food delivery",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Consumer app prospect; youth audience."
  },
  {
    "company": "Freshful by eMAG",
    "category": "Grocery delivery",
    "package": "Equipment Partner",
    "ask": 2500,
    "sponsoredItem": "Recovery / physio",
    "notes": "Nutrition / recovery angle; verify sponsorship contact."
  },
  {
    "company": "5 to go",
    "category": "Coffee / retail",
    "package": "Supporter",
    "ask": 1000,
    "sponsoredItem": "Equipment package",
    "notes": "National small-ticket supporter angle."
  },
  {
    "company": "Starbucks Romania operator",
    "category": "Coffee / retail",
    "package": "Supporter",
    "ask": 1000,
    "sponsoredItem": "Equipment package",
    "notes": "Consumer brand prospect; verify operator."
  },
  {
    "company": "Local Timișoara restaurant group",
    "category": "Hospitality / restaurants",
    "package": "Supporter",
    "ask": 1000,
    "sponsoredItem": "Equipment package",
    "notes": "Warm-lead slot for local owner network."
  },
  {
    "company": "Local Timișoara real estate agency",
    "category": "Real estate",
    "package": "Supporter",
    "ask": 1000,
    "sponsoredItem": "Tournament travel",
    "notes": "Local sponsor slot; high relationship value."
  },
  {
    "company": "Local Timișoara law firm",
    "category": "Professional services",
    "package": "Supporter",
    "ask": 1000,
    "sponsoredItem": "Equipment package",
    "notes": "Professional services local supporter."
  },
  {
    "company": "Local Timișoara accounting firm",
    "category": "Professional services",
    "package": "Supporter",
    "ask": 1000,
    "sponsoredItem": "Equipment package",
    "notes": "Professional services local supporter."
  },
  {
    "company": "Romanian entrepreneur diaspora lead 1",
    "category": "Private supporter",
    "package": "Supporter",
    "ask": 1000,
    "sponsoredItem": "Equipment package",
    "notes": "Private supporter lead; needs warm introduction."
  },
  {
    "company": "Romanian entrepreneur diaspora lead 2",
    "category": "Private supporter",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Private supporter lead; use personal note and one-pager."
  },
  {
    "company": "Romanian business angel lead",
    "category": "Private supporter",
    "package": "Tournament Partner",
    "ask": 5000,
    "sponsoredItem": "Tournament travel",
    "notes": "Private supporter or small business owner route."
  },
  {
    "company": "Family business warm intro lead",
    "category": "Private supporter",
    "package": "Supporter",
    "ask": 1000,
    "sponsoredItem": "Equipment package",
    "notes": "Replace with actual warm contact."
  },
  {
    "company": "Former athlete / sports family lead",
    "category": "Private supporter",
    "package": "Supporter",
    "ask": 1000,
    "sponsoredItem": "Equipment package",
    "notes": "Warm introduction route; practical supporter ask."
  },
  {
    "company": "Local media partner Timișoara",
    "category": "Media / profile",
    "package": "In-kind Partner",
    "ask": 1500,
    "sponsoredItem": "Local prep block",
    "notes": "Media/profile support; content visibility, not cash-first."
  }
];

const SPONSOR_CONTACTS = {
  "Banca Transilvania": {
    "email": "sponsorizari@btrl.ro",
    "emailStatus": "Public sponsorship email",
    "contactRole": "Sponsorship / Community / CSR team",
    "contactUrl": "https://comunitate.bancatransilvania.ro/contact",
    "website": "https://www.bancatransilvania.ro",
    "nextAction": "Send sponsorship request to the BT Comunitate sponsorship mailbox with athlete one-pager and specific tournament ask."
  },
  "BCR": {
    "email": "comunitate@bcr.ro",
    "emailStatus": "Public CSR/community email",
    "contactRole": "CSR / Community team",
    "contactUrl": "https://www.bcr.ro/ro/csr/contact-csr",
    "website": "https://www.bcr.ro",
    "nextAction": "Send CSR/community sponsorship email with short athlete summary and requested support amount."
  },
  "BRD Groupe Societe Generale": {
    "email": "mybrdcontact@brd.ro",
    "emailStatus": "Public general contact email; sponsorship uses application page",
    "contactRole": "Sponsorship / CSR applications team",
    "contactUrl": "https://www.brd.ro/aplica-pentru-sponsorizare",
    "website": "https://www.brd.ro",
    "nextAction": "Use BRD sponsorship application page; email general contact only for routing questions."
  },
  "Raiffeisen Bank Romania": {
    "email": "raiffeisen.comunitati@raiffeisen.ro",
    "emailStatus": "Public sponsorship/community email",
    "contactRole": "Raiffeisen Comunități / Sponsorship team",
    "contactUrl": "https://sponsorship.raiffeisen.ro/",
    "website": "https://www.raiffeisen.ro",
    "nextAction": "Submit sponsorship request through Raiffeisen sponsorship page and use community mailbox for questions."
  },
  "ING Bank Romania": {
    "email": "contact@ing.ro",
    "emailStatus": "Public general contact email",
    "contactRole": "Community / sustainability / communications routing contact",
    "contactUrl": "https://ing.ro/ing-in-romania/contact",
    "website": "https://ing.ro",
    "nextAction": "Send concise routing request asking for the community/sponsorship contact for a Romanian junior athlete campaign."
  },
  "UniCredit Bank Romania": {
    "email": "infocenter@unicredit.ro",
    "emailStatus": "Public general contact email",
    "contactRole": "Sustainability / sponsorship / community routing contact",
    "contactUrl": "https://www.unicredit.ro/ro/institutional/Sustenabilitate/Sponsorizari-si-donatii.html",
    "website": "https://www.unicredit.ro",
    "nextAction": "Use sponsorship/donations page and ask infocenter to route to sponsorship/community team."
  },
  "CEC Bank": {
    "email": "",
    "emailStatus": "Official contact form; no public sponsorship mailbox stored",
    "contactRole": "Marketing / sponsorship / community relations routing contact",
    "contactUrl": "https://www.cec.ro/contact",
    "website": "https://www.cec.ro",
    "nextAction": "Use official contact form and request routing to sponsorship/community relations."
  },
  "Patria Bank": {
    "email": "",
    "emailStatus": "Official contact form; no public sponsorship mailbox stored",
    "contactRole": "Marketing / communications / community routing contact",
    "contactUrl": "https://www.patriabank.ro/contact",
    "website": "https://www.patriabank.ro",
    "nextAction": "Use contact form and ask for marketing/community sponsorship routing."
  },
  "Alpha Bank Romania": {
    "email": "info@alphabank.ro",
    "emailStatus": "Public/general contact pattern; verify before bulk send",
    "contactRole": "Marketing / communications / community routing contact",
    "contactUrl": "https://www.alphabank.ro",
    "website": "https://www.alphabank.ro",
    "nextAction": "Send short routing email to general contact or use branch/corporate contact page."
  },
  "Garanti BBVA Romania": {
    "email": "contact@garantibbva.ro",
    "emailStatus": "Public general contact email",
    "contactRole": "Marketing / communications / sponsorship routing contact",
    "contactUrl": "https://www.garantibbva.ro/despre-noi/contact/",
    "website": "https://www.garantibbva.ro",
    "nextAction": "Send routing request; note Romania operation sale context before larger pitch."
  },
  "Allianz-Tiriac": {
    "email": "info@allianztiriac.ro",
    "emailStatus": "Public general contact email",
    "contactRole": "Marketing / sponsorship / community routing contact",
    "contactUrl": "https://www.allianztiriac.ro/ro_RO/persoane-fizice/despre-noi/contact.html",
    "website": "https://www.allianztiriac.ro",
    "nextAction": "Ask to route athlete sponsorship request to marketing/community team."
  },
  "Groupama Romania": {
    "email": "office@groupama.ro",
    "emailStatus": "Public general office email",
    "contactRole": "Marketing / sponsorship / community routing contact",
    "contactUrl": "https://www.groupama.ro/contact",
    "website": "https://www.groupama.ro",
    "nextAction": "Send routing request to office email with one-page athlete profile attached."
  },
  "NN Romania": {
    "email": "",
    "emailStatus": "Official contact form / call center; no public sponsorship mailbox stored",
    "contactRole": "Marketing / sustainability / community routing contact",
    "contactUrl": "https://www.nn.ro/contact",
    "website": "https://www.nn.ro",
    "nextAction": "Use official contact form and ask for sponsorship/community contact."
  },
  "Metropolitan Life Romania": {
    "email": "client@metropolitanlife.ro",
    "emailStatus": "Public client/general email",
    "contactRole": "Marketing / community / sponsorship routing contact",
    "contactUrl": "https://www.metropolitanlife.ro/ai-nevoie-de-ajutor/contact/",
    "website": "https://www.metropolitanlife.ro",
    "nextAction": "Send routing request to general contact; ask for marketing/community team."
  },
  "OMV Petrom": {
    "email": "office@petrom.com",
    "emailStatus": "Public business contact email",
    "contactRole": "Corporate affairs / sponsorship / foundation routing contact",
    "contactUrl": "https://www.omvpetrom.com/ro/contact",
    "website": "https://www.omvpetrom.com",
    "nextAction": "Route through corporate contact; larger ask should go through corporate affairs/foundation pathway."
  },
  "Rompetrol": {
    "email": "office@rompetrol.com",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "CSR / community / marketing routing contact",
    "contactUrl": "https://www.rompetrol.com",
    "website": "https://www.rompetrol.com",
    "nextAction": "Ask for CSR/community sponsorship routing."
  },
  "MOL Romania": {
    "email": "office@molromania.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / CSR / community routing contact",
    "contactUrl": "https://molromania.ro",
    "website": "https://molromania.ro",
    "nextAction": "Ask for marketing/CSR routing for junior athlete support."
  },
  "E.ON Romania": {
    "email": "serviciiclienti@eon-romania.ro",
    "emailStatus": "Public customer/general email; not sponsorship-specific",
    "contactRole": "Sustainability / community / sponsorship routing contact",
    "contactUrl": "https://www.eon.ro/contact",
    "website": "https://www.eon.ro",
    "nextAction": "Use general channel only to request sponsorship/community routing."
  },
  "Enel Romania / PPC Romania": {
    "email": "contact@ppcenergy.ro",
    "emailStatus": "Public/general contact pattern; verify before bulk send",
    "contactRole": "Corporate affairs / sustainability / community routing contact",
    "contactUrl": "https://www.ppcenergy.ro/contact",
    "website": "https://www.ppcenergy.ro",
    "nextAction": "Verify current PPC/Enel contact and ask for community sponsorship routing."
  },
  "Aqua Carpatica": {
    "email": "office@aquacarpatica.com",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Brand marketing / partnerships team",
    "contactUrl": "https://aquacarpatica.com/contact/",
    "website": "https://aquacarpatica.com",
    "nextAction": "Pitch hydration partner or in-kind water support for training/tournament blocks."
  },
  "Borsec": {
    "email": "office@romaqua-group.ro",
    "emailStatus": "Public/general group contact; verify before bulk send",
    "contactRole": "Brand marketing / partnerships team",
    "contactUrl": "https://www.borsec.ro/contact",
    "website": "https://www.borsec.ro",
    "nextAction": "Pitch hydration partner support with athlete updates and local visibility."
  },
  "Dorna": {
    "email": "contact@coca-cola.com",
    "emailStatus": "Public/global contact route; verify Romanian brand contact",
    "contactRole": "Brand partnerships / community marketing routing contact",
    "contactUrl": "https://www.coca-cola.com/ro/ro/about-us/contact-us",
    "website": "https://www.dorna.ro",
    "nextAction": "Use Coca-Cola contact route and ask for Dorna/Romania community marketing contact."
  },
  "La Fantana": {
    "email": "contact@lafantana.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / partnerships / corporate sales routing contact",
    "contactUrl": "https://www.lafantana.ro/contact",
    "website": "https://www.lafantana.ro",
    "nextAction": "Pitch hydration/in-kind support for training base and tournament preparation."
  },
  "Carrefour Romania": {
    "email": "contact_b2b@carrefour.com",
    "emailStatus": "Public B2B contact email",
    "contactRole": "B2B / local marketing / CSR routing contact",
    "contactUrl": "https://carrefour.ro/corporate/b2b",
    "website": "https://carrefour.ro",
    "nextAction": "Use B2B route for local support request, then ask for CSR/local marketing contact."
  },
  "Kaufland Romania": {
    "email": "ro-marketing@kaufland.ro",
    "emailStatus": "Public marketing email",
    "contactRole": "Marketing / local activation team",
    "contactUrl": "https://despre.kaufland.ro/servicii/publicitate.html",
    "website": "https://www.kaufland.ro",
    "nextAction": "Send local marketing pitch with tournament-block ask and community angle."
  },
  "Lidl Romania": {
    "email": "csr@lidl.ro",
    "emailStatus": "Public sponsorship/CSR email",
    "contactRole": "CSR / sponsorship team",
    "contactUrl": "https://serviciul-clienti.lidl.ro/SelfServiceRO/s/article/Doresc-s%C4%83-fiu-sponsorizat-de-Lidl-Cui-pot-s%C4%83-m%C4%83-adresez-1575649328535",
    "website": "https://corporate.lidl.ro",
    "nextAction": "Send CSR sponsorship request with specific support amount and athlete summary."
  },
  "Mega Image": {
    "email": "contact@mega-image.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / CSR / community routing contact",
    "contactUrl": "https://www.mega-image.ro/contact",
    "website": "https://www.mega-image.ro",
    "nextAction": "Ask for CSR/local marketing contact for junior athlete campaign."
  },
  "Auchan Romania": {
    "email": "serviciulclientului@auchan.ro",
    "emailStatus": "Public/customer contact email; not sponsorship-specific",
    "contactRole": "Marketing / CSR / community routing contact",
    "contactUrl": "https://www.auchan.ro/contact",
    "website": "https://www.auchan.ro",
    "nextAction": "Ask general contact to route to marketing/CSR for local sport support."
  },
  "Selgros Romania": {
    "email": "contact@selgros.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Local store manager / marketing / community routing contact",
    "contactUrl": "https://www.selgros.ro/contact",
    "website": "https://www.selgros.ro",
    "nextAction": "Route to Timisoara store manager or marketing team for local tournament-block support."
  },
  "Profi Romania": {
    "email": "office@profi.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / community / local activation routing contact",
    "contactUrl": "https://www.profi.ro/contact/",
    "website": "https://www.profi.ro",
    "nextAction": "Send local support request with Timisoara/regional angle."
  },
  "eMAG": {
    "email": "",
    "emailStatus": "Official contact form / marketplace routes; no sponsorship mailbox stored",
    "contactRole": "Brand partnerships / CSR / corporate communications routing contact",
    "contactUrl": "https://www.emag.ro/contact-form",
    "website": "https://www.emag.ro",
    "nextAction": "Use corporate/contact form and ask for partnerships or CSR routing; do not bulk email generic support."
  },
  "Altex Romania": {
    "email": "contact@altex.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / sponsorship routing contact",
    "contactUrl": "https://altex.ro/contact/",
    "website": "https://altex.ro",
    "nextAction": "Ask for marketing/sponsorship contact and pitch equipment/content support."
  },
  "Flanco": {
    "email": "contact@flanco.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / sponsorship routing contact",
    "contactUrl": "https://www.flanco.ro/contact",
    "website": "https://www.flanco.ro",
    "nextAction": "Ask for marketing/sponsorship routing with youth performance/content angle."
  },
  "Dedeman": {
    "email": "suportclienti@dedeman.ro",
    "emailStatus": "Public/customer contact email; not sponsorship-specific",
    "contactRole": "Marketing / community / sponsorship routing contact",
    "contactUrl": "https://www.dedeman.ro/ro/contact",
    "website": "https://www.dedeman.ro",
    "nextAction": "Ask for community/sponsorship routing; use a concise formal pitch."
  },
  "Brico Depot Romania": {
    "email": "contact@bricodepot.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / local activation routing contact",
    "contactUrl": "https://www.bricodepot.ro/contact",
    "website": "https://www.bricodepot.ro",
    "nextAction": "Ask for local marketing/community routing for one tournament block."
  },
  "Mobexpert": {
    "email": "office@mobexpert.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / community routing contact",
    "contactUrl": "https://www.mobexpert.ro/contact",
    "website": "https://www.mobexpert.ro",
    "nextAction": "Ask for sponsorship/community routing with Romanian athlete story."
  },
  "Decathlon Romania": {
    "email": "contact.ro@decathlon.com",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Sports partnerships / local store manager / marketing team",
    "contactUrl": "https://www.decathlon.ro/contact",
    "website": "https://www.decathlon.ro",
    "nextAction": "Pitch equipment partner support and ask for sports partnerships/local store routing."
  },
  "Intersport Romania": {
    "email": "contact@intersport.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / sports partnerships routing contact",
    "contactUrl": "https://www.intersport.ro/contact",
    "website": "https://www.intersport.ro",
    "nextAction": "Pitch shoes/apparel/equipment support with sponsor updates."
  },
  "Hervis Sports Romania": {
    "email": "office@hervis.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / sports partnerships routing contact",
    "contactUrl": "https://www.hervis.ro/contact",
    "website": "https://www.hervis.ro",
    "nextAction": "Pitch equipment/apparel support and ask for Romanian marketing contact."
  },
  "Sportisimo Romania": {
    "email": "contact@sportisimo.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / sports partnerships routing contact",
    "contactUrl": "https://www.sportisimo.ro/contact/",
    "website": "https://www.sportisimo.ro",
    "nextAction": "Pitch sports retail support and ask for partnership routing."
  },
  "Wilson Romania distributor": {
    "email": "",
    "emailStatus": "Distributor route/contact form; no bulk email stored",
    "contactRole": "Romanian Wilson distributor / tennis category manager",
    "contactUrl": "https://www.wilson.com/en-us/contact",
    "website": "https://www.wilson.com",
    "nextAction": "Identify the Romanian distributor or local Wilson tennis retailer before sending."
  },
  "Babolat Romania distributor": {
    "email": "",
    "emailStatus": "Distributor route/contact form; no bulk email stored",
    "contactRole": "Romanian Babolat distributor / tennis category manager",
    "contactUrl": "https://www.babolat.com/contact-us.html",
    "website": "https://www.babolat.com",
    "nextAction": "Identify Romanian distributor or tennis shop buyer before sending."
  },
  "HEAD Romania distributor": {
    "email": "",
    "emailStatus": "Distributor route/contact form; no bulk email stored",
    "contactRole": "Romanian HEAD distributor / tennis category manager",
    "contactUrl": "https://www.head.com/en/contact",
    "website": "https://www.head.com",
    "nextAction": "Identify Romanian distributor or tennis shop buyer before sending."
  },
  "Yonex Romania distributor": {
    "email": "",
    "emailStatus": "Distributor route/contact form; no bulk email stored",
    "contactRole": "Romanian Yonex distributor / tennis category manager",
    "contactUrl": "https://www.yonex.com/contact-us",
    "website": "https://www.yonex.com",
    "nextAction": "Identify Romanian distributor or tennis shop buyer before sending."
  },
  "Nike Romania retail partner": {
    "email": "",
    "emailStatus": "Retail/partner contact route only; no sponsorship mailbox stored",
    "contactRole": "Local retail partner / marketing manager",
    "contactUrl": "https://www.nike.com/ro/help",
    "website": "https://www.nike.com/ro",
    "nextAction": "Approach local retail partner or existing Romanian distributor, not Nike global support."
  },
  "adidas Romania retail partner": {
    "email": "",
    "emailStatus": "Retail/partner contact route only; no sponsorship mailbox stored",
    "contactRole": "Local retail partner / marketing manager",
    "contactUrl": "https://www.adidas.ro/help/contact-us",
    "website": "https://www.adidas.ro",
    "nextAction": "Approach local retail partner or adidas Romania marketing route, not customer support."
  },
  "Puma Romania retail partner": {
    "email": "",
    "emailStatus": "Retail/partner contact route only; no sponsorship mailbox stored",
    "contactRole": "Local retail partner / marketing manager",
    "contactUrl": "https://eu.puma.com/ro/en/help/contact-us",
    "website": "https://eu.puma.com/ro",
    "nextAction": "Approach local retail partner or distributor route first."
  },
  "Continental Automotive Romania": {
    "email": "info@continental-corporation.com",
    "emailStatus": "Public corporate general email; verify Romanian routing",
    "contactRole": "Corporate communications / employer brand / community relations",
    "contactUrl": "https://www.continental.com/en/company/contact/",
    "website": "https://www.continental.com",
    "nextAction": "Ask for Timisoara employer-brand/community contact for local athlete support."
  },
  "Bosch Service Solutions Timișoara": {
    "email": "contact@ro.bosch.com",
    "emailStatus": "Public/general Romania contact; verify business-unit routing",
    "contactRole": "Timisoara site communications / employer brand / community relations",
    "contactUrl": "https://www.bosch.ro/contact/",
    "website": "https://www.bosch.ro",
    "nextAction": "Ask for Timisoara site communications or community sponsorship routing."
  },
  "HELLA Romania": {
    "email": "info@forvia.com",
    "emailStatus": "Public/global contact; verify Romania/Timisoara routing",
    "contactRole": "FORVIA HELLA Romania communications / employer brand",
    "contactUrl": "https://www.forvia.com/contact",
    "website": "https://www.hella.com",
    "nextAction": "Ask for Romania site/community routing before sponsor pitch."
  },
  "Flex Timișoara": {
    "email": "info@flex.com",
    "emailStatus": "Public/global contact; verify Timisoara routing",
    "contactRole": "Site HR / communications / community relations",
    "contactUrl": "https://flex.com/contact",
    "website": "https://flex.com",
    "nextAction": "Ask for Timisoara site communications/community contact."
  },
  "Nokia Timișoara": {
    "email": "press.services@nokia.com",
    "emailStatus": "Public corporate media email; verify local routing",
    "contactRole": "Romania communications / employer brand / community relations",
    "contactUrl": "https://www.nokia.com/contact-us/",
    "website": "https://www.nokia.com",
    "nextAction": "Ask for Romania communications/community routing."
  },
  "Atos Romania Timișoara": {
    "email": "contact.romania@atos.net",
    "emailStatus": "Public/general contact pattern; verify before bulk send",
    "contactRole": "Romania communications / employer brand / community relations",
    "contactUrl": "https://atos.net/en/romania",
    "website": "https://atos.net",
    "nextAction": "Ask for Timisoara site/community routing."
  },
  "Endava Romania": {
    "email": "info@endava.com",
    "emailStatus": "Public corporate general email",
    "contactRole": "Romania communications / employer brand / community relations",
    "contactUrl": "https://www.endava.com/en/contact/",
    "website": "https://www.endava.com",
    "nextAction": "Ask for Romania employer-brand/community routing."
  },
  "NTT DATA Romania": {
    "email": "office@nttdata.ro",
    "emailStatus": "Public/general office email; verify before bulk send",
    "contactRole": "Romania communications / employer brand / CSR",
    "contactUrl": "https://ro.nttdata.com/contact",
    "website": "https://ro.nttdata.com",
    "nextAction": "Ask for CSR/community or employer-brand contact."
  },
  "Accenture Romania": {
    "email": "romania.careers@accenture.com",
    "emailStatus": "Public careers route; not sponsorship-specific",
    "contactRole": "Romania employer brand / corporate citizenship routing contact",
    "contactUrl": "https://www.accenture.com/ro-en/about/company/romania",
    "website": "https://www.accenture.com/ro-en",
    "nextAction": "Use only as routing contact; ask for corporate citizenship/community lead."
  },
  "Bitdefender": {
    "email": "press@bitdefender.com",
    "emailStatus": "Public media contact; verify sponsorship routing",
    "contactRole": "Communications / brand partnerships routing contact",
    "contactUrl": "https://www.bitdefender.com/company/contact-us/",
    "website": "https://www.bitdefender.com",
    "nextAction": "Ask communications team for appropriate brand/community route."
  },
  "UiPath": {
    "email": "pr@uipath.com",
    "emailStatus": "Public media contact; verify community routing",
    "contactRole": "Communications / community / social impact routing contact",
    "contactUrl": "https://www.uipath.com/company/contact-us",
    "website": "https://www.uipath.com",
    "nextAction": "Ask PR/community team for Romanian athlete sponsorship routing."
  },
  "Zitec": {
    "email": "hello@zitec.com",
    "emailStatus": "Public/general contact email",
    "contactRole": "Marketing / employer brand / community contact",
    "contactUrl": "https://zitec.com/contact/",
    "website": "https://zitec.com",
    "nextAction": "Send concise local athlete support pitch with digital campaign angle."
  },
  "Digi Romania": {
    "email": "relatii.clienti@rcs-rds.ro",
    "emailStatus": "Public/general customer email; not sponsorship-specific",
    "contactRole": "Marketing / media partnerships routing contact",
    "contactUrl": "https://www.digi.ro/contact",
    "website": "https://www.digi.ro",
    "nextAction": "Ask for marketing/media partnership routing before sending deck."
  },
  "Orange Romania": {
    "email": "contact@orange.ro",
    "emailStatus": "Public/general contact email; not sponsorship-specific",
    "contactRole": "Sponsorship / Orange Foundation / brand partnerships routing contact",
    "contactUrl": "https://www.orange.ro/contact/",
    "website": "https://www.orange.ro",
    "nextAction": "Ask for sponsorship/foundation/community routing."
  },
  "Vodafone Romania": {
    "email": "relatii.clienti@vodafone.com",
    "emailStatus": "Public/general customer email; not sponsorship-specific",
    "contactRole": "Foundation / sponsorship / brand partnerships routing contact",
    "contactUrl": "https://www.vodafone.ro/contact",
    "website": "https://www.vodafone.ro",
    "nextAction": "Ask for foundation/sponsorship routing."
  },
  "Telekom Romania Mobile": {
    "email": "relatii.clienti@telekom.ro",
    "emailStatus": "Public/general customer email; not sponsorship-specific",
    "contactRole": "Marketing / partnerships routing contact",
    "contactUrl": "https://www.telekom.ro/contact/",
    "website": "https://www.telekom.ro",
    "nextAction": "Ask for marketing/partnerships routing."
  },
  "Fan Courier": {
    "email": "office@fancourier.ro",
    "emailStatus": "Public/general office email; verify before bulk send",
    "contactRole": "Marketing / partnerships / CSR routing contact",
    "contactUrl": "https://www.fancourier.ro/contact/",
    "website": "https://www.fancourier.ro",
    "nextAction": "Pitch logistics/travel support and ask for partnerships contact."
  },
  "Sameday": {
    "email": "contact@sameday.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / partnerships routing contact",
    "contactUrl": "https://sameday.ro/contact/",
    "website": "https://sameday.ro",
    "nextAction": "Ask for marketing/partnerships routing."
  },
  "Cargus": {
    "email": "contact@cargus.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / partnerships routing contact",
    "contactUrl": "https://www.cargus.ro/contact/",
    "website": "https://www.cargus.ro",
    "nextAction": "Ask for marketing/partnerships routing."
  },
  "DHL Romania": {
    "email": "contact@dhl.com",
    "emailStatus": "Public/global contact route; verify Romania routing",
    "contactRole": "Romania marketing / logistics partnerships routing contact",
    "contactUrl": "https://www.dhl.com/ro-en/home/contact-us.html",
    "website": "https://www.dhl.com/ro-en/home.html",
    "nextAction": "Use DHL Romania contact route; ask for local marketing/community support contact."
  },
  "TAROM": {
    "email": "customer@tarom.ro",
    "emailStatus": "Public/customer contact email; not sponsorship-specific",
    "contactRole": "Marketing / partnerships routing contact",
    "contactUrl": "https://www.tarom.ro/contact",
    "website": "https://www.tarom.ro",
    "nextAction": "Ask for marketing/partnerships contact for junior athlete travel support."
  },
  "Wizz Air Romania route team": {
    "email": "",
    "emailStatus": "Official help/contact form; no public sponsorship mailbox stored",
    "contactRole": "Marketing / route partnerships / community routing contact",
    "contactUrl": "https://wizzair.com/en-gb/information-and-services/contact/contact-us",
    "website": "https://wizzair.com",
    "nextAction": "Use official contact route or LinkedIn/warm intro for route/marketing team."
  },
  "Iulius Town Timișoara": {
    "email": "office@iuliusmall.com",
    "emailStatus": "Public/general office email; verify Timisoara routing",
    "contactRole": "Marketing / events / local partnerships manager",
    "contactUrl": "https://iuliustown.ro/contact/",
    "website": "https://iuliustown.ro",
    "nextAction": "Pitch local visibility/event partnership tied to Timisoara athlete story."
  },
  "Shopping City Timișoara": {
    "email": "contact@shoppingcitytimisoara.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / events / local partnerships manager",
    "contactUrl": "https://shoppingcitytimisoara.ro/contact",
    "website": "https://shoppingcitytimisoara.ro",
    "nextAction": "Pitch local activation or one-tournament sponsor support."
  },
  "Hotel Timișoara": {
    "email": "office@hoteltimisoara.ro",
    "emailStatus": "Public/general hotel email",
    "contactRole": "General manager / sales manager / marketing manager",
    "contactUrl": "https://www.hoteltimisoara.ro/contact/",
    "website": "https://www.hoteltimisoara.ro",
    "nextAction": "Ask for lodging/meeting-space or local sponsor support."
  },
  "NH Timișoara": {
    "email": "nh.collection.timisoara@nh-hotels.com",
    "emailStatus": "Likely hotel property email; verify before bulk send",
    "contactRole": "General manager / sales manager",
    "contactUrl": "https://www.nh-hotels.com/hotel/nh-timisoara",
    "website": "https://www.nh-hotels.com",
    "nextAction": "Verify property contact and pitch in-kind lodging or meeting space."
  },
  "Mercure Timișoara": {
    "email": "hb9n5@accor.com",
    "emailStatus": "Accor property email pattern; verify before bulk send",
    "contactRole": "General manager / sales manager",
    "contactUrl": "https://all.accor.com/hotel/B9N5/index.en.shtml",
    "website": "https://all.accor.com",
    "nextAction": "Verify property contact and pitch in-kind lodging/local support."
  },
  "Tresor Le Palais Timișoara": {
    "email": "reservation@tresorlepalais.ro",
    "emailStatus": "Public/property contact email; verify before bulk send",
    "contactRole": "Owner / general manager / sales manager",
    "contactUrl": "https://www.tresorlepalais.ro/contact/",
    "website": "https://www.tresorlepalais.ro",
    "nextAction": "Pitch premium local hospitality partner support."
  },
  "Pensiunea / hotel partner near Timișoara": {
    "email": "",
    "emailStatus": "Replace with actual hotel email before mailer",
    "contactRole": "Owner / general manager",
    "contactUrl": "",
    "website": "",
    "nextAction": "Replace this placeholder with a specific hotel/pension and public email."
  },
  "World Class Romania": {
    "email": "office@worldclass.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Corporate sales / partnerships / club manager",
    "contactUrl": "https://www.worldclass.ro/contact/",
    "website": "https://www.worldclass.ro",
    "nextAction": "Pitch training support or athlete gym access."
  },
  "Smartfit Timișoara": {
    "email": "contact@smartfit.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Owner / club manager / partnerships contact",
    "contactUrl": "https://smartfit.ro/contact/",
    "website": "https://smartfit.ro",
    "nextAction": "Pitch local training support or athlete membership."
  },
  "Gym One Timișoara": {
    "email": "office@gymone.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Owner / club manager / partnerships contact",
    "contactUrl": "https://gymone.ro/contact/",
    "website": "https://gymone.ro",
    "nextAction": "Pitch training support or athlete membership."
  },
  "Kinetic Sport & Medicine Timișoara prospect": {
    "email": "",
    "emailStatus": "Replace with specific clinic/provider before mailer",
    "contactRole": "Clinic owner / sports physio lead / medical director",
    "contactUrl": "",
    "website": "",
    "nextAction": "Replace placeholder with actual sports medicine provider and contact."
  },
  "Regina Maria Timișoara": {
    "email": "abonamente@reginamaria.ro",
    "emailStatus": "Public corporate/subscription contact; verify sponsorship routing",
    "contactRole": "Corporate sales / clinic manager / partnerships routing contact",
    "contactUrl": "https://www.reginamaria.ro/contact",
    "website": "https://www.reginamaria.ro",
    "nextAction": "Pitch medical/recovery support; ask for Timisoara clinic/corporate partnerships route."
  },
  "MedLife Timișoara": {
    "email": "office@medlife.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Clinic manager / corporate sales / marketing routing contact",
    "contactUrl": "https://www.medlife.ro/contact",
    "website": "https://www.medlife.ro",
    "nextAction": "Pitch medical/recovery support and ask for Timisoara clinic or corporate sales contact."
  },
  "Dental clinic Timișoara prospect": {
    "email": "",
    "emailStatus": "Replace with actual clinic email before mailer",
    "contactRole": "Clinic owner / practice manager",
    "contactUrl": "",
    "website": "",
    "nextAction": "Replace placeholder with a specific clinic and public email."
  },
  "Orthopedic / sports medicine clinic prospect": {
    "email": "",
    "emailStatus": "Replace with actual clinic email before mailer",
    "contactRole": "Clinic owner / orthopedic lead / sports medicine director",
    "contactUrl": "",
    "website": "",
    "nextAction": "Replace placeholder with a specific orthopedic/sports medicine clinic."
  },
  "Automobile Bavaria Timișoara": {
    "email": "contact@automobilebavaria.ro",
    "emailStatus": "Public/general contact email; verify Timisoara dealership routing",
    "contactRole": "Dealer principal / marketing manager / sales manager",
    "contactUrl": "https://www.automobilebavaria.ro/contact/",
    "website": "https://www.automobilebavaria.ro",
    "nextAction": "Ask for Timisoara dealership marketing manager; pitch local premium sponsor support."
  },
  "Porsche Timișoara": {
    "email": "office@porscheinterauto.ro",
    "emailStatus": "Public/general group contact; verify Timisoara dealership routing",
    "contactRole": "Dealer principal / marketing manager / sales manager",
    "contactUrl": "https://www.porscheinterauto.ro/",
    "website": "https://www.porscheinterauto.ro",
    "nextAction": "Verify Timisoara dealership contact and pitch premium local sponsor support."
  },
  "Toyota Timișoara dealer": {
    "email": "",
    "emailStatus": "Replace with specific Toyota dealer email before mailer",
    "contactRole": "Dealer principal / marketing manager / sales manager",
    "contactUrl": "",
    "website": "",
    "nextAction": "Replace with exact Toyota Timisoara dealer and public email."
  },
  "Mercedes-Benz Timișoara dealer": {
    "email": "",
    "emailStatus": "Replace with specific Mercedes dealer email before mailer",
    "contactRole": "Dealer principal / marketing manager / sales manager",
    "contactUrl": "",
    "website": "",
    "nextAction": "Replace with exact Mercedes-Benz Timisoara dealer and public email."
  },
  "Ford Timișoara dealer": {
    "email": "",
    "emailStatus": "Replace with specific Ford dealer email before mailer",
    "contactRole": "Dealer principal / marketing manager / sales manager",
    "contactUrl": "",
    "website": "",
    "nextAction": "Replace with exact Ford Timisoara dealer and public email."
  },
  "Tazz": {
    "email": "contact@tazz.ro",
    "emailStatus": "Public/general contact email; verify partnerships routing",
    "contactRole": "Marketing / local partnerships routing contact",
    "contactUrl": "https://tazz.ro/contact",
    "website": "https://tazz.ro",
    "nextAction": "Pitch Timisoara-origin consumer tech support with content angle."
  },
  "Glovo Romania": {
    "email": "glovers@glovoapp.com",
    "emailStatus": "Public/general route; not sponsorship-specific",
    "contactRole": "Romania marketing / partnerships routing contact",
    "contactUrl": "https://glovoapp.com/ro/en/contact/",
    "website": "https://glovoapp.com",
    "nextAction": "Use contact route or LinkedIn/warm intro for Romania marketing partnerships."
  },
  "Freshful by eMAG": {
    "email": "contact@freshful.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / partnerships routing contact",
    "contactUrl": "https://www.freshful.ro/contact",
    "website": "https://www.freshful.ro",
    "nextAction": "Pitch nutrition/recovery support and ask for marketing partnerships route."
  },
  "5 to go": {
    "email": "office@5togo.ro",
    "emailStatus": "Public/general contact email; verify before bulk send",
    "contactRole": "Marketing / franchise partnerships contact",
    "contactUrl": "https://5togo.ro/contact/",
    "website": "https://5togo.ro",
    "nextAction": "Pitch small supporter package or local Timisoara activation."
  },
  "Starbucks Romania operator": {
    "email": "contact@amrest.eu",
    "emailStatus": "Operator/general contact route; verify Romania brand routing",
    "contactRole": "AmRest Romania marketing / brand manager",
    "contactUrl": "https://www.amrest.eu/en/contact",
    "website": "https://www.starbucksromania.ro",
    "nextAction": "Verify current Romanian operator contact and ask for local marketing/CSR routing."
  },
  "Local Timișoara restaurant group": {
    "email": "",
    "emailStatus": "Replace with actual restaurant email before mailer",
    "contactRole": "Owner / general manager",
    "contactUrl": "",
    "website": "",
    "nextAction": "Replace placeholder with specific restaurant group or warm owner contact."
  },
  "Local Timișoara real estate agency": {
    "email": "",
    "emailStatus": "Replace with actual agency email before mailer",
    "contactRole": "Owner / managing broker / marketing manager",
    "contactUrl": "",
    "website": "",
    "nextAction": "Replace placeholder with specific agency and warm/local contact."
  },
  "Local Timișoara law firm": {
    "email": "",
    "emailStatus": "Replace with actual law firm email before mailer",
    "contactRole": "Managing partner / office manager",
    "contactUrl": "",
    "website": "",
    "nextAction": "Replace placeholder with specific law firm and contact."
  },
  "Local Timișoara accounting firm": {
    "email": "",
    "emailStatus": "Replace with actual accounting firm email before mailer",
    "contactRole": "Managing partner / owner",
    "contactUrl": "",
    "website": "",
    "nextAction": "Replace placeholder with specific accounting firm and contact."
  },
  "Romanian entrepreneur diaspora lead 1": {
    "email": "",
    "emailStatus": "Warm intro only; do not bulk email",
    "contactRole": "Named individual via warm introduction",
    "contactUrl": "",
    "website": "",
    "nextAction": "Enter named person and email only after warm introduction permission."
  },
  "Romanian entrepreneur diaspora lead 2": {
    "email": "",
    "emailStatus": "Warm intro only; do not bulk email",
    "contactRole": "Named individual via warm introduction",
    "contactUrl": "",
    "website": "",
    "nextAction": "Enter named person and email only after warm introduction permission."
  },
  "Romanian business angel lead": {
    "email": "",
    "emailStatus": "Warm intro only; do not bulk email",
    "contactRole": "Named investor / business angel via warm introduction",
    "contactUrl": "",
    "website": "",
    "nextAction": "Enter named person and email only after warm introduction permission."
  },
  "Family business warm intro lead": {
    "email": "",
    "emailStatus": "Warm intro only; do not bulk email",
    "contactRole": "Named family business owner via warm introduction",
    "contactUrl": "",
    "website": "",
    "nextAction": "Replace with specific warm contact."
  },
  "Former athlete / sports family lead": {
    "email": "",
    "emailStatus": "Warm intro only; do not bulk email",
    "contactRole": "Named former athlete / sports family contact",
    "contactUrl": "",
    "website": "",
    "nextAction": "Replace with specific warm contact."
  },
  "Local media partner Timișoara": {
    "email": "redactie@radiotimisoara.ro",
    "emailStatus": "Public editorial contact; media partner not sponsor mailbox",
    "contactRole": "Sports editor / commercial partnerships contact",
    "contactUrl": "https://www.radiotimisoara.ro/contact",
    "website": "https://www.radiotimisoara.ro",
    "nextAction": "Use for media/profile support, not cash sponsor bulk mail."
  }
};

function contactRoleFor(category=''){
  const c = String(category).toLowerCase();
  if(c.includes('bank') || c.includes('financial')) return 'CSR / Sponsorship / Community Marketing decision-maker';
  if(c.includes('medical') || c.includes('recovery') || c.includes('health')) return 'Clinic owner, medical director, or marketing manager';
  if(c.includes('hotel') || c.includes('travel') || c.includes('hospitality')) return 'Owner, general manager, or partnerships manager';
  if(c.includes('equipment') || c.includes('sports') || c.includes('fitness')) return 'Owner, brand manager, or sports marketing contact';
  if(c.includes('media')) return 'Editor, producer, or commercial partnerships contact';
  if(c.includes('private')) return 'Warm-intro decision maker';
  return 'Marketing / Partnerships / Sponsorship decision-maker';
}

function seedSponsorRows(eventIdByName={}) {
  const preferredEvents = [eventIdByName['J60 Podgorica 2026'], eventIdByName['J60 Ulcinj 2026'], eventIdByName['J200 Târgu Jiu 2026'], eventIdByName['J60 Dunakeszi']].filter(Boolean);
  return SPONSOR_LEAD_ROWS.map((s, i) => {
    const enriched = SPONSOR_CONTACTS[s.company] || {};
    const m = {...s, ...enriched};
    const sponsoredEventId = m.sponsoredItem === 'Season partner' ? '' : (preferredEvents[i % preferredEvents.length] || '');
    const guide = SPONSORED_ITEMS[m.sponsoredItem] || SPONSORED_ITEMS['Tournament travel'];
    const role = m.contactRole || contactRoleFor(m.category || '');
    const mailerReady = !!(m.email && String(m.email).includes('@') && !String(m.emailStatus||'').toLowerCase().includes('not sponsorship') && !String(m.emailStatus||'').toLowerCase().includes('verify before bulk') && !String(m.emailStatus||'').toLowerCase().includes('warm intro'));
    return {
      id:id(), company:m.company,
      contact:m.contact || '',
      contactRole:role,
      email:m.email || '',
      emailStatus:m.emailStatus || (m.email ? 'Public contact email' : 'Contact URL / warm intro only'),
      phone:m.phone || '',
      website:m.website || '',
      contactUrl:m.contactUrl || '',
      category:m.category || '', package:m.package || 'Supporter', ask:m.ask || 1500,
      stage:i < 12 ? 'Prospect' : 'Research', contract:'Not started', agreementStart:'', agreementEnd:'',
      paymentStatus:'Not invoiced', paidAmount:0, scheduledPayment:'', sponsoredItem:m.sponsoredItem || 'Tournament travel',
      sponsoredEventId, deliverables:guide.deliverables, nextAction:m.nextAction || (m.email ? 'Send tailored sponsor email after confirming this is the right business address.' : 'Use contact URL or warm introduction; do not bulk email this row yet.'),
      renewal:'', lastContact:'', owner:'', mailerTag:(m.sponsoredItem || 'Tournament travel').replace(/[^a-z0-9]+/gi,'-').toLowerCase(),
      readyForMailer: mailerReady ? 'yes' : 'no',
      notes:(m.notes || '') + ' Verify legal entity, sponsor fit, and consent rules before outreach.'
    };
  });
}

const SURFACE_CSS = s => 'surface-' + (s||'').toLowerCase().replace(/[^a-z]/g,'') || 'clay';
const STATUS_CSS = s => 'pill-status ' + (s||'').toLowerCase().replace(/[^a-z]/g,'');

const KEY = 'andreea-os-v12';
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
  const tournaments = VERIFIED_TOURNAMENT_ROWS.map(t => ({...t, id:id()}));
  const eventIdByName = Object.fromEntries(tournaments.map(t => [t.name, t.id]));
  const selectedTournamentId = eventIdByName['J60 Ulcinj 2026'] || tournaments[0]?.id || '';
  return {
    athlete:{
      firstName:'Andreea', lastName:'Olariu', sport:'Tennis',
      city:'Timișoara', country:'Romania', dob:'2010-03-03', age:'16',
      club:'Sport 4 Fun Timișoara', coach:'Petru Mergheș / Mihai Gavra / Narcis Varan listed in public coverage; current coach TBD', school:'TBD',
      rankingSystem:'ITF Junior', ranking:'503', careerHigh:'464', seasonHigh:'491', rankingGoal:'300',
      handed:'Unknown', height:'',
      summary:'Romanian junior tennis player from Timișoara. Verified public record includes Romanian national junior titles, Tennis Europe titles, Romania junior team participation, ITF junior results, early W15 transition appearances, and German club-league activity through nuLiga.',
      strengths:'Verified national-title record in Romania, international junior experience across Tennis Europe and ITF Juniors, strong doubles résumé, Romania team exposure, and a clear sponsor story built around specific tournament blocks, training blocks, equipment, recovery, and transparent updates.',
      needs:'Confirm current coach, training base, height, handedness, German lineups, and 2026 event schedule before external sponsor distribution. Track the full pathway: Romanian/FRT, Tennis Europe, ITF Juniors, women\'s ITF, German club league, rankings, budget, sponsors, and documents.',
      cutout:'assets/andreea-cutout.png'
    },
    career:VERIFIED_CAREER_ROWS.map(c => ({...c, id:id()})),
    tournaments,
    rankings:VERIFIED_RANKING_ROWS.map(r => ({...r, id:id()})),
    budget:[
      {id:id(),eventId:eventIdByName['J60 Dunakeszi']||'',category:'Tournament travel',description:'Travel, local transport, meals, and event logistics for J60 Dunakeszi',amount:900,status:'Needed'},
      {id:id(),eventId:eventIdByName['J60 Ulcinj 2026']||'',category:'Tournament travel',description:'Travel, lodging, meals, coaching support, and recovery for J60 Ulcinj 2026',amount:1500,status:'Needed'},
      {id:id(),eventId:eventIdByName['J60 Podgorica 2026']||'',category:'Tournament travel',description:'Travel, lodging, meals, coaching support, and recovery for J60 Podgorica 2026',amount:1500,status:'Needed'},
      {id:id(),eventId:eventIdByName['J200 Târgu Jiu 2026']||'',category:'Tournament travel',description:'Domestic travel, lodging, local transport, and entry logistics for J200 Târgu Jiu 2026',amount:900,status:'Needed'},
      {id:id(),eventId:'',category:'Coaching and training',description:'Monthly coaching, match review, and training block support',amount:1800,status:'Planned'},
      {id:id(),eventId:'',category:'Equipment and stringing',description:'Shoes, strings, grips, racquet maintenance, and match supplies',amount:850,status:'Needed'},
      {id:id(),eventId:'',category:'Recovery / physio',description:'Physio, recovery, prevention, nutrition support, and tournament readiness',amount:1200,status:'Needed'},
      {id:id(),eventId:'',category:'Video and reporting',description:'Match footage, sponsor updates, photos, and proof folder maintenance',amount:600,status:'Planned'}
    ],
    sponsors:seedSponsorRows(eventIdByName),
    settings:{senderName:'Eric',senderEmail:'',phone:'',defaultAsk:1500,annualBudget:45500},
    calendar:todayParts(),
    selected:{tournamentId:selectedTournamentId,sponsorId:'',doc:'sponsorOnePager',rankingSystem:'ITF Junior'}
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
  s.tournaments = (s.tournaments||f.tournaments).map(t=>({...t, id:t.id||id(), points:t.points||0, outcome:t.outcome||'', matchRecord:t.matchRecord||'', sourceUrl:t.sourceUrl||''}));
  s.rankings = (s.rankings||f.rankings).map(r=>({...r, id:r.id||id()}));
  s.sponsors = (s.sponsors||f.sponsors).map(x=>({
    ...x, id:x.id||id(),
    contract:x.contract||'Not started',
    paymentStatus:x.paymentStatus||'Not invoiced',
    paidAmount:x.paidAmount||0,
    sponsoredItem:x.sponsoredItem||'Tournament travel',
    sponsoredEventId:x.sponsoredEventId||'',
    deliverables:x.deliverables||SPONSORED_ITEMS['Tournament travel'].deliverables,
    category:x.category||'',
    contactRole:x.contactRole||contactRoleFor(x.category||''),
    emailStatus:x.emailStatus||(x.email?'Verified public email':'Research needed'),
    website:x.website||'',
    contactUrl:x.contactUrl||'',
    phone:x.phone||'',
    lastContact:x.lastContact||'',
    owner:x.owner||'',
    mailerTag:x.mailerTag||'',
    agreementStart:x.agreementStart||'',
    agreementEnd:x.agreementEnd||'',
    scheduledPayment:x.scheduledPayment||'',
    renewal:x.renewal||'',
    notes:x.notes||''
  }));
  s.settings = {...f.settings, ...(s.settings||{})};
  s.calendar = s.calendar || f.calendar;
  s.selected = {...f.selected, ...(s.selected||{})};
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

    rankingSummaryCards() +
    rankingChartCard(state.selected.rankingSystem || state.athlete.rankingSystem, false, true) +
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

function numericRankingRows(system){
  return state.rankings
    .filter(x=>x.system===system && /^\d{4}-\d{2}-\d{2}$/.test(x.date||''))
    .map(x=>({...x, n:Number(String(x.value).replace(/[^0-9.]/g,''))}))
    .filter(x=>Number.isFinite(x.n) && x.n>0)
    .sort((a,b)=>a.date.localeCompare(b.date));
}
function latestRankingBySystem(){
  const systems = [...new Set(state.rankings.map(r=>r.system).filter(Boolean))];
  return systems.map(system=>{
    const rows = [...state.rankings.filter(r=>r.system===system)].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
    return {system, row:rows[0] || {}};
  });
}

function dashboardRankingControls(chartSystem){
  const a = state.athlete;
  const chartRows = state.rankings
    .map((r,i)=>({...r,_i:i}))
    .filter(r=>r.system===chartSystem)
    .sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')));
  return `<div class="form-grid" style="margin-top:14px">
    <div class="field"><label>Chart system</label><select data-selected="rankingSystem">${opt(RANKING_SYSTEMS, chartSystem)}</select></div>
    ${field('Headline ranking system','athlete','rankingSystem',a.rankingSystem,'select',RANKING_SYSTEMS)}
    ${field('Headline ranking','athlete','ranking',a.ranking)}
    ${field('Reference high','athlete','careerHigh',a.careerHigh)}
    ${field('Season high','athlete','seasonHigh',a.seasonHigh)}
    ${field('Goal rank','athlete','rankingGoal',a.rankingGoal)}
  </div>
  <div class="table-wrap" style="margin-top:14px">
    <table>
      <thead><tr><th>Date</th><th>System</th><th>Category</th><th>Value</th><th>Note / source</th><th></th></tr></thead>
      <tbody>${chartRows.map(r=>`<tr>
        <td><input value="${esc(r.date||'')}" data-scope="rankings" data-idx="${r._i}" data-key="date"></td>
        <td><select data-scope="rankings" data-idx="${r._i}" data-key="system">${opt(RANKING_SYSTEMS, r.system)}</select></td>
        <td><input value="${esc(r.category||'')}" data-scope="rankings" data-idx="${r._i}" data-key="category"></td>
        <td><input value="${esc(r.value||'')}" data-scope="rankings" data-idx="${r._i}" data-key="value"></td>
        <td><input value="${esc(r.goal||'')}" data-scope="rankings" data-idx="${r._i}" data-key="goal"></td>
        <td><button class="btn danger tiny" data-delete="rankings:${r._i}">×</button></td>
      </tr>`).join('')}</tbody>
    </table>
  </div>
  <div class="actions" style="margin-top:10px"><button class="btn" id="addChartRanking">+ Ranking row</button><button class="btn ghost" data-go="rankings">Open full rankings</button></div>`;
}
function rankingSummaryCards(){
  const rows = latestRankingBySystem();
  if(!rows.length) return '';
  return `<div class="cards" style="margin-top:18px">${rows.map(({system,row})=>`<div class="card">
    <div class="card-accent"></div>
    <div class="label">${esc(system)}</div>
    <h3>${esc(row.value || 'TBD')}</h3>
    <p>${esc(row.category || '')} · ${esc(row.date || 'No date')}<br>${esc(row.goal || '')}</p>
  </div>`).join('')}</div>`;
}
function rankingChartCard(system, editable=false, compactSelector=false){
  const chartSystem = system || state.selected.rankingSystem || state.athlete.rankingSystem || 'ITF Junior';
  const sorted = numericRankingRows(chartSystem);
  const editor = editable ? rankingChartEditor(chartSystem) : '';
  const dashboardControls = compactSelector ? dashboardRankingControls(chartSystem) : '';
  const head = `<div class="chart-head"><div><h3>Ranking trajectory</h3></div><div class="legend"><span>${esc(chartSystem)}</span></div></div>`;
  if(sorted.length<1) return `<div class="chart-card">${head}${dashboardControls}${editor}<div class="empty-state">No numeric chart data for ${esc(chartSystem)} yet.</div></div>`;

  const W=900,H=300,pad={l:48,r:24,t:20,b:36};
  const xs = sorted.map(s=>new Date(s.date+'T00:00:00').getTime());
  const ys = sorted.map(s=>Number(s.n));
  const minX=Math.min(...xs), maxX=Math.max(...xs);
  const showItfReference = chartSystem === 'ITF Junior';
  const parsedGoal = showItfReference ? String(state.athlete.rankingGoal || '300').match(/\d+(\.\d+)?/) : null;
  const goal = parsedGoal ? Number(parsedGoal[0]) : NaN;
  const careerHigh = showItfReference ? Number(String(state.athlete.careerHigh||'').replace(/[^0-9.]/g,'')) : NaN;
  const refVals = [Number.isFinite(goal)?goal:NaN, Number.isFinite(careerHigh)?careerHigh:NaN].filter(Number.isFinite);
  const rawMin=Math.min(...ys, ...refVals);
  const rawMax=Math.max(...ys, ...refVals);
  const spread = rawMax-rawMin || Math.max(1, Math.abs(rawMin)*0.1);
  const yMin = Math.max(0, rawMin - spread*0.12);
  const yMax = rawMax + spread*0.12;
  const xScale = x => pad.l + (x-minX)/(maxX-minX||1) * (W-pad.l-pad.r);
  const yScale = y => pad.t + (y-yMin)/(yMax-yMin||1) * (H-pad.t-pad.b);
  const points = sorted.map(s=>({
    x:xScale(new Date(s.date+'T00:00:00').getTime()),
    y:yScale(Number(s.n)),
    val:s.value,
    date:s.date,
    category:s.category || '',
    note:s.goal || ''
  }));
  const linePath = 'M ' + points.map(p=>`${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ');
  const areaPath = linePath + ` L ${points[points.length-1].x.toFixed(1)} ${H-pad.b} L ${points[0].x.toFixed(1)} ${H-pad.b} Z`;
  const goalY = Number.isFinite(goal) ? yScale(goal) : NaN;
  const chY = Number.isFinite(careerHigh) ? yScale(careerHigh) : NaN;
  const gridYs = [yMin, (yMin+yMax)/2, yMax];
  const labels = sorted.filter((_,i)=>i%Math.ceil(sorted.length/6)===0 || i===sorted.length-1);
  const tooltip = p => `${chartSystem} · ${p.category}\n${dateLong(p.date)}\nValue: ${p.val}${p.note ? '\n' + p.note : ''}`;
  return `<div class="chart-card">
    ${head}
    ${dashboardControls}
    ${editor}
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="trajGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#d65a3a" stop-opacity=".5"/><stop offset="100%" stop-color="#d65a3a" stop-opacity="0"/></linearGradient>
      </defs>
      <g class="chart-area-grid">
        ${gridYs.map(y=>{const py=yScale(y);return `<line x1="${pad.l}" x2="${W-pad.r}" y1="${py}" y2="${py}"/>`;}).join('')}
      </g>
      ${Number.isFinite(careerHigh)&&chY>pad.t&&chY<H-pad.b?`<line x1="${pad.l}" x2="${W-pad.r}" y1="${chY}" y2="${chY}" class="chart-line career"/>`:''}
      ${Number.isFinite(goal)&&goalY>pad.t&&goalY<H-pad.b?`<line x1="${pad.l}" x2="${W-pad.r}" y1="${goalY}" y2="${goalY}" class="chart-line goal"/>`:''}
      <path d="${areaPath}" class="chart-area"/>
      <path d="${linePath}" class="chart-line"/>
      ${points.map((p,i)=>`<g class="chart-point"><circle cx="${p.x}" cy="${p.y}" r="${i===points.length-1?6:4}" class="chart-dot"/><circle cx="${p.x}" cy="${p.y}" r="14" fill="transparent"><title>${esc(tooltip(p))}</title></circle></g>`).join('')}
      ${gridYs.map(y=>`<text class="chart-axis" x="${pad.l-8}" y="${yScale(y)+4}" text-anchor="end">${Number.isInteger(y)?y:y.toFixed(1)}</text>`).join('')}
      ${labels.map(s=>`<text class="chart-axis" x="${xScale(new Date(s.date+'T00:00:00').getTime())}" y="${H-12}" text-anchor="middle">${s.date.slice(2,7)}</text>`).join('')}
    </svg>
  </div>`;
}

function rankingChartEditor(chartSystem){
  const a = state.athlete;
  const chartRows = state.rankings
    .map((r,i)=>({...r,_i:i}))
    .filter(r=>r.system===chartSystem)
    .sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')));
  return `<div class="form-grid" style="margin-top:16px">
    <div class="field"><label>Chart</label><select data-selected="rankingSystem">${opt(RANKING_SYSTEMS, chartSystem)}</select></div>
    ${field('Headline ranking system','athlete','rankingSystem',a.rankingSystem,'select',RANKING_SYSTEMS)}
    ${field('Headline ranking','athlete','ranking',a.ranking)}
    ${field('ITF reference high','athlete','careerHigh',a.careerHigh)}
    ${field('ITF season high','athlete','seasonHigh',a.seasonHigh)}
    ${field('ITF goal rank','athlete','rankingGoal',a.rankingGoal)}
  </div>
  <div class="table-wrap" style="margin-top:14px"><table>
    <thead><tr><th>System</th><th>Category</th><th>Value</th><th>Date</th><th>Source / note</th><th></th></tr></thead>
    <tbody>${chartRows.map(r=>`<tr>
      <td>${selectCell('rankings',r._i,'system',r.system,RANKING_SYSTEMS)}</td>
      <td>${selectCell('rankings',r._i,'category',r.category,CATEGORIES)}</td>
      <td>${cell('rankings',r._i,'value',r.value)}</td>
      <td>${cell('rankings',r._i,'date',r.date,'date')}</td>
      <td>${cell('rankings',r._i,'goal',r.goal)}</td>
      <td><button class="btn tiny danger" data-delete="rankings:${r._i}">×</button></td>
    </tr>`).join('')}</tbody>
  </table></div>
  <div class="actions" style="margin-top:12px"><button class="btn tiny" id="addChartRanking">+ ranking row</button></div>`;
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


function levelCode(t){
  const level = String(t.level || '');
  const track = String(t.track || '');
  if(level.includes('J500')) return 'J500';
  if(level.includes('J300')) return 'J300';
  if(level.includes('J200')) return 'J200';
  if(level.includes('J100')) return 'J100';
  if(level.includes('J60')) return 'J60';
  if(level.includes('J30')) return 'J30';
  if(level.includes('Tennis Europe U16')) return 'TE16';
  if(level.includes('Tennis Europe U14')) return 'TE14';
  if(level.includes('Tennis Europe U12')) return 'TE12';
  if(level.includes('FRT U18')) return 'FRT18';
  if(level.includes('FRT U16')) return 'FRT16';
  if(level.includes('FRT U14')) return 'FRT14';
  if(level.includes('FRT U12')) return 'FRT12';
  if(level.includes('German Ostliga')) return 'Ost';
  if(level.includes('German LK')) return 'LK';
  if(level.includes('German Club')) return 'Club';
  if(level.includes('W15')) return 'W15';
  if(level.includes('W35')) return 'W35';
  if(track.includes('Training')) return 'Train';
  if(track.includes('Sponsor')) return 'Admin';
  return (level || track || 'Evt').replace(/[^A-Za-z0-9]/g,'').slice(0,5) || 'Evt';
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
              <div class="top">${esc(levelCode(t))}</div>
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
  const sorted = [...state.tournaments].sort((a,b)=>(a.start||'9999').localeCompare(b.start||'9999'));
  const cur = currentTournament();
  const curIdx = state.tournaments.findIndex(t=>t.id===cur.id);
  const tf = (label,key,type='text') => curIdx<0 ? '' : `<div class="field"><label>${label}</label><input type="${type}" data-scope="tournaments" data-idx="${curIdx}" data-key="${key}" value="${esc(cur[key]||'')}"></div>`;
  const tt = (label,key) => curIdx<0 ? '' : `<div class="field w12"><label>${label}</label><textarea data-scope="tournaments" data-idx="${curIdx}" data-key="${key}">${esc(cur[key]||'')}</textarea></div>`;
  const ts = (label,key,list) => curIdx<0 ? '' : `<div class="field"><label>${label}</label><select data-scope="tournaments" data-idx="${curIdx}" data-key="${key}">${opt(list,cur[key])}</select></div>`;
  const outcomeOptions = ['','W','L','1R','2R','R16','QF','SF','F','Champion','Team W','Team L','Rostered','Scheduled','Needs verify'];
  const list = sorted.map(t=>`<div id="tour-${t.id}" class="sponsor-card ${state.selected.tournamentId===t.id?'selected':''}" data-edit-tournament="${t.id}">
    <div class="head"><div><h3>${esc(t.name)}</h3><div class="muted" style="font-size:13px">${dateShort(t.start)} → ${dateShort(t.end)} · ${esc(t.city||'')}, ${esc(t.country||'')}</div></div><span class="pill-status ${t.status==='Completed'?'active':'acceptance'}"><span class="d"></span>${esc(t.status||'')}</span></div>
    <div class="row"><span>${esc(t.track||'')}</span><span>${esc(t.level||'')}</span><span>${esc(t.surface||'')}</span><span>${esc(t.priority||'')}</span></div>
    <div class="next"><strong style="color:var(--ink)">Result:</strong> ${esc(t.result || 'No result entered')}</div>
    <div class="next"><strong style="color:var(--ink)">Match:</strong> ${esc(t.matchRecord || t.notes || 'No match detail entered')}</div>
  </div>`).join('');

  document.getElementById('tournaments').innerHTML = header('Tournaments','Full activity manager, not only ITF. Select an event on the left, edit every field on the right, and keep long match notes out of the cramped table.',`<button class="btn primary" id="addTournament">+ Tournament</button>`) +
    `<div class="sponsor-grid" style="margin-top:18px">
      <div class="sponsor-list">${list}</div>
      <div class="sponsor-side">
        <div class="card">
          <div class="card-accent"></div>
          <div class="label">Selected activity</div>
          <h3>${esc(cur.name || 'No event selected')}</h3>
          <p>${dateShort(cur.start)} → ${dateShort(cur.end)} · ${esc(cur.track||'')} · ${esc(cur.result||'No result entered')}</p>
          <div class="actions"><button class="btn primary" data-go="documents" data-doc="tournamentBrief">Create activity document</button><button class="btn" data-go="budget">Open budget</button></div>
        </div>
        <div class="card" style="margin-top:14px">
          <div class="label">Edit selected activity</div>
          <div class="form-grid" style="margin-top:12px">
            ${tf('Name','name')}
            ${tf('Track','track')}
            ${tf('Start','start','date')}
            ${tf('End','end','date')}
            ${ts('Level','level',LEVELS)}
            ${ts('Surface','surface',SURFACES)}
            ${tf('City','city')}
            ${tf('Country','country')}
            ${ts('Status','status',STATUS)}
            ${ts('Priority','priority',PRIORITY)}
            ${ts('Result / stage','outcome',outcomeOptions)}
            ${tf('Ranking points','points','number')}
            ${tf('Result summary','result')}
            ${tf('Source URL','sourceUrl','url')}
            ${tt('Match record / scores / placement detail','matchRecord')}
            ${tt('Notes / source / follow-up','notes')}
          </div>
        </div>
      </div>
    </div>
    <div class="section-head" style="margin-top:30px"><div><h2 class="ttl" style="font-size:32px">Activity summary</h2><p class="desc">Compact view for scanning. Click any row to edit it above.</p></div></div>
    <div class="table-wrap"><table>
      <thead><tr><th></th><th>Event</th><th>Track</th><th>Dates</th><th>Level</th><th>Surface</th><th>Status</th><th>Stage</th><th>Result</th><th>Match detail</th><th>Cost</th><th>Gap</th><th></th></tr></thead>
      <tbody>${sorted.map(t=>{ const i=state.tournaments.findIndex(x=>x.id===t.id); return `<tr class="${state.selected.tournamentId===t.id?'selected':''}" data-edit-tournament="${t.id}">
        <td class="row-bar ${SURFACE_CSS(t.surface)}"><div></div></td>
        <td><strong>${esc(t.name)}</strong><div class="muted" style="font-size:12px">${esc(t.city||'')}, ${esc(t.country||'')}</div></td>
        <td>${esc(t.track||'')}</td>
        <td>${dateShort(t.start)} → ${dateShort(t.end)}</td>
        <td>${esc(t.level||'')}</td>
        <td>${esc(t.surface||'')}</td>
        <td><span class="${STATUS_CSS(t.status)}"><span class="d"></span>${esc(t.status||'')}</span></td>
        <td>${esc(t.outcome||'')}</td>
        <td>${esc(t.result||'')}</td>
        <td>${esc(t.matchRecord||'')}</td>
        <td>${moneyShort(eventCost(t.id))}</td>
        <td style="color:${eventGap(t.id)>0?'var(--live)':'var(--win)'}">${moneyShort(eventGap(t.id))}</td>
        <td><button class="btn tiny danger" data-delete="tournaments:${i}">×</button></td>
      </tr>`;}).join('')}</tbody>
    </table></div>`;
}

/* ---- Rankings ---------------------------------------------- */
function renderRankings(){
  const a = state.athlete;
  document.getElementById('rankings').innerHTML = header('Rankings','Ranking systems tracked for the athlete: ITF Junior, Tennis Europe, FRT Romania, German LK, WTA, UTR, and WTN.',`<button class="btn primary" id="addRanking">+ Ranking entry</button>`) +
    rankingSummaryCards() +
    rankingChartCard(state.selected.rankingSystem || a.rankingSystem, true) +
    `<div class="section-head" style="margin-top:30px"><div><h2 class="ttl" style="font-size:32px">Ranking entries</h2><p class="desc">These rows drive the chart. Use numeric values for charted systems; use Unranked/TBD for WTA or other systems without a numeric value.</p></div></div>
    <div class="table-wrap" style="margin-top:18px"><table>
      <thead><tr><th>System</th><th>Category</th><th>Value</th><th>Date</th><th>Goal / note / source</th><th></th></tr></thead>
      <tbody>${state.rankings.map((r,i)=>`<tr>
        <td>${selectCell('rankings',i,'system',r.system,RANKING_SYSTEMS)}</td>
        <td>${selectCell('rankings',i,'category',r.category,CATEGORIES)}</td>
        <td>${cell('rankings',i,'value',r.value)}</td>
        <td>${cell('rankings',i,'date',r.date,'date')}</td>
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
  const curIdx = state.sponsors.findIndex(s=>s.id===cur.id);
  const list = filtered.map(s=>{
    const contactLine = s.contactRole || s.contact || 'Contact role not set';
    const emailLine = s.email ? s.email : (s.emailStatus || 'Email needed');
    return `<div class="sponsor-card ${s.id===cur.id?'selected':''}" data-select-sponsor="${s.id}">
      <div class="head"><div><h3>${esc(s.company)}</h3><div class="muted" style="font-size:13px">${esc(contactLine)}</div></div>
      <span class="pill-status ${s.stage==='Active'||s.stage==='Committed'?'active':'acceptance'}"><span class="d"></span>${esc(s.stage)}</span></div>
      <div class="row"><span>${esc(s.package||'Partner')}</span><span>${moneyShort(s.ask)} ask</span><span>${moneyShort(s.paidAmount)} paid</span><span>${esc(s.sponsoredItem||'')}</span></div>
      <div class="next"><strong style="color:var(--ink)">Email:</strong> ${esc(emailLine)}</div>
      <div class="next"><strong style="color:var(--ink)">Next:</strong> ${esc(s.nextAction || 'No next action set')}</div>
    </div>`;
  }).join('') || '<div class="muted" style="padding:30px;text-align:center;border:1px dashed var(--line)">No sponsors in this stage yet.</div>';

  const guide = SPONSORED_ITEMS[cur.sponsoredItem] || SPONSORED_ITEMS['Tournament travel'];
  const sf = (label,key,type='text') => curIdx<0 ? '' : `<div class="field"><label>${label}</label><input type="${type}" data-scope="sponsors" data-idx="${curIdx}" data-key="${key}" value="${esc(cur[key]||'')}"></div>`;
  const st = (label,key) => curIdx<0 ? '' : `<div class="field w12"><label>${label}</label><textarea data-scope="sponsors" data-idx="${curIdx}" data-key="${key}">${esc(cur[key]||'')}</textarea></div>`;
  const ss = (label,key,list) => curIdx<0 ? '' : `<div class="field"><label>${label}</label><select data-scope="sponsors" data-idx="${curIdx}" data-key="${key}">${opt(list,cur[key])}</select></div>`;

  document.getElementById('sponsors').innerHTML = header('Sponsor pipeline','CRM for prospects, contacts, emails, agreements, payments, renewals, and mailer export. Click a stage in the funnel to filter.', `<button class="btn primary" id="addSponsor">+ Sponsor</button><button class="btn" id="exportSponsorCsv">Export sponsor CSV</button>${funnelFilter?`<button class="btn" id="clearFunnel">Clear filter: ${esc(funnelFilter)}</button>`:''}`) +
    pipelineFunnelCard() +
    `<div class="sponsor-grid" style="margin-top:18px">
      <div class="sponsor-list">${list}</div>
      <div class="sponsor-side">
        <div class="card">
          <div class="card-accent"></div>
          <div class="label">Selected sponsor</div>
          <h3>${esc(cur.company || 'No sponsor')}</h3>
          <p>${esc(cur.contactRole||cur.contact||'Contact role not set')} · ${cur.email ? esc(cur.email) : esc(cur.emailStatus||'Email needed')}</p>
          <div class="advice-box"><strong>Approach:</strong> ${esc(guide.advice)}<br><strong>Suggested document:</strong> ${esc(recommendedDoc(cur))}</div>
          <div class="actions">
            <button class="btn primary" data-generate-doc="${suggestedDocKey(cur)}" data-sponsor="${cur.id||''}">Generate document</button><button class="btn" data-go="documents" data-doc="${suggestedDocKey(cur)}">Open studio</button>
            <button class="btn" data-email-preview>Preview outreach email</button>
            <button class="btn" id="exportSponsorCsvSide">Export CSV</button>
          </div>
        </div>
        <div class="card" style="margin-top:14px">
          <div class="label">Quick edit selected sponsor</div>
          <div class="form-grid" style="margin-top:12px">
            ${sf('Company','company')}
            ${sf('Right contact / role','contactRole')}
            ${sf('Named contact','contact')}
            ${sf('Email','email','email')}
            ${sf('Email status','emailStatus')}
            ${sf('Phone','phone')}
            ${sf('Website','website','url')}
            ${sf('Contact URL','contactUrl','url')}
            ${ss('Stage','stage',SPONSOR_STAGE)}
            ${sf('Next action','nextAction')}
            ${st('Notes','notes')}
          </div>
        </div>
        <div class="card" style="margin-top:14px">
          <div class="label">Outreach email preview</div>
          <div class="email-box" id="emailBox">Click "Preview outreach email" to draft the right template for ${esc(cur.company||'this sponsor')}.</div>
          <div class="actions"><button class="btn primary" id="copyEmail">Copy email</button><button class="btn" id="mailtoEmail">Open in mail app</button></div>
        </div>
      </div>
    </div>
    <div class="section-head" style="margin-top:30px"><div><h2 class="ttl" style="font-size:32px">Sponsor database</h2><p class="desc">Inline editable CRM. Email and contact fields export cleanly for a mailer. Do not bulk-send rows marked Research needed.</p></div></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Company</th><th>Category</th><th>Right contact / role</th><th>Named contact</th><th>Email</th><th>Email status</th><th>Phone</th><th>Website</th><th>Contact URL</th><th>Package</th><th>Ask</th><th>Paid</th><th>Stage</th><th>Contract</th><th>Payment</th><th>Start</th><th>End</th><th>Scheduled payment</th><th>Sponsored event</th><th>Sponsored item</th><th>Deliverables</th><th>Next action</th><th>Last contact</th><th>Renewal</th><th>Owner</th><th>Mailer tag</th><th>Notes</th><th></th></tr></thead>
      <tbody>${state.sponsors.map((s,i)=>`<tr>
        <td>${cell('sponsors',i,'company',s.company)}</td>
        <td>${cell('sponsors',i,'category',s.category||'')}</td>
        <td>${cell('sponsors',i,'contactRole',s.contactRole||'')}</td>
        <td>${cell('sponsors',i,'contact',s.contact||'')}</td>
        <td>${cell('sponsors',i,'email',s.email||'','email')}</td>
        <td>${cell('sponsors',i,'emailStatus',s.emailStatus||'')}</td>
        <td>${cell('sponsors',i,'phone',s.phone||'')}</td>
        <td>${cell('sponsors',i,'website',s.website||'','url')}</td>
        <td>${cell('sponsors',i,'contactUrl',s.contactUrl||'','url')}</td>
        <td>${cell('sponsors',i,'package',s.package)}</td>
        <td>${cell('sponsors',i,'ask',s.ask,'number')}</td>
        <td>${cell('sponsors',i,'paidAmount',s.paidAmount,'number')}</td>
        <td><select data-scope="sponsors" data-idx="${i}" data-key="stage">${opt(SPONSOR_STAGE,s.stage)}</select></td>
        <td><select data-scope="sponsors" data-idx="${i}" data-key="contract">${opt(CONTRACT_STATUS,s.contract)}</select></td>
        <td><select data-scope="sponsors" data-idx="${i}" data-key="paymentStatus">${opt(PAYMENT_STATUS,s.paymentStatus)}</select></td>
        <td>${cell('sponsors',i,'agreementStart',s.agreementStart||'','date')}</td>
        <td>${cell('sponsors',i,'agreementEnd',s.agreementEnd||'','date')}</td>
        <td>${cell('sponsors',i,'scheduledPayment',s.scheduledPayment||'','date')}</td>
        <td><select data-scope="sponsors" data-idx="${i}" data-key="sponsoredEventId"><option value="">General / season</option>${state.tournaments.map(t=>`<option value="${t.id}" ${t.id==s.sponsoredEventId?'selected':''}>${esc(t.name)}</option>`).join('')}</select></td>
        <td><select data-scope="sponsors" data-idx="${i}" data-key="sponsoredItem">${opt(Object.keys(SPONSORED_ITEMS),s.sponsoredItem)}</select></td>
        <td><textarea data-scope="sponsors" data-idx="${i}" data-key="deliverables">${esc(s.deliverables||'')}</textarea></td>
        <td>${cell('sponsors',i,'nextAction',s.nextAction||'')}</td>
        <td>${cell('sponsors',i,'lastContact',s.lastContact||'','date')}</td>
        <td>${cell('sponsors',i,'renewal',s.renewal||'','date')}</td>
        <td>${cell('sponsors',i,'owner',s.owner||'')}</td>
        <td>${cell('sponsors',i,'mailerTag',s.mailerTag||'')}</td>
        <td><textarea data-scope="sponsors" data-idx="${i}" data-key="notes">${esc(s.notes||'')}</textarea></td>
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
      ['Become a local supporter of '+full, `${full} is a Romanian junior tennis player from ${a.city}, building an international pathway through national titles, European junior recognition, and ITF junior results and German club-league activity. The next stage is more expensive and more demanding: higher-level tournaments, travel, coaching support, equipment, fitness, recovery, and consistent match exposure. Local partners can help turn momentum into a structured 2026 development campaign.`],
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
    sub:`Andreea Olariu · Romanian junior tennis player · Prepared for corporate, local, and individual partners`,
    band:[['Campaign', '2026 development'],['Stage', 'Junior / club league / early pro pathway'],['Home base', a.city+', '+a.country]],
    sections:[
      ['A story of ambition, discipline, and momentum', `${full} has already built a real record in Romanian and international junior tennis. The next step is turning that momentum into sustained international progress. From ${a.city} to international junior competition, ${full} has progressed from national titles in Romania to European recognition, ITF junior results, and national team participation. Behind those milestones is the daily reality of serious junior tennis: training, travel, coaching, recovery, and a family commitment that grows as the level rises.${NL}${NL}This proposal invites partners to support an athlete at an important development stage, where the right help can expand access to stronger tournament opportunities and accelerate the path ahead.`],
      ['Athlete snapshot', null, kvFrom([
        ['Name', full],['Nationality', a.country],['Date of birth', a.dob || 'TBD'],['Stage','Romanian/FRT, Tennis Europe, ITF Juniors, German club league, and early women\'s ITF exposure'],['Home base', `${a.city} pathway with national and international junior results`],['2026 focus','Ranking growth, competition efficiency, and long-term development']
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
      ['2026 objectives', `Competition — build a targeted schedule across ITF juniors, Tennis Europe, FRT/national activity, German club league, and selective women's ITF opportunities and meaningful match experience.${NL}Performance — convert J30/J60 events into deep runs and use J100 opportunities selectively when draw, surface, and cost make sense.${NL}Development — support coaching, fitness, recovery, and match analysis around tournament blocks.${NL}Visibility — produce stronger match video, sponsor updates, photography, and source-backed media materials.${NL}Pathway — keep open junior ITF progress, selective women's ITF events, academy support, and U.S. college recruiting.`],
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
    band:[['Profile','Junior pathway'],['Born', a.dob || ''],['Home', a.city]],
    sections:[
      ['Short bio', `${full} is a Romanian junior tennis player from ${a.city}. She has earned Romanian national junior titles, represented Romania in junior team competition, received European junior recognition, and competed internationally across Tennis Europe and ITF junior events. Her 2026 campaign focuses on continued ranking growth, disciplined tournament planning, and long-term development.`],
      ['Long bio', `${full} is a Romanian junior tennis player from ${a.city} competing across the junior tennis pathway. Her early results include national junior titles in Romania, European team recognition, and international junior competition experience. Romanian media has reported her U12 national singles and doubles titles, her recognition as best player at the U12 European final tournament, her U14 national progress, and her ITF J60 results in Montenegro.${NL}${NL}${full}'s development story reflects the reality of high-performance junior tennis: serious training, frequent travel, tournament planning, coaching support, physical preparation, recovery, school coordination, and family commitment. The 2026 campaign is designed to build on her verified results through a targeted international competition plan while keeping long-term academic and tennis options open.`],
      ['One-sentence', `${full} is a Romanian junior tennis player from ${a.city} building an international pathway through national results, European recognition, and a disciplined 2026 development plan.`],
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
      ['Funding status', `Total cost: ${money(eventCost(ne.id))}.${NL}Committed funding already recorded: ${money(eventCommitted(ne.id))}.${NL}Paid: ${money(eventPaid(ne.id))}.${NL}Open gap for this activity: ${money(eventGap(ne.id))}.`],
      ['Requested support from selected sponsor', `${s.company||'Selected sponsor'} is being asked to support: ${s.sponsoredItem||'Tournament travel'}.${NL}Requested amount: ${money(s.ask||state.settings.defaultAsk)}.${NL}Sponsor package: ${s.package||'Supporter'}.${NL}Deliverables: ${s.deliverables||guide.deliverables}.`],
      ['Purpose', `This activity supports ${full}'s full development path: Romanian/FRT events, Tennis Europe, ITF Juniors, German club league, selective women's ITF exposure, and long-term academic/pro options.`]
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
      ['Lead paragraph', `${full}, a Romanian junior tennis player from ${a.city}, has launched a structured 2026 development campaign focused on disciplined international competition, ranking growth, and long-term pathway development. ${full} has built a verified record through Romanian national titles, European junior recognition, and ITF junior results and German club-league activity.`],
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

${full} is preparing for her 2026 development campaign, which includes selected junior tournaments, German club-league dates, training blocks, equipment, travel, coaching support, and recovery. The costs of competing internationally are significant, and we are looking for local partners who want to support a serious young athlete with a clear plan.

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

I am writing to share a potential partnership opportunity involving ${full}, a Romanian junior tennis player from ${a.city}. ${full} has built a verified junior record that includes Romanian national titles, European junior recognition, Romanian team participation, and recent ITF junior results and German club-league activity.

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


function attachmentsForCurrentDoc(docKey){
  const base = ['Athlete one-page summary PDF', 'Proof folder links: ITF/WTA/CoreTennis/FRT/press sources', 'Recent results and ranking snapshot'];
  if(docKey==='corporateProposal') return ['Corporate sponsorship proposal PDF', 'One-page athlete summary PDF', 'Season budget overview PDF', 'Proof folder links', 'Logo/use-of-name preference form'];
  if(docKey==='tournamentBrief') return ['Activity/tournament brief PDF', 'Budget line items for selected activity', 'Athlete one-page summary PDF', 'Recent results and ranking snapshot'];
  if(String(docKey).includes('Email')) return ['One-page athlete summary PDF', 'Relevant sponsor proposal or tournament brief', 'Proof folder links'];
  if(docKey==='contract') return ['Draft sponsorship agreement PDF', 'Sponsor information form', 'Deliverables checklist'];
  return base;
}
function documentSendInstructions(d){
  const s = currentSponsor();
  const t = currentTournament();
  const email = s.email || '[use contact form or warm introduction]';
  const contact = s.contact || s.contactRole || '[contact name / role]';
  const subject = d.email?.subject || `${state.athlete.firstName} ${state.athlete.lastName} sponsorship material`;
  const attach = attachmentsForCurrentDoc(state.selected.doc);
  return `<div class="card" style="margin-bottom:18px">
    <div class="card-accent"></div>
    <div class="label">Send instructions</div>
    <h3>${esc(s.company || 'Selected sponsor')} · ${esc(t.name || 'Selected activity')}</h3>
    <div class="advice-box"><strong>Send to:</strong> ${esc(contact)} · ${esc(email)}<br><strong>Subject:</strong> ${esc(subject)}<br><strong>Activity:</strong> ${esc(t.name||'General / season')} · ${esc(t.result||'No result entered')}<br><strong>Next action:</strong> ${esc(s.nextAction||'Set next action in sponsor CRM')}</div>
    <div class="doc-sec" style="border-top:none;padding-top:12px"><h4>Attach / include</h4>${listFrom(attach)}</div>
    <div class="doc-sec" style="border-top:none;padding-top:0"><h4>Before sending</h4>${listFrom([
      s.email ? 'Email is entered. Confirm it is the right public/business address before any bulk send.' : 'No email entered. Use the contact URL or a warm introduction, then add the address before bulk mail.',
      'Confirm the sponsor name, contact role, ask amount, sponsored item, and selected activity.',
      'Export sponsor CSV only after contact details are marked ready for mailer.',
      'For minors, keep parent/guardian approval and avoid sharing private school, travel, or contact details.'
    ])}</div>
  </div>`;
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
        ${documentSendInstructions(d)}
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



function plainTextFromDoc(d){
  const lines = [];
  lines.push(d.title || 'Campaign document');
  if(d.sub) lines.push(d.sub);
  lines.push('');
  (d.band||[]).forEach(([k,v])=>lines.push(`${k}: ${v}`));
  lines.push('');
  (d.sections||[]).forEach(([h,b,html])=>{
    lines.push(h);
    if(html){
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      lines.push(tmp.innerText.trim());
    } else {
      lines.push(String(b||''));
    }
    lines.push('');
  });
  return lines.join('\n').replace(/\n{3,}/g,'\n\n').trim();
}
function safeFilename(x){
  return String(x||'document').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,90) || 'document';
}
function generatedDocumentHtml(d){
  const instructions = documentSendInstructions(d);
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(d.title)}</title><style>body{font-family:Arial,sans-serif;max-width:900px;margin:40px auto;line-height:1.45;color:#17212b}h1{font-size:30px;margin-bottom:4px}.sub{color:#53677a;margin-bottom:20px}.doc-band{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:18px 0}.b{border:1px solid #dbe3ea;padding:10px}.b strong{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#62758a}.doc-sec{border-top:1px solid #dbe3ea;padding-top:16px;margin-top:18px}table{border-collapse:collapse;width:100%;font-size:13px}td,th{border:1px solid #dbe3ea;padding:8px;text-align:left}th{background:#eef3f8}ul{padding-left:20px}.card{border:1px solid #dbe3ea;background:#f8fafc;padding:16px;margin-bottom:22px}.label{text-transform:uppercase;font-size:11px;letter-spacing:.14em;color:#61768a}.advice-box{background:#fff;border:1px solid #dbe3ea;padding:12px;margin-top:8px}</style></head><body>${instructions}<div class="doc-paper">${docHtml(d)}</div></body></html>`;
}
function generateCurrentDocument(docKey){
  if(docKey) state.selected.doc = docKey;
  const D = docsCatalog();
  const d = D[state.selected.doc] || D.sponsorOnePager;
  const s = currentSponsor();
  const t = currentTournament();
  const base = `${todayISO()}-${safeFilename(s.company)}-${safeFilename(d.title)}-${safeFilename(t.name)}`;
  downloadTextFile(base + '.html','text/html;charset=utf-8',generatedDocumentHtml(d));
  if(d.email){
    downloadTextFile(base + '-email.txt','text/plain;charset=utf-8',`To: ${s.email || '[use contact form or warm introduction]'}\nSubject: ${d.email.subject || ''}\n\n${d.email.body || ''}`);
  } else {
    downloadTextFile(base + '.txt','text/plain;charset=utf-8',plainTextFromDoc(d));
  }
  toast('Document generated for ' + (s.company || 'selected sponsor'));
}

function csvValue(v){
  const text = String(v ?? '').replace(/\r?\n/g,' ').trim();
  return '"' + text.replace(/"/g,'""') + '"';
}
function downloadTextFile(filename, type, content){
  const blob = new Blob([content], {type});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
}
function exportSponsorCsv(){
  const headers = ['company','category','contact_role','contact_name','email','email_status','phone','website','contact_url','package','ask_eur','paid_eur','stage','contract','payment_status','agreement_start','agreement_end','scheduled_payment','sponsored_event','sponsored_item','deliverables','next_action','last_contact','renewal','owner','mailer_tag','ready_for_mailer','notes'];
  const rows = state.sponsors.map(s=>{
    const ready = s.email && s.email.includes('@') && !String(s.emailStatus||'').toLowerCase().includes('research');
    return [
      s.company, s.category, s.contactRole, s.contact, s.email, s.emailStatus, s.phone, s.website, s.contactUrl,
      s.package, s.ask, s.paidAmount, s.stage, s.contract, s.paymentStatus, s.agreementStart, s.agreementEnd,
      s.scheduledPayment, eventName(s.sponsoredEventId), s.sponsoredItem, s.deliverables, s.nextAction,
      s.lastContact, s.renewal, s.owner, s.mailerTag, ready ? 'yes' : 'no', s.notes
    ];
  });
  const csv = [headers, ...rows].map(r=>r.map(csvValue).join(',')).join('\n');
  downloadTextFile('andreea-sponsor-mailer.csv','text/csv;charset=utf-8',csv);
  toast('Sponsor CSV exported');
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
      <button class="btn" id="exportSponsorCsvSettings">Export sponsor CSV</button>
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
  const t = {id:id(),name:'New activity',start,end:start,track:'ITF Junior',level:'ITF Junior J60',surface:'Clay',city:'',country:'',status:'Research',priority:'B',result:'',matchRecord:'',sourceUrl:'',points:0,outcome:''};
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
  const genDoc=e.target.closest('[data-generate-doc]');
  if(genDoc){
    if(genDoc.dataset.sponsor) state.selected.sponsorId=genDoc.dataset.sponsor;
    const sp = currentSponsor();
    if(sp.sponsoredEventId) state.selected.tournamentId = sp.sponsoredEventId;
    generateCurrentDocument(genDoc.dataset.generateDoc);
    return;
  }
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
  if(e.target.id==='addChartRanking'){ state.rankings.push({id:id(),system:state.selected.rankingSystem||state.athlete.rankingSystem||'ITF Junior',category:'Girls 18U',value:'',date:todayISO(),goal:''}); render(); return; }
  if(e.target.id==='addBudget'){ state.budget.push({id:id(),eventId:state.selected.tournamentId||'',category:'Tournament travel',description:'New budget item',amount:0,status:'Needed'}); render(); return; }
  if(e.target.id==='addSponsor'){ state.sponsors.push({id:id(),company:'New sponsor',category:'',contact:'',contactRole:'Marketing / Partnerships / Sponsorship decision-maker',email:'',emailStatus:'Research needed',website:'',contactUrl:'',phone:'',package:'Local Partner',ask:state.settings.defaultAsk,stage:'Prospect',contract:'Not started',agreementStart:'',agreementEnd:'',paymentStatus:'Not invoiced',paidAmount:0,scheduledPayment:'',sponsoredItem:'Tournament travel',sponsoredEventId:state.selected.tournamentId||'',deliverables:SPONSORED_ITEMS['Tournament travel'].deliverables,nextAction:'Research contact and email',lastContact:'',renewal:'',owner:'',mailerTag:'tournament-travel',notes:''}); render(); return; }
  if(e.target.id==='exportSponsorCsv' || e.target.id==='exportSponsorCsvSide' || e.target.id==='exportSponsorCsvSettings'){ exportSponsorCsv(); return; }

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
