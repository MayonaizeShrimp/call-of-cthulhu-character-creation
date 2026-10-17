import { App as AntContextProvider, ConfigProvider } from 'antd';
import type { ReactNode } from 'react';
import { CharacterStoreProvider } from './CharacterStoreProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider>
      <AntContextProvider>
        <CharacterStoreProvider>{children}</CharacterStoreProvider>
      </AntContextProvider>
    </ConfigProvider>
  );
}
