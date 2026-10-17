import type { Investigator } from '@game-rules/investigator';
import { describe, expect, it } from 'vitest';
import { INVESTIGATORS_STORAGE_KEY, InvestigatorDataGateway } from './investigatorDataGateway';

const harvey: Investigator = { id: '1', name: 'Harvey Walters' };
const lydia: Investigator = { id: '2', name: 'Lydia Lau' };

const seed = (value: unknown) =>
  localStorage.setItem(
    INVESTIGATORS_STORAGE_KEY,
    typeof value === 'string' ? value : JSON.stringify(value),
  );
const stored = () => JSON.parse(localStorage.getItem(INVESTIGATORS_STORAGE_KEY) ?? 'null');

describe('InvestigatorDataGateway', () => {
  describe('getInvestigators', () => {
    it('returns saved investigators', async () => {
      seed([harvey, lydia]);
      await expect(InvestigatorDataGateway.getInvestigators()).resolves.toEqual([harvey, lydia]);
    });

    it.each([
      ['nothing is saved', undefined],
      ['the JSON is invalid', '{not json'],
      ['the value is not an array', harvey],
    ])('returns an empty list when %s', async (_, value) => {
      if (value !== undefined) seed(value);
      await expect(InvestigatorDataGateway.getInvestigators()).resolves.toEqual([]);
    });

    it('skips entries that are not investigators', async () => {
      seed([harvey, { id: 2 }, 'junk', null]);
      await expect(InvestigatorDataGateway.getInvestigators()).resolves.toEqual([harvey]);
    });
  });

  describe('upsertInvestigator', () => {
    it('creates an investigator with a new id when none is given', async () => {
      const saved = await InvestigatorDataGateway.upsertInvestigator({ name: 'Harvey Walters' });

      expect(saved.id).toEqual(expect.any(String));
      expect(saved.id).not.toBe('');
      expect(saved.name).toBe('Harvey Walters');
      expect(stored()).toEqual([saved]);
    });

    it('gives each new investigator a different id', async () => {
      const first = await InvestigatorDataGateway.upsertInvestigator({ name: 'A' });
      const second = await InvestigatorDataGateway.upsertInvestigator({ name: 'B' });
      expect(first.id).not.toBe(second.id);
    });

    it('overwrites the investigator with the same id', async () => {
      seed([harvey, lydia]);

      const saved = await InvestigatorDataGateway.upsertInvestigator({
        id: '1',
        name: 'Harvey W.',
      });

      expect(saved).toEqual({ id: '1', name: 'Harvey W.' });
      // Overwritten in place, so the list order stays the same.
      expect(stored()).toEqual([{ id: '1', name: 'Harvey W.' }, lydia]);
    });

    it('creates the investigator when the given id does not exist yet', async () => {
      seed([harvey]);
      await InvestigatorDataGateway.upsertInvestigator(lydia);
      expect(stored()).toEqual([harvey, lydia]);
    });
  });

  describe('deleteInvestigator', () => {
    it('removes the investigator and returns true', async () => {
      seed([harvey, lydia]);
      await expect(InvestigatorDataGateway.deleteInvestigator('1')).resolves.toBe(true);
      expect(stored()).toEqual([lydia]);
    });

    it('returns false and changes nothing when the id does not exist', async () => {
      seed([harvey]);
      await expect(InvestigatorDataGateway.deleteInvestigator('missing')).resolves.toBe(false);
      expect(stored()).toEqual([harvey]);
    });
  });
});
