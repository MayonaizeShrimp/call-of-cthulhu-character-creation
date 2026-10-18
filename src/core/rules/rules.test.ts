import { createTestInvestigator, type Skill } from '@game-rules/index';
import { describe, expect, it } from 'vitest';
import { skillPointsBudget, skillPointsSpent } from './budget';
import {
  findOccupation,
  occupationSkillIds,
  occupationSkillPoints,
  personalInterestPoints,
} from './occupations';
import { extremeValue, hardValue } from './roll-values';
import { findSkill, skillBase, skillValue } from './skills';

const investigator = createTestInvestigator();
const { characteristics } = investigator; // DEX 60, STR 50, INT 60, EDU 70

const skill = (id: string): Skill => {
  const found = findSkill(id);
  if (!found) throw new Error(`Unknown skill ${id}`);
  return found;
};

describe('roll values', () => {
  it('rounds hard (½) and extreme (⅕) down', () => {
    expect(hardValue(55)).toBe(27);
    expect(extremeValue(55)).toBe(11);
    expect(hardValue(1)).toBe(0);
  });
});

describe('skills', () => {
  it('uses fixed bases', () => {
    expect(skillBase(skill('accounting'), characteristics)).toBe(5);
  });

  it('derives Dodge from DEX ÷ 2 (rounded down) and Language (Own) from EDU', () => {
    expect(skillBase(skill('dodge'), characteristics)).toBe(30);
    expect(skillBase(skill('dodge'), { ...characteristics, DEX: 55 })).toBe(27);
    expect(skillBase(skill('language-own'), characteristics)).toBe(70);
  });

  it('returns the selected value, or the base when the skill was not raised', () => {
    const withCharm = createTestInvestigator({ skills: [{ skillId: 'charm', value: 60 }] });
    expect(skillValue(withCharm, 'charm')).toBe(60);
    expect(skillValue(withCharm, 'dodge')).toBe(30);
  });
});

describe('occupations', () => {
  const jurnalistik = findOccupation('jurnalistik');
  const sepakBola = findOccupation('sepak-bola');

  it('computes a single-characteristic formula (EDU × 4)', () => {
    if (!jurnalistik) throw new Error('missing jurnalistik');
    expect(occupationSkillPoints(jurnalistik, characteristics, ['EDU'])).toBe(280);
  });

  it('uses the chosen characteristic for a choice formula (EDU × 2 + DEX/STR × 2)', () => {
    if (!sepakBola) throw new Error('missing sepak-bola');
    expect(occupationSkillPoints(sepakBola, characteristics, ['EDU', 'DEX'])).toBe(260);
    expect(occupationSkillPoints(sepakBola, characteristics, ['EDU', 'STR'])).toBe(240);
  });

  it('ignores a choice that is not allowed for that term', () => {
    if (!sepakBola) throw new Error('missing sepak-bola');
    expect(occupationSkillPoints(sepakBola, characteristics, ['EDU', 'APP'])).toBe(140);
  });

  it('gives INT × 2 personal interest points', () => {
    expect(personalInterestPoints(characteristics)).toBe(120);
  });

  it('lists fixed occupation skills plus all picks', () => {
    expect(occupationSkillIds(investigator.occupation).sort()).toEqual(
      [
        'art-craft-writing',
        'art-craft-photography',
        'library-use',
        'psychology',
        'computer-use',
        'persuade',
        'spot-hidden',
        'listen',
      ].sort(),
    );
  });
});

describe('budget', () => {
  it('combines occupation and personal interest points', () => {
    expect(skillPointsBudget(investigator)).toBe(400);
  });

  it('counts points spent above each base', () => {
    const raised = createTestInvestigator({
      skills: [
        { skillId: 'charm', value: 45 }, // base 15 → 30
        { skillId: 'dodge', value: 40 }, // base DEX/2 = 30 → 10
      ],
    });
    expect(skillPointsSpent(raised)).toBe(40);
  });
});
