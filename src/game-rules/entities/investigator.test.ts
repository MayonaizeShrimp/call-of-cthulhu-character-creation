import { describe, expect, it } from 'vitest';
import { isInvestigator } from './investigator';
import { createTestInvestigator } from './investigator.fixtures';

describe('isInvestigator', () => {
  it('accepts a complete investigator', () => {
    expect(isInvestigator(createTestInvestigator())).toBe(true);
  });

  const { characteristics, occupation } = createTestInvestigator();
  const { STR: _, ...withoutStr } = characteristics;

  it.each([
    ['null', null],
    ['an old { id, name } save', { id: '1', name: 'Harvey Walters' }],
    ['a missing characteristic', createTestInvestigator({ characteristics: withoutStr as never })],
    [
      'a non-numeric characteristic',
      { ...createTestInvestigator(), characteristics: { ...characteristics, STR: '50' } },
    ],
    ['a missing luck', { ...createTestInvestigator(), luck: undefined }],
    [
      'a malformed occupation',
      { ...createTestInvestigator(), occupation: { ...occupation, choiceSkillIds: 'persuade' } },
    ],
    [
      'a malformed skill',
      { ...createTestInvestigator(), skills: [{ skillId: 'charm', value: 'high' }] },
    ],
  ])('rejects %s', (_, value) => {
    expect(isInvestigator(value)).toBe(false);
  });
});
