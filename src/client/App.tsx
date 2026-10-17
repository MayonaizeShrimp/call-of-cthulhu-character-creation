import type { FC } from 'react';
import { useRoutes } from 'react-router';
import { APP_ROUTES } from './App.routes';
import { AppContent, AppLayout } from './App.styles';

export const App: FC = () => {
  const routes = useRoutes(APP_ROUTES);

  return (
    <AppLayout>
      <AppContent>{routes}</AppContent>
    </AppLayout>
  );
};
