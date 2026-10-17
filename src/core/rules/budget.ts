import type { Investigator } from '@game-rules/index';
import { findOccupation, occupationSkillPoints, personalInterestPoints } from './occupations';
import { findSkill, skillBase } from './skills';

// Occupation points (formula) plus personal interest points (INT × 2), as one pool.
export const skillPointsBudget = (investigator: Investigator): number => {
  const { occupation: selected, characteristics } = investigator;
  const occupation = findOccupation(selected.occupationId);
  const occupationPoints = occupation
    ? occupationSkillPoints(occupation, characteristics, selected.pointCharacteristics)
    : 0;
  return occupationPoints + personalInterestPoints(characteristics);
};

// Points spent = how far each skill was raised above its base.
export const skillPointsSpent = (investigator: Investigator): number =>
  investigator.skills.reduce((total, { skillId, value }) => {
    const skill = findSkill(skillId);
    if (!skill) return total;
    return total + Math.max(0, value - skillBase(skill, investigator.characteristics));
  }, 0);
