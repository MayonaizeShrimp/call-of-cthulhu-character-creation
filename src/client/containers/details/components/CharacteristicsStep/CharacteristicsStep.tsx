import { useDetailsDispatch, useDetailsState } from '@client/providers/DetailsStoreProvider';
import { extremeValue, hardValue } from '@core/rules';
import {
  CHARACTERISTIC_RANGE,
  CHARACTERISTICS,
  LUCK_RANGE,
  POINT_BUY_TOTAL,
  POINT_BUY_VALUES,
  ROLL_INSTRUCTIONS,
} from '@game-rules/index';
import { Flex, InputNumber, Tag, Typography } from 'antd';
import type { FC } from 'react';
import { RollValues, ValueRow, ValueRowLabel } from './CharacteristicsStep.styles';

type ValueInputProps = {
  label: string;
  hint: string;
  value: number | null;
  min: number;
  max: number;
  onChange: (value: number | null) => void;
};

// One characteristic: name and what to roll, the value, and its hard (½) / extreme (⅕) values.
const ValueInput: FC<ValueInputProps> = ({ label, hint, value, min, max, onChange }) => (
  <ValueRow align="center" gap="small">
    <ValueRowLabel vertical>
      <Typography.Text strong>{label}</Typography.Text>
      <Typography.Text type="secondary">{hint}</Typography.Text>
    </ValueRowLabel>
    <InputNumber
      aria-label={label}
      min={min}
      max={max}
      precision={0}
      value={value}
      onChange={(next) => onChange(next ?? null)}
    />
    <RollValues type="secondary">
      {value === null ? '– / –' : `${hardValue(value)} / ${extremeValue(value)}`}
    </RollValues>
  </ValueRow>
);

export const CharacteristicsStep: FC = () => {
  const characteristics = useDetailsState((state) => state.draft.characteristics);
  const luck = useDetailsState((state) => state.draft.luck);
  const dispatch = useDetailsDispatch();

  const total = CHARACTERISTICS.reduce(
    (sum, characteristic) => sum + (characteristics[characteristic] ?? 0),
    0,
  );

  return (
    <Flex vertical gap="small">
      <Typography.Text type="secondary">
        Roll as shown, or point-buy. Values {CHARACTERISTIC_RANGE.min}–{CHARACTERISTIC_RANGE.max}.
        The right column is hard / extreme.
      </Typography.Text>
      <Flex vertical gap="small">
        <Typography.Text type="secondary">
          Point-buy: give each characteristic one of these values.
        </Typography.Text>
        <Flex wrap gap="small" justify="space-between">
          {POINT_BUY_VALUES.map((value, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: values repeat; the list is fixed
            <Tag key={`point-buy-guide-${index}`} color={'cyan'} variant="outlined">
              {value}
            </Tag>
          ))}
        </Flex>
      </Flex>
      {CHARACTERISTICS.map((characteristic) => (
        <ValueInput
          key={characteristic}
          label={characteristic}
          hint={ROLL_INSTRUCTIONS[characteristic]}
          value={characteristics[characteristic]}
          {...CHARACTERISTIC_RANGE}
          onChange={(value) => dispatch.setCharacteristic(characteristic, value)}
        />
      ))}
      <Typography.Text type="secondary">
        Total: {total} (point-buy spends {POINT_BUY_TOTAL})
      </Typography.Text>
      <ValueInput
        label="Luck"
        hint={ROLL_INSTRUCTIONS.LUCK}
        value={luck}
        {...LUCK_RANGE}
        onChange={(value) => dispatch.setLuck(value)}
      />
    </Flex>
  );
};
