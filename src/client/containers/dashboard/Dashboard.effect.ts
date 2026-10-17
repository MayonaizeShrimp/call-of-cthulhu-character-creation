import { useDashboardDispatch, useDashboardState } from '@client/providers/DashboardStoreProvider';
import { useDatagateways } from '@client/providers/DatagatewaysProvider';
import { DashboardCommand } from '@core/display/dashboard';
import { useEffect } from 'react';
import { match } from 'ts-pattern';

export const useDashboardEffects = () => {
  const command = useDashboardState((state) => state.command);
  const dispatch = useDashboardDispatch();
  const datagateways = useDatagateways();

  useEffect(() => {
    match(command)
      .with({ type: DashboardCommand.getInvestigators.type }, async () => {
        datagateways
          .getInvestigators()
          .then((result) => dispatch.finishGetInvestigators(result))
          .then(dispatch.resetCommand);
      })
      .with({ type: DashboardCommand.noop.type }, async () => {})
      .exhaustive();
  }, [command]);
};
