import { App as AntContextProvider, ConfigProvider } from 'antd';
import type { FC, ReactNode } from 'react';
import { APP_THEME } from '../App.theme';
import { type Datagateways, DatagatewaysProvider } from './DatagatewaysProvider';

type AppProviderProps = {
  children: ReactNode;
  datagateways?: Datagateways;
};

export const AppProviders: FC<AppProviderProps> = ({ children, datagateways }) => {
  return (
    <ConfigProvider theme={APP_THEME}>
      <AntContextProvider>
        <DatagatewaysProvider datagateways={datagateways}>{children}</DatagatewaysProvider>
      </AntContextProvider>
    </ConfigProvider>
  );
};
