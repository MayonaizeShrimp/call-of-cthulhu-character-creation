import { type Investigator, isInvestigator } from '@game-rules/index';

export const INVESTIGATORS_STORAGE_KEY = 'coc-character-creation:investigators';

// Bump when the stored shape changes; data saved under another version reads as empty.
export const INVESTIGATORS_STORAGE_VERSION = 1;

type StoredInvestigators = {
  version: typeof INVESTIGATORS_STORAGE_VERSION;
  investigators: Investigator[];
};

export type UpsertInvestigatorRequest = Omit<Investigator, 'id'> & { id?: string };

const isCurrentVersion = (value: unknown): value is { investigators: unknown[] } =>
  typeof value === 'object' &&
  value !== null &&
  (value as StoredInvestigators).version === INVESTIGATORS_STORAGE_VERSION &&
  Array.isArray((value as StoredInvestigators).investigators);

// Missing, unparsable or other-version data reads as no investigators; malformed entries are skipped.
const readAll = (): Investigator[] => {
  const raw = localStorage.getItem(INVESTIGATORS_STORAGE_KEY);
  if (raw === null) return [];
  try {
    const stored: unknown = JSON.parse(raw);
    return isCurrentVersion(stored) ? stored.investigators.filter(isInvestigator) : [];
  } catch {
    return [];
  }
};

const writeAll = (investigators: Investigator[]) => {
  const stored: StoredInvestigators = { version: INVESTIGATORS_STORAGE_VERSION, investigators };
  localStorage.setItem(INVESTIGATORS_STORAGE_KEY, JSON.stringify(stored));
};

export const InvestigatorDataGateway = {
  getInvestigators: async (): Promise<Investigator[]> => readAll(),

  upsertInvestigator: async (input: UpsertInvestigatorRequest): Promise<Investigator> => {
    const investigator: Investigator = { ...input, id: input.id ?? crypto.randomUUID() };
    const investigators = readAll();
    const exists = investigators.some(({ id }) => id === investigator.id);
    writeAll(
      exists
        ? investigators.map((existing) =>
            existing.id === investigator.id ? investigator : existing,
          )
        : [...investigators, investigator],
    );

    // Read it back so callers get what was actually stored, including a newly generated id.
    const saved = readAll().find(({ id }) => id === investigator.id);
    if (!saved) {
      throw new Error(`Investigator ${investigator.id} was not saved`);
    }
    return saved;
  },

  deleteInvestigator: async (id: string): Promise<boolean> => {
    const investigators = readAll();
    const remaining = investigators.filter((investigator) => investigator.id !== id);
    if (remaining.length === investigators.length) return false;

    writeAll(remaining);
    return true;
  },
};

export type InvestigatorDataGatewayApi = typeof InvestigatorDataGateway;
