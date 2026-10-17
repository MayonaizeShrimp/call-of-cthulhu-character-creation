import type { CHARACTERISTICS } from '../configs/characteristics';

export type Characteristic = (typeof CHARACTERISTICS)[number];

// How the player set their characteristics; decides which limits apply when saving.
export const CharacteristicMethod = {
  pointBuy: 'pointBuy',
  manual: 'manual',
} as const;

export type CharacteristicMethod = (typeof CharacteristicMethod)[keyof typeof CharacteristicMethod];
