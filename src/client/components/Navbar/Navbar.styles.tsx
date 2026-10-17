import styled from '@emotion/styled';
import { Flex, theme } from 'antd';

const token = theme.getDesignToken();

export const StyledNavbar = styled(Flex)`
  flex-shrink: 0;
  padding: 16px;
  background-color: lightgray;
  box-shadow: ${token.boxShadowTertiary};
`;
