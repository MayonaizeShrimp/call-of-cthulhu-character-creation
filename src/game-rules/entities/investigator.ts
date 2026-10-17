import { isArrayOf, isNumber, isRecord, isString } from '../helpers/type-guards';
import { isSelectedCharacteristic, type SelectedCharacteristic } from './selected-characteristic';
import { isSelectedOccupation, type SelectedOccupation } from './selected-occupation';
import { isSelectedSkill, type SelectedSkill } from './selected-skill';

export type Investigator = {
  id: string;
  name: string;
  occupation: SelectedOccupation;
  characteristics: SelectedCharacteristic;
  luck: number;
  skills: SelectedSkill[];
};

// Shape check for data read from storage. Game rules are checked when saving, not here.
export const isInvestigator = (value: unknown): value is Investigator =>
  isRecord(value) &&
  isString(value.id) &&
  isString(value.name) &&
  isSelectedOccupation(value.occupation) &&
  isSelectedCharacteristic(value.characteristics) &&
  isNumber(value.luck) &&
  isArrayOf(isSelectedSkill)(value.skills);
