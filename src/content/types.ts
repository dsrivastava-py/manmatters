export type Lang = 'en' | 'hinglish';

export interface TitledText {
  title: string;
  body: string;
}

export interface Content {
  app: {
    name: string;
    tagline: string;
    features: { title: string; body: string }[];
    conceptDisclaimer: string;
    reviewPending: string;
    medicalDisclaimer: string;
    commonlyReportedNote: string;
    languageToggle: string;
    clearData: string;
    clearDataConfirm: string;
    privacyNote: string;
  };
  concerns: {
    hairFall: string;
    thinning: string;
    receding: string;
    dandruff: string;
  };
  phases: {
    'settling-in': TitledText;
    'shed-settling': TitledText;
    'early-signs': TitledText;
    'checkpoint-1': TitledText;
    building: TitledText;
    'checkpoint-2': TitledText;
    maintenance: TitledText;
  };
  shedCheck: {
    title: string;
    weekQuestion: string;
    amountQuestion: string;
    amountOptions: {
      'a-bit-more': string;
      'clearly-more': string;
      'clumps-or-patches': string;
    };
    irritationQuestion: string;
    irritationOptions: { none: string; mild: string; severe: string };
    flagsQuestion: string;
    flags: { swelling: string; dizziness: string; chest: string; severeIrritation: string };
    outcomes: {
      'doctor-now': TitledText;
      'see-doctor-soon': TitledText;
      'commonly-reported': TitledText;
      'unusual-for-week': TitledText;
    };
    actions: {
      'doctor-now': string;
      'see-doctor-soon': string;
      'commonly-reported': string;
      'unusual-for-week': string;
    };
    kabTak: {
      now: string;
      consult: string;
      settles: string;
      settlesBy: string;
      watch: string;
    };
  };
  redFlags: {
    title: string;
    intro: string;
    swelling: string;
    dizziness: string;
    chest: string;
    severeIrritation: string;
    emergencyTitle: string;
    emergencyBody: string;
    emergencyCall: string;
  };
  checkpoint: {
    title: string;
    protocolTitle: string;
    protocol: string[];
    noUploads: string;
    questions: {
      lessShedding: string;
      fillIn: string;
      thicker: string;
      consistentUse: string;
      photoBetter: string;
      newThinning: string;
    };
    answers: { yes: string; no: string; unsure: string };
    results: {
      'on-track': CheckpointResultText;
      'early-signs': CheckpointResultText;
      'not-responding': CheckpointResultText;
      'fix-routine': CheckpointResultText;
      'too-early': CheckpointResultText;
      'need-better-look': CheckpointResultText;
    };
    reasons: {
      'too-early': string;
      'low-adherence': string;
      'mostly-unsure': string;
      'w12-shed-and-visible': string;
      'w12-shed-only': string;
      'w12-visible-only': string;
      'w12-new-thinning': string;
      'w24-visible': string;
      'w24-partial': string;
      'w24-new-thinning': string;
      'no-positive': string;
    };
    signNames: {
      lessShedding: string;
      fillIn: string;
      thicker: string;
      consistentUse: string;
      photoBetter: string;
      newThinning: string;
    };
    roles: { main: string; bonus: string; routine: string; warning: string };
    effects: { positive: string; negative: string; neutral: string };
    lookSteps: string[];
    consultCta: string;
    doctorSummaryTitle: string;
  };
  lapse: {
    title: string;
    question: string;
    lapseVsPlateau: string;
    outcomes: {
      'short-gap': TitledText;
      'lapse-reset-expectations': TitledText;
      'long-gap-consult': TitledText;
    };
    actions: {
      'short-gap': string;
      'lapse-reset-expectations': string;
      'long-gap-consult': string;
    };
    kabTak: {
      'short-gap': string;
      'lapse-reset-expectations': string;
      'lapse-reset-one': string;
      'long-gap-consult': string;
      nextCheckGeneric: string;
    };
  };
  maintenance: TitledText & { points: string[] };
  howToApply: {
    title: string;
    intro: string;
    steps: string[];
    labelNote: string;
  };
  links: {
    consult: string;
    consultNotUrgent: string;
    consent: string;
    privacy: string;
  };
  ui: Ui;
}

export interface CheckpointResultText {
  title: string;
  body: string;
  action: string;
  kabTak: string;
}

export interface Ui {
  nav: { week: string; shed: string; checkpoint: string; slipped: string; apply: string; label: string };
  header: { settings: string; conceptPill: string; conceptPillLabel: string; langLabel: string; skip: string; themeLabel: string };
  when: { today: string; thisWeek: string; inOne: string; inN: string; dateLocale: string };
  kabTakLabel: string;
  doNowLabel: string;
  onboarding: {
    title: string;
    lead: string;
    dateLabel: string;
    chips: { today: string; weekAgo: string; monthAgo: string; threeMonthsAgo: string };
    chipsLabel: string;
    notStarted: string;
    start: string;
    errors: { invalid: string; future: string; tooOld: string; empty: string };
  };
  week: {
    label: string;
    phaseLabel: string;
    timelineLabel: string;
    spikeShed: string;
    spikeDoubt: string;
    checkpointToday: string;
    nextLine: string;
    started: string;
    commonlyTitle: string;
    doNowTitle: string;
    doNow: string[];
    watchTitle: string;
    watch: string[];
    shedCta: string;
    shedCtaHint: string;
    beyondTimeline: string;
    maintenanceHonest: string;
  };
  journey: {
    title: string;
    youAreHere: string;
    done: string;
    weekOne: string;
    weekRange: string;
    weekFrom: string;
    startedOn: string;
    steps: {
      start: string;
      'shed-window': string;
      settling: string;
      'early-signs': string;
      'checkpoint-1': string;
      'visible-change': string;
      'checkpoint-2': string;
      maintenance: string;
    };
  };
  wizard: {
    step: string;
    next: string;
    back: string;
    seeResult: string;
    startOver: string;
    saved: string;
    weekHint: string;
    yourAnswer: string;
  };
  checkpoint: {
    intro: string;
    start: string;
    submit: string;
    needAll: string;
    historyTitle: string;
    noHistory: string;
    retake: string;
    weekLabel: string;
    questionsTitle: string;
    whyTitle: string;
    nextCheck: string;
    selfCheck: string;
    tooEarlyNormal: string;
    baselineTitle: string;
    lookTitle: string;
    retakeLook: string;
    historyNext: string;
  };
  slipped: {
    intro: string;
    daysLabel: string;
    chips: string[];
    unit: string;
    check: string;
    restartTitle: string;
    restart: string[];
    invalid: string;
    again: string;
  };
  apply: { progress: string; first: string };
  settings: {
    title: string;
    language: string;
    startDate: string;
    changeDate: string;
    save: string;
    close: string;
    about: string;
    aboutBody: string;
    alongside: string;
    reviewTitle: string;
    theme: string;
    themeOptions: { light: string; dark: string; system: string };
    appTitle: string;
    projectTitle: string;
    projectBody: string;
    builtBy: string;
    emailLabel: string;
    phoneLabel: string;
    confirm: string;
    cancel: string;
    cleared: string;
  };
  footer: { disclaimer: string; alongside: string; credit: string; about: string };
  share: {
    open: string;
    title: string;
    lead: string;
    cardTitle: string;
    lastShed: string;
    noShed: string;
    checkpoints: string;
    notDone: string;
    consultLine: string;
    noPersonal: string;
    conceptTag: string;
    share: string;
    download: string;
    shared: string;
    downloaded: string;
    failed: string;
    previewAlt: string;
    shareText: string;
  };
  doctor: {
    open: string;
    title: string;
    print: string;
    back: string;
    startDate: string;
    weeksElapsed: string;
    checkpointsTitle: string;
    none: string;
    adherence: string;
    lastShed: string;
    noShed: string;
    disclaimer: string;
    dateLabel: string;
  };
  pwa: { offline: string; install: string; iosHint: string; dismiss: string };
}

/** Set to false only after a qualified clinician has reviewed all clinical text. */
export const CLINICAL_REVIEW_PENDING = true;
