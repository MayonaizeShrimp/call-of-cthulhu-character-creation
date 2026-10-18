import type { Occupation } from '../entities/occupation';

// Personal interest skill points = INT × this.
export const PERSONAL_INTEREST_MULTIPLIER = 2;

const INTERPERSONAL_SKILLS = ['charm', 'fast-talk', 'intimidate', 'persuade'] as const;

// Every investigator is an OSIS member; their occupation is their extracurricular (ekskul).
// Each has 5 fixed skills, one "choose 1" group and 2 free picks: 8 occupation skills, as in 7e.
export const OCCUPATIONS = [
  // Sports
  {
    id: 'sepak-bola',
    name: 'Sepak Bola / Futsal (Football)',
    skillPoints: [
      { anyOf: ['EDU'], multiplier: 2 },
      { anyOf: ['DEX', 'STR'], multiplier: 2 },
    ],
    skills: ['dodge', 'jump', 'climb', 'first-aid', 'spot-hidden'],
    skillChoices: [{ options: INTERPERSONAL_SKILLS, count: 1 }],
    anySkills: 2,
  },
  {
    id: 'basket',
    name: 'Basket (Basketball)',
    skillPoints: [
      { anyOf: ['EDU'], multiplier: 2 },
      { anyOf: ['DEX', 'STR'], multiplier: 2 },
    ],
    skills: ['dodge', 'jump', 'throw', 'climb', 'spot-hidden'],
    skillChoices: [{ options: INTERPERSONAL_SKILLS, count: 1 }],
    anySkills: 2,
  },
  {
    id: 'pencak-silat',
    name: 'Pencak Silat (Martial Arts)',
    skillPoints: [
      { anyOf: ['EDU'], multiplier: 2 },
      { anyOf: ['STR', 'DEX'], multiplier: 2 },
    ],
    skills: ['fighting-brawl', 'dodge', 'jump', 'climb', 'intimidate'],
    skillChoices: [{ options: ['fighting-sword', 'fighting-spear', 'throw'], count: 1 }],
    anySkills: 2,
  },
  {
    id: 'paskibra',
    name: 'Paskibra (Flag-raising Troop)',
    skillPoints: [
      { anyOf: ['EDU'], multiplier: 2 },
      { anyOf: ['STR', 'CON'], multiplier: 2 },
    ],
    skills: ['listen', 'spot-hidden', 'jump', 'climb', 'intimidate'],
    skillChoices: [{ options: ['charm', 'persuade'], count: 1 }],
    anySkills: 2,
  },

  // Academic
  {
    id: 'catur',
    name: 'Catur (Chess)',
    skillPoints: [
      { anyOf: ['EDU'], multiplier: 2 },
      { anyOf: ['INT'], multiplier: 2 },
    ],
    skills: ['science-mathematics', 'psychology', 'spot-hidden', 'library-use', 'history'],
    skillChoices: [{ options: INTERPERSONAL_SKILLS, count: 1 }],
    anySkills: 2,
  },
  {
    id: 'kir',
    name: 'KIR (Science Club)',
    skillPoints: [{ anyOf: ['EDU'], multiplier: 4 }],
    skills: [
      'science-biology',
      'science-chemistry',
      'science-physics',
      'library-use',
      'computer-use',
    ],
    skillChoices: [{ options: ['science-mathematics', 'natural-world', 'electronics'], count: 1 }],
    anySkills: 2,
  },
  {
    id: 'robotik',
    name: 'Robotik (Robotics & Coding)',
    skillPoints: [{ anyOf: ['EDU'], multiplier: 4 }],
    skills: [
      'computer-use',
      'electronics',
      'electrical-repair',
      'mechanical-repair',
      'science-mathematics',
    ],
    skillChoices: [
      { options: ['science-physics', 'locksmith', 'operate-heavy-machinery'], count: 1 },
    ],
    anySkills: 2,
  },
  {
    id: 'jurnalistik',
    name: 'Jurnalistik (School Press)',
    skillPoints: [{ anyOf: ['EDU'], multiplier: 4 }],
    skills: [
      'art-craft-writing',
      'art-craft-photography',
      'library-use',
      'psychology',
      'computer-use',
    ],
    skillChoices: [{ options: INTERPERSONAL_SKILLS, count: 1 }],
    anySkills: 2,
  },
  {
    id: 'english-club',
    name: 'English Club / Debat (English & Debate)',
    skillPoints: [
      { anyOf: ['EDU'], multiplier: 2 },
      { anyOf: ['APP', 'INT'], multiplier: 2 },
    ],
    skills: ['language-english', 'persuade', 'fast-talk', 'library-use', 'psychology'],
    skillChoices: [{ options: ['charm', 'intimidate', 'history'], count: 1 }],
    anySkills: 2,
  },

  // Outdoor & service
  {
    id: 'pramuka',
    name: 'Pramuka (Scouts)',
    skillPoints: [
      { anyOf: ['EDU'], multiplier: 2 },
      { anyOf: ['CON', 'DEX'], multiplier: 2 },
    ],
    skills: ['survival-jungle', 'navigate', 'first-aid', 'track', 'climb'],
    skillChoices: [{ options: ['natural-world', 'swim', 'mechanical-repair'], count: 1 }],
    anySkills: 2,
  },
  {
    id: 'pecinta-alam',
    name: 'Pecinta Alam (Nature Lovers)',
    skillPoints: [
      { anyOf: ['EDU'], multiplier: 2 },
      { anyOf: ['CON'], multiplier: 2 },
    ],
    skills: ['climb', 'survival-mountain', 'navigate', 'natural-world', 'first-aid'],
    skillChoices: [{ options: ['swim', 'track', 'survival-jungle'], count: 1 }],
    anySkills: 2,
  },
  {
    id: 'pmr',
    name: 'PMR (Youth Red Cross)',
    skillPoints: [{ anyOf: ['EDU'], multiplier: 4 }],
    skills: ['first-aid', 'medicine', 'psychology', 'science-biology', 'listen'],
    skillChoices: [{ options: ['charm', 'persuade'], count: 1 }],
    anySkills: 2,
  },
  {
    // Rohis, Rohkris and the other faith-based clubs.
    id: 'kerohanian',
    name: 'Kerohanian (Religious Club)',
    skillPoints: [
      { anyOf: ['EDU'], multiplier: 2 },
      { anyOf: ['POW'], multiplier: 2 },
    ],
    skills: ['persuade', 'psychology', 'history', 'library-use', 'listen'],
    skillChoices: [{ options: ['charm', 'first-aid', 'language-arabic'], count: 1 }],
    anySkills: 2,
  },

  // Arts
  {
    id: 'teater',
    name: 'Teater (Drama)',
    skillPoints: [
      { anyOf: ['EDU'], multiplier: 2 },
      { anyOf: ['APP'], multiplier: 2 },
    ],
    skills: ['art-craft-acting', 'disguise', 'psychology', 'fast-talk', 'listen'],
    skillChoices: [{ options: ['charm', 'persuade', 'sleight-of-hand'], count: 1 }],
    anySkills: 2,
  },
  {
    id: 'fotografi',
    name: 'Fotografi & Sinematografi (Photography & Film)',
    skillPoints: [
      { anyOf: ['EDU'], multiplier: 2 },
      { anyOf: ['DEX'], multiplier: 2 },
    ],
    skills: ['art-craft-photography', 'computer-use', 'electronics', 'spot-hidden', 'stealth'],
    skillChoices: [{ options: ['charm', 'fast-talk', 'persuade'], count: 1 }],
    anySkills: 2,
  },
  {
    id: 'tari-tradisional',
    name: 'Tari Tradisional (Traditional Dance)',
    skillPoints: [
      { anyOf: ['EDU'], multiplier: 2 },
      { anyOf: ['APP', 'DEX'], multiplier: 2 },
    ],
    skills: ['art-craft-dance', 'jump', 'dodge', 'history', 'listen'],
    skillChoices: [{ options: ['charm', 'persuade', 'stealth'], count: 1 }],
    anySkills: 2,
  },
  {
    id: 'musik',
    name: 'Band & Paduan Suara (Music)',
    skillPoints: [
      { anyOf: ['EDU'], multiplier: 2 },
      { anyOf: ['APP', 'POW'], multiplier: 2 },
    ],
    skills: ['art-craft-music', 'listen', 'psychology', 'charm', 'electronics'],
    skillChoices: [{ options: ['fast-talk', 'persuade', 'art-craft-dance'], count: 1 }],
    anySkills: 2,
  },
  {
    id: 'tata-boga',
    name: 'Tata Boga (Cooking)',
    skillPoints: [
      { anyOf: ['EDU'], multiplier: 2 },
      { anyOf: ['DEX', 'INT'], multiplier: 2 },
    ],
    skills: ['art-craft-cooking', 'science-chemistry', 'natural-world', 'appraise', 'first-aid'],
    skillChoices: [{ options: ['charm', 'persuade', 'fast-talk'], count: 1 }],
    anySkills: 2,
  },
] as const satisfies readonly Occupation[];

export type OccupationId = (typeof OCCUPATIONS)[number]['id'];
