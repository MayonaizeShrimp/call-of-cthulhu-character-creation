import { CHARACTERISTICS, createTestInvestigator, type InvestigatorDraft } from '@game-rules/index';
import { describe, expect, it } from 'vitest';
import {
  createEmptyDraft,
  draftFromInvestigator,
  draftOccupationSkillPoints,
  draftPersonalInterestPoints,
  draftSkillBase,
  draftSkillPointsBudget,
  draftSkillPointsSpent,
  draftToInvestigator,
  validateDraft,
} from './investigator-draft';
import { InvestigatorError } from './investigator-error';
import { findSkill } from './skills';

const investigator = createTestInvestigator();
const completeDraft = (): InvestigatorDraft => draftFromInvestigator(investigator);

describe('investigator drafts', () => {
  it('starts empty', () => {
    const draft = createEmptyDraft();
    expect(draft.name).toBe('');
    expect(draft.occupation).toBeNull();
    expect(draft.luck).toBeNull();
    expect(draft.skills).toEqual([]);
    for (const characteristic of CHARACTERISTICS) {
      expect(draft.characteristics[characteristic]).toBeNull();
    }
  });

  it('round-trips an investigator (minus its id)', () => {
    const { id: _, ...data } = investigator;
    expect(draftToInvestigator(completeDraft())).toEqual(data);
  });

  it.each([
    ['the occupation', { occupation: null }],
    ['a characteristic', { characteristics: { ...investigator.characteristics, POW: null } }],
    ['Luck', { luck: null }],
  ])('is incomplete without %s', (_, missing) => {
    expect(draftToInvestigator({ ...completeDraft(), ...missing })).toBeUndefined();
  });

  describe('validateDraft', () => {
    it('lists every missing piece of an empty draft', () => {
      expect(validateDraft(createEmptyDraft())).toEqual([
        InvestigatorError.nameMissing(),
        InvestigatorError.occupationMissing(),
        ...CHARACTERISTICS.map((characteristic) =>
          InvestigatorError.characteristicMissing(characteristic),
        ),
        InvestigatorError.luckMissing(),
      ]);
    });

    it('applies the full rules once the draft is complete', () => {
      expect(validateDraft(completeDraft())).toEqual([]);
      expect(validateDraft({ ...completeDraft(), luck: 0 })).toEqual([
        InvestigatorError.luckOutOfRange({ value: 0, min: 1, max: 99 }),
      ]);
    });
  });

  describe('live numbers for incomplete drafts', () => {
    const dodge = findSkill('dodge');

    it('treats missing characteristics as 0', () => {
      const draft = createEmptyDraft();
      if (!dodge) throw new Error('missing dodge');
      expect(draftSkillBase(draft, dodge)).toBe(0);
      expect(draftSkillPointsBudget(draft)).toBe(0);
    });

    it('counts personal interest points before an occupation is chosen', () => {
      const draft = { ...completeDraft(), occupation: null };
      expect(draftSkillPointsBudget(draft)).toBe(120); // INT 60 × 2
      expect(draftOccupationSkillPoints(draft)).toBe(0);
    });

    it('splits the budget into occupation and personal interest points', () => {
      expect(draftOccupationSkillPoints(completeDraft())).toBe(280); // EDU 70 × 4
      expect(draftPersonalInterestPoints(completeDraft())).toBe(120);
    });

    it('matches the complete-investigator numbers once everything is filled in', () => {
      const draft = { ...completeDraft(), skills: [{ skillId: 'charm' as const, value: 45 }] };
      if (!dodge) throw new Error('missing dodge');
      expect(draftSkillBase(draft, dodge)).toBe(30);
      expect(draftSkillPointsBudget(draft)).toBe(400);
      expect(draftSkillPointsSpent(draft)).toBe(30);
    });
  });
});
