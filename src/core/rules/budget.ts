import type {
  Investigator,
  SelectedCharacteristic,
  SelectedOccupation,
  SelectedSkill,
} from '@game-rules/index';
import { findOccupation, occupationSkillPoints, personalInterestPoints } from './occupations';
import { findSkill, skillBase } from './skills';

// Occupation points (formula) plus personal interest points (INT × 2), as one pool.
// Without an occupation (yet), only the personal interest points count.
export const budgetFor = (
  selected: SelectedOccupation | null,
  characteristics: SelectedCharacteristic,
): number => {
  const occupation = selected ? findOccupation(selected.occupationId) : undefined;
  const occupationPoints =
    occupation && selected
      ? occupationSkillPoints(occupation, characteristics, selected.pointCharacteristics)
      : 0;
  return occupationPoints + personalInterestPoints(characteristics);
};

// Points spent = how far each skill was raised above its base.
export const spentFor = (
  skills: readonly SelectedSkill[],
  characteristics: SelectedCharacteristic,
): number =>
  skills.reduce((total, { skillId, value }) => {
    const skill = findSkill(skillId);
    if (!skill) return total;
    return total + Math.max(0, value - skillBase(skill, characteristics));
  }, 0);

export const skillPointsBudget = (investigator: Investigator): number =>
  budgetFor(investigator.occupation, investigator.characteristics);

export const skillPointsSpent = (investigator: Investigator): number =>
  spentFor(investigator.skills, investigator.characteristics);
