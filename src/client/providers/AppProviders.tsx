import { App as AntContextProvider, ConfigProvider } from 'antd';
import type { FC, ReactNode } from 'react';
import { APP_THEME } from '../App.theme';
import { CharacterStoreProvider } from './CharacterStoreProvider';

type AppProviderProps = {
  children: ReactNode;
};

export const AppProviders: FC<AppProviderProps> = ({ children }) => {
  return (
    <ConfigProvider theme={APP_THEME}>
      <AntContextProvider>
        <CharacterStoreProvider>{children}</CharacterStoreProvider>
      </AntContextProvider>
    </ConfigProvider>
  );
};
