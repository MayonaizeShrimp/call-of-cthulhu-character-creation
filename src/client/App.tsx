import type { FC } from 'react';
import { useRoutes } from 'react-router';
import { appRoutes } from './App.routes';
import { AppContent, AppLayout } from './App.styles';

export const App: FC = () => {
  const routes = useRoutes(appRoutes);

  return (
    <AppLayout>
      <AppContent>{routes}</AppContent>
    </AppLayout>
  );
};
