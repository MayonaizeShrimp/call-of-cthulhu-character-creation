import type { RouteObject } from 'react-router';
import { Dashboard } from './containers/dashboard';
import { Details } from './containers/details';
import { NotFound } from './containers/not-found';

export const appRoutes: RouteObject[] = [
  { index: true, Component: Dashboard },
  { path: 'investigators/:id?', Component: Details },
  { path: '*', Component: NotFound },
];
