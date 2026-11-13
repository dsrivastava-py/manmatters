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
    consent: string;
    privacy: string;
  };
}

/** Set to false only after a qualified clinician has reviewed all clinical text. */
export const CLINICAL_REVIEW_PENDING = true;
