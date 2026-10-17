import type { SkillId } from '../configs/skills';
import { isNumber, isRecord, isString } from '../helpers/type-guards';

// Final skill value (base + points spent). Skills that aren't listed are at their base.
export type SelectedSkill = {
  skillId: SkillId;
  value: number;
};

// Shape only; whether the skill exists and the value is allowed is checked when saving.
export const isSelectedSkill = (value: unknown): value is SelectedSkill =>
  isRecord(value) && isString(value.skillId) && isNumber(value.value);
