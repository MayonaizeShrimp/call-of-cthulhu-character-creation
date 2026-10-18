import type { Characteristic } from '../entities/characteristic';

export const CHARACTERISTICS = ['STR', 'CON', 'SIZ', 'DEX', 'APP', 'INT', 'POW', 'EDU'] as const;

// Allowed value for each characteristic, however the player got it (rolled or point-buy).
export const CHARACTERISTIC_RANGE = { min: 1, max: 99 } as const;

// Optional 7e point-buy pool. Shown to players as a guide only; not enforced.
export const POINT_BUY_TOTAL = 460;

// 7e quick-fire values: assign one to each characteristic. Adds up to POINT_BUY_TOTAL.
export const POINT_BUY_VALUES = [80, 70, 60, 60, 50, 50, 50, 40] as const;

export const LUCK_RANGE = { min: 1, max: 99 } as const;

// What players roll at the table for each value.
export const ROLL_INSTRUCTIONS = {
  STR: '3d6 × 5',
  CON: '3d6 × 5',
  SIZ: '(2d6 + 6) × 5',
  DEX: '3d6 × 5',
  APP: '3d6 × 5',
  INT: '(2d6 + 6) × 5',
  POW: '3d6 × 5',
  EDU: '(2d6 + 6) × 5',
  LUCK: '3d6 × 5',
} as const satisfies Record<Characteristic | 'LUCK', string>;
