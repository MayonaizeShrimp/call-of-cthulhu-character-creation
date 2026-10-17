import { InvestigatorDataGateway, type InvestigatorDataGatewayApi } from '@client/data-gateways';
import { createContext, type FC, type ReactNode, useContext, useState } from 'react';

// Everything effects may use to reach the outside world. Add more gateways by intersecting/spreading.
export type Datagateways = InvestigatorDataGatewayApi;

const DEFAULT_DATAGATEWAYS: Datagateways = { ...InvestigatorDataGateway };

const DatagatewaysContext = createContext<Datagateways | null>(null);

type DatagatewaysProviderProps = {
  children: ReactNode;
  /** Inject gateways (e.g. in-memory fakes in tests); localStorage-backed otherwise. */
  datagateways?: Datagateways;
};

export const DatagatewaysProvider: FC<DatagatewaysProviderProps> = ({ children, datagateways }) => {
  const [value] = useState(() => datagateways ?? DEFAULT_DATAGATEWAYS);
  return <DatagatewaysContext.Provider value={value}>{children}</DatagatewaysContext.Provider>;
};

export function useDatagateways(): Datagateways {
  const datagateways = useContext(DatagatewaysContext);
  if (!datagateways) {
    throw new Error('useDatagateways must be used inside <DatagatewaysProvider>');
  }
  return datagateways;
}
