import styled from '@emotion/styled';
import { Flex, Typography } from 'antd';

export const ValueRow = styled(Flex)`
  padding: 4px 0;
`;

export const ValueRowLabel = styled(Flex)`
  flex: 1;
  min-width: 0;
`;

// Fixed width with equal-width digits, so the input doesn't shift as the values change.
// Wide enough for the longest case, "49 / 19".
export const RollValues = styled(Typography.Text)`
  flex-shrink: 0;
  min-width: 7ch;
  text-align: right;
  font-variant-numeric: tabular-nums;
`;
