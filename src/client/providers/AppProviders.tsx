import { App as AntContextProvider, ConfigProvider } from 'antd';
import type { FC, ReactNode } from 'react';
import { APP_THEME } from '../App.theme';
import { CharacterStoreProvider } from './CharacterStoreProvider';
import { type Datagateways, DatagatewaysProvider } from './DatagatewaysProvider';

type AppProviderProps = {
  children: ReactNode;
  datagateways?: Datagateways;
};

export const AppProviders: FC<AppProviderProps> = ({ children, datagateways }) => {
  return (
    <ConfigProvider theme={APP_THEME}>
      <AntContextProvider>
        <DatagatewaysProvider datagateways={datagateways}>
          <CharacterStoreProvider>{children}</CharacterStoreProvider>
        </DatagatewaysProvider>
      </AntContextProvider>
    </ConfigProvider>
  );
};
