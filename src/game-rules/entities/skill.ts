import type { Characteristic } from './characteristic';

// A fixed starting chance, or one taken from a characteristic (Dodge = DEX ÷ 2).
export type SkillBase = number | { characteristic: Characteristic; divisor: number };

export type Skill = {
  id: string; // kebab-case
  name: string;
  base: SkillBase;
};
