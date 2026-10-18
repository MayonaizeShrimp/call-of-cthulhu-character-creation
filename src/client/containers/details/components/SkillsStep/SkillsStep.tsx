import { useDetailsDispatch, useDetailsState } from '@client/providers/DetailsStoreProvider';
import {
  draftSkillBase,
  draftSkillPointsBudget,
  draftSkillPointsSpent,
  extremeValue,
  hardValue,
  occupationSkillIds,
} from '@core/rules';
import { type InvestigatorDraft, SKILL_MAX, SKILLS, type Skill } from '@game-rules/index';
import { Flex, Input, InputNumber, Typography } from 'antd';
import { type FC, useState } from 'react';
import { BudgetBar, RollValues, SkillName, SkillRow } from './SkillsStep.styles';

type SkillInputProps = {
  draft: InvestigatorDraft;
  skill: Skill;
  highlighted: boolean;
  onChange: (value: number | null) => void;
};

const SkillInput: FC<SkillInputProps> = ({ draft, skill, highlighted, onChange }) => {
  const base = draftSkillBase(draft, skill);
  const value = draft.skills.find(({ skillId }) => skillId === skill.id)?.value ?? base;

  return (
    <SkillRow align="center" gap="small" highlighted={highlighted}>
      <SkillName vertical>
        <Typography.Text strong={highlighted}>{skill.name}</Typography.Text>
        <Typography.Text type="secondary">base {base}</Typography.Text>
      </SkillName>
      <InputNumber
        aria-label={skill.name}
        min={base}
        max={SKILL_MAX}
        precision={0}
        value={value}
        onChange={(next) => onChange(next ?? null)}
      />
      <RollValues type="secondary">
        {hardValue(value)} / {extremeValue(value)}
      </RollValues>
    </SkillRow>
  );
};

export const SkillsStep: FC = () => {
  const draft = useDetailsState((state) => state.draft);
  const dispatch = useDetailsDispatch();
  const [search, setSearch] = useState('');

  const budget = draftSkillPointsBudget(draft);
  const left = budget - draftSkillPointsSpent(draft);
  const occupationIds: string[] = draft.occupation ? occupationSkillIds(draft.occupation) : [];

  const query = search.trim().toLowerCase();
  const visible = SKILLS.filter((skill) => skill.name.toLowerCase().includes(query));
  const occupationSkills = visible.filter((skill) => occupationIds.includes(skill.id));
  const otherSkills = visible.filter((skill) => !occupationIds.includes(skill.id));

  const renderSkill = (skill: (typeof SKILLS)[number], highlighted: boolean) => (
    <SkillInput
      key={skill.id}
      draft={draft}
      skill={skill}
      highlighted={highlighted}
      onChange={(value) => dispatch.setSkillValue(skill.id, value)}
    />
  );

  return (
    <Flex vertical gap="small">
      <BudgetBar justify="space-between" over={left < 0}>
        <Typography.Text strong>Points left</Typography.Text>
        <Typography.Text strong>
          {left} / {budget}
        </Typography.Text>
      </BudgetBar>
      <Input.Search
        aria-label="Search skills"
        placeholder="Search skills"
        allowClear
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {occupationSkills.length > 0 && (
        <>
          <Typography.Text strong>Occupation skills</Typography.Text>
          {occupationSkills.map((skill) => renderSkill(skill, true))}
        </>
      )}
      <Typography.Text strong>Other skills</Typography.Text>
      {otherSkills.map((skill) => renderSkill(skill, false))}
    </Flex>
  );
};
