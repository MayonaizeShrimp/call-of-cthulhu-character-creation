import { useDetailsDispatch, useDetailsState } from '@client/providers/DetailsStoreProvider';
import { DetailsCommand, errorStep } from '@core/display/details';
import {
  draftSkillBase,
  extremeValue,
  findOccupation,
  hardValue,
  occupationSkillIds,
  validateDraft,
} from '@core/rules';
import { CHARACTERISTICS, SKILLS } from '@game-rules/index';
import { Alert, Button, Flex, Typography } from 'antd';
import { type FC, useMemo } from 'react';
import { investigatorErrorMessage } from '../../error-message';
import { SheetSection, SheetTable } from './SummaryStep.styles';

type SheetRow = { label: string; value: number | null };

// Value, hard (½) and extreme (⅕), laid out for copying into the VTT.
const Sheet: FC<{ title: string; rows: SheetRow[] }> = ({ title, rows }) => (
  <SheetSection vertical gap="small">
    <Typography.Text strong>{title}</Typography.Text>
    <SheetTable>
      <thead>
        <tr>
          <th scope="col">{title}</th>
          <th scope="col">Value</th>
          <th scope="col">½</th>
          <th scope="col">⅕</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ label, value }) => (
          <tr key={label}>
            <th scope="row">{label}</th>
            <td>{value ?? '–'}</td>
            <td>{value === null ? '–' : hardValue(value)}</td>
            <td>{value === null ? '–' : extremeValue(value)}</td>
          </tr>
        ))}
      </tbody>
    </SheetTable>
  </SheetSection>
);

export const SummaryStep: FC = () => {
  const draft = useDetailsState((state) => state.draft);
  const isSaving = useDetailsState(
    (state) => state.command.type === DetailsCommand.saveInvestigator.type,
  );
  const dispatch = useDetailsDispatch();
  const errors = useMemo(() => validateDraft(draft), [draft]);

  const occupation = draft.occupation ? findOccupation(draft.occupation.occupationId) : undefined;
  const occupationIds: string[] = draft.occupation ? occupationSkillIds(draft.occupation) : [];
  const raisedIds = draft.skills.map(({ skillId }) => skillId as string);

  // Every occupation skill plus anything else the player raised, in the usual order.
  const skillRows = SKILLS.filter(
    ({ id }) => occupationIds.includes(id) || raisedIds.includes(id),
  ).map((skill) => ({
    label: skill.name,
    value:
      draft.skills.find(({ skillId }) => skillId === skill.id)?.value ??
      draftSkillBase(draft, skill),
  }));

  return (
    <Flex vertical gap="middle">
      {errors.length > 0 && (
        <Alert
          type="error"
          showIcon
          message="Fix these before saving"
          description={
            <Flex vertical align="start">
              {errors.map((error) => {
                const text = investigatorErrorMessage(error);
                return (
                  <Button
                    key={text}
                    type="link"
                    size="small"
                    onClick={() => dispatch.goToStep(errorStep(error))}
                  >
                    {text}
                  </Button>
                );
              })}
            </Flex>
          }
        />
      )}

      <SheetSection vertical>
        <Typography.Text type="secondary">Name</Typography.Text>
        <Typography.Text strong>{draft.name || '–'}</Typography.Text>
        <Typography.Text type="secondary">Occupation</Typography.Text>
        <Typography.Text strong>{occupation?.name ?? '–'}</Typography.Text>
      </SheetSection>

      <Sheet
        title="Characteristics"
        rows={[
          ...CHARACTERISTICS.map((characteristic) => ({
            label: characteristic,
            value: draft.characteristics[characteristic],
          })),
          { label: 'Luck', value: draft.luck },
        ]}
      />

      <Sheet title="Skills" rows={skillRows} />

      <Button
        type="primary"
        block
        disabled={errors.length > 0}
        loading={isSaving}
        onClick={() => dispatch.startSave()}
      >
        Save
      </Button>
    </Flex>
  );
};
