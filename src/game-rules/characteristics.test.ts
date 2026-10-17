import { describe, expect, it } from 'vitest';
import { CHARACTERISTICS } from './characteristics';

describe('CHARACTERISTICS', () => {
  it('lists the eight 7e core characteristics', () => {
    expect(CHARACTERISTICS).toEqual(['STR', 'CON', 'SIZ', 'DEX', 'APP', 'INT', 'POW', 'EDU']);
  });

  it('has no duplicates', () => {
    expect(new Set(CHARACTERISTICS).size).toBe(CHARACTERISTICS.length);
  });
});
