// Placeholder shape: the data style for game rules (const / enum / record) is still undecided.
export const CHARACTERISTICS = ['STR', 'CON', 'SIZ', 'DEX', 'APP', 'INT', 'POW', 'EDU'] as const;

export type Characteristic = (typeof CHARACTERISTICS)[number];