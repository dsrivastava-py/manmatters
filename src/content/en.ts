import type { Content } from './types';

const STOP = 'Stop using the product and consult a doctor.';

export const en: Content = {
  app: {
    name: 'Kab Tak?',
    tagline: 'Your hair progress, told honestly.',
    marketingLines: [
      'Is this normal for my week? Find out.',
      'No miracle claims. Just a realistic timeline.',
      'Know when to wait and when to ask a doctor.',
    ],
    conceptDisclaimer: 'Independent concept, not an official Man Matters product.',
    reviewPending: 'Content pending medical review.',
    medicalDisclaimer:
      'This tool gives general information only. It is not a diagnosis or medical advice. Outcomes vary from person to person. If you are worried, talk to a doctor.',
    commonlyReportedNote: 'Everything here describes what is commonly reported, not what will happen to you.',
    languageToggle: 'Hinglish',
    clearData: 'Clear all my data',
    clearDataConfirm: 'This removes everything saved on this phone. Continue?',
    privacyNote: 'Everything stays on your phone. No login, no photo uploads, no tracking.',
  },
  concerns: {
    hairFall: 'Hair fall',
    thinning: 'Thinning',
    receding: 'Receding hairline or crown',
    dandruff: 'Dandruff-related shedding',
  },
  phases: {
    'settling-in': {
      title: 'Settling in',
      body: 'Weeks 1 to 4. Some people commonly report extra shedding as hair cycles reset. It can feel scary, and it is often part of the process. Keep going and keep a note of how it looks.',
    },
    'shed-settling': {
      title: 'Shed settling',
      body: 'Weeks 5 to 8. Extra shedding is commonly reported to ease off in this window. Results are not visible yet, so patience matters.',
    },
    'early-signs': {
      title: 'Early signs',
      body: 'Weeks 9 to 11. Some people commonly report less hair in the comb or shower. Not seeing change yet is common too. Your first honest checkpoint is coming at week 12.',
    },
    'checkpoint-1': {
      title: 'Checkpoint 1',
      body: 'Week 12. Time for an honest self-check. Compare against your own baseline using the same light, angle and distance.',
    },
    building: {
      title: 'Building',
      body: 'Weeks 13 to 23. Gradual change is commonly reported. Some people notice a plateau. Staying consistent matters more than checking every day.',
    },
    'checkpoint-2': {
      title: 'Checkpoint 2',
      body: 'Week 24. The second honest self-check. If you see no progress after consistent use, it is time to talk to a doctor.',
    },
    maintenance: {
      title: 'Maintenance',
      body: 'Week 25 onwards. The goal now is to hold on to what you have. Keep your routine steady and check in with a doctor if anything changes.',
    },
  },
  shedCheck: {
    title: 'Quick shed check',
    weekQuestion: 'Which week are you in?',
    amountQuestion: 'How much hair are you losing compared to usual?',
    amountOptions: {
      'a-bit-more': 'A bit more than usual',
      'clearly-more': 'Clearly more than usual',
      'clumps-or-patches': 'Clumps or bald patches',
    },
    irritationQuestion: 'How is your scalp?',
    irritationOptions: { none: 'No irritation', mild: 'Mild itch or dryness', severe: 'Severe irritation' },
    flagsQuestion: 'Do you have any of these?',
    flags: {
      swelling: 'Swelling of face, lips or eyes',
      dizziness: 'Dizziness',
      chest: 'Chest symptoms such as pain or a fast heartbeat',
      severeIrritation: 'Severe scalp irritation, burning or rash',
    },
    outcomes: {
      'doctor-now': {
        title: 'Please stop and see a doctor',
        body: 'What you describe needs medical attention. Stop using the product and consult a doctor now. For chest symptoms or swelling of the face, seek urgent care.',
      },
      'see-doctor-soon': {
        title: 'Worth talking to a doctor soon',
        body: 'This is not what is commonly reported at your week. A doctor can look at your scalp and tell you what is going on.',
      },
      'commonly-reported': {
        title: 'Commonly reported at your week',
        body: 'Extra shedding in the early weeks is commonly reported and often settles. Keep your routine and check again in a couple of weeks.',
      },
      'unusual-for-week': {
        title: 'Unusual for your week',
        body: 'More shedding after week 12 is not what is commonly reported. Please talk to a doctor to find out why.',
      },
    },
  },
  redFlags: {
    title: 'Stop and see a doctor if you notice',
    intro: 'These are not normal. Do not wait them out.',
    swelling: `Swelling of the face, lips, tongue or eyes. ${STOP}`,
    dizziness: `Dizziness or feeling faint. ${STOP}`,
    chest: `Chest pain, tightness or a racing heartbeat. ${STOP}`,
    severeIrritation: `Severe scalp irritation, burning, blisters or rash. ${STOP}`,
  },
  checkpoint: {
    title: 'Honest checkpoint',
    protocolTitle: 'Keep the check fair',
    protocol: [
      'Same light',
      'Same angle',
      'Same distance',
      'Same hair state (dry, parted the same way)',
    ],
    noUploads: 'Compare by eye with your own baseline photos. Nothing is uploaded.',
    questions: {
      lessShedding: 'Is there less hair in your comb or shower than at the start?',
      fillIn: 'Do your crown or hairline look like they are filling in?',
      thicker: 'Does your hair feel thicker?',
      consistentUse: 'Did you follow your routine on most days?',
      photoBetter: 'Looking at same-light photos by eye, does it look better than your baseline?',
      newThinning: 'Have you noticed new thinning areas?',
    },
    answers: { yes: 'Yes', no: 'No', unsure: 'Not sure' },
    results: {
      responding: {
        title: 'Looks like you are responding',
        body: 'Several signs point the right way. Keep going and check again at the next checkpoint.',
      },
      unclear: {
        title: 'Not clear yet',
        body: 'The signs are mixed. This is common. Stay consistent and check again, or ask a doctor if you want certainty.',
      },
      'not-responding': {
        title: 'Not responding so far',
        body: 'You are not seeing the signs commonly reported by now. This is not your fault. Please see a doctor to review your plan.',
      },
    },
    lowAdherence: 'You missed a lot of days. Fixing the routine first is a good next step. No blame, it happens to everyone.',
    consultCta: 'Talk to a doctor',
    doctorSummaryTitle: 'Summary to show your doctor',
  },
  lapse: {
    title: 'I slipped my routine',
    question: 'How many days did you skip?',
    lapseVsPlateau:
      'A lapse means you stopped the routine. A plateau means you kept going and nothing seems to change. They need different responses.',
    outcomes: {
      'short-gap': {
        title: 'Small gap, carry on',
        body: 'A few missed days are common. Just restart today. Do not double up.',
      },
      'lapse-reset-expectations': {
        title: 'Restart and reset expectations',
        body: 'A longer gap can slow things down. Restart your routine and expect your timeline to move later. Follow the product label or your doctor for how to restart.',
      },
      'long-gap-consult': {
        title: 'Long gap, ask a doctor',
        body: 'After a long break it is best to speak to a doctor before restarting.',
      },
    },
  },
  maintenance: {
    title: 'Maintenance card',
    body: 'From month 6, the aim is to keep what you have gained.',
    points: [
      'Stay consistent with your routine',
      'Check in with a doctor if shedding returns',
      'Expect gradual change, not sudden',
      'Review your plan with a doctor now and then',
    ],
  },
  howToApply: {
    title: 'How to apply checklist',
    intro: 'Follow the product label or your doctor\'s instructions.',
    steps: [
      'Read the product label first',
      'Start with a clean, dry scalp unless the label says otherwise',
      'Use the amount your label or doctor advises',
      'Wash your hands after use',
      'Keep away from eyes',
      'Stop and consult a doctor if you notice anything unusual',
    ],
    labelNote: 'This checklist does not replace the label or your doctor.',
  },
  links: {
    consult: 'Take the hair test and consult a doctor',
    consent: 'Terms and conditions',
    privacy: 'Privacy policy',
  },
};
