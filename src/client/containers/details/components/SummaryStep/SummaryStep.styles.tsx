import styled from '@emotion/styled';
import { Flex, theme } from 'antd';

const token = theme.getDesignToken();

export const SheetSection = styled(Flex)`
  padding-top: 12px;
  border-top: 1px solid ${token.colorBorderSecondary};
`;

// A plain table so values can be read (and selected) row by row when copying into the VTT.
export const SheetTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;

  th,
  td {
    padding: 4px 8px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
    text-align: right;
  }

  th[scope='row'],
  thead th:first-of-type {
    text-align: left;
  }

  thead th {
    color: ${token.colorTextSecondary};
    font-weight: normal;
  }
`;
