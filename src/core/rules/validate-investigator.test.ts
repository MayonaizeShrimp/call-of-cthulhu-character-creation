import { CharacteristicMethod, createTestInvestigator, type Investigator } from '@game-rules/index';
import { describe, expect, it } from 'vitest';
import { InvestigatorError } from './investigator-error';
import { validateInvestigator } from './validate-investigator';

const pointBuy = { characteristicMethod: CharacteristicMethod.pointBuy };
const manual = { characteristicMethod: CharacteristicMethod.manual };

const valid = createTestInvestigator();
const withOccupation = (occupation: Partial<Investigator['occupation']>) =>
  createTestInvestigator({ occupation: { ...valid.occupation, ...occupation } });

describe('validateInvestigator', () => {
  it('accepts a valid investigator with either characteristic method', () => {
    expect(validateInvestigator(valid, pointBuy)).toEqual([]);
    expect(validateInvestigator(valid, manual)).toEqual([]);
  });

  it('requires a name', () => {
    expect(validateInvestigator(createTestInvestigator({ name: '  ' }), manual)).toEqual([
      InvestigatorError.nameMissing(),
    ]);
  });

  describe('characteristics', () => {
    it('limits point-buy values to 15–90 and the total to exactly 460', () => {
      const investigator = createTestInvestigator({
        characteristics: { ...valid.characteristics, STR: 10, CON: 95 }, // total 460 - 40 + 35 = 455
      });
      expect(validateInvestigator(investigator, pointBuy)).toEqual([
        InvestigatorError.characteristicOutOfRange({
          characteristic: 'STR',
          value: 10,
          min: 15,
          max: 90,
        }),
        InvestigatorError.characteristicOutOfRange({
          characteristic: 'CON',
          value: 95,
          min: 15,
          max: 90,
        }),
        InvestigatorError.pointBuyTotalMismatch({ expected: 460, actual: 455 }),
      ]);
    });

    it('only requires 1–99 for manually entered values, with no total', () => {
      const investigator = createTestInvestigator({
        characteristics: { ...valid.characteristics, STR: 10, CON: 95 },
      });
      expect(validateInvestigator(investigator, manual)).toEqual([]);

      const outOfRange = createTestInvestigator({
        characteristics: { ...valid.characteristics, STR: 0 },
      });
      expect(validateInvestigator(outOfRange, manual)).toEqual([
        InvestigatorError.characteristicOutOfRange({
          characteristic: 'STR',
          value: 0,
          min: 1,
          max: 99,
        }),
      ]);
    });

    it('limits luck to 1–99', () => {
      expect(validateInvestigator(createTestInvestigator({ luck: 100 }), manual)).toEqual([
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
      expect(validateInvestigator(investigator, manual)).toEqual([
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
      expect(validateInvestigator(investigator, manual)).toEqual([
        InvestigatorError.skillBelowBase({ skillId: 'dodge', value: 20, base: 30 }),
        InvestigatorError.skillAboveMax({ skillId: 'charm', value: 100, max: 99 }),
        // charm 15 → 100 = 85 points, under the 400 budget
      ]);
    });
  });

  describe('occupation', () => {
    it('rejects an unknown occupation', () => {
      const investigator = withOccupation({ occupationId: 'pirate' as never });
      expect(validateInvestigator(investigator, manual)).toEqual([
        InvestigatorError.unknownOccupation('pirate'),
      ]);
    });

    it('requires an allowed characteristic for each formula term', () => {
      expect(
        validateInvestigator(withOccupation({ pointCharacteristics: ['APP'] }), manual),
      ).toEqual([InvestigatorError.invalidPointCharacteristic(0)]);
      expect(validateInvestigator(withOccupation({ pointCharacteristics: [] }), manual)).toEqual([
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
      expect(validateInvestigator(investigator, manual)).toContainEqual(
        InvestigatorError.skillChoiceIncomplete(0),
      );
    });

    it.each([
      ['too few picks', ['spot-hidden']],
      ['duplicate picks', ['spot-hidden', 'spot-hidden']],
      ['a pick that is already an occupation skill', ['spot-hidden', 'history']],
      ['a pick that is already a chosen skill', ['spot-hidden', 'persuade']],
      ['an unknown skill', ['spot-hidden', 'cthulhu-mythos']],
    ])('rejects "any other" skills with %s', (_, anySkillIds) => {
      const investigator = withOccupation({ anySkillIds: anySkillIds as never });
      expect(validateInvestigator(investigator, manual)).toEqual([
        InvestigatorError.anySkillsIncomplete(),
      ]);
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
    expect(validateInvestigator(investigator, manual)).toEqual([
      InvestigatorError.overBudget({ budget: 400, spent: 460 }),
    ]);
  });
});
