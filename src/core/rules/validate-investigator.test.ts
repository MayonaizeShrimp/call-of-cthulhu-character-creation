import { createTestInvestigator, type Investigator } from '@game-rules/index';
import { describe, expect, it } from 'vitest';
import { InvestigatorError } from './investigator-error';
import { validateInvestigator } from './validate-investigator';

const valid = createTestInvestigator();
const withOccupation = (occupation: Partial<Investigator['occupation']>) =>
  createTestInvestigator({ occupation: { ...valid.occupation, ...occupation } });

describe('validateInvestigator', () => {
  it('accepts a valid investigator', () => {
    expect(validateInvestigator(valid)).toEqual([]);
  });

  it('requires a name', () => {
    expect(validateInvestigator(createTestInvestigator({ name: '  ' }))).toEqual([
      InvestigatorError.nameMissing(),
    ]);
  });

  describe('characteristics', () => {
    it('accepts any values within 1–99, with no point-buy total', () => {
      const investigator = createTestInvestigator({
        characteristics: { ...valid.characteristics, STR: 1, CON: 99 },
      });
      expect(validateInvestigator(investigator)).toEqual([]);
    });

    it('limits each characteristic to 1–99', () => {
      const investigator = createTestInvestigator({
        characteristics: { ...valid.characteristics, STR: 0, CON: 100 },
      });
      expect(validateInvestigator(investigator)).toEqual([
        InvestigatorError.characteristicOutOfRange({
          characteristic: 'STR',
          value: 0,
          min: 1,
          max: 99,
        }),
        InvestigatorError.characteristicOutOfRange({
          characteristic: 'CON',
          value: 100,
          min: 1,
          max: 99,
        }),
      ]);
    });

    it('limits luck to 1–99', () => {
      expect(validateInvestigator(createTestInvestigator({ luck: 100 }))).toEqual([
        InvestigatorError.luckOutOfRange({ value: 100, min: 1, max: 99 }),
      ]);
    });
  });

  describe('skills', () => {
    it('rejects unknown and duplicate skills', () => {
      const investigator = createTestInvestigator({
        skills: [
          { skillId: 'cthulhu-mythos' as never, value: 10 },
          { skillId: 'charm', value: 20 },
          { skillId: 'charm', value: 25 },
        ],
      });
      expect(validateInvestigator(investigator)).toEqual([
        InvestigatorError.unknownSkill('cthulhu-mythos'),
        InvestigatorError.duplicateSkill('charm'),
      ]);
    });

    it('keeps values between the base and 99', () => {
      const investigator = createTestInvestigator({
        skills: [
          { skillId: 'dodge', value: 20 }, // base DEX 60 / 2 = 30
          { skillId: 'charm', value: 100 },
        ],
      });
      expect(validateInvestigator(investigator)).toEqual([
        InvestigatorError.skillBelowBase({ skillId: 'dodge', value: 20, base: 30 }),
        InvestigatorError.skillAboveMax({ skillId: 'charm', value: 100, max: 99 }),
        // charm 15 → 100 = 85 points, under the 400 budget
      ]);
    });
  });

  describe('occupation', () => {
    it('rejects an unknown occupation', () => {
      const investigator = withOccupation({ occupationId: 'pirate' as never });
      expect(validateInvestigator(investigator)).toEqual([
        InvestigatorError.unknownOccupation('pirate'),
      ]);
    });

    it('requires an allowed characteristic for each formula term', () => {
      expect(validateInvestigator(withOccupation({ pointCharacteristics: ['APP'] }))).toEqual([
        InvestigatorError.invalidPointCharacteristic(0),
      ]);
      expect(validateInvestigator(withOccupation({ pointCharacteristics: [] }))).toEqual([
        InvestigatorError.invalidPointCharacteristic(0),
      ]);
    });

    it.each([
      ['too few picks', [[]]],
      ['too many picks', [['persuade', 'charm']]],
      ['a pick outside the options', [['history']]],
      ['a missing choice group', []],
    ])('rejects a skill choice with %s', (_, choiceSkillIds) => {
      const investigator = withOccupation({ choiceSkillIds: choiceSkillIds as never });
      expect(validateInvestigator(investigator)).toContainEqual(
        InvestigatorError.skillChoiceIncomplete(0),
      );
    });

    it.each([
      ['too few picks', ['spot-hidden']],
      ['duplicate picks', ['spot-hidden', 'spot-hidden']],
      ['a pick that is already an occupation skill', ['spot-hidden', 'library-use']],
      ['a pick that is already a chosen skill', ['spot-hidden', 'persuade']],
      ['an unknown skill', ['spot-hidden', 'cthulhu-mythos']],
    ])('rejects "any other" skills with %s', (_, anySkillIds) => {
      const investigator = withOccupation({ anySkillIds: anySkillIds as never });
      expect(validateInvestigator(investigator)).toEqual([InvestigatorError.anySkillsIncomplete()]);
    });
  });

  it('rejects spending more skill points than the budget', () => {
    // Budget 400 (EDU 70 × 4 + INT 60 × 2). Five skills raised to 99 spend more than that.
    const investigator = createTestInvestigator({
      skills: [
        { skillId: 'charm', value: 99 }, // 84
        { skillId: 'history', value: 99 }, // 94
        { skillId: 'law', value: 99 }, // 94
        { skillId: 'occult', value: 99 }, // 94
        { skillId: 'appraise', value: 99 }, // 94
      ],
    });
    expect(validateInvestigator(investigator)).toEqual([
      InvestigatorError.overBudget({ budget: 400, spent: 460 }),
    ]);
  });
});
