import { InvestigatorError, type InvestigatorErrors } from '@core/rules';
import { match, P } from 'ts-pattern';

export const DetailsStep = {
  basics: 'basics',
  occupation: 'occupation',
  characteristics: 'characteristics',
  skills: 'skills',
  summary: 'summary',
} as const;

export type DetailsStep = (typeof DetailsStep)[keyof typeof DetailsStep];

export const DETAILS_STEPS = [
  DetailsStep.basics,
  DetailsStep.occupation,
  DetailsStep.characteristics,
  DetailsStep.skills,
  DetailsStep.summary,
] as const;

// The wizard step where a problem gets fixed.
export const errorStep = (error: InvestigatorErrors): DetailsStep =>
  match(error)
    .returnType<DetailsStep>()
    .with({ type: InvestigatorError.nameMissing.type }, () => DetailsStep.basics)
    .with(
      {
        type: P.union(
          InvestigatorError.occupationMissing.type,
          InvestigatorError.unknownOccupation.type,
          InvestigatorError.invalidPointCharacteristic.type,
          InvestigatorError.skillChoiceIncomplete.type,
          InvestigatorError.anySkillsIncomplete.type,
        ),
      },
      () => DetailsStep.occupation,
    )
    .with(
      {
        type: P.union(
          InvestigatorError.characteristicMissing.type,
          InvestigatorError.characteristicOutOfRange.type,
          InvestigatorError.luckMissing.type,
          InvestigatorError.luckOutOfRange.type,
        ),
      },
      () => DetailsStep.characteristics,
    )
    .with(
      {
        type: P.union(
          InvestigatorError.unknownSkill.type,
          InvestigatorError.duplicateSkill.type,
          InvestigatorError.skillBelowBase.type,
          InvestigatorError.skillAboveMax.type,
          InvestigatorError.overBudget.type,
        ),
      },
      () => DetailsStep.skills,
    )
    .exhaustive();
