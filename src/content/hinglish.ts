import type { Content } from './types';

const STOP = 'Product use karna band karein aur doctor se milein.';

export const hinglish: Content = {
  app: {
    name: 'Kab Tak?',
    tagline: 'Hair ka progress, sach ke saath.',
    marketingLines: [
      'Ye normal hai ya nahi? Abhi jaaniye.',
      'Koi jhootha vaada nahi. Bas ek realistic timeline.',
      'Jaaniye kab rukna hai aur kab doctor se poochna hai.',
    ],
    conceptDisclaimer: 'Independent concept hai, official Man Matters product nahi.',
    reviewPending: 'Content ka medical review baaki hai.',
    medicalDisclaimer:
      'Ye tool sirf general jaankari deta hai. Ye diagnosis ya medical salah nahi hai. Result har insaan mein alag hota hai. Agar chinta ho to doctor se baat karein.',
    commonlyReportedNote: 'Yahan jo bhi likha hai woh aam taur par bataya gaya hai, ye guarantee nahi ki aapke saath yahi hoga.',
    languageToggle: 'English',
    clearData: 'Mera saara data hatao',
    clearDataConfirm: 'Is phone par saved sab kuch hat jayega. Aage badhein?',
    privacyNote: 'Sab kuch aapke phone par rehta hai. Login nahi, photo upload nahi, tracking nahi.',
  },
  concerns: {
    hairFall: 'Hair fall',
    thinning: 'Baal patle hona',
    receding: 'Hairline peeche jaana ya crown ka thin hona',
    dandruff: 'Dandruff se jude baal jhadna',
  },
  phases: {
    'settling-in': {
      title: 'Shuruaat ke hafte',
      body: 'Week 1 se 4. Kuch log aam taur par bataate hain ki shuru mein baal zyada jhadte hain. Dar lagna normal hai, aur ye aksar process ka hissa hota hai. Routine jaari rakhein aur dekhte rahein.',
    },
    'shed-settling': {
      title: 'Shedding thamne ka samay',
      body: 'Week 5 se 8. Aam taur par bataya jata hai ki is dauran extra shedding kam hone lagti hai. Abhi result dikhne mein waqt hai, isliye sabr rakhein.',
    },
    'early-signs': {
      title: 'Shuruaati sanket',
      body: 'Week 9 se 11. Kuch log kam baal kanghi ya shower mein dekhte hain. Abhi kuch na dikhna bhi aam baat hai. Pehla honest checkpoint week 12 par aa raha hai.',
    },
    'checkpoint-1': {
      title: 'Checkpoint 1',
      body: 'Week 12. Ab sachchi self-check ka time hai. Apni hi baseline se compare karein, same light, same angle aur same doori se.',
    },
    building: {
      title: 'Dheere dheere sudhaar',
      body: 'Week 13 se 23. Aam taur par dheere dheere badlav bataya jata hai. Kuch logon ko plateau lagta hai. Roz check karne se zyada zaroori hai routine par tikna.',
    },
    'checkpoint-2': {
      title: 'Checkpoint 2',
      body: 'Week 24. Doosri honest self-check. Agar routine par tik kar bhi koi progress nahi dikhe, to doctor se baat karne ka time hai.',
    },
    maintenance: {
      title: 'Maintenance',
      body: 'Week 25 ke baad. Ab maqsad hai jo baal bache hain unhe bacha kar rakhna. Routine steady rakhein aur kuch badle to doctor se milein.',
    },
  },
  shedCheck: {
    title: 'Jhatpat shed check',
    weekQuestion: 'Aap kaun se week mein hain?',
    amountQuestion: 'Aam din ke mukable kitne baal jhad rahe hain?',
    amountOptions: {
      'a-bit-more': 'Thode zyada',
      'clearly-more': 'Saaf taur par zyada',
      'clumps-or-patches': 'Gucche ya ganje patches',
    },
    irritationQuestion: 'Scalp kaisa hai?',
    irritationOptions: { none: 'Koi irritation nahi', mild: 'Halki khujli ya sukhapan', severe: 'Bahut zyada irritation' },
    flagsQuestion: 'Kya inmein se kuch hai?',
    flags: {
      swelling: 'Chehre, hothon ya aankhon par sujan',
      dizziness: 'Chakkar aana',
      chest: 'Seene mein dard ya dhadkan tez hona',
      severeIrritation: 'Scalp par bahut jalan, rash ya tez irritation',
    },
    outcomes: {
      'doctor-now': {
        title: 'Kripya ruk jaayein aur doctor se milein',
        body: 'Jo aap bata rahe hain usme medical dhyan chahiye. Product use karna band karein aur abhi doctor se milein. Seene ke lakshan ya chehre ki sujan ho to turant emergency care lein.',
      },
      'see-doctor-soon': {
        title: 'Jaldi doctor se baat karna theek rahega',
        body: 'Aapke week par aam taur par aisa nahi bataya jata. Doctor scalp dekh kar bata sakte hain ki asli wajah kya hai.',
      },
      'commonly-reported': {
        title: 'Aapke week par aam taur par dekha jata hai',
        body: 'Shuruaati hafton mein extra shedding aam taur par bataai jati hai aur aksar thamti hai. Routine jaari rakhein aur kuch hafte baad phir check karein.',
      },
      'unusual-for-week': {
        title: 'Aapke week ke hisaab se alag hai',
        body: 'Week 12 ke baad zyada shedding aam taur par nahi bataai jati. Wajah jaanne ke liye doctor se baat karein.',
      },
    },
  },
  redFlags: {
    title: 'Ye dikhe to ruk kar doctor se milein',
    intro: 'Ye normal nahi hai. Intezaar na karein.',
    swelling: `Chehre, hothon, jeebh ya aankhon par sujan. ${STOP}`,
    dizziness: `Chakkar aana ya behoshi jaisa lagna. ${STOP}`,
    chest: `Seene mein dard, jakdan ya tez dhadkan. ${STOP}`,
    severeIrritation: `Scalp par bahut zyada irritation, jalan, chhale ya rash. ${STOP}`,
  },
  checkpoint: {
    title: 'Honest checkpoint',
    protocolTitle: 'Check ko fair rakhein',
    protocol: [
      'Same light',
      'Same angle',
      'Same doori',
      'Same hair state (sookhe baal, same parting)',
    ],
    noUploads: 'Apni baseline photos se aankhon se compare karein. Kuch bhi upload nahi hota.',
    questions: {
      lessShedding: 'Kya shuruaat ke mukable kanghi ya shower mein kam baal aa rahe hain?',
      fillIn: 'Kya crown ya hairline bharti hui lag rahi hai?',
      thicker: 'Kya baal pehle se ghane mehsoos hote hain?',
      consistentUse: 'Kya aapne zyadatar dino routine follow kiya?',
      photoBetter: 'Same light ki photos aankhon se dekhne par, kya baseline se behtar lagta hai?',
      newThinning: 'Kya kisi nayi jagah baal patle hote dikhe?',
    },
    answers: { yes: 'Haan', no: 'Nahi', unsure: 'Pata nahi' },
    results: {
      responding: {
        title: 'Lagta hai asar ho raha hai',
        body: 'Kai sanket sahi disha mein hain. Jaari rakhein aur agle checkpoint par phir dekhein.',
      },
      unclear: {
        title: 'Abhi saaf nahi hai',
        body: 'Sanket mile-jule hain. Ye aam baat hai. Routine par tike rahein aur phir check karein, ya pakka jawab ke liye doctor se poochein.',
      },
      'not-responding': {
        title: 'Abhi tak asar nahi dikha',
        body: 'Jo sanket ab tak aam taur par dikhte hain woh aapko nahi dikh rahe. Isme aapki galti nahi hai. Plan review karwane ke liye doctor se milein.',
      },
    },
    lowAdherence: 'Kaafi din routine chhoot gayi. Pehle routine theek karna accha agla kadam hai. Koi dosh nahi, sabke saath hota hai.',
    consultCta: 'Doctor se baat karein',
    doctorSummaryTitle: 'Doctor ko dikhane ke liye summary',
  },
  lapse: {
    title: 'Meri routine chhoot gayi',
    question: 'Kitne din routine chhooti?',
    lapseVsPlateau:
      'Lapse matlab aapne routine rok di. Plateau matlab aap routine par hain par kuch badalta nahi dikh raha. Dono mein alag kadam chahiye.',
    outcomes: {
      'short-gap': {
        title: 'Chhota gap hai, aage badhein',
        body: 'Kuch din chhootna aam baat hai. Bas aaj se phir shuru karein. Double na karein.',
      },
      'lapse-reset-expectations': {
        title: 'Phir shuru karein, umeed reset karein',
        body: 'Lamba gap speed dheemi kar sakta hai. Routine phir shuru karein aur timeline thoda aage khisakne dein. Dobara shuru karne ke liye product label ya doctor ki salah follow karein.',
      },
      'long-gap-consult': {
        title: 'Lamba gap hai, doctor se poochein',
        body: 'Lambe break ke baad dobara shuru karne se pehle doctor se baat karna behtar hai.',
      },
    },
  },
  maintenance: {
    title: 'Maintenance card',
    body: 'Month 6 se maqsad hai jo pa liya use bacha kar rakhna.',
    points: [
      'Routine par tike rahein',
      'Shedding wapas aaye to doctor se milein',
      'Badlav dheere hota hai, achanak nahi',
      'Kabhi kabhi doctor ke saath plan review karein',
    ],
  },
  howToApply: {
    title: 'Kaise lagayein checklist',
    intro: 'Product label ya doctor ki salah follow karein.',
    steps: [
      'Pehle product label padhein',
      'Saaf, sookhe scalp se shuru karein, jab tak label kuch aur na kahe',
      'Jitni matra label ya doctor bataye utni hi lein',
      'Use ke baad haath dho lein',
      'Aankhon se door rakhein',
      'Kuch bhi ajeeb lage to ruk kar doctor se milein',
    ],
    labelNote: 'Ye checklist label ya doctor ki salah ki jagah nahi leti.',
  },
  links: {
    consult: 'Hair test dein aur doctor se milein',
    consent: 'Terms aur conditions',
    privacy: 'Privacy policy',
  },
};
