import {
  CHARACTERISTICS,
  CharacteristicMethod,
  type Investigator,
  LUCK_RANGE,
  MANUAL_RANGE,
  type Occupation,
  POINT_BUY,
  type SelectedOccupation,
  SKILL_MAX,
} from '@game-rules/index';
import { skillPointsBudget, skillPointsSpent } from './budget';
import { InvestigatorError, type InvestigatorErrors } from './investigator-error';
import { findOccupation } from './occupations';
import { findSkill, skillBase } from './skills';

type ValidationOptions = {
  characteristicMethod: CharacteristicMethod;
};

const inRange = (value: number, { min, max }: { min: number; max: number }) =>
  value >= min && value <= max;

const hasDuplicates = (values: readonly string[]) => new Set(values).size !== values.length;

const validateCharacteristics = (
  investigator: Investigator,
  { characteristicMethod }: ValidationOptions,
): InvestigatorErrors[] => {
  const range = characteristicMethod === CharacteristicMethod.pointBuy ? POINT_BUY : MANUAL_RANGE;
  const errors: InvestigatorErrors[] = CHARACTERISTICS.filter(
    (characteristic) => !inRange(investigator.characteristics[characteristic], range),
  ).map((characteristic) =>
    InvestigatorError.characteristicOutOfRange({
      characteristic,
      value: investigator.characteristics[characteristic],
      min: range.min,
      max: range.max,
    }),
  );

  if (characteristicMethod === CharacteristicMethod.pointBuy) {
    const actual = CHARACTERISTICS.reduce(
      (total, characteristic) => total + investigator.characteristics[characteristic],
      0,
    );
    if (actual !== POINT_BUY.total) {
      errors.push(InvestigatorError.pointBuyTotalMismatch({ expected: POINT_BUY.total, actual }));
    }
  }

  if (!inRange(investigator.luck, LUCK_RANGE)) {
    errors.push(InvestigatorError.luckOutOfRange({ value: investigator.luck, ...LUCK_RANGE }));
  }

  return errors;
};

const validateSkills = (investigator: Investigator): InvestigatorErrors[] => {
  const errors: InvestigatorErrors[] = [];
  const seen = new Set<string>();

  for (const { skillId, value } of investigator.skills) {
    if (seen.has(skillId)) {
      errors.push(InvestigatorError.duplicateSkill(skillId));
      continue;
    }
    seen.add(skillId);

    const skill = findSkill(skillId);
    if (!skill) {
      errors.push(InvestigatorError.unknownSkill(skillId));
      continue;
    }

    const base = skillBase(skill, investigator.characteristics);
    if (value < base) errors.push(InvestigatorError.skillBelowBase({ skillId, value, base }));
    if (value > SKILL_MAX) {
      errors.push(InvestigatorError.skillAboveMax({ skillId, value, max: SKILL_MAX }));
    }
  }

  return errors;
};

const validateOccupationPicks = (
  occupation: Occupation,
  selected: SelectedOccupation,
): InvestigatorErrors[] => {
  const errors: InvestigatorErrors[] = [];

  occupation.skillPoints.forEach((term, termIndex) => {
    const chosen = selected.pointCharacteristics[termIndex];
    if (chosen === undefined || !term.anyOf.includes(chosen)) {
      errors.push(InvestigatorError.invalidPointCharacteristic(termIndex));
    }
  });

  occupation.skillChoices.forEach((choice, choiceIndex) => {
    const picks = selected.choiceSkillIds[choiceIndex] ?? [];
    const valid =
      picks.length === choice.count &&
      !hasDuplicates(picks) &&
      picks.every((skillId) => choice.options.includes(skillId));
    if (!valid) errors.push(InvestigatorError.skillChoiceIncomplete(choiceIndex));
  });

  // "Any other" picks must be real skills that aren't already occupation skills.
  const taken = new Set<string>([...occupation.skills, ...selected.choiceSkillIds.flat()]);
  const anyPicks = selected.anySkillIds;
  const anyValid =
    anyPicks.length === occupation.anySkills &&
    !hasDuplicates(anyPicks) &&
    anyPicks.every((skillId) => findSkill(skillId) !== undefined && !taken.has(skillId));
  if (!anyValid) errors.push(InvestigatorError.anySkillsIncomplete());

  return errors;
};

// Rules checked before saving. An empty list means the investigator can be saved.
export const validateInvestigator = (
  investigator: Investigator,
  options: ValidationOptions,
): InvestigatorErrors[] => {
  const errors: InvestigatorErrors[] = [];

  if (investigator.name.trim() === '') errors.push(InvestigatorError.nameMissing());

  errors.push(...validateCharacteristics(investigator, options));
  errors.push(...validateSkills(investigator));

  const occupation = findOccupation(investigator.occupation.occupationId);
  if (!occupation) {
    errors.push(InvestigatorError.unknownOccupation(investigator.occupation.occupationId));
  } else {
    errors.push(...validateOccupationPicks(occupation, investigator.occupation));
  }

  const budget = skillPointsBudget(investigator);
  const spent = skillPointsSpent(investigator);
  if (spent > budget) errors.push(InvestigatorError.overBudget({ budget, spent }));

  return errors;
};
