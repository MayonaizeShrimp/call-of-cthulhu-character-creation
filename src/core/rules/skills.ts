import {
  type Investigator,
  type SelectedCharacteristic,
  SKILLS,
  type Skill,
} from '@game-rules/index';

export const findSkill = (skillId: string): Skill | undefined =>
  SKILLS.find((skill) => skill.id === skillId);

// Fixed base, or derived from a characteristic (Dodge = DEX ÷ 2, Language (Own) = EDU).
export const skillBase = (skill: Skill, characteristics: SelectedCharacteristic): number =>
  typeof skill.base === 'number'
    ? skill.base
    : Math.floor(characteristics[skill.base.characteristic] / skill.base.divisor);

// The investigator's value for a skill: what they set, or the base if they didn't raise it.
export const skillValue = (investigator: Investigator, skillId: string): number => {
  const selected = investigator.skills.find((skill) => skill.skillId === skillId);
  if (selected) return selected.value;

  const skill = findSkill(skillId);
  return skill ? skillBase(skill, investigator.characteristics) : 0;
};
