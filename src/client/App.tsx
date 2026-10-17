import { useRoutes } from 'react-router';
import { appRoutes } from './App.routes';
import { AppContent, AppLayout } from './App.styles';

export function App() {
  const routes = useRoutes(appRoutes);

  return (
    <AppLayout>
      <AppContent>{routes}</AppContent>
    </AppLayout>
  );
}
