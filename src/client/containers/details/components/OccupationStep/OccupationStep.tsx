import { useDetailsDispatch, useDetailsState } from '@client/providers/DetailsStoreProvider';
import {
  draftOccupationSkillPoints,
  draftPersonalInterestPoints,
  findOccupation,
  findSkill,
} from '@core/rules';
import { OCCUPATIONS, SKILLS, type SkillId } from '@game-rules/index';
import { Checkbox, Flex, Segmented, Select, Tag, Typography } from 'antd';
import type { FC } from 'react';
import { OccupationSection } from './OccupationStep.styles';

const skillName = (skillId: SkillId) => findSkill(skillId)?.name ?? skillId;

export const OccupationStep: FC = () => {
  const draft = useDetailsState((state) => state.draft);
  const dispatch = useDetailsDispatch();
  const selected = draft.occupation;
  const occupation = selected ? findOccupation(selected.occupationId) : undefined;

  return (
    <Flex vertical gap="middle">
      <Flex vertical gap="small">
        <Typography.Text strong>Occupation</Typography.Text>
        <Select
          aria-label="Occupation"
          placeholder="Choose an occupation"
          value={selected?.occupationId}
          options={OCCUPATIONS.map(({ id, name }) => ({ value: id, label: name }))}
          onChange={(occupationId) => dispatch.selectOccupation(occupationId)}
        />
      </Flex>

      {selected && occupation && (
        <>
          <OccupationSection vertical gap="small">
            <Typography.Text strong>Skill points</Typography.Text>
            {occupation.skillPoints.map((term, termIndex) => (
              <Flex key={term.anyOf.join('-')} align="center" gap="small" wrap>
                {term.anyOf.length > 1 ? (
                  <Segmented
                    aria-label={`Formula term ${termIndex + 1}`}
                    options={[...term.anyOf]}
                    value={selected.pointCharacteristics[termIndex]}
                    onChange={(characteristic) =>
                      dispatch.setPointCharacteristic(termIndex, characteristic)
                    }
                  />
                ) : (
                  <Typography.Text>{term.anyOf[0]}</Typography.Text>
                )}
                <Typography.Text>× {term.multiplier}</Typography.Text>
              </Flex>
            ))}
            <Typography.Text type="secondary">
              Occupation: {draftOccupationSkillPoints(draft)} · Personal interest (INT × 2):{' '}
              {draftPersonalInterestPoints(draft)}
            </Typography.Text>
          </OccupationSection>

          <OccupationSection vertical gap="small">
            <Typography.Text strong>Occupation skills</Typography.Text>
            <Flex wrap gap="small">
              {occupation.skills.map((skillId) => (
                <Tag key={skillId}>{skillName(skillId)}</Tag>
              ))}
            </Flex>
          </OccupationSection>

          {occupation.skillChoices.map((choice, choiceIndex) => {
            const picks = selected.choiceSkillIds[choiceIndex] ?? [];
            const full = picks.length >= choice.count;
            return (
              <OccupationSection key={choice.options.join('-')} vertical gap="small">
                <Typography.Text strong>
                  Choose {choice.count} ({picks.length}/{choice.count})
                </Typography.Text>
                <Checkbox.Group
                  value={picks}
                  options={choice.options.map((skillId) => ({
                    value: skillId,
                    label: skillName(skillId),
                    disabled: full && !picks.includes(skillId),
                  }))}
                  onChange={(skillIds) => dispatch.setChoiceSkills(choiceIndex, skillIds)}
                />
              </OccupationSection>
            );
          })}

          {occupation.anySkills > 0 && (
            <OccupationSection vertical gap="small">
              <Typography.Text strong>
                Any {occupation.anySkills} other skill{occupation.anySkills > 1 ? 's' : ''} (
                {selected.anySkillIds.length}/{occupation.anySkills})
              </Typography.Text>
              <Select
                aria-label="Other occupation skills"
                mode="multiple"
                placeholder="Pick skills"
                maxCount={occupation.anySkills}
                value={selected.anySkillIds}
                options={SKILLS.filter(
                  ({ id }) =>
                    !occupation.skills.includes(id) && !selected.choiceSkillIds.flat().includes(id),
                ).map(({ id, name }) => ({ value: id, label: name }))}
                optionFilterProp="label"
                onChange={(skillIds) => dispatch.setAnySkills(skillIds)}
              />
            </OccupationSection>
          )}
        </>
      )}
    </Flex>
  );
};
