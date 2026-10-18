import styled from '@emotion/styled';
import { Flex, theme } from 'antd';

const token = theme.getDesignToken();

export const OccupationSection = styled(Flex)`
  padding-top: 12px;
  border-top: 1px solid ${token.colorBorderSecondary};
`;
