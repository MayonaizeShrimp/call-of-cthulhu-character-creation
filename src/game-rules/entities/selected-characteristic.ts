import { CHARACTERISTICS } from '../configs/characteristics';
import { isNumber, isRecord } from '../helpers/type-guards';
import type { Characteristic } from './characteristic';

export type SelectedCharacteristic = Record<Characteristic, number>;

export const isSelectedCharacteristic = (value: unknown): value is SelectedCharacteristic =>
  isRecord(value) && CHARACTERISTICS.every((characteristic) => isNumber(value[characteristic]));
