window.AOS_OPTIONS = {
  tournamentTracks: [
    'ITF World Tennis Tour Juniors',
    'Tennis Europe Junior Tour',
    'Romanian National / FRT',
    'ITF Women W15',
    'Training block',
    'Sponsor / Admin'
  ],
  tournamentLevels: [
    'J30','J60','J100','J200','J300','J500','Junior Grand Slam',
    'Tennis Europe U12 Category 3','Tennis Europe U14 Category 3','Tennis Europe U14 Category 2','Tennis Europe U14 Category 1','Tennis Europe U14 Super Category',
    'Tennis Europe U16 Category 3','Tennis Europe U16 Category 2','Tennis Europe U16 Category 1',
    'FRT U12','FRT U14','FRT U16','FRT U18','Romanian National Championship',
    'W15','Local / Regional','Training Camp','Sponsor Deadline'
  ],
  ageCategories: ['U12','U14','U16','U18','ITF Juniors','Women Pro Transition','Open'],
  rankingSystems: [
    'ITF Junior Ranking',
    'Tennis Europe U16 Ranking',
    'Tennis Europe U14 Ranking',
    'Tennis Europe U12 Festival / Team Selection',
    'FRT U18 Ranking',
    'FRT U16 Ranking',
    'FRT U14 Ranking',
    'FRT U12 Ranking',
    'WTA Singles Ranking',
    'WTA Doubles Ranking',
    'UTR Rating',
    'ITF World Tennis Number',
    'Club / Regional Ranking'
  ],
  surfaces: ['Clay','Hard','Indoor hard','Grass','Carpet','Not set'],
  statuses: ['Researching','Shortlist','Entered','Confirmed','Completed','Cancelled','Skipped'],
  priorities: ['A','B','C'],
  budgetCategories: ['Coaching','Travel','Accommodation','Food','Entry fees','Equipment','Strings','Shoes','Fitness','Physio / Recovery','Sports psychology','Medical','Video / Analytics','Sponsor materials','Other'],
  sponsorStages: ['Research','Prospect','Contacted','Meeting scheduled','Proposal sent','Negotiating','Committed','Contract signed','Active','Completed','Declined','Dormant'],
  contractStatuses: ['No agreement','Drafting','Sent for review','Signed','Delivered','Renewal due','Closed'],
  sponsorPackages: ['Tournament trip sponsor','Monthly training sponsor','Equipment sponsor','Season partner','Founding partner','In-kind partner','Media / profile partner']
};

window.AOS_DEFAULT_DATA = {
  athlete: {
    firstName: 'Andreea',
    lastName: 'Olariu',
    displayName: 'Andreea Olariu',
    country: 'Romania',
    city: 'Timișoara, Romania',
    sport: 'Tennis',
    handedness: 'Right-handed',
    birthDate: '2010-03-03',
    ageCategory: 'ITF Juniors',
    coach: 'TBD',
    club: 'TBD',
    height: '',
    heroSummary: 'An editorial athlete command center for tournament planning, development tracking, sponsor management, and the business side of a rising junior tennis career.',
    sponsorStory: 'Andreea Olariu is a Romanian junior tennis player from Timișoara building an international junior pathway through ITF Juniors, European competition, and selective transition opportunities.',
    strengths: 'International junior experience, doubles success, national-team exposure, proven ability to compete outside Romania, and a strong development story for local sponsors.',
    developmentNeeds: 'A disciplined 12-month competition calendar, travel support, structured physical preparation, ranking-targeted tournament selection, recovery planning, and sponsor communication.',
    goal12Months: 'Build a top-300 ITF Junior ranking campaign, convert public results into a sponsor-ready story, and create a realistic tournament budget for the next competitive block.',
    targetRanking: 'Top 300 ITF Juniors',
    currentRankingLabel: 'ITF Junior Ranking 503',
    careerHighLabel: 'Career high 464',
    wtaStatus: 'No WTA ranking / $0 prize money listed',
    cutoutPath: 'assets/andreea-cutout.png',
    backgroundPath: 'assets/andreea-bg.jpg',
    contactName: '[Your Name]',
    contactEmail: '',
    contactPhone: '',
    sourceNote: 'Preloaded public profile items should be verified before external use.'
  },
  rankings: [
    { system: 'ITF Junior Ranking', category: 'ITF Juniors', date: '2026-05-07', value: '503', numericValue: 503, note: 'CoreTennis listing; verify against official ITF before sponsor distribution.' },
    { system: 'ITF Junior Ranking', category: 'ITF Juniors', date: '2025-06-30', value: 'Career high 464', numericValue: 464, note: 'Public résumé / CoreTennis and ITF references.' },
    { system: 'WTA Singles Ranking', category: 'Women Pro Transition', date: '2026-05-07', value: 'Unranked', numericValue: '', note: 'WTA profile lists no current singles rank and $0 prize money.' }
  ],
  milestones: [
    { year: '2022', date: '', type: 'National', title: 'U12 national-level titles', result: 'Public résumé item', description: 'Recorded as part of Andreea’s junior résumé. Verify exact tournament names and dates before publishing externally.', source: 'Prior sponsor materials / user-provided résumé' },
    { year: '2023', date: '', type: 'International', title: 'European U12 Festival finalist at Rafa Nadal Academy', result: 'Finalist', description: 'FRT public post referenced Andreea Olariu as a finalist at the European U12 Festival at Rafa Nadal Academy.', source: 'FRT public post' },
    { year: '2023', date: '', type: 'Tennis Europe', title: 'Tennis Europe U14 title at Rafa Nadal Academy', result: 'Champion', description: 'FRT public post described Andreea as champion at a U14 Rafa Nadal Academy event in the Tennis Europe circuit.', source: 'FRT public post' },
    { year: '2024', date: '', type: 'National', title: 'U14 Romanian national title', result: 'Champion', description: 'Public résumé item from prior sponsor materials. Verify exact federation record before external use.', source: 'Prior sponsor materials / user-provided résumé' },
    { year: '2025', date: '', type: 'National team', title: 'Romania U16 team participation', result: 'National team selection', description: 'Public résumé and social references indicate U16 Romanian team participation.', source: 'Prior sponsor materials / social reference' },
    { year: '2025', date: '2025-05-26', type: 'ITF J60', title: 'J60 Podgorica doubles title', result: 'Champion', description: 'Won doubles in Podgorica with Yelena Lebeau; final score reported as 0-6, 7-5, 10-4 against Smidova / Stepankova.', source: 'Radio Timișoara' },
    { year: '2025', date: '2025-05-26', type: 'ITF J60', title: 'J60 Podgorica singles final and Ulcinj semifinal', result: 'Singles finalist / semifinalist', description: 'Reached the singles final in Podgorica and semifinal in Ulcinj during the Montenegro block.', source: 'Radio Timișoara' }
  ],
  tournaments: [
    { name: 'J60 Larnaca', track: 'ITF World Tennis Tour Juniors', level: 'J60', ageCategory: 'ITF Juniors', start: '2026-03-02', end: '2026-03-08', city: 'Larnaca', country: 'Cyprus', surface: 'Hard', status: 'Completed', priority: 'B', budget: 1200, result: '1/16 listed by CoreTennis', notes: 'Use as 2026 calendar baseline.' },
    { name: 'J60 Frederiksberg', track: 'ITF World Tennis Tour Juniors', level: 'J60', ageCategory: 'ITF Juniors', start: '2026-02-09', end: '2026-02-15', city: 'Copenhagen / Frederiksberg', country: 'Denmark', surface: 'Indoor hard', status: 'Completed', priority: 'B', budget: 1400, result: '1/16 listed by CoreTennis', notes: 'Indoor J60 reference event.' },
    { name: 'Next ranking-targeted J60 block', track: 'ITF World Tennis Tour Juniors', level: 'J60', ageCategory: 'ITF Juniors', start: '2026-06-15', end: '2026-06-21', city: 'TBD', country: 'Europe', surface: 'Clay', status: 'Researching', priority: 'A', budget: 950, result: '', notes: 'Placeholder for next ranking-focused event.' },
    { name: 'Romanian preparation event', track: 'Romanian National / FRT', level: 'FRT U18', ageCategory: 'U18', start: '2026-07-05', end: '2026-07-07', city: 'Timișoara', country: 'Romania', surface: 'Clay', status: 'Shortlist', priority: 'B', budget: 300, result: '', notes: 'Lower-cost match reps before travel block.' }
  ],
  budget: [
    { category: 'Coaching', description: 'Monthly private training block', amount: 600, status: 'Planned', fundingTarget: 'Monthly training sponsor' },
    { category: 'Travel', description: 'European ITF travel block', amount: 950, status: 'Needed', fundingTarget: 'Tournament trip sponsor' },
    { category: 'Accommodation', description: 'Tournament lodging and local transport', amount: 550, status: 'Needed', fundingTarget: 'Tournament trip sponsor' },
    { category: 'Equipment', description: 'Strings, grips, shoes, apparel, match supplies', amount: 250, status: 'Needed', fundingTarget: 'Equipment sponsor' },
    { category: 'Fitness', description: 'Strength and conditioning support', amount: 300, status: 'Planned', fundingTarget: 'Monthly training sponsor' }
  ],
  sponsors: [
    { company: 'Local Business Prospect', contactName: 'Owner or Marketing Manager', email: '', phone: '', category: 'Local Sponsor', package: 'Tournament trip sponsor', ask: 1500, stage: 'Prospect', contractStatus: 'No agreement', nextAction: 'Send intro sponsor email', renewalDate: '', deliverables: 'Sponsor mention in updates, monthly progress note, logo placement where appropriate, transparent use-of-funds report.', value: 'Help fund one concrete tournament travel block for a promising Timișoara junior athlete.', notes: '' },
    { company: 'Regional Brand Opportunity', contactName: 'Marketing Lead', email: '', phone: '', category: 'Regional Sponsor', package: 'Season partner', ask: 4500, stage: 'Research', contractStatus: 'No agreement', nextAction: 'Find contact and tailor proposal', renewalDate: '', deliverables: 'Quarterly impact report, athlete profile, event updates, sponsor recognition, budget transparency.', value: 'Connect the brand to a disciplined Romanian junior athlete pathway and measurable season goals.', notes: '' }
  ],
  documents: {
    selected: 'developmentPlan',
    selectedSponsorIndex: 0,
    selectedSponsorTemplate: 'intro'
  }
};
