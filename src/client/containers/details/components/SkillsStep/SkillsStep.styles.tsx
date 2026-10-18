import styled from '@emotion/styled';
import { Flex, Typography, theme } from 'antd';

const token = theme.getDesignToken();

// Keeps style-only props from being passed on to the DOM.
const withoutProp = (name: string) => ({
  shouldForwardProp: (prop: string) => prop !== name,
});

// Stays at the top of the scrolling content while the player scrolls through skills.
export const BudgetBar = styled(Flex, withoutProp('over'))<{ over: boolean }>`
  position: sticky;
  top: -16px;
  z-index: 1;
  padding: 8px 12px;
  border-radius: ${token.borderRadius}px;
  background-color: ${({ over }) => (over ? token.colorErrorBg : token.colorFillSecondary)};
`;

export const SkillRow = styled(Flex, withoutProp('highlighted'))<{ highlighted: boolean }>`
  padding: 4px 8px;
  border-radius: ${token.borderRadiusSM}px;
  background-color: ${({ highlighted }) => (highlighted ? token.colorFillTertiary : 'transparent')};
`;

export const SkillName = styled(Flex)`
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
