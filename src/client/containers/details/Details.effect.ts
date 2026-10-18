import { useDatagateways } from '@client/providers/DatagatewaysProvider';
import { useDetailsDispatch, useDetailsState } from '@client/providers/DetailsStoreProvider';
import { DetailsCommand } from '@core/display/details';
import { App } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { match } from 'ts-pattern';

export const useDetailsEffects = () => {
  const command = useDetailsState((state) => state.command);
  const dispatch = useDetailsDispatch();
  const datagateways = useDatagateways();
  const navigate = useNavigate();
  const { message } = App.useApp();

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once per new command; navigate/message are read at that time
  useEffect(() => {
    match(command)
      .with({ type: DetailsCommand.loadInvestigator.type }, async ({ id }) => {
        datagateways
          .getInvestigator(id)
          .then((investigator) => dispatch.finishLoadInvestigator(investigator))
          .then(dispatch.resetCommand);
      })
      .with({ type: DetailsCommand.saveInvestigator.type }, async ({ investigator }) => {
        datagateways
          .upsertInvestigator(investigator)
          .then((saved) => {
            dispatch.finishSave(saved);
            // A new investigator now has an id, so give it its own URL.
            if (investigator.id === undefined) {
              navigate(`/investigators/${saved.id}`, { replace: true });
            }
          })
          .catch(() => {
            dispatch.failSave();
            message.error('Could not save the investigator. Please try again.');
          });
      })
      .with({ type: DetailsCommand.noop.type }, async () => {})
      .exhaustive();
  }, [command]);
};
