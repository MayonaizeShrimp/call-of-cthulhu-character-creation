import { describe, expect, it } from 'vitest';
import { isInvestigator } from './investigator';

describe('isInvestigator', () => {
  it('accepts a value with a string id and name', () => {
    expect(isInvestigator({ id: '1', name: 'Harvey Walters' })).toBe(true);
  });

  it.each([
    ['null', null],
    ['a string', 'Harvey'],
    ['a numeric id', { id: 1, name: 'Harvey Walters' }],
    ['a missing name', { id: '1' }],
  ])('rejects %s', (_, value) => {
    expect(isInvestigator(value)).toBe(false);
  });
});
