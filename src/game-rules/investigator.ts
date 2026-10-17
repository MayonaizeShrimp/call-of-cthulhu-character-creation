export type Investigator = {
  id: string;
  name: string;
};

export const isInvestigator = (value: unknown): value is Investigator =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Investigator).id === 'string' &&
  typeof (value as Investigator).name === 'string';
