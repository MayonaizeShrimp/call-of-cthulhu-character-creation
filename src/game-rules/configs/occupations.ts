import type { Occupation } from '../entities/occupation';

// Personal interest skill points = INT × this.
export const PERSONAL_INTEREST_MULTIPLIER = 2;

const INTERPERSONAL_SKILLS = ['charm', 'fast-talk', 'intimidate', 'persuade'] as const;

// Examples covering every occupation feature; replace with the campaign's homebrew occupations.
export const OCCUPATIONS = [
  {
    id: 'journalist',
    name: 'Journalist',
    skillPoints: [{ anyOf: ['EDU'], multiplier: 4 }],
    skills: ['art-craft-photography', 'history', 'library-use', 'language-own', 'psychology'],
    skillChoices: [{ options: INTERPERSONAL_SKILLS, count: 1 }],
    anySkills: 2,
  },
  {
    id: 'police-detective',
    name: 'Police Detective',
    skillPoints: [
      { anyOf: ['EDU'], multiplier: 2 },
      { anyOf: ['DEX', 'STR'], multiplier: 2 },
    ],
    skills: ['firearms-handgun', 'law', 'listen', 'psychology', 'spot-hidden'],
    skillChoices: [
      { options: ['art-craft-acting', 'disguise'], count: 1 },
      { options: INTERPERSONAL_SKILLS, count: 1 },
    ],
    anySkills: 1,
  },
] as const satisfies readonly Occupation[];

export type OccupationId = (typeof OCCUPATIONS)[number]['id'];
