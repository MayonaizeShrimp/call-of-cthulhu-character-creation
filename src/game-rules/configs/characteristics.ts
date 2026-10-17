import type { Characteristic } from '../entities/characteristic';

export const CHARACTERISTICS = ['STR', 'CON', 'SIZ', 'DEX', 'APP', 'INT', 'POW', 'EDU'] as const;

// Optional 7e rule: spend exactly this many points across the eight characteristics.
export const POINT_BUY = { total: 460, min: 15, max: 90 } as const;

// Values typed in after rolling at the table.
export const MANUAL_RANGE = { min: 1, max: 99 } as const;

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
