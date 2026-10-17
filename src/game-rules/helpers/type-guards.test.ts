import { describe, expect, it } from 'vitest';
import { isArrayOf, isNumber, isRecord, isString, isStringArray } from './type-guards';

describe('type guards', () => {
  it('isRecord accepts plain objects only', () => {
    expect(isRecord({ a: 1 })).toBe(true);
    expect(isRecord(null)).toBe(false);
    expect(isRecord([])).toBe(false);
    expect(isRecord('a')).toBe(false);
  });

  it('isString accepts strings only', () => {
    expect(isString('')).toBe(true);
    expect(isString(1)).toBe(false);
  });

  it('isNumber accepts finite numbers only', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(Number.NaN)).toBe(false);
    expect(isNumber(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isNumber('1')).toBe(false);
  });

  it('isArrayOf checks every item', () => {
    const isNumberArray = isArrayOf(isNumber);
    expect(isNumberArray([1, 2])).toBe(true);
    expect(isNumberArray([])).toBe(true);
    expect(isNumberArray([1, '2'])).toBe(false);
    expect(isNumberArray({ 0: 1 })).toBe(false);
  });

  it('isStringArray accepts arrays of strings', () => {
    expect(isStringArray(['a', 'b'])).toBe(true);
    expect(isStringArray(['a', 1])).toBe(false);
  });
});
