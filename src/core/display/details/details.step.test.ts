import { InvestigatorError } from '@core/rules';
import { describe, expect, it } from 'vitest';
import { DETAILS_STEPS, DetailsStep, errorStep } from './details.step';

describe('DETAILS_STEPS', () => {
  it('follows the creation order and ends on Summary', () => {
    expect(DETAILS_STEPS).toEqual([
      DetailsStep.basics,
      DetailsStep.occupation,
      DetailsStep.characteristics,
      DetailsStep.skills,
      DetailsStep.summary,
    ]);
  });
});

describe('errorStep', () => {
  it.each([
    [InvestigatorError.nameMissing(), DetailsStep.basics],
    [InvestigatorError.occupationMissing(), DetailsStep.occupation],
    [InvestigatorError.unknownOccupation('x'), DetailsStep.occupation],
    [InvestigatorError.invalidPointCharacteristic(0), DetailsStep.occupation],
    [InvestigatorError.skillChoiceIncomplete(0), DetailsStep.occupation],
    [InvestigatorError.anySkillsIncomplete(), DetailsStep.occupation],
    [InvestigatorError.characteristicMissing('STR'), DetailsStep.characteristics],
    [
      InvestigatorError.characteristicOutOfRange({
        characteristic: 'STR',
        value: 0,
        min: 1,
        max: 99,
      }),
      DetailsStep.characteristics,
    ],
    [InvestigatorError.luckMissing(), DetailsStep.characteristics],
    [InvestigatorError.luckOutOfRange({ value: 0, min: 1, max: 99 }), DetailsStep.characteristics],
    [InvestigatorError.unknownSkill('x'), DetailsStep.skills],
    [InvestigatorError.duplicateSkill('charm'), DetailsStep.skills],
    [
      InvestigatorError.skillBelowBase({ skillId: 'dodge', value: 1, base: 30 }),
      DetailsStep.skills,
    ],
    [
      InvestigatorError.skillAboveMax({ skillId: 'charm', value: 100, max: 99 }),
      DetailsStep.skills,
    ],
    [InvestigatorError.overBudget({ budget: 1, spent: 2 }), DetailsStep.skills],
  ])('sends %o to its step', (error, step) => {
    expect(errorStep(error)).toBe(step);
  });
});
