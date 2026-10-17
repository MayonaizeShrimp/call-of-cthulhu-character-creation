import type { OccupationId } from '../configs/occupations';
import type { SkillId } from '../configs/skills';
import { isArrayOf, isRecord, isString, isStringArray } from '../helpers/type-guards';
import type { Characteristic } from './characteristic';

export type SelectedOccupation = {
  occupationId: OccupationId;
  pointCharacteristics: Characteristic[]; // chosen characteristic, one per skillPoints term
  choiceSkillIds: SkillId[][]; // picks, one array per skillChoices entry
  anySkillIds: SkillId[]; // picks for "any N other skills"
};

// Shape only; whether the ids and picks are valid is checked when saving.
export const isSelectedOccupation = (value: unknown): value is SelectedOccupation =>
  isRecord(value) &&
  isString(value.occupationId) &&
  isStringArray(value.pointCharacteristics) &&
  isArrayOf(isStringArray)(value.choiceSkillIds) &&
  isStringArray(value.anySkillIds);
