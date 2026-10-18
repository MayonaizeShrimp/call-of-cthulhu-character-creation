import type { Investigator } from './investigator';

// A valid Jurnalistik (School Press) member, for tests.
export const createTestInvestigator = (overrides: Partial<Investigator> = {}): Investigator => ({
  id: 'test-investigator',
  name: 'Test Investigator',
  occupation: {
    occupationId: 'jurnalistik',
    pointCharacteristics: ['EDU'],
    choiceSkillIds: [['persuade']],
    anySkillIds: ['spot-hidden', 'listen'],
  },
  characteristics: {
    STR: 50,
    CON: 60,
    SIZ: 60,
    DEX: 60,
    APP: 50,
    INT: 60,
    POW: 50,
    EDU: 70,
  },
  luck: 50,
  skills: [],
  ...overrides,
});
