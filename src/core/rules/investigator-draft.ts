import {
  CHARACTERISTICS,
  type Characteristic,
  type Investigator,
  type InvestigatorDraft,
  type SelectedCharacteristic,
  type Skill,
} from '@game-rules/index';
import { budgetFor, spentFor } from './budget';
import { InvestigatorError, type InvestigatorErrors } from './investigator-error';
import { personalInterestPoints } from './occupations';
import { skillBase } from './skills';
import { validateInvestigator } from './validate-investigator';

// A complete investigator without its id (new ones get an id when saved).
export type InvestigatorData = Omit<Investigator, 'id'>;

export const createEmptyDraft = (): InvestigatorDraft => ({
  name: '',
  occupation: null,
  characteristics: Object.fromEntries(
    CHARACTERISTICS.map((characteristic) => [characteristic, null]),
  ) as Record<Characteristic, number | null>,
  luck: null,
  skills: [],
});

export const draftFromInvestigator = ({
  name,
  occupation,
  characteristics,
  luck,
  skills,
}: Investigator): InvestigatorDraft => ({ name, occupation, characteristics, luck, skills });

const completeCharacteristics = (draft: InvestigatorDraft): SelectedCharacteristic | undefined =>
  CHARACTERISTICS.every((characteristic) => draft.characteristics[characteristic] !== null)
    ? (draft.characteristics as SelectedCharacteristic)
    : undefined;

// Missing characteristics count as 0, so live numbers can be shown while the draft is incomplete.
const characteristicsOrZero = (draft: InvestigatorDraft): SelectedCharacteristic =>
  Object.fromEntries(
    CHARACTERISTICS.map((characteristic) => [
      characteristic,
      draft.characteristics[characteristic] ?? 0,
    ]),
  ) as SelectedCharacteristic;

// The complete investigator, or undefined while an occupation, characteristic or Luck is missing.
export const draftToInvestigator = (draft: InvestigatorDraft): InvestigatorData | undefined => {
  const characteristics = completeCharacteristics(draft);
  if (!draft.occupation || !characteristics || draft.luck === null) return undefined;

  return {
    name: draft.name,
    occupation: draft.occupation,
    characteristics,
    luck: draft.luck,
    skills: draft.skills,
  };
};

// Everything stopping the draft from being saved. Missing pieces first; the full rules
// can only be checked once the draft is complete.
export const validateDraft = (draft: InvestigatorDraft): InvestigatorErrors[] => {
  const complete = draftToInvestigator(draft);
  if (complete) return validateInvestigator({ id: '', ...complete });

  const errors: InvestigatorErrors[] = [];
  if (draft.name.trim() === '') errors.push(InvestigatorError.nameMissing());
  if (!draft.occupation) errors.push(InvestigatorError.occupationMissing());
  for (const characteristic of CHARACTERISTICS) {
    if (draft.characteristics[characteristic] === null) {
      errors.push(InvestigatorError.characteristicMissing(characteristic));
    }
  }
  if (draft.luck === null) errors.push(InvestigatorError.luckMissing());
  return errors;
};

export const draftSkillBase = (draft: InvestigatorDraft, skill: Skill): number =>
  skillBase(skill, characteristicsOrZero(draft));

export const draftSkillPointsBudget = (draft: InvestigatorDraft): number =>
  budgetFor(draft.occupation, characteristicsOrZero(draft));

export const draftPersonalInterestPoints = (draft: InvestigatorDraft): number =>
  personalInterestPoints(characteristicsOrZero(draft));

export const draftOccupationSkillPoints = (draft: InvestigatorDraft): number =>
  draftSkillPointsBudget(draft) - draftPersonalInterestPoints(draft);

export const draftSkillPointsSpent = (draft: InvestigatorDraft): number =>
  spentFor(draft.skills, characteristicsOrZero(draft));
