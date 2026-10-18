import {
  createEmptyDraft,
  draftFromInvestigator,
  draftSkillBase,
  draftToInvestigator,
  findOccupation,
  findSkill,
  validateDraft,
} from '@core/rules';
import type { InvestigatorDraft } from '@game-rules/index';
import { match } from 'ts-pattern';
import { DetailsAction, type DetailsActions } from './details.action';
import { DetailsCommand, type DetailsCommands } from './details.command';
import { DetailsStep } from './details.step';

export type DetailsState = {
  id: string | undefined; // undefined = new investigator
  draft: InvestigatorDraft;
  step: DetailsStep;
  notFound: boolean;
  justSaved: boolean; // shows "Saved"; cleared by the next edit
  command: DetailsCommands;
};

export const initializeDetailsState = (): DetailsState => ({
  id: undefined,
  draft: createEmptyDraft(),
  step: DetailsStep.basics,
  notFound: false,
  justSaved: false,
  command: DetailsCommand.noop(),
});

const editDraft = (state: DetailsState, changes: Partial<InvestigatorDraft>): DetailsState => ({
  ...state,
  draft: { ...state.draft, ...changes },
  justSaved: false,
});

const replaceAt = <T>(items: readonly T[], index: number, item: T): T[] =>
  items.map((existing, i) => (i === index ? item : existing));

export const detailsReducer = (state: DetailsState, action: DetailsActions): DetailsState =>
  match(action)
    .returnType<DetailsState>()
    .with({ type: DetailsAction.startLoadInvestigator.type }, ({ id }) => ({
      ...state,
      id,
      command: DetailsCommand.loadInvestigator(id),
    }))
    .with({ type: DetailsAction.finishLoadInvestigator.type }, ({ investigator }) =>
      investigator
        ? {
            ...state,
            draft: draftFromInvestigator(investigator),
            step: DetailsStep.summary,
            command: DetailsCommand.noop(),
          }
        : { ...state, notFound: true, command: DetailsCommand.noop() },
    )
    .with({ type: DetailsAction.goToStep.type }, ({ step }) => ({ ...state, step }))

    .with({ type: DetailsAction.setName.type }, ({ name }) => editDraft(state, { name }))

    // A new occupation starts with fresh picks; each formula term defaults to its first option.
    .with({ type: DetailsAction.selectOccupation.type }, ({ occupationId }) => {
      const occupation = findOccupation(occupationId);
      if (!occupation) return state;
      return editDraft(state, {
        occupation: {
          occupationId,
          pointCharacteristics: occupation.skillPoints.flatMap((term) => term.anyOf.slice(0, 1)),
          choiceSkillIds: occupation.skillChoices.map(() => []),
          anySkillIds: [],
        },
      });
    })
    .with({ type: DetailsAction.setPointCharacteristic.type }, ({ termIndex, characteristic }) => {
      const { occupation } = state.draft;
      if (!occupation) return state;
      return editDraft(state, {
        occupation: {
          ...occupation,
          pointCharacteristics: replaceAt(
            occupation.pointCharacteristics,
            termIndex,
            characteristic,
          ),
        },
      });
    })
    .with({ type: DetailsAction.setChoiceSkills.type }, ({ choiceIndex, skillIds }) => {
      const { occupation } = state.draft;
      if (!occupation) return state;
      return editDraft(state, {
        occupation: {
          ...occupation,
          choiceSkillIds: replaceAt(occupation.choiceSkillIds, choiceIndex, skillIds),
        },
      });
    })
    .with({ type: DetailsAction.setAnySkills.type }, ({ skillIds }) => {
      const { occupation } = state.draft;
      if (!occupation) return state;
      return editDraft(state, { occupation: { ...occupation, anySkillIds: skillIds } });
    })

    .with({ type: DetailsAction.setCharacteristic.type }, ({ characteristic, value }) =>
      editDraft(state, {
        characteristics: { ...state.draft.characteristics, [characteristic]: value },
      }),
    )
    .with({ type: DetailsAction.setLuck.type }, ({ value }) => editDraft(state, { luck: value }))

    // Only raised skills are kept; clearing a skill or setting it to its base removes it.
    .with({ type: DetailsAction.setSkillValue.type }, ({ skillId, value }) => {
      const skill = findSkill(skillId);
      const others = state.draft.skills.filter((selected) => selected.skillId !== skillId);
      const atBase = skill !== undefined && value === draftSkillBase(state.draft, skill);
      return editDraft(state, {
        skills: value === null || atBase ? others : [...others, { skillId, value }],
      });
    })

    // Only issues the save when nothing blocks it.
    .with({ type: DetailsAction.startSave.type }, () => {
      const investigator = draftToInvestigator(state.draft);
      if (!investigator || validateDraft(state.draft).length > 0) return state;
      return {
        ...state,
        command: DetailsCommand.saveInvestigator(
          state.id === undefined ? investigator : { ...investigator, id: state.id },
        ),
      };
    })
    .with({ type: DetailsAction.finishSave.type }, ({ investigator }) => ({
      ...state,
      id: investigator.id,
      draft: draftFromInvestigator(investigator),
      justSaved: true,
      command: DetailsCommand.noop(),
    }))
    .with({ type: DetailsAction.failSave.type }, () => ({
      ...state,
      command: DetailsCommand.noop(),
    }))
    .with({ type: DetailsAction.resetCommand.type }, () => ({
      ...state,
      command: DetailsCommand.noop(),
    }))
    .exhaustive();
