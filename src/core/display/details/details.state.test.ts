import { draftFromInvestigator } from '@core/rules';
import { createTestInvestigator } from '@game-rules/index';
import { describe, expect, it } from 'vitest';
import { DetailsAction, type DetailsActions } from './details.action';
import { DetailsCommand } from './details.command';
import { type DetailsState, detailsReducer, initializeDetailsState } from './details.state';
import { DetailsStep } from './details.step';

const investigator = createTestInvestigator({ id: 'abc' });

const reduce = (state: DetailsState, ...actions: DetailsActions[]) =>
  actions.reduce(detailsReducer, state);

// A state whose draft is a complete, valid investigator.
const loaded = () =>
  reduce(
    initializeDetailsState(),
    DetailsAction.startLoadInvestigator('abc'),
    DetailsAction.finishLoadInvestigator(investigator),
  );

describe('detailsReducer', () => {
  it('starts on Basics with an empty draft and nothing to do', () => {
    const state = initializeDetailsState();
    expect(state.id).toBeUndefined();
    expect(state.step).toBe(DetailsStep.basics);
    expect(state.draft.occupation).toBeNull();
    expect(state.command).toEqual(DetailsCommand.noop());
  });

  describe('loading', () => {
    it('issues a load command for the id', () => {
      const state = reduce(initializeDetailsState(), DetailsAction.startLoadInvestigator('abc'));
      expect(state.id).toBe('abc');
      expect(state.command).toEqual(DetailsCommand.loadInvestigator('abc'));
    });

    it('opens a found investigator on Summary', () => {
      const state = loaded();
      expect(state.draft).toEqual(draftFromInvestigator(investigator));
      expect(state.step).toBe(DetailsStep.summary);
      expect(state.command).toEqual(DetailsCommand.noop());
    });

    it('marks a missing investigator as not found', () => {
      const state = reduce(
        initializeDetailsState(),
        DetailsAction.startLoadInvestigator('missing'),
        DetailsAction.finishLoadInvestigator(undefined),
      );
      expect(state.notFound).toBe(true);
    });
  });

  it('moves freely between steps', () => {
    const state = reduce(initializeDetailsState(), DetailsAction.goToStep(DetailsStep.skills));
    expect(state.step).toBe(DetailsStep.skills);
  });

  describe('occupation', () => {
    it('starts fresh picks and defaults each formula term to its first option', () => {
      const state = reduce(initializeDetailsState(), DetailsAction.selectOccupation('sepak-bola'));
      expect(state.draft.occupation).toEqual({
        occupationId: 'sepak-bola',
        pointCharacteristics: ['EDU', 'DEX'],
        choiceSkillIds: [[]],
        anySkillIds: [],
      });
    });

    it('updates the formula choice and skill picks', () => {
      const state = reduce(
        initializeDetailsState(),
        DetailsAction.selectOccupation('sepak-bola'),
        DetailsAction.setPointCharacteristic(1, 'STR'),
        DetailsAction.setChoiceSkills(0, ['charm']),
        DetailsAction.setAnySkills(['drive-auto']),
      );
      expect(state.draft.occupation).toEqual({
        occupationId: 'sepak-bola',
        pointCharacteristics: ['EDU', 'STR'],
        choiceSkillIds: [['charm']],
        anySkillIds: ['drive-auto'],
      });
    });

    it('ignores pick changes before an occupation is chosen', () => {
      const before = initializeDetailsState();
      expect(reduce(before, DetailsAction.setAnySkills(['charm']))).toEqual(before);
    });
  });

  it('sets characteristics and Luck, including clearing them', () => {
    const state = reduce(
      initializeDetailsState(),
      DetailsAction.setCharacteristic('STR', 60),
      DetailsAction.setLuck(45),
      DetailsAction.setCharacteristic('STR', null),
    );
    expect(state.draft.characteristics.STR).toBeNull();
    expect(state.draft.luck).toBe(45);
  });

  describe('skills', () => {
    it('keeps raised skills only', () => {
      const raised = reduce(loaded(), DetailsAction.setSkillValue('charm', 40));
      expect(raised.draft.skills).toEqual([{ skillId: 'charm', value: 40 }]);

      const atBase = reduce(raised, DetailsAction.setSkillValue('charm', 15));
      expect(atBase.draft.skills).toEqual([]);

      const cleared = reduce(raised, DetailsAction.setSkillValue('charm', null));
      expect(cleared.draft.skills).toEqual([]);
    });

    it('uses derived bases (Dodge = DEX ÷ 2) when deciding a skill is at its base', () => {
      const state = reduce(loaded(), DetailsAction.setSkillValue('dodge', 30)); // DEX 60
      expect(state.draft.skills).toEqual([]);
    });
  });

  describe('saving', () => {
    it('does nothing while the draft has problems', () => {
      const before = initializeDetailsState();
      expect(reduce(before, DetailsAction.startSave())).toEqual(before);
    });

    it('saves an existing investigator under its id', () => {
      const { id: _, ...data } = investigator;
      const state = reduce(loaded(), DetailsAction.startSave());
      expect(state.command).toEqual(DetailsCommand.saveInvestigator({ ...data, id: 'abc' }));
    });

    it('saves a new investigator without an id', () => {
      const { id: _, ...data } = investigator;
      const fresh = { ...loaded(), id: undefined };
      const state = reduce(fresh, DetailsAction.startSave());
      expect(state.command).toEqual(DetailsCommand.saveInvestigator(data));
    });

    it('takes the saved id and flags the save until the next edit', () => {
      const saved = reduce(
        { ...loaded(), id: undefined },
        DetailsAction.finishSave({ ...investigator, id: 'new-id' }),
      );
      expect(saved.id).toBe('new-id');
      expect(saved.justSaved).toBe(true);
      expect(saved.command).toEqual(DetailsCommand.noop());

      expect(reduce(saved, DetailsAction.setName('Renamed')).justSaved).toBe(false);
    });

    it('clears the command when saving fails', () => {
      const state = reduce(loaded(), DetailsAction.startSave(), DetailsAction.failSave());
      expect(state.command).toEqual(DetailsCommand.noop());
    });
  });
});
