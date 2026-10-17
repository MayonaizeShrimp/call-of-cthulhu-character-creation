import { Layout, Typography } from 'antd';
import { useRoutes } from 'react-router';
import { appRoutes } from './App.routes';

// The app is designed for mobile only; every page renders inside this column.
const APP_MAX_WIDTH = 360;

export function App() {
  const routes = useRoutes(appRoutes);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Content
        style={{ padding: 16, maxWidth: APP_MAX_WIDTH, width: '100%', margin: '0 auto' }}
      >
        <Typography.Title level={4}>Call of Cthulhu 7e — Character Creation</Typography.Title>
        {routes}
      </Layout.Content>
    </Layout>
  );
}
