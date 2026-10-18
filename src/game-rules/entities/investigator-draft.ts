import type { Characteristic } from './characteristic';
import type { SelectedOccupation } from './selected-occupation';
import type { SelectedSkill } from './selected-skill';

// An investigator being created or edited; unlike Investigator, parts may still be missing.
// Never stored, so it has no shape guard.
export type InvestigatorDraft = {
  name: string;
  occupation: SelectedOccupation | null; // null until chosen
  characteristics: Record<Characteristic, number | null>; // null = not entered yet
  luck: number | null;
  skills: SelectedSkill[];
};
