import styled from '@emotion/styled';
import { Layout } from 'antd';

const APP_MIN_WIDTH = 360;
const APP_MAX_WIDTH = 480;

export const AppLayout = styled(Layout)`
  height: 100vh;
  height: 100dvh;
`;

// Full-height column: each page renders a fixed Navbar and a scrollable Content inside it.
export const AppContent = styled(Layout.Content)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  min-width: ${APP_MIN_WIDTH}px;
  max-width: ${APP_MAX_WIDTH}px;
  margin: 0 auto;
  box-sizing: border-box;
`;
