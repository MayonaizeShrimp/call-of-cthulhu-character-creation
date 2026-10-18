import { useDetailsDispatch, useDetailsState } from '@client/providers/DetailsStoreProvider';
import { Flex, Input, Typography } from 'antd';
import type { FC } from 'react';

export const BasicsStep: FC = () => {
  const name = useDetailsState((state) => state.draft.name);
  const dispatch = useDetailsDispatch();

  return (
    <Flex vertical gap="small">
      <Typography.Text strong>Name</Typography.Text>
      <Input
        aria-label="Investigator name"
        placeholder="e.g. Sari Wulandari"
        value={name}
        onChange={(event) => dispatch.setName(event.target.value)}
      />
    </Flex>
  );
};
