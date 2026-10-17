import type { SkillId } from '../configs/skills';
import type { Characteristic } from './characteristic';

// One term of the occupation skill points formula. EDU × 4 → { anyOf: ['EDU'], multiplier: 4 };
// (DEX or STR) × 2 → { anyOf: ['DEX', 'STR'], multiplier: 2 }, where the player picks one.
export type OccupationPointTerm = {
  anyOf: readonly Characteristic[];
  multiplier: number;
};

// "Choose `count` of these skills", e.g. one interpersonal skill.
export type OccupationSkillChoice = {
  options: readonly SkillId[];
  count: number;
};

export type Occupation = {
  id: string; // kebab-case
  name: string;
  skillPoints: readonly OccupationPointTerm[];
  skills: readonly SkillId[];
  skillChoices: readonly OccupationSkillChoice[];
  anySkills: number; // "any N other skills"
};
