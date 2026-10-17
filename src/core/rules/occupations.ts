import {
  type Characteristic,
  OCCUPATIONS,
  type Occupation,
  PERSONAL_INTEREST_MULTIPLIER,
  type SelectedCharacteristic,
  type SelectedOccupation,
  type SkillId,
} from '@game-rules/index';

export const findOccupation = (occupationId: string): Occupation | undefined =>
  OCCUPATIONS.find((occupation) => occupation.id === occupationId);

// Sums the formula terms using the player's chosen characteristic for each term.
// A missing or invalid choice contributes nothing (validation reports it).
export const occupationSkillPoints = (
  occupation: Occupation,
  characteristics: SelectedCharacteristic,
  pointCharacteristics: readonly Characteristic[],
): number =>
  occupation.skillPoints.reduce((total, term, index) => {
    const chosen = pointCharacteristics[index];
    return chosen !== undefined && term.anyOf.includes(chosen)
      ? total + characteristics[chosen] * term.multiplier
      : total;
  }, 0);

export const personalInterestPoints = (characteristics: SelectedCharacteristic): number =>
  characteristics.INT * PERSONAL_INTEREST_MULTIPLIER;

// Every skill that counts as an occupation skill: fixed ones plus the player's picks.
export const occupationSkillIds = (selected: SelectedOccupation): SkillId[] => {
  const fixed = findOccupation(selected.occupationId)?.skills ?? [];
  return [...new Set([...fixed, ...selected.choiceSkillIds.flat(), ...selected.anySkillIds])];
};
