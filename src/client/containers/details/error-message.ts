import { findSkill, InvestigatorError, type InvestigatorErrors } from '@core/rules';
import { match } from 'ts-pattern';

const skillName = (skillId: string) => findSkill(skillId)?.name ?? skillId;
const ordinal = (index: number) => ['first', 'second', 'third', 'fourth'][index] ?? `#${index + 1}`;

export const investigatorErrorMessage = (error: InvestigatorErrors): string =>
  match(error)
    .returnType<string>()
    .with({ type: InvestigatorError.nameMissing.type }, () => 'Give your investigator a name.')
    .with({ type: InvestigatorError.occupationMissing.type }, () => 'Choose an occupation.')
    .with(
      { type: InvestigatorError.unknownOccupation.type },
      ({ occupationId }) => `Occupation "${occupationId}" no longer exists; choose another.`,
    )
    .with(
      { type: InvestigatorError.invalidPointCharacteristic.type },
      ({ termIndex }) => `Choose which characteristic the ${ordinal(termIndex)} formula term uses.`,
    )
    .with(
      { type: InvestigatorError.skillChoiceIncomplete.type },
      ({ choiceIndex }) => `Finish the ${ordinal(choiceIndex)} occupation skill choice.`,
    )
    .with(
      { type: InvestigatorError.anySkillsIncomplete.type },
      () => 'Pick the remaining occupation skills of your choice.',
    )
    .with(
      { type: InvestigatorError.characteristicMissing.type },
      ({ characteristic }) => `Enter ${characteristic}.`,
    )
    .with(
      { type: InvestigatorError.characteristicOutOfRange.type },
      ({ characteristic, min, max }) => `${characteristic} must be between ${min} and ${max}.`,
    )
    .with({ type: InvestigatorError.luckMissing.type }, () => 'Enter Luck.')
    .with(
      { type: InvestigatorError.luckOutOfRange.type },
      ({ min, max }) => `Luck must be between ${min} and ${max}.`,
    )
    .with(
      { type: InvestigatorError.unknownSkill.type },
      ({ skillId }) => `"${skillId}" is not a skill in this campaign; remove it.`,
    )
    .with(
      { type: InvestigatorError.duplicateSkill.type },
      ({ skillId }) => `${skillName(skillId)} is listed twice.`,
    )
    .with(
      { type: InvestigatorError.skillBelowBase.type },
      ({ skillId, base }) => `${skillName(skillId)} can't be lower than its base (${base}).`,
    )
    .with(
      { type: InvestigatorError.skillAboveMax.type },
      ({ skillId, max }) => `${skillName(skillId)} can't be higher than ${max}.`,
    )
    .with(
      { type: InvestigatorError.overBudget.type },
      ({ budget, spent }) => `Spent ${spent} of ${budget} skill points.`,
    )
    .exhaustive();
