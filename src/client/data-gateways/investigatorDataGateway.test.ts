import { createTestInvestigator, type Investigator } from '@game-rules/index';
import { describe, expect, it } from 'vitest';
import {
  INVESTIGATORS_STORAGE_KEY,
  INVESTIGATORS_STORAGE_VERSION,
  InvestigatorDataGateway,
  type UpsertInvestigatorRequest,
} from './investigatorDataGateway';

const harvey = createTestInvestigator({ id: '1', name: 'Harvey Walters' });
const lydia = createTestInvestigator({ id: '2', name: 'Lydia Lau' });

const withoutId = ({ id: _, ...rest }: Investigator): UpsertInvestigatorRequest => rest;

const seedRaw = (raw: string) => localStorage.setItem(INVESTIGATORS_STORAGE_KEY, raw);
const seed = (investigators: unknown[]) =>
  seedRaw(JSON.stringify({ version: INVESTIGATORS_STORAGE_VERSION, investigators }));
const stored = () => JSON.parse(localStorage.getItem(INVESTIGATORS_STORAGE_KEY) ?? 'null');

describe('InvestigatorDataGateway', () => {
  describe('getInvestigators', () => {
    it('returns saved investigators', async () => {
      seed([harvey, lydia]);
      await expect(InvestigatorDataGateway.getInvestigators()).resolves.toEqual([harvey, lydia]);
    });

    it.each([
      ['the JSON is invalid', '{not json'],
      ['the data is an old bare array', JSON.stringify([harvey])],
      ['the version is different', JSON.stringify({ version: 0, investigators: [harvey] })],
    ])('returns an empty list when %s', async (_, raw) => {
      seedRaw(raw);
      await expect(InvestigatorDataGateway.getInvestigators()).resolves.toEqual([]);
    });

    it('returns an empty list when nothing is saved', async () => {
      await expect(InvestigatorDataGateway.getInvestigators()).resolves.toEqual([]);
    });

    it('skips entries that are not investigators, including old { id, name } saves', async () => {
      seed([harvey, { id: '3', name: 'Old Save' }, 'junk', null]);
      await expect(InvestigatorDataGateway.getInvestigators()).resolves.toEqual([harvey]);
    });
  });

  describe('upsertInvestigator', () => {
    it('creates an investigator with a new id when none is given', async () => {
      const saved = await InvestigatorDataGateway.upsertInvestigator(withoutId(harvey));

      expect(saved.id).toEqual(expect.any(String));
      expect(saved.id).not.toBe('');
      expect(saved).toEqual({ ...harvey, id: saved.id });
      expect(stored()).toEqual({ version: INVESTIGATORS_STORAGE_VERSION, investigators: [saved] });
    });

    it('gives each new investigator a different id', async () => {
      const first = await InvestigatorDataGateway.upsertInvestigator(withoutId(harvey));
      const second = await InvestigatorDataGateway.upsertInvestigator(withoutId(lydia));
      expect(first.id).not.toBe(second.id);
    });

    it('overwrites the investigator with the same id in place', async () => {
      seed([harvey, lydia]);
      const renamed = { ...harvey, name: 'Harvey W.' };

      const saved = await InvestigatorDataGateway.upsertInvestigator(renamed);

      expect(saved).toEqual(renamed);
      expect(stored().investigators).toEqual([renamed, lydia]);
    });

    it('creates the investigator when the given id does not exist yet', async () => {
      seed([harvey]);
      await InvestigatorDataGateway.upsertInvestigator(lydia);
      expect(stored().investigators).toEqual([harvey, lydia]);
    });
  });

  describe('deleteInvestigator', () => {
    it('removes the investigator and returns true', async () => {
      seed([harvey, lydia]);
      await expect(InvestigatorDataGateway.deleteInvestigator('1')).resolves.toBe(true);
      expect(stored().investigators).toEqual([lydia]);
    });

    it('returns false and changes nothing when the id does not exist', async () => {
      seed([harvey]);
      await expect(InvestigatorDataGateway.deleteInvestigator('missing')).resolves.toBe(false);
      expect(stored().investigators).toEqual([harvey]);
    });
  });
});
