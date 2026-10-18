import styled from '@emotion/styled';
import { Flex, Typography, theme } from 'antd';

const token = theme.getDesignToken();

export const StyledNavbar = styled(Flex)`
  flex-shrink: 0;
  padding: 16px;
  background-color: lightgray;
  box-shadow: ${token.boxShadowTertiary};
`;

// antd titles carry a bottom margin that would misalign them with the buttons.
export const NavbarTitle = styled(Typography.Title)`
  && {
    margin: 0;
  }
`;
