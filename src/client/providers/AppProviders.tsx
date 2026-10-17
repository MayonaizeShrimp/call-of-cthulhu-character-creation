import { App as AntContextProvider, ConfigProvider } from 'antd';
import type { ReactNode } from 'react';
import { APP_THEME } from '../App.theme';
import { CharacterStoreProvider } from './CharacterStoreProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={APP_THEME}>
      <AntContextProvider>
        <CharacterStoreProvider>{children}</CharacterStoreProvider>
      </AntContextProvider>
    </ConfigProvider>
  );
}
