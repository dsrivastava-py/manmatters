export type Lang = 'en' | 'hinglish';

export interface TitledText {
  title: string;
  body: string;
}

export interface Content {
  app: {
    name: string;
    tagline: string;
    marketingLines: string[];
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
      responding: TitledText;
      unclear: TitledText;
      'not-responding': TitledText;
    };
    lowAdherence: string;
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

export interface Ui {
  nav: { week: string; shed: string; checkpoint: string; slipped: string; apply: string; label: string };
  header: { settings: string; conceptPill: string; langLabel: string; skip: string };
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
    checkpointMark: string;
    nextCheckpoint: string;
    nextCheckpointOne: string;
    checkpointToday: string;
    commonlyTitle: string;
    doNowTitle: string;
    doNow: string[];
    watchTitle: string;
    watch: string[];
    shedCta: string;
    beyondTimeline: string;
    maintenanceHonest: string;
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
    earlyNote: string;
    notSaved: string;
    submit: string;
    needAll: string;
    historyTitle: string;
    noHistory: string;
    retake: string;
    weekLabel: string;
    questionsTitle: string;
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
    confirm: string;
    cancel: string;
    cleared: string;
  };
  footer: { line: string };
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
