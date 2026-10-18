import { defineTagged, type TaggedUnionOf } from '@core/common/entities/tagged';
import type { Characteristic, Investigator, OccupationId, SkillId } from '@game-rules/index';
import type { DetailsStep } from './details.step';

export const DetailsAction = defineTagged({
  startLoadInvestigator: (id: string) => ({ id }),
  finishLoadInvestigator: (investigator: Investigator | undefined) => ({ investigator }),
  goToStep: (step: DetailsStep) => ({ step }),

  setName: (name: string) => ({ name }),

  selectOccupation: (occupationId: OccupationId) => ({ occupationId }),
  setPointCharacteristic: (termIndex: number, characteristic: Characteristic) => ({
    termIndex,
    characteristic,
  }),
  setChoiceSkills: (choiceIndex: number, skillIds: SkillId[]) => ({ choiceIndex, skillIds }),
  setAnySkills: (skillIds: SkillId[]) => ({ skillIds }),

  setCharacteristic: (characteristic: Characteristic, value: number | null) => ({
    characteristic,
    value,
  }),
  setLuck: (value: number | null) => ({ value }),

  setSkillValue: (skillId: SkillId, value: number | null) => ({ skillId, value }),

  startSave: () => ({}),
  finishSave: (investigator: Investigator) => ({ investigator }),
  failSave: () => ({}),
  resetCommand: () => ({}),
});

export type DetailsActions = TaggedUnionOf<typeof DetailsAction>;
