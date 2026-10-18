import { defineTagged, type TaggedUnionOf } from '@core/common/entities/tagged';
import type { Characteristic } from '@game-rules/index';

// Why an investigator can't be saved. Each creator's key is its `type`.
export const InvestigatorError = defineTagged({
  nameMissing: () => ({}),
  occupationMissing: () => ({}),
  characteristicMissing: (characteristic: Characteristic) => ({ characteristic }),
  luckMissing: () => ({}),
  characteristicOutOfRange: (details: {
    characteristic: Characteristic;
    value: number;
    min: number;
    max: number;
  }) => details,
  luckOutOfRange: (details: { value: number; min: number; max: number }) => details,
  unknownSkill: (skillId: string) => ({ skillId }),
  duplicateSkill: (skillId: string) => ({ skillId }),
  skillBelowBase: (details: { skillId: string; value: number; base: number }) => details,
  skillAboveMax: (details: { skillId: string; value: number; max: number }) => details,
  unknownOccupation: (occupationId: string) => ({ occupationId }),
  invalidPointCharacteristic: (termIndex: number) => ({ termIndex }),
  skillChoiceIncomplete: (choiceIndex: number) => ({ choiceIndex }),
  anySkillsIncomplete: () => ({}),
  overBudget: (details: { budget: number; spent: number }) => details,
});

export type InvestigatorErrors = TaggedUnionOf<typeof InvestigatorError>;
